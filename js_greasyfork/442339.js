// ==UserScript==
// @name                 x2y2 Auto Dark Mode
// @name:zh-CN           x2y2 自动切换深色模式
// @namespace            http://tampermonkey.net/
// @version              0.1
// @description          Turn on/off dark mode automatically in x2y2.io based on the color scheme of OS.
// @description:zh-CN    根据系统配色自动开启/关闭 x2y2 的深色模式
// @author               cylll
// @match                *://*.x2y2.io/*
// @match                *://x2y2.io/*
// @icon                 https://x2y2.io/favicon.ico
// @grant                none
// @downloadURL https://update.greasyfork.org/scripts/442339/x2y2%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/442339/x2y2%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    "use strict";


    window
        .matchMedia("(prefers-color-scheme: light)")
        .addEventListener("change", (e) => {
        if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
        if (
            document.documentElement.style["cssText"] ===
            "--chakra-ui-color-mode: dark;"
        ) {
            document
                .getElementsByClassName("chakra-button text-gray-500 css-10c9co2")[1]
                .click();
        }
    } else {
        if (
            document.documentElement.style["cssText"] ===
            "--chakra-ui-color-mode: light;"
        ) {
            document
                .getElementsByClassName("chakra-button text-gray-500 css-10c9co2")[1]
                .click();
        }
    }
    });




    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
        if (
            document.documentElement.style["cssText"] ===
            "--chakra-ui-color-mode: dark;"
        ) {
            document
                .getElementsByClassName("chakra-button text-gray-500 css-10c9co2")[1]
                .click();
        }
    } else {
        if (
            document.documentElement.style["cssText"] ===
            "--chakra-ui-color-mode: light;"
        ) {
            document
                .getElementsByClassName("chakra-button text-gray-500 css-10c9co2")[1]
                .click();
        }
    }


})();
