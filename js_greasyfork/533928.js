// ==UserScript==
// @name         Manarion Inventory Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Highlights Manarion items matching your preferences. Settings are saved locally and applied in real time. Most of the code was written with AI assistance. We decline any responsibility for incorrect information or misuse.
// @author       anfneub
// @match        https://manarion.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533928/Manarion%20Inventory%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/533928/Manarion%20Inventory%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Manarion Highlighter script loaded!');

    function addHighlightSettingsButton() {
        // Find the nav bar top container
        const navBar = document.querySelector('nav .flex.items-center.px-4.py-2');
        if (!navBar) return;

        // Find the logo span
        const logoSpan = navBar.querySelector('span.small-caps');
        if (!logoSpan) return;

        // Get the logo's parent div
        const logoDiv = logoSpan.parentElement;
        // Prevent duplicate button
        if (navBar.querySelector('#manarion-highlight-settings-btn')) return;

        // Create the settings button
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'manarion-highlight-settings-btn';
        settingsBtn.textContent = 'Highlight Settings';
        settingsBtn.style.marginLeft = '12px';
        settingsBtn.style.padding = '4px 10px';
        settingsBtn.style.fontSize = '1rem';
        settingsBtn.style.borderRadius = '6px';
        settingsBtn.style.border = '1px solid #703fe2';
        settingsBtn.style.background = '#000';
        settingsBtn.style.color = '#703fe2';
        settingsBtn.style.zIndex = '10000';
        settingsBtn.style.cursor = 'pointer';
        settingsBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)';
        settingsBtn.style.transition = 'background 0.2s, color 0.2s, border 0.2s';
        settingsBtn.style.minWidth = '180px';
        settingsBtn.style.whiteSpace = 'nowrap';
        settingsBtn.addEventListener('mouseenter', () => {
            settingsBtn.style.background = '#222';
            settingsBtn.style.color = '#fff';
            settingsBtn.style.border = '1px solid #fff';
        });
        settingsBtn.addEventListener('mouseleave', () => {
            settingsBtn.style.background = '#000';
            settingsBtn.style.color = '#703fe2';
            settingsBtn.style.border = '1px solid #703fe2';
        });

        // Insert the button right after the logoDiv
        logoDiv.insertAdjacentElement('afterend', settingsBtn);

        // Create the modal
        const modal = document.createElement('div');
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.7)';
        modal.style.zIndex = '9999';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.innerHTML = `
            <div style="background: #000; padding: 24px 32px; border-radius: 10px; min-width: 320px; min-height: 120px; box-shadow: 0 2px 16px rgba(0,0,0,0.18); position: relative; border: 2px solid #703fe2; color: #703fe2;">
                <button id=\"manarion-highlight-close\" style=\"position: absolute; top: 8px; right: 12px; background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #703fe2;\">&times;</button>
                <h2 style=\"margin-top:0; color: #703fe2;\">Highlight Settings</h2>
                <div id=\"manarion-highlight-settings-content\" style=\"color: #703fe2;\">
                    <div style=\"margin-bottom: 18px;\">
                        <label style=\"display:block; margin-bottom: 6px; color: #703fe2; font-weight: bold;\">Specializations:</label>
                        <div style=\"display: flex; gap: 18px;\">
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"specialization\" value=\"Battling\" style=\"accent-color: #703fe2;\">Battling</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"specialization\" value=\"Mining\" style=\"accent-color: #703fe2;\">Mining</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"specialization\" value=\"Fishing\" style=\"accent-color: #703fe2;\">Fishing</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"specialization\" value=\"Woodcutting\" style=\"accent-color: #703fe2;\">Woodcutting</label>
                        </div>
                    </div>
                    <div style=\"margin-bottom: 18px;\">
                        <label style=\"display:block; margin-bottom: 6px; color: #703fe2; font-weight: bold;\">Item Types:</label>
                        <div style=\"margin-bottom: 8px; display: flex; gap: 12px;\">
                            <button type=\"button\" id=\"select-all-types\" style=\"background: none; border: 1px solid #703fe2; color: #703fe2; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-size: 0.95em;\">Select All</button>
                            <button type=\"button\" id=\"unselect-all-types\" style=\"background: none; border: 1px solid #703fe2; color: #703fe2; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-size: 0.95em;\">Unselect All</button>
                        </div>
                        <div id=\"item-type-checkboxes\" style=\"display: flex; flex-wrap: wrap; gap: 14px;\">
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"itemtype\" value=\"Weapon\" style=\"accent-color: #703fe2;\" checked>Weapon</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"itemtype\" value=\"Head\" style=\"accent-color: #703fe2;\" checked>Head</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"itemtype\" value=\"Neck\" style=\"accent-color: #703fe2;\" checked>Neck</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"itemtype\" value=\"Back\" style=\"accent-color: #703fe2;\" checked>Back</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"itemtype\" value=\"Chest\" style=\"accent-color: #703fe2;\" checked>Chest</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"itemtype\" value=\"Hands\" style=\"accent-color: #703fe2;\" checked>Hands</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"itemtype\" value=\"Feet\" style=\"accent-color: #703fe2;\" checked>Feet</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"itemtype\" value=\"Ring\" style=\"accent-color: #703fe2;\" checked>Ring</label>
                        </div>
                    </div>
                    <div style=\"margin-bottom: 18px;\">
                        <label style=\"display:block; margin-bottom: 6px; color: #703fe2; font-weight: bold;\">Rarity:</label>
                        <div style=\"margin-bottom: 8px; display: flex; gap: 12px;\">
                            <button type=\"button\" id=\"select-all-rarity\" style=\"background: none; border: 1px solid #703fe2; color: #703fe2; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-size: 0.95em;\">Select All</button>
                            <button type=\"button\" id=\"unselect-all-rarity\" style=\"background: none; border: 1px solid #703fe2; color: #703fe2; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-size: 0.95em;\">Unselect All</button>
                        </div>
                        <div id=\"rarity-checkboxes\" style=\"display: flex; flex-wrap: wrap; gap: 14px;\">
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"rarity\" value=\"Common\" style=\"accent-color: #703fe2;\" checked>Common</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"rarity\" value=\"Uncommon\" style=\"accent-color: #703fe2;\" checked>Uncommon</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"rarity\" value=\"Rare\" style=\"accent-color: #703fe2;\" checked>Rare</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"rarity\" value=\"Epic\" style=\"accent-color: #703fe2;\" checked>Epic</label>
                            <label style=\"display: flex; align-items: center; gap: 4px;\"><input type=\"checkbox\" name=\"rarity\" value=\"Legendary\" style=\"accent-color: #703fe2;\" checked>Legendary</label>
                        </div>
                    </div>
                    <div style=\"margin-bottom: 18px;\">
                        <label style=\"display:block; margin-bottom: 6px; color: #703fe2; font-weight: bold;\">Level Range:</label>
                        <div style=\"display: flex; gap: 24px; align-items: center;\">
                            <div style=\"display: flex; align-items: center; gap: 6px;\">
                                <span style=\"font-size: 0.95em;\">Min</span>
                                <button type=\"button\" class=\"level-minus\" data-target=\"min\" style=\"background: none; border: 1px solid #703fe2; color: #703fe2; border-radius: 4px; padding: 0 6px; cursor: pointer; font-size: 1em;\">-</button>
                                <input id=\"level-min\" type=\"number\" min=\"1\" value=\"1\" style=\"width: 56px; background: #000; color: #703fe2; border: 1px solid #703fe2; border-radius: 4px; text-align: center; font-size: 1em;\">
                                <button type=\"button\" class=\"level-plus\" data-target=\"min\" style=\"background: none; border: 1px solid #703fe2; color: #703fe2; border-radius: 4px; padding: 0 6px; cursor: pointer; font-size: 1em;\">+</button>
                            </div>
                            <div style=\"display: flex; align-items: center; gap: 6px;\">
                                <span style=\"font-size: 0.95em;\">Max</span>
                                <button type=\"button\" class=\"level-minus\" data-target=\"max\" style=\"background: none; border: 1px solid #703fe2; color: #703fe2; border-radius: 4px; padding: 0 6px; cursor: pointer; font-size: 1em;\">-</button>
                                <input id=\"level-max\" type=\"number\" min=\"1\" value=\"100\" style=\"width: 56px; background: #000; color: #703fe2; border: 1px solid #703fe2; border-radius: 4px; text-align: center; font-size: 1em;\">
                                <button type=\"button\" class=\"level-plus\" data-target=\"max\" style=\"background: none; border: 1px solid #703fe2; color: #703fe2; border-radius: 4px; padding: 0 6px; cursor: pointer; font-size: 1em;\">+</button>
                            </div>
                        </div>
                    </div>
                    <div style=\"text-align: right;\">
                        <button id=\"manarion-highlight-save\" style=\"background: #703fe2; color: #fff; border: none; border-radius: 6px; padding: 6px 18px; font-size: 1em; cursor: pointer; margin-top: 10px;\">Save Preferences</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Show modal on button click
        settingsBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            // Load preferences when opening modal
            loadUserPreferences();
        });
        // Hide modal on close button click
        modal.querySelector('#manarion-highlight-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        // Hide modal when clicking outside the modal content
        modal.addEventListener('mousedown', (e) => {
            const modalContent = modal.querySelector('div');
            if (e.target === modal && !modalContent.contains(e.target)) {
                modal.style.display = 'none';
            }
        });

        // Add logic for select all/unselect all item types
        modal.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'select-all-types') {
                modal.querySelectorAll('input[name="itemtype"]').forEach(cb => cb.checked = true);
            } else if (e.target && e.target.id === 'unselect-all-types') {
                modal.querySelectorAll('input[name="itemtype"]').forEach(cb => cb.checked = false);
            }
            // Rarity select all/unselect all
            if (e.target && e.target.id === 'select-all-rarity') {
                modal.querySelectorAll('input[name="rarity"]').forEach(cb => cb.checked = true);
            } else if (e.target && e.target.id === 'unselect-all-rarity') {
                modal.querySelectorAll('input[name="rarity"]').forEach(cb => cb.checked = false);
            }
            // Level +1/-1 buttons
            if (e.target && e.target.classList.contains('level-plus')) {
                const target = e.target.getAttribute('data-target');
                const input = modal.querySelector(`#level-${target}`);
                if (input) {
                    input.value = Math.max(1, parseInt(input.value, 10) + 10);
                }
            } else if (e.target && e.target.classList.contains('level-minus')) {
                const target = e.target.getAttribute('data-target');
                const input = modal.querySelector(`#level-${target}`);
                if (input) {
                    input.value = Math.max(1, parseInt(input.value, 10) - 10);
                }
            }
        });
        // Enforce min=1 on wheel and manual input
        ['level-min', 'level-max'].forEach(id => {
            const input = modal.querySelector(`#${id}`);
            if (input) {
                input.addEventListener('input', () => {
                    input.value = Math.max(1, parseInt(input.value, 10) || 1);
                });
                input.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    let delta = e.deltaY < 0 ? 1 : -1;
                    input.value = Math.max(1, parseInt(input.value, 10) + delta);
                });
            }
        });
    }

    // Run immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addHighlightSettingsButton);
    } else {
        addHighlightSettingsButton();
    }

    // --- Highlighting Logic ---
    // Mapping for rarity
    const rarityMap = {
        'Worn': 'Common',
        'Refined': 'Uncommon',
        'Runed': 'Rare',
        'Ascended': 'Epic',
        'Eternal': 'Legendary',
    };
    // Mapping for specialization
    const specializationMap = {
        'Apprentice': 'Battling',
        'Novice': 'Battling',
        'Initiate': 'Battling',
        'Acolyte': 'Battling',
        'Scholar': 'Battling',
        'Adept': 'Battling',
        'Magus': 'Battling',
        'Invoker': 'Battling',
        'Eldritch': 'Battling',
        'Archmage': 'Battling',
        'Celestial': 'Battling',
        'Primordial': 'Battling',
        'Incantator': 'Battling',
        'Thaumaturge': 'Battling',
        'Elysian': 'Battling',
        'Disciple': 'Battling',
        'Neophyte': 'Battling',
        'Prospector': 'Mining',
        'Tidecaller': 'Fishing',
        'Lumberjack': 'Woodcutting',
    };
    // Mapping for item types by specialization
    const itemTypeMap = {
        'Battling': {
            'Weapon': 'Staff', 'Head': 'Hood', 'Neck': 'Pendant', 'Back': 'Cloak', 'Chest': 'Robes', 'Hands': 'Gloves', 'Feet': 'Sandals', 'Ring': 'Ring'
        },
        'Mining': {
            'Weapon': 'Pickaxe', 'Head': 'Helmet', 'Neck': 'Pendant', 'Back': 'Cape', 'Chest': 'Jacket', 'Hands': 'Gloves', 'Feet': 'Boots', 'Ring': 'Ring'
        },
        'Fishing': {
            'Weapon': 'Rod', 'Head': 'Hat', 'Neck': 'Pendant', 'Back': 'Cape', 'Chest': 'Tunic', 'Hands': 'Gloves', 'Feet': 'Boots', 'Ring': 'Ring'
        },
        'Woodcutting': {
            'Weapon': 'Axe', 'Head': 'Hat', 'Neck': 'Pendant', 'Back': 'Cape', 'Chest': 'Tunic', 'Hands': 'Gloves', 'Feet': 'Boots', 'Ring': 'Ring'
        },
    };

    // Helper to get user settings
    function getUserSettings() {
        // Specializations
        const specs = Array.from(document.querySelectorAll('input[name="specialization"]:checked')).map(cb => cb.value);
        // Item types
        const types = Array.from(document.querySelectorAll('input[name="itemtype"]:checked')).map(cb => cb.value);
        // Rarities
        const rarities = Array.from(document.querySelectorAll('input[name="rarity"]:checked')).map(cb => cb.value);
        // Level range
        const minLevel = parseInt(document.getElementById('level-min').value, 10) || 1;
        const maxLevel = parseInt(document.getElementById('level-max').value, 10) || 1;
        return { specs, types, rarities, minLevel, maxLevel };
    }

    // Remove previous highlights
    function removeHighlights() {
        // Remove highlight from all relevant spans, not just those previously highlighted
        document.querySelectorAll('span[data-slot="tooltip-trigger"]').forEach(el => {
            el.classList.remove('manarion-highlighted-item');
            el.style.border = '';
            el.style.borderRadius = '';
            el.style.background = '';
            // Do not reset color, as we want to preserve the original
        });
    }

    function getSavedPreferences() {
        const prefsStr = localStorage.getItem('manarion_highlighter_prefs');
        if (!prefsStr) return null;
        try {
            return JSON.parse(prefsStr);
        } catch (e) {
            return null;
        }
    }

    // Highlight function (now uses saved preferences only)
    function highlightMatchingItems() {
        const prefs = getSavedPreferences();
        if (!prefs) return;
        const { specs, types, rarities, minLevel, maxLevel } = prefs;
        removeHighlights();
        // Only target relevant spans
        const spans = document.querySelectorAll('span[data-slot="tooltip-trigger"]');
        for (const span of spans) {
            const text = span.textContent;
            // Extract content inside brackets
            const bracketMatch = text.match(/\[([^\]]+)\]/);
            if (!bracketMatch) continue;
            const inside = bracketMatch[1];
            // Find rarity (first word)
            const rarityWord = inside.split(' ')[0];
            const rarity = rarityMap[rarityWord];
            if (!rarity) continue;
            // Find specialization by keyword search
            let specialization = null;
            let specKey = null;
            for (const [key, mapped] of Object.entries(specializationMap)) {
                if (inside.includes(key)) {
                    specialization = mapped;
                    specKey = key;
                    break;
                }
            }
            if (!specialization) continue;
            // Find level (number in parentheses at end)
            const levelMatch = inside.match(/\((\d+)\)$/);
            if (!levelMatch) continue;
            const level = parseInt(levelMatch[1], 10);
            // Find item type: last word before the level or +{n}
            let afterSpec = inside.split(specKey)[1] || '';
            afterSpec = afterSpec.replace(/^'s?\s*/, '');
            // Remove the level and +{n} parts
            afterSpec = afterSpec.replace(/\+?\d*\s*\(\d+\)$/, '');
            const itemTypeWord = afterSpec.trim().split(/\s+/).pop().replace(/'s?$/, '');
            let match = false;
            for (const spec of specs) {
                if (specialization !== spec) continue;
                for (const type of types) {
                    // For Battling Weapon, match if 'Staff' is anywhere in the text
                    if (spec === 'Battling' && type === 'Weapon') {
                        if (inside.includes('Staff')) {
                            match = true;
                            break;
                        }
                    } else if (itemTypeMap[spec][type] === itemTypeWord) {
                        match = true;
                        break;
                    }
                }
                if (match) break;
            }
            if (
                match &&
                rarities.includes(rarity) &&
                level >= minLevel &&
                level <= maxLevel
            ) {
                span.classList.add('manarion-highlighted-item');
                span.style.background = '';
                span.style.border = '2px solid rgba(255, 255, 0, 0.7)';
                span.style.borderRadius = '4px';
                span.style.color = '';
            }
        }
    }

    // Add Save Preferences button logic
    function addSettingsListeners() {
        const modal = document.querySelector('div[style*="position: fixed"]');
        if (!modal) return;
        // Remove previous listeners if any
        const saveBtn = document.getElementById('manarion-highlight-save');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                saveUserPreferences();
                highlightMatchingItems();
                modal.style.display = 'none';
            });
        }
    }

    function saveUserPreferences() {
        const specs = Array.from(document.querySelectorAll('input[name="specialization"]')).filter(cb => cb.checked).map(cb => cb.value);
        const types = Array.from(document.querySelectorAll('input[name="itemtype"]')).filter(cb => cb.checked).map(cb => cb.value);
        const rarities = Array.from(document.querySelectorAll('input[name="rarity"]')).filter(cb => cb.checked).map(cb => cb.value);
        const minLevel = parseInt(document.getElementById('level-min').value, 10) || 1;
        const maxLevel = parseInt(document.getElementById('level-max').value, 10) || 1;
        const prefs = { specs, types, rarities, minLevel, maxLevel };
        localStorage.setItem('manarion_highlighter_prefs', JSON.stringify(prefs));
    }

    function loadUserPreferences() {
        const prefsStr = localStorage.getItem('manarion_highlighter_prefs');
        if (!prefsStr) return;
        try {
            const prefs = JSON.parse(prefsStr);
            // Specializations
            document.querySelectorAll('input[name="specialization"]').forEach(cb => {
                cb.checked = prefs.specs.includes(cb.value);
            });
            // Item types
            document.querySelectorAll('input[name="itemtype"]').forEach(cb => {
                cb.checked = prefs.types.includes(cb.value);
            });
            // Rarities
            document.querySelectorAll('input[name="rarity"]').forEach(cb => {
                cb.checked = prefs.rarities.includes(cb.value);
            });
            // Level range
            document.getElementById('level-min').value = prefs.minLevel;
            document.getElementById('level-max').value = prefs.maxLevel;
        } catch (e) {
            // Ignore errors
        }
    }

    // Initial highlight after DOM is ready (optional: comment out to require first save)
    window.addEventListener('load', () => {
        addSettingsListeners();
        // Load preferences and apply highlight on page load
        setTimeout(() => {
            loadUserPreferences();
            highlightMatchingItems();
        }, 0);
        // Highlight new objects every second
        setInterval(() => {
            highlightMatchingItems();
        }, 1000);
    });
})(); 
