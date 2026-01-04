// ==UserScript==
// @name         Cartel Empire - Quick Vault
// @namespace    baccy.ce
// @version      0.2
// @description  Adds a button beside the CE logo that automatically vaults all your cash when clicked. Visit your property page once for this to work, and then again if you move into a new property.
// @author       Baccy
// @match        https://*.cartelempire.online/*
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        GM_setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/534801/Cartel%20Empire%20-%20Quick%20Vault.user.js
// @updateURL https://update.greasyfork.org/scripts/534801/Cartel%20Empire%20-%20Quick%20Vault.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let propertyId = await GM.getValue('propertyId', null);

    if (location.pathname.includes('Property')) {
        propertyId = document.querySelector('[name="propertyId"]')?.getAttribute('value');
        if (propertyId) GM_setValue('propertyId', propertyId);
    }

    if (propertyId) {
        const logo = document.querySelector('#CeLogo');
        const button = document.createElement('button');
        button.textContent = 'Vault';
        button.style.cssText = 'color: rgb(255, 255, 255, 0.75); background-color: #333; border: none; border-radius: 6px; font-size: 12px; padding: 6px 12px; margin-left: 7px; cursor: pointer;';
        button.addEventListener('click', async function(e) {
            e.stopPropagation();
            e.preventDefault();

            const cash = parseInt(document.querySelector('.cashDisplay')?.textContent.replace(/,/g, '') || '0');
            if (cash === 0) return;

            const response = await fetch('/Property/Deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: new URLSearchParams({
                    Cash: cash,
                    propertyId: propertyId
                })
            });

            const text = await response.text();

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = text;

            const responseText = tempDiv.querySelector('p.card-text.fw-bold.text-white');
            if (responseText) {
                const responseElement = responseText.parentElement.parentElement;
                responseElement.id = 'quick-vault-container';
                const existingElement = document.querySelector('#quick-vault-container');
                if (existingElement) existingElement.remove();
                const target = document.querySelector('#mainBackground .container');
                if (target) target.prepend(responseElement);
            }
        });
        logo.parentElement.insertBefore(button, logo.nextSibling);
    }
})();