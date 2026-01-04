// ==UserScript==
// @name         Shopee URL Cleaner
// @version      1.0
// @description  Clean Shopee URL
// @icon         https://www.google.com/s2/favicons?domain=shopee.tw
// @icon64       https://www.google.com/s2/favicons?domain=shopee.tw&sz=64
// @source       https://github.com/YuerLee/userscript/raw/main/scripts/shopee-url-cleaner.user.js
// @author       Yuer Lee
// @license      MIT
// @match        https://shopee.tw/*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/1407758
// @downloadURL https://update.greasyfork.org/scripts/520057/Shopee%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/520057/Shopee%20URL%20Cleaner.meta.js
// ==/UserScript==

function cleanUrl() {
  const match = window.location.href.match(/-i\.(\d+)\.(\d+)/);

  if (!match) {
    return;
  }

  const simplyPath = `product/${match[1]}/${match[2]}`;

  window.history.replaceState(null, '', simplyPath);
}

function throttle(fn, delay = 500) {
  let timer = null;

  return (...args) => {
    if (timer) {
      return;
    }

    fn(...args);

    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
}

new MutationObserver(throttle(cleanUrl)).observe(document, {
  subtree: true,
  childList: true,
});
