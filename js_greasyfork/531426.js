// ==UserScript==
// @name         Google Docs Outline Expander
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds dragable border for google docs outline in order to view long headings.
// @match        https://docs.google.com/document/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531426/Google%20Docs%20Outline%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/531426/Google%20Docs%20Outline%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HANDLE_WIDTH = 10;
    const VISIBILITY_THRESHOLD = 20;

    // Observe DOM until sidebar content ("Document tabs") appears
    const observer = new MutationObserver((mutations, obs) => {
        const readyIndicator = document.querySelector('#kix-outlines-widget-header-text-chaptered');
        if (readyIndicator) {
            obs.disconnect();
            initResizer();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function initResizer() {
        const sidebar = document.querySelector('.left-sidebar-container');
        if (!sidebar) {
            console.error('Sidebar container not found.');
            return;
        }

        let handle = sidebar.querySelector('.left-sidebar-resizer-drag-handle');
        if (!handle) {
            handle = document.createElement('div');
            handle.className = 'left-sidebar-resizer-drag-handle';
            sidebar.appendChild(handle);
        }

        Object.assign(handle.style, {
            display: 'block',
            position: 'absolute',
            top: '0',
            width: HANDLE_WIDTH + 'px',
            height: '100%',
            cursor: 'ew-resize',
            zIndex: '1000',
            background: 'rgba(0,0,0,0.1)',
            opacity: '0',
            transition: 'opacity 0.2s',
            pointerEvents: 'none'
        });

        const initialWidth = sidebar.offsetWidth;
        handle.style.left = (initialWidth - HANDLE_WIDTH) + 'px';

        let isResizing = false;
        let startX, startWidth;

        handle.addEventListener('mousedown', function(e) {
            isResizing = true;
            startX = e.clientX;
            startWidth = sidebar.offsetWidth;
            handle.style.opacity = '1';
            handle.style.pointerEvents = 'auto';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (isResizing) {
                const diffX = e.clientX - startX;
                const newWidth = startWidth + diffX;
                if (newWidth > 100) {
                    sidebar.style.width = newWidth + 'px';
                    handle.style.left = (newWidth - HANDLE_WIDTH) + 'px';
                    const content = sidebar.querySelector('.left-sidebar-container-content');
                    if (content) {
                        content.style.width = (newWidth - HANDLE_WIDTH) + 'px';
                    }
                }
            } else {
                const rect = sidebar.getBoundingClientRect();
                if (e.clientX >= rect.right - VISIBILITY_THRESHOLD && e.clientX <= rect.right + 50) {
                    handle.style.opacity = '1';
                    handle.style.pointerEvents = 'auto';
                } else {
                    handle.style.opacity = '0';
                    handle.style.pointerEvents = 'none';
                }
            }
        });

        document.addEventListener('mouseup', function() {
            if (isResizing) {
                isResizing = false;
            }
        });

        handle.addEventListener('mouseenter', function() {
            handle.style.opacity = '1';
            handle.style.pointerEvents = 'auto';
        });
        handle.addEventListener('mouseleave', function() {
            if (!isResizing) {
                handle.style.opacity = '0';
                handle.style.pointerEvents = 'none';
            }
        });
    }
})();
