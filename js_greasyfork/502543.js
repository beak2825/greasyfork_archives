// ==UserScript==
// @name         Torn Company Manager
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Manage Torn company employees' positions and pay with loadouts, and manage advertising budget
// @author       Freshmentality 2954019
// @match        https://www.torn.com/companies.php*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/502543/Torn%20Company%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/502543/Torn%20Company%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the employee loadouts
    const loadoutKey1 = 'employeeLoadout1';
    const loadoutKey2 = 'employeeLoadout2';

    // Define the advertising loadouts
    const advertisingLoadout1 = '500000'; // Example value for Advertising Loadout 1
    const advertisingLoadout2 = '1000000'; // Example value for Advertising Loadout 2

    // Helper function to save the current state of employees
    function saveLoadout(loadoutKey) {
        const loadout = [];
        document.querySelectorAll('li[data-user]').forEach(employee => {
            const userId = employee.getAttribute('data-user');
            const role = employee.querySelector('.employee-rank').value;
            const pay = employee.querySelector('.employee-input-pay:not([type="hidden"])').value.replace(/,/g, '');
            loadout.push({ userId, role, pay });
        });
        localStorage.setItem(loadoutKey, JSON.stringify(loadout));
        alert('Loadout saved!');
    }

    // Helper function to load a saved loadout
    function loadLoadout(loadoutKey) {
        const loadout = JSON.parse(localStorage.getItem(loadoutKey));
        if (loadout) {
            loadout.forEach(item => {
                let employee = document.querySelector(`li[data-user="${item.userId}"]`);
                if (employee) {
                    setEmployeeDetails(employee, item.role, item.pay);
                }
            });
        } else {
            alert('No saved loadout found!');
        }
    }


    function setEmployeeDetails(employee, role, pay) {
        // Set role
        let selectElement = employee.querySelector('.employee-rank');
        let options = selectElement.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value == role) {
                selectElement.selectedIndex = i;
                let buttonElement = employee.querySelector('.ui-selectmenu-status');
                buttonElement.textContent = options[i].textContent;
                break;
            }
        }


        let payInput = employee.querySelector('.employee-input-pay[type="hidden"]');
        payInput.value = pay;
        let payDisplayInput = employee.querySelector('.employee-input-pay:not([type="hidden"])');
        payDisplayInput.value = parseInt(pay).toLocaleString();
    }


    function createEmployeeLoadoutButtons() {
    let btnWrap = document.querySelector('.btn-wrap.submit-changes.silver.t-hide');

    if (btnWrap && !document.querySelector('.employee-loadout-buttons')) {
        let loadoutButtonContainer = document.createElement('span');
        loadoutButtonContainer.className = 'btn-wrap employee-loadout-buttons';

        let saveButton1 = document.createElement('button');
        saveButton1.textContent = 'Save Loadout 1';
        saveButton1.className = 'torn-btn';
        saveButton1.onclick = () => {
            if (confirm('Are you sure you want to save Loadout 1?')) {
                saveLoadout(loadoutKey1);
            }
        };

        let saveButton2 = document.createElement('button');
        saveButton2.textContent = 'Save Loadout 2';
        saveButton2.className = 'torn-btn';
        saveButton2.onclick = () => {
            if (confirm('Are you sure you want to save Loadout 2?')) {
                saveLoadout(loadoutKey2);
            }
        };

        let loadButton1 = document.createElement('button');
        loadButton1.textContent = 'Loadout 1';
        loadButton1.className = 'torn-btn';
        loadButton1.onclick = () => loadLoadout(loadoutKey1);

        let loadButton2 = document.createElement('button');
        loadButton2.textContent = 'Loadout 2';
        loadButton2.className = 'torn-btn';
        loadButton2.onclick = () => loadLoadout(loadoutKey2);

        let span1 = document.createElement('span');
        span1.className = 'btn';
        span1.appendChild(saveButton1);
        span1.appendChild(loadButton1);

        let span2 = document.createElement('span');
        span2.className = 'btn';
        span2.appendChild(saveButton2);
        span2.appendChild(loadButton2);

        loadoutButtonContainer.appendChild(span1);
        loadoutButtonContainer.appendChild(span2);

        btnWrap.parentNode.insertBefore(loadoutButtonContainer, btnWrap.nextSibling);
    }
}


    function createAdvertisingLoadoutButtons() {
        let btnWrap = document.querySelector('.budget.btn-wrap.silver.advertising-amount-btn');
        console.log('btnWrap:', btnWrap);

        if (btnWrap && !document.querySelector('.advertising-loadout-buttons')) {
            let loadoutButtonContainer = document.createElement('span');
            loadoutButtonContainer.className = 'btn-wrap advertising-loadout-buttons';

            // Create buttons for advertising loadouts
            let button1 = document.createElement('button');
            button1.textContent = 'Set Budget 1';
            button1.className = 'torn-btn';
            button1.onclick = () => applyAdvertisingLoadout(advertisingLoadout1);

            let button2 = document.createElement('button');
            button2.textContent = 'Set Budget 2';
            button2.className = 'torn-btn';
            button2.onclick = () => applyAdvertisingLoadout(advertisingLoadout2);

            let span1 = document.createElement('span');
            span1.className = 'btn';
            span1.appendChild(button1);

            let span2 = document.createElement('span');
            span2.className = 'btn';
            span2.appendChild(button2);

            loadoutButtonContainer.appendChild(span1);
            loadoutButtonContainer.appendChild(span2);

            btnWrap.parentNode.insertBefore(loadoutButtonContainer, btnWrap.nextSibling);
        }
    }


    function applyAdvertisingLoadout(loadout) {
    let advertisingInputText = document.querySelector('.advertising-amount.input-money[type="text"]');
    let advertisingInputHidden = document.querySelector('.advertising-amount.input-money[type="hidden"]');
    let updateButton = document.querySelector('.budget.btn-wrap.silver.advertising-amount-btn .torn-btn');

    if (advertisingInputText && advertisingInputHidden && updateButton) {
        // Update both inputs with the new loadout value
        advertisingInputText.value = loadout;
        advertisingInputHidden.value = loadout;

        // Trigger input event to ensure any listeners are notified of the change
        let inputEvent = new Event('input', { bubbles: true });
        let changeEvent = new Event('change', { bubbles: true });

        advertisingInputText.dispatchEvent(inputEvent);
        advertisingInputText.dispatchEvent(changeEvent);

        advertisingInputHidden.dispatchEvent(inputEvent);
        advertisingInputHidden.dispatchEvent(changeEvent);

        // Optional: Click the update button to apply changes
        updateButton.click();
    }
}



    const styles = `
        .torn-btn {
            color: #aaa;
            color: var(--btn-disable-color);
            text-shadow: none;
            text-shadow: var(--btn-disable-text-shadow);
            background: linear-gradient(180deg, #c4c4c4 0%, #e9e9e9 100%);
            background: var(--btn-disable-background);
            border: none;
            border: var(--btn-disable-border);
            box-shadow: inset 0 1px 0 #00000012, 0 1px 0 #fff;
            box-shadow: var(--btn-disable-box-shadow);
            padding: 0 11px;
            height: 34px;
            line-height: 36px;
            cursor: default;
            margin-right: 5px; /* Adjust spacing between buttons if needed */
        }
    `;


    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);


    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                createEmployeeLoadoutButtons();
                createAdvertisingLoadoutButtons();
            }
        }
    });


    observer.observe(document.body, { childList: true, subtree: true });


    window.addEventListener('load', () => {
        createEmployeeLoadoutButtons();
        createAdvertisingLoadoutButtons();
    });
})();
