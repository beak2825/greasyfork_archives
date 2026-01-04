// ==UserScript==
// @name         YouTube Tracking Param Remover
// @namespace    YTParams
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Dynamically checks for and removes nuisance/tracking parameters on links within YouTube pages. This helps to reduce tracking and helps keep your history clean, making visited links work properly.
// @author       BoffinBrain
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://icons.duckduckgo.com/ip2/youtube.com.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541517/YouTube%20Tracking%20Param%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/541517/YouTube%20Tracking%20Param%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ytEvents = ["yt-action", "yt-enable-lockup-interaction", "yt-renderidom-finished"];
    const badParams = ["pp", "si"];
    const query = badParams.map(p => 'a[href*="&' + p + '="]').join();

    const cleaner = ev => {
        const links = document.querySelectorAll(query);

        if (links.length) {
            console.log("YouTube Tracking Param Remover found " + links.length + " link(s) after event " + ev.type);

            links.forEach(link => {
                const urlParts = link.href.split("?");
                const params = new URLSearchParams(urlParts[1]);
                badParams.forEach(param => params.delete(param));
                link.href = urlParts[0] + "?" + params.toString();
            });
        }
    };

    ytEvents.forEach(e => {document.addEventListener(e, cleaner)});

    // Utility function to disover custom events firing on a webpage (@grant unsafeWindow required)
    // const dispatchEventOriginal = EventTarget.prototype.dispatchEvent;
    // unsafeWindow.EventTarget.prototype.dispatchEvent = function (event) {
    //     console.log(event.type);
    //     dispatchEventOriginal.apply(this, arguments);
    // };

    // List of discovered events that fire on YT:
    // active-changed
    // active-endpoint-changed
    // can-show-more-changed
    // dom-change
    // guide-persistent-and-visible-changed
    // guide-persistent-changed
    // image-loaded
    // image-unloaded
    // iron-request-resize-notifications
    // iron-resize
    // mini-guide-visible-changed
    // render-guide-changed
    // shown-items-changed
    // yt-action
    // yt-autonav-pause-guide-closed
    // yt-enable-lockup-interaction
    // yt-get-context-provider
    // yt-guide-hover
    // yt-navigate-finish
    // yt-page-data-fetched
    // yt-page-data-updated
    // yt-rendererstamper-finished
    // yt-renderidom-finished
    // yt-request-elements-per-row
    // yt-service-request-sent
    // yt-set-fullerscreen-styles
    // yt-text-inline-expander-expanded-changed
    // yt-update-title
})();