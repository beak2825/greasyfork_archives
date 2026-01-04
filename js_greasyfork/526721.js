// ==UserScript==
// @name         Pet Whipper 2.1
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Whip GIF animation and continuous exclamation marks on avatar click.
// @author       Animaker
// @match        https://gazellegames.net/*
// @icon         https://icons.duckduckgo.com/ip3/gazellegames.net.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526721/Pet%20Whipper%2021.user.js
// @updateURL https://update.greasyfork.org/scripts/526721/Pet%20Whipper%2021.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Select all avatar images
    const avatarImages = document.querySelectorAll('img[alt*="avatar"]');
    if (avatarImages.length === 0) {
        console.error('No avatar images found!');
        return;
    }

    // Create the GIF overlay
    const gifOverlay = document.createElement("img");
    gifOverlay.src = "https://ptpimg.me/hrvis6.gif"; // Whip GIF URL
    gifOverlay.title = "whip";
    gifOverlay.style.position = "absolute";
    gifOverlay.style.display = "none";
    gifOverlay.style.zIndex = "1000";
    gifOverlay.style.pointerEvents = "none"; // Prevent interference with clicks
    document.body.appendChild(gifOverlay);

    // Function to add animated red exclamations around a specific image
    function addExclamations(targetImage) {
        const exclamationContainer = document.createElement("div");
        exclamationContainer.style.position = "absolute";
        exclamationContainer.style.top = targetImage.getBoundingClientRect().top + window.scrollY + "px";
        exclamationContainer.style.left = targetImage.getBoundingClientRect().left + window.scrollX + "px";
        exclamationContainer.style.width = targetImage.offsetWidth + "px";
        exclamationContainer.style.height = targetImage.offsetHeight + "px";
        exclamationContainer.style.pointerEvents = "none"; // Prevent interference with clicks
        exclamationContainer.style.zIndex = "1001";

        // Generate exclamations
        for (let i = 0; i < 8; i++) {
            const exclamation = document.createElement("span");
            exclamation.textContent = "!!";
            exclamation.style.position = "absolute";
            exclamation.style.color = "red";
            exclamation.style.fontSize = "24px";
            exclamation.style.fontWeight = "bold";
            exclamation.style.transform = `rotate(${Math.random() * 360}deg)`;
            exclamation.style.animation = "floatUp 1s ease-out forwards";

            // Random positioning around the image
            const randomX = Math.random() * targetImage.offsetWidth - targetImage.offsetWidth / 2;
            const randomY = Math.random() * targetImage.offsetHeight - targetImage.offsetHeight / 2;
            exclamation.style.left = `${50 + randomX}%`;
            exclamation.style.top = `${50 + randomY}%`;

            exclamationContainer.appendChild(exclamation);
        }

        document.body.appendChild(exclamationContainer);

        // Remove exclamations after animation
        setTimeout(() => {
            exclamationContainer.remove();
        }, 1000);
    }

    // Function to play the GIF and trigger exclamations repeatedly for the clicked image
    function playGifWithExclamations(event) {
        const targetImage = event.target;

        // Position the GIF dynamically
        const rect = targetImage.getBoundingClientRect();
        gifOverlay.style.top = rect.top + window.scrollY + "px";
        gifOverlay.style.left = rect.left + window.scrollX + "px";
        gifOverlay.style.width = rect.width + "px";
        gifOverlay.style.height = rect.height + "px";

        // Show the GIF
        gifOverlay.style.display = 'block';

        // Set up repeated exclamations
        const exclamationInterval = 250; // Trigger exclamations every 250ms
        const gifDuration = 3000; // Duration of the GIF in milliseconds
        const intervalId = setInterval(() => {
            addExclamations(targetImage);
        }, exclamationInterval);

        // Hide the GIF and stop exclamations after the duration
        setTimeout(() => {
            gifOverlay.style.display = 'none';
            clearInterval(intervalId);
        }, gifDuration);
    }

    // Add CSS for the floating animation
    const style = document.createElement("style");
    style.textContent = `
        @keyframes floatUp {
            0% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            100% {
                opacity: 0;
                transform: scale(1.5) translateY(-30px);
            }
        }
    `;
    document.head.appendChild(style);

    // Add click event listener to each avatar image
    avatarImages.forEach(image => {
        image.addEventListener('click', playGifWithExclamations);
    });
})();
