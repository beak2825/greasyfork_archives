// ==UserScript==
// @name         Instant Search Switcher
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Changes search engine from one site to another without deleting search query. Draggable UI.
// @author       Faisal Bhuiyan
// @match        *://*.bing.com/*search*
// @match        *://*.bing.com/chat*
// @match        https://www.google.com/search*
// @match        https://yandex.com/*search*
// @match        https://search.brave.com/*search*
// @match        https://searx.fmhy.net/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/534799/Instant%20Search%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/534799/Instant%20Search%20Switcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const searchEngines = [
        {
            name: 'Google',
            url: 'https://www.google.com/search',
            param: 'q'
        },
        {
            name: 'Bing',
            url: 'https://www.bing.com/search',
            param: 'q'
        },
        {
            name: 'Copilot',
            url: 'https://www.bing.com/chat',
            param: 'q',
            additionalParams: '&sendquery=1&FORM=SCCODX'
        },
        {
            name: 'Brave',
            url: 'https://search.brave.com/search',
            param: 'q'
        },
        {
            name: 'Yandex',
            url: 'https://yandex.com/search',
            param: 'text'
        },
        {
            name: 'Perplexity',
            url: 'https://www.perplexity.ai/search',
            param: 'q'
        },
        {
            name: 'SearX',
            url: 'https://searx.fmhy.net/',
            param: 'q'
        },
        {
            name: 'Scira',
            url: 'https://scira.ai/',
            param: 'q'
        },
        {
            name: 'ChatGPT',
            url: 'https://chatgpt.com/',
            param: 'q'
        }
    ];

    // Default position - define this as a constant
    const defaultPosition = { top: '20px', right: '5rem', left: 'auto' };

    // Try to get saved position or use default
    let position;
    try {
        const savedPosition = GM_getValue('switcherPosition');
        // Only use saved position if it exists and has been manually set
        position = (savedPosition && GM_getValue('positionModified')) ? savedPosition : defaultPosition;
    } catch (e) {
        // If GM_getValue is not available, use defaultPosition
        position = defaultPosition;
    }

    // Create container for draggable functionality
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = position.top;
    container.style.right = position.right;
    container.style.left = position.left;
    container.style.zIndex = '9999';
    container.style.cursor = 'move';
    container.style.userSelect = 'none';
    container.style.touchAction = 'none';
    container.style.display = 'flex';
    container.style.flexDirection = 'row';
    container.style.alignItems = 'center';
    container.style.padding = '4px';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    container.style.borderRadius = '4px';
    container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';

    // Create a handle for dragging
    const dragHandle = document.createElement('div');
    dragHandle.innerHTML = '⋮⋮'; // vertical dots as drag indicator
    dragHandle.style.marginRight = '5px';
    dragHandle.style.cursor = 'move';
    dragHandle.style.color = '#555';
    dragHandle.style.fontSize = '16px';
    dragHandle.style.paddingRight = '5px';
    dragHandle.title = 'Drag to move';

    // Create reset button
    const resetButton = document.createElement('div');
    resetButton.innerHTML = '↺'; // reset icon
    resetButton.style.marginLeft = '5px';
    resetButton.style.cursor = 'pointer';
    resetButton.style.color = '#555';
    resetButton.style.fontSize = '16px';
    resetButton.style.padding = '0 5px';
    resetButton.title = 'Reset position';
    resetButton.style.display = 'flex';
    resetButton.style.alignItems = 'center';
    resetButton.style.justifyContent = 'center';

    // Create the floating select box
    const selectBox = document.createElement('select');
    selectBox.style.fontSize = '16px';
    selectBox.style.padding = '5px';
    selectBox.style.borderRadius = '4px';
    selectBox.style.backgroundColor = '#fff';
    selectBox.style.color = '#000'; // Force black text
    selectBox.style.border = '1px solid #ccc';
    selectBox.style.outline = 'none';
    selectBox.style.cursor = 'pointer';

    // Add CSS to ensure text remains visible in both light and dark themes
    const style = document.createElement('style');
    style.textContent = `
        .search-switcher-select {
            color: #000 !important;
            -webkit-text-fill-color: #000 !important;
        }
        .search-switcher-select option {
            background-color: #fff !important;
            color: #000 !important;
            -webkit-text-fill-color: #000 !important;
        }
    `;
    document.head.appendChild(style);

    selectBox.className = 'search-switcher-select';

    // Add an empty option as the first element
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'Select';
    emptyOption.disabled = true;
    emptyOption.selected = true;
    selectBox.appendChild(emptyOption);

    // Add search engines to the select box
    searchEngines.forEach(engine => {
        const option = document.createElement('option');
        option.value = engine.url;
        option.textContent = engine.name;
        selectBox.appendChild(option);
    });

    // Add elements to container
    container.appendChild(dragHandle);
    container.appendChild(selectBox);
    container.appendChild(resetButton);

    // Append the container to the body
    document.body.appendChild(container);

    // Reset button functionality
    resetButton.addEventListener('click', (e) => {
        e.stopPropagation();

        // Apply default position
        container.style.top = defaultPosition.top;
        container.style.right = defaultPosition.right;
        container.style.left = defaultPosition.left;

        // Save the default settings
        try {
            GM_setValue('switcherPosition', defaultPosition);
            GM_setValue('positionModified', false);
        } catch (e) {
            // Silently fail if GM_setValue is not available
        }
    });

    // Detect changes to the select box
    selectBox.addEventListener('change', () => {
        const selectedEngine = searchEngines[selectBox.selectedIndex - 1];
        // Try to get query parameter from either 'q' or 'text' depending on current search engine
        const currentQuery = new URLSearchParams(window.location.search).get('q') ||
                           new URLSearchParams(window.location.search).get('text');

        if (currentQuery && selectedEngine) {
            const additionalParams = selectedEngine.additionalParams || '';
            window.location.href = `${selectedEngine.url}?${selectedEngine.param}=${encodeURIComponent(currentQuery)}${additionalParams}`;
        }
    });

    // Make the container draggable
    let isDragging = false;
    let dragOffsetX, dragOffsetY;

    // Function to start dragging
    function startDrag(clientX, clientY) {
        isDragging = true;

        // Calculate the offset of the mouse within the container
        const rect = container.getBoundingClientRect();
        dragOffsetX = clientX - rect.left;
        dragOffsetY = clientY - rect.top;

        // Prevent text selection during drag
        document.body.style.userSelect = 'none';
    }

    // Function to handle dragging
    function drag(clientX, clientY) {
        if (!isDragging) return;

        // Calculate new position based on mouse/touch position and offset
        const newLeft = clientX - dragOffsetX;
        const newTop = clientY - dragOffsetY;

        // Ensure the element stays within viewport bounds
        const maxX = window.innerWidth - container.offsetWidth;
        const maxY = window.innerHeight - container.offsetHeight;

        const boundedLeft = Math.max(0, Math.min(newLeft, maxX));
        const boundedTop = Math.max(0, Math.min(newTop, maxY));

        // Set new position
        container.style.left = boundedLeft + 'px';
        container.style.top = boundedTop + 'px';
        container.style.right = 'auto'; // Clear right positioning to avoid conflicts
    }

    // Function to end dragging
    function endDrag() {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = '';

            // Save the new position and mark as modified
            try {
                GM_setValue('switcherPosition', {
                    top: container.style.top,
                    right: 'auto',
                    left: container.style.left
                });
                GM_setValue('positionModified', true);
            } catch (e) {
                // Silently fail if GM_setValue is not available
            }
        }
    }

    // Mouse event listeners
    dragHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
    });

    document.addEventListener('mousemove', (e) => {
        drag(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', endDrag);

    // Touch event listeners
    dragHandle.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            startDrag(touch.clientX, touch.clientY);
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
            e.preventDefault();
            const touch = e.touches[0];
            drag(touch.clientX, touch.clientY);
        }
    });

    document.addEventListener('touchend', endDrag);
    document.addEventListener('touchcancel', endDrag);

    // Prevent selectbox from triggering drag
    selectBox.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });

    selectBox.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    });
})();