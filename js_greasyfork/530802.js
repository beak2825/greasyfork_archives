// ==UserScript==
// @name         MyDealz Profilseite Kommentar-Hover-Effekt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blendet beim Hovern auf MyDealz Profilseiten den vollständigen Kommentartext ein
// @author       MD928835
// @license      MIT
// @match        https://www.mydealz.de/profile/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530802/MyDealz%20Profilseite%20Kommentar-Hover-Effekt.user.js
// @updateURL https://update.greasyfork.org/scripts/530802/MyDealz%20Profilseite%20Kommentar-Hover-Effekt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = `
        .userProfile-action-comment {
            display: block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            line-clamp: 3;
            max-height: 4.5em;
        }

        .userProfile-action-comment:hover {
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
            line-clamp: unset;
            max-height: none;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);
})();