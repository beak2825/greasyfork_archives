// ==UserScript==
// @name         Resizable ChatGPT Sidebar
// @namespace    Violentmonkey userscripts by ReporterX
// @version      1.501
// @description  It adds a draggable handle to resize the ChatGPT sidebar, so you could see more characters of the chat titles / chat history etc. It uses MutationObserver for reliability.
// @author       ReporterX
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539755/Resizable%20ChatGPT%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/539755/Resizable%20ChatGPT%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SIDEBAR_SELECTOR = '#stage-slideover-sidebar';
    const MIN_WIDTH = 200;
    const MAX_WIDTH = 800;
    const DEFAULT_WIDTH = 260;

    /**
     * The main function to set up the resizer.
     * This is called only when the sidebar is found.
     */
    function setupResizer(sidebar) {
        // Prevent setup from running more than once
        if (sidebar.dataset.resizable) return;
        sidebar.dataset.resizable = 'true';

        console.log("Resizable Sidebar: Sidebar found, setting up handle.");

        // Apply saved width or default
        const savedWidth = GM_getValue('sidebarWidth', DEFAULT_WIDTH);
        sidebar.style.width = `${savedWidth}px`;
        sidebar.style.setProperty('--sidebar-width', `${savedWidth}px`);

        // Create the resize handle
        const handle = document.createElement('div');
        handle.id = 'resize-handle-chatgpt';

        // Add CSS for the handle and sidebar
        GM_addStyle(`
            /* Ensure the sidebar is a positioning context for the handle */
            ${SIDEBAR_SELECTOR} {
                position: relative !important;
                transition: none !important; /* For smooth, real-time resizing */
            }

            #resize-handle-chatgpt {
                position: absolute;
                top: 0;
                right: 0; /* Positioned INSIDE the edge to avoid being hidden by overflow */
                width: 8px; /* A bit wider for easier grabbing */
                height: 100%;
                cursor: col-resize;
                z-index: 1000;
            }

            /* Visual flair for the handle */
            #resize-handle-chatgpt:hover::after,
            #resize-handle-chatgpt.resizing::after {
                content: '';
                position: absolute;
                top: 0;
                left: 3px;
                width: 2px;
                height: 100%;
                background-color: #56a2f8; /* A blue line appears on hover/drag */
                border-radius: 2px;
            }
        `);

        sidebar.appendChild(handle);

        // --- Dragging Logic ---
        const onMouseMove = (e) => {
            let newWidth = e.clientX;
            if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
            if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;
            sidebar.style.width = `${newWidth}px`;
            sidebar.style.setProperty('--sidebar-width', `${newWidth}px`);
        };

        const onMouseUp = () => {
            handle.classList.remove('resizing');
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            GM_setValue('sidebarWidth', parseInt(sidebar.style.width, 10));
        };

        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handle.classList.add('resizing');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    /**
     * Use a MutationObserver to wait for the sidebar to be added to the page.
     * This is the most reliable way to handle dynamically loaded content.
     */
    const observer = new MutationObserver((mutationsList, obs) => {
        const sidebar = document.querySelector(SIDEBAR_SELECTOR);
        if (sidebar) {
            setupResizer(sidebar);
            // We found it, so we can stop observing to save resources.
            // obs.disconnect(); // Uncomment this line if you find it's firing too often, but it's generally safe to leave it running for SPA navigation.
        }
    });

    // Start observing the entire document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();