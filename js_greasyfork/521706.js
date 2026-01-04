// ==UserScript==
// @name         Trinidad and Tobago Newsday AdBlock
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.0
// @description  Remove ads on Trinidad and Tobago Newsday.
// @author       Abdurazaaq Mohammed
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @match        https://newsday.co.tt/*
// @match        https://newsday.co.tt/
// @license      The Unlicense
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521706/Trinidad%20and%20Tobago%20Newsday%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/521706/Trinidad%20and%20Tobago%20Newsday%20AdBlock.meta.js
// ==/UserScript==
(function() {
  (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = '*[class*="ad-manager"], *[class*="ad-container"], .fancybox-wrap, #popup-ad, #popup-ad-content { display: none !important; }';
})();