// ==UserScript==
// @name         site youtube - Fixed Player + Player Bottom Progress
// @namespace    http://greasyfork.org
// @version      2024.07.16
// @license MIT
// @description  fix the player at the top on scrolling and move the progress bar to the bottom of the player
// @author       hg42
// @match        *://*.youtube.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant        GM_addStyle
// @run-at 	     document-end
// @downloadURL https://update.greasyfork.org/scripts/500869/site%20youtube%20-%20Fixed%20Player%20%2B%20Player%20Bottom%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/500869/site%20youtube%20-%20Fixed%20Player%20%2B%20Player%20Bottom%20Progress.meta.js
// ==/UserScript==

function stylePlayer() {
    console.log("-------------------- stylePlayer");
    var player = document.querySelector(".video-stream");
    var container = document.querySelector("#player-container");
    var movie = document.querySelector("#movie_player");
    //container.addEventListener("resize", stylePlayer);
    // empty console.log("movie     w,h = " + movie.style.width + "," + movie.style.height);
    // empty console.log("container w,h = " + container.style.width + "," + container.style.height);
    //console.log("    width: " + player.style.width + ";");
    //console.log("    height: calc(" + player.style.height + " + 50px);");
    var width = player.style.width;
    var height = player.style.height;
    console.log("player    w,h = " + width + "," + height);
    var userStyles = ""
    + "#content #player #player-container"
    + "{"
    + "    position: fixed;"
    + "    top: calc(2px + var(--ytd-toolbar-offset));" // 57px
    //+ "    left: 2px;"
    + "    z-index: 2000;"
    //+ "    border: solid 1px yellow;"
    + "}"
    + "#content #player .video-stream"
    + "{"
    + "    width: " + width + ";"
    + "    height: " + height + ";"
    + "}"
    + "#content #player #movie_player"
    //+ "#content #player #player-container"
    + "{"
    + "    width: " + width + ";"
    + "    height: " + height + ";"
    + "}"
    + "#content #player-theater-container .video-stream"
    + "{"
    + "    width: " + width + ";"
    + "    height: " + height + ";"
    + "}"
    + "#content #player-theater-container #movie_player,"
    + "#content #player-theater-container #player-container"
    + "{"
    + "    width: " + width + ";"
    + "    height: " + height + ";"
    //+ "    margin-bottom: 36px;"
    + "}"
    + "#content .ytp-chrome-bottom"
    + "{"
    //+ "    bottom: -36px;"
    + "    background: rgba(0, 0, 0, 0.5)"
    + "}"
    // progress at bottom
    + "#content .ytp-progress-bar-container,"
    + "#content .ytp-big-mode .ytp-progress-bar-container {"
    + "    position: absolute;"
    + "    bottom: 2px;"
    + "}"
    + "#content .ytp-gradient-bottom {"
    + "    display: none;"
    + "}"
    + "#content .ytp-chrome-bottom,"
    + "#content .ytp-autohide .ytp-chrome-bottom {"
    + "    text-shadow: 0 0 0 black;"
    + "    padding-bottom: 13px;"
    + "}"
    + "#content .ytp-svg-shadow {"
    + "    stroke: #000;"
    + "    stroke-opacity: 0.5;"
    + "    stroke-width: 3px;"
    + "    fill: none;"
    + "}"
    ;
    GM_addStyle(userStyles);
    //movie.style.width = container.style.width;
    //movie.style.height = container.style.height;
    window.setTimeout(stylePlayer, 5000);
}

function styleContent() {
    var userStyles = ""
    ;
    GM_addStyle(userStyles);
}

function styleInit() {
    var player = document.querySelector(".html5-main-video");
    console.log("-------------------- styleInit", player);
    if(!player) {
        window.setTimeout(styleInit, 1000);
        return;
    }
    player.addEventListener("resize", function() {
        console.log("resize");
        window.setTimeout(stylePlayer, 100);
    });
    player.addEventListener("playing", function() {
        console.log("playing");
        window.setTimeout(stylePlayer, 0);
    });
}

(function() {
    'use strict';

    window.setTimeout(styleInit, 3000);

})();
