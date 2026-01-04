// ==UserScript==
// @name         Munzee Map Zoom
// @version      0.1
// @description  Remove zoom limit
// @author       rabe85
// @match        https://www.munzee.com/map
// @match        https://www.munzee.com/map/*
// @match        https://www.munzee.com/specials
// @match        https://www.munzee.com/specials/*
// @match        https://www.munzee.com/places
// @match        https://www.munzee.com/places/*
// @match        https://www.munzee.com/gardens
// @match        https://www.munzee.com/gardens/*
// @match        https://www.munzee.com/settings
// @match        https://www.munzee.com/settings/*
// @match        https://www.munzee.com/m/*/map/deploys
// @match        https://www.munzee.com/m/*/map/deploys/*
// @match        https://www.munzee.com/m/*/*/map
// @match        https://www.munzee.com/m/*/*/map/*
// @match        https://www.munzee.com/m/*/*/admin/map
// @match        https://www.munzee.com/m/*/*/admin/map/*
// @match        https://statzee.munzee.com/player/where
// @match        https://statzee.munzee.com/player/where/*
// @grant        none
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/373553/Munzee%20Map%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/373553/Munzee%20Map%20Zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function munzee_map() {

        // Remove map zoom limit
        map.setMinZoom(0);

    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        munzee_map();
    } else {
        document.addEventListener("DOMContentLoaded", munzee_map, false);
    }

})();