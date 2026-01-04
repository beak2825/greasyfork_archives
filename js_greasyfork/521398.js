// ==UserScript==
// @name         Remove user flair on Old Reddit
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.0
// @description  Remove flair of users on Old Reddit
// @author       Abdurazaaq Mohammed
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @match        https://*.reddit.com/*
// @license      The Unlicense
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521398/Remove%20user%20flair%20on%20Old%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/521398/Remove%20user%20flair%20on%20Old%20Reddit.meta.js
// ==/UserScript==
(function() {
  (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = '.flair { display: none !important; }';
})();