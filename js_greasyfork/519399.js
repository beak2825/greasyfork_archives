// ==UserScript==
// @name         Return YouTube's Red Color
// @icon         https://www.youtube.com/favicon.ico
// @version      1.0.4
// @description  Revert YouTube's new pink color to the classic red
// @author       dark110
// @match        *://*.youtube.com/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1404735
// @downloadURL https://update.greasyfork.org/scripts/519399/Return%20YouTube%27s%20Red%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/519399/Return%20YouTube%27s%20Red%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COLOR = '#FF0000';
    const HUE_ROTATION = '20deg';
    const ICON_URL = 'https://www.gstatic.com/youtube/img/creator/favicon/favicon.ico';

    const ToColor = [
        '.html5-play-progress',
        '.ytp-play-progress',
        'div.ytp-scrubber-button.ytp-swatch-background-color',
        'div.YtProgressBarLineProgressBarPlayed.YtProgressBarLineProgressBarPlayedRefresh',
        'div.style-scope.ytd-thumbnail-overlay-resume-playback-renderer'
    ];

    const ToFilter = [
        '.ytp-large-play-button',
        '.ytp-button',
        '.ytcp-home-button',
        '.yt-icon-shape',
        'ytd-badge-supported-renderer',
        '.badge-shape'
    ];

    const Apply = () => {
        ToColor.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.style.background = COLOR);
        });

        ToFilter.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.style.filter = `hue-rotate(${HUE_ROTATION})`);
        });

        const icon = document.querySelector("link[rel*='icon']");
        if (icon) {
            const newicon = document.createElement('link');
            newicon.rel = 'shortcut icon';
            newicon.href = ICON_URL;
            document.head.replaceChild(newicon, icon);
        }
    };

    const ApplyObserver = new MutationObserver(Apply);
    ApplyObserver.observe(document.body, {childList: true, subtree: true});

    Apply();
})();
