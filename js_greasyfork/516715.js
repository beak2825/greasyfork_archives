// ==UserScript==
// @name         LSS Landesgrenzen (DE only)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fügt Landesgrenzen auf der Karte ein.
// @author       Ninja200411
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516715/LSS%20Landesgrenzen%20%28DE%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516715/LSS%20Landesgrenzen%20%28DE%20only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const myStyle = {
        "weight": 2,
        "fillOpacity": 0.05
    };
    $.getJSON('https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/refs/heads/main/1_deutschland/1_sehr_hoch.geo.json').then(data => L.geoJSON(data, {style: {...myStyle, color: '#00008B'}}).addTo(map));
})();