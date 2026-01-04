// ==UserScript==
// @name          Heardledecades date spoofer
// @namespace     Heardledecades date spoofer
// @version       3
// @match         https://*.heardledecades.com/*
// @match         https://*.heardledecades.xyz/*
// @match         https://heardle80s.com/
// @icon          https://www.google.com/s2/favicons?sz=64&domain=heardledecades.com
// @run-at        document-start
// @grant         unsafeWindow
// @grant         GM_setValue
// @grant         GM_getValue
// @license       MIT
// @description Load a heardledecades page and click the arrows at the top left panel, or enter a custom date, to go to that dates herdle.
// @downloadURL https://update.greasyfork.org/scripts/528835/Heardledecades%20date%20spoofer.user.js
// @updateURL https://update.greasyfork.org/scripts/528835/Heardledecades%20date%20spoofer.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    // Initial spoofed date
    const initialSpoofDate = '01.02.2025';
  
    // Function to parse date string to Date object
    function parseDate(dateString) {
        const [day, month, year] = dateString.split('.');
        return new Date(`${year}-${month}-${day}T12:00:00Z`);
    }
  
    // Function to format Date object to DD.MM.YYYY
    function formatDate(date) {
        return [
            date.getDate().toString().padStart(2, '0'),
            (date.getMonth() + 1).toString().padStart(2, '0'),
            date.getFullYear()
        ].join('.');
    }
  
    // Get or set the current spoofed date
    let currentSpoofDate = GM_getValue('spoofedDate', initialSpoofDate);
    let spoofedTime = parseDate(currentSpoofDate);

    // Override Date.now to return spoofed time
    const originalDateNow = unsafeWindow.Date.now;
    unsafeWindow.Date.now = () => spoofedTime.getTime();

    // Create control panel
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'date-spoofer-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            border: 2px solid black;
            padding: 10px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
      
        const dateDisplay = document.createElement('input');
        dateDisplay.type = 'text';
        dateDisplay.value = currentSpoofDate;
        dateDisplay.style.width = '100px';
        dateDisplay.addEventListener('change', (e) => {
            try {
                const newDate = parseDate(e.target.value);
                spoofedTime = newDate;
                currentSpoofDate = formatDate(newDate);
                GM_setValue('spoofedDate', currentSpoofDate);
                e.target.value = currentSpoofDate;
                location.reload();
            } catch (error) {
                alert('Invalid date format. Use DD.MM.YYYY');
                e.target.value = currentSpoofDate;
            }
        });
      
        const prevButton = document.createElement('button');
        prevButton.textContent = '◀';
        prevButton.title = 'Previous Day';
        prevButton.addEventListener('click', () => {
            spoofedTime.setDate(spoofedTime.getDate() - 1);
            currentSpoofDate = formatDate(spoofedTime);
            dateDisplay.value = currentSpoofDate;
            GM_setValue('spoofedDate', currentSpoofDate);
            location.reload();
        });
      
        const nextButton = document.createElement('button');
        nextButton.textContent = '▶';
        nextButton.title = 'Next Day';
        nextButton.addEventListener('click', () => {
            spoofedTime.setDate(spoofedTime.getDate() + 1);
            currentSpoofDate = formatDate(spoofedTime);
            dateDisplay.value = currentSpoofDate;
            GM_setValue('spoofedDate', currentSpoofDate);
            location.reload();
        });
      
        panel.appendChild(prevButton);
        panel.appendChild(dateDisplay);
        panel.appendChild(nextButton);
      
        document.body.appendChild(panel);
    }

    // Add control panel when page loads
    window.addEventListener('load', createControlPanel);
})();