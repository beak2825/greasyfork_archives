// ==UserScript==
// @name         BloxEmpire Giveaway Auto Clicker (Hover Then Click)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically hover over and click the "Join the giveaway!" button every hour with delay after reload
// @author       r3velo
// @match        https://bloxempire.com/hourly-gw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525810/BloxEmpire%20Giveaway%20Auto%20Clicker%20%28Hover%20Then%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525810/BloxEmpire%20Giveaway%20Auto%20Clicker%20%28Hover%20Then%20Click%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the "Join the giveaway!" button after hovering for 1 second
    function hoverAndClickButton() {
        let button = document.querySelector('.hourly_hourlyPage__M2DGv .hourly_topPart__2RzT_ .hourly_contentAndGlow__jThxc .hourly_content__fC4hK .hourly_joinBtn__WNs5N');

        if (button) {
            // Simulate hovering over the button
            let hoverEvent = new MouseEvent('mouseenter', {
                bubbles: true,
                cancelable: true,
                view: window
            });

            button.dispatchEvent(hoverEvent);
            console.log('Hovered over the button.');

            // Wait for 1 second before clicking the button
            setTimeout(() => {
                // Simulate a click after hovering
                let clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                button.dispatchEvent(clickEvent);
                console.log('Button clicked!');
            }, 1000); // 1 second delay before clicking
        } else {
            console.log('Button not found.');
        }
    }

    // Function to delay the hover and click after the page loads (delay 2 seconds)
    function delayedHoverAndClick() {
        setTimeout(() => {
            hoverAndClickButton();
        }, 2000); // Wait for 2 seconds before hovering and clicking
    }

    // Trigger delayed hover and click when the DOM content is loaded (after page reload)
    document.addEventListener('DOMContentLoaded', delayedHoverAndClick);

    // Click the button immediately when the script runs
    hoverAndClickButton();

    // Set an interval to refresh the page and hover & click the button every hour (3600000 milliseconds)
    setInterval(() => {
        // Refresh the page
        location.reload();
    }, 3600000); // Refresh every hour
})();
