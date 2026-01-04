// ==UserScript==
// @name         Remove YouTube Video End Screen Thumbnails
// @namespace    https://www.example.com/
// @version      1
// @description  Remove YouTube video end screen thumbnails that cover the end of the video
// @author       ChatGPT fr fr
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466195/Remove%20YouTube%20Video%20End%20Screen%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/466195/Remove%20YouTube%20Video%20End%20Screen%20Thumbnails.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeName === 'DIV' && node.classList.contains('ytp-ce-element')) {
                        node.remove();
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .ytp-ce-covering-overlay,
        .ytp-ce-element-shadow,
        .ytp-ce-covering-image,
        .ytp-ce-expanding-image,
        .ytp-ce-element.ytp-ce-video.ytp-ce-element-show,
        .ytp-ce-element.ytp-ce-channel.ytp-ce-channel-this,
        .ytp-ce-element-overlay {
            display: none !important;
            visibility: hidden !important;
        }
    `;

    document.head.appendChild(style);

})();
