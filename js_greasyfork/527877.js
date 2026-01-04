// ==UserScript==
// @name         Banqer High Money Adder (With GUI)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds money for security testing (use responsibly)
// @author       YourName
// @match        *://*.banqerhigh.com/*
// @match        *://*.banqerhigh.co.nz/*
// @match        *://*.banqerhigh.com.au/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527877/Banqer%20High%20Money%20Adder%20%28With%20GUI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527877/Banqer%20High%20Money%20Adder%20%28With%20GUI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if we're on any Banqer High domain
    if (!/banqerhigh\.(com|co\.nz|com\.au)/.test(window.location.hostname)) {
        console.log("❌ Not on a Banqer High website. Script will not run.");
        return;
    }

    console.log("✅ Banqer High detected. Running script...");

    // Function to modify money
    function modifyMoney(amount) {
        // Modify LocalStorage (if balance is stored there)
        if (localStorage.getItem('balance')) {
            let newBalance = amount === 'inf' ? Infinity : (parseFloat(localStorage.getItem('balance')) || 0) + amount;
            localStorage.setItem('balance', newBalance);
            console.log(`✅ LocalStorage balance updated: $${newBalance}`);
        } else {
            console.log('❌ No balance found in LocalStorage.');
        }

        // Modify Displayed Balance (if it's shown on the page)
        let balanceElement = document.querySelector('.balance-selector'); // Change this selector if needed
        if (balanceElement) {
            let displayedBalance = amount === 'inf' ? "∞" : (parseFloat(balanceElement.innerText.replace(/[^0-9.-]+/g, '')) || 0) + amount;
            balanceElement.innerText = `$${displayedBalance}`;
            console.log(`✅ Displayed balance updated: $${displayedBalance}`);
        } else {
            console.log('❌ Balance element not found! Adjust the selector.');
        }
    }

    // Create the GUI
    function createGUI() {
        let gui = document.createElement('div');
        gui.style.position = 'fixed';
        gui.style.top = '20px';
        gui.style.right = '20px';
        gui.style.background = 'rgba(0, 0, 0, 0.8)';
        gui.style.color = 'white';
        gui.style.padding = '15px';
        gui.style.borderRadius = '10px';
        gui.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        gui.style.zIndex = '9999';
        gui.style.fontFamily = 'Arial, sans-serif';
        gui.innerHTML = `
            <h3 style="margin: 0 0 10px; text-align: center;">💰 Money Adder</h3>
            <input id="moneyAmount" type="number" placeholder="Enter amount" style="width: 100%; padding: 5px; margin-bottom: 10px;">
            <button id="addMoney" style="width: 100%; padding: 5px; background: green; color: white; border: none; cursor: pointer; margin-bottom: 5px;">Add Money</button>
            <button id="setInf" style="width: 100%; padding: 5px; background: red; color: white; border: none; cursor: pointer;">Set Infinite Money</button>
        `;

        document.body.appendChild(gui);

        // Add button functionality
        document.getElementById('addMoney').addEventListener('click', () => {
            let amount = parseFloat(document.getElementById('moneyAmount').value);
            if (!isNaN(amount)) {
                modifyMoney(amount);
            } else {
                alert("Please enter a valid number!");
            }
        });

        document.getElementById('setInf').addEventListener('click', () => {
            modifyMoney('inf');
        });
    }

    // Run the GUI
    createGUI();
})();
