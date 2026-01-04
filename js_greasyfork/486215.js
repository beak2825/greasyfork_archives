// ==UserScript==
// @name         Arka Plan Gif
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Belirli bir siteye gidildiğinde arka plana gif ekler.
// @author       enesi götten
// @match        https://gartic.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/486215/Arka%20Plan%20Gif.user.js
// @updateURL https://update.greasyfork.org/scripts/486215/Arka%20Plan%20Gif.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Gif URL'si
    var gifUrl = 'https://motionbgs.com/dl/gif/3143';

    // Belirli siteye gidildiğinde arka plana gif ekle
    if (window.location.href.indexOf('https://gartic.io') !== -1) {
        // Arka plana gif eklemek için CSS kullan
        GM_addStyle('body { background: url("' + gifUrl + '") no-repeat fixed center; background-size: cover; }');
    }

})();