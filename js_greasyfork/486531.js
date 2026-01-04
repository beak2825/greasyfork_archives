// ==UserScript==
// @name         Micropolis darkmode
// @name:de      Micropolis DarkMode
// @description  This script adds a switch to toggle between the standard light design and a dark "dark mode" user interface for low light situations
// @description:de Dieses Skript fügt einen Schalter zu Micropolis.com hinzu, mit dem das Design der Seite von hell zu einem dunklen Dark-Mode Modus umgeschaltet werden kann.
// @namespace    https://www.micropolis.com/#micropolis-darkmode
// @homepageURL  https://www.micropolis.com/
// @version      0.10
// @author       Code City
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://www.micropolis.com/*
// @icon         https://www.google.com/s2/favicons?domain=micropolis.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/486531/Micropolis%20darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/486531/Micropolis%20darkmode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // console.log("works");

    appendCss();

    function appendCss() {
        // append CSS
        var css = 'section.support {background-color: #000;}h1, h2, h3, h4, h5, h6{color:#eee;}a{color: #8faaf9;}body {color:#eee;}table.zebra tr:hover{background-color: #888 !important;}sub li{border-right: 1px solid #000;}font{color:#fff !important;}section.support img {-webkit-filter: invert(1); filter: invert(1);}',
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