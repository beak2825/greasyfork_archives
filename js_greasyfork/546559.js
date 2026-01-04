// ==UserScript==
// @name         Suno Songs (YAY Tools)
// @namespace    yaylists.suno.helper
// @version      3.5.3.8
// @description  Monday Releases Helper
// @match        https://suno.com/playlist/*
// @match        https://www.suno.com/playlist/*
// @match        https://suno.com/song/*
// @match        https://www.suno.com/song/*
// @icon         https://suno.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      yayn8n.duckdns.org
// @connect      hook.eu1.make.com
// @connect      studio-api.prod.suno.com
// @connect      cdn.suno.com
// @connect      cdn-o.suno.com
// @license      All Rights Reserved ~ Personal/Private use only
// @author       YAY Labs
// @downloadURL https://update.greasyfork.org/scripts/546559/Suno%20Songs%20%28YAY%20Tools%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546559/Suno%20Songs%20%28YAY%20Tools%29.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  try {
    /* ======================== CONFIG ======================== */
    const N8N_WEBHOOK = 'https://hook.eu1.make.com/ket3wr6xuu24tlbx33wu9qubdoij7wls'; // Make webhook
    const N8N_SECRET  = 'RephINqSz6zqbks';
 
    const MAKE_STATUS_POLL = 'https://hook.eu1.make.com/63jwwasywfjffrbr1uukl9lbrtqp81zt';
    const ENABLE_DONE_SOUND = true;
 
    // WAV capture (assisted)
    const CAPTURE_WAV_URL = true;
    const DEBUG_WAV = true;
 
    // Assisted-only (no API-first)
    const WAV_VIA_API_FIRST      = false;
    const WAV_REQUIRE_USER_CLICK = true;
 
    // Extra “steady” wait to avoid de-selections (ms)
    const WAIT_STEADY_MS = 1250;
 
    // Max time we’ll wait for you to click Download → WAV Audio (ms)
    const WAIT_USER_CLICK_MAX_MS = 5 * 60 * 1000;
 
// === Voice notification config ===
const DONE_VOICE_TEXT  = 'Suno upload complete';
const DONE_VOICE_LANG  = 'en-US'; // e.g. 'en-GB', 'ro-RO'
const DONE_VOICE_HINTS = ['Google US English', 'Samantha', 'Microsoft Aria']; // try these names first
const DONE_VOICE_RATE  = 1.0;  // 0.1–10
const DONE_VOICE_PITCH = 1.0;  // 0–2
const DONE_VOICE_VOL   = 0.35;  // 0–1
const DONE_BEEP_PEAK   = 0.04;   // << lower = quieter (e.g., 0.03–0.07)
 
 
    // ETA defaults (used before we learn your pace)
    const ETA_MIN_PER_SONG_MS = 10000;
    const ETA_MAX_PER_SONG_MS = 15000;
 
// Extra pad applied only to the Upload ETA modal
const ETA_UPLOAD_PAD_MS = 10000; // ← change this number to whatever you like
 
    function getEtaBaseMs(){
  let v = Number(GM_getValue('yay_eta_base_ms', 0));
  const min = ETA_MIN_PER_SONG_MS, max = ETA_MAX_PER_SONG_MS;
  // Force a new pick if missing or outside the current [min,max]
  if (!v || v < min || v > max) {
    v = min + Math.floor(Math.random() * (max - min + 1));
    GM_setValue('yay_eta_base_ms', v);
  }
  return v;
}
 
 
    // (compat vars kept; unused in assisted-only mode)
    const SUNO_API_BASE = 'https://studio-api.prod.suno.com';
    const API_POLL_INTERVAL_MS = 800;
    const API_POLL_TIMEOUT_MS  = 25000;
    const AUTH_BEARER_OVERRIDE = '';
 
    const ACCOUNT_MAP   = { 'yay labs': 'Suno 1', 'yay labs 2': 'Suno 2' };
    const GENRE_OPTIONS = [
  'Afrobeats','Afro House','Afro-Trap','Afro-Trap Soul','Alternative Rock','Alt RnB','Amapiano',
  'Bachata','Baile Funk','Banda','Bass House','Blues Rock','Breakbeat',
  'Christian/Gospel','Classic Rock','Corridos','Corridos Tumbados','Country','Country Rap','Cubano','Cumbia',
  'Dancehall','Dance Pop','Deep House','Dembow','Disco','Disco Polo','Drift Phonk','Drill','Drum & Bass','Dubstep','Dub Techno','EDM',
  'Electro','Electropop','Emo','Emo Rap','Flamenco','Funk','Funk Soul','Future Bass','Future House',
  'Garage Rock','Grunge','Hard Rock','Hardstyle','Hard Techno','Hip-Hop / Rap','House','Hyperpop',
  'Indie Pop','Indie Rock','Industrial Techno','Jazz','Jersey Club','J-Pop','Jungle','K-Pop',
  'Latin Pop','Latin Rock','Latin Trap','Liquid Drum & Bass','Lo-Fi Hip Hop',
  'Manele','Manele - Populara','Mariachi','Melodic Techno','Memphis Phonk','Merengue','Metal','Minimal Techno','Moombahton',
  'Norteño','NY Drill','Peak-Time Techno','Perreo','Phonk','Phonk House','Pop','Populara','Pop Punk','Post-Punk','Post-Rock',
  'Progressive House','Progressive Rock','Psychedelic Rock','Psytrance',
  'Ranchera','Reggae','Reggaeton','Regional Mexican','RnB','Rock',
  'Salsa','Shoegaze','Ska','Slap House','Son Cubano','Soul','Synth-Pop','Synthwave',
  'Tango','Tech House','Techno','Trance','Trap','Tropical House',
  'UK Drill','UK Garage','Vallenato','Worship'
];
 
    // Replace the whole MOOD_OPTIONS constant with this grouped version:
const MOOD_GROUPS = [
  {
    header: 'Vibe',
    items: [
'Bittersweet','Chill','Dancing','Dark','Depressing','Dreamy','Empowering','Euphoric','Festival','Happy','Heartbreak','Love','Melancholic','Nostalgic','Party','Relaxing','Romantic','Sad','Sexy','Uplifting'
]
  },
  {
    header: 'Artist',
    items: ['Male','Female','Duet','Group']
  },
  {
    header: 'Tempo',
    items: ['Slow','Medium','Fast']
  },
  {
    header: 'Era',
    items: ['General','Modern','Old-School','Retro','Throwback','Vintage','Y2K','2020s','2010s','2000s','1990s','1980s','1970s','1960s','1950s']
  }
];
 
    const CREATED_BY = [
  'Adina Olteanu',
  'Alexandra Holban',
  'Alina Bratis',
  'Andrei Lupean',
  'Apopei Raul Viorel Dumitru',
  'Athena Popa',
  'Cirstea Andreea',
  'Cristi Caruntu',
  'Cristian Uta',
  'Ghita Carmen',
  'Kadar Cristian Claudiu',
  'Raluca Sofrazi',
  'Vasile Cristian'
];
    const LANG_OPTIONS = [
  'Arabic',
  'Bengali',
  'Bosnian',
  'Chinese (Cantonese)',
  'Chinese (Mandarin)',
  'Croatian',
  'Danish',
  'Dutch',
  'English',
  'Filipino',
  'Finnish',
  'French',
  'German',
  'Greek',
  'Hebrew',
  'Hindi',
  'Hungarian',
  'Indonesian',
  'Italian',
  'Jamaican Patois',
  'Japanese',
  'Korean',
  'Malay',
  'Norwegian',
  'Persian',
  'Polish',
  'Portuguese',
  'Punjabi',
  'Romanian',
  'Russian',
  'Serbian',
  'Spanish',
  'Swahili',
  'Swedish',
  'Tamil',
  'Telugu',
  'Thai',
  'Turkish',
  'Ukrainian',
  'Urdu',
  'Vietnamese'
];
 
 
/* =================== AUTO-MAP DICTIONARIES + HELPERS =================== */
// If first Primary Artist === key, set Lyrics/Music/Production credits to real name
const PERSON_TO_CREDITS = Object.freeze({
  'Calypso': 'Calin Mateias',
  'Jazzlo': 'Tudor Voinea',
  'Novamo': 'Rareș Dinu',
  'Pontiano': 'Mihnea Iancu',
  'Dekno': 'Ciprian Pavel',
  'Zentek': 'Răzvan Niculescu',
  'Echonox': 'Vicențiu Gheorghiu',
  'Syntonic': 'Nestor Florea',
  'Neonite': 'Dorian Boian',
  'FONKS': 'Tiberiu Zamfir',
  'G Crew': 'Narcis Chiriac',
  'Ansamblul Doinești': 'Remus Vlădoiu',
  'Frăția Regilor': 'Alin Rusu',
  'Calixi': 'Eugen Munteanu',
  'Happy Bee': 'Mihaela Caragea',
  'DJ Taifun': 'Silviu Coman',
  'Magical Moments': 'Octavian Neagu',
  'Christmas Songs Collection': 'Claudiu Stanciu',
  'BaddieZ': 'Valeria Vasilescu',
  'Rosalina': 'Mădălina Popescu',
  'FSTR': 'Sorin Georgescu',
  'Slow Lee': 'Andrei Ionescu',
  'Mythical DJ': 'George Dumitru',
  'Speedy Bronzales': 'Matei Marinescu',
  'MelQ': 'Luca Petrescu',
  'Blvrik': 'Kateryna Bondarenko',
  'Mauro Simboli': 'Tănase Dima',
  'Mellamora': 'Rafael Costa',
  'Didis Poli': 'Wojciech Kaminski',
  'Lumeris': 'Maxime Fournier',
  'The Rytmix Collective': 'Toma Rădulescu',
  'iCey': 'Kenji Tanaka',
  'Apus Violet': 'Patricia Florea',
  'The Street Cartel': 'Malik Thompson',
  'RnB United': 'Mihail Florea',
  'The Classix': 'Owen Wilson',
  'Alma Viejas': 'Javier Ocampo',
  'Zulu Kelele': 'Khalil Jackson',
  'Coco Bello': 'Dante Romano',
  'Sonorosa': 'Silas Holloway',
  'NABALANS': 'Cezar Leuca',
  'Qamarin': 'Faisal Al-Sayed',
  'Repko': 'Bence Kovács',
  'Snow Marley': 'Kofi Jahmar',
  'Ghost Town Riders': 'Theodore Shaw',
  'Manelika': 'Constantin Rădoi',
  'Lara Populara': 'Alina Puiu',
  'Niku Manea': 'Igor Miron',
  'BalkanX': 'Ema Matache',
  'LACOKA CLUB': 'Virgil Rusu',
  'Zeita Diamantelor': 'Laura Comanescu',
  'PitoresQ': 'Marius Pintilie',
  'Juanonimous': 'Enerique Constantin',
  "Funk'em": 'Alexander Martin'
});

 
// If first Primary Artist === key, set C line / P line / Publisher / Brand / Label to value
const ARTIST_TO_COMPANY = Object.freeze({
  'Calypso': 'Calypso Records',
  'Jazzlo': 'Jazzalong',
  'Novamo': 'Bossnova Records',
  'Pontiano': 'Pianology',
  'Dekno': 'Dark Light',
  'Zentek': 'In House Tek',
  'Echonox': 'Way to Deep',
  'Syntonic': 'Wavey Synths',
  'Neonite': 'DYSTOPIAN WRLD',
  'FONKS': 'PHONK OFF',
  'G Crew': 'G Corporation',
  'Ansamblul Doinești': 'Traditional Romanesc Entertainment',
  'Frăția Regilor': 'Manele Regale',
  'Calixi': 'Tropical Paradise',
  'Happy Bee': 'Kinder Beats',
  'DJ Taifun': 'DJ Taifun',
  'Magical Moments': 'The Magic Company',
  'Christmas Songs Collection': 'Christmasy Magic',
  'BaddieZ': 'Bad Girl Records',
  'Rosalina': 'Rosalina Music',
  'FSTR': 'FSTR THAN LIGHT',
  'Slow Lee': '2Mellow',
  'Mythical DJ': 'Mythical Records',
  'Speedy Bronzales': 'Speedy Records',
  'MelQ': 'MelQ Records',
  'Blvrik': 'Blvrik Records',
  'Mauro Simboli': 'Mauro Simboli Records',
  'Mellamora': 'Mellamora Records',
  'Didis Poli': 'Didis Poli Records',
  'Lumeris': 'Lumeris Records',
  'The Rytmix Collective': 'Rytmix Collective Inc',
  'iCey': 'JXRO Entertainment',
  'Apus Violet': 'Prea Tare Records',
  'The Street Cartel': 'Unleashed Unit',
  'RnB United': 'RnB United',
  'The Classix': 'The Classix',
  'Alma Viejas': 'Alma Viejas Records',
  'Zulu Kelele': 'Zulu Kelele Records',
  'Coco Bello': 'Coco Bello Records',
  'Sonorosa': 'Sonorosa Records',
  'NABALANS': 'Pe Balans Records',
  'Qamarin': 'Arabic Nights Entertainment',
  'Repko': 'Repko Records',
  'Snow Marley': 'Reggae Kings Entertainment',
  'Ghost Town Riders': 'Red Dirt Rodeo Entertainment',
  'Manelika': 'Manelika',
  'Lara Populara': 'Lara Populara',
  'Niku Manea': 'Niku Manea',
  'BalkanX': 'A Balkanic World',
  'LACOKA CLUB': 'LACOKA CLUB',
  'Zeita Diamantelor': 'Manele Regale',
  'PitoresQ': 'Ritm Carpathiq',
  'DJ Slagar': 'Slagare Contemporane',
  'Juanonimous': 'Industria Anonima',
  "Funk'em": 'Funk The World'
});
 
// lookups (exact match; keeps capitalization)
function mapCreditsPerson(name) {
  return PERSON_TO_CREDITS[name?.trim()] || '';
}
function mapCompanyForArtist(artistName) {
  return ARTIST_TO_COMPANY[artistName?.trim()] || '';
}
 
// auto-fill logic (never overwrites user edits; only fills blanks unless force=true)
function autoFillDerivedForRow(r, { force = false } = {}) {
  const firstArtist = toArtistArray(r.primary_artist)[0] || '';
  const company = mapCompanyForArtist(firstArtist);
  const credit  = mapCreditsPerson(firstArtist);
 
  // Company-derived fields (unchanged)
  ['c_line','p_line','publisher','label'].forEach(k => {
    if (force || !r[k]) r[k] = company || '';
  });
 
  // Brand = exactly first primary artist
  if (force || !r.brand) r.brand = firstArtist || '';
 
  // Credits (unchanged)
  ['production_credits','lyrics_credits','music_credits'].forEach(k => {
    if (force || !r[k]) r[k] = credit || '';
  });
}
 
 
// UI helper: recompute row i and reflect into inputs if visible
function autoFillDerivedForIndex(i, { force = false } = {}) {
  const r = currRows[i];
  if (!r) return;
  const before = { ...r };
  autoFillDerivedForRow(r, { force });
 
  const tr = wrap.querySelector(`tr[data-i="${i}"]`);
  if (!tr) return;
  const setIf = (key) => {
    const td = tr.querySelector(`td[data-col="${key}"] input`);
    if (!td) return;
    if (force || !before[key]) td.value = r[key] || '';
  };
  ['c_line','p_line','publisher','brand','label','production_credits','lyrics_credits','music_credits'].forEach(setIf);
}
 
 
/* ------------------------- SELECTORS ------------------------- */
const SELECTORS = {
  list: {
    bar: 'div.flex.flex-row.items-center.justify-end.gap-2',
    item: '[data-testid="song-row"]',
    // the real song link inside each row (skip the comments link)
    titleA: 'a[href^="/song/"]:not([href*="show_comments"])',
    // NEW: what counts as a “row/card” container when climbing from the anchor
    cardCandidates: '[data-testid="song-row"], [role="row"], article, li, [data-testid*="song"], div[class*="song"]'
  }
};

// ---------------------- SONG PAGE SELECTORS ----------------------
const SONG_SELECTORS = {
  // Main title on the song page (works as a fallback; you said title is already fine)
  title: 'h1',

  // Styles block: the inner div that has the full styles in its title=""
  // (Romanian folk, Transylvanian (Ardelenesc) folk)
  style: 'div[title].font-sans.whitespace-pre-wrap.text-foreground-secondary\\/90',

  // First lyrics paragraph; we’ll then collect all p.whitespace-pre-wrap siblings
  lyricsFirstP: 'p.whitespace-pre-wrap'
};


 
    /* --------------------------- STATE KEYS --------------------------- */
    const K = {
      STATE: 'yay_suno_extract_state',
      PROCESSED: 'yay_processed',
      DEVICE: 'yay_device_id'
    };
 
    /* --------------------------- UTILS --------------------------- */
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const $  = (sel, root=document) => root.querySelector(sel);
    const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
    const text = (el) => el ? (el.innerText || el.textContent || '').trim() : '';
    const esc  = (s='') => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
    function abs(h){ try { return new URL(h, location.origin).toString(); } catch { return h; } }
    function getSunoId(url){ try { const u = new URL(url, location.origin); const p = u.pathname.split('/').filter(Boolean); return p[p.length-1] || ''; } catch { return ''; } }
    function parseDuration(s){ if(!s) return null; s=s.trim(); if(/^\d{1,2}:\d{2}$/.test(s)){ const [m,sc]=s.split(':').map(Number); return m*60+sc; } if(/^\d+$/.test(s)) return Number(s); return null; }
    function parseArtistsAndTitle(full){ const out={artists:[], title:(full||'').trim()}; const parts=(full||'').split(' - '); if(parts.length>=2){ const left=parts[0].trim(); out.title=parts.slice(1).join(' - ').trim(); out.artists=left.split(/,| x | × |&/i).map(s=>s.trim()).filter(Boolean);} return out; }
    function findDurationInCard(card){ const nodes=card.querySelectorAll('span,div,small'); for(const n of nodes){ const m=(n.textContent||'').trim().match(/\b(\d{1,2}:\d{2})\b/); if(m) return m[1]; } return ''; }
    function toPath(href){ try { const u=new URL(href, location.origin); return u.pathname + u.search; } catch { return href; } }
    function isPlaylistPage(){ return /\/playlist\//.test(location.pathname); }
    function isSongPage(){ return /\/song\//.test(location.pathname); }
    function getState(){ try { return GM_getValue(K.STATE, null); } catch { return null; } }
    function setState(s){ GM_setValue(K.STATE, s); }
    function clearState(){ GM_setValue(K.STATE, null); }
    function getStore(){ try { return JSON.parse(GM_getValue(K.PROCESSED, '{}')); } catch { return {}; } }
    function setStore(x){ GM_setValue(K.PROCESSED, JSON.stringify(x)); }
    function rememberProcessed(ids){ const s=getStore(); ids.forEach(id => s[id] = true); setStore(s); }
    function getDeviceId(){ let d = GM_getValue(K.DEVICE,''); if(!d){ d = crypto.randomUUID ? crypto.randomUUID() : (Date.now()+'-'+Math.random().toString(36).slice(2)); GM_setValue(K.DEVICE,d); } return d; }
 
    const logW = (...a) => { if (DEBUG_WAV) console.log('[YAY][WAV]', ...a); };
 
function toArtistArray(v){
  if (Array.isArray(v)) return v.map(s=>String(s).trim()).filter(Boolean);
  return String(v||'').split(',').map(s=>s.trim()).filter(Boolean);
}
function toArtistDisplay(v){
  return Array.isArray(v) ? v.join(', ') : String(v||'').trim();
}
 
    function simulateClick(el){
      if (!el) return;
      try { el.scrollIntoView({ block:'center', inline:'center' }); } catch {}
      ['pointerdown','mousedown','pointerup','mouseup','click'].forEach(type=>{
        try { el.dispatchEvent(new MouseEvent(type, { bubbles:true, cancelable:true, view:window })); } catch {}
      });
    }
    function visible(el){
      if (!el) return false;
      const r=el.getBoundingClientRect();
      const cs=getComputedStyle(el);
      return (el.offsetWidth || el.offsetHeight || el.getClientRects().length) && r.width>1 && r.height>1 && cs.visibility!=='hidden' && cs.display!=='none';
    }
    function escClose(){
      try { document.dispatchEvent(new KeyboardEvent('keydown', { key:'Escape', code:'Escape', keyCode:27, bubbles:true })); } catch {}
    }
 
    /* ---------- EARLY: helpers used by initUI / MutationObserver ---------- */
    function nodesForItems(){
  // 1) collect all /song/ anchors
  const anchors = Array.from(document.querySelectorAll(SELECTORS.list.titleA));

  // 2) for each anchor, climb to the “row card”
  const getCard = (a) => a.closest(SELECTORS.list.cardCandidates) || a.parentElement || a;

  // 3) prefer the main song link (ignore ?show_comments=)
  const pickMainAnchor = (root) => {
    const all = Array.from(root.querySelectorAll(SELECTORS.list.titleA));
    return all.find(x => {
      try { return !(new URL(x.href, location.origin)).searchParams.has('show_comments'); }
      catch { return true; }
    }) || all[0] || null;
  };

  // 4) de-dupe by /song/:id (fall back to element identity if no id)
  const uniq = [];
  const seenIds = new Set();
  const seenEls  = new Set();

  for (const a of anchors){
    const card = getCard(a);
    if (!card) continue;

    const main = pickMainAnchor(card) || a;
    const id   = getSunoId(abs(main.href));

    if (id) {
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      uniq.push(card);
    } else {
      if (seenEls.has(card)) continue;
      seenEls.add(card);
      uniq.push(card);
    }
  }

  // fallback: if something went wrong, return anchors (legacy behavior)
  return uniq.length ? uniq : anchors;
}


    function getCardId(card){
  // Prefer the row’s own id
  const byAttr = card?.getAttribute?.('data-clip-id');
  if (byAttr) return String(byAttr).trim();

  // Fallback: read it from the anchor
  const a = card?.querySelector?.(SELECTORS.list.titleA);
  return a ? getSunoId(abs(a.href)) : '';
}


function getProcessedMark(card){
  const all = Array.from(card.querySelectorAll(SELECTORS.list.titleA));
  let a = all.find(x => {
    try {
      const u = new URL(x.href, location.origin);
      return !u.searchParams.has('show_comments');
    } catch { return true; }
  }) || all[0];

  if (!a && card.matches && card.matches(SELECTORS.list.titleA)) a = card;

  if (!a) return { id:'', mark:null };
  const id = getSunoId(abs(a.href));
  const mark = card.querySelector('.yay-processed-badge');
  return { id, mark };
}

    function markProcessedOnPage(){
      const s=getStore();
      nodesForItems().forEach(card=>{
        const { id, mark } = getProcessedMark(card);
        if (!id) return;
        const a=card.querySelector(SELECTORS.list.titleA);
        if (s[id]) {
          if (!mark){ const b=document.createElement('span'); b.className='yay-processed-badge'; b.textContent='Released'; (a?.parentElement || card).appendChild(b); }
        } else mark?.remove();
      });
    }
 
function stabilizeMoodCells(){
  // For Chrome: force a reflow so grid lines + hit-targets match visuals
  wrap.querySelectorAll('td[data-col="mood"] .yay-chipbtn')
      .forEach(b => { void b.offsetHeight; }); // read forces layout flush
}
 
 
    /* ================= WAV URL CAPTURE — helpers & sniffer ================= */
 
    function __getClerkToken_payload(){
      (async () => {
        try {
          const t = await (window.Clerk?.session?.getToken?.() || Promise.resolve(''));
          window.__YAY_CLERK_TOKEN = t || '';
        } catch { window.__YAY_CLERK_TOKEN = ''; }
      })();
    }
    function injectClerkTokenGetter(){
      const s = document.createElement('script');
      s.textContent='('+__getClerkToken_payload.toString()+')();';
      document.documentElement.appendChild(s); s.remove();
    }
    async function getClerkBearer(){
      if (AUTH_BEARER_OVERRIDE) return AUTH_BEARER_OVERRIDE;
      if (!unsafeWindow.__YAY_CLERK_TOKEN){
        injectClerkTokenGetter();
        const deadline = Date.now()+5000;
        while(!unsafeWindow.__YAY_CLERK_TOKEN && Date.now()<deadline) await sleep(100);
      }
      return unsafeWindow.__YAY_CLERK_TOKEN || '';
    }
 
    function gmReq(opts){
      return new Promise((resolve,reject)=>{
        GM_xmlhttpRequest({
          method: opts.method || 'GET',
          url: opts.url,
          headers: opts.headers || {},
          data: opts.body || null,
          responseType: opts.responseType || '',
          timeout: opts.timeout || API_POLL_TIMEOUT_MS,
          anonymous: false,
          onload: (res)=>resolve(res),
          onerror: (e)=>reject(e),
          ontimeout: ()=>reject(new Error('timeout'))
        });
      });
    }
    function parseMaybeJson(res){
      try { return JSON.parse(res.responseText||''); } catch { return null; }
    }
    function pickUrlFromResponse(res){
      const j = parseMaybeJson(res);
      if (j && typeof j==='object'){
        const cands = [j.url, j.download_url, j.signed_url, j.href];
        const u = cands.find(x => typeof x === 'string' && /^https?:/i.test(x) && /\.wav(\?|$)/i.test(x||'')) || '';
        if (u) return u;
      } else if (typeof j === 'string' && /^https?:\/\//i.test(j) && /\.wav(\?|$)/i.test(j)) {
        return j;
      }
      const fin = res.finalUrl || '';
      if (/\.wav(\?|$)/i.test(fin)) return fin;
      return '';
    }
 
    function __ultraWavSniffer_payload(){
  (() => {
    const log = (...a)=>console.log('%c[WAV]', 'color:#0f0', ...a);

    const isLikelyWavUrl = (uStr) => {
      if (!uStr) return false;
      const s = String(uStr);
      if (!/^https?:/i.test(s)) return false;
      if (/\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(s)) return false;
      if (/Upsell_|gradient\.jpg/i.test(s)) return false;
      return /\.wav(\?|$)/i.test(s) ||
             /(?:[?&](?:format|type|ext)=wav)(?:[&#]|$)/i.test(s) ||
             /(?:[?&](?:filename)=[^&]*\.wav)(?:[&#]|$)/i.test(s);
    };

    // Buckets
    const hitsAll   = (window.__wavHitsAll ||= []);        // everything we ever see
    const hitsHttps = (window.__wavHits   ||= []);         // trusted hits (URL looks .wav-ish)
    const hitsForced= (window.__wavForced ||= []);         // trusted hits (header-proven wav)
    const seenAll   = (window.__wavSeenAll   ||= new Set());
    const seenHttps = (window.__wavSeenHttps ||= new Set());
    const seenForced= (window.__wavSeenForced||= new Set());

    // push(url, from, force)
    const push = (u, from='', force=false) => {
      if (!u) return;
      const s = String(u);

      if (!seenAll.has(s)) { hitsAll.push(s); seenAll.add(s); }
      if (force) {
        if (!seenForced.has(s)) {
          hitsForced.push(s); seenForced.add(s);
          window.__lastWav = s;
          log('🎯 URL (forced WAV):', s, 'via', from);
        }
        return;
      }
      if (isLikelyWavUrl(s) && !seenHttps.has(s)){
        hitsHttps.push(s); seenHttps.add(s);
        window.__lastWav = s;
        log('🎯 URL:', s, 'via', from);
      }
    };

    // Patch window.open
    if (!window.__wavOpenPatched){
      const _open = window.open;
      window.open = function(url, ...rest){
        push(url, 'window.open');
        return _open.apply(this, [url, ...rest]);
      };
      window.__wavOpenPatched = true;
    }

    // Patch location changes
    if (!window.__wavLocPatched){
      const _assign = location.assign.bind(location);
      location.assign = function(u){ push(u, 'location.assign'); return _assign(u); };
      const desc = Object.getOwnPropertyDescriptor(Location.prototype, 'href');
      if (desc && desc.set && !desc.__wav){
        const orig = desc.set;
        desc.set = function(v){ push(v, 'location.href='); return orig.call(this, v); };
        desc.__wav = true;
        Object.defineProperty(Location.prototype, 'href', desc);
      }
      window.__wavLocPatched = true;
    }

    // Patch createObjectURL (blob:) — keep as *candidate* only
    if (!window.__wavObjPatched){
      const _obj = URL.createObjectURL;
      URL.createObjectURL = function(blob){
        const url = _obj.apply(URL, arguments);
        try {
          const typ = (blob && blob.type || '').toLowerCase();
          if (typ.includes('audio') || typ.includes('wav')) {
            hitsAll.push(url);
            log('blob candidate:', url, 'from', `createObjectURL(${typ||'?'})`);
          }
        } catch {}
        return url;
      };
      window.__wavObjPatched = true;
    }

    // Patch fetch
    if (!window.__wavFetchPatched){
      const _fetch = window.fetch;
      window.fetch = async function(input, init){
        const res = await _fetch(input, init);
        try {
          const url = typeof input==='string' ? input : (input && input.url);
          push(url, 'fetch:url');

          const ct  = (res.headers.get('content-type') || '').toLowerCase();
          const cd  = (res.headers.get('content-disposition') || '').toLowerCase();
          const cdHasWav = /\.wav(\W|$)/i.test(cd);

          // If headers prove it's a WAV, FORCE the url even if it lacks .wav
          if (/audio\/wav/i.test(ct) || cdHasWav) {
            if (url) push(url, 'fetch:header', true /*force*/);
          }

          // If JSON body includes signed URLs, inspect & push normally
          if (/json/i.test(ct)){
            res.clone().json().then(obj=>{
              const out = [];
              (function walk(v){
                if (!v) return;
                if (typeof v==='string'){
                  if (/^https?:/i.test(v)) out.push(v);
                } else if (Array.isArray(v)) v.forEach(walk);
                else if (typeof v==='object') Object.values(v).forEach(walk);
              })(obj);
              out.forEach(u=>push(u, 'fetch:json'));
            }).catch(()=>{});
          }
        } catch {}
        return res;
      };
      window.__wavFetchPatched = true;
    }

    // Patch XHR
    if (!window.__wavXHRPatched){
      const _open = XMLHttpRequest.prototype.open;
      const _send = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(m,u,...rest){ this.__wavURL = u; return _open.call(this,m,u,...rest); };
      XMLHttpRequest.prototype.send = function(...args){
        this.addEventListener('readystatechange', function(){
          if (this.readyState !== 4) return;
          try {
            const url = this.responseURL || this.__wavURL;
            const ct  = (this.getResponseHeader && this.getResponseHeader('content-type')) || '';
            const cd  = (this.getResponseHeader && this.getResponseHeader('content-disposition')) || '';
            const cdHasWav = /\.wav(\W|$)/i.test(String(cd||''));
            if (/audio\/wav/i.test(String(ct||'')) || cdHasWav) {
              if (url) push(url, 'xhr:header', true /*force*/);
            } else {
              push(url, 'xhr:url');
            }
          } catch {}
        });
        return _send.apply(this, args);
      };
      window.__wavXHRPatched = true;
    }

    // Patch anchors
    if (!window.__wavAnchorPatched){
      const _click = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function(){
        try {
          const href = this.getAttribute('href') || this.href;
          const dl   = this.getAttribute('download') || '';
          if ((href && /\.wav(\?|$)/i.test(href)) || (/\.wav$/i.test(dl))) push(href, 'a.click', /\.wav$/i.test(dl));
        } catch {}
        return _click.call(this);
      };
      const _setAttr = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function(name, value){
        try {
          if (this instanceof HTMLAnchorElement){
            const v = String(value||'');
            if (name==='href' && /\.wav(\?|$)/i.test(v)) push(v, 'a[href]=.wav');
            if (name==='download' && /\.wav$/i.test(v)) push(this.getAttribute('href')||this.href||'(pending)', 'a[download]=.wav', true);
          }
        } catch {}
        return _setAttr.apply(this, arguments);
      };
      window.__wavAnchorPatched = true;
    }

    console.log('%c✅ Ultra WAV sniffer armed. Click Download → WAV Audio. I will wait here until you click.','color:#0f0');
  })();
}

    function injectUltraWavSniffer(){
      const s=document.createElement('script');
      s.textContent='('+__ultraWavSniffer_payload.toString()+')();';
      document.documentElement.appendChild(s);
      s.remove();
    }
 
    const near = (a,b)=>Math.hypot(a.x-b.x, a.y-b.y);
    const isFixed = (el)=>{ try { return getComputedStyle(el).position === 'fixed'; } catch { return false; } };
    const isBottomPlayerKebab = (el)=>{
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight - 160) return true;
      if (isFixed(el) && r.top > innerHeight - 220) return true;
      const anc = el.closest('[data-player],[data-testid*="player"],[class*="player"],[class*="footer"]');
      return !!anc;
    };
    const isUpsellOpen = ()=>{
      const modals = [...document.querySelectorAll('[role="dialog"],[data-radix-portal] [role="dialog"],[data-radix-portal] [class*="modal"]')].filter(visible);
      return modals.some(m=>{
        const t = (m.textContent||'').toLowerCase();
        return t.includes('download wav') && (t.includes('pro plan') || t.includes('see all plans') || t.includes('available with pro'));
      });
    };
    const closeUpsellIfOpen = ()=>{
      if (!isUpsellOpen()) return false;
      const btn = [...document.querySelectorAll('button')].find(b=>{
        const t=(b.textContent||'').toLowerCase();
        return /close|cancel|got it|ok/i.test(t) || (b.getAttribute('aria-label')||'').toLowerCase()==='close';
      });
      if (btn) simulateClick(btn); else escClose();
      return true;
    };
 
    async function openKebabMenu(){
  // tighter target for the 3-dot "more" button near the title; exclude reactions/likes/etc.
  const sel = [
    // legacy
    '[aria-label="More Options"]',
    '[aria-label="More Actions"]',
    // common/new
    'button[aria-haspopup="menu"]',
    'button[aria-expanded]',
    'button[aria-controls]',
    '[data-testid*="more"]',
    '[data-testid*="ellipsis"]',
    '[data-testid*="overflow"]',
    '[aria-label*="More"]',
    '[title*="More"]',
    '[aria-label*="Options"]',
    '[title*="Options"]',
    '[aria-label*="Actions"]',
    '[title*="Actions"]'
  ].join(',');

  const EXCLUDE_RX = /(react|reaction|emoji|like|heart|comment|share)/i;

  const candidates = [...document.querySelectorAll(sel)]
    .filter(visible)
    .filter(el => !isBottomPlayerKebab(el))
    .filter(el => {
      const lab = (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').toLowerCase();
      const tid = (el.getAttribute('data-testid') || '').toLowerCase();
      return !EXCLUDE_RX.test(lab) && !EXCLUDE_RX.test(tid);
    });

  if (!candidates.length){ logW('no kebab candidates (visible & non-player)'); return null; }

  const title = document.querySelector('h1');
  const refRect = title ? title.getBoundingClientRect() : {left:innerWidth/2, top:120, width:0, height:0};
  const refPt = { x: refRect.left + refRect.width/2, y: refRect.top + refRect.height/2 };

  const sorted = candidates.map(el=>{
    const r=el.getBoundingClientRect();
    const pt={x:r.left+r.width/2, y:r.top+r.height/2};
    return { el, d: near(pt, refPt), r };
  })
  .filter(k => Math.abs(k.r.top - refRect.top) < 360 || k.d < 480)
  .sort((a,b)=>a.d - b.d);

  const fire = (el) => ['pointerdown','mousedown','mouseup','click']
    .forEach(t => el.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,button:0})));

  // broadened menu detection to match Radix wrappers
  const menus = () => [
    ...document.querySelectorAll(
      '[role="menu"],[role="dialog"],' +
      '[data-radix-popper-content-wrapper],' +
      '[data-radix-portal] [role="menu"],' +
      '[data-radix-portal] [role="dialog"],' +
      '[data-radix-dropdown-menu-content]'
    )
  ].filter(visible);

  const lastMenu = () => { const m=menus(); return m[m.length-1]||null; };
  const items = (root)=>[
    ...root.querySelectorAll(
      '[role^="menuitem"],[data-radix-collection-item],button,a,div[role="menuitem"]'
    )
  ].filter(visible);

  for (const k of sorted){
    escClose(); await sleep(60);
    fire(k.el);
    let m=null;
    for (let t=0;t<12 && !m;t++){ await sleep(90); m=lastMenu(); }
    if (!m) continue;

    const hasDownload = !!items(m).find(el => /download/i.test(el.textContent||''));
    if (hasDownload){
      logW('kebab opened near title (new menu detected)');
      return m;
    }
    escClose();
    await sleep(90);
  }
  logW('could not find a kebab whose menu has "Download"');
  return null;
}


 
    async function clickDownloadThenFindWavBtn(currentMenu){
  const isVis = visible;

  const menus = () => [
    ...document.querySelectorAll(
      '[role="menu"],[role="dialog"],' +
      '[data-radix-popper-content-wrapper],' +
      '[data-radix-portal] [role="menu"],' +
      '[data-radix-portal] [role="dialog"],' +
      '[data-radix-dropdown-menu-content]'
    )
  ].filter(isVis);

  const lastMenu = () => { const all = menus(); return all[all.length-1] || null; };
  const items = (root) => [
    ...root.querySelectorAll('[role^="menuitem"],[data-radix-collection-item], div, button, a')
  ].filter(isVis);

  let m = currentMenu;
  if (!m){
    let tries=0;
    while(!m && tries++<12){ await sleep(90); m=lastMenu(); }
    if (!m){ logW('Download not found: no open menu'); return null; }
  }

  const dl = items(m).find(el => /download/i.test(el.textContent||''));
  if (!dl){ logW('Download not found in opened menu'); return null; }

  // ⛔ DO NOT auto-click. Just visually hint where to click.
  dl.classList.add('yay-hilite');

  // We intentionally return null so captureOfficialWavUrl won't attach
  // the auto "proc" transition; the sniffer will wait for your real click.
  return null;
}



    /* ========================= STYLES ========================= */
    GM_addStyle(`
      :root{--bg:#111213;--bg2:#151617;--bg3:#1b1c1e;--border:#2b2c2e;--fg:#e6e7e8;--muted:#a8acb0;--accent:#de1677;--chip:#242525;--btn:#252525;--active:#2a2b2d;--light:#e6e7e8;--yay-green:#1b7f4d}
      .yay-pill{display:inline-flex;gap:0;align-items:center;height:40px}
      .yay-btn-suno{position:relative;display:inline-flex;align-items:center;justify-content:center;font-family:inherit;font-weight:500;font-size:15px;text-align:center;padding:0 14px;height:40px;border-radius:8px;background:var(--btn);color:var(--fg);border:1px solid var(--border);white-space:nowrap}
      .yay-btn-suno.white{background:#fff;color:#242525;border-color:#d9d9d9}
      .yay-btn-suno.publishing{background:#de1677 !important;color:#fff !important;border-color:#de1677 !important;pointer-events:none;opacity:.95}
      .yay-icon-seg{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid var(--border);background:var(--btn);color:#fff;font-size:16px;border-radius:8px 0 0 8px}
      .yay-icon-seg img{ width:18px; height:18px; filter:brightness(0) invert(1); }
      .yay-icon-seg.pink{background:var(--accent);color:#fff}
      .yay-btn-glued{border-radius:0 8px 8px 0}
      .yay-badge{position:absolute;top:-18px;right:-6px;background:#000;color:#fff;border:1px solid #333;border-radius:999px;padding:2px 8px;font:700 11px system-ui;display:none;box-shadow:0 3px 10px rgba(0,0,0,.35)}
      /* Full card highlight when selected */
.yay-selected{
  position: relative;
  border-radius: 12px;
  background: rgba(253, 66, 156, 0.12);              /* #fd429c @ ~12% */
  outline: 2px solid rgba(253, 66, 156, 0.35);
  box-shadow: 0 8px 28px rgba(253, 66, 156, 0.15);
}
.yay-selected::before,
.yay-selected::after{
  content: none !important; /* disable the old white glow/stripe */
}
      .yay-tag{position:absolute;left:8px;top:8px;background:#000;color:#fff;font:700 12px/18px system-ui;padding:0 6px;border:1px solid rgba(255,255,255,.25);pointer-events:none}
 
      /* Body-level blur that never drops during downloads */
      body.yay-proc #main-container{
        filter: blur(6px) saturate(.85);
        pointer-events: none !important;
        transition: filter .08s linear;
      }
 
      .yay-mask{position:fixed;inset:0;background:rgba(0,0,0,.36);backdrop-filter:blur(8px);z-index:2147483646;display:none}
      .yay-center{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483647;background:var(--bg2);color:var(--fg);border:1px solid var(--border);border-radius:14px;padding:18px 20px;display:none;min-width:380px;text-align:center;box-shadow:0 18px 60px rgba(0,0,0,.35)}
 
      /* Suno-style top banner — bigger, with green/yellow/error modes */
      .yay-banner{position:fixed;left:0;right:0;top:0;height:auto;display:none;align-items:center;justify-content:center;z-index:2147483652;pointer-events:none;padding:14px}
      .yay-banner .msg{
        color: var(--fg);
        font: 800 17px/1.25 system-ui;
        padding: 16px 18px 14px;
        border-radius: 14px;
        border: 1px solid rgba(27,127,77,.55);
        box-shadow: 0 10px 38px rgba(0,0,0,.45), 0 0 0 1px rgba(0,0,0,.5);
        letter-spacing: .2px;
        backdrop-filter: blur(6px) saturate(1.1);
        max-width: min(980px, 94vw);
      }
      .yay-banner .msg.mode-wait{
        background: linear-gradient(180deg, rgba(27,127,77,.26), rgba(27,127,77,.12)) , linear-gradient(180deg, #101214, #121416);
        border-color: rgba(27,127,77,.65);
        box-shadow: 0 10px 38px rgba(0,0,0,.45), 0 0 0 1px rgba(0,0,0,.5), 0 0 24px rgba(27,127,77,.30);
      }
      .yay-banner .msg.mode-proc{
        background: linear-gradient(180deg, rgba(255,208,0,.28), rgba(255,208,0,.14)), linear-gradient(180deg, #101214, #121416);
        border-color: rgba(255,208,0,.75);
        box-shadow: 0 10px 38px rgba(0,0,0,.45), 0 0 0 1px rgba(0,0,0,.5), 0 0 24px rgba(255,208,0,.35);
      }
      .yay-banner .msg.mode-error{
        background: linear-gradient(180deg, rgba(255,80,80,.30), rgba(255,80,80,.15)), linear-gradient(180deg, #101214, #121416);
        border-color: rgba(255,80,80,.85);
        box-shadow: 0 10px 38px rgba(0,0,0,.45), 0 0 0 1px rgba(0,0,0,.5), 0 0 24px rgba(255,80,80,.35);
      }
      .yay-banner .main{display:block;margin-bottom:6px}
      .yay-banner .sub{display:flex;gap:10px;opacity:.95;font:700 13px/1.1 system-ui}
      .yay-banner .sub .label{opacity:.8}
      .yay-banner .sub .sep{opacity:.4}
 
      .yay-banner .msg{
        pointer-events: auto; /* make inner content clickable */
      }
      .yay-banner .cancel-row{
        margin-top: 8px;
        padding: 8px 10px 7px;
        border-radius: 10px;
        background:
          linear-gradient(180deg, rgba(255,80,80,.30), rgba(255,80,80,.16)),
          linear-gradient(180deg, #101214, #121416);
        border: 1px solid rgba(255,80,80,.85);
        font: 700 13px/1.2 system-ui;
        text-align: center;
        cursor: pointer;
        pointer-events: auto;
      }
      .yay-banner .cancel-row:hover{
        filter: brightness(1.06);
      }




/* highlight empty WAV URL cells so user knows it's required */
@keyframes yay-wav-pulse {
  0%   { box-shadow: 0 0 0 1px rgba(255,80,80,.9), 0 0 10px rgba(255,80,80,.45); }
  100% { box-shadow: 0 0 0 1px rgba(255,120,120,.9), 0 0 18px rgba(255,120,120,.60); }
}
.yay-grid td.yay-need-wav input {
  border-color: #ff5a5a !important;
  animation: yay-wav-pulse 1.4s ease-in-out infinite alternate !important;
}
 
/* Soft yellow glow on the song title when the row is selected */
.yay-selected a[href^="/song/"]:not([href*="show_comments"]) {
  display: inline-block;
  padding: 2px 4px;
  border-radius: 6px;
  background: rgba(255, 214, 0, 0.14);
  box-shadow: 0 0 12px rgba(255, 214, 0, 0.35);
  transition: box-shadow .15s ease, background .15s ease;
}
 
 
 
      /* Green highlight for clickable targets */
      .yay-hilite{outline:2px solid var(--yay-green)!important;border-radius:8px!important;box-shadow:0 0 14px rgba(27,127,77,.55)!important}
 
      /* Focus mask — we still keep it for dimming, but the hard blur is body-level */
      .yay-focusmask{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(6px) saturate(0.8);z-index:2147483650;display:none}
 
      .yay-progress{height:6px;background:#2b2c2e;border-radius:999px;overflow:hidden;margin-top:10px}
      .yay-progress>div{height:100%;background:#7bd77b;width:0%}
 
      .yay-modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(1400px,96vw);max-height:88vh;background:var(--bg2);color:var(--fg);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.35);z-index:2147483648;display:none;flex-direction:column}
      .yay-header{position:sticky;top:0;background:var(--bg2);display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid var(--border);z-index:8}
      .yay-header-left{display:flex;align-items:center;gap:8px}
      .yay-actions{display:flex;align-items:center;gap:8px}
      .yay-segwrap{display:inline-flex;background:var(--bg3);border:1px solid var(--border);border-radius:999px;overflow:hidden}
      .yay-segwrap button{padding:6px 14px;color:var(--fg);background:transparent;border:0}
      .yay-segwrap button.active{background:var(--active);color:#e8e8e8}
      .yay-segwrap.fmt-disabled{opacity:.5;pointer-events:none}
      .yay-titlelock{display:flex;gap:8px;align-items:center;margin-left:10px}
      .yay-titlelock input{background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:8px;padding:6px 8px;min-width:260px}
      .yay-titlelock .lockbtn{border-radius:8px;border:1px solid var(--border);padding:6px 10px;background:#fff;color:#242525}
      .yay-titlelock.locked .lockbtn{background:var(--active);color:#fff;border-color:#3a3b3d}
      .yay-titlelock.locked input{opacity:.55;pointer-events:none}
      .yay-divider{width:1px;height:24px;background:var(--border);display:block;align-self:center;margin:0 10px}
 
      .yay-bulkbar{position:sticky;top:44px;z-index:7;display:none;padding:10px 12px;background:var(--bg3);color:var(--fg);border-bottom:1px solid var(--border)}
      .yay-bulkbar button + button{margin-left:8px} /* spacing between Insert data & Cancel fill */
 
      .yay-table{padding:0 16px 16px}
      .yay-wrap{overflow:auto;max-height:calc(88vh - 140px);position:relative}
      .yay-grid{border-collapse:separate;border-spacing:0;table-layout:auto;min-width:1200px}
      .yay-grid th{position:sticky;top:0;background:var(--bg2);border-bottom:1px solid var(--border);border-right:1px solid var(--border);padding:10px 8px;text-align:center;font-weight:700;white-space:nowrap;z-index:6}
      .yay-grid th[data-col="title"],.yay-grid th[data-col="primary_artist"],.yay-grid th[data-col="featured_artist"],.yay-grid th[data-col="release_title"],.yay-grid th[data-col="version"],.yay-grid th[data-col="original_release"]{text-align:left}
      .yay-grid td{border-bottom:1px solid var(--border);border-right:1px solid var(--border);padding:6px 8px;vertical-align:middle;background:var(--bg2)}
      .yay-grid td:has(textarea){vertical-align:top}
      .yay-grid input,.yay-grid textarea{width:100%;background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:8px;padding:6px 8px;font:500 13px system-ui}
      .yay-grid textarea{white-space:pre-wrap;resize:both;min-height:48px}
      .yay-sticky{position:sticky;left:0;background:var(--bg2);z-index:8}
      .yay-sticky.two{left:56px}
      .yay-sticky.three{left:120px}
      .yay-grid td.yay-sticky, .yay-grid th.yay-sticky { border-right: none; }
      .yay-grid td.last-sticky, .yay-grid th.last-sticky { border-right: 1px solid var(--border); }
      .yay-handle{cursor:grab}
      td[data-col="format"],td[data-col="album_ep_title"],td[data-col="duration"],td[data-col="account"],td[data-col="genre"],td[data-col="type"],td[data-col="mood"],td[data-col="lyrics_origin"],td[data-col="created_by"],td[data-col="track_language"],td[data-col="potential"]{text-align:center}
      td[data-col="mood"],td[data-col="lyrics_origin"]{border-right:1px solid var(--border)}
      td[data-col="suno_url"] input,td[data-col="wav_url"] input{direction:rtl;text-align:left}
      .yay-ghost{position:fixed;left:0;top:0;pointer-events:none;opacity:.9;transform:translate(-9999px,-9999px);z-index:9;background:var(--bg2);border:1px dashed var(--border);border-radius:8px;padding:6px 8px}
      .yay-dropline{position:absolute;left:0;right:0;height:2px;background:#fff;box-shadow:0 0 8px rgba(255,255,255,.6);display:none;z-index:8}
 
      .yay-menu{position:fixed;z-index:2147483649;background:var(--bg2);color:var(--fg);border:1px solid var(--border);border-radius:10px;padding:8px;box-shadow:0 10px 30px rgba(0,0,0,.45);min-width:220px;max-width:520px}
.yay-menu .head{position:sticky;top:0;background:var(--bg2);z-index:2;display:block}
.yay-menu .srch{width:100%;min-width:0;background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:8px;padding:6px 8px;margin-bottom:8px}
.yay-menu .ok{width:100%;height:36px;border-radius:8px;border:1px solid var(--border);background:#fff;color:#242525;padding:0 12px;margin-top:8px}
.yay-menu .list{max-height:48vh;overflow:auto}
.yay-menu .opt{padding:6px 8px;border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:10px}
.yay-menu .opt:hover{background:rgba(255,255,255,.07)}
.yay-menu .group{
  padding: 6px 8px 4px;
  margin-top: 6px;
  font: 700 12px/1.1 system-ui;
  text-transform: uppercase;
  letter-spacing: .03em;
  opacity: .75;
  cursor: default;
}
 
 
      .yay-chipbtn{
  display:inline-flex;
  align-items:center;
  gap:6px;
  background:#1e1f21;
  border:1px solid var(--border);
  border-radius:999px;
  padding:4px 10px;
  font:600 12px system-ui;
  width:100%;                 /* ⬅️ take full cell width */
  justify-content:flex-start; /* ⬅️ keep content left */
  align-items:flex-start;     /* ⬅️ let tokens wrap nicely in mood */
}
 
      .yay-chipbtn .x{display:none;margin-left:4px;padding:0 6px;border-radius:999px;background:#2a2b2d}
      .yay-chipbtn.hasVal .x{display:inline}
      .yay-chipbtn .v{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  max-width:340px;
  white-space:normal;
  overflow:visible;
  text-overflow:initial;
}
 
/* === Mood layout fix (no clipping, no hit-target drift) === */
/* Mood tag list — stable flex layout (no transforms = no hit-test drift) */
td[data-col="mood"] .yay-chipbtn{
  display:flex;
  align-items:flex-start;
  gap:8px;
  flex-wrap:nowrap;          /* keep clear/caret on the first row */
  width:100%;
  max-width:100%;
  position:relative;         /* stable stacking context */
  isolation:isolate;
}
 
 
/* tokens container — Mood now renders as one line of text */
td[data-col="mood"] .yay-chipbtn .v{
  flex:1 1 auto;
  display:block;
  white-space:nowrap;      /* one long line */
  min-height:24px;
}
 
 
/* clear-all × (hidden until there’s a value) */
td[data-col="mood"] .yay-chipbtn .x{
  flex:0 0 auto;
  align-self:flex-start;
  display:none;
}
td[data-col="mood"] .yay-chipbtn.hasVal .x{ display:inline; }
 
/* caret ▾ */
td[data-col="mood"] .yay-chipbtn > span:last-child{
  flex:0 0 auto;
  align-self:flex-start;
}
 
/* keep the outer pill visible when empty */
td[data-col="mood"] .yay-chipbtn:not(.hasVal){
  background:#1e1f21 !important;
  border-color:var(--border) !important;
  padding:4px 10px;
}
 
 
 
 
 
 
.yay-token{
  display:inline-flex;
  align-items:center;
  gap:6px;
  background:var(--chip);
  color:var(--fg);
  border:1px solid var(--border);
  border-radius:999px;
  padding:3px 8px;
  margin:2px 4px 2px 0;
  font:600 12px system-ui;
}
.yay-token .rm{
  margin-left:2px;
  border:0;
  background:transparent;
  cursor:pointer;
  font-weight:800;
  line-height:1;
}
.yay-token .rm:focus{ outline:1px solid var(--border); border-radius:50%; }
 
 
      .bulk-on td.yay-focus{outline:1px solid rgba(255,255,255,0.35); background:rgba(255,255,255,0.06)}
      .bulk-on td.yay-cell-sel{background:rgba(255,255,255,0.08)}
      .bulk-on td.yay-src{background:rgba(255,255,255,0.20)}
 
      .yay-processed-badge{margin-left:8px;padding:2px 6px;border:1px solid var(--border);border-radius:6px;background:var(--bg3);font:600 11px system-ui;color:#8de38d}
 
      .yay-audio-modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(680px,96vw);max-height:80vh;background:var(--bg2);color:var(--fg);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.35);z-index:2147483650;display:none;flex-direction:column}
      .yay-audio-body{padding:10px 12px;overflow:auto;max-height:calc(80vh - 100px)}
      .yay-audio-table{width:100%;border-collapse:separate;border-spacing:0}
      .yay-audio-table th,.yay-audio-table td{border-bottom:1px solid var(--border);padding:8px 6px;text-align:left}
      .yay-audio-table th:nth-child(2), .yay-audio-table td:nth-child(2){text-align:center;width:160px}
      .yay-status{display:inline-flex;align-items:center;gap:6px;font-weight:600}
      .yay-status .dot{width:8px;height:8px;border-radius:50%;display:inline-block;background:#a8acb0}
      .yay-status.pending .dot{background:#a8acb0}
      .yay-status.uploaded .dot{background:#7bd77b}
      .yay-status.fail .dot{background:#ff6b6b}
      .yay-audio-footer{display:flex;justify-content:flex-end;gap:8px;padding:10px 12px;border-top:1px solid var(--border)}
      .yay-right-pill{display:inline-flex;align-items:center;gap:8px;font-weight:700}
    `);
 
 /* ---------------- SPA URL watcher ---------------- */
// let lastUrl = location.href;
// setInterval(() => {
//   if (location.href !== lastUrl) {
//     lastUrl = location.href;
//     teardownUI();
//     initUI();
//   }
// }, 400);

 
    /* ----------------- Overlay (blur & ETA) ----------------- */
    let mask, center, etaTimer=null, topBanner, topBannerTimer=null;
    let currentBannerMode = 'wait';
    function ensureOverlayNodes(){
      if (!mask){ mask = document.createElement('div'); mask.className='yay-mask'; document.body.appendChild(mask); }
      if (!center){ center = document.createElement('div'); center.className='yay-center'; document.body.appendChild(center); }
    }
    function setBannerMode(mode){
      if (!topBanner) return;
      const msg = topBanner.querySelector('.msg');
      currentBannerMode = mode;
      msg.classList.toggle('mode-wait', mode === 'wait');
      msg.classList.toggle('mode-proc', mode === 'proc');
      msg.classList.toggle('mode-error', mode === 'error');
 
      // Hard-lock blur via body class + keep dimmer mask only for proc
      if (mode === 'proc' && isSongPage()) {
        document.body.classList.add('yay-proc');
        ensureFocusMask(); focusMask.style.display = 'block';
      } else {
        document.body.classList.remove('yay-proc');
        ensureFocusMask(); focusMask.style.display = 'none';
      }
    }
        function showBanner(mainText, mode='wait'){
      if (!topBanner){
        topBanner = document.createElement('div');
        topBanner.className = 'yay-banner';
        topBanner.innerHTML = `
          <div class="msg mode-wait">
            <span class="main"></span>
            <div class="sub">
              <span class="label">ETA</span> <span id="yay-run-eta">—</span>
              <span class="sep">•</span>
              <span class="label">Progress</span> <span id="yay-run-ctr">0/0</span>
            </div>
            <div class="cancel-row" id="yay-cancel-run">Cancel processing</div>
          </div>`;
        document.body.appendChild(topBanner);

        const cancelBtn = topBanner.querySelector('#yay-cancel-run');
        if (cancelBtn){
          cancelBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            cancelRun();
          });
        }
      }
      topBanner.querySelector('.main').textContent = mainText || '';
      topBanner.style.display = 'flex';
      setBannerMode(mode);
      startTopBannerUpdater();
    }

    function hideBanner(){
      if (topBanner) topBanner.style.display='none';
      ensureFocusMask(); focusMask.style.display = 'none';
      document.body.classList.remove('yay-proc');
      if (topBannerTimer){ clearInterval(topBannerTimer); topBannerTimer=null; }
    }
    function startTopBannerUpdater(){
      if (topBannerTimer) return;
      topBannerTimer = setInterval(()=>{
        const bCtr = $('#yay-run-ctr'), bEta = $('#yay-run-eta');
        const st = getState();
        if (!st || !st.running){
          if (bCtr) bCtr.textContent = '0/0';
          if (bEta) bEta.textContent = '—';
          return;
        }
        const done = st.i || 0;
        const total = st.urls?.length || 0;
        if (bCtr) bCtr.textContent = `${done}/${total}`;
 
        // ETA that grows while user waits
        const avg = (st.stats && isFinite(st.stats.avg)) ? st.stats.avg : getEtaBaseMs();
        const elapsedOnCurrent = Math.max(0, Date.now() - (st.itemStart || Date.now()));
        const remainingSongsAfterCurrent = Math.max(0, total - done - 1);
        const currentContribution = Math.max(avg, elapsedOnCurrent);
        const remainingMs = currentContribution + (remainingSongsAfterCurrent * avg);
        if (bEta) bEta.textContent = fmtDur(remainingMs);
      }, 300);
    }
 
    /* -------------- Focus Mode (menu steady; now without blur) -------------- */
    let focusMask, focusMode=false, focusMenu=null, focusReflow=null, focusUseMask=false, focusAllowOutside=false;
    function ensureFocusMask(){
      if(!focusMask){
        focusMask=document.createElement('div');
        focusMask.className='yay-focusmask';
        document.body.appendChild(focusMask);
      }
    }
    // --- Keep the blur ON in Processing phase even if the browser download UI blips it off
    let blurGuardTimer = null;
    function startBlurGuard(){
      if (blurGuardTimer) return;
      blurGuardTimer = setInterval(() => {
        try {
          const st = getState();
          if (st && st.running && st.phase === 'proc') {
            ensureFocusMask();
            if (focusMask && focusMask.style.display !== 'block') focusMask.style.display = 'block';
            if (!document.body.classList.contains('yay-proc')) document.body.classList.add('yay-proc');
          }
        } catch {}
      }, 250);
    }
    const blockOutside = (e)=>{
      if(!focusMode) return;
      if (focusAllowOutside) return; // allow manual interaction if needed
      if (focusMenu && (focusMenu.contains(e.target) || (topBanner && topBanner.contains(e.target)))) return;
      try{ e.stopImmediatePropagation(); }catch{}
      try{ e.stopPropagation(); }catch{}
      try{ e.preventDefault(); }catch{}
    };
    function beginFocus(menuEl, opts={}){
      ensureFocusMask();
      focusMode=true;
      focusMenu=menuEl||null;
      focusUseMask = !opts.noMask;
      focusAllowOutside = !!opts.allowOutside;
      try { if (focusMenu) focusMenu.style.zIndex = '2147483651'; } catch {}
      focusMask.style.display = focusUseMask ? 'block' : 'none';
      ['pointerdown','mousedown','click','keydown'].forEach(type=>{
        document.addEventListener(type, blockOutside, true);
      });
      if(!focusReflow){
        focusReflow=setInterval(()=>{ if(!focusMode) return; try{ if(focusMenu) focusMenu.style.zIndex='2147483651'; }catch{} }, 400);
      }
    }
    function endFocus(){
      focusMode=false; focusMenu=null;
      if (focusUseMask && focusMask) focusMask.style.display='none';
      ['pointerdown','mousedown','click','keydown'].forEach(type=>{
        document.removeEventListener(type, blockOutside, true);
      });
      if(focusReflow){ clearInterval(focusReflow); focusReflow=null; }
    }
 
        function buildProcessingUI(total){
      ensureOverlayNodes();
      center.innerHTML = `<div style="font-weight:700;margin-bottom:8px">Processing ${total} song(s)…</div>
        <div style="display:flex;justify-content:space-between;align-items:center;opacity:.95;margin-bottom:6px">
          <div>⏱ <span id="yay-eta">—</span></div>
          <div>♪ <span id="yay-ctr">0/${total}</span></div>
        </div>
        <div class="yay-progress"><div id="yay-progbar"></div></div>
        <div style="display:flex;gap:10px;justify-content:space-between;margin-top:12px">
          <button class="yay-btn-suno" id="yay-cancel-proc">Cancel</button>
        </div>`;
      center.querySelector('#yay-cancel-proc').onclick = cancelRun;
    }


    function cancelRun(){
      const s = getState();
      if (!s){
        hideProcessing();
        hideBanner();
        stopStateTicker();
        return;
      }

      // Stop this run, keep partial data so the editor can still open
      s.running = false;
      setState(s);

      hideProcessing();
      hideBanner();
      stopStateTicker();

      if (s.origin) {
        location.href = s.origin;  // go back to playlist
      }
    }


    function ensureProcessingUIVisible(total){
      ensureOverlayNodes();
      if(!$('#yay-progbar')) buildProcessingUI(total||1);
      mask.style.display='block';
      center.style.display='block';
    }
    function showProcessing(total){
      buildProcessingUI(total);
      mask.style.display='block'; center.style.display='block';
      const st=getState(); if(st) updateOverlayProgress(st.i||0, total || (st.urls?.length||1), st.stats);
      if (etaTimer) clearInterval(etaTimer);
      etaTimer = setInterval(()=>{ const s=getState(); if(s && s.running){ ensureProcessingUIVisible(s.urls?.length||total); updateOverlayProgress(s.i||0, s.urls?.length||total, s.stats); } }, 300);
    }
    function fmtDur(ms){
      if (!isFinite(ms) || ms == null || ms < 0) return '—';
      const s = Math.round(ms/1000);
      const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
      if (h>0) return `~${h}h ${m}m`;
      if (m>0) return `~${m}m ${sec}s`;
      return `~${sec}s`;
    }
    function updateOverlayProgress(done,total,stats){
      const prog=$('#yay-progbar'); if(prog) prog.style.width=`${Math.round((done/Math.max(1,total))*100)}%`;
      const ctr=$('#yay-ctr'); if(ctr) ctr.textContent=`${done}/${total}`;
 
      // Estimate remaining using either learned avg or base-per-song (+ waiting growth handled in banner)
      let remainingMs = NaN;
      if (stats && isFinite(stats.avg)) remainingMs = Math.max(0, total - done) * stats.avg;
      else remainingMs = Math.max(0, total - done) * getEtaBaseMs();
 
      const etaEl=$('#yay-eta'); if (etaEl) etaEl.textContent = fmtDur(remainingMs);
 
      // Mirror into the banner line as well (banner has its own timer too)
      const bCtr = $('#yay-run-ctr'); if (bCtr) bCtr.textContent = `${done}/${total}`;
      const bEta = $('#yay-run-eta'); if (bEta) bEta.textContent = fmtDur(remainingMs);
    }
    function keepProcessingVisible(){
  const st = getState();
  if (!st) return;

  // In assisted WAV mode + "wait" phase we MUST let you click,
  // so hide the blocking modal / blur and do nothing.
  if (CAPTURE_WAV_URL && st.phase === 'wait') {
    hideProcessing();
    return;
  }

  // Only show the big overlay when we’re actually auto-processing (phase 'proc')
  ensureProcessingUIVisible(st.urls?.length || 1);
  updateOverlayProgress(st.i || 0, st.urls?.length || 1, st.stats);
}

    function hideProcessing(){ if(center) center.style.display='none'; if(mask) mask.style.display='none'; etaTimer && clearInterval(etaTimer); }
    function toast(msg){ ensureOverlayNodes(); center.innerHTML=`<div style="font-weight:700">${esc(msg)}</div>`; center.style.display='block'; setTimeout(()=>center.style.display='none',1200); }
 
    /* --------------------------- RUNTIME VARS --------------------------- */

// --- state ticker (keeps the watchdog running) ----------------------
let stateTickTimer = null;
function startStateTicker(){
  if (stateTickTimer) return;
  stateTickTimer = setInterval(() => { try { checkStateAndAct(); } catch {} }, 300);
}
function stopStateTicker(){
  if (!stateTickTimer) return;
  clearInterval(stateTickTimer);
  stateTickTimer = null;
}


    let selecting = false, hostBar, pillWrap, segIcon, segBtn, badge;
    let moCards;
let scraping = false;
 
    /* ===== Editor modal ===== */
    const modal = document.createElement('div'); modal.className='yay-modal'; document.body.appendChild(modal);
    modal.innerHTML = `<div class="yay-header">
      <div class="yay-header-left">
        <div class="yay-segwrap" id="yay-format">
          <button data-fmt="Album" class="active">Album</button>
          <button data-fmt="EP">EP</button>
          <button data-fmt="Single">Single</button>
        </div>
        <div class="yay-titlelock" id="yay-titlewrap">
          <input id="yay-title" placeholder="Album / EP Title…">
          <button class="lockbtn" id="yay-title-btn">✓</button>
        </div>
      </div>
      <div class="yay-actions">
        <button class="yay-btn-suno" id="yay-bulkbtn">Bulk Fill</button>
        <button class="yay-btn-suno" id="yay-datebtn">Release Date</button>
        <button class="yay-btn-suno" id="yay-csv">Download CSV</button>
        <span class="yay-divider"></span>
        <button class="yay-btn-suno white" id="yay-publish" disabled>Publish</button>
        <button class="yay-btn-suno" id="yay-close">Cancel</button>
      </div>
    </div>
    <div class="yay-bulkbar" id="yay-bulkbar">
      <strong>Bulk Fill - Select a source cell then press 'Insert Data'</strong>
      <div style="flex:1"></div>
      <button class="yay-btn-suno" id="yay-insert" style="display:none">Insert data</button>
      <button class="yay-btn-suno" id="yay-cancel-fill">Cancel fill</button>
    </div>
    <div class="yay-table">
      <div class="yay-wrap" id="yay-wrap"><div class="tbl"></div><div class="yay-dropline" id="yay-drop"></div></div>
    </div>`;
 
    const wrap = modal.querySelector('#yay-wrap');
    const dropLine = modal.querySelector('#yay-drop');
    let fmt='Album', titleLocked=false, releaseDateISO='';
    let bulkMode=false, bulkField=null, bulkValue=null, bulkSrcTd=null;
    let currRows=[], stickyW={}, lastCols=[];
 
 
    /* -------- Audio Progress Modal (simplified) -------- */
    const audioModal = document.createElement('div'); audioModal.className='yay-audio-modal'; document.body.appendChild(audioModal);
    audioModal.innerHTML = `
      <div class="yay-header">
        <div class="yay-header-left"><span id="yay-audio-title" style="font-weight:700">Uploading audio files…</span></div>
        <div class="yay-right-pill">ETA <span id="yay-audio-eta">—</span></div>
      </div>
      <div class="yay-audio-body">
        <table class="yay-audio-table" id="yay-audio-table">
          <thead><tr><th>Song</th><th>Status</th></tr></thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="yay-audio-footer">
        <button class="yay-btn-suno white" id="yay-audio-close" style="display:none">Close</button>
      </div>
    `;
 
    let audioPollTimer=null, audioEtaTimer=null;
    let audioJob = null;
 
    function playDoneSound(){
  if (!ENABLE_DONE_SOUND) return;
 
  // Try TTS first
  try {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(DONE_VOICE_TEXT);
      u.lang   = DONE_VOICE_LANG;
      u.rate   = DONE_VOICE_RATE;
      u.pitch  = DONE_VOICE_PITCH;
      u.volume = DONE_VOICE_VOL;
 
      const speak = () => {
        const voices = speechSynthesis.getVoices() || [];
        const byHint = DONE_VOICE_HINTS
          .map(h => voices.find(v => v && v.name && v.name.includes(h)))
          .find(Boolean);
        const byLang = voices.find(v => v && v.lang && v.lang.startsWith(DONE_VOICE_LANG));
        u.voice = byHint || byLang || voices[0] || null;
        speechSynthesis.speak(u);
      };
 
      if ((speechSynthesis.getVoices() || []).length) speak();
      else {
        const once = () => { speechSynthesis.onvoiceschanged = null; speak(); };
        speechSynthesis.onvoiceschanged = once;
        setTimeout(() => { if (!speechSynthesis.speaking) speak(); }, 400);
      }
      return;
    }
  } catch(e) { /* fall through to beep */ }
 
  // Fallback: short beep with adjustable gain
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(880, ctx.currentTime);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(DONE_BEEP_PEAK, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001,       ctx.currentTime + 0.5);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.55);
  } catch {}
}
 
 
    function buildAudioTable(rows){
  const tbody = audioModal.querySelector('tbody');
  tbody.innerHTML = rows.map(r=>{
    const id = r.suno_id || getSunoId(r.suno_url) || r.title || Math.random().toString(36).slice(2,8);
 
    const display = [
      toArtistDisplay(r.primary_artist),
      String((r.release_title || r.title || '(untitled)')).trim()
    ].filter(Boolean).join(' - ');
 
    return `<tr data-id="${esc(id)}">
      <td title="${esc(display)}">${esc(display)}</td>
      <td class="status"><span class="yay-status pending"><span class="dot"></span> Pending</span></td>
    </tr>`;
  }).join('');
  const map = new Map();
  tbody.querySelectorAll('tr').forEach(tr=>map.set(tr.getAttribute('data-id'), tr));
  return map;
}
 
 
    function setAllUploaded(){
      if (!audioJob) return;
      audioJob.tableMap.forEach(tr=>{
        const td = tr.querySelector('.status');
        td.innerHTML = `<span class="yay-status uploaded"><span class="dot"></span> Uploaded</span>`;
      });
    }
    function openAudioProgress(rows, opts){
      modal.style.display='none';
      const total = rows.length;
      const tableMap = buildAudioTable(rows);
      const avg = getEtaBaseMs();
      const estTotal = total * avg + ETA_UPLOAD_PAD_MS; // add a fixed pad
 
      audioJob = {
        jobId: (opts && opts.jobId) || (`job_${Date.now()}_${Math.random().toString(36).slice(2,8)}`),
        total, tableMap,
        statusPollUrl: (opts && opts.statusPollUrl) || MAKE_STATUS_POLL,
        startTs: Date.now(), estTotalMs: estTotal
      };
 
      const closeBtn = audioModal.querySelector('#yay-audio-close');
      closeBtn.onclick = ()=>{ audioModal.style.display='none'; if (mask) mask.style.display='none'; };
 
      // ETA in header
      const etaSpan = audioModal.querySelector('#yay-audio-eta');
      if (audioEtaTimer) { clearInterval(audioEtaTimer); audioEtaTimer=null; }
      audioEtaTimer = setInterval(()=>{
        const elapsed = Date.now() - audioJob.startTs;
        const remain = Math.max(0, audioJob.estTotalMs - elapsed);
        etaSpan.textContent = fmtDur(remain);
      }, 300);
      etaSpan.textContent = fmtDur(audioJob.estTotalMs);
 
      audioModal.querySelector('#yay-audio-title').textContent = 'Uploading audio files…';
      audioModal.style.display='flex';
 
      if (!audioJob.statusPollUrl){
  setAllUploaded();
  audioModal.querySelector('#yay-audio-title').textContent = 'All audio files uploaded';
  const etaPill = audioModal.querySelector('.yay-right-pill');
  if (etaPill) etaPill.style.display = 'none';
  closeBtn.style.display = 'inline-flex';
  if (audioEtaTimer){ clearInterval(audioEtaTimer); audioEtaTimer = null; }
  playDoneSound();
  return;
}
 
 
      if (audioPollTimer){ clearInterval(audioPollTimer); audioPollTimer=null; }
      audioPollTimer = setInterval(()=>{
        GM_xmlhttpRequest({
          method: 'GET',
          url: `${audioJob.statusPollUrl}?job_id=${encodeURIComponent(audioJob.jobId)}`,
          headers: { 'Accept': 'application/json' },
          onload: (res) => {
            try{
              if (res.status < 200 || res.status >= 300) return;
              const data = JSON.parse(res.responseText||'{}');
              const status = String(data.status || data.state || '').toLowerCase();
              const msg    = String(data.message || '').toLowerCase();
              const done   = !!(data.done === true || /^(done|finished|completed|ok)$/.test(status) || msg === 'done');
 
              if (done){
  setAllUploaded();
  audioModal.querySelector('#yay-audio-title').textContent = 'All audio files uploaded';
 
  // hide ETA once everything is finished
  const etaPill = audioModal.querySelector('.yay-right-pill');
  if (etaPill) etaPill.style.display = 'none';
 
  closeBtn.style.display = 'inline-flex';
  if (audioPollTimer){ clearInterval(audioPollTimer); audioPollTimer = null; }
  if (audioEtaTimer){ clearInterval(audioEtaTimer); audioEtaTimer = null; }
  playDoneSound();
}
 
            } catch{}
          }
        });
      }, 30000);
    }
 
    /* --------------------------- INIT ----------------------------- */
    initUI();
    checkStateAndAct();
 
    function initUI() {
  if (isPlaylistPage()) {
    attachButtons();
    monitorCards();
    markProcessedOnPage();
    startBlurGuard();
  }
  ensureOverlayNodes();
  const st = getState();

  if (st && st.running) {
    keepProcessingVisible();
    startStateTicker();                // <-- start ticker when a run is active
  }

  // stale run guard
  if (st && st.running && Date.now() - (st.ts || 0) > 3600000) {
    clearState();
    hideProcessing();
    stopStateTicker();                 // <-- stop ticker if we clear the run
  }
}

 
    /* ---------------------- Top “Release” -------------------- */
    const RELEASE_ICON_DATA = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KCjwhLS0gTGljZW5zZTogQ0MgQXR0cmlidXRpb24uIE1hZGUgYnkgU21hcnRpY29uczogaHR0cHM6Ly9naXRodWIuY29tL2ZyZXh5L2dseXBoLWljb25zZXQgLS0+Cjxzdmcgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIC0wLjUgMTcgMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgY2xhc3M9InNpLWdseXBoIHNpLWdseXBoLWRpc2MtYWRkIj4KCjx0aXRsZT45MDU8L3RpdGxlPgoKPGRlZnM+Cgo8L2RlZnM+Cgo8ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KCjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuMDAwMDAwLCAwLjAwMDAwMCkiIGZpbGw9IiM0MzQzNDMiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNi4wMDAwMDAsIDYuMDAwMDAwKSI+Cgo8cmVjdCB4PSI0IiB5PSI2IiB3aWR0aD0iNS45MzgiIGhlaWdodD0iMS45NjkiIGNsYXNzPSJzaS1nbHlwaC1maWxsIj4KCjwvcmVjdD4KCjxyZWN0IHg9IjYiIHk9IjQiIHdpZHRoPSIxLjk3IiBoZWlnaHQ9IjUuOTM4IiBjbGFzcz0ic2ktZ2x5cGgtZmlsbCI+Cgo8L3JlY3Q+Cgo8cGF0aCBkPSJNMS45ODgsMC4wMjIgQzAuODkyLDAuMDIyIDAuMDA4OTk5OTk5OTYsMC45MDggMC4wMDg5OTk5OTk5NiwxLjk5OSBDMC4wMDg5OTk5OTk5OSwzLjA5MSAwLjg5MywzLjk3NSAxLjk4OCwzLjk3NSBDMy4wNzksMy45NzUgMy45NjcsMy4wOTEgMy45NjcsMS45OTkgQzMuOTY3LDAuOTA4IDMuMDc5LDAuMDIyIDEuOTg4LDAuMDIyIEwxLjk4OCwwLjAyMiBaIiBjbGFzcz0ic2ktZ2x5cGgtZmlsbCI+Cgo8L3BhdGg+Cgo8L2c+Cgo8cGF0aCBkPSJNMTUuOTU4LDcuOTY5IEMxNS45NTgsMy41NTYgMTIuMzg1LDAuMDYzIDcuOTc5LDAuMDYzIEMzLjU3MywwLjA2MyAwLDMuNTU2IDAsNy45NjkgQzAsMTIuMzgxIDMuNTcyLDE1Ljk1OCA3Ljk3OSwxNS45NTggQzguMzE5LDE1Ljk1OCA4LjY1MywxNS45MzIgOC45OCwxNS44ODcgTDguOTgsMTAuOTUyIEM4LjY3MiwxMS4wNTggOC4zNDUsMTEuMTI1IDguMDAxLDExLjEyNSBDNi4yOCwxMS4xMjUgNC44ODYsOS43MTkgNC44ODYsNy45ODUgQzQuODg2LDYuMjUgNi4yODEsNC44NDMgOC4wMDEsNC44NDMgQzkuNzIsNC44NDMgMTEuMTE2LDYuMjQ5IDExLjExNiw3Ljk4NSBDMTEuMTE2LDguMzQxIDExLjA0NCw4LjY4IDEwLjkzNCw5IEwxNS44NjcsOSBDMTUuOTIsOC42NTIgMTUuOTU4LDguMzA3IDE1Ljk1OCw3Ljk2OSBMMTUuOTU4LDcuOTY5IFogTTUuMTUsMTEuNjc2IEwzLjYzMiwxMy4xOTQgTDIuNzY0LDEyLjMyNSBMNC4yODIsMTAuODA3IEw1LjE1LDExLjY3NiBMNS4xNSwxMS42NzYgWiBNMTEuNjEyLDUuMjc3IEwxMC43NDMsNC40MDggTDEyLjI2MSwyLjg5IEwxMy4xMywzLjc1OSBMMTEuNjEyLDUuMjc3IEwxMS42MTIsNS4yNzcgWiIgY2xhc3M9InNpLWdseXBoLWZpbGwiPgoKPC9wYXRoPgoKPC9nPgoKPC9nPgoKPC9zdmc+ ';
    function attachButtons() {
  // Only ever attach on real playlist URLs
  if (!isPlaylistPage()) return;
  if (hostBar) return; // already attached

  const interval = setInterval(() => {
    // If we navigated away from playlist, stop trying
    if (!isPlaylistPage()) {
      clearInterval(interval);
      return;
    }
    // If we already attached, stop trying
    if (hostBar) {
      clearInterval(interval);
      return;
    }

    const bars = document.querySelectorAll(SELECTORS.list.bar);
    let inspire = null;
    let host = null;

    for (const bar of bars) {
      const btn = [...bar.querySelectorAll('button')].find(
        x => /Inspire/i.test(x.textContent || '')
      );
      if (btn) {
        inspire = btn;
        host = bar;
        break;
      }
    }

    if (!host || !inspire) return; // keep polling until Inspire exists

    clearInterval(interval);
    hostBar = host;

    // Build the pill UI
    pillWrap = document.createElement('div');
    pillWrap.style.position = 'relative';

    segIcon = document.createElement('button');
    segIcon.className = 'yay-icon-seg';
    segIcon.innerHTML = `<img alt="" src="${RELEASE_ICON_DATA}">`;

    segBtn  = document.createElement('button');
    segBtn.className = 'yay-btn-suno yay-btn-glued';
    segBtn.textContent = 'Release';

    const container = document.createElement('div');
    container.className = 'yay-pill';
    container.append(segIcon, segBtn);

    badge = document.createElement('div');
    badge.className = 'yay-badge';
    badge.textContent = '0 selected';

    pillWrap.append(container, badge);

    // ⬅️ Key change: insert BEFORE the Inspire button when possible
    if (inspire && inspire.parentElement === host) {
      host.insertBefore(pillWrap, inspire);
    } else {
      host.appendChild(pillWrap);
    }

    segIcon.onclick = (e) => {
      e.stopPropagation();
      if (selecting) endSelecting();
    };

    segBtn.onclick = (e) => {
      e.stopPropagation();
      selecting ? startProcess() : beginSelecting();
    };
  }, 300);
}


    function setActiveVisuals(on) {
      if (on) {
        segIcon.classList.add('pink'); segIcon.textContent = '✕';
        segBtn.classList.add('white'); segBtn.textContent = selectedCountLabel();
        badge.style.display = selectedCount()>0 ? 'inline-block' : 'none';
      } else {
        segIcon.classList.remove('pink'); segIcon.innerHTML = `<img src="${RELEASE_ICON_DATA}" alt="" style="width:18px;height:18px;opacity:.9">`;
        segBtn.classList.remove('white'); segBtn.textContent = 'Release';
        badge.style.display = 'none';
      }
    }
    const selectedSet = new Set();
    function selectedCount(){ return selectedSet.size; }
    function selectedCountLabel(){ const n=selectedCount(); return n ? `Process ${n} song${n>1?'s':''}` : 'Select songs'; }
 
 
    /* --------------------------- Cards --------------------------- */
    function monitorCards() {
      wireCards();
      if (!moCards) {
        moCards = new MutationObserver(() => { wireCards(); markProcessedOnPage(); });
        moCards.observe(document.body, { childList: true, subtree: true });
      }
    }

    let lastClickIndex = -1;
function wireCards() {
  const cards = nodesForItems();

  cards.forEach((el, idx) => {
    if (el.dataset.yayCardWired) return;
    el.dataset.yayCardWired = '1';
    el.dataset.yayIndex = String(idx);

    // Re-apply selection visuals if already selected
    const id = getCardId(el);
    if (id && selectedSet.has(id)) {
      applySelectedVisual(el, [...selectedSet].indexOf(id) + 1);
    }

    // Card container click (works even when title is a <span>)
    el.addEventListener('click', (ev) => {
  if (!selecting) return;
  // make any click inside the row toggle selection
  ev.preventDefault();
  ev.stopPropagation();
  const i = Number(el.dataset.yayIndex || 0);
  if (ev.shiftKey && lastClickIndex >= 0) {
    rangeToggle(Math.min(lastClickIndex, i), Math.max(lastClickIndex, i));
  } else {
    singleToggle(el);
    lastClickIndex = i;
  }
  updateCount();
}, true);



    // Anchor inside the row — Suno sometimes lets anchors swallow events
    const anchors = Array.from(el.querySelectorAll(SELECTORS.list.titleA));
    // Prefer main song anchor, not the ?show_comments counter
    // Prefer main song anchor, not the ?show_comments counter
const mainA = anchors.find(a => {
  try {
    return !(new URL(a.href, location.origin)).searchParams.has('show_comments');
  } catch (e) {
    return true;
  }
}) || anchors[0];

    if (mainA && !mainA.dataset.yayAnchorWired){
      mainA.dataset.yayAnchorWired = '1';
      mainA.addEventListener('click', (ev) => {
        if (!selecting) return; // allow normal navigation outside Select mode
        ev.preventDefault();
        ev.stopPropagation();

        const i = Number(el.dataset.yayIndex || 0);
        if (ev.shiftKey && lastClickIndex >= 0) {
          rangeToggle(Math.min(lastClickIndex,i), Math.max(lastClickIndex,i));
        } else {
          singleToggle(el);
          lastClickIndex = i;
        }
        updateCount();
      }, true);
    }
  });
}

    function singleToggle(card){ const id=getCardId(card); if(!id) return; if (selectedSet.has(id)){ selectedSet.delete(id); clearSelectedVisual(card); renumberTags(); } else { selectedSet.add(id); applySelectedVisual(card, selectedSet.size); } }
    function rangeToggle(a,b){ const all=nodesForItems(); for(let i=a;i<=b;i++){ const el=all[i], id=getCardId(el); if(id && !selectedSet.has(id)){ selectedSet.add(id); applySelectedVisual(el, selectedSet.size); } } renumberTags(); }
    function applySelectedVisual(el,n){ el.classList.add('yay-selected'); let t=el.querySelector('.yay-tag'); if(!t){ t=document.createElement('div'); t.className='yay-tag'; el.appendChild(t);} t.textContent=String(n); }
    function clearSelectedVisual(el){ el.classList.remove('yay-selected'); el.querySelector('.yay-tag')?.remove(); }
    function renumberTags(){ const ids=[...selectedSet]; const map=new Map(ids.map((id,i)=>[id,i+1])); nodesForItems().forEach(el=>{ const id=getCardId(el), tag=el.querySelector('.yay-tag'); if(selectedSet.has(id)){ tag ? tag.textContent=String(map.get(id)) : applySelectedVisual(el,map.get(id)); } else tag?.remove(); }); }
    function updateCount(){ const n=selectedCount(); badge.textContent=`${n} selected`; badge.style.display=`${n?'inline-block':'none'}`; segBtn.textContent=selectedCountLabel(); }
    function beginSelecting(){ selecting=true; setActiveVisuals(true); updateCount(); }
    function endSelecting(){ selecting=false; setActiveVisuals(false); nodesForItems().forEach(clearSelectedVisual); selectedSet.clear(); lastClickIndex=-1; }
 
    /* --------- Assisted WAV capture (no BLUR while selecting) --------- */
    const RETRY_TOKEN = '__RETRY__';
    async function handleUpsellRetry(){
      showBanner('Error — Retrying…', 'error');
      endFocus(); escClose();
      await sleep(1500);
      location.reload();
      return RETRY_TOKEN;
    }
 

// --- user gesture gate (only accept WAV after a real click) ---
let lastUserClickTs = 0;
let userClickGateOn = false;

function yayOnAnyClick(e){
  try {
    const t = e.target;
    const txt  = (t.innerText || t.textContent || '').toLowerCase();
    const attr = ((t.getAttribute?.('href') || t.getAttribute?.('aria-label') || t.getAttribute?.('title')) || '').toLowerCase();
    const inMenu = t.closest?.('[role="menu"],[data-radix-dropdown-menu-content],[data-radix-popper-content-wrapper]');
    const looksLikeDownload = /\b(download|wav|wav audio)\b/i.test(txt) || /\b(download|wav)\b/i.test(attr);
    const isWavLink = (t instanceof HTMLAnchorElement) && /\.wav(\?|$)/i.test(t.href || '');

    if (inMenu && looksLikeDownload || isWavLink) {
      lastUserClickTs = Date.now();
      const st = getState(); if (st){ st.phase = 'proc'; setState(st); }
      showBanner('Processing…', 'proc');
    }
  } catch {}
}

function armUserClickGate(){
  if (userClickGateOn) return;
  userClickGateOn = true;
  document.addEventListener('click', yayOnAnyClick, true);
}
function disarmUserClickGate(){
  if (!userClickGateOn) return;
  userClickGateOn = false;
  document.removeEventListener('click', yayOnAnyClick, true);
}



   async function captureOfficialWavUrl(){
  try{
    try { hideProcessing?.(); } catch {}

    injectUltraWavSniffer();
    armUserClickGate();

    const st0 = getState();
    if (st0) {
      st0.phase = 'wait';
      setState(st0);
    }

    try {
      unsafeWindow.__lastWav = '';
      if (Array.isArray(unsafeWindow.__wavHits))    unsafeWindow.__wavHits.length = 0;
      if (unsafeWindow.__wavSeenHttps)              unsafeWindow.__wavSeenHttps.clear?.();
      if (Array.isArray(unsafeWindow.__wavForced))  unsafeWindow.__wavForced.length = 0;
      if (unsafeWindow.__wavSeenForced)             unsafeWindow.__wavSeenForced.clear?.();
      if (Array.isArray(unsafeWindow.__wavHitsAll)) unsafeWindow.__wavHitsAll.length = 0;
    } catch {}

    await sleep(400);

    let wavBtn = null;
    let downloadClicked = false;        // 👈 local flag

    const menu = await openKebabMenu();
    if (menu){
      const maybe = await clickDownloadThenFindWavBtn(menu);
      if (maybe){
        wavBtn = maybe;
        const menuRoot =
          wavBtn.closest('[role="menu"]') ||
          wavBtn.closest('[data-radix-popper-content-wrapper]') ||
          menu;

        beginFocus(menuRoot, { noMask:true, allowOutside:true });
        wavBtn.classList.add('yay-hilite');

        wavBtn.addEventListener('click', () => {
          downloadClicked = true;       // 👈 mark that WE saw the click
          try { lastUserClickTs = Date.now(); } catch {}
          const stc = getState();
          if (stc){
            stc.phase = 'proc';
            setState(stc);
          }
          showBanner('Processing…', 'proc');
        }, { once:true });
      }
    }

    showBanner('Click "Download → WAV Audio"', 'wait');

    const deadline = Date.now() + WAIT_USER_CLICK_MAX_MS;

    while (Date.now() < deadline){
      await sleep(120);

      // just for UI; optional
      try {
        if (downloadClicked) {
          const stc = getState();
          if (stc && stc.phase !== 'proc'){
            stc.phase = 'proc';
            setState(stc);
          }
          if (currentBannerMode !== 'proc') {
            showBanner('Processing…', 'proc');
          }
        }
      } catch {}

      if (currentBannerMode === 'proc' && isUpsellOpen()){
        disarmUserClickGate();
        return await handleUpsellRetry();
      }

// ✅ new gate: only after the actual WAV button click
      // if (!downloadClicked) {
      //   continue;
      // }
      const hits = []
        .concat(unsafeWindow.__wavHits   || [])
        .concat(unsafeWindow.__wavForced || []);

      const found = hits.find(u =>
        /^https?:/i.test(u) && (
          /\.wav(\?|$)/i.test(u) ||
          /(?:[?&](?:format|type|ext)=wav)(?:[&#]|$)/i.test(u) ||
          /(?:[?&](?:filename|response-content-disposition)=[^&]*\.wav)/i.test(u)
        )
      ) || (unsafeWindow.__wavForced || [])[0];

      if (found){
        try { wavBtn?.classList.remove('yay-hilite'); } catch {}
        endFocus();
        escClose();

        setTimeout(() => {
          ensureFocusMask();
          if (focusMask) focusMask.style.display = 'block';
          document.body.classList.add('yay-proc');
        }, 0);

        try {
          const st2 = getState();
          if (st2 && st2.running && st2.partials && st2.partials[st2.i]) {
            st2.partials[st2.i].wav_url = found;
            st2.__captured_at = Date.now();
            setState(st2);
          }
        } catch {}

        logW('🎯 captured official WAV URL (assisted, after click):', found);
        disarmUserClickGate();
        return found;
      }
    }

    try { wavBtn?.classList.remove('yay-hilite'); } catch {}
    endFocus();
    escClose();
    disarmUserClickGate();
    return '';
  } catch (e){
    endFocus();
    disarmUserClickGate();
    logW('captureOfficialWavUrl error:', e && e.message);
    return '';
  }
}




 
    /* --------------------------- Editor modal logic --------------------------- */
    modal.querySelectorAll('#yay-format button').forEach(btn=>{
      btn.onclick=()=>{ modal.querySelectorAll('#yay-format button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); fmt=btn.dataset.fmt; toggleTitleWrap(); validatePublish(); maybeInjectFormatColumns(); };
    });
    const titleWrap = modal.querySelector('#yay-titlewrap');
    function toggleTitleWrap(){ titleWrap.style.display=(fmt==='Single'?'none':'flex'); }
    modal.querySelector('#yay-title-btn').onclick=()=>{
      if (!titleLocked){
        titleLocked=true; titleWrap.classList.add('locked');
        modal.querySelector('#yay-format').classList.add('fmt-disabled');
        modal.querySelector('#yay-title-btn').textContent='✎';
      } else {
        titleLocked=false; titleWrap.classList.remove('locked');
        modal.querySelector('#yay-format').classList.remove('fmt-disabled');
        modal.querySelector('#yay-title-btn').textContent='✓';
      }
      validatePublish(); maybeInjectFormatColumns();
    };
    modal.querySelector('#yay-title').oninput = validatePublish;
 
    modal.querySelector('#yay-bulkbtn').onclick=()=>enterBulk();
    modal.querySelector('#yay-cancel-fill').onclick=()=>exitBulk();
    modal.querySelector('#yay-insert').onclick=()=>applyBulk();
 
    modal.querySelector('#yay-datebtn').onclick = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  const m = document.createElement('div');
  m.className = 'yay-menu';
  m.innerHTML = `
    <div class="list">
      <input type="date" class="srch" id="yay-datepick">
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button class="yay-btn-suno">OK</button>
    </div>`;
  m.style.left = r.left + 'px';
  m.style.top  = (r.bottom + 6) + 'px';
 
  const closer = (ev) => { if (!m.contains(ev.target)) { m.remove(); document.removeEventListener('mousedown', closer, true); } };
  setTimeout(() => document.addEventListener('mousedown', closer, true), 0);
 
  m.querySelector('.yay-btn-suno').onclick = () => {
    const raw = m.querySelector('#yay-datepick').value; // raw is already YYYY-MM-DD
    if (raw) {
      releaseDateISO = raw; // store ISO for export
      const [y, mn, d] = raw.split('-');                // pretty label for UI only
      const nice = `${d}/${mn}/${y}`;
      modal.querySelector('#yay-datebtn').textContent = `RD: ${nice}`;
      maybeInjectReleaseDateColumn();
    }
    m.remove();
    document.removeEventListener('mousedown', closer, true);
  };
  document.body.appendChild(m);
};
 
 
    modal.querySelector('#yay-csv').onclick=()=>downloadCSV(readTable());
    modal.querySelector('#yay-close').onclick=()=>{ modal.style.display='none'; hideProcessing(); };
 
    let publishLocked = false;
    modal.querySelector('#yay-publish').onclick=()=>{
      if (publishLocked) return;
      publishLocked = true;
      const b = modal.querySelector('#yay-publish');
      b.textContent = 'Publishing…';
      b.classList.add('publishing');
      b.disabled = true;
      sendToN8n(readTable()); // stays locked for session (even on error)
    };
 
function resetPublishUI(){
  publishLocked = false;
  const b = modal.querySelector('#yay-publish');
  if (!b) return;
  b.textContent = 'Publish';
  b.classList.remove('publishing');
  b.disabled = !allowPublish(currRows.length); // keep normal enable/disable logic
}
 
 
    function openEditor(rows){
      if (!rows.length) return;
      if (rows.length===1) fmt='Single'; else if (rows.length<=5) fmt='EP'; else fmt='Album';
      modal.querySelectorAll('#yay-format button').forEach(b=>b.classList.toggle('active', b.dataset.fmt===fmt));
      toggleTitleWrap();
      titleLocked=false;
      modal.querySelector('#yay-title-btn').textContent='✓';
      titleWrap.classList.remove('locked'); modal.querySelector('#yay-format').classList.remove('fmt-disabled');
      currRows = rows.map((r,i)=>({ order:i+1, ...r }));
currRows.forEach(r => autoFillDerivedForRow(r, { force: false }));
      buildGrid();
      modal.style.display='flex';
      ensureOverlayNodes(); mask.style.display='block';
      validatePublish();
    }
 
    function buildGrid(){
      const base = [
        { key:'drag', label:'⇅', sticky:1, width:48 },
        { key:'order', label:'#', sticky:2, editableNumber:true, width:56 },
        { key:'title', label:'Title', sticky:3, readonlyText:true, width:240 },
        { key:'duration', label:'Duration' },
        { key:'wav_url', label:'WAV URL' },
        { key:'suno_url', label:'Suno URL' },
        { key:'account', label:'Account' },
        { key:'genre', label:'Genre', dropdown:'genre' },
        { key:'type', label:'Type', dropdown:'simple' },
        { key:'primary_artist', label:'Primary Artist' },
        { key:'featured_artist', label:'Featured Artist' },
        { key:'release_title', label:'Release Title' },
        { key:'version', label:'Version' },
        { key:'original_release', label:'Original Release' },
        { key:'mood', label:'Mood', dropdown:'simple' },
        { key:'lyrics_origin', label:'Lyrics Origin', dropdown:'simple' },
        { key:'created_by', label:'Created by', dropdown:'simple' },
        { key:'track_language', label:'Track Language', dropdown:'lang' },
        { key:'potential', label:'Potential', dropdown:'simple' },
        { key:'styles', label:'Styles', textarea:true, grow:true },
        { key:'lyrics', label:'Lyrics', textarea:true, grow:true },
{ key:'c_line',              label:'C line' },
{ key:'p_line',              label:'P line' },
{ key:'publisher',           label:'Publisher' },
{ key:'brand',               label:'Brand' },
{ key:'label',               label:'Label' },
{ key:'production_credits',  label:'Production Credits' },
{ key:'lyrics_credits',      label:'Lyrics Credits' },
{ key:'music_credits',       label:'Music Credits' }
      ];
      const cols = injectExtras(base);
lastCols = cols;
 
      const thead = `<tr>${cols.map(c=>`<th data-col="${c.key}" class="${c.sticky ? `yay-sticky ${c.sticky===2?'two':c.sticky===3?'three':''}`:''}">${esc(c.label)}</th>`).join('')}</tr>`;
      const body  = currRows.map((r,i)=>`<tr data-i="${i}">${cols.map(c=>tdHTML(c,r)).join('')}</tr>`).join('');
      wrap.querySelector('.tbl').innerHTML = `<table class="yay-grid"><thead>${thead}</thead><tbody>${body}</tbody></table>`;
      stickyW = stickyOffsets(cols);
      applySticky(cols);
      fitColumns(cols);
      wireGrid(cols);
flagEmptyWavCells();
stabilizeMoodCells();
    }
    function injectExtras(cols){
      const out = cols.slice();
      if (fmt!=='Single'){
        if (!out.find(c=>c.key==='format')) out.splice(3,0,{ key:'format', label:'Format', readonlyText:true });
        if (!out.find(c=>c.key==='album_ep_title')) out.splice(4,0,{ key:'album_ep_title', label:'Album/EP Title', readonlyText:true });
      } else {
        return out.filter(c=>c.key!=='format' && c.key!=='album_ep_title');
      }
      if (releaseDateISO && !out.find(c=>c.key==='release_date')) out.push({ key:'release_date', label:'Release Date', readonlyText:true });
      return out;
    }
    function maybeInjectFormatColumns(){
      if (fmt!=='Single' && titleLocked){
        const t = modal.querySelector('#yay-title').value.trim();
        currRows.forEach(r => { r.format=fmt; r.album_ep_title=t; });
      } else {
        currRows.forEach(r => { delete r.format; delete r.album_ep_title; });
      }
      buildGrid();
    }
    function maybeInjectReleaseDateColumn(){
  if (releaseDateISO){
    currRows.forEach(r => r.release_date = releaseDateISO);
    buildGrid();
  }
}
 
 
    function tdHTML(c,r){
  const st = c.sticky ? `yay-sticky ${c.sticky===2?'two':c.sticky===3?'three':''}` : '';
 
  if (c.key==='drag')  return `<td class="${st} last-sticky yay-handle" data-col="drag" title="Drag to reorder">☰</td>`;
  if (c.editableNumber && c.key==='order') return `<td class="${st} last-sticky" data-col="order"><input type="number" min="1" value="${r.order}"></td>`;
  if (c.readonlyText)  return `<td class="${st} last-sticky" data-col="${c.key}"><div style="padding:6px 2px">${esc(r[c.key] ?? (c.key==='title'?r.title:''))}</div></td>`;
 
if (c.key === 'wav_url') {
  const empty = !(r.wav_url && String(r.wav_url).trim());
  return `<td data-col="wav_url" class="${empty ? 'yay-need-wav' : ''}"><input value="${esc(r.wav_url || '')}"></td>`;
}
 
 
  if (c.dropdown==='genre'){
    const val=r.genre||'—';
    return `<td data-col="genre"><button class="yay-chipbtn ${val!=='—'?'hasVal':''}" data-menu="genre"><span class="v">${esc(val)}</span><span class="x">×</span><span>▾</span></button></td>`;
  }
 
  if (c.dropdown==='simple'){
    const key=c.key;
 
    // Special: Mood is an array of tags → render as chips with per-tag remover
    if (key==='mood'){
  const arr = Array.isArray(r.mood)
    ? r.mood
    : String(r.mood || '').split(',').map(s=>s.trim()).filter(Boolean);
 
  const label = arr.length ? esc(arr.join(', ')) : '—';
  return `<td data-col="${key}">
    <button class="yay-chipbtn ${arr.length?'hasVal':''}" data-menu="simple" data-key="${key}">
      <span class="v">${label}</span><span class="x">×</span><span>▾</span>
    </button>
  </td>`;
}
 
 
    const val=r[key]||'—';
    return `<td data-col="${key}"><button class="yay-chipbtn ${val!=='—'?'hasVal':''}" data-menu="simple" data-key="${key}"><span class="v">${esc(val)}</span><span class="x">×</span><span>▾</span></button></td>`;
  }
 
  if (c.dropdown==='lang'){
    const val=r.track_language||'—';
    return `<td data-col="track_language"><button class="yay-chipbtn ${val!=='—'?'hasVal':''}" data-menu="lang"><span class="v">${esc(val)}</span><span class="x">×</span><span>▾</span></button></td>`;
  }
 
  if (c.textarea) return `<td data-col="${c.key}"><textarea>${esc(r[c.key] || '')}</textarea></td>`;
  return `<td data-col="${c.key}"><input value="${esc(r[c.key] || '')}"></td>`;
}
 
    function wireGrid(cols){
      const tbl = wrap.querySelector('table');
      let ghost=null, startIndex=0, overIndex=0, draggingRow=null;
      tbl.querySelectorAll('td[data-col="drag"]').forEach(td=>{
        td.onmousedown=(e)=>{
          draggingRow=td.closest('tr'); startIndex=Number(draggingRow.dataset.i);
          ghost=document.createElement('div'); ghost.className='yay-ghost';
          ghost.textContent=draggingRow.querySelector('td[data-col="title"]').innerText.trim();
          document.body.appendChild(ghost);
          document.addEventListener('mousemove', onMm);
          document.addEventListener('mouseup', onMu, { once:true });
          e.preventDefault();
        };
      });
      const onMm=(e)=>{
        if(!ghost) return;
        ghost.style.transform=`translate(${e.clientX+12}px, ${e.clientY+12}px)`;
        const rows=Array.from(tbl.querySelectorAll('tbody tr'));
        let target=null, pos='below';
        for (const r of rows){
          const rect=r.getBoundingClientRect();
          if (e.clientY>=rect.top && e.clientY<=rect.bottom){ target=r; pos=(e.clientY < (rect.top + rect.height/2))?'above':'below'; break; }
        }
        if (target){
          overIndex=Number(target.dataset.i) + (pos==='below'?1:0);
          const gridRect=wrap.getBoundingClientRect();
          dropLine.style.display='block';
          dropLine.style.top=(target.getBoundingClientRect()[pos==='above'?'top':'bottom'] - gridRect.top + wrap.scrollTop) + 'px';
        }
      };
      const onMu=()=>{
        dropLine.style.display='none';
        document.removeEventListener('mousemove', onMm);
        ghost?.remove(); ghost=null;
        if (draggingRow!=null){
          const item=currRows.splice(startIndex,1)[0];
          const clamp=Math.max(0, Math.min(currRows.length, overIndex));
          currRows.splice(clamp,0,item);
          currRows.forEach((r,i)=>r.order=i+1);
          buildGrid();
requestAnimationFrame(stabilizeMoodCells);
          draggingRow=null;
        }
      };
      tbl.querySelectorAll('td[data-col="order"] input').forEach((inp,rowI)=>{
        inp.onchange=()=>{
          let val=Math.max(1, Math.min(currRows.length, Number(inp.value)||1));
          const item=currRows.splice(rowI,1)[0];
          currRows.splice(val-1,0,item);
          currRows.forEach((r,i)=>r.order=i+1);
          buildGrid();
requestAnimationFrame(stabilizeMoodCells);
        };
      });
      tbl.querySelectorAll('td input:not([type="number"]), td textarea').forEach(el=>{
  el.oninput=()=>{
    const tr  = el.closest('tr');
    const i   = Number(tr.dataset.i);
    const key = el.closest('td').dataset.col;

    currRows[i][key] = el.value;

    if (key === 'duration')  currRows[i].duration_seconds = parseDuration(el.value);
    if (key === 'suno_url')  currRows[i].suno_id         = getSunoId(el.value);

    if (key === 'wav_url') {
      const td = el.closest('td');
      td.classList.toggle('yay-need-wav', !el.value.trim());
      flagEmptyWavCells(); // full re-check after edit
    }

    if (key === 'primary_artist') {
      // Always refresh C/P/Publisher/Brand/Label when artist changes.
      autoFillDerivedForIndex(i, { force: true });
    }
  };
});


 

      // Clear-all (chip big "×")
tbl.querySelectorAll('.yay-chipbtn .x').forEach(x=>{
  x.onclick=(ev)=>{
    ev.stopPropagation();
    const btn = ev.currentTarget.parentElement;
    const td  = btn.closest('td');
    const i   = Number(btn.closest('tr').dataset.i);
    const key = td.dataset.col;
 
    btn.classList.remove('hasVal');
    btn.querySelector('.v').textContent = '—';
 
    if (key === 'mood') {
      currRows[i].mood = [];
      fitColumns(cols);
      stabilizeMoodCells();
    } else {
      // Clear the underlying value for any chip field.
      currRows[i][key] = '';
      // If we cleared Created by, also clear/refresh credit fields.
      if (key === 'created_by') autoFillDerivedForIndex(i, { force: true });
    }
  };
});
 
 
 
 
 
 
 
 
 
 
 
 
      tbl.querySelectorAll('button[data-menu="genre"]').forEach(btn=>{
        btn.onclick=(ev)=>{
          if (bulkMode && !bulkField){ pickBulkSourceFrom(btn.closest('td')); return; }
          if (bulkMode) return;
          showMenu(btn,'genre',GENRE_OPTIONS,true,(val)=>{
            const i=rowIndex(btn); currRows[i].genre=val; btn.querySelector('.v').textContent=val||'—'; btn.classList.toggle('hasVal', !!val && val!=='—');
          });
        };
      });
      tbl.querySelectorAll('button[data-menu="simple"]').forEach(btn => {
  btn.onclick = () => {
    if (bulkMode && !bulkField){ pickBulkSourceFrom(btn.closest('td')); return; }
    if (bulkMode) return;
 
    const key = btn.dataset.key;
    const i   = rowIndex(btn);
 
    if (key === 'mood') {
      const pre = Array.isArray(currRows[i].mood)
        ? currRows[i].mood
        : (currRows[i].mood ? String(currRows[i].mood).split(',').map(s=>s.trim()).filter(Boolean) : []);
 
      // grouped multi-select just for Mood
      showMenu(btn, 'mood', MOOD_GROUPS, true, (vals) => {
  const arr = Array.isArray(vals) ? vals : [vals].filter(Boolean);
  currRows[i].mood = arr;   // keep array (backend unchanged)
 
  const v = btn.querySelector('.v');
  v.textContent = arr.length ? arr.join(', ') : '—';
  btn.classList.toggle('hasVal', arr.length > 0);
 
  fitColumns(cols);
  stabilizeMoodCells();
}, { multi: true, preselect: pre, placeholder: 'Search moods…' });
 
 
      return;
    }
 
    // --- other simple dropdowns (unchanged) ---
    const opts =
      key === 'type'          ? ['Cu Versuri','Instrumental'] :
      key === 'lyrics_origin' ? ['Original','AI','Copyrighted']   :
      key === 'created_by'    ? CREATED_BY                  :
      key === 'potential'     ? ['HIT']                     : [];
 
    showMenu(btn,'simple',opts,false,(val)=>{
      currRows[i][key] = val;
      const v = btn.querySelector('.v');
      v.textContent = val || '—';
      btn.classList.toggle('hasVal', !!val && val !== '—');
if (key === 'created_by') autoFillDerivedForIndex(i, { force: true }); // ← NEW
    });
  };
});
 
 
// Track Language dropdown
tbl.querySelectorAll('button[data-menu="lang"]').forEach(btn=>{
  btn.onclick = () => {
    if (bulkMode && !bulkField){ pickBulkSourceFrom(btn.closest('td')); return; }
    if (bulkMode) return;
 
    showMenu(btn, 'lang', LANG_OPTIONS, true, (val)=>{
      const i = rowIndex(btn);
      currRows[i].track_language = val;
      const v = btn.querySelector('.v');
      v.textContent = val || '—';
      btn.classList.toggle('hasVal', !!val && val !== '—');
    });
  };
});
 
 
 
      function pickBulkSourceFrom(td){
        const key=td.dataset.col;
        const control = td.querySelector('input,textarea,button.yay-chipbtn');
        bulkField=key;
        bulkValue=readControl(control);
        bulkSrcTd=td;
        focusColumn(key);
        modal.querySelector('#yay-insert').style.display='inline-block';
        selectAllInColumn(key);
        td.classList.add('yay-src');
      }
      tbl.onmousedown=(e)=>{
        if(!bulkMode) return;
        const ctrl=e.target.closest('td input, td textarea, td button.yay-chipbtn'); if(!ctrl) return;
        const td=ctrl.closest('td'); const key=td.dataset.col;
        if(!bulkField){ pickBulkSourceFrom(td); }
      };
    }
 
    function rowIndex(btn){ return Number(btn.closest('tr').dataset.i); }
    function readControl(el){
  if (!el) return '—';
  if (el.classList.contains('yay-chipbtn')){
    const td  = el.closest('td');
    const key = td?.dataset.col;
 
    if (key === 'mood'){
      const raw = (el.querySelector('.v')?.textContent || '').trim();
      return (!raw || raw === '—') ? [] : raw.split(',').map(s=>s.trim()).filter(Boolean);
    }
 
    return el.querySelector('.v').textContent.trim();
  }
  return el.value;
}
 
 
    function focusColumn(key){ modal.querySelector('tbody').classList.add('bulk-on'); modal.querySelectorAll('td').forEach(td=>td.classList.remove('yay-focus','yay-cell-sel','yay-src')); modal.querySelectorAll(`td[data-col="${key}"]`).forEach(td=>td.classList.add('yay-focus')); }
    function clearFocus(){ modal.querySelector('tbody').classList.remove('bulk-on'); modal.querySelectorAll('td').forEach(td=>td.classList.remove('yay-focus','yay-cell-sel','yay-src')); }
    function selectAllInColumn(key){ modal.querySelectorAll(`td[data-col="${key}"]`).forEach(td=>td.classList.add('yay-cell-sel')); }
    function enterBulk(){ bulkMode=true; bulkField=null; bulkValue=null; bulkSrcTd=null; modal.querySelector('#yay-bulkbar').style.display='flex'; clearFocus(); modal.classList.add('bulk-on'); modal.querySelector('#yay-insert').style.display='none'; }
    function exitBulk(){ bulkMode=false; bulkField=null; bulkValue=null; bulkSrcTd=null; modal.querySelector('#yay-bulkbar').style.display='none'; clearFocus(); modal.classList.remove('bulk-on'); modal.querySelector('#yay-insert').style.display='none'; }
    function applyBulk(){
  if(!bulkField) return;
 
  const tds = Array.from(modal.querySelectorAll(`td[data-col="${bulkField}"]`));
 
  tds.forEach(td => {
    if (td === bulkSrcTd) return;
 
    const control = td.querySelector('input,textarea,button.yay-chipbtn');
    if (!control) return;
 
    const i = Number(td.closest('tr').dataset.i);
 
    if (control.classList.contains('yay-chipbtn')){
      if (bulkField === 'mood'){
        // bulkValue may already be an array (from readControl) – if not, split safely
        const arr = Array.isArray(bulkValue)
          ? bulkValue.slice()
          : String(bulkValue).split(',').map(s => s.trim()).filter(Boolean);
 
        currRows[i].mood = arr;
 
        const v = control.querySelector('.v');
        v.textContent = arr.length ? arr.join(', ') : '—';
        control.classList.toggle('hasVal', arr.length > 0);
      } else {
        control.querySelector('.v').textContent = bulkValue || '—';
        control.classList.toggle('hasVal', !!bulkValue && bulkValue !== '—');
        currRows[i][bulkField] = bulkValue || undefined;
if (bulkField === 'created_by') autoFillDerivedForIndex(i, { force: true }); // ← NEW
      }
    } else {
      control.value = bulkValue;
      control.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
 
  exitBulk();
  fitColumns(lastCols);
  stabilizeMoodCells();
flagEmptyWavCells();
}
 
 
 
 
 
    function fitColumns(cols){
  const tbl = wrap.querySelector('table');
 
  cols.forEach((c,i)=>{
    // Mood: auto width = widest tokenized cell
    if (c.key === 'mood'){
      let w = 220; // good base when empty (—)
      tbl.querySelectorAll(`tbody tr td:nth-child(${i+1}) .yay-chipbtn`).forEach(btn=>{
        const cw = Math.ceil(btn.scrollWidth) + 24; // include internal padding
        if (cw > w) w = cw;
      });
      const final = Math.min(1100, w); // table scrolls horizontally
      wrap.querySelectorAll(`tr > *:nth-child(${i+1})`).forEach(cell=>{
        cell.style.minWidth = final + 'px';
      });
      return;
    }
 
    // default behaviour
    if (c.textarea || c.grow) return;
    let w = c.width || 0;
    tbl.querySelectorAll(`tbody tr td:nth-child(${i+1})`).forEach(td=>{
      const t = td.innerText || '';
      w = Math.max(w, Math.min(600, t.length*8 + 32));
    });
    w = Math.max(w, c.label.length*8 + 40);
    wrap.querySelectorAll(`tr > *:nth-child(${i+1})`).forEach(cell=>{
      cell.style.minWidth = w + 'px';
    });
  });
 
  // keep these roomy
  const idxS = cols.findIndex(c=>c.key==='styles'); if(idxS>=0) setW(idxS,360);
  const idxL = cols.findIndex(c=>c.key==='lyrics'); if(idxL>=0) setW(idxL,420);
 
  // NEW: “a bit longer” for requested columns
  const pref = {
  release_title: 360,
  version:       240,  // a bit wider
  c_line:        280,
  p_line:        280,
  publisher:     300,
  brand:         260,
  label:         260,
  suno_url:      425,  // show long links cleanly
  wav_url:       425,   // show long links cleanly
  genre:               180,
  type:                160,
  primary_artist:      260,
  featured_artist:     300,
  original_release:    240,
  created_by:          220,
  lyrics_origin:       200,
  production_credits:  300,
  lyrics_credits:      300,
  music_credits:       300
};
 
  for (const [k,w] of Object.entries(pref)){
    const idx = cols.findIndex(c=>c.key===k);
    if (idx >= 0) setW(idx, w);
  }
 
  function setW(i,w){
    wrap.querySelectorAll(`tr > *:nth-child(${i+1})`).forEach(cell=>cell.style.minWidth=w+'px');
  }
}
 
 
 
function flagEmptyWavCells(){
  wrap.querySelectorAll('td[data-col="wav_url"]').forEach(td=>{
    const inp = td.querySelector('input');
    const empty = !inp || !String(inp.value).trim();
    td.classList.toggle('yay-need-wav', empty);
  });
}
 
 
 
 
    function stickyOffsets(cols){
      const t=wrap.querySelector('table'); const w={};
      const i1=cols.findIndex(c=>c.sticky===1), i2=cols.findIndex(c=>c.sticky===2), i3=cols.findIndex(c=>c.sticky===3);
      if (i1>=0) w.one  = t.querySelector(`thead th:nth-child(${i1+1})`)?.getBoundingClientRect().width || 56;
      if (i2>=0) w.two  = (w.one||0) + (t.querySelector(`thead th:nth-child(${i2+1})`)?.getBoundingClientRect().width || 56);
      if (i3>=0) w.three= (w.two||0) + (t.querySelector(`thead th:nth-child(${i3+1})`)?.getBoundingClientRect().width || 240);
      return w;
    }
    function applySticky(cols){
      const t=wrap.querySelector('table');
      cols.forEach((c,i)=>{
        if (!c.sticky) return;
        const left = c.sticky===1 ? 0 : c.sticky===2 ? (stickyW.one||56)-1 : (stickyW.two||120)-1;
        t.querySelectorAll(`tr > *:nth-child(${i+1})`).forEach(cell=>{
          cell.classList.add('yay-sticky');
          if (c.sticky===2) cell.classList.add('two');
          if (c.sticky===3) cell.classList.add('three');
          cell.style.left = left + 'px';
          cell.style.zIndex = cell.tagName==='TH' ? 9 : 8;
          cell.style.background = 'var(--bg2)';
          cell.classList.add('last-sticky');
        });
      });
    }
 
    function validatePublish(){
  const b = modal.querySelector('#yay-publish');
  const count = currRows.length || 0;
  const hasMissingWav = currRows.some(r => !r.wav_url || !String(r.wav_url).trim());

  const ok = allowPublish(count);
  b.disabled = !ok || publishLocked;

  if (ok) {
    b.title = '';
    return;
  }

  const reasons = [];

  if (count > 1 && fmt !== 'Single') {
    const title = modal.querySelector('#yay-title').value.trim();
    if (!titleLocked || !title) {
      reasons.push('set format and lock Album/EP title');
    }
  }

  if (hasMissingWav) {
    reasons.push('fill WAV URL for all songs');
  }

  b.title = 'To publish: ' + (reasons.join(' and ') || 'complete required fields.');
}

    function allowPublish(count){
  if (!count || !currRows || !currRows.length) return false;

  // 1) All rows must have a WAV URL filled in
  const missingWav = currRows.some(r => !r.wav_url || !String(r.wav_url).trim());
  if (missingWav) return false;

  // 2) Normal format/title rules (same as before)
  if (count === 1) return true;
  if (fmt === 'Single') return true;

  if (!titleLocked) return false;
  const t = modal.querySelector('#yay-title').value.trim();
  return !!t;
}

 
 
function toISODateString(s){
  const v = String(s || '').trim();
  if (!v) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v; // already ISO
  const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); // DD/MM/YYYY
  if (m){
    const [, d, mo, y] = m;
    return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }
  return v; // leave unknown formats untouched
}
 
 
    function readTable() {
  if (fmt!=='Single' && titleLocked){
    const t = modal.querySelector('#yay-title').value.trim();
    currRows.forEach(r => { r.format = fmt; r.album_ep_title = t; });
  }
  if (releaseDateISO) currRows.forEach(r=>r.release_date = releaseDateISO);
 
 
  return currRows.map(r => {
    const moodArr = Array.isArray(r.mood)
      ? r.mood
      : String(r.mood || '').split(',').map(s => s.trim()).filter(Boolean);
 
    const fullPA = toArtistArray(r.primary_artist);          // full list
    const primPA = fullPA[0] || '';                           // first only
    const feats  = toArtistArray(r.featured_artist);          // keep array
 
// ensure derived fields are present at export time (don’t overwrite user edits)
const firstArtistExport = toArtistArray(r.primary_artist)[0] || '';
const companyExport = mapCompanyForArtist(firstArtistExport);
const creditExport  = mapCreditsPerson(firstArtistExport);
 
const c_line              = r.c_line              || companyExport || '';
const p_line              = r.p_line              || companyExport || '';
const publisher           = r.publisher           || companyExport || '';
const brand               = r.brand               || firstArtistExport || '';
const label               = r.label               || companyExport || '';
 
 
const production_credits  = r.production_credits  || creditExport  || '';
const lyrics_credits      = r.lyrics_credits      || creditExport  || '';
const music_credits       = r.music_credits       || creditExport  || '';
 
// Normalize date once and derive production_year (YYYY). Empty if no date.
const rdISO = toISODateString(r.release_date);
const production_year = rdISO && /^\d{4}/.test(rdISO) ? rdISO.slice(0,4) : '';
 
 
 
    return {
      order: r.order,
      title: r.title,
      duration: r.duration,
      duration_seconds: parseDuration(r.duration),
      suno_url: r.suno_url,
      suno_id: getSunoId(r.suno_url),
      account: r.account,
      genre: r.genre,
      type: r.type,
 
      // ⬇️ NEW: string + array split
      primary_artist: primPA,             // string (first artist)
      full_primary_artist: fullPA,        // array (all primary artists)
      featured_artist: feats,             // array (unchanged)
 
      release_title: r.release_title,
      version: r.version,
      original_release: r.original_release,
      mood: moodArr,                      // array
      lyrics_origin: r.lyrics_origin,
      created_by: r.created_by,
      track_language: r.track_language,
      format: r.format,
      album_ep_title: r.album_ep_title,
      release_date: rdISO,
      production_year,
      potential: r.potential,
      styles: r.styles,
      lyrics: r.lyrics,
  c_line,
  p_line,
  publisher,
  brand,
  label,
  production_credits,
  lyrics_credits,
  music_credits,
      wav_url: r.wav_url || ''
    };
  });
}
 
    function downloadCSV(rows){
      const head = [
  'order','title','duration','duration_seconds','suno_url','suno_id','account','genre','type',
  'primary_artist','full_primary_artist','featured_artist','release_title','version','original_release',
  'mood','lyrics_origin','created_by','track_language','format','album_ep_title','release_date',
  'potential','styles','lyrics',
  // ⬇️ NEW columns in CSV
  'c_line','p_line','publisher','brand','label','production_credits','lyrics_credits','music_credits',
  'wav_url'
];
 
 
      const csv=[head.join(',')].concat(rows.map(r=>head.map(h=>`"${String(r[h]??'').replaceAll('"','""')}"`).join(','))).join('\n');
      const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='suno_selected.csv'; a.click(); URL.revokeObjectURL(a.href);
    }
    function makeJobId(){ return `job_${Date.now()}_${Math.random().toString(36).slice(2,8)}`; }
    function sendToN8n(rows){
      if (!rows.length) return toast('Nothing to publish.');
      if (!allowPublish(rows.length)) return;
      if (!N8N_WEBHOOK) return toast('Add your N8N_WEBHOOK in the script.');
 
      const job_id = makeJobId();
 
      GM_xmlhttpRequest({
        method: 'POST',
        url: N8N_WEBHOOK,
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': N8N_SECRET
        },
        data: JSON.stringify({
  source: 'tm-suno',
  ts: Date.now(),
  action: 'create_monday_items',
  format: fmt,
  album_title: modal.querySelector('#yay-title').value.trim(),
  release_date: releaseDateISO,
  download_preference: 'official',
 
  // progress & ids
  job_id,
  items_total: rows.length,                // existing
  total_songs: rows.length,                // your alias (same value)
 
  // how many have a WAV link at publish time (use 0 if you prefer)
  processed_songs: rows.filter(r => r.wav_url && String(r.wav_url).trim()).length,
 
  // the rows themselves
  items: rows
}),
        onload: (res) => {
          const body = (res.responseText || '').slice(0, 200);
          if (res.status >= 200 && res.status < 300) {
            const ids = rows.map(r => r.suno_id || getSunoId(r.suno_url)).filter(Boolean);
            rememberProcessed(ids);
            markProcessedOnPage();
 
            let respJobId = job_id, statusUrl = MAKE_STATUS_POLL;
            try {
              const parsed = JSON.parse(res.responseText || '{}');
              if (parsed.job_id) respJobId = parsed.job_id;
              if (parsed.status_poll_url) statusUrl = parsed.status_poll_url;
            } catch {}
 
            openAudioProgress(rows, { jobId: respJobId, statusPollUrl: statusUrl });
          } else {
            toast(`n8n error ${res.status} ${res.statusText || ''}`);
            console.error('n8n error', {status: res.status, url: res.finalUrl, body});
            alert(`n8n responded ${res.status}\nURL: ${res.finalUrl}\nBody: ${body}`);
resetPublishUI();
          }
        },
        onerror: (err) => {
          console.error('GM_xmlhttpRequest failed', err);
          alert(`Network error to n8n/Make\nCheck Tampermonkey permissions & URL.\n\nDetails: ${err.error || '(no detail)'}`);
resetPublishUI();       
        }
      });
    }
 
    function menuAt(left, top, items, onPick, opts={}){
      const m=document.createElement('div'); m.className='yay-menu'; m.style.left=left+'px'; m.style.top=top+'px';
      m.innerHTML=`${opts.search!==false?'<input class="srch" placeholder="Search…">':''}<div class="list"></div>`;
      const list=m.querySelector('.list'); const srch=m.querySelector('.srch');
      const render=(q='')=>{
        list.innerHTML='';
        items.filter(x=>!q || (x.label||x).toLowerCase().includes(q.toLowerCase())).forEach(it=>{
          const lab=it.label||it, val=it.value||it; const row=document.createElement('div'); row.className='opt'; row.textContent=lab;
          row.onclick=()=>{ onPick(val); close(); }; list.appendChild(row);
        });
      };
      render(); if (srch){ srch.oninput=()=>render(srch.value); setTimeout(()=>srch.focus(),0); }
      const closeHandler=(ev)=>{ if(!m.contains(ev.target)) close(); };
      function close(){ document.removeEventListener('mousedown', closeHandler, true); m.remove(); }
      setTimeout(()=>document.addEventListener('mousedown', closeHandler, true),0);
      return m;
    }
    function showMenu(anchor, kind, options, search, onPick, opts = {}) {
  const r = anchor.getBoundingClientRect();
 
  // MULTI-SELECTION MENU (used for Mood; supports flat or grouped options)
  if (opts.multi) {
    const m = document.createElement('div');
    m.className = 'yay-menu';
 
    const btnW = Math.max(r.width, 260);
    m.style.left = r.left + 'px';
    m.style.top  = (r.bottom + 6) + 'px';
    m.style.width = btnW + 'px';
 
    const placeholder = opts.placeholder || 'Search…';
    m.innerHTML = `
      <div class="head">
        <input class="srch" placeholder="${esc(placeholder)}">
      </div>
      <div class="list"></div>
      <button class="ok">OK</button>
    `;
 
    const list = m.querySelector('.list');
    const srch = m.querySelector('.srch');
 
    // preselected
    const pre = Array.isArray(opts.preselect) ? opts.preselect.map(String) : [];
    const sel = new Set(pre);
 
    // normalize to groups if needed
    const groups = Array.isArray(options) && options.length && typeof options[0] === 'object' && options[0].items
      ? options
      : [{ header: null, items: options || [] }];
 
    const render = (q='') => {
      list.innerHTML = '';
 
      groups.forEach(g => {
        const visibleItems = g.items
          .map(String)
          .filter(v => !q || v.toLowerCase().includes(q.toLowerCase()));
 
        if (!visibleItems.length) return;
 
        if (g.header) {
          const gh = document.createElement('div');
          gh.className = 'group';
          gh.textContent = g.header;
          list.appendChild(gh);
        }
 
        visibleItems.forEach(val => {
          const row = document.createElement('div');
          row.className = 'opt';
 
          const chk = document.createElement('input');
          chk.type = 'checkbox';
          chk.value = val;
          chk.checked = sel.has(val);
 
          const lab = document.createElement('span');
          lab.textContent = val;
          lab.style.marginLeft = '10px';
 
          chk.onchange = () => { chk.checked ? sel.add(val) : sel.delete(val); };
          row.onclick = (e) => {
            if (e.target !== chk) { chk.checked = !chk.checked; chk.dispatchEvent(new Event('change')); }
          };
 
          row.appendChild(chk);
          row.appendChild(lab);
          list.appendChild(row);
        });
      });
    };
 
    render();
    srch.oninput = () => render(srch.value);
    setTimeout(() => srch.focus(), 0);
 
    m.querySelector('.ok').onclick = () => {
      onPick([...sel]); // selections only, headers are never returned
      close();
    };
 
    const close = () => {
      document.removeEventListener('mousedown', killer, true);
      m.remove();
    };
    const killer = (ev) => { if (!m.contains(ev.target)) close(); };
    setTimeout(() => document.addEventListener('mousedown', killer, true), 0);
 
    document.body.appendChild(m);
 
    // clamp to viewport
    const pad = 12;
    const rect = m.getBoundingClientRect();
    let newTop  = r.bottom + 6;
    let newLeft = r.left;
    if (newTop + rect.height > window.innerHeight - pad) {
      newTop = Math.max(pad, window.innerHeight - rect.height - pad);
    }
    if (newLeft + rect.width > window.innerWidth - pad) {
      newLeft = Math.max(pad, window.innerWidth - rect.width - pad);
    }
    m.style.top  = newTop + 'px';
    m.style.left = newLeft + 'px';
    return;
  }
 
    // SINGLE-SELECTION MENU (now clamped + sized to trigger)
  const posMenu = menuAt(r.left, r.bottom + 6, options, onPick, { search });
  document.body.appendChild(posMenu);
 
  // make dropdown at least as wide as its trigger for nicer alignment
  posMenu.style.minWidth = Math.max(260, Math.floor(r.width)) + 'px';
 
  // clamp to viewport so it won't spill off screen
  const pad  = 12;
  const rect = posMenu.getBoundingClientRect();
 
  let newTop  = r.bottom + 6;
  let newLeft = r.left;
 
  if (newTop + rect.height > window.innerHeight - pad) {
    newTop = Math.max(pad, window.innerHeight - rect.height - pad);
  }
  if (newLeft + rect.width > window.innerWidth - pad) {
    newLeft = Math.max(pad, window.innerWidth - rect.width - pad);
  }
 
  posMenu.style.top  = newTop + 'px';
  posMenu.style.left = newLeft + 'px';
 
}
 
 
 
 
    /* --------------------------- Flow control --------------------------- */
    async function startProcess(){
  if (selectedSet.size === 0) return toast('Select at least one song.');

  const seen  = new Set();
  const cards = [];
  for (const el of nodesForItems()){
    const id = getCardId(el);
    if (!selectedSet.has(id)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    cards.push(el);
  }

  const partials = cards.map(card => {
    const a       = card.querySelector(SELECTORS.list.titleA);
    const title   = a?.textContent?.trim() || '';
    const suno_url= a ? abs(a.href) : '';
    const duration= findDurationInCard(card) || '';
    const user    = (card.querySelector('a[href^="/@"]')?.textContent || '').trim();
    const account = ACCOUNT_MAP[user.toLowerCase()] || user || '';
    const at      = parseArtistsAndTitle(title);
    return {
      title,
      release_title: at.title || title,
      primary_artist: at.artists.join(', '),
      suno_url,
      duration,
      account,
      styles: '',
      lyrics: ''
    };
  });

  const state = {
    running: true,
    origin:  location.href,
    urls:    partials.map(p => p.suno_url),
    i:       0,
    partials,
    ts:      Date.now(),
    itemStart: Date.now(),
    stats:   { samples: [], avg: NaN },
    phase:   'wait'   // ⬅️ user still has to click "Download → WAV Audio"
  };
  setState(state);

  // Only show the green banner, no blocking modal while we need your click
  showBanner('Click "Download → WAV Audio"', 'wait');
  hideProcessing();          // just in case a stale overlay is still visible

  startStateTicker();
  await sleep(80);
  location.href = state.urls[0];
}


 
    async function waitFor(selector, { root=document, timeout=12000, poll=100 }={}){
      const deadline=Date.now()+timeout;
      while(Date.now()<deadline){ const el=root.querySelector(selector); if(el) return el; await sleep(poll); }
      return null;
    }
 
    async function scrapeSongPageAndAdvance(){
  const st = getState();
  if (!st || !st.running) return;
  if (scraping) return;           // re-entrancy guard
  scraping = true;

  keepProcessingVisible();

  // ---- 1) Try to capture WAV FIRST; do not advance until we have it ----
  try {
    if (CAPTURE_WAV_URL) {
      const wav = await captureOfficialWavUrl(); // waits for YOUR click

      if (wav === RETRY_TOKEN) {                 // upsell -> page will reload
        scraping = false;
        return;
      }
      if (!wav) {
        // No WAV yet — stay on this song and keep waiting
        showBanner('Waiting for you to click: Download → WAV Audio', 'wait');
        scraping = false;
        return;
      }

      // Got it — store the WAV
      st.partials[st.i].wav_url = wav;
    }
  } catch (e) {
  // If capture had an error, don’t skip; keep waiting on this track
  showBanner('Please wait...', 'proc'); // yellow, not green
  scraping = false;
  return;
}


  // ---- 2) Best-effort metadata scrape (optional; never blocks advance) ----
    // ---- 2) Best-effort metadata scrape (optional; never blocks advance) ----
  try {
    const safeWait = (sel, opts) => sel ? waitFor(sel, opts) : null;

    const titleSel  = (typeof SONG_SELECTORS !== 'undefined' && SONG_SELECTORS.title)        || null;
    const styleSel  = (typeof SONG_SELECTORS !== 'undefined' && SONG_SELECTORS.style)        || null;
    const lyricsSel = (typeof SONG_SELECTORS !== 'undefined' && SONG_SELECTORS.lyricsFirstP) || null;

    const [titleEl, styleEl, firstP] = await Promise.all([
      safeWait(titleSel,  { timeout: 6000 }),
      safeWait(styleSel,  { timeout: 6000 }),
      safeWait(lyricsSel, { timeout: 6000 })
    ]);

    let title  = '';
    let style  = '';
    let lyrics = '';

    // Title (fallback; playlist title parsing already works)
    if (titleEl) {
      title = text(titleEl);
    }

    // Styles: prefer the full string from title="" if present
    if (styleEl) {
      style = (styleEl.getAttribute('title') || text(styleEl) || '').trim();
    }

    // Lyrics: collect all <p.whitespace-pre-wrap> in the same block
    if (firstP) {
      const parent = firstP.parentElement;
      if (parent) {
        const selectorForAll = lyricsSel || 'p.whitespace-pre-wrap';
        const ps = Array.from(parent.querySelectorAll(selectorForAll));
        lyrics = ps.map(text).join('\n\n').trim();
      } else {
        lyrics = text(firstP);
      }
    }

    if (title)  st.partials[st.i].title  = title;
    if (style)  st.partials[st.i].styles = style || st.partials[st.i].styles || 'Unknown';
    if (lyrics) st.partials[st.i].lyrics = lyrics || st.partials[st.i].lyrics || 'No lyrics found';
  } catch {
    // Metadata failures should not block advancing once WAV is secured
    st.partials[st.i].styles = st.partials[st.i].styles || 'Error';
    st.partials[st.i].lyrics = st.partials[st.i].lyrics || 'Error';
  }

  // ---- 3) Mark processed & advance (now that WAV exists) ----
  try {
    const curId = getSunoId(st.urls[st.i] || '');
    if (curId) rememberProcessed([curId]);
  } catch {}

  // Update timing stats (for ETA)
  const elapsed = Date.now() - (st.itemStart || Date.now());
  if (!st.stats) st.stats = { samples: [], avg: NaN };
  st.stats.samples.push(elapsed);
  if (st.stats.samples.length > 8) st.stats.samples.shift();
  st.stats.avg = st.stats.samples.reduce((a,b)=>a+b,0) / st.stats.samples.length;

  // Advance
  st.i += 1;
  st.itemStart = Date.now();
  setState(st);
  updateOverlayProgress(st.i, st.urls.length, st.stats);

  if (st.i < st.urls.length) {
    await sleep(250);
    location.href = st.urls[st.i];
  } else {
    st.running = false;
    setState(st);
    await sleep(300);
    location.href = st.origin;
  }

  scraping = false;
}


 
    function maybeFinishOnPlaylist(){
  const st = getState();
  if (st && !st.running && st.partials && st.partials.length){
    stopStateTicker();                                  // <-- NEW
    const rows = st.partials;
    clearState();
    hideBanner(); // done
    requestAnimationFrame(()=>{ markProcessedOnPage(); openEditor(rows); });
  }
}

 
    function checkStateAndAct(){
  const st = getState();
  if (!st){ 
    if (isPlaylistPage()) requestAnimationFrame(maybeFinishOnPlaylist); 
    return; 
  }
  if (st.running){
    keepProcessingVisible();
    if (isSongPage() && toPath(location.href) === toPath(st.urls[st.i])) {
      scrapeSongPageAndAdvance();
    } else if (isSongPage()) {
      setTimeout(() => {
        const cur = getState();
        if (!cur || !cur.running) return;
        if (cur.i < cur.urls.length - 1) { 
          cur.i += 1; 
          cur.itemStart=Date.now(); 
          setState(cur); 
          location.href = cur.urls[cur.i]; 
        } else { 
          cur.running = false; 
          setState(cur); 
          location.href = cur.origin; 
        }
      }, 15000);
    }
  } else {
    if (isPlaylistPage()) requestAnimationFrame(maybeFinishOnPlaylist);
  }
}

 
  } catch (e) {
    console.error('Script execution failed:', e);
    alert('Script error: ' + e.message + '\nCheck the console for details.');
  }
})();