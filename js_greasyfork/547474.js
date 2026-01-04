// ==UserScript==
// @name         Automatic Upkeep Tracker
// @namespace    upkeep.sharing.mobile
// @version      3.1
// @description  Automatically keeps track of your upkeep transactions for each user with date selector and caching
// @author       ANITABURN
// @match        https://www.torn.com/properties.php*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/547474/Automatic%20Upkeep%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/547474/Automatic%20Upkeep%20Tracker.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const localStorageKey = "upkeep_tracker:settings";

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent) ||
    window.innerWidth <= 768 ||
    ('ontouchstart' in window) ||
    navigator.maxTouchPoints > 0;

  let playerName = "";

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

  let attempts = 0;
  const maxAttempts = 20;

  function findInsertionPoint() {
    attempts++;

    const payBillsContainer = document.querySelector(
      "div.pay-bills.cont-gray.bottom-round"
    );
    const upkeepPaymentsWrap = document.querySelector(
      "div.upkeep-payments-wrap"
    );

    if (payBillsContainer && upkeepPaymentsWrap) {
      insertCalculator(upkeepPaymentsWrap);
      return true;
    }

    return false;
  }

  function getSpouseNameFromTransactions() {
    const allTransactions = GM_getValue('transactions', {});
    const userCounts = {};

    Object.values(allTransactions).forEach((transaction) => {
      const user = transaction.user;
      if (user) {
        // Check if user is NOT the player (case insensitive check)
        if (user.toLowerCase() !== playerName.toLowerCase() &&
          !user.toLowerCase().includes(playerName.toLowerCase())) {
          userCounts[user] = (userCounts[user] || 0) + 1;
        }
      }
    });

    const sortedUsers = Object.entries(userCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([user]) => user);

    return sortedUsers[0] || "Spouse";
  }

  function insertCalculator(targetElement) {
    if (document.getElementById("upkeep-totals-calculator")) return;

    const detectedSpouseName = getSpouseNameFromTransactions();

    let { user1DisplayName, user2DisplayName } = JSON.parse(
      localStorage.getItem(localStorageKey)
    ) || {
      user1DisplayName: playerName || "You",
      user2DisplayName: detectedSpouseName,
    };

    // Auto-update if they're still using default values
    if (user1DisplayName === "You" || user1DisplayName === "User 1") {
      user1DisplayName = playerName || "You";
    }
    if (user2DisplayName === "Spouse" || user2DisplayName === "User 2") {
      user2DisplayName = detectedSpouseName;
    }

    // Save the auto-detected names
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({ user1DisplayName, user2DisplayName })
    );

    let mobileStyles = isMobile ? `
          padding: 10px;
          margin: 5px;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ` : `
          padding: 8px;
          margin: 3px 0;
        `;

    const container = document.createElement("div");
    container.id = "upkeep-totals-calculator";
    container.style.cssText = `
          background: #3a3a3a;
          border: 1px solid #4a4a4a;
          border-radius: 6px;
          ${mobileStyles}
          position: relative;
          color: #ddd;
        `;

    const headerDiv = document.createElement("div");
    headerDiv.style.cssText = `
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        `;

    const title = document.createElement("h4");
    title.textContent = "Upkeep Totals";
    title.style.cssText = `
          margin: 0;
          color: #ddd;
          font-size: ${isMobile ? '16px' : '14px'};
        `;
    headerDiv.appendChild(title);

    const buttonGroup = document.createElement("div");
    buttonGroup.style.cssText = `
          display: flex;
          gap: 4px;
        `;

    const cacheBtn = document.createElement("button");
    cacheBtn.textContent = "Cache";
    cacheBtn.id = "upkeep-cache-btn";
    cacheBtn.style.cssText = `
          background: #e168ff;
          color: white;
          border: none;
          padding: ${isMobile ? '6px 10px' : '4px 8px'};
          border-radius: 3px;
          cursor: pointer;
          font-size: ${isMobile ? '12px' : '11px'};
          min-height: ${isMobile ? '32px' : '24px'};
        `;
    buttonGroup.appendChild(cacheBtn);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.id = "upkeep-edit-btn";
    editBtn.style.cssText = `
          background: #68acff;
          color: white;
          border: none;
          padding: ${isMobile ? '6px 10px' : '4px 8px'};
          border-radius: 3px;
          cursor: pointer;
          font-size: ${isMobile ? '12px' : '11px'};
          min-height: ${isMobile ? '32px' : '24px'};
        `;
    buttonGroup.appendChild(editBtn);

    headerDiv.appendChild(buttonGroup);
    container.appendChild(headerDiv);

    const usersDiv = document.createElement("div");
    usersDiv.style.cssText = `
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        `;

    const user1Div = document.createElement("div");
    user1Div.style.cssText = `
          flex: 1;
          padding: ${isMobile ? '10px' : '8px'};
          background: #4a4a4a;
          border-left: 3px solid #e168ff;
          text-align: center;
          border-radius: 4px;
        `;
    user1Div.innerHTML = `
          <div style="font-size: ${isMobile ? '11px' : '10px'}; color: #aaa; margin-bottom: 4px; font-weight: bold;">
            <span id="user1-name">${user1DisplayName}</span>
          </div>
          <div style="font-size: ${isMobile ? '14px' : '12px'}; color: #e168ff; font-weight: bold;" id="user1-total">$0</div>
        `;

    const user2Div = document.createElement("div");
    user2Div.style.cssText = `
          flex: 1;
          padding: ${isMobile ? '10px' : '8px'};
          background: #4a4a4a;
          border-left: 3px solid #68acff;
          text-align: center;
          border-radius: 4px;
        `;
    user2Div.innerHTML = `
          <div style="font-size: ${isMobile ? '11px' : '10px'}; color: #aaa; margin-bottom: 4px; font-weight: bold;">
            <span id="user2-name">${user2DisplayName}</span>
          </div>
          <div style="font-size: ${isMobile ? '14px' : '12px'}; color: #68acff; font-weight: bold;" id="user2-total">$0</div>
        `;

    usersDiv.appendChild(user1Div);
    usersDiv.appendChild(user2Div);
    container.appendChild(usersDiv);

    const totalDiv = document.createElement("div");
    totalDiv.style.cssText = `
          text-align: center;
          padding: ${isMobile ? '10px' : '8px'};
          background: #4a4a4a;
          border-radius: 4px;
          border-left: 3px solid #68ebff;
        `;
    totalDiv.innerHTML = `
          <div style="font-size: ${isMobile ? '11px' : '10px'}; color: #aaa; margin-bottom: 4px; font-weight: bold;">Total Balance</div>
          <div style="font-size: ${isMobile ? '14px' : '12px'}; color: #68ebff; font-weight: bold;" id="grand-total">$0</div>
        `;
    container.appendChild(totalDiv);

    const editSection = document.createElement("div");
    editSection.id = "upkeep-edit-section";
    editSection.style.cssText = `
          display: none;
          margin-top: 10px;
          padding: 10px;
          background: #4a4a4a;
          border-radius: 4px;
          border: 1px solid #555;
        `;

    const dateDiv = document.createElement("div");
    dateDiv.style.cssText = `
          margin-bottom: 10px;
        `;

    const dateLabel = document.createElement("label");
    dateLabel.textContent = "From: ";
    dateLabel.style.cssText = `
          display: block;
          margin-bottom: 2px;
          font-size: ${isMobile ? '12px' : '11px'};
          color: #ddd;
        `;
    dateDiv.appendChild(dateLabel);

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.id = "upkeep-date-input";
    dateInput.style.cssText = `
          width: 100%;
          padding: ${isMobile ? '6px' : '4px'};
          border: 1px solid #666;
          border-radius: 3px;
          font-size: ${isMobile ? '14px' : '12px'};
          box-sizing: border-box;
          background: #333;
          color: #ddd;
        `;
    dateDiv.appendChild(dateInput);

    editSection.appendChild(dateDiv);

    const nameInputsDiv = document.createElement("div");
    nameInputsDiv.style.cssText = `
          display: ${isMobile ? 'block' : 'flex'};
          gap: 8px;
          margin-bottom: 10px;
        `;
    nameInputsDiv.innerHTML = `
          <div style="flex: 1; margin-bottom: ${isMobile ? '8px' : '0'};">
            <label style="display: block; margin-bottom: 2px; font-size: ${isMobile ? '12px' : '11px'}; color: #ddd;">User 1 Display Name:</label>
            <input id="upkeep-user1-name-input" type="text"
              value="${user1DisplayName}"
              style="width: 100%; padding: ${isMobile ? '6px' : '4px'}; border: 1px solid #666;
              border-radius: 3px; font-size: ${isMobile ? '14px' : '12px'}; box-sizing: border-box; background: #333; color: #ddd;">
          </div>
          <div style="flex: 1;">
            <label style="display: block; margin-bottom: 2px; font-size: ${isMobile ? '12px' : '11px'}; color: #ddd;">User 2 Display Name:</label>
            <input id="upkeep-user2-name-input" type="text"
              value="${user2DisplayName}"
              style="width: 100%; padding: ${isMobile ? '6px' : '4px'}; border: 1px solid #666;
              border-radius: 3px; font-size: ${isMobile ? '14px' : '12px'}; box-sizing: border-box; background: #333; color: #ddd;">
          </div>
        `;

    editSection.appendChild(nameInputsDiv);

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.textContent = "Reset & Clear Cache";
    resetBtn.id = "upkeep-reset-btn";
    resetBtn.style.cssText = `
          background: #e168ff;
          color: white;
          border: none;
          padding: ${isMobile ? '8px 12px' : '6px 10px'};
          border-radius: 3px;
          cursor: pointer;
          font-size: ${isMobile ? '12px' : '11px'};
          width: 100%;
          margin-top: 10px;
          min-height: ${isMobile ? '36px' : '28px'};
        `;
    editSection.appendChild(resetBtn);

    container.appendChild(editSection);

    targetElement.parentNode.insertBefore(container, targetElement);

    function handleReset() {
      GM_deleteValue('transactions');
      localStorage.removeItem(localStorageKey);
      window.location.reload(true);
    }

    function saveSettings() {
      const user1Input = document.getElementById("upkeep-user1-name-input");
      const user2Input = document.getElementById("upkeep-user2-name-input");

      user1DisplayName = user1Input.value.trim() || "User 1";
      user2DisplayName = user2Input.value.trim() || "User 2";

      localStorage.setItem(
        localStorageKey,
        JSON.stringify({ user1DisplayName, user2DisplayName })
      );

      document.getElementById("user1-name").textContent = user1DisplayName;
      document.getElementById("user2-name").textContent = user2DisplayName;
    }

    function toggleEditMode() {
      const editSection = document.getElementById("upkeep-edit-section");
      const isEditing = editSection.style.display !== "none";
      if (isEditing) {
        saveSettings();
        updateTotals();
        editSection.style.display = "none";
        editBtn.textContent = "Edit";
        editBtn.style.background = "#68acff";
      } else {
        editSection.style.display = "block";
        editBtn.textContent = "Save";
        editBtn.style.background = "#68acff";
      }
    }
    editBtn.addEventListener("click", toggleEditMode);
    resetBtn.addEventListener("click", handleReset);

    function parseDateTime(dtString) {
      const [part1, part2] = dtString.split(" ");
      if (!part1 || !part2) return null;

      let timePart, datePart;
      if (part1.includes(":")) {
        timePart = part1;
        datePart = part2;
      } else if (part2.includes(":")) {
        timePart = part2;
        datePart = part1;
      } else {
        return null;
      }

      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      const [day, month, year] = datePart.split("/").map(Number);
      const fullYear = year < 100 ? 2000 + year : year;
      return new Date(fullYear, month - 1, day, hours, minutes, seconds);
    }

    function parseAmount(amountStr) {
      return Number(amountStr.replace(/[^0-9.-]+/g, ""));
    }

    function getCleanUsername(userAnchor) {
      let raw = "";
      userAnchor.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          raw += node.textContent.trim();
        }
      });
      return raw.trim();
    }

    function syncAndGetAllTransactions() {
      let storedData = GM_getValue('transactions', {});
      let allTransactions = storedData;
      let newTransactionsFound = false;

      const paymentRows = document.querySelectorAll(
        "ul.upkeep-payments li:not(.title) ul.payments"
      );

      paymentRows.forEach((row) => {
        const dateSpan = row.querySelector("span.transaction-date");
        const timeSpan = row.querySelector("span.transaction-time");
        const userAnchor = row.querySelector("a.user.name");
        const amountLi = row.querySelector("li.amount");

        if (!dateSpan || !timeSpan || !userAnchor || !amountLi) return;

        const dateTimeString1 =
          dateSpan.textContent.trim() + " " + timeSpan.textContent.trim();
        const dateTimeString2 =
          timeSpan.textContent.trim() + " " + dateSpan.textContent.trim();

        const date = parseDateTime(dateTimeString1) || parseDateTime(dateTimeString2);

        if (!date) return;

        const amount = parseAmount(amountLi.textContent);
        const username = getCleanUsername(userAnchor);

        const uniqueId = `${username}-${date.getTime()}-${amount}`;

        const isDuplicate = Object.values(allTransactions).some(t =>
          t.user === username &&
          Math.abs(new Date(t.date).getTime() - date.getTime()) < 1000 &&
          t.amount === amount
        );

        if (!isDuplicate && !allTransactions[uniqueId]) {
          allTransactions[uniqueId] = {
            user: username,
            date: date.toISOString(),
            amount: amount,
            uniqueId: uniqueId,
          };
          newTransactionsFound = true;
        }
      });

      const transactionArray = Object.values(allTransactions);
      const deduplicated = {};
      const seen = new Set();

      transactionArray.forEach(t => {
        const key = `${t.user}-${new Date(t.date).getTime()}-${t.amount}`;
        if (!seen.has(key)) {
          seen.add(key);
          deduplicated[t.uniqueId || key] = t;
        }
      });

      const removedCount = Object.keys(allTransactions).length - Object.keys(deduplicated).length;
      if (removedCount > 0) {
        allTransactions = deduplicated;
        newTransactionsFound = true;
      }

      if (newTransactionsFound) {
        GM_setValue('transactions', allTransactions);
      }

      for (let id in allTransactions) {
        if (typeof allTransactions[id].date === 'string') {
          allTransactions[id].date = new Date(allTransactions[id].date);
        }
      }

      return allTransactions;
    }

    function updateTotals() {
      const startDateValue = dateInput.value;
      let startDate = null;
      if (startDateValue) {
        const [year, month, day] = startDateValue.split("-").map(Number);
        startDate = new Date(year, month - 1, day, 0, 0, 0);
      }

      const allTransactions = syncAndGetAllTransactions();

      // Update spouse name if still default
      if (user2DisplayName === "Spouse" && Object.keys(allTransactions).length > 0) {
        const detectedSpouseName = getSpouseNameFromTransactions();
        if (detectedSpouseName !== "Spouse") {
          user2DisplayName = detectedSpouseName;
          document.getElementById("user2-name").textContent = user2DisplayName;
          document.getElementById("upkeep-user2-name-input").value = user2DisplayName;
          localStorage.setItem(
            localStorageKey,
            JSON.stringify({ user1DisplayName, user2DisplayName })
          );
        }
      }

      let user1Balance = 0;
      let user2Balance = 0;

      Object.values(allTransactions).forEach((transaction) => {
        const transactionDate = new Date(transaction.date);

        if (!startDate || transactionDate >= startDate) {
          const amount = transaction.amount;

          // Match by actual username (case insensitive)
          if (transaction.user.toLowerCase() === user1DisplayName.toLowerCase()) {
            user1Balance += amount;
          } else if (transaction.user.toLowerCase() === user2DisplayName.toLowerCase()) {
            user2Balance += amount;
          } else {
            // If no exact match, check if it contains the name
            if (transaction.user.toLowerCase().includes(user1DisplayName.toLowerCase())) {
              user1Balance += amount;
            } else {
              user2Balance += amount;
            }
          }
        }
      });

      const totalAmount = user1Balance + user2Balance;

      const user1Total = document.getElementById("user1-total");
      const user2Total = document.getElementById("user2-total");
      const grandTotal = document.getElementById("grand-total");

      user1Total.textContent = "$" + user1Balance.toLocaleString();
      user2Total.textContent = "$" + user2Balance.toLocaleString();
      grandTotal.textContent = "$" + totalAmount.toLocaleString();
    }

    function showCachePopup() {
      try {
        let existing = document.getElementById("upkeep-cache-popup");
        if (existing) {
          existing.remove();
          document.getElementById("upkeep-cache-overlay")?.remove();
          return;
        }

        let allTransactions = syncAndGetAllTransactions();

        let transactionArray = Object.entries(allTransactions)
          .filter(([id, t]) => t && t.date)
          .map(([id, t]) => ({ id, ...t }))
          .sort((a, b) => {
            if (!a.date || !b.date) return 0;
            return new Date(b.date) - new Date(a.date);
          });

        const user1 = user1DisplayName;
        const user2 = user2DisplayName;

        let popup = document.createElement('div');
        popup.id = 'upkeep-cache-popup';
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
          <div style="display: flex; justify-content: space-between;
            align-items: center; margin-bottom: 15px; border-bottom: 1px solid #555;
            padding-bottom: 10px;">
            <h3 style="margin: 0; color: #68ebff; font-size: ${isMobile ? '16px' : '14px'};">
              Transaction Cache (${transactionArray.length})</h3>
            <button id="upkeep-cache-close" style="background: #e168ff;
              color: white; border: none; padding: 6px 12px; border-radius: 3px;
              cursor: pointer; font-size: ${isMobile ? '12px' : '11px'};">Close</button>
          </div>
        `;

        let transactionHTML = '';
        if (transactionArray.length === 0) {
          transactionHTML =
            '<div style="color: #aaa; text-align: center; padding: 20px;">No transactions in cache</div>';
        } else {
          transactionHTML = '<div style="font-size: ' + (isMobile ? '12px' : '11px') + ';">';
          for (let t of transactionArray) {
            try {
              let typeColor = '#68ebff';
              if (t.user === user1) {
                typeColor = '#e168ff';
              } else if (t.user === user2) {
                typeColor = '#68acff';
              }

              let dateStr = 'Unknown Date';
              if (t.date) {
                let d = new Date(t.date);
                let day = String(d.getDate()).padStart(2, '0');
                let month = String(d.getMonth() + 1).padStart(2, '0');
                let year = String(d.getFullYear()).slice(-2);
                let hours = String(d.getHours()).padStart(2, '0');
                let minutes = String(d.getMinutes()).padStart(2, '0');
                let seconds = String(d.getSeconds()).padStart(2, '0');
                dateStr =
                  `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
              }
              let amountStr = '$' + (t.amount ? t.amount.toLocaleString() : '0');

              transactionHTML += `
                <div style="background: #4a4a4a; padding: ${isMobile ? '10px' : '8px'};
                  margin-bottom: 8px; border-radius: 4px;
                  border-left: 3px solid ${typeColor};">
                  <div style="display: flex; justify-content: space-between;
                    margin-bottom: 4px;">
                    <span style="color: #ddd; font-weight: bold;">
                      ${t.user || 'Unknown'}</span>
                    <span style="color: ${typeColor}; font-weight: bold;">
                      Upkeep</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #aaa; font-size: ${isMobile ? '11px' : '10px'};">
                      ${dateStr}</span>
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
        overlay.id = 'upkeep-cache-overlay';
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

        document.getElementById('upkeep-cache-close')
          .addEventListener('click', () => {
            popup.remove();
            overlay.remove();
          });

        overlay.addEventListener('click', () => {
          popup.remove();
          overlay.remove();
        });
      } catch (error) {
        console.error('Error showing cache popup:', error);
      }
    }

    cacheBtn.addEventListener("click", showCachePopup);
    dateInput.addEventListener("change", updateTotals);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    dateInput.value = thirtyDaysAgo.toISOString().split("T")[0];

    setTimeout(() => {
      updateTotals();
    }, 1000);

    const observer = new MutationObserver(() => {
      updateTotals();
    });

    const transactionList = document.querySelector("ul.upkeep-payments");
    if (transactionList) {
      observer.observe(transactionList, {
        childList: true,
        subtree: true
      });
    }
  }

  function init() {
    if (findInsertionPoint()) return;
    if (attempts < maxAttempts) setTimeout(init, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

