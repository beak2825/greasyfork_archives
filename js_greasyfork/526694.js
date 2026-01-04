// ==UserScript==
// @name         AniList Tier Labels
// @namespace    http://tampermonkey.net/
// @version      2.5.1
// @description  Adds a tier badge next to ratings on AniList.
// @match        *://anilist.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526694/AniList%20Tier%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/526694/AniList%20Tier%20Labels.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** SETTINGS MANAGEMENT ***/
    const defaultSettings = {
        tiers: [
            { min: 95, max: 100,  label: 'S+', color: '#FFD700', textColor: '#000000' },
            { min: 85, max: 94.9, label: 'S',  color: '#ff7f00', textColor: '#FFFFFF' },
            { min: 75, max: 84.9, label: 'A',  color: '#aa00ff', textColor: '#FFFFFF' },
            { min: 65, max: 74.9, label: 'B',  color: '#007fff', textColor: '#FFFFFF' },
            { min: 55, max: 64.9, label: 'C',  color: '#00aa00', textColor: '#FFFFFF' },
            { min: 41, max: 54.9, label: 'D',  color: '#aaaaaa', textColor: '#FFFFFF' },
            { min: 0,  max: 40.9, label: 'F',  color: '#666666', textColor: '#FFFFFF' }
        ],
        enableRatingTextColor: true
    };

    function loadSettings() {
        try {
            const stored = localStorage.getItem('anilistTierLabelsSettings');
            return stored ? Object.assign({}, defaultSettings, JSON.parse(stored)) : defaultSettings;
        } catch {
            return defaultSettings;
        }
    }

    function saveSettings() {
        localStorage.setItem('anilistTierLabelsSettings', JSON.stringify(userSettings));
    }

    let userSettings = loadSettings();

    /*** TIER INDICATOR LOGIC ***/
    function getTier(rating) {
        if (rating === 0) return null; // skip if the score is 0
        return userSettings.tiers.find(tier => rating >= tier.min && rating <= tier.max) || null;
    }

    function createBadge(tier, isBlockView = false) {
        const badge = document.createElement('span');
        badge.textContent = tier.label;
        badge.style.cssText = `
            background-color: ${tier.color};
            color: ${tier.textColor};
            font-size: ${isBlockView ? '10px' : '12px'};
            font-weight: bold;
            padding: ${isBlockView ? '1px 4px' : '2px 6px'};
            border-radius: 4px;
            display: inline-block;
            margin-left: 5px;
            vertical-align: middle;
            white-space: nowrap;
        `;
        return badge;
    }

    function getScoreSystem() {
        const container = document.querySelector('.content.container');
        if (container) {
            if (container.querySelector('.medialist.table.POINT_100')) return 'POINT_100';
            if (container.querySelector('.medialist.table.POINT_10_DECIMAL')) return 'POINT_10';
            if (container.querySelector('.medialist.table.POINT_5')) return 'POINT_5';
        }
        return 'UNKNOWN';
    }

    function normalizeScore(score, scoreSystem, isPercentage = false) {
        const numericScore = parseFloat(score);
        if (isNaN(numericScore)) return null;
        if (isPercentage) {
            return numericScore;
        }
        switch (scoreSystem) {
            case 'POINT_100': return numericScore;
            case 'POINT_10':  return numericScore * 10;
            case 'POINT_5':   return numericScore * 20;
            default:          return numericScore * 10;
        }
    }

    function processScoreElement(el, isPercentage = false, isBlockView = false) {
        if (el.dataset.tierModified) return;
        el.dataset.tierModified = "true";

        const scoreSystem = getScoreSystem();
        let ratingText = el.getAttribute('score') || el.innerText.trim().replace('%', '');
        const normalizedRating = normalizeScore(ratingText, scoreSystem, isPercentage);
        if (normalizedRating === null) return;

        const tier = getTier(normalizedRating);
        if (tier) {
            const container = document.createElement('div');
            container.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 4px;
                ${isBlockView ? 'background-color: rgba(0, 0, 0, 0.5); padding: 2px 6px; border-radius: 4px; overflow: hidden;' : ''}
            `;
            const scoreEl = document.createElement('span');
            scoreEl.textContent = isPercentage ? `${ratingText}%` : ratingText;
            if (userSettings.enableRatingTextColor) {
                scoreEl.style.color = tier.color;
            }
            container.appendChild(scoreEl);
            container.appendChild(createBadge(tier, isBlockView));

            el.textContent = '';
            el.appendChild(container);
        }
    }

    function addTierIndicators() {
        // 1) List view
        document.querySelectorAll('.score:not(.media-card .score)').forEach(el => {
            processScoreElement(el, false, false);
        });
        // 2) Block view (media-card)
        document.querySelectorAll('.entry-card .score').forEach(el => {
            processScoreElement(el, false, true);
        });
        // 3) Average/Mean Score
        document.querySelectorAll('.data-set').forEach(dataSet => {
            const label = dataSet.querySelector('.type');
            const value = dataSet.querySelector('.value');
            if (
                label && value && !value.dataset.tierModified &&
                (label.innerText.includes('Average Score') || label.innerText.includes('Mean Score'))
            ) {
                processScoreElement(value, true, false);
            }
        });
        // 4) Top 100 view
        document.querySelectorAll('.row.score').forEach(row => {
            const percentageEl = row.querySelector('.percentage');
            if (!percentageEl || percentageEl.classList.contains('popularity') || percentageEl.dataset.tierModified) {
                return;
            }
            percentageEl.dataset.tierModified = "true";
            const childNodes = Array.from(percentageEl.childNodes);
            const textNode = childNodes.find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== '');
            if (!textNode) return;
            const ratingText = textNode.textContent.trim().replace('%', '');
            const numericRating = parseFloat(ratingText);
            if (isNaN(numericRating)) return;
            const tier = getTier(numericRating);
            if (!tier) return;

            textNode.remove();
            const ratingWrapper = document.createElement('div');
            ratingWrapper.style.display = 'inline-flex';
            ratingWrapper.style.alignItems = 'center';
            ratingWrapper.style.gap = '6px';

            const textSpan = document.createElement('span');
            textSpan.textContent = numericRating + '%';
            if (userSettings.enableRatingTextColor) {
                textSpan.style.color = tier.color;
            }
            ratingWrapper.appendChild(textSpan);
            ratingWrapper.appendChild(createBadge(tier));
            const popularityEl = percentageEl.querySelector('.sub-row.popularity');
            if (popularityEl) {
                percentageEl.insertBefore(ratingWrapper, popularityEl);
            } else {
                percentageEl.appendChild(ratingWrapper);
            }
        });
    }

    /*** SETTINGS PANEL (APPENDED TO DEVELOPER PAGE) ***/
    function renderTierLabelSettingsInDeveloper() {
        // If already added, skip
        if (document.getElementById('tier-label-settings-container')) return;

        // We'll append to the .content area or a .card area on the developer page
        const devContent = document.querySelector('.content');
        if (!devContent) return;

        const isDark = document.body.classList.contains('site-theme-dark');

        // Container
        const container = document.createElement('div');
        container.id = 'tier-label-settings-container';
        container.style.marginTop = '20px';
        container.style.padding = '16px';
        container.style.border = '1px solid ' + (isDark ? '#151f2e' : '#fff');
        container.style.borderRadius = '6px';
        container.style.backgroundColor = isDark ? '#151f2e' : '#f9f9f9';
        container.style.color = isDark ? '#9cadbd' : '#5c728a';

        // Title
        const title = document.createElement('h3');
        title.textContent = 'AniList Tier Labels Settings';
        container.appendChild(title);

        // Toggle rating text color
        const toggleContainer = document.createElement('div');
        toggleContainer.style.marginBottom = '10px';

        const toggleLabel = document.createElement('label');
        toggleLabel.textContent = 'Enable rating text color: ';
        const toggleCheckbox = document.createElement('input');
        toggleCheckbox.type = 'checkbox';
        toggleCheckbox.checked = userSettings.enableRatingTextColor;
        toggleCheckbox.addEventListener('change', (e) => {
            userSettings.enableRatingTextColor = e.target.checked;
            saveSettings();
            refreshAllScores();
        });
        toggleLabel.appendChild(toggleCheckbox);
        toggleContainer.appendChild(toggleLabel);
        container.appendChild(toggleContainer);

        // Description
        const description = document.createElement('p');
        description.textContent = 'Settings are reset when deleting browsing data (cookies, site settings). Please back-up your settings using the "Export Settings" button at the bottom.';
        description.style.marginTop = '10px';
        description.style.color = isDark ? '#9cadbd' : '#5c728a';
        container.appendChild(description);

        // Tiers section
        const tiersTitle = document.createElement('h4');
        tiersTitle.textContent = 'Tier Ranges & Colors';
        container.appendChild(tiersTitle);

        userSettings.tiers.forEach((tier, index) => {
            container.appendChild(createTierBox(tier, index, isDark));
        });

        // Add tier button
        const addTierButton = document.createElement('button');
        addTierButton.textContent = 'Add Tier';
        addTierButton.style.marginTop = '10px';
        addTierButton.style.color = '#ffffff';
        addTierButton.style.backgroundColor = '#3db4f2';
        addTierButton.style.border = 'none';
        addTierButton.style.padding = '10px';
        addTierButton.style.borderRadius = '4px';
        addTierButton.style.cursor = 'pointer';
        addTierButton.addEventListener('click', () => {
            const newTier = { min: 0, max: 0, label: 'New', color: '#000000', textColor: '#FFFFFF' };
            userSettings.tiers.push(newTier);
            saveSettings();
            container.insertBefore(createTierBox(newTier, userSettings.tiers.length - 1, isDark), addTierButton);
            refreshAllScores();
        });
        container.appendChild(addTierButton);

        // Import/Export buttons
        const importExportContainer = document.createElement('div');
        importExportContainer.style.marginTop = '10px';

        const importButton = document.createElement('button');
        importButton.textContent = 'Import Settings';
        importButton.style.color = '#ffffff';
        importButton.style.backgroundColor = '#3db4f2';
        importButton.style.border = 'none';
        importButton.style.padding = '10px';
        importButton.style.borderRadius = '4px';
        importButton.style.cursor = 'pointer';
        importButton.addEventListener('click', () => {
            const importData = prompt('Paste the settings JSON here:');
            if (importData) {
                try {
                    userSettings = JSON.parse(importData);
                    saveSettings();
                    refreshAllScores();
                    alert('Settings imported successfully.');
                    renderTierLabelSettingsInDeveloper();
                } catch (e) {
                    alert('Invalid JSON data.');
                }
            }
        });
        importExportContainer.appendChild(importButton);

        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export Settings';
        exportButton.style.marginLeft = '10px';
        exportButton.style.color = '#ffffff';
        exportButton.style.backgroundColor = '#3db4f2';
        exportButton.style.border = 'none';
        exportButton.style.padding = '10px';
        exportButton.style.borderRadius = '4px';
        exportButton.style.cursor = 'pointer';
        exportButton.addEventListener('click', () => {
            const exportData = JSON.stringify(userSettings, null, 2);
            prompt('Copy the settings JSON below:', exportData);
        });
        importExportContainer.appendChild(exportButton);

        container.appendChild(importExportContainer);

        devContent.appendChild(container);
    }

    function createTierBox(tier, index, isDark) {
        const tierBox = document.createElement('div');
        tierBox.style.padding = '8px';
        tierBox.style.marginBottom = '10px';
        tierBox.style.border = '1px solid ' + (isDark ? '#546575' : '#ddd');
        tierBox.style.borderRadius = '4px';

        const header = document.createElement('strong');
        header.textContent = `Tier ${index + 1}`;
        header.style.display = 'block';
        header.style.marginBottom = '6px';
        tierBox.appendChild(header);

        // fields: min, max, label, color, textColor
        const fields = [
            { label: 'Min', key: 'min', type: 'number', step: 'any', width: '60px' },
            { label: 'Max', key: 'max', type: 'number', step: 'any', width: '60px' },
            { label: 'Label', key: 'label', type: 'text', width: '60px' },
            { label: 'Badge Color', key: 'color', type: 'color', width: '50px' },
            { label: 'Text Color', key: 'textColor', type: 'color', width: '50px' }
        ];

        fields.forEach(field => {
            const row = document.createElement('div');
            row.style.marginBottom = '6px';

            const lbl = document.createElement('label');
            lbl.textContent = field.label + ': ';

            const input = document.createElement('input');
            input.type = field.type;
            input.value = tier[field.key];
            input.style.width = field.width;
            if (field.type === 'number') {
                input.step = field.step;
            }

            // Dark/Light mode input styling
            if (field.type !== 'checkbox') {
                // For color inputs, you might prefer to keep default
                // But let's also apply a subtle border, text color, etc.
                input.style.backgroundColor = isDark ? '#151f2e' : '#fff';
                input.style.color = isDark ? '#fff' : '#000';
                input.style.border = '1px solid ' + (isDark ? '#555' : '#ccc');
                input.style.borderRadius = '4px';
                input.style.padding = '2px 4px';
            }

            input.addEventListener('change', (e) => {
                let newVal = e.target.value;
                if (field.type === 'number') {
                    newVal = parseFloat(newVal);
                }
                userSettings.tiers[index][field.key] = newVal;
                saveSettings();
                refreshAllScores();
            });

            lbl.appendChild(input);
            row.appendChild(lbl);
            tierBox.appendChild(row);
        });

        // Remove tier button
        const removeTierButton = document.createElement('button');
        removeTierButton.textContent = 'Remove Tier';
        removeTierButton.style.marginTop = '10px';
        removeTierButton.style.color = '#ffffff';
        removeTierButton.style.backgroundColor = '#3db4f2';
        removeTierButton.style.border = 'none';
        removeTierButton.style.padding = '10px';
        removeTierButton.style.borderRadius = '4px';
        removeTierButton.style.cursor = 'pointer';
        removeTierButton.addEventListener('click', () => {
            if (confirm(`Are you sure you want to remove Tier ${index + 1}?`)) {
                userSettings.tiers.splice(index, 1);
                saveSettings();
                window.location.reload();
            }
        });
        tierBox.appendChild(removeTierButton);

        return tierBox;
    }

    function refreshAllScores() {
        // Remove data-tierModified so they get recalculated
        document.querySelectorAll('[data-tierModified]').forEach(el => {
            delete el.dataset.tierModified;
        });
        addTierIndicators();
    }

    /*** INIT SCRIPT & WATCH FOR PAGE CHANGES ***/
    function initializeScript() {
        addTierIndicators();
        const observer = new MutationObserver(() => addTierIndicators());
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    // Show/hide settings panel depending on current page
    function onPageLoadOrNav() {
        // Always do tier indicators
        addTierIndicators();

        // If on developer page, render settings
        if (window.location.pathname.startsWith('/settings/developer')) {
            renderTierLabelSettingsInDeveloper();
        } else {
            // If we leave developer page, remove the container if present
            const old = document.getElementById('tier-label-settings-container');
            if (old) old.remove();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeScript();
            onPageLoadOrNav();
        });
    } else {
        initializeScript();
        onPageLoadOrNav();
    }

    // Handle SPA navigation
    window.addEventListener('popstate', () => {
        setTimeout(onPageLoadOrNav, 100);
    });
    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(history, arguments);
        setTimeout(onPageLoadOrNav, 100);
    };

    // Ensure the settings panel always loads after refresh
    if (window.location.pathname.startsWith('/settings/developer')) {
        setTimeout(renderTierLabelSettingsInDeveloper, 100);
    }
})();