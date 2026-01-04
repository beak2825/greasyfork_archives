// ==UserScript==
// @name     YT觀看次數更換元素位置
// @description Youtube description is moved on the right, expanded and scrollable
// @version   3.1
// @author    SH3LL
// @license   MIT
// @match     *://*.youtube.com/*
// @grant     none
// @run-at    document-end
// @noframes
// @namespace https://greasyfork.org/users/762057

// @downloadURL https://update.greasyfork.org/scripts/533518/YT%E8%A7%80%E7%9C%8B%E6%AC%A1%E6%95%B8%E6%9B%B4%E6%8F%9B%E5%85%83%E7%B4%A0%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/533518/YT%E8%A7%80%E7%9C%8B%E6%AC%A1%E6%95%B8%E6%9B%B4%E6%8F%9B%E5%85%83%E7%B4%A0%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const moveAndStyleElements = () => {
        //document.querySelector('#related')?.prepend(document.getElementById('bottom-row'));
        //document.querySelector('#related')?.prepend(document.getElementById('owner'));
        document.getElementById('top-level-buttons-computed')?.prepend(document.getElementById('info-container'));
        //document.getElementById('owner')?.append(document.getElementById('info-container'));
        //document.getElementById('title')?.prepend(document.querySelector('.ytp-chrome-bottom'));
        document.getElementById('info-container')?.setAttribute("style", "color:white; font-size: 12px;");
        //document.getElementById('owner')?.setAttribute("style", "margin:0");
        //document.getElementById('description-inline-expander').setAttribute("style", "margin-left: 0; overflow: auto; max-width: 100%; font-size: 1.3rem;line-height: normal; max-height: 600px; overflow: auto; width: auto; padding-top: 0; padding-bottom: 0; margin-right: 0 !important; background-color: var(--yt-playlist-background-item); padding: 8px; border-bottom-width: 0px;--yt-endpoint-text-decoration: underline;");
        //document.getElementById('description-inline-expander').setAttribute("is-expanded","");

        //document.getElementById('description')?.setAttribute("style", "margin: 0;");
        //document.getElementById('description-inner')?.setAttribute("style", "margin: 0;");
    };

    // OBSERVER FOR ELEMENTS TO MOVE
    const moveObserver = new MutationObserver(mutations => {
        if (document.getElementById('owner')) {
            moveObserver.disconnect();
            moveAndStyleElements();
        }
    });
    moveObserver.observe(document.body, { childList: true, subtree: true });

    // OBSERVER FOR ELEMENTS TO REMOVE
    const ui = new MutationObserver(mutations => {
        const elementsToRemoveIds = ['ytd-watch-info-text',  'collapse', 'snippet'];
        elementsToRemoveIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        });

        let my_height = document.querySelector('.video-stream.html5-main-video');
        document.getElementById('description-inline-expander').style.maxHeight = (parseInt(my_height.style.height) - 70) + "px";
    });
    ui.observe(document.body, { childList: true, subtree: true });

})();