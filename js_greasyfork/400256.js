// ==UserScript==
// @name         Youtube Automatic Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically toggle dark/light theme
// @author       kevin.ongko@gmail.com
// @run-at       document-idle
// @match        https://www.youtube.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400256/Youtube%20Automatic%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/400256/Youtube%20Automatic%20Theme.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const getAvatarButton = () => {
        return new Promise((resolve) => {
            const button = document.getElementById("avatar-btn");
            resolve(button);
        });
    };

    const getMenuButton = () => {
        return new Promise((resolve) => {
            const menu = document.getElementsByClassName(
                "style-scope yt-multi-page-menu-section-renderer"
            )[14];
            resolve(menu);
        });
    };

    const renderButton = async () => {
        return new Promise(async (resolve) => {
            let avatar;
            let menu;
            avatar = await getAvatarButton();
            avatar.click();
            setTimeout(async () => {
                menu = await getMenuButton();
                menu.click();
                avatar.click();
                resolve("done");
            }, 2000);
        });
    };

    const toggleTheme = () => {
        if (window.matchMedia) {
            var isDarkMode = document
            .querySelector("paper-toggle-button")
            .hasAttribute("checked");
            if (window.matchMedia("(prefers-color-scheme: light)").matches) {
                if (isDarkMode) document.getElementById("toggleButton").click();
            }
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                if (!isDarkMode) document.getElementById("toggleButton").click();
            }
        }
    };

    const start = () => {
        renderButton().then((res) => {
            toggleTheme();
        });
    };

    start();
})();