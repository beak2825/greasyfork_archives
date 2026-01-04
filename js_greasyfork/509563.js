// ==UserScript==
// @name         Advanced Bypass Paywall with Test Credit Cards
// @namespace    socuul.12ft_shortcut_advanced
// @version      2.3.0
// @description  Bypass article paywalls and fetch test credit card data if payment is required.
// @author       SoCuul
// @license      MIT
// @include      *://*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      developers.bluesnap.com
// @downloadURL https://update.greasyfork.org/scripts/509563/Advanced%20Bypass%20Paywall%20with%20Test%20Credit%20Cards.user.js
// @updateURL https://update.greasyfork.org/scripts/509563/Advanced%20Bypass%20Paywall%20with%20Test%20Credit%20Cards.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // List of custom bypass handlers for specific websites
    const customBypassSites = {
        'nytimes.com': 'https://12ft.io/proxy?q=',
        'wsj.com': 'https://archive.ph/',
        'forbes.com': 'https://outline.com/'
    };

    // Helper function to construct bypass URL
    function constructBypassUrl(base, url) {
        return base + encodeURIComponent(url);
    }

    // General paywall bypass using 12ft.io
    function bypassWith12ft() {
        const newUrl = constructBypassUrl('https://12ft.io/proxy?q=', window.location.href);
        GM_openInTab(newUrl, { active: true });
        GM_notification({ text: "Paywall bypassed via 12ft.io", timeout: 3000 });
    }

    // Custom bypass logic based on specific site handler
    function handleCustomBypass() {
        const hostname = window.location.hostname;
        for (const site in customBypassSites) {
            if (hostname.includes(site)) {
                const newUrl = constructBypassUrl(customBypassSites[site], window.location.href);
                GM_openInTab(newUrl, { active: true });
                GM_notification({ text: `Custom bypass applied for ${site}`, timeout: 3000 });
                return;
            }
        }
        bypassWith12ft();
    }

    // Function to bypass and replace the current tab
    function replaceTabWithBypass() {
        const newUrl = constructBypassUrl('https://12ft.io/proxy?q=', window.location.href);
        window.location.href = newUrl;
    }

    // Add bypass options to the context menu
    GM_registerMenuCommand("Bypass Paywall (New Tab)", handleCustomBypass, "b");
    GM_registerMenuCommand("Bypass Paywall (Replace Current Tab)", replaceTabWithBypass, "r");

    // Option to copy the bypass URL to the clipboard
    GM_registerMenuCommand("Copy Bypass URL", () => {
        const bypassUrl = constructBypassUrl('https://12ft.io/proxy?q=', window.location.href);
        GM_setClipboard(bypassUrl);
        GM_notification({ text: "Bypass URL copied to clipboard!", timeout: 2000 });
    }, "c");

    // Keyboard shortcut for quick bypass
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'b') {
            handleCustomBypass();
        }
    });

    // Automatically trigger bypass for specific sites
    if (Object.keys(customBypassSites).some(site => window.location.hostname.includes(site))) {
        handleCustomBypass();
    }

    // Fetch test credit card data from Bluesnap
    async function fetchCreditCardData() {
        const url = 'https://developers.bluesnap.com/reference/test-credit-cards';
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (response) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const creditCards = [];

                    const rows = doc.querySelectorAll('table#test-card-numbers tbody tr');
                    if (rows.length === 0) {
                        GM_notification({ text: "No credit card data found", timeout: 2000 });
                        return resolve([]);
                    }

                    rows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        creditCards.push({
                            cardType: cells[0]?.textContent.trim(),
                            cardNumber: cells[1]?.textContent.trim(),
                            expDate: cells[2]?.textContent.trim(),
                            result: cells[3]?.textContent.trim()
                        });
                    });

                    resolve(creditCards);
                },
                onerror: (error) => {
                    console.error('Error fetching credit card data:', error);
                    GM_notification({ text: "Failed to fetch test credit card data", timeout: 2000 });
                    reject(error);
                }
            });
        });
    }

    // Function to display fetched credit card data
    async function displayCreditCards() {
        try {
            const cards = await fetchCreditCardData();
            if (cards.length > 0) {
                console.table(cards);
                const cardInfo = cards.map(card => `${card.cardType}: ${card.cardNumber} (Exp: ${card.expDate})`).join('\n');
                GM_notification({ text: "Test credit cards fetched!", timeout: 3000 });
                alert("Test Credit Cards:\n" + cardInfo);
            } else {
                alert("No test credit cards available.");
            }
        } catch (error) {
            alert("Error fetching credit cards. Check console for details.");
        }
    }

    // Check for payment forms or subscription URLs
    function checkForPayment() {
        const isPaymentPage = document.querySelector("form[action*='payment']") || /paywall|subscribe|payment/i.test(window.location.href);
        if (isPaymentPage && confirm("Payment detected. Would you like to fetch test credit card data?")) {
            displayCreditCards();
        }
    }

    // Run payment check after page load
    window.addEventListener('load', checkForPayment);

})();
