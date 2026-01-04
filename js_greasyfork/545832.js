// ==UserScript==
// @name         SunoGenie (YAY Tools)
// @license      All Rights Reserved ~ Private Use Only
// @namespace    yaylists.suno.helper
// @version      8.9.6
// @description  Prompt Genie for Suno
// @match        https://suno.com/create*
// @match        https://www.suno.com/create*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @connect      yayn8n.duckdns.org
// @run-at       document-start
// @author       YAY Labs
// @downloadURL https://update.greasyfork.org/scripts/545832/SunoGenie%20%28YAY%20Tools%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545832/SunoGenie%20%28YAY%20Tools%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

const ready = (fn) =>
  (document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true })
    : fn());


  /******** CONFIG ********/
  const API_BASE = 'https://yayn8n.duckdns.org/webhook/suno';
const FORCE_GM_FOR_N8N = true;  // prefer fetch; auto-fallback to GM if fetch fails
  const GOOGLE_CLIENT_ID = '630036233195-cnb65oi4c2v1k7pv9nfk1i8d0428kav1.apps.googleusercontent.com';
  const PAGE_SIZE = 50;
  const REMEMBER = true;
  const DEBUG = true;


let BOOTING = false;

// ---- sync throttle & dedupe (NEW) ----
let SYNCING_PROMISE = null;
let LAST_SYNC_TS = 0;
const SYNC_MIN_GAP_MS = 8000; // <- at most once every 8s unless forced

function dedupeById(rows){
  const m = new Map();
  for (const r of rows || []) {
    const id = r && r.id;
    if (!id) continue;
    if (!m.has(id)) m.set(id, r);
  }
  return [...m.values()];
}


// Local fallback for my_vote so the UI highlights after refresh even if the API
// doesn't return my_vote for a row.

// --- replace these helpers (per-UID keys) ---
const voteCacheKey = () => `sg_vote_cache_${getUID()}`;
const favCacheKey  = () => `sg_fav_cache_${getUID()}`;

const getVoteCache = () => {
  try { return JSON.parse(GM_getValue(voteCacheKey(), '{}')) || {}; } catch { return {}; }
};
const setVoteCache = (m) => GM_setValue(voteCacheKey(), JSON.stringify(m));

const getFavCache = () => {
  try { return JSON.parse(GM_getValue(favCacheKey(), '{}')) || {}; } catch { return {}; }
};
const setFavCache = (m) => GM_setValue(favCacheKey(), JSON.stringify(m));


const DESC_LIMIT = 225
; // ~3 lines worth; tweak if you want

  const log = (...a)=>DEBUG&&console.log('[SunoGenie]',...a);

  const UI = {
    text:'#f7f4ef', faint:'#9a9aa2', dark:'#121218', bar:'#101012',
    border:'rgba(255,255,255,0.10)', card:'rgba(255,255,255,0.04)',
    cardBorder:'rgba(255,255,255,0.08)', pink:'#e60075',
    starIdle:'#6e6e76', btn:'#282829', cardBg:'#1e1e20',
    cardBgSel:'#262628', grayOutline:'#b9bac1', voteIdle:'#6d6d72'
  };

let ADV_OBSERVER = null; // (new) mutation observer for Save-to-Genie area
let SAVE_HOME_EL = null;     // the first good parent we mounted under
let SAVE_DETACHED_BTN = null; // parked button while Styles is not on page

  /******** AUTH STORAGE ********/
  let ID_TOKEN = GM_getValue('sg_id_token','');
  function setIdToken(t){ ID_TOKEN = t || ''; GM_setValue('sg_id_token', ID_TOKEN); }

  const KEY_NAME = 'sg_name';
  const KEY_EMAIL = 'sg_email';
  const KEY_AVATAR = 'sg_avatar';
  const KEY_UID = 'sg_uid';

const GENRES_CACHE_KEY  = 'sg_genres_cache_v1';
const VERSIONS_CACHE_KEY= 'sg_versions_cache_v1';
const PROMPTS_CACHE_KEY = 'sg_prompts_cache_v1';
const getCache = (k, def=[]) => { try { return JSON.parse(GM_getValue(k, 'null')) ?? def; } catch { return def; } };
const setCache = (k, v)      => GM_setValue(k, JSON.stringify(v));


  const getUID = ()=>GM_getValue(KEY_UID,'demo');
  const getProfile = ()=>({ name:GM_getValue(KEY_NAME,''), email:GM_getValue(KEY_EMAIL,''), avatar:GM_getValue(KEY_AVATAR,'') });

  function saveAuthFromJwt(idt){
    setIdToken(idt);
    const p = decodeJwt(idt);
    GM_setValue(KEY_NAME, p.name || '');
    GM_setValue(KEY_EMAIL, p.email || '');
    GM_setValue(KEY_AVATAR,p.picture || '');
    GM_setValue(KEY_UID, p.sub || p.email || 'demo');
  }
  function clearAuth(){
    setIdToken('');
    GM_setValue(KEY_NAME,'');
    GM_setValue(KEY_EMAIL,'');
    GM_setValue(KEY_AVATAR,'');
    GM_setValue(KEY_UID,'demo');
  }
  function decodeJwt(jwt){
    try{
      const [,b] = String(jwt||'').split('.');
      if (!b) return {};
      const json = atob(b.replace(/-/g,'+').replace(/_/g,'/'));
      return JSON.parse(decodeURIComponent(escape(json)));
    }catch{ return {}; }
  }

  /******** HTTP (Authorization + fallback) ********/
  const asJSON = t => { try { return JSON.parse(t); } catch { return null; } };

async function fetchWithTimeout(resource, options = {}, timeoutMs = 2000) {
  return await Promise.race([
    fetch(resource, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('FETCH_TIMEOUT')), timeoutMs))
  ]);
}



// IMPORTANT: never clear auth here; just bubble up so callers decide.
async function http(method, url, body){
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (ID_TOKEN) headers['Authorization'] = `Bearer ${ID_TOKEN}`;

  const handleAuthFail = (status, failUrl) => {
    if (status === 401 || status === 403) {
      throw Object.assign(new Error('AUTH'), { code:'AUTH', status, url: failUrl });
    }
  };


  // --- Bypass CORS for our n8n host: use GM_xmlhttpRequest immediately ---
  // Prefer fetch first; only force GM_xhr if we deliberately set the flag
if (FORCE_GM_FOR_N8N && typeof GM_xmlhttpRequest === 'function' && url.startsWith(API_BASE)) {
  return await new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method,
      data: body ? JSON.stringify(body) : undefined,
      headers,
      onload: (r) => {
        if (r.status < 200 || r.status >= 300) {
          handleAuthFail(r.status, r.finalUrl || url);
          return reject(new Error(`HTTP ${r.status}`));
        }
        resolve(asJSON(r.responseText) ?? r.responseText);
      },
      onerror: () => reject(new Error('Network error')),
    });
  });
}



  try{
    const r = await fetchWithTimeout(url, {
  method, headers, body: body ? JSON.stringify(body) : undefined,
  cache: 'no-store', credentials: 'omit',
}, (url.startsWith(API_BASE) ? 2000 : 5000));

    const text = await r.text();
    if (!r.ok) {
      handleAuthFail(r.status, url);
      throw new Error(`HTTP ${r.status}: ${text}`);
    }
    return asJSON(text) ?? text;
  }catch(fetchErr){
    return await new Promise((resolve,reject)=> {
      GM_xmlhttpRequest({
        url, method,
        data: body ? JSON.stringify(body) : undefined,
        headers,
        onload: (r)=>{
          if (r.status < 200 || r.status >= 300) {
            handleAuthFail(r.status, r.finalUrl || url);
            return reject(new Error(`HTTP ${r.status}`));
          }
          resolve(asJSON(r.responseText) ?? r.responseText);
        },
        onerror: ()=>reject(fetchErr)
      });
    });
  }
}

  const api = {
    prompts: (page,size)=>
  http('POST', `${API_BASE}/prompts`, { uid:getUID(), page, size }),


    vote: (prompt_id, action)=>
      http('POST', `${API_BASE}/vote`, { uid:getUID(), prompt_id, action }),

    favoriteSet: (prompt_id, on)=>
  http('POST', `${API_BASE}/favorite`, { uid:getUID(), prompt_id, on: !!on }),

    genres: () =>
      http('GET', `${API_BASE}/prompts/genres`),

    versions: () =>
      http('GET', `${API_BASE}/versions`),

    promptSave: (payload) =>
      http('POST', `${API_BASE}/prompt/save`, { uid:getUID(), ...payload }),
    promptDelete: (prompt_id) =>
      http('POST', `${API_BASE}/prompt/delete`, { uid: getUID(), prompt_id })

  };

// Normalize version strings like "v4.5+" -> "4.5+", keep '+' suffix
function cleanVer(v){
  return String(v||'').trim().toLowerCase().replace(/^v/,'');
}


// --- Creator name resolver ---
const pickFirst = (obj, keys) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v != null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
};

function deriveCreatorName(row){
  const uidNow = String(getUID() || '').trim();
  const prof   = getProfile();

  // Only user-ish fields (never prompt title/name)
  let name = pickFirst(row, [
    'created_by_name','created_by','createdBy',
    'owner_name','owner',
    'creator_name','creator',
    'author_name','author',
    'username','profile_name','display_name','user_name',
    'added_by','user'
  ]);

  if (!name) {
    const email = pickFirst(row, ['created_by_email','owner_email','email']);
    if (email && email.includes('@')) name = email.split('@')[0];
  }

  const rowUid = pickFirst(row, [
    'owner_uid','ownerUid',
    'created_by_uid','createdByUid',
    'uid','user_uid','userUid','user_id',
    'created_by_id','owner_id','sub'
  ]);

  if (!name) {
    if (rowUid && rowUid === uidNow) return prof.name || 'You';
    if (rowUid) return '#' + String(rowUid).slice(0,6);
  }
  if (rowUid && rowUid === uidNow && name === rowUid) return prof.name || 'You';
  return name;
}


function deriveCreatorAvatar(row){
  const pick = (obj, keys) => {
    for (const k of keys){ const v = obj?.[k]; if (v) return String(v); }
    return '';
  };
  let url = pick(row, [
    'avatar','owner_avatar','created_by_avatar','user_avatar',
    'profile_image','picture','photo_url',
'added_by_avatar'
  ]);
  if (!url){
    const rowUid = pick(row, ['owner_uid','created_by_uid','uid','user_uid','user_id','sub']);
    if (rowUid && rowUid === getUID()) url = getProfile().avatar || '';
  }
  return url;
}

function clearAllCaches(){
  try { GM_setValue('sg_prompts_cache_v1', JSON.stringify([])); } catch {}
  try { GM_setValue(`sg_vote_cache_${getUID()}`, JSON.stringify({})); } catch {}
  try { GM_setValue(`sg_fav_cache_${getUID()}`,  JSON.stringify({})); } catch {}
}




function deriveAvatarUrl(row){
  const key = pickFirst(row, [
    'created_by_avatar','owner_avatar','avatar','avatar_url','photo_url',
    'profile_image','profile_pic','picture','image_url','user_avatar',
 'added_by_avatar'
  ]);
  const v = String(key||'').trim();
  return /^https?:\/\//i.test(v) ? v : '';
}


  /******** DATA ********/
  // --- REPLACE your normalizeRows & normalizeOne with this ---
function normalizeRows(rows){
  const favCache  = getFavCache();
  const voteCache = getVoteCache();

  return rows.map(r => {
    const id = String(r.prompt_id ?? r.id ?? '').trim();

    // server → boolean
    const isFavRaw = r.is_fav;
    let is_fav = !!(
      isFavRaw === true ||
      isFavRaw === 1 ||
      isFavRaw === '1' ||
      String(isFavRaw).toLowerCase() === 'true'
    );

    // client cache wins when present
    if (Object.prototype.hasOwnProperty.call(favCache, id)) {
      is_fav = !!favCache[id];
    }

    const genderNorm = (() => {
      const g = String(r.vocal_gender ?? r.gender ?? '').trim().toLowerCase();
      if (g.startsWith('m')) return 'male';
      if (g.startsWith('f')) return 'female';
      return '';
    })();

    const avatarUrl = deriveAvatarUrl(r);

    return {
      id,
      name: String(r.title ?? r.name ?? r.prompt_title ?? r.prompt_name ?? '').trim(),
      desc: String(r.desc_text ?? r.desc ?? r.description ?? '').trim(),

      genre:   String(r.genre ?? '').trim(),
      version: cleanVer(r.version),
      weird:   r.weirdness,
      influence: r.style_influence,
      style:   String(r.style ?? '').trim(),
      tags:    String(r.tags ?? '').trim(),

      success:  String(r.success_rate ?? r.success ?? '').trim().toLowerCase(),
      upvotes:  Number(r.upvotes ?? 0),
      downvotes:Number(r.downvotes ?? 0),

      my_vote:  (Object.prototype.hasOwnProperty.call(voteCache, id)
                  ? Number(voteCache[id]) || 0
                  : Number(r.my_vote ?? 0)),

      is_fav,
      score:    Number(r.score ?? ((Number(r.upvotes||0)) - (Number(r.downvotes||0)))),

      gender: genderNorm,

      created_by: deriveCreatorName(r),
      created_by_avatar: avatarUrl,
      avatar: deriveCreatorAvatar(r),
    };
  }).filter(x => x.id && x.name);
}



const normalizeOne = (row) => normalizeRows([row])[0];



  /******** DOM helpers + icons ********/
const SVG = {
  genie:`<svg viewBox="0 0 48 48" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex:0 0 auto;color:${UI.text}">
      <path d="M29 6V35" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 36.04C15 33.2565 17.2565 31 20.04 31H29V36.96C29 39.7435 26.7435 42 23.96 42H20.04C17.2565 42 15 39.7435 15 36.96V36.04Z" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M29 14.0664L41.8834 17.1215V9.01339L29 6V14.0664Z" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 8H20" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 16H20" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 24H16" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  user:`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:${UI.text}">
      <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
      <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  star:`<svg viewBox="0 0 24 24"><path d="M12 17.3l-6.18 3.64 1.64-6.99L2 9.77l7.09-.61L12 2.5l2.91 6.66 7.09.61-5.46 4.18 1.64 6.99z"/></svg>`,
  copy:`<svg viewBox="0 0 24 24"><path fill="#fff" d="M16 1H6c-1.1 0-2 .9-2 2v12h2V3h10V1zm3 4H10c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H10V7h9v14z"/></svg>`,
  up:`<svg viewBox="0 0 24 24"><path d="M2 21h4V9H2v12zM22 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13 1 6.59 7.41C6.22 7.78 6 8.3 6 8.83V19c0 1.1.9 2 2 2h7c.82 0 1.54-.5 1.85-1.22l3.02-7.05c.08-.19.13-.4.13-.62v-2.11z"/></svg>`,
  down:`<svg viewBox="0 0 24 24"><path d="M15 3H8c-.82 0-1.54.5-1.85 1.22L3.13 11.27C3.05 11.46 3 11.67 3 11.89V14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L11 23l6.41-6.41c.37-.37.59-.89.59-1.42V5c0-1.1-.9-2-2-2zm5 0h-4v12h4V3z"/></svg>`,
  // edit icon white
  pen:`<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBMaWNlbnNlOiBQRC4gTWFkZSBieSBzdGVwaGVuaHV0Y2hpbmdzOiBodHRwczovL2dpdGh1Yi5jb20vc3RlcGhlbmh1dGNoaW5ncy90eXBpY29ucy5mb250IC0tPgo8c3ZnIGZpbGw9IiMwMDAwMDAiIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI0IDI0IiB2ZXJzaW9uPSIxLjIiIGJhc2VQcm9maWxlPSJ0aW55IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMS41NjEgNS4zMThsLTIuODc5LTIuODc5Yy0uMjkzLS4yOTMtLjY3Ny0uNDM5LTEuMDYxLS40MzktLjM4NSAwLS43NjguMTQ2LTEuMDYxLjQzOWwtMy41NiAzLjU2MWgtOWMtLjU1MiAwLTEgLjQ0Ny0xIDF2MTNjMCAuNTUzLjQ0OCAxIDEgMWgxM2MuNTUyIDAgMS0uNDQ3IDEtMXYtOWwzLjU2MS0zLjU2MWMuMjkzLS4yOTMuNDM5LS42NzcuNDM5LTEuMDYxcy0uMTQ2LS43NjctLjQzOS0xLjA2em0tMTAuMDYxIDkuMzU0bC0yLjE3Mi0yLjE3MiA2LjI5My02LjI5MyAyLjE3MiAyLjE3Mi02LjI5MyA2LjI5M3ptLTIuNTYxLTEuMzM5bDEuNzU2IDEuNzI4LTEuNjk1LS4wNjEtLjA2MS0xLjY2N3ptNy4wNjEgNS42NjdoLTExdi0xMWg2bC0zLjE4IDMuMThjLS4yOTMuMjkzLS40NzguODEyLS42MjkgMS4yODktLjE2LjUtLjE5MSAxLjA1Ni0uMTkxIDEuNDd2My4wNjFoMy4wNjFjLjQxNCAwIDEuMTA4LS4xIDEuNTcxLS4yOS40NjQtLjE5Ljg5Ni0uMzQ3IDEuMTg4LS42NGwzLjE4LTMuMDd2NnptMi41LTExLjMyOGwtMi4xNzItMi4xNzIgMS4yOTMtMS4yOTMgMi4xNzEgMi4xNzItMS4yOTIgMS4yOTN6Ii8+PC9zdmc+" alt="edit" style="width:16px;height:16px;filter:invert(1);" />`,
};


// Keep this OUTSIDE the SVG object:
const TYPE_ICONS = {
  lyrics: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBMaWNlbnNlOiBQRC4gTWFkZSBieSBNYXJ5IEFrdmVvOiBodHRwczovL21hcnlha3Zlby5jb20vIC0tPgo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI0IDI0IiBpZD0iYWxpZ25tZW50LWxlZnQiIGRhdGEtbmFtZT0iRmxhdCBMaW5lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJpY29uIGZsYXQtbGluZSI+PHBhdGggaWQ9InByaW1hcnkiIGQ9Ik0zLDEySDE1TTMsNkgyMU0zLDE4SDE1IiBzdHlsZT0iZmlsbDogbm9uZTsgc3Ryb2tlOiAjMDAwMDAwOyBzdHJva2UtbGluZWNhcDogcm91bmQ7IHN0cm9rZS1saW5lam9pbjogcm91bmQ7IHN0cm9rZS13aWR0aDogMjsiPjwvcGF0aD48L3N2Zz4=',
  instrumental: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBMaWNlbnNlOiBQRC4gTWFkZSBieSBpY29uczg6IGh0dHBzOi8vaWNvbnM4LmNvbS9jL2ZsYXQtY29sb3ItaWNvbnMgLS0+Cjxzdmcgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHZlcnNpb249IjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNDggNDgiPgogICAgPGcgZmlsbD0iI0U5MUU2MyI+CiAgICAgICAgPGNpcmNsZSBjeD0iMTkiIGN5PSIzMyIgcj0iOSIvPgogICAgICAgIDxwb2x5Z29uIHBvaW50cz0iMjQsNiAyNCwzMyAyOCwzMyAyOCwxNCAzOSwxNyAzOSwxMCIvPgogICAgPC9nPgo8L3N2Zz4='
};


  const pct=(v)=>{ if(v===''||v==null) return ''; const n=Number(String(v).replace('%','')); if(isNaN(n)) return String(v); return (n<=1?n*100:n).toFixed(0)+'%'; };
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

  function setValue(el,val){
    const d=Object.getOwnPropertyDescriptor(el.__proto__,'value');
    if (d && d.set) d.set.call(el,val); else el.value=val;
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  }
  function setValueInputOnly(el,val){
    const d=Object.getOwnPropertyDescriptor(el.__proto__,'value');
    if (d && d.set) d.set.call(el,val); else el.value=val;
    el.dispatchEvent(new Event('input',{bubbles:true}));
  }
  function setSliderPercent(el, percent){
    let p=String(percent).trim();
    if (p.endsWith('%')) p=p.slice(0,-1);
    let n=Number(p);
    if (isNaN(n)) return;
    if (n<=1) n*=100;
    n=Math.max(0,Math.min(100,n));
    const min=Number(el.min||0), max=Number(el.max||100);
    setValue(el, Math.round(min+(max-min)*(n/100)));
  }
  function findRangeNear(label){
    const nodes=[...document.querySelectorAll('*')].filter(el=>(el.textContent||'').toLowerCase().includes(label.toLowerCase()));
    const ranges=[...document.querySelectorAll('input[type="range"]')];
    let best=null,d=1e9;
    for(const n of nodes){
      const b=n.getBoundingClientRect(); const cy=(b.top+b.bottom)/2;
      for(const r of ranges){
        const b2=r.getBoundingClientRect(); const c2=(b2.top+b2.bottom)/2;
        const dist=Math.abs(c2-cy);
        if(dist<d){d=dist;best=r;}
      }
    }
    return best;
  }
  async function waitDomIdle(quietMs=350, maxMs=2500){
    return new Promise(resolve=>{
      let idleTimer=null, done=false;
      const finish=()=>{ if(done) return; done=true; obs.disconnect(); clearTimeout(hard); clearTimeout(idleTimer); resolve(); };
      const reset=()=>{ clearTimeout(idleTimer); idleTimer=setTimeout(finish, quietMs); };
      const obs=new MutationObserver(reset);
      obs.observe(document.body,{childList:true,subtree:true});
      const hard=setTimeout(finish, maxMs);
      reset();
    });
  }

  /******** Styles (desc + tags) ********/
  function getStyleDescEl(){
    const nearLabels = [...document.querySelectorAll('label,div,span,strong,h2,h3')]
      .filter(el => /style\s*description/i.test(el.textContent||''));
    const scopes = nearLabels.map(l => l.closest('section,form,div') || document);
    const candSet = new Set();
    const addIn = (root)=> (root||document).querySelectorAll('textarea').forEach(t=>candSet.add(t));
    scopes.forEach(addIn);
    if (candSet.size===0) addIn(document);

    const bad = /lyrics?|song/i;
    const goodStyle = /style|description/i;
    const goodExact = /style\s*description/i;

    const score = (t)=>{
      const ph   = (t.getAttribute('placeholder')||'').toLowerCase();
      const aria = (t.getAttribute('aria-label')||'').toLowerCase();
      const name = (t.getAttribute('name')||'').toLowerCase();
      const id   = (t.id||'').toLowerCase();
      let s = 0;
      if (goodExact.test(ph) || goodExact.test(aria)) s += 100;
      if (goodStyle.test(ph)) s += 60;
      if (goodStyle.test(aria)) s += 40;
      if ((t.getAttribute('data-testid')||'').toLowerCase().includes('style')) s += 80;
      if (t.closest('[data-testid="tag-input-root"]')) s += 20;
      if (bad.test(ph) || bad.test(aria) || bad.test(name) || bad.test(id)) s -= 300;
      const secTxt = ((t.closest('section,div,form')||document).textContent||'').toLowerCase();
      if (goodExact.test(secTxt)) s += 15;
      return s;
    };

    const arr = [...candSet].filter(t=>{
      const ph   = (t.getAttribute('placeholder')||'').toLowerCase();
      const aria = (t.getAttribute('aria-label')||'').toLowerCase();
      const name = (t.getAttribute('name')||'').toLowerCase();
      const id   = (t.id||'').toLowerCase();
      return !(bad.test(ph) || bad.test(aria) || bad.test(name) || bad.test(id));
    });

    arr.sort((a,b)=> score(b) - score(a));
    return arr[0] || null;
  }

  const normalizeTagArray = (text) => {
    const arr = String(text||'').split(/[,\n]/).map(s=>s.trim()).filter(Boolean);
    const seen = new Set(); const out = [];
    for (const t of arr){ const key = t.toLowerCase(); if (!seen.has(key)){ seen.add(key); out.push(t); } }
    return out;
  };
  const asCanonicalTagString = (text) => normalizeTagArray(text).join(', ');

  function getStylesTarget(){
    const tagTA = document.querySelector('textarea[data-testid="tag-input-textarea"]')
      || [...document.querySelectorAll('textarea')].find(t=>(t.placeholder||'').toLowerCase().includes('enter style tags'));
    if (tagTA) return {el:tagTA, mode:'tags-ta', root:tagTA.closest('section,div,form')||document};

    const tagArea = [...document.querySelectorAll('textarea')]
      .find(t=>(t.placeholder||'').toLowerCase().includes('style'));
    if (tagArea) return {el:tagArea, mode:'textarea', root:tagArea.closest('section,div,form')||document};

    const ce=document.querySelector('[data-testid="tag-input-root"] [contenteditable="true"]');
    if (ce) return {el:ce, mode:'ce', root:ce.closest('[data-testid="tag-input-root"]')||document};
    return null;
  }
  function readChipTexts(root){
    const set=new Set();
    const items=[...(root||document).querySelectorAll('[data-testid="tag-item"],[class*="tag"]')];
    for(const el of items){
      const txt=(el.textContent||'').replace(/[×,]/g,' ').trim().toLowerCase();
      if (txt) set.add(txt);
    }
    if (set.size===0){
      const rm=[...(root||document).querySelectorAll('[data-testid="tag-item-remove"],button[aria-label*="remove"]')];
      for(const b of rm){
        const t=(b.parentElement?.textContent||'').replace(/[×,]/g,' ').trim().toLowerCase();
        if (t) set.add(t);
      }
    }
    return set;
  }
  function readTagsFromTextarea(el){
    const v=(el.value||'').trim();
    return new Set(normalizeTagArray(v).map(s=>s.toLowerCase()));
  }
  async function chipTag(target,mode,t){
    const text=String(t).trim(); if(!text) return;
    if (mode!=='ce') setValue(target,text);
    else { target.focus(); document.execCommand('insertText',false,text); }
    target.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',bubbles:true}));
    target.dispatchEvent(new KeyboardEvent('keyup' ,{key:'Enter',code:'Enter',bubbles:true}));
    await sleep(12); setValue(target,'');
  }
  function splitTags(text){ return normalizeTagArray(text); }

  async function ensureTagsTextareaValue(el, text){
    const want = asCanonicalTagString(text);
    const cur = asCanonicalTagString(el.value||'');
    if (want === cur) return true;
    setValueInputOnly(el, want);
    el.blur();
    await sleep(40);
    const after = asCanonicalTagString(el.value||'');
    return after === want;
  }
  async function addStyleTagsIfMissing(text){
    const tgt = getStylesTarget();
    if (!tgt) return false;
    const want = splitTags(text);
    if (want.length===0) return true;

    if (tgt.mode === 'tags-ta'){
      return await ensureTagsTextareaValue(tgt.el, text);
    }

    let have = readChipTexts(tgt.root||tgt.el);
    tgt.el.focus();
    for (const tag of want){
      if (!have.has(tag.toLowerCase())){
        await chipTag(tgt.el, tgt.mode, tag);
        await sleep(16);
        have = readChipTexts(tgt.root||tgt.el);
      }
    }
    tgt.el.blur();
    return true;
  }
  async function ensureStyleDescription(text){
    const ta=getStyleDescEl();
    if (!ta) return false;
    const want=(text||'');
    if ((ta.value||'')!==want){
      setValue(ta, want);
      await sleep(50);
    }
    return (ta.value||'')===want;
  }

  /******** Version & Gender ********/
  function normTxt(s){ return (s||'').trim().toLowerCase().replace(/\s+/g,''); }
  const hasPlus = s => /\+/.test(s||'');

  async function setSunoVersion(version){
    const wantRaw = 'v'+cleanVer(version);
    const want = normTxt(wantRaw);
    const needPlus = hasPlus(wantRaw);

    const currentBtn = document.querySelector('div[aria-label="Model Select Dropdown"]');
    const curTxt = currentBtn ? normTxt(currentBtn.textContent||'') : '';
    if (curTxt === want) return;

    let tries=0;
    while(tries++<10){
      const toggleBtn = document.querySelector('div[aria-label="Model Select Dropdown"]')
        || [...document.querySelectorAll('button,[role="button"],div[tabindex="0"]')]
           .find(b=>/v\d(\.\d)?\+?/i.test(b.textContent||''));
      if (!toggleBtn){ await sleep(100); continue; }
      toggleBtn.click();
      await sleep(90);

      const menu = document.querySelector('body .prevent-modal-close.absolute')
               || document.querySelector('body div[role="menu"]')
               || document.querySelector('body div.absolute.shadow-lg')
               || document.querySelector('body .z-[100000]')
               || document.querySelector('body .z-10000');
      if (!menu){ await sleep(100); continue; }

      const allItems=[...menu.querySelectorAll('[aria-label^="Model Selection:"], div, button, [role="menuitem"]')];
      const getText = el => normTxt(el.textContent||'');
      let target = allItems.find(x => getText(x) === want);
      if (!target && !needPlus){
        target = allItems.find(x => { const t=getText(x); return t.startsWith(want) && !hasPlus(t); });
      }
      if (!target){
        target = allItems.find(x=>{ const t=getText(x); return needPlus ? (t.startsWith(want) && hasPlus(t)) : (t.startsWith(want) && !hasPlus(t)); })
              || allItems[0];
      }
      target?.click();

      const t0=Date.now();
      while (Date.now()-t0<1400) {
        const btn = document.querySelector('div[aria-label="Model Select Dropdown"]');
        const txt = btn ? normTxt(btn.textContent||'') : '';
        if (txt === want) break;
        await sleep(60);
      }
      document.activeElement?.blur?.();
      document.body.click();
      return;
    }
  }

  const isVisible = el => !!(el && (el.offsetWidth || el.offsetHeight || el.getBoundingClientRect().width || 0));
  const btnLabel = el => (el.textContent||'').trim().toLowerCase();
  function isActiveAria(el){
    const a = (el.getAttribute('aria-pressed')||el.getAttribute('aria-checked')||'').toLowerCase();
    const ds = (el.getAttribute('data-state')||'').toLowerCase();
    return el.classList.contains('on') || a==='true' || ds==='on' || /selected|active/.test(el.className||'');
  }
  function isActiveByClass(el){
    const cls = el.className || '';
    if (/\btext-foreground-primary\/30\b/.test(cls)) return false;
    if (/\bbg-background-tertiary\b/.test(cls)) return true;
    if (/\bbg-transparent\b/.test(cls)) return false;
    return null;
  }
  function isGenderActive(el){
    const c = isActiveByClass(el);
    if (c !== null) return c;
    return isActiveAria(el);
  }
  function findNearestLabelNodes(){
    const terms=['vocal','vocals','voice','singer','lead vocal','vocalist'];
    const all=[...document.querySelectorAll('*')];
    return all.filter(el=>{
      const t=(el.textContent||'').toLowerCase();
      return terms.some(k=>t.includes(k));
    });
  }
  function distance(a,b){
    const ra=a.getBoundingClientRect(), rb=b.getBoundingClientRect();
    const ay=(ra.top+ra.bottom)/2, by=(rb.top+rb.bottom)/2;
    return Math.abs(ay-by);
  }
  function findGenderButtons(){
    const allBtns = [...document.querySelectorAll('button,[role="button"]')].filter(isVisible);
    const labelNodes = findNearestLabelNodes();
    const maleBtns = allBtns.filter(b=>/^\s*male\s*$/i.test(b.textContent||''));
    const femaleBtns = allBtns.filter(b=>/^\s*female\s*$/i.test(b.textContent||''));
    if (maleBtns.length===0 && femaleBtns.length===0) return [];
    const scored = [];
    for(const b of [...maleBtns,...femaleBtns]){
      let best=1e9;
      for(const lab of labelNodes){ best=Math.min(best, distance(b,lab)); }
      scored.push({b,score:best});
    }
    scored.sort((a,b)=>a.score-b.score);
    const top = scored.slice(0,6).map(x=>x.b);
    const containers = new Map();
    for (const b of top){
      const root=b.closest('section,div,form')||document.body;
      const key=root;
      if (!containers.has(key)) containers.set(key,[]);
      containers.get(key).push(b);
    }
    for (const [root,btns] of containers){
      const texts=btns.map(btnLabel);
      if (texts.includes('male') && texts.includes('female')) return btns;
    }
    return [...new Set(top)];
  }
  async function ensureVocalGender(val,{maxWait=1400}={}){
    if (!val) return false;
    const want = String(val).trim().toLowerCase();
    { // buttons
      const btns = findGenderButtons();
      const desired = btns.find(b=>btnLabel(b)===want);
      if (desired){
        if (isGenderActive(desired)) return true;
        desired.click();
        const t0 = Date.now();
        while(Date.now()-t0 < maxWait){
          await sleep(120);
          const nowBtns = findGenderButtons();
          const nowDesired = nowBtns.find(b=>btnLabel(b)===want);
          if (nowDesired && isGenderActive(nowDesired)) return true;
        }
        return false;
      }
    }
    // combobox
    const labels = findNearestLabelNodes();
    const triggers = [...document.querySelectorAll('button,[role="button"],[role="combobox"]')]
      .filter(isVisible)
      .filter(b=>/male|female/i.test(b.textContent||''));
    if (triggers.length){
      let best = null, bestScore=1e9;
      for (const t of triggers){
        let s=1e9;
        for (const lab of labels){ s=Math.min(s, distance(t,lab)); }
        if (s<bestScore){ bestScore=s; best=t; }
      }
      if (best){
        const cur = btnLabel(best);
        if (cur===want) return true;
        best.click();
        await sleep(120);
        const menu = document.querySelector('body [role="menu"], body [role="listbox"], body .absolute, body .fixed, body .z-[100000], body .z-10000');
        if (menu){
          const items=[...menu.querySelectorAll('[role="menuitem"],[role="option"],button,div')];
          const pick = items.find(x=>btnLabel(x)===want) || items.find(x=>btnLabel(x).includes(want));
          pick?.click();
          const t0=Date.now();
          while(Date.now()-t0<maxWait){
            await sleep(120);
            const txt = btnLabel(best);
            if (txt===want) return true;
          }
        }
      }
    }
    return false;
  }


async function clearVocalGender(){
  const btns = findGenderButtons();
  if (!btns.length) return false;
  // click any selected ones once to toggle off
  let changed=false;
  for (const b of btns){ if (isGenderActive(b)){ b.click(); changed=true; await sleep(120); } }
  return changed;
}



function getInstrumentalToggle(){
  return document.querySelector('button[aria-label="Instrumental"],div[aria-label="Instrumental"],input[aria-label="Instrumental"]');
}
function isInstrumentalEnabled(el){
  if (!el) return null;
  if (el.tagName === 'INPUT' && el.type === 'checkbox') return !!el.checked;
  const a = (el.getAttribute('aria-pressed') ?? el.getAttribute('aria-checked') ?? '').toLowerCase();
  if (a === 'true')  return true;
  if (a === 'false') return false;
  const ds = (el.getAttribute('data-state')||'').toLowerCase();
  if (ds === 'on' || ds === 'checked')  return true;
  if (ds === 'off' || ds === 'unchecked') return false;
  // fallback: check knob position if present
  const knob = el.querySelector('span');
  try{
    const kb = knob.getBoundingClientRect(), cb = el.getBoundingClientRect();
    return ((kb.left + kb.right)/2) > (cb.left + cb.width/2);
  }catch{ return null; }
}
async function ensureInstrumental(on){
  const el = getInstrumentalToggle(); if (!el) return false;
  let cur = isInstrumentalEnabled(el);
  if (cur === on) return true;
  // click until state matches (handles animations / delayed aria updates)
  for (let i=0;i<6;i++){

    el.click();
    await sleep(160);
    cur = isInstrumentalEnabled(el);
    if (cur === on) return true;
  }
  return isInstrumentalEnabled(el) === on;
}



  /******** Anti-flicker stabilizer ********/
  let APPLY_RUN_ID = 0;
  const newApplyToken = ()=>{ APPLY_RUN_ID += 1; return APPLY_RUN_ID; };
  const isCurrentToken = (t)=> t===APPLY_RUN_ID;

  async function stabilizeApply({ gender, styleText, weird, influence, instrumentalWanted }, token){
  const wantWeird = (weird===''||weird==null) ? null : Number(String(weird).replace('%',''));
  const wantInfl  = (influence===''||influence==null) ? null : Number(String(influence).replace('%',''));
  const wantInstr = /(^|,)\s*instrumental\s*(,|$)/i.test(styleText) && !/(^|,)\s*lyrics?\s*(,|$)/i.test(styleText);

  const deadline = Date.now() + 2500;
  while (Date.now() < deadline && isCurrentToken(token)){
    // sliders (if they exist in this model)
    try{
      const wr = findRangeNear('Weirdness');
      if (wr && wantWeird!=null) setSliderPercent(wr, wantWeird);
      const ir = findRangeNear('Style Influence');
      if (ir && wantInfl!=null) setSliderPercent(ir, wantInfl);
    }catch{}

    // instrumental toggle
    try{ await ensureInstrumental(!!wantInstr); }catch{}

    // style desc + tags
    try{
      if (styleText){
        await ensureStyleDescription(styleText);
        await addStyleTagsIfMissing(styleText);
      }
    }catch{}

    // gender if specified
    try{ if (gender) await ensureVocalGender(gender); }catch{}

    await waitDomIdle(180, 700);
  }
}


  /******** GOOGLE SIGN-IN ********/
  let GIS_LOADING = null;
  function loadGis(){
    if (window.google?.accounts?.id) return Promise.resolve();
    if (GIS_LOADING) return GIS_LOADING;
    GIS_LOADING = new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src='https://accounts.google.com/gsi/client';
      s.async=true; s.defer=true; s.id='gsi-client';
      s.onload=()=>resolve();
      s.onerror=()=>reject(new Error('Failed to load Google Identity Services.'));
      document.head.appendChild(s);
    });
    return GIS_LOADING;
  }
  async function initGsi(slotEl, onCred){
    await loadGis();
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: ({credential})=>{
    if (credential){
      saveAuthFromJwt(credential);
      clearAllCaches();           // << add this
      boot(true);
    }
  },
      auto_select: false,
      ux_mode: 'popup',
      use_fedcm_for_prompt: true
    });
    if (slotEl){
      google.accounts.id.renderButton(slotEl, {
        theme: 'outline', size: 'large', type: 'standard', text: 'signin_with', shape: 'pill', logo_alignment: 'left',
      });
    }
  }
  async function startGoogleLogin(slotEl){
    await initGsi(slotEl, (cred)=>{ saveAuthFromJwt(cred); boot(true); });
    let triedFallback = false;
    google.accounts.id.prompt((notification)=>{
      const notDisplayed = notification.isNotDisplayed?.();
      const skipped = notification.isSkippedMoment?.();
      if ((notDisplayed || skipped) && !triedFallback){
        triedFallback = true;
        const btn = slotEl?.querySelector('[role="button"]');
        btn?.click();
      }
    });
  }

  /******** CSS ********/
  const GOOGLE_BASE64 = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBMaWNlbnNlOiBNSVQuIE1hZGUgYnkgR2l0bGFiOiBodHRwczovL2dpdGxhYi5jb20vZ2l0bGFiLW9yZy9naXRsYWItc3Zncz9yZWY9aWNvbmR1Y2suY29tIC0tPgo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDE2IDE2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNOCA3djIuNGgzLjk3Yy0uMTYgMS4wMy0xLjIgMy4wMi0zLjk3IDMuMDItMi4zOSAwLTQuMzQtMS45OC00LjM0LTQuNDJTNS42MSAzLjU4IDggMy41OGMxLjM2IDAgMi4yNy41OCAyLjc5IDEuMDhsMS45LTEuODNDMTEuNDcgMS42OSA5Ljg5IDEgOCAxIDQuMTMgMSAxIDQuMTMgMSA4czMuMTMgNyA3IDdjNC4wNCAwIDYuNzItMi44NCA2LjcyLTYuODQgMC0uNDYtLjA1LS44MS0uMTEtMS4xNkg4eiIgZmlsbD0iIzAwMDAwMCIvPgo8L3N2Zz4=';

  GM_addStyle(`
    .sg-root{color:${UI.text};font-family:"PP Neue Montreal","Neue Montreal",system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;font-size:16px}
    .sg-card{background:${UI.card};border:1px solid ${UI.cardBorder};border-radius:16px;padding:12px}
    .sg-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
    .sg-title{display:flex;align-items:center;gap:10px;font-weight:700;font-size:16px}
    .sg-title svg{display:block;color:#fff;width:16px;height:16px}
    .sg-head .right{display:flex;align-items:center;gap:8px}
    .sg-btn{height:42px;border-radius:14px;border:1px solid ${UI.border};background:${UI.bar};color:${UI.text};padding:0 12px;cursor:pointer;font-size:14px;line-height:42px;outline:none;display:inline-flex;align-items:center;justify-content:center}
    .sg-btn:hover{background:rgba(255,255,255,.08)}
    .sg-zoom:active{transform:scale(.96)}
    .sg-subtle{height:42px;border-radius:999px;border:1px solid ${UI.border};background:${UI.bar};font-size:13px}
    .sg-avatar{width:34px;height:34px;border-radius:999px;border:1px solid ${UI.border};background:${UI.bar};overflow:hidden;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .sg-avatar img{width:100%;height:100%;object-fit:cover;border-radius:999px}
    .sg-menuwrap{position:relative;display:inline-flex;align-items:center;justify-content:center}
    .sg-menu{position:absolute;right:0;top:42px;background:#101012;border:1px solid ${UI.border};border-radius:12px;padding:8px;min-width:240px;box-shadow:0 10px 24px rgba(0,0,0,.35);z-index:5000}
    .sg-menu .meta{padding:8px 10px;border-bottom:1px solid ${UI.border};margin-bottom:6px;font-size:13px}
    .sg-menu .meta .name{color:${UI.text};font-weight:600;display:block}
    .sg-menu .meta .email{color:${UI.faint};opacity:.8;font-size:12px;display:block;margin-top:2px}
    .sg-menu .item{padding:8px 10px;border-radius:10px;cursor:pointer;outline:none}
    .sg-menu .item:hover,.sg-menu .item:focus{background:rgba(255,255,255,.08);outline:none}

.sg-disabled{opacity:.55}
  .sg-disabled *{pointer-events:none}

.sg-count{font-size:11px;color:#9a9aa2;text-align:right;margin-top:4px}
.sg-count.over{color:#ff7a7a}

.sg-by{ font-size:12px; color:#9a9aa2; margin-left:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:40% }


/* toast */
.sg-toast { position:fixed; left:50%; bottom:22px; transform:translateX(-50%);
  background:#101012; color:#fff; border:1px solid rgba(255,255,255,.18);
  border-radius:12px; padding:10px 14px; z-index:1000000; box-shadow:0 10px 26px rgba(0,0,0,.45) }
.sg-toast.error { border-color:#a33; background:#2a1212 }

/* save button goes white when dirty */
.sg-btn.sg-dirty { background:#fff !important; color:#111 !important; }

/* red-glow delete */
.sg-del { border-color:rgba(255,0,0,.35); box-shadow:inset 0 0 0 9999px rgba(255,0,0,.07) }
.sg-del:hover { box-shadow:inset 0 0 0 9999px rgba(255,0,0,.12) }


/* author avatar bubble on cards */
.sg-cardrow { position: relative; }      /* keep overflow as-is */
.sg-ava { 
  position:absolute; top:6px; right:6px; 
  width:26px; height:26px; border-radius:999px; overflow:hidden;
  border:1px solid rgba(255,255,255,.18); box-shadow:0 2px 8px rgba(0,0,0,.35);
  background:#222; pointer-events:none;
}
.sg-ava img{ width:100%; height:100%; object-fit:cover; display:block }

/* small letter pill (M / F / M/F) */
.sg-letterpill{ display:inline-flex; align-items:center; justify-content:center;
  min-width:18px; height:18px; padding:0 6px; border-radius:999px;
  border:1px solid rgba(255,255,255,.10); font-size:10px; line-height:1;
}



#sg-save-to-pg-slot{
  display:block;
  width:100%;
  padding:0 8px;          /* side breathing room */
  box-sizing:border-box;  /* keep full width including padding */
}

/* let the corner avatar hang out a bit */
.sg-cardrow{ position:relative; overflow:visible }

/* top-right author bubble on cards */
.sg-author-ava{
  position:absolute; top:-8px; right:-8px;
  width:28px; height:28px; border-radius:999px; overflow:hidden;
  border:2px solid rgba(255,255,255,.22);
  background:#000; box-shadow:0 2px 8px rgba(0,0,0,.45); z-index:5;
}
.sg-author-ava img{ width:100%; height:100%; object-fit:cover; display:block; }




/* Success rate chips – normal pill; when selected = colored w/ lighter outline + darker interior */
.sg-rate .sg-pill{
  background:#101012;
  color:#f7f4ef;
  opacity:1;
  border:1px solid rgba(255,255,255,0.10);
  box-shadow:none;
}
.sg-rate .sg-pill.on{
  color:#fff;
  border-color:rgba(255,255,255,0.35);
  box-shadow:inset 0 0 0 9999px rgba(255,255,255,0.06);
}
.sg-rate .sg-pill.on.rate-low{background:linear-gradient(#6f1f1f,#4d1212);}
.sg-rate .sg-pill.on.rate-moderate{background:linear-gradient(#123567,#0a1f49);}
.sg-rate .sg-pill.on.rate-high{background:linear-gradient(#1e5b37,#0f3c25);}




    .sg-s1{display:grid;gap:10px}
    .sg-bar{display:flex;align-items:center;justify-content:space-between;background:${UI.bar};border-radius:14px;padding:10px 12px;font-size:14px}
    .sg-bar .label-left{color:${UI.faint};font-weight:500;margin-right:12px}
    .sg-bar .right{display:flex;align-items:center;gap:8px;margin-left:auto}
    .sg-input{height:42px;border-radius:12px;border:1px solid ${UI.border};background:${UI.bar};color:${UI.text};padding:8px 10px;outline:none}
    .sg-input:focus{outline:none;box-shadow:0 0 0 1px rgba(255,255,255,.15)}
    .sg-search::placeholder{font-size:14px}
    /* shared dropdown */
    .sg-combo{position:relative;min-width:260px}
    .sg-combo .field{width:260px;cursor:pointer}
  .sg-gmenu{
  position:absolute;left:0;z-index:9999;margin-top:8px;
  background:#101012;border:1px solid rgba(255,255,255,0.10);border-radius:12px;padding:8px;
  max-height:min(50vh,320px);   /* fits in modal/viewport */
  overflow-y:auto;               /* vertical scroll only */
  overflow-x:hidden;             /* no horizontal scroll */
  box-shadow:0 10px 24px rgba(0,0,0,.35)
}

    .sg-gmenu .sg-input{width:100%;margin-bottom:8px}
    .sg-opt{padding:8px 10px;border-radius:10px;cursor:pointer;outline:none}
.sg-opt{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis }


/* Normalize the Type icon size + force white */
.sg-typeicon{
  width:12px;height:12px;display:inline-block;flex:0 0 12px;
  background-size:contain;background-position:center;background-repeat:no-repeat;
  filter:invert(1) grayscale(1)
}




/* Better alignment + highlight for "Add new…" row inside dropdown */
.sg-addrow{ display:flex; gap:6px; align-items:center }
.sg-addrow .sg-input{ height:42px; }
.sg-addrow .sg-btn{ height:42px; line-height:42px; padding:0 12px; }


.sg-addnew{
  padding:8px 10px; border-radius:10px; margin:0 0 6px;
  background:rgba(255,255,255,.10); font-weight:600;
}

/* Save-to-Genie near Styles: not full width, with side spacing */
/* Save-to-Genie next to the "Styles" label */
#sg-save-to-pg-block{
  display:block; width:100%;
  margin-top:10px;
  height:42px; line-height:42px; padding:0 14px;
  font-size:13px; border-radius:14px;
}




    .sg-opt:hover,.sg-opt:focus{background:rgba(255,255,255,.08);outline:none}
    /* dropdown separator – reversed (fade upward) */
.sg-opt.sep{
  height:6px;
  margin:6px -8px 6px;
  padding:0;
  background:linear-gradient(to top, rgba(255,255,255,0.10), rgba(255,255,255,0));
  border:0;
}


    .sg-seg{display:flex;gap:6px;background:${UI.bar};padding:4px;border-radius:14px;border:1px solid ${UI.border}}
/* Remove outer outline for Success Rate & Type in modal */
.sg-seg.sg-rate,
.sg-seg.sg-type{
  border:0;
  background:transparent;
  padding:0;
}

    .sg-pill{padding:6px 10px;border-radius:10px;background:transparent;color:${UI.faint};cursor:pointer;outline:none}
    .sg-pill.on{background:rgba(255,255,255,.12);color:${UI.text}}

    .sg-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:12px}
    .sg-search{flex:1;min-width:0}
    .sg-sort{position:relative}
    .sg-sortbtn{min-width:220px;display:flex;align-items:center;justify-content:space-between}
    .sg-sortbtn .label{color:#7e7e85;margin-right:8px}
    .sg-sortbtn .val{flex:1;text-align:left}
    .sg-sortmenu{position:absolute;right:0;top:46px;background:#101012;border:1px solid ${UI.border};border-radius:12px;padding:8px;box-shadow:0 10px 24px rgba(0,0,0,.35);z-index:5000}
    .sg-sortmenu .item{padding:8px 10px;border-radius:10px;cursor:pointer;outline:none}
    .sg-sortmenu .item:hover,.sg-sortmenu .item:focus{background:rgba(255,255,255,.08);outline:none}

    .sg-list{display:grid;gap:12px}
    .sg-empty{display:grid;place-items:center;padding:40px 10px;color:${UI.faint};font-size:14px}
    .sg-cardrow{border:1px solid ${UI.cardBorder};border-radius:14px;padding:10px;background:${UI.cardBg};display:grid;gap:8px;max-width:100%}
    .sg-cardrow.sel{background:${UI.cardBgSel};border-color:${UI.grayOutline};box-shadow:0 0 14px 0 rgba(255,255,255,.12)}

    .sg-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .sg-left{display:flex;align-items:center;gap:8px;font-weight:600;min-width:0}
    .sg-left span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
    .sg-ver{padding:2px 8px;border-radius:999px;font-size:12px;border:1px solid ${UI.border}}
    .sg-ver.latest{background:${UI.pink};color:#fff}
    .sg-ver.prev{background:#fff;color:#1a1a1a}
    .sg-ver.old{background:transparent;border-color:${UI.border};color:${UI.text}}

    .sg-actions{display:flex;align-items:center;gap:6px;user-select:none}
    .sg-iconbtn{width:28px;height:28px;border:1px solid ${UI.border};border-radius:10px;background:#181818;display:grid;place-items:center;cursor:pointer;outline:none;user-select:none}
    .sg-iconbtn svg{width:16px;height:16px}
.sg-iconbtn img{width:16px;height:16px;display:block}
    .sg-star svg{fill:${UI.starIdle}}
    .sg-star.on svg{fill:#FFA500}

    .sg-desc{
  font-size:13px; opacity:.95; line-height:1.35;
  display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical;
  overflow:hidden; max-height:calc(1.35em * 3);
}


    .sg-bottom{
  display:flex;align-items:center;justify-content:space-between;
  gap:6px;flex-wrap:nowrap
}
    .sg-tags{display:flex;gap:4px;align-items:center;flex:1 1 auto;min-width:0;white-space:nowrap;flex-wrap:nowrap;overflow:hidden}



    .sg-tag{display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.10);border-radius:999px;padding:2px 6px;font-size:11px;background:transparent;line-height:1}
    .sg-srlabel{font-size:11px;opacity:.85;margin-right:2px}
    .sg-srchip{display:inline-flex;align-items:center;justify-content:center;border:1px solid transparent;border-radius:999px;padding:2px 6px;font-size:11px;line-height:1;margin-left:0}
    .sr-high{background:rgba(46,204,113,.25);border-color:rgba(46,204,113,.55)}
    .sr-mod{background:rgba(15,105,241,.25);border-color:rgba(15,105,241,.55)}
    .sr-low{background:rgba(231,76,60,.25);border-color:rgba(231,76,60,.55)}

    .sg-metrics{display:flex;align-items:center;gap:6px}
    .sg-votes{display:flex;gap:4px;align-items:center}
    .sg-vbtn{
  min-width:38px;height:24px;border:1px solid ${UI.border};border-radius:10px;
  background:${UI.btn};display:flex;align-items:center;justify-content:center;
  gap:4px;cursor:pointer;color:${UI.voteIdle};font-size:11px
}
    .sg-vbtn svg{width:12px;height:12px;fill:${UI.voteIdle}}
    .sg-vbtn.on,.sg-vbtn.on svg{color:#fff;fill:#fff}

    .sg-pager{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;margin-top:16px}
    .sg-prev{justify-self:start;background:${UI.btn};border-color:${UI.border};outline:none}
    .sg-next{justify-self:end;background:${UI.btn};border-color:${UI.border};outline:none}
    .sg-prev:hover,.sg-next:hover{background:#333335}
    .sg-prev[disabled],.sg-next[disabled]{opacity:.45;pointer-events:none}
    .sg-pageinfo{text-align:center;font-size:12px;opacity:.7}
    .sg-subinfo{text-align:center;font-size:12px;opacity:.45;margin-top:12px}

    /* Login gate */
    .sg-gate{position:relative;overflow:hidden;border-radius:16px}
    .sg-gate .bgfx{ position:absolute;inset:-20%;
      background: radial-gradient(600px 280px at 60% 110%, rgba(255,122,0,.12), transparent 60%),
                  radial-gradient(400px 220px at 40% -10%, rgba(255,90,182,.12), transparent 60%),
                  radial-gradient(500px 260px at 90% 20%, rgba(255,176,0,.12), transparent 60%);
      filter: blur(18px); pointer-events:none; }
    .sg-gate .inner{position:relative;padding:26px;background:${UI.card};border:1px solid ${UI.cardBorder};border-radius:16px;display:grid;gap:14px;place-items:center;text-align:center}
    .sg-gtitle{display:flex;align-items:center;gap:10px;font-weight:800;font-size:22px}
    .sg-gtitle svg{width:24px;height:24px}
    .sg-gcopy{color:${UI.faint};max-width:560px;font-size:13px}
    .sg-login{position:relative;height:42px;border-radius:999px;border:1px solid ${UI.border};
      background:linear-gradient(90deg,#ff7a00 0%,#ffb000 25%,#ff5ab6 60%,#ff7a00 100%);
      color:#fff;padding:0 16px;font-weight:600;font-size:14px;outline:none;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;
      transition: box-shadow .15s ease, filter .15s ease}
    .sg-login:hover{ box-shadow: 0 0 0 9999px rgba(255,255,255,0.05) inset; }
    .sg-login .gicon{width:14px;height:14px;display:inline-block;margin-right:8px;background-image:url("${GOOGLE_BASE64}");
      background-repeat:no-repeat;background-size:14px 14px; filter: invert(1) brightness(1.2); }
    .sg-gsi-slot{position:absolute; inset:0; opacity:0; pointer-events:none;}

    /* Apply button */
    .sg-apply{
      height:42px;border-radius:14px;border:1px solid ${UI.border};padding:0 16px;
      background:linear-gradient(90deg,#ff7a00 0%,#ffb000 25%,#ff5ab6 60%,#ff7a00 100%);
      color:#fff;font-size:14px;font-weight:500;outline:none;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;
      transition: box-shadow .15s ease, filter .15s ease;
    }
    .sg-apply:hover{ box-shadow: 0 0 0 9999px rgba(255,255,255,0.05) inset; }

    /* Modal */
    .sg-ol{position:fixed;inset:0;background:rgba(0,0,0,.38);backdrop-filter:blur(6px);z-index:999999;display:grid;place-items:center}
    .sg-modal{width:min(760px,92vw);max-height:86vh;overflow:auto;background:${UI.bar};border:1px solid ${UI.border};border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,.5)}

/* --- PATCH: Modal layout / chips / alignment --- */


/* Force grid rows in modal so fields never overlap */
.sg-modal .sg-row{ display:grid !important; gap:14px }


/* Row 1: Genre | Version | Weirdness | Style Influence */
.sg-modal .sg-row.row1{
  grid-template-columns: minmax(240px,1fr) 150px 120px 140px; /* Version column a bit narrower */
}
@media (max-width: 860px){
  .sg-modal .sg-row.row1{ grid-template-columns: 1fr }
}

/* Make modal combos flex to their track (no forced min-width) */
.sg-modal .sg-combo{ min-width:0 }          /* <— new */
.sg-modal .sg-combo .field{ width:100% }    /* keep */
.sg-modal .sg-num{ width:100% }


.sg-avatar-corner{
  position:absolute; top:-6px; right:-6px;
  width:26px; height:26px; border-radius:999px;
  overflow:hidden; border:1px solid rgba(255,255,255,0.25);
  box-shadow:0 2px 6px rgba(0,0,0,.35); background:#222;
}
.sg-avatar-corner img{ width:100%; height:100%; object-fit:cover; display:block; }


/* --- PATCH: Keep list/cards inside the panel --- */
#suno-genie-root, .sg-card{ max-width:100% }
.sg-list, .sg-cardrow{ max-width:100%; box-sizing:border-box }
.sg-cardrow{ overflow:visible } /* let corner avatar render outside the card */
/* keep avatar above action icons */
.sg-ava, .sg-author-ava { z-index: 5; }
.sg-top, .sg-bottom{ min-width:0 }
.sg-left{ min-width:0; flex:1 1 auto }
.sg-desc{ word-break:break-word; overflow-wrap:anywhere }


    .sg-mhead{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid ${UI.border}}
    .sg-mtitle{font-weight:700}
    .sg-mactions{display:flex;gap:8px;align-items:center}
    .sg-mbody{padding:14px;display:grid;gap:16px}
.sg-field{display:grid;gap:10px}
    .sg-label{font-size:13px;color:${UI.faint}}
    .sg-text,.sg-area,.sg-num{border:1px solid ${UI.cardBorder};background:${UI.card};color:${UI.text};border-radius:12px;padding:10px;font-size:14px;outline:none}
    .sg-area{min-height:90px;resize:vertical}
    .sg-num{width:120px}
    .sg-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
    .sg-foot{display:none} /* footer hidden: actions moved to header */
    .sg-err{color:#ff7a7a;font-size:12px}
    .sg-badge{display:inline-flex;align-items:center;gap:6px;border:1px solid ${UI.border};background:${UI.card};border-radius:999px;padding:6px 10px;font-size:12px}
    .sg-inline{display:flex;gap:8px;align-items:center}
    .sg-hidden{display:none}
  `);

  /******** UI builders ********/
  function buildGate(){
    const root=document.createElement('div');
    root.className='sg-root';
    root.id='suno-genie-root';

    const gate=document.createElement('div');
    gate.className='sg-gate';
    const bg=document.createElement('div'); bg.className='bgfx';
    const inner=document.createElement('div'); inner.className='inner';

    const title=document.createElement('div');
    title.className='sg-gtitle';
    title.innerHTML = `${SVG.genie}<span>Prompt Genie</span>`;

    const msg=document.createElement('div');
    msg.className='sg-gcopy';
    msg.textContent='Unlock the power of prompting';

    const btn=document.createElement('button');
    btn.className='sg-login sg-zoom';
    btn.innerHTML = `<span class="gicon"></span><span>Login with Google</span>`;
    const gsiSlot=document.createElement('div');
    gsiSlot.className='sg-gsi-slot';
    btn.appendChild(gsiSlot);
    btn.addEventListener('click', async ()=>{
      btn.disabled=true; const prev=btn.innerHTML; btn.textContent='Signing in…';
      try{ await startGoogleLogin(gsiSlot); }
      catch(e){ console.error('[SunoGenie] login failed',e); alert('Login failed: '+e.message); }
      finally{ btn.disabled=false; btn.innerHTML=prev; }
    });

    inner.append(title, msg, btn);
    gate.append(bg, inner);
    root.append(gate);
    return { root };
  }

  function buildPanel(state){
    const root=document.createElement('div');
    root.className='sg-root';
    root.id='suno-genie-root';

    const card=document.createElement('div');
    card.className='sg-card';

    // header
    const head=document.createElement('div');
    head.className='sg-head';

    const title=document.createElement('div');
    title.className='sg-title';
    title.innerHTML = `${SVG.genie}<span>Prompt Genie</span>`;

    const right=document.createElement('div');
    right.className='right';

    // Apply (gradient) before Go back
    const applyTop=document.createElement('button');
    applyTop.className='sg-apply sg-zoom';
    applyTop.textContent='Apply';
    applyTop.style.display='none';

    const backBtn=document.createElement('button');
    backBtn.className='sg-btn sg-subtle sg-zoom';
    backBtn.textContent='Go back';
    backBtn.style.display='none';

    // avatar + dropdown
    const {name,email,avatar}=getProfile();
    const avatarBtn=document.createElement('div');
    avatarBtn.className='sg-avatar';
    if (avatar) { avatarBtn.innerHTML = `<img alt="profile" src="${avatar}">`; }
    else { avatarBtn.innerHTML = SVG.user; }

    const menuWrap=document.createElement('div');
    menuWrap.className='sg-menuwrap';
    const menu=document.createElement('div');
    menu.className='sg-menu';
    menu.style.display='none';

    const meta=document.createElement('div');
    meta.className='meta';
    meta.innerHTML = `<span class="name">${name||'Signed in'}</span><span class="email">${email||''}</span>`;

    const syncIt=document.createElement('div');
    syncIt.className='item';
    syncIt.textContent='Sync now';

    const signOut=document.createElement('div');
    signOut.className='item';
    signOut.textContent='Sign out';

    syncIt.addEventListener('click', async ()=>{
      menu.style.display='none';
      await doSync(state, true);
      rebuildVer();
      render();
    });
    signOut.addEventListener('click', async ()=>{
  menu.style.display='none';
  clearAuth();
  unmountSaveUnderAdvancedOptions();
  ADV_OBSERVER?.disconnect();
  await boot(true);
});



menu.append(meta, syncIt, signOut);


    
    menuWrap.append(avatarBtn, menu);
    avatarBtn.addEventListener('click',(e)=>{
      e.stopPropagation();
      menu.style.display = (menu.style.display==='none') ? 'block' : 'none';
    });
    document.addEventListener('click',(e)=>{
      if(!menu.contains(e.target) && !avatarBtn.contains(e.target)) menu.style.display='none';
    });

    right.append(applyTop, backBtn, menuWrap);
    head.append(title, right);

    // step1
    const s1=document.createElement('div');
    s1.className='sg-s1';

    // Genre (filter)
    const barG=document.createElement('div');
    barG.className='sg-bar';
    barG.innerHTML = `<div class="label-left">Genre</div>`;
    const rightG=document.createElement('div');
    rightG.className='right';
    const combo=document.createElement('div');
    combo.className='sg-combo';
    const gInput=document.createElement('input');
    gInput.className='sg-input field';
    gInput.placeholder='Select genre';
    gInput.dataset.all='1';
    gInput.value='All genres';
    const gMenu=document.createElement('div');
    gMenu.className='sg-gmenu';
    gMenu.style.display='none';
    const gSearch=document.createElement('input');
    gSearch.className='sg-input';
    gSearch.placeholder='Search...';
    const gList=document.createElement('div');
    gMenu.append(gSearch,gList);
    combo.append(gInput,gMenu);
    rightG.append(combo);
    barG.append(rightG);

    // Gender
    const barV=document.createElement('div');
    barV.className='sg-bar';
    barV.innerHTML = `<div class="label-left">Vocal Gender</div>`;
    const rightV=document.createElement('div'); rightV.className='right';
    const segV=document.createElement('div'); segV.className='sg-seg';
    let pickedGender='';
    ['All','Male','Female'].forEach(n=>{
      const b=document.createElement('button');
      b.className='sg-pill'; b.textContent=n;
      if(n==='All') b.classList.add('on');
      b.addEventListener('click',()=>{ pickedGender=(n==='All'?'':n); [...segV.children].forEach(x=>x.classList.remove('on')); b.classList.add('on'); });
      segV.appendChild(b);
    });
    rightV.append(segV);
    barV.append(rightV);

    // Version
    const barS=document.createElement('div');
    barS.className='sg-bar';
    barS.innerHTML = `<div class="label-left">Suno Version</div>`;
    const rightS=document.createElement('div'); rightS.className='right';
    const segS=document.createElement('div'); segS.className='sg-seg';
    let pickedVersion='';
    function rebuildVer(){
      segS.innerHTML='';
      ['All',...state.versionOrder.latest3].forEach(n=>{
        const b=document.createElement('button');
        b.className='sg-pill'; b.textContent=n;
        if(n==='All') b.classList.add('on');
        b.addEventListener('click',()=>{ pickedVersion=(n==='All'?'':n); [...segS.children].forEach(x=>x.classList.remove('on')); b.classList.add('on'); });
        segS.appendChild(b);
      });
    }
    rebuildVer();
    rightS.append(segS);
    barS.append(rightS);

    const nextBtn=document.createElement('button');
    nextBtn.className='sg-btn sg-zoom';
    nextBtn.style.width='100%';
    nextBtn.textContent='Next';
    s1.append(barG,barV,barS,nextBtn);

    // step2
    const s2=document.createElement('div');
    s2.style.display='none';

    // toolbar
    const toolbar=document.createElement('div');
    toolbar.className='sg-toolbar';

    const search=document.createElement('input');
    search.className='sg-input sg-search';
    search.placeholder='Search prompt...';

    const sortWrap=document.createElement('div');
    sortWrap.className='sg-sort';
    const sortBtn=document.createElement('button');
    sortBtn.className='sg-btn sg-zoom sg-sortbtn';
    sortBtn.innerHTML = `<span class="label">Sort by</span><span class="val">Newest version</span><span>▾</span>`;
    const sortMenu=document.createElement('div');
    sortMenu.className='sg-sortmenu'; sortMenu.style.display='none';
    const sortOptions=[['favorite','Favorites'],['version','Newest version'],['success','Success rate'],['rating','Rating'],['az','A–Z']];
    let sortValue = REMEMBER ? (GM_getValue('sg_sort','version')) : 'version';

    function rebuildSort(){
      sortMenu.innerHTML='';
      sortOptions.forEach(([v,t])=>{
        const it=document.createElement('div');
        it.className='item';
        it.textContent=t; it.tabIndex=0;
        it.addEventListener('click',()=>{ sortValue=v; if(REMEMBER) GM_setValue('sg_sort',v); sortBtn.querySelector('.val').textContent=t; sortMenu.style.display='none'; page=1; render(); });
        sortMenu.appendChild(it);
      });
      const current = sortOptions.find(x=>x[0]===sortValue)||sortOptions[1];
      sortBtn.querySelector('.val').textContent=current[1];
    }
    function openSort(){ sortMenu.style.display='block'; sortMenu.style.width = sortBtn.offsetWidth + 'px'; }
    rebuildSort();
    sortBtn.addEventListener('click',()=> sortMenu.style.display==='none' ? openSort() : sortMenu.style.display='none');
    document.addEventListener('click',(e)=>{ if(!sortWrap.contains(e.target)) sortMenu.style.display='none'; });
    sortWrap.append(sortBtn,sortMenu);

    toolbar.append(search, sortWrap);

    const list=document.createElement('div'); list.className='sg-list';

    // pager + subinfo
    const pager=document.createElement('div'); pager.className='sg-pager';
    const prev=document.createElement('button'); prev.className='sg-btn sg-subtle sg-zoom sg-prev'; prev.textContent='← Previous page';
    const pageInfo=document.createElement('div'); pageInfo.className='sg-pageinfo';
    const next=document.createElement('button'); next.className='sg-btn sg-subtle sg-zoom sg-next'; next.textContent='Next page →';
    pager.append(prev,pageInfo,next);

    const subinfo=document.createElement('div'); subinfo.className='sg-subinfo';

    s2.append(toolbar,list,pager,subinfo);
    card.append(head,s1,s2);
    root.append(card);

    /***** Genre dropdown (filter area) *****/
    function allGenres(){ return [...new Set(state.rows.map(r=>r.genre).filter(Boolean))].sort((a,b)=>a.localeCompare(b)); }
    function fillMenu(){
      const q=(gSearch.value||'').toLowerCase();
      const arr=allGenres().filter(g=>g.toLowerCase().includes(q));
      gList.innerHTML='';
      const any=document.createElement('div'); any.className='sg-opt'; any.textContent='All';
      any.addEventListener('click',()=>{ gInput.dataset.all='1'; gInput.value='All genres'; gMenu.style.display='none'; if(REMEMBER) GM_setValue('sg_genre',''); });
      gList.appendChild(any);
      arr.forEach(g=>{
        const opt=document.createElement('div'); opt.className='sg-opt'; opt.textContent=g; opt.tabIndex=0;
        opt.addEventListener('click',()=>{ gInput.dataset.all='0'; gInput.value=g; gMenu.style.display='none'; if(REMEMBER) GM_setValue('sg_genre',g); });
        gList.appendChild(opt);
      });
    }
    function openMenu(){ gMenu.style.display='block'; gMenu.style.width = gInput.offsetWidth + 'px'; gSearch.value=''; gSearch.focus(); fillMenu(); }
    function closeMenu(){ gMenu.style.display='none'; }
    gInput.addEventListener('focus', openMenu);
    gInput.addEventListener('click', openMenu);
    gSearch.addEventListener('input', fillMenu);
    document.addEventListener('click',(e)=>{ if(!combo.contains(e.target)) closeMenu(); });
   // ✅ safer restore
if (REMEMBER) {
  const saved = (GM_getValue('sg_genre','') || '').trim();
  const genresSet = new Set(state.rows.map(r => (r.genre||'').toLowerCase()));
  if (saved && genresSet.has(saved.toLowerCase())) {
    gInput.dataset.all = '0';
    gInput.value = saved;
  } else {
    gInput.dataset.all = '1';
    gInput.value = 'All genres';
    GM_setValue('sg_genre','');
  }
}


    // -------- Modal ----------
    let currentOverlay=null;
    function closeModal(){
      if (!currentOverlay) return;
      currentOverlay.remove();
      currentOverlay=null;
    }
    function trapFocus(overlay){
      const focusables = overlay.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first=focusables[0], last=focusables[focusables.length-1];
      first.focus();
      overlay.addEventListener('keydown',(e)=>{
        if (e.key==='Escape'){ e.preventDefault(); closeModal(); }
        if (e.key!=='Tab') return;
        if (e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
      });
    }

    // modal helper: unified dropdown (searchable)
    function buildDropdown({
  placeholder='Select…',
  options=[],
  value='',
  searchable=false,
  showAddNew=false,
  onPick,
  maxHeightPx
} = {}) {
  const wrap = document.createElement('div'); wrap.className = 'sg-combo';
  const field = document.createElement('input'); field.className = 'sg-input field'; field.readOnly = true;
  field.placeholder = placeholder; field.value = value || '';

  const menu = document.createElement('div'); menu.className = 'sg-gmenu';
  menu.style.display = 'none';
  if (maxHeightPx) menu.style.maxHeight = maxHeightPx + 'px';

  let list = document.createElement('div');
  let searchI = null;
  if (searchable) {
    searchI = document.createElement('input'); searchI.className = 'sg-input'; searchI.placeholder = 'Search...';
    menu.appendChild(searchI);
  }
  menu.appendChild(list);
  wrap.append(field, menu);

  let _opts = [...options];

  function renderList(q='') {
    list.innerHTML = '';

    if (showAddNew) {
      const holder = document.createElement('div'); holder.style.padding = '0 10px 8px';

      const add = document.createElement('div'); add.className = 'sg-opt sg-addnew'; add.textContent = 'Add new…';
      holder.appendChild(add);

      add.addEventListener('click', (ev) => {
        ev.stopPropagation();
        add.remove();

        const row = document.createElement('div'); row.className = 'sg-addrow';
row.style.position = 'relative';
        const newI = document.createElement('input'); newI.className = 'sg-input'; newI.placeholder = 'Type new value…'; newI.style.flex = '1';
        const ok = document.createElement('button'); ok.className = 'sg-btn sg-subtle'; ok.textContent = 'OK';
        ok.addEventListener('click', (ev2) => {
          ev2.stopPropagation();
          const v = (newI.value || '').trim();
          if (!v) return;
          field.value = v;
          menu.style.display = 'none';
          onPick?.(v);
        });
        row.append(newI, ok);
        holder.appendChild(row);
        newI.focus();
      });

      list.appendChild(holder);
      /* (no separator – keeps the menu compact) */
    }

    const norm = (s) => String(s ?? '').trim();
    const filtered = _opts
      .map(norm).filter(Boolean)
      .filter(o => norm(o).toLowerCase().includes((q || '').toLowerCase()))
      .map(o => {
        const it = document.createElement('div'); it.className = 'sg-opt'; it.textContent = o;
        it.addEventListener('click', () => { field.value = o; menu.style.display = 'none'; onPick?.(field.value); });
        return it;
      });

    filtered.forEach(it => list.appendChild(it));
  }

  function open() {
    menu.style.display = 'block';
    if (searchI) { searchI.value = ''; searchI.focus(); }
    renderList('');
    menu.style.width = field.offsetWidth + 'px';
  }
  function close() { menu.style.display = 'none'; }

  if (searchI) searchI.addEventListener('input', () => renderList(searchI.value || ''));
  field.addEventListener('click', (e) => { e.stopPropagation(); open(); });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });

  renderList('');
  return {
    root: wrap,
    setOptions: (opts) => { _opts = [...opts]; renderList(searchI?.value || ''); },
    setValue:   (v)   => { field.value = v || ''; },
    getValue:   ()    => field.value || '',
    open, close
  };
}



function showToast(msg, isError=false){
  const el = document.createElement('div');
  el.className = 'sg-toast' + (isError ? ' error' : '');
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=>{ el.remove(); }, 1800);
}


    async function openEditCreateModal(mode, initial, onDone){
  // mode: 'edit'|'create'
  const overlay=document.createElement('div');
  overlay.className='sg-ol';

  const modal=document.createElement('div');
  modal.className='sg-modal';
  overlay.appendChild(modal);

  // header
  const head=document.createElement('div'); head.className='sg-mhead';
  const mtitle=document.createElement('div'); mtitle.className='sg-mtitle';
  mtitle.textContent = mode==='edit' ? 'Edit Prompt Details' : 'Create Prompt';

  const actions=document.createElement('div'); actions.className='sg-mactions';
  const cancelB=document.createElement('button'); cancelB.className='sg-btn sg-subtle'; cancelB.textContent='Cancel';
  const primaryB=document.createElement('button'); primaryB.className='sg-btn'; primaryB.textContent = mode==='edit' ? 'Save' : 'Create';

  // delete (only in edit)
  let deleteB = null;
  if (mode === 'edit'){
    deleteB = document.createElement('button');
    deleteB.className = 'sg-btn sg-subtle sg-del';
    deleteB.title = 'Delete';
    deleteB.innerHTML = '<img alt="del" style="width:16px;height:16px;filter:invert(1)" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBMaWNlbnNlOiBNSVQuIE1hZGUgYnkgTmV1aWNvbnM6IGh0dHBzOi8vZ2l0aHViLmNvbS9uZXVpY29ucy9uZXUgLS0+CjxzdmcgZmlsbD0iIzAwMDAwMCIgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUuNzU1LDIwLjI4Myw0LDhIMjBMMTguMjQ1LDIwLjI4M0EyLDIsMCwwLDEsMTYuMjY1LDIySDcuNzM1QTIsMiwwLDAsMSw1Ljc1NSwyMC4yODNaTTIxLDRIMTZWM2ExLDEsMCwwLDAtMS0xSDlBMSwxLDAsMCwwLDgsM1Y0SDNBMSwxLDAsMCwwLDMsNkgyMWExLDEsMCwwLDAsMC0yWiIvPjwvc3ZnPg==">';
    actions.appendChild(deleteB);
  }

  actions.append(cancelB, primaryB);
  head.append(mtitle, actions);

  const body=document.createElement('div'); body.className='sg-mbody';

  // helpers
  const field = (label, node, helpRight)=> {
    const wrap=document.createElement('div'); wrap.className='sg-field';
    const top=document.createElement('div'); top.className='sg-inline';
    const lab=document.createElement('div'); lab.className='sg-label'; lab.textContent=label;
    const err=document.createElement('div'); err.className='sg-err sg-hidden'; err.textContent='error';
    top.append(lab, err);
    wrap.append(top,node);
    if (helpRight) wrap.append(helpRight);
    return {wrap,err,node};
  };

  // name
  const nameI=document.createElement('input'); nameI.className='sg-text'; nameI.placeholder='Prompt title'; nameI.maxLength=140;
  nameI.value = initial.name ?? '';
  const fName = field('Prompt Name *', nameI);

  // desc (+ counter)
  const descA = document.createElement('textarea');
  descA.className = 'sg-area';
  descA.placeholder = 'Prompt description…';
  descA.value = initial.desc_text ?? initial.desc ?? '';
  const DESC_LIMIT = 225;
  descA.maxLength = DESC_LIMIT;
  const fDesc = field('Prompt Description', descA);
  const descCount = document.createElement('div');
  descCount.className = 'sg-count';
  fDesc.wrap.appendChild(descCount);
  const updateDescCount = () => {
    const n = (descA.value || '').length;
    descCount.textContent = `${n}/${DESC_LIMIT}`;
    descCount.classList.toggle('over', n >= DESC_LIMIT);
  };
  descA.addEventListener('input', updateDescCount);
  updateDescCount();

  // dropdowns
  const genreDD = buildDropdown({ placeholder:'Select genre', options:[], value:(initial.genre||''), searchable:true, showAddNew:true, maxHeightPx:180 });
  const fGenre = field('Genre *', genreDD.root);

  const versionDD = buildDropdown({ placeholder:'Select Suno version', options:[], value:(initial.version ? (String(initial.version).startsWith('v')?initial.version:`v${initial.version}`) : ''), searchable:true, maxHeightPx:150 });
  const fVer = field('Suno Version *', versionDD.root);

  // type
let currentType = (String(initial.tags||initial.type||'').toLowerCase().includes('instrumental')) ? 'instrumental' : 'lyrics';
const typeSeg = document.createElement('div'); typeSeg.className='sg-seg sg-type';
['Lyrics','Instrumental'].forEach(lbl=>{
  const v = lbl.toLowerCase();
  const b = document.createElement('button'); b.className='sg-pill'; b.textContent=lbl;
  if (currentType === v) b.classList.add('on');
  b.addEventListener('click', ()=>{
    const v2 = lbl.toLowerCase();
    currentType = (currentType === v2 ? '' : v2);
    [...typeSeg.children].forEach(x=>x.classList.remove('on'));
    if (currentType) b.classList.add('on');
    syncTypeLocks();         // ⟵ keep UI in sync with the chosen type
    markDirty();
  });
  typeSeg.appendChild(b);
});
const fType = field('Type *', typeSeg);


  // gender
  let currentGender = String(initial.vocal_gender || initial.gender || '').toLowerCase();
  if (currentGender !== 'male' && currentGender !== 'female') currentGender = ''; // '' means ALL
  const genderSeg = document.createElement('div'); genderSeg.className = 'sg-seg sg-gender';
  [['M','male'],['F','female'],['ALL','']].forEach(([label,val])=>{
    const b = document.createElement('button'); b.className = 'sg-pill'; b.textContent = label;
    if (currentGender === val) b.classList.add('on');
    b.addEventListener('click', ()=>{ currentGender = (currentGender === val) ? '' : val; [...genderSeg.children].forEach(x=>x.classList.remove('on')); if (currentGender === val) b.classList.add('on'); markDirty(); });
    genderSeg.appendChild(b);
  });
  const fGender = field('Gender *', genderSeg);

  // numbers
  const weirdI=document.createElement('input'); weirdI.type='number'; weirdI.className='sg-num'; weirdI.min='0'; weirdI.max='100'; weirdI.placeholder='0–100';
  const inflI =document.createElement('input'); inflI .type='number'; inflI .className='sg-num'; inflI .min='0'; inflI .max='100'; inflI .placeholder='0–100';
  weirdI.value = (initial.weirdness ?? initial.weird ?? '') === '' ? '' : String(Math.max(0,Math.min(100,parseInt(initial.weirdness ?? initial.weird ?? 0))));
  inflI .value = (initial.style_influence ?? initial.influence ?? '') === '' ? '' : String(Math.max(0,Math.min(100,parseInt(initial.style_influence ?? initial.influence ?? 0))));
  const fWeird = field('Weirdness (0–100)', weirdI);
  const fInfl  = field('Style Influence (0–100)', inflI );

function syncTypeLocks(){
  const inst = (currentType === 'instrumental');

  // disable inputs
  weirdI.disabled = inst;
  inflI.disabled  = inst;
  [...genderSeg.querySelectorAll('button')].forEach(b => b.disabled = inst);

  // visual dim (optional; add CSS .sg-disabled if you want)
  fWeird.wrap.classList.toggle('sg-disabled', inst);
  fInfl.wrap.classList.toggle('sg-disabled', inst);
  fGender.wrap.classList.toggle('sg-disabled', inst);
}


  // style
  const styleA=document.createElement('textarea'); styleA.className='sg-area'; styleA.placeholder='Style tags or free text…';
  styleA.value = initial.style ?? initial.tags ?? '';
  const fStyle = field('Style *', styleA);

  // success rate
  let currentSR = (mode==='edit') ? (String(initial.success_rate ?? initial.success ?? '').toLowerCase()) : '';
  if (!['low','moderate','high'].includes(currentSR)) currentSR = '';
  const srSeg = document.createElement('div'); srSeg.className='sg-seg sg-rate';
  ['low','moderate','high'].forEach(v=>{
    const b=document.createElement('button'); b.className='sg-pill rate-'+v; b.textContent=v[0].toUpperCase()+v.slice(1);
    if (currentSR===v) b.classList.add('on');
    b.addEventListener('click',()=>{ currentSR = (currentSR===v ? '' : v); [...srSeg.children].forEach(x=>x.classList.remove('on')); if (currentSR) srSeg.querySelector('.rate-'+currentSR)?.classList.add('on'); markDirty(); });
    srSeg.appendChild(b);
  });
  const fSR = field('Success Rate *', srSeg);

  // added by
  const prof = getProfile();
  const createdName = deriveCreatorName(initial) || prof.name || 'You';
  const createdBy = document.createElement('div'); createdBy.className = 'sg-badge';
  const createdAvatarUrl = initial.avatar || prof.avatar || '';
  if (createdAvatarUrl){
    const img = document.createElement('img'); img.src = createdAvatarUrl; img.alt = createdName;
    img.style.width='18px'; img.style.height='18px'; img.style.borderRadius='50%'; img.style.objectFit='cover'; img.style.border='1px solid rgba(255,255,255,.18)';
    createdBy.appendChild(img);
  }
  createdBy.appendChild(document.createTextNode(' '+createdName));
  const fBy = field('Added by', createdBy);

  // layout
  const row1 = document.createElement('div'); row1.className = 'sg-row row1';
  row1.append(fGenre.wrap, fVer.wrap, fWeird.wrap, fInfl.wrap);
  const row3 = document.createElement('div'); row3.className = 'sg-row';
  row3.style.display='grid'; row3.style.gridTemplateColumns='1fr 1fr 1fr 1fr'; row3.style.gap='10px';
  row3.append(fSR.wrap, fType.wrap, fGender.wrap, fBy.wrap);

  body.append(fName.wrap, fDesc.wrap, row1, fStyle.wrap, row3);
syncTypeLocks();

  modal.append(head, body);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) e.stopPropagation(); });
  document.body.appendChild(overlay);

  // focus trap
  (function trap(){
    const focusables = overlay.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first=focusables[0], last=focusables[focusables.length-1];
    first.focus();
    overlay.addEventListener('keydown',(e)=>{
      if (e.key==='Escape'){ e.preventDefault(); close(); }
      if (e.key!=='Tab') return;
      if (e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    });
  })();

  function close(){ overlay.remove(); }

  // populate dropdowns (async)
  (async ()=>{
    try{
      // genres
      const cachedG = getCache(GENRES_CACHE_KEY, []);
      if (cachedG.length) genreDD.setOptions(cachedG);
      try{
        const res = await api.genres();
        const box = Array.isArray(res) ? res[0] : res;
        const genres = (Array.isArray(box?.genres) ? box.genres : []).map(String).filter(Boolean);
        const sorted = [...new Set(genres)].sort((a,b)=>String(a).localeCompare(String(b)));
        genreDD.setOptions(sorted); setCache(GENRES_CACHE_KEY, sorted);
      }catch{}
      const valG = (initial.genre||'').trim(); if (valG) genreDD.setValue(valG);

      // versions
      const useSorted = (arr)=>{ const asV = arr.map(s => s.startsWith('v') ? s : `v${s}`); const sorted = sortVersionsNumeric(asV).reverse(); versionDD.setOptions(sorted); return sorted; };
      const cachedV = getCache(VERSIONS_CACHE_KEY, []);
      if (cachedV.length) versionDD.setOptions(cachedV);
      try{
        const res = await api.versions();
        const box = Array.isArray(res) ? res[0] : res;
        const versions = (Array.isArray(box?.versions) ? box.versions : []).map(v => String(v?.label ?? v?.value ?? '').trim()).filter(Boolean);
        const sorted = useSorted(versions); setCache(VERSIONS_CACHE_KEY, sorted);
      }catch{
        if (!cachedV.length){ const fromRows = [...new Set(state.rows.map(r => `v${String(r.version||'')}`))]; useSorted(fromRows); }
      }
      const initV = initial.version ? (String(initial.version).startsWith('v') ? initial.version : `v${initial.version}`) : '';
      if (initV) versionDD.setValue(initV);
    }catch{}
  })();

  // dirty tracking
  const initialSnap = JSON.stringify({
    name: nameI.value, desc: descA.value, genre: genreDD.getValue(),
    version: versionDD.getValue(), style: styleA.value, sr: currentSR,
    type: currentType, gender: currentGender, weird: weirdI.value, infl: inflI.value
  });
  function markDirty(){
    const snap = JSON.stringify({
      name: nameI.value, desc: descA.value, genre: genreDD.getValue(),
      version: versionDD.getValue(), style: styleA.value, sr: currentSR,
      type: currentType, gender: currentGender, weird: weirdI.value, infl: inflI.value
    });
    primaryB.classList.toggle('sg-dirty', snap !== initialSnap);
  }
  [nameI, descA, styleA, weirdI, inflI].forEach(el => el.addEventListener('input', markDirty));
  primaryB.classList.remove('sg-dirty'); // start clean

  // validate
  function validate(){
    const err={};
    const clamp = (v)=>{ const n=parseInt(v||0,10); return Math.max(0,Math.min(100,isNaN(n)?0:n)); };

    if (!nameI.value.trim()) err.name='Title is required';

    const genreVal = (genreDD.getValue()||'').trim();
    if (!genreVal) err.genre='Genre is required';

    const verVal=(versionDD.getValue()||'').trim();
    if (!verVal) err.version='Suno version is required';

    if (!styleA.value.trim()) err.style='Style is required';
    if (!currentSR) err.sr='Please choose a success rate';
    if (!currentType) err.type='Please choose Lyrics or Instrumental';

    if (weirdI.value!=='') weirdI.value=String(clamp(weirdI.value));
    if (inflI.value!=='')  inflI.value =String(clamp(inflI.value));

    fName.err.classList.toggle('sg-hidden', !err.name); fName.err.textContent=err.name||'';
    fGenre.err.classList.toggle('sg-hidden', !err.genre); fGenre.err.textContent=err.genre||'';
    fVer.err.classList.toggle('sg-hidden', !err.version); fVer.err.textContent=err.version||'';
    fStyle.err.classList.toggle('sg-hidden', !err.style); fStyle.err.textContent=err.style||'';
    fSR.err.classList.toggle('sg-hidden', !err.sr); fSR.err.textContent=err.sr||'';
    fType.err.classList.toggle('sg-hidden', !err.type); fType.err.textContent=err.type||'';

    return { ok:Object.keys(err).length===0, genreVal, verVal };
  }

  // handlers
  cancelB.addEventListener('click', close);

  if (deleteB){
    deleteB.addEventListener('click', async ()=>{
      if (!confirm('Are you sure you want to delete this prompt?')) return;
      try{
        deleteB.disabled = true;
        await api.promptDelete(initial.id || initial.prompt_id);
        // remove from local state/cache immediately
        const idx = state.rows.findIndex(r => r.id === (initial.id || initial.prompt_id));
        if (idx >= 0) { state.rows.splice(idx,1); setCache(PROMPTS_CACHE_KEY, state.rows); }
        render();
        showToast('Prompt deleted');
        close();
        setTimeout(async()=>{ try{ await doSync(state,true); render(); }catch{} }, 0);
      }catch(e){
        showToast('Delete failed', true);
      }finally{
        deleteB.disabled = false;
      }
    });
  }

  primaryB.addEventListener('click', async () => {
    const v = validate();
    if (!v.ok) return;

const inst = (currentType === 'instrumental');

    const payload = {
  name: nameI.value.trim(),
  desc_text: descA.value.trim(),
  genre: v.genreVal,
  version: v.verVal,
  // force NULLs for instrumentals
  weirdness:       inst ? null : (weirdI.value === '' ? null : parseInt(weirdI.value, 10)),
  style_influence: inst ? null : (inflI.value === '' ? null : parseInt(inflI.value, 10)),
  style: styleA.value.trim(),
  success_rate: currentSR,
  tags: currentType,                 // 'lyrics' | 'instrumental'
  vocal_gender: inst ? null : (currentGender || null)   // '' -> null
};

    try{
      primaryB.disabled=true; cancelB.disabled=true;
      primaryB.textContent = mode==='edit' ? 'Saving…' : 'Creating…';

      const res = await api.promptSave(mode==='edit'
        ? { prompt_id: initial.id || initial.prompt_id, ...payload }
        : payload);

      // server may return { ok:false, error:'...' }
      if (res && res.ok === false){
        showToast(res.error || 'Save failed', true);
        return;
      }

      const row = res?.prompt || res?.row || res;
if (row && (row.prompt_id || row.id)){
  const n = normalizeOne(row);
  const idx2 = state.rows.findIndex(r=>r.id===n.id);
  if (idx2>=0) state.rows[idx2]=n; else state.rows.unshift(n);
  setCache(PROMPTS_CACHE_KEY, state.rows);

  // If the new row fits current filters, show it at the top immediately
  try { page = 1; } catch {}
  try { selectedId = n.id; } catch {}
  render();

  showToast(mode==='edit' ? 'Saved' : 'Created');

  // background refresh to reconcile with server
  setTimeout(async()=>{ try{ await doSync(state, true); render(); }catch{} }, 0);
}


      close();
      onDone?.();
    }catch(e){
      if (e && e.code==='AUTH'){ close(); boot(true); return; }
      showToast('Could not save', true);
    }finally{
      primaryB.disabled=false; cancelB.disabled=false;
      primaryB.textContent = mode==='edit' ? 'Save' : 'Create';
    }
  });
}



    // Prefill from the live Suno page
    function prefillFromSuno(){
  const versionBtn = document.querySelector('div[aria-label="Model Select Dropdown"]');
  const verTxt = (versionBtn?.textContent || '').trim();
  const ver = verTxt ? (verTxt.startsWith('v') ? verTxt : `v${verTxt}`) : '';

  const w = findRangeNear('Weirdness');
  const s = findRangeNear('Style Influence');
  let weirdness = null, influence = null;
  try{
    if (w) { const min=Number(w.min||0), max=Number(w.max||100); weirdness = Math.round(((w.value-min)/(max-min))*100); }
    if (s) { const min=Number(s.min||0), max=Number(s.max||100); influence = Math.round(((s.value-min)/(max-min))*100); }
  }catch{}

  let styleText = '';
  const tagsRoot = getStylesTarget();
  if (tagsRoot){
    if (tagsRoot.mode === 'tags-ta'){
      styleText = asCanonicalTagString(tagsRoot.el.value||'');
    } else {
      const set = readChipTexts(tagsRoot.root||tagsRoot.el);
      styleText = Array.from(set).join(', ');
    }
  }
  if (!styleText){
    const ta = getStyleDescEl();
    styleText = ta?.value || '';
  }

  const instOn = isInstrumentalEnabled(getInstrumentalToggle());
  const t = instOn ? 'instrumental' : 'lyrics';

  const gNow = readCurrentGenderFromUI(); // 'male' | 'female' | ''

  return {
    version: ver,
    weirdness: weirdness ?? 50,
    style_influence: influence ?? 50,
    style: styleText,
    tags: t,
    type: t,
    vocal_gender: gNow
  };
}



function readCurrentGenderFromUI(){
  const btns = findGenderButtons();
  const male = btns.find(b=>btnLabel(b)==='male');
  const female = btns.find(b=>btnLabel(b)==='female');
  const mOn = male && isGenderActive(male);
  const fOn = female && isGenderActive(female);
  if (mOn && !fOn) return 'male';
  if (fOn && !mOn) return 'female';
  return ''; // ALL
}





    // -------- List Rendering ----------
    let page=1, selectedId=null;

    function filtered(){
      const g = gInput.dataset.all==='1' ? '' : (gInput.value||'').trim().toLowerCase();
      const q=(search.value||'').toLowerCase();
      let arr = state.rows.filter(r =>
        (!g || r.genre.toLowerCase()===g) &&
        (!pickedGender || r.gender.toLowerCase()===pickedGender.toLowerCase()) &&
        (!pickedVersion || r.version===pickedVersion) &&
        (!q || (r.name+' '+r.desc).toLowerCase().includes(q))
      );

      if (sortValue==='favorite'){
        arr.sort((a,b)=>(Number(b.is_fav)-Number(a.is_fav)) || state.versionOrder.cmp(a.version,b.version));
      } else if (sortValue==='version'){
        arr.sort((a,b)=> state.versionOrder.cmp(a.version,b.version));
      } else if (sortValue==='success'){
        const rank={high:3,moderate:2,low:1};
        arr.sort((a,b)=>(rank[b.success]||0)-(rank[a.success]||0));
      } else if (sortValue==='rating'){
        arr.sort((a,b)=>(b.upvotes-b.downvotes)-(a.upvotes-a.downvotes));
      } else if (sortValue==='az'){
        arr.sort((a,b)=> (a.name||'').localeCompare(b.name||''));
      }
      return arr;
    }


// Debounced background re-sync so we don't thrash the API while user flips quickly
let resyncTimer = null;
function scheduleResync(ms = 5000){  // was 1200
  clearTimeout(resyncTimer);
  resyncTimer = setTimeout(async () => {
    try { await doSync(state, false); render(); } // not forced
    catch (e) { if (e && e.code === 'AUTH') boot(true); }
  }, ms);
}



    // vote helpers (optimistic)
    const nextVote = (curr, dir) => {
      const want = dir === 'up' ? 1 : -1;
      return (curr === want) ? 0 : want;
    };
    let voting = new Set();
    let faving = new Set();

    function render(){
      const items=filtered();
      const itemCount=items.length, pages=Math.max(1,Math.ceil(itemCount/PAGE_SIZE));
      if(page>pages) page=pages;
      const start=(page-1)*PAGE_SIZE, end=Math.min(start+PAGE_SIZE,itemCount);
      const pageItems=items.slice(start,end);
      list.innerHTML='';

      if (itemCount===0){
  const empty = document.createElement('div');
  empty.className='sg-empty';
  empty.textContent = state.rows?.length
    ? 'No prompts match your filters.'
    : 'Loading… (or offline). Try “Sync now” from the avatar menu.';
  list.appendChild(empty);
      } else {
        for (const p of pageItems){
          const row=document.createElement('div');

// author avatar bubble (top-right)
if (p.created_by_avatar) {
  const ava = document.createElement('div'); ava.className='sg-ava';
  ava.innerHTML = `<img alt="" src="${p.created_by_avatar}">`;
  row.appendChild(ava);
}


          row.className='sg-cardrow';

          if (selectedId===p.id) row.classList.add('sel');

          const top=document.createElement('div'); top.className='sg-top';
          const left=document.createElement('div'); left.className='sg-left';
          const ver=document.createElement('span'); ver.className='sg-ver ' + (p.version===state.versionOrder.latest ? 'latest' : p.version===state.versionOrder.prev ? 'prev' : 'old');
          ver.textContent=`v${p.version}`;
          const name=document.createElement('span'); name.textContent=p.name||'-';
left.append(ver, name);

          const actions=document.createElement('div'); actions.className='sg-actions';

          // EDIT (white icon), only when logged-in
          const edit=document.createElement('div'); edit.className='sg-iconbtn sg-zoom'; edit.title='Edit';
          edit.innerHTML = SVG.pen;
          if (!ID_TOKEN) edit.style.display='none';
          edit.addEventListener('click', (e)=>{
            e.stopPropagation();
            openEditCreateModal('edit', p, ()=>{ /* refreshed inside */ });
          });

          const copy=document.createElement('div'); copy.className='sg-iconbtn sg-zoom'; copy.title='Copy style'; copy.innerHTML=SVG.copy;
          copy.addEventListener('click',(e)=>{ e.stopPropagation(); e.preventDefault(); const t=p.style || p.tags || ''; if (typeof GM_setClipboard==='function') GM_setClipboard(t); else navigator.clipboard?.writeText(t); });
          // FAVORITE (instant + persistent via local cache)
const star = document.createElement('div');
star.className = 'sg-iconbtn sg-star sg-zoom';
star.title = 'Favorite';
star.innerHTML = SVG.star;

// prefer local cache highlight first
{
  const fc = getFavCache();
  if (Object.prototype.hasOwnProperty.call(fc, p.id)) {
    p.is_fav = !!fc[p.id];
  }
}
star.classList.toggle('on', p.is_fav === true);

star.addEventListener('click', async (e) => {
  e.stopPropagation();
  if (faving.has(p.id)) return;
  faving.add(p.id);

  const wantOn = !p.is_fav;

  // optimistic UI
  p.is_fav = wantOn;
  star.classList.toggle('on', p.is_fav === true);
  setCache(PROMPTS_CACHE_KEY, state.rows);
  { const fc = getFavCache(); fc[p.id] = p.is_fav ? 1 : 0; setFavCache(fc); }

  try {
    const res = await api.favoriteSet(p.id, wantOn);

    // normalize server reply: prefer an explicit boolean
    if (res && typeof res.is_fav !== 'undefined') {
      p.is_fav = !!res.is_fav;
    } else if (res && typeof res.on === 'boolean') {
      // if server echoes "on"
      p.is_fav = !!res.on;
    } else if (res && typeof res.action === 'string') {
      // accept common strings from n8n
      const a = String(res.action).toLowerCase();
      p.is_fav = (a === 'added' || a === 'add' || a === 'on' || a === 'favorited');
    } else {
      // as a last resort, trust what we just asked for
      p.is_fav = wantOn;
    }

    star.classList.toggle('on', p.is_fav === true);
    { const fc = getFavCache(); fc[p.id] = p.is_fav ? 1 : 0; setFavCache(fc); }
    setCache(PROMPTS_CACHE_KEY, state.rows);

    // gentle background refresh
    scheduleResync(1200);

  } catch (err) {
    if (err && err.code === 'AUTH'){ boot(true); return; }
    // hard failure → revert to previous state
    p.is_fav = !wantOn;
    star.classList.toggle('on', p.is_fav === true);
    { const fc = getFavCache(); fc[p.id] = p.is_fav ? 1 : 0; setFavCache(fc); }
  } finally {
    faving.delete(p.id);
  }
});

actions.append(edit, copy, star);


          top.append(left,actions);

          const desc=document.createElement('div'); desc.className='sg-desc'; desc.textContent=p.desc||'-';

          const bottom=document.createElement('div'); bottom.className='sg-bottom';
          const tags=document.createElement('div'); tags.className='sg-tags';

// Type chip (lyrics/instrumental) before other chips
const tkey = String(p.tags||'').toLowerCase().includes('instrumental') ? 'instrumental' : 'lyrics';
const typeChip = document.createElement('span'); typeChip.className='sg-tag';
const icon = document.createElement('span');
icon.className = 'sg-typeicon';
icon.style.backgroundImage = `url(${TYPE_ICONS[tkey]})`;
typeChip.appendChild(icon);

tags.appendChild(typeChip);




const gtxt = (p.gender==='male' ? 'M' : p.gender==='female' ? 'F' : 'M/F');
const gchip = document.createElement('span');
gchip.className = 'sg-letterpill';
gchip.textContent = gtxt;
tags.appendChild(gchip);




          const w=pct(p.weird);
          if (w){ const t=document.createElement('span'); t.className='sg-tag'; t.textContent=`Weirdness: ${w}`; tags.appendChild(t); }
          const i=pct(p.influence);
          if (i){ const t=document.createElement('span'); t.className='sg-tag'; t.textContent=`Influence: ${i}`; tags.appendChild(t); }
          if (p.success){
            const lab=document.createElement('span'); lab.className='sg-srlabel'; lab.textContent='Success Rate:';
            const chip=document.createElement('span'); chip.className='sg-srchip ' + (p.success==='high'?'sr-high':p.success==='moderate'?'sr-mod':'sr-low');
            chip.textContent=p.success[0].toUpperCase()+p.success.slice(1);
            tags.append(lab,chip);
          }

          const metrics=document.createElement('div'); metrics.className='sg-metrics';
          // --- REPLACE THIS WHOLE VOTES SECTION ---




// --- REPLACE THIS WHOLE VOTES SECTION ---

const votes = document.createElement('div'); 
votes.className = 'sg-votes';

const up = document.createElement('div'); 
up.className = 'sg-vbtn'; 
up.innerHTML = SVG.up + `<span class="cnt">${p.upvotes || 0}</span>`;

const down = document.createElement('div'); 
down.className = 'sg-vbtn'; 
down.innerHTML = SVG.down + `<span class="cnt">${p.downvotes || 0}</span>`;

function refresh(){
  up.querySelector('.cnt').textContent = p.upvotes || 0;
  down.querySelector('.cnt').textContent = p.downvotes || 0;
  up.classList.toggle('on', p.my_vote === 1);
  down.classList.toggle('on', p.my_vote === -1);
}

async function handleVote(dir){
  if (voting.has(p.id)) return;
  voting.add(p.id);

  const curr = Number(p.my_vote || 0);
  const want = (dir === 'up') ? 1 : -1;
  const next = (curr === want) ? 0 : want;

  // exclusive optimistic math
  let upc = Number(p.upvotes || 0);
  let dnc = Number(p.downvotes || 0);
  if (curr === 1)  upc--;
  if (curr === -1) dnc--;
  if (next === 1)  upc++;
  if (next === -1) dnc++;

  p.my_vote   = next;
  p.upvotes   = Math.max(0, upc);
  p.downvotes = Math.max(0, dnc);
  p.score     = (p.upvotes - p.downvotes);

  setCache(PROMPTS_CACHE_KEY, state.rows);

  // NEW: persist vote to local cache immediately (so highlight survives refresh)
  { const vc = getVoteCache(); vc[p.id] = p.my_vote; setVoteCache(vc); }

  refresh();

  try{
    const res = await api.vote(p.id, dir);
    if (res){
      if (typeof res.my_vote   !== 'undefined') p.my_vote   = Number(res.my_vote)   || 0;
      if (typeof res.upvotes   !== 'undefined') p.upvotes   = Number(res.upvotes)   || 0;
      if (typeof res.downvotes !== 'undefined') p.downvotes = Number(res.downvotes) || 0;
      if (typeof res.score     !== 'undefined') p.score     = Number(res.score)     || (p.upvotes - p.downvotes);

      setCache(PROMPTS_CACHE_KEY, state.rows);

      // NEW: refresh local cache with server-confirmed value
      { const vc = getVoteCache(); vc[p.id] = p.my_vote; setVoteCache(vc); }

      refresh();
    }

    setTimeout(async () => {
      try { await doSync(state, true); render(); }
      catch (e) { if (e && e.code === 'AUTH') boot(true); }
    }, 0);

  }catch(err){
    if (err && err.code === 'AUTH'){ boot(true); return; }

    // leave optimistic state; background sync may correct it
    setTimeout(async () => {
      try { await doSync(state, true); render(); }
      catch (e) { if (e && e.code === 'AUTH') boot(true); }
    }, 0);

  }finally{
    voting.delete(p.id);
  }
}

up.addEventListener('click', (e)=>{ e.stopPropagation(); handleVote('up'); });
down.addEventListener('click', (e)=>{ e.stopPropagation(); handleVote('down'); });
refresh();

votes.append(up, down);
metrics.append(votes);


          bottom.append(tags, metrics);

          row.append(top,desc,bottom);
if (p.avatar){
  const ava = document.createElement('div');
  ava.className = 'sg-author-ava';
  ava.innerHTML = `<img src="${p.avatar}" alt="">`;
  row.appendChild(ava);
}

          list.appendChild(row);

          row.addEventListener('click',()=>{
            const was = selectedId===p.id;
            selectedId = was ? null : p.id;
            applyTop.style.display = selectedId ? 'inline-flex' : 'none';
            render();
          });
        }
      }

      pageInfo.textContent=`Page ${page} of ${Math.max(1,Math.ceil(itemCount/PAGE_SIZE))}`;
      const shownTotal = itemCount;
      const startIdx = shownTotal ? ( (page-1)*PAGE_SIZE + 1 ) : 0;
      const endIdx = shownTotal ? Math.min(page*PAGE_SIZE, shownTotal) : 0;
      subinfo.textContent = shownTotal ? `Showing ${startIdx}-${endIdx} of ${shownTotal}` : '';
      prev.disabled=(page<=1);
      next.disabled=(page>=Math.max(1,Math.ceil(itemCount/PAGE_SIZE)));
    }

    // events
    nextBtn.addEventListener('click',()=>{ s1.style.display='none'; s2.style.display=''; backBtn.style.display=''; render(); });
    backBtn.addEventListener('click',()=>{ s2.style.display='none'; s1.style.display=''; backBtn.style.display='none'; selectedId=null; applyTop.style.display='none'; });

    search.addEventListener('input',()=>{ page=1; render(); });
    prev.addEventListener('click',()=>{ if(page>1){ page--; render(); }});
    next.addEventListener('click',()=>{ page++; render(); });

// --- remove any old copies of these two, then paste BOTH ---

window.unmountSaveUnderAdvancedOptions = function () {
  document.getElementById('sg-save-to-pg-block')?.remove();
  document.getElementById('sg-save-to-pg-slot')?.remove();
};

window.mountSaveUnderAdvancedOptions = function () {
  if (!ID_TOKEN) { window.unmountSaveUnderAdvancedOptions?.(); return; }

  let slot = document.getElementById('sg-save-to-pg-slot');

  const ensureSlot = (anchor) => {
    if (!anchor) return false;
    if (slot && slot.parentElement === anchor) return true;   // already good

    // remove stray copies
    document.querySelectorAll('#sg-save-to-pg-slot').forEach(n => { if (n !== slot) n.remove(); });

    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'sg-save-to-pg-slot';
      slot.style.display = 'block';
      slot.style.width = '100%';
      slot.style.padding = '0 8px';
      slot.style.boxSizing = 'border-box';
      slot.style.marginTop = '10px';
    } else {
      slot.remove();
    }
    anchor.appendChild(slot);
    return true;
  };

  const ensureBtn = () => {
    let btn = document.getElementById('sg-save-to-pg-block');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'sg-save-to-pg-block';
      btn.type = 'button';
      btn.className = 'sg-apply sg-zoom';
      btn.textContent = 'Save to Genie';
      btn.addEventListener('click', () => {
        const pre = prefillFromSuno();
        openEditCreateModal('create', pre, ()=>{});
      });
    } else {
      btn.remove();
    }
    slot.appendChild(btn);
  };

  // ---------- robust anchors ----------
  // Prefer the tag-input root; also accept "Style", "Styles", "Style Tags"
  const tagRoot = document.querySelector('[data-testid="tag-input-root"]');
  const stylesScope = tagRoot ? (tagRoot.closest('section,div,form') || document) : document;
  const labelRe = /^\s*(Style|Styles)(\s*Tags?)?\s*$/i;
  const labelCandidates = [...stylesScope.querySelectorAll('h1,h2,h3,div,span,strong,label')];
  const stylesLabel = labelCandidates.find(el => labelRe.test((el.textContent || '').trim()));

  let stylesAnchor = stylesLabel ? (stylesLabel.parentElement || stylesLabel) : null;
  if (!stylesAnchor && tagRoot) stylesAnchor = tagRoot.parentElement || tagRoot;

  if (stylesAnchor && ensureSlot(stylesAnchor)) {
    ensureBtn();
    // ensure no duplicate buttons exist
    document.querySelectorAll('#sg-save-to-pg-block').forEach(b => {
      if (b.parentElement?.id !== 'sg-save-to-pg-slot') b.remove();
    });
    return;
  }

  // If no safe anchor **and** no valid existing slot, remove it entirely.
  if (!document.getElementById('sg-save-to-pg-slot')) {
    unmountSaveUnderAdvancedOptions();
  }
};


// initial mount
mountSaveUnderAdvancedOptions();

// Throttled observer (don’t thrash during Suno re-renders)
ADV_OBSERVER?.disconnect();
let ADV_OBSERVER_TIMER = null;
ADV_OBSERVER = new MutationObserver(() => {
  if (ADV_OBSERVER_TIMER) return;
  ADV_OBSERVER_TIMER = setTimeout(() => {
    ADV_OBSERVER_TIMER = null;
    mountSaveUnderAdvancedOptions();
  }, 500);
});
ADV_OBSERVER.observe(document.body, { childList:true, subtree:true });




    applyTop.addEventListener('click', async ()=>{
      const items=filtered(); if(!items.length) return;
      const p = items.find(x=>x.id===selectedId) || items[0];
      if(!p) return;

      const token = newApplyToken();
      await setSunoVersion(p.version);
      if (!isCurrentToken(token)) return;

      await waitDomIdle(600, 4000);

      // set sliders after model settles
const vnum = parseFloat(String(p.version||'').replace(/[^\d.]/g,'')||'0');
if (vnum >= 4.5){
  await ensureSlider('Weirdness', p.weird, 8, 180);        // more tries
  await ensureSlider('Style Influence', p.influence, 8, 180);
}

      if (!isCurrentToken(token)) return;
      if (p.gender==='male' || p.gender==='female'){
  await ensureVocalGender(p.gender);
} else {
  await clearVocalGender(); // ALL/unspecified
}


      const styleText = (p.style || p.tags || '').trim();
      if (!isCurrentToken(token)) return;
      if (styleText){ await ensureStyleDescription(styleText); }
      if (!isCurrentToken(token)) return;
      if (styleText){ await addStyleTagsIfMissing(styleText); }

// Apply Instrumental slider based on saved tags
const tstr = String(p.tags||'').toLowerCase();
if (tstr.includes('instrumental')) { await ensureInstrumental(true); }
else if (tstr.includes('lyrics')) { await ensureInstrumental(false); }



      if (!isCurrentToken(token)) return;
      await stabilizeApply({
  gender: p.gender,
  styleText,
  weird: p.weird,
  influence: p.influence
}, token);


      if (!isCurrentToken(token)) return;
// make sure our “Save to Genie” block snaps back into place if Suno re-rendered
mountSaveUnderAdvancedOptions();

      selectedId=null; applyTop.style.display='none'; render();
    });

    return { root, render, rebuildVer };
  }

  /******** Mount helpers (left column) ********/
  /******** Mount helpers (left column) ********/
function findSaveGroup(){
  const save = [...document.querySelectorAll('button,[role="button"]')]
    .find(b => /^\s*Save Prompt\s*$/i.test(b.textContent||''));
  if (!save) return null;
  let group = save.closest('div');
  let parent = group?.parentElement || null;
  for (let i=0;i<8 && group;i++){
    const cls = String(group.className||'');
    if (/\bflex\b/.test(cls) && /\bgap-2\b/.test(cls)) break;
    group = group.parentElement; parent = group?.parentElement || parent;
  }
  return (group && group.parentElement) ? { group, parent: group.parentElement } : null;
}

function findMoreOptionsGroup(){
  const all = [...document.querySelectorAll('*')];
  const hdr = all.find(el => /\bMore Options\b/i.test((el.textContent||'').trim()));
  if (!hdr) return null;
  const group = hdr.closest('section,div[role="group"],div');
  return group && group.parentElement ? { group, parent: group.parentElement } : null;
}

function findCreateCol(){
  const createBtn = [...document.querySelectorAll('button,[role="button"]')]
    .find(b => /^\s*(Create|Generate)\s*$/i.test(b.textContent||''));
  const col = createBtn?.closest('div');
  return col ? { group:createBtn, parent: col } : null;
}

// NEW: try to discover the left column via the Model dropdown location
function findLeftColumnByModelDropdown(){
  const btn = document.querySelector('div[aria-label="Model Select Dropdown"]');
  if (!btn) return null;

  // Walk up to the actual left column container
  let node = btn.closest('aside,section,div') || btn.parentElement;
  for (let i = 0; i < 8 && node; i++){
    const st = getComputedStyle(node);
    const looksLikeCol = node.clientWidth > 260 && /(block|grid|flex)/.test(st.display);
    if (looksLikeCol && node.parentElement){
      // ⬅️ Mount INSIDE the column at the very top,
      // not as a sibling before the column.
      return { group: (node.firstElementChild || null), parent: node };
    }
    node = node.parentElement;
  }
  return null;
}


// Always return a host. If we can’t find a good spot, create a floating host.
// Always return a host. If we can’t find a good spot, create a floating host.
function ensureHost(){
  // 1) floating host shows immediately
  let float = document.getElementById('sg-float-host');
  if (!float){
    float = document.createElement('div');
    float.id = 'sg-float-host';
    Object.assign(float.style, {
      position:'fixed', right:'16px', top:'16px', zIndex:'999999',
      width:'min(420px,92vw)', maxHeight:'86vh', overflow:'auto'
    });
    document.body.appendChild(float);
  }
  let host = document.getElementById('suno-genie-host');
  if (!host){
    host = document.createElement('div');
    host.id = 'suno-genie-host';
    host.style.margin = '10px 0';
    host.style.minHeight = '10px';
    float.appendChild(host);
  }

  // 2) if/when a good spot appears, move there and remove the floater
  const spot = findSaveGroup() || findMoreOptionsGroup() || findCreateCol() || findLeftColumnByModelDropdown();
  if (spot?.parent?.isConnected && host.parentElement !== spot.parent){
    try { spot.parent.insertBefore(host, spot.group || spot.parent.firstChild); }
    catch { try { spot.parent.prepend(host); } catch {} }
    document.getElementById('sg-float-host')?.remove();
  }
  return host;
}




  // Fallback: floating host in the top-right corner so UI always appears
 
  function mountContent(node){
    const host = ensureHost();
if (DEBUG) {
  console.log('[SunoGenie] mount host:', host, 'parent:', host?.parentElement);
}

    if (!host) return false;
    const existingInHost = host.querySelector('#suno-genie-root');
    const existingGlobal = document.getElementById('suno-genie-root');
    const existing = existingInHost || (existingGlobal && existingGlobal.parentElement !== host ? existingGlobal : null);
    if (existing) {
      try { existing.replaceWith(node); }
      catch { try { existing.remove(); } catch {} host.appendChild(node); }
    } else {
      host.appendChild(node);
    }
    (function stickyRelocate(){
  // one global interval; survive page re-renders
  clearInterval(window.__sg_stickyRelocate);
  window.__sg_stickyRelocate = setInterval(() => {
    const root = document.getElementById('suno-genie-root');
    if (!root) return;
    const h = ensureHost();
    if (h && root.parentElement !== h) {
      try { h.appendChild(root); } catch {}
    }
  }, 800); // gentle, forever
})();

    return true;
  }

  /******** Sync ********/
  function sortVersionsNumeric(list){
  const asKey = v => {
    const s = String(v||'').replace(/^v/i,''); // strip leading v
    const plus = s.includes('+') ? 1 : 0;
    const n = parseFloat(s.replace('+','')) || 0;
    return [n, plus];
  };
  return [...list].sort((a,b)=>{
    const [na,pa]=asKey(a), [nb,pb]=asKey(b);
    if (na!==nb) return na-nb;
    return pa-pb; // no-plus before plus
  });
}


  // 2c) Cache prompts in doSync() and recover on failure
async function doSync(state, force = false){
  const now = Date.now();
  if (SYNCING_PROMISE) return SYNCING_PROMISE;
  if (!force && (now - LAST_SYNC_TS) < SYNC_MIN_GAP_MS) return false;

  SYNCING_PROMISE = (async () => {
    try{
      if (!force) await sleep(350);

      const SIZE = 50;     // request size sent to backend
      let page = 1;
      let safety = 20;     // hard stop
      const allRows = [];
      let grew = true;

      while (safety-- > 0){
        const box = await api.prompts(page, SIZE);

        const rowsRaw = (() => {
          if (Array.isArray(box?.rows))     return box.rows;
          if (Array.isArray(box?.prompts))  return box.prompts;
          if (Array.isArray(box?.data))     return box.data;
          if (Array.isArray(box))           return box;
          return [];
        })();

        const rows = normalizeRows(rowsRaw);
        const before = allRows.length;
        allRows.push(...rows);

        // stop if:
        //  - backend says "done", OR
        //  - batch smaller than SIZE (classic pagination), OR
        //  - we didn't grow (duplicate page / buggy backend)
        const declaredDone = (box && (box.has_more === false || !box.has_more) && !box.next_page);
        const smallerBatch = rows.length < SIZE;
        grew = allRows.length > before;

        if (declaredDone || smallerBatch || !grew) break;
        page = box?.next_page ? box.next_page : (page + 1);
      }

      state.rows = dedupeById(allRows);

      // build version order
      const versionsSet = new Set(state.rows.map(x => cleanVer(x.version)).filter(Boolean));
      const versions = sortVersionsNumeric([...versionsSet]);
      const map = new Map(versions.map((v,i)=>[v,i]));
      state.versionOrder = {
        latest: versions.at(-1) || '',
        prev: versions.length > 1 ? versions.at(-2) : '',
        latest3: versions.slice(-3).reverse(),
        cmp: (a,b) => (map.get(cleanVer(b)) ?? -1) - (map.get(cleanVer(a)) ?? -1)
      };

      setCache(PROMPTS_CACHE_KEY, state.rows);
      LAST_SYNC_TS = Date.now();
      return true;

    } catch(e){
      if (e && e.code === 'AUTH') throw e;

      const cached = dedupeById(getCache(PROMPTS_CACHE_KEY, []));
      if (cached.length){
        state.rows = cached;
        const versionsSet = new Set(state.rows.map(x => cleanVer(x.version)).filter(Boolean));
        const versions = sortVersionsNumeric([...versionsSet]);
        const map = new Map(versions.map((v,i)=>[v,i]));
        state.versionOrder = {
          latest: versions.at(-1) || '',
          prev: versions.length > 1 ? versions.at(-2) : '',
          latest3: versions.slice(-3).reverse(),
          cmp: (a,b) => (map.get(cleanVer(b)) ?? -1) - (map.get(cleanVer(a)) ?? -1)
        };
        return true;
      }
      return false;
    } finally {
      SYNCING_PROMISE = null;
    }
  })();

  return SYNCING_PROMISE;
}


async function ensureSlider(label, percent, tries=4){
  if (percent==null || percent==='') return;
  for (let i=0;i<tries;i++){
    const r = findRangeNear(label);
    if (r){ setSliderPercent(r, percent); await sleep(140); }
  }
}




  /******** BOOT ********/
  async function boot(forceRemount = false){
  if (BOOTING) return;
  BOOTING = true;
  try{
    if (!/^\/create/.test(location.pathname)) return;

    if (forceRemount){
      document.getElementById('suno-genie-root')?.remove();
    }

    if (!ID_TOKEN){
  const gate = buildGate();
  mountContent(gate.root);
  // remove any injected “Save to Genie” button if it exists
  window?.unmountSaveUnderAdvancedOptions?.();
  return;
}


    // Mount immediately with whatever we have cached (fast)
    // Mount immediately with cache (fast) + optimistic version order
const cached = getCache(PROMPTS_CACHE_KEY, []);
const fallback = ['4.5+','4.0+','3.5'];  // tweak if needed
const m = new Map(fallback.map((v,i)=>[cleanVer(v), i]));
const cmpFallback = (a,b) => (m.get(cleanVer(b)) ?? 0) - (m.get(cleanVer(a)) ?? 0);

const state = {
  rows: cached,
  versionOrder: {
    latest: cleanVer('4.5+'),
    prev: cleanVer('4.0+'),
    latest3: fallback,
    cmp: cmpFallback
  }
};
const ui = buildPanel(state);

    mountContent(ui.root);
    ui.rebuildVer();
    ui.render();

    // Then sync in the background and refresh UI when done (no blocking)
    try{
      await doSync(state, true);
      ui.rebuildVer();
      ui.render();
    }catch(e){
      if (e && e.code === 'AUTH'){
        const gate = buildGate();
        mountContent(gate.root);
      }
    }
  } finally {
    BOOTING = false;
  }
}



  ready(() => boot().catch(e => console.error('SunoGenie init error:', e)));

window.addEventListener('pageshow', () => {
  clearTimeout(window.__sg_boot_tmr);
  window.__sg_boot_tmr = setTimeout(() => { boot(true).catch(()=>{}); }, 10);
});


  const mo = new MutationObserver(() => {
  if (!/^\/create/.test(location.pathname)) return;

  // consider "detached" as missing too
  const root = document.getElementById('suno-genie-root');
  if (root && root.isConnected) return;

  clearTimeout(window.__sg_boot_tmr);
  window.__sg_boot_tmr = setTimeout(() => {
    const r = document.getElementById('suno-genie-root');
    if (!(r && r.isConnected)) {
      boot(true).catch(()=>{});
    }
  }, 250);
});
mo.observe(document.body, { childList:true, subtree:true });

// also re-check on SPA nav
['pushState', 'replaceState'].forEach(fn => {
  const orig = history[fn];
  history[fn] = function (...args) {
    const ret = orig.apply(this, args);
    setTimeout(() => {
      const r = document.getElementById('suno-genie-root');
      if (!(r && r.isConnected)) boot(true).catch(()=>{});
    }, 50);
    return ret;
  };
});
window.addEventListener('popstate', () => {
  const r = document.getElementById('suno-genie-root');
  if (!(r && r.isConnected)) boot(true).catch(()=>{});
});

})();
