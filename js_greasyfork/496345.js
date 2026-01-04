// ==UserScript==
// @name         Hide Suggests
// @namespace    https://greasyfork.org/users/214573
// @version      0.2.4
// @description  隱藏 FB 首頁的推薦項目
// @license      MIT
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/496345/Hide%20Suggests.user.js
// @updateURL https://update.greasyfork.org/scripts/496345/Hide%20Suggests.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
  'use strict';

  const CONFIG = {
    // 隱藏為你推薦
    hideSuggest: true,
    // 隱藏建議粉專
    hideFollow: true,
    // 隱藏建議社團
    hideJoin: true,
  };

  const TXT_SUGGEST = '為你推薦';
  const TXT_FOLLOW = '追蹤';
  const TXT_JOIN = '加入';
  const CLS_SUGGEST = (() => {
    let cls = '';
    do {
      cls = '_';
      const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < 4) {
        cls += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
    } while (document.body.querySelector(`.${cls}`));
    return cls;
  })();
  const SEL_CONTAINER = '.x1hc1fzr.x1unhpq9.x6o7n8i>div:not([class])>div:not([aria-hidden])';

  console.debug(`CLS_SUGGEST = '${CLS_SUGGEST}'`);
  GM_addStyle(`.${CLS_SUGGEST} { display: none !important; }`);

  function getElementAsync (selectors, target, timeout = 100) {
    return new Promise((resolve, reject) => {
      const i = setTimeout(function () {
        stop();
        const el = target.querySelector(selectors);
        if (el) resolve(el);
        else reject(new Error(`get "${selectors}" timeout`));
      }, timeout);
      const mo = new MutationObserver(r => r.forEach(mu => {
        const el = mu.target.querySelector(selectors);
        if (el) { stop(); resolve(el); }
      }));
      mo.observe(target, { childList: true, subtree: true });
      function stop () { clearTimeout(i); mo.disconnect(); }
    });
  }

  function checkSuggest (node) {
    if (!node.classList?.contains('x1lliihq')) return;

    const name = node.querySelector('.xod5an3 .x1iyjqo2 span[dir=auto] a')?.innerText;
    const isSuggest = CONFIG.hideSuggest &&
      Array.from(node.querySelectorAll('.xod5an3 .x1iyjqo2 span[dir=auto]'))
        .reduce((p, e) => p || (e.innerText.search(TXT_SUGGEST) >= 0), false);
    const isFollow = CONFIG.hideFollow &&
      Array.from(node.querySelectorAll('span.x1fey0fg'))
        .reduce((p, e) => p || (e.innerText.search(TXT_FOLLOW) >= 0), false);
    const isJoin = CONFIG.hideJoin &&
      Array.from(node.querySelectorAll('span.x1fey0fg'))
        .reduce((p, e) => p || (e.innerText.search(TXT_JOIN) >= 0), false);

    if (isSuggest || isFollow || isJoin) {
      console.debug(`Hide suggest: ${name}`);
      node.classList.add(CLS_SUGGEST);
    }
  }

  const handle = async function (container = null, observer = null) {
    if (!container || !container.checkVisibility()) {
      console.debug('miss container');
      if (observer) observer.disconnect();
      observer = null;
      try {
        container = await getElementAsync(SEL_CONTAINER, document.body, 500);
      } catch {
        return handle();
      }
    }

    observer = observer ?? (() => {
      const obs = new MutationObserver(rs => rs.forEach(record => {
        if (record.type === 'childList') {
          record.addedNodes.forEach(node => checkSuggest(node));
        }
      }));
      obs.observe(container, { childList: 1 });
      container.querySelectorAll('.x1lliihq')
        .forEach(n => checkSuggest(n));
      return obs;
    })();

    await new Promise(resolve => setTimeout(resolve, 500));
    return handle(container, observer);
  };

  handle();
})();
