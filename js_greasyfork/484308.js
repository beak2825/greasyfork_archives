// ==UserScript==
// @name         Fluz Multi Use Card Balances
// @description  Display card balances in a box on the top left of the webpage
// @version      1.0
// @license      MIT
// @author       jnjustice
// @namespace    http://tampermonkey.net
// @match        https://power.fluz.app/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/484308/Fluz%20Multi%20Use%20Card%20Balances.user.js
// @updateURL https://update.greasyfork.org/scripts/484308/Fluz%20Multi%20Use%20Card%20Balances.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // User should set these values

    const userCookie = "YOUR_COOKIE_VALUE"; // get cookie from document.cookie in Chrome console
    const refreshToken = "YOUR_REFRESH_TOKEN"; // get refresh token from https://power.fluz.app/api/v1/user/login preview

    // Create the balanceBox element
    const balanceBox = document.createElement('div');
    balanceBox.id = 'balanceBox';
    balanceBox.style = 'position: fixed; top: 10px; left: 10px; background-color: white; color: black; border: 2px solid red; padding: 10px; z-index: 10000; box-shadow: 0px 0px 10px rgba(0,0,0,0.5);';
    document.body.appendChild(balanceBox);

    // Function to format numbers as currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    function getProgramStatusMessage(balance) {
        if (balance < 50000) {
            return "Program is currently unavailable. All transactions with this card will be declined.";
        } else if (balance >= 50000 && balance <= 250000) {
            return "Program is running low. Your transactions may be declined.";
        } else {
            return "Program is ready for use. Check here for program status updates.";
        }
    }

    async function fetchAccessToken() {
        const url = "https://power.fluz.app/api/v1/auth/token/refresh";
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Cookie": userCookie,
			"dnt": "1",
			"origin": "https://power.fluz.app",
			"referer": "https://power.fluz.app/dashboard",
			"sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
        };
        const body = JSON.stringify({
            refreshToken: refreshToken
        });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: body
            });
            const data = await response.json();
            console.log("AccessToken:", data.accessToken);
            return data.accessToken;
        } catch (error) {
            console.error('Error fetching access token:', error);
            return null;
        }
    }

    async function fetchBalance(url, accessToken) {
			const headers = {
            "Accept": "application/json",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Authorization": "Bearer " + accessToken,
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
            "Cookie": userCookie,
            "DNT": "1",
            "Referer": "https://power.fluz.app/dashboard",
            "Sec-CH-UA": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
            "Sec-CH-UA-Mobile": "?0",
            "Sec-CH-UA-Platform": "\"Windows\"",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
        };

        const response = await fetch(url, { method: 'GET', headers: headers });
        const data = await response.json();
        console.log("Fetched data from:", url, data); // Log the fetched data
        return data;
    }

    async function displayBalances() {
        try {
            const accessToken = await fetchAccessToken();
            if (!accessToken) {
                console.error('Failed to get access token');
                return;
            }

            const marquetaBalance = await fetchBalance('https://power.fluz.app/api/v1/virtual-card/program-balance/MARQETA', accessToken);
			const highnoteBalance = await fetchBalance('https://power.fluz.app/api/v1/virtual-card/program-balance/HIGHNOTE', accessToken);

			console.log("Marqueta Balance:", marquetaBalance); // Log Marqueta Balance
			console.log("Highnote Balance:", highnoteBalance); // Log Highnote Balance

            const marquetaStatusMessage = getProgramStatusMessage(marquetaBalance.vendorBalance);
            const marquetaColor = marquetaBalance.vendorBalance < 50000 ? "#ff5050" : (marquetaBalance.vendorBalance <= 250000 ? "#FFA918" : "#30DA42");
            const marquetaDisplay = `<div style="background-color: ${marquetaColor};">Marqueta Visa - BIN 475436 - 1.5% - ${formatCurrency(marquetaBalance.vendorBalance)} - ${marquetaStatusMessage}</div>`;

            const highnoteMasterCardStatusMessage = getProgramStatusMessage(highnoteBalance.vendorBalance.Mastercard);
            const highnoteMasterCardColor = highnoteBalance.vendorBalance.Mastercard < 50000 ? "#ff5050" : (highnoteBalance.vendorBalance.Mastercard <= 250000 ? "#FFA918" : "#30DA42");
            const highnoteMasterCardDisplay = `<div style="background-color: ${highnoteMasterCardColor};">Highnote MasterCard - BIN 537875 - 1.5% - ${formatCurrency(highnoteBalance.vendorBalance.Mastercard)} - ${highnoteMasterCardStatusMessage}</div>`;

            const highnoteVisaStatusMessage = getProgramStatusMessage(highnoteBalance.vendorBalance.Visa);
            const highnoteVisaColor = highnoteBalance.vendorBalance.Visa < 50000 ? "#ff5050" : (highnoteBalance.vendorBalance.Visa <= 250000 ? "#FFA918" : "#30DA42");
            const highnoteVisaDisplay = `<div style="background-color: ${highnoteVisaColor};">Highnote Visa - BIN 462036 - 1% - ${formatCurrency(highnoteBalance.vendorBalance.Visa)} - ${highnoteVisaStatusMessage}</div>`;

            balanceBox.innerHTML = `<p>${marquetaDisplay}</p>`;
            balanceBox.innerHTML += `<p>${highnoteMasterCardDisplay}</p>`;
            balanceBox.innerHTML += `<p>${highnoteVisaDisplay}</p>`;

        } catch (error) {
            console.error('Error displaying balances:', error);
        }
    }

    displayBalances();
})();
