// ==UserScript==
// @name         SIGΣA STylE YouTube
// @namespace    https://www.youtube.com/@M_12_JS
// @version      1
// @description  Without RAINBOM LBGT :D
// @author       @M_12_JS
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482485/SIG%CE%A3A%20STylE%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/482485/SIG%CE%A3A%20STylE%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = `
    .animated-action__background.lottie-component > svg, #subscribe-button > ytd-subscribe-button-renderer > yt-smartimation > div > __slot-el > yt-animated-action > div.animated-action__lottie.undefined > lottie-component > svg, #top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button > div.yt-spec-button-shape-next__icon > yt-icon > yt-animated-icon > ytd-lottie-player > lottie-component > svg > g > g:nth-child(1) {
        display: none !important;
    }

    #top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > like-button-view-model > toggle-button-view-model > button > div.yt-spec-button-shape-next__icon > yt-icon > yt-animated-icon > ytd-lottie-player > lottie-component > svg > g > g > g > path {
        fill: black !important;
        stroke: black !important;
    }
.smartimation__background { display: none !important; }
.smartimation__border { display: none !important; }
    `;

    document.head.appendChild(style);
})();