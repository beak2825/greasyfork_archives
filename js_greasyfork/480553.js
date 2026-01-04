// ==UserScript==
// @name         LSS Landesgrenzen (Belgien)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fügt Landesgrenzen auf der Karte ein.
// @author       DER_RED
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480553/LSS%20Landesgrenzen%20%28Belgien%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480553/LSS%20Landesgrenzen%20%28Belgien%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const bundeslaender = true;
    const bundeslandColor = '#9E1E03';
    const myStyle = {
        "weight": 2,
        "fillOpacity": 0.05
    };
  bundeslaender && $.getJSON('https://raw.githubusercontent.com/mathiasleroy/Belgium-Geographic-Data/master/dist/polygons/geojson/Belgium.provinces.WGS84.geojson').then(data => L.geoJSON(data, {style: {...myStyle, color: bundeslandColor}}).addTo(map));
})();
