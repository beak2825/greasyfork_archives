// ==UserScript==
// @name         Reddit AdBlock
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.0.3
// @description  Block ads on Reddit (both new and old)
// @author       Abdurazaaq Mohammed
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @match        https://*.reddit.com/*
// @license      The Unlicense
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519285/Reddit%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/519285/Reddit%20AdBlock.meta.js
// ==/UserScript==
(function() {
  (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = 'shreddit-ad-post, shreddit-dynamic-ad-link, shreddit-comments-page-ad, shreddit-comment-tree-ad, div[class*="promotedlink"] { display: none !important; }';
})();