// ==UserScript==
// @name         Kemono Auto-load Previews
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Clicks all the images for you! This will make high resolution images load and gifs play!
// @author       PowfuArras // Discord: @xskt
// @match        *://kemono.party/*
// @match        *://kemono.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.party
// @grant        none
// @run-at       document-start
// @license      FLORRIM DEVELOPER GROUP LICENSE (https://github.com/Florrim/license/blob/main/LICENSE.md)
// @downloadURL https://update.greasyfork.org/scripts/472646/Kemono%20Auto-load%20Previews.user.js
// @updateURL https://update.greasyfork.org/scripts/472646/Kemono%20Auto-load%20Previews.meta.js
// ==/UserScript==

(function() {
    "use strict";
    window.addEventListener("load", function () {
        [...document.querySelectorAll(".post__thumbnail")].forEach((o, i) => setTimeout(function () {
            if ([...o.children[0].children[0].classList].includes("image-link")) {
                o.children[0].children[0].children[0].click();
            }
        }, i * 800));
    });
})();