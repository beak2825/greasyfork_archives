// ==UserScript==
// @name         Old Reddit Adblock
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.0.2
// @description  Block ads on Old Reddit
// @author       Abdurazaaq Mohammed
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @match        https://old.reddit.com/*
// @match        https://np.reddit.com/*
// @license      The Unlicense
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/499250/Old%20Reddit%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/499250/Old%20Reddit%20Adblock.meta.js
// ==/UserScript==

(function() {
  (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = 'div[class*="promotedlink"] { display: none !important; }';
})();