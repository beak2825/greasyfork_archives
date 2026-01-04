// ==UserScript==
// @name            ExHentai | Fix Images
// @namespace       http://tampermonkey.net/
// @version         1.1.0
// @description     Fix wrong images url on exhentai website
// @author          extra.lewd
// @match           https://exhentai.org/*
// @exclude         https://exhentai.org/g/*
// @exclude         https://exhentai.org/s/*
// @icon            https://exhentai.org/favicon.ico
// @run-at          document-end
// @license         CC BY-NC-ND 4.0
// @license-url     https://creativecommons.org/licenses/by-nc-nd/4.0/
// @homepage        https://discord.gg/TcWrM6pXWD
// @homepageURL     https://discord.gg/TcWrM6pXWD
// @website         https://discord.gg/TcWrM6pXWD
// @source          https://discord.gg/TcWrM6pXWD
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      safari
// @compatible      edge
// @downloadURL https://update.greasyfork.org/scripts/506695/ExHentai%20%7C%20Fix%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/506695/ExHentai%20%7C%20Fix%20Images.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // thx to devs, best site ever! (no sarcasm, rly!)
    fix();
    const observer = new MutationObserver(fix);
    observer.observe(document.querySelector("body"), {
        childList: true,
        subtree: true,
        attributes: true,
    });
    function fix() {
        const images1 = document.querySelectorAll("img[src*='https://s.exhentai.org/']") || [];
        const images2 = document.querySelectorAll("img[data-src*='https://s.exhentai.org/']") || [];
        for (const image of [...images2, ...images1]) {
            const src = (image.getAttribute("data-src") || image.getAttribute("src")).replace("s.exhentai.org", "ehgt.org");
            image.setAttribute("src", src);
            image.setAttribute("data-src", src);
        }
    }
})();
