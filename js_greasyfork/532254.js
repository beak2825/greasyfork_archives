// ==UserScript==
// @name         Cartel Empire - Quick Withdrawals
// @namespace    baccy.ce
// @version      0.1
// @description  Adds buttons to your property vault and bank with preset amounts to easily withdraw cash
// @author       Baccy
// @match        https://cartelempire.online/Property
// @match        https://cartelempire.online/Bank
// @match        https://cartelempire.online/settings*
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/532254/Cartel%20Empire%20-%20Quick%20Withdrawals.user.js
// @updateURL https://update.greasyfork.org/scripts/532254/Cartel%20Empire%20-%20Quick%20Withdrawals.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function addWithdrawalButtons() {
        const settings = await GM.getValue('quickWithdrawalOptions', {autoWithdrawal:true});

        const defaultButtons = [
            {value: 100000, display: '100k'},
            {value: 250000, display: '250k'},
            {value: 500000, display: '500k'},
            {value: 1000000, display: '1m'},
            {value: 2500000, display: '2.5m'},
            {value: 5000000, display: '5m'},
            {value: 10000000, display: '10m'},
            {value: 25000000, display: '25m'}
        ];

        let buttonConfig = [];

        if (settings.enableCustomButtons && settings.customButtons.length > 0) buttonConfig = settings.customButtons;
        else buttonConfig = defaultButtons;

        const parentContainer = document.createElement('div');
        parentContainer.classList.add('withdraw-container');

        const label = document.createElement('label');
        label.textContent = 'Withdraw';
        label.classList.add('withdraw-label');

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('custom-button-container');

        buttonConfig.forEach(function (config) {
            const customButton = document.createElement('span');
            customButton.classList.add('input-group-text', 'autoMax', 'clickable');
            customButton.setAttribute('data-max', config.value);
            customButton.setAttribute('targetelement', '#withdrawInput');
            customButton.setAttribute('enablebtn', '#withdrawBtn');
            customButton.textContent = `£${config.display}`;

            buttonContainer.appendChild(customButton);

            customButton.addEventListener('click', function (e) {
                const maxValue = e.currentTarget.getAttribute('data-max');
                const targetValue = document.querySelector(e.currentTarget.getAttribute('targetelement'));

                targetValue.value = maxValue;

                const enableBtnSelector = e.currentTarget.getAttribute('enablebtn');
                const enableBtn = document.querySelector(enableBtnSelector);
                if (enableBtn) enableBtn.disabled = false;

                const event = new Event('change');
                targetValue.dispatchEvent(event);

                if (settings.autoWithdrawal) {
                    setTimeout(() => {
                        const withdrawBtn = document.querySelector('#withdrawBtn');
                        withdrawBtn.click();
                    }, 250);
                }
            });
        });

        parentContainer.appendChild(label);
        parentContainer.appendChild(buttonContainer);

        if (window.location.href.toLowerCase().includes("https://cartelempire.online/property")) {
            if (settings.disableVaultWithdrawal) return;
            const targetElement = document.querySelector('.row.mb-4.g-0.align-items-center.text-center');
            if (targetElement) targetElement.parentNode.insertBefore(parentContainer, targetElement);
        } else if (window.location.href.toLowerCase().includes("https://cartelempire.online/bank")) {
            if (settings.disableBankWithdrawal) return;
            const targetElement = document.querySelector('.card-text.fw-bold.text-muted');
            if (targetElement) targetElement.parentNode.insertBefore(parentContainer, targetElement);
        }

        const style = document.createElement('style');
        document.head.appendChild(style);
        style.sheet.insertRule(`
		.withdraw-container {
		  margin-bottom: 15px;
		}
	  `);
        style.sheet.insertRule(`
		.withdraw-label {
		  display: block;
		  font-weight: bold;
		  margin-bottom: 8px;
		  color: white;
		}
	  `);
        style.sheet.insertRule(`
		.custom-button-container {
		  display: flex;
		  flex-wrap: wrap;
		  gap: 2px;
		  margin-bottom: 10px;
		}
	  `);
        style.sheet.insertRule(`
		.custom-button-container .input-group-text {
		  cursor: pointer;
		  display: inline-flex;
		  align-items: center;
		  padding: 5px 10px;
		  margin: 0;
		  background-color: #232323;
		  color: white;
		  border: 1px solid #ccc;
		  border-radius: 5px;
		}
	  `);
        style.sheet.insertRule(`
		.custom-button-container .input-group-text:hover {
		  background-color: #444;
		}
	  `);
    }

    addWithdrawalButtons();
})();