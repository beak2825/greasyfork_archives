// ==UserScript==
// @name         Cartel Empire - Property Vault Withdraw Buttons
// @namespace    baccy.ce
// @version      0.1.5
// @description  Adds buttons that input amounts of cash for withdrawing, and adds a magic button that will set your current cash to its value after clicking withdraw/deposit
// @author       Baccy (Idea from Titanic_'s Torn Script)
// @match        https://cartelempire.online/Property
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/532742/Cartel%20Empire%20-%20Property%20Vault%20Withdraw%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/532742/Cartel%20Empire%20-%20Property%20Vault%20Withdraw%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const magicButton = 1000000; // Change to the value you want. Currently 1m.



    async function init() {
        const header = [...document.querySelectorAll('.header-section')].find(el => el.textContent.includes('Vault'));
        if (!header) return;
        header.style.cssText = 'gap: 10px; display: flex; align-items: center;';

        let enabled = await GM.getValue('enabled', true);
        const toggle = document.createElement('button');
        toggle.textContent = enabled ? 'Disable Vault Buttons' : 'Enable Vault Buttons';
        toggle.style.cssText = 'background-color: #333; color: #fff; border: none; border-radius: 6px; font-size: 12px; padding: 6px 12px; cursor: pointer;';
        toggle.addEventListener('click', async () => {
            enabled = !enabled;
            toggle.textContent = enabled ? 'Disable Vault Buttons' : 'Enable Vault Buttons';
            await GM.setValue('enabled', enabled);

            const refresh = document.createElement('button');
            refresh.textContent = '⟳';
            refresh.title = 'Refresh';
            refresh.style.cssText = 'all: unset; cursor: pointer; font-size: 18px; padding: 4px;';
            refresh.addEventListener('click', () => window.location.reload());
            header.appendChild(refresh);
        });
        header.appendChild(toggle);

        if (!enabled) return;

        const buttons = [
            {value: 10000, display: '10k'},
            {value: 25000, display: '25k'},
            {value: 50000, display: '50k'},
            {value: 100000, display: '100k'},
            {value: 250000, display: '250k'},
            {value: 500000, display: '500k'},
            {value: 1000000, display: '1m'},
            {value: 2500000, display: '2.5m'},
            {value: 5000000, display: '5m'},
            {value: 10000000, display: '10m'}
        ];

        const targetElement = document.querySelector('.row.mb-4.g-0.align-items-center.text-center');

        const parentContainer = document.createElement('div');
        parentContainer.style.marginBottom = '20px';
        parentContainer.classList.add('withdraw-container');

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('custom-button-container');

        const successMessage = document.createElement('p');
        successMessage.className = 'card-text fw-bold';
        successMessage.style.cssText = 'text-align: center; margin-top: 10px;';
        targetElement.parentElement.appendChild(successMessage);

        const newWithdrawInput = document.createElement('input');
        newWithdrawInput.type = 'text';
        newWithdrawInput.className = 'form-control allowAbbreviation';
        newWithdrawInput.value = 0;

        const newDepositInput = document.createElement('input');
        newDepositInput.type = 'text';
        newDepositInput.className = 'form-control allowAbbreviation';
        newDepositInput.value = 0;

        const formatNumber = val => {
            const num = parseFloat(val.replace(/,/g, ''));
            return isNaN(num) ? 0 : num.toLocaleString();
        };

        const handleFormat = input => e => {
            setTimeout(() => {
                input.value = formatNumber(input.value);
            }, 0);
        };

        newWithdrawInput.addEventListener('input', handleFormat(newWithdrawInput));
        newWithdrawInput.addEventListener('paste', handleFormat(newWithdrawInput));
        newDepositInput.addEventListener('input', handleFormat(newDepositInput));
        newDepositInput.addEventListener('paste', handleFormat(newDepositInput));

        const withdrawBtn = document.querySelector('#withdrawBtn');
        if (withdrawBtn.hasAttribute('disabled')) withdrawBtn.removeAttribute('disabled');
        document.querySelector('#withdrawInput').remove();
        withdrawBtn.parentElement.parentElement.insertBefore(newWithdrawInput, withdrawBtn.parentElement);

        const depositBtn = document.querySelector('#depositBtn');
        if (depositBtn.hasAttribute('disabled')) depositBtn.removeAttribute('disabled');
        document.querySelector('#depositInput').remove();
        depositBtn.parentElement.parentElement.insertBefore(newDepositInput, depositBtn.parentElement);

        buttons.forEach(function (config) {
            const btn = document.createElement('button');
            btn.textContent = `£${config.display}`;
            btn.style.cssText = 'width: 58px; padding: 8px; cursor: pointer; border-radius: 4px; border: 1px solid #495057; background: #2b3035; color: #fff;';

            buttonContainer.appendChild(btn);

            btn.addEventListener('click', () => {
                let intvalue = parseInt(newWithdrawInput.value.replace(/,/g, ''));
                newWithdrawInput.value = (intvalue + config.value).toLocaleString();
            });
        });

        const magicBtn = document.createElement('button');
        magicBtn.textContent = 'Magic';
        magicBtn.style.cssText = 'padding: 8px; cursor: pointer; border-radius: 4px; border: 1px solid purple; background: #2b3035; color: #fff;';
        magicBtn.addEventListener('click', () => {
            const currentCash = parseInt(document.querySelector('.cashDisplay').textContent.replace(/,/g, ''));
            const requiredCash = magicButton - currentCash;

            if (requiredCash > 0) {
                newWithdrawInput.value = requiredCash.toLocaleString();;
                newDepositInput.value = '0';
            } else if (requiredCash < 0) {
                newDepositInput.value = Math.abs(requiredCash).toLocaleString();;
                newWithdrawInput.value = '0';
            } else {
                newWithdrawInput.value = '0';
                newDepositInput.value = '0';
            }
        });

        buttonContainer.appendChild(magicBtn);

        parentContainer.appendChild(buttonContainer);

        const vaultCash = document.querySelector('#cashInVault');

        withdrawBtn.addEventListener('click', async function(e) {
            e.preventDefault();

            const form = document.querySelector('form[action="/Property/Withdraw"]');
            let cash = parseInt(newWithdrawInput.value.replace(/,/g, ''));
            const propertyId = form.querySelector('input[name="propertyId"]').value;
            const availableCash = parseInt(document.querySelector('#cashInVault').textContent.replace(/,/g, ''));

            if (cash > availableCash) cash = availableCash;

            const response = await fetch('/Property/Withdraw', {
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
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const messageDiv = doc.querySelector('.mb-4.card.border-success');
            const newVaultCash = doc.querySelector('#cashInVault').textContent;

            const element = document.querySelector('#mainBackground > .container > .row > .col-12');
            if (messageDiv && element) {
                messageDiv.classList.add('vault-msg');
                const oldMessages = document.querySelectorAll('.vault-msg');
                if (oldMessages.length > 0) oldMessages.forEach(el => el.remove());
                element.prepend(messageDiv);

                const messageContent = messageDiv.querySelector('div p').textContent;
                successMessage.textContent = messageContent;

                vaultCash.textContent = newVaultCash;

                newWithdrawInput.value = '0';
                newDepositInput.value = '0';
            }
        });

        depositBtn.addEventListener('click', async function(e) {
            e.preventDefault();

            const form = document.querySelector('form[action="/Property/Deposit"]');
            let cash = parseInt(newDepositInput.value.replace(/,/g, ''));
            const propertyId = form.querySelector('input[name="propertyId"]').value;
            const availableCash = parseInt(document.querySelector('.cashDisplay').textContent.replace(/,/g, ''));

            if (cash > availableCash) cash = availableCash;

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
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const messageDiv = doc.querySelector('.mb-4.card.border-success');
            const newVaultCash = doc.querySelector('#cashInVault').textContent;

            const element = document.querySelector('#mainBackground > .container > .row > .col-12');
            if (messageDiv && element) {
                messageDiv.classList.add('vault-msg');
                const oldMessages = document.querySelectorAll('.vault-msg');
                if (oldMessages.length > 0) oldMessages.forEach(el => el.remove());
                element.prepend(messageDiv);

                const messageContent = messageDiv.querySelector('div p').textContent;
                successMessage.textContent = messageContent;

                vaultCash.textContent = newVaultCash;

                newWithdrawInput.value = '0';
                newDepositInput.value = '0';
            }
        });

        const maxPropertyDepositBtn = document.querySelector('#maxPropertyDepositBtn');
        maxPropertyDepositBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const cash = parseInt(document.querySelector('.cashDisplay').textContent.replace(/,/g, ''));
            newDepositInput.value = cash.toLocaleString();
        });

        const maxWithdrawBtns = document.querySelectorAll('.input-group-text.autoMax.clickable');
        const maxPropertyWithdrawBtn = maxWithdrawBtns[1];
        maxPropertyWithdrawBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const availableCash = parseInt(document.querySelector('#cashInVault').textContent.replace(/,/g, ''));
            newWithdrawInput.value = availableCash.toLocaleString();
        });

        const walletCash = parseInt(document.querySelector('.cashDisplay').textContent.replace(/,/g, ''));
        if (walletCash > 0) newDepositInput.value = walletCash.toLocaleString();

        if (targetElement) targetElement.parentNode.insertBefore(parentContainer, targetElement);
    }

    if (document.querySelector('.row.mb-4.g-0.align-items-center.text-center')) init();
})();