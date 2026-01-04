// ==UserScript==
// @name         Bubble Editor Enhancements
// @namespace    http://tampermonkey.net/
// @version      2025.05.10-04
// @description  Enhances Bubble.io editor: Data Type/Option Sets/Attributes (layout, colors). Modal dialogs - full keyboard support (Enter/Esc, Tab nav). Toggleable canvas padding. Ctrl+N for hinted "Create a new..." buttons.
// @author       kibermaks@gmail.com
// @match        https://*bubble.io/page*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bubble.io
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535566/Bubble%20Editor%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/535566/Bubble%20Editor%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SCRIPT_NAME = "Bubble Enhancements";
    const DEBUG_MODE = false;

    const CANVAS_PADDING_ENABLED_KEY = "bubbleEnhancements_canvasPaddingEnabled";
    let isCanvasPaddingEnabled = true;
    let canvasPaddingMenuCommandId = null;

    const NAME_INPUT_SELECTOR_IN_MODAL = '.new-field-name-wrapper input.new-field-name.bubble-ui';
    const TYPE_DROPDOWN_SELECTOR_IN_MODAL = '.editor.dropdown.new-field-type .property-editor-control.composer-container';
    const DROPDOWN_CAPTION_SELECTOR = '.dropdown-caption-container';
    const DROPDOWN_CONTAINER_ACTUAL_SELECTOR = '.dropdown-container.new-composer';
    const CHECKBOX_SELECTOR_IN_MODAL = '.editor.checkbox .new-composer.composer-checkbox .component-checkbox';
    const MODAL_CONTENT_SELECTOR = '.popup-content';
    const CREATE_NEW_BUTTON_SELECTOR = '.btn.add-new-type';

    function logDebug(message, ...args) { if (DEBUG_MODE) { console.log(`[${SCRIPT_NAME}] DEBUG:`, message, ...args); } }
    function logInfo(message, ...args) { console.log(`[${SCRIPT_NAME}] INFO:`, message, ...args); }
    function logError(message, ...args) { console.error(`[${SCRIPT_NAME}] ERROR:`, message, ...args); }

    function addGlobalStyle(css) {
        const head = document.getElementsByTagName('head')[0];
        if (!head) { logError("Could not find <head> to inject CSS."); return; }
        const style = document.createElement('style');
        style.type = 'text/css'; style.innerHTML = css; head.appendChild(style);
        logDebug("Custom CSS injected.");
    }

    function applyCanvasPaddingState(enabled) { /* ... (no change) ... */
        if (enabled) document.body.classList.add('canvas-padding-active');
        else document.body.classList.remove('canvas-padding-active');
        logDebug(`Canvas padding ${enabled ? 'enabled' : 'disabled'}.`);
    }
    function toggleCanvasPadding() { /* ... (no change) ... */
        isCanvasPaddingEnabled = !isCanvasPaddingEnabled;
        GM_setValue(CANVAS_PADDING_ENABLED_KEY, isCanvasPaddingEnabled);
        applyCanvasPaddingState(isCanvasPaddingEnabled);
        registerMenuCommands();
        logInfo(`Canvas padding toggled ${isCanvasPaddingEnabled ? 'ON' : 'OFF'}.`);
    }
    function registerMenuCommands() { /* ... (no change) ... */
        if (canvasPaddingMenuCommandId !== null) {
            try { GM_unregisterMenuCommand(canvasPaddingMenuCommandId); } catch (e) { logError("Error unregistering menu command:", e); }
        }
        canvasPaddingMenuCommandId = GM_registerMenuCommand(
            `Toggle Canvas Right Padding (Currently: ${isCanvasPaddingEnabled ? 'ON' : 'OFF'})`,
            toggleCanvasPadding, 'c'
        );
        logDebug("Registered menu command:", canvasPaddingMenuCommandId);
    }
    function loadSettings() { /* ... (no change) ... */
        isCanvasPaddingEnabled = GM_getValue(CANVAS_PADDING_ENABLED_KEY, true);
        applyCanvasPaddingState(isCanvasPaddingEnabled);
    }

    loadSettings();
    registerMenuCommands();

    addGlobalStyle(`
        body.canvas-padding-active .canvas-inner { justify-self: end !important; padding-right: 1%; }
        /* a.logo { visibility: hidden; } */
        .field-name { width: 50%; min-width: 250px; display: flex; }
        .field-name > div.composer-textbox { flex: 1 1 auto; min-width: 168px; }
        .field-name input { width: 100% !important; min-width: 168px; }
        .custom-fields:not(.option-set-attributes) > div.field:not(.built-in) { display: flex; align-items: center; gap: 12px; width: 100%; padding: 8px 6px; box-sizing: border-box; }
        .custom-fields:not(.option-set-attributes) > div.field:not(.built-in) > .new-composer.composer-textbox:first-child { width: 34%; min-width: 180px; flex-shrink: 0; }
        .custom-fields:not(.option-set-attributes) > div.field:not(.built-in) > .new-composer.composer-textbox:first-child input { width: 100%; box-sizing: border-box; }
        .custom-fields > div.field > .field-type { flex-shrink: 2; text-align: left; min-width: 0; }
        .custom-fields:not(.option-set-attributes) > div.field:not(.built-in) > .field-default-caption { width: 60px; flex-shrink: 0; text-align: center; }
        .custom-fields:not(.option-set-attributes) > div.field:not(.built-in) > .composer-dropdown.bubble-ui > .spot { width: 100%; box-sizing: border-box; }
        .custom-fields > div.field > .delete-btn { order: 2; flex-shrink: 0; }
        .custom-fields > div.field > .comment-btn { flex-shrink: 0; margin-left: auto; }
        .custom-fields > div.field:not(.built-in):nth-child(even) { background-color: #f7f7f7; }
        .custom-fields > div.field:not(.built-in):nth-child(odd) { background-color: transparent; }
        .custom-fields .built-in-fields { margin-top: 10px; }
        .custom-fields .built-in-fields > div.field.built-in { display: flex; align-items: center; gap: 12px; padding: 8px 6px; border-top: 1px solid #eee; }
        .field:not(.built-in) > .field-default-caption ~ input { flex-grow:1; width: auto !important; min-width:0; }
        .field:not(.built-in) > .field-default-caption ~ .composer-dropdown,
        .field:not(.built-in) > .field-default-caption ~ .composer-textbox{ flex-grow:1; }
        .field:not(.built-in) > .field-default-caption ~ .composer-image,
        .field:not(.built-in) > .field-default-caption ~ .composer-file{ margin-right: auto; }
        .composer-textbox > input { width: 100% !important; }
        .custom-fields .built-in-fields > div.field.built-in .built-in-field-name { width: 33%; min-width: 150px; flex-shrink: 0; }
        .custom-fields .built-in-fields > div.field.built-in .built-in-mention { margin-right: auto; white-space: nowrap; flex-shrink: 0; }
        .custom-fields .built-in-fields > div.field.built-in:nth-child(even) { background-color: #fafafa; }
        .custom-fields .built-in-fields > div.field.built-in:nth-child(odd) { background-color: transparent; }
        .custom-fields.option-set-attributes > div.field:not(.built-in) { display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 6px; box-sizing: border-box; }
        .custom-fields.option-set-attributes > div.field:not(.built-in) > .new-composer.composer-textbox:first-child { width: 34%; min-width: 180px; flex-shrink: 0; }
        .custom-fields.option-set-attributes > div.field:not(.built-in) > .new-composer.composer-textbox:first-child input { width: 100%; box-sizing: border-box; }
        .key-hint { text-decoration: underline; }
    `);

    function findTargetableCreateNewButton() { // Renamed for clarity
        const buttons = document.querySelectorAll(
            `${CREATE_NEW_BUTTON_SELECTOR}[data-key-hint-target="true"]` // Look for buttons marked as targets
        );
        for (const btn of buttons) {
            if (btn.offsetParent !== null &&
                getComputedStyle(btn).display !== 'none' &&
                getComputedStyle(btn).visibility !== 'hidden' &&
                !btn.closest('.bottom-stripe, .bottom-popup-row, .popup-content .children')) {
                logDebug("Found targetable 'Create New...' button:", btn, btn.textContent);
                return btn;
            }
        }
        logDebug("No targetable 'Create New...' button found.");
        return null;
    }

    function styleCreateNewButton(button, keyChar = 'N') {
        if (!button || button.dataset.keyHintAdded === 'true') return; // Already processed

        button.dataset.keyHintAdded = 'true'; // Mark as processed to avoid re-evaluating innerHTML
        const originalText = button.textContent || button.innerText || "";
        let newHtml = originalText;
        let hintAppliedSuccessfully = false;
        // We only want to target buttons that are clearly for "creating something NEW"
        // Check if the text contains "new" or "create a new"
        const isTargetContext = /new|create a new/i.test(originalText);

        if (isTargetContext) {
            // Try to find the keyChar (case-insensitive) within "New" or "Create" context
            const contextPattern = new RegExp(`(new|create)([^${keyChar}]*?)(${keyChar})`, 'i');
            let match = originalText.match(contextPattern);

            if (match && match[3]) {
                const charIndex = originalText.toLowerCase().indexOf(match[3].toLowerCase(), match.index + match[1].length + (match[2] ? match[2].length : 0) );
                if (charIndex > -1) {
                    newHtml = originalText.substring(0, charIndex) +
                              `<span class="key-hint">${originalText[charIndex]}</span>` +
                              originalText.substring(charIndex + 1);
                    hintAppliedSuccessfully = true;
                }
            } else { // Fallback: if "new" or "create a new" is present, but the specific pattern above didn't match 'N' within it,
                     // try to find the first 'N' in the whole string if the context is right.
                const firstNIndex = originalText.toUpperCase().indexOf("N");
                if (firstNIndex > -1) {
                     newHtml = originalText.substring(0, firstNIndex) +
                              `<span class="key-hint">${originalText[firstNIndex]}</span>` +
                              originalText.substring(firstNIndex + 1);
                     hintAppliedSuccessfully = true;
                }
            }

            if (hintAppliedSuccessfully) {
                button.innerHTML = newHtml;
                button.dataset.keyHintTarget = 'true'; // Mark as a valid target for Ctrl+N
                logDebug("Added key hint and marked as target:", button.textContent);
            } else {
                // Text contains "new" or "create a new", but 'N' wasn't found to underline.
                // Do not mark as keyHintTarget. It's a .btn.add-new-type but not one we can visually hint for 'N'.
                logDebug("Button has target context but 'N' not found for hinting:", button.textContent);
            }
        } else {
            // Button has class .btn.add-new-type, but text doesn't match "new" or "create a new"
            // So, we don't consider it a target for this specific Ctrl+N functionality.
            logDebug("Button class matches, but text context not for 'Create a new...':", button.textContent);
            // No dataset.keyHintTarget = 'true' is set.
        }
    }

    function handleGlobalKeyDown(event) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);

        if (event.ctrlKey && event.key.toLowerCase() === 'n') {
            if (isInputFocused) {
                logDebug("Ctrl+N: Input focused, allowing browser default.");
                return;
            }
            const anyModalOpen = document.querySelector(`${MODAL_CONTENT_SELECTOR}:not([style*="display: none"]):not([style*="visibility: hidden"]), .overlay:not([style*="display: none"]):not([style*="visibility: hidden"])`);
            if (anyModalOpen && anyModalOpen.offsetParent !== null) {
                logDebug("Ctrl+N: A modal is already open, ignoring.", anyModalOpen);
                return;
            }

            const buttonToClick = findTargetableCreateNewButton(); // Now looks for hinted targets
            if (buttonToClick) {
                logInfo("Ctrl+N: Clicking hinted 'Create New...' button:", buttonToClick.textContent);
                buttonToClick.click();
                event.preventDefault();
                event.stopPropagation();
            } else {
                logDebug("Ctrl+N: No suitable hinted 'Create New...' button found.");
            }
            return;
        }

        if (event.key !== 'Enter' && event.key !== 'Escape') return;
        // ... (rest of modal Enter/Escape logic remains unchanged) ...
        const activeModals = Array.from(document.querySelectorAll(MODAL_CONTENT_SELECTOR))
            .filter(el => el.offsetParent !== null && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden');

        if (activeModals.length === 0) return;
        const currentModal = activeModals[activeModals.length - 1];

        if (event.key === 'Enter' && activeElement &&
            (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable) &&
            currentModal.contains(activeElement) &&
            !activeElement.closest('.bottom-stripe, .bottom-popup-row')) {
            const associatedDropdown = activeElement.closest('.composer-dropdown');
            const isAssociatedDropdownOpen = associatedDropdown && associatedDropdown.querySelector('.dropdown-container.opened');
            if (!isAssociatedDropdownOpen) {
                logDebug("Modal Enter in input/textarea (not in footer, its dropdown not open). Allowing default.");
                return;
            }
        }

        if (event.key === 'Escape') {
            const openDropdownInModal = currentModal.querySelector(DROPDOWN_CONTAINER_ACTUAL_SELECTOR + '.opened');
            if (openDropdownInModal &&
                (openDropdownInModal.contains(activeElement) || activeElement?.closest(DROPDOWN_CONTAINER_ACTUAL_SELECTOR + '.opened') === openDropdownInModal)) {
                logDebug("Modal Esc: Active element is within an open dropdown. Allowing local/nav handler.");
                return;
            }
        }

        const buttonSearchScope = currentModal;
        let buttonToClickModal = null;
        let buttonSelectorModal = '';
        const modalTitle = currentModal.querySelector('.popup-title')?.textContent.trim() || 'Unknown Modal';

        if (event.key === 'Enter') {
            const selectors = [
                '.btn.btn-create.bubble-ui:not(.disabled)', '.btn.btn-primary:not(.disabled)', '.btn.btn-create:not(.disabled)',
                '.bubble-button.primary:not(.disabled)', '.bubble-element.Button[class*="primary"]:not(.disabled)'
            ];
            for (const sel of selectors) {
                buttonToClickModal = buttonSearchScope.querySelector(sel);
                if (buttonToClickModal && buttonToClickModal.offsetParent !== null && getComputedStyle(buttonToClickModal).display !== 'none' && getComputedStyle(buttonToClickModal).visibility !== 'hidden') {
                    buttonSelectorModal = sel; break;
                }
                buttonToClickModal = null;
            }
            if (!buttonToClickModal) {
                const allButtons = buttonSearchScope.querySelectorAll('.btn:not(.disabled), .bubble-element.Button:not(.disabled)');
                buttonToClickModal = Array.from(allButtons).find(btn =>
                    !btn.classList.contains('btn-cancel') && !(btn.classList.contains('cancel')) &&
                    !(btn.textContent || '').toLowerCase().includes('cancel') &&
                    btn.offsetParent !== null && getComputedStyle(btn).display !== 'none' && getComputedStyle(btn).visibility !== 'hidden'
                );
                if (buttonToClickModal) buttonSelectorModal = "Fallback: first visible non-cancel button";
            }
        } else if (event.key === 'Escape') {
            const selectors = [
                '.btn.btn-cancel:not(.disabled)', '.btn[class*="cancel"]:not(.disabled)',
                '.bubble-button.cancel:not(.disabled)', '.bubble-element.Button[class*="cancel"]:not(.disabled)'
            ];
            for (const sel of selectors) {
                buttonToClickModal = buttonSearchScope.querySelector(sel);
                if (buttonToClickModal && buttonToClickModal.offsetParent !== null && getComputedStyle(buttonToClickModal).display !== 'none' && getComputedStyle(buttonToClickModal).visibility !== 'hidden') {
                    buttonSelectorModal = sel; break;
                }
                buttonToClickModal = null;
            }
            if (!buttonToClickModal) {
                const allButtons = buttonSearchScope.querySelectorAll('.btn:not(.disabled), .bubble-element.Button:not(.disabled)');
                buttonToClickModal = Array.from(allButtons).find(btn =>
                    ((btn.textContent || '').toLowerCase().includes('cancel') || btn.classList.contains('cancel')) &&
                    btn.offsetParent !== null && getComputedStyle(btn).display !== 'none' && getComputedStyle(btn).visibility !== 'hidden'
                );
                if (buttonToClickModal) buttonSelectorModal = "Fallback: first visible button with 'cancel' in text or class";
            }
        }

        if (buttonToClickModal) {
            logDebug(`Modal Click: '${buttonToClickModal.textContent.trim()}' (sel: ${buttonSelectorModal}) in modal ("${modalTitle}") via ${event.key}.`);
            buttonToClickModal.click();
            event.preventDefault();
            event.stopPropagation();
        } else {
            if (DEBUG_MODE) {
                 logDebug(`Modal Click: No suitable button for ${event.key} in modal ("${modalTitle}").`);
            }
        }
    }
    document.addEventListener('keydown', handleGlobalKeyDown, true);

    function dispatchMouseEvents(element) { /* ... (no change) ... */
        if (!element) { logError("dispatchMouseEvents: element is null"); return false; }
        logDebug("dispatchMouseEvents on:", element);
        try {
            const downEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
            const upEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
            const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
            element.dispatchEvent(downEvent);
            element.dispatchEvent(upEvent);
            element.dispatchEvent(clickEvent);
            return true;
        } catch (e) { logError("dispatchMouseEvents Error:", e); return false; }
    }
    function standardClick(element) { /* ... (no change) ... */
        if (!element) { logError("standardClick: element is null"); return false; }
        logDebug("standardClick on:", element);
        try { element.click(); return true;
        } catch (e) { logError("standardClick Error:", e); return false; }
    }
    function isDropdownOpen(dropdownTriggerElement) { /* ... (no change) ... */
        if (!dropdownTriggerElement) return false;
        const actualDropdownContainer = dropdownTriggerElement.querySelector(DROPDOWN_CONTAINER_ACTUAL_SELECTOR);
        return actualDropdownContainer ? actualDropdownContainer.classList.contains('opened') : false;
    }
    function handleGenericFieldAttributeModal(modalElement) { /* ... (no change) ... */
        const nameInput = modalElement.querySelector(NAME_INPUT_SELECTOR_IN_MODAL);
        const typeDropdown = modalElement.querySelector(TYPE_DROPDOWN_SELECTOR_IN_MODAL);
        const listCheckbox = modalElement.querySelector(CHECKBOX_SELECTOR_IN_MODAL);
        if (nameInput) { if (document.activeElement !== nameInput && !nameInput.contains(document.activeElement)) { nameInput.focus(); } nameInput.removeEventListener('keydown', handleModalNavKeyPress); nameInput.addEventListener('keydown', handleModalNavKeyPress); }
        if (typeDropdown) { typeDropdown.removeEventListener('keydown', handleModalNavKeyPress); typeDropdown.addEventListener('keydown', handleModalNavKeyPress); }
        if (listCheckbox) { listCheckbox.removeEventListener('keydown', handleModalNavKeyPress); listCheckbox.addEventListener('keydown', handleModalNavKeyPress); }
    }
    function handleModalNavKeyPress(event) { /* ... (no change, ensure Esc propagation stop for dropdowns) ... */
        const { key, target, shiftKey } = event;
        const modalElement = target.closest(MODAL_CONTENT_SELECTOR);
        if (!modalElement) return;

        const nameInput = modalElement.querySelector(NAME_INPUT_SELECTOR_IN_MODAL);
        const typeDropdown = modalElement.querySelector(TYPE_DROPDOWN_SELECTOR_IN_MODAL);
        const listCheckbox = modalElement.querySelector(CHECKBOX_SELECTOR_IN_MODAL);

        if (!(nameInput && typeDropdown && listCheckbox)) {
            return;
        }

        if (key === 'Tab') {
            if (target === nameInput && !shiftKey) {
                logDebug("Nav Tab from Name Input"); event.preventDefault();
                if (typeDropdown) {
                    typeDropdown.focus(); logDebug("Nav Focused Type Dropdown.");
                    if (!isDropdownOpen(typeDropdown)) {
                        logDebug("Nav Attempting to open dropdown..."); standardClick(typeDropdown);
                        const captionContainer = typeDropdown.querySelector(DROPDOWN_CAPTION_SELECTOR);
                        if (captionContainer) { standardClick(captionContainer); dispatchMouseEvents(captionContainer); logDebug("Nav Dropdown open sequence complete on caption.");
                        } else { logError("Nav Caption container not found. Fallback: dispatch to main trigger."); dispatchMouseEvents(typeDropdown); }
                    }
                } else if (listCheckbox) { listCheckbox.focus(); }
            } else if (target === typeDropdown && !shiftKey) {
                logDebug("Nav Tab from Type Dropdown"); event.preventDefault();
                if (isDropdownOpen(typeDropdown)) {
                    logDebug("Nav Attempting to close dropdown...");
                    const captionContainer = typeDropdown.querySelector(DROPDOWN_CAPTION_SELECTOR);
                    if (captionContainer) dispatchMouseEvents(captionContainer); else dispatchMouseEvents(typeDropdown);
                    logDebug("Nav Dropdown close attempt complete.");
                }
                if (listCheckbox) { listCheckbox.focus(); logDebug("Nav Focused List Checkbox."); }
            } else if (target === listCheckbox && !shiftKey) { logDebug("Nav Tab from list checkbox, allowing default.");
            } else if (target === listCheckbox && shiftKey) {
                logDebug("Nav Shift+Tab from list checkbox."); event.preventDefault();
                if (typeDropdown) typeDropdown.focus(); else if (nameInput) nameInput.focus();
            } else if (target === typeDropdown && shiftKey) {
                logDebug("Nav Shift+Tab from type dropdown."); event.preventDefault();
                if (isDropdownOpen(typeDropdown)) {
                    const captionContainer = typeDropdown.querySelector(DROPDOWN_CAPTION_SELECTOR);
                    if (captionContainer) dispatchMouseEvents(captionContainer); else dispatchMouseEvents(typeDropdown);
                }
                if (nameInput) nameInput.focus();
            }
        }
        else if (key === ' ' && target === listCheckbox) {
            logDebug("Nav Space on List Checkbox."); event.preventDefault(); standardClick(target); logDebug("Nav Clicked Checkbox via Space.");
        }
        else if (key === 'Escape' && target.closest(TYPE_DROPDOWN_SELECTOR_IN_MODAL)) {
            if (typeDropdown && isDropdownOpen(typeDropdown)) {
                logDebug("Nav Escape on/in open dropdown: attempting to close.");
                const captionContainer = typeDropdown.querySelector(DROPDOWN_CAPTION_SELECTOR);
                if (captionContainer) dispatchMouseEvents(captionContainer); else dispatchMouseEvents(typeDropdown);
                typeDropdown.focus();
                event.preventDefault();
                event.stopPropagation(); // Crucial
                logDebug("Nav Closed dropdown via Escape, refocused trigger. Propagation stopped.");
            }
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            // Modal processing (no change from previous versions)
            if (mutation.type === 'childList' || (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class'))) {
                 const addedNodesForModals = mutation.type === 'childList' ? Array.from(mutation.addedNodes) : (mutation.target.nodeType === 1 ? [mutation.target] : []);
                 for (const node of addedNodesForModals) { /* ... modal processing as before ... */
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;
                    const modals = [];
                    if (node.matches && node.matches(MODAL_CONTENT_SELECTOR)) modals.push(node);
                    else if (node.querySelectorAll) modals.push(...node.querySelectorAll(MODAL_CONTENT_SELECTOR));
                    for (const modal of modals) {
                        const isGenericFieldModal = modal.querySelector(NAME_INPUT_SELECTOR_IN_MODAL) && modal.querySelector(TYPE_DROPDOWN_SELECTOR_IN_MODAL);
                        if (isGenericFieldModal) {
                            if (modal.offsetParent !== null && getComputedStyle(modal).display !== 'none' && getComputedStyle(modal).visibility !== 'hidden') {
                                if (!modal.dataset.tampermonkeyFieldModalProcessed) {
                                    if(DEBUG_MODE) { /* ... */ }
                                    modal.dataset.tampermonkeyFieldModalProcessed = 'true';
                                    handleGenericFieldAttributeModal(modal);
                                }
                            } else {
                                if (modal.dataset.tampermonkeyFieldModalProcessed) {
                                     if(DEBUG_MODE) { /* ... */ }
                                    delete modal.dataset.tampermonkeyFieldModalProcessed;
                                    modal.querySelector(NAME_INPUT_SELECTOR_IN_MODAL)?.removeEventListener('keydown', handleModalNavKeyPress);
                                    modal.querySelector(TYPE_DROPDOWN_SELECTOR_IN_MODAL)?.removeEventListener('keydown', handleModalNavKeyPress);
                                    modal.querySelector(CHECKBOX_SELECTOR_IN_MODAL)?.removeEventListener('keydown', handleModalNavKeyPress);
                                }
                            }
                        }
                    }
                }
            }

            // Create New Button Styling
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches(CREATE_NEW_BUTTON_SELECTOR)) {
                            styleCreateNewButton(node);
                        }
                        node.querySelectorAll(CREATE_NEW_BUTTON_SELECTOR).forEach(styleCreateNewButton);
                    }
                });
            } else if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                if (mutation.target.nodeType === Node.ELEMENT_NODE && mutation.target.matches(CREATE_NEW_BUTTON_SELECTOR)) {
                    // Re-evaluate styling if style/class changes might affect visibility or if it wasn't hinted yet
                    if (mutation.target.offsetParent !== null && getComputedStyle(mutation.target).display !== 'none') {
                         // Only call if not already hinted, or if you want to re-evaluate context (though current logic prevents re-innerHTML)
                        if (mutation.target.dataset.keyHintAdded !== 'true') {
                            styleCreateNewButton(mutation.target);
                        }
                    }
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    function initialButtonScan() {
        logDebug("Performing initial scan for '.btn.add-new-type' buttons to style.");
        document.querySelectorAll(CREATE_NEW_BUTTON_SELECTOR).forEach(btn => {
            if (btn.offsetParent !== null && getComputedStyle(btn).display !== 'none') {
                styleCreateNewButton(btn);
            }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialButtonScan);
    } else {
        initialButtonScan();
    }

    logInfo(`Bubble.io enhancements script loaded. (v${GM_info.script.version}) - DEBUG_MODE is ${DEBUG_MODE ? 'ON' : 'OFF'}. Canvas padding is ${isCanvasPaddingEnabled ? 'ON' : 'OFF'}.`);
})();