// ==UserScript==
// @name         chatgpt字体修改
// @license Apache
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  chatgpt字体
// @author       You
// @match        https://chatgpt.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512817/chatgpt%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/512817/chatgpt%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change the font
    function changeFont() {
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                font-family: sans-serif !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Apply font change initially
    changeFont();

    // Create a MutationObserver to monitor for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            changeFont();  // Re-apply the font change if needed
        });
    });

    // Start observing the body for added/removed child nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
