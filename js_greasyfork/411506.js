// ==UserScript==
// @name         YouTube Check Out Updated Channels
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Open channels with updates in new tabs
// @author       Nathaniel Wu
// @include      *://www.youtube.com/*
// @include      *://www.youtube.com
// @license      Apache-2.0
// @supportURL   https://gist.github.com/Nathaniel-Wu/fabd62df2d6146121fa4b9cfcae08763
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/411506/YouTube%20Check%20Out%20Updated%20Channels.user.js
// @updateURL https://update.greasyfork.org/scripts/411506/YouTube%20Check%20Out%20Updated%20Channels.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function is_channel_updated(channel) {
        return window.getComputedStyle(channel.querySelector('div#newness-dot')).display == "block";
    }
    function is_channel_broadcasting(channel) {
        return window.getComputedStyle(channel.querySelector('div#newness-dot')).display == "none" && Boolean(channel.querySelector('yt-icon.guide-entry-badge.style-scope.ytd-guide-entry-renderer svg'));
    }
    function click_videos_tab() {
        let ret = false;
        document.querySelectorAll('#tabsContent > tp-yt-paper-tab > div').forEach(e => {
            if (/[Vv][Ii][Dd][Ee][Oo][Ss]/g.test(e.innerText)) {
                e.click();
                ret = true;
            }
        });
        return ret;
    }
    let accumulated_delay = 0;
    function check_for_updates(subscriptions) {
        subscriptions.querySelectorAll('ytd-guide-entry-renderer').forEach(channel => {
            console.info(channel);
            if (is_channel_updated(channel)) {
                setTimeout(() => {
                    channel.querySelector('a').click();
                }, accumulated_delay += 500);
            }
        });
    }
    function checkout_updated_channels() {
        let subscriptions = document.querySelector('div#content > tp-yt-app-drawer#guide div#sections > ytd-guide-section-renderer:nth-of-type(2) > div#items');//subject to change
        if (subscriptions == null)
            return false;
        let channels = subscriptions.querySelectorAll(':scope > ytd-guide-entry-renderer.style-scope.ytd-guide-section-renderer');
        if (is_channel_updated(channels[channels.length - 1]) || is_channel_broadcasting(channels[channels.length - 1])) {
            let active_DOMNodeInsertion = 0;
            const observer = new MutationObserver(mutationList =>
                mutationList.filter(m => m.type === 'childList').forEach(m => {
                    m.addedNodes.forEach(() => {
                        active_DOMNodeInsertion++;
                        setTimeout(() => {
                            active_DOMNodeInsertion--;
                            if (active_DOMNodeInsertion == 0) {
                                check_for_updates(subscriptions);
                            }
                        }, 2000);
                    });
                }));
            observer.observe(subscriptions, { childList: true, subtree: true });
            subscriptions.querySelector('ytd-guide-collapsible-entry-renderer > ytd-guide-entry-renderer#expander-item').click();
        } else
            check_for_updates(subscriptions);
        return true;
    }
    function repeat_until_successful(function_ptr, interval) {
        if (!function_ptr())
            setTimeout(() => {
                repeat_until_successful(function_ptr, interval);
            }, interval);
    }
    function in_iframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    function on_subscription_page() {
        return /^https?:\/\/((www|m)\.)?youtube\.com\/feed\/subscriptions\/?$/.test(window.location.href);
    }
    if (!in_iframe()) {
        if (on_subscription_page())
            repeat_until_successful(checkout_updated_channels, 1000);
        document.addEventListener('transitionend', (e) => {
            if (e.target.id === 'progress' && on_subscription_page())
                repeat_until_successful(checkout_updated_channels, 1000);
        });
    }
})();