// ==UserScript==
// @name         Dead Frontier Tooltip Details
// @author       ils94
// @namespace    http://tampermonkey.net/
// @version      1.7.3
// @description  Add information from the wiki in the weapons infobox with bonus calculations
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=28*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=59
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=81
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=82*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=84
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=32*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535179/Dead%20Frontier%20Tooltip%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/535179/Dead%20Frontier%20Tooltip%20Details.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dpsData = {};
    let userStats = {
        totalDamage: 0,
        attackSpeed: 0,
        meleeBonuses: 0,
        chainsawBonuses: 0,
        pistolBonuses: 0,
        rifleBonuses: 0,
        shotgunBonuses: 0,
        smgBonuses: 0,
        machineGunBonuses: 0,
        explosiveBonuses: 0
    };
    let isShiftPressed = false;
    let presets = JSON.parse(localStorage.getItem('deadFrontierPresets') || '{}');
    let lastSelectedPreset = localStorage.getItem('deadFrontierLastPreset') || '';
    let tooltipVisibility = JSON.parse(localStorage.getItem('deadFrontierTooltipVisibility') || '{}');
    const defaultVisibility = {
        avgDPS: true,
        avgDPSTheoretical: true,
        criticalDPS: true,
        criticalDPSTheoretical: true,
        damagePerHit: true,
        criticalDamagePerHit: true,
        hitsPerSecond: true,
        hitsPerSecondTheoretical: true
    };
    tooltipVisibility = {
        ...defaultVisibility,
        ...tooltipVisibility
    };
    let isTooltipContainerVisible = localStorage.getItem('deadFrontierTooltipContainerVisible') !== 'false';

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') {
            isShiftPressed = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Shift') {
            isShiftPressed = false;
        }
    });

    function loadSavedStats() {
        const saved = localStorage.getItem('deadFrontierUserStats');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.assign(userStats, parsed);
            } catch (e) {
                console.error('[DPS] Failed to parse saved stats:', e);
            }
        }
        if (lastSelectedPreset && presets[lastSelectedPreset]) {
            loadPreset(lastSelectedPreset);
        }
    }

    function savePreset(name, stats, overwrite = false) {
        if (presets[name] && !overwrite) {
            const confirmOverwrite = confirm(`Preset "${name}" already exists. Do you want to overwrite it?`);
            if (!confirmOverwrite) return false;
        }
        presets[name] = {
            ...stats
        };
        localStorage.setItem('deadFrontierPresets', JSON.stringify(presets));
        updateAllPresetDropdowns();
        return true;
    }

    function loadPreset(name, inputElements = []) {
        if (!presets[name]) return;
        Object.assign(userStats, presets[name]);
        inputElements.forEach(({
            key,
            inputEl
        }) => {
            inputEl.value = userStats[key] || 0;
        });
        localStorage.setItem('deadFrontierUserStats', JSON.stringify(userStats));
        localStorage.setItem('deadFrontierLastPreset', name);
        lastSelectedPreset = name;
        updateAllPresetDropdowns();
        const staticInfoboxPages = ['page=25', 'page=28', 'page=50', 'page=59', 'page=84', 'page=31', 'page=32'];
        if (staticInfoboxPages.some(page => window.location.href.includes(page))) {
            injectDPSIntoStaticBoxes();
        }
    }

    function deletePreset(name) {
        if (!presets[name]) return;
        if (confirm(`Are you sure you want to delete preset "${name}"?`)) {
            delete presets[name];
            localStorage.setItem('deadFrontierPresets', JSON.stringify(presets));
            if (lastSelectedPreset === name) {
                lastSelectedPreset = '';
                localStorage.removeItem('deadFrontierLastPreset');
            }
            updateAllPresetDropdowns();
        }
    }

    function updatePresetDropdown(dropdown) {
        dropdown.innerHTML = '<option value="">Select Preset</option>';
        Object.keys(presets).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            dropdown.appendChild(option);
        });
        if (lastSelectedPreset && presets[lastSelectedPreset]) {
            dropdown.value = lastSelectedPreset;
        }
    }

    function updateAllPresetDropdowns() {
        const dropdowns = document.querySelectorAll('.presetDropdown');
        dropdowns.forEach(dropdown => updatePresetDropdown(dropdown));
    }

    function createPresetDropdown() {
        if (window.location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25') {
            return;
        }

        if (window.location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=81') {
            return;
        }

        const presetContainer = document.createElement('div');
        presetContainer.style.position = 'fixed';
        presetContainer.style.top = '50px';
        presetContainer.style.left = '5px';
        presetContainer.style.backgroundColor = '#1a1a1a';
        presetContainer.style.padding = '10px';
        presetContainer.style.border = '2px solid #00FF00';
        presetContainer.style.borderRadius = '8px';
        presetContainer.style.zIndex = '1000';
        presetContainer.style.color = '#00FF00';
        presetContainer.style.fontFamily = 'Arial, sans-serif';
        presetContainer.style.fontSize = '14px';
        presetContainer.style.boxShadow = '0 4px 8px rgba(0, 255, 0, 0.3)';
        presetContainer.style.display = 'flex';
        presetContainer.style.flexDirection = 'column';
        presetContainer.style.gap = '8px';

        const dropdownContainer = document.createElement('div');
        dropdownContainer.style.display = 'flex';
        dropdownContainer.style.alignItems = 'center';
        dropdownContainer.style.gap = '8px';

        const presetLabel = document.createElement('label');
        presetLabel.textContent = 'Presets:';
        presetLabel.style.fontSize = '12px';
        dropdownContainer.appendChild(presetLabel);

        const presetDropdown = document.createElement('select');
        presetDropdown.className = 'presetDropdown';
        presetDropdown.style.width = '120px';
        presetDropdown.style.backgroundColor = '#2a2a2a';
        presetDropdown.style.color = '#00FF00';
        presetDropdown.style.border = '1px solid #00FF00';
        presetDropdown.style.borderRadius = '4px';
        presetDropdown.style.padding = '4px';
        presetDropdown.style.fontSize = '12px';
        updatePresetDropdown(presetDropdown);
        dropdownContainer.appendChild(presetDropdown);

        presetContainer.appendChild(dropdownContainer);

        const toggleButton = document.createElement('button');
        toggleButton.textContent = isTooltipContainerVisible ? 'Hide Options' : 'Show Options';
        toggleButton.style.backgroundColor = '#00FF00';
        toggleButton.style.color = '#000';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.padding = '10px 10px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '12px';
        toggleButton.style.fontWeight = 'bold';
        toggleButton.style.minHeight = '25px';
        toggleButton.style.transition = 'background-color 0.2s';
        toggleButton.style.alignCenter = 'flex-start';

        toggleButton.addEventListener('mouseover', () => {
            toggleButton.style.backgroundColor = '#00CC00';
        });
        toggleButton.addEventListener('mouseout', () => {
            toggleButton.style.backgroundColor = '#00FF00';
        });

        toggleButton.addEventListener('click', () => {
            isTooltipContainerVisible = !isTooltipContainerVisible;
            const tooltipContainer = document.querySelector('.tooltipVisibilityContainer');
            if (tooltipContainer) {
                tooltipContainer.style.display = isTooltipContainerVisible ? 'block' : 'none';
            }
            toggleButton.textContent = isTooltipContainerVisible ? 'Hide Options' : 'Show Options';
            localStorage.setItem('deadFrontierTooltipContainerVisible', isTooltipContainerVisible);
        });

        presetContainer.appendChild(toggleButton);

        presetDropdown.addEventListener('change', () => {
            const selected = presetDropdown.value;
            if (selected) {
                loadPreset(selected);
            }
        });

        document.body.appendChild(presetContainer);
    }

    async function fetchMasteryBonuses() {
        try {
            const doc = document;
            const masteryMap = {
                "Melee Damage": "meleeBonuses",
                "Chainsaw Damage": "chainsawBonuses",
                "Pistol Damage": "pistolBonuses",
                "Rifle Damage": "rifleBonuses",
                "Shotgun Damage": "shotgunBonuses",
                "SMG Damage": "smgBonuses",
                "Machinegun Damage": "machineGunBonuses",
                "Explosive Damage": "explosiveBonuses"
            };
            const results = {};
            const containers = doc.querySelectorAll('.masteryContainer');
            containers.forEach(container => {
                const typeEl = container.querySelector('.bonusType.cashHack');
                const valueEl = container.querySelector('.cashhack.greenElements');
                if (typeEl && valueEl) {
                    const typeName = typeEl.getAttribute('data-cash');
                    const bonusValue = valueEl.getAttribute('data-cash');
                    if (masteryMap[typeName]) {
                        const numericValue = parseFloat(bonusValue.replace('+', '').replace('%', '').replace(' MAX', '')) || 0;
                        results[masteryMap[typeName]] = numericValue;
                    }
                }
            });
            return Object.keys(results).length > 0 ? results : null;
        } catch (e) {
            console.error("Erro ao buscar maestrias:", e);
            return null;
        }
    }

    function createTooltipVisibilityContainer() {

        if (window.location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=81') {
            return;
        }


        const container = document.createElement('div');
        container.className = 'tooltipVisibilityContainer';
        container.style.position = 'fixed';

        const page = Number(new URLSearchParams(window.location.search).get('page'));
        const pagesWithTop140 = [24, 28, 35, 50, 59, 82, 84];

        container.style.top = pagesWithTop140.includes(page) ?
            '140px' :
            '70px';

        container.style.left = '5px';
        container.style.backgroundColor = '#1a1a1a';
        container.style.padding = '15px';
        container.style.border = '2px solid #00FF00';
        container.style.borderRadius = '8px';
        container.style.zIndex = '1000';
        container.style.color = '#00FF00';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '14px';
        container.style.boxShadow = '0 4px 8px rgba(0, 255, 0, 0.3)';
        container.style.width = '250px';

        if (window.location.href === 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25') {
            container.style.display = 'block';
        } else {
            container.style.display = isTooltipContainerVisible ? 'block' : 'none';
        }

        const title = document.createElement('div');
        title.textContent = 'Tooltip Display Options';
        title.style.fontSize = '16px';
        title.style.fontWeight = 'bold';
        title.style.textAlign = 'center';
        title.style.marginBottom = '12px';
        container.appendChild(title);

        const checkboxes = [{
                label: 'Avg. DPS',
                key: 'avgDPS'
            },
            {
                label: 'Avg. DPS Theoretical',
                key: 'avgDPSTheoretical'
            },
            {
                label: 'Critical/AoE DPS',
                key: 'criticalDPS'
            },
            {
                label: 'Critical/AoE DPS Theoretical',
                key: 'criticalDPSTheoretical'
            },
            {
                label: 'Damage per Hit',
                key: 'damagePerHit'
            },
            {
                label: 'Critical/AoE Damage per Hit',
                key: 'criticalDamagePerHit'
            },
            {
                label: 'Hit(s) per Second',
                key: 'hitsPerSecond'
            },
            {
                label: 'Hit(s) per Second Theoretical',
                key: 'hitsPerSecondTheoretical'
            }
        ];

        checkboxes.forEach(({
            label,
            key
        }) => {
            const labelEl = document.createElement('label');
            labelEl.style.display = 'flex';
            labelEl.style.alignItems = 'center';
            labelEl.style.marginBottom = '8px';
            labelEl.style.fontSize = '12px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = tooltipVisibility[key];
            checkbox.style.marginRight = '8px';
            checkbox.style.cursor = 'pointer';

            checkbox.addEventListener('change', () => {
                tooltipVisibility[key] = checkbox.checked;
                localStorage.setItem('deadFrontierTooltipVisibility', JSON.stringify(tooltipVisibility));
                const staticInfoboxPages = ['page=25', 'page=28', 'page=50', 'page=59', 'page=84', 'page=31', 'page=32'];
                if (staticInfoboxPages.some(page => window.location.href.includes(page))) {
                    injectDPSIntoStaticBoxes();
                }
            });

            labelEl.appendChild(checkbox);
            labelEl.appendChild(document.createTextNode(label));
            container.appendChild(labelEl);
        });

        document.body.appendChild(container);
    }

    function createInputContainer() {
        if (!window.location.href.includes('page=25') && !window.location.href.includes('page=81')) return;

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.left = '5px';
        container.style.backgroundColor = '#1a1a1a';
        container.style.padding = '15px';
        container.style.border = '2px solid #00FF00';
        container.style.borderRadius = '8px';
        container.style.zIndex = '1000';
        container.style.color = '#00FF00';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '14px';
        container.style.boxShadow = '0 4px 8px rgba(0, 255, 0, 0.3)';
        container.style.width = '250px';

        const title = document.createElement('div');
        title.textContent = 'Implant and Weapons Bonuses';
        title.style.fontSize = '16px';
        title.style.fontWeight = 'bold';
        title.style.textAlign = 'center';
        title.style.marginBottom = '12px';
        container.appendChild(title);

        const fetchBtn = document.createElement('button');
        fetchBtn.textContent = 'Auto Fetch Masteries Bonus';
        fetchBtn.style = 'width:100%; margin-bottom:12px; background:#00FF00; color:black; border:none; border-radius:4px; padding:8px; cursor:pointer; font-weight:bold;';
        fetchBtn.onclick = async () => {
            fetchBtn.textContent = '⌛ Fetching...';
            const bonuses = await fetchMasteryBonuses();
            if (bonuses) {
                Object.assign(userStats, bonuses);
                inputElements.forEach(({
                    key,
                    inputEl
                }) => {
                    if (bonuses[key] !== undefined) inputEl.value = bonuses[key];
                });
                localStorage.setItem('deadFrontierUserStats', JSON.stringify(userStats));
                alert("Mastery bonuses updated!");
            } else {
                alert("Failed to fetch masteries. Ensure you are on the Masteries page (page=81) and the page is fully loaded.");
            }
            fetchBtn.textContent = 'Auto Fetch Masteries Bonus';
        };
        container.appendChild(fetchBtn);

        const presetContainer = document.createElement('div');
        presetContainer.style.display = 'flex';
        presetContainer.style.alignItems = 'center';
        presetContainer.style.marginBottom = '12px';

        const presetLabel = document.createElement('label');
        presetLabel.textContent = 'Presets:';
        presetLabel.style.fontSize = '12px';
        presetContainer.appendChild(presetLabel);

        const presetDropdown = document.createElement('select');
        presetDropdown.className = 'presetDropdown';
        presetDropdown.style.marginLeft = 'auto';
        presetDropdown.style.width = '120px';
        presetDropdown.style.backgroundColor = '#2a2a2a';
        presetDropdown.style.color = '#00FF00';
        presetDropdown.style.border = '1px solid #00FF00';
        presetDropdown.style.borderRadius = '4px';
        presetDropdown.style.padding = '4px';
        presetDropdown.style.fontSize = '12px';
        updatePresetDropdown(presetDropdown);
        presetContainer.appendChild(presetDropdown);

        const deletePresetButton = document.createElement('button');
        deletePresetButton.textContent = 'X';
        deletePresetButton.style.marginLeft = '5px';
        deletePresetButton.style.backgroundColor = '#FF3333';
        deletePresetButton.style.color = '#000';
        deletePresetButton.style.border = 'none';
        deletePresetButton.style.borderRadius = '3px';
        deletePresetButton.style.padding = '5px 5px';
        deletePresetButton.style.cursor = 'pointer';
        deletePresetButton.style.fontSize = '20px';
        deletePresetButton.style.minWidth = '25px';
        deletePresetButton.style.minHeight = '12px';
        deletePresetButton.addEventListener('click', () => {
            const selected = presetDropdown.value;
            if (selected) {
                deletePreset(selected);
            }
        });
        presetContainer.appendChild(deletePresetButton);

        container.appendChild(presetContainer);

        const inputs = [{
                label: 'Total Inflicted Damage:',
                key: 'totalDamage'
            },
            {
                label: 'Total Attack Speed:',
                key: 'attackSpeed'
            },
            {
                label: 'Melee Bonuses:',
                key: 'meleeBonuses'
            },
            {
                label: 'Chainsaw Bonuses:',
                key: 'chainsawBonuses'
            },
            {
                label: 'Pistol Bonuses:',
                key: 'pistolBonuses'
            },
            {
                label: 'Rifle Bonuses:',
                key: 'rifleBonuses'
            },
            {
                label: 'Shotgun Bonuses:',
                key: 'shotgunBonuses'
            },
            {
                label: 'SMG Bonuses:',
                key: 'smgBonuses'
            },
            {
                label: 'Machine Gun Bonuses:',
                key: 'machineGunBonuses'
            },
            {
                label: 'Explosive Bonuses:',
                key: 'explosiveBonuses'
            }
        ];

        const inputElements = [];
        inputs.forEach(input => {
            const label = document.createElement('label');
            label.textContent = input.label;
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.marginBottom = '8px';
            label.style.fontSize = '12px';

            const inputEl = document.createElement('input');
            inputEl.type = 'text';
            inputEl.inputMode = 'decimal';
            inputEl.value = userStats[input.key];
            inputEl.style.width = '80px';
            inputEl.style.marginLeft = 'auto';
            inputEl.style.backgroundColor = '#2a2a2a';
            inputEl.style.color = '#00FF00';
            inputEl.style.border = '1px solid #00FF00';
            inputEl.style.borderRadius = '4px';
            inputEl.style.padding = '4px';
            inputEl.style.fontSize = '12px';
            inputEl.style.outline = 'none';

            inputEl.addEventListener('input', () => {
                let cleaned = inputEl.value.replace(/[^0-9.]/g, '');
                const parts = cleaned.split('.');
                if (parts.length > 2) {
                    cleaned = parts[0] + '.' + parts.slice(1).join('');
                }
                inputEl.value = cleaned;
                userStats[input.key] = parseFloat(inputEl.value) || 0;
            });

            label.appendChild(inputEl);
            container.appendChild(label);
            inputElements.push({
                key: input.key,
                inputEl
            });
        });

        presetDropdown.addEventListener('change', () => {
            const selected = presetDropdown.value;
            if (selected) {
                loadPreset(selected, inputElements);
            }
        });

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.display = 'block';
        saveButton.style.margin = '10px auto 0';
        saveButton.style.backgroundColor = '#00FF00';
        saveButton.style.color = '#000';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';
        saveButton.style.padding = '15px 15px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.fontSize = '16px';
        saveButton.style.fontWeight = 'bold';
        saveButton.style.transition = 'background-color 0.2s, transform 0.1s';
        saveButton.style.minWidth = '50px';
        saveButton.style.minHeight = '25px';

        saveButton.addEventListener('mouseover', () => {
            saveButton.style.backgroundColor = '#00CC00';
        });
        saveButton.addEventListener('mouseout', () => {
            saveButton.style.backgroundColor = '#00FF00';
        });

        saveButton.addEventListener('click', () => {
            const presetName = prompt('Enter a name for the preset:');
            if (presetName && presetName.trim()) {
                if (savePreset(presetName.trim(), userStats)) {
                    localStorage.setItem('deadFrontierUserStats', JSON.stringify(userStats));
                    localStorage.setItem('deadFrontierLastPreset', presetName.trim());
                    lastSelectedPreset = presetName.trim();
                    injectDPSIntoStaticBoxes();
                    console.log('[DPS] User stats saved:', userStats);
                }
            }
        });

        container.appendChild(saveButton);
        document.body.appendChild(container);
    }

    function loadDPS() {
        if (typeof window.weaponData === 'undefined') {
            console.error('[DPS] External weapon data not loaded');
            return;
        }

        window.weaponData.weapons.forEach(weapon => {
            const key = weapon.name.toLowerCase();
            dpsData[key] = {
                name: weapon.name,
                category: weapon.category,
                dps: weapon.stats.DPS || {},
                dph: weapon.stats.DPH || {},
                hps: weapon.stats.HPS || {}
            };
        });

        console.log('[DPS] Loaded', Object.keys(dpsData).length, 'entries from external JSON');
        loadSavedStats();
        createPresetDropdown();
        createTooltipVisibilityContainer();
        createInputContainer();
        startWatcher();
        injectDPSIntoStaticBoxes();
    }

    function parseSumExpression(expr) {
        if (!expr || typeof expr !== 'string') return {
            terms: [],
            total: null,
            base: null,
            multiplier: null,
            innerMultiplier: null
        };

        // Remove whitespace and normalize brackets
        expr = expr.replace(/\s+/g, '').replace(/[\[\]]/g, '');

        // Pattern 1: [a + b + c] x m = t (e.g., "[42 + 12 + 6] x 5 = 300")
        let match = expr.match(/^(\d+\.?\d*)\+(\d+\.?\d*)\+(\d+\.?\d*)x(\d+\.?\d*)=(\d+\.?\d*)$/);
        if (match) {
            const sumTerms = [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])];
            const multiplier = parseFloat(match[4]);
            const total = parseFloat(match[5]);
            return {
                terms: sumTerms,
                total,
                base: null,
                multiplier,
                innerMultiplier: null
            };
        }

        // Pattern 2: [a + b] x m = t (e.g., "[14.4 + 3.6] x 16 = 288")
        match = expr.match(/^(\d+\.?\d*)\+(\d+\.?\d*)x(\d+\.?\d*)=(\d+\.?\d*)$/);
        if (match) {
            const sumTerms = [parseFloat(match[1]), parseFloat(match[2])];
            const multiplier = parseFloat(match[3]);
            const total = parseFloat(match[4]);
            return {
                terms: sumTerms,
                total,
                base: null,
                multiplier,
                innerMultiplier: null
            };
        }

        // Pattern 3: [a x b] x m = t (e.g., "[12 x 9] x 2 = 216")
        match = expr.match(/^(\d+\.?\d*)x(\d+\.?\d*)x(\d+\.?\d*)=(\d+\.?\d*)$/);
        if (match) {
            const base = parseFloat(match[1]);
            const innerMultiplier = parseFloat(match[2]);
            const multiplier = parseFloat(match[3]);
            const total = parseFloat(match[4]);
            return {
                terms: [base],
                total,
                base,
                multiplier,
                innerMultiplier
            };
        }

        // Pattern 4: a x m = t (e.g., "10 x 4 = 40")
        match = expr.match(/^(\d+\.?\d*)x(\d+\.?\d*)=(\d+\.?\d*)$/);
        if (match) {
            const base = parseFloat(match[1]);
            const multiplier = parseFloat(match[2]);
            const total = parseFloat(match[3]);
            return {
                terms: [base],
                total,
                base,
                multiplier,
                innerMultiplier: null
            };
        }

        // Pattern 5: a + b + c = t (e.g., "10 + 20 + 30 = 60")
        match = expr.match(/^(\d+\.?\d*)\+(\d+\.?\d*)\+(\d+\.?\d*)=(\d+\.?\d*)$/);
        if (match) {
            const terms = [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])];
            const total = parseFloat(match[4]);
            return {
                terms,
                total,
                base: null,
                multiplier: null,
                innerMultiplier: null
            };
        }

        // Pattern 6: a + b = t (e.g., "10 + 20 = 30")
        match = expr.match(/^(\d+\.?\d*)\+(\d+\.?\d*)=(\d+\.?\d*)$/);
        if (match) {
            const terms = [parseFloat(match[1]), parseFloat(match[2])];
            const total = parseFloat(match[3]);
            return {
                terms,
                total,
                base: null,
                multiplier: null,
                innerMultiplier: null
            };
        }

        // Pattern 7: a + b (e.g., "10 + 20")
        match = expr.match(/^(\d+\.?\d*)\+(\d+\.?\d*)$/);
        if (match) {
            const terms = [parseFloat(match[1]), parseFloat(match[2])];
            const total = terms.reduce((sum, term) => sum + term, 0);
            return {
                terms,
                total,
                base: null,
                multiplier: null,
                innerMultiplier: null
            };
        }

        // Pattern 8: Single number (e.g., "50")
        const singleNumber = parseFloat(expr);
        if (!isNaN(singleNumber)) {
            return {
                terms: [singleNumber],
                total: singleNumber,
                base: null,
                multiplier: null,
                innerMultiplier: null
            };
        }

        return {
            terms: [],
            total: null,
            base: null,
            multiplier: null,
            innerMultiplier: null
        };
    }

    function calculateBonuses(entry) {
        const category = entry.category.toLowerCase();
        let masteryBonus = 0;

        if (category.includes('melee')) masteryBonus = userStats.meleeBonuses;
        if (category.includes('chainsaw')) masteryBonus = userStats.chainsawBonuses;
        if (category.includes('pistol')) masteryBonus = userStats.pistolBonuses;
        if (category.includes('rifle')) masteryBonus = userStats.rifleBonuses;
        if (category.includes('shotgun')) masteryBonus = userStats.shotgunBonuses;
        if (category.includes('smg')) masteryBonus = userStats.smgBonuses;
        if (category.includes('machine gun')) masteryBonus = userStats.machineGunBonuses;
        if (category.includes('grenade launchers') || category.includes('flamethrowers')) masteryBonus = userStats.explosiveBonuses;

        const damageMultiplier = 1 + (userStats.totalDamage + masteryBonus) / 100;
        const speedMultiplier = 1 + userStats.attackSpeed / 100;

        const dphTotalParsed = parseSumExpression(entry.dph.total);
        const dphCriticalParsed = parseSumExpression(entry.dph.critical);

        let dphTotal;
        let dphTotalTerms = [];

        // Handle complex patterns
        if (dphTotalParsed.multiplier !== null) {
            if (dphTotalParsed.innerMultiplier !== null) {
                // Pattern: [base x innerMultiplier] x multiplier = total
                const adjustedBase = (dphTotalParsed.terms[0] * damageMultiplier).toFixed(2);
                dphTotal = (dphTotalParsed.terms[0] * damageMultiplier * dphTotalParsed.innerMultiplier * dphTotalParsed.multiplier).toFixed(2);
                dphTotalTerms = [adjustedBase];
            } else {
                // Pattern: [a + b + c] x multiplier or [a + b] x multiplier = total
                dphTotalTerms = dphTotalParsed.terms.map(term => (term * damageMultiplier).toFixed(2));
                dphTotal = (dphTotalParsed.terms.reduce((sum, term) => sum + term, 0) * damageMultiplier * dphTotalParsed.multiplier).toFixed(2);
            }
        } else if (dphTotalParsed.base !== null && dphTotalParsed.multiplier !== null) {
            // Pattern: base x multiplier = total
            const adjustedBase = (dphTotalParsed.base * damageMultiplier).toFixed(2);
            dphTotal = (dphTotalParsed.base * damageMultiplier * dphTotalParsed.multiplier).toFixed(2);
            dphTotalTerms = [adjustedBase];
        } else {
            // Simple sum or single value
            dphTotalTerms = dphTotalParsed.terms.map(term => (term * damageMultiplier).toFixed(2));
            dphTotal = dphTotalParsed.total !== null ? (dphTotalParsed.total * damageMultiplier).toFixed(2) : 'N/A';
        }

        return {
            dps: {
                real: entry.dps.real ? (entry.dps.real * damageMultiplier * speedMultiplier).toFixed(2) : 'N/A',
                theoretical: entry.dps.theoretical ? (entry.dps.theoretical * damageMultiplier * speedMultiplier).toFixed(2) : 'N/A',
                critical: entry.dps.critical ? (entry.dps.critical * damageMultiplier * speedMultiplier).toFixed(2) : 'N/A',
                theoretical_critical: entry.dps.theoretical_critical ? (entry.dps.theoretical_critical * damageMultiplier * speedMultiplier).toFixed(2) : 'N/A'
            },
            dph: {
                total: dphTotal,
                critical: dphCriticalParsed.total !== null ? (dphCriticalParsed.total * damageMultiplier).toFixed(2) : 'N/A',
                totalTerms: dphTotalTerms,
                criticalTerms: dphCriticalParsed.terms.map(term => (term * damageMultiplier).toFixed(2)),
                base: dphTotalParsed.base,
                multiplier: dphTotalParsed.multiplier,
                innerMultiplier: dphTotalParsed.innerMultiplier
            },
            hps: {
                real: entry.hps.real ? (entry.hps.real * speedMultiplier).toFixed(2) : 'N/A',
                theoretical: entry.hps.theoretical ? (entry.hps.theoretical * speedMultiplier).toFixed(2) : 'N/A'
            }
        };
    }

    function generateStatsHTML(entry) {
        const bonuses = calculateBonuses(entry);

        const dphTotalParsed = parseSumExpression(entry.dph.total);
        let dphDisplay;
        let dphBonusDisplay;

        if (dphTotalParsed.innerMultiplier !== null && dphTotalParsed.multiplier !== null) {
            // Pattern: [base x innerMultiplier] x multiplier = total
            dphDisplay = `[${dphTotalParsed.terms[0]} x ${dphTotalParsed.innerMultiplier}] x ${dphTotalParsed.multiplier} = ${dphTotalParsed.total}`;
            dphBonusDisplay = `[${bonuses.dph.totalTerms[0]} x ${dphTotalParsed.innerMultiplier}] x ${dphTotalParsed.multiplier} = ${bonuses.dph.total}`;
        } else if (dphTotalParsed.terms.length >= 2 && dphTotalParsed.multiplier !== null) {
            // Pattern: [a + b + c] x multiplier or [a + b] x multiplier = total
            dphDisplay = `[${dphTotalParsed.terms.join(' + ')}] x ${dphTotalParsed.multiplier} = ${dphTotalParsed.total}`;
            dphBonusDisplay = `[${bonuses.dph.totalTerms.join(' + ')}] x ${dphTotalParsed.multiplier} = ${bonuses.dph.total}`;
        } else if (dphTotalParsed.base !== null && dphTotalParsed.multiplier !== null) {
            // Pattern: base x multiplier = total
            dphDisplay = `${dphTotalParsed.base} x ${dphTotalParsed.multiplier} = ${dphTotalParsed.total}`;
            dphBonusDisplay = `${bonuses.dph.totalTerms[0]} x ${dphTotalParsed.multiplier} = ${bonuses.dph.total}`;
        } else {
            // Simple sum or single value
            dphDisplay = dphTotalParsed.terms.length > 1 ? dphTotalParsed.terms.join(' + ') + (dphTotalParsed.total ? ` = ${dphTotalParsed.total}` : '') : (dphTotalParsed.total || 'N/A');
            dphBonusDisplay = dphTotalParsed.terms.length > 1 ? `${bonuses.dph.totalTerms.join(' + ')} = ${bonuses.dph.total}` : bonuses.dph.total;
        }

        const dphCriticalParsed = parseSumExpression(entry.dph.critical);
        const dphCriticalDisplay = dphCriticalParsed.terms.length > 1 ? dphCriticalParsed.terms.join(' + ') + (dphCriticalParsed.total ? ` = ${dphCriticalParsed.total}` : '') : (entry.dph.critical || 'N/A');
        const dphCriticalBonusDisplay = dphCriticalParsed.terms.length > 1 ? `${bonuses.dph.criticalTerms.join(' + ')} = ${bonuses.dph.critical}` : bonuses.dph.critical;

        const isExplosive = entry.category === 'Grenade Launchers' || entry.category === 'Flamethrowers';
        const isGrenadeLauncher = entry.category === 'Grenade Launchers';
        const dpsCriticalLabel = isExplosive ? 'Avg. DPS AoE' : 'Avg. DPS Critical';
        const dpsCriticalTheoreticalLabel = isExplosive ? 'Avg. DPS AoE Theoretical' : 'Avg. DPS Critical Theoretical';
        const dphCriticalLabel = isExplosive ? 'Damage per AoE' : 'Damage per Hit Critical';

        const baseStats = [];
        const bonusStats = [];

        if (tooltipVisibility.avgDPS) {
            baseStats.push(`Avg. DPS: ${entry.dps.real || 'N/A'}`);
            bonusStats.push(`Avg. DPS: ${bonuses.dps.real}`);
        }
        if (tooltipVisibility.avgDPSTheoretical) {
            baseStats.push(`Avg. DPS Theoretical: ${entry.dps.theoretical || 'N/A'}`);
            bonusStats.push(`Avg. DPS Theoretical: ${bonuses.dps.theoretical}`);
        }
        if (tooltipVisibility.criticalDPS) {
            baseStats.push(`${dpsCriticalLabel}: ${entry.dps.critical || 'N/A'}`);
            bonusStats.push(`${dpsCriticalLabel}: ${bonuses.dps.critical}`);
        }
        if (tooltipVisibility.criticalDPSTheoretical) {
            baseStats.push(`${dpsCriticalTheoreticalLabel}: ${entry.dps.theoretical_critical || 'N/A'}`);
            bonusStats.push(`${dpsCriticalTheoreticalLabel}: ${bonuses.dps.theoretical_critical}`);
        }

        if (isGrenadeLauncher && tooltipVisibility.damagePerHit) {
            const targetMultipliers = [{
                    count: 1,
                    multiplier: 3.5
                },
                {
                    count: 2,
                    multiplier: 2.0
                },
                {
                    count: 3,
                    multiplier: 1.5
                },
                {
                    count: 4,
                    multiplier: 1.25
                },
                {
                    count: 5,
                    multiplier: 1.0
                }
            ];
            const baseDamages = targetMultipliers.map(({
                count,
                multiplier
            }) => {
                const baseDamage = (dphTotalParsed.total * multiplier).toFixed(2);
                return `${count}: ${baseDamage}`;
            }).join('<br>');
            const bonusDamages = targetMultipliers.map(({
                count,
                multiplier
            }) => {
                const bonusDamage = (bonuses.dph.total * multiplier).toFixed(2);
                return `${count}: ${bonusDamage}`;
            }).join('<br>');
            baseStats.push(`Damage per Target:<br>${baseDamages}`);
            bonusStats.push(`Damage per Target:<br>${bonusDamages}`);
        } else {
            if (tooltipVisibility.damagePerHit) {
                baseStats.push(`Damage per Hit: ${dphDisplay}`);
                bonusStats.push(`Damage per Hit: ${dphBonusDisplay}`);
            }
            if (tooltipVisibility.criticalDamagePerHit && !isGrenadeLauncher) {
                baseStats.push(`${dphCriticalLabel}: ${dphCriticalDisplay}`);
                bonusStats.push(`${dphCriticalLabel}: ${dphCriticalBonusDisplay}`);
            }
        }

        if (tooltipVisibility.hitsPerSecond) {
            baseStats.push(`Hit(s) per Second: ${entry.hps.real || 'N/A'}`);
            bonusStats.push(`Hit(s) per Second: ${bonuses.hps.real}`);
        }
        if (tooltipVisibility.hitsPerSecondTheoretical) {
            baseStats.push(`Hit(s) per Second Theoretical: ${entry.hps.theoretical || 'N/A'}`);
            bonusStats.push(`Hit(s) per Second Theoretical: ${bonuses.hps.theoretical}`);
        }

        const statsHTML = [];
        if (baseStats.length > 0) {
            statsHTML.push('<strong>Base Stats:</strong>', ...baseStats);
        }
        if (bonusStats.length > 0) {
            statsHTML.push('<strong>With Bonuses:</strong>', ...bonusStats);
        }

        return statsHTML.map(line => {
            if (line.startsWith('<strong>')) {
                return `<br>${line}<br>`;
            }
            return line;
        }).join('<br>');
    }

    function startWatcher() {
        let tooltipWindow = null;

        setInterval(() => {
            const box = document.getElementById('infoBox');
            if (!box || box.style.visibility === 'hidden') {
                if (tooltipWindow) {
                    tooltipWindow.remove();
                    tooltipWindow = null;
                }
                return;
            }

            if (!isShiftPressed) {
                if (tooltipWindow) {
                    tooltipWindow.remove();
                    tooltipWindow = null;
                }
                return;
            }

            // Extract background-image URL
            const bgImage = box.style.backgroundImage;
            if (!bgImage) {
                if (tooltipWindow) {
                    tooltipWindow.remove();
                    tooltipWindow = null;
                }
                return;
            }

            // Parse the URL to get the file name (e.g., "xdusksaw.png")
            const urlMatch = bgImage.match(/url\(["']?(.+?)["']?\)/);
            if (!urlMatch || !urlMatch[1]) {
                console.log('[DPS] ✗ No valid background-image URL found');
                if (tooltipWindow) {
                    tooltipWindow.remove();
                    tooltipWindow = null;
                }
                return;
            }

            // Extract file name and clean it
            const url = urlMatch[1];
            const fileName = url.split('/').pop(); // Get the last part (e.g., "xdusksaw.png")
            const weaponKey = fileName
                .replace(/\.[^/.]+$/, '') // Remove extension (e.g., ".png")
                .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
                .toLowerCase(); // Convert to lowercase

            const entry = dpsData[weaponKey];

            if (!entry) {
                console.log(`[DPS] ✗ ${weaponKey} (hover, no exact match)`);
                if (tooltipWindow) {
                    tooltipWindow.remove();
                    tooltipWindow = null;
                }
                return;
            }

            if (!tooltipWindow) {
                tooltipWindow = document.createElement('div');
                tooltipWindow.className = 'dpsTooltip';
                tooltipWindow.style.position = 'absolute';
                tooltipWindow.style.backgroundColor = '#1a1a1a';
                tooltipWindow.style.border = '1px solid #00FF00';
                tooltipWindow.style.padding = '10px';
                tooltipWindow.style.color = '#00FF00';
                tooltipWindow.style.fontSize = '12px';
                tooltipWindow.style.zIndex = '1001';
                tooltipWindow.style.borderRadius = '4px';
                tooltipWindow.style.boxShadow = '0 2px 4px rgba(0, 255, 0, 0.3)';
                document.body.appendChild(tooltipWindow);
            }

            const boxRect = box.getBoundingClientRect();
            tooltipWindow.style.left = `${boxRect.right + 10}px`;
            tooltipWindow.style.top = `${boxRect.top}px`;

            tooltipWindow.innerHTML = generateStatsHTML(entry);
            console.log(`[DPS] ✔ ${entry.name} (hover, matched via ${weaponKey})`);
        }, 100);
    }

    function injectDPSIntoStaticBoxes() {
        const staticBoxes = document.querySelectorAll('.itemName');

        staticBoxes.forEach(nameEl => {
            const parent = nameEl.parentElement;
            if (!parent) return;

            const existing = parent.querySelector('.dpsInjected');
            if (existing) existing.remove();

            // Extract background-image from parent
            const bgImage = parent.style.backgroundImage;
            if (!bgImage) {
                console.log('[DPS] ✗ No background-image found for static infobox');
                return;
            }

            // Parse the URL to get the file name
            const urlMatch = bgImage.match(/url\(["']?(.+?)["']?\)/);
            if (!urlMatch || !urlMatch[1]) {
                console.log('[DPS] ✗ No valid background-image URL found for static infobox');
                return;
            }

            const url = urlMatch[1];
            const fileName = url.split('/').pop();
            const weaponKey = fileName
                .replace(/\.[^/.]+$/, '')
                .replace(/[^a-zA-Z0-9]/g, '')
                .toLowerCase();

            const entry = dpsData[weaponKey];

            if (!entry) {
                console.log(`[DPS] ✗ ${weaponKey} (static, no exact match)`);
                return;
            }

            const statsDiv = document.createElement('div');
            statsDiv.className = 'itemData dpsInjected';
            statsDiv.style.color = '#00FF00';
            statsDiv.style.fontSize = '12px';
            statsDiv.innerHTML = generateStatsHTML(entry);
            parent.appendChild(statsDiv);

            console.log(`[DPS] ✔ ${entry.name} (static, matched via ${weaponKey})`);
        });
    }

    function loadExternalScript() {
        const script = document.createElement('script');
        script.src = 'dead_frontier_weapons.js';
        script.onload = () => {
            console.log('[DPS] External JSON script loaded');
            loadDPS();
        };
        script.onerror = () => {
            console.error('[DPS] Failed to load external JSON script');
        };
        document.head.appendChild(script);
    }

    loadExternalScript();
})();