// ==UserScript==
// @name         解锁黑料网
// @namespace    Unlock_Heiliao
// @version      1.1
// @description  1)去除广告 2)内容页的播放器置顶并播放
// @author       cocang
// @match        *://18hlw.com/*
// @match        *://zztt15.com/*
// @match        *://*.dbeggt.com/*
// @match        *://*.hewhsu.com/*
// @icon         https://18hlw.com/static/pc/icons/icon_64x64.820c9b.png
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483154/%E8%A7%A3%E9%94%81%E9%BB%91%E6%96%99%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/483154/%E8%A7%A3%E9%94%81%E9%BB%91%E6%96%99%E7%BD%91.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const queryAndRemoveElements = (selectors) => {
        selectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((element) => element.remove());
        });
    };

    const applyStylesToDPlayer = (dPlayer, styles) => {
        Object.assign(dPlayer.style, styles);
    };

    const playFirstDPlayerVideo = (container) => {
        const firstDPlayer = container.querySelector('.dplayer');
        firstDPlayer?.querySelector('video')?.play();
    };

    const moveDPlayersToTop = (container, dPlayers) => {
        dPlayers.reverse().forEach((dPlayer) => {
            applyStylesToDPlayer(dPlayer, { width: '100%', height: '960px' });
            container.prepend(dPlayer);
        });
    };

    const processDPlayers = () => {
        const contentPlaceholder = document.querySelector('.client-only-placeholder.editormd-preview');
        if (!contentPlaceholder) return;

        const dPlayers = Array.from(contentPlaceholder.querySelectorAll('.dplayer'));
        if (dPlayers.length === 0) return;

        moveDPlayersToTop(contentPlaceholder, dPlayers);
        playFirstDPlayerVideo(contentPlaceholder);
    };

    const filterAndStyleVideoLinks = () => {
        const videoItems = document.querySelectorAll('.video-list .video-item');
        videoItems.forEach((videoItem) => {
            const anchor = videoItem.querySelector('a');
            if (anchor) {
                if (anchor.href.includes('/archives/') && !anchor.href.includes('/archives/25117.html')) {
                    anchor.setAttribute('target', '_blank');
                } else {
                    videoItem.remove();
                }
            }
        });
    };

    const cleanUpPage = () => {
        const elementsToRemove = ['.event-notice', '.infomation', '.list-sec', '.list-sec-top', 'blockquote'];
        queryAndRemoveElements(elementsToRemove);
        filterAndStyleVideoLinks();
        processDPlayers();
    };

    cleanUpPage();
})();