// ==UserScript==
// @name         Taekus Card Details Interceptor
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Intercept Taekus API calls and provide card detail copying for all cards
// @author       Angus
// @match        https://app.taekus.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541579/Taekus%20Card%20Details%20Interceptor.user.js
// @updateURL https://update.greasyfork.org/scripts/541579/Taekus%20Card%20Details%20Interceptor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store card data
    let allCards = [];
    let cardDetails = {};

    // Intercept XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._method = method;
        this._url = url;
        return originalXHROpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(data) {
        const xhr = this;

        // Add event listener to capture response
        xhr.addEventListener('readystatechange', function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                handleAPIResponse(xhr._url, xhr.responseText);
            }
        });

        return originalXHRSend.apply(this, [data]);
    };

    // Intercept fetch API
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        return originalFetch.apply(this, arguments)
            .then(response => {
                if (response.ok) {
                    const clonedResponse = response.clone();
                    clonedResponse.text().then(text => {
                        handleAPIResponse(url, text);
                    });
                }
                return response;
            });
    };

    function handleAPIResponse(url, responseText) {
        try {
            // Check if it's the virtual cards endpoint
            if (url.includes('/api/banking/payment-cards/virtual/') && url.includes('cardAccountUuid=')) {
                const data = JSON.parse(responseText);
                if (Array.isArray(data)) {
                    allCards = data.map(card => ({
                        uuid: card.uuid,
                        nickname: card.nickname,
                        last_four: card.last_four,
                        postal_code: card.postal_code,
                        cardAccountUuid: extractCardAccountUuid(url),
                        status: card.status
                    }));
                    console.log('All cards intercepted:', allCards);

                    // Create card selection interface
                    createCardSelectionInterface();
                }
            }
        } catch (error) {
            // Silent error handling for non-JSON responses
        }
    }

    function extractCardAccountUuid(url) {
        const match = url.match(/cardAccountUuid=([^&]+)/);
        return match ? match[1] : null;
    }

    function extractUuidFromShowpanUrl(url) {
        const match = url.match(/uuid=([^&]+)/);
        return match ? match[1] : null;
    }

    function createCardSelectionInterface() {
        // Remove existing interface if present
        const existingInterface = document.getElementById('taekus-card-interface');
        if (existingInterface) {
            existingInterface.remove();
        }

        if (allCards.length === 0) return;

        // Create compact floating interface
        const interfaceDiv = document.createElement('div');
        interfaceDiv.id = 'taekus-card-interface';
        interfaceDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffffff;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            width: 280px;
        `;

        // Create select dropdown with all cards
        let optionsHtml = '<option value="">Select a card...</option>';
        allCards.forEach(card => {
            const statusIcon = card.status === 'ACTIVE' ? '●' : '○';
            optionsHtml += `<option value="${card.uuid}">${statusIcon} ${card.nickname} (****${card.last_four})</option>`;
        });

        interfaceDiv.innerHTML = `
            <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="color: #333; font-size: 14px;">Taekus Cards</strong>
                    <span style="background: #007bff; color: white; padding: 2px 6px; border-radius: 10px; font-size: 11px;">
                        ${allCards.length}
                    </span>
                </div>
                <select id="card-select" style="
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 13px;
                    background: white;
                ">
                    ${optionsHtml}
                </select>
            </div>

            <div id="card-details" style="display: none;">
                <div id="card-info" style="margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-radius: 4px; font-size: 12px;">
                </div>
                <div id="loading-indicator" style="
                    text-align: center;
                    padding: 8px;
                    color: #007bff;
                    font-size: 12px;
                    display: none;
                ">Loading card details...</div>
                <div id="copy-buttons" style="display: none;">
                    <button id="copy-wool" style="
                        width: 100%;
                        margin-bottom: 6px;
                        padding: 6px 12px;
                        background: #28a745;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">Copy Wool Format</button>
                    <button id="copy-fusion" style="
                        width: 100%;
                        margin-bottom: 6px;
                        padding: 6px 12px;
                        background: #17a2b8;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">Copy Fusion Format</button>
                </div>
            </div>

            <button id="close-interface" style="
                width: 100%;
                padding: 8px 12px;
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                margin-top: 8px;
            ">Close</button>
        `;

        document.body.appendChild(interfaceDiv);

        // Add event listeners
        const cardSelect = document.getElementById('card-select');
        const cardDetails = document.getElementById('card-details');
        const cardInfo = document.getElementById('card-info');
        const loadingIndicator = document.getElementById('loading-indicator');
        const copyButtons = document.getElementById('copy-buttons');

        cardSelect.addEventListener('change', (e) => {
            const selectedUuid = e.target.value;
            if (selectedUuid) {
                const card = allCards.find(c => c.uuid === selectedUuid);
                cardInfo.innerHTML = `
                    <strong>${card.nickname}</strong><br>
                    ****${card.last_four} • ZIP: ${card.postal_code}<br>
                    Status: <span style="color: ${card.status === 'ACTIVE' ? '#28a745' : '#6c757d'}">${card.status}</span>
                `;
                cardDetails.style.display = 'block';
                copyButtons.style.display = 'none';
                loadingIndicator.style.display = 'block';

                // Auto-fetch card details
                fetchCardDetails(selectedUuid);
            } else {
                cardDetails.style.display = 'none';
            }
        });

        document.getElementById('close-interface').addEventListener('click', () => {
            interfaceDiv.remove();
        });
    }

    function fetchCardDetails(uuid) {
        const card = allCards.find(c => c.uuid === uuid);
        if (!card) return;

        const loadingIndicator = document.getElementById('loading-indicator');

        // Get access token from localStorage
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('No access token found in localStorage');
            loadingIndicator.innerHTML = '<span style="color: #dc3545;">No Auth Token - Please refresh</span>';
            return;
        }

        const url = `https://app.taekus.com/api/banking/payment-cards/showpan/?cardAccountUuid=${card.cardAccountUuid}&uuid=${uuid}`;

        fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.text())
        .then(text => {
          const data = JSON.parse(text);
          const cardUuid = extractUuidFromShowpanUrl(url);
          cardDetails[cardUuid] = {
              pci_pan: data.pci_pan,
              pci_cvv: data.pci_cvv,
              pci_expiration_date: data.pci_expiration_date
          };
          updateCardCopyInterface(cardUuid);
        })
        .catch(error => {
            console.error('Error fetching card details:', error);
            loadingIndicator.innerHTML = '<span style="color: #dc3545;">Error loading details</span>';
        });
    }

    function updateCardCopyInterface(uuid) {
        const card = allCards.find(c => c.uuid === uuid);
        const details = cardDetails[uuid];

        if (!card || !details) return;

        // Parse card details
        const cardNumber = details.pci_pan;
        const expDate = details.pci_expiration_date;
        const expMonth = expDate.substring(0, 2);
        const expYear = expDate.substring(2, 4);
        const cvv = details.pci_cvv;
        const zip = card.postal_code;

        // Update the card info with detailed information
        const cardInfo = document.getElementById('card-info');
        cardInfo.innerHTML = `
            <strong>${card.nickname}</strong><br>
            <strong>Card:</strong> ${cardNumber}<br>
            <strong>Exp:</strong> ${expMonth}/${expYear} • <strong>CVV:</strong> ${cvv}<br>
            <strong>ZIP:</strong> ${zip}
        `;

        // Hide loading indicator and show copy buttons
        const loadingIndicator = document.getElementById('loading-indicator');
        const copyButtons = document.getElementById('copy-buttons');
        loadingIndicator.style.display = 'none';
        copyButtons.style.display = 'block';

        // Add event listeners for copy buttons
        const wool = `${cardNumber},${expMonth}/${expYear},${cvv},${zip}`;
        const fusion = `${cardNumber},${expMonth},${expYear},${cvv},${zip}`;

        // Remove existing listeners
        const copyWoolBtn = document.getElementById('copy-wool');
        const copyFusionBtn = document.getElementById('copy-fusion');

        copyWoolBtn.replaceWith(copyWoolBtn.cloneNode(true));
        copyFusionBtn.replaceWith(copyFusionBtn.cloneNode(true));

        document.getElementById('copy-wool').addEventListener('click', () => {
            copyToClipboard(wool);
            showNotification(`Wool format copied for ${card.nickname}!`);
        });

        document.getElementById('copy-fusion').addEventListener('click', () => {
            copyToClipboard(fusion);
            showNotification(`Fusion format copied for ${card.nickname}!`);
        });
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 20000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    console.log('Taekus Card Details Interceptor v1.2 loaded');
})();