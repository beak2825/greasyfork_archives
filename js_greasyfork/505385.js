// ==UserScript==
// @name         Internet Speed Monitor
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Monitors your internet speed in Mbps and displays it in a movable panel at the top of the page. The panel can be toggled to show or hide by clicking anywhere on the page. The speed is updated every second. Ideal for tracking internet performance in real-time while browsing.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license      MIT
// @supportURL   https://github.com/yourusername/your-repository/issues
// @downloadURL https://update.greasyfork.org/scripts/505385/Internet%20Speed%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/505385/Internet%20Speed%20Monitor.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Create the speed display panel
    const speedPanel = document.createElement('div');
    speedPanel.style.position = 'fixed';
    speedPanel.style.top = '10px';  // Position at top
    speedPanel.style.right = '10px';  // Position at right
    speedPanel.style.zIndex = '9999';
    speedPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent background
    speedPanel.style.color = '#ffffff';
    speedPanel.style.padding = '5px 10px';
    speedPanel.style.borderRadius = '5px';
    speedPanel.style.fontFamily = 'Arial, sans-serif';
    speedPanel.style.fontSize = '12px'; // Smaller font size
    speedPanel.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)'; // Slight shadow for better visibility
    speedPanel.style.cursor = 'pointer'; // Pointer cursor to indicate it can be interacted with
    speedPanel.style.display = 'block'; // Ensure panel is visible initially
    document.body.appendChild(speedPanel);

    // Toggle visibility when clicking anywhere on the page
    document.addEventListener('click', () => {
        if (speedPanel.style.display === 'none') {
            speedPanel.style.display = 'block';
        } else {
            speedPanel.style.display = 'none';
        }
    });

    async function calculateSpeed() {
        const startTime = Date.now();
        try {
            // Test file with known size (adjust URL as needed)
            const response = await fetch('https://httpbin.org/bytes/1000000'); // 1MB file
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000; // duration in seconds
            const fileSize = 1 * 1024 * 1024 * 8; // 1MB in bits
            const speed = fileSize / duration; // speed in bps
            const speedMbps = speed / (1024 * 1024); // convert to Mbps
            const speedMbpsFormatted = speedMbps.toFixed(2); // format to 2 decimal places
            speedPanel.textContent = `${speedMbpsFormatted} Mbps`;
        } catch (error) {
            speedPanel.textContent = 'Error calculating speed';
            console.error('Error calculating speed:', error);
        }
    }

    // Update speed every 1 second
    setInterval(calculateSpeed, 1000);
})();
