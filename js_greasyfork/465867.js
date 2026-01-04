// ==UserScript==
// @name         Remove Youtube Shorts
// @namespace    https://www.youtube.com/
// @version      0.2
// @description  Remove youtube shorts junk
// @author       Scamcast
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465867/Remove%20Youtube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/465867/Remove%20Youtube%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function RemoveShorts() {
        document.querySelectorAll('ytd-grid-video-renderer').forEach(video => {
            try {
                if (video.__data.data.navigationEndpoint.commandMetadata.webCommandMetadata.webPageType.match(/shorts/i)) video.remove();
            } catch (e) {}
        });

        document.querySelectorAll('ytd-guide-entry-renderer.ytd-guide-section-renderer').forEach(guideItem => {
            try {
                if (guideItem.__data.data.formattedTitle.simpleText.match(/shorts/i)) guideItem.remove();
            } catch (e) {}
        });

        document.querySelectorAll('tp-yt-paper-tab').forEach(tab => {
            try {
                if (tab.textContent.match(/shorts/i)) tab.remove();
            } catch (e) {}
        });
        document.querySelectorAll('ytd-reel-shelf-renderer, ytd-rich-shelf-renderer').forEach(reelshelf => reelshelf.remove());
    }

    RemoveShorts();
    let JunkCheckInterval = setInterval(RemoveShorts, 1000);

    window.addEventListener('focus', (e)=>{
        if (document.hasFocus() && document.visibilityState == 'visible'){
            clearInterval(JunkCheckInterval);
            JunkCheckInterval = setInterval(RemoveShorts, 1000);
        } else if (!document.hasFocus() || document.visibilityState == 'hidden') {
            clearInterval(JunkCheckInterval);
        };
    });
    window.addEventListener('visibilitychange', (e)=>{
        if (!document.hasFocus() || document.visibilityState == 'hidden') {
            clearInterval(JunkCheckInterval);
        };
    })
})();