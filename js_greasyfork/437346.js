// ==UserScript==
// @name         Twitch PiP
// @namespace    https://github.com/Yoshiin/userscripts/twitch/
// @version      1.0
// @description  Add a PiP button on Twitch player
// @author       Yoshin
// @license      MIT
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// @copyright    2021, Yoshin
// @homepageURL  https://github.com/Yoshiin/userscripts/
// @downloadURL https://update.greasyfork.org/scripts/437346/Twitch%20PiP.user.js
// @updateURL https://update.greasyfork.org/scripts/437346/Twitch%20PiP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isPiP = false;

    new MutationObserver(function(mutations) {
        const playerControls = document.querySelector('div[data-a-target="player-controls"]');
        if (playerControls) {
            const theatreBtn = document.querySelector('button[data-a-target="player-theatre-mode-button"]').parentNode;
            if (theatreBtn) {
                document.querySelector("video").addEventListener("enterpictureinpicture", () => isPiP = true);
                document.querySelector("video").addEventListener("leavepictureinpicture", () => isPiP = false);

                const pip = theatreBtn.cloneNode(true);

                const pipBtn = pip.querySelector('button[data-a-target="player-theatre-mode-button"]');
                pipBtn.setAttribute('id', "pip-button");
                pipBtn.setAttribute('aria-label', "Picture-in-Picture")
                pipBtn.setAttribute('data-a-target', "player-pip-button");
                pipBtn.addEventListener("click", () => isPiP ? document.exitPictureInPicture() : document.querySelector("video").requestPictureInPicture(), false);

                const tooltip = pip.querySelector('div[data-a-target="tw-tooltip-label"]');
                tooltip.innerHTML = "Picture-in-Picture";

                const svgObj = pip.querySelector('svg');
                svgObj.removeAttribute("viewBox");
                svgObj.setAttribute("viewBox", "0 0 25 25");

                const svgPath = pip.querySelector('path');
                svgPath.removeAttribute("d");
                svgPath.setAttribute("d", "M19 11h-8v6h8v-6zm-2 4h-4v-2h4v2zm4-12H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V4.98C23 3.88 22.1 3 21 3zm0 16.02H3V4.97h18v14.05z");

                theatreBtn.parentNode.insertBefore(pip, theatreBtn.nextSibling);
            }
            this.disconnect();
        }
    }).observe(document, {childList: true, subtree: true});
})();
