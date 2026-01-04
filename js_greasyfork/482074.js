// ==UserScript==
// @name         Torn Shoplifting Status
// @namespace    Apo
// @version      1.0
// @description  Display the current status of shoplifting locations
// @author       Apollyon [445323]
// @match        https://*.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      IMT
// @downloadURL https://update.greasyfork.org/scripts/482074/Torn%20Shoplifting%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/482074/Torn%20Shoplifting%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = "API KEY HERE";
    const apiUrl = `https://api.torn.com/torn/?selections=shoplifting&key=${apiKey}&comment=shoplifting`;

    function displayStatus(location, details) {
        let statusInfo = `<span style="color: orange;">${location.replace(/_/g, ' ')}</span>:\n\n`;

        details.forEach(item => {
            const title = item.title || "";
            const status = !item.disabled ? "Active" : "Inactive";
            const statusColor = !item.disabled ? "red" : "green";
            const displayTitle = title.toLowerCase().includes("guard") ? "Guards" : title.toLowerCase().includes("camera") ? "Cameras" : title;
            statusInfo += `${displayTitle}: <span style="color: ${statusColor};">${status}</span>\n`;
        });

        statusInfo += '\n';
        return statusInfo;
    }

    function createButton() {
        const buttonContainer = document.createElement('div');
        const existingElement = document.querySelector('.content-title.m-bottom10');
        let isOpen = false;

        if (existingElement) {
            // Create the new button
            const newButton = document.createElement('button');
            newButton.textContent = 'Shoplifting Status';
            newButton.className = 'c-pointer line-h24 right'; // Applied the same style as the existing button
            newButton.style.color = 'white'; // Set text color to white
            newButton.style.backgroundColor = '#666'; // Set background color to match the existing button
            newButton.style.border = '1px solid #ccc';
            newButton.style.padding = '5px 10px';
            newButton.style.marginRight = '5px'; // Adjusted margin for spacing

            // Create the existing button
            const existingButton = document.querySelector('.detailed-stats.t-clear.h.c-pointer.m-icon.line-h24.right.last');

            // Create the text area
            const textArea = document.createElement('div');
            textArea.style.width = '400px';
            textArea.style.maxHeight = 'none';
            textArea.style.overflow = 'auto';
            textArea.style.whiteSpace = 'pre-wrap';
            textArea.style.padding = '10px';
            textArea.style.border = '1px solid #ccc';
            textArea.style.backgroundColor = 'black';
            textArea.style.color = 'white';
            textArea.style.display = 'none';

            // Add event listener to show or hide the text area with shoplifting information
            newButton.addEventListener('click', async () => {
                await updateShopliftingStatus(textArea);
                textArea.style.display = isOpen ? 'none' : 'block';
                isOpen = !isOpen;
            });

            buttonContainer.appendChild(newButton);
            buttonContainer.appendChild(textArea);

            // Insert the new button and text area before the existing button
            existingButton.insertAdjacentElement('beforebegin', buttonContainer);

            // Set up automatic updates every 3 minutes when the text box is open
            setInterval(async () => {
                if (isOpen) {
                    await updateShopliftingStatus(textArea);
                }
            }, 3 * 60 * 1000);
        }
    }

    async function updateShopliftingStatus(textArea) {
        const shopliftingData = await fetch(apiUrl).then(response => response.json());
        let textContent = '';

        for (const [location, details] of Object.entries(shopliftingData.shoplifting || {})) {
            textContent += displayStatus(location, details);
        }

        textArea.innerHTML = textContent;
    }

    function main() {
        createButton();
    }

    main();
})();
