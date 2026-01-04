// ==UserScript==
// @name         MoM-525 MayhemHub Extension
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @description  Tampermonkey script extension for the MayhemHub discord bot and website, used for the Ministry of Mayhem [525] Torn faction
// @author       IAMAPEX [2523988]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503932/MoM-525%20MayhemHub%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/503932/MoM-525%20MayhemHub%20Extension.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let transferConfig = null;  // holds config for 2-step transfers

  function waitFor(selector, cb) {
    const el = document.querySelector(selector);
    return el ? cb(el) : setTimeout(() => waitFor(selector, cb), 100);
  }

  // Select the "Add to balance" radio when needed
  function setAddToBalance(useAddToBalance) {
    if (!useAddToBalance) return;

    waitFor('#add-money-to-balance', radio => {
      if (!radio.checked) {
        radio.click();
      }
    });
  }

  function autofillFields(userName, amount) {
    waitFor('input[name="searchAccount"]', input => {
      input.focus();

      const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype, 'value'
      ).set;
      nativeSetter.call(input, userName);

      input.dispatchEvent(new Event('input',  { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));

      setTimeout(() => input.click(), 200);

      waitFor('.torn-react-autocomplete .item', suggestion => {
        suggestion.click();

        if (amount.toLowerCase() !== 'all') {
          setTimeout(() => autofillAmountField(amount), 300);
        }
      });
    });
  }

  function autofillAmountField(amount) {
    waitFor('.input-money-group .input-money:not([type="hidden"])', el => {
      el.value = amount;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      setTimeout(clickGiveMoneyButton, 300);
    });
  }

  function clickGiveMoneyButton() {
    // Works for both "give money" and "add money" primary buttons
    waitFor('div.controls___A35ZN button', btn => {
      if (btn.classList.contains('disabled')) {
        setTimeout(clickGiveMoneyButton, 100);
      } else {
        btn.click();
      }
    });
  }

  function getHashParams() {
    return window.location.hash
      .slice(1)
      .split('&')
      .reduce((o, pair) => {
        const [k, v] = pair.split('=');
        if (k && v) o[k] = decodeURIComponent(v);
        return o;
      }, {});
  }

  // ─────────────────────────────────────────
  // TRANSFER FLOW (mode=transfer)
  // ─────────────────────────────────────────

  function startTransferFlow() {
    if (!transferConfig) return;
    runTransferStep1();
  }

  function runTransferStep1() {
    const cfg = transferConfig;
    if (!cfg) return;
    cfg.step = 1;

    // Always use "Add to balance" for transfers
    setAddToBalance(true);

    // Step 1: requester, negative amount
    autofillFields(cfg.fromUser, cfg.fromAmount);

    // After Torn shows the confirm box, hook the CONFIRM button
    waitFor('.confirmation___bSWqH', () => {
      // Confirm button inside the confirmation box
      waitFor('.confirmation___bSWqH .torn-btn.silver', confirmBtn => {
        confirmBtn.addEventListener('click', () => {
          // After user clicks CONFIRM, give Torn a moment to reset the form
          setTimeout(() => {
            runTransferStep2();
          }, 1500);
        }, { once: true });
      });
    });
  }

  function runTransferStep2() {
    const cfg = transferConfig;
    if (!cfg) return;
    cfg.step = 2;

    // Still using "Add to balance"
    setAddToBalance(true);

    // Step 2: recipient, positive amount
    autofillFields(cfg.toUser, cfg.toAmount);

    // User will manually confirm again; then we're done
    // Optional: clear config to avoid re-use
    setTimeout(() => {
      transferConfig = null;
    }, 5000);
  }

  // ─────────────────────────────────────────
  // MAIN ENTRY
  // ─────────────────────────────────────────

  function autoFillForm() {
    const params = getHashParams();
    const mode   = params.mode;

    // New: transfer mode – one button triggers both steps
    if (mode === 'transfer') {
      const fromUser   = params.fromUser;
      const fromAmount = params.fromAmount;
      const toUser     = params.toUser;
      const toAmount   = params.toAmount;

      if (fromUser && fromAmount && toUser && toAmount) {
        transferConfig = {
          fromUser:   fromUser,
          fromAmount: fromAmount.replace('$', ''),
          toUser:     toUser,
          toAmount:   toAmount.replace('$', ''),
          step:       0,
        };
        startTransferFlow();
      }
      return;
    }

    // Existing single-step behaviour (normal banking + optional add-balance)
    const user   = params.user;
    const amount = params.amount;
    const useAddToBalance = mode === 'add-balance';

    if (user && amount) {
      setAddToBalance(useAddToBalance);
      autofillFields(user, amount.replace('$', ''));
    }
  }

  window.addEventListener('load', autoFillForm);
})();
