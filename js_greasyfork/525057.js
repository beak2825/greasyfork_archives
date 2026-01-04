// ==UserScript==
// @name         LLM Prompt Manager
// @namespace    https://example.com
// @version      1.1
// @description  Allows storing/loading custom prompts and automatically adjusts max tokens for deployment "o1" to 50000 if at default 4096. Also displays a prompt title above the system instructions, keeps them in persistent storage, and only saves manual edits when the "Apply changes" button is pressed.
// @author       Rick van Hattem
// @match        https://oai.azure.com/resource/playground?wsid=/subscriptions/*
// @icon         https://www.google.com/s2/favicons?sz=64&amp;domain=azure.com
// @grant        GM_getValue
// @grant        GM_setValue
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/525057/LLM%20Prompt%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/525057/LLM%20Prompt%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Tampermonkey Prompt Manager: Script start. (UI above instructions + expand accordion)");

    /********************************************************************
     * Configuration
     ********************************************************************/
    const PROMPT_KEY = 'myPromptsList';
    const SELECTED_KEY = 'myPromptsSelectedIndex';
    const DEFAULT_TOKENS = '4096';
    const NEW_TOKENS = '50000';

    // Partial text matches
    const INSTRUCTIONS_LABEL_SUBSTR = 'give the model instructions';
    const TEXTAREA_ARIA_LABEL = 'System message';
    const DEPLOYMENT_SUBSTR = 'deployment';
    const MAX_TOKENS_SUBSTR = 'max completion token';

    /********************************************************************
     * Helper: update textarea value using native React setter hack
     ********************************************************************/
    function updateTextarea(element, text) {
        const descriptor = Object.getOwnPropertyDescriptor(element.__proto__, 'value');
        descriptor.set.call(element, text);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /********************************************************************
     * Helper: auto-confirm the "Update system message?" modal.
     ********************************************************************/
    function autoConfirmDialog() {
        const confirmBtn = document.querySelector('button[data-automation-id="dialogConfirmButton"]');
        if (confirmBtn) {
            console.log("Auto-confirm dialog found. Clicking 'Continue'.");
            confirmBtn.click();
        }
    }

    /********************************************************************
     * Helper: trigger a click on the "Apply changes" button.
     ********************************************************************/
    function clickApplyChanges() {
        const btn = document.querySelector('button[data-automation-id="applyChangesButton"]');
        if (btn) {
            console.log("Clicking 'Apply changes' button.");
            btn.click();
            setTimeout(autoConfirmDialog, 200);
        } else {
            console.log("'Apply changes' button not found.");
        }
    }

    /********************************************************************
     * GM Storage functions
     ********************************************************************/
    function loadPrompts() {
        const arr = GM_getValue(PROMPT_KEY, []);
        console.log("loadPrompts(): loaded array length:", arr.length);
        return arr;
    }
    function savePrompts(prompts) {
        console.log("savePrompts(): saving array length:", prompts.length);
        GM_setValue(PROMPT_KEY, prompts);
    }
    function loadSelectedIndex() {
        const idx = GM_getValue(SELECTED_KEY, 0);
        console.log("loadSelectedIndex(): idx:", idx);
        return idx;
    }
    function saveSelectedIndex(idx) {
        console.log("saveSelectedIndex(): storing idx=", idx);
        GM_setValue(SELECTED_KEY, idx);
    }

    /********************************************************************
     * DOM-Finding Utilities
     ********************************************************************/
    function getParametersAccordionButton() {
        console.log("getParametersAccordionButton(): Searching for accordion with data-lesson-step-id='AdjustParameters' or text 'Parameters'...");
        let div = document.querySelector('div[data-lesson-step-id="AdjustParameters"]');
        if (div) {
            let btn = div.closest('button.fui-AccordionHeader__button');
            if (btn) {
                console.log("Found accordion button:", btn);
                return btn;
            }
        }
        let allBtns = document.querySelectorAll('button');
        for (const b of allBtns) {
            const txt = (b.textContent || "").toLowerCase();
            if (txt.includes('parameters')) {
                console.log("Found accordion button with text 'parameters':", b);
                return b;
            }
        }
        console.log("getParametersAccordionButton(): No match found.");
        return null;
    }

    function expandParametersAccordion() {
        const btn = getParametersAccordionButton();
        if (!btn) {
            console.log("expandParametersAccordion(): No parameters accordion found.");
            return;
        }
        const expanded = btn.getAttribute('aria-expanded');
        if (expanded === 'false') {
            console.log("expandParametersAccordion(): Collapsed – clicking...");
            btn.click();
        } else {
            console.log("expandParametersAccordion(): Already expanded or missing aria-expanded.");
        }
    }

    function getAncestorSet(elem, levels) {
        const s = new Set();
        let cur = elem;
        let count = 0;
        while (cur && count < levels) {
            s.add(cur);
            cur = cur.parentElement;
            count++;
        }
        return s;
    }

    function findLabelByPartialText(labelSubstr) {
        const subLC = labelSubstr.toLowerCase();
        console.log("findLabelByPartialText(): Searching for label containing:", subLC);
        const labels = document.querySelectorAll('label');
        for (const lb of labels) {
            let txt = (lb.textContent || "").toLowerCase().trim();
            if (txt.includes(subLC)) {
                console.log("Found label:", lb, "=>", txt);
                return lb;
            }
        }
        console.log("findLabelByPartialText(): No label found for:", subLC);
        return null;
    }

    function getInstructionsTextarea() {
        console.log("getInstructionsTextarea(): Searching using label substring:", INSTRUCTIONS_LABEL_SUBSTR);
        const label = findLabelByPartialText(INSTRUCTIONS_LABEL_SUBSTR);
        if (!label) {
            console.log("getInstructionsTextarea(): No label found.");
            return null;
        }
        const allTextareas = document.querySelectorAll(`textarea[aria-label="${TEXTAREA_ARIA_LABEL}"]`);
        if (allTextareas.length === 0) {
            console.log("getInstructionsTextarea(): No textareas found with aria-label:", TEXTAREA_ARIA_LABEL);
            return null;
        }
        const lblAncestors = getAncestorSet(label, 6);
        for (const ta of allTextareas) {
            const taAncestors = getAncestorSet(ta, 6);
            const intersection = [...lblAncestors].filter(x => taAncestors.has(x));
            if (intersection.length > 0) {
                console.log("getInstructionsTextarea(): Found matching textarea:", ta);
                return ta;
            }
        }
        console.log("getInstructionsTextarea(): No matching textarea found.");
        return null;
    }

    function getDeploymentInput() {
        console.log("getDeploymentInput(): Searching for deployment input using substring:", DEPLOYMENT_SUBSTR);
        const label = findLabelByPartialText(DEPLOYMENT_SUBSTR);
        if (!label) {
            console.log("getDeploymentInput(): No label for 'deployment' found.");
            return null;
        }
        const allInputs = document.querySelectorAll('input[type="text"], input:not([type])');
        const lblAncestors = getAncestorSet(label, 6);
        let candidate = null;
        for (const inp of allInputs) {
            if (inp.type && inp.type.toLowerCase() === 'hidden') continue;
            const inAnc = getAncestorSet(inp, 6);
            const shared = [...lblAncestors].filter(x => inAnc.has(x));
            if (shared.length > 0) {
                console.log("getDeploymentInput(): Found deployment input:", inp);
                candidate = inp;
                break;
            }
        }
        if (!candidate) console.log("getDeploymentInput(): No deployment input found.");
        return candidate;
    }

    function getMaxTokensInput() {
        console.log("getMaxTokensInput(): Searching for tokens input using substring:", MAX_TOKENS_SUBSTR);
        const label = findLabelByPartialText(MAX_TOKENS_SUBSTR);
        if (!label) {
            console.log("getMaxTokensInput(): No label found for tokens.");
            return null;
        }
        const allPossInputs = document.querySelectorAll('input[type="text"], input:not([type])');
        const lblAnc = getAncestorSet(label, 6);
        for (const inp of allPossInputs) {
            if (inp.type && inp.type.toLowerCase() === 'hidden') continue;
            const inAnc = getAncestorSet(inp, 6);
            const intersection = [...lblAnc].filter(x => inAnc.has(x));
            if (intersection.length > 0) {
                console.log("getMaxTokensInput(): Found tokens input:", inp);
                return inp;
            }
        }
        console.log("getMaxTokensInput(): No tokens input matched.");
        return null;
    }

    /********************************************************************
     * Prompt Manager UI
     ********************************************************************/
    function createPromptManagerUI(textarea) {
        console.log("createPromptManagerUI(): Building UI above instructions textarea.");

        const container = document.createElement('div');
        container.style.margin = '2px -2px';
        container.style.padding = '2px';
        container.style.width = '100%';
        container.style.display = 'flex';
        container.style.alignItems = 'center';

        const titleSpan = document.createElement('span');
        titleSpan.textContent = "Prompt: ";
        titleSpan.style.fontWeight = '600';

        const selectBox = document.createElement('select');
        selectBox.style.margin = '0 6px';
        selectBox.style.flex = '1';

        const addBtn = document.createElement('button');
        addBtn.textContent = "Add";
        addBtn.style.marginRight = '6px';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";

        container.appendChild(titleSpan);
        container.appendChild(selectBox);
        container.appendChild(addBtn);
        container.appendChild(document.createTextNode(' '));
        container.appendChild(removeBtn);

        if (textarea.parentNode) {
            textarea.parentNode.parentNode.insertBefore(container, textarea.parentNode);
        } else {
            console.log("createPromptManagerUI(): Parent not found; appending container to body.");
            document.body.appendChild(container);
        }

        let prompts = loadPrompts();
        let selIdx = loadSelectedIndex();

        function refreshSelect() {
            selectBox.innerHTML = '';
            for (let i = 0; i < prompts.length; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = prompts[i].title || `Prompt ${i+1}`;
                selectBox.appendChild(opt);
            }
        }
        refreshSelect();

        // On initialization, if prompts exist, update the textarea and dropdown.
        if (prompts.length > 0) {
            if (selIdx < 0 || selIdx >= prompts.length) {
                selIdx = 0;
                saveSelectedIndex(0);
            }
            selectBox.value = String(selIdx);
            updateTextarea(textarea, prompts[selIdx].content);
            clickApplyChanges();
        }

        selectBox.addEventListener('change', () => {
            const idx = parseInt(selectBox.value, 10);
            if (!isNaN(idx) && prompts[idx]) {
                console.log("User selected prompt index:", idx);
                updateTextarea(textarea, prompts[idx].content);
                saveSelectedIndex(idx);
                clickApplyChanges();
            }
        });

        addBtn.addEventListener('click', () => {
            const title = prompt("Enter a title for the new prompt:");
            if (!title) return;
            const newP = { title, content: textarea.value };
            prompts.push(newP);
            savePrompts(prompts);
            refreshSelect();
            const newIndex = prompts.length - 1;
            selectBox.value = String(newIndex);
            saveSelectedIndex(newIndex);
            alert(`New prompt '${title}' added!`);
            // Do not clear the textarea.
        });

        removeBtn.addEventListener('click', () => {
            const idx = parseInt(selectBox.value, 10);
            if (!isNaN(idx) && prompts[idx]) {
                if (confirm(`Remove prompt titled "${prompts[idx].title}"?`)) {
                    prompts.splice(idx, 1);
                    savePrompts(prompts);
                    refreshSelect();
                    if (prompts.length > 0) {
                        let newIdx = idx;
                        if (newIdx >= prompts.length) {
                            newIdx = prompts.length - 1;
                        }
                        selectBox.value = String(newIdx);
                        updateTextarea(textarea, prompts[newIdx].content);
                        saveSelectedIndex(newIdx);
                        clickApplyChanges();
                    } else {
                        updateTextarea(textarea, "");
                        saveSelectedIndex(0);
                        clickApplyChanges();
                    }
                }
            }
        });

        // Do NOT save on every keystroke. Instead, update stored prompt when "Apply changes" is pressed.
        function onApplyChangesClick() {
            const idx = parseInt(selectBox.value, 10);
            if (!isNaN(idx) && prompts[idx]) {
                prompts[idx].content = textarea.value;
                savePrompts(prompts);
                console.log("Apply changes clicked: current prompt saved.");
            }
        }

        // Attach our event listener to the page's "Apply changes" button.
        const applyChangesBtn = document.querySelector('button[data-automation-id="applyChangesButton"]');
        if (applyChangesBtn) {
            // Remove any previous listener to avoid duplicates.
            applyChangesBtn.removeEventListener('click', onApplyChangesClick);
            applyChangesBtn.addEventListener('click', onApplyChangesClick);
        } else {
            console.log("createPromptManagerUI(): 'Apply changes' button not found for manual update listener.");
        }

        // When the "User message" textarea is focused, check after a delay and restore system instructions if cleared.
        const userMessageTextarea = document.querySelector('textarea[aria-label="User message"]');
        if (userMessageTextarea) {
            userMessageTextarea.addEventListener('focus', () => {
                setTimeout(() => {
                    if (textarea.value.trim() === "") {
                        const idx = parseInt(selectBox.value, 10);
                        if (!isNaN(idx) && prompts[idx]) {
                            console.log("User message focused after delay: restoring system instructions.");
                            updateTextarea(textarea, prompts[idx].content);
                            clickApplyChanges();
                        }
                    }
                }, 300);
            });
        }
    }

    /********************************************************************
     * Max Tokens Adjust if "o1" in deployment
     ********************************************************************/
    function adjustMaxTokensIfO1() {
        console.log("adjustMaxTokensIfO1(): Checking if deployment contains 'o1'...");
        const depInput = getDeploymentInput();
        if (!depInput) {
            console.log("adjustMaxTokensIfO1(): No deployment input found, skipping.");
            return;
        }
        const valLC = (depInput.value || "").toLowerCase();
        if (valLC.includes('o1')) {
            console.log("adjustMaxTokensIfO1(): 'o1' found; checking tokens input...");
            expandParametersAccordion();
            setTimeout(() => {
                const tokensInp = getMaxTokensInput();
                if (!tokensInp) {
                    console.log("adjustMaxTokensIfO1(): Tokens input not found.");
                    return;
                }
                const currentVal = tokensInp.value.trim();
                console.log("Current max tokens:", currentVal);
                if (currentVal === DEFAULT_TOKENS) {
                    console.log("adjustMaxTokensIfO1(): Changing tokens from", DEFAULT_TOKENS, "to", NEW_TOKENS);
                    tokensInp.value = NEW_TOKENS;
                    tokensInp.dispatchEvent(new Event('input', { bubbles: true }));
                    tokensInp.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    console.log("adjustMaxTokensIfO1(): Tokens already updated; no change.");
                }
            }, 600);
        } else {
            console.log("adjustMaxTokensIfO1(): 'o1' not found in deployment.");
        }
    }

    function watchDeployment() {
        const dep = getDeploymentInput();
        if (!dep) {
            console.log("watchDeployment(): No deployment input found; cannot attach listeners.");
            return;
        }
        dep.addEventListener('change', adjustMaxTokensIfO1);
        dep.addEventListener('input', adjustMaxTokensIfO1);
    }

    /********************************************************************
     * Polling for DOM
     ********************************************************************/
    let pollCount = 0;
    const poller = setInterval(() => {
        pollCount++;
        console.log("Polling attempt #", pollCount);
        const ta = getInstructionsTextarea();
        const dep = getDeploymentInput();
        if (ta && dep) {
            console.log("Found both instructions and deployment. Stopping poll and initializing...");
            clearInterval(poller);
            createPromptManagerUI(ta);
            watchDeployment();
            adjustMaxTokensIfO1();
        } else {
            console.log("Still waiting. Instructions found:", Boolean(ta), ", Deployment found:", Boolean(dep));
        }
    }, 2000);

    console.log("Tampermonkey Prompt Manager: End of script definition. Polling until elements are found.");
})();