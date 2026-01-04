// ==UserScript==
// @name         Aither.cc Torrent Filter Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  this just autoclicks the filter button on torrents page
// @author       Seraph2
// @match        https://aither.cc/torrents
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409503/Aithercc%20Torrent%20Filter%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/409503/Aithercc%20Torrent%20Filter%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var filterButton = document.getElementById("facetedFiltersToggle");
    filterButton.click();
})();