// ==UserScript==
// @name         OpenStreetMap Dark Mode (filter-based)
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Dark Mode for OpenStreetMap tiles based on inverting the colors and then rotating the hue.
// @author       scy
// @license      MIT
// @match        *://www.openstreetmap.org/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/517498/OpenStreetMap%20Dark%20Mode%20%28filter-based%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517498/OpenStreetMap%20Dark%20Mode%20%28filter-based%29.meta.js
// ==/UserScript==

// SPDX-FileCopyrightText: 2024 scy
// SPDX-License-Identifier: MIT

(function() {
    'use strict';

    GM_addStyle(`
      @media (prefers-color-scheme: dark) {
        /* Add filter to the tile images and map key. We need to include
         * .leaflet-tile-container in the selector since that's what the dimming
         * on the original site is targeting (as of 2024-11-15). */
        .leaflet-tile-container .leaflet-tile, .mapkey-table-entry td:first-child > * {
          filter: invert(95%) hue-rotate(180deg);
        }
      }
    `);
})();
