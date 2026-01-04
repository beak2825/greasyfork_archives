// ==UserScript==
// @name         Twitch Stream Auto-Watch
// @namespace    https://greasyfork.org/en/users/1077259-synthetic
// @version      0.7
// @description  Auto-Watches a stream that is offline on page load, as soon as it goes online.
// @author       @Synthetic
// @license      MIT
// @match        https://www.twitch.tv/*
// @exclude      https://www.twitch.tv/inventory
// @exclude      https://www.twitch.tv/drops/inventory
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @downloadURL https://update.greasyfork.org/scripts/467903/Twitch%20Stream%20Auto-Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/467903/Twitch%20Stream%20Auto-Watch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The current version
    const VERSION = 0.7;

    // Page element selectors
    const STATUS_OFFLINE = 'div.channel-status-info--offline';
    const WATCH_NOW = 'div.channel-status-info--live';

    /**
     * Clicks the Watch link.
     *
     * @return boolean
     */
    const clickWatch = () => {
        if (document.querySelector(WATCH_NOW)) {
            document.querySelector(WATCH_NOW).click();
            return true;
        }
        return false;
    };

    const onMutate = function(mutationsList) {
        const offline = document.querySelectorAll(STATUS_OFFLINE);
        if (offline.length) {
            clearTimeout(timeout);
            if (!waiting) {
                console.log('Stream is offline. Waiting');
                waiting = true;
            }
        }
        const online = document.querySelectorAll(WATCH_NOW);
        if (online.length) {
            console.log('Stream is online');
            if (clickWatch()) {
                observer.disconnect();
                console.log('Watching');
            }
        }
    };

    console.log('Loaded at', new Date());

    var waiting = false;
    var timeout = window.setTimeout(
        () => {
            observer.disconnect();
        },
        10000
    );

    var observer = new MutationObserver(onMutate);
    observer.observe(document.body, { childList: true, subtree: true });

})();