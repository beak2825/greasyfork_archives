// ==UserScript==
// @name         OSM Directions
// @namespace    http://technetium.be
// @version      1.4
// @description  Replaces the links to GoogleDirections to OpenStreetMap directions
// @author       Toni Cornelissen (github@technetium.be)
// @match        *://*.geocaching.com/geocache/*
// @downloadURL https://update.greasyfork.org/scripts/530206/OSM%20Directions.user.js
// @updateURL https://update.greasyfork.org/scripts/530206/OSM%20Directions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        window.addEventListener('click', function(e) {
            if ('A' != e.target.tagName) { return; }
            if (e.target.href.startsWith('https://maps.google.com/maps?f=d')) {
                e.preventDefault();
                const orig = e.target.href.replace(/.*saddr=/, '').replace(/%20.*/, '');
                const dest = e.target.href.replace(/.*daddr=/, '').replace(/%20.*/, '');
                location.href = 'https://www.openstreetmap.org/directions?route='+orig+'%3B'+dest;
            }
          });
    }
    main();
})();
