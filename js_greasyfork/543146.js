// ==UserScript==
// @name         RYM Batch Follow (Typed) v0.8
// @namespace    https://example.com/
// @version      0.8
// @description  Batch follow artists on RYM (human-like, logging, skips low-confidence, rest pauses, security alerts, CAPTCHA resume)
// @match        https://rateyourmusic.com/*
// @match        https://rateyourmusic.com/search*
// @grant        none
// @author       Skeeb
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543146/RYM%20Batch%20Follow%20%28Typed%29%20v08.user.js
// @updateURL https://update.greasyfork.org/scripts/543146/RYM%20Batch%20Follow%20%28Typed%29%20v08.meta.js
// ==/UserScript==

(function(){
  'use strict';

  /********** CONFIG **********/
  const DELAY_BASE_MS = 2400;
  const DELAY_JITTER_MS = 1400;

  const RAND_DELAY_SEARCH_SUBMIT_RANGE      = [350, 950];
  const RAND_DELAY_AFTER_RESULT_CLICK_RANGE = [500, 1300];
  const RAND_DELAY_BEFORE_FOLLOW_RANGE      = [900, 2200];
  const RAND_DELAY_AFTER_FOLLOW_RANGE       = [1500, 3200];

  const BETWEEN_KEYSTROKE_DELAY_RANGE = [71,147];
  const TYPE_DELAY_RANGE = BETWEEN_KEYSTROKE_DELAY_RANGE; // (legacy alias)

  const WAIT_LOOP_SLEEP_RANGE = [120,240];

  const FOLLOW_OBSERVE_MAX_MS = 6000;
  const FOLLOW_POLL_INTERVAL_MS = 300;

  const PAGE_LOAD_TIMEOUT = 30000;
  const BACKOFF_MULTIPLIER = 1.4;
  const MAX_SEARCH_RETRIES = 2;

  const MATCH_MIN_SCORE = 0.45;
  const LOW_CONF_SKIP_ENABLED = true;
  const LOW_CONF_THRESHOLD = 1.0;
  const OPEN_LOW_CONF_PAGES = false;
  const FOLLOW_BUTTON_REGEX = /^follow$/i;

  const FORCE_ARTIST_ONLY_SEARCH = true;

  const SECURITY_ALERT_ENABLED = true;
  const SECURITY_ALERT_BEEP_INTERVAL_MS = 1800;
  const SECURITY_ALERT_BEEP_LENGTH_MS = 550;
  const SECURITY_ALERT_MAX_BEEPS = 10;

  const REST_SHORT_EVERY_MIN   = 7;
  const REST_SHORT_DURATION_MS = [4000, 15000];
  const REST_LONG_EVERY_MIN    = 45;
  const REST_LONG_DURATION_MS  = [45000, 120000];
  const REST_COUNTDOWN_STYLE = `
position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);
z-index:1000001;
background:#161616;border:2px solid #3a6aff;color:#e8e8e8;
padding:14px 18px;font:15px/1.35 Arial;border-radius:12px;
box-shadow:0 6px 22px rgba(0,0,0,.55);min-width:210px;text-align:center;
`;

  const STATE_KEY = 'rym_follow_state_v1';
  const DEBUG = true;

  /********** RUNTIME VARS **********/
  let abortFlag=false, running=false;
  let log = loadLog();
  let panel;

  /********** Persistence Helpers **********/
  function loadState(){ try{return JSON.parse(localStorage.getItem(STATE_KEY)||'null');}catch(e){return null;} }
  function saveState(s){ localStorage.setItem(STATE_KEY, JSON.stringify(s)); }
  function clearState(){ localStorage.removeItem(STATE_KEY); }

  // Attempt load
  let resumeState = loadState();

  /********** Early CAPTCHA page detection (before anything) **********/
  // (If user reloads *while* on captcha page; flags preserved if previously set.)
  if (SECURITY_ALERT_ENABLED && document.querySelector('#sec_verify')) {
    // We will set state inside triggerSecurityAlert (later) only if not already.
    // Delay calling until helpers are defined? We'll re-check after helper defs.
  }

  createPanel();

  /********** Utilities **********/
  function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
  function rand(a,b){ return Math.random()*(b-a)+a; }
  function randDelay(range){ return rand(range[0], range[1]); }
  function humanDelay(base=DELAY_BASE_MS){ return base + Math.random()*DELAY_JITTER_MS; }
  function loadLog(){ try{return JSON.parse(localStorage.getItem('rym_follow_log')||'[]');}catch(e){return[];} }
  function saveLog(){ localStorage.setItem('rym_follow_log', JSON.stringify(log)); }
  function logEntry(entry){ log.push(entry); saveLog(); updatePanelCounts(); }
  function normalizeName(s){ return s.toLowerCase().replace(/[\u2018\u2019’`]/g,"'").replace(/[^\w'\s]/g,'').replace(/\s+/g,' ').trim(); }
  function levenshtein(a,b){
    const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
    for(let i=0;i<=m;i++) dp[i][0]=i;
    for(let j=0;j<=n;j++) dp[0][j]=j;
    for(let i=1;i<=m;i++) for(let j=1;j<=n;j++){
      const c=a[i-1]===b[j-1]?0:1;
      dp[i][j]=Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+c);
    }
    return dp[m][n];
  }
  function bestMatch(target, list){
    const nt = normalizeName(target);
    let best=null;
    list.forEach(c=>{
      const nc=normalizeName(c.text);
      const dist=levenshtein(nt,nc);
      let score=1 - dist/(Math.max(nt.length,nc.length)||1);
      if(nc.startsWith(nt)||nt.startsWith(nc)) score+=0.15;
      if(nc===nt) score+=0.3;
      if(!best || score>best.score) best={candidate:c,score};
    });
    return best;
  }
  function debug(...a){ if(DEBUG) console.log('[RYM Batch]', ...a); }

  /********** UI Panel **********/
  function createPanel(){
    panel=document.createElement('div');
    panel.style.cssText='position:fixed;z-index:99999;top:70px;right:12px;background:#111;border:1px solid #444;padding:10px;font:12px/1.4 Arial;color:#eee;max-width:270px;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,.4)';
    panel.innerHTML=`
      <div style="font-weight:bold">RYM Batch Follow</div>
      <div class="rym-bf-status" style="margin:4px 0;">Idle</div>
      <div class="rym-bf-count" style="margin:4px 0;">Logged: ${log.length}</div>
      <button class="rym-bf-start" style="width:100%;margin:4px 0;">Run Batch Follow</button>
      <div style="display:flex;gap:4px;margin-bottom:4px;">
        <button class="rym-bf-dl-json" style="flex:1;">JSON</button>
        <button class="rym-bf-dl-csv" style="flex:1;">CSV</button>
      </div>
      <button class="rym-bf-reset" style="width:100%;margin:2px 0;background:#500;">Reset Log</button>
      <small>ESC abort. Persistent.</small>`;
    panel.querySelector('.rym-bf-start').onclick=openInputModal;
    panel.querySelector('.rym-bf-dl-json').onclick=downloadJSON;
    panel.querySelector('.rym-bf-dl-csv').onclick=downloadCSV;
    panel.querySelector('.rym-bf-reset').onclick=resetLog;
    document.body.appendChild(panel);
    document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ abortFlag=true; setStatus('Abort requested'); }});
  }
  function setStatus(m){ if(panel) panel.querySelector('.rym-bf-status').textContent=m; }
  function updatePanelCounts(){
    if(!panel) return;
    const done=log.filter(l=>l.status==='done').length;
    panel.querySelector('.rym-bf-count').textContent=`Logged: ${log.length} (completed: ${done})`;
  }
  function openInputModal(){
    if(running){ alert('Already running'); return; }
    const ov=document.createElement('div');
    ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:100000;display:flex;align-items:center;justify-content:center;';
    ov.innerHTML=`
      <div style="background:#222;padding:16px;max-width:420px;width:100%;border:1px solid #555;border-radius:8px;color:#eee;font:13px Arial;">
        <div style="font-weight:bold;margin-bottom:6px;">Enter Artist Names (one per line)</div>
        <textarea style="width:100%;height:200px;background:#111;color:#eee;border:1px solid #555;padding:6px;font:12px monospace;"></textarea>
        <div style="margin-top:8px;text-align:right;">
          <button class="bf-cancel" style="margin-right:8px;">Cancel</button>
          <button class="bf-go">Start</button>
        </div>
      </div>`;
    document.body.appendChild(ov);
    ov.querySelector('.bf-cancel').onclick=()=>ov.remove();
    ov.querySelector('.bf-go').onclick=()=>{
      const raw=ov.querySelector('textarea').value;
      ov.remove(); startBatch(raw);
    };
  }
  function resetLog(){
    if(!confirm('Reset the stored follow log AND session state? This cannot be undone.')) return;
    log=[]; saveLog(); clearState(); updatePanelCounts(); setStatus('Log reset');
  }

  /********** Alarm Helpers (existing addition kept) **********/
  function primeAlarm() {
    if (window.__RYM_ALARM_PRIMED) return;
    window.__RYM_ALARM_PRIMED = true;
    if (!document.getElementById('rymAlarm')) {
      const el = document.createElement('audio');
      el.id = 'rymAlarm';
      el.src = 'data:audio/wav;base64,UklGRoQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YcAAAACAgICAgICAgP7//vz8/Pj4+Pf39/7+/v///w==';
      el.loop = true;
      el.preload = 'auto';
      el.volume = 1;
      el.style.display = 'none';
      document.body.appendChild(el);
      el.play().then(()=>el.pause()).catch(()=>{});
    }
    try {
      if (!window.__RYM_AC) {
        window.__RYM_AC = new (window.AudioContext || window.webkitAudioContext)();
        if (window.__RYM_AC.state === 'suspended') {
          window.__RYM_AC.resume().catch(()=>{});
        }
      }
    } catch(e){}
  }

  function triggerAlarm() {
    const el = document.getElementById('rymAlarm');
    if (el) { try { el.currentTime = 0; el.play().catch(()=>{}); } catch(e){} }
    try {
      const ctx = window.__RYM_AC;
      if (ctx && ctx.state !== 'closed') {
        const duration = 0.4;
        for (let i=0;i<6;i++){
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
            osc.frequency.value = (i%2?880:660);
          osc.connect(gain); gain.connect(ctx.destination);
          const t = ctx.currentTime + i*0.5;
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.9, t+0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, t+duration);
          osc.start(t); osc.stop(t+duration+0.05);
        }
      }
    } catch(e){}
    if (document.visibilityState === 'hidden') {
      document.title = '⚠️ RYM CAPTCHA ⚠️';
    }
    if (navigator.vibrate) navigator.vibrate([300,120,300,120,300]);
    setTimeout(()=>{ try { alert('RYM Batch Follow: CAPTCHA encountered.'); } catch(e){} }, 1500);
  }

  /********** Batch Control **********/
  async function startBatch(raw){
    const queue = raw.split(/\n/).map(s=>s.trim()).filter(Boolean);
    if(!queue.length){ alert('No artists'); return; }
    abortFlag=false; running=true;
    primeAlarm(); // ensure audio unlocked
    saveState({
      queue,
      index:0,
      phase:'idle',
      done:false,
      captchaPending:false,
      currentArtistUnconfirmed:null
    });
    resumeState = loadState();
    setStatus(`Starting (${queue.length})`);
    await processLoop();
  }

  async function processLoop(){
    while(!abortFlag){
      const st=loadState(); if(!st || st.done) break;
      if(st.index >= st.queue.length){
        st.done=true; saveState(st); setStatus('Finished'); clearState(); running=false; return;
      }
      const artist=st.queue[st.index];
      setStatus(`(${st.index+1}/${st.queue.length}) ${artist}`);
      await performSearch(artist, st);
      return; // will navigate
    }
    running=false;
  }

  async function performSearch(artist, st){
    let input=document.querySelector('#ui_search_input_main_search');
    if(!input){
      window.location.href='https://rateyourmusic.com/';
      await waitFor(()=>document.querySelector('#ui_search_input_main_search'), PAGE_LOAD_TIMEOUT);
      input=document.querySelector('#ui_search_input_main_search');
    }
    const sel=document.querySelector('#ui_search_object_select_main_search');
    if(sel && sel.value!=='a'){
      sel.value='a'; sel.dispatchEvent(new Event('change',{bubbles:true}));
      await sleep(randDelay([150,300]));
    }
    input.value='';
    await simulateTyping(input, artist);
    await sleep(randDelay(RAND_DELAY_SEARCH_SUBMIT_RANGE));

    st.phase='search_submitted';
    st.currentArtistUnconfirmed = artist; // mark in-flight
    saveState(st);

    if(FORCE_ARTIST_ONLY_SEARCH){
      const q = encodeURIComponent(artist);
      window.location.href = `/search?searchterm=${q}&searchtype=a`;
    } else {
      const form=input.closest('form');
      form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
    }
  }

  /********** Resume: parse & open **********/
  async function autoResumeParseAndOpen(st){
    setStatus(`Parsing results: ${st.queue[st.index]}`);
    let results=null;
    const ok = await waitFor(()=>{
      results = parseSearchResults();
      return results && results.length;
    }, PAGE_LOAD_TIMEOUT);
    if(!ok){
      logEntry({timestamp:new Date().toISOString(), inputArtist:st.queue[st.index], status:'no_results'});
      st.index++; st.phase='idle'; st.currentArtistUnconfirmed=null; saveState(st);
      await scheduledRestIfNeeded(st.index-1, st.queue.length);
      await sleep(humanDelay()); processLoop(); return;
    }
    const artistName=st.queue[st.index];
    const normTarget = normalizeName(artistName);
    const sameNamedCount = results.reduce((acc,r)=> acc + (normalizeName(r.name)===normTarget?1:0),0);
    const matchInfo=bestMatch(artistName, results.map(r=>({text:r.name,el:r.el})));
    if(!matchInfo || matchInfo.score < MATCH_MIN_SCORE){
      logEntry({
        timestamp:new Date().toISOString(),
        inputArtist:artistName,
        status:'no_good_match',
        sameNamedCount,
        meta:{candidates:results.map(r=>r.name)}
      });
      st.index++; st.phase='idle'; st.currentArtistUnconfirmed=null; saveState(st);
      await scheduledRestIfNeeded(st.index-1, st.queue.length);
      await sleep(humanDelay()); processLoop(); return;
    }
    const chosen=results.find(r=>r.name===matchInfo.candidate.text);
    debug('Chosen', chosen.name, matchInfo.score);

    if(LOW_CONF_SKIP_ENABLED && !OPEN_LOW_CONF_PAGES && matchInfo.score < LOW_CONF_THRESHOLD){
      logEntry({
        timestamp:new Date().toISOString(),
        inputArtist:artistName,
        matchedArtist:chosen.name,
        matchScore:matchInfo.score.toFixed(3),
        sameNamedCount,
        pageURL:'(not opened)',
        genres:(chosen.rowGenres||[]).join('; '),
        country:'',
        born: chosen.rowBorn || '',
        aka:(chosen.rowAKA||[]).join('; '),
        followStatus:'skipped_low_confidence',
        status:'done',
        notes:`Skipped before opening (score ${matchInfo.score.toFixed(3)} < ${LOW_CONF_THRESHOLD})`,
        meta:{
          candidates:results.map(r=>r.name),
          sameNamedCount
        }
      });
      st.index++; st.phase='idle'; st.currentArtistUnconfirmed=null; saveState(st);
      await scheduledRestIfNeeded(st.index-1, st.queue.length);
      await sleep(humanDelay()); processLoop(); return;
    }

    st.currentMatch={
      matchedArtist:chosen.name,
      matchScore:matchInfo.score.toFixed(3),
      candidates:results.map(r=>r.name),
      sameNamedCount
    };

    await sleep(randDelay(RAND_DELAY_AFTER_RESULT_CLICK_RANGE));
    st.phase='artist_opening'; saveState(st);
    chosen.link.click();
  }

  /********** Resume: follow **********/
  async function autoResumeFollow(st){
    const artistName=st.queue[st.index];
    setStatus(`Following: ${artistName}`);
    const ok = await waitFor(()=>document.querySelector('.info_content a.btn[id^="follow_btn_artist_"]'), PAGE_LOAD_TIMEOUT);
    if(!ok){
      logEntry({
        timestamp:new Date().toISOString(),
        inputArtist:artistName,
        status:'artist_page_timeout',
        sameNamedCount: st.currentMatch?.sameNamedCount,
        meta: st.currentMatch
      });
      st.index++; st.phase='idle'; st.currentArtistUnconfirmed=null; saveState(st);
      await scheduledRestIfNeeded(st.index-1, st.queue.length);
      await sleep(humanDelay()); processLoop(); return;
    }
    await sleep(randDelay([500,900]));
    const metadata=extractArtistMetadata();
    const numericScore = parseFloat(st.currentMatch.matchScore);

    if(LOW_CONF_SKIP_ENABLED && numericScore < LOW_CONF_THRESHOLD){
      logEntry({
        timestamp:new Date().toISOString(),
        inputArtist:artistName,
        matchedArtist:st.currentMatch.matchedArtist,
        matchScore:st.currentMatch.matchScore,
        sameNamedCount: st.currentMatch.sameNamedCount,
        pageURL:window.location.href,
        genres:metadata.genres.join('; '),
        country:metadata.country||'',
        born:metadata.bornLocation||'',
        aka:metadata.aka.join('; '),
        followStatus:'skipped_low_confidence',
        status:'done',
        notes:`Skipped post-open (score ${numericScore} < ${LOW_CONF_THRESHOLD})`,
        meta:{
          description:metadata.description,
          candidates:st.currentMatch.candidates,
          bornLocation:metadata.bornLocation,
          currentLocation:metadata.currentLocation,
          followers:metadata.followers,
          artistId:metadata.artistId,
          coverArt:metadata.coverArt
        }
      });
      st.index++; st.phase='idle'; delete st.currentMatch;
      st.captchaPending=false; st.currentArtistUnconfirmed=null; // clear if resuming after captcha
      saveState(st);
      await scheduledRestIfNeeded(st.index-1, st.queue.length);
      await sleep(humanDelay()); processLoop(); return;
    }

    let followStatus='unknown', notes='';
    const btn=document.querySelector('.info_content a.btn[id^="follow_btn_artist_"]');
    if(btn){
      if(!FOLLOW_BUTTON_REGEX.test(btn.textContent.trim())){
        followStatus='already_following';
      } else {
        const result = await clickAndObserveFollow(btn);
        if(result.changed){
          followStatus='followed';
          notes = result.reason==='poll'?'Detected by poll':'Detected by mutation';
        } else {
          followStatus = FOLLOW_BUTTON_REGEX.test(btn.textContent.trim()) ? 'possibly_failed' : 'followed';
          if(followStatus==='possibly_failed') notes='Button unchanged after timeout';
        }
      }
    } else followStatus='no_button';

    logEntry({
      timestamp:new Date().toISOString(),
      inputArtist:artistName,
      matchedArtist:st.currentMatch.matchedArtist,
      matchScore:st.currentMatch.matchScore,
      sameNamedCount: st.currentMatch.sameNamedCount,
      pageURL:window.location.href,
      genres:metadata.genres.join('; '),
      country:metadata.country||'',
      born:metadata.bornLocation||'',
      aka:metadata.aka.join('; '),
      followStatus,
      status:'done',
      notes,
      meta:{
        description:metadata.description,
        candidates:st.currentMatch.candidates,
        bornLocation:metadata.bornLocation,
        currentLocation:metadata.currentLocation,
        followers:metadata.followers,
        artistId:metadata.artistId,
        coverArt:metadata.coverArt
      }
    });
    st.index++; st.phase='idle'; delete st.currentMatch;
    st.captchaPending=false; st.currentArtistUnconfirmed=null;
    saveState(st);
    await scheduledRestIfNeeded(st.index-1, st.queue.length);
    await sleep(humanDelay()); processLoop();
  }

  /********** Follow click observer **********/
  async function clickAndObserveFollow(btn){
    const followersBefore = getFollowersCountNearby();
    let resolved=false;
    return new Promise(async resolve=>{
      function success(reason){
        if(resolved) return; resolved=true; obs.disconnect(); resolve({changed:true,reason});
      }
      function stillFollowLabel(){ return FOLLOW_BUTTON_REGEX.test(btn.textContent.trim()); }
      const obs=new MutationObserver(()=>{
        const t=btn.textContent.trim(), cls=btn.className;
        const followersAfter=getFollowersCountNearby();
        if(!stillFollowLabel() || /following/i.test(t) || /blue_btn/.test(cls) ||
          (followersAfter!==null && followersBefore!==null && followersAfter>followersBefore)){
          success('mutation');
        }
      });
      obs.observe(btn,{childList:true,subtree:true,attributes:true,characterData:true});

      await sleep(randDelay(RAND_DELAY_BEFORE_FOLLOW_RANGE));
      btn.click();

      const start=performance.now();
      while(performance.now()-start < FOLLOW_OBSERVE_MAX_MS){
        const t=btn.textContent.trim(), cls=btn.className;
        const followersAfter=getFollowersCountNearby();
        if(!stillFollowLabel() || /following/i.test(t) || /blue_btn/.test(cls) ||
          (followersAfter!==null && followersBefore!==null && followersAfter>followersBefore)){
          success('poll'); break;
        }
        await sleep(FOLLOW_POLL_INTERVAL_MS);
      }
      if(!resolved){
        obs.disconnect();
        resolve({changed:false});
      }
      await sleep(randDelay(RAND_DELAY_AFTER_FOLLOW_RANGE));
    });
  }

  function getFollowersCountNearby(){
    const span=document.querySelector('.info_content .label_num_followers, .label_num_followers');
    if(!span) return null;
    const num=span.textContent.replace(/[, ]+followers?/i,'').trim();
    const parsed=parseInt(num.replace(/[^\d]/g,'')||'',10);
    return isNaN(parsed)?null:parsed;
  }

  /********** Search results parsing **********/
  function parseSearchResults(){
    const list=[];
    document.querySelectorAll('table tr.infobox').forEach(tr=>{
      const link=tr.querySelector('a.searchpage.artist');
      if(!link) return;
      const sub = tr.querySelector('.subinfo') || tr.querySelector('span.subinfo');
      let genres=[], aka=[], born='';
      if(sub){
        genres=[...sub.querySelectorAll('a[href^="/genre/"]')].map(a=>a.textContent.trim());
        const akaMatch=sub.innerText.match(/a\.k\.a:\s*(.+)/i);
        if(akaMatch) aka=akaMatch[1].split(/,\s*/).map(s=>s.trim()).filter(Boolean);
        const bornMatch=sub.innerText.match(/\b(Born|Formed)\b[^\n]*/i);
        if(bornMatch) born=bornMatch[0].trim();
      }
      list.push({
        name: link.textContent.trim(),
        link, el: tr,
        rowGenres: genres,
        rowAKA: aka,
        rowBorn: born
      });
    });
    return list;
  }

  /********** Artist metadata extraction **********/
  function extractArtistMetadata(){
    const info={
      artistId:null,
      artistDisplayName:'',
      bornLocation:'',
      currentLocation:'',
      aka:[],
      genres:[],
      followers:'',
      coverArt:'',
      description:'',
      country:''
    };
    const nameHdr=document.querySelector('.artist_name_hdr');
    if(nameHdr) info.artistDisplayName=nameHdr.textContent.trim();
    const idInput=document.querySelector('.section_artist_name input[aria-label="shortcut"]');
    if(idInput && /\[Artist(\d+)]/.test(idInput.value)){ info.artistId=RegExp.$1; }

    const container=document.querySelector('.artist_info_main');
    if(container){
      [...container.querySelectorAll('.info_hdr')].forEach(h=>{
        const label=h.textContent.trim().toLowerCase();
        const content=h.nextElementSibling && h.nextElementSibling.classList.contains('info_content')
          ? h.nextElementSibling : null;
        if(!content) return;
        if(label==='born'){
          info.bornLocation=content.textContent.trim();
          info.country=extractCountry(info.bornLocation);
        } else if(label==='currently'){
          info.currentLocation=content.textContent.trim();
        } else if(label==='also known as'){
          info.aka=content.textContent.split(/,\s*/).map(s=>s.trim()).filter(Boolean);
        } else if(label==='genres'){
          info.genres=[...content.querySelectorAll('a.genre, a[href^="/genre/"]')].map(a=>a.textContent.trim()).filter(Boolean);
        }
      });
    }
    const followersSpan=document.querySelector('.info_content .label_num_followers, .label_num_followers');
    if(followersSpan) info.followers=followersSpan.textContent.trim().replace(/\s+followers?/i,'');
    if(!info.artistId){
      const btn=document.querySelector('[id^="follow_btn_artist_"]');
      if(btn){
        const m=btn.id.match(/follow_btn_artist_(\d+)/);
        if(m) info.artistId=m[1];
      }
    }
    const cover=document.querySelector('.section_artist_info img');
    if(cover) info.coverArt=cover.getAttribute('src')||cover.getAttribute('data-src')||'';
    const desc=[...document.querySelectorAll('div')].find(n=> n.innerText && n.innerText.length>40 && /singer|producer|band|rapper|musician|composer|DJ|electronic/i.test(n.innerText) && n.innerText.length<600);
    if(desc) info.description=desc.innerText.trim();
    return info;
  }

  function extractCountry(loc){
    if(!loc) return '';
    const parts=loc.split(/,\s*/);
    if(parts.length){
      const last=parts[parts.length-1];
      if(/\b(United Kingdom|United States|Canada|France|Germany|Spain|Italy|Australia|Honduras|Mexico|Brazil|Japan|China|Russia|Ireland|Sweden|Norway|Finland|Denmark|Netherlands|Belgium|Portugal|Austria|Switzerland|Poland|Argentina|Chile|Colombia|Peru|Iceland|New Zealand)\b/i.test(last)){
        return last;
      }
    }
    return '';
  }

  /********** Typing Simulation **********/
  function simulateTyping(input,text){
    return new Promise(res=>{
      input.focus(); input.value=''; let i=0, chars=[...text];
      const typeNext=()=>{
        if(abortFlag){ res(); return; }
        if(i>=chars.length){
          input.dispatchEvent(new Event('input',{bubbles:true}));
          res(); return;
        }
        input.value+=chars[i++]; input.dispatchEvent(new Event('input',{bubbles:true}));
        setTimeout(typeNext, randDelay(BETWEEN_KEYSTROKE_DELAY_RANGE));
      };
      typeNext();
    });
  }

  /********** Wait Helper **********/
  async function waitFor(condFn, timeout){
    const start=performance.now();
    while(performance.now()-start < timeout){
      if(abortFlag) return false;
      try{ if(condFn()) return true; }catch(e){}
      await sleep(randDelay(WAIT_LOOP_SLEEP_RANGE));
    }
    return false;
  }

  /********** Scheduled Rest Logic **********/
  async function scheduledRestIfNeeded(currentIndex, total){
    const oneBased = currentIndex + 1;
    const longDue  = REST_LONG_EVERY_MIN  > 0 && oneBased % REST_LONG_EVERY_MIN  === 0;
    const shortDue = REST_SHORT_EVERY_MIN > 0 && oneBased % REST_SHORT_EVERY_MIN === 0 && !longDue;
    if(!longDue && !shortDue) return;

    const range = longDue ? REST_LONG_DURATION_MS : REST_SHORT_DURATION_MS;
    const restMs = Math.round(rand(range[0], range[1]));
    showRestCountdown(restMs, longDue ? 'Long rest' : 'Short rest', oneBased, total);
    const start = performance.now();
    while(performance.now() - start < restMs){
      if(abortFlag) break;
      updateRestCountdown(restMs - (performance.now()-start));
      await sleep(250);
    }
    hideRestCountdown();
  }

  let __restBox=null;
  function showRestCountdown(ms,label,idx,total){
    hideRestCountdown();
    __restBox=document.createElement('div');
    __restBox.id='rym_rest_countdown';
    __restBox.style.cssText=REST_COUNTDOWN_STYLE;
    __restBox.innerHTML=`
      <div style="font-weight:bold;margin-bottom:4px;">${label}</div>
      <div style="font-size:28px;font-weight:600;" class="time">…</div>
      <div style="font-size:11px;margin-top:4px;">Artist ${idx}/${total}</div>
      <div style="margin-top:6px;">
        <button style="background:#444;color:#fff;border:0;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:12px;" id="skipRestBtn">Skip</button>
      </div>`;
    document.body.appendChild(__restBox);
    document.getElementById('skipRestBtn').onclick=()=>{ hideRestCountdown(); };
    updateRestCountdown(ms);
  }
  function updateRestCountdown(remainingMs){
    if(!__restBox) return;
    const s=Math.max(0, Math.ceil(remainingMs/1000));
    const el=__restBox.querySelector('.time');
    if(el) el.textContent=s+'s';
  }
  function hideRestCountdown(){ if(__restBox){ __restBox.remove(); __restBox=null; } }

  /********** Security Alert (CAPTCHA) **********/
  function triggerSecurityAlert(){
    if(window.__RYM_SEC_ACTIVE) return;
    window.__RYM_SEC_ACTIVE=true;
    abortFlag=true;

    // Persist current artist into state (if mid-run)
    let st = loadState();
    if(st){
      if(st.queue && st.index < st.queue.length){
        st.captchaPending = true;
        if(!st.currentArtistUnconfirmed){
          st.currentArtistUnconfirmed = st.queue[st.index];
        }
      }
      saveState(st);
    }

    setStatus('SECURITY: Solve CAPTCHA');
    logEntry({
      timestamp:new Date().toISOString(),
      inputArtist:'(security_check)',
      status:'security_check'
    });
    try { autoExportLogs(); } catch(e){}

    const modal=document.createElement('div');
    modal.style.cssText='position:fixed;inset:0;z-index:1000000;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;font:16px Arial;color:#fff;';
    modal.innerHTML=`
      <div style="background:#1d1d1d;padding:24px 28px;border:2px solid #ff5555;border-radius:10px;max-width:480px;">
        <h2 style="margin-top:0;color:#ff7777;font-size:20px;">Security Check Detected</h2>
        <p style="line-height:1.4;margin:8px 0 14px;">CAPTCHA present. Solve it manually. Batch paused. It will auto-resume afterwards.</p>
        <p style="margin:0 0 14px;font-size:13px;color:#ccc">Logs exported (JSON & CSV).</p>
        <button id="rym-sec-dismiss" style="background:#ff5555;color:#fff;border:none;padding:8px 14px;font-size:14px;cursor:pointer;border-radius:4px;">Stop Sound & Close</button>
      </div>`;
    document.body.appendChild(modal);
    document.getElementById('rym-sec-dismiss').onclick=()=>{
      stopBeeping(); modal.remove();
    };

    // Replace legacy beep system with unified alarm
    stopBeeping();
    triggerAlarm();
    startBeeping(); // retain existing periodic beeps as secondary
  }

  // Legacy beep system (kept as fallback)
  let __rymBeepTimer=null, __rymBeepCount=0;
  function startBeeping(){
    if(!SECURITY_ALERT_ENABLED) return;
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      const ctx=new AudioCtx();
      function oneBeep(){
        if(__rymBeepCount>=SECURITY_ALERT_MAX_BEEPS) return;
        __rymBeepCount++;
        const osc=ctx.createOscillator();
        const gain=ctx.createGain();
        osc.type='sawtooth';
        osc.frequency.value=880;
        gain.gain.setValueAtTime(0.0005,ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.5,ctx.currentTime+0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+SECURITY_ALERT_BEEP_LENGTH_MS/1000);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime+SECURITY_ALERT_BEEP_LENGTH_MS/1000+0.05);
        if(__rymBeepCount<SECURITY_ALERT_MAX_BEEPS && window.__RYM_SEC_ACTIVE){
          __rymBeepTimer=setTimeout(oneBeep, SECURITY_ALERT_BEEP_INTERVAL_MS);
        }
      }
      oneBeep();
    }catch(e){ console.warn('Beep failed',e); }
  }
  function stopBeeping(){
    window.__RYM_SEC_ACTIVE=false;
    if(__rymBeepTimer) clearTimeout(__rymBeepTimer);
  }

  /********** CAPTCHA Resume Logic **********/
  function tryCaptchaResume(){
    const st = loadState();
    if(!st || !st.captchaPending) return false;

    // If on blank search page after solving captcha, re-run the search query
    if(location.pathname.startsWith('/search')){
      const searchParam = new URLSearchParams(location.search).get('searchterm');
      const input=document.querySelector('#ui_search_input_main_search');
      if(st.currentArtistUnconfirmed && (!searchParam || !searchParam.trim())){
        if(input){
          debug('Captcha resume: re-typing search for', st.currentArtistUnconfirmed);
          simulateTyping(input, st.currentArtistUnconfirmed).then(()=>{
            // Force artist-only search
            if(FORCE_ARTIST_ONLY_SEARCH){
              const q=encodeURIComponent(st.currentArtistUnconfirmed);
              window.location.href=`/search?searchterm=${q}&searchtype=a`;
            } else {
              const form=input.closest('form');
              form && form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
            }
          });
          return true;
        }
      }
    }
    // If already at homepage, just let processLoop() restart if user clicks start again,
    // or we will resume at phase when navigation continues.
    return false;
  }

  /********** Auto invocation after load **********/
  (function postLoadInit(){
    // Inject state defaults if older version
    if(resumeState && typeof resumeState.captchaPending === 'undefined'){
      resumeState.captchaPending=false;
      resumeState.currentArtistUnconfirmed=null;
      saveState(resumeState);
    }

    // If we are *currently* on the CAPTCHA page
    if(SECURITY_ALERT_ENABLED && document.querySelector('#sec_verify')){
      triggerSecurityAlert();
      return;
    }

    // Resume normal phases (unless captcha resume is actively re-submitting search)
    if(resumeState && !resumeState.done){
      if(resumeState.captchaPending){
        if(tryCaptchaResume()){
          return; // waiting for navigation
        }
      }
      debug("Resuming phase:", resumeState.phase);
      switch(resumeState.phase){
        case 'search_submitted': autoResumeParseAndOpen(resumeState); break;
        case 'artist_opening' : autoResumeFollow(resumeState); break;
      }
    }
  })();

  /********** Auto Export (unchanged) **********/
  function autoExportLogs(){
    try{
      const jsonBlob=new Blob([JSON.stringify(log,null,2)],{type:'application/json'});
      const a1=document.createElement('a');
      a1.href=URL.createObjectURL(jsonBlob);
      a1.download='rym_follow_log_auto.json';
      document.body.appendChild(a1); a1.click(); a1.remove();
    }catch(e){}
    try{
      const headers=[
        'timestamp','inputArtist','matchedArtist','matchScore','sameNamedCount','pageURL','genres',
        'country','born','aka','followStatus','notes',
        'artistId','artistDisplayName','bornLocation','currentLocation','followers','coverArt','description'
      ];
      const rows=log.map(l=>{
        const meta=l.meta||{};
        const rowObj=Object.assign({},l,{
          artistId:meta.artistId||'',
          artistDisplayName:meta.artistDisplayName||l.matchedArtist||'',
          bornLocation:meta.bornLocation||'',
          currentLocation:meta.currentLocation||'',
          followers:meta.followers||'',
          coverArt:meta.coverArt||'',
          description:meta.description||''
        });
        return headers.map(h=>`"${String(rowObj[h]!==undefined?rowObj[h]:'').replace(/"/g,'""')}"`).join(',');
      });
      const csvBlob=new Blob([headers.join(',')+'\n'+rows.join('\n')],{type:'text/csv'});
      const a2=document.createElement('a');
      a2.href=URL.createObjectURL(csvBlob);
      a2.download='rym_follow_log_auto.csv';
      document.body.appendChild(a2); a2.click(); a2.remove();
    }catch(e){}
  }

  /********** Export Buttons **********/
  function downloadJSON(){
    const blob=new Blob([JSON.stringify(log,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download='rym_follow_log.json'; a.click();
  }
  function downloadCSV(){
    const headers=[
      'timestamp','inputArtist','matchedArtist','matchScore','sameNamedCount','pageURL','genres',
      'country','born','aka','followStatus','notes',
      'artistId','artistDisplayName','bornLocation','currentLocation','followers','coverArt','description'
    ];
    const rows=log.map(l=>{
      const meta=l.meta||({});
      const rowObj=Object.assign({}, l, {
        artistId: meta.artistId || '',
        artistDisplayName: meta.artistDisplayName || l.matchedArtist || '',
        bornLocation: meta.bornLocation || '',
        currentLocation: meta.currentLocation || '',
        followers: meta.followers || '',
        coverArt: meta.coverArt || '',
        description: meta.description || ''
      });
      return headers.map(h=>`"${String(rowObj[h]!==undefined?rowObj[h]:'').replace(/"/g,'""')}"`).join(',');
    });
    const blob=new Blob([headers.join(',')+'\n'+rows.join('\n')],{type:'text/csv'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download='rym_follow_log.csv'; a.click();
  }

  if(DEBUG) window.__RYM_FOLLOW_LOG = log;

})();