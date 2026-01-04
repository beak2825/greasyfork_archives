// ==UserScript==
// @name         LSS Landesgrenzen (AT only)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fügt Landesgrenzen auf der Karte ein.
// @author       Jalibu
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480564/LSS%20Landesgrenzen%20%28AT%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480564/LSS%20Landesgrenzen%20%28AT%20only%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const bundeslaender = true;
    const bezirke = true;
    const gemeinden = true;
    const bundeslandColor = '#6a00ff';
    const bezirkColor = '#ff0000';
    const gemeindeColor = '#00ff00';
    const myStyle = {
        "weight": 2,
        "fillOpacity": 0.05
    };
    bundeslaender && $.getJSON('https://raw.githubusercontent.com/ginseng666/GeoJSON-TopoJSON-Austria/master/2017/simplified-95/laender_95_geo.json').then(data => L.geoJSON(data, {style: {...myStyle, color: bundeslandColor}}).addTo(map));
  //  bezirke && $.getJSON('https://raw.githubusercontent.com/ginseng666/GeoJSON-TopoJSON-Austria/master/2017/simplified-95/bezirke_95_geo.json').then(data => L.geoJSON(data, {style: {...myStyle, color: bezirkColor}}).addTo(map));
  //  gemeinden && $.getJSON('https://raw.githubusercontent.com/ginseng666/GeoJSON-TopoJSON-Austria/master/2017/simplified-95/gemeinden_95_geo.json').then(data => L.geoJSON(data, {style: {...myStyle, color: gemeindeColor}}).addTo(map));
})();
