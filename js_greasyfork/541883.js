// ==UserScript==
// @name         Microsoft Teams Anti-AFK (Keepalive Mouse)
// @namespace    https://greasyfork.org/en/scripts/541883-microsoft-teams-anti-afk-keepalive-mouse
// @version      1.1
// @description  Simulates mouse movement to prevent AFK status in Microsoft Teams for Web.
// @author       LokeYourC3PH
// @match        https://teams.microsoft.com/v2/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://teams.microsoft.com&size=64
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/541883/Microsoft%20Teams%20Anti-AFK%20%28Keepalive%20Mouse%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541883/Microsoft%20Teams%20Anti-AFK%20%28Keepalive%20Mouse%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const intervalMs = 60000;
    const movePixels = 1;

    let direction = 1;

    setInterval(() => {
        const evt = new MouseEvent("mousemove", {
            bubbles: true,
            cancelable: true,
            clientX: 100 + movePixels * direction,
            clientY: 100 + movePixels * direction
        });

        direction *= -1;

        const target = document.querySelector("body") || document.documentElement;
        if (target) {
            target.dispatchEvent(evt);
            console.log("Dispatched synthetic mousemove to keep Teams active.");
        }
    }, intervalMs);
})();