// ==UserScript==
// @name         LARS FOCUS KEYBIND
// @namespace    http://tampermonkey.net/
// @version      2025-08-23
// @description  Enables mouse-less navigation in Gemini Chats by implementing a simple keybind, which toggles focus on and off the input field (=> Bound to 'CTRL+SPACE' per default)
// @author       larsFyzza, Google Gemini
// @match        https://gemini.google.com/app/*
// @match        https://gemini.google.com/app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @run-at       document-idle
// @grant        none
// @license      MIT:
// @downloadURL https://update.greasyfork.org/scripts/547054/LARS%20FOCUS%20KEYBIND.user.js
// @updateURL https://update.greasyfork.org/scripts/547054/LARS%20FOCUS%20KEYBIND.meta.js
// ==/UserScript==
//
//
//
// Works by calling element.focus() and element.blur().
// Most of this was written by Gemini, which is objectively funny.
// This is my first time publishing code and actually feeling like it's not *completely* unnecessary,
// because I was actually pretty annoyed with having to use my mouse for Gemini. With this: QoL imrpovement
// achieved.
//
//
// Regards,
// LARS!!!!!!!!!
//
//
//                       DEFINE KEYBIND HERE!!!!!
//                   ↙
const KEYBIND = {
    key: ' ',
    ctrlKey: true,
    altKey: false,
    shiftKey: false,
};



(function() {
    'use strict';
    console.log("LARS SCRIPT WURDE GELADEN! ICH WIEDERHOLE, LARS' SCRIPT HAT DEN DOM-TREE INFILTRIERT!!!!")
    function togglePromptFocus() {
        const promptField = document.querySelector('div.ql-editor.textarea[contenteditable="true"]');
        if (promptField) {
            // Check if the prompt field is already the active element
            if (document.activeElement === promptField) {
                // If it is, remove the focus
                promptField.blur();
                console.log("Unfocussed the prompt field.");
            } else {
                // If not, set the focus
                promptField.focus();
                console.log("Focussed the prompt field.");
            }
        } else {
            console.log("Focussable Element not found (Check the script's querySelector).");
        }
    }
    document.addEventListener('keydown', function(event) {
        if (event.key === KEYBIND.key && event.ctrlKey === KEYBIND.ctrlKey && event.altKey === KEYBIND.altKey && event.shiftKey === KEYBIND.shiftKey) {
            event.preventDefault();
            togglePromptFocus();
        }
    });
})();