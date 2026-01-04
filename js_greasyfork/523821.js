// ==UserScript==
// @name            Reddit Bigger Carousel
// @description     Modifies the Reddit's carousel to change the carousel height
// @version         1.0.0
// @author          BreatFR
// @match           https://www.reddit.com/*
// @copyright       2025, BreatFR (https://breat.fr)
// @grant           none
// @namespace       https://gitlab.com/breatfr
// @homepageURL     https://gitlab.com/breatfr/reddit
// @icon            https://www.redditstatic.com/shreddit/assets/favicon/192x192.png
// @supportURL      https://discord.gg/Q8KSHzdBxs
// @license         AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/523821/Reddit%20Bigger%20Carousel.user.js
// @updateURL https://update.greasyfork.org/scripts/523821/Reddit%20Bigger%20Carousel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify the carousel-style attribute
    function modifyCarouselStyle() {
        // Select all elements with the carousel-style attribute
        const carouselElements = document.querySelectorAll('[carousel-style]');

        carouselElements.forEach(element => {
            // Replace the value of the carousel-style attribute
            const currentStyle = element.getAttribute('carousel-style');
            const newStyle = currentStyle.replace(/max-height:\s*\d+px;/, 'max-height: 100%;');
            element.setAttribute('carousel-style', newStyle);
        });
    }

    // Execute the function after the page loads
    window.addEventListener('load', modifyCarouselStyle);

    // Execute the function periodically every 500 milliseconds
    setInterval(modifyCarouselStyle, 500);
})();
