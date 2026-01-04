// ==UserScript==
// @name         Colorful Douban
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove douban's grayscale mode
// @author       Adeptus
// @match        https://www.douban.com/*
// @grant        all
// @downloadURL https://update.greasyfork.org/scripts/399454/Colorful%20Douban.user.js
// @updateURL https://update.greasyfork.org/scripts/399454/Colorful%20Douban.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('body').classList.remove('gray-mode');
})();