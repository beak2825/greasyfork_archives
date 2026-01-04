// ==UserScript==
// @name         LSS Landesgrenzen (Tschechien)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fügt Landesgrenzen auf der Karte ein.
// @author       DER_RED
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480563/LSS%20Landesgrenzen%20%28Tschechien%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480563/LSS%20Landesgrenzen%20%28Tschechien%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const bundeslaender = true;
    const bundeslandColor = '#484687';
    const myStyle = {
        "weight": 2,
        "fillOpacity": 0.05
    };
  bundeslaender && $.getJSON('https://raw.githubusercontent.com/siwekm/czech-geojson/master/kraje.json').then(data => L.geoJSON(data, {style: {...myStyle, color: bundeslandColor}}).addTo(map));
})();
