// ==UserScript==
// @name         Ultra Smooth Zoom Slider (Fixed & Isolated UI)
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Adds an ultra-smooth zoom slider with draggable functionality. Keeps slider always visible and unaffected by zoom.
// @author       tae
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526162/Ultra%20Smooth%20Zoom%20Slider%20%28Fixed%20%20Isolated%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526162/Ultra%20Smooth%20Zoom%20Slider%20%28Fixed%20%20Isolated%20UI%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createZoomSlider() {
        console.log("✅ Ultra Smooth Zoom Slider Initialized...");

        // Create the slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0.5';
        slider.max = '2';
        slider.step = '0.01';
        slider.value = '1';
        slider.style.width = '200px';

        // Create a container for the slider
        const sliderContainer = document.createElement('div');
        Object.assign(sliderContainer.style, {
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            zIndex: '999999', // High z-index to stay on top
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid #ccc',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
            cursor: 'grab',
            userSelect: 'none'
        });

        sliderContainer.appendChild(slider);
        document.body.appendChild(sliderContainer);

        console.log("🎯 Zoom slider added successfully.");

        // Create a zoomable wrapper
        const zoomWrapper = document.createElement('div');
        zoomWrapper.id = 'zoom-wrapper';
        while (document.body.firstChild && document.body.firstChild !== sliderContainer) {
            zoomWrapper.appendChild(document.body.firstChild);
        }
        document.body.insertBefore(zoomWrapper, sliderContainer);

        // Apply transform to wrapper, not the whole document
        zoomWrapper.style.transformOrigin = 'top left';
        zoomWrapper.style.transition = 'transform 0.2s ease-out';

        slider.addEventListener('input', function () {
            zoomWrapper.style.transform = `scale(${slider.value})`;
        });

        // Dragging functionality
        let isDragging = false;
        let startX, startY, initialLeft, initialBottom;

        sliderContainer.addEventListener('mousedown', function (e) {
            isDragging = true;
            sliderContainer.style.cursor = 'grabbing';
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = sliderContainer.offsetLeft;
            initialBottom = window.innerHeight - sliderContainer.offsetTop - sliderContainer.offsetHeight;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                sliderContainer.style.left = `${Math.max(0, initialLeft + dx)}px`;
                sliderContainer.style.bottom = `${Math.max(0, initialBottom - dy)}px`;
            }
        }

        function onMouseUp() {
            isDragging = false;
            sliderContainer.style.cursor = 'grab';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createZoomSlider);
    } else {
        createZoomSlider();
    }
})();