// ==UserScript==
// @name         Auto Fill Player Ratings with Custom Ranges and Auto-Click (Improved UI)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Automatically fill player rating input boxes with random numbers within specified ranges and click on each input box to validate them, with improved UI.
// @author       tanguy
// @match        *://*.ea.com/games/ea-sports-college-football/team-builder/team-create/*
// @icon         https://i.imgur.com/9nq6Rpp.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502180/Auto%20Fill%20Player%20Ratings%20with%20Custom%20Ranges%20and%20Auto-Click%20%28Improved%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/502180/Auto%20Fill%20Player%20Ratings%20with%20Custom%20Ranges%20and%20Auto-Click%20%28Improved%20UI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let minMaxBoxesVisible = false;

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateAllMinMaxInputs() {
        const globalMin = parseInt(document.getElementById('global-min').value) || 0;
        const globalMax = parseInt(document.getElementById('global-max').value) || 99;
        const minBoxes = document.querySelectorAll('input.min-range');
        const maxBoxes = document.querySelectorAll('input.max-range');

        minBoxes.forEach(minBox => minBox.value = globalMin);
        maxBoxes.forEach(maxBox => maxBox.value = globalMax);
    }

    function addRangeInputs() {
        const forms = document.querySelectorAll('form.playerRating-item');

        forms.forEach(form => {
            const ratingDiv = form.querySelector('div.playerRating-item--ranking');
            const existingRangeContainer = form.querySelector('.range-container');

            if (!existingRangeContainer) {
                const rangeContainer = document.createElement('div');
                rangeContainer.style.display = minMaxBoxesVisible ? 'flex' : 'none';
                rangeContainer.style.alignItems = 'center';
                rangeContainer.style.marginBottom = '5px';
                rangeContainer.className = 'range-container';

                const minBox = document.createElement('input');
                minBox.type = 'number';
                minBox.placeholder = 'Min';
                minBox.className = 'input input--sm min-range';
                minBox.value = '0';
                minBox.style.marginRight = '5px';
                minBox.style.width = '60px';

                const maxBox = document.createElement('input');
                maxBox.type = 'number';
                maxBox.placeholder = 'Max';
                maxBox.className = 'input input--sm max-range';
                maxBox.value = '99';
                maxBox.style.marginRight = '5px';
                maxBox.style.width = '60px';

                rangeContainer.appendChild(minBox);
                rangeContainer.appendChild(maxBox);

                ratingDiv.parentNode.insertBefore(rangeContainer, ratingDiv);
            }
        });
    }

    function toggleMinMaxBoxes() {
        minMaxBoxesVisible = !minMaxBoxesVisible;
        const rangeContainers = document.querySelectorAll('.range-container');
        rangeContainers.forEach(container => {
            container.style.display = minMaxBoxesVisible ? 'flex' : 'none';
        });
        document.getElementById('toggle-min-max').textContent = minMaxBoxesVisible ? 'Hide Min/Max' : 'Show Min/Max';
    }

    function randomizeHeightWeight() {
        const heightMin = parseInt(document.getElementById('height-min').value) || 60;
        const heightMax = parseInt(document.getElementById('height-max').value) || 80;
        const weightMin = parseInt(document.getElementById('weight-min').value) || 160;
        const weightMax = parseInt(document.getElementById('weight-max').value) || 400;

        const heightSlider = document.querySelector('input[type="range"]#heightSlider');
        const weightSlider = document.querySelector('input[type="range"]#weightSlider');

        if (heightSlider) {
            heightSlider.value = getRandomNumber(heightMin, heightMax);
            heightSlider.dispatchEvent(new Event('input', { bubbles: true }));
            heightSlider.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (weightSlider) {
            weightSlider.value = getRandomNumber(weightMin, weightMax);
            weightSlider.dispatchEvent(new Event('input', { bubbles: true }));
            weightSlider.dispatchEvent(new Event('change', { bubbles: true }));
        }

        heightSlider.focus();
        weightSlider.focus();
        heightSlider.click();
    }

    function randomizeRatings() {
        addRangeInputs(); // Ensure range inputs exist

        const forms = document.querySelectorAll('form.playerRating-item');

        forms.forEach(form => {
            const inputBox = form.querySelector('input[type="number"].input.input--sm.no-arrows');
            const minBox = form.querySelector('input.min-range');
            const maxBox = form.querySelector('input.max-range');

            if (inputBox) {
                let min, max;
                if (minMaxBoxesVisible && minBox && maxBox) {
                    min = parseInt(minBox.value) || 0;
                    max = parseInt(maxBox.value) || 99;
                } else {
                    min = parseInt(document.getElementById('global-min').value) || 0;
                    max = parseInt(document.getElementById('global-max').value) || 99;
                }

                const validMin = Math.max(0, min);
                const validMax = Math.min(99, max);

                if (validMin <= validMax) {
                    inputBox.value = getRandomNumber(validMin, validMax);

                    inputBox.focus();
                    const event = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        bubbles: true,
                    });
                    inputBox.dispatchEvent(event);
                }
            }
        });
    }

    function toggleControlPanel() {
        const controlPanel = document.getElementById('randomizer-control-panel');
        const toggleButton = document.getElementById('toggle-control-panel');
        if (controlPanel.style.display === 'none') {
            controlPanel.style.display = 'block';
            toggleButton.textContent = 'Hide Controls';
        } else {
            controlPanel.style.display = 'none';
            toggleButton.textContent = 'Show Controls';
        }
    }

    function createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'randomizer-control-panel';
        controlPanel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 10px;
            width: 200px;
            max-height: 80vh;
            background-color: #f0f0f0;
            padding: 10px;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
            overflow-y: auto;
            z-index: 9998;
            font-size: 12px;
        `;

        controlPanel.innerHTML = `
            <h3 style="margin-top: 0;">Randomizer Controls</h3>
            <div class="control-section">
                <h4>Global Range</h4>
                <input type="number" id="global-min" placeholder="Global Min" value="0">
                <input type="number" id="global-max" placeholder="Global Max" value="99">
            </div>
            <div class="control-section">
                <button id="toggle-min-max">Show Min/Max</button>
                <button id="randomize-ratings">Randomize Ratings</button>
            </div>
            <div class="control-section">
                <h4>Height & Weight</h4>
                <input type="number" id="height-min" placeholder="Height Min (in)" value="60">
                <input type="number" id="height-max" placeholder="Height Max (in)" value="80">
                <input type="number" id="weight-min" placeholder="Weight Min (lbs)" value="160">
                <input type="number" id="weight-max" placeholder="Weight Max (lbs)" value="400">
                <button id="randomize-height-weight">Randomize Height & Weight</button>
            </div>

        `;

        document.body.appendChild(controlPanel);

        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-control-panel';
        toggleButton.textContent = 'Hide Controls';
        toggleButton.style.cssText = `
            position: fixed;
            top: 80px;
            right: 10px;
            z-index: 9999;
            padding: 5px 10px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        `;
        document.body.appendChild(toggleButton);

        // Add event listeners
        document.getElementById('randomize-height-weight').addEventListener('click', randomizeHeightWeight);
        document.getElementById('randomize-ratings').addEventListener('click', randomizeRatings);
        document.getElementById('global-min').addEventListener('input', updateAllMinMaxInputs);
        document.getElementById('global-max').addEventListener('input', updateAllMinMaxInputs);
        document.getElementById('toggle-min-max').addEventListener('click', toggleMinMaxBoxes);
        toggleButton.addEventListener('click', toggleControlPanel);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #randomizer-control-panel input[type="number"] {
                width: 100%;
                margin-bottom: 5px;
                padding: 3px;
            }
            #randomizer-control-panel button {
                width: 100%;
                padding: 5px;
                background-color: #007bff;
                color: white;
                border: none;
                cursor: pointer;
                margin-bottom: 5px;
            }
            #randomizer-control-panel .control-section {
                margin-bottom: 10px;
            }
            #randomizer-control-panel h4 {
                margin: 5px 0;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize the control panel
    createControlPanel();
    addRangeInputs(); // Add range inputs initially (they will be hidden)
})();