// ==UserScript==
// @name         Fix viewport=device
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix viewport to fit width to device width
// @author       innerwilds
// @match        *://surazhspk.narod.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=narod.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458599/Fix%20viewport%3Ddevice.user.js
// @updateURL https://update.greasyfork.org/scripts/458599/Fix%20viewport%3Ddevice.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const tag = document.createElement('meta');

    tag.setAttribute("name", "viewport");
    tag.setAttribute("content", "width=device-width, initial-scale=1");

    if (document.head) {
        document.head.append(tag);
    }
    else {
        document.addEventListener("DOMContentLoaded", () => document.head.append(tag))
    }
})();