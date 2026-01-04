// ==UserScript==
// @name         Fluxus Bypass by: SAMRAT
// @homepageURL  https://discord.gg/HwfEf224h
// @namespace    fluxus_bypass
// @version      12
// @description  Bypass Fluxus and automatically copy the key to clipboard
// @author       SAMRAT
// @match        https://flux.li/android/external/start.php?HWID=*
// @license      SAMRAT
// @icon         https://cdn.discordapp.com/attachments/1270008634180370452/1284110158175146005/458088204_2297085623974752_1364441149326360095_n.jpg?ex=66e57047&is=66e41ec7&hm=c4c687d4ec4eae8f911eb2ef41497b29154f9c87f02112d289b8939f870cd58d&
// @downloadURL https://update.greasyfork.org/scripts/509494/Fluxus%20Bypass%20by%3A%20SAMRAT.user.js
// @updateURL https://update.greasyfork.org/scripts/509494/Fluxus%20Bypass%20by%3A%20SAMRAT.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // New API URL
    const fluxusApiUrl = `https://fluxus-bypass-orcin.vercel.app/api/fluxus?link=${window.location.href}`;

    // Function to fetch data from Fluxus API and copy the key to clipboard
    async function fetchAndCopy() {
        try {
            console.log(`Fetching from: ${fluxusApiUrl}`);

            // Fetch data from the Fluxus API
            const response = await fetch(fluxusApiUrl);
            if (!response.ok) {
                console.error(`Network response was not ok: ${response.statusText}`);
                throw new Error('Network response was not ok');
            }

            // Parse JSON data
            const data = await response.json();

            // Log the full API response for debugging
            console.log("Full API response:", data);

            // Extract the key from the API response
            const key = data.key;

            // If the key exists, copy it to the clipboard
            if (key) {
                await navigator.clipboard.writeText(key);
                console.log(`Key copied: ${key}`);
                showNotification(`Key copied: ${key}`);
            } else {
                console.error('Key not found in API response.');
                showNotification('Key not found in API response.');
            }
        } catch (error) {
            console.error('Error fetching from Fluxus API:', error);
            showNotification('Error fetching from API.');
        }
    }

    // Function to show a notification message
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.padding = '10px';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        notification.style.color = '#fff';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    // Fetch and copy the key
    await fetchAndCopy();
})();
