// ==UserScript==
// @name         Solid Tab Title Changer
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Change Solidgate tab title.
// @author       Swiftlyx
// @match        https://canary.solidgate.com/*
// @match        https://hub.solidgate.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524856/Solid%20Tab%20Title%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/524856/Solid%20Tab%20Title%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
})();
