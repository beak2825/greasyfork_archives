// ==UserScript==
// @name         InStream darkmode
// @name:de      InStream DarkMode
// @description  This script adds a switch to toggle between the standard light design and a dark "dark mode" user interface for low light situations
// @description:de Dieses Skript fügt einen Schalter zu InStream.de hinzu, mit dem das Design der Seite von hell zu einem dunklen Dark-Mode Modus umgeschaltet werden kann.
// @namespace    https://github.com/isync/instream-darkmode
// @homepageURL  https://instream.de/
// @version      0.11
// @author       isync
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://instream.de/*
// @icon         https://instream.de/favicon-32x32.png
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/440921/InStream%20darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/440921/InStream%20darkmode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("hello");

    $("body").append('<div id="darkmode-switch" data-is="on" style="position:absolute; top:10px; right: 10px; border: 1px solid #ccc; padding: 7px 5px; cursor: pointer; color:#ccc;">darkmode: <span>off</span></div>');

    $("#darkmode-switch").on("click", function(){
        if( $(this).hasClass("on") ){
            $(this).find("span").text("off");
            $(this).removeClass("on");
            removeCss();
        }else{
            $(this).find("span").text("on");
            $(this).addClass("on");
            appendCss();
        }
	});

    function appendCss() {
        // append CSS
        var css = 'body {background-color: #222;color: #d8d8d8;}h1, h2, h3 {color: #fff;}#header, #footer {background-color: #2c2c2c;}#jumbo {color: #d8d8d8;background-color: #222;}a, a:link, a:visited {color: #fff;}a:hover, a:active,article.index h3 > a:hover {color: #d0d0d0;}#breadcrumbs,article.index {border-color: #444;}.column-header {border-bottom-color: #ff0;color: #fff;}.full-overlay {background-color: #222 !important;color: #d8d8d8;}',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        style.id = 'darkmode-switch-css';
        if (style.styleSheet){
            // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        }else{
            style.appendChild(document.createTextNode(css));
        }
    }
    function removeCss() {
        $("#darkmode-switch-css").remove();
    }
})();
