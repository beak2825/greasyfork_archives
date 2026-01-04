// ==UserScript==
// @name         Twitch Clip Downloader
// @namespace    cdl
// @version      0.2
// @description  adds a download link to twitch clips
// @author       cc114
// @match        http*://clips.twitch.tv/*
// @exclude      http*://clips.twitch.tv/create
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/420138/Twitch%20Clip%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/420138/Twitch%20Clip%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var link;
    var fail = 0;
    function geturl() {
        console.log('[CDL] searching');
        link = document.querySelector(".video-ref > video").getAttribute("src");
        if (link == null || link == undefined || link == "") {
            console.log('[CDL] waiting');
            if (fail < 5) {
                fail++;
                setTimeout(geturl, 500);
            }
        } else {
            console.log('[CDL] found link: ' + link);
            var div = document.createElement ('div');
            div.innerHTML = '<a href="' + link + '">Download</a>';
            var button = document.querySelectorAll('[data-test-selector="clips-watch-full-button"]')[0];
            button.insertAdjacentElement("afterend",div)
        }
    }
    window.addEventListener('load', () => {
        geturl();
    });
})();
