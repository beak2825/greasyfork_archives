// ==UserScript==
// @name         MAL Episode Sort + Type Filter + Hide Unknown Count
// @namespace    https://myanimelist.net/
// @version      1.4
// @description  Floating panel to sort anime list rows by total episodes and filter by type (TV, Movie, OVA, Special, ONA, TV Special, PV, Unknown). Optional hide of entries with unknown episode count. Remembers settings. React-safe on modern MAL pages.
// @author       xiplex
// @match        https://myanimelist.net/animelist/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538882/MAL%20Episode%20Sort%20%2B%20Type%20Filter%20%2B%20Hide%20Unknown%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/538882/MAL%20Episode%20Sort%20%2B%20Type%20Filter%20%2B%20Hide%20Unknown%20Count.meta.js
// ==/UserScript==

;(() => {
const PANEL_ID = 'malEpisodePanel';
const STORE    = JSON.parse(localStorage.getItem('malEpisodeStore') || '{}');
if (STORE.hideUnknown === undefined) STORE.hideUnknown = true;          // default ON

const DIR   = { ASC: 'asc', DESC: 'desc' };
const TYPES = ['TV','Movie','OVA','Special','ONA','TV Special','PV','Unknown'];
const MAX_UNKNOWN = Number.MAX_SAFE_INTEGER;

const qs  = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));
const save = () => localStorage.setItem('malEpisodeStore', JSON.stringify(STORE));

const getDir = () => STORE.dir || DIR.ASC;
const setDir = d  => { STORE.dir = d; save(); };
const getOn  = t  => STORE[t] !== false;                  // default ON
const toggleOn = t => { STORE[t] = !getOn(t); save(); };

/* --------------------------- PANEL ------------------------------------ */
function makePanel() {
  if (qs('#' + PANEL_ID)) return;
  const div = document.createElement('div');
  div.id = PANEL_ID;
  Object.assign(div.style, {
    position:'fixed', right:'20px', top:'50%', transform:'translateY(-50%)',
    width:'180px', background:'rgba(255,255,255,0.9)', border:'1px solid #ccc',
    borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,.2)', font:'12px sans-serif',
    zIndex:9999, userSelect:'none', padding:'8px', display:'flex', flexDirection:'column'
  });
  div.innerHTML = `
    <strong style="font-size:13px;text-align:center">Episode Sort</strong>
    <button id="epBtn" style="margin:6px auto 8px;padding:4px 8px;font-size:11px"></button>
    <div id="typeStrip" style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px 6px"></div>
    <label style="cursor:pointer;margin-top:4px;grid-column:span 2">
      <input type="checkbox" id="toggleUnknownCount"> Hide unknown episode count
    </label>`;
  document.body.appendChild(div);

  /* drag-to-move */
  let drag = false, sX, sY, sR, sT;
  div.onmousedown = e => {
    if (/INPUT|LABEL|BUTTON/.test(e.target.tagName)) return;
    drag = true;
    sX = e.clientX; sY = e.clientY;
    const r = div.getBoundingClientRect();
    sR = window.innerWidth - r.right; sT = r.top;
    e.preventDefault();
  };
  window.addEventListener('mousemove', e => {
    if (!drag) return;
    const dx = e.clientX - sX, dy = e.clientY - sY;
    div.style.right = (sR - dx) + 'px';
    div.style.top   = (sT + dy) + 'px';
    div.style.transform = '';
  });
  window.addEventListener('mouseup', () => {
    if (drag) {
      drag = false;
      STORE.pos = { right: div.style.right, top: div.style.top };
      save();
    }
  });
  if (STORE.pos) {
    div.style.right = STORE.pos.right;
    div.style.top   = STORE.pos.top;
    div.style.transform = '';
  }

  /* button */
  qs('#epBtn').onclick = () => { setDir(getDir() === DIR.ASC ? DIR.DESC : DIR.ASC); syncUI(); apply(); };

  /* type filters */
  const strip = qs('#typeStrip');
  TYPES.forEach(t => {
    const id = 'chk_' + t.replace(/\s+/g, '_');
    strip.insertAdjacentHTML('beforeend',
      `<label style="cursor:pointer">
         <input type="checkbox" id="${id}"> ${t}
       </label>`);
    qs('#' + id).onchange = () => { toggleOn(t); apply(); };
  });

  /* hide-unknown checkbox */
  qs('#toggleUnknownCount').onchange = () => {
    STORE.hideUnknown = qs('#toggleUnknownCount').checked;
    save();
    apply();
  };
}

function syncUI() {
  qs('#epBtn').textContent = getDir() === DIR.ASC ? 'Episodes ↑' : 'Episodes ↓';
  TYPES.forEach(t => {
    const cb = qs('#chk_' + t.replace(/\s+/g, '_'));
    if (cb) cb.checked = getOn(t);
  });
  qs('#toggleUnknownCount').checked = STORE.hideUnknown;
}

/* --------------------- SORT + FILTER CORE ----------------------------- */
const typeAllowed = row => {
  const cell = row.querySelector('td.data.type');
  const val  = cell ? cell.textContent.trim() || 'Unknown' : 'Unknown';
  const key  = TYPES.includes(val) ? val : 'Unknown';
  return getOn(key);
};
const totalEps = row => {
  const span = row.querySelector('td.data.progress span:last-child');
  if (!span) return MAX_UNKNOWN;
  const n = parseInt(span.textContent.trim(), 10);
  return Number.isNaN(n) ? MAX_UNKNOWN : n;
};
function apply() {
  const table = qs('table.list-table'); if (!table) return;
  const rows  = qsa('tbody.list-item');

  rows.sort((a, b) => (totalEps(a) - totalEps(b)) * (getDir() === DIR.ASC ? 1 : -1));
  const frag = document.createDocumentFragment();
  rows.forEach(r => frag.appendChild(r));
  table.tBodies[0].parentElement.appendChild(frag);

  rows.forEach(r => {
    let show = typeAllowed(r);
    if (STORE.hideUnknown) {
      const txt = r.querySelector('td.data.progress span:last-child')?.textContent.trim() || '';
      if (txt === '-' || txt === '–') show = false;
    }
    r.style.display = show ? '' : 'none';
  });

  document.dispatchEvent(new Event('malEpisodeApplyDone'));
}

/* -------------------- React hooks ------------------------------------- */
function attachReactHooks() {
  let tm;
  const kick = () => { clearTimeout(tm); tm = setTimeout(() => { makePanel(); syncUI(); apply(); }, 150); };
  const root = qs('#list-container') || document.body;
  new MutationObserver(kick).observe(root, { childList: true, subtree: true });
  const orig = history.pushState;
  history.pushState = function (...a) { orig.apply(this, a); kick(); };
  window.addEventListener('popstate', kick);
}

/* ----------------------- INIT ----------------------------------------- */
makePanel();
syncUI();
apply();
attachReactHooks();
})();
