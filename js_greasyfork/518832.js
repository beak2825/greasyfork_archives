// ==UserScript==
// @name        real lazy loading for webcatalog.circle.ms
// @namespace   Violentmonkey Scripts
// @match       https://webcatalog.circle.ms/Spa#*DisplayMode=1*
// @grant       none
// @version     0.1
// @author      lijd
// @description 当たり前のように金を取っている、これだから日本のIT企業はいつまで経っても烂泥扶不上墙…
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/518832/real%20lazy%20loading%20for%20webcatalogcirclems.user.js
// @updateURL https://update.greasyfork.org/scripts/518832/real%20lazy%20loading%20for%20webcatalogcirclems.meta.js
// ==/UserScript==


(() => {
  function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  const db = new Map();
  const prevShowing = new Set();

  function showCurrAndHidePrev() {
    const all = $$('.cut-tile.m-imgblock-list__item:not([style="display: none;"]) .cover');
    const docHeight = document.documentElement.scrollHeight;
    const start = Math.max(Math.floor((window.scrollY - 444) / (docHeight - 444) * all.length) - 50, 0);
    const length = Math.floor(window.innerHeight / docHeight * all.length);
    const end = Math.min(start + length + 100, all.length)
    const showing = all.slice(start, end);
    // showed.forEach(saveAndHide);
    for (const elm of prevShowing) {
      hide(elm);
    }
    prevShowing.clear();
    showing.forEach(elm => {
      if (db.has(elm)) {
        elm.style.backgroundImage = db.get(elm);
        prevShowing.add(elm);
      }
    });
  }

  function saveNewAndHide(elm) {
    if(!db.has(elm)) {
      db.set(elm, elm.style.backgroundImage);
      hide(elm);
    }
  }
  function hide(elm) {
    elm.style.backgroundImage = "none";
  }

  let prevLength = 0;
  function updateDBAndHideAll() {
    const now = $$('.cut-tile.m-imgblock-list__item:not([style="display: none;"]) .cover');
    if (now.length === prevLength) return;
    now.slice(prevLength, now.length).forEach(saveNewAndHide);
    prevLength = now.length;
  }

  updateDBAndHideAll();
  showCurrAndHidePrev();
  setInterval(() => {
    updateDBAndHideAll();
    showCurrAndHidePrev();
  }, 3000);
  setInterval(showCurrAndHidePrev, 1000);
})();