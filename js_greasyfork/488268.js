// ==UserScript==
// @name         Ritural Archive Map Link
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2024-02-25
// @description  Add real yandex map link for grave coordinates
// @author       You
// @match        https://ritual-archive.ru/permission-view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ritual-archive.ru
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488268/Ritural%20Archive%20Map%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/488268/Ritural%20Archive%20Map%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getParams(url) {
        var regex = /([^=&?]+)=([^&#]*)/g, params = {}, parts, key, value;
        while((parts = regex.exec(url)) != null) {
            key = parts[1];
            value = parts[2];
            var isArray = /\[\]$/.test(key);
            if(isArray) {
                params[key] = params[key] || [];
                params[key].push(value);
            }
            else {
                params[key] = value;
            }
        }
        return params;
    }
    function parseCoordinates(coord) {
        let arr = coord.split(',');
        return {
            lat:arr[1],
            lon:arr[0]
        };
    }
    var $ = window.jQuery;

    let mapLink = $('a[href="https://yandex.ru/maps/"]');
    if ( $(mapLink).length > 0 ) {
        let mapImg = $(mapLink).find( $('img') );
        if ( $(mapImg).length > 0 ) {
            let mapSrc = $(mapImg).attr('src');
            let mapParams = getParams(mapSrc);
            let coords = parseCoordinates(mapParams['pt']);
            let newLink = 'https://yandex.ru/maps/54/yekaterinburg/?ll='+coords.lon+','+coords.lat+'&mode=search&sll='+coords.lon+','+coords.lat+'&text='+coords.lat+','+coords.lon+'&z=18';
            $('a[data-fancybox="map"]').after('<a target="_blank" href="'+newLink+'">Yandex Map</a>');
        }
    }
})();