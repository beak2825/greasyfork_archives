// ==UserScript==
// @name         Color Themes for 5ch
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       SenY
// @description  Rewrite and use as you like.
// @match        https://*.5ch.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5ch.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470548/Color%20Themes%20for%205ch.user.js
// @updateURL https://update.greasyfork.org/scripts/470548/Color%20Themes%20for%205ch.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* default */
    document.querySelector(":root").style.setProperty('--logo-navy', "#273f74");
    //document.querySelector(":root").style.setProperty('--bg-lightgray', "#f3f3f3");
    //document.querySelector(":root").style.setProperty('--text-black', "#000");
    document.querySelector(":root").style.setProperty('--link-blue', '#1d69bf');
    document.querySelector(":root").style.setProperty('--title-red', '#f23030');
    document.querySelector(":root").style.setProperty('--meta-green', '#248041');
    document.querySelector(":root").style.setProperty('--meta-new-orange', '#e59100');
    document.querySelector(":root").style.setProperty('--line-gray', '#d9d9d9');
    //document.querySelector(":root").style.setProperty('--pop-current-bg-gray', '#f6fdf5');
    //document.querySelector(":root").style.setProperty('--reload-progress-gray', '#e0e0e0');
    document.querySelector(":root").style.setProperty('--threadtitle-fsize', '23px');
    document.querySelector(":root").style.setProperty('--meta-fsize', '12px');
    document.querySelector(":root").style.setProperty('--comment-fsize', '17px');

    /* custom */
    document.querySelector(":root").style.setProperty('--text-black', "#fff");
    document.querySelector(":root").style.setProperty('--bg-lightgray', "#333");
    let s = document.createElement("style");
    let t = '.post_hover { \
        background : #222 !important; \
    }';
    s.innerHTML = t;
    document.querySelector("head").appendChild(s);
    // Your code here...
})();