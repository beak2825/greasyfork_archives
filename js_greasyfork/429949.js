// ==UserScript==
// @name         remove 2020 CCTV AD
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove CCTV floating AD
// @author       Andy Cui
// @match        *://2020.cctv.com/*
// @icon         https://www.google.com/s2/favicons?domain=cctv.com

// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
/* globals jQuery, $, waitForKeyElements */
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429949/remove%202020%20CCTV%20AD.user.js
// @updateURL https://update.greasyfork.org/scripts/429949/remove%202020%20CCTV%20AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var ads = $('.anime_ewm');
    if (ads.length == 0) return;

    ads.each(function (){
        var ad = $(this)

        // !!! Hide it
        ad.css("display", "none")
    });

})();