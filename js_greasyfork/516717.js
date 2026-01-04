// ==UserScript==
// @name         LSS Regierungsbezirksgrenzen (DE only)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fügt Regierungsbezirksgrenzen auf der Karte ein.
// @author       Ninja200411
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516717/LSS%20Regierungsbezirksgrenzen%20%28DE%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516717/LSS%20Regierungsbezirksgrenzen%20%28DE%20only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const myStyle = {
        "weight": 2,
        "fillOpacity": 0.05
    };
    $.getJSON('https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/refs/heads/main/3_regierungsbezirke/1_sehr_hoch.geo.json').then(data => L.geoJSON(data, {style: {...myStyle, color: '#8B0000'}}).addTo(map));

})();