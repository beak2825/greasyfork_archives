// ==UserScript==
// @name         JanitorAI Proxy AutoFill w/ Preset Dropdown
// @namespace    https://janitorai.com/
// @version      1.1
// @description  Injects a preset dropdown and autofills JanitorAI-style proxy forms
// @match        https://janitorai.com/chats/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541892/JanitorAI%20Proxy%20AutoFill%20w%20Preset%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/541892/JanitorAI%20Proxy%20AutoFill%20w%20Preset%20Dropdown.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'user_presets';

    const fireReactInput = (el, value) => {
        const lastValue = el.value;
        el.value = value;

        const tracker = el._valueTracker;
        if (tracker) tracker.setValue(lastValue);

        el.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const getPresets = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const savePresets = (presets) => localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));

    function applyPreset(name) {
        const presets = getPresets();
        const p = presets[name];
        if (!p) return;

        const modelInput = document.querySelector('input[placeholder="model"]');
        const proxyInput = document.querySelector('#proxy-url');
        const keyInput = document.querySelector('#api-key');
        const promptBox = document.querySelector('#custom-prompt');

        if (modelInput) fireReactInput(modelInput, p.model);
        if (proxyInput) fireReactInput(proxyInput, p.proxy);
        if (keyInput) fireReactInput(keyInput, p.key);
        if (promptBox) fireReactInput(promptBox, p.prompt);
    }

    function injectDropdown() {
        if (document.querySelector('#presetDropdown')) return;

        const target = document.querySelector('h3._heading_zf221_7');
        if (!target) return;

        const container = document.createElement('div');
        container.style.margin = '10px 0';

        const label = document.createElement('label');
        label.textContent = '🔥 Preset: ';
        label.style.marginRight = '8px';
        label.style.fontWeight = 'bold';

        const dropdown = document.createElement('select');
        dropdown.id = 'presetDropdown';
        dropdown.style.padding = '5px';
        dropdown.style.borderRadius = '5px';
        dropdown.style.marginRight = '10px';

        const presets = getPresets();
        for (const name in presets) {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            dropdown.appendChild(opt);
        }

        // Load last selected preset
        const saved = localStorage.getItem('custom_preset_choice');
        if (saved && presets[saved]) {
            dropdown.value = saved;
            applyPreset(saved);
        }

        dropdown.addEventListener('change', () => {
            const selected = dropdown.value;
            localStorage.setItem('custom_preset_choice', selected);
            applyPreset(selected);
        });

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '💾 Save Current as Preset';
        saveBtn.style.marginRight = '10px';
        saveBtn.onclick = () => {
            const name = prompt("Enter preset name:");
            if (!name) return;

            const model = document.querySelector('input[placeholder="model"]')?.value || '';
            const proxy = document.querySelector('#proxy-url')?.value || '';
            const key = document.querySelector('#api-key')?.value || '';
            const promptText = document.querySelector('#custom-prompt')?.value || '';

            const newPresets = getPresets();
            newPresets[name] = { model, proxy, key, prompt: promptText };
            savePresets(newPresets);

            // Add to dropdown
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            dropdown.appendChild(opt);
            dropdown.value = name;
            localStorage.setItem('custom_preset_choice', name);
            alert(`Preset "${name}" saved!`);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑 Delete Preset';
        deleteBtn.style.color = 'red';
        deleteBtn.onclick = () => {
            const selected = dropdown.value;
            if (!confirm(`Delete preset "${selected}"?`)) return;

            const newPresets = getPresets();
            delete newPresets[selected];
            savePresets(newPresets);

            dropdown.querySelector(`option[value="${selected}"]`)?.remove();
            dropdown.selectedIndex = 0;
            localStorage.setItem('custom_preset_choice', dropdown.value);
            applyPreset(dropdown.value);
            alert(`Preset "${selected}" deleted.`);
        };

        container.appendChild(label);
        container.appendChild(dropdown);
        container.appendChild(saveBtn);
        container.appendChild(deleteBtn);

        target.parentElement.insertBefore(container, target.nextSibling);
    }

    const observer = new MutationObserver(() => injectDropdown());

    function startObserver() {
        const settingsPanel = document.body;
        if (!settingsPanel) return setTimeout(startObserver, 300);
        observer.observe(settingsPanel, { childList: true, subtree: true });
        injectDropdown();
    }

    startObserver();
})();
