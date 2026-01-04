// ==UserScript==
// @name         Override map filter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Set filter: brightness(1) on .leaflet-tile-container and adjust nav layout
// @match        https://www.openstreetmap.org/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517406/Override%20map%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/517406/Override%20map%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .leaflet-tile { filter: none !important; }
        .nav { width: 100%; display: flex; justify-content: space-between; }
        .secondary { width: 100%; }
        .secondary .nav .nav-item:first-child { flex-grow: 10; }
    `);
})();