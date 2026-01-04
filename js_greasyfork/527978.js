// ==UserScript==
// @name         Promptimizer
// @namespace    https://github.com/NoahTheGinger/Promptimizer/
// @version      1.2.2
// @description  AI-powered prompt optimization tool that works with OpenAI-compatible APIs
// @author       NoahTheGinger
// @namespace    https://github.com/NoahTheGinger/Promptimizer/
// @match        *://*/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527978/Promptimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/527978/Promptimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Styles for the UI
    GM_addStyle(`
        #promptimizer-container {
            position: fixed;
            /*
               UI CHANGE:
               Default position now near bottom-right.
               This corresponds with the toggle's new position in the bottom-right corner.
            */
            bottom: 80px;
            right: 20px;
            width: 400px;
            height: auto; /* Let container height auto-adjust initially */
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 2147483647;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: none;
            color: #000000;
            /* UI CHANGE: Added transform and opacity transitions for smoother show/hide + repositioning. */
            transition:
                opacity 0.2s ease,
                width 0.2s ease,
                height 0.2s ease,
                top 0.2s ease,
                left 0.2s ease,
                right 0.2s ease,
                bottom 0.2s ease;
            overflow: hidden;
            min-height: 300px;
            min-width: 300px;
            opacity: 0; /* For fade effect upon showing */
        }
        /* UI CHANGE: A "show" class that toggles visibility with a fade */
        #promptimizer-container.show {
            opacity: 1;
        }

        #promptimizer-header {
            padding: 12px;
            background: #2196F3;
            border-radius: 8px 8px 0 0;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #ffffff;
            user-select: none; /* UI CHANGE: Prevent text selection while dragging header */
        }

        #promptimizer-header-controls {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .header-button {
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            font-size: 16px;
            padding: 0;
            display: flex;
            align-items: center;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        .header-button:hover {
            opacity: 1;
        }

        #promptimizer-title {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
        }

        #promptimizer-toggle {
            position: fixed;
            /*
               UI CHANGE:
               Toggle button now in bottom-right corner.
            */
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #2196F3;
            border-radius: 25px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 24px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 2147483647;
            border: 2px solid rgba(255,255,255,0.2);
        }

        #promptimizer-content {
            display: flex;
            flex-direction: column;
            background: #ffffff;
            overflow: hidden;
            max-height: calc(100% - 48px);
        }

        .scrollable-flex {
            overflow-y: auto;
            flex: 1;
            padding: 16px;
        }

        .promptimizer-input {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            background: #ffffff;
            color: #000000;
        }

        textarea.promptimizer-input {
            resize: none;
            min-height: 100px;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
            overflow-y: auto;
        }

        textarea.promptimizer-input:focus {
            border-color: #2196F3;
            box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
            outline: none;
        }

        .prompt-type-select {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #ffffff;
            color: #000000;
            font-size: 14px;
            cursor: pointer;
        }

        .prompt-type-select:focus {
            border-color: #2196F3;
            outline: none;
        }

        .input-group {
            margin-bottom: 16px;
        }

        .input-label {
            display: block;
            margin-bottom: 6px;
            color: #000000;
            font-size: 14px;
            font-weight: 500;
        }

        .promptimizer-button {
            background: #2196F3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-bottom: 10px;
            width: 100%;
        }

        .promptimizer-button:hover {
            background: #1976D2;
        }

        #promptimizer-response-container {
            position: relative;
            margin-top: 16px;
        }

        #promptimizer-response {
            margin-top: 0;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 4px;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
            color: #000000;
            border: 1px solid #e9ecef;
        }

        #copy-button {
            position: absolute;
            top: 8px;
            right: 8px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 1;
        }

        #copy-button:hover {
            background: #1976D2;
        }

        #copy-button.visible {
            opacity: 1;
        }

        #copy-button.copied {
            background: #4CAF50;
        }

        .promptimizer-error {
            color: #dc3545;
            margin-top: 8px;
            font-size: 14px;
            background: #fff;
            padding: 8px;
            border-radius: 4px;
        }

        .config-section {
            margin-bottom: 15px;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }

        .config-section.collapsed {
            max-height: 40px;
        }

        .config-section.expanded {
            max-height: 300px;
        }

        .config-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            padding: 8px 0;
        }

        .config-header h3 {
            margin: 0;
            font-size: 16px;
            color: #333;
        }

        .config-toggle {
            font-size: 18px;
            color: #666;
            transition: transform 0.3s;
        }

        .config-toggle.collapsed {
            transform: rotate(-90deg);
        }

        .config-content {
            transition: opacity 0.3s;
        }

        .config-content.collapsed {
            opacity: 0;
            height: 0;
            overflow: hidden;
        }

        .config-content.expanded {
            opacity: 1;
            height: auto;
        }

        /*
           UI CHANGE:
           Previously, only top-left resizing was available (.resize-handle-left, .resize-handle-top, .resize-handle-corner).
           Now we add handles on all sides + both corners (top-left & bottom-right) for a more standard resizing experience.
        */
        .resize-handle {
            position: absolute;
            background: transparent;
            z-index: 10;
        }
        /* Existing top-left handles */
        .resize-handle-left {
            cursor: ew-resize;
            width: 8px;
            height: 100%;
            left: 0;
            top: 0;
        }
        .resize-handle-top {
            cursor: ns-resize;
            height: 8px;
            width: 100%;
            top: 0;
            left: 0;
        }
        .resize-handle-corner {
            cursor: nwse-resize;
            width: 14px;
            height: 14px;
            left: 0;
            top: 0;
        }

        /* NEW bottom-right corner handle */
        .resize-handle-corner-br {
            cursor: nwse-resize;
            width: 14px;
            height: 14px;
            right: 0;
            bottom: 0;
        }
        /* NEW right-only handle */
        .resize-handle-right {
            cursor: ew-resize;
            width: 8px;
            height: 100%;
            top: 0;
            right: 0;
        }
        /* NEW bottom-only handle */
        .resize-handle-bottom {
            cursor: ns-resize;
            height: 8px;
            width: 100%;
            bottom: 0;
            left: 0;
        }

        #promptimizer-container.resizing {
            transition: none;
            box-shadow: 0 2px 15px rgba(33, 150, 243, 0.4);
        }

        #promptimizer-container.resizing-left {
            border-left: 2px solid #2196F3;
        }
        #promptimizer-container.resizing-top {
            border-top: 2px solid #2196F3;
        }
        #promptimizer-container.resizing-corner {
            border-left: 2px solid #2196F3;
            border-top: 2px solid #2196F3;
        }

        /* UI CHANGE: Additional highlighting classes for new handles. */
        #promptimizer-container.resizing-right {
            border-right: 2px solid #2196F3;
        }
        #promptimizer-container.resizing-bottom {
            border-bottom: 2px solid #2196F3;
        }
        #promptimizer-container.resizing-corner-br {
            border-right: 2px solid #2196F3;
            border-bottom: 2px solid #2196F3;
        }
    `);

    // Default dimensions and position
    const defaultDimensions = {
        // UI CHANGE: Adjusted to bottom-right defaults
        width: '400px',
        height: 'auto',
        bottom: '80px',
        right: '20px'
    };

    // Create UI elements
    function createUI() {
        // Toggle button
        const toggle = document.createElement('div');
        toggle.id = 'promptimizer-toggle';
        toggle.innerHTML = '✨';
        toggle.title = 'Toggle Promptimizer';
        document.body.appendChild(toggle);

        // Main container
        const container = document.createElement('div');
        container.id = 'promptimizer-container';
        container.innerHTML = `
            <div id="promptimizer-header">
                <h2 id="promptimizer-title">Promptimizer</h2>
                <div id="promptimizer-header-controls">
                    <button class="header-button" id="promptimizer-reset" title="Reset UI Position and Size">↺</button>
                    <button class="header-button" id="promptimizer-minimize" title="Minimize">−</button>
                </div>
            </div>
            <div id="promptimizer-content">
              <div class="scrollable-flex">
                <div class="config-section expanded" id="config-section">
                    <div class="config-header" id="config-header">
                        <h3>API Configuration</h3>
                        <span class="config-toggle">▼</span>
                    </div>
                    <div class="config-content expanded">
                        <input type="text" id="api-url" class="promptimizer-input" placeholder="API URL (e.g., https://api.openai.com/v1)" />
                        <input type="text" id="api-key" class="promptimizer-input" placeholder="API Key" autocomplete="off" spellcheck="false" inputmode="latin" data-1p-ignore="true" data-lpignore="true" style="-webkit-text-security: disc;" />
                        <input type="text" id="model-name" class="promptimizer-input" placeholder="Model name" />
                        <input type="text" id="provider-name" class="promptimizer-input" placeholder="Provider name (optional, for gpt4free)" />
                        <button id="save-config" class="promptimizer-button">Save Configuration</button>
                    </div>
                </div>
                <div class="input-group">
                    <label class="input-label" for="prompt-type">Prompt Type:</label>
                    <select id="prompt-type" class="prompt-type-select">
                        <option value="user">User Prompt</option>
                        <option value="system">System Prompt</option>
                    </select>
                </div>
                <div class="input-group">
                    <label class="input-label" for="prompt-input">Enter Your Prompt:</label>
                    <textarea id="prompt-input" class="promptimizer-input" rows="4" placeholder="Enter your prompt here..."></textarea>
                </div>
                <button id="optimize-button" class="promptimizer-button">Optimize Prompt</button>
                <div id="promptimizer-response-container">
                    <button id="copy-button" style="display: none;">Copy Enhanced Prompt</button>
                    <div id="promptimizer-response"></div>
                </div>
              </div>
            </div>
            <!-- UI CHANGE: A complete set of resize handles: top-left corner, top, left, bottom-right corner, right, bottom. -->
            <div class="resize-handle resize-handle-left"></div>
            <div class="resize-handle resize-handle-top"></div>
            <div class="resize-handle resize-handle-corner"></div>
            <div class="resize-handle resize-handle-right"></div>
            <div class="resize-handle resize-handle-bottom"></div>
            <div class="resize-handle resize-handle-corner-br"></div>
        `;
        document.body.appendChild(container);

        // Make the container draggable (UI only)
        makeDraggable(container);

        // Add container resizing
        makeResizable(container);

        // Load saved configuration
        loadConfiguration();

        // Event listeners
        // UI CHANGE: Now using a smoother show/hide approach with fade
        toggle.addEventListener('click', () => {
            if (container.style.display === 'none' || container.style.display === '') {
                container.style.display = 'block';
                // Force reflow, then add .show for fade-in
                requestAnimationFrame(() => container.classList.add('show'));
            } else {
                // Remove .show for fade-out
                container.classList.remove('show');
                // Wait for transition to complete, then hide
                setTimeout(() => {
                    if (!container.classList.contains('show')) {
                        container.style.display = 'none';
                    }
                }, 200);
            }
        });

        document.getElementById('promptimizer-minimize').addEventListener('click', () => {
            // Fade out on minimize
            container.classList.remove('show');
            setTimeout(() => {
                if (!container.classList.contains('show')) {
                    container.style.display = 'none';
                }
            }, 200);
        });

        // Config section toggle
        const configHeader = document.getElementById('config-header');
        const configSection = document.getElementById('config-section');
        const configToggle = configHeader.querySelector('.config-toggle');
        const configContent = configSection.querySelector('.config-content');

        configHeader.addEventListener('click', () => {
            const isExpanded = configSection.classList.contains('expanded');

            if (isExpanded) {
                configSection.classList.remove('expanded');
                configSection.classList.add('collapsed');
                configContent.classList.remove('expanded');
                configContent.classList.add('collapsed');
                configToggle.classList.add('collapsed');
            } else {
                configSection.classList.remove('collapsed');
                configSection.classList.add('expanded');
                configContent.classList.remove('collapsed');
                configContent.classList.add('expanded');
                configToggle.classList.remove('collapsed');
            }
        });

        document.getElementById('save-config').addEventListener('click', saveConfiguration);
        document.getElementById('optimize-button').addEventListener('click', optimizePrompt);
        document.getElementById('copy-button').addEventListener('click', copyEnhancedPrompt);

        // Initialize auto-height for textarea
        const textarea = document.getElementById('prompt-input');
        if (textarea) {
            autoResizeTextarea(textarea);
            textarea.addEventListener('input', function() {
                autoResizeTextarea(this);
            });
        }
    }

    // Make an element draggable (UI only; no functional logic changed)
    function makeDraggable(element) {
        const header = element.querySelector('#promptimizer-header');
        let isDragging = false;
        let startX, startY, offsetX, offsetY;

        // Function to reset position and size
        function resetPosition() {
            // Remove transform usage; set position explicitly
            element.style.width = defaultDimensions.width;
            element.style.height = defaultDimensions.height;
            element.style.bottom = defaultDimensions.bottom;
            element.style.right = defaultDimensions.right;
            element.style.top = 'auto';
            element.style.left = 'auto';

            // Reset any set textarea dimensions
            const textarea = document.getElementById('prompt-input');
            if (textarea) {
                textarea.style.height = '';
                autoResizeTextarea(textarea);
            }
        }

        // Add reset button event listener
        document.getElementById('promptimizer-reset').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent initiating a drag
            resetPosition();
        });

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.closest('.header-button')) {
                return;
            }
            isDragging = true;
            // Compute how far from the element's top-left corner the pointer is
            const rect = element.getBoundingClientRect();
            startX = rect.left;
            startY = rect.top;
            offsetX = e.clientX - startX;
            offsetY = e.clientY - startY;

            // Disable transition during actual drag for a crisper effect
            element.style.transition = 'none';
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();

            // Figure out the new top-left based on pointer
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            // Keep within viewport, if desired
            const rect = element.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // Adjust so it won't go offscreen
            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;
            if (newLeft + w > vw) newLeft = vw - w;
            if (newTop + h > vh) newTop = vh - h;

            // Clear bottom/right so we can use top/left
            element.style.bottom = 'auto';
            element.style.right = 'auto';

            // Apply new position
            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
        }

        function dragEnd() {
            isDragging = false;
            // Re-enable transitions for nice layout changes after drag
            element.style.transition =
                'opacity 0.2s ease, width 0.2s ease, height 0.2s ease, top 0.2s ease, left 0.2s ease, right 0.2s ease, bottom 0.2s ease';
        }

        // Initialize at default bottom-right position
        resetPosition();
    }

    // Make container resizable (UI only)
    function makeResizable(container) {
        const leftHandle = container.querySelector('.resize-handle-left');
        const topHandle = container.querySelector('.resize-handle-top');
        const cornerTLHandle = container.querySelector('.resize-handle-corner');  // top-left corner
        // UI CHANGE: Additional handles
        const rightHandle = container.querySelector('.resize-handle-right');
        const bottomHandle = container.querySelector('.resize-handle-bottom');
        const cornerBRHandle = container.querySelector('.resize-handle-corner-br');

        let isResizing = false;
        let currentResizeType = '';
        let startX, startY, startWidth, startHeight, startTop, startLeft, startBottom, startRight;

        function startResize(e, type) {
            e.preventDefault();
            e.stopPropagation();

            isResizing = true;
            currentResizeType = type;

            const rect = container.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            startTop = rect.top;
            startLeft = rect.left;
            startBottom = window.innerHeight - rect.bottom;  // distance from bottom to viewport
            startRight = window.innerWidth - rect.right;     // distance from right to viewport
            startX = e.clientX;
            startY = e.clientY;

            container.classList.add('resizing');
            container.classList.add(`resizing-${type}`);

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);

            // Disable transitions during actual resize
            container.style.transition = 'none';
        }

        function resize(e) {
            if (!isResizing) return;

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newTop = startTop;
            let newLeft = startLeft;
            let newRight = startRight;
            let newBottom = startBottom;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            switch (currentResizeType) {
                case 'left':
                    newWidth = startWidth - dx;
                    newLeft = startLeft + dx;
                    break;
                case 'top':
                    newHeight = startHeight - dy;
                    newTop = startTop + dy;
                    break;
                case 'corner': // top-left corner
                    newWidth = startWidth - dx;
                    newHeight = startHeight - dy;
                    newLeft = startLeft + dx;
                    newTop = startTop + dy;
                    break;
                // UI CHANGE: Additional cases for new handles
                case 'right':
                    // Resizing from the right edge outward
                    newWidth = startWidth + dx;
                    break;
                case 'bottom':
                    // Resizing from the bottom edge downward
                    newHeight = startHeight + dy;
                    break;
                case 'corner-br': // bottom-right corner
                    newWidth = startWidth + dx;
                    newHeight = startHeight + dy;
                    break;
            }

            // Enforce minimum dimensions
            if (newWidth < 300) {
                newWidth = 300;
                // If resizing from left or top-left corner, shift left to keep min width
                if (['left','corner'].includes(currentResizeType)) {
                    newLeft = startLeft + (startWidth - 300);
                }
                // If resizing from right or bottom-right corner, we just clamp
            }
            if (newHeight < 300) {
                newHeight = 300;
                // If resizing from top or top-left corner, shift top
                if (['top','corner'].includes(currentResizeType)) {
                    newTop = startTop + (startHeight - 300);
                }
            }

            // Keep within viewport (optional)
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            if (['left','corner'].includes(currentResizeType) && newLeft < 0) {
                newLeft = 0;
            }
            if (['top','corner'].includes(currentResizeType) && newTop < 0) {
                newTop = 0;
            }
            if (['right','corner-br'].includes(currentResizeType) && (startLeft + newWidth > vw)) {
                newWidth = vw - startLeft;
            }
            if (['bottom','corner-br'].includes(currentResizeType) && (startTop + newHeight > vh)) {
                newHeight = vh - startTop;
            }

            // Apply geometry. For bottom/right-based resizing, keep the container's top/left unless
            // we're specifically resizing from top or left.
            container.style.width = newWidth + 'px';
            container.style.height = newHeight + 'px';

            // If resizing from left or top or top-left corner, update top/left explicitly
            if (['left','top','corner'].includes(currentResizeType)) {
                container.style.left = newLeft + 'px';
                container.style.top = newTop + 'px';
                // Clear bottom/right so they won't conflict
                container.style.bottom = 'auto';
                container.style.right = 'auto';
            }
        }

        function stopResize() {
            isResizing = false;
            container.classList.remove('resizing');
            container.classList.remove(`resizing-${currentResizeType}`);

            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);

            // Re-enable transitions
            container.style.transition =
                'opacity 0.2s ease, width 0.2s ease, height 0.2s ease, top 0.2s ease, left 0.2s ease, right 0.2s ease, bottom 0.2s ease';
        }

        leftHandle.addEventListener('mousedown', (e) => startResize(e, 'left'));
        topHandle.addEventListener('mousedown', (e) => startResize(e, 'top'));
        cornerTLHandle.addEventListener('mousedown', (e) => startResize(e, 'corner'));
        // UI CHANGE: New handles
        rightHandle.addEventListener('mousedown', (e) => startResize(e, 'right'));
        bottomHandle.addEventListener('mousedown', (e) => startResize(e, 'bottom'));
        cornerBRHandle.addEventListener('mousedown', (e) => startResize(e, 'corner-br'));
    }

    // Helper function to auto-resize textarea based on content
    function autoResizeTextarea(textarea) {
        // Save scroll position
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Reset height temporarily to get accurate scrollHeight
        textarea.style.height = 'auto';
        // Set new height based on content (with minimum)
        const newHeight = Math.max(textarea.scrollHeight, 100) + 'px';
        textarea.style.transition = 'height 0.15s ease-out';
        textarea.style.height = newHeight;
        // Restore scroll position to prevent page jump
        window.scrollTo(0, scrollTop);
    }

    // Save API configuration
    function saveConfiguration() {
        const apiUrl = document.getElementById('api-url').value;
        const apiKey = document.getElementById('api-key').value;
        const modelName = document.getElementById('model-name').value;
        const providerName = document.getElementById('provider-name').value;

        GM_setValue('apiUrl', apiUrl);
        GM_setValue('apiKey', apiKey);
        GM_setValue('modelName', modelName);
        GM_setValue('providerName', providerName);

        showResponse('Configuration saved!');
    }

    // Load saved configuration
    function loadConfiguration() {
        const apiUrl = GM_getValue('apiUrl', '');
        const apiKey = GM_getValue('apiKey', '');
        const modelName = GM_getValue('modelName', '');
        const providerName = GM_getValue('providerName', '');

        document.getElementById('api-url').value = apiUrl;
        document.getElementById('api-key').value = apiKey;
        document.getElementById('model-name').value = modelName;
        document.getElementById('provider-name').value = providerName;
    }

    // Show response or error message
    function showResponse(message, isError = false) {
        const responseDiv = document.getElementById('promptimizer-response');
        const copyButton = document.getElementById('copy-button');
        responseDiv.textContent = message;
        responseDiv.className = isError ? 'promptimizer-error' : '';

        if (!isError && message !== 'Optimizing prompt...') {
            copyButton.style.display = 'block';
            setTimeout(() => copyButton.classList.add('visible'), 10);
        } else {
            copyButton.style.display = 'none';
            copyButton.classList.remove('visible');
        }
    }

    // Extract enhanced prompt from response
    function extractEnhancedPrompt(text) {
        const match = text.match(/<enhanced_prompt>([\s\S]*?)<\/enhanced_prompt>/);
        return match ? match[1].trim() : text;
    }

    // Copy enhanced prompt to clipboard
    function copyEnhancedPrompt() {
        const responseDiv = document.getElementById('promptimizer-response');
        const copyButton = document.getElementById('copy-button');
        const textToCopy = extractEnhancedPrompt(responseDiv.textContent);

        navigator.clipboard.writeText(textToCopy).then(() => {
            copyButton.textContent = 'Copied!';
            copyButton.classList.add('copied');
            setTimeout(() => {
                copyButton.textContent = 'Copy Enhanced Prompt';
                copyButton.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // Optimize prompt using the API
    async function optimizePrompt() {
        const apiUrl = GM_getValue('apiUrl', '');
        const apiKey = GM_getValue('apiKey', '');
        const modelName = GM_getValue('modelName', '');
        const providerName = GM_getValue('providerName', '');
        const promptType = document.getElementById('prompt-type').value;
        const promptInput = document.getElementById('prompt-input').value;

        if (!apiUrl || !apiKey || !modelName) {
            showResponse('Please configure API settings first!', true);
            return;
        }

        if (!promptInput.trim()) {
            showResponse('Please enter a prompt to optimize!', true);
            return;
        }

        showResponse('Optimizing prompt...');

        const systemPrompt = `You are a specialized prompt optimization AI focused on enhancing both user prompts and system prompts for AI interactions.

<instructions>
1. You will receive prompts marked with either <user_prompt> or <system_prompt> tags
2. ALWAYS maintain the same type of prompt in your enhancement
3. NEVER engage in conversation or provide explanations
4. ONLY return the enhanced prompt within <enhanced_prompt> tags
5. Apply appropriate prompt engineering techniques based on the prompt type:

   For User Prompts:
   - Maintain conversational context and flow
   - Clarify user intent and expectations
   - Add specific parameters for the response
   - Include relevant context from prior conversation
   - Structure multi-part requests clearly

   For System Prompts:
   - Define clear roles and responsibilities
   - Establish behavioral boundaries
   - Include success criteria and constraints
   - Structure hierarchical instructions
   - Define interaction patterns
   - Specify output formats and preferences
   - Include error handling instructions
</instructions>

<examples>
<example>
<input_type>user_prompt</input_type>
<input>Thanks for your help! Can you search the web for more information about this topic?</input>
<enhanced_prompt>Please conduct a comprehensive web search on our current topic with the following parameters:
1. Focus on authoritative sources from the last 2 years
2. Include academic and expert perspectives
3. Compare and contrast different viewpoints
4. Identify emerging trends and developments
5. Extract key insights and practical applications

Format the response with:
- Main findings in bullet points
- Source citations for each major claim
- Relevance assessment for each source
- Synthesis of conflicting information
- Suggestions for further research</enhanced_prompt>
</example>

<example>
<input_type>system_prompt</input_type>
<input>You are a web search AI assistant. Your role is to help users find information.</input>
<enhanced_prompt>You are a specialized web search AI assistant designed to provide comprehensive, accurate, and well-structured information retrieval services.

Core Responsibilities:
1. Execute precise web searches based on user queries
2. Evaluate source credibility and relevance
3. Synthesize information from multiple sources
4. Present findings in clear, structured formats

Behavioral Guidelines:
- Maintain objectivity in information presentation
- Clearly distinguish between facts and interpretations
- Acknowledge information gaps or uncertainties
- Proactively suggest related topics for exploration

Output Requirements:
1. Structure all responses with:
   - Executive summary
   - Detailed findings
   - Source citations
   - Confidence levels
2. Use formatting for clarity:
   - Bullet points for key facts
   - Tables for comparisons
   - Markdown for emphasis
   - Hierarchical headings

Error Handling:
- Acknowledge when information is outdated
- Flag potential misinformation
- Suggest alternative search strategies
- Provide confidence levels for findings</enhanced_prompt>
</example>
</examples>

<success_criteria>
For User Prompts:
- Enhanced clarity and specificity
- Maintained conversation context
- Clear parameters for response
- Structured multi-part requests
- Defined output preferences

For System Prompts:
- Clear role definition
- Comprehensive behavioral guidelines
- Specific output requirements
- Error handling procedures
- Interaction patterns defined
</success_criteria>`;

        // Wrap the input with appropriate type tags
        const taggedInput = `<${promptType}_prompt>${promptInput}</${promptType}_prompt>`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: `${apiUrl}/chat/completions`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                model: modelName,
                ...(providerName && { provider: providerName }),
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: taggedInput
                    }
                ],
                temperature: 0.7,
                max_tokens: 16384
            }),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.error) {
                        showResponse(`Error: ${result.error.message}`, true);
                    } else if (result.choices && result.choices[0]) {
                        showResponse(result.choices[0].message.content);
                    } else {
                        showResponse('Unexpected API response format', true);
                    }
                } catch (error) {
                    showResponse(`Error processing response: ${error.message}`, true);
                }
            },
            onerror: function(error) {
                showResponse(`Network error: ${error.statusText}`, true);
            }
        });
    }

    // Initialize the UI
    createUI();
})();