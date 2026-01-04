// ==UserScript==
// @name         Disable Scamming Node Animations
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes animations from SVG elements in the web game to improve performance
// @author       TheProfessor [1425134]
// @match        https://www.torn.com/loader.php?sid=crimes#/scamming
// @license      MIT
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com

// @downloadURL https://update.greasyfork.org/scripts/520424/Disable%20Scamming%20Node%20Animations.user.js
// @updateURL https://update.greasyfork.org/scripts/520424/Disable%20Scamming%20Node%20Animations.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to disable animations
    const disableAnimations = () => {
        // Select all SVG elements and child elements
        const svgElements = document.querySelectorAll('svg, svg *');

        svgElements.forEach((el) => {
            // Remove animation-related attributes
            el.removeAttribute('animation');
            el.removeAttribute('animatetransform');
            el.removeAttribute('keyframes');
            el.removeAttribute('dur');
            el.removeAttribute('begin');
            el.removeAttribute('repeatCount');

            // Disable CSS-based animations and transitions
            el.style.animation = 'none';
            el.style.transition = 'none';
        });

        // Remove animation-related classes if any
        const animatedElements = document.querySelectorAll('.animated, .animation-class');
        animatedElements.forEach((el) => {
            el.classList.remove('animated', 'animation-class');
        });

        console.log('Animations disabled on Torn Crimes Scamming page');
    };

    // Run when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        disableAnimations();

        // Monitor for dynamically added elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    disableAnimations();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
})();