// ==UserScript==
// @name         AntiAnnoyingYTFunctions
// @namespace    https://github.com/RedCommander735
// @version      1.2
// @description  Changes YT-Mix-Playlist to only point to the video shown on the thumbnail.
// @author       RedCommander735
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @match        *.youtube.com/*
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/444265/AntiAnnoyingYTFunctions.user.js
// @updateURL https://update.greasyfork.org/scripts/444265/AntiAnnoyingYTFunctions.meta.js
// ==/UserScript==

(() => {
    "use strict";
    //download button
//    var downloadButton = setInterval(function() {
//        if (document.getElementsByTagName("ytd-download-button-renderer").length) {
//            //console.log("DB exists!");
//            document.getElementsByTagName("ytd-download-button-renderer")[0].remove();
//            clearInterval(downloadButton);
//        }
//    }, 100); // check every 100ms
    //mix playlists
    setInterval(function() {
        if (document.getElementsByTagName("ytd-thumbnail-overlay-bottom-panel-renderer").length) {
            //console.log("MP exists!");
            let list = document.getElementsByTagName("ytd-thumbnail-overlay-bottom-panel-renderer")[0].parentElement.parentElement
            let url = list.href.split('&list=')[0]
            list.href = url
        }
    }, 1000); // check every 1s
})();