// ==UserScript==
// @name         Enhanced Space Theme
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add an enhanced space theme with customizable twinkling and non-twinkling stars to all websites, now with a global dark mode.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487056/Enhanced%20Space%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/487056/Enhanced%20Space%20Theme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const starColors = {
        twinkling: '#ffffff', // Customizable color for twinkling stars
        nonTwinkling: '#ffffff', // Customizable color for non-twinkling stars
    };

    let isSpaceThemeEnabled = true;

    function getRandomPosition() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const x = Math.random() * screenWidth;
        const y = Math.random() * screenHeight;
        return { x, y };
    }

    function createStar(isTwinkling) {
        const star = document.createElement('div');
        star.className = isTwinkling ? 'twinkling-star' : 'non-twinkling-star';
        star.style.backgroundColor = isTwinkling ? starColors.twinkling : starColors.nonTwinkling;
        const position = getRandomPosition();
        star.style.left = `${position.x}px`;
        star.style.top = `${position.y}px`;
        return star;
    }

    function addStarsToPage() {
        const numberOfTwinklingStars = 50;
        const numberOfNonTwinklingStars = 30;

        // Add twinkling stars
        for (let i = 0; i < numberOfTwinklingStars; i++) {
            document.body.appendChild(createStar(true));
        }

        // Add non-twinkling stars
        for (let i = 0; i < numberOfNonTwinklingStars; i++) {
            document.body.appendChild(createStar(false));
        }
    }

    function toggleSpaceTheme() {
        const stars = document.querySelectorAll('.twinkling-star, .non-twinkling-star');

        if (isSpaceThemeEnabled) {
            stars.forEach(star => star.style.animation = 'none'); // Pause animation
        } else {
            stars.forEach(star => star.style.animation = 'twinkling 1s infinite'); // Resume animation
        }

        isSpaceThemeEnabled = !isSpaceThemeEnabled;
    }

    // Add stars to the page
    addStarsToPage();

    // Add styles for twinkling and non-twinkling stars, and global dark mode
    const style = document.createElement('style');
    style.innerHTML = `
        body {
            background-color: #000000; /* Global dark mode background color */
        }

        .twinkling-star, .non-twinkling-star {
            position: fixed;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            transition: opacity 0.5s ease; /* Smooth fading effect */
        }

        .twinkling-star {
            opacity: ${isSpaceThemeEnabled ? 0 : 1}; /* Initial opacity based on theme status */
            animation: twinkling 1s infinite;
        }

        @keyframes twinkling {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Toggle space theme on click
    document.body.addEventListener('click', toggleSpaceTheme);

})();
