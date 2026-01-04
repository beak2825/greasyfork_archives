// ==UserScript==
// @name         Scroll mode for touchpad/mouse without/missing scroll/middle button
// @author       NWP
// @description  Enable scroll mode for touchpad/mouse without/missing scroll/middle button when Ctrl + Space or Ctrl + Shift and touchpad/left touchpad button/left mouse button are pressed. Text selection is enabled for Ctrl + Shift.
// @namespace    https://greasyfork.org/users/877912
// @version      0.1
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496129/Scroll%20mode%20for%20touchpadmouse%20withoutmissing%20scrollmiddle%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/496129/Scroll%20mode%20for%20touchpadmouse%20withoutmissing%20scrollmiddle%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sensitivity factor determines the scroll speed relative to mouse movement.
    // A higher value results in faster scrolling, while a lower value makes the scrolling slower.
    // Example:
    // - If sensitivity = 1.0, moving the mouse 100 pixels will scroll 100 pixels.
    // - If sensitivity = 0.5, moving the mouse 100 pixels will scroll 50 pixels.
    const sensitivity = 0.5;


    let scrollModeEnabled = false;
    let selectModeEnabled = false;
    let initialMouseY = 0;
    let scrollSpeed = 0;
    let scrollInterval = null;

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.code === 'Space' && !scrollModeEnabled) {
            scrollModeEnabled = true;
            document.body.style.cursor = 'ns-resize'; // Indicate scroll mode is active
            disableTextSelection();
        }
        if (event.ctrlKey && event.shiftKey && !selectModeEnabled) {
            selectModeEnabled = true;
            document.body.style.cursor = 'ns-resize'; // Indicate select mode is active
            enableTextSelection();
        }
    });

    document.addEventListener('keyup', function(event) {
        // Check specific keyup events to exit scroll mode
        if (event.code === 'Space' || event.code === 'ControlLeft' || event.code === 'ControlRight') {
            exitScrollMode();
        }
        // Check specific keyup events to exit select mode
        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight' || event.code === 'ControlLeft' || event.code === 'ControlRight') {
            exitSelectMode();
        }
    });

    document.addEventListener('mousedown', function(event) {
        if (scrollModeEnabled && event.button === 0) {
            initialMouseY = event.clientY; // Set initial position for scroll calculation
            startAutoScroll();
        }
        if (selectModeEnabled && event.button === 0) {
            initialMouseY = event.clientY; // Set initial position for scroll calculation
            startAutoScroll();
        }
    });

    document.addEventListener('mouseup', function(event) {
        if (event.button === 0) {
            exitScrollMode();
            exitSelectMode();
        }
    });

    document.addEventListener('mousemove', function(event) {
        if ((scrollModeEnabled || selectModeEnabled) && scrollInterval) {
            let currentMouseY = event.clientY;
            scrollSpeed = (currentMouseY - initialMouseY) * sensitivity;
        }
    });

    function startAutoScroll() {
        if (!scrollInterval) {
            scrollInterval = setInterval(function() {
                window.scrollBy(0, scrollSpeed); // Scroll based on current calculated speed
            }, 50);
        }
    }

    function stopAutoScroll() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    }

    function exitScrollMode() {
        if (scrollModeEnabled) {
            scrollModeEnabled = false;
            scrollSpeed = 0;
            document.body.style.cursor = 'default';
            enableTextSelection(); // Ensure text selection is enabled again
            stopAutoScroll();
        }
    }

    function exitSelectMode() {
        if (selectModeEnabled) {
            selectModeEnabled = false;
            scrollSpeed = 0;
            document.body.style.cursor = 'default';
            stopAutoScroll();
        }
    }

    function disableTextSelection() {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.msUserSelect = 'none';
        document.body.style.mozUserSelect = 'none';
    }

    function enableTextSelection() {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.msUserSelect = '';
        document.body.style.mozUserSelect = '';
    }
})();
