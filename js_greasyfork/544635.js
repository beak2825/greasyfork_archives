// ==UserScript==
// @name         nhentai GUI Search
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Provides an accessible GUI for searching doujinshi titles on nhentai.net with dark mode, accessible via Violentmonkey menu
// @author       FunkyJustin
// @license      MIT
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544635/nhentai%20GUI%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/544635/nhentai%20GUI%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles for the GUI with dark mode and accessibility
    GM_addStyle(`
        #nhentai-search-panel {
            position: fixed;
            top: 100px;
            left: 100px;
            background: #1e1e1e;
            border: 1px solid #333333;
            padding: 15px;
            z-index: 10001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            border-radius: 8px;
            width: 300px;
            cursor: move;
            -moz-user-select: none;
            user-select: none;
            color: #ffffff;
            display: none; /* Hidden by default */
        }
        #nhentai-search-panel input {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #444444;
            border-radius: 4px;
            font-size: 14px;
            background: #2e2e2e;
            color: #ffffff;
        }
        #nhentai-search-panel .button-row {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-top: 10px;
        }
        #nhentai-search-panel button {
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            min-width: 0;
        }
        #nhentai-search-panel .search-selected-btn {
            background: #2196F3;
            color: #ffffff;
        }
        #nhentai-search-panel .search-btn {
            background: #4CAF50;
            color: #ffffff;
        }
        #nhentai-search-panel .close-btn {
            background: #f44336;
            color: #ffffff;
        }
        #nhentai-search-panel .title-bar {
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #444444;
            color: #cccccc;
        }
        #nhentai-search-panel button:focus,
        #nhentai-search-panel input:focus {
            outline: 2px solid #00bcd4;
            outline-offset: 2px;
        }
    `);

    // Create the GUI panel
    function createPanel() {
        let panel = document.getElementById('nhentai-search-panel');
        if (panel) {
            panel.style.display = 'block';
            return panel;
        }

        panel = document.createElement('div');
        panel.id = 'nhentai-search-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-labelledby', 'nhentai-search-title');
        panel.innerHTML = `
            <div class="title-bar" id="nhentai-search-title">nhentai Search</div>
            <input type="text" id="nhentai-search-input" placeholder="Enter doujinshi title (e.g., [Rururoriri] Azukichi teko manga (AZKi) [English])" aria-label="Doujinshi title input">
            <div class="button-row">
                <button class="search-selected-btn" aria-label="Search nhentai with highlighted text">Search Selected Text</button>
                <button class="search-btn" aria-label="Search nhentai with entered title">Search</button>
                <button class="close-btn" aria-label="Close search panel">Close</button>
            </div>
        `;
        // Ensure the panel is appended to the body
        const body = document.body;
        if (body) {
            body.appendChild(panel);
        } else {
            console.error('Document body not found, cannot append panel');
            return null;
        }

        // Make panel draggable
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        panel.addEventListener('mousedown', (e) => {
            if (e.target.className === 'title-bar') {
                isDragging = true;
                initialX = e.clientX - currentX;
                initialY = e.clientY - currentY;
                panel.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                panel.style.left = `${currentX}px`;
                panel.style.top = `${currentY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'move';
        });

        // Handle buttons after panel is fully added to DOM
        setTimeout(() => {
            const searchSelectedBtn = panel.querySelector('.search-selected-btn');
            const searchBtn = panel.querySelector('.search-btn');
            const closeBtn = panel.querySelector('.close-btn');
            const input = panel.querySelector('#nhentai-search-input');

            if (searchSelectedBtn && searchBtn && closeBtn && input) {
                // Search Selected Text button
                searchSelectedBtn.addEventListener('click', () => {
                    const selectedText = window.getSelection().toString().trim();
                    console.log('Search Selected Text clicked, selected:', selectedText);
                    if (selectedText) {
                        input.value = selectedText;
                        const encodedText = encodeURIComponent(selectedText);
                        const searchUrl = `https://nhentai.net/search/?q=${encodedText}`;
                        console.log('Generated URL:', searchUrl);
                        const link = document.createElement('a');
                        link.href = searchUrl;
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        alert('No text selected! Please highlight a doujinshi title.');
                    }
                });

                // Search button
                searchBtn.addEventListener('click', () => {
                    const title = input.value.trim();
                    console.log('Search button clicked, title:', title);
                    if (title) {
                        const encodedText = encodeURIComponent(title);
                        const searchUrl = `https://nhentai.net/search/?q=${encodedText}`;
                        console.log('Generated URL:', searchUrl);
                        const link = document.createElement('a');
                        link.href = searchUrl;
                        link.target = '_blank';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        alert('Please enter a doujinshi title!');
                    }
                });

                // Close button
                closeBtn.addEventListener('click', () => {
                    console.log('Close button clicked');
                    panel.style.display = 'none';
                });

                // Keyboard accessibility
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && input.value.trim()) {
                        searchBtn.click();
                    }
                });

                // Focus management
                panel.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        const focusable = panel.querySelectorAll('button, input');
                        const focusIndex = Array.from(focusable).indexOf(document.activeElement);
                        let nextIndex = (focusIndex + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
                        focusable[nextIndex].focus();
                        e.preventDefault();
                    }
                });
            } else {
                console.error('Button or input elements not found');
            }
        }, 0);

        // Initialize position
        currentX = 100;
        currentY = 100;
        panel.style.left = `${currentX}px`;
        panel.style.top = `${currentY}px`;

        return panel;
    }

    // Toggle panel visibility
    function togglePanel() {
        const panel = document.getElementById('nhentai-search-panel');
        if (panel && panel.style.display === 'block') {
            panel.style.display = 'none';
        } else {
            const newPanel = createPanel();
            if (newPanel) {
                newPanel.style.display = 'block';
            } else {
                console.error('Failed to create panel');
            }
        }
    }

    // Register Violentmonkey menu command
    GM_registerMenuCommand('Toggle nhentai Search Panel', togglePanel);

    // Do not create panel on load—wait for menu command
    // Panel will be created only when togglePanel is called
})();