// ==UserScript==
// @name         Kinja Unslideshow
// @namespace    https://github.com/AndreasMattsson
// @version      0.2
// @description  Remove slideshows from Kinja sites and show them inline instead
// @author       Andreas Mattsson
// @include      /^https?\:\/\/(.*\/?)jalopnik\.com\/.*$/
// @include      /^https?\:\/\/(.*\/?)avclub\.com\/.*$/
// @include      /^https?\:\/\/(.*\/?)deadspin\.com\/.*$/
// @include      /^https?\:\/\/(.*\/?)gizmodo\.com\/.*$/
// @include      /^https?\:\/\/(.*\/?)jezebel\.com\/.*$/
// @include      /^https?\:\/\/(.*\/?)kotaku\.com\/.*$/
// @include      /^https?\:\/\/(.*\/?)kotaku\.com\.au\/.*$/
// @include      /^https?\:\/\/(.*\/?)kotaku\.co\.uk\/.*$/
// @include      /^https?\:\/\/(.*\/?)lifehacker\.com\/.*$/
// @include      /^https?\:\/\/(.*\/?)theonion\.com\/.*$/
// @include      /^https?\:\/\/(.*\/?)thetakeout\.com\/.*$/
// @include      /^https?\:\/\/(.*\/?)theinventory\.com\/.*$/
// @include      /^https?\:\/\/(.*\/?)theroot\.com\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429465/Kinja%20Unslideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/429465/Kinja%20Unslideshow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let head = document.getElementsByTagName('head')[0];
    if (head) {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
.js_slide { display: block !important; }
[id^="js_slideshow-"], #js_slideshow-navigation { display: none !important; }
`;
        head.appendChild(style);
    }
    Array.from(document.querySelectorAll(".js_slide img")).filter((x) => x.getAttribute("data-srcset")).forEach((x) => x.setAttribute("srcset", x.getAttribute("data-srcset")));
})();