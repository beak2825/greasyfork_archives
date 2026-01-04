// ==UserScript==
// @name         Blooket Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Enhances Blooket experience with dynamic background color only in the stats tab and a custom background image for the dashboard.
// @author       Dakota marty
// @match        https://*.blooket.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529561/Blooket%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/529561/Blooket%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the background for the dashboard
    const setDashboardBackground = () => {
        const dashboardBackground = "https://th.bing.com/th/id/R.b05634a1537b8867e21231793434deed?rik=%2bC365r%2bMAhUIkw&riu=http%3a%2f%2fwww.pixelstalk.net%2fwp-content%2fuploads%2f2016%2f06%2fBlack-and-Red-Wallpaper-Free.jpg&ehk=3yUE4aCsSeqY0wC6XY4mQBv8GN0lKmB%2fJnNP33wM4xU%3d&risl=&pid=ImgRaw&r=0";
        document.body.style.backgroundImage = `url('${dashboardBackground}')`;
        document.body.style.backgroundSize = "cover"; // Adjust as necessary
        document.body.style.backgroundColor = ""; // Clear any existing background color
    };

    // Change background color for the stats tab
    const changeBackgroundColor = (color) => {
        document.body.style.backgroundColor = color;
        document.body.style.backgroundImage = ""; // Clear background image for custom color
    };

    // Function to style the correct answers
    const styleCorrectAnswers = () => {
        const correctAnswers = document.querySelectorAll('.correct-answer');
        if (correctAnswers.length > 0) {
            correctAnswers.forEach(answer => {
                answer.style.fontWeight = 'bold';
                answer.style.color = 'green'; // Optional: Change text color to green for visibility
            });
        }
    };

    // Check if we are on the stats tab
    const isStatsTab = () => {
        // Adjust this condition based on the actual URL or element that indicates you're on the stats tab
        return window.location.href.includes('/stats'); // Example: Check if URL includes '/stats'
    };

    // Listen for key presses
    document.addEventListener('keydown', (event) => {
        if (isStatsTab()) {
            if (event.key === 'e') {
                const color = prompt("Enter a color (name or HEX code) for the background in the stats tab:");
                if (color) {
                    changeBackgroundColor(color);
                }
            }
        } else if (event.key === 'u') {
            styleCorrectAnswers();
        }
    });

    // Wait for DOM content to fully load
    document.addEventListener('DOMContentLoaded', () => {
        // Check if we're on the dashboard
        const isDashboard = window.location.pathname === "/"; // Adjust this if the dashboard URL changes
        if (isDashboard) {
            setDashboardBackground();
        }
    });
})();