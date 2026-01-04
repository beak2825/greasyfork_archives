// ==UserScript==
// @name         JAV Popup
// @namespace    https://greasyfork.org/ja/scripts/375587-jav-popup
// @version      0.1
// @description  JAV site img popup
// @author       kyu-su
// @match        http://javtorrent.re/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375587/JAV%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/375587/JAV%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var xOffset = 20;
    var yOffset = 20;

    $(".base li a img").each(function() {
        var orig = this.src.replace( "_s" , "" );
        var img = this.src.split("/").slice(-1)[0];
        var clases = img.split(".")[0];

        $("body").append("<div class='tooltip " + clases + "' style='position: absolute;z-index: 1000; display: none;'><div class='img'><img src='"+ orig +"' /></div></div>");
   });

    $(".base li a img").hover(function(e){
        var img = this.src.split("/").slice(-1)[0];
        var clases = img.split(".")[0];

        var left = $(this).offset().left < 750 ?
                   $(this).offset().left + $(this).outerWidth() + xOffset : $(this).offset().left - (600 + xOffset);

        $("body").find(".tooltip." + clases)
            .css("top", $(this).offset().top + "px")
            .css("left", left + "px")
            .show();
    }, function(){
        $(".tooltip").hide();
    });
})();