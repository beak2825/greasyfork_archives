// ==UserScript==
// @name         GPE Helper
// @namespace    https://github.com/gncnpk/GPE-Helper
// @version      0.0.5
// @description  Adds quality-of-life features for Google Product Experts.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://support.google.com/*/thread*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=productexperts.withgoogle.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      raw.githubusercontent.com
// @connect      github.com
// @downloadURL https://update.greasyfork.org/scripts/541975/GPE%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/541975/GPE%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let templateResponses = {};
    let currentProduct = null;

    // GitHub responses URL
    const RESPONSES_URL = 'https://raw.githubusercontent.com/gncnpk/gpe-helper/refs/heads/main/responses.json';

    // Position management
    const POSITION_KEY = 'gpe-helper-position';
    const COLLAPSED_KEY = 'gpe-helper-collapsed';

    function detectProduct() {
        const url = window.location.href;
        const match = url.match(/support\.google\.com\/([^\/]+)\/thread/);
        return match ? match[1] : null;
    }

    function fetchResponses() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: RESPONSES_URL,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (error) {
                            console.error('Failed to parse JSON:', error);
                            reject(error);
                        }
                    } else {
                        reject(new Error(`HTTP error! status: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    console.error('Request failed:', error);
                    reject(error);
                }
            });
        });
    }

    function savePosition(x, y) {
        localStorage.setItem(POSITION_KEY, JSON.stringify({
            x,
            y
        }));
    }

    function loadPosition() {
        const saved = localStorage.getItem(POSITION_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            x: 20,
            y: 20
        }; // Default position (top-right)
    }

    function saveCollapsedState(isCollapsed) {
        localStorage.setItem(COLLAPSED_KEY, isCollapsed.toString());
    }

    function loadCollapsedState() {
        const saved = localStorage.getItem(COLLAPSED_KEY);
        return saved === 'true';
    }

    function makeDraggable(panel, header, initialPosition) {
        let isDragging = false;
        let currentX = initialPosition.x;
        let currentY = initialPosition.y;
        let initialX = 0;
        let initialY = 0;
        let xOffset = initialPosition.x;
        let yOffset = initialPosition.y;

        function dragStart(e) {
            // Only allow dragging from header, not from the toggle arrow
            if (e.target.id === 'gpe-toggle-arrow') {
                return;
            }

            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
                header.style.cursor = 'grabbing';
            }
        }

        function dragEnd(e) {
            if (isDragging) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                header.style.cursor = 'grab';

                // Save position
                savePosition(currentX, currentY);
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();

                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }

                xOffset = currentX;
                yOffset = currentY;

                // Keep panel within viewport bounds
                const rect = panel.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                currentX = Math.max(0, Math.min(currentX, viewportWidth - rect.width));
                currentY = Math.max(0, Math.min(currentY, viewportHeight - rect.height));

                panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        // Add event listeners
        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // Touch events for mobile
        header.addEventListener('touchstart', dragStart);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', dragEnd);

        // Set initial cursor
        header.style.cursor = 'grab';
    }

    function waitForElm(selector, doc) {
        return new Promise(resolve => {
            if (doc.querySelector(selector)) {
                return resolve(doc.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (doc.querySelector(selector)) {
                    observer.disconnect();
                    resolve(doc.querySelector(selector));
                }
            });

            try {
                observer.observe(doc.body, {
                    childList: true,
                    subtree: true
                });
            } catch {
                observer.observe(doc, {
                    childList: true,
                    subtree: true
                });
            }
        });
    }

    function getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    }

    function createTemplatePanel() {
        const position = loadPosition();
        const isCollapsed = loadCollapsedState();

        const panel = document.createElement('div');
        panel.id = 'gpe-template-panel';
        panel.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 300px;
            transform: translate(${position.x}px, ${position.y}px);
            user-select: none;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 12px 16px;
            background: #f8f9fa;
            border-bottom: 1px solid #ddd;
            border-radius: 8px 8px 0 0;
            font-weight: 600;
            font-size: 14px;
            color: #333;
            cursor: grab;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        `;

        const content = document.createElement('div');
        content.id = 'gpe-template-content';
        content.style.cssText = `
            padding: 8px;
            display: ${isCollapsed ? 'none' : 'block'};
        `;

        // Show loading state initially
        header.innerHTML = `
            <span>GPE Helper - Loading...</span>
            <span id="gpe-toggle-arrow" style="font-size: 12px; transition: transform 0.2s; cursor: pointer;">▼</span>
        `;

        // Check if we have responses to show
        if (Object.keys(templateResponses).length === 0) {
            content.innerHTML = `
                <div style="padding: 8px; text-align: center; color: #666; font-size: 12px;">
                    ${currentProduct ? `No templates available for "${currentProduct}"` : 'Unable to detect product or load templates'}
                </div>
            `;
        } else {
            // Create buttons for each template
            Object.keys(templateResponses).forEach(templateName => {
                const button = document.createElement('button');
                button.textContent = templateName;
                button.style.cssText = `
                    display: block;
                    width: 100%;
                    padding: 8px 12px;
                    margin: 4px 0;
                    background: #4285f4;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: background-color 0.2s;
                `;

                button.addEventListener('mouseenter', () => {
                    button.style.backgroundColor = '#3367d6';
                });

                button.addEventListener('mouseleave', () => {
                    button.style.backgroundColor = '#4285f4';
                });

                button.addEventListener('click', () => {
                    appendTemplateToEditor(templateResponses[templateName]);
                });

                content.appendChild(button);
            });
        }

        // Update header text
        const productName = currentProduct ? currentProduct.charAt(0).toUpperCase() + currentProduct.slice(1) : 'Unknown';
        header.innerHTML = `
            <span>GPE Helper - ${productName}</span>
            <span id="gpe-toggle-arrow" style="font-size: 12px; transition: transform 0.2s; cursor: pointer;">▼</span>
        `;

        // Add toggle functionality
        let collapsed = isCollapsed;
        const toggleArrow = header.querySelector('#gpe-toggle-arrow');

        // Set initial arrow direction
        toggleArrow.style.transform = collapsed ? 'rotate(-90deg)' : 'rotate(0deg)';

        toggleArrow.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag from starting
            collapsed = !collapsed;
            content.style.display = collapsed ? 'none' : 'block';
            toggleArrow.style.transform = collapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
            saveCollapsedState(collapsed);
        });

        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);

        // Make the panel draggable - pass the initial position
        makeDraggable(panel, header, position);
    }

    function textToHtml(text) {
        // Convert plain text with \n to HTML with <br> tags
        // Handle escaped newlines from JSON
        const unescapedText = text.replace(/\\n/g, '\n');
        return unescapedText.split('\n').map(line => {
            if (line.trim() === '') {
                return '<br>';
            }
            return line;
        }).join('<br>');
    }

    function insertHtmlAtCursor(element, htmlText) {
        const selection = window.getSelection();

        // If no selection or selection is not in our editor, append at end
        if (!selection.rangeCount || !element.contains(selection.anchorNode)) {
            element.focus();
            const range = document.createRange();
            range.selectNodeContents(element);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        const range = selection.getRangeAt(0);

        // Delete any selected content first
        range.deleteContents();

        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlText;

        // Collect all nodes first to preserve order
        const nodes = Array.from(tempDiv.childNodes);

        // Insert nodes in correct order
        nodes.forEach(node => {
            range.insertNode(node);
            range.setStartAfter(node);
        });

        // Move cursor to end of inserted content
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function needsSpacingBefore(editor) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return false;

        const range = selection.getRangeAt(0);
        const textBefore = range.startContainer.textContent?.substring(0, range.startOffset) || '';

        // Check if we need spacing (content exists and doesn't end with whitespace)
        return textBefore.trim() && !textBefore.match(/\s{2,}$/);
    }

    function appendTemplateToEditor(templateText) {
        const editor = document.getElementsByClassName(
            'scTailwindSharedRichtexteditoreditor'
        )[0];

        if (editor) {
            // Focus the editor first
            editor.focus();

            // Convert template text to HTML
            let htmlToInsert = textToHtml(templateText);

            // Add spacing before template if needed
            if (needsSpacingBefore(editor)) {
                htmlToInsert = '<br><br>' + htmlToInsert;
            }

            insertHtmlAtCursor(editor, htmlToInsert);

            // Trigger input event to ensure the content is recognized
            const event = new Event('input', {
                bubbles: true
            });
            editor.dispatchEvent(event);
        }
    }

    async function init() {
        // Detect the current product
        currentProduct = detectProduct();
        console.log('Detected product:', currentProduct);

        // Fetch responses from GitHub
        try {
            const allResponses = await fetchResponses();

            if (allResponses && currentProduct && allResponses[currentProduct]) {
                templateResponses = allResponses[currentProduct];
                console.log(`Loaded responses for ${currentProduct}`, templateResponses);
            } else {
                console.warn('No responses found for product:', currentProduct);
            }
        } catch (error) {
            console.error('Failed to load responses:', error);
        }
        if (document.location.pathname.endsWith("threads")) {
            await waitForElm('.thread-list-counts__count--reply', document);
            document.querySelectorAll(".thread-list-counts__count--reply").forEach((a) => {
                if (a.innerText === "0 Replies") {
                    a.parentElement.parentElement.parentElement.parentElement.style = "background-color: rgba(255,0,0,0.1);"
                }
            })
        }
        await waitForElm('.scTailwindSharedRichtexteditoreditor', document);
        prefillResponse();
        createTemplatePanel();
    }

    function prefillResponse() {
        const timeOfDay = getTimeOfDay();
        const userElem = document.querySelector(
            '.scTailwindThreadPost_headerUserinfoname'
        );
        const username = userElem ? userElem.innerText.trim() : '';

        const editor = document.getElementsByClassName(
            'scTailwindSharedRichtexteditoreditor'
        )[0];

        editor.innerText = `Good ${timeOfDay} ${username},\n\nWaze staff does not monitor this forum.\n\n[Response here]\n\nIf there's anything else I can assist you with, please let me know!\n\nI'm not affiliated with either Waze or Google; I'm a volunteer product expert providing answers about Google Maps and Waze.`;
    }

    init();
})();
