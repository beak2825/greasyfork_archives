// ==UserScript==
// @name         Youtube - Remove Home, Shorts, Live and Store buttons from the channel page menu
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Remove unwanted or unused buttons from the channel page menu
// @author       Jens Nordström
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454321/Youtube%20-%20Remove%20Home%2C%20Shorts%2C%20Live%20and%20Store%20buttons%20from%20the%20channel%20page%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/454321/Youtube%20-%20Remove%20Home%2C%20Shorts%2C%20Live%20and%20Store%20buttons%20from%20the%20channel%20page%20menu.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function init(target) {

        // Start interval to find elements on navigation
        var runInterval = setInterval(removeButtons, 0);

        function removeButtons() {

            // Find and remove buttons
            for (var i = 0; i < target.length; i++) {
                if (target[i].children[0] != null) {
                    var buttonText = target[i].children[0].innerText;
                    if (buttonText === "HOME" || buttonText === "SHORTS" || buttonText === "LIVE" || buttonText === "STORE") {
                        target[i].remove();
                    }
                }
            }
        }

        // Stop the interval after init or left mouse click
        setTimeout(() => {
            clearInterval(runInterval);
        }, "5000")
    }

    // Wait for DOM to find elements
    function waitForDOM(selector) {
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

    // Target element mapping
    waitForDOM('tp-yt-paper-tab').then((target) => {
        var element = document.querySelectorAll("tp-yt-paper-tab");
        var isMouseDown = false;

        init(element);

        // Detect left mouse click to run interval on navigation
        document.addEventListener('mousedown', function(event) {
            if (event.which) isMouseDown = true;
            init(element);
        }, true);
    });

    // Credit to @Schuwi (Inactive user)
    // Link to unmodified script: https://greasyfork.org/en/discussions/requests/56798-request-make-videoes-the-default-tab-on-youtube-channels#comment-170000
    (() => {
        // const RX_CHANNEL_HOME = /^(https?:\/\/www\.youtube\.com)(\/(user|channel|c)\/[^/]+)(\/?$|\/featured)/;
        const RX_CHANNEL_HOME = /^(https?:\/\/www\.youtube\.com)((\/(@\\?.*))|\/(user|channel|c)\/[^\/]+(\/?$|\/featured))/;
        const DEFAULT_TAB_HREF = "/videos";
        // the byte/ascii sequence '0x12 0x06 v i d e o s' encoded with base64 and uri component encoding seems to correspond to the videos tab
        const DEFAULT_TAB_ENDPOINT_PARAMS = encodeURIComponent(btoa(String.fromCharCode(0x12, 0x06) + "videos"));

        if (RX_CHANNEL_HOME.test(location.href) && String(location.href).indexOf(DEFAULT_TAB_HREF) === -1) {
            // this will get invoked when a youtube channel link is reached from a non-youtube origin page
            // where we didn't rewrite the link
            location.href = RegExp.$2 + DEFAULT_TAB_HREF;
            return;
        }

        addEventListener('mousedown', event => {
            const a = event.target.closest('a');

            if (a && RX_CHANNEL_HOME.test(a.href)) {
                // a channel link was clicked so it has to be rewritten before the actual navigation happens

                // this makes sure the redirect above in line 15-20 is not needed as long as the link clicked is on a youtube page
                // e.g. when opening a channel link in a new tab
                a.href = RegExp.$2 + DEFAULT_TAB_HREF;

                // without this the url in the browsers navigation bar will show the wrong url but the videos tab is still being loaded
                try {
                    a.data.commandMetadata.webCommandMetadata.url = RegExp.$2 + DEFAULT_TAB_HREF;
                } catch (e) {}

                // this makes sure that the videos tab is the one actually being loaded
                try {
                    a.data.browseEndpoint.params = DEFAULT_TAB_ENDPOINT_PARAMS;
                } catch (e) {}
            }
        }, true);
    })();
})();