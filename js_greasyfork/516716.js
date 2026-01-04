// ==UserScript==
// @name         LSS Bundeslandgrenzen (DE only)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fügt Bundeslandgrenzen auf der Karte ein.
// @author       Ninja200411
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516716/LSS%20Bundeslandgrenzen%20%28DE%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516716/LSS%20Bundeslandgrenzen%20%28DE%20only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const myStyle = {
        "weight": 2,
        "fillOpacity": 0.05
    };
    $.getJSON('https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/refs/heads/main/2_bundeslaender/1_sehr_hoch.geo.json').then(data => L.geoJSON(data, {style: {...myStyle, color: '#006400'}}).addTo(map));
})();