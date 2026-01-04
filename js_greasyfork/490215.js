// ==UserScript==
// @name           Quran.com Black Background
// @namespace      https://github.com/AbdurazaaqMohammed
// @version        1.1
// @author         Abdurazaaq Mohammed
// @description    Change background color to AMOLED black on Quran.com
// @match          https://quran.com/*
// @homepage       https://github.com/AbdurazaaqMohammed/userscripts
// @license        The Unlicense
// @supportURL     https://github.com/AbdurazaaqMohammed/userscripts/issues
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/490215/Qurancom%20Black%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/490215/Qurancom%20Black%20Background.meta.js
// ==/UserScript==

(function() {
  'use strict';

  (document.head || document.documentElement).appendChild(document.createElement('style')).textContent = '*, * :hover {color: white !important; background: black !important;}';
})();