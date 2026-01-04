// ==UserScript==
// @name         Horoscope
// @namespace    http://tampermonkey.net/
// @version      2024-02-25
// @description  updates automatically
// @author       You
// @match        https://ekantipur.com/horoscope
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ekantipur.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488261/Horoscope.user.js
// @updateURL https://update.greasyfork.org/scripts/488261/Horoscope.meta.js
// ==/UserScript==

function fetch_file(p, e){
    function singleRequest(timestamp){
        var queryString = {'timestamp' : timestamp};
        GM_xmlhttpRequest({
            method: "GET",
            url: p,
            data: queryString,
            onload: function(response) {
                var r = JSON.parse(response.responseText);
                e.innerHTML=r.data_from_file;
                singleRequest(r.timestamp);
            },
            onabort: function(response) {singleRequest(timestamp);},
            onerror: function(response) {singleRequest(timestamp);},
            ontimeout: function(response) {singleRequest(timestamp);},
        });
    }
    singleRequest();
}


(function() {
    'use strict';
    const server = 'http://rupak.name.np';
    var libre = document.getElementsByClassName('libra')[0].getElementsByTagName('p')[0];
    var capricorn = document.getElementsByClassName('capricorn')[0].getElementsByTagName('p')[0];
    fetch_file(server+'/pooling/server/server.php',libre);
    fetch_file(server+'/pooling/server/server2.php',capricorn);
})();