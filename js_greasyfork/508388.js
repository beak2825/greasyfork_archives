// ==UserScript==
// @name         Panzoid Clipmaker Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds bending scale, motion blur, and render engine chooser to Panzoid Clipmaker tool
// @author       Your Name
// @match        https://panzoid.com/tools/clipmaker
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508388/Panzoid%20Clipmaker%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/508388/Panzoid%20Clipmaker%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load completely
    window.addEventListener('load', function() {

        // Function to add bending scale slider under each shape
        function addBendingScale() {
            // Assuming shapes are elements with certain classes or IDs
            const shapes = document.querySelectorAll('.shape-selector'); // Replace with the actual selector for shapes
            
            shapes.forEach(shape => {
                const bendScaleContainer = document.createElement('div');
                bendScaleContainer.innerHTML = `
                    <label for="bend-scale">Bending Scale:</label>
                    <input type="range" id="bend-scale" min="0" max="100" value="50">
                `;
                shape.appendChild(bendScaleContainer);

                // Add event listener to the bending scale
                const bendScale = bendScaleContainer.querySelector('#bend-scale');
                bendScale.addEventListener('input', function(event) {
                    const bendValue = event.target.value;
                    // Apply bending logic to the shape (pseudo-code, replace with actual logic)
                    // shape.style.transform = `rotate(${bendValue}deg)`; // Example of bending
                });
            });
        }

        // Function to add motion blur option
        function addMotionBlurOption() {
            const motionBlurContainer = document.createElement('div');
            motionBlurContainer.innerHTML = `
                <label for="motion-blur">Motion Blur:</label>
                <input type="checkbox" id="motion-blur">
            `;

            const controlsContainer = document.querySelector('.controls-container'); // Replace with actual container
            controlsContainer.appendChild(motionBlurContainer);

            // Add event listener for motion blur toggle
            const motionBlurCheckbox = document.querySelector('#motion-blur');
            motionBlurCheckbox.addEventListener('change', function(event) {
                const isChecked = event.target.checked;
                // Apply motion blur logic (pseudo-code)
                // if (isChecked) { enableMotionBlur(); } else { disableMotionBlur(); }
            });
        }

        // Function to add render engine chooser
        function addRenderEngineChooser() {
            const renderEngineContainer = document.createElement('div');
            renderEngineContainer.innerHTML = `
                <label for="render-engine">Render Engine:</label>
                <select id="render-engine">
                    <option value="default">Default</option>
                    <option value="experimental">Experimental (Unreleased)</option>
                </select>
            `;

            const downloadButton = document.querySelector('#download-button'); // Replace with actual download button selector
            downloadButton.insertAdjacentElement('beforebegin', renderEngineContainer);

            // Add event listener for render engine choice
            const renderEngineSelect = document.querySelector('#render-engine');
            renderEngineSelect.addEventListener('change', function(event) {
                const selectedEngine = event.target.value;
                // Switch render engine logic (pseudo-code)
                // if (selectedEngine === 'experimental') { enableExperimentalFeatures(); }
            });
        }

        // Run the functions to add the new features
        addBendingScale();
        addMotionBlurOption();
        addRenderEngineChooser();

    }, false);
})();
