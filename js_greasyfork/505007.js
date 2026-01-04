// ==UserScript==
// @name         Redbubble Auto Fav+
// @namespace    https://greasyfork.org/en/scripts/505007-redbubble-auto-fav
// @version      1.28
// @description  Redbubble Auto Fav with customizable settings
// @author       YAD
// @match        https://www.redbubble.com/*
// @license      NO-REDISTRIBUTION
// @grant        none
// @icon         https://www.redbubble.com/boom/public/favicons/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/505007/Redbubble%20Auto%20Fav%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/505007/Redbubble%20Auto%20Fav%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let likeQueue = [];
    let currentLikeIndex = 0;
    let delayBetweenClicks = 1500; // 1.5 seconds delay between clicks
    let maxLikes = 250; // Maximum number of likes before stopping
    let likesCount = 0;
    let autoNextEnabled = false; // Auto-next page toggle, default is off
    let lastLikeTime = 0; // Timestamp for the last like

    // Function to get page info
    function getPageInfo() {
        const paginationElement = document.querySelector('span.styles_box__54ba70e3.styles_text__5c7a80ef.styles_body__5c7a80ef.styles_muted__5c7a80ef.styles_textAlignCenter__54ba70e3');
        if (paginationElement) {
            return paginationElement.textContent.trim();
        }
        return 'Page info not available';
    }

    // Function to update the page info display in the settings modal
    function updatePageInfo() {
        const pageInfoLabel = settingsModal.querySelector('div');
        if (pageInfoLabel) {
            pageInfoLabel.innerText = getPageInfo();
        }
    }

    // Create a container for the shadow DOM
    const shadowHost = document.createElement('div');
    shadowHost.style.position = 'fixed';
    shadowHost.style.bottom = '20px';
    shadowHost.style.right = '20px';
    shadowHost.style.zIndex = '999999';
    shadowHost.style.pointerEvents = 'none';
    document.body.appendChild(shadowHost);

    // Attach shadow DOM
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    // Create the start/pause button inside shadow DOM
    const button = document.createElement('button');
    button.innerText = 'Start';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#ff596f';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.textAlign = 'center';
    button.style.lineHeight = '50px';
    button.style.pointerEvents = 'auto';
    shadowRoot.appendChild(button);

    // Create the settings button (gear icon) outside the shadow DOM
    const settingsButton = document.createElement('button');
    settingsButton.innerText = '⚙️';
    settingsButton.style.position = 'fixed';
    settingsButton.style.right = '4px';
    settingsButton.style.bottom = '45px';
    settingsButton.style.width = '25px';
    settingsButton.style.height = '25px';
    settingsButton.style.backgroundColor = '#ff596f';
    settingsButton.style.color = '#fff';
    settingsButton.style.fontSize = '10px';
    settingsButton.style.border = 'none';
    settingsButton.style.borderRadius = '50%';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.zIndex = '999997';
    document.body.appendChild(settingsButton);

    // Create settings modal
    const settingsModal = document.createElement('div');
    settingsModal.style.display = 'none';
    settingsModal.style.position = 'fixed';
    settingsModal.style.right = '20px';
    settingsModal.style.bottom = '80px';
    settingsModal.style.width = '250px';
    settingsModal.style.backgroundColor = '#ffd8e2';
    settingsModal.style.border = '1px solid #ccc';
    settingsModal.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    settingsModal.style.padding = '15px';
    settingsModal.style.zIndex = '999998';

    // Add page info label
    const pageInfoLabel = document.createElement('div');
    pageInfoLabel.style.fontSize = '12px';
    pageInfoLabel.style.color = '#333';
    pageInfoLabel.style.marginBottom = '10px';
    pageInfoLabel.innerText = getPageInfo();  // Set the initial page info
    settingsModal.appendChild(pageInfoLabel); // Add page info to the top of the settings modal

    // Create other settings elements
    const intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.value = delayBetweenClicks;
    intervalInput.style.width = '100%';
    intervalInput.style.marginBottom = '10px';
    const intervalLabel = document.createElement('label');
    intervalLabel.innerText = 'Interval (ms):';

    const maxLikesInput = document.createElement('input');
    maxLikesInput.type = 'number';
    maxLikesInput.value = maxLikes;
    maxLikesInput.style.width = '100%';
    const maxLikesLabel = document.createElement('label');
    maxLikesLabel.innerText = 'Max Likes:';

    const autoNextCheckbox = document.createElement('input');
    autoNextCheckbox.type = 'checkbox';
    autoNextCheckbox.style.marginBottom = '10px';
    const autoNextLabel = document.createElement('label');
    autoNextLabel.innerText = 'Auto-Next Page:';

    const randomLikeCheckbox = document.createElement('input');
    randomLikeCheckbox.type = 'checkbox';
    randomLikeCheckbox.style.marginBottom = '10px';
    const randomLikeLabel = document.createElement('label');
    randomLikeLabel.innerText = 'Random Liking:';

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.style.marginTop = '10px';
    saveButton.style.width = '100%';
    saveButton.style.backgroundColor = '#ff596f';
    saveButton.style.color = '#fff';
    saveButton.style.border = 'none';
    saveButton.style.cursor = 'pointer';

    // Append elements to the modal
    settingsModal.appendChild(intervalLabel);
    settingsModal.appendChild(intervalInput);
    settingsModal.appendChild(maxLikesLabel);
    settingsModal.appendChild(maxLikesInput);
    settingsModal.appendChild(autoNextCheckbox);
    settingsModal.appendChild(autoNextLabel);

    const breakLine = document.createElement('br');
    settingsModal.appendChild(breakLine); // Add line break for spacing

    settingsModal.appendChild(randomLikeCheckbox);
    settingsModal.appendChild(randomLikeLabel);
    settingsModal.appendChild(saveButton);
    document.body.appendChild(settingsModal);

    // Toggle the settings modal visibility
    settingsButton.addEventListener('click', () => {
        settingsModal.style.display = settingsModal.style.display === 'none' ? 'block' : 'none';
    });

    // Save settings and close modal
    saveButton.addEventListener('click', () => {
        delayBetweenClicks = parseInt(intervalInput.value, 10);
        maxLikes = parseInt(maxLikesInput.value, 10);
        autoNextEnabled = autoNextCheckbox.checked;
        settingsModal.style.display = 'none';
    });

    // Function to start the liking process
    function startLiking() {
        const likeButtons = document.querySelectorAll('button[data-testid="add-to-list-button"], button[data-testid="favorite-button"]');
        likeQueue = Array.from(likeButtons).filter(button => !button.querySelector('img[data-testid="favourite-icon-remove"]'));

        if (likeQueue.length > 0) {
                        currentLikeIndex = 0;
            processNextLike();
        } else if (autoNextEnabled) {
            goToNextPage();
        } else {
            isRunning = false;
            button.innerText = 'Start';
        }
    }

    // Function to process the next button in the queue with a delay
    function processNextLike() {
        if (!isRunning || likesCount >= maxLikes) {
            isRunning = false;
            button.innerText = 'Start';
            return;
        }

        const now = Date.now();

        // Ensure a minimum delay between likes
        if (now - lastLikeTime >= delayBetweenClicks) {
            if (currentLikeIndex < likeQueue.length) {
                try {
                    const likeButton = likeQueue[currentLikeIndex];
                    likeButton.click();
                    lastLikeTime = now;  // Update the last like time
                    currentLikeIndex++;
                    likesCount++;
                    button.innerText = likesCount; // Update button text with the like count
                    requestAnimationFrame(() => setTimeout(processNextLike, delayBetweenClicks));
                } catch (error) {
                    console.error("Error clicking like button", error);
                }
            } else if (autoNextEnabled) {
                goToNextPage();
            } else {
                isRunning = false;
                button.innerText = 'Start';
            }
        } else {
            // If the delay hasn't passed, wait a bit and then check again
            requestAnimationFrame(() => setTimeout(processNextLike, 50));
        }
    }

    // Function to go to the next page if the next button is available
    function goToNextPage() {
        const nextButton = document.querySelector('button[title="Next"][class*="styles_button"]');
        if (nextButton) {
            nextButton.click();
            setTimeout(() => {
                updatePageInfo(); // Update the page info
                startLiking();
            }, delayBetweenClicks + 6000); // Adjusted delay to account for page load time
        } else {
            isRunning = false;
            button.innerText = 'Start';
        }
    }

    // Toggle start/pause on button click
    button.addEventListener('click', function() {
        if (isRunning) {
            isRunning = false;
            button.innerText = 'Start';
        } else {
            isRunning = true;
            lastLikeTime = Date.now(); // Reset the last like time
            button.innerText = likesCount; // Reset the counter display
            startLiking();
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        console.log('Page loaded and script initialized');
    });
})();

