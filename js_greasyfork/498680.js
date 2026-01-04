// ==UserScript==
// @name         Refund companion 2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Highlight 'passenger' text with modern iOS-like style in red background and white text
// @author       Ahmed Esslaoui
// @match        https://cherdak.console3.com/global/intercity/orders/*
// @grant        none
// @icon         https://www.svgrepo.com/download/51300/money.svg
// @downloadURL https://update.greasyfork.org/scripts/498680/Refund%20companion%202.user.js
// @updateURL https://update.greasyfork.org/scripts/498680/Refund%20companion%202.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Passenger Highlighter script started');

    const checkAndHighlightPassenger = () => {
        const selector = "#single-spa-application\\:\\@cherdak\\/intercity-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div.view__List-jCDjXP.ipfSdI > div:nth-child(10) > span";
        const element = document.querySelector(selector);
        console.log('Checking element with selector:', selector);
        console.log('Element found:', element);

        if (element && element.textContent.trim() === 'passenger') {
            console.log('Element contains "passenger". Highlighting with red background and white text.');
            element.style.cssText = `
                background-color: #ff3b30; /* iOS system red color */
                color: white;
                padding: 2px 5px;
                border-radius: 12px;
                font-size: 12px;
                display: inline-block;
            `;
        } else {
            console.log('Element does not contain "passenger".');
        }
    };

    const observer = new MutationObserver((mutations) => {
        console.log('Mutation observed');
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                console.log('New nodes added:', mutation.addedNodes);
                checkAndHighlightPassenger();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Initial check');
    checkAndHighlightPassenger();
})();
