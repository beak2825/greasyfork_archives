// ==UserScript==
// @name         G/O UnSlideshow
// @version      1.0
// @description  Remove slideshows from Kinja sites and show them inline instead
// @author       T h e n o n y m o u s
// @match        https://kotaku.com/*
// @match        https://gizmodo.com/*
// @match        https://lifehacker.com/*
// @match        https://jalopnik.com/*
// @match        https://avclub.com/*
// @match        https://deadspin.com/*
// @match        https://theroot.com/*
// @match        https://thetakeout.com/*
// @match        https://theinventory.com/*
// @match        https://jezebel.com/*
// @match        https://theonion.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=g-omedia.com
// @grant        none
// @namespace https://greasyfork.org/users/924302
// @downloadURL https://update.greasyfork.org/scripts/446326/GO%20UnSlideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/446326/GO%20UnSlideshow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let head = document.getElementsByTagName('head')[0];
    if (head) {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
.js_slide, #js_slideshow-comments-button { display: block !important; }
[id^="js_slideshow-"], #js_slideshow-navigation { display: none !important; }
`;
        head.appendChild(style);
    }
    Array.from(document.querySelectorAll(".js_slide img")).filter((x) => x.getAttribute("data-srcset")).forEach((x) => x.setAttribute("srcset", x.getAttribute("data-srcset")));
})();