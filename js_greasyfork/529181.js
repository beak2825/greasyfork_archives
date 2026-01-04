// ==UserScript==
// @name         Google Drive PDF Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Enhanced dark mode for Google Drive PDF viewer and folder previews with advanced filters.
// @match        https://drive.google.com/file/d/*
// @match        https://drive.google.com/drive/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529181/Google%20Drive%20PDF%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/529181/Google%20Drive%20PDF%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('Google Drive PDF Dark Mode script started');

    // Retrieve saved settings from localStorage, or use "as page load" defaults except for inversion
    let isAutoApply = JSON.parse(localStorage.getItem('autoApply')) || false;
    let savedInversion = parseFloat(localStorage.getItem('inversionFactor')) || 1.0;
    let savedBrightness = parseFloat(localStorage.getItem('brightnessFactor')) || 1.0;
    let savedContrast = parseFloat(localStorage.getItem('contrastFactor')) || 1.0;
    let savedHue = parseFloat(localStorage.getItem('hueFactor')) || 0;
    let savedSaturate = parseFloat(localStorage.getItem('saturateFactor')) || 1.0;
    let savedSepia = parseFloat(localStorage.getItem('sepiaFactor')) || 0;
    let savedGrayscale = parseFloat(localStorage.getItem('grayscaleFactor')) || 0;
    let savedOpacity = parseFloat(localStorage.getItem('opacityFactor')) || 1.0;
    let savedRedTint = parseFloat(localStorage.getItem('redTintFactor')) || 0;
    let savedGreenTint = parseFloat(localStorage.getItem('greenTintFactor')) || 0;
    let savedBlueTint = parseFloat(localStorage.getItem('blueTintFactor')) || 0;
    let observer = null;
    let isPanelVisible = false; // Panel starts hidden
    let isShowingFilters = true;
    let isScalesVisible = false;
    let isDraggingNubbin = false;
    let nubbinYOffset = 0;

    // Debounce utility
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // Apply filters to correct elements
    const applyFilters = () => {
        const fullViewTargets = document.querySelectorAll('.ndfHFb-c4YZDc-Wrql6b canvas, .ndfHFb-c4YZDc img');
        const folderViewTargets = document.querySelectorAll('.PpaPvc img, .PpaPvc canvas, .a-b-Xa-La img, .a-b-Xa-La canvas');

        console.log('Full view targets found:', fullViewTargets.length);
        console.log('Folder view targets found:', folderViewTargets.length);

        const tintFilter = `sepia(${savedSepia}) hue-rotate(${savedHue + (savedRedTint * 120 - savedGreenTint * 120 - savedBlueTint * 120)}deg) saturate(${savedSaturate + Math.abs(savedRedTint) + Math.abs(savedGreenTint) + Math.abs(savedBlueTint)})`;
        const filterString = isShowingFilters
            ? `invert(${savedInversion}) brightness(${savedBrightness}) contrast(${savedContrast}) ${tintFilter} grayscale(${savedGrayscale}) opacity(${savedOpacity})`
            : '';
        const bgString = `rgba(${Math.max(0, Math.min(255, savedRedTint * 255))}, ${Math.max(0, Math.min(255, savedGreenTint * 255))}, ${Math.max(0, Math.min(255, savedBlueTint * 255))}, 0.2)`;

        fullViewTargets.forEach(el => {
            el.style.filter = filterString;
            el.style.background = bgString;
        });
        folderViewTargets.forEach(el => {
            el.style.filter = filterString;
            el.style.background = bgString;
        });
    };

    const updateImageFilters = debounce(() => applyFilters(), 100);

    function applyDarkMode() {
        isShowingFilters = true;
        toggleButton.querySelector('span').textContent = 'Show Vanilla';
        applyFilters();
    }

    function toggleVanillaFilters() {
        isShowingFilters = !isShowingFilters;
        toggleButton.querySelector('span').textContent = isShowingFilters ? 'Show Vanilla' : 'Show Filters';
        applyFilters();
    }

    function toggleAutoApply() {
        isAutoApply = !isAutoApply;
        localStorage.setItem('autoApply', isAutoApply);
        autoApplyButton.querySelector('span').textContent = isAutoApply ? 'Auto-Apply On' : 'Auto-Apply Off';
        if (isAutoApply) {
            isShowingFilters = true;
            toggleButton.querySelector('span').textContent = 'Show Vanilla';
            if (!observer) {
                observer = new MutationObserver(updateImageFilters);
                observer.observe(document.body, { childList: true, subtree: true });
            }
            applyFilters();
        } else if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    // Update filter factors
    const updateInversion = (value) => { savedInversion = parseFloat(value); localStorage.setItem('inversionFactor', savedInversion); applyFilters(); };
    const updateBrightness = (value) => { savedBrightness = parseFloat(value); localStorage.setItem('brightnessFactor', savedBrightness); applyFilters(); };
    const updateContrast = (value) => { savedContrast = parseFloat(value); localStorage.setItem('contrastFactor', savedContrast); applyFilters(); };
    const updateHue = (value) => { savedHue = parseFloat(value); localStorage.setItem('hueFactor', savedHue); applyFilters(); };
    const updateSaturate = (value) => { savedSaturate = parseFloat(value); localStorage.setItem('saturateFactor', savedSaturate); applyFilters(); };
    const updateSepia = (value) => { savedSepia = parseFloat(value); localStorage.setItem('sepiaFactor', savedSepia); applyFilters(); };
    const updateGrayscale = (value) => { savedGrayscale = parseFloat(value); localStorage.setItem('grayscaleFactor', savedGrayscale); applyFilters(); };
    const updateOpacity = (value) => { savedOpacity = parseFloat(value); localStorage.setItem('opacityFactor', savedOpacity); applyFilters(); };
    const updateRedTint = (value) => { savedRedTint = parseFloat(value); localStorage.setItem('redTintFactor', savedRedTint); applyFilters(); };
    const updateGreenTint = (value) => { savedGreenTint = parseFloat(value); localStorage.setItem('greenTintFactor', savedGreenTint); applyFilters(); };
    const updateBlueTint = (value) => { savedBlueTint = parseFloat(value); localStorage.setItem('blueTintFactor', savedBlueTint); applyFilters(); };

    // Reset individual scale to "as page load" values
    function resetScale(filter) {
        let defaultValue;
        switch (filter) {
            case 'inversion': defaultValue = 1.0; savedInversion = defaultValue; break;
            case 'brightness': defaultValue = 1.0; savedBrightness = defaultValue; break;
            case 'contrast': defaultValue = 1.0; savedContrast = defaultValue; break;
            case 'hue': defaultValue = 0; savedHue = defaultValue; break;
            case 'saturate': defaultValue = 1.0; savedSaturate = defaultValue; break;
            case 'sepia': defaultValue = 0; savedSepia = defaultValue; break;
            case 'grayscale': defaultValue = 0; savedGrayscale = defaultValue; break;
            case 'opacity': defaultValue = 1.0; savedOpacity = defaultValue; break;
            case 'redTint': defaultValue = 0; savedRedTint = defaultValue; break;
            case 'greenTint': defaultValue = 0; savedGreenTint = defaultValue; break;
            case 'blueTint': defaultValue = 0; savedBlueTint = defaultValue; break;
            default: return;
        }
        localStorage.setItem(`${filter}Factor`, defaultValue);
        const slider = document.getElementById(`${filter}-slider`);
        const numberInput = document.getElementById(`${filter}-number`);
        if (slider && numberInput) {
            slider.value = defaultValue;
            numberInput.value = defaultValue;
            applyFilters();
        }
    }

    // Reset all scales to "as page load" values
    function resetAllScales() {
        const defaults = {
            inversion: 1.0,
            brightness: 1.0,
            contrast: 1.0,
            hue: 0,
            saturate: 1.0,
            sepia: 0,
            grayscale: 0,
            opacity: 1.0,
            redTint: 0,
            greenTint: 0,
            blueTint: 0
        };
        for (const [filter, value] of Object.entries(defaults)) {
            eval(`saved${filter.charAt(0).toUpperCase() + filter.slice(1)} = ${value}`);
            localStorage.setItem(`${filter}Factor`, value);
            const slider = document.getElementById(`${filter}-slider`);
            const numberInput = document.getElementById(`${filter}-number`);
            if (slider && numberInput) {
                slider.value = value;
                numberInput.value = value;
            }
        }
        applyFilters();
    }

    // Randomize all scales
    function randomizeAllScales() {
        const ranges = {
            inversion: [0, 1],
            brightness: [0, 2],
            contrast: [0, 2],
            hue: [0, 180],
            saturate: [0, 2],
            sepia: [0, 2],
            grayscale: [0, 2],
            redTint: [0, 2],
            greenTint: [0, 2],
            blueTint: [0, 2]
        };

        for (const [filter, [min, max]] of Object.entries(ranges)) {
            const randomValue = min + Math.random() * (max - min);
            eval(`saved${filter.charAt(0).toUpperCase() + filter.slice(1)} = ${randomValue}`);
            localStorage.setItem(`${filter}Factor`, randomValue);
            const slider = document.getElementById(`${filter}-slider`);
            const numberInput = document.getElementById(`${filter}-number`);
            if (slider && numberInput) {
                slider.value = randomValue;
                numberInput.value = randomValue.toFixed(2);
            }
        }
        applyFilters();
    }

    // Create nubbin (toggle button)
    const nubbin = document.createElement('div');
    Object.assign(nubbin.style, {
        position: 'fixed',
        top: '3%',
        right: '0',
        transform: 'translateY(-50%)',
        zIndex: '10001',
        backgroundColor: '#333',
        borderRadius: '4px 0 0 4px',
        padding: '10px',
        cursor: 'pointer',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.3)',
        transition: 'background-color 0.2s, right 0.3s ease'
    });
    nubbin.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8.59,16.59L13.17,12L8.59,7.41L10,6l6,6l-6,6L8.59,16.59z"/><path fill="none" d="M0,0h24v24H0V0z"/></svg>';
    nubbin.addEventListener('mouseover', () => nubbin.style.backgroundColor = '#555');
    nubbin.addEventListener('mouseout', () => nubbin.style.backgroundColor = '#333');

    // Make nubbin draggable with boundaries
    nubbin.addEventListener('pointerdown', (e) => {
        if (e.button === 0) {
            isDraggingNubbin = true;
            nubbinYOffset = e.clientY - nubbin.getBoundingClientRect().top;
            e.preventDefault();
        }
    });
    document.addEventListener('pointermove', (e) => {
        if (isDraggingNubbin) {
            const newTop = Math.max(0, Math.min(window.innerHeight - nubbin.offsetHeight, e.clientY - nubbinYOffset));
            nubbin.style.top = `${newTop}px`;
        }
    });
    document.addEventListener('pointerup', () => {
        isDraggingNubbin = false;
    });

    // Create control panel (dark mode sidebar)
    const controlPanel = document.createElement('div');
    Object.assign(controlPanel.style, {
        position: 'fixed',
        top: '0',
        right: '-300px', // Starts offscreen
        zIndex: '10000',
        backgroundColor: '#212121', // Dark background
        width: '300px',
        height: '100vh',
        padding: '10px 0',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.5)',
        color: '#e0e0e0', // Light text
        fontFamily: 'Roboto, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        transition: 'right 0.3s ease',
        overflowY: 'auto',
        pointerEvents: 'auto'
    });

    console.log('Dark mode control panel created');

    // Header
    const header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 16px',
        userSelect: 'none'
    });
    const title = document.createElement('span');
    title.textContent = 'Dark Mode';
    title.style.fontSize = '14px';
    title.style.fontWeight = '500';
    header.appendChild(title);

    // Controls container
    const controlsContainer = document.createElement('div');
    Object.assign(controlsContainer.style, {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 8px'
    });

    // Button creation helper
    function createButton(text, onClick, iconUrl) {
        const btn = document.createElement('button');
        Object.assign(btn.style, {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 16px',
            backgroundColor: 'transparent',
            color: '#e0e0e0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            textAlign: 'left',
            width: '100%',
            transition: 'background-color 0.2s'
        });
        const icon = document.createElement('div');
        Object.assign(icon.style, {
            width: '20px',
            height: '20px',
            backgroundImage: `url(${iconUrl})`,
            backgroundSize: 'contain',
            marginRight: '12px'
        });
        const span = document.createElement('span');
        span.textContent = text;
        btn.appendChild(icon);
        btn.appendChild(span);
        btn.addEventListener('click', onClick);
        btn.addEventListener('mouseover', () => btn.style.backgroundColor = '#424242');
        btn.addEventListener('mouseout', () => btn.style.backgroundColor = 'transparent');
        return btn;
    }

    // Slider group creation helper
    function createSliderGroup(labelText, id, min, max, step, defaultValue, onInput, unit = '', filterName) {
        const container = document.createElement('div');
        Object.assign(container.style, {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '12px',
            padding: '8px 16px'
        });

        const labelRow = document.createElement('div');
        Object.assign(labelRow.style, {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            position: 'relative'
        });

        const label = document.createElement('label');
        label.htmlFor = `${filterName}-slider`;
        label.textContent = labelText;
        label.style.width = '50px';
        label.style.color = '#e0e0e0';

        const numberInputWrapper = document.createElement('div');
        Object.assign(numberInputWrapper.style, {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
        });

        const numberInput = document.createElement('input');
        numberInput.type = 'number';
        numberInput.id = `${filterName}-number`;
        numberInput.min = min;
        numberInput.max = max;
        numberInput.step = step;
        numberInput.value = defaultValue;
        numberInput.style.width = '60px';
        numberInput.style.background = '#424242';
        numberInput.style.color = '#e0e0e0';
        numberInput.style.border = '1px solid #616161';
        numberInput.style.borderRadius = '4px';
        numberInput.style.padding = '2px';
        numberInput.style.outline = 'none';
        numberInput.style.cursor = 'text';
        numberInput.style.pointerEvents = 'auto';
        numberInput.style.textAlign = 'center';

        const resetButton = document.createElement('button');
        Object.assign(resetButton.style, {
            width: '20px',
            height: '20px',
            padding: '0',
            backgroundColor: 'transparent',
            color: '#e0e0e0',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
            marginLeft: 'auto'
        });
        resetButton.textContent = '↺';
        resetButton.addEventListener('click', () => resetScale(filterName));
        resetButton.addEventListener('mouseover', () => resetButton.style.backgroundColor = '#616161');
        resetButton.addEventListener('mouseout', () => resetButton.style.backgroundColor = 'transparent');

        const sliderRow = document.createElement('div');
        Object.assign(sliderRow.style, {
            display: 'flex',
            width: '100%'
        });

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = `${filterName}-slider`;
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = defaultValue;
        slider.style.width = '100%';
        slider.style.cursor = 'pointer';
        slider.style.background = '#616161'; // Darker slider track
        slider.style.height = '4px';
        slider.style.borderRadius = '2px';

        const updateValue = (value) => {
            value = Math.min(parseFloat(max), Math.max(parseFloat(min), parseFloat(value) || 0));
            onInput(value);
            slider.value = value;
            numberInput.value = value;
        };

        slider.addEventListener('input', (e) => updateValue(e.target.value));
        numberInput.addEventListener('input', (e) => updateValue(e.target.value));
        numberInput.addEventListener('change', (e) => updateValue(e.target.value));

        let isDragging = false;
        let startY, startValue;
        numberInput.addEventListener('pointerdown', (e) => {
            if (e.target === numberInput && e.button === 0) {
                isDragging = true;
                startY = e.clientY;
                startValue = parseFloat(numberInput.value);
                e.preventDefault();
            }
        });
        document.addEventListener('pointermove', (e) => {
            if (isDragging) {
                const delta = (startY - e.clientY) * 0.005;
                const newValue = startValue + delta * (parseFloat(max) - parseFloat(min));
                updateValue(newValue);
            }
        });
        document.addEventListener('pointerup', () => { isDragging = false; });

        numberInputWrapper.appendChild(numberInput);
        labelRow.appendChild(label);
        labelRow.appendChild(numberInputWrapper);
        labelRow.appendChild(resetButton);
        sliderRow.appendChild(slider);
        container.appendChild(labelRow);
        container.appendChild(sliderRow);
        return container;
    }

    // Create UI elements
    const applyButton = createButton('Apply', applyDarkMode, 'https://www.gstatic.com/images/icons/material/system/1x/check_circle_outline_white_20dp.png');
    const autoApplyButton = createButton(isAutoApply ? 'Auto-Apply On' : 'Auto-Apply Off', toggleAutoApply, 'https://www.gstatic.com/images/icons/material/system/1x/autorenew_white_20dp.png');
    const toggleButton = createButton('Show Vanilla', toggleVanillaFilters, 'https://www.gstatic.com/images/icons/material/system/1x/visibility_off_white_20dp.png');
    const scalesButton = createButton('Scales', () => {
        isScalesVisible = !isScalesVisible;
        if (isScalesVisible) {
            scalesContainer.style.display = 'flex';
            setTimeout(() => {
                scalesContainer.style.maxHeight = `${scalesContainer.scrollHeight}px`;
                scalesContainer.style.opacity = '1';
            }, 10);
            scalesButton.querySelector('span').textContent = 'Hide Scales';
        } else {
            scalesContainer.style.maxHeight = '0px';
            scalesContainer.style.opacity = '0';
            setTimeout(() => {
                scalesContainer.style.display = 'none';
            }, 300);
            scalesButton.querySelector('span').textContent = 'Scales';
        }
    }, 'https://www.gstatic.com/images/icons/material/system/1x/tune_white_20dp.png');

    const resetButton = createButton('Reset', resetAllScales, 'https://www.gstatic.com/images/icons/material/system/1x/restore_white_20dp.png');
    const randomizeButton = createButton('Randomize', randomizeAllScales, 'https://www.gstatic.com/images/icons/material/system/1x/shuffle_white_20dp.png');

    const scalesContainer = document.createElement('div');
    Object.assign(scalesContainer.style, {
        display: 'none',
        maxHeight: '0px',
        opacity: '0',
        flexDirection: 'column',
        gap: '6px',
        padding: '8px 0',
        background: '#333', // Darker background for scales
        borderRadius: '4px',
        transition: 'max-height 0.3s ease, opacity 0.3s ease',
        overflow: 'hidden'
    });
    scalesContainer.appendChild(createSliderGroup('Invert', 'inversion-slider', '0', '1', '0.01', savedInversion, updateInversion, '', 'inversion'));
    scalesContainer.appendChild(createSliderGroup('Bright', 'brightness-slider', '0', '2', '0.01', savedBrightness, updateBrightness, '', 'brightness'));
    scalesContainer.appendChild(createSliderGroup('Contrast', 'contrast-slider', '0', '2', '0.01', savedContrast, updateContrast, '', 'contrast'));
    scalesContainer.appendChild(createSliderGroup('Hue', 'hue-slider', '0', '180', '1', savedHue, updateHue, '°', 'hue'));
    scalesContainer.appendChild(createSliderGroup('Saturate', 'saturate-slider', '0', '2', '0.01', savedSaturate, updateSaturate, '', 'saturate'));
    scalesContainer.appendChild(createSliderGroup('Sepia', 'sepia-slider', '0', '2', '0.01', savedSepia, updateSepia, '', 'sepia'));
    scalesContainer.appendChild(createSliderGroup('Gray', 'grayscale-slider', '0', '2', '0.01', savedGrayscale, updateGrayscale, '', 'grayscale'));
    scalesContainer.appendChild(createSliderGroup('Opacity', 'opacity-slider', '0', '1', '0.01', savedOpacity, updateOpacity, '', 'opacity'));
    scalesContainer.appendChild(createSliderGroup('Red', 'redTint-slider', '0', '2', '0.01', savedRedTint, updateRedTint, '', 'redTint'));
    scalesContainer.appendChild(createSliderGroup('Green', 'greenTint-slider', '0', '2', '0.01', savedGreenTint, updateGreenTint, '', 'greenTint'));
    scalesContainer.appendChild(createSliderGroup('Blue', 'blueTint-slider', '0', '2', '0.01', savedBlueTint, updateBlueTint, '', 'blueTint'));
    scalesContainer.appendChild(resetButton);
    scalesContainer.appendChild(randomizeButton);

    // Assemble control panel
    controlsContainer.appendChild(applyButton);
    controlsContainer.appendChild(autoApplyButton);
    controlsContainer.appendChild(toggleButton);
    controlsContainer.appendChild(scalesButton);
    controlsContainer.appendChild(scalesContainer);
    controlPanel.appendChild(header);
    controlPanel.appendChild(controlsContainer);

    // Append elements to body
    document.body.appendChild(nubbin);
    document.body.appendChild(controlPanel);

    console.log('Nubbin and control panel appended to body');

    // Toggle panel visibility with animation
    function togglePanelVisibility() {
        isPanelVisible = !isPanelVisible;
        if (isPanelVisible) {
            controlPanel.style.right = '0';
            nubbin.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M15.41,16.59L10.83,12l4.58-4.59L14,6l-6,6l6,6L15.41,16.59z"/><path fill="none" d="M0,0h24v24H0V0z"/></svg>';
        } else {
            controlPanel.style.right = '-300px';
            nubbin.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M8.59,16.59L13.17,12L8.59,7.41L10,6l6,6l-6,6L8.59,16.59z"/><path fill="none" d="M0,0h24v24H0V0z"/></svg>';
        }
    }

    nubbin.addEventListener('click', togglePanelVisibility);

    // Initial setup
    if (isAutoApply) toggleAutoApply();
    applyFilters();
})();
