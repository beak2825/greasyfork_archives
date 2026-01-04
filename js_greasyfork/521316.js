// ==UserScript==
// @name         冰楓論壇 廣告移除 v1.4
// @namespace    https://www.facebook.com/airlife917339
// @version      1.4
// @description  冰楓論壇 廣告移除插件，新增特定子網址跳回功能
// @author       Kevin Chang
// @match        https://bingfong.com/*
// @icon         https://bingfong.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521316/%E5%86%B0%E6%A5%93%E8%AB%96%E5%A3%87%20%E5%BB%A3%E5%91%8A%E7%A7%BB%E9%99%A4%20v14.user.js
// @updateURL https://update.greasyfork.org/scripts/521316/%E5%86%B0%E6%A5%93%E8%AB%96%E5%A3%87%20%E5%BB%A3%E5%91%8A%E7%A7%BB%E9%99%A4%20v14.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove specified divs
    function removeDivs() {
        const idsToRemove = ['fwin_dialog', 'fwin_dialog_cover'];
        idsToRemove.forEach(id => {
            const div = document.getElementById(id);
            if (div) {
                div.remove();
                console.log(`Div with id "${id}" has been removed.`);
            }
        });
    }

    // Function to check URL and navigate back if conditions are met
    function checkAndGoBack() {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const mod = params.get('mod');
        const doAction = params.get('do');
        const id = params.get('id');

        // List of IDs to check
        const targetIds = ['86', '87', '166', '168', '169'];

        if (mod === 'task' && ['draw', 'apply'].includes(doAction) && targetIds.includes(id)) {
            console.log(`Detected matching URL with id=${id} and do=${doAction}. Navigating back.`);
            history.back();
        }

    }

    // Create a MutationObserver to monitor DOM changes
    const observer = new MutationObserver(() => {
        removeDivs();
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial delay before starting the removal process
    const initialDelay = 500; // Adjust as needed (e.g., 2000ms = 2 seconds)
    setTimeout(() => {
        removeDivs(); // Remove any existing target divs
        checkAndGoBack(); // Check URL and go back if needed
        console.log('Initial div removal and URL check completed. Observer is now active.');
    }, initialDelay);
})();