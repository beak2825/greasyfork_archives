// ==UserScript==
// @name         Steet2Map (show the location of street view on Google Maps! / 將Google地圖的街景位置傳送至2D地圖上!)
// @namespace    com.Dogkiller87
// @version      0.3
// @description  [Google Map Street View] Show current street view location on the 2D map
// @author       Dogkiller87
// @include      /^https?://www\.google\.com.*/maps/.*/
// @icon         https://www.google.com/images/branding/product/ico/maps15_bnuw3a_32dp.ico
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/393452/Steet2Map%20%28show%20the%20location%20of%20street%20view%20on%20Google%20Maps%21%20%20%E5%B0%87Google%E5%9C%B0%E5%9C%96%E7%9A%84%E8%A1%97%E6%99%AF%E4%BD%8D%E7%BD%AE%E5%82%B3%E9%80%81%E8%87%B32D%E5%9C%B0%E5%9C%96%E4%B8%8A%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/393452/Steet2Map%20%28show%20the%20location%20of%20street%20view%20on%20Google%20Maps%21%20%20%E5%B0%87Google%E5%9C%B0%E5%9C%96%E7%9A%84%E8%A1%97%E6%99%AF%E4%BD%8D%E7%BD%AE%E5%82%B3%E9%80%81%E8%87%B32D%E5%9C%B0%E5%9C%96%E4%B8%8A%21%29.meta.js
// ==/UserScript==

function toDMS(coordinate) {
    var absolute = Math.abs(coordinate);
    var degrees_i = Math.floor(absolute);
    var minutes_f = (absolute - degrees_i) * 60;
    var minutes_i = Math.floor(minutes_f);
    var seconds = ((minutes_f - minutes_i) * 60).toFixed(1);
    return degrees_i + "°" + minutes_i + "'" + seconds;
}

function cDMS(lat, lng) {
    var latitude = toDMS(lat);
    var latitudeNS = lat >= 0 ? "N" : "S";
    var longitude = toDMS(lng);
    var longitudeEW = lng >= 0 ? "E" : "W";
    return latitude + '\"' + latitudeNS + '+' + longitude + '\"' + longitudeEW;
}

function showMap() {
    var url = document.location.href;
    if (!url.includes('/place/') && url.includes('@')) {
        var coord = url.split('/')[4].substr(1).split(',');
        var combine = cDMS(coord[0], coord[1]) + '/@' + coord[0] + ',' + coord[1];
        var parameters = url.substr(url.indexOf('?'));
        document.location.href = 'https://www.google.com.tw/maps/place/' + combine + parameters;
    }
}

const checkElement = async selector => {
    while ( document.querySelector(selector) === null) {
        await new Promise( resolve => requestAnimationFrame(resolve) )
    }
    return document.querySelector(selector);
}

const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        console.log('The ' + mutation.attributeName + ' attribute was modified.');
    }
    // close.__jsaction.click = '';
    //var clone = close.cloneNode(true);
   // close = clone;
}

function attachJob(close) {
    const observer = new MutationObserver(callback);
    const config = { attributes: true };
    observer.observe(close, config);
}

(function() {
    'use strict';
    var close;
    checkElement('#image-header > div > button').then(element => {
        attachJob(element);
    });

    //const config = { attributes: true };
    //const observer = new MutationObserver(callback);
    //observer.observe(close, config);

    /*

    GM_registerMenuCommand("Show on map", showMap);*/
})();