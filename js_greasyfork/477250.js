// ==UserScript==
// @name         Auto Click 'Pass' and 'Like' Buttons on boo.world
// @namespace    https://github.com/Maxhem2/BooWeb-MatchKeyboardSupport
// @version      1.0
// @description  Click the 'Pass' button when pressing 'x' key and the 'Like' button when pressing 'd' key on boo.world
// @match        https://boo.world/de/match
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477250/Auto%20Click%20%27Pass%27%20and%20%27Like%27%20Buttons%20on%20booworld.user.js
// @updateURL https://update.greasyfork.org/scripts/477250/Auto%20Click%20%27Pass%27%20and%20%27Like%27%20Buttons%20on%20booworld.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clicking = false; // Flag to track whether clicking is active

    // Add an event listener to listen for key presses
    window.addEventListener('keydown', function(event) {
        if (event.key === 'x' && !clicking) {
            clicking = true;
            clickUntilDOMChange('.action-button-large.clickable.hoverable.hover-grow-size-5.active-shrink-size img[src="/static/match_icons/pass.svg"]');
        } else if (event.key === 'd' && !clicking) {
            clicking = true;
            clickUntilDOMChange('.action-button-large.clickable.hoverable.hover-grow-size-5.active-shrink-size img[src="/static/match_icons/favorite.svg"]');
        }
    });

    function clickUntilDOMChange(selector) {
        const button = document.querySelector(selector);

        if (button) {
            const initialDOM = document.documentElement.outerHTML; // Get the initial DOM content

            const clickInterval = setInterval(() => {
                button.parentElement.click(); // Click the parent element containing the image

                // Check for DOM changes
                if (initialDOM !== document.documentElement.outerHTML) {
                    clicking = false; // Stop clicking
                    clearInterval(clickInterval);
                }
            }, 10); // Click every 10ms
        }
    }
})();