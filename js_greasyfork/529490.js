// ==UserScript==
// @name         Olevod remove ads
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Remove advertisments in olevod.com
// @author       dont-be-evil
// @match        https://www.olevod.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=olevod.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/529490/Olevod%20remove%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/529490/Olevod%20remove%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            const swipers = document.querySelector("div.swiper-wrapper");
            if (swipers) {
                for (let swiper of swipers.children) {
                    if (swiper.hasAttribute("data-swiper-autoplay")) {
                        const img = swiper.querySelector("img");
                        if (img) img.remove();
                    }
                }
            }
            const pc_ads = document.querySelectorAll("div.pc-ads");
            if (pc_ads) {
                for (let pc_ad of pc_ads) pc_ad.remove()
            }
            const pause_ad = document.getElementById("adsMaskBox");
            if (pause_ad) {
                pause_ad.remove();
            }
            const right_side_ads = document.querySelectorAll("#pane-first .img_bg");
            if (right_side_ads) {
                for(let right_side_ad of right_side_ads) {
                    right_side_ad.remove();
                }
            }
        }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true , subtree: true, attributes: true });

})();