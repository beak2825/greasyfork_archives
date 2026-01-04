// ==UserScript==
// @name         twitchAdSkip
// @namespace    https://www.twitch.tv/
// @version      1.0
// @description  Bezos is already too rich;i didn't make this
// @author       SimpleHacker
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416024/twitchAdSkip.user.js
// @updateURL https://update.greasyfork.org/scripts/416024/twitchAdSkip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {

        const dblclick = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        let options = {
            childList: true,
            subtree: true
        };

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    let ad = node.querySelector('[data-test-selector="ad-banner-default-text"]');
                    if (ad) {
                        let resetButton = document.querySelector('[data-a-target="ffz-player-reset-button"]');

                        if (resetButton) {
                            resetButton.dispatchEvent(dblclick);
                        } else {
                            window.location.reload();
                        }
                    }
                });
            });
        });

        const target = document.querySelector('[data-a-target="video-player"]');

        observer.observe(target, options);
    }

})();