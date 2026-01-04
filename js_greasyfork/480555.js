// ==UserScript==
// @name         LSS Landesgrenzen (Italien)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fügt Landesgrenzen auf der Karte ein.
// @author       DER_RED
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480555/LSS%20Landesgrenzen%20%28Italien%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480555/LSS%20Landesgrenzen%20%28Italien%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const bundeslaender = true;
    const bundeslandColor = '#c300ff';
    const myStyle = {
        "weight": 2,
        "fillOpacity": 0.05
    };
    bundeslaender && $.getJSON('https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_regions.geojson').then(data => L.geoJSON(data, {style: {...myStyle, color: bundeslandColor}}).addTo(map));
})();
