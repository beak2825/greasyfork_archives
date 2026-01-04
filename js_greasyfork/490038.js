// ==UserScript==
// @name         Don't Show Me Mods
// @namespace    https://github.com/AbdurazaaqMohammed
// @author       Abdurazaaq Mohammed
// @version      1.1
// @description  Remove subreddit moderators information from Old Reddit
// @match        https://old.reddit.com/r/*
// @match        https://np.reddit.com/r/*
// @run-at       document-start
// @grant        none
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/490038/Don%27t%20Show%20Me%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/490038/Don%27t%20Show%20Me%20Mods.meta.js
// ==/UserScript==

(function() {
  'use strict';
  (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = '.sidecontentbox { display: none !important; }';
})();
