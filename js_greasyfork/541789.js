// ==UserScript==
// @name         Torn Poker – Faction Badges
// @namespace    https://torn.com/
// @version      0.9.24
// @description  Shows faction initials + logo for seated players, highlights duplicate factions, clickable badge links to player profile.
// @author       Vangwe
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/541789/Torn%20Poker%20%E2%80%93%20Faction%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/541789/Torn%20Poker%20%E2%80%93%20Faction%20Badges.meta.js
// ==/UserScript==

/* ---------- CONFIG ---------- */
const API_KEY_STORAGE = 'tpfb_api_key';
const CACHE_TTL_MS    = 10 * 60 * 1000;
/* ---------------------------- */

function getApiKey(forcePrompt = false) {
  let key = GM_getValue(API_KEY_STORAGE, '');
  if (!key || forcePrompt) {
    key = prompt('Enter your Torn API key (User:Basic + Faction:Basic scopes required):') || '';
    if (key) GM_setValue(API_KEY_STORAGE, key.trim());
  }
  return key.trim();
}
let API_KEY = getApiKey();

/* ---------- CSS ---------- */
GM_addStyle(`
.tpfb-badge{
  display:inline-flex;
  flex-direction:column;
  align-items:center;
  margin-left:1px;
  font-size:12px;
  background:rgba(0,0,0,0.6);
  color:#fff;
  border-radius:3px;
  padding:2px 4px;
  white-space:nowrap;
}
.tpfb-badge img{
  width:20px;
  height:20px;
  border-radius:2px;
  margin-top:2px;
}
/* Right side (default): align badge's left edge to player wrapper's right edge */
.tpfb-seat-badge{
  position:absolute;
  left:100%;
  margin-left:1px;
  top:0;
  bottom:0;
  height:fit-content;
  margin-top:auto;
  margin-bottom:auto;
  pointer-events:auto;
  cursor:pointer;
}
.tpfb-highlight{
  background:rgba(255,215,0,0.85);
  color:#000;
  box-shadow:0 0 4px 2px rgba(255,215,0,0.9);
}
/* Seat-4 badge left of wrapper */
div[class*="playerPositioner-4"] .tpfb-seat-badge{
  right:100%;
  left:auto;
  margin-right:1px;
  margin-left:0;
  top:0;
  bottom:0;
  height:fit-content;
  margin-top:auto;
  margin-bottom:auto;
}
.opponent___ZyaTg,
.playerWrapper___wf5jR{overflow:visible!important;}
`);

/* ---------- HELPERS ---------- */
const log       = (...a) => console.debug('[TPFB]', ...a);
const userCache = new Map();

const userIdFrom = s => { const m = /\d+/.exec(s); return m ? m[0] : null; };
const initials   = n => n ? n.split(/\s+/).slice(0,3).map(w=>w[0]).join('').toUpperCase() : '?';

const prefixUrl = u=>{
  if(!u) return '';
  if(u.startsWith('http')) return u;
  if(u.startsWith('//'))   return 'https:'+u;
  if(u.startsWith('/'))    return 'https://www.torn.com'+u;
  return 'https://factiontags.torn.com/'+u.replace(/^\/+/,'');
};

function logoUrl(fac,fid){
  const c=[]; ['logo','tag_image','image','tagimage'].forEach(k=>fac[k]&&c.push(fac[k]));
  c.push(`/images/factions/${fid}/tag.png`,`/images/factions/${fid}/logo.png`);
  const file=fac.tag_image||fac.image||'';
  if(file) c.push(`factiontags.torn.com/${file}`,`factionimages.torn.com/${file}`);
  c.push(`factiontags.torn.com/${fid}.png`,`factionimages.torn.com/${fid}.png`);
  return prefixUrl(c.find(Boolean));
}

function badge(tag,logo,fid,uid){
  const a = document.createElement('a');
  a.href = `https://www.torn.com/profiles.php?XID=${uid}`;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.style.textDecoration = 'none';
  const span=document.createElement('span');
  span.className='tpfb-badge';
  span.dataset.fid=fid;
  span.appendChild(document.createTextNode(tag));
  if(logo){
    const img=new Image(); img.src=logo;
    img.onerror=function(){
      if(!this.dataset.alt && this.src.includes('factiontags.')){ this.dataset.alt=1; this.src=this.src.replace('factiontags.','factionimages.'); }
      else if(!this.dataset.alt && this.src.includes('factionimages.')){ this.dataset.alt=1; this.src=this.src.replace('factionimages.','factiontags.'); }
      else if(!this.dataset.jpg && this.src.endsWith('.png')){ this.dataset.jpg=1; this.src=this.src.replace('.png','.jpg'); }
      else if(!this.dataset.proto){ this.dataset.proto=1; this.src=this.src.replace('https://','http://'); }
      else if(!this.dataset.nosuffix && /-\d+\.(png|jpg|gif|webp)$/.test(this.src)){
        this.dataset.nosuffix=1;
        this.src=this.src.replace(/-\d+\./,'.');
      }
      else this.remove();
    };
    span.appendChild(img);
  }
  a.appendChild(span);
  return a;
}

/* ---------- DUPLICATE-HIGHLIGHT HANDLING ---------- */
function recomputeHighlights(){
  const byFid = {}, byTag = {};
  document.querySelectorAll('.tpfb-seat-badge').forEach(b=>{
    // b may be <a> now, so get the inner span for .dataset.fid and .textContent
    const span = b.querySelector('.tpfb-badge') || b;
    const fid=span.dataset.fid, tag=(span.textContent||'').trim();
    if(fid && fid!=='0') (byFid[fid]=byFid[fid]||[]).push(b);
    if(tag && tag!=='N/A') (byTag[tag]=byTag[tag]||[]).push(b);
  });
  // clear prior highlights
  document.querySelectorAll('.tpfb-seat-badge .tpfb-badge.tpfb-highlight, .tpfb-seat-badge.tpfb-highlight')
          .forEach(b=>b.classList.remove('tpfb-highlight'));
  // highlight by fid
  Object.values(byFid).forEach(arr=>{ if(arr.length>=2) arr.forEach(b=>{
    const s = b.querySelector('.tpfb-badge') || b;
    s.classList.add('tpfb-highlight');
  }); });
  // highlight by initials/tag
  Object.values(byTag).forEach(arr=>{ if(arr.length>=2) arr.forEach(b=>{
    const s = b.querySelector('.tpfb-badge') || b;
    s.classList.add('tpfb-highlight');
  }); });
}

/* ---------- API ---------- */
const gmFetch = url => new Promise((res, rej) => {
  GM_xmlhttpRequest({
    url,
    method: 'GET',
    anonymous: true,
    onload: e => {
      if (e.status === 401 || e.status === 403 || /incorrect key|key required|invalid key/i.test(e.responseText)) {
        API_KEY = getApiKey(true); // force prompt
        window.location.reload();  // reload so the new key is used everywhere
        return;
      }
      try { res(JSON.parse(e.responseText)); } catch (err) { rej(err); }
    },
    onerror: rej
  });
});

async function factionData(uid){
  if(userCache.has(uid)&&Date.now()-userCache.get(uid).ts<CACHE_TTL_MS)
    return userCache.get(uid).data;

  const u=await gmFetch(`https://api.torn.com/user/${uid}?selections=profile&key=${API_KEY}`);
  if(!u.faction||!u.faction.faction_id){
    const data={fid:0,tag:'N/A',logo:''};
    userCache.set(uid,{data,ts:Date.now()});
    return data;
  }
  const fid=u.faction.faction_id;
  const f=await gmFetch(`https://api.torn.com/faction/${fid}?selections=basic&key=${API_KEY}`);
  const tag=(f.tag||'').trim()||initials(f.name||'');
  const data={fid,tag,logo:logoUrl(f,fid)};
  userCache.set(uid,{data,ts:Date.now()});
  return data;
}

/* expose helpers */
unsafeWindow.tpfb_fetchFactionData=factionData;
unsafeWindow.tpfb_debugFaction=fid=>gmFetch(`https://api.torn.com/faction/${fid}?selections=basic&key=${API_KEY}`);

/* ---------- DOM PROCESS ---------- */
function seat(div){
  if(!div||div.dataset.tpfbDone) return;
  const uid=userIdFrom(div.id); if(!uid) return;
  if(!div.querySelector('p.name___cESdZ')) return;
  div.dataset.tpfbDone='1'; div.style.position='relative';

  factionData(uid).then(d=>{
      const b=badge(d.tag,d.logo,d.fid,uid);
      b.classList.add('tpfb-seat-badge'); div.appendChild(b);
      recomputeHighlights();
  }).catch(e=>log('seat',uid,e.message));
}

function scan(node){
  if(node.nodeType!==1) return;
  if(node.id?.startsWith('player-')) seat(node);
  node.querySelectorAll?.('div[id^="player-"]').forEach(seat);
}

new MutationObserver(muts=>{
  muts.forEach(rec=>rec.addedNodes.forEach(scan));
  recomputeHighlights();
}).observe(document.body,{childList:true,subtree:true});

/* ---------- INIT ---------- */
log('TPFB script loaded (v0.9.24)');
scan(document.body);
recomputeHighlights();