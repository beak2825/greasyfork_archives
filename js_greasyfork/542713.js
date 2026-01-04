// ==UserScript==
// @name         AI Studio Code Box Enhancer
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  Adds a 'Copy' button to the code block header for easy access. Fixes selector issue.
// @author       AI: Google's Gemini Model
// @match        https://aistudio.google.com/*
// @icon         https://www.gstatic.com/aistudio/ai_studio_favicon_64x64.png
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542713/AI%20Studio%20Code%20Box%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/542713/AI%20Studio%20Code%20Box%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- STYLES (Added styles for header actions) ---
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .wrap-toggle-button .material-symbols-outlined { font-family: 'Material Symbols Outlined' !important; }
        .enhanced-code-container { border: 1px solid #3e4451; border-top: none; border-bottom: none; }
        .enhanced-code-wrapper { display: flex; font-family: monospace; overflow: hidden; background-color: #282c34; color: #abb2bf; padding: 10px 0; }
        .line-numbers { flex-shrink: 0; text-align: right; padding: 0 10px; border-right: 1px solid #444; user-select: none; color: #636d83; font-size: .9em; line-height: 1.5; }
        .code-content { flex-grow: 1; padding-left: 10px; overflow-x: auto; font-size: .9em; line-height: 1.5; }
        .code-content pre { margin: 0; padding-right: 10px; }
        .code-wrap-enabled .code-content pre { white-space: pre-wrap !important; overflow-wrap: anywhere !important; }
        .code-wrap-disabled .code-content pre { white-space: pre !important; overflow-wrap: normal !important; }
        ms-code-block .line-numbers-column, ms-code-block .code-line-numbers, ms-code-block .mat-code-line-number { display: none !important; }
        ms-code-block footer { background-color: #1e1e1e !important; color: #abb2bf !important; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; border: 1px solid #3e4451; border-top: none; min-height: 48px; display: flex; align-items: center; padding: 0 16px; cursor: pointer; position: relative; z-index: 1; }
        ms-code-block footer .actions { display: flex; gap: 8px; align-items: center; }
        .wrap-toggle-button:focus { outline: none !important; }

        /* --- NEW STYLES FOR HEADER BUTTONS --- */
        mat-expansion-panel-header {
            background-color: #1e1e1e !important; color: #abb2bf !important;
            border-top-left-radius: 8px; border-top-right-radius: 8px;
            border: 1px solid #3e4451; border-bottom: none;
            height: 48px !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important; /* Space between button group and title */
            padding-left: 16px !important;
        }
        .header-actions-container {
            display: flex;
            align-items: center;
            flex-shrink: 0; /* Prevent button group from shrinking */
        }
        mat-expansion-panel-header .mat-content {
            flex-grow: 1; /* Title takes remaining space */
        }
        .header-actions-container .mat-mdc-icon-button,
        .header-actions-container .mat-icon-button {
            transform: scale(0.85); /* Make buttons a bit smaller for the header */
            width: 34px !important;
            height: 34px !important;
        }
    `);

    const debounceTimers = new WeakMap();

    function createActionButton(icon, title, onClick) {
        const button = document.createElement('button');
        button.className = 'mat-focus-indicator mat-icon-button mat-button-base wrap-toggle-button';
        button.title = title;
        const wrapperSpan = document.createElement('span');
        wrapperSpan.className = 'mat-button-wrapper';
        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-symbols-outlined notranslate';
        iconSpan.textContent = icon;
        wrapperSpan.appendChild(iconSpan);
        button.appendChild(wrapperSpan);
        button.addEventListener('click', onClick);
        return button;
    }

    function updateContent(codeBlockContainer) {
        const msCodeBlock = codeBlockContainer.querySelector('ms-code-block');
        const originalPre = msCodeBlock ? msCodeBlock.querySelector('pre') : null;
        if (!originalPre) return;
        if (!originalPre.dataset.originalCode) {
            originalPre.dataset.originalCode = originalPre.textContent.trim();
        }
        const originalCode = originalPre.dataset.originalCode;
        originalPre.style.display = 'none';
        let enhancedContainer = msCodeBlock.querySelector('.enhanced-code-container');
        if (!enhancedContainer) {
            enhancedContainer = document.createElement('div');
            enhancedContainer.className = 'enhanced-code-container';
            const wrapper = document.createElement('div');
            wrapper.className = 'enhanced-code-wrapper';
            const lineNumbers = document.createElement('div');
            lineNumbers.className = 'line-numbers';
            const codeContent = document.createElement('div');
            codeContent.className = 'code-content';
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            pre.appendChild(code);
            codeContent.appendChild(pre);
            wrapper.appendChild(lineNumbers);
            wrapper.appendChild(codeContent);
            enhancedContainer.appendChild(wrapper);
            originalPre.after(enhancedContainer);
        }
        const isWrapEnabled = codeBlockContainer.dataset.wrapEnabled === 'true';
        const lineNumbersDiv = enhancedContainer.querySelector('.line-numbers');
        const codeElement = enhancedContainer.querySelector('code');
        let displayCode;
        let lines;
        if (isWrapEnabled) {
            displayCode = originalCode;
            lines = displayCode.split('\n');
            if (lines.length === 1 && lines[0] === '') lines = [''];
        } else {
            displayCode = originalCode.replace(/\n/g, ' ').replace(/\s\s+/g, ' ');
            lines = [displayCode];
        }
        codeElement.textContent = displayCode;
        lineNumbersDiv.textContent = '';
        lines.forEach((_, i) => {
            const numDiv = document.createElement('div');
            numDiv.textContent = i + 1;
            lineNumbersDiv.appendChild(numDiv);
        });
        enhancedContainer.classList.toggle('code-wrap-enabled', isWrapEnabled);
        enhancedContainer.classList.toggle('code-wrap-disabled', !isWrapEnabled);
    }

    function setupControls(codeBlockContainer) {
        if (!codeBlockContainer.dataset.wrapEnabled) {
             codeBlockContainer.dataset.wrapEnabled = 'false';
        }
        const footer = codeBlockContainer.querySelector('ms-code-block footer');
        const actionsContainer = footer?.querySelector('.actions');
        const headerElement = codeBlockContainer.querySelector('mat-expansion-panel-header');

        if (!actionsContainer || !headerElement) return;

        // 1. Add Wrap Button to Footer (if it doesn't exist)
        if (!actionsContainer.querySelector('.wrap-toggle-button')) {
            const wrapToggleButton = createActionButton('\ue86f', 'Enable multi-line wrapping', (e) => {
                e.stopPropagation();
                const container = e.currentTarget.closest('mat-expansion-panel');
                const newEnabledState = !(container.dataset.wrapEnabled === 'true');
                container.dataset.wrapEnabled = newEnabledState.toString();
                updateContent(container);

                const iconSpan = e.currentTarget.querySelector('.material-symbols-outlined');
                if (newEnabledState) {
                    e.currentTarget.title = 'Disable wrapping (show as single line)';
                    iconSpan.textContent = '\ue5d6';
                } else {
                    e.currentTarget.title = 'Enable multi-line wrapping';
                    iconSpan.textContent = '\ue86f';
                }
            });
            wrapToggleButton.classList.add('wrap-toggle-button');
            actionsContainer.appendChild(wrapToggleButton);
        }

        // 2. Add Cloned Copy Button to Header (if it doesn't exist)
        if (!headerElement.querySelector('.header-actions-container')) {
            // *** FIX: Find the copy button using the correct tooltip attribute. ***
            // We use a comma to try multiple selectors for better resilience.
            const originalCopyButton = actionsContainer.querySelector('button[mattooltip="Copy to clipboard"], button[mattooltip="Copy code"]');

            if (originalCopyButton) {
                const headerActionsContainer = document.createElement('div');
                headerActionsContainer.className = 'header-actions-container';

                const clone = originalCopyButton.cloneNode(true);

                // For the native copy button, just click the original.
                clone.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent the panel from toggling
                    originalCopyButton.click();
                });

                // Ensure the tooltip is carried over to the standard 'title' attribute.
                clone.title = originalCopyButton.getAttribute('mattooltip') || originalCopyButton.title || 'Copy code';
                headerActionsContainer.appendChild(clone);
                headerElement.prepend(headerActionsContainer);
            }
        }

        // 3. Make Footer clickable to toggle panel (if not already)
        if (!footer.dataset.clickable) {
            footer.dataset.clickable = 'true';
            footer.addEventListener('click', e => {
                if (!e.target.closest('button')) {
                    headerElement.click();
                }
            });
        }
    }


    function setupObserverFor(codeBlockContainer) {
        if (codeBlockContainer.dataset.enhancerSetup) return;
        codeBlockContainer.dataset.enhancerSetup = 'true';
        setupControls(codeBlockContainer);
        updateContent(codeBlockContainer);
        const observer = new MutationObserver(() => {
            const originalPre = codeBlockContainer.querySelector('ms-code-block pre');
            if (originalPre) originalPre.dataset.originalCode = '';
            clearTimeout(debounceTimers.get(codeBlockContainer));
            const timer = setTimeout(() => {
                updateContent(codeBlockContainer);
                setupControls(codeBlockContainer); // Re-run controls setup in case buttons were wiped
            }, 100);
            debounceTimers.set(codeBlockContainer, timer);
        });
        const msCodeBlock = codeBlockContainer.querySelector('ms-code-block');
        if (msCodeBlock) observer.observe(msCodeBlock, { characterData: true, subtree: true, childList: true });
    }

    const mainObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                if (node.matches('mat-expansion-panel.code-block-container')) setupObserverFor(node);
                node.querySelectorAll('mat-expansion-panel.code-block-container').forEach(setupObserverFor);
            }
        }));
    });

    document.querySelectorAll('mat-expansion-panel.code-block-container').forEach(setupObserverFor);
    mainObserver.observe(document.body, { childList: true, subtree: true });

})();