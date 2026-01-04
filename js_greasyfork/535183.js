// ==UserScript==
// @name         Greasy Fork Code Copy Button (AFU IT)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a single floating copy button with a notification from code container on Greasy Fork
// @author       AFU IT
// @match        https://greasyfork.org/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535183/Greasy%20Fork%20Code%20Copy%20Button%20%28AFU%20IT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535183/Greasy%20Fork%20Code%20Copy%20Button%20%28AFU%20IT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and add copy buttons
    function addCopyButtons() {
        // Find all code containers that don't already have a button
        const codeContainers = document.querySelectorAll('div.code-container:not(.has-copy-button)');

        codeContainers.forEach(container => {
            // Mark this container as processed
            container.classList.add('has-copy-button');

            // Create the button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.flexDirection = 'column';
            buttonContainer.style.alignItems = 'center';

            // Create the floating button
            const floatingButton = document.createElement('button');
            floatingButton.className = 'copy-code-button';
            floatingButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            floatingButton.style.width = '35px';
            floatingButton.style.height = '35px';
            floatingButton.style.display = 'flex';
            floatingButton.style.alignItems = 'center';
            floatingButton.style.justifyContent = 'center';
            floatingButton.style.backgroundColor = 'rgba(51, 51, 51, 0.7)';
            floatingButton.style.color = 'white';
            floatingButton.style.border = '1px solid #222';
            floatingButton.style.borderRadius = '4px';
            floatingButton.style.cursor = 'pointer';
            floatingButton.style.zIndex = '1000';
            floatingButton.title = 'Copy code';

            // Create notification text
            const notification = document.createElement('div');
            notification.textContent = 'Copied!';
            notification.style.color = 'white';
            notification.style.backgroundColor = 'rgba(51, 51, 51, 0.7)';
            notification.style.padding = '2px 5px';
            notification.style.borderRadius = '1px';
            notification.style.fontSize = '7px';
            notification.style.marginTop = '3px';
            notification.style.display = 'none';
            notification.style.fontWeight = 'normal';
            notification.style.letterSpacing = '0.3px';
            notification.style.fontFamily = 'Arial, sans-serif';

            // Add hover effect
            floatingButton.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(51, 51, 51, 1)';
            });

            floatingButton.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'rgba(51, 51, 51, 0.7)';
            });

            // Add click event
            floatingButton.addEventListener('click', function() {
                const pre = container.querySelector('pre');
                if (pre) {
                    let codeText = '';
                    const codeLines = pre.querySelectorAll('li');
                    if (codeLines.length > 0) {
                        codeLines.forEach(line => {
                            codeText += line.textContent + '\n';
                        });
                    } else {
                        codeText = pre.textContent;
                    }

                    navigator.clipboard.writeText(codeText).then(() => {
                        // Change button icon to tick
                        floatingButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

                        // Show notification
                        notification.style.display = 'block';

                        // Reset after 2 seconds
                        setTimeout(() => {
                            floatingButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                            notification.style.display = 'none';
                        }, 2000);
                    });
                }
            });

            // Add button and notification to container
            buttonContainer.appendChild(floatingButton);
            buttonContainer.appendChild(notification);

            // Create a wrapper div for the floating button
            const floatingWrapper = document.createElement('div');
            floatingWrapper.style.position = 'sticky';
            floatingWrapper.style.top = '10px';
            floatingWrapper.style.float = 'right';
            floatingWrapper.style.marginRight = '10px';
            floatingWrapper.style.zIndex = '999';
            floatingWrapper.appendChild(buttonContainer);

            // Insert at the beginning of the container
            container.insertBefore(floatingWrapper, container.firstChild);
        });
    }

    // Run on page load
    setTimeout(addCopyButtons, 1000);

    // Run again periodically to catch any new code blocks
    setInterval(addCopyButtons, 3000);
})();
