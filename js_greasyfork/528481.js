// ==UserScript==
// @name         Aniworld Next Episode Button (Fixed v2)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a Netflix-style "Next Episode" button to Aniworld
// @author       You
// @match        https://aniworld.to/anime/stream/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528481/Aniworld%20Next%20Episode%20Button%20%28Fixed%20v2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528481/Aniworld%20Next%20Episode%20Button%20%28Fixed%20v2%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const BUTTON_TEXT = "Next Episode";
    const BUTTON_STYLE = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background-color: #040720;
        color: white;
        border: none;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
        z-index: 9999;
        opacity: 0.9;
        transition: opacity 0.3s ease;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    `;

    // Function to add the Next Episode button
    function addNextEpisodeButton() {
        // Remove existing button if it exists
        const existingButton = document.getElementById('netflix-style-next-button');
        if (existingButton) {
            existingButton.remove();
        }

        // Create the button element
        const button = document.createElement('button');
        button.textContent = BUTTON_TEXT;
        button.style.cssText = BUTTON_STYLE;
        button.id = "netflix-style-next-button";

        // Hover effect
        button.addEventListener('mouseover', () => {
            button.style.opacity = '1';
        });
        button.addEventListener('mouseout', () => {
            button.style.opacity = '0.9';
        });

        // Add click event listener
        button.addEventListener('click', navigateToNextEpisode);

        // Add the button to the page
        document.body.appendChild(button);

        console.log("Added Next Episode button");
    }

    // Function to navigate to the next episode
    function navigateToNextEpisode() {
        console.log("Next Episode button clicked");

        // Instead of trying to determine the current episode in complex ways,
        // let's directly look at the episode numbers and find the one with different styling

        // First, get all the episode links from the episode section
        const episodeContainer = document.querySelector('.hosterSiteDirectNav') ||
                               document.querySelector('.episodenav');

        if (!episodeContainer) {
            console.error("Could not find episode container");
            return;
        }

        // Get all episode links
        const episodeLinks = Array.from(episodeContainer.querySelectorAll('a'));

        if (!episodeLinks || episodeLinks.length === 0) {
            console.error("Could not find episode links");
            return;
        }

        console.log("Found", episodeLinks.length, "episode links");

        // Find the currently active episode based on styling
        let activeLink = null;
        let activeIndex = -1;

        // Method 1: Look for any link with a blue/dark background color
        episodeLinks.forEach((link, index) => {
            const style = window.getComputedStyle(link);
            const bgColor = style.backgroundColor;

            // Check if background color is not transparent, white, or black
            if (bgColor !== 'transparent' &&
                bgColor !== 'rgba(0, 0, 0, 0)' &&
                bgColor !== 'rgb(255, 255, 255)' &&
                bgColor !== 'rgb(0, 0, 0)') {

                console.log("Found active episode with bg color:", bgColor, "at index:", index, "text:", link.textContent.trim());
                activeLink = link;
                activeIndex = index;
            }
        });

        // Method 2: If not found by background, check if any link has an 'active' class
        if (!activeLink) {
            episodeLinks.forEach((link, index) => {
                if (link.classList.contains('active') ||
                    link.parentElement.classList.contains('active')) {

                    console.log("Found active episode with active class at index:", index, "text:", link.textContent.trim());
                    activeLink = link;
                    activeIndex = index;
                }
            });
        }

        // Method 3: Direct comparison of the parent containers
        if (!activeLink) {
            // Get all number containers (parent elements of links)
            const episodeNumbers = Array.from(episodeContainer.children);

            episodeNumbers.forEach((numContainer, index) => {
                const link = numContainer.querySelector('a');
                if (!link) return;

                const style = window.getComputedStyle(numContainer);
                const bgColor = style.backgroundColor;

                if (bgColor !== 'transparent' &&
                    bgColor !== 'rgba(0, 0, 0, 0)' &&
                    bgColor !== 'rgb(255, 255, 255)' &&
                    bgColor !== 'rgb(0, 0, 0)') {

                    console.log("Found active container with bg color:", bgColor, "at index:", index, "text:", link.textContent.trim());
                    activeLink = link;
                    activeIndex = index;
                }
            });
        }

        // If still not found, try one more approach - find a link with text color different from others
        if (!activeLink) {
            const firstLinkColor = window.getComputedStyle(episodeLinks[0]).color;

            episodeLinks.forEach((link, index) => {
                const style = window.getComputedStyle(link);
                if (style.color !== firstLinkColor) {
                    console.log("Found active episode with different text color at index:", index, "text:", link.textContent.trim());
                    activeLink = link;
                    activeIndex = index;
                }
            });
        }

        // If still not found, try to directly get the current episode number from the URL
        if (!activeLink) {
            // Try to extract episode number from URL
            const urlMatch = window.location.href.match(/\/episode-(\d+)/);
            if (urlMatch && urlMatch[1]) {
                const currentEpisodeNum = parseInt(urlMatch[1], 10);
                console.log("Extracted episode number from URL:", currentEpisodeNum);

                // Find the link with this number
                episodeLinks.forEach((link, index) => {
                    if (link.textContent.trim() === currentEpisodeNum.toString()) {
                        console.log("Found active episode from URL at index:", index);
                        activeLink = link;
                        activeIndex = index;
                    }
                });
            }
        }

        // Finally, if we still haven't found an active link, just use the first link as a fallback
        if (!activeLink && episodeLinks.length > 0) {
            // Last resort: Just try to directly click the next number in sequence
            // Get all the episode numbers
            const episodeNumbers = episodeLinks.map(link => {
                const num = parseInt(link.textContent.trim(), 10);
                return isNaN(num) ? 0 : num;
            });

            // Find the highest visible episode number on the page
            const currentEpisodeNum = Math.max(...episodeNumbers.filter(num => num > 0));
            console.log("Current highest episode number found:", currentEpisodeNum);

            // Try to click the next episode number
            const nextEpisodeNum = currentEpisodeNum + 1;

            // Find link with the next episode number
            let nextLink = null;
            episodeLinks.forEach(link => {
                if (link.textContent.trim() === nextEpisodeNum.toString()) {
                    nextLink = link;
                }
            });

            if (nextLink) {
                console.log("Directly clicking next episode number:", nextEpisodeNum);
                nextLink.click();
                return;
            } else {
                console.error("Could not find next episode link");
                return;
            }
        }

        // Now that we have the active episode, get the next one
        if (activeLink && activeIndex !== -1 && activeIndex < episodeLinks.length - 1) {
            const nextEpisodeLink = episodeLinks[activeIndex + 1];
            console.log("Next episode found at index:", activeIndex + 1, "text:", nextEpisodeLink.textContent.trim());

            // Click the next episode link
            nextEpisodeLink.click();
        } else if (activeLink) {
            // We're at the last episode of this season, try to go to next season
            const seasonContainer = document.querySelector('.staffelWrapperLoop') ||
                                   document.querySelector('.seasonNav');

            if (seasonContainer) {
                const seasonLinks = Array.from(seasonContainer.querySelectorAll('a'));
                let activeSeasonLink = null;
                let activeSeasonIndex = -1;

                // Find active season
                seasonLinks.forEach((link, index) => {
                    const style = window.getComputedStyle(link);
                    const bgColor = style.backgroundColor;

                    if (bgColor !== 'transparent' &&
                        bgColor !== 'rgba(0, 0, 0, 0)' &&
                        bgColor !== 'rgb(255, 255, 255)' &&
                        bgColor !== 'rgb(0, 0, 0)') {

                        activeSeasonLink = link;
                        activeSeasonIndex = index;
                    }
                });

                if (activeSeasonLink && activeSeasonIndex < seasonLinks.length - 1) {
                    // Go to next season, first episode
                    const nextSeasonLink = seasonLinks[activeSeasonIndex + 1];
                    console.log("Going to next season");
                    nextSeasonLink.click();
                } else {
                    alert("You've reached the last episode of the final season!");
                }
            } else {
                // Directly try to find episode by number
                const currentEpisodeText = activeLink.textContent.trim();
                const currentEpisodeNum = parseInt(currentEpisodeText, 10);

                if (!isNaN(currentEpisodeNum)) {
                    const nextEpisodeNum = currentEpisodeNum + 1;

                    // Try to find the next episode number in all links on the page
                    const allLinks = Array.from(document.querySelectorAll('a'));
                    const nextLink = allLinks.find(link => link.textContent.trim() === nextEpisodeNum.toString());

                    if (nextLink) {
                        console.log("Found next episode by number:", nextEpisodeNum);
                        nextLink.click();
                    } else {
                        alert("Could not find the next episode!");
                    }
                } else {
                    alert("Could not determine the next episode!");
                }
            }
        } else {
            alert("Could not determine the current episode!");
        }
    }

    // Create and add the button when the page is fully loaded
    function initializeButton() {
        setTimeout(addNextEpisodeButton, 1000);
    }

    // Wait for the page to fully load
    window.addEventListener('load', initializeButton);

    // Also run when page content changes (for single-page apps)
    const observer = new MutationObserver(function(mutations) {
        // If major DOM changes were detected, reinitialize the button
        let significantChanges = false;

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if significant elements were added
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === 1) { // Element node
                        if (node.classList &&
                            (node.classList.contains('hosterSiteDirectNav') ||
                             node.classList.contains('episodenav'))) {
                            significantChanges = true;
                            break;
                        }
                    }
                }
            }
        });

        if (significantChanges) {
            initializeButton();
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initialize immediately in case page is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeButton();
    }
})();