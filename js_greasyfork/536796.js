// ==UserScript==
// @name         Wikipedia Sv-En Button
// @namespace    http://tampermonkey.net/
// @version      2025-05-22
// @description  Adds a button which switches between the Swedish and the English variant of a Wikipedia page.
// @author       Elias Braun
// @match        https://*.wikipedia.org/*
// @icon         https://raw.githubusercontent.com/eliasbraunv/WikipediaSvEn/refs/heads/main/sven6464.png
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536796/Wikipedia%20Sv-En%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/536796/Wikipedia%20Sv-En%20Button.meta.js
// ==/UserScript==

console.log(window.location);

function TLDcheck() {
    if (window.location.hostname === 'en.wikipedia.org') {
        return '🇸🇪';
    } else {
        return '🇪🇳';
    }
    return '';
}

console.log(TLDcheck());

function switchToLanguage(langCode, retries = 10) {
    const checkbox = document.getElementById('p-lang-btn-checkbox');

    if (checkbox && !checkbox.checked) {
        checkbox.click(); // Open the dropdown
        console.log('Checkbox clicked to open dropdown');
    }

    setTimeout(() => {
        const langLink = document.querySelector(`li.interlanguage-link[data-code="${langCode}"] a`);
        if (langLink) {
            console.log(`Navigating to language: ${langCode}`);
            window.location.href = langLink.href;
        } else if (retries > 0) {
            console.log(`Waiting for language link (${langCode})... Retries left: ${retries}`);
            switchToLanguage(langCode, retries - 1);
        } else {
            console.warn(`Could not find language link for "${langCode}"`);
        }
    }, 1);
}

const langBtn = document.querySelector('#p-lang-btn');

if (langBtn) {
    const simpleBtn = document.createElement('button');
    simpleBtn.textContent = TLDcheck();
    simpleBtn.className = 'cdx-button cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--weight-quiet cdx-button--action-progressive';
    simpleBtn.style.marginRight = '8px'; // spacing between new button and existing

    simpleBtn.addEventListener('click', () => {
        if (TLDcheck() === '🇸🇪') {
            switchToLanguage('sv');
        } else {
            switchToLanguage('en');
        }

    });

    langBtn.parentNode.insertBefore(simpleBtn, langBtn);
} else {
    console.log('Could not find the #p-lang-btn element');
}