// ==UserScript==
// @name         [GC] Bank Account Optimizer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  Adds the ability to have multiple virtual bank accounts within your bank as well as transfer/withdraw from each
// @author       Heda
// @match        https://www.grundos.cafe/bank/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530497/%5BGC%5D%20Bank%20Account%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/530497/%5BGC%5D%20Bank%20Account%20Optimizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const parseNP = str => parseInt(str.replace(/,/g, '').match(/\d+/)?.[0] || '0');
    const formatNP = num => num.toLocaleString() + " NP";

    const accountInfo = [...document.querySelectorAll('p')].find(p =>
        p.innerHTML.includes('Account Type') && p.innerHTML.includes('Current Balance')
    );
    if (!accountInfo) return;

    const accountType = (accountInfo.innerHTML.match(/<strong class="green">(.+?)<\/strong>/) || [])[1] || "Unknown";
    const baseMainBalance = parseNP((accountInfo.innerHTML.match(/Current Balance<\/strong> : ([\d,]+) NP/) || [])[1]);

    const balances = {
        account1: getStoredBalance("account1", baseMainBalance),
        account2: getStoredBalance("account2", 0),
        account3: getStoredBalance("account3", 0)
    };

    const dropdowns = [];

    const container = document.createElement("div");
    Object.assign(container.style, {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        margin: "20px 0"
    });

    const hr = document.querySelector('hr');
    hr.parentNode.insertBefore(container, hr);

    container.appendChild(createAccountBox(1, balances.account1, true));
    container.appendChild(createAccountBox(2, balances.account2));
    container.appendChild(createAccountBox(3, balances.account3));

    updateTransferDropdowns();
    hookDepositForms();

    function getStoredBalance(key, fallback) {
        const stored = localStorage.getItem(key);
        return stored !== null ? parseInt(stored) : fallback;
    }

    function saveBalance(key, value) {
        localStorage.setItem(key, value.toString());
        const display = document.querySelector(`#${key}`);
        if (display) display.innerText = formatNP(value);
    }

    function getAccountName(key, fallback) {
        return localStorage.getItem(`${key}_name`) || fallback;
    }

    function saveAccountName(key, name) {
        localStorage.setItem(`${key}_name`, name);
        const title = document.querySelector(`#title-${key}`);
        if (title) title.textContent = name;
        updateTransferDropdowns();
    }

    function updateTransferDropdowns() {
        dropdowns.forEach(({ dropdown, fromKey }) => {
            dropdown.innerHTML = "";
            Object.keys(balances).forEach(key => {
                if (key !== fromKey) {
                    const option = document.createElement("option");
                    option.value = key;
                    option.textContent = getAccountName(key, key);
                    dropdown.appendChild(option);
                }
            });
        });
    }

    function resetToDefault(key) {
        const value = balances[key];
        balances.account1 += value;
        balances[key] = 0;
        saveBalance("account1", balances.account1);
        saveBalance(key, 0);
        saveAccountName(key, key === "account2" ? "Account #2" : "Account #3");
    }

    function resetMainToBase() {
        balances.account1 = baseMainBalance;
        saveBalance("account1", balances.account1);
    }

    function createAccountBox(accountNum, balance, isMain = false) {
        const key = `account${accountNum}`;
        const box = document.createElement("div");
        Object.assign(box.style, {
            border: "2px solid #999",
            padding: "15px 20px",
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            minWidth: "300px",
            flex: "1",
            position: "relative"
        });

        const inputStyle = `
            padding: 6px;
            height: 32px;
            border-radius: 5px;
            border: 1px solid #888;
            background: #444;
            color: white;
            width: 100%;
        `;
        const labelStyle = `
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 6px;
            height: 32px;
            border-radius: 5px;
            background: #555;
            color: white;
            cursor: pointer;
            user-select: none;
            font-size: 14px;
            font-weight: bold;
        `;

        const accountName = getAccountName(key, `Account #${accountNum}`);

        const title = document.createElement("div");
        title.id = `title-${key}`;
        title.style.cssText = "font-size: 22px; font-weight: bold; text-decoration: underline; color: #fff; text-shadow: 1px 1px 2px #000; text-align: center; margin-bottom: 10px;";
        title.textContent = accountName;

        const resetButton = document.createElement("label");
        resetButton.textContent = "✕";
        resetButton.title = isMain ? "Reset to actual balance from bank" : "Click to set account to default";
        Object.assign(resetButton.style, {
            position: "absolute",
            top: "5px",
            left: "5px",
            background: "#555",
            color: "white",
            padding: "4px 8px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px"
        });
        resetButton.onclick = () => isMain ? resetMainToBase() : resetToDefault(key);

        const details = document.createElement("div");
        details.style.textAlign = "center";
        details.innerHTML = `
            <p><strong style="color:#ccc;">Account Type:</strong> <span style="color:#9f9;">${accountType}</span></p>
            <p><strong style="color:#ccc;">Current Balance:</strong> <span id="${key}" style="color:#fff;">${formatNP(balance)}</span></p>
            <hr style="border: 1px solid #888; margin: 12px auto;">
        `;

        const row = document.createElement("div");
        Object.assign(row.style, {
            display: "flex",
            justifyContent: "space-between",
            gap: "15px"
        });

        const renameInput = document.createElement("input");
        renameInput.placeholder = "Rename...";
        renameInput.style = inputStyle;

        const renameBtn = document.createElement("label");
        renameBtn.textContent = "Rename";
        renameBtn.style = labelStyle;
        renameBtn.onclick = () => {
            const name = renameInput.value.trim();
            if (name) {
                saveAccountName(key, name);
                renameInput.value = '';
            }
        };

        const transferInput = document.createElement("input");
        transferInput.placeholder = "Amount";
        transferInput.style = inputStyle;

        const transferDropdown = document.createElement("select");
        transferDropdown.style = inputStyle;

        const transferBtn = document.createElement("label");
        transferBtn.textContent = "Transfer NP";
        transferBtn.style = labelStyle;
        transferBtn.onclick = () => {
            const amount = parseNP(transferInput.value);
            const toKey = transferDropdown.value;
            if (amount <= 0 || balances[key] < amount || !(toKey in balances)) {
                alert("Invalid or insufficient funds");
                return;
            }
            balances[key] -= amount;
            balances[toKey] += amount;
            saveBalance(key, balances[key]);
            saveBalance(toKey, balances[toKey]);
            transferInput.value = "";
        };
        dropdowns.push({ dropdown: transferDropdown, fromKey: key });

        const withdrawInput = document.createElement("input");
        withdrawInput.placeholder = "Amount";
        withdrawInput.style = inputStyle;

        const withdrawBtn = document.createElement("label");
        withdrawBtn.textContent = "Withdraw";
        withdrawBtn.style = labelStyle;
        withdrawBtn.onclick = () => {
            const amount = parseNP(withdrawInput.value);
            if (amount <= 0 || balances[key] < amount) {
                alert("Invalid or insufficient funds");
                return;
            }
            const form = document.querySelector('form[action="/bank/withdraw_np/"]');
            const amountInput = form?.querySelector('input[name="amount"]');
            if (!form || !amountInput) {
                alert("Could not find withdrawal form");
                return;
            }
            amountInput.value = amount;
            balances[key] -= amount;
            saveBalance(key, balances[key]);
            setTimeout(() => form.submit(), 100);
        };

        const renameCol = document.createElement("div");
        renameCol.style.flex = "1";
        renameCol.append(renameInput, renameBtn);

        const transferCol = document.createElement("div");
        transferCol.style.flex = "1";
        transferCol.append(transferInput, transferDropdown, transferBtn);

        const withdrawCol = document.createElement("div");
        withdrawCol.style.flex = "1";
        withdrawCol.append(withdrawInput, withdrawBtn);

        row.append(renameCol, transferCol, withdrawCol);
        box.append(resetButton, title, details, row);
        return box;
    }

    function hookDepositForms() {
        const depositForm = document.querySelector('form[action="/bank/deposit_np/"]:not(.button-group)');
        const depositAllForm = document.querySelector('form.button-group[action="/bank/deposit_np/"]');

        if (depositForm) {
            depositForm.addEventListener("submit", () => {
                const amount = parseNP(depositForm.querySelector('input[name="amount"]')?.value || '0');
                if (amount > 0) {
                    balances.account1 += amount;
                    saveBalance("account1", balances.account1);
                }
            });
        }

        if (depositAllForm) {
            const button = depositAllForm.querySelector('button[name="amount"]');
            depositAllForm.addEventListener("submit", () => {
                const amount = parseNP(button?.value || '0');
                if (amount > 0) {
                    balances.account1 += amount;
                    saveBalance("account1", balances.account1);
                }
            });
        }
    }
})();
