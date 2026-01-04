// ==UserScript==
// @name         Twitter Uncrop Images
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove the image cropping on the timeline view.
// @author       Cro
// @match        https://*.twitter.com/*
// @match        https://*.x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416102/Twitter%20Uncrop%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/416102/Twitter%20Uncrop%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function()
    {
        for (let node of document.querySelectorAll('div[data-testid="tweetPhoto"], div[data-testid="videoPlayer"]'))
        {
            node.style.marginLeft = "";
            node.style.marginTop = "";
            node.style.marginBottom = "";
            node.style.marginRight = "";
            node.children[0].style.backgroundSize = "contain";
            node.children[0].style.backgroundPosition = "";
        }

        for (let node of document.querySelectorAll('article [class="r-1adg3ll r-13qz1uu"]'))
        {
            node.style.paddingBottom = "100%";
        }

        // Get rid of the rounded corners.
        for (let node of document.querySelectorAll('article .r-1867qdf'))
        {
            node.classList.remove('r-1867qdf');
        }
    }, 500);
})();