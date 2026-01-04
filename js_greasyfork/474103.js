// ==UserScript==
// @name         Dramaday.me Skip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skips ads
// @author       Kandic
// @match        https://dramaday.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        GM_xmlhttpRequest
// @connect      riviwi.com
// @connect      mega.nz
// @connect      uptobox.com
// @connect      krakenfiles.com
// @connect      self
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/474103/Dramadayme%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/474103/Dramadayme%20Skip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const regex = /(?<="token":")[^"]*(?=")/g;
    let as = document.getElementsByTagName("a");

    for(let i = 0; i < as.length; i++){
        if(as[i].href.indexOf("https://dramaday.me/?6bb2feb0ae") != -1){
            as[i].innerHTML += "(Skip ads)";
            GM_xmlhttpRequest({
                method: 'GET',
                url: as[i].href,
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0" },
                onload: function(e) {
                    let token = e.responseText.match(regex)[0].replaceAll('\\','');
                    GM_xmlhttpRequest({
                        method: 'POST',
                        redirect: "manual",
                        url: 'https://riviwi.com/wp-admin/admin-ajax.php',
                        headers: { "Host" : "riviwi.com", "content-type": "application/x-www-form-urlencoded" },
                        data: "token=" + encodeURIComponent(token) + "&action=83d294c1",
                        onerror: function(e) { as[i].href = e.finalUrl; },
                        onload: function(e) { as[i].href = e.finalUrl; }
                    });
                },
                onerror: function(e) {alert(e.responseText)}
            });
        }
    }




})();




