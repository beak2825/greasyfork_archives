// ==UserScript==
// @name Discord Sidebar
// @match https://discord.com/*
// @grant none
// @run-at document-end
// @license MIT
// @description Open Discord sidebar on load
// @version 0.0.1.20240609121123
// @namespace https://greasyfork.org/users/1312904
// @downloadURL https://update.greasyfork.org/scripts/497439/Discord%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/497439/Discord%20Sidebar.meta.js
// ==/UserScript==
 
new Promise(() => {
  const sel = 'button[class^="btnHamburger"]'
  new MutationObserver((_, observer) => {
    if (document.querySelector(sel)) {
      observer.disconnect();
      document.querySelector(sel).click()
    }
  }).observe(document.body, {
    childList: true,
    subtree: true
  })
})