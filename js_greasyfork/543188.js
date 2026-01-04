// ==UserScript==
// @name         NTS.live Volume Adjust
// @namespace    https://raw.githubusercontent.com/Inevitabby/nts-volume-adjust/refs/heads/main/nts-volume-adjust.user.js
// @version      1.1
// @description  Adjust volume of music on NTS.live.
// @author       Inevitabby
// @match        https://www.nts.live/*
// @match        https://*.mixcloud.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543188/NTSlive%20Volume%20Adjust.user.js
// @updateURL https://update.greasyfork.org/scripts/543188/NTSlive%20Volume%20Adjust.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const VOLUME = 0.1;

    if (location.hostname.includes("mixcloud.com") && !location.href.includes("NTSRadio")) return;

    const observer = new MutationObserver(() => {
        document.querySelectorAll("audio").forEach(audio => {
            audio.volume = VOLUME;
            audio.onvolumechange = () => audio.volume = VOLUME;
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
