// ==UserScript==
// @name         Hide unwanted garbage panels on YouTube
// @namespace    https://www.youtube.com
// @version      0.1
// @description  Hides the unwanted garbage you don't want to see on YouTube
// @author       Zerotic
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459653/Hide%20unwanted%20garbage%20panels%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/459653/Hide%20unwanted%20garbage%20panels%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideShelfRenderer(){ // Hide "For You" and "Previously Watched" sections, and "People also watched" sections
        document.querySelectorAll("ytd-shelf-renderer[class='style-scope ytd-item-section-renderer']").forEach(function(element) {
            element.style.display = "none";
        });
    }

    function hideHorizontalListRenderer(){ // Hide "Shorts" section
        document.querySelectorAll("yt-horizontal-list-renderer").forEach(function(element) {
            element.style.display = "none";
        });
    }

    function hideShortsLogoAndWording(){ // Hide "Shorts" logo and wording above its section
        document.querySelectorAll("svg[viewBox='0 0 24 24'][preserveAspectRatio='xMidYMid meet'][focusable='false'][class='style-scope yt-icon'][style='pointer-events: none; display: block; width: 100%; height: 100%;'] g[width='24'][height='24'][viewBox='0 0 24 24'][class='style-scope yt-icon'] g[class='style-scope yt-icon'] path[d='M17.77,10.32l-1.2-.5L18,9.06a3.74,3.74,0,0,0-3.5-6.62L6,6.94a3.74,3.74,0,0,0,.23,6.74l1.2.49L6,14.93a3.75,3.75,0,0,0,3.5,6.63l8.5-4.5a3.74,3.74,0,0,0-.23-6.74Z'][fill='red'][class='style-scope yt-icon']").forEach(function(element) {
            element.style.display = "none";
        });

        document.querySelectorAll("svg[viewBox='0 0 24 24'][preserveAspectRatio='xMidYMid meet'][focusable='false'][class='style-scope yt-icon'][style='pointer-events: none; display: block; width: 100%; height: 100%;'] g[width='24'][height='24'][viewBox='0 0 24 24'][class='style-scope yt-icon'] g[class='style-scope yt-icon'] polygon[points='10 14.65 15 12 10 9.35 10 14.65'][fill='#fff'][class='style-scope yt-icon']").forEach(function(element) {
            element.style.display = "none";
        });

        document.querySelectorAll("span[id='title'][class='style-scope ytd-reel-shelf-renderer']").forEach(function(element) {
            if (element.innerText === "Shorts") {
                element.style.display = "none";
            }
        });
    }

    function hideGarbage() {
        hideShelfRenderer();
        hideHorizontalListRenderer();
        hideShortsLogoAndWording();
    }

    setInterval(hideGarbage, 250);
})();