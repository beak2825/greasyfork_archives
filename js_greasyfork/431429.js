// ==UserScript==
// @name               Twitch - Auto Theatre
// @name:zh-TW         Twitch - 自動劇院模式
// @namespace          http://tampermonkey.net/
// @version            2024.5.0
// @description        Automatically click theatre mode button
// @description:zh-tw  進入頁面自動啟動劇院模式
// @author             Long
// @match              https://www.twitch.tv/*
// @icon               https://www.google.com/s2/favicons?domain=twitch.tv
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/431429/Twitch%20-%20Auto%20Theatre.user.js
// @updateURL https://update.greasyfork.org/scripts/431429/Twitch%20-%20Auto%20Theatre.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const ignorePathNames = [
        '/directory',
    ]
    const isPathIgnored = (pathname) => ignorePathNames.some(ignoredPath => pathname.startsWith(ignoredPath));

    const stopAutoTheatreInterval = () => {
        if (!window.autoTheatreInterval) return;
        clearInterval(window.autoTheatreInterval);
        window.autoTheatreInterval = null;
    }

    const autoTheatre = () => {
        let retry = 300;
        window.autoTheatreInterval = setInterval(function () {
            console.log("[Twitch-Auto-Theatre] try to enable theatre-mode...");
            if (!retry) {
                stopAutoTheatreInterval();
                console.warn("[Twitch-Auto-Theatre] theatre-mode-button not found.");
                return;
            }

            const $persistentPlayer = document.querySelector(".persistent-player");
            if (!$persistentPlayer) {
                console.warn("[Twitch-Auto-Theatre] .persistent-player not found.");
                retry--;
                return;
            }

            const isEnabled = $persistentPlayer.classList.contains("persistent-player--theatre");
            if (isEnabled) {
                stopAutoTheatreInterval();
                console.log("[Twitch-Auto-Theatre] theatre-mode enabled.");
                return;
            }

            const $theatreModeButton = document.querySelector('[aria-label*="alt+t"]');
            if ($theatreModeButton) {
                $theatreModeButton.click();
                console.log("[Twitch-Auto-Theatre] theatre-mode-button clicked.");
            }
            retry--;
        }, 500);
    }

    const handlePageLoaded = (pathname) => {
        if (isPathIgnored(pathname)) return;
        autoTheatre();
    }

    const handlePageChanged = () => {
        window.navigation.addEventListener("navigate", (event) => {
            stopAutoTheatreInterval();

            const url = new URL(event.destination.url);
            handlePageLoaded(url.pathname);
        });
    }

    const main = () => {
        handlePageLoaded(location.pathname);
        handlePageChanged();
    }
    main();
})();
