// ==UserScript==
// @name         Zendesk Solid
// @namespace    http://tampermonkey.net/
// @version      1.21
// @description  Add Solid context menus for email, card, and cardholder searches.
// @author       Swiftlyx
// @match        https://askcrew.zendesk.com/agent/*
// @match        https://canary.solidgate.com/*
// @match        https://hub.solidgate.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522814/Zendesk%20Solid.user.js
// @updateURL https://update.greasyfork.org/scripts/522814/Zendesk%20Solid.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createSolidContextMenus() {
        GM_registerMenuCommand('Search selected email in Solid', () => {
            const selection = window.getSelection().toString().trim();
            const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

            if (emailRegex.test(selection)) {
                const solidUrl = `https://canary.solidgate.com/subscriptions/subscription?customer_email=${encodeURIComponent(selection)}`;
                GM_openInTab(solidUrl, { active: true });
            } else {
                alert('Please select a valid email address.');
            }
        });

        GM_registerMenuCommand('Search selected card in Solid', () => {
            const selection = window.getSelection().toString().trim().replace(/\s+/g, '');
            const binRegex = /^\d{6}$/;
            const lastFourRegex = /^\d{4}$/;
            const fullCardRegex = /^(\d{6})(?:\d*)(\d{4})$/;

            if (binRegex.test(selection)) {
                const solidUrl = `https://canary.solidgate.com/payments/order?card_bin=${selection}`;
                GM_openInTab(solidUrl, { active: true });
            } else if (lastFourRegex.test(selection)) {
                const solidUrl = `https://canary.solidgate.com/payments/order?card_last_four=${selection}`;
                GM_openInTab(solidUrl, { active: true });
            } else if (fullCardRegex.test(selection)) {
                const match = fullCardRegex.exec(selection);
                const bin = match[1];
                const lastFour = match[2];
                const solidUrl = `https://canary.solidgate.com/payments/order?card_bin=${bin}&card_last_four=${lastFour}`;
                GM_openInTab(solidUrl, { active: true });
            } else {
                alert('Please select a valid card number. Examples:\n- First 6 digits (BIN)\n- Last 4 digits\n- Full card number.');
            }
        });

        GM_registerMenuCommand('Search selected cardholder name in Solid', () => {
            const selection = window.getSelection().toString().trim();
            const nameRegex = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)+$/; // Allow mixed-case names with spaces

            if (nameRegex.test(selection)) {
                const solidUrl = `https://canary.solidgate.com/payments/order?cardholder_name=${encodeURIComponent(selection)}`;
                GM_openInTab(solidUrl, { active: true });
            } else {
                alert('Please select a valid cardholder name.');
            }
        });
    }

    function initialize() {
        console.log('Zendesk Solid Context Menu script initialized.');
        createSolidContextMenus();
    }

    function extractParameterFromURL(paramName) {
        const urlParams = new URLSearchParams(window.location.search);
        const value = urlParams.get(paramName);
        return value ? decodeURIComponent(value) : null;
    }

    function changeTabTitle() {
        const emailFromURL = extractParameterFromURL('customer_email');
        if (emailFromURL) {
            document.title = emailFromURL;
            return;
        }

        const cardBin = extractParameterFromURL('card_bin');
        const cardLastFour = extractParameterFromURL('card_last_four');
        if (cardBin && cardLastFour) {
            document.title = `${cardBin}-${cardLastFour}`;
            return;
        }
        if (cardBin) {
            document.title = cardBin;
            return;
        }
        if (cardLastFour) {
            document.title = cardLastFour;
            return;
        }

        const cardholderName = extractParameterFromURL('cardholder_name');
        if (cardholderName) {
            document.title = cardholderName;
            return;
        }

        const emailElement = document.querySelector('div[data-testid="user_email_value"]');
        if (emailElement && emailElement.textContent.trim()) {
            document.title = emailElement.textContent.trim();
            return;
        }

        const emailSpanElement = document.querySelector('div[class*="_root_8z012_1"] span');
        if (emailSpanElement && emailSpanElement.textContent.trim()) {
            document.title = emailSpanElement.textContent.trim();
            return;
        }
    }

    changeTabTitle();

    let lastURL = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== lastURL) {
            lastURL = window.location.href;
            changeTabTitle();
        }

        const emailElement = document.querySelector('div[data-testid="user_email_value"]');
        const emailSpanElement = document.querySelector('div[class*="_root_8z012_1"] span');

        const currentEmail =
            (emailElement && emailElement.textContent.trim()) ||
            (emailSpanElement && emailSpanElement.textContent.trim());

        if (currentEmail && document.title !== currentEmail) {
            changeTabTitle();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    initialize();
})();
