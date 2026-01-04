// ==UserScript==
// @name        Google Translate Auto Language Enhanced
// @namespace   https://greasyfork.org/en/users/1030895-universedev
// @version     2.5
// @author      UniverseDev
// @license     GPL-3.0-or-later
// @description Automatically set the target language to English based on detected source language changes and auto-trigger translation if page language differs from browser language.
// @match       *://translate.google.*/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/520372/Google%20Translate%20Auto%20Language%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/520372/Google%20Translate%20Auto%20Language%20Enhanced.meta.js
// ==/UserScript==

"use strict";

const targetLang = "en";
const browserLang = navigator.language.split('-')[0];

function setTargetLanguage() {
    const selector = `[data-language-code="${targetLang}"]`;
    const targetTab = document.querySelector(selector);
    if (targetTab && targetTab.getAttribute("aria-selected") !== "true") {
        targetTab.click();
    }
}

function observeSourceLanguage() {
    const sourceLangTab = document.querySelector("[role=tablist] [aria-selected='true']");
    if (sourceLangTab) {
        const observer = new MutationObserver(() => {
            setTargetLanguage();
        });
        observer.observe(sourceLangTab, { characterData: true, subtree: true });
    }
}

function detectPageLanguage() {
    const pageLang = document.documentElement.lang || document.querySelector("html").getAttribute("lang");
    if (pageLang && pageLang !== browserLang) {
        console.log(`Detected page language (${pageLang}) differs from browser language (${browserLang}). Triggering translation.`);
        setTargetLanguage();
    }
}

function init() {
    setTargetLanguage();
    observeSourceLanguage();
    detectPageLanguage();
}

window.addEventListener("load", init);