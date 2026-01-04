// ==UserScript==
// @name         agar.io Banner Remover
// @namespace    http://tampermonkey.net/
// @version      2024-03-05
// @description  Removes every banner advertisement and allows true fullscreen.
// @author       strawberrys
// @match        https://agar.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agar.io
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489091/agario%20Banner%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/489091/agario%20Banner%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const allBanners = document.querySelectorAll("[id ^= agar-io_]");
    const canvas = document.getElementById("canvas");
    const rootStyle = document.querySelector(":root").style;

    const bottomBannerHeight = rootStyle.removeProperty("--bottom-banner-height");

    allBanners.forEach((element) => element.remove());
    canvas.height += parseInt(bottomBannerHeight);
})();