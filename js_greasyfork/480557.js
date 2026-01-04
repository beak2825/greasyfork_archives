// ==UserScript==
// @name         LSS Landesgrenzen (Polen)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fügt Landesgrenzen auf der Karte ein.
// @author       DER_RED
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480557/LSS%20Landesgrenzen%20%28Polen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480557/LSS%20Landesgrenzen%20%28Polen%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const bundeslaender = true;
    const bundeslandColor = '#0FEB91';
    const myStyle = {
        "weight": 2,
        "fillOpacity": 0.05
    };
  bundeslaender && $.getJSON('https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/poland.geojson').then(data => L.geoJSON(data, {style: {...myStyle, color: bundeslandColor}}).addTo(map));
})();
