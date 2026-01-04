// ==UserScript==
// @name         Vault Sharing - Mobile and Desktop
// @namespace    vault.sharing.mobile
// @version      4.0
// @description  Automatically keeps track of your vault transactions when vault sharing
// @author       ANITABURN
// @match        https://www.torn.com/properties.php*
// @match        https://www.torn.com/properties.php
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @license      CC BY-NC-ND
// @downloadURL https://update.greasyfork.org/scripts/547136/Vault%20Sharing%20-%20Mobile%20and%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/547136/Vault%20Sharing%20-%20Mobile%20and%20Desktop.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent) ||
    window.innerWidth <= 768 ||
    ('ontouchstart' in window) ||
    navigator.maxTouchPoints > 0;

  let localStorageKey = "vault_sharing_mobile:settings";
  let playerName = "";

  window.addEventListener("hashchange", (event) => {
    if (event.newURL.indexOf("vault") > -1) {
      setTimeout(startVaultSharing, 1000);
    }
  }, false);

  if (window.location.href.indexOf("vault") > -1) {
    setTimeout(startVaultSharing, 1000);
  }

  function startVaultSharing() {
    console.log('Starting vault sharing on mobile:', isMobile);

    try {
      let wsData = document.querySelector("#websocketConnectionData");
      if (wsData) {
        playerName = JSON.parse(wsData.innerText).playername;
      } else {
        let userLinks = document.querySelectorAll('a[href*="/profiles.php?XID="]');
        if (userLinks.length > 0) {
          playerName = userLinks[0].textContent.trim();
        }
      }
    } catch (e) {
      console.log('Could not get player name:', e);
      playerName = "You";
    }

    console.log('Player name:', playerName);

    let { startTime, ownStartingBalance, spouseStartingBalance, totalVaultBalance, playerDisplayName, spouseDisplayName, useTornPDA } = JSON.parse(localStorage.getItem(localStorageKey)) || {
      startTime: new Date().toISOString().slice(0, 16),
      ownStartingBalance: 0,
      spouseStartingBalance: 0,
      totalVaultBalance: 0,
      playerDisplayName: playerName || "You",
      spouseDisplayName: "Spouse",
      useTornPDA: false
    };

    let isDarkMode = true;

    function parseTransaction(transactionItem) {
      try {
        let dateEl = transactionItem.querySelector("span.transaction-date") || transactionItem.querySelector('[class*="date"]');
        let timeEl = transactionItem.querySelector("span.transaction-time") || transactionItem.querySelector('[class*="time"]');
        let userEl = transactionItem.querySelector(".user.name") || transactionItem.querySelector('a[href*="XID="]');
        let typeEl = transactionItem.querySelector(".type") || transactionItem.querySelector('[class*="type"]');
        let amountEl = transactionItem.querySelector(".amount") || transactionItem.querySelector('[class*="amount"]');
        let balanceEl = transactionItem.querySelector(".balance") || transactionItem.querySelector('[class*="balance"]');

        if (!dateEl || !timeEl || !userEl || !typeEl || !amountEl) {
          return null;
        }

        let dateStr = dateEl.innerText.trim();
        let timeStr = timeEl.innerText.trim();

        let dateParts = dateStr.split("/");
        if (dateParts.length !== 3) {
          return null;
        }

        let [day, month, year] = dateParts;
        let fullYear = year.length === 2 ? '20' + year : year;
        let datetime = new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timeStr}Z`);

        if (isNaN(datetime.getTime())) {
          return null;
        }

        let userName = userEl.title ? userEl.title.split(" ")[0] : userEl.textContent.trim();
        let type = typeEl.innerText.replace(/[^A-z]/g, "");
        let amount = parseInt(amountEl.innerText.replace(/[^0-9]/g, ""));
        let balance = balanceEl ? parseInt(balanceEl.innerText.replace(/[^0-9]/g, "")) : 0;

        return {
          datetime: datetime,
          name: userName,
          type: type,
          amount: amount,
          originalBalance: balance
        };
      } catch (e) {
        console.log('Error parsing transaction:', e, transactionItem);
        return null;
      }
    }

    function readTransactionData() {
      let transactionData = {};

      let selectors = [
        ".vault-trans-wrap ul li[transaction_id]",
        ".vault-trans-wrap li",
        '[class*="vault"] li',
        '[class*="transaction"]'
      ];

      let transactionListItems = [];
      for (let selector of selectors) {
        transactionListItems = document.querySelectorAll(selector);
        if (transactionListItems.length > 0) break;
      }

      console.log(`Found ${transactionListItems.length} transaction items on page`);

      for (let item of transactionListItems) {
        let parsedTransaction = parseTransaction(item);
        if (parsedTransaction) {
          let transactionId = item.getAttribute("transaction_id") ||
                             item.getAttribute("data-id") ||
                             `${parsedTransaction.datetime.getTime()}-${parsedTransaction.name}-${parsedTransaction.amount}-${parsedTransaction.type}`;
          transactionData[transactionId] = parsedTransaction;
        }
      }

      return transactionData;
    }

    function syncAndGetAllTransactions() {
      let storedData = GM_getValue('transactions', {});
      let allTransactions = storedData;

      const currentTransactions = readTransactionData();
      const startTimeAsDate = new Date(startTime + ':00Z');
      let newTransactionsFound = false;
      let skippedOld = 0;
      let skippedDuplicate = 0;

      for (let [id, transaction] of Object.entries(currentTransactions)) {
        if (transaction.datetime <= startTimeAsDate) {
          skippedOld++;
          continue;
        }
        if (allTransactions[id]) {
          skippedDuplicate++;
          continue;
        }

        allTransactions[id] = {
          ...transaction,
          datetime: transaction.datetime.toISOString()
        };
        newTransactionsFound = true;
      }

      if (newTransactionsFound) {
        GM_setValue('transactions', allTransactions);
        let newCount = Object.keys(currentTransactions).length - skippedOld - skippedDuplicate;
        console.log(`Synced ${newCount} new transaction(s). Total cached: ${Object.keys(allTransactions).length}. Skipped: ${skippedOld} old, ${skippedDuplicate} duplicates`);
      }

      for (let id in allTransactions) {
        if (typeof allTransactions[id].datetime === 'string') {
          allTransactions[id].datetime = new Date(allTransactions[id].datetime);
        }
      }

      return allTransactions;
    }

    function formatBalance(balance) {
      return (balance < 0 ? "-" : "") + "$" + Math.abs(balance).toLocaleString();
    }

    function showBalances(ownBalance, spouseBalance) {
      let ownEl = document.getElementById("vault-sharing-own-balance");
      let spouseEl = document.getElementById("vault-sharing-spouse-balance");
      let totalEl = document.getElementById("vault-sharing-total-balance");

      if (ownEl) ownEl.innerText = formatBalance(ownBalance);
      if (spouseEl) spouseEl.innerText = formatBalance(spouseBalance);
      if (totalEl) totalEl.innerText = formatBalance(ownBalance + spouseBalance);
    }

    function calculateBalances() {
      try {
        let transactionData = syncAndGetAllTransactions();
        let ownBalance = ownStartingBalance;
        let spouseBalance = spouseStartingBalance;

        let allTransactions = Object.entries(transactionData)
          .filter(e => e[1] && e[1].datetime)
          .sort((a, b) => a[1].datetime - b[1].datetime);

        let skipFirst = useTornPDA && allTransactions.length > 0;

        for (let i = 0; i < allTransactions.length; i++) {
          let [id, transaction] = allTransactions[i];

          if (skipFirst && i === 0) {
            console.log('Skipping first transaction (TornPDA mode):', transaction.name, transaction.type, transaction.amount);
            continue;
          }

          let amount = parseInt(transaction.type === "Deposit" ? transaction.amount : -transaction.amount);

          if (transaction.name === playerName || transaction.name.toLowerCase().includes(playerName.toLowerCase())) {
            ownBalance += amount;
          } else {
            spouseBalance += amount;
          }
        }

        return { ownBalance, spouseBalance };
      } catch (error) {
        console.error('Error in calculateBalances:', error);
        return { ownBalance: 0, spouseBalance: 0 };
      }
    }

    function calculateAndShowBalances() {
      let result = calculateBalances();
      showBalances(result.ownBalance, result.spouseBalance);
    }

    function saveSettings() {
      let ownBalanceInput = document.getElementById("vault-sharing-own-start-balance");
      let spouseBalanceInput = document.getElementById("vault-sharing-spouse-start-balance");
      let totalVaultBalanceInput = document.getElementById("vault-sharing-total-vault-balance");
      let startTimeInput = document.getElementById("vault-sharing-start-time");
      let playerNameInput = document.getElementById("vault-sharing-player-name");
      let spouseNameInput = document.getElementById("vault-sharing-spouse-name");
      let useTornPDAInput = document.getElementById("vault-sharing-use-tornpda");

      if (!ownBalanceInput || !spouseBalanceInput || !startTimeInput) return;

      let ownBalanceSetting = Number(ownBalanceInput.value.replace(/[^0-9]/g, ""));
      let spouseBalanceSetting = Number(spouseBalanceInput.value.replace(/[^0-9]/g, ""));
      let totalVaultBalanceSetting = totalVaultBalanceInput ? Number(totalVaultBalanceInput.value.replace(/[^0-9]/g, "")) : 0;
      let startTimeSetting = startTimeInput.value;
      let playerNameSetting = playerNameInput ? playerNameInput.value.trim() : playerDisplayName;
      let spouseNameSetting = spouseNameInput ? spouseNameInput.value.trim() : spouseDisplayName;
      let useTornPDASetting = useTornPDAInput ? useTornPDAInput.checked : false;

      let startTimeChanged = startTime !== startTimeSetting;
      let balancesChanged = ownStartingBalance !== ownBalanceSetting || spouseStartingBalance !== spouseBalanceSetting || totalVaultBalance !== totalVaultBalanceSetting;
      let tornPDAChanged = useTornPDA !== useTornPDASetting;

      if (startTimeChanged || balancesChanged || tornPDAChanged) {
        console.log('Settings changed - clearing transaction cache');
        GM_deleteValue('transactions');
      }

      localStorage.setItem(localStorageKey, JSON.stringify({
        startTime: startTimeSetting,
        ownStartingBalance: ownBalanceSetting,
        spouseStartingBalance: spouseBalanceSetting,
        totalVaultBalance: totalVaultBalanceSetting,
        playerDisplayName: playerNameSetting,
        spouseDisplayName: spouseNameSetting,
        useTornPDA: useTornPDASetting
      }));

      startTime = startTimeSetting;
      ownStartingBalance = ownBalanceSetting;
      spouseStartingBalance = spouseBalanceSetting;
      totalVaultBalance = totalVaultBalanceSetting;
      playerDisplayName = playerNameSetting;
      spouseDisplayName = spouseNameSetting;
      useTornPDA = useTornPDASetting;

      toggleEditMode(false);
      showStatus('Settings saved!', false);
    }

    function handleSave() {
      saveSettings();
      calculateAndShowBalances();
    }

    function handleSetCurrent() {
      let result = calculateBalances();
      let ownBalanceInput = document.getElementById("vault-sharing-own-start-balance");
      let spouseBalanceInput = document.getElementById("vault-sharing-spouse-start-balance");
      let startTimeInput = document.getElementById("vault-sharing-start-time");

      if (ownBalanceInput) ownBalanceInput.value = result.ownBalance.toLocaleString();
      if (spouseBalanceInput) spouseBalanceInput.value = result.spouseBalance.toLocaleString();
      if (startTimeInput) startTimeInput.value = new Date().toISOString().slice(0, 16);

      showStatus('Updated to current values!', false);
    }

    function toggleEditMode(forceState = null) {
      let editSection = document.getElementById("vault-sharing-edit-section");
      let editButton = document.getElementById("vault-sharing-edit-btn");
      let playerNameEl = document.getElementById("vault-sharing-player-display-name");
      let spouseNameEl = document.getElementById("vault-sharing-spouse-display-name");

      let currentlyEditing = editSection && editSection.style.display !== 'none';
      let shouldEdit = forceState !== null ? forceState : !currentlyEditing;

      if (editSection) {
        editSection.style.display = shouldEdit ? 'block' : 'none';
      }
      if (editButton) {
        editButton.textContent = shouldEdit ? 'Cancel' : 'Edit';
        editButton.style.background = shouldEdit ? '#68acff' : '#68acff';
      }

      if (playerNameEl) playerNameEl.textContent = playerDisplayName;
      if (spouseNameEl) spouseNameEl.textContent = spouseDisplayName;
    }

    function showStatus(message, isError = false) {
      let statusEl = document.getElementById("vault-sharing-status");
      if (statusEl) {
        statusEl.textContent = message;
        statusEl.style.display = 'block';
        statusEl.style.color = isError ? '#68acff' : '#e168ff';
        statusEl.style.background = isError ? 'rgba(255,155,200,0.1)' : 'rgba(155,183,255,0.1)';
        statusEl.style.padding = '8px';
        statusEl.style.borderRadius = '4px';
        statusEl.style.marginTop = '10px';

        setTimeout(() => {
          statusEl.style.display = 'none';
        }, isMobile ? 5000 : 3000);
      }
    }

    function showCachePopup() {
      try {
        console.log('Opening cache popup...');
        let existing = document.getElementById("vault-sharing-cache-popup");
        if (existing) {
          existing.remove();
          document.getElementById("vault-cache-overlay")?.remove();
          return;
        }

        let allTransactions = syncAndGetAllTransactions();
        console.log('All transactions:', allTransactions);

        let transactionArray = Object.entries(allTransactions)
          .filter(([id, t]) => t && t.datetime)
          .map(([id, t]) => ({ id, ...t }))
          .sort((a, b) => {
            if (!a.datetime || !b.datetime) return 0;
            return b.datetime - a.datetime;
          });

        console.log('Transaction array:', transactionArray);

        let popup = document.createElement('div');
        popup.id = 'vault-sharing-cache-popup';
        popup.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #3a3a3a;
          border: 2px solid #68ebff;
          border-radius: 8px;
          padding: 20px;
          max-width: ${isMobile ? '90%' : '600px'};
          max-height: ${isMobile ? '80%' : '70%'};
          overflow-y: auto;
          z-index: 10000;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;

        let header = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #555; padding-bottom: 10px;">
            <h3 style="margin: 0; color: #68ebff; font-size: ${isMobile ? '16px' : '14px'};">Transaction Cache (${transactionArray.length})</h3>
            <button id="vault-cache-close" style="background: #e168ff; color: white; border: none; padding: 6px 12px; border-radius: 3px; cursor: pointer; font-size: ${isMobile ? '12px' : '11px'};">Close</button>
          </div>
        `;

        let transactionHTML = '';
        if (transactionArray.length === 0) {
          transactionHTML = '<div style="color: #aaa; text-align: center; padding: 20px;">No transactions in cache</div>';
        } else {
          transactionHTML = '<div style="font-size: ' + (isMobile ? '12px' : '11px') + ';">';
          for (let t of transactionArray) {
            try {
              let typeColor = t.type === 'Deposit' ? '#68ebff' : '#e168ff';
              let dateStr = 'Unknown Date';
              if (t.datetime && t.datetime.toISOString) {
                let d = new Date(t.datetime);
                let day = String(d.getUTCDate()).padStart(2, '0');
                let month = String(d.getUTCMonth() + 1).padStart(2, '0');
                let year = String(d.getUTCFullYear()).slice(-2);
                let hours = String(d.getUTCHours()).padStart(2, '0');
                let minutes = String(d.getUTCMinutes()).padStart(2, '0');
                let seconds = String(d.getUTCSeconds()).padStart(2, '0');
                dateStr = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
              }
              let amountStr = '$' + (t.amount ? t.amount.toLocaleString() : '0');

              transactionHTML += `
                <div style="background: #4a4a4a; padding: ${isMobile ? '10px' : '8px'}; margin-bottom: 8px; border-radius: 4px; border-left: 3px solid ${typeColor};">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: #ddd; font-weight: bold;">${t.name || 'Unknown'}</span>
                    <span style="color: ${typeColor}; font-weight: bold;">${t.type || 'Unknown'}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #aaa; font-size: ${isMobile ? '11px' : '10px'};">${dateStr}</span>
                    <span style="color: #ddd;">${amountStr}</span>
                  </div>
                </div>
              `;
            } catch (err) {
              console.error('Error rendering transaction:', t, err);
            }
          }
          transactionHTML += '</div>';
        }

        let overlay = document.createElement('div');
        overlay.id = 'vault-cache-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.7);
          z-index: 9999;
        `;

        popup.innerHTML = header + transactionHTML;
        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        document.getElementById('vault-cache-close').addEventListener('click', () => {
          popup.remove();
          overlay.remove();
        });

        overlay.addEventListener('click', () => {
          popup.remove();
          overlay.remove();
        });
      } catch (error) {
        console.error('Error showing cache popup:', error);
        console.error('Error stack:', error.stack);
        alert('Error showing cache popup: ' + error.message + '\nCheck console for details.');
      }
    }

    function formatMoneyInput(event) {
      let value = event.target.value.replace(/[^\d]/g, '');
      if (value) {
        event.target.value = parseInt(value).toLocaleString();
      }
    }

    function addUI() {
      let existing = document.getElementById("vault-sharing-container");
      if (existing) existing.remove();

      let mobileStyles = isMobile ? `
    padding: 10px;
    margin: 5px;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `: `
    padding: 8px;
    margin: 3px 0;
    `;

      let html = `
    <div id="vault-sharing-container" style="
    background: #3a3a3a;
    border: 1px solid #4a4a4a;
    border-radius: 6px;
    ${mobileStyles}
    position: relative;
    color: #ddd;
    ">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
    <h4 style="margin: 0; color: #ddd; font-size: ${isMobile ? '16px' : '14px'};">Vault Sharing</h4>
    <div style="display: flex; gap: 4px;">
    <button id="vault-sharing-cache-btn" style="
    background: #e168ff;
    color: white;
    border: none;
    padding: ${isMobile ? '6px 10px' : '4px 8px'};
    border-radius: 3px;
    cursor: pointer;
    font-size: ${isMobile ? '12px' : '11px'};
    min-height: ${isMobile ? '32px' : '24px'};
    ">Cache</button>
    <button id="vault-sharing-edit-btn" style="
    background: #68acff;
    color: white;
    border: none;
    padding: ${isMobile ? '6px 10px' : '4px 8px'};
    border-radius: 3px;
    cursor: pointer;
    font-size: ${isMobile ? '12px' : '11px'};
    min-height: ${isMobile ? '32px' : '24px'};
    ">Edit</button>
    </div>
    </div>

    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
    <div style="flex: 1; background: #4a4a4a; padding: ${isMobile ? '10px' : '8px'}; border-radius: 4px; text-align: center; border-left: 3px solid #e168ff;">
    <div style="font-size: ${isMobile ? '11px' : '10px'}; color: #aaa; margin-bottom: 4px; font-weight: bold;">
    <span id="vault-sharing-player-display-name">${playerDisplayName}</span>
    </div>
    <div id="vault-sharing-own-balance" style="font-size: ${isMobile ? '14px' : '12px'}; color: #e168ff; font-weight: bold;">Calculating...</div>
    </div>

    <div style="flex: 1; background: #4a4a4a; padding: ${isMobile ? '10px' : '8px'}; border-radius: 4px; text-align: center; border-left: 3px solid #68acff;">
    <div style="font-size: ${isMobile ? '11px' : '10px'}; color: #aaa; margin-bottom: 4px; font-weight: bold;">
    <span id="vault-sharing-spouse-display-name">${spouseDisplayName}</span>
    </div>
    <div id="vault-sharing-spouse-balance" style="font-size: ${isMobile ? '14px' : '12px'}; color: #68acff; font-weight: bold;">Calculating...</div>
    </div>
    </div>

    <div style="text-align: center; padding: ${isMobile ? '10px' : '8px'}; background: #4a4a4a; border-radius: 4px; border-left: 3px solid #68ebff;">
    <div style="font-size: ${isMobile ? '11px' : '10px'}; color: #aaa; margin-bottom: 4px; font-weight: bold;">Total Balance</div>
    <div id="vault-sharing-total-balance" style="font-size: ${isMobile ? '14px' : '12px'}; color: #68ebff; font-weight: bold;">$0</div>
    </div>

    <div id="vault-sharing-edit-section" style="display: none; margin-top: 10px; padding: 10px; background: #4a4a4a; border-radius: 4px; border: 1px solid #555;">

    <div style="display: ${isMobile ? 'block' : 'flex'}; gap: 8px; margin-bottom: 10px;">
    <div style="flex: 1; margin-bottom: ${isMobile ? '8px' : '0'};">
    <label style="display: block; margin-bottom: 2px; font-size: ${isMobile ? '12px' : '11px'}; color: #ddd;">Your Name:</label>
    <input id="vault-sharing-player-name" type="text" value="${playerDisplayName}" style="
    width: 100%;
    padding: ${isMobile ? '6px' : '4px'};
    border: 1px solid #666;
    border-radius: 3px;
    font-size: ${isMobile ? '14px' : '12px'};
    box-sizing: border-box;
    background: #333;
    color: #ddd;
    ">
    </div>
    <div style="flex: 1;">
    <label style="display: block; margin-bottom: 2px; font-size: ${isMobile ? '12px' : '11px'}; color: #ddd;">Spouse Name:</label>
    <input id="vault-sharing-spouse-name" type="text" value="${spouseDisplayName}" style="
    width: 100%;
    padding: ${isMobile ? '6px' : '4px'};
    border: 1px solid #666;
    border-radius: 3px;
    font-size: ${isMobile ? '14px' : '12px'};
    box-sizing: border-box;
    background: #333;
    color: #ddd;
    ">
    </div>
    </div>

    <div style="margin-bottom: 10px;">
    <label style="display: block; margin-bottom: 2px; font-size: ${isMobile ? '12px' : '11px'}; color: #ddd;">Total Vault Balance (at start time):</label>
    <input id="vault-sharing-total-vault-balance" type="text" value="${(totalVaultBalance || 0).toLocaleString()}" style="
    width: 100%;
    padding: ${isMobile ? '6px' : '4px'};
    border: 1px solid #666;
    border-radius: 3px;
    font-size: ${isMobile ? '14px' : '12px'};
    box-sizing: border-box;
    background: #333;
    color: #ddd;
    ">
    </div>

    <div style="display: ${isMobile ? 'block' : 'flex'}; gap: 8px; margin-bottom: 10px;">
    <div style="flex: 1; margin-bottom: ${isMobile ? '8px' : '0'};">
    <label style="display: block; margin-bottom: 2px; font-size: ${isMobile ? '12px' : '11px'}; color: #ddd;">Your Starting Balance:</label>
    <input id="vault-sharing-own-start-balance" type="text" value="${ownStartingBalance.toLocaleString()}" style="
    width: 100%;
    padding: ${isMobile ? '6px' : '4px'};
    border: 1px solid #666;
    border-radius: 3px;
    font-size: ${isMobile ? '14px' : '12px'};
    box-sizing: border-box;
    background: #333;
    color: #ddd;
    ">
    </div>
    <div style="flex: 1;">
    <label style="display: block; margin-bottom: 2px; font-size: ${isMobile ? '12px' : '11px'}; color: #ddd;">Spouse Starting Balance:</label>
    <input id="vault-sharing-spouse-start-balance" type="text" value="${spouseStartingBalance.toLocaleString()}" style="
    width: 100%;
    padding: ${isMobile ? '6px' : '4px'};
    border: 1px solid #666;
    border-radius: 3px;
    font-size: ${isMobile ? '14px' : '12px'};
    box-sizing: border-box;
    background: #333;
    color: #ddd;
    ">
    </div>
    </div>

    <div style="margin-bottom: 10px;">
    <label style="display: block; margin-bottom: 2px; font-size: ${isMobile ? '12px' : '11px'}; color: #ddd;">Start Date & Time:</label>
    <input id="vault-sharing-start-time" type="datetime-local" value="${startTime}" style="
    width: 100%;
    padding: ${isMobile ? '6px' : '4px'};
    border: 1px solid #666;
    border-radius: 3px;
    font-size: ${isMobile ? '14px' : '12px'};
    box-sizing: border-box;
    background: #333;
    color: #ddd;
    ">
    </div>

    <div style="margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
    <input id="vault-sharing-use-tornpda" type="checkbox" ${useTornPDA ? 'checked' : ''} style="
    width: 16px;
    height: 16px;
    cursor: pointer;
    flex-shrink: 0;
    opacity: 1;
    position: relative;
    z-index: 1;
    -webkit-appearance: checkbox;
    -moz-appearance: checkbox;
    appearance: checkbox;
    ">
    <label for="vault-sharing-use-tornpda" style="font-size: ${isMobile ? '12px' : '11px'}; color: #ddd; cursor: pointer; margin: 0; line-height: 1.4;">
    Balances from TornPDA with backdated start date (skip first transaction)
    </label>
    </div>

    <div style="display: ${isMobile ? 'block' : 'flex'}; gap: 6px;">
    <button id="vault-sharing-save" style="
    background: #e168ff;
    color: white;
    border: none;
    padding: ${isMobile ? '8px 12px' : '6px 10px'};
    border-radius: 3px;
    cursor: pointer;
    font-size: ${isMobile ? '12px' : '11px'};
    flex: 1;
    margin-bottom: ${isMobile ? '6px' : '0'};
    min-height: ${isMobile ? '36px' : '28px'};
    ">Save</button>

    <button id="vault-sharing-update" style="
    background: #68acff;
    color: white;
    border: none;
    padding: ${isMobile ? '8px 12px' : '6px 10px'};
    border-radius: 3px;
    cursor: pointer;
    font-size: ${isMobile ? '12px' : '11px'};
    flex: 1;
    min-height: ${isMobile ? '36px' : '28px'};
    ">Set to Current</button>
    </div>

    <div id="vault-sharing-status" style="display: none; margin-top: 8px; font-size: ${isMobile ? '12px' : '11px'};"></div>
    </div>
    </div>
    `;

      let insertTarget = document.querySelector(".vault-trans-wrap") ||
        document.querySelector('[class*="vault-trans"]') ||
        document.querySelector('[class*="property-option"]') ||
        document.querySelector('#properties-page-wrap');

      if (insertTarget) {
        insertTarget.insertAdjacentHTML("beforebegin", html);

        document.getElementById("vault-sharing-save")?.addEventListener("click", handleSave);
        document.getElementById("vault-sharing-update")?.addEventListener("click", handleSetCurrent);
        document.getElementById("vault-sharing-cache-btn")?.addEventListener("click", showCachePopup);
        document.getElementById("vault-sharing-edit-btn")?.addEventListener("click", () => toggleEditMode());

        ['vault-sharing-own-start-balance', 'vault-sharing-spouse-start-balance', 'vault-sharing-total-vault-balance'].forEach(id => {
          let input = document.getElementById(id);
          if (input) {
            input.addEventListener('input', formatMoneyInput);

            if (isMobile) {
              input.addEventListener('focus', () => {
                document.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
              });

              input.addEventListener('blur', () => {
                document.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width, initial-scale=1.0');
              });
            }
          }
        });

        toggleEditMode(false);

        console.log('UI added successfully');
        return true;
      } else {
        console.log('Could not find insertion target');
        return false;
      }
    }

    function setupObservers() {
      let mutationConfig = { attributes: false, childList: true, subtree: true };
      let isCalculating = false;
      let calculationTimeout = null;

      let transactionCallback = (mutationList, observer) => {
        if (isCalculating) return;

        clearTimeout(calculationTimeout);
        calculationTimeout = setTimeout(() => {
          isCalculating = true;
          calculateAndShowBalances();
          setTimeout(() => { isCalculating = false; }, 500);
        }, 300);
      };

      let initialCallback = (mutationList, observer) => {
        for (let mutation of mutationList) {
          if (mutation.type === "childList") {
            for (let node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.classList?.contains("property-option") ||
                  node.querySelector?.('.vault-trans-wrap') ||
                  node.classList?.contains("vault-trans-wrap")) {

                  if (addUI()) {
                    calculateAndShowBalances();

                    let transactionList = document.querySelector(".vault-trans-wrap ul") ||
                      document.querySelector('[class*="vault-trans"] ul');

                    if (transactionList) {
                      let transactionObserver = new MutationObserver(transactionCallback);
                      transactionObserver.observe(transactionList, mutationConfig);
                    }
                  }
                }
              }
            }
          }
        }
      };

      let pageWrap = document.getElementById("properties-page-wrap");
      if (pageWrap) {
        let pageObserver = new MutationObserver(initialCallback);
        pageObserver.observe(pageWrap, mutationConfig);
      }

      let vaultTransWrap = document.querySelector(".vault-trans-wrap");
      if (vaultTransWrap) {
        if (addUI()) {
          calculateAndShowBalances();

          let transactionList = vaultTransWrap.querySelector("ul");
          if (transactionList) {
            let transactionObserver = new MutationObserver(transactionCallback);
            transactionObserver.observe(transactionList, mutationConfig);
          }
        }
      }
    }

    setupObservers();
  }

  if (isMobile) {
    let style = document.createElement('style');
    style.textContent = `
    #vault-sharing-container input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    }

    #vault-sharing-container button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    }

    #vault-sharing-container button:active {
    transform: scale(0.98);
    }

    #vault-sharing-container input:focus {
    border-color: #e94560 !important;
    }
    `;
    document.head.appendChild(style);
  }

})();