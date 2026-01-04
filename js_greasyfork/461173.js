// ==UserScript==
// @name         1Min Website Rotator
// @namespace    yt.video.rotator
// @version      1.0
// @description  Rotates youtube videos every minute
// @author       stealtosvra
// @match        https://youtube.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/159px-YouTube_full-color_icon_%282017%29.svg.png?20211015074811
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461173/1Min%20Website%20Rotator.user.js
// @updateURL https://update.greasyfork.org/scripts/461173/1Min%20Website%20Rotator.meta.js
// ==/UserScript==

(function() {
    'use strict';
 const ytLinks = [

     /// COPY AND PASTE BELOW , CHANGE URLS
        {
            currentUrl: "https://youtube.com/1",
            redirectUrl: "https://youtube.com/2"
        },

     ///  END OF LOOP
        {
            currentUrl: "https://youtube.com/2",
            redirectUrl: "https://youtube.com/1"
        }
    ];

    function redirectAfterDelay(url) {
        setTimeout(function () {
            window.location.href = url;
        }, 60000);
    }

    const currentUrl = window.location.href;
    const nextLink = ytLinks.find(link => link.currentUrl === currentUrl);

    if (nextLink) {
        redirectAfterDelay(nextLink.redirectUrl);
    }
})();