// ==UserScript==
// @name         Export Shopify Fullsize File URLs
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Export all fullsize file URLs from Shopify to clipboard and log them in console (bulk export with pagination)
// @author       sharmanhall
// @match        https://admin.shopify.com/store/*/content/files?limit=*&selectedView=all
// @match        https://admin.shopify.com/store/*/content/files*
// @grant        GM_setClipboard
// @grant        GM_log
// @run-at       document-end
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopify.com
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   safari
// @compatible   brave
// @downloadURL https://update.greasyfork.org/scripts/496293/Export%20Shopify%20Fullsize%20File%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/496293/Export%20Shopify%20Fullsize%20File%20URLs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let accumulatedUrls = [];
    let consoleMessages = [];

    // Function to extract file URLs
    function extractFileUrls() {
        const fileElements = document.querySelectorAll('td._ThumbnailCell_b1ynd_1.Polaris-IndexTable__TableCell div > div > button > span img');
        const fileUrls = Array.from(fileElements).map(el => el.src.replace('_60x60', ''));
        console.log('Fullsize File URLs:', fileUrls);
        GM_setClipboard(fileUrls.join('\n'));
        GM_log('Fullsize file URLs copied to clipboard.');
        showNotification(`${fileUrls.length} links copied to clipboard.`);
        logToExpandableConsole(`Fullsize File URLs: ${fileUrls.join(', ')}`);
    }

    // Function to accumulate file URLs and copy to clipboard
    function accumulateFileUrls() {
        const fileElements = document.querySelectorAll('td._ThumbnailCell_b1ynd_1.Polaris-IndexTable__TableCell div > div > button > span img');
        const fileUrls = Array.from(fileElements).map(el => el.src.replace('_60x60', ''));
        accumulatedUrls = accumulatedUrls.concat(fileUrls);
        console.log('Accumulated Fullsize File URLs:', accumulatedUrls);
        GM_setClipboard(accumulatedUrls.join('\n'));
        GM_log('Accumulated fullsize file URLs copied to clipboard.');
        showNotification(`${accumulatedUrls.length} total links accumulated and copied to clipboard.`);
        logToExpandableConsole(`Accumulated Fullsize File URLs: ${accumulatedUrls.join(', ')}`);
    }

    // Function to create a floating button for extracting URLs
    function createFloatingButton() {
        const button = document.createElement('button');
        button.innerText = 'Export File URLs';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#008CBA';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', extractFileUrls);
        document.body.appendChild(button);
    }

    // Function to create a floating button for accumulating URLs
    function createAccumulateButton() {
        const button = document.createElement('button');
        button.innerText = 'Accumulate URLs';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '150px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = '#FFA500';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', accumulateFileUrls);
        document.body.appendChild(button);
    }

    // Function to create a floating input area for changing the limit parameter
    function createLimitInput() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '50px';
        container.style.right = '10px';
        container.style.zIndex = '1000';
        container.style.padding = '10px';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';

        const label = document.createElement('label');
        label.innerText = 'Set Limit: ';
        label.style.marginRight = '5px';

        const input = document.createElement('input');
        input.type = 'number';
        input.value = 10;
        input.style.marginRight = '5px';
        input.style.width = '50px';

        const setButton = document.createElement('button');
        setButton.innerText = 'Set';
        setButton.style.padding = '5px';
        setButton.style.backgroundColor = '#008CBA';
        setButton.style.color = 'white';
        setButton.style.border = 'none';
        setButton.style.borderRadius = '5px';
        setButton.style.cursor = 'pointer';

        setButton.addEventListener('click', () => {
            const limit = input.value;
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('limit', limit);
            window.location.href = currentUrl.toString();
        });

        container.appendChild(label);
        container.appendChild(input);
        container.appendChild(setButton);

        document.body.appendChild(container);
    }

    // Function to create quick change buttons
    function createQuickChangeButtons() {
        const limits = [10, 50, 100, 200, 250];
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '110px';
        container.style.right = '10px';
        container.style.zIndex = '1000';
        container.style.padding = '10px';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        limits.forEach(limit => {
            const button = document.createElement('button');
            button.innerText = `Set Limit ${limit}`;
            button.style.padding = '5px';
            button.style.backgroundColor = '#008CBA';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';

            button.addEventListener('click', () => {
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set('limit', limit);
                window.location.href = currentUrl.toString();
                showNotification(`Limit set to ${limit}.`);
                logToExpandableConsole(`Limit set to ${limit}`);
            });

            container.appendChild(button);
        });

        document.body.appendChild(container);
    }

    // Function to show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.zIndex = '1000';
        notification.style.padding = '10px';
        notification.style.backgroundColor = '#333';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        notification.style.transition = 'opacity 0.5s';
        notification.style.opacity = '1';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Function to create an expandable console log area
    function createExpandableConsole() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.left = '10px';
        container.style.zIndex = '1000';
        container.style.width = '300px';
        container.style.maxHeight = '200px';
        container.style.overflowY = 'auto';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.padding = '10px';
        container.style.display = 'none';

        const toggleButton = document.createElement('button');
        toggleButton.innerText = 'Show Console';
        toggleButton.style.position = 'fixed';
        toggleButton.style.bottom = '10px';
        toggleButton.style.left = '320px';
        toggleButton.style.zIndex = '1001';
        toggleButton.style.padding = '10px';
        toggleButton.style.backgroundColor = '#008CBA';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.cursor = 'pointer';

        toggleButton.addEventListener('click', () => {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
            toggleButton.innerText = container.style.display === 'none' ? 'Show Console' : 'Hide Console';
        });

        document.body.appendChild(toggleButton);
        document.body.appendChild(container);

        return container;
    }

    // Function to log messages to the expandable console
    function logToExpandableConsole(message) {
        consoleMessages.push(message);
        const consoleContainer = document.querySelector('.expandable-console');
        if (consoleContainer) {
            consoleContainer.innerHTML = consoleMessages.join('<br>');
        }
    }

    // Wait for the page to fully load
    window.addEventListener('load', () => {
        createFloatingButton();
        createAccumulateButton();
        createLimitInput();
        createQuickChangeButtons();
        const expandableConsole = createExpandableConsole();
        expandableConsole.classList.add('expandable-console');
    });

})();
