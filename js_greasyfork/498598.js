// ==UserScript==
// @name Google Cookies
// @match https://www.google.com/*
// @grant none
// @run-at document-end
// @license MIT
// @description Reject Google cookies
// @version 0.0.1.20240622153144
// @namespace https://greasyfork.org/users/1312904
// @downloadURL https://update.greasyfork.org/scripts/498598/Google%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/498598/Google%20Cookies.meta.js
// ==/UserScript==
 
new Promise(() => {
  const sel = '.QS5gu.sy4vM'
  new MutationObserver((_, observer) => {
    if (document.querySelector(sel)) {
      observer.disconnect();
      document.querySelector(sel).click();
      document.querySelectorAll('.q0yked a')?.pop().click();
    }
  }).observe(document.body, {
    childList: true,
    subtree: true
  })
})