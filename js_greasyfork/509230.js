// ==UserScript==
// @name              Better YouTube Theater Mode
// @namespace         https://github.com/NightFeather0615
// @version           1.3.7
// @description       Make YouTube's theater mode work like Twitch's one
// @author            NightFeather
// @match             *://www.youtube.com/*
// @icon              https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant             none
// @license           MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/509230/Better%20YouTube%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/509230/Better%20YouTube%20Theater%20Mode.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* jshint -W083 */
/* jshint multistr: true */

/* eslint no-multi-str: 0 */

const waitElement = async (selector) => {
    'use strict';

    while (document.querySelector(selector) === null) {
        await new Promise((resolve, reject) => requestAnimationFrame(resolve));
    }

    return document.querySelector(selector);
};

const asyncSleep = async (ms) => {
    'use strict';

    return new Promise(resolve => setTimeout(resolve, ms));
};

(async function() {
    'use strict';

    let isPlayerSetup = false;

    const trySetupPlayer = async () => {
        let isUrlVaild = window.location.pathname.startsWith("/watch") || window.location.pathname.startsWith("/live");

        if (!isUrlVaild || isPlayerSetup) return;

        isPlayerSetup = true;

        let theaterBtn = await waitElement(".ytp-size-button.ytp-button");

        let mashheadContainer = await waitElement("#masthead-container");
        let pageManager = await waitElement("ytd-page-manager");

        let videoBleedContainer = await waitElement("#full-bleed-container");
        let lastPlayerHeight = -1;

        let moviePlayer = await waitElement("#movie_player");

        console.log(`[YT Better Theater Mode] Video player initialized`);

        const processTheaterMode = async () => {
            await asyncSleep(50);

            let isTheaterView = document.querySelector("#masthead").theater;
            let isFullscreen = moviePlayer.classList.contains("ytp-fullscreen");
            let liveChat = document.querySelector("ytd-live-chat-frame");

            if (isTheaterView && videoBleedContainer.clientHeight > 0 && isUrlVaild) {
                if (videoBleedContainer.clientHeight === lastPlayerHeight) return;

                console.log(`[YT Better Theater Mode] Applying styles`);

                mashheadContainer.hidden = true;

                videoBleedContainer.style.maxHeight = "100vh";
                videoBleedContainer.style.height = "100vh";

                moviePlayer.classList.remove("ytp-hide-info-bar");

                pageManager.style.marginTop = "0px";

                if (liveChat) {
                    liveChat.style.top = "0px";
                    liveChat.style.borderRadius = "0 0 0 0";
                }
            } else {
                if (videoBleedContainer.clientHeight === 0) return;

                console.log(`[YT Better Theater Mode] Resetting styles`);

                mashheadContainer.hidden = false;

                videoBleedContainer.style.maxHeight = "";
                videoBleedContainer.style.height = "";

                if (!isFullscreen) {
                    moviePlayer.classList.add("ytp-hide-info-bar");
                }

                pageManager.style.marginTop = "var(--ytd-masthead-height,var(--ytd-toolbar-height))";

                if (liveChat) {
                    liveChat.style.borderRadius = "12px";
                }
            }

            console.log(`[YT Better Theater Mode] Triggering resize event`);
            let resizeEvent = window.document.createEvent("UIEvents");
            resizeEvent.initUIEvent("resize", true, false, window, 0);
            window.dispatchEvent(resizeEvent);

            lastPlayerHeight = videoBleedContainer.clientHeight;
        }

        console.log(`[YT Better Theater Mode] Setting up theater mode`);

        await processTheaterMode();

        let videoBleedContainerObserver = new ResizeObserver(processTheaterMode);
        videoBleedContainerObserver.observe(videoBleedContainer);

        theaterBtn.onclick = processTheaterMode;
    }

    await trySetupPlayer();
    document.addEventListener("selectionchange", trySetupPlayer);
})();
