// ==UserScript==
// @name         GoComics AdBlock
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.0
// @description  Block ads on GoComics
// @author       Abdurazaaq Mohammed
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @match        https://*.gocomics.com/*
// @license      The Unlicense
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521396/GoComics%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/521396/GoComics%20AdBlock.meta.js
// ==/UserScript==
(function() {
  (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = 'gocomics-display-ad, .amu-ad, .tude-ad-filled { display: none !important; }';
})();