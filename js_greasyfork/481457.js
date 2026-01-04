// ==UserScript==
// @name        developer.chrome.com fast back/forward
// @namespace   https://greasyfork.org/en/users/2159-woxxom
// @description Makes back/forward navigation fast as they should be instead of half a second
// @version     1.0.1
// @license     MIT
// @match       https://developer.chrome.com/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/481457/developerchromecom%20fast%20backforward.user.js
// @updateURL https://update.greasyfork.org/scripts/481457/developerchromecom%20fast%20backforward.meta.js
// ==/UserScript==

const {addEventListener} = window;
window.addEventListener = function (type) {
  if (type !== 'popstate') addEventListener.apply(this, arguments);
};
Object.defineProperty(history, 'scrollRestoration', {
  value: history.scrollRestoration = 'auto',
  writable: false,
});
addEventListener('click', e => {
  const a = e.target.closest('a');
  if (a && a.href && a.getAttribute('href') !== '#') {
    e.stopPropagation();
    a.click();
    if (!document.getElementById(a.hash.slice(1)))
      (document.querySelector('h1') || document.body).scrollIntoView();
    requestAnimationFrame(() => scrollBy(0, -30));
  }
}, true);
