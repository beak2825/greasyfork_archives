// ==UserScript==
// @name         New Reddit Adblock
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.0.3
// @description  Remove ads on New Reddit
// @author       Abdurazaaq Mohammed
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @match        https://*.reddit.com/*
// @exclude      https://np.reddit.com/*
// @exclude      https://old.reddit.com/*
// @license      The Unlicense
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/510912/New%20Reddit%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/510912/New%20Reddit%20Adblock.meta.js
// ==/UserScript==

(function() {
  (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = 'shreddit-ad-post, shreddit-dynamic-ad-link, shreddit-comments-page-ad, shreddit-comment-tree-ad { display: none !important; }';
})();