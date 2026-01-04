// ==UserScript==
// @name         Gartic.io Chat Nick Renk
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  gartic.io chat renk özelleştirme
// @author       Ryzex
// @match        *://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528898/Garticio%20Chat%20Nick%20Renk.user.js
// @updateURL https://update.greasyfork.org/scripts/528898/Garticio%20Chat%20Nick%20Renk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = `
        /* Sohbette kendi kullanıcı adını kırmızı ve küçük yap */
        .msg.you strong {
            color: red !important;
            font-size: 12px !important; /* Yazı boyutunu küçült */
        }

        /* Kullanıcı listesindeki kendi adını kırmızı yap */
        .player.you .name {
            color: red !important;
        }
    `;
    document.head.appendChild(style);
})();