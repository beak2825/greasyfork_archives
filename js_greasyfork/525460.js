// ==UserScript==
// @name         myNoise Custom Presets
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhanced preset management for myNoise with metadata export
// @author       brute-bonnet
// @match        https://mynoise.net/NoiseMachines/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525460/myNoise%20Custom%20Presets.user.js
// @updateURL https://update.greasyfork.org/scripts/525460/myNoise%20Custom%20Presets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createPresetUI() {
        const controls = document.querySelector('.nestedSection.controls');
        if (!controls) return;

        const presetSection = document.createElement('div');
        presetSection.className = 'nobreak';
        presetSection.innerHTML = `
            <h2>Custom Presets</h2>
            <div style="margin-bottom: 12px;">
                <input type="text" id="customPresetName" placeholder="Preset name" style="
                    padding: 4px 8px;
                    margin-right: 5px;
                    background: rgb(25,27,29);
                    border: 1px solid #555;
                    border-radius: 3px;
                    color: #aaa;
                    font-family: 'Merriweather Sans', Tahoma;
                    font-size: 14px;
                    width: 150px;
                ">
                <span class="actionlink" id="customSavePreset" role="button">Save</span>
            </div>
            <div style="margin-bottom: 12px;">
                <select id="customPresetList" style="
                    padding: 4px 8px;
                    margin-right: 5px;
                    background: rgb(25,27,29);
                    border: 1px solid #555;
                    border-radius: 3px;
                    color: #aaa;
                    font-family: 'Merriweather Sans', Tahoma;
                    font-size: 14px;
                    width: 150px;
                ">
                    <option value="">Select preset...</option>
                </select>
                <span class="actionlink" id="customLoadPreset" role="button">Load</span> •
                <span class="actionlink" id="customDeletePreset" role="button">Delete</span>
            </div>
            <div>
                <textarea id="presetCode" placeholder="Paste preset code here..." style="
                    width: 100%;
                    height: 60px;
                    padding: 8px;
                    margin-bottom: 5px;
                    background: rgb(25,27,29);
                    border: 1px solid #555;
                    border-radius: 3px;
                    color: #aaa;
                    font-family: monospace;
                    font-size: 12px;
                    resize: vertical;
                "></textarea>
                <div>
                    <span class="actionlink" id="importPreset" role="button">Import Code</span> •
                    <span class="actionlink" id="exportPreset" role="button">Export Current</span> •
                    <span class="actionlink" id="exportInfo" role="button">Export Generator Info</span>
                </div>
            </div>
        `;

        // Insert as first child of controls
        controls.insertBefore(presetSection, controls.firstChild);

        // Add event listeners
        document.getElementById('customSavePreset').addEventListener('click', saveCurrentPreset);
        document.getElementById('customLoadPreset').addEventListener('click', loadSelectedPreset);
        document.getElementById('customDeletePreset').addEventListener('click', deleteSelectedPreset);
        document.getElementById('importPreset').addEventListener('click', importPresetFromCode);
        document.getElementById('exportPreset').addEventListener('click', exportCurrentPreset);
        document.getElementById('exportInfo').addEventListener('click', exportGeneratorInfo);

        // Load existing presets
        loadPresetList();
    }

    function getCurrentLevels() {
        // Get all slider values
        const levels = [];
        for (let i = 0; i < 10; i++) {
            const value = parseFloat($(`#s${i}`).slider('value'));
            levels.push(isNaN(value) ? 0 : value);
        }
        return levels;
    }

    function setAllSliders(levels) {
        // Set all slider values and update the generator
        levels.forEach((level, i) => {
            $(`#s${i}`).slider('value', level);
        });
        if (window.currentLevel) {
            window.currentLevel = levels;
        }
        if (window.setAllLevels) {
            window.setAllLevels();
        }
    }

    function saveCurrentPreset() {
        const nameInput = document.getElementById('customPresetName');
        const name = nameInput.value.trim();
        if (!name) {
            msg("Please enter a preset name");
            return;
        }

        const presets = getPresets();
        const currentLevels = getCurrentLevels();

        presets[name] = {
            levels: currentLevels,
            date: new Date().toISOString()
        };

        localStorage.setItem('myNoisePresets', JSON.stringify(presets));
        loadPresetList();
        nameInput.value = '';
        msg(`Preset "${name}" saved`);
    }

    function loadSelectedPreset() {
        const select = document.getElementById('customPresetList');
        const name = select.value;
        if (!name) return;

        const presets = getPresets();
        const preset = presets[name];

        if (preset && preset.levels && preset.levels.length === 10) {
            setAllSliders(preset.levels);
            msg(`Loaded preset "${name}"`);
        }
    }

    function deleteSelectedPreset() {
        const select = document.getElementById('customPresetList');
        const name = select.value;
        if (!name) return;

        const presets = getPresets();
        delete presets[name];
        localStorage.setItem('myNoisePresets', JSON.stringify(presets));

        loadPresetList();
        msg(`Deleted preset "${name}"`);
    }

    function exportCurrentPreset() {
        const levels = getCurrentLevels();
        const codeArea = document.getElementById('presetCode');
        codeArea.value = levels.join(',');
        codeArea.select();
        msg("Preset code copied to textarea");
    }

    function importPresetFromCode() {
        const codeArea = document.getElementById('presetCode');
        const code = codeArea.value.trim();

        try {
            const levels = code.split(',').map(x => parseFloat(x));
            if (levels.length !== 10 || levels.some(x => isNaN(x) || x < 0 || x > 1)) {
                throw new Error("Invalid preset code");
            }

            setAllSliders(levels);
            codeArea.value = '';
            msg("Preset code imported successfully");
        } catch (e) {
            msg("Invalid preset code format");
        }
    }

    function exportGeneratorInfo() {
        const sliderInfo = [];
        for (let i = 0; i < 10; i++) {
            const slider = document.getElementById(`s${i}`);
            if (slider) {
                sliderInfo.push({
                    name: slider.getAttribute('aria-label') || `Slider ${i}`,
                    value: $(`#s${i}`).slider('value')
                });
            }
        }

        const info = {
            generatorName: document.querySelector('.mainTitle #titleName')?.textContent || 'Unknown Generator',
            url: window.location.href,
            currentPreset: getCurrentLevels().join(','),
            sliderMapping: sliderInfo,
            exportDate: new Date().toISOString(),
            guide: `
# Generator Information Export

## Current Settings
${sliderInfo.map(s => `${s.name}: ${s.value}`).join('\n')}

## How to Use This Preset
1. To import: Copy the preset code below, paste into the textarea, click "Import Code"
2. Preset Code: ${getCurrentLevels().join(',')}
3. Each number represents a slider value from 0 to 1

## Tips
- Values closer to 0 = slider down
- Values closer to 1 = slider up
- Format: ${sliderInfo.map(s => s.name).join(', ')}

Generated on: ${new Date().toLocaleString()}
For: ${window.location.href}
`.trim()
        };

        const codeArea = document.getElementById('presetCode');
        codeArea.value = info.guide;
        codeArea.style.height = '300px';
        msg("Generator information exported");
    }

    function loadPresetList() {
        const select = document.getElementById('customPresetList');
        const presets = getPresets();

        select.innerHTML = '<option value="">Select preset...</option>';

        Object.entries(presets)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([name, preset]) => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                select.appendChild(option);
            });
    }

    function getPresets() {
        try {
            const presets = localStorage.getItem('myNoisePresets');
            return presets ? JSON.parse(presets) : {};
        } catch (e) {
            console.error('Error loading presets:', e);
            return {};
        }
    }

    // Wait for page and myNoise to initialize
    const checkInterval = setInterval(() => {
        if (window.$ && $('#s0').slider && document.querySelector('.nestedSection.controls')) {
            clearInterval(checkInterval);
            createPresetUI();
        }
    }, 100);

})();