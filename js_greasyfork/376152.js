// ==UserScript==
// @name         Ali Auto Global
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  auto open global version of the page
// @author       ksevelyar
// @match        *.aliexpress.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376152/Ali%20Auto%20Global.user.js
// @updateURL https://update.greasyfork.org/scripts/376152/Ali%20Auto%20Global.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
  const globalLink = document.querySelector('[data-role=goto-globalsite]');
  if (!globalLink) { return; }

  const aliGlobalDomain = 'https://www.aliexpress.com';
  globalLink.href = aliGlobalDomain + window.location.pathname;
  globalLink.click();
}, false);