// ==UserScript==
// @name         Ungiffy ToyHouse Thumbnails
// @namespace    http://tampermonkey.net/
// @version      2024-05-08
// @description  Turn gif thumbnails into a poop emoji or something
// @author       You
// @match        https://toyhou.se/*
// @icon         https://toyhou.se/img/favicon.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      GNU AGPLv3
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/494432/Ungiffy%20ToyHouse%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/494432/Ungiffy%20ToyHouse%20Thumbnails.meta.js
// ==/UserScript==

(function() {

    var interval = window.setInterval(function() {
        $(".img-thumbnail").each(function(){
            var img = $(this).children('img');


            GM_xmlhttpRequest({url: $(img).attr('src'), method:'HEAD', onload: function(response){
                var headers = response.responseHeaders;

                if(headers.indexOf("GIF") >= 0)
                    img.replaceWith("<div style='font-size:5rem'>💩</div>");
            }});
        });
    }, 100); // Interval cuz otherwise shit doesnt always load


})();