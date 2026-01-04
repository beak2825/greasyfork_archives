// ==UserScript==
// @name                 V2EX Auto Dark Mode
// @name:zh-CN           V2EX 自动切换深色模式
// @namespace            http://tampermonkey.net/
// @version              0.2
// @description          Turn on/off dark mode automatically in v2ex.com based on the color scheme of OS.
// @description:zh-CN    根据系统配色自动开启/关闭 v2ex.com 的深色模式
// @author               Jiachen Chen
// @match                *://*.v2ex.com/*
// @match                *://v2ex.com/*
// @icon                 https://www.google.com/s2/favicons?domain=v2ex.com
// @grant                none
// @downloadURL https://update.greasyfork.org/scripts/424320/V2EX%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/424320/V2EX%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const toggleLink = document
        .querySelector(".light-toggle")
        .getAttribute("href");

    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
        if (SITE_NIGHT) {
            window.location.replace(toggleLink);
        }
    }

    window
        .matchMedia("(prefers-color-scheme: light)")
        .addEventListener("change", (e) => {
            if (SITE_NIGHT) {
                window.location.replace(toggleLink);
            }
        });

    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        if (SITE_NIGHT === 0) {
            window.location.replace(toggleLink);
        }
    }

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
            if (SITE_NIGHT === 0) {
                window.location.replace(toggleLink);
            }
        });
})();
