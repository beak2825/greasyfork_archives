// ==UserScript==
// @name         X.com Verified Accounts Customizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Customize the appearance of verified accounts on X.com with adjustable settings
// @author       dursunator
// @match        *://*.x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/534944/Xcom%20Verified%20Accounts%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/534944/Xcom%20Verified%20Accounts%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultSettings = {
        opacity: 0.5,
        zoom: 0.75,
        enabled: true
    };

    let settings = GM_getValue('verifiedAccountSettings', defaultSettings);

    applySettings();

    GM_registerMenuCommand('Edit Settings', showSettingsPanel);

    function applySettings() {
        const oldStyle = document.getElementById('x-verified-customizer');
        if (oldStyle) {
            oldStyle.remove();
        }

        if (!settings.enabled) return;

        const styleElement = document.createElement('style');
        styleElement.id = 'x-verified-customizer';
        styleElement.innerHTML = `
            article[data-testid="tweet"]:has([data-testid="icon-verified"]) {
                opacity: ${settings.opacity};
                zoom: ${settings.zoom};
            }
        `;
        document.querySelector("head").appendChild(styleElement);
    }

    function showSettingsPanel() {
        if (document.getElementById('x-settings-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'x-settings-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #15202B;
            color: #E7E9EA;
            border-radius: 12px;
            padding: 24px;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(0,0,0,0.7);
            min-width: 320px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        `;

        const heading = document.createElement('h2');
        heading.textContent = 'Verified Account Settings';
        heading.style.cssText = `
            margin-top: 0;
            color: #1D9BF0;
            border-bottom: 1px solid #38444D;
            padding-bottom: 12px;
            font-size: 20px;
        `;
        panel.appendChild(heading);

        const enabledDiv = document.createElement('div');
        enabledDiv.style.margin = '16px 0';
        enabledDiv.style.display = 'flex';
        enabledDiv.style.alignItems = 'center';
        enabledDiv.style.justifyContent = 'space-between';

        const enabledLabel = document.createElement('label');
        enabledLabel.textContent = 'Enable Feature: ';
        enabledLabel.style.fontWeight = '500';

        const enabledCheckbox = document.createElement('input');
        enabledCheckbox.type = 'checkbox';
        enabledCheckbox.checked = settings.enabled;
        enabledCheckbox.id = 'x-enabled';
        enabledCheckbox.style.transform = 'scale(1.2)';
        enabledCheckbox.style.accentColor = '#1D9BF0';

        enabledDiv.appendChild(enabledLabel);
        enabledDiv.appendChild(enabledCheckbox);
        panel.appendChild(enabledDiv);

        const opacityDiv = document.createElement('div');
        opacityDiv.style.margin = '16px 0';

        const opacityLabel = document.createElement('label');
        opacityLabel.textContent = 'Opacity (0.1 - 1.0): ';
        opacityLabel.style.display = 'block';
        opacityLabel.style.marginBottom = '8px';
        opacityLabel.style.fontWeight = '500';

        const opacitySliderContainer = document.createElement('div');
        opacitySliderContainer.style.display = 'flex';
        opacitySliderContainer.style.alignItems = 'center';

        const opacityInput = document.createElement('input');
        opacityInput.type = 'range';
        opacityInput.min = '0.1';
        opacityInput.max = '1.0';
        opacityInput.step = '0.1';
        opacityInput.value = settings.opacity;
        opacityInput.id = 'x-opacity';
        opacityInput.style.flex = '1';
        opacityInput.style.accentColor = '#1D9BF0';

        const opacityValue = document.createElement('span');
        opacityValue.textContent = settings.opacity;
        opacityValue.style.marginLeft = '10px';
        opacityValue.style.backgroundColor = '#253341';
        opacityValue.style.padding = '4px 8px';
        opacityValue.style.borderRadius = '4px';
        opacityValue.style.minWidth = '36px';
        opacityValue.style.textAlign = 'center';

        opacityInput.addEventListener('input', () => {
            opacityValue.textContent = opacityInput.value;
        });

        opacitySliderContainer.appendChild(opacityInput);
        opacitySliderContainer.appendChild(opacityValue);

        opacityDiv.appendChild(opacityLabel);
        opacityDiv.appendChild(opacitySliderContainer);
        panel.appendChild(opacityDiv);

        const zoomDiv = document.createElement('div');
        zoomDiv.style.margin = '16px 0';

        const zoomLabel = document.createElement('label');
        zoomLabel.textContent = 'Size Ratio (0.5 - 1.0): ';
        zoomLabel.style.display = 'block';
        zoomLabel.style.marginBottom = '8px';
        zoomLabel.style.fontWeight = '500';

        const zoomSliderContainer = document.createElement('div');
        zoomSliderContainer.style.display = 'flex';
        zoomSliderContainer.style.alignItems = 'center';

        const zoomInput = document.createElement('input');
        zoomInput.type = 'range';
        zoomInput.min = '0.5';
        zoomInput.max = '1.0';
        zoomInput.step = '0.05';
        zoomInput.value = settings.zoom;
        zoomInput.id = 'x-zoom';
        zoomInput.style.flex = '1';
        zoomInput.style.accentColor = '#1D9BF0';

        const zoomValue = document.createElement('span');
        zoomValue.textContent = settings.zoom;
        zoomValue.style.marginLeft = '10px';
        zoomValue.style.backgroundColor = '#253341';
        zoomValue.style.padding = '4px 8px';
        zoomValue.style.borderRadius = '4px';
        zoomValue.style.minWidth = '36px';
        zoomValue.style.textAlign = 'center';

        zoomInput.addEventListener('input', () => {
            zoomValue.textContent = zoomInput.value;
        });

        zoomSliderContainer.appendChild(zoomInput);
        zoomSliderContainer.appendChild(zoomValue);

        zoomDiv.appendChild(zoomLabel);
        zoomDiv.appendChild(zoomSliderContainer);
        panel.appendChild(zoomDiv);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
        `;

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.cssText = `
            background-color: #1D9BF0;
            color: white;
            border: none;
            padding: 10px 18px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        `;
        saveButton.addEventListener('mouseover', () => {
            saveButton.style.backgroundColor = '#1A8CD8';
        });
        saveButton.addEventListener('mouseout', () => {
            saveButton.style.backgroundColor = '#1D9BF0';
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.cssText = `
            background-color: #273340;
            color: #E7E9EA;
            border: none;
            padding: 10px 18px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        `;
        cancelButton.addEventListener('mouseover', () => {
            cancelButton.style.backgroundColor = '#323F4D';
        });
        cancelButton.addEventListener('mouseout', () => {
            cancelButton.style.backgroundColor = '#273340';
        });

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.cssText = `
            background-color: #F4212E;
            color: white;
            border: none;
            padding: 10px 18px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        `;
        resetButton.addEventListener('mouseover', () => {
            resetButton.style.backgroundColor = '#E0202B';
        });
        resetButton.addEventListener('mouseout', () => {
            resetButton.style.backgroundColor = '#F4212E';
        });

        buttonsDiv.appendChild(resetButton);
        buttonsDiv.appendChild(cancelButton);
        buttonsDiv.appendChild(saveButton);
        panel.appendChild(buttonsDiv);

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.7);
            z-index: 9999;
        `;

        saveButton.addEventListener('click', () => {
            settings = {
                opacity: parseFloat(opacityInput.value),
                zoom: parseFloat(zoomInput.value),
                enabled: enabledCheckbox.checked
            };

            GM_setValue('verifiedAccountSettings', settings);
            applySettings();

            overlay.remove();
            panel.remove();
        });

        cancelButton.addEventListener('click', () => {
            overlay.remove();
            panel.remove();
        });

        resetButton.addEventListener('click', () => {
            opacityInput.value = defaultSettings.opacity;
            opacityValue.textContent = defaultSettings.opacity;

            zoomInput.value = defaultSettings.zoom;
            zoomValue.textContent = defaultSettings.zoom;

            enabledCheckbox.checked = defaultSettings.enabled;
        });

        document.body.appendChild(overlay);
        document.body.appendChild(panel);
    }

    const observer = new MutationObserver(() => {
        applySettings();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();