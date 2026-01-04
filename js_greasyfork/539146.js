// ==UserScript==
// @name         Vault Catcher - Balance Validator (Clean Preventive)
// @namespace    http://tampermonkey.net/
// @version      2.2.5
// @description  Validates user money transfers from faction vault based on displayed user balances. May show early warning and confirmation if input exceeds available balance.
// @author       Lazerpents idea upgraded by Garrincha [539752]
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/539146/Vault%20Catcher%20-%20Balance%20Validator%20%28Clean%20Preventive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539146/Vault%20Catcher%20-%20Balance%20Validator%20%28Clean%20Preventive%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ✅ Toggle to show/hide tooltip warning set true to show
  const SHOW_TOOLTIP_WARNINGS = false;

  function parseMoney(str) {
    return Number(str.replace(/[^0-9]/g, ''));
  }

  function findBalanceLine() {
    const spans = document.querySelectorAll('span');
    for (const span of spans) {
      if (/current balance is \$/.test(span.textContent)) {
        const match = span.textContent.match(/\$([\d,]+)/);
        if (match) return parseMoney(match[1]);
      }
    }
    return null;
  }

  function findMoneyInput() {
    return document.querySelector('input.input-money[aria-label*="money"]');
  }

  function findGiveButton() {
    return document.querySelector('button.torn-btn.ctaButton___OOMgj.silver[type="submit"]');
  }

  function showTemporaryWarning(msg, buttonElement) {
    if (!SHOW_TOOLTIP_WARNINGS) return;

    const existing = document.getElementById('money-warning-tooltip');
    if (existing) existing.remove();

    const tooltip = document.createElement('div');
    tooltip.id = 'money-warning-tooltip';
    tooltip.textContent = msg;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#ffc';
    tooltip.style.color = '#900';
    tooltip.style.border = '1px solid #900';
    tooltip.style.borderRadius = '5px';
    tooltip.style.padding = '6px 10px';
    tooltip.style.zIndex = 9999;
    tooltip.style.fontWeight = 'bold';
    tooltip.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

    const rect = buttonElement.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.top + window.scrollY - 40}px`;

    document.body.appendChild(tooltip);
    setTimeout(() => {
      if (tooltip.parentElement) tooltip.remove();
    }, 3000);
  }

  function removeTooltip() {
    const existing = document.getElementById('money-warning-tooltip');
    if (existing) existing.remove();
  }

  function setupInputMonitoring(balance) {
    const moneyInput = findMoneyInput();
    const giveBtn = findGiveButton();
    if (!moneyInput || !giveBtn) return;

    let confirmedOnce = false;

    moneyInput.addEventListener('input', () => {
      const valNum = parseMoney(moneyInput.value);
      if (valNum > balance) {
        moneyInput.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        showTemporaryWarning('Exceeds user balance!', giveBtn);
      } else {
        moneyInput.style.backgroundColor = '';
        removeTooltip();
      }
    });

    giveBtn.addEventListener('click', (e) => {
      const valNum = parseMoney(moneyInput.value);
      if (valNum > balance && !confirmedOnce) {
        e.preventDefault();
        const confirmSend = confirm(
          `You're trying to give $${valNum.toLocaleString()}, which exceeds the user's balance of $${balance.toLocaleString()}.\n\nProceed anyway?`
        );
        if (confirmSend) {
          confirmedOnce = true;
          giveBtn.click(); // Retry once
        }
      }
    });
  }

  function waitForBalanceAndMonitor() {
    let balanceDetected = false;
    const interval = setInterval(() => {
      if (balanceDetected) return;
      const balance = findBalanceLine();
      if (balance) {
        balanceDetected = true;
        setupInputMonitoring(balance);
      }
    }, 500);
  }

  waitForBalanceAndMonitor();
})();