// ==UserScript==
// @name         Kogama Keyboard Injector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Injects an Apple-like keyboard script into Kogama game pages automatically, including within iframes.
// @author       YourName
// @match        *://www.kogama.com/*
// @match        *://friends.kogama.com/*
// @match        *://kogama.com.br/*
// @match        *://www.kogama.com.br/*
// @match        *://kogama.game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506455/Kogama%20Keyboard%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/506455/Kogama%20Keyboard%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and inject the keyboard script
    function injectKeyboardScript() {
        const script = document.createElement('script');
        script.textContent = `
            // Your custom keyboard script here
            
            // Create keyboard container
            const keyboardContainer = document.createElement('div');
            keyboardContainer.style.position = 'fixed';
            keyboardContainer.style.bottom = '20px';
            keyboardContainer.style.left = '50%';
            keyboardContainer.style.transform = 'translateX(-50%)';
            keyboardContainer.style.width = '95%';
            keyboardContainer.style.maxWidth = '1200px';
            keyboardContainer.style.height = '300px';
            keyboardContainer.style.backgroundColor = '#d4d4d4';  // Light grey background
            keyboardContainer.style.border = '1px solid #ccc';
            keyboardContainer.style.borderRadius = '15px';
            keyboardContainer.style.zIndex = '10000';
            keyboardContainer.style.display = 'none'; // Initially hidden
            keyboardContainer.style.padding = '10px';
            keyboardContainer.style.boxShadow = '0px 4px 15px rgba(0,0,0,0.2)';
            keyboardContainer.style.userSelect = 'none';
            keyboardContainer.style.fontFamily = 'sans-serif'; // Apple-like font
            document.body.appendChild(keyboardContainer);

            // Function to toggle keyboard visibility
            function toggleKeyboardVisibility() {
                if (keyboardContainer.style.display === 'none') {
                    keyboardContainer.style.display = 'block';
                } else {
                    keyboardContainer.style.display = 'none';
                }
            }

            // Detect if the user is on mobile or PC
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                // Mobile: Create open/close button
                const toggleButton = document.createElement('button');
                toggleButton.textContent = '⌨️ Open Keyboard';
                toggleButton.style.position = 'fixed';
                toggleButton.style.bottom = '330px';
                toggleButton.style.left = '10px';
                toggleButton.style.padding = '10px 20px';
                toggleButton.style.zIndex = '10001';
                toggleButton.style.backgroundColor = '#007aff';  // Apple blue color
                toggleButton.style.color = '#fff';
                toggleButton.style.border = 'none';
                toggleButton.style.borderRadius = '5px';
                toggleButton.style.fontSize = '16px';
                toggleButton.style.boxShadow = '0px 2px 5px rgba(0,0,0,0.2)';
                document.body.appendChild(toggleButton);

                // Toggle keyboard visibility when button is clicked
                toggleButton.addEventListener('click', () => {
                    toggleKeyboardVisibility();
                    toggleButton.textContent = keyboardContainer.style.display === 'none' ? '⌨️ Open Keyboard' : '⌨️ Close Keyboard';
                });
            } else {
                // PC: Listen for 'T' key press to toggle keyboard visibility
                document.addEventListener('keydown', (e) => {
                    if (e.key.toLowerCase() === 't') {
                        toggleKeyboardVisibility();
                    }
                });
            }

            // Draggable functionality for both cursor and touch
            let isDragging = false;
            let offsetX, offsetY;

            function startDrag(e) {
                isDragging = true;
                offsetX = e.clientX ? e.clientX - keyboardContainer.getBoundingClientRect().left : e.touches[0].clientX - keyboardContainer.getBoundingClientRect().left;
                offsetY = e.clientY ? e.clientY - keyboardContainer.getBoundingClientRect().top : e.touches[0].clientY - keyboardContainer.getBoundingClientRect().top;
            }

            function drag(e) {
                if (isDragging) {
                    const x = e.clientX ? e.clientX : e.touches[0].clientX;
                    const y = e.clientY ? e.clientY : e.touches[0].clientY;
                    keyboardContainer.style.left = \`\${x - offsetX}px\`;
                    keyboardContainer.style.top = \`\${y - offsetY}px\`;
                }
            }

            function stopDrag() {
                isDragging = false;
            }

            keyboardContainer.addEventListener('mousedown', startDrag);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);

            keyboardContainer.addEventListener('touchstart', startDrag);
            document.addEventListener('touchmove', drag);
            document.addEventListener('touchend', stopDrag);

            // Keyboard keys array (including arrow keys and spacebar)
            const keys = [
                ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
                ['ArrowUp'],
                ['ArrowLeft', 'Space', 'ArrowRight'],
                ['ArrowDown']
            ];

            // Create key buttons
            keys.forEach(row => {
                const rowDiv = document.createElement('div');
                rowDiv.style.display = 'flex';
                rowDiv.style.justifyContent = 'center';
                rowDiv.style.marginBottom = '10px';

                row.forEach(key => {
                    const keyButton = document.createElement('button');
                    keyButton.textContent = key === 'Space' ? '' : key;
                    keyButton.style.flex = key === 'Space' ? '2' : 'none';
                    keyButton.style.padding = '15px';
                    keyButton.style.margin = '2px';
                    keyButton.style.borderRadius = '8px';
                    keyButton.style.fontSize = '18px';
                    keyButton.style.backgroundColor = '#ffffff';  // White keys
                    keyButton.style.border = '1px solid #ddd';
                    keyButton.style.boxShadow = '0px 2px 4px rgba(0,0,0,0.1)';
                    keyButton.style.fontFamily = 'Arial, sans-serif';
                    rowDiv.appendChild(keyButton);

                    // Key press event listener
                    keyButton.addEventListener('click', () => {
                        handleKeyPress(key);
                    });
                });

                keyboardContainer.appendChild(rowDiv);
            });

            // Handle key press (send key event to Kogama)
            function handleKeyPress(key) {
                const event = new KeyboardEvent('keydown', {
                    key: key === 'Space' ? ' ' : key,
                    code: \`Key\${key.toUpperCase()}\`,
                    keyCode: key === 'Enter' ? 13 : key.charCodeAt(0),
                    bubbles: true,
                    cancelable: true
                });

                document.dispatchEvent(event);

                // Custom API interaction for Kogama
                if (typeof kogamaAPI !== 'undefined') {
                    kogamaAPI.sendKey(key);  // Example, replace with actual API function
                }
            }

            // Kogama API integration (example, replace with actual API calls)
            const kogamaAPI = {
                sendKey: function(key) {
                    console.log(\`Sending key: \${key} to Kogama API\`);
                    // Implement actual Kogama API interaction here for movement and jumping
                }
            };

            // Ensure the keyboard works on dynamically loaded pages
            function checkForGamePage() {
                // Check if the game or other specific page is loaded
                const gameFrame = document.querySelector('iframe[src*="game"]');
                if (gameFrame) {
                    // Insert keyboard into game frame if it's loaded in an iframe
                    gameFrame.contentWindow.document.body.appendChild(keyboardContainer);
                } else {
                    // Attach to main document body if not in an iframe
                    document.body.appendChild(keyboardContainer);
                }
            }

            // Run check on page load
            checkForGamePage();

            // Run check when navigating between pages (using MutationObserver)
            const observer = new MutationObserver(checkForGamePage);
            observer.observe(document.body, { childList: true, subtree: true });
        `;
        document.body.appendChild(script);
    }

    // Inject the keyboard script when the page loads
    window.addEventListener('load', injectKeyboardScript);

    // Optionally, re-inject on navigation within the site (e.g., when navigating to different game pages)
    const observer = new MutationObserver(() => {
        injectKeyboardScript();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
