// ==UserScript==
// @name         Old reddit no users info
// @namespace    https://github.com/AbdurazaaqMohammed
// @author       Abdurazaaq Mohammed
// @version      1.1
// @description  Remove subscribers and online users info from subreddits on Old Reddit
// @match        https://old.reddit.com/r/*
// @match        https://np.reddit.com/r/*
// @run-at       document-start
// @grant        none
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/490039/Old%20reddit%20no%20users%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/490039/Old%20reddit%20no%20users%20info.meta.js
// ==/UserScript==

(function() {
  'use strict';
  (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = '.subscribers, .users-online { display: none !important; }';
})();