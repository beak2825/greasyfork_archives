// ==UserScript==
// @name         YouTube Jump to Channel Videos
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Redirect links in the subscription list to videos tab instead of the home tab (only works for open in new tab/window)
// @author       Nathaniel Wu
// @include      *www.youtube.com/*
// @license      Apache-2.0
// @supportURL   https://gist.github.com/Nathaniel-Wu/b9cbdc29b2b33c7d49993ef70d7993d7
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402151/YouTube%20Jump%20to%20Channel%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/402151/YouTube%20Jump%20to%20Channel%20Videos.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function redirect_channel_links(subscriptions) {
        subscriptions.querySelectorAll('ytd-guide-entry-renderer').forEach(channel => {
            let link = channel.querySelector('a');
            if (link.hasAttribute('href') && !/\/videos\/?$/g.test(link.href))
                link.href += "/videos";
        });
    }
    const in_iframe = () => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    const repeat_until_successful = (function_ptr, interval) => {
        if (!function_ptr())
            setTimeout(() => {
                repeat_until_successful(function_ptr, interval);
            }, interval);
    }
    if (!in_iframe())
        repeat_until_successful(() => {
            const subscriptions = document.querySelector('div#content > tp-yt-app-drawer#guide div#sections > ytd-guide-section-renderer:nth-of-type(2) > div#items'); // subject to change
            if (!Boolean(subscriptions))
                return false;
            const observer = new MutationObserver((mutationList, observer) => {
                for (const mutation of mutationList)
                    redirect_channel_links(mutation.target);
            });
            redirect_channel_links(subscriptions);
            observer.observe(subscriptions, { childList: true, subtree: true });
            return true;
        }, 200);
})();