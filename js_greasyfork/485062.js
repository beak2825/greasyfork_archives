// ==UserScript==
// @name         Filelist.io Size Filter
// @version      0.2
// @description  Add sliders and dropdown menus to filter filelist.io results by size
// @author       konvar
// @match        https://filelist.io/browse.php*
// @grant        none
// @namespace https://greasyfork.org/users/1228860
// @downloadURL https://update.greasyfork.org/scripts/485062/Filelistio%20Size%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/485062/Filelistio%20Size%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your existing HTML block
    const existingForm = document.querySelector('table tbody tr td form');

    // Create a div to hold sliders and dropdown menus
    const filterContainer = document.createElement('div');
    filterContainer.style.display = 'flex';
    filterContainer.style.justifyContent = 'center';
    filterContainer.style.alignItems = 'center';
    filterContainer.style.flexWrap = 'wrap'; // Allow flex items to wrap
    filterContainer.style.marginTop = '10px'; // Adjust the top margin
    filterContainer.style.marginBottom = '10px'; // Adjust the bottom margin

    // Create dropdown menus for minimum and maximum size
    const minSizeDropdown = createDropdown('Min Size:', 'minSizeDropdown', ['KB', 'MB', 'GB', 'TB']);
    const maxSizeDropdown = createDropdown('Max Size:', 'maxSizeDropdown', ['KB', 'MB', 'GB', 'TB']);

    // Set default values for dropdowns if not present in localStorage
    minSizeDropdown.value = localStorage.getItem('minSizeDropdown') || 'KB';
    maxSizeDropdown.value = localStorage.getItem('maxSizeDropdown') || 'TB';

    // Create sliders for minimum and maximum size
    const minSizeSlider = createSlider('Min Size:', 'minSizeSlider', 0, 999);
    const maxSizeSlider = createSlider('Max Size:', 'maxSizeSlider', 0, 999);

    // Append the div containing sliders and dropdown menus after the existing form
    existingForm.appendChild(filterContainer);

    // Function to create sliders
    function createSlider(labelText, sliderId, minValue, maxValue) {
        const sliderContainer = document.createElement('div');
        sliderContainer.style.display = 'flex';
        sliderContainer.style.flexDirection = 'row'; // Display label, slider, and value in a row
        sliderContainer.style.alignItems = 'center';
        sliderContainer.style.margin = '0 10px';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.marginRight = '5px'; // Adjust margin for spacing
        sliderContainer.appendChild(label);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = sliderId;
        slider.min = minValue;
        slider.max = maxValue;
        slider.value = minValue;

        // Retrieve saved value from localStorage
        const savedValue = localStorage.getItem(sliderId);
        if (savedValue !== null) {
            slider.value = savedValue;
        }

        sliderContainer.appendChild(slider);

        // Display current value
        const valueSpan = document.createElement('span');
        valueSpan.id = sliderId + 'Value';
        valueSpan.textContent = `${parseFloat(slider.value).toFixed(2)} ${sliderId.includes('min') ? minSizeDropdown.value : maxSizeDropdown.value}`;
        valueSpan.style.marginLeft = '5px'; // Adjust margin for spacing
        sliderContainer.appendChild(valueSpan);

        // Add event listener to update the displayed value and save to localStorage
        slider.addEventListener('input', function () {
            const unit = sliderId.includes('min') ? minSizeDropdown.value : maxSizeDropdown.value;
            valueSpan.textContent = `${parseFloat(slider.value).toFixed(2)} ${unit}`;
            localStorage.setItem(sliderId, slider.value);

            // Call the function to filter results based on size
            filterTorrentResults(
                parseFloat(minSizeSlider.value),
                parseFloat(maxSizeSlider.value),
                minSizeDropdown.value,
                maxSizeDropdown.value
            );
        });

        // Append slider to the common div
        filterContainer.appendChild(sliderContainer);

        return slider;
    }

    // Function to create dropdown menus
    function createDropdown(labelText, dropdownId, options) {
        const dropdownContainer = document.createElement('div');
        dropdownContainer.style.display = 'flex';
        dropdownContainer.style.flexDirection = 'row'; // Display label, dropdown in a row
        dropdownContainer.style.alignItems = 'center';
        dropdownContainer.style.margin = '0 10px';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.marginRight = '5px'; // Adjust margin for spacing
        dropdownContainer.appendChild(label);

        const dropdown = document.createElement('select');
        dropdown.id = dropdownId;

        // Create options for the dropdown
        options.forEach((option) => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.text = option;
            dropdown.appendChild(optionElement);
        });

        // Retrieve saved value from localStorage
        const savedValue = localStorage.getItem(dropdownId);
        if (savedValue !== null) {
            dropdown.value = savedValue;
        }

        dropdownContainer.appendChild(dropdown);

        // Add event listener to update the displayed value and save to localStorage
        dropdown.addEventListener('change', function () {
            localStorage.setItem(dropdownId, dropdown.value);
            // Call the function to filter results based on size
            filterTorrentResults(
                parseFloat(minSizeSlider.value),
                parseFloat(maxSizeSlider.value),
                minSizeDropdown.value,
                maxSizeDropdown.value
            );
        });

        // Append dropdown to the common div
        filterContainer.appendChild(dropdownContainer);

        return dropdown;
    }

    // Add event listeners to dropdown menus
    minSizeDropdown.addEventListener('change', updateUnitAndFilter);
    maxSizeDropdown.addEventListener('change', updateUnitAndFilter);

    // Function to update the displayed filter values and unit
    function updateUnitAndFilter() {
        const minSizeUnit = minSizeDropdown.value;
        const maxSizeUnit = maxSizeDropdown.value;

        // Ensure that the minimum unit is smaller than or equal to the maximum unit
        if (minSizeDropdown.selectedIndex > maxSizeDropdown.selectedIndex) {
            // Swap the values if the order is incorrect
            const temp = minSizeDropdown.value;
            minSizeDropdown.value = maxSizeDropdown.value;
            maxSizeDropdown.value = temp;
        }

        // Update the displayed unit for the sliders
        document.getElementById('minSizeSliderValue').textContent = `${parseFloat(minSizeSlider.value).toFixed(2)} ${minSizeDropdown.value}`;
        document.getElementById('maxSizeSliderValue').textContent = `${parseFloat(maxSizeSlider.value).toFixed(2)} ${maxSizeDropdown.value}`;

        // Save the selected units to localStorage
        localStorage.setItem('minSizeDropdown', minSizeDropdown.value);
        localStorage.setItem('maxSizeDropdown', maxSizeDropdown.value);

        // Call the function to filter results based on size
        filterTorrentResults(
            parseFloat(minSizeSlider.value),
            parseFloat(maxSizeSlider.value),
            minSizeUnit,
            maxSizeUnit
        );
    }

   // Add event listener to update the displayed value and save to localStorage for minSizeSlider
    minSizeSlider.addEventListener('input', function () {
    const unit = minSizeDropdown.value;
    const maxValue = parseFloat(maxSizeSlider.value);

    // Update the displayed value
    const valueSpan = document.getElementById('minSizeSliderValue');
    valueSpan.textContent = `${parseFloat(minSizeSlider.value).toFixed(2)} ${unit}`;

    // Save to localStorage
    localStorage.setItem('minSizeSlider', minSizeSlider.value);

    // Check if the new minimum value is greater than the current maximum value
    if (parseFloat(minSizeSlider.value) > maxValue && minSizeDropdown.value === maxSizeDropdown.value) {
        // If yes, update the maximum slider to the new minimum value
        maxSizeSlider.value = minSizeSlider.value;
        // Update the displayed value for the maximum slider
        document.getElementById('maxSizeSliderValue').textContent = `${parseFloat(maxSizeSlider.value).toFixed(2)} ${unit}`;
        // Save to localStorage
        localStorage.setItem('maxSizeSlider', maxSizeSlider.value);
    }

    // Call the function to filter results based on size
    filterTorrentResults(
        parseFloat(minSizeSlider.value),
        parseFloat(maxSizeSlider.value),
        minSizeDropdown.value,
        maxSizeDropdown.value
    );
});


    // Function to update the displayed filter values
    function updateFilter() {
        const minSize = parseFloat(minSizeSlider.value);
        const maxSize = parseFloat(maxSizeSlider.value);

        // Update the displayed unit for the sliders
        document.getElementById('minSizeSliderValue').textContent = `${minSize.toFixed(2)} ${minSizeDropdown.value}`;
        document.getElementById('maxSizeSliderValue').textContent = `${maxSize.toFixed(2)} ${maxSizeDropdown.value}`;

        // Call the function to filter results based on size
        filterTorrentResults(minSize, maxSize, minSizeDropdown.value, maxSizeDropdown.value);
    }

    // Initial setup to set the correct unit for the sliders
    minSizeDropdown.value = localStorage.getItem('minSizeDropdown') || 'KB';
    maxSizeDropdown.value = localStorage.getItem('maxSizeDropdown') || 'KB';
    updateUnitAndFilter(); // Call the function to set the correct unit initially

    // Function to filter torrent results based on size
    function filterTorrentResults(minSize, maxSize, minSizeUnit, maxSizeUnit) {
        const torrentRows = document.querySelectorAll('.torrentrow');
        torrentRows.forEach((row) => {
            const sizeElement = row.querySelector('.torrenttable:nth-child(7) font.small');
            if (sizeElement) {
                const sizeText = sizeElement.textContent.trim(); // Extract size value
                const size = parseSize(sizeText, minSizeUnit);
                const sizeInMaxUnit = convertSize(size, minSizeUnit, maxSizeUnit);

                // Check if the size is greater than or equal to the min size slider
                // and less than or equal to the max size slider
                row.style.display = size >= minSize && sizeInMaxUnit <= maxSize ? '' : 'none';
            }
        });
    }

    // Function to parse sizes and convert them to the selected unit
    function parseSize(sizeText, sizeUnit) {
        const match = sizeText.match(/([\d.]+)\s*([KMGTP]B)/i);
        if (match) {
            const value = parseFloat(match[1]);
            const unit = match[2].toUpperCase();

            return convertSize(value, unit, sizeUnit);
        }
        return 0; // Default to 0 for unrecognized units
    }

    // Function to convert sizes to the selected unit
    function convertSize(value, fromUnit, toUnit) {
        const units = { KB: 1, MB: 1024, GB: 1024 * 1024, TB: 1024 * 1024 * 1024 };

        if (fromUnit in units && toUnit in units) {
            return (value * units[fromUnit]) / units[toUnit];
        }

        return value; // Default to the original value if units are not recognized
    }

    // Watch for changes in the content using MutationObserver
    const observer = new MutationObserver(() => {
        // Reapply filtering when the content changes
        filterTorrentResults(
            parseFloat(minSizeSlider.value),
            parseFloat(maxSizeSlider.value),
            minSizeDropdown.value,
            maxSizeDropdown.value
        );
    });

    // Configure and start the observer
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();
