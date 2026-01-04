// ==UserScript==
// @name        Nyaa SI Sort and Filter
// @namespace   Original by Vietconnect & Simon1, updated by yumi2378 to only sort by number of seeds and filter search to files including "1080"
// @require     http://code.jquery.com/jquery-3.1.0.slim.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/markdown-it/8.3.1/markdown-it.min.js
// @include     http*://nyaa.si/*
// @grant       GM_xmlhttpRequest
// @version     1
// @description This script sorts searches by seeders, searches results containing "1080"
// @downloadURL https://update.greasyfork.org/scripts/370713/Nyaa%20SI%20Sort%20and%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/370713/Nyaa%20SI%20Sort%20and%20Filter.meta.js
// ==/UserScript==

var url = $(location).attr('href');

if((url.indexOf('q=') > -1) && (url.indexOf('s=') == -1) && (url.indexOf('o=') == -1)){
    var q = getUrlParameter('q');
    if(q != ''){
        window.location.replace(url + "+1080&s=seeders&o=desc");
        redirecting = true;
    }
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}