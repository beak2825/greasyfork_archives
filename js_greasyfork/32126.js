// ==UserScript==
// @name         Fit video on Browser Window
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button at the right of the video title that makes the video take up the entire window space.
// @author       Matías Pierdoménico
// @match        https://www.youtube.com/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/32126/Fit%20video%20on%20Browser%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/32126/Fit%20video%20on%20Browser%20Window.meta.js
// ==/UserScript==

window.addEventListener("spfdone", run);
window.addEventListener("yt-navigate-start", run);

(function() {
    'use strict';

    if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
        run();
    } else {
        document.addEventListener("DOMContentLoaded", function(event) {
            run();
        });
    }
})();

function run() {
    var popupUrl = window.location.href.replace(/watch/, "watch_popup");
    $("#watch-headline-title").append("<div><a href='".concat(popupUrl).concat("'><button id='fill-win-btn'>Fill window</button></a></div>"));
    //css styling
    $("#fill-win-btn").css({
        "color": "#fefefe",
        "background-color": "#e62117",
        "padding": "8px",
        "float":"right",
        "cursor":"pointer"
    });
    $("#watch-headline-title .watch-title-container").css({
        "float":"left"
    });
}