// ==UserScript==
// @name         Twitch Sidebar Hover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Channel sidebar will expand when hovered over and collapsed when the mouse exits
// @author       You
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446805/Twitch%20Sidebar%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/446805/Twitch%20Sidebar%20Hover.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function() {
    'use strict';
    const sideNav = document.querySelector(".side-nav");
    const expandBtn = document.querySelector("button[data-a-target='side-nav-arrow']");
    sideNav.onmouseenter = e => {
        if (sideNav.classList.contains("side-nav--collapsed")) {
            expandBtn.click();
        }
    };
    sideNav.onmouseleave = e => {
        if (sideNav.classList.contains("side-nav--expanded")) {
            expandBtn.click();
        }
    };
})();