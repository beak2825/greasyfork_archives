// ==UserScript==
// @name         YouTube shorts seek forward/backward shortcut
// @namespace    https://greasyfork.org/en/users/954974-crill0
// @version      0.3
// @description  Adds seek forward/backward shortcut buttons to shorts similair to how the default video player works. Additionaly also adds a shortcut to open the short in the default player.
// @author       Crill0
// @license      MIT
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458363/YouTube%20shorts%20seek%20forwardbackward%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/458363/YouTube%20shorts%20seek%20forwardbackward%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* Settings */
    const OPEN_SHORT_KEY = "o";
    const OPEN_SHORT_NEW_TAB = true;
    const FORWARD_KEY = "ArrowRight";
    const BACKWARD_KEY = "ArrowLeft";
    const SECONDS_TO_SEEK = 5;
    /* End Settings */

    waitForElm("#shorts-player").then((ytPlayer) => {
        const actions = {
            [OPEN_SHORT_KEY]: () => {ytPlayer.pauseVideo(); window.open(ytPlayer.getVideoUrl(), OPEN_SHORT_NEW_TAB ? '_blank' : '_top');},
            [FORWARD_KEY]: () => ytPlayer.seekBy(SECONDS_TO_SEEK),
            [BACKWARD_KEY]: () => ytPlayer.seekBy(-SECONDS_TO_SEEK)
        }

        const keysPressed = new Set();
        addEventListener("keydown", e => {
            const key = e.key;
            if (!ytPlayer.getVideoData().isListed // not on shorts page
                || e.target.nodeName == "INPUT" || e.target.id == "contenteditable-root" // target is input box
                || !actions[key] || keysPressed.has(key)) return;
            actions[key]();
            keysPressed.add(key);
        });
        addEventListener("keyup", e => keysPressed.delete(e.key));
        addEventListener("visibilitychange",() => keysPressed.clear()); // prevents keys not being removed when new tab is opened while key down
    });

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
})();