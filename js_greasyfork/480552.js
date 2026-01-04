// ==UserScript==
// @name         LSS Landesgrenzen (Schweiz)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fügt Landesgrenzen auf der Karte ein.
// @author       DER_RED
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480552/LSS%20Landesgrenzen%20%28Schweiz%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480552/LSS%20Landesgrenzen%20%28Schweiz%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const bundeslaender = true;
    const bundeslandColor = '#7d0112';
    const myStyle = {
        "weight": 2,
        "fillOpacity": 0.05
    };
    bundeslaender && $.getJSON('https://raw.githubusercontent.com/zcreativelabs/SfGZ-d3-map/main/ch.json').then(data => L.geoJSON(data, {style: {...myStyle, color: bundeslandColor}}).addTo(map));
})();
