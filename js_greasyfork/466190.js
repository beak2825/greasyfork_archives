// ==UserScript==
// @name         autolike-lzcirc
// @namespace    https://github.com/dimfu/userscript-autolike-lzcirc
// @version      0.1.0
// @description  Instant like every Adam LZ circle friends Youtube videos
// @author       dimfu
// @license      MIT
// @downloadurl  https://github.com/dimfu/userscript-autolike-lzcirc/raw/main/index.js
// @updateurl    https://github.com/dimfu/userscript-autolike-lzcirc/raw/main/index.js
// @match        http://*.youtube.com/*
// @match        https://*.youtube.com/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/466190/autolike-lzcirc.user.js
// @updateURL https://update.greasyfork.org/scripts/466190/autolike-lzcirc.meta.js
// ==/UserScript==

/* globals $, GM_config */

(function () {
    "use strict";

    let watcher = null;
    let likeSelector = "#segmented-like-button button";
    let channelIdSelector = "a.yt-simple-endpoint.style-scope.ytd-video-owner-renderer";
    let subscribeSelector = "#subscribe-button > ytd-subscribe-button-renderer";

    GM_config.init({
        id: "config",
        title: GM_info.script.name + " Settings",
        fields: {
            CIRCLE_MEMBERS: {
                label: "Circle Members",
                type: "array",
                default: [
                    "AdamLZ",
                    "JimmyOakes",
                    "ColleteDavis",
                    "RicerMiata",
                    "tjhunt_",
                    "instaagrantt",
                    "illiminate",
                    "diiviinemedia",
                    "tommyfyeah",
                    "SAMMIT",
                    "Taylordrifts",
                    "RKTUNES",
                    "driftgames_life",
                    "lukefink",
                    "LeeBirdRB",
                ],
            },
        },
    });

    GM_registerMenuCommand("Settings", () => {
        GM_config.open();
    });

    function isSubscribed() {
        const btn = document.querySelector(subscribeSelector);
        const subscribed = btn.hasAttribute("subscribe-button-hidden");
        return subscribed;
    }

    function isLiked() {
        const btn = document.querySelector(likeSelector);
        return btn ? btn.getAttribute("aria-pressed") == "true" : false;
    }

    function isInCircle() {
        const channelId = document.querySelector(channelIdSelector).getAttribute("href");
        const popFromLink = channelId.split("/").pop().slice(1);
        return GM_config.get("CIRCLE_MEMBERS").includes(popFromLink);
    }

    function like() {
        if (!isSubscribed()) return false;
        const btn = document.querySelector(likeSelector);
        if (!isLiked()) {
            btn.click();
            return true;
        }
        return false;
    }

    function startWatcher() {
        if (watcher === null) {
            watcher = setInterval(() => {
                if (isInCircle() && like()) {
                    clearInterval(watcher);
                    watcher = null;
                }
            }, 1000);
        }
    }

    window.addEventListener("yt-navigate-finish", startWatcher, true);
})();