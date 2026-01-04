// ==UserScript==
// @name         Youtube Cleaner Video Player
// @namespace    https://gitlab.com/Dwyriel
// @version      1.4.1
// @description  Removes any overlay youtube might put on top of the video player that isn't important, like the branding watermark or product ads from the channel, for slightly better video visibility.
// @author       Dwyriel
// @license      MIT
// @match        *://*.youtube.com/*
// @grant        none
// @homepageURL  https://gitlab.com/Dwyriel/Greasyfork-Scripts
// @downloadURL https://update.greasyfork.org/scripts/464709/Youtube%20Cleaner%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/464709/Youtube%20Cleaner%20Video%20Player.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const userscriptName = "[Youtube Cleaner Video Player]";
    const callback = () => {
        document.getElementsByClassName("branding-img")[0]?.remove(); //removes the image inside the button, making the button have a size of 0x0, keeping its functionality to avoid errors but essentially removing it.
        let productAds = document.getElementsByClassName("ytp-featured-product-container");
        for (let pruductEle of productAds) { //remove product ads that show mid video
            pruductEle.parentElement.parentElement.remove();
            console.log(`${userscriptName} Removed element with class: ytp-featured-product-container`);
        }
    };
    const config = { attributes: true, childList: true, subtree: true };
    new MutationObserver(callback).observe(document.body, config);
})();