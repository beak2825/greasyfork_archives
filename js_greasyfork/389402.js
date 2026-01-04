// ==UserScript==
// @name         Nairaland Nasty Blocker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Block Nasty Image on Nairaland.com
// @author       GoodMuyis
// @match        https://*.nairaland.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/389402/Nairaland%20Nasty%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/389402/Nairaland%20Nasty%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
        // Your code here.....
    $(document).ready(function() {
        $("head").append(`<style>img[src*="screenshot"],img[src*="_fb"]{display: none} .pd.sig p{ display: inline-block; margin: 2px !important; float: left;}
.attachmentimage{height:30px;}.nl-hide,._9AhH0,.vertipics{display:none !important}<style>`);
        $(".vertipics, ._9AhH0").remove();
        $(".attachmentimage").each(function(){
            $(this).wrap( `<a href="${imgl}" target="_blank"></a>` );
        });
        //Block BBnaija
        $( '.featured.w b:contains("BBNaija")' ).closest('a').addClass('nl-hide');

    //end of ready()
    });


})();