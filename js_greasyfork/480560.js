// ==UserScript==
// @name         LSS Landesgrenzen (Ungarn)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fügt Landesgrenzen auf der Karte ein.
// @author       DER_RED
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480560/LSS%20Landesgrenzen%20%28Ungarn%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480560/LSS%20Landesgrenzen%20%28Ungarn%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const bundeslaender = true;
    const bundeslandColor = '#A70BF5';
    const myStyle = {
        "weight": 2,
        "fillOpacity": 0.05
    };
  bundeslaender && $.getJSON('https://raw.githubusercontent.com/wuerdo/geoHungary/master/counties.geojson').then(data => L.geoJSON(data, {style: {...myStyle, color: bundeslandColor}}).addTo(map));
})();
