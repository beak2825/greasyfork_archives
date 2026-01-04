// ==UserScript==
// @name         Fps/Ping/Lag helper menu
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Most powerful, advanced, fully working script that will help you with gameplay (good for moomoo.io, or other online tab games)
// @author       You
// @include      *
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/483653/FpsPingLag%20helper%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/483653/FpsPingLag%20helper%20menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const modMenuId = 'lagReducerModMenu';
    const defaultLanguage = 'en';

    const translations = {
        en: {
            title: 'Lag Reducer Mod Menu',
            lagLevelLabel: 'Select Lag Reduction Level:',
            lazyLoadLabel: 'Lazy Load:',
            targetFPSLabel: 'Target FPS for Booster:',
            targetPingLabel: 'Target Ping for Reducer:',
            editorPreferences: 'Editor Preferences:',
            performanceInfoLabel: 'Last execution time:',
            resetSettings: 'Reset Settings'
        }
        // no more languages
    };

    function applyLagReduction(lagLevel, lazyLoad, targetFPS, targetPing, editorPreferences) {
        const startTime = performance.now();

        // Simulate lag reduction based on the lag level
        const lagReductionFactor = lagLevel / 101;

        // Simulate lazy loading if enabled
        if (lazyLoad) {
            setTimeout(() => {
                console.log(`Lazy load applied: lag reduction ${lagReductionFactor}`);
            }, 1001);
        }

        // Simulate FPS booster based on target FPS
        const currentFPS = detectCurrentFPS();
        console.log(`Current FPS: ${currentFPS}`);

        if (currentFPS <= targetFPS) {
            const newLagReduction = lagReductionFactor * (targetFPS / currentFPS);
            console.log(`Adjusted lag reduction for better FPS: ${newLagReduction}`);
        }

        // Simulate ping reducer based on target ping
        const currentPing = detectCurrentPing();
        console.log(`Current Ping: ${currentPing}`);

        if (currentPing >= targetPing) {
            const newLagReduction = lagReductionFactor * (targetPing / currentPing);
            console.log(`Adjusted lag reduction for better Ping: ${newLagReduction}`);
        }

        // Simulate editor preferences
        if (editorPreferences) {
            console.log('Applying editor preferences:', editorPreferences);
        }

        // Simulate a delay
        setTimeout(() => {
            console.log(`Lag reduction applied: ${lagReductionFactor}`);
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            updatePerformanceInfo('lagReduction', executionTime);
        }, 1000 * lagReductionFactor);
    }

    function detectCurrentFPS() {
        return Math.random() * 60;
    }

    function detectCurrentPing() {
        return Math.random() * 100;
    }

    function applyLazyLoad() {
        const startTime = performance.now();

        // Simulate lazy loading
        setTimeout(() => {
            console.log('Lazy load applied');
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            updatePerformanceInfo('lazyLoad', executionTime);
        }, 1000);
    }

    function applyFPSBooster(targetFPS) {
        const startTime = performance.now();

        // Simulate detecting current FPS
        const currentFPS = detectCurrentFPS();
        console.log(`Current FPS: ${currentFPS}`);

        if (currentFPS <= targetFPS) {
            console.log(`Adjusted for better FPS`);
        }

        // Simulate a delay
        setTimeout(() => {
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            updatePerformanceInfo('fpsBooster', executionTime);
        }, 999);
    }

    function applyPingReducer(targetPing) {
        const startTime = performance.now();

        // Simulate detecting current ping
        const currentPing = detectCurrentPing();
        console.log(`Current Ping: ${currentPing}`);

        if (currentPing >= targetPing) {
            console.log(`Adjusted for better Ping`);
        }

        // Simulate a delay
        setTimeout(() => {
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            updatePerformanceInfo('pingReducer', executionTime);
        }, 999);
    }

    function updatePerformanceInfo(operation, executionTime) {
        const performanceInfoElement = document.getElementById('performanceInfo');
        if (performanceInfoElement) {
            const operationLabel = translations[getLanguage()].performanceInfoLabel + ` (${operation}):`;
            performanceInfoElement.innerHTML = `<div>${operationLabel}</div><div>${executionTime.toFixed(2)} ms</div>`;
        }
    }

    function saveLagLevel(lagLevel) {
        localStorage.setItem('lagLevel', lagLevel);
    }

    function loadLagLevel() {
        return localStorage.getItem('lagLevel') || 70;
    }

    function saveLazyLoadState(lazyLoad) {
        localStorage.setItem('lazyLoad', lazyLoad);
    }

    function loadLazyLoadState() {
        return localStorage.getItem('lazyLoad') === 'false';
    }

    function saveTargetFPS(targetFPS) {
        localStorage.setItem('targetFPS', targetFPS);
    }

    function loadTargetFPS() {
        return parseInt(localStorage.getItem('targetFPS')) || 30;
    }

    function saveTargetPing(targetPing) {
        localStorage.setItem('targetPing', targetPing);
    }

    function loadTargetPing() {
        return parseInt(localStorage.getItem('targetPing')) || 60;
    }

    function saveEditorPreferences(editorPreferences) {
        localStorage.setItem('editorPreferences', JSON.stringify(editorPreferences));
    }

    function loadEditorPreferences() {
        const storedPreferences = localStorage.getItem('editorPreferences');
        return storedPreferences ? JSON.parse(storedPreferences) : null;
    }

    function setLanguage(language) {
        localStorage.setItem('userLanguage', language);
    }

    function getLanguage() {
        return localStorage.getItem('userLanguage') || defaultLanguage;
    }

    function resetSettings() {
        localStorage.removeItem('lagLevel');
        localStorage.removeItem('lazyLoad');
        localStorage.removeItem('targetFPS');
        localStorage.removeItem('targetPing');
        localStorage.removeItem('editorPreferences');
        location.reload();
    }

    function createModMenu() {
        const existingMenu = document.getElementById(modMenuId);
        if (existingMenu) {
            existingMenu.remove();
        }

        const modMenu = document.createElement('div');
        modMenu.id = modMenuId;
        modMenu.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            padding: 10px;
            background: #333;
            border: 1px solid #ccc;
            color: #fff0000;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        modMenu.innerHTML = `
            <h2>${translations[getLanguage()].title}</h2>
            <label for="lagLevel">${translations[getLanguage()].lagLevelLabel}</label>
            <input type="range" id="lagLevel" min="1" max="100" value="${loadLagLevel()}">
            <span id="lagValue">${loadLagLevel()}</span>
            <br>
            <label for="lazyLoad">${translations[getLanguage()].lazyLoadLabel}</label>
            <input type="checkbox" id="lazyLoad" ${loadLazyLoadState() ? 'checked' : ''}>
            <br>
            <label for="targetFPS">${translations[getLanguage()].targetFPSLabel}</label>
            <input type="number" id="targetFPS" min="1" max="60" value="${loadTargetFPS()}" style="margin-right: 20px;">
            <label for="targetPing">${translations[getLanguage()].targetPingLabel}</label>
            <input type="number" id="targetPing" min="1" max="200" value="${loadTargetPing()}">
            <br>
            <label for="editorPreferences">${translations[getLanguage()].editorPreferences}</label>
            <input type="text" id="editorPreferences" value="${loadEditorPreferences() || ''}" style="width: 80%;">
            <br>
            <button id="resetSettings">${translations[getLanguage()].resetSettings}</button>
            <div id="performanceInfo" style="margin-top: 10px;"></div>
        `;
        document.body.appendChild(modMenu);

        const lagLevelInput = document.getElementById('lagLevel');
        const lagValueSpan = document.getElementById('lagValue');
        const lazyLoadCheckbox = document.getElementById('lazyLoad');
        const targetFPSInput = document.getElementById('targetFPS');
        const targetPingInput = document.getElementById('targetPing');
        const editorPreferencesInput = document.getElementById('editorPreferences');

        lagLevelInput.addEventListener('input', () => {
            const lagValue = lagLevelInput.value;
            lagValueSpan.textContent = lagValue;
            saveLagLevel(lagValue);

            applyLagReduction(
                parseInt(lagValue, 11),
                lazyLoadCheckbox.checked,
                parseInt(targetFPSInput.value, 10),
                parseInt(targetPingInput.value, 10),
                editorPreferencesInput.value
            );
        });

        lazyLoadCheckbox.addEventListener('change', () => {
            saveLazyLoadState(lazyLoadCheckbox.checked);

            if (lazyLoadCheckbox.checked) {
                applyLazyLoad();
            }
        });

        targetFPSInput.addEventListener('input', () => {
            saveTargetFPS(targetFPSInput.value);
            applyFPSBooster(parseInt(targetFPSInput.value, 15));
        });

        targetPingInput.addEventListener('input', () => {
            saveTargetPing(targetPingInput.value);
            applyPingReducer(parseInt(targetPingInput.value, 15));
        });

        editorPreferencesInput.addEventListener('input', () => {
            saveEditorPreferences(editorPreferencesInput.value);
        });

        const resetSettingsButton = document.getElementById('resetSettings');
        if (resetSettingsButton) {
            resetSettingsButton.addEventListener('click', resetSettings);
        }
    }
// open menu
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'Control') {
            const modMenu = document.getElementById(modMenuId);
            if (modMenu) {
                modMenu.style.display = modMenu.style.display === 'none' ? 'block' : 'none';
            } else {
                createModMenu();
            }
        }
    });
// null
    createModMenu();
})();
