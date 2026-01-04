// ==UserScript==
// @name         YouTube Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Block YouTube ads effectively
// @author       Patrick
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/526852/YouTube%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/526852/YouTube%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    // Patches the ads for cold loading
    var ytInitialPlayerResponse = null;

    function getter() {
        return ytInitialPlayerResponse;
    }

    function setter(data) {
        ytInitialPlayerResponse = { ...data, adPlacements: [] };
    }

    if (window.ytInitialPlayerResponse) {
        Object.defineProperty(window.ytInitialPlayerResponse, 'adPlacements', {
            get: () => [],
            set: (a) => undefined,
            configurable: true
        });
    } else {
        Object.defineProperty(window, 'ytInitialPlayerResponse', {
            get: getter,
            set: setter,
            configurable: true
        });
    }

    // FETCH POLYFILL
    (function() {
        const { fetch: origFetch } = window;
        window.fetch = async (...args) => {
            const response = await origFetch(...args);

            if (response.url.includes('/youtubei/v1/player')) {
                const text = () =>
                    response
                        .clone()
                        .text()
                        .then((data) => data.replace(/adPlacements/, 'odPlacement'));

                response.text = text;
                return response;
            }
            return response;
        };
    })();

    // OTHER STUFF - just in case an ad gets through
    (function() {
        window.autoClick = setInterval(function() {
            try {
                const btn = document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button');
                if (btn) {
                    btn.click();
                }
                const ad = document.querySelector('.ad-showing');
                if (ad) {
                    document.querySelector('video').playbackRate = 10;
                }
            } catch (ex) {}
        }, 100);

        window.inlineAdsInterval = setInterval(function() {
            try {
                const div = document.querySelector('#player-ads');
                if (div) {
                    div.parentNode.removeChild(div);
                }
            } catch (ex) {}
        }, 500);
    })();
})();