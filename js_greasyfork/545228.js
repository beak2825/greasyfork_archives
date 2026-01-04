// ==UserScript==
// @name         Scratch Headless CSS Bridge
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Allows Scratch projects to control page CSS. Places styles at the end of the body and supports !important override.
// @author       halufun
// @match        https://scratch.mit.edu/projects/*
// @grant        none
// @run-at       document-end
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/545228/Scratch%20Headless%20CSS%20Bridge.user.js
// @updateURL https://update.greasyfork.org/scripts/545228/Scratch%20Headless%20CSS%20Bridge.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[CSS Bridge] Script loaded. Initializing...");

    const styleTagId = 'scratch-headless-css-bridge';
    let vm = null;
    const variableState = new Map();

    /**
     * Finds the Scratch VM instance on the page.
     */
    function findScratchVM(root = window) {
        const seen = new Set();
        const queue = [root];
        while (queue.length) {
            const obj = queue.shift();
            if (!obj || typeof obj !== "object") continue;
            if (seen.has(obj)) continue;
            seen.add(obj);
            if (obj.runtime && Array.isArray(obj.runtime.targets)) return obj;
            for (let k in obj) {
                try { queue.push(obj[k]); } catch {}
            }
        }
        return null;
    }

    /**
     * The main listener loop.
     */
    function startCssListener() {
        console.log("[CSS Bridge] VM Found! Starting CSS listener loop.");
        console.log("[CSS Bridge] Use 'dom_css_SELECTOR_PROPERTY' to apply styles.");
        console.log("[CSS Bridge] Set 'dom_css_config_important' to '1' or 'yes' to enable !important override.");

        setInterval(() => {
            if (!vm || !vm.runtime || !vm.runtime.targets) return;

            const foundVarsThisScan = new Set();
            const varRegex = /^dom_css_([#.]?[\w-]+)_(.+)$/;
            const configRegex = /^dom_css_config_(.+)$/;
            let hasChanges = false;

            // 1. Scan all variables and check for changes.
            for (const target of vm.runtime.targets) {
                for (const varId in target.variables) {
                    const variable = target.variables[varId];
                    foundVarsThisScan.add(variable.name);

                    // Check for both style variables and config variables
                    if (variable.name.match(varRegex) || variable.name.match(configRegex)) {
                        const currentValue = variable.value;
                        if (!variableState.has(variable.name)) {
                            console.log(`[CSS Bridge] Discovered: '${variable.name}' = "${currentValue}"`);
                            variableState.set(variable.name, currentValue);
                            hasChanges = true;
                        } else if (variableState.get(variable.name) !== currentValue) {
                            const oldValue = variableState.get(variable.name);
                            console.log(`[CSS Bridge] Changed: '${variable.name}' from "${oldValue}" to "${currentValue}"`);
                            variableState.set(variable.name, currentValue);
                            hasChanges = true;
                        }
                    }
                }
            }

            // 2. Check for any variables that were deleted.
            for (const name of variableState.keys()) {
                if (!foundVarsThisScan.has(name)) {
                    console.log(`[CSS Bridge] Removed: '${name}'`);
                    variableState.delete(name);
                    hasChanges = true;
                }
            }

            // 3. If any change occurred, REBUILD and REPLACE the entire stylesheet.
            if (hasChanges) {
                const collectedRules = {};
                // Check for the !important config flag
                const importantFlagValue = variableState.get('dom_css_config_important');
                const useImportant = ['1', 'true', 'yes'].includes(String(importantFlagValue).toLowerCase());

                for (const [name, value] of variableState.entries()) {
                    const match = name.match(varRegex);
                    if (!match) continue; // Skip config variables

                    const [_, selector, property] = match;
                    const propertyName = property.replace(/_/g, '-');
                    const sanitizedSelector = selector.replace(/[\{\}\;\<\>]/g, '');

                    if (!collectedRules[sanitizedSelector]) collectedRules[sanitizedSelector] = {};
                    collectedRules[sanitizedSelector][propertyName] = value;
                }

                let newCssString = '';
                for (const selector in collectedRules) {
                    newCssString += `${selector} {\n`;
                    for (const prop in collectedRules[selector]) {
                        const sanitizedValue = String(collectedRules[selector][prop]).replace(/[\;\<\>]/g, '');
                        const importantSuffix = useImportant ? ' !important' : '';
                        newCssString += `  ${prop}: ${sanitizedValue}${importantSuffix};\n`;
                    }
                    newCssString += '}\n';
                }

                let styleTag = document.getElementById(styleTagId);
                if (!styleTag) {
                    styleTag = document.createElement('style');
                    styleTag.id = styleTagId;
                    // **THE FIX:** Append to the body to ensure it's parsed last.
                    document.body.appendChild(styleTag);
                }

                styleTag.textContent = newCssString;
                console.log(`[CSS Bridge] Stylesheet updated. Using !important: ${useImportant}`);
            }

        }, 250);
    }

    /**
     * Initializes the bridge by polling for the Scratch VM.
     */
    function initializeBridge() {
        let attempts = 0;
        const maxAttempts = 50;

        const tryToFindVm = () => {
            vm = findScratchVM();
            if (vm) {
                startCssListener();
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(tryToFindVm, 250);
            } else {
                console.warn("[CSS Bridge] VM not found. Bridge will not start.");
            }
        };

        console.log("[CSS Bridge] Waiting for Scratch VM to load...");
        tryToFindVm();
    }

    initializeBridge();

})();