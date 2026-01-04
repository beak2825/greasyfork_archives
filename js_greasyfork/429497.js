// ==UserScript==
// @name        typing-practice
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       GM_openInTab
// @version     1.0
// @author      -
// @description 15.07.2021, 22:09:13
// @downloadURL https://update.greasyfork.org/scripts/429497/typing-practice.user.js
// @updateURL https://update.greasyfork.org/scripts/429497/typing-practice.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let gText;
    function openTypingPractice(text) {
        const baseUrl = "https://10fastfingers.com/widget/typingtest";
        const params = new URLSearchParams({
            dur: "60000",
            rand: "0",
            words: text,
        });
        const url = `${baseUrl}?${params.toString()}`.replace(/\+/g, "%20"); // 10fastfingers doesn't consider "+" as space
        GM_openInTab(url);
    }
    // Alt-T
    function detectHotKey(e) {
        // Use "KeyboardEvent.code" to support the same key position regardless of keyboard layout
        return e.altKey && e.code === "KeyT";
    }
    function onKeyDown(e) {
        if (gText && detectHotKey(e)) {
            const cleanText = gText.toLowerCase().split(/\s/).join(" ");
            openTypingPractice(cleanText);
        }
    }
    function onSelectionChange() {
        // Enable hotkey only when there's a selection
        document.removeEventListener("keydown", onKeyDown);
        const selection = document.getSelection();
        gText = selection === null || selection === void 0 ? void 0 : selection.toString().trim();
        if (!gText) {
            return;
        }
        document.addEventListener("keydown", onKeyDown);
    }
    function register() {
        document.addEventListener("selectionchange", onSelectionChange);
    }
    function main() {
        register();
    }
    main();

}());
