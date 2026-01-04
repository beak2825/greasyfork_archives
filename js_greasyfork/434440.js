// ==UserScript==
// @name         Smart Dark Mode
// @description  -
// @version      2025.10.17
// @match        *://*/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @icon         data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23232323' class='bi bi-moon-stars-fill' viewBox='0 0 16 16'%3e%3cpath d='M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z'/%3e%3cpath d='M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z'/%3e%3c/svg%3e
// @namespace https://ndaesik.tistory.com/
// @downloadURL https://update.greasyfork.org/scripts/434440/Smart%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/434440/Smart%20Dark%20Mode.meta.js
// ==/UserScript==

const normHost = h => String(h||'').toLowerCase().replace(/^www\./,'');
const HOST = normHost(location.hostname);
const hostMatch = (h, e) => h===e || h.endsWith('.'+e);

let state = {
  settings: ['hotKeySetOn','Ctrl + D','setTimeOff','18:00','07:00'],
  alwaysOnList: '',
  alwaysOffList: `youtube.com,
m.youtube.com,
music.youtube.com,
studio.youtube.com,
docs.google.com,
keep.google.com`,
  uiReady: false
};

let drkMo;
let EARLY_OFF = false;

const earlyParseList = s => String(s||'')
  .split(/[\r\n,]+/)
  .map(v => v.trim().toLowerCase().replace(/^www\./,''))
  .filter(Boolean);

const earlyUrlMatch = list => {
  const paths = earlyParseList(list);
  return paths.some(entry=>{
    if (entry.includes('/')) {
      const [eHost,...rest]=entry.split('/');
      const ePath='/'+rest.join('/');
      return hostMatch(HOST,eHost) && location.pathname.startsWith(ePath);
    }
    return hostMatch(HOST,entry);
  });
};

(async () => {
  try {
    const offList = await GM.getValue('alwaysOffList','');
    EARLY_OFF = earlyUrlMatch(offList);
  } catch(_) { EARLY_OFF = false; }
  if (!EARLY_OFF && self === top) {
    const s = document.createElement('style');
    s.className = 'preventBlinkCSS';
    s.textContent = `*{background:#202124!important;border-color:#3c4043!important;color-scheme:dark!important;color:#e3e3e3!important;transition:none!important}`;
    document.documentElement.appendChild(s);
  }
})();

GM_registerMenuCommand('On/Off', () => window.postMessage({__SDM__: 'toggle'}, '*'));
GM_registerMenuCommand('Panel',  () => window.postMessage({__SDM__: 'panel' }, '*'));

window.addEventListener('message', e => {
  if (!e || !e.data || e.data.__SDM__==null) return;
  const cmd = e.data.__SDM__;
  (async () => {
    await ensureInit();
    if (cmd === 'toggle') safeToggle();
    if (cmd === 'panel')  togglePanel();
  })();
});

window.addEventListener('load', () => { ensureInit().then(postLoad); });

async function ensureInit() {
  if (state.uiReady) return;
  try {
    state.settings      = await GM.getValue('settings', state.settings);
    state.alwaysOnList  = await GM.getValue('alwaysOnList', state.alwaysOnList);
    state.alwaysOffList = await GM.getValue('alwaysOffList', state.alwaysOffList);
  } catch(_) {}
  buildUI();
  wireUI();
  state.uiReady = true;
}

function postLoad() {
  try { initialApplyLogic(); watchSpa(); } catch(_) {}
}

const parseList = s => String(s||'')
  .split(/[\r\n,]+/)
  .map(v => v.trim().toLowerCase().replace(/^www\./,''))
  .filter(Boolean);

const urlMatch = list => {
  const paths = parseList(list);
  return paths.some(entry=>{
    if (entry.includes('/')) {
      const [eHost,...rest]=entry.split('/');
      const ePath='/'+rest.join('/');
      return hostMatch(HOST,eHost) && location.pathname.startsWith(ePath);
    }
    return hostMatch(HOST,entry);
  });
};

function ensureDrkStyle() {
  if (!drkMo) {
    drkMo = document.createElement('style');
    drkMo.className = 'drkMo';
    drkMo.textContent = `
html{color-scheme:dark!important;background:#fff;color:#000}
html *{color-scheme:light!important;text-shadow:0 0 .1px}
html body{background:none!important}

html,
html :is(img,image,embed,video,canvas,option,object,:fullscreen:not(iframe),iframe:not(:fullscreen)),
html body>* [style*="url("]:not([style*="cursor:"]):not([type="text"]) {
  filter: invert(1) hue-rotate(180deg)!important;
}

html body>* [style*="url("]:not([style*="cursor:"]) :not(#_),
html:not(#_) :is(canvas,option,object) :is(img,image,embed,video),
html:not(#_) :is(video:fullscreen,img[src*="/svg/"],img[src*=".svg."],img[src*="fonts.gstatic.com/s/i/"]) {
  filter: unset!important;
}

#SDM_body { filter: invert(1) hue-rotate(180deg)!important; }
#SDM_body *{ color-scheme:dark!important; }
`;
  }
}

function hardOffNow() { return EARLY_OFF || urlMatch(state.alwaysOffList); }

function applyFilter() {
  if (hardOffNow()) return;
  ensureDrkStyle();
  if (!document.querySelector('style.drkMo')) document.head.appendChild(drkMo);
}

function removeFilterAll() {
  document.querySelectorAll('style.drkMo').forEach(e=>e.remove());
  document.querySelector('.preventBlinkCSS')?.remove();
}

const isOn = () => !!document.querySelector('style.drkMo');

function checkTimeSet() {
  const timeChk = document.querySelector('#SDM_timeSet')?.checked ?? (state.settings[2]==='setTimeOn');
  if (!timeChk) return true;
  const from = (document.querySelector('#SDM_timeSet_input_from')?.value || state.settings[3] || '18:00');
  const to   = (document.querySelector('#SDM_timeSet_input_to')?.value   || state.settings[4] || '07:00');
  const [fh,fm] = from.split(':').map(n=>+n); const [th,tm] = to.split(':').map(n=>+n);
  const now = new Date(); const ch=now.getHours(), cm=now.getMinutes();
  const afterStart = ch>fh || (ch===fh && cm>=fm);
  const beforeEnd  = ch<th || (ch===th && cm<tm);
  return (fh<=th) ? (afterStart && beforeEnd) : (afterStart || beforeEnd);
}

function initialApplyLogic() {
  if (!hardOffNow()) document.querySelector('.preventBlinkCSS')?.remove();
  const offNow = hardOffNow();
  const onNow  = urlMatch(state.alwaysOnList);
  const inTime = checkTimeSet();
  const shouldApply = !offNow && inTime && ( onNow || autoDetectBright() );
  if (offNow) { removeFilterAll(); setToggle(false); }
  else if (shouldApply) { applyFilter(); setToggle(true); }
  else { setToggle(isOn()); }
}

function autoDetectBright() {
  try {
    const frame = self !== top;
    const bodyZero = document.body ? document.body.offsetHeight===0 : false;
    const elems = document.querySelectorAll('body > :not(script)');
    const rgb = el => {
      const m = getComputedStyle(el).getPropertyValue('background-color').match(/\d+/g)||[0,0,0,1];
      return m.map(x=>+x);
    };
    const bright = el => { const [r,g,b,a]=rgb(el); return a===0 || (r*.299+g*.587+b*.114)>186; };
    if ((!frame && !bodyZero || frame) && bright(document.documentElement) && bright(document.body)) return true;
    if (!frame && bodyZero) {
      for (let i=0;i<elems.length;i++){
        if (elems[i].scrollHeight>window.innerHeight && bright(elems[i])) return true;
      }
    }
  } catch(_) {}
  return false;
}

function watchSpa() {
  let lastHref = location.href;
  new MutationObserver(() => {
    if (lastHref !== location.href) {
      lastHref = location.href;
      EARLY_OFF = urlMatch(state.alwaysOffList);
      if (hardOffNow()) { removeFilterAll(); setToggle(false); }
      else if (!isOn() && (urlMatch(state.alwaysOnList) && checkTimeSet())) { applyFilter(); setToggle(true); }
    }
  }).observe(document.body || document.documentElement, {subtree:true, childList:true});
}

function buildUI() {
  if (document.getElementById('SDM_body')) return;
  const ui = `
<div id="SDM_body" class="SDM_root" style="display:none">
  <div class="SDM_wrap">
    <div class="SDM_bar">
      <div class="SDM_title">Smart Dark Mode</div>
      <div class="SDM_barBtns">
        <button class="SDM_btn" id="SDM_add_page" title="Add current domain">＋</button>
        <label class="SDM_switch" title="Toggle filter">
          <input id="SDM_toggle" type="checkbox" class="SDM_tabInput">
          <span class="SDM_slider"></span>
        </label>
        <button class="SDM_btn" id="SDM_close">✕</button>
      </div>
    </div>
    <div class="SDM_tabs">
      <input id="tab_on" class="SDM_tabInput" type="radio" name="sdm_tab" checked><label class="SDM_tabLabel" for="tab_on">Always On</label>
      <input id="tab_off" class="SDM_tabInput" type="radio" name="sdm_tab"><label class="SDM_tabLabel" for="tab_off">Always Off</label>
      <input id="tab_settings" class="SDM_tabInput" type="radio" name="sdm_tab"><label class="SDM_tabLabel" for="tab_settings">Settings</label>
    </div>
    <div class="SDM_main">
      <div class="SDM_tabc" data-tab="on"><textarea id="SDM_on_textarea" class="SDM_textarea" spellcheck="false" placeholder="example.com, mysite.com">${state.alwaysOnList}</textarea></div>
      <div class="SDM_tabc" data-tab="off" style="display:none"><textarea id="SDM_off_textarea" class="SDM_textarea" spellcheck="false" placeholder="example.com, mysite.com">${state.alwaysOffList}</textarea></div>
      <div class="SDM_tabc" data-tab="settings" style="display:none">
        <div class="SDM_row">
          <label class="SDM_tgl"><input id="SDM_hotkey" type="checkbox" class="SDM_tabInput" ${state.settings[0]==='hotKeySetOn'?'checked':''}><span>Hotkey</span></label>
          <input id="SDM_hotkey_input" class="SDM_text" value="${state.settings[1]}" placeholder="Ctrl + D">
        </div>
        <div class="SDM_row">
          <label class="SDM_tgl"><input id="SDM_timeSet" type="checkbox" class="SDM_tabInput" ${state.settings[2]==='setTimeOn'?'checked':''}><span>Time Window</span></label>
          <input id="SDM_timeSet_input_from" class="SDM_time" maxlength="5" value="${state.settings[3]}"><span class="SDM_sep">~</span><input id="SDM_timeSet_input_to" class="SDM_time" maxlength="5" value="${state.settings[4]}">
        </div>
      </div>
    </div>
  </div>
</div>
<style>
#SDM_body.SDM_root{position:fixed;top:24px;right:24px;z-index:2147483647;font-family:system-ui,Segoe UI,Roboto,Apple SD Gothic Neo,Arial}
#SDM_body .SDM_wrap{width:340px;border-radius:14px;overflow:hidden;box-shadow:0 10px 24px rgba(0,0,0,.45);background:#0f1115;border:1px solid #262a33}
#SDM_body .SDM_bar{height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;background:linear-gradient(180deg,#12151b,#0f1115);border-bottom:1px solid #1b1f27}
#SDM_body .SDM_title{font-weight:600;font-size:14px;line-height:1.2;color:#e3e3ea;letter-spacing:.2px}
#SDM_body .SDM_barBtns{display:flex;gap:8px;align-items:center}
#SDM_body .SDM_btn{width:28px;height:28px;border-radius:8px;border:1px solid #2a2f3a;background:#151922;color:#cfd2d8;cursor:pointer}
#SDM_body .SDM_btn:hover{border-color:#3a4050}
#SDM_body .SDM_switch{position:relative;display:inline-block;width:46px;height:26px}
#SDM_body .SDM_switch input{opacity:0;width:0;height:0}
#SDM_body .SDM_slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:#2a2f3a;border-radius:16px;transition:.2s}
#SDM_body .SDM_slider:before{position:absolute;content:"";height:20px;width:20px;left:3px;top:3px;background:#cfd2d8;border-radius:50%;transition:.2s}
#SDM_body .SDM_switch input:checked + .SDM_slider{background:#ffb100}
#SDM_body .SDM_switch input:checked + .SDM_slider:before{transform:translateX(20px);background:#1a1a1a}
#SDM_body .SDM_tabs{display:grid;grid-template-columns:1fr 1fr 1fr;background:#0f1115}
#SDM_body .SDM_tabInput{all:unset}
#SDM_body .SDM_tabInput[type="radio"]{position:absolute;opacity:0;pointer-events:none}
#SDM_body .SDM_tabLabel{padding:10px 0;text-align:center;font-weight:600;font-size:12px;line-height:1;color:#9aa1ad;border-bottom:2px solid transparent;cursor:pointer;user-select:none}
#SDM_body #tab_on:checked   + .SDM_tabLabel{color:#ffb100;border-color:#ffb100}
#SDM_body #tab_off:checked  + .SDM_tabLabel{color:#ffb100;border-color:#ffb100}
#SDM_body #tab_settings:checked + .SDM_tabLabel{color:#ffb100;border-color:#ffb100}
#SDM_body .SDM_main{padding:10px;background:#0f1115}
#SDM_body .SDM_tabc{height:300px}
#SDM_body .SDM_textarea{width:100%;height:100%;resize:none;box-sizing:border-box;border:1px solid #2a2f3a;background:#0b0d11;color:#dfe3ea;border-radius:10px;padding:10px;font:13px/1.4 ui-monospace,Consolas,Monaco}
#SDM_body .SDM_text{height:34px;border:1px solid #2a2f3a;background:#0b0d11;color:#e3e6ec;border-radius:8px;padding:0 10px;min-width:160px;font:13px/1.2 system-ui}
#SDM_body .SDM_time{height:34px;border:1px solid #2a2f3a;background:#0b0d11;color:#e3e6ec;border-radius:8px;padding:0 10px;width:70px;font:13px/1.2 system-ui;text-align:center}
#SDM_body .SDM_sep{color:#8f96a3;margin:0 6px}
#SDM_body .SDM_row{display:flex;align-items:center;gap:10px;margin:10px 0}
#SDM_body .SDM_tgl{display:flex;align-items:center;gap:8px;color:#c9ced9;font:500 13px/1.2 system-ui}
#SDM_body .SDM_root *{color:#e3e6ec}
#SDM_body #SDM_hotkey_input:focus{outline:2px solid #ffb100; box-shadow:0 0 0 3px rgba(255,177,0,.15)}
</style>
`;
  document.body.insertAdjacentHTML('beforeend', ui);
}

function wireUI() {
  document.getElementById('SDM_toggle').addEventListener('click', safeToggle);
  document.getElementById('SDM_close').addEventListener('click', togglePanel);

  [['tab_on','on'],['tab_off','off'],['tab_settings','settings']].forEach(([id,name])=>{
    document.getElementById(id).addEventListener('change',()=>{
      document.querySelectorAll('#SDM_body .SDM_tabc').forEach(v=>v.style.display='none');
      document.querySelector(`#SDM_body .SDM_tabc[data-tab="${name}"]`).style.display='block';
    });
  });

  document.getElementById('SDM_add_page').addEventListener('click', () => {
    const domain = HOST;
    if (document.getElementById('tab_on').checked) {
      const t = document.querySelector('#SDM_on_textarea');
      t.value = (t.value ? t.value.trim()+', ' : '') + domain;
    } else if (document.getElementById('tab_off').checked) {
      const t = document.querySelector('#SDM_off_textarea');
      t.value = (t.value ? t.value.trim()+', ' : '') + domain;
    }
    saveSettings();
  });

  document.querySelector('#SDM_body').addEventListener('input', saveSettings);
  document.querySelector('#SDM_body').addEventListener('change', saveSettings);

  const hkInput = document.getElementById('SDM_hotkey_input');
  hkInput.addEventListener('focus', ()=> hkInput.select());
  hkInput.addEventListener('keydown', e => {
    if (e.key === 'Tab') return;
    if (e.key === 'Escape') { hkInput.blur(); e.preventDefault(); return; }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      hkInput.value = ''; saveSettings(); e.preventDefault(); return;
    }
    let combo = '';
    if (e.ctrlKey && e.key!=='Control') combo+='Ctrl + ';
    if (e.altKey && e.key!=='Alt') combo+='Alt + ';
    if (e.shiftKey && e.key!=='Shift') combo+='Shift + ';
    let key = e.key;
    if (/^.$/u.test(key)) key = key.toUpperCase();
    const ignore = ['Control','Alt','Shift','Meta','OS','Dead','Unidentified'];
    if (!ignore.includes(key)) {
      hkInput.value = combo + key;
      saveSettings();
    }
    e.preventDefault();
  });

  document.addEventListener('keydown', e => {
    const a = document.activeElement;
    if (a && (/^(input|textarea)$/i.test(a.tagName) || a.isContentEditable)) return;
    const seq = (document.querySelector('#SDM_hotkey_input')?.value || state.settings[1])
      .split(' + ').map(s=>s.trim()).filter(Boolean);
    const needCtrl = seq.includes('Ctrl'), needAlt = seq.includes('Alt'), needShift = seq.includes('Shift');
    const mainKey = seq.find(k=>!['Ctrl','Alt','Shift'].includes(k)) || '';
    const match =
      (!needCtrl || e.ctrlKey) &&
      (!needAlt || e.altKey) &&
      (!needShift || e.shiftKey) &&
      (!!mainKey && mainKey.toUpperCase() === (e.key || '').toUpperCase());
    const hotOn = (document.querySelector('#SDM_hotkey')?.checked ?? (state.settings[0]==='hotKeySetOn'));
    if (hotOn && match) { e.preventDefault(); safeToggle(); }
  });
}

function togglePanel() {
  const el = document.getElementById('SDM_body');
  if (!el) return;
  el.style.display = (el.style.display==='none' || !el.style.display)?'block':'none';
}

function setToggle(v) {
  const t = document.querySelector('#SDM_toggle');
  if (t) t.checked = !!v;
}

function safeToggle() {
  if (hardOffNow()) { removeFilterAll(); setToggle(false); return; }
  if (isOn()) { removeFilterAll(); setToggle(false); }
  else { applyFilter(); setToggle(true); }
}

function saveSettings() {
  state.alwaysOnList  = document.querySelector('#SDM_on_textarea').value.replace(/^, ?/,'');
  state.alwaysOffList = document.querySelector('#SDM_off_textarea').value.replace(/^, ?/,'');
  state.settings = [
    document.querySelector('#SDM_hotkey').checked ? 'hotKeySetOn' : 'hotKeySetOff',
    document.querySelector('#SDM_hotkey_input').value,
    document.querySelector('#SDM_timeSet').checked ? 'setTimeOn' : 'setTimeOff',
    document.querySelector('#SDM_timeSet_input_from').value,
    document.querySelector('#SDM_timeSet_input_to').value
  ];
  GM.setValue('alwaysOnList',  state.alwaysOnList);
  GM.setValue('alwaysOffList', state.alwaysOffList);
  GM.setValue('settings',      state.settings);
}
