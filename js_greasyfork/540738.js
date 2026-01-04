// ==UserScript==
// @name         Kilgore's Sandwich
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Paste Adobe CSV/TSV data and get % change with Bayesian probability (no p-values)
// @author       David Swinstead
// @match        https://experience.adobe.com/*
// @grant        none
// @license      CC-BY-NC-4.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/540738/Kilgore%27s%20Sandwich.user.js
// @updateURL https://update.greasyfork.org/scripts/540738/Kilgore%27s%20Sandwich.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Global variables
    let currentData = [];
    let currentATP = null;
    let currentGlobalVisits = null;

    // Bayesian calculation functions
    function calculateBayesianProb(controlVisits, controlConversions, variantVisits, variantConversions) {
        console.log("Bayesian calc:", controlVisits, controlConversions, variantVisits, variantConversions);

        // Validate inputs
        if (controlVisits <= 0 || variantVisits <= 0 ||
            controlConversions < 0 || variantConversions < 0 ||
            controlConversions > controlVisits || variantConversions > variantVisits) {
            console.warn('Invalid Bayesian inputs:', { controlVisits, controlConversions, variantVisits, variantConversions });
            return 0.5;
        }

        const alpha1 = 1 + controlConversions;
        const beta1 = 1 + controlVisits - controlConversions;
        const alpha2 = 1 + variantConversions;
        const beta2 = 1 + variantVisits - variantConversions;

        // Use normal approximation for large sample sizes
        if (controlVisits > 30 && variantVisits > 30) {
            const mean1 = alpha1 / (alpha1 + beta1);
            const mean2 = alpha2 / (alpha2 + beta2);
            const var1 = (alpha1 * beta1) / ((alpha1 + beta1) * (alpha1 + beta1) * (alpha1 + beta1 + 1));
            const var2 = (alpha2 * beta2) / ((alpha2 + beta2) * (alpha2 + beta2) * (alpha2 + beta2 + 1));

            const diffMean = mean2 - mean1;
            const diffVar = var1 + var2;
            const diffStd = Math.sqrt(diffVar);

            if (diffStd === 0) return 0.5;

            const z = diffMean / diffStd;
            return normalCDF(z);
        }

        // For smaller samples, use simplified Monte Carlo
        const samples = 10000;
        let variantBetterCount = 0;

        for (let i = 0; i < samples; i++) {
            const sampleA = simpleBetaSample(alpha1, beta1);
            const sampleB = simpleBetaSample(alpha2, beta2);

            if (sampleB > sampleA) {
                variantBetterCount++;
            }
        }

        return variantBetterCount / samples;
    }

    function simpleBetaSample(alpha, beta) {
        let sum = 0;
        for (let i = 0; i < alpha; i++) {
            sum += -Math.log(Math.random());
        }
        for (let i = 0; i < beta; i++) {
            sum += -Math.log(Math.random());
        }
        const x = -Math.log(Math.random());
        return x / (x + sum);
    }

    function normalCDF(x) {
        return 0.5 * (1 + erf(x / Math.sqrt(2)));
    }

    function erf(x) {
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    // ATP and Configuration Management
    function extractATPFromCSV(csvText) {
        const atpMatch = csvText.match(/ATP-\d+/);
        return atpMatch ? atpMatch[0] : null;
    }

    function extractStartDateFromCSV(csvText) {
        // Look for date pattern in the header section like "# Date: Jun 24, 2025 - Jul 24, 2025"
        const dateMatch = csvText.match(/^"?#\s*Date:\s*([^-]+)\s*-\s*([^"]+)"?/mi);
        if (dateMatch) {
            const startDateStr = dateMatch[1].trim();
            const endDateStr = dateMatch[2].trim();

            try {
                const parseDate = (dateStr) => {
                    const parts = dateStr.replace(',', '').split(' '); // e.g., ["Jun", "24", "2025"]
                    const months = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
                    const year = parseInt(parts[2], 10);
                    const month = months[parts[0]];
                    const day = parseInt(parts[1], 10);
                    return new Date(year, month, day); // Creates date at local midnight
                };

                const startDate = parseDate(startDateStr);
                const endDate = parseDate(endDateStr);

                // Validate dates
                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                    return {
                        startDate: startDate,
                        endDate: endDate,
                        startDateStr: startDateStr,
                        endDateStr: endDateStr
                    };
                }
            } catch (e) {
                console.warn('Failed to parse dates from CSV:', e);
            }
        }
        return null;
    }

    function saveConfiguration(atpNumber, config) {
        const configs = JSON.parse(localStorage.getItem('atpConfigurations') || '{}');
        configs[atpNumber] = config;
        localStorage.setItem('atpConfigurations', JSON.stringify(configs));
    }

    function loadConfiguration(atpNumber) {
        const configs = JSON.parse(localStorage.getItem('atpConfigurations') || '{}');
        return configs[atpNumber] || null;
    }

    function getAllMetricNames(data) {
        return [...new Set(data.map(item => item.label))].sort();
    }

    // Typeahead Dropdown Component
    function createTypeaheadDropdown(id, placeholder, options, selectedValue = '', maxSelections = 1) {
        const isMultiple = maxSelections > 1;
        const selectedItems = isMultiple ? (Array.isArray(selectedValue) ? selectedValue : []) : (selectedValue ? [selectedValue] : []);

        const hasReachedMax = selectedItems.length >= maxSelections;

        return `
            <div class="typeahead-container" data-max="${maxSelections}">
                <div class="typeahead-input-container" id="${id}_container">
                    ${selectedItems.map(item =>
                        `<span class="selected-tag">${item} <span class="remove-tag" data-value="${item}">×</span></span>`
                    ).join('')}
                    <input type="text" id="${id}" placeholder="${placeholder}" value=""
                           class="typeahead-input" autocomplete="off" style="display: ${hasReachedMax ? 'none' : 'flex'};">
                    <span class="dropdown-arrow" style="display: ${hasReachedMax ? 'none' : 'block'};">▼</span>
                </div>
                <div class="typeahead-dropdown" id="${id}_dropdown" style="display: none;">
                    ${options.map(option =>
                        `<div class="typeahead-option" data-value="${option}"
                              style="display: ${selectedItems.includes(option) ? 'none' : 'block'}">${option}</div>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    function initializeTypeahead(id, options, maxSelections = 1, onSelectionChange = null) {
        const input = document.getElementById(id);
        const dropdown = document.getElementById(id + '_dropdown');
        const container = document.getElementById(id + '_container');
        const arrow = container.querySelector('.dropdown-arrow');
        const isMultiple = maxSelections > 1;
        let selectedItems = [];

        // Pre-fill selected items from the initial render
        container.querySelectorAll('.selected-tag').forEach(tag => {
            selectedItems.push(tag.textContent.trim().replace(/×$/, '').trim());
        });

        // Show dropdown on click or focus
        input.addEventListener('focus', () => {
            dropdown.style.display = 'block';
            filterOptions('');
        });

        input.addEventListener('click', () => {
            dropdown.style.display = 'block';
            filterOptions('');
        });

        // Filter options as user types
        input.addEventListener('input', (e) => {
            filterOptions(e.target.value);
            dropdown.style.display = 'block';
        });

        // Handle option selection
        dropdown.addEventListener('click', (e) => {
            if (e.target.classList.contains('typeahead-option')) {
                const value = e.target.dataset.value;

                if (selectedItems.length < maxSelections && !selectedItems.includes(value)) {
                    selectedItems.push(value);
                    addSelectedTag(value);
                    e.target.style.display = 'none';
                    input.value = '';

                    if (selectedItems.length >= maxSelections) {
                        input.style.display = 'none';
                        arrow.style.display = 'none';
                        dropdown.style.display = 'none';
                    }

                    if (onSelectionChange) {
                        onSelectionChange(isMultiple ? selectedItems : selectedItems[0]);
                    }
                }
            }
        });

        // Handle tag removal
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-tag')) {
                const value = e.target.dataset.value;
                selectedItems = selectedItems.filter(item => item !== value);
                e.target.parentElement.remove();

                // Show the option again
                const option = dropdown.querySelector(`[data-value="${value}"]`);
                if (option) option.style.display = 'block';

                if (selectedItems.length < maxSelections) {
                    input.style.display = 'flex';
                    arrow.style.display = 'block';
                }

                if (onSelectionChange) {
                    onSelectionChange(isMultiple ? selectedItems : (selectedItems.length > 0 ? selectedItems[0] : ''));
                }
            }
        });

        function addSelectedTag(value) {
            const tag = document.createElement('span');
            tag.className = 'selected-tag';
            tag.innerHTML = `${value} <span class="remove-tag" data-value="${value}">×</span>`;
            container.insertBefore(tag, input);
        }

        function filterOptions(query) {
            const options = dropdown.querySelectorAll('.typeahead-option');
            options.forEach(option => {
                const isAlreadySelected = selectedItems.includes(option.dataset.value);
                const matchesQuery = option.textContent.toLowerCase().includes(query.toLowerCase());

                option.style.display = (matchesQuery && !isAlreadySelected) ? 'block' : 'none';
            });
        }

        // Hide dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        return {
            getValue: () => {
                if (isMultiple) return selectedItems;
                return selectedItems.length > 0 ? selectedItems[0] : '';
            },
            setValue: (value) => {
                // Clear everything first
                container.querySelectorAll('.selected-tag').forEach(tag => tag.remove());
                dropdown.querySelectorAll('.typeahead-option').forEach(opt => opt.style.display = 'block');
                selectedItems = [];

                const valuesToSet = isMultiple ? (Array.isArray(value) ? value : []) : (value ? [value] : []);

                valuesToSet.forEach(v => {
                    if (selectedItems.length < maxSelections) {
                        selectedItems.push(v);
                        addSelectedTag(v);
                        const option = dropdown.querySelector(`[data-value="${v}"]`);
                        if (option) option.style.display = 'none';
                    }
                });

                const hasReachedMax = selectedItems.length >= maxSelections;
                input.style.display = hasReachedMax ? 'none' : 'flex';
                arrow.style.display = hasReachedMax ? 'none' : 'block';
                input.value = '';
            }
        };
    }

    const style = document.createElement('style');
    style.innerHTML = `
        #abTestTool {
            position: fixed;
            top: 50px;
            right: 50px;
            width: 900px;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: Arial, sans-serif;
            resize: both;
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            max-height: 80vh;
        }
        #abTestToolHeader {
            background: black;
            color: white;
            padding: 8px;
            cursor: move;
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
        }
        #abTestToolHeader .title {
            flex-grow: 1;
        }
        #abTestToolHeader .controls {
            display: flex;
            gap: 5px;
        }
        #abTestToolHeader button {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 2px 6px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 12px;
        }
        #abTestToolHeader button:hover {
            background: rgba(255,255,255,0.3);
        }
        #abTestToolContent {
            padding: 12px;
            overflow-y: auto;
            flex-grow: 1;
        }
        #abTestTool.minimized #abTestToolContent {
            display: none;
        }
        #abTestTool.minimized {
            height: auto;
            max-height: none;
        }
        #abTestTool textarea {
            width: 98%;
            height: 200px;
            margin-bottom: 8px;
            font-family: monospace;
        }
        #abTestTool table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        #abTestTool th, #abTestTool td {
            border: 1px solid #ccc;
            padding: 6px;
            text-align: left;
            font-size: 13px;
        }

        #abTestTool th.section {
            background: #eee;
            font-weight: bold;
            text-align: center;
            font-size: 14px;
        }
        #extraMetrics {
            max-height: 400px;
            overflow-y: auto;
            margin-top: 10px;
            border: 1px solid #ddd;
            padding: 5px;
        }

        .tooltip {
            position: relative;
            display: inline-block;
            margin-left: 5px;
        }
        .tooltip .tooltip-icon {
            width: 16px;
            height: 16px;
            background: #007cba;
            color: white;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            cursor: help;
        }
        .tooltip .tooltip-text {
            visibility: hidden;
            width: 350px;
            background-color: #333;
            color: #fff;
            text-align: left;
            border-radius: 6px;
            padding: 8px;
            position: fixed;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 12px;
            line-height: 1.4;
            pointer-events: none;
        }
        .tooltip .tooltip-text::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
        }
        .tooltip:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
        }

        /* Configuration Screen Styles */
        .config-section {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .config-section h3 {
            margin-top: 0;
            color: #333;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group input[type="text"] {
            width: 80%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }
        .form-group input[type="date"] {
            width: 50%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 14px;
        }
        #sampleSize {
            width: 50%;
        }
        #startDate {
            width: 50%;
        }

        /* Typeahead Styles */
        .typeahead-container {
            position: relative;
            width: 100%;
        }
        .typeahead-input-container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            min-height: 40px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background: white;
            cursor: text;
        }
        .typeahead-input {
            border: none;
            outline: none;
            flex-grow: 1;
            min-width: 100px;
            padding: 5px;
        }
        .dropdown-arrow {
            margin-left: auto;
            color: #666;
            pointer-events: none;
        }
        .selected-tag {
            background: #007cba;
            color: white;
            padding: 2px 6px;
            margin: 2px;
            border-radius: 3px;
            font-size: 12px;
        }
        .remove-tag {
            margin-left: 5px;
            cursor: pointer;
            font-weight: bold;
        }
        .remove-tag:hover {
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
        }
        .typeahead-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #ccc;
            border-top: none;
            background: white;
            z-index: 1000;
        }
        .typeahead-option {
            padding: 8px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
        }
        .typeahead-option:hover {
            background: #f5f5f5;
        }

        .bayesian-config {
            margin-top: 10px;
        }
        .bayesian-item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }
        .bayesian-item input[type="checkbox"] {
            margin-right: 8px;
        }

        .button-group {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
        }
        .btn {
            padding: 8px 16px;
            border: 1px solid #ccc;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
        }
        .btn-primary {
            background: #007cba;
            color: white;
            border-color: #007cba;
        }
        .btn-secondary {
            background: #f8f9fa;
            color: #333;
        }
        .btn-success {
            background: #28a745;
            color: white;
            border-color: #28a745;
        }
        .btn-success:hover {
            background: #218838;
            border-color: #1e7e34;
        }

        /* Share overlay styles */
        .share-overlay {

            font-family: Arial, sans-serif;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .share-dialog {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            text-align: center;
        }
        .share-dialog img {
            max-width: 100%;
            margin: 10px 0;
            border: 1px solid #ddd;
        }
        .share-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 15px;
        }



        /* Debug tooltip styles */
        .debug-tooltip {
            position: relative;
            cursor: help;
        }
        .debug-tooltip .debug-tooltip-text {
            visibility: hidden;
            width: 250px;
            background-color: #333;
            color: #fff;
            text-align: left;
            border-radius: 6px;
            padding: 8px;
            position: absolute;
            z-index: 99999;
            bottom: 125%;
            left: 50%;
            margin-left: -125px;
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 12px;
            line-height: 1.4;
        }
        .debug-tooltip .debug-tooltip-text::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
        }
        .debug-tooltip:hover .debug-tooltip-text {
            visibility: visible;
            opacity: 1;
        }

        /* Revenue tooltip styles */
        .revenue-tooltip {
            position: absolute;
            display: inline-block;
            cursor: help;
        }
        .revenue-tooltip .revenue-tooltip-text {
            visibility: hidden;
            width: 300px;
            background-color: #333;
            color: #fff;
            text-align: left;
            border-radius: 6px;
            padding: 10px;
            position: absolute;
            z-index: 99999;
            top: 125%;
            left: 50%;
            margin-left: -150px;
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 14px;
            line-height: 1.4;
            font-weight: normal;
        }
        .revenue-tooltip .revenue-tooltip-text::after {
            content: "";
            position: absolute;
            bottom: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent transparent #333 transparent;
        }
        h3:hover .revenue-tooltip .revenue-tooltip-text {
            visibility: visible;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'abTestTool';
    container.innerHTML = `
        <div id="abTestToolHeader">
            <div class="title">Kilgore's Sandwich: Adobe A/B Test Bayesian Calculator</div>
            <div class="controls">
                <button id="minimizeBtn">−</button>
                <button id="closeBtn">×</button>
            </div>
        </div>
        <div id="abTestToolContent">
            <textarea id="csvInput" placeholder="Paste Adobe Analytics CSV or TSV data here (from export or copy-paste from report)..."></textarea>
            <button id="calculateBtn">Calculate % Difference + Bayesian</button>
            <div id="configScreen" style="display: none;"></div>
            <div id="output"></div>
        </div>
    `;
    document.body.appendChild(container);

    // Header controls and tooltip functionality
    const header = document.getElementById('abTestToolHeader');
    const headerTitle = header.querySelector('.title');
    let isDragging = false, offsetX = 0, offsetY = 0;

    headerTitle.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - container.offsetLeft;
        offsetY = e.clientY - container.offsetTop;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;
        container.style.left = (e.clientX - offsetX) + 'px';
        container.style.top = (e.clientY - offsetY) + 'px';
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    document.getElementById('minimizeBtn').onclick = () => {
        container.classList.toggle('minimized');
        const btn = document.getElementById('minimizeBtn');
        btn.textContent = container.classList.contains('minimized') ? '+' : '−';
    };

    document.getElementById('closeBtn').onclick = () => {
        container.remove();
    };

    // Configuration Screen Functions
    function showConfigurationScreen(atpNumber, metrics, csvDateInfo = null) {
        const configScreen = document.getElementById('configScreen');
        const existingConfig = loadConfiguration(atpNumber) || {};
        let defaultStartDate = existingConfig.startDate || '';

        // Auto-fill from CSV if no existing date
        if (!defaultStartDate && csvDateInfo) {
            // Format date as YYYY-MM-DD in local timezone
            const date = csvDateInfo.startDate;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            defaultStartDate = `${year}-${month}-${day}`;
        }

        configScreen.innerHTML = `
            <div class="config-section">
                <h3>Configure Experiment: ${atpNumber}</h3>
                <p>This is the first time we've seen this experiment. Please configure the metrics display settings.</p>
                ${csvDateInfo ? `<p style="color: #007cba; font-size: 14px; margin-bottom: 15px;">
                    <strong>Date range detected from CSV:</strong> ${csvDateInfo.startDateStr} - ${csvDateInfo.endDateStr}
                </p>` : ''}

                <div class="form-group">
                    <label for="experimentName">Experiment Name:</label>
                    <input type="text" id="experimentName" value="${existingConfig.name || ''}" placeholder="Enter a descriptive name for this experiment">
                </div>

                <div class="form-group">
                    <label for="primaryKPI">Primary KPI (select one):</label>
                    ${createTypeaheadDropdown('primaryKPI', 'Search and select primary KPI...', metrics, existingConfig.primary || '', 1)}
                </div>

                <div class="form-group">
                    <label for="secondaryKPIs">Secondary KPIs (select up to 5):</label>
                    ${createTypeaheadDropdown('secondaryKPIs', 'Search and select secondary KPIs...', metrics, existingConfig.secondary || [], 5)}
                </div>

                <div class="form-group">
                    <label for="sampleSize">Target Sample Size (per variant):</label>
                    <input type="text" id="sampleSize" value="${existingConfig.sampleSize || ''}" placeholder="e.g. 10,000 (optional)">
                </div>

                <div class="form-group">
                    <label for="startDate">Start Date (optional):</label>
                    <input type="date" id="startDate" value="${defaultStartDate}" placeholder="Select start date">
                    <small style="color: #666; font-size: 12px; display: block; margin-top: 5px;">
                        Can leave blank, it will autofill from the CSV if available${csvDateInfo ? ' (this one was auto-filled from CSV)' : ''}
                    </small>
                </div>

                <div class="bayesian-config">
                    <h4>Bayesian Calculation Settings</h4>
                    <p>Select which metrics should include Bayesian probability calculation:</p>
                    <div id="bayesianOptions"></div>
                </div>

                <div class="button-group">
                    <button class="btn btn-secondary" id="cancelConfig">Cancel</button>
                    <button class="btn btn-primary" id="saveConfig">Save Configuration</button>
                </div>
            </div>
        `;

        // Store CSV date info for later use
        const storedCsvDateInfo = csvDateInfo;

        // Clear the temp CSV date info
        window.tempCsvDateInfo = null;

        configScreen.style.display = 'block';
        document.getElementById('csvInput').style.display = 'none';
        document.getElementById('calculateBtn').style.display = 'none';
        document.getElementById('output').style.display = 'none';

        // Initialize typeahead dropdowns
        const primaryDropdown = initializeTypeahead('primaryKPI', metrics, 1, updateBayesianOptions);
        const secondaryDropdown = initializeTypeahead('secondaryKPIs', metrics, 5, updateBayesianOptions);

        // Set existing values
        if (existingConfig.primary) primaryDropdown.setValue(existingConfig.primary);
        if (existingConfig.secondary) secondaryDropdown.setValue(existingConfig.secondary);

        function updateBayesianOptions() {
            const primary = primaryDropdown.getValue();
            const secondary = secondaryDropdown.getValue();
            const allSelected = [primary, ...(Array.isArray(secondary) ? secondary : [])].filter(Boolean);

            const bayesianContainer = document.getElementById('bayesianOptions');
            bayesianContainer.innerHTML = allSelected.map(metric => `
                <div class="bayesian-item">
                    <input type="checkbox" id="bayesian_${metric.replace(/[^a-zA-Z0-9]/g, '_')}"
                           ${existingConfig.bayesian && existingConfig.bayesian.includes(metric) ? 'checked' : ''}>
                    <label for="bayesian_${metric.replace(/[^a-zA-Z0-9]/g, '_')}">${metric}</label>
                </div>
            `).join('');
        }

        updateBayesianOptions();

        // Handle save configuration
        document.getElementById('saveConfig').onclick = () => {
            const name = document.getElementById('experimentName').value.trim();
            const primary = primaryDropdown.getValue();
            const secondary = secondaryDropdown.getValue();
            const sampleSizeInput = document.getElementById('sampleSize').value.trim();
            const startDateInput = document.getElementById('startDate').value.trim();

            if (!name) {
                alert('Please enter an experiment name.');
                return;
            }

            if (!primary) {
                alert('Please select a primary KPI.');
                return;
            }

            // Process sample size - strip spaces and commas, convert to integer
            let sampleSize = null;
            if (sampleSizeInput) {
                const cleanedInput = sampleSizeInput.replace(/[\s,]/g, '');
                const parsedSize = parseInt(cleanedInput);
                if (!isNaN(parsedSize) && parsedSize > 0) {
                    sampleSize = parsedSize;
                }
            }

            // Get selected Bayesian options
            const bayesian = [];
            document.querySelectorAll('#bayesianOptions input[type="checkbox"]:checked').forEach(cb => {
                const label = cb.nextElementSibling.textContent;
                bayesian.push(label);
            });

            const config = {
                name,
                primary,
                secondary: Array.isArray(secondary) ? secondary : [],
                bayesian,
                sampleSize,
                startDate: startDateInput || null,
                csvDateInfo: storedCsvDateInfo || null
            };

            saveConfiguration(atpNumber, config);
            console.log('Saved configuration for', atpNumber, config);

            // Hide config screen and process data
            configScreen.style.display = 'none';
            document.getElementById('output').style.display = 'block';
            processDataWithConfiguration(atpNumber, config);
        };

        // Handle cancel
        document.getElementById('cancelConfig').onclick = () => {
            configScreen.style.display = 'none';
            const outputDiv = document.getElementById('output');
            if (outputDiv.innerHTML.trim() !== '') {
                outputDiv.style.display = 'block';
            } else {
                document.getElementById('csvInput').style.display = 'block';
                document.getElementById('calculateBtn').style.display = 'block';
            }
        };
    }

    function showSettingsScreen() {
        if (!currentATP) {
            alert('No ATP experiment detected. Please paste CSV data first.');
            return;
        }

        const metrics = getAllMetricNames(currentData);
        const existingConfig = loadConfiguration(currentATP) || {};
        showConfigurationScreen(currentATP, metrics, existingConfig.csvDateInfo);
    }

    // Data Processing Functions
    function parseCSVData(csvText) {
        // Detect if data is tab-separated (TSV) or comma-separated (CSV)
        const firstFewLines = csvText.split('\n').slice(0, 5).join('\n');
        const tabCount = (firstFewLines.match(/\t/g) || []).length;
        const commaCount = (firstFewLines.match(/,/g) || []).length;

        // Use tabs if there are more tabs than commas, otherwise use commas
        const separator = tabCount > commaCount ? '\t' : ',';
        const rows = csvText.split('\n').map(r => r.split(separator).map(cell => cell.trim().replace(/"/g, '')));

        let data = [];
        let currentSectionVisits = null;
        let currentSection = '';
        let globalVisits = null;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            // Detect section headers
            if (row[0] && row[0].startsWith('#') && row[0].includes('KPI')) {
                currentSection = row[0].replace(/#+/g, '').trim();
                currentSectionVisits = null;
                continue;
            }

            // Handle both 3-column and 4-column CSV formats
            let prefix, label, valA, valB;

            if (row.length === 4) {
                prefix = row[0];
                label = row[1];
                valA = parseFloat(row[2]);
                valB = parseFloat(row[3]);

                if (prefix === 'Segments') {
                    const controlVisits = parseInt(row[2]);
                    const variantVisits = parseInt(row[3]);
                    if (!isNaN(controlVisits) && !isNaN(variantVisits)) {
                        currentSectionVisits = { control: controlVisits, variant: variantVisits };
                        if (!globalVisits) {
                            globalVisits = { control: controlVisits, variant: variantVisits };
                        }
                    }
                    continue;
                }

                if (prefix && prefix.startsWith('0 All Visits') && (!label || label.trim() === '')) {
                    continue;
                }

            } else if (row.length === 3) {
                prefix = '';
                label = row[0];
                valA = parseFloat(row[1]);
                valB = parseFloat(row[2]);

                if (label === 'Segments') {
                    const controlVisits = parseInt(row[1]);
                    const variantVisits = parseInt(row[2]);
                    if (!isNaN(controlVisits) && !isNaN(variantVisits)) {
                        currentSectionVisits = { control: controlVisits, variant: variantVisits };
                        if (!globalVisits) {
                            globalVisits = { control: controlVisits, variant: variantVisits };
                        }
                    }
                    continue;
                }

                // Check for TSV format where first row contains visit counts (All visits)
                if (label && (label.toLowerCase().includes('all visits') || label.startsWith('0.')) && !isNaN(valA) && !isNaN(valB)) {
                    const controlVisits = parseInt(valA);
                    const variantVisits = parseInt(valB);
                    if (controlVisits > 0 && variantVisits > 0) {
                        currentSectionVisits = { control: controlVisits, variant: variantVisits };
                        if (!globalVisits) {
                            globalVisits = { control: controlVisits, variant: variantVisits };
                        }
                        console.log('TSV: Extracted visit counts from', label, '- Control:', controlVisits, 'Variant:', variantVisits);
                    }
                    // Don't continue here - also process this as a metric
                }

                if (label && label.startsWith('0 All Visits') && !isNaN(valA) && !isNaN(valB)) {
                    continue;
                }

            } else {
                continue;
            }

            // Skip formatting rows
            if ((prefix && prefix.startsWith('#')) || (label && label.startsWith('#'))) {
                continue;
            }

            // Process valid metric rows
            if (label && label !== "Metrics" && !isNaN(valA) && !isNaN(valB) && valA !== null && valB !== null) {
                const metricData = {
                    label,
                    valA,
                    valB,
                    hasBayesianData: false,
                    section: currentSection,
                    controlVisits: null,
                    controlConversions: null,
                    variantVisits: null,
                    variantConversions: null
                };

                // Store visit data for potential Bayesian calculation
                if (currentSectionVisits || globalVisits) {
                    const visitsToUse = currentSectionVisits || globalVisits;
                    metricData.controlVisits = visitsToUse.control;
                    metricData.variantVisits = visitsToUse.variant;
                }

                data.push(metricData);
            }
        }

        return { data, globalVisits };
    }

    function applyBayesianCalculations(data, bayesianMetrics) {
        return data.map(item => {
            if (bayesianMetrics.includes(item.label) && item.controlVisits && item.variantVisits) {
                let controlConversions, variantConversions;

                if (item.label.toLowerCase().includes('(hit)')) {
                    controlConversions = Math.round(item.valA);
                    variantConversions = Math.round(item.valB);
                } else {
                    controlConversions = Math.round(item.valA * item.controlVisits);
                    variantConversions = Math.round(item.valB * item.variantVisits);
                }

                return {
                    ...item,
                    controlConversions,
                    variantConversions,
                    hasBayesianData: true
                };
            }
            return item;
        });
    }

    function processDataWithConfiguration(atpNumber, config) {
        const dataWithBayesian = applyBayesianCalculations(currentData, config.bayesian);
        displayResults(dataWithBayesian, config, currentGlobalVisits);
    }

    // Experiment Analytics Functions
    function calculateExperimentAnalytics(config, globalVisits) {
        const analytics = {
            daysRunning: null,
            dailyTrafficRate: null,
            projectedEndDate: null
        };

        if (!config.startDate || !globalVisits) {
            return analytics;
        }

        // Parse the start date more reliably
        const startDateParts = config.startDate.split('-'); // e.g., "2025-07-10" -> ["2025", "07", "10"]
        const startDate = new Date(parseInt(startDateParts[0]), parseInt(startDateParts[1]) - 1, parseInt(startDateParts[2])); // Month is 0-indexed

        const currentDate = new Date(); // Now

        // Get today's date at midnight in local time
        const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        // Debug logging
        console.log('Start date from config:', config.startDate);
        console.log('Parsed start date:', startDate);
        console.log('Today:', today);
        console.log('Start date time:', startDate.getTime());
        console.log('Today time:', today.getTime());

        // Calculate the difference in milliseconds and convert to days
        const timeDiff = today.getTime() - startDate.getTime();
        const dayDifference = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        console.log('Time diff (ms):', timeDiff);
        console.log('Day difference:', dayDifference);

        // Days running is the difference + 1 (to include the start day)
        analytics.daysRunning = dayDifference + 1;

        console.log('Days running:', analytics.daysRunning);

        if (analytics.daysRunning > 0) {
            // Calculate daily traffic rate (using smaller variant to be conservative)
            const dailyVisits = Math.min(globalVisits.control, globalVisits.variant) / analytics.daysRunning;
            analytics.dailyTrafficRate = Math.round(dailyVisits);

            // Calculate projected end date if sample size is set
            if (config.sampleSize && dailyVisits > 0) {
                if (analytics.daysRunning <= 4) {
                    analytics.projectedEndDate = "Need 5 days data to estimate end date";
                } else {
                    const remainingVisits = Math.max(0, config.sampleSize - Math.min(globalVisits.control, globalVisits.variant));
                    const conservativeRate = dailyVisits * 0.90; // 5% more conservative
                    const remainingDays = Math.ceil(remainingVisits / conservativeRate);

                    const projectedEnd = new Date(currentDate);
                    projectedEnd.setDate(projectedEnd.getDate() + remainingDays);
                    analytics.projectedEndDate = projectedEnd;
                }
            }
        }

        return analytics;
    }

    function shouldShowRevenueProjection(analytics, config, data) {
        // Check if days running > 4
        if (!analytics.daysRunning || analytics.daysRunning <= 4) {
            return false;
        }

        // Check if main metric is selected for Bayesian calculation
        if (!config.bayesian || !config.bayesian.includes(config.primary)) {
            return false;
        }

        // Check if revenue metric exists in data
        const revenueMetric = data.find(item => item.label === "Revenue (incl. C&C) - SPR");
        if (!revenueMetric) {
            return false;
        }

        // Check if main metric is directional or validated
        const mainMetric = data.find(item => item.label === config.primary);
        if (!mainMetric || !mainMetric.hasBayesianData) {
            return false;
        }

        const bayesianProb = calculateBayesianProb(
            mainMetric.controlVisits,
            mainMetric.controlConversions,
            mainMetric.variantVisits,
            mainMetric.variantConversions
        );

        const bgColor = getBayesianCellColor(bayesianProb, true); // true for primary metric
        return bgColor !== ''; // Only show if there's a background color (directional or validated)
    }

    function calculateRevenueProjection(analytics, config, data) {
        const revenueMetric = data.find(item => item.label === "Revenue (incl. C&C) - SPR");
        const mainMetric = data.find(item => item.label === config.primary);
        
        if (!revenueMetric || !mainMetric || !analytics.daysRunning) {
            return null;
        }

        // Calculate total revenue (control + variant)
        const totalRevenue = revenueMetric.valA + revenueMetric.valB;
        
        // Calculate daily revenue
        const dailyRevenue = totalRevenue / analytics.daysRunning;
        
        // Calculate main metric percentage change
        const mainMetricChange = ((mainMetric.valB - mainMetric.valA) / mainMetric.valA * 100);
        
        // Calculate daily impact (applying main metric change to revenue)
        const dailyImpact = dailyRevenue * (mainMetricChange / 100);
        
        // Calculate annual impact
        const annualRevenue = Math.round(dailyImpact * 365);
        
        return {
            annualRevenue,
            mainMetricChange: mainMetricChange.toFixed(1)
        };
    }

    function formatExperimentInfo(analytics, config, globalVisits, data) {
        // Calculate revenue projection if criteria are met
        let revenueProjectionHtml = '';
        if (shouldShowRevenueProjection(analytics, config, data)) {
            const projection = calculateRevenueProjection(analytics, config, data);
            if (projection) {
                revenueProjectionHtml = `
                    <div class="revenue-tooltip">
                        <div class="revenue-tooltip-text">
                            Annual incremental revenue: €${projection.annualRevenue.toLocaleString()}<br>
                            Based on current uplift of ${projection.mainMetricChange}% on main metric
                        </div>
                    </div>
                `;
            }
        }

        let html = `
            <div style="background: #f8f9fa; padding: 15px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h3 style="margin: 0; color: #333; font-size: 1.5em; position: relative; display: inline-block;">
                        ${config.name}
                        ${revenueProjectionHtml}
                    </h3>
                    <span style="color: #666; font-size: 12px;">Experiment: <a href="https://jira.tools.3stripes.net/browse/${currentATP}" target="_blank" rel="noopener noreferrer">${currentATP}</a> | Generated: ${new Date().toLocaleDateString()}</span>
                </div>
        `;

                    if (analytics.daysRunning) {
                html += `
                    <div style="display: flex; width: 100%; margin-bottom: 15px;">
                        <div style="flex: 1; padding-right: 10px;">
                            <strong>Days Running:</strong> ${analytics.daysRunning} day${analytics.daysRunning !== 1 ? 's' : ''}
                        </div>
                `;

                if (analytics.dailyTrafficRate) {
                    html += `
                        <div style="flex: 1; padding: 0 10px;">
                            <strong>Daily Traffic Rate:</strong> ${analytics.dailyTrafficRate.toLocaleString()} visits/day
                            <small style="color: #666; display: block;">per variant</small>
                        </div>
                    `;
                }

                if (analytics.projectedEndDate) {
                    const today = new Date();
                    const isProjected = analytics.projectedEndDate instanceof Date && analytics.projectedEndDate > today;
                    const isStringMessage = typeof analytics.projectedEndDate === 'string';

                    // Use "Projected End Date" for string messages (like "Need 5 days data...") and future dates
                    const projectedText = (isStringMessage || isProjected) ? 'Projected End Date' : 'Would Have Ended';

                    html += `
                        <div style="flex: 1; padding-left: 10px;">
                            <strong>${projectedText}:</strong> ${analytics.projectedEndDate instanceof Date ? analytics.projectedEndDate.toDateString() : analytics.projectedEndDate}
                            <small style="color: #666; display: block;">${isProjected ? 'based on current traffic rate' : ''}</small>
                        </div>
                    `;
                }

                html += `
                    </div>
                `;
        }

        // Add progress bar if sample size is configured
        if (config.sampleSize && globalVisits) {
            const currentSampleSize = Math.min(globalVisits.control, globalVisits.variant);
            const percentage = Math.min(100, (currentSampleSize / config.sampleSize) * 100);
            const isComplete = percentage >= 100;

            const progressText = isComplete
                ? 'SAMPLE SIZE REACHED'
                : `${percentage.toFixed(0)}% of sample size collected, ${currentSampleSize.toLocaleString()} out of ${config.sampleSize.toLocaleString()}`;

            html += `
                <div style="margin-top: 10px;">
                    <div style="width: 100%; height: 40px; background-color: #f0f0f0; border: 1px solid #ddd; border-radius: 5px; position: relative; overflow: hidden;">
                        <div style="height: 100%; background-color: ${isComplete ? '#4caf50' : '#c8e6c9'}; width: ${percentage}%; transition: width 0.3s ease; position: relative;"></div>
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;">
                            <div style="position: absolute; top: 0; width: 2px; height: 100%; background-color: rgba(0, 0, 0, 0.2); left: 20%;"></div>
                            <div style="position: absolute; top: 0; width: 2px; height: 100%; background-color: rgba(0, 0, 0, 0.2); left: 40%;"></div>
                            <div style="position: absolute; top: 0; width: 2px; height: 100%; background-color: rgba(0, 0, 0, 0.2); left: 60%;"></div>
                            <div style="position: absolute; top: 0; width: 2px; height: 100%; background-color: rgba(0, 0, 0, 0.2); left: 80%;"></div>
                        </div>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; color: #333; font-size: 14px; z-index: 2;">
                            ${progressText}
                        </div>
                    </div>
                </div>
            `;
        }

        html += `
            </div>
        `;

        return html;
    }

    // Function to determine Bayesian cell background color
    function getBayesianCellColor(probability, isPrimary) {
        const prob = probability * 100; // Convert to percentage

        if (isPrimary) {
            // Primary metrics thresholds
            if (prob >= 0 && prob <= 5) return '#df4d2d';
            if (prob > 5 && prob <= 15) return '#f0be3c';
            if (prob >= 85 && prob < 95) return '#f0be3c';
            if (prob >= 95 && prob <= 100) return '#52b47e';
        } else {
            // Secondary metrics thresholds
            if (prob >= 0 && prob <= 2) return '#df4d2d';
            if (prob > 2 && prob <= 10) return '#f0be3c';
            if (prob >= 90 && prob < 98) return '#f0be3c';
            if (prob >= 98 && prob <= 100) return '#52b47e';
        }

        return ''; // No highlighting for middle ranges
    }

    function displayResults(data, config, globalVisits) {
        const primaryData = data.filter(item => item.label === config.primary);
        const secondaryData = data.filter(item => config.secondary.includes(item.label));
        const everythingElse = data.filter(item =>
            item.label !== config.primary && !config.secondary.includes(item.label)
        );

        // Calculate experiment analytics
        const analytics = calculateExperimentAnalytics(config, globalVisits);

        const createTable = (title, filteredRows, sectionVisits = null, isPrimary = false) => {
            let html = `<tr><th colspan="5" class="section">${title}</th></tr>`;
            if (sectionVisits && sectionVisits.control && sectionVisits.variant) {
                html += `<tr><td colspan="5" style="font-size:11px; color:#666; text-align:center;">
                    Section visits: Control ${sectionVisits.control.toLocaleString()}, Variant ${sectionVisits.variant.toLocaleString()}
                </td></tr>`;
            }
            html += '<tr><th>Metric</th><th>Control</th><th>Variant</th><th>% Change</th><th>Prob. v1>control</th></tr>';

            for (const row of filteredRows) {
                const change = ((row.valB - row.valA) / row.valA * 100);
                const changeText = isFinite(change) ? change.toFixed(2) + '%' : '–';

                const changeWithTooltip = changeText === '–' ? changeText :
                    `<span class="debug-tooltip">${changeText}<span class="debug-tooltip-text">Control: ${row.controlVisits?.toLocaleString() || 'N/A'} visits<br>Variant: ${row.variantVisits?.toLocaleString() || 'N/A'} visits</span></span>`;

                let bayesianProb = '–';
                let bayesianCellStyle = '';

                if (row.hasBayesianData) {
                    const prob = calculateBayesianProb(
                        row.controlVisits,
                        row.controlConversions,
                        row.variantVisits,
                        row.variantConversions
                    );
                    bayesianProb = (prob * 100).toFixed(1) + '%';

                    // Apply highlighting based on probability and metric type
                    const bgColor = getBayesianCellColor(prob, isPrimary);
                    if (bgColor) {
                        bayesianCellStyle = `style="background-color: ${bgColor}; color: white; font-weight: bold;"`;
                    }
                }

                const formatValue = (val) => {
                    if (val == null || val === undefined || isNaN(val)) {
                        return '–';
                    }
                    if (val > 0 && val < 1) {
                        return (val * 100).toFixed(2) + '%';
                    }
                    return val.toLocaleString();
                };

                const createTooltipValue = (val, variant) => {
                    const formattedVal = formatValue(val);
                    if (formattedVal === '–') return formattedVal;

                    const visits = variant === 'control' ? row.controlVisits : row.variantVisits;
                    const tooltipText = visits ?
                        `Sample size: ${visits.toLocaleString()} visits` :
                        'No visit data available';

                    return `<span class="debug-tooltip">${formattedVal}<span class="debug-tooltip-text">${tooltipText}</span></span>`;
                };

                const formattedA = createTooltipValue(row.valA, 'control');
                const formattedB = createTooltipValue(row.valB, 'variant');

                html += `<tr>
                    <td>${row.label}</td>
                    <td>${formattedA}</td>
                    <td>${formattedB}</td>
                    <td>${changeWithTooltip}</td>
                    <td ${bayesianCellStyle}>${bayesianProb}</td>
                </tr>`;
            }
            return html;
        };

        let html = formatExperimentInfo(analytics, config, globalVisits, data) + '<table>';

        if (primaryData.length > 0) {
            html += createTable('PRIMARY KPI', primaryData, null, true);
        }

        if (secondaryData.length > 0) {
            html += createTable('SECONDARY KPIs', secondaryData, null, false);
        }

        html += '</table>';

        // Add buttons and everything else section
        if (everythingElse.length > 0) {
            const sectionGroups = {};
            for (const item of everythingElse) {
                const section = item.section || 'Other Metrics';
                if (!sectionGroups[section]) {
                    sectionGroups[section] = [];
                }
                sectionGroups[section].push(item);
            }

            html += `
                <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
                    <button id="toggleExtra" style="padding:8px 12px; background:#f0f0f0; border:1px solid #ccc; cursor:pointer;">Show Everything Else (${everythingElse.length} metrics)</button>
                    <div style="display: flex; gap: 10px;">
                        <button id="shareBtn" style="padding:8px 12px; background:#28a745; color:white; border:1px solid #1e7e34; cursor:pointer; border-radius:3px;">📱 SHARE</button>
                        <button id="settingsBtn" style="padding:8px 12px; background:#007cba; color:white; border:1px solid #005a87; cursor:pointer; border-radius:3px;">SETTINGS</button>
                        <button id="resetBtn" style="padding:8px 12px; background:#ff4444; color:white; border:1px solid #cc0000; cursor:pointer; border-radius:3px;">BACK TO INPUT</button>
                    </div>
                </div>
                <div id="extraMetrics" style="display:none; margin-top:10px;">
                    <table>
            `;

                            for (const [sectionName, sectionData] of Object.entries(sectionGroups)) {
                    if (sectionData.length > 0) {
                        const itemWithVisits = sectionData.find(d => d.controlVisits && d.variantVisits);
                        const sectionVisits = itemWithVisits ?
                            { control: itemWithVisits.controlVisits, variant: itemWithVisits.variantVisits } : null;
                        html += createTable(sectionName, sectionData, sectionVisits, false);
                    }
                }

            html += `
                    </table>
                </div>
            `;
        } else {
            html += `
                <div style="margin-top:10px; display:flex; justify-content:flex-end; gap: 10px;">
                    <button id="shareBtn" style="padding:8px 12px; background:#28a745; color:white; border:1px solid #1e7e34; cursor:pointer; border-radius:3px;">📱 SHARE</button>
                    <button id="settingsBtn" style="padding:8px 12px; background:#007cba; color:white; border:1px solid #005a87; cursor:pointer; border-radius:3px;">SETTINGS</button>
                    <button id="resetBtn" style="padding:8px 12px; background:#ff4444; color:white; border:1px solid #cc0000; cursor:pointer; border-radius:3px;">BACK TO INPUT</button>
                </div>
            `;
        }

        document.getElementById('output').innerHTML = html;
        document.getElementById('csvInput').style.display = 'none';
        document.getElementById('calculateBtn').style.display = 'none';

        // Add event handlers
        const toggleBtn = document.getElementById('toggleExtra');
        if (toggleBtn) {
            const extraCount = everythingElse.length;
            toggleBtn.onclick = () => {
                const extra = document.getElementById('extraMetrics');
                const isHidden = extra.style.display === 'none';
                extra.style.display = isHidden ? 'block' : 'none';
                toggleBtn.textContent = isHidden ?
                    `Hide Everything Else` :
                    `Show Everything Else (${extraCount} metrics)`;
            };
        }

        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.onclick = () => shareResults(config);
        }

        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.onclick = showSettingsScreen;
        }

        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.onclick = () => {
                document.getElementById('output').innerHTML = '';
                document.getElementById('configScreen').style.display = 'none';
                document.getElementById('csvInput').style.display = 'block';
                document.getElementById('calculateBtn').style.display = 'block';
                currentData = [];
                currentATP = null;
                currentGlobalVisits = null;
                console.log('Returned to input screen');
            };
        }
    }

    // Share Functionality
    function shareResults(config) {
        const resultsElement = document.getElementById('output');
        const shareOverlay = document.createElement('div');
        shareOverlay.className = 'share-overlay';
        shareOverlay.innerHTML = `
            <div class="share-dialog">
                <h3>Generating shareable image...</h3>
                <p>Please wait while we capture your results.</p>
            </div>
        `;
        document.body.appendChild(shareOverlay);

        // Create a clean version of the results for sharing
        const cleanResults = resultsElement.cloneNode(true);

        // Remove buttons from the clone
        cleanResults.querySelectorAll('button').forEach(btn => btn.remove());
        cleanResults.querySelectorAll('#extraMetrics').forEach(elem => {
            if (elem.style.display === 'none') elem.remove();
        });

        // Ensure all inline styles are preserved (especially Bayesian colors)
        const originalCells = resultsElement.querySelectorAll('td[style]');
        const clonedCells = cleanResults.querySelectorAll('td[style]');
        originalCells.forEach((cell, index) => {
            if (clonedCells[index]) {
                clonedCells[index].style.cssText = cell.style.cssText;
            }
        });

        // The unified experiment info component is already included in the results, so no need to add a separate header

        // Create temporary container for html2canvas with full styling
        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
            position: absolute;
            top: -9999px;
            left: -9999px;
            background: white;
            padding: 20px;
            width: 800px;
            font-family: Arial, sans-serif;
        `;

        // Add all the necessary styles inline to ensure they're captured
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .temp-share-container, .temp-share-container * {
                font-family: Arial, sans-serif !important;
                box-sizing: border-box;
            }
            .temp-share-container {
                line-height: 1.4;
            }
            .temp-share-container table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }
            .temp-share-container th, .temp-share-container td {
                border: 1px solid #ccc;
                padding: 6px;
                text-align: left;
                font-size: 13px;
                vertical-align: top;
            }
            .temp-share-container th.section {
                background: #eee !important;
                font-weight: bold;
                text-align: center;
                font-size: 14px;
                color: #333;
            }
            .temp-share-container th {
                background: #f8f9fa !important;
                font-weight: bold;
                color: #333;
            }
            .temp-share-container td {
                background: white;
                color: #333;
            }
            .temp-share-container h3 {
                color: #333;
                margin: 0;
                font-size: 1.5em;
                font-weight: bold;
            }
            .temp-share-container p {
                color: #666;
                font-size: 14px;
                margin: 0;
                line-height: 1.4;
            }
            .temp-share-container a {
                color: #007cba;
                text-decoration: none;
            }
            /* Ensure Bayesian color coding is preserved */
            .temp-share-container td[style*="background-color"] {
                font-weight: bold !important;
                color: white !important;
            }
            /* Section headers styling */
            .temp-share-container td[colspan="5"] {
                font-size: 11px;
                color: #666;
                text-align: center;
                font-style: italic;
                background: #f9f9f9 !important;
            }
        `;

        tempContainer.className = 'temp-share-container';
        tempContainer.appendChild(styleElement);
        tempContainer.appendChild(cleanResults);
        document.body.appendChild(tempContainer);

        // Use html2canvas to capture the image
        html2canvas(tempContainer, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            width: 840,
            height: tempContainer.scrollHeight + 40
        }).then(canvas => {
            // Remove temporary container
            document.body.removeChild(tempContainer);

            // Automatically copy to clipboard
            canvas.toBlob(blob => {
                if (navigator.clipboard && window.ClipboardItem) {
                    navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]).then(() => {
                        // Show success message
                        shareOverlay.innerHTML = `
                            <div class="share-dialog">
                                <h3>✅ Copied to Clipboard!</h3>
                                <p>Your results image is ready to paste into Slack, email, or any application.</p>
                            </div>
                        `;

                        // Auto-dismiss after 2 seconds
                        setTimeout(() => {
                            if (document.body.contains(shareOverlay)) {
                                document.body.removeChild(shareOverlay);
                            }
                        }, 2000);

                    }).catch(() => {
                        // Fallback: show download option if clipboard fails
                        shareOverlay.innerHTML = `
                            <div class="share-dialog">
                                <h3>Clipboard Not Available</h3>
                                <p>Unable to copy to clipboard. Click below to download instead.</p>
                                <div class="share-actions">
                                    <button class="btn btn-primary" id="downloadImage">Download Image</button>
                                    <button class="btn btn-secondary" id="closeShare">Close</button>
                                </div>
                            </div>
                        `;

                        document.getElementById('downloadImage').onclick = () => {
                            const link = document.createElement('a');
                            link.download = `${currentATP}_results_${new Date().toISOString().split('T')[0]}.png`;
                            link.href = canvas.toDataURL();
                            link.click();
                            document.body.removeChild(shareOverlay);
                        };

                        document.getElementById('closeShare').onclick = () => {
                            document.body.removeChild(shareOverlay);
                        };
                    });
                } else {
                    // Fallback for browsers without clipboard API
                    shareOverlay.innerHTML = `
                        <div class="share-dialog">
                            <h3>Clipboard Not Supported</h3>
                            <p>Your browser doesn't support clipboard copying. Click below to download instead.</p>
                            <div class="share-actions">
                                <button class="btn btn-primary" id="downloadImage">Download Image</button>
                                <button class="btn btn-secondary" id="closeShare">Close</button>
                            </div>
                        </div>
                    `;

                    document.getElementById('downloadImage').onclick = () => {
                        const link = document.createElement('a');
                        link.download = `${currentATP}_results_${new Date().toISOString().split('T')[0]}.png`;
                        link.href = canvas.toDataURL();
                        link.click();
                        document.body.removeChild(shareOverlay);
                    };

                    document.getElementById('closeShare').onclick = () => {
                        document.body.removeChild(shareOverlay);
                    };
                }
            });

        }).catch(error => {
            console.error('Error generating image:', error);
            document.body.removeChild(tempContainer);
            shareOverlay.innerHTML = `
                <div class="share-dialog">
                    <h3>❌ Error</h3>
                    <p>Failed to generate image. Please try again.</p>
                    <button class="btn btn-secondary" onclick="this.closest('.share-overlay').remove()">Close</button>
                </div>
            `;

            // Auto-dismiss error after 3 seconds
            setTimeout(() => {
                if (document.body.contains(shareOverlay)) {
                    document.body.removeChild(shareOverlay);
                }
            }, 3000);
        });
    }

    // Main Calculate Button Handler
    const calculateBtn = document.getElementById('calculateBtn');
    if (!calculateBtn) {
        console.error('Calculate button not found!');
        return;
    }

    calculateBtn.onclick = () => {
        try {
            const inputBox = document.getElementById('csvInput');
            const input = inputBox.value;

            if (!input.trim()) {
                alert('Please paste CSV data first!');
                return;
            }

            // Extract ATP number
            const atpNumber = extractATPFromCSV(input);
            if (!atpNumber) {
                alert('No ATP number found in CSV data. Please ensure your data contains an ATP-XXXX identifier.');
                return;
            }

            console.log('Detected ATP:', atpNumber);
            currentATP = atpNumber;

            // Extract date information from CSV
            const csvDateInfo = extractStartDateFromCSV(input);
            console.log('CSV date info:', csvDateInfo);

            // Parse CSV data
            const parseResult = parseCSVData(input);
            currentData = parseResult.data;
            currentGlobalVisits = parseResult.globalVisits;
            console.log('Parsed data:', currentData.length, 'metrics');
            console.log('Global visits:', currentGlobalVisits);

            if (currentData.length === 0) {
                alert('No valid metrics found in CSV data.');
                return;
            }

            // Check if we have configuration for this ATP
            const existingConfig = loadConfiguration(atpNumber);

            // Helper function to format date as YYYY-MM-DD in local timezone
            const formatDateLocal = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            // Handle date conflict if CSV has date and config already has a different date
            if (csvDateInfo && existingConfig && existingConfig.startDate && existingConfig.startDate !== formatDateLocal(csvDateInfo.startDate)) {
                if (confirm(`Date conflict detected!\n\nSaved date: ${existingConfig.startDate}\nCSV date: ${csvDateInfo.startDate.toDateString()}\n\nWould you like to overwrite the saved date with the CSV date?`)) {
                    existingConfig.startDate = formatDateLocal(csvDateInfo.startDate);
                    existingConfig.csvDateInfo = csvDateInfo;
                    saveConfiguration(atpNumber, existingConfig);
                    console.log('Updated configuration with CSV date');
                }
            } else if (csvDateInfo && existingConfig && !existingConfig.startDate) {
                // Auto-fill if no existing date
                existingConfig.startDate = formatDateLocal(csvDateInfo.startDate);
                existingConfig.csvDateInfo = csvDateInfo;
                saveConfiguration(atpNumber, existingConfig);
                console.log('Auto-filled start date from CSV');
            }

            if (existingConfig) {
                console.log('Using existing configuration for', atpNumber, existingConfig);
                processDataWithConfiguration(atpNumber, existingConfig);
            } else {
                console.log('No configuration found for', atpNumber, 'showing config screen');
                const metrics = getAllMetricNames(currentData);

                showConfigurationScreen(atpNumber, metrics, csvDateInfo);
            }

        } catch (error) {
            console.error('Error in calculate function:', error);
            alert('Error processing data: ' + error.message);
        }
    };
})();
