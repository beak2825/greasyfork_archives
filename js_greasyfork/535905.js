// ==UserScript==
// @name         Offerup Highlight then Remove Ads
// @namespace    https://openuserjs.org/users/hopkir
// @version      0.1
// @description  Remove annoyances from Offerup Website
// @author       Eyes`Only
// @copyright    2025, Eyes`Only
// @match        https://*.offerup.com/*
// @grant        none
// @run-at       document-idle
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/535905/Offerup%20Highlight%20then%20Remove%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/535905/Offerup%20Highlight%20then%20Remove%20Ads.meta.js
// ==/UserScript==

/* global $ */

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function () {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function main() {
    $(document).ready(function () {
        function runme() {
            console.log("Highlighting Ads");
            $('[aria-label*="Ad"]').each(function () {
                console.log("Removing this Element: ", this);
            });
            $('[aria-label*="Ad"]').css({
                "background": "#F00",
                "border-color": "red",
                "border-width": "5px",
                "border-style": "solid"
            });
            setTimeout(thenrunme, 1000);
        }

        function thenrunme() {
            console.log("Hiding Ads");
            $('[aria-label*="Ad"]').hide();
        }


        console.log("Setting Interval");
        setInterval(runme, 4050);
    });
}

addJQuery(main);