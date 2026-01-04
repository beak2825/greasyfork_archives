// ==UserScript==
// @name         The West Enhanced Mod (Day, Night, and Occasional Rain)
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Modifies the colors of "The West" with day, night effects, and random rain occurrences.
// @author       Keviin / Kevin_1.7
// @match        *://*.the-west.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511107/The%20West%20Enhanced%20Mod%20%28Day%2C%20Night%2C%20and%20Occasional%20Rain%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511107/The%20West%20Enhanced%20Mod%20%28Day%2C%20Night%2C%20and%20Occasional%20Rain%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let rainStart = null;  // Random start time for rain
    let rainDuration = null;  // Rain duration in hours
    const MORE_COLORFUL = "saturate(1.2)";
    const CLOUDY = "saturate(0.8) brightness(0.9)";

    // Function to set random rain time and duration each day
    function setRandomRain() {
        // Random time between 0:00 and 23:00
        rainStart = Math.floor(Math.random() * 24);
        // Random duration between 1 and 3 hours
        rainDuration = Math.floor(Math.random() * 3) + 1;
        console.log(`Today it will rain from ${rainStart}:00 for ${rainDuration} hours.`);
    }

    // Function to check if it's raining at the current time
    function isRaining() {
        const currentHour = new Date().getHours();
        return currentHour >= rainStart && currentHour < rainStart + rainDuration;
    }

    // Function to change the game's colors and add weather effects
    function changeColor() {
        const hour = new Date().getHours();

        let filter;
        if (hour >= 20 || hour < 6) {
            // Night (8 PM to 6 AM): slightly brighter, desaturated tones
            filter = "brightness(0.7) grayscale(0.5)";  // Less desaturated for a more vibrant night effect
        } else {
            if (isRaining()) {
                filter = CLOUDY;  // Cloudy effect during rain
                addWeatherEffects();  // Add rain
            } else {
                filter = MORE_COLORFUL;  // Bright and vivid colors for daytime
                removeWeatherEffects();  // Remove rain if it's not raining
            }
        }

        // Apply the filter to the game map
        $("#map").css({
            "filter": filter,
            "-webkit-filter": filter,
            "transition": "filter 1s ease-in-out"
        });
    }

    // Function to add rain effects
    function addWeatherEffects() {
        // Add rain (simulated with small divs falling)
        if (!$("#rain").length) {
            let rainContainer = $('<div id="rain" style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:101;"></div>');

            for (let i = 0; i < 100; i++) {
                let leftPosition = Math.random() * 100; // Random horizontal position
                let dropSpeed = 0.5 + Math.random(); // Random speed for each raindrop
                let drop = `<div class="drop" style="position:absolute;width:1px;height:60px;background:rgba(255,255,255,0.4);top:0;left:${leftPosition}vw;animation: fall ${dropSpeed}s linear infinite;"></div>`;
                rainContainer.append(drop);
            }

            $("body").append(rainContainer);

            // Add CSS animation for rain
            let style = `
                <style>
                    @keyframes fall {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(100vh); }
                    }
                </style>
            `;
            $("head").append(style);
        }
    }

    // Function to remove rain effects
    function removeWeatherEffects() {
        $("#rain").remove();
    }

    // Set random rain time and duration every day
    setRandomRain();

    // Reset the random rain schedule every day at midnight
    setInterval(setRandomRain, 86400000); // 86400000 ms = 24 hours

    // Run the color and weather effect update every minute
    setInterval(changeColor, 60000);

    // Execute immediately on page load
    changeColor();
})();
