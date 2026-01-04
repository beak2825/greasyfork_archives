// ==UserScript==
// @name         Copy/Paste Unblocker Ultra
// @namespace    boss.tools
// @version      1.6
// @description  Force-enable copy, paste, text selection, and right-click on blocked websites.
// @author       Boss
// @match        *://*/*
// @run-at       document-start
// @grant        GM_setClipboard
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/546127/CopyPaste%20Unblocker%20Ultra.user.js
// @updateURL https://update.greasyfork.org/scripts/546127/CopyPaste%20Unblocker%20Ultra.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    html, body, * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      user-select: text !important;
    }
    [unselectable="on"] {
      -webkit-user-select: text !important;
      user-select: text !important;
    }
    input, textarea {
      -webkit-user-select: auto !important;
      user-select: auto !important;
    }
  `;
  const styleTag = document.createElement('style');
  styleTag.id = 'cp-unblocker-style';
  styleTag.textContent = css;
  (document.documentElement || document.head || document.body).appendChild(styleTag);

  const killTypes = [
    'copy','cut','paste',
    'contextmenu','selectstart','dragstart',
    'mousedown','mouseup','click',
    'keydown','keypress','keyup',
    'pointerdown','pointerup','touchstart','touchend',
    'beforecopy','beforecut','beforepaste'
  ];
  const kill = (e) => { e.stopImmediatePropagation(); };
  killTypes.forEach(t => {
    document.addEventListener(t, kill, true);
    window.addEventListener(t, kill, true);
  });

  const nullifyHandlers = () => {
    const targets = [document, document.documentElement, document.body].filter(Boolean);
    const attrs = [
      'oncopy','oncut','onpaste','oncontextmenu','onselectstart','ondragstart',
      'onmousedown','onmouseup','onclick','onkeydown','onkeypress','onkeyup','ontouchstart','ontouchend'
    ];
    targets.forEach(t => attrs.forEach(a => { try { t[a] = null; } catch(_) {} }));
  };
  const nullifyInterval = setInterval(nullifyHandlers, 500);
  window.addEventListener('load', () => { nullifyHandlers(); clearInterval(nullifyInterval); });

  const mo = new MutationObserver(records => {
    for (const m of records) {
      if (m.type === 'attributes') {
        const el = m.target;
        if (m.attributeName.startsWith('on')) {
          try { el[m.attributeName] = null; } catch(_) {}
        }
        if (m.attributeName === 'style' || m.attributeName === 'class') {
          const cs = getComputedStyle(el);
          if (cs.userSelect === 'none') {
            el.style.setProperty('user-select', 'text', 'important');
            el.style.setProperty('-webkit-user-select', 'text', 'important');
          }
        }
      }
    }
  });
  mo.observe(document.documentElement, { attributes: true, subtree: true });

  function forceUnlock() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const areaMin = 0.9 * vw * vh;
    const nodes = Array.from(document.querySelectorAll('body *'));
    nodes.forEach(el => {
      const s = getComputedStyle(el);
      const z = parseInt(s.zIndex) || 0;
      if (!['fixed','sticky'].includes(s.position) || z < 999) return;
      const r = el.getBoundingClientRect();
      const area = r.width * r.height;
      const covers = r.left <= 0 && r.top <= 0 && r.right >= vw - 1 && r.bottom >= vh - 1 && area >= areaMin;
      if (covers) {
        el.remove();
      }
    });
    ['overflow','overflow-y','overflow-x'].forEach(prop => {
      document.documentElement.style.setProperty(prop, 'auto', 'important');
      if (document.body) document.body.style.setProperty(prop, 'auto', 'important');
    });
  }
  document.addEventListener('keydown', e => {
    if (e.altKey && e.shiftKey && e.code === 'KeyU') {
      e.stopImmediatePropagation();
      forceUnlock();
    }
  }, true);

  document.addEventListener('copy', () => {
    try {
      const sel = String(window.getSelection && window.getSelection());
      if (sel) GM_setClipboard(sel);
    } catch(_) {}
  }, true);

})();
