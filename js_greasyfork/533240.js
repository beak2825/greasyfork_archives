// ==UserScript==
// @name         Mobile View in Desktop for STV
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Optimize mobile layout for sangtacviet
// @author       You
// @license      MIT
// @match        *://sangtacviet.com/truyen/*
// @match        *://sangtacviet.vip/truyen/*
// @match        *://sangtacviet.app/truyen/*
// @icon         https://i.ibb.co/RkDmY1Rw/file.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533240/Mobile%20View%20in%20Desktop%20for%20STV.user.js
// @updateURL https://update.greasyfork.org/scripts/533240/Mobile%20View%20in%20Desktop%20for%20STV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setCSS(selector, property, value) {
        document.querySelectorAll(selector).forEach(el => {
            el.style.setProperty(property, value, 'important');
        });
    }

    setCSS("#tm-top-nav", "background-color", "#212121");
    setCSS(".bg-light", "background-color", "#212121");
    setCSS("#full", "background-color", "#171717");
    setCSS("#content-container", "max-width", "600px");
    setCSS("#content-container .contentbox", "background-color", "#212121");

})();