// ==UserScript==
// @name         Scroll to Top/bottom for mobile phone
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  A set of floating buttons on the screen that quickly scroll to the top and bottom of the page, and scroll up/down one page.
// @author       Kamiya Minoru
// @match        *://*/*
// @exclude      *://www.google.com/*
// @exclude      *://www.google.com.tw/*
// @exclude      *://www.google.co.jp/*
// @exclude      https://www.bilibili.com/
// @exclude      https://*.microsoft/*
// @exclude      https://gemini.google.com/*
// @exclude      https://chatgpt.com/
// @exclude      https://claude.ai/*
// @exclude      https://www.perplexity.ai/*
// @exclude      https://chat.deepseek.com/*
// @exclude      https://www.twitch.tv/
// @noframes
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527646/Scroll%20to%20Topbottom%20for%20mobile%20phone.user.js
// @updateURL https://update.greasyfork.org/scripts/527646/Scroll%20to%20Topbottom%20for%20mobile%20phone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設置 Trusted Types Policy
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: (input) => input,
            createScript: (input) => input,
            createScriptURL: (input) => input
        });
    }

    // Create a container for the buttons
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.right = '2px';
    container.style.bottom = '90px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    // Create a style element for CSS
    var style = document.createElement('style');
    style.innerHTML = `
.svg-container svg path {
    fill: rgba(3, 76, 133, 0.2); /* 20% transparent blue */
    stroke: rgba(0, 0, 0, 0.4); /* 40% transparent black */
    stroke-width: 1px;
}
`;
    document.head.appendChild(style);

    function createButton(innerHTML, onClick) {
        var button = document.createElement('div');
        button.className = 'svg-container'; // Add class for CSS styling
        button.innerHTML = innerHTML;
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = 'transparent';
        button.style.textAlign = 'center';
        button.style.fontSize = '30px';
        button.style.borderRadius = '0px';
        button.style.userSelect = 'none';
        button.style.marginBottom = '2px';
        button.style.boxShadow = 'none'; // Remove the black background
        button.addEventListener('click', onClick);
        container.appendChild(button);
    }

    // SVG Icons (fill attribute removed)
    const upArrowSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="30" height="30"><path d="M318 177.5c3.8-8.8 2-19-4.6-26l-136-144C172.9 2.7 166.6 0 160 0s-12.9 2.7-17.4 7.5l-136 144c-6.6 7-8.4 17.2-4.6 26S14.4 192 24 192l72 0 0 288c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-288 72 0c9.6 0 18.2-5.7 22-14.5z"/></svg>`;
    const downArrowSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="30" height="30"><path d="M2 334.5c-3.8 8.8-2 19 4.6 26l136 144c4.5 4.8 10.8 7.5 17.4 7.5s12.9-2.7 17.4-7.5l136-144c6.6-7 8.4 17.2 4.6-26s-12.5-14.5-22-14.5l-72 0 0-288c0-17.7-14.3-32-32-32L128 0C110.3 0 96 14.3 96 32l0 288-72 0c-9.6 0-18.2 5.7-22 14.5z"/></svg>`;
    const upDownArrowSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" width="30" height="30"><path d="M145.6 7.7C141 2.8 134.7 0 128 0s-13 2.8-17.6 7.7l-104 112c-6.5 7-8.2 17.2-4.4 25.9S14.5 160 24 160l56 0 0 192-56 0c-9.5 0-18.2 5.7-22 14.4s-2.1 18.9 4.4 25.9l104 112c4.5 4.9 10.9 7.7 17.6 7.7s13-2.8 17.6-7.7l104-112c6.5-7 8.2-17.2 4.4-25.9s-12.5-14.4-22-14.4l-56 0 0-192 56 0c9.5 0 18.2-5.7 22-14.4s2.1-18.9-4.4-25.9l-104-112z"/></svg>`;

    // Create the buttons with embedded SVG icons
    createButton(upArrowSVG, function() {
        window.scrollBy({ top: -window.innerHeight, behavior: 'auto' }); // Remove smooth behavior for instant action
    });
    createButton(downArrowSVG, function() {
        window.scrollBy({ top: window.innerHeight, behavior: 'auto' }); // Remove smooth behavior for instant action
    });
    createButton(upDownArrowSVG, function() {
        if (window.scrollY === 0) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' }); // Remove smooth behavior for instant action
        } else {
            window.scrollTo({ top: 0, behavior: 'auto' }); // Remove smooth behavior for instant action
        }
    });
})();