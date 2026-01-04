// ==UserScript==
// @name         OpenAI Playground Hotkeys and Accessibility Enhancements
// @namespace    http://tampermonkey.net/
// @license      MIT
// @author       Rekt
// @version      1.1.0
// @description  OpenAI playground accessibility enhancements with keyboard navigation. Quickly edit/delete/expand messages.
// @match        https://platform.openai.com/playground/prompts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533064/OpenAI%20Playground%20Hotkeys%20and%20Accessibility%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/533064/OpenAI%20Playground%20Hotkeys%20and%20Accessibility%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tracks if user is editing a message
    let isEditing = false;

    // --- Message Box and Action Selectors ---
    function getMessageBoxes() {
        return Array.from(document.querySelectorAll("div.LT9iz > div > div > div:nth-child(1) > div"));
    }

    function getButtonsBarInMessageBox(msgBox) {
        return msgBox.querySelector(".rqgky > ._5qprQ");
    }

    function getButtonsInMessageBox(msgBox) {
        let btnBar = getButtonsBarInMessageBox(msgBox);
        if (!btnBar) return [];
        return Array.from(btnBar.querySelectorAll("button")).filter(btn => btn.offsetParent !== null);
    }

    // --- Message Type Detection ---
    function isAssistantMessage(msgBox) {
        let roleElement = msgBox.querySelector("div");
        if (roleElement && roleElement.innerText) {
            return roleElement.innerText.toLowerCase().includes("assistant");
        }
        let boxes = getMessageBoxes();
        let idx = boxes.indexOf(msgBox);
        return idx !== -1 && idx % 2 === 1;
    }

    // --- Robust Edit Button Selector ---
    function getEditButton(msgBox) {
        let btnBar = getButtonsBarInMessageBox(msgBox);
        if (!btnBar) return null;
        let isAssistant = isAssistantMessage(msgBox);
        let btns = getButtonsInMessageBox(msgBox);

        if (isAssistant) {
            let btn = btnBar.querySelector("button:nth-child(1)");
            if (btn && btn.offsetParent !== null) return btn;
        } else {
            let btn = btnBar.querySelector("button:nth-child(4)");
            if (btn && btn.offsetParent !== null) return btn;
        }

        for (let btn of btns) {
            let svg = btn.querySelector("svg");
            let ariaLabel = svg ? svg.getAttribute("aria-label") : "";
            if (
                (btn.innerText && btn.innerText.toLowerCase().includes('edit')) ||
                (btn.title && btn.title.toLowerCase().includes('edit')) ||
                (ariaLabel && ariaLabel.toLowerCase().includes('edit'))
            ) {
                return btn;
            }
        }
        return null;
    }

    // --- Delete Button Selector ---
    function getDeleteButton(msgBox) {
        let btnBar = getButtonsBarInMessageBox(msgBox);
        if (!btnBar) return null;
        let btns = getButtonsInMessageBox(msgBox);
        for (let btn of btns) {
            let svg = btn.querySelector("svg");
            let ariaLabel = svg ? svg.getAttribute("aria-label") : "";
            if (
                (btn.innerText && btn.innerText.toLowerCase().includes('delete')) ||
                (btn.title && btn.title.toLowerCase().includes('delete')) ||
                (ariaLabel && ariaLabel.toLowerCase().includes('delete')) ||
                (ariaLabel && ariaLabel.toLowerCase().includes('trash'))
            ) {
                return btn;
            }
        }
        if (btns.length) return btns[btns.length - 1];
        return null;
    }

    // --- Expand Button Selector ---
    function getExpandButton(msgBox) {
        let btn = msgBox.querySelector(".G3JSV .BODGE > button");
        return btn && btn.offsetParent !== null ? btn : null;
    }

    // --- Keyboard + Click State ---
    let selectedIdx = 0;

    // --- Highlight/Select Logic ---
    function highlightSelected(noScroll) {
        const boxes = getMessageBoxes();
        boxes.forEach((box, idx) => {
            box.style.outline = "";
            box.style.zIndex = "";
            box.dataset.vimnavSelected = "";
        });
        if (boxes[selectedIdx]) {
            if (!noScroll) boxes[selectedIdx].scrollIntoView({block: "center", behavior: "smooth"});
            boxes[selectedIdx].style.outline = "2px solid #00ffd0";
            boxes[selectedIdx].style.zIndex = "10";
            boxes[selectedIdx].dataset.vimnavSelected = "1";
        }
    }

    // --- Input Blocking ---
    function notInInput() {
        const ae = document.activeElement;
        if (!ae) return true;
        if (ae.matches("input, textarea, select")) return false;
        if (ae.closest("[contenteditable='true']")) return false;
        return true;
    }

    function inContentEditable() {
        const ae = document.activeElement;
        if (!ae) return false;
        if (ae.closest("[contenteditable='true']")) return true;
        return false;
    }

    // --- Move Selection ---
    function moveSelection(delta) {
        const boxes = getMessageBoxes();
        if (!boxes.length) return;
        selectedIdx = Math.max(0, Math.min(selectedIdx + delta, boxes.length - 1));
        highlightSelected();
    }

    // --- Toggle Edit for Selected Message ---
    function toggleEditOfSelectedMessage() {
        const boxes = getMessageBoxes();
        if (!boxes.length || selectedIdx >= boxes.length) return;
        const box = boxes[selectedIdx];
        const btn = getEditButton(box);
        if (btn) {
            btn.click();
        }
    }

    // --- Toggle Expand for Selected Message ---
    function expandSelectedMessage() {
        const boxes = getMessageBoxes();
        if (!boxes.length || selectedIdx >= boxes.length) return;
        const box = boxes[selectedIdx];
        const btn = getExpandButton(box);
        if (btn) btn.click();
    }

    // --- Keyboard Navigation, Expand/Contract, Toggle Edit, Delete ---
    document.addEventListener("keydown", function(e) {
        if (e.key === 'Escape' && inContentEditable()) {
            toggleEditOfSelectedMessage();
            e.preventDefault();
            return;
        }
        if (isEditing) return; // Prevent navigation when editing
        if (!notInInput()) return;
        const boxes = getMessageBoxes();
        if (!boxes.length) return;

        if (e.key === 'j' || e.key === 'ArrowDown') {
            moveSelection(+1);
            e.preventDefault();
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
            moveSelection(-1);
            e.preventDefault();
        } else if (e.key === 'e') {
            toggleEditOfSelectedMessage();
            e.preventDefault();
        } else if (e.key === 'x' || e.key === 'Delete') {
            let box = boxes[selectedIdx];
            let btn = getDeleteButton(box);
            if (btn) {
                btn.click();
                e.preventDefault();
            }
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            if (!inContentEditable()) {
                expandSelectedMessage();
                e.preventDefault();
            }
        }
    });

    // --- Click/DoubleClick for Selection & Expanding ---
    function handleMsgBoxClick(e, idx) {
        selectedIdx = idx;
        highlightSelected(true);
    }

    function handleMsgBoxDoubleClick(e, idx) {
        selectedIdx = idx;
        highlightSelected(true);
        expandSelectedMessage();
    }

    // --- On New Messages/UI Mutation: Maintain Highlight, Re-install Click Listeners ---
    function ensureHighlightAndListeners() {
        const boxes = getMessageBoxes();
        boxes.forEach((box, idx) => {
            if (!box.dataset.vimnavClickSet) {
                box.addEventListener('click', e => handleMsgBoxClick(e, idx));
                box.addEventListener('dblclick', e => handleMsgBoxDoubleClick(e, idx));
                box.dataset.vimnavClickSet = '1';
            }
            // Add focus/blur listeners to editable elements within message boxes
            const editableElements = box.querySelectorAll("[contenteditable='true'], input, textarea");
            editableElements.forEach(el => {
                el.addEventListener('focus', () => {
                    isEditing = true;
                });
                el.addEventListener('blur', () => {
                    isEditing = false;
                });
            });
        });
        if (selectedIdx >= boxes.length) selectedIdx = boxes.length - 1;
        if (selectedIdx < 0) selectedIdx = 0;
        highlightSelected(true);
    }

    // Initial Setup
    setTimeout(ensureHighlightAndListeners, 1500);

    // Observe DOM Changes
    const observer = new MutationObserver(ensureHighlightAndListeners);
    observer.observe(document.body, {childList: true, subtree: true});

    // Expose for Debugging
    window.OpenAIPlaygroundMsgNav = {
        getMessageBoxes,
        highlightSelected,
        moveSelection,
        getEditButton,
        getDeleteButton,
        expandSelectedMessage,
        toggleEditOfSelectedMessage
    };
})();