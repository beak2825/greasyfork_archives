// ==UserScript==
// @name         LSS Landesgrenzen (Slowakei)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fügt Landesgrenzen auf der Karte ein.
// @author       DER_RED
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480559/LSS%20Landesgrenzen%20%28Slowakei%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480559/LSS%20Landesgrenzen%20%28Slowakei%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const bundeslaender = true;
    const bundeslandColor = '#18744E';
    const myStyle = {
        "weight": 2,
        "fillOpacity": 0.05
    };
  bundeslaender && $.getJSON('https://raw.githubusercontent.com/drakh/slovakia-gps-data/master/GeoJSON/epsg_4326/regions_epsg_4326.geojson').then(data => L.geoJSON(data, {style: {...myStyle, color: bundeslandColor}}).addTo(map));
})();
