// ==UserScript==
// @name         Useless Things Series: Text Hider Overlay
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Overlay to hide text with blur effect and draggable/resizable features. Good for when using a computer or laptop in a public area.  With create(alt h) multiple overlays, remove(alt j) the last created overlay, remove all overlay(alt k) except one, hide or show(alt l) all overlays.
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/488175/Useless%20Things%20Series%3A%20Text%20Hider%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/488175/Useless%20Things%20Series%3A%20Text%20Hider%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Function to create a new overlay
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'text-hide-overlay';
        overlay.innerHTML = `
            <div class="draggable-handle"></div>
            <div class="resize-controls">
                <div class="resize-minus">-</div>
                <input type="number" class="overlay-size" value="200" min="100">
                <div class="resize-plus">+</div>
            </div>
            <input type="range" min="0" max="10" value="5" class="blur-slider">
        `;
        document.body.appendChild(overlay);

        // Apply styles
        overlay.style.position = 'fixed';
        overlay.style.top = '50%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.width = '200px';
        overlay.style.height = '200px';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';
        overlay.style.border = '1px solid #ccc';
        overlay.style.overflow = 'hidden';
        overlay.style.filter = 'blur(5px)';
        overlay.style.webkitBackdropFilter = 'blur(5px)';
        overlay.style.backdropFilter = 'blur(5px)';
        overlay.style.pointerEvents = 'none'; /* Allow mouse events to pass through */
        overlay.style.display = 'none'; /* Initially hide the overlay */

        // Drag and drop functionality
        let isDragging = false;
        let offsetX, offsetY;

        const draggableHandle = overlay.querySelector('.draggable-handle');

        draggableHandle.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            isDragging = true;
            offsetX = e.clientX - overlay.offsetLeft;
            offsetY = e.clientY - overlay.offsetTop;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        }

        function drag(e) {
            if (isDragging) {
                overlay.style.left = e.clientX - offsetX + 'px';
                overlay.style.top = e.clientY - offsetY + 'px';
            }
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }

        // Functionality for resizing the overlay
        const resizePlus = overlay.querySelector('.resize-plus');
        const resizeMinus = overlay.querySelector('.resize-minus');
        const overlaySize = overlay.querySelector('.overlay-size');
        const blurSlider = overlay.querySelector('.blur-slider');

        resizePlus.addEventListener('click', () => {
            const newSize = parseInt(overlaySize.value) + 10;
            overlaySize.value = newSize;
            overlay.style.width = newSize + 'px';
            overlay.style.height = newSize + 'px';
        });

        resizeMinus.addEventListener('click', () => {
            const newSize = parseInt(overlaySize.value) - 10;
            if (newSize >= 100) {
                overlaySize.value = newSize;
                overlay.style.width = newSize + 'px';
                overlay.style.height = newSize + 'px';
            }
        });

        // Set default blur value to 0
        blurSlider.value = 0;

        // Apply initial blur to the overlay
        const initialBlurValue = 0;
        overlay.style.filter = `blur(${initialBlurValue}px)`;
        overlay.style.webkitFilter = `blur(${initialBlurValue}px)`;

        // Slider functionality
        blurSlider.addEventListener('input', (e) => {
            const blurValue = e.target.value;
            overlay.style.filter = `blur(${blurValue}px)`;
            overlay.style.webkitFilter = `blur(${blurValue}px)`;
        });

        overlaySize.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const newSize = parseInt(overlaySize.value);
                if (!isNaN(newSize) && newSize >= 100) {
                    overlay.style.width = newSize + 'px';
                    overlay.style.height = newSize + 'px';
                }
            }
        });

        return overlay;
    }

    // Function to create overlay
    function toggleOverlay(overlay) {
        overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
    }

    // Function to remove the last created overlay when 'j' is pressed
    function removeLastOverlay() {
        const overlay = document.querySelector('.text-hide-overlay:last-child');
        if (overlay) {
            overlay.parentNode.removeChild(overlay);
        }
    }

    // Function to remove all overlays except for one
    function removeAllOverlaysExceptOne() {
        const overlays = document.querySelectorAll('.text-hide-overlay');
        const numOverlays = overlays.length;
        if (numOverlays > 1) {
            for (let i = 0; i < numOverlays - 1; i++) {
                overlays[i].parentNode.removeChild(overlays[i]);
            }
        }
    }

    // Function to hide or show all overlays
    function toggleAllOverlays() {
        const overlays = document.querySelectorAll('.text-hide-overlay');
        overlays.forEach(overlay => {
            overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Call toggleOverlay function when a specific key is pressed
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'h') {
            const newOverlay = createOverlay();
            toggleOverlay(newOverlay);
        }
    });

    // Call removeLastOverlay function when 'j' is pressed
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'j') {
            removeLastOverlay();
        }
    });

    // Call removeAllOverlaysExceptOne function when 'k' is pressed
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'k') {
            removeAllOverlaysExceptOne();
        }
    });

    // Call toggleAllOverlays function when 'l' is pressed
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'l') {
            toggleAllOverlays();
        }
    });

    // Adding GM styles
    GM_addStyle(`
.text-hide-overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    border: 1px solid #ccc;
    overflow: hidden;
    filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    pointer-events: none; /* Allow mouse events to pass through */
    display: none; /* Initially hide the overlay */
}

.text-hide-overlay * {
    pointer-events: auto; /* Enable mouse events for all children */
}

.draggable-handle {
    width: 100%;
    height: 20px;
    cursor: move;
    background-color: #dc143c;
}

.resize-controls {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    background-color: #dc143c;
}

.resize-plus,
.resize-minus {
    width: 20px;
    height: 20px;
    cursor: pointer;
    background-color: #fff;
    text-align: center;
    line-height: 20px;
    background-color: #dc143c;
}

.resize-plus {
    margin-left: 5px;
    margin-right: 5px;
}

.resize-minus {
    margin-right: 5px;
}

.overlay-size {
    width: 50px;
    text-align: center;
}

.blur-slider {
    position: relative;
    z-index: 9999;
}
    `);

})();
