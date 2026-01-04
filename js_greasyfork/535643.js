// ==UserScript==
// @name         Auto ColorTest
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Whenever the page contains “过关” and #box.lv{n}, click the single span whose background‑color is unique. Runs continuously.
// @match        *://*.webhek.com/post/color-test*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535643/Auto%20ColorTest.user.js
// @updateURL https://update.greasyfork.org/scripts/535643/Auto%20ColorTest.meta.js
// ==/UserScript==

(() => {
  const pass = /过关/;
  const flag = 'data-oddspan-clicked';
  const isBox = e => e instanceof HTMLElement && e.id === 'box' && [...e.classList].some(c => /^lv\d+$/.test(c));
  const clickUnique = b => {
    const s = [...b.querySelectorAll('span')].filter(x => !x.hasAttribute(flag));
    if (!s.length) return;
    const m = new Map();
    s.forEach(x => {
      const c = getComputedStyle(x).backgroundColor.trim();
      (m.get(c) || m.set(c, []).get(c)).push(x);
    });
    let t = null, n = 1e9;
    m.forEach(v => { if (v.length === 1) t = v[0]; else if (!t && v.length < n) { n = v.length; t = v[0]; } });
    if (!t) return;
    t.setAttribute(flag, '1');
    t.scrollIntoView({block:'center'});
    t.click();
  };
  const scan = () => { if (!pass.test(document.body?.innerText||'')) return; const b = document.getElementById('box'); if (b && isBox(b)) clickUnique(b); };
  let pend = false;
  const schedule = () => { if (pend) return; pend = true; requestAnimationFrame(() => { pend = false; scan(); }); };
  function loop() {
    scan();
    setTimeout(loop, 0);
  }
  loop();
  //document.addEventListener('DOMContentLoaded', () => {
  //  scan();
  //  new MutationObserver(schedule).observe(document.body, {childList:true,subtree:true});
  //  setInterval(scan, 0);
  //});
})();