// ==UserScript==
// @name         YouTube Video Controls - Toggle Visibility
// @name:en      YouTube Video Controls - Toggle Visibility
// @name:ja      YouTube Video Controls - 可視性の切り替え
// @name:zh-TW   YouTube Video Controls - Toggle Visibility
// @name:zh-CN   YouTube Video Controls - Toggle Visibility
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description        This is to toggle the visibility of Youtube Video Controls
// @description:ja     Youtube Video Controls 要素を切り替えるためのものです。
// @description:zh-TW  這是為了切換Youtube Video Controls 元素
// @description:zh-CN  這是為了切換Youtube Video Controls 元素
// @description:en     This is to toggle the visibility of Youtube Video Controls
// @author       CY Fung
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458050/YouTube%20Video%20Controls%20-%20Toggle%20Visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/458050/YouTube%20Video%20Controls%20-%20Toggle%20Visibility.meta.js
// ==/UserScript==

/* jshint esversion:6 */
(function () {
    'use strict';

    const keyEventWhen = (evt) => evt.code === 'KeyC' && evt.shiftKey;

    const allowList = [
        'DIV', 'SPAN', 'BODY', 'HTML', 'VIDEO', 'A',
        'YTD-PLAYER', 'YTD-WATCH-FLEXY', 'YTD-PAGE-MANAGER', 'YTD-MINIPLAYER', 'BUTTON'
    ];

    if(document.querySelector('#tvc-toggle-style')) return;

    function attachStyle(){
        let style = document.createElement('style');
        style.id = 'tvc-toggle-style';
        style.textContent = `
    html.hide-controls .html5-video-container ~ [class]:not(.ytp-cued-thumbnail-overlay):not(.ytp-caption-window-container) {
        visibility: collapse;
        pointer-events: none;
    }
    html.hide-controls #movie_player .ytp-right-controls {
        transform: translateY(100vh) !important;
    }
        `;
        document.documentElement.appendChild(style);
    }
    attachStyle();

    function pageKeyDownfunction(evt) {
        // passive = false
        // capture = true

        if (keyEventWhen(evt)) {

            if (!allowList.includes(evt.target.nodeName)) return;

            if (!document.querySelector('html ytd-watch-flexy #movie_player video')) return

            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();

            document.documentElement.classList.toggle('hide-controls')

        }
    }

    document.addEventListener('keydown', pageKeyDownfunction, true)

    //ytp-ce-video ytp-ce-top-left-quad ytp-ce-size-853 ytp-ce-element-show

    // Your code here...
})();