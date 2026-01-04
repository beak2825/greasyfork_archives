// ==UserScript==
// @name         LetzAI Advanced Settings
// @namespace    https://x.com/SavitarStorm
// @version      2.5
// @description  Advanced Settings & Model Management for Letz.ai, with the final working auto-selection.
// @author       @SavitarStorm @Tano
// @match        https://letz.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535839/LetzAI%20Advanced%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/535839/LetzAI%20Advanced%20Settings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SCRIPT-WIDE CONSTANTS ---
    const MY_MODELS_STORAGE_KEY = 'myCustomLetzAIModelsList';
    const SETTINGS_CONTAINER_SELECTOR = 'div.wrapgenerationsettings';
    const PROMPT_FORM_SELECTOR = '.outerwrapprompt form';
    const MODELS_BUTTONS_CONTAINER_ID = 'myCustomModelsButtonsContainer';

    // --- UTILITY FUNCTIONS ---
    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
    }

    function dispatchEvents(element, events = ['input', 'change']) {
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            element.dispatchEvent(event);
        });
    }

    // ===================================================================
    // FEATURE 1: ADVANCED SETTINGS & MODEL MANAGEMENT
    // ===================================================================

    let savedModels = [];

    function loadModels() {
        const modelsJson = GM_getValue(MY_MODELS_STORAGE_KEY, '[]');
        try { savedModels = JSON.parse(modelsJson); } catch (e) { savedModels = []; }
    }

    function saveModels() {
        GM_setValue(MY_MODELS_STORAGE_KEY, JSON.stringify(savedModels));
    }

    function addModelToList(modelString) {
        if (modelString && !savedModels.includes(modelString)) {
            savedModels.push(modelString);
            saveModels();
            renderModelButtons();
            return true;
        }
        return false;
    }

    function removeModelFromList(modelString) {
        savedModels = savedModels.filter(m => m !== modelString);
        saveModels();
        renderModelButtons();
    }

    function addDimensionButtons(settingsContainer) {
        if (document.getElementById('myCustomDimensionButtonsContainer')) return;
        const dimensionsHeader = Array.from(settingsContainer.querySelectorAll('h4')).find(h => h.textContent.trim() === 'Dimensions');
        if (!dimensionsHeader) return;
        const dimensionsBlock = dimensionsHeader.parentElement;
        const customDimensions = [
            { label: '3:4', width: 1440, height: 1920 }, { label: '4:3', width: 1920, height: 1440 },
            { label: '9:16', width: 1080, height: 1920 }, { label: '16:9', width: 1920, height: 1080 },
            { label: '1:1', width: 1920, height: 1920 }, { label: '4:5', width: 1536, height: 1920 },
        ];
        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'myCustomDimensionButtonsContainer';
        buttonsContainer.style.cssText = 'margin-top: 10px; display: flex; flex-wrap: wrap;';
        customDimensions.forEach(dim => {
            const button = document.createElement('div');
            button.className = 'stdbuttonsmall';
            button.textContent = dim.label;
            button.style.cssText = 'margin-right: 5px; margin-bottom: 5px; cursor: pointer;';
            button.addEventListener('click', () => updateDimensions(dim.width, dim.height));
            buttonsContainer.appendChild(button);
        });
        dimensionsBlock.appendChild(buttonsContainer);
    }

    function updateDimensions(width, height) {
        const inputs = {
            widthNumber: document.getElementById('width-number'), heightNumber: document.getElementById('height-number'),
            widthSlider: document.getElementById('width-slider'), heightSlider: document.getElementById('height-slider'),
        };
        if (Object.values(inputs).every(el => el)) {
            setNativeValue(inputs.widthNumber, width.toString()); dispatchEvents(inputs.widthNumber);
            setNativeValue(inputs.heightNumber, height.toString()); dispatchEvents(inputs.heightNumber);
            setNativeValue(inputs.widthSlider, width.toString()); dispatchEvents(inputs.widthSlider);
            setNativeValue(inputs.heightSlider, height.toString()); dispatchEvents(inputs.heightSlider, ['change', 'input']);
        }
    }

    function renderModelButtons() {
        const promptForm = document.querySelector(PROMPT_FORM_SELECTOR);
        if (!promptForm) return;

        let oldContainer = document.getElementById(MODELS_BUTTONS_CONTAINER_ID);
        if (oldContainer) oldContainer.remove();

        const container = document.createElement('div');
        container.id = MODELS_BUTTONS_CONTAINER_ID;
        container.style.cssText = 'width: 100%; margin-top: 10px; display: flex; flex-wrap: wrap; justify-content: center;';

        const mentionInputMain = promptForm.querySelector('#mentionInput-main');
        if (mentionInputMain) {
            mentionInputMain.appendChild(container);
        } else { return; }

        if (savedModels.length === 0) {
            container.innerHTML = '<p style="font-size: 12px; color: grey; width: 100%; margin: 0; text-align: center;">No saved models. Use the management section in settings.</p>';
            return;
        }

        savedModels.forEach(model => {
            const buttonWrapper = document.createElement('div');
            buttonWrapper.style.cssText = 'display: flex; align-items: center; margin: 0 5px 5px 0;';
            buttonWrapper.innerHTML = `
                <div class="stdbuttonsmall" style="cursor: pointer;" title="Insert model">${model}</div>
                <span class="remove-model" style="cursor: pointer; margin-left: 4px; font-size: 10px;" title="Remove model">❌</span>
            `;
            buttonWrapper.querySelector('.stdbuttonsmall').addEventListener('click', () => insertModelIntoPrompt(model));
            buttonWrapper.querySelector('.remove-model').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Delete model "${model}"?`)) removeModelFromList(model);
            });
            container.appendChild(buttonWrapper);
        });
    }

    async function insertModelIntoPrompt(modelString) {
        const generateForm = document.querySelector(PROMPT_FORM_SELECTOR);
        if (!generateForm) return;

        const textArea = generateForm.querySelector('#TextArea');
        if (!textArea) return;

        const currentText = textArea.value;
        const textToInsert = (currentText.length > 0 && !/\s$/.test(currentText)) ? ' ' + modelString : modelString;
        const newText = currentText + textToInsert;
        setNativeValue(textArea, newText);

        textArea.focus();
        dispatchEvents(textArea, ['click', 'keydown', 'keypress', 'input', 'keyup', 'change']);

        await new Promise(resolve => setTimeout(resolve, 250));

        const modelNameOnly = modelString.startsWith('@') ? modelString.substring(1) : modelString;
        let targetClickElement = null;

        for (let i = 0; i < 20; i++) { // Try for 2 seconds
            const suggestionContainers = document.querySelectorAll('.autopromptline');
            for (const container of suggestionContainers) {
                const nameElement = container.querySelector('.modeltexts .normalfont');
                if (nameElement && nameElement.textContent.trim().toLowerCase() === modelNameOnly.toLowerCase()) {
                    targetClickElement = nameElement;
                    break;
                }
            }

            if (targetClickElement) break; // If found, break the loop
            await new Promise(resolve => setTimeout(resolve, 100)); // If not, wait some more
        }

        // 5. Click
        if (targetClickElement) {
            console.log(`LetzAI Script: Found and clicking suggestion for "${modelString}"`, targetClickElement);
            targetClickElement.click();
        } else {
            console.warn(`LetzAI Script: Could not find suggestion for "${modelString}" to click. The suggestion list might not have appeared.`);
        }
    }


    function addModelManagementSection(settingsContainer) {
        if (document.getElementById('myModelManagementSectionAdded')) return;
        const modelSectionDiv = document.createElement('div');
        modelSectionDiv.id = 'myModelManagementSectionAdded';
        modelSectionDiv.style.cssText = 'margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--bordercolor, #444);';
        modelSectionDiv.classList.add('left');
        modelSectionDiv.innerHTML = `
            <h4>Model Management</h4>
            <div id="addModelBtn" class="stdbuttonsmall" style="cursor: pointer; display: inline-block;">Add Model to List</div>
        `;
        modelSectionDiv.querySelector('#addModelBtn').addEventListener('click', () => {
            const modelStringInput = prompt('Enter model name (e.g., @fix):');
            if (modelStringInput?.trim()) {
                if (addModelToList(modelStringInput.trim())) alert(`Model "${modelStringInput.trim()}" added.`);
                else alert(`Model "${modelStringInput.trim()}" is already in the list.`);
            }
        });
        settingsContainer.appendChild(modelSectionDiv);
    }

    function runAllFeatures() {
        const settingsContainer = document.querySelector(SETTINGS_CONTAINER_SELECTOR);
        const promptForm = document.querySelector(PROMPT_FORM_SELECTOR);

        if (settingsContainer) {
            addDimensionButtons(settingsContainer);
            addModelManagementSection(settingsContainer);
        }

        if (promptForm && !document.getElementById(MODELS_BUTTONS_CONTAINER_ID)) {
            renderModelButtons();
        }

        const modelsContainer = document.getElementById(MODELS_BUTTONS_CONTAINER_ID);
        if (modelsContainer) {
            const generateTabButton = Array.from(document.querySelectorAll('.wraptabbuttons button span')).find(span => span.textContent.trim() === 'Generate')?.parentElement;
            const isGenerateTabActive = generateTabButton && generateTabButton.classList.contains('active');
            modelsContainer.style.display = isGenerateTabActive ? 'flex' : 'none';
        }
    }

    function observeDOM() {
        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            runAllFeatures();

            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(runAllFeatures, 250);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- SCRIPT START ---
    loadModels();
    setTimeout(runAllFeatures, 1000);
    observeDOM();

})();