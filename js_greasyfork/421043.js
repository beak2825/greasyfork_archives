// ==UserScript==
// @name         DL search for mobile
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add DLsite Shotcut direct search in "useful" website
// @author       Royal
// @match        https://www.dlsite.com/maniax-touch/*
// @grant        unsafeWindow
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/421043/DL%20search%20for%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/421043/DL%20search%20for%20mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // this add shotcut to search result
    if (window.location.href.indexOf("fsr/=/") > -1) {
            $(document).ready(function()
        {
            $(".n_work_item").each(function( index ) {
                var name = $(this).find(".n_work_name").find("a").text();
                console.log( index + ": " + name);
                var Href1 = "https://hitomi.la/search.html?" + name;
                var Href2 = "https://www.wnacg.com/search/?q=" + name;
                $(this).append('<section><a href="'+ Href1 + '" style="float: left; margin: 8px; text-align: center; font-size: 20px; padding: 8px; border-style: double;">hitomi.la</a><a href="' + Href2 +'" style="float: right; margin: 8px; text-align: center; font-size: 20px; padding: 8px; border-style: double;">wnacg</a></section>')
            });
        });
    }
    if (window.location.href.indexOf("/ranking/") > -1) {
            $(document).ready(function()
        {
            $(".n_work_item").each(function( index ) {
                var name = $(this).find(".n_work_name").find("a").text();
                console.log( index + ": " + name);
                var Href1 = "https://hitomi.la/search.html?" + name;
                var Href2 = "https://www.wnacg.com/search/?q=" + name;
                $(this).append('<section><a href="'+ Href1 + '" style="float: right; margin: 8px; text-align: center; font-size: 20px; padding: 8px; border-style: double;">hitomi.la</a><a href="' + Href2 +'" style="float: right; margin: 8px; text-align: center; font-size: 20px; padding: 8px; border-style: double;">wnacg</a></section>')
            });
        });
    }
})();