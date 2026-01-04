// ==UserScript==
// @name         MediathekSuche darkmode
// @name:de      MediathekSuche DarkMode
// @description  This script adds a switch to toggle between the standard light design and a dark "dark mode" user interface for low light situations
// @description:de Dieses Skript fügt einen Schalter zu MediathekSuche.de hinzu, mit dem das Design der Seite von hell zu einem dunklen Dark-Mode Modus umgeschaltet werden kann. Wenn man MediathekSuche.de so zum Stöbern in den Sender-Mediatheken verwendet, kann es praktisch sein, wenn das Layout dunkel und nicht so hell ist, je nach Umgebungsbeleuchtung.
// @namespace    https://github.com/isync/mediatheksuche-darkmode
// @homepageURL  https://mediatheksuche.de/
// @version      0.10
// @author       isync
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://mediatheksuche.de/*
// @icon         https://www.google.com/s2/favicons?domain=mediatheksuche.de
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/430259/MediathekSuche%20darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/430259/MediathekSuche%20darkmode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("hello");

    $("body").append('<div id="darkmode-switch" data-is="on" style="position:absolute; top:10px; right: 10px; border: 1px solid #ccc; padding: 7px 5px; cursor: pointer;">darkmode: <span>off</span></div>');

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
        var css = 'body{background-color:#333639;color:#dadada}#header{background:#333639;background:linear-gradient(to bottom,#333639 0,#aaa 100%);border-bottom:1px solid #000}div#header-content h1{color:#d0d0d0}input[type=text]::placeholder{color:#999}input[type=password],input[type=text],select,textarea{background:linear-gradient(to bottom,#45484a,#5b5e61);color:#dadada;border:1px solid #ababac;border-bottom:1px solid #888}a{color:#8ab9ff}a:visited{color:#82aff2}.box-1 .box-content{border:1px solid #101d20}.row{border-bottom:1px solid #1f2225}a.vod{border-top:1px solid #1f2225;border-left:1px solid #1f2225;border-right:1px solid #1a2020}.vod-active{border-bottom:1px solid #181d1d!important}a.last{border-bottom:1px solid #181d1d}a.vod .title>strong{color:#d3d3d3}div.vod-details{background-color:#292c2f;background:linear-gradient(180deg,#252525 0,#292c2f 5%,#292c2f 100%)}a.vod:focus,a.vod:hover{color:#82aff2;background-color:#5b5e61}a.vod:active{background-color:#4b4e51}.full-overlay{background-color:#333639}.button-blue{color:#dadada;background:linear-gradient(to bottom,#292c2f,#1f2225)}',
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