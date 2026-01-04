// ==UserScript==
// @name         Perplexity.ai Limits Overlay (Dark Mode, Draggable)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Overlays various limit values on Perplexity.ai main and search pages, updates on submit
// @match        https://www.perplexity.ai/
// @match        https://www.perplexity.ai/search*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/507664/Perplexityai%20Limits%20Overlay%20%28Dark%20Mode%2C%20Draggable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507664/Perplexityai%20Limits%20Overlay%20%28Dark%20Mode%2C%20Draggable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the limits box
    const limitsBox = document.createElement('div');
    limitsBox.id = 'limits-box';
    limitsBox.style.cssText = `
        position: fixed;
        right: 20px;
        top: 20px;
        background-color: rgba(30, 30, 30, 0.9);
        color: #ffffff;
        border: 1px solid #444;
        border-radius: 5px;
        padding: 10px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 9999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        cursor: move;
        user-select: none;
    `;

    // Function to fetch and display the limits
    async function displayLimits() {
        try {
            const response = await fetch('https://www.perplexity.ai/rest/user/settings');
            const data = await response.json();

            const limits = [
                { label: "Messages Limit:", value: data.gpt4_limit },
                { label: "Document Upload Limit:", value: data.upload_limit },
                { label: "Image Upload Limit:", value: data.article_image_upload_limit },
                { label: "Image Generation Limit:", value: data.create_limit },
                { label: "Page Creation Limit:", value: data.pages_limit }
            ];

            const table = document.createElement('table');
            table.style.borderCollapse = 'collapse';
            table.style.width = '100%';

            limits.forEach(limit => {
                const row = table.insertRow();
                const labelCell = row.insertCell(0);
                const valueCell = row.insertCell(1);

                labelCell.textContent = limit.label;
                labelCell.style.textAlign = 'left';
                labelCell.style.paddingRight = '10px';

                valueCell.textContent = limit.value;
                valueCell.style.textAlign = 'right';
            });

            limitsBox.innerHTML = '';
            limitsBox.appendChild(table);
        } catch (error) {
            console.error('Error fetching limits:', error);
        }
    }

    // Add the limits box to the page
    document.body.appendChild(limitsBox);

    // Initial update
    displayLimits();

    // Make the box vertically draggable
    let isDragging = false;
    let currentY, initialY;
    let yOffset = GM_getValue('yOffset', 0);

    function setPosition() {
        const maxY = window.innerHeight - limitsBox.offsetHeight;
        yOffset = Math.max(0, Math.min(yOffset, maxY));
        limitsBox.style.transform = `translateY(${yOffset}px)`;
        GM_setValue('yOffset', yOffset);
    }

    function dragStart(e) {
        initialY = e.clientY - yOffset;
        isDragging = true;
    }

    function dragEnd() {
        isDragging = false;
        setPosition();
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentY = e.clientY - initialY;
            yOffset = currentY;
            setPosition();
        }
    }

    // Set initial position
    setPosition();

    limitsBox.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Function to update limits on submit
    function updateOnSubmit() {
        console.log('Update triggered');
        // Add a 2-second delay before fetching updated limits
        setTimeout(() => {
            displayLimits();
        }, 3000);
    }

    // Listen for Enter key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            updateOnSubmit();
        }
    });

    // Function to add listener to submit button
    function addSubmitListener() {
        const submitButton = document.querySelector('button[aria-label="Submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', updateOnSubmit);
            console.log('Submit button listener added');
        } else {
            // If button not found, try again after a short delay
            setTimeout(addSubmitListener, 1000);
        }
    }

    // Call this function when the page loads
    addSubmitListener();

    // Also add a MutationObserver to watch for dynamically added submit buttons
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const submitButton = node.querySelector('button[aria-label="Submit"]');
                        if (submitButton) {
                            submitButton.addEventListener('click', updateOnSubmit);
                            console.log('Submit button listener added to dynamically created button');
                        }
                    }
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
