// ==UserScript==
// @name         No Youtube Short
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Allows you to view Youtube shorts as normal videos
// @author       Freschko Yamato
// @match       *://www.youtube.com/*
// @match       *://youtube.com/*

// @icon        https://image.noelshack.com/fichiers/2023/07/4/1676551143-noshort.png
// @grant       none
// @licence      MIT
// @downloadURL https://update.greasyfork.org/scripts/460129/No%20Youtube%20Short.user.js
// @updateURL https://update.greasyfork.org/scripts/460129/No%20Youtube%20Short.meta.js
// ==/UserScript==

(function() {

    function checkURL() {
        // Verifies if it's a short URL
        if (window.location.href.includes("shorts")) {

            redirect() //redirects
        }

        setTimeout(checkURL, 500);
    }

    checkURL();



    function redirect() {
        // Redirects to a watch URL
        let url = window.location.href
        url = url.replace('shorts/', 'watch?v=')
        window.location.href = url;
    }


    'use strict';

})();