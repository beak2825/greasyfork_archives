// ==UserScript==
// @name         LSS Landesgrenzen (Slowenien)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fügt Landesgrenzen auf der Karte ein.
// @author       DER_RED
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480561/LSS%20Landesgrenzen%20%28Slowenien%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480561/LSS%20Landesgrenzen%20%28Slowenien%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const bundeslaender = true;
    const bundeslandColor = '#465787';
    const myStyle = {
        "weight": 2,
        "fillOpacity": 0.05
    };
  bundeslaender && $.getJSON('https://raw.githubusercontent.com/DERRED2828/LS/main/Slowenien').then(data => L.geoJSON(data, {style: {...myStyle, color: bundeslandColor}}).addTo(map));
})();
