// ==UserScript==
// @name         Twitch Add Channel Name To Vod URLs
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds the channel name to undeleted Twitch VODs on load so you know who you were watching when they get deleted
// @author       sneeedums
// @match        *://*.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454272/Twitch%20Add%20Channel%20Name%20To%20Vod%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/454272/Twitch%20Add%20Channel%20Name%20To%20Vod%20URLs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helpers
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

    function addChannelNameToURL() {
        waitForElm(".Layout-sc-nxg1ff-0 .gcwIMz a:has(.tw-title)").then((elm) => {
            let channelLink = elm?.href;
            if(channelLink) {
                console.log(channelLink);
                let nameRegex = /twitch\.tv\/(\w+)/g;
                for (const match of channelLink.matchAll(nameRegex)) {
                    console.log(match);
                    let channelName = match[1];
                    let param = "?channel=" + channelName;
                    if(!window.location.href.includes(channelName)) window.history.replaceState(null, null, param);
                    break;
                }
            }
        });
    }

    addChannelNameToURL();

    // Run on SPA page change
    let previousUrl = "";
    const observer = new MutationObserver(() => {
        if (window.location.href !== previousUrl) {
            //console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
            previousUrl = window.location.href;
            addChannelNameToURL();
        }
    });
    const config = { subtree: true, childList: true };
    observer.observe(document, config);
})();