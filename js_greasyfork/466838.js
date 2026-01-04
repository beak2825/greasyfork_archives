// ==UserScript==
// @name         Roblox RGB Color Wheel Effect for Buttons
// @namespace    roblox color wheel effect
// @version      1.2
// @description  Adds a color wheel effect to the play button and the purchase button on Roblox game pages.             
// @author       letsplayto 1
// @match        https://www.roblox.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/466838/Roblox%20RGB%20Color%20Wheel%20Effect%20for%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/466838/Roblox%20RGB%20Color%20Wheel%20Effect%20for%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var hue = 0; // Initial hue value

    function updateButtonColor() {
        var color = `hsl(${hue}, 100%, 50%)`;
        var style = `
            button.btn-full-width.btn-common-play-game-lg.btn-primary-md.btn-min-width,
            button.btn-growth-lg.btn-fixed-width-lg.PurchaseButton {
                background-color: ${color};
            }
        `;
        GM_addStyle(style);
    }

    function rotateHue() {
        hue = (hue + 1) % 360; // Increase hue by 1 and wrap around at 360
        updateButtonColor();
    }

    // Update button color initially
    updateButtonColor();

    // Start rotating hue
    setInterval(rotateHue, 50); // Adjust the interval duration for desired speed
})();