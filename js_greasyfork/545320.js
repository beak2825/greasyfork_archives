// ==UserScript==
// @name         Unclosable Pop-Up
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  List editor pop-up does not close when clicked outside of it
// @author       chabab (fixed by gemini)
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545320/Unclosable%20Pop-Up.user.js
// @updateURL https://update.greasyfork.org/scripts/545320/Unclosable%20Pop-Up.meta.js
// ==/UserScript==

'use strict';

const POPUP_WRAP = '.list-editor-wrap';
const POPUP_CONTENT = '.el-dialog';
const POPUP_DROPDOWNS = '.el-popper';
const MSG_BOX = '.el-message-box';
let activePopupContent = null;

function blockOutsideClick(event) {
    if (activePopupContent && !activePopupContent.contains(event.target) && !event.target.closest(POPUP_DROPDOWNS) && !event.target.closest(MSG_BOX)) {
        event.stopImmediatePropagation();
    }
}

function onPopupAdded(popupWrap) {
    const content = popupWrap.querySelector(POPUP_CONTENT);
    if (content) {
        activePopupContent = content;
        window.addEventListener('click', blockOutsideClick, true);
    }
}

function onPopupRemoved() {
    window.removeEventListener('click', blockOutsideClick, true);
    activePopupContent = null;
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === 1 && node.matches(POPUP_WRAP)) {
                onPopupAdded(node);
                return;
            }
        }

        for (const node of mutation.removedNodes) {
            if (node.nodeType === 1 && node.matches(POPUP_WRAP)) {
                onPopupRemoved();
                return;
            }
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});

const existingPopup = document.querySelector(POPUP_WRAP);
if (existingPopup) onPopupAdded(existingPopup);
