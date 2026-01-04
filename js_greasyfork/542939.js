// ==UserScript==
// @name         Send to Kodi (IMDb/Trakt) – Full‑Screen Remote + Voice Search
// @namespace    https://example.com/
// @version      1.11
// @description  Adds a “Send to Kodi” button, settings gear, full‑screen remote, AND a voice‑search button to speak a movie title, look it up on TMDb, and send it to Kodi via Elementum (or other plugin).  
// @match        https://www.imdb.com/title/*
// @match        https://m.imdb.com/title/*
// @match        https://trakt.tv/movies/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542939/Send%20to%20Kodi%20%28IMDbTrakt%29%20%E2%80%93%20Full%E2%80%91Screen%20Remote%20%2B%20Voice%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/542939/Send%20to%20Kodi%20%28IMDbTrakt%29%20%E2%80%93%20Full%E2%80%91Screen%20Remote%20%2B%20Voice%20Search.meta.js
// ==/UserScript==

;(function(){
  'use strict';
  console.log('⚙️ Send‑to‑Kodi + Voice script loaded on', location.href);

  // ─── CONFIG ────────────────────────────────────────────────────────────
  const TMDB_KEY = 'f090bb54758cabf231fb605d3e3e0468';

  // ─── UTILITIES ─────────────────────────────────────────────────────────
  function createInput(val, type='text') {
    const i = document.createElement('input');
    i.type = type; i.value = val;
    Object.assign(i.style, {
      width:'100%', padding:'8px', margin:'4px 0',
      fontSize:'16px', borderRadius:'4px',
      border:'1px solid #ccc', boxSizing:'border-box'
    });
    return i;
  }
  function createSelect(opts, sel) {
    const s = document.createElement('select');
    Object.assign(s.style, {
      width:'100%', padding:'8px', margin:'4px 0',
      fontSize:'16px', borderRadius:'4px',
      border:'1px solid #ccc', boxSizing:'border-box'
    });
    opts.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o; opt.textContent = o;
      s.appendChild(opt);
    });
    s.value = sel;
    return s;
  }
  function createLabel(txt) {
    const l = document.createElement('label');
    l.textContent = txt;
    Object.assign(l.style, {fontWeight:'bold', marginTop:'8px', display:'block'});
    return l;
  }

  // ─── PLUGIN TEMPLATES ──────────────────────────────────────────────────
  const PLUGINS = {
    'Fen Light': {
      'Source Select': `plugin://plugin.video.fenlight/?mode=playback.media&media_type=movie` +
                       `&query={name}&year={year}&poster={poster}&title={name}` +
                       `&tmdb_id={id}&imdb_id={imdb}&autoplay=false`,
      'Auto Play':     `plugin://plugin.video.fenlight/?mode=playback.media&media_type=movie` +
                       `&query={name}&year={year}&poster={poster}&title={name}` +
                       `&tmdb_id={id}&imdb_id={imdb}&autoplay=true`
    },
    'POV': {
      'Source Select': `plugin://plugin.video.pov/?mode=play_media&media_type=movie` +
                       `&query={name}&year={year}&poster={poster}&title={name}` +
                       `&tmdb_id={id}&imdb_id={imdb}&autoplay=false`,
      'Auto Play':     `plugin://plugin.video.pov/?mode=play_media&media_type=movie` +
                       `&query={name}&year={year}&poster={poster}&title={name}` +
                       `&tmdb_id={id}&imdb_id={imdb}&autoplay=true`
    },
    'Umbrella': {
      'Source Select': `plugin://plugin.video.umbrella/?action=play&title={name}&year={year}` +
                       `&imdb={imdb}&tmdb={id}&select=0`,
      'Auto Play':     `plugin://plugin.video.umbrella/?action=play&title={name}&year={year}` +
                       `&imdb={imdb}&tmdb={id}&select=1`
    },
    'Elementum': {
      'Play':          `plugin://plugin.video.elementum/library/play/movie/{id}`
    }
  };

  // ─── CORE: send JSON‑RPC to Kodi ────────────────────────────────────────
  function kodiRequest(payload) {
    const ip   = GM_getValue('kodi_ip'),
          port = GM_getValue('kodi_port'),
          user = GM_getValue('kodi_user'),
          pass = GM_getValue('kodi_pass');
    GM_xmlhttpRequest({
      method: 'POST',
      url:    `http://${ip}:${port}/jsonrpc`,
      headers: {
        'Content-Type':'application/json',
        ...(user && { 'Authorization':'Basic ' + btoa(user+':'+pass) })
      },
      data: JSON.stringify(payload)
    });
  }
  function sendToKodi(url) {
    kodiRequest({
      jsonrpc:'2.0', id:1, method:'Player.Open',
      params:{ item:{ file:url } }
    });
  }
  function sendInput(cmd, dismiss=false) {
    kodiRequest({jsonrpc:'2.0', id:1, method:`Input.${cmd}`});
    if (dismiss) {
      const ov = document.getElementById('tm-remote-overlay');
      if (ov) ov.remove();
    }
  }

  // ─── BUILD THE PLUGIN URL ───────────────────────────────────────────────
  function buildPluginUrl(data) {
    const plugin = GM_getValue('plugin','Fen Light');
    if (plugin === 'Elementum') {
      return PLUGINS.Elementum.Play
        .replace(/{id}/g,   encodeURIComponent(data.tmdbId));
    }
    const mode = GM_getValue('mode','Source Select');
    let tpl = PLUGINS[plugin]?.[mode]
           || PLUGINS[plugin]?.['Auto Play']
           || PLUGINS['Fen Light']['Source Select'];
    return tpl
      .replace(/{name}/g,   encodeURIComponent(data.name))
      .replace(/{year}/g,   encodeURIComponent(data.year))
      .replace(/{poster}/g, encodeURIComponent(data.poster))
      .replace(/{id}/g,     encodeURIComponent(data.tmdbId))
      .replace(/{imdb}/g,   encodeURIComponent(data.imdbId));
  }

  // ─── METADATA & SEND ───────────────────────────────────────────────────
  async function onSend() {
    const plugin = GM_getValue('plugin','Fen Light');
    const mode   = GM_getValue('mode','Source Select');

    let data = { name:'', year:'', poster:'', imdbId:'', tmdbId:'' };
    if (location.hostname.includes('imdb.com')) {
      data.imdbId = document.querySelector('meta[property="imdb:pageConst"]')?.content
                 || location.pathname.split('/')[2];
      const m = document.title.match(/^(.+?)\s*\((\d{4})\)/);
      data.name   = m?m[1].trim():document.title;
      data.year   = m?m[2]:'';
      data.poster = document.querySelector('meta[property="og:image"]')?.content||'';
      const resp = await fetch(
        `https://api.themoviedb.org/3/find/${data.imdbId}` +
        `?api_key=${encodeURIComponent(TMDB_KEY)}&external_source=imdb_id`
      );
      const json = await resp.json();
      data.tmdbId = json.movie_results?.[0]?.id;
    }
    else if (location.hostname==='trakt.tv') {
      const a = document.getElementById('external-link-tmdb');
      const parts = a.href.split('/');
      data.tmdbId = parts.pop()||parts.pop();
      const m = document.title.match(/^(.+?)\s*\((\d{4})\)/);
      data.name   = m?m[1].trim():document.title;
      data.year   = m?m[2]:'';
      data.poster = document.querySelector('meta[property="og:image"]')?.content||'';
    }

    const url = buildPluginUrl(data);
    sendToKodi(url);

    // Show the remote overlay if needed
    if (plugin === 'Elementum' || mode === 'Source Select') {
      showRemoteOverlay();
    } else {
      alert('➡️ Sent to Kodi!');
    }
  }

  // ─── VOICE‑TO‑KODI: record speech & send first TMDb match ──────────────
  async function onRecord() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('⚠️ Your browser doesn’t support Speech Recognition.');
      return;
    }

    const recog = new SpeechRec();
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onstart = () => console.log('🎤 Listening…');
    recog.onerror = (e) => alert('Speech error: ' + e.error);
    recog.onresult = async (evt) => {
      const spoken = evt.results[0][0].transcript;
      console.log('🗣️ Heard:', spoken);
      try {
        const resp = await fetch(
          `https://api.themoviedb.org/3/search/movie?` +
          `api_key=${encodeURIComponent(TMDB_KEY)}` +
          `&query=${encodeURIComponent(spoken)}`
        );
        const js = await resp.json();
        if (js.results && js.results.length) {
          const m = js.results[0];
          const url = `plugin://plugin.video.elementum/library/play/movie/${m.id}`;
          sendToKodi(url);
          alert(`✅ Sent “${m.title}” (TMDb ID ${m.id}) to Kodi`);
        } else {
          alert(`❌ No TMDb results for “${spoken}”`);
        }
      } catch (err) {
        console.error(err);
        alert('⚠️ TMDb lookup failed');
      }
    };
    recog.start();
  }

  // ─── SETTINGS MODAL ────────────────────────────────────────────────────
  function openSettingsModal() {
    if (document.getElementById('tm-settings-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'tm-settings-overlay';
    Object.assign(overlay.style, {
      position:'fixed', top:0, left:0, right:0, bottom:0,
      background:'rgba(0,0,0,0.8)', color:'#fff',
      padding:'16px', overflowY:'auto', zIndex:2147483647
    });

    const close = document.createElement('button');
    close.textContent = '✕';
    Object.assign(close.style, {
      position:'absolute', top:'12px', right:'12px',
      fontSize:'24px', background:'none',
      border:'none', color:'#fff', cursor:'pointer'
    });
    close.onclick = () => overlay.remove();

    const container = document.createElement('div');
    Object.assign(container.style, {
      background:'#222', padding:'16px', borderRadius:'8px'
    });

    // Plugin dropdown
    container.appendChild(createLabel('Plugin'));
    const pluginSel = createSelect(Object.keys(PLUGINS), GM_getValue('plugin','Fen Light'));
    container.appendChild(pluginSel);

    // Mode dropdown
    container.appendChild(createLabel('Mode'));
    const modeSel = createSelect([], '');
    container.appendChild(modeSel);
    function updateModeOptions(){
      const opts = Object.keys(PLUGINS[pluginSel.value]);
      modeSel.innerHTML = '';
      opts.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o; opt.textContent = o;
        modeSel.appendChild(opt);
      });
      const saved = GM_getValue('mode', opts[0]);
      modeSel.value = opts.includes(saved)? saved : opts[0];
    }
    pluginSel.onchange = updateModeOptions;
    updateModeOptions();

    // Kodi settings
    container.appendChild(createLabel('Kodi IP'));
    container.appendChild(createInput(GM_getValue('kodi_ip','')));
    container.appendChild(createLabel('Kodi Port'));
    container.appendChild(createInput(GM_getValue('kodi_port','8080')));
    container.appendChild(createLabel('Kodi Username'));
    container.appendChild(createInput(GM_getValue('kodi_user','')));
    container.appendChild(createLabel('Kodi Password'));
    container.appendChild(createInput(GM_getValue('kodi_pass',''), 'password'));

    // Save
    const save = document.createElement('button');
    save.textContent = 'Save Settings';
    Object.assign(save.style, {
      marginTop:'12px', padding:'10px',
      width:'100%', fontSize:'16px',
      background:'#28a745', color:'#fff',
      border:'none', borderRadius:'4px',
      cursor:'pointer'
    });
    save.onclick = () => {
      GM_setValue('plugin', pluginSel.value);
      GM_setValue('mode',   modeSel.value);
      GM_setValue('kodi_ip',   overlay.querySelector('input[type=text]').value.trim());
      GM_setValue('kodi_port', overlay.querySelectorAll('input[type=text]')[1].value.trim());
      GM_setValue('kodi_user', overlay.querySelectorAll('input[type=text]')[2].value);
      GM_setValue('kodi_pass', overlay.querySelector('input[type=password]').value);
      alert('✅ Settings saved!');
      overlay.remove();
    };

    container.appendChild(save);
    overlay.appendChild(close);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
  }

  // ─── FULL‑SCREEN REMOTE CONTROL OVERLAY ────────────────────────────────
  function showRemoteOverlay() {
    if (document.getElementById('tm-remote-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'tm-remote-overlay';
    Object.assign(overlay.style, {
      position:'fixed', top:0, left:0, right:0, bottom:0,
      background:'rgba(0,0,0,0.8)', zIndex:2147483648,
      display:'grid',
      gridTemplateColumns:'1fr 1fr 1fr',
      gridTemplateRows:'1fr 1fr 1fr 0.5fr',
    });

    function makeBtn(label, col, row, method, dismiss=false) {
      const b = document.createElement('button');
      b.textContent = label;
      Object.assign(b.style, {
        gridColumn:col, gridRow:row,
        fontSize:'4vw',
        border:'none',
        background:'rgba(200,200,200,0.6)',
        borderRadius:'8px',
        cursor:'pointer',
        width:'100%', height:'100%'
      });
      b.onclick = () => sendInput(method, dismiss);
      return b;
    }

    overlay.append(
      makeBtn('▲','2 / 3','1 / 2','Up'),
      makeBtn('◄','1 / 2','2 / 3','Left'),
      makeBtn('OK','2 / 3','2 / 3','Select', true),
      makeBtn('►','3 / 4','2 / 3','Right'),
      makeBtn('▼','2 / 3','3 / 4','Down'),
      makeBtn('⎋','1 / 4','4 / 5','Back', true)
    );

    document.body.appendChild(overlay);
  }

  // ─── INJECT UI ─────────────────────────────────────────────────────────
  function injectUI() {
    if (!document.body) return setTimeout(injectUI, 200);
    if (document.getElementById('tm-send-btn')) return;

    // Send to Kodi
    const send = document.createElement('button');
    send.id = 'tm-send-btn';
    send.textContent = '▶ Kodi';
    Object.assign(send.style, {
      position:'fixed', bottom:'12px', right:'12px',
      padding:'12px', fontSize:'18px',
      borderRadius:'50%', border:'none',
      background:'#e50914', color:'#fff',
      zIndex:2147483647, opacity:0.9,
      cursor:'pointer'
    });
    send.onclick = onSend;

    // Voice search
    const record = document.createElement('button');
    record.id = 'tm-record-btn';
    record.textContent = '🎤';
    Object.assign(record.style, {
      position:'fixed', bottom:'12px', right:'72px',
      padding:'12px', fontSize:'18px',
      borderRadius:'50%', border:'none',
      background:'#dda0dd', color:'#fff',
      zIndex:2147483647, opacity:0.9,
      cursor:'pointer'
    });
    record.onclick = onRecord;

    // Settings gear
    const gear = document.createElement('button');
    gear.id = 'tm-gear-btn';
    gear.textContent = '⚙';
    Object.assign(gear.style, {
      position:'fixed', bottom:'12px', right:'132px',
      padding:'12px', fontSize:'18px',
      borderRadius:'50%', border:'none',
      background:'#444', color:'#fff',
      zIndex:2147483647, opacity:0.9,
      cursor:'pointer'
    });
    gear.onclick = openSettingsModal;

    document.body.append(send, record, gear);
  }

  injectUI();
  new MutationObserver(injectUI).observe(document.documentElement, {
    childList: true, subtree: true
  });

})();
