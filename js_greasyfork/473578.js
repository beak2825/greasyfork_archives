// ==UserScript==
// @name         PI Vault Quick Money Inputs
// @namespace    http://www.torn.com/
// @version      1.0
// @description  Add buttons to set money withdraw amount. Auto fill in deposit value and focus on deposit button.
// @author       bot_7420 [2937420]
// @match        https://www.torn.com/properties.php
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473578/PI%20Vault%20Quick%20Money%20Inputs.user.js
// @updateURL https://update.greasyfork.org/scripts/473578/PI%20Vault%20Quick%20Money%20Inputs.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const presetWithDrawValues = [500000, 1000000, 5000000, 10000000, 50000000, 100000000]; // Modify here to change preset withdraw values.

  const pageObserverConfig = { attributes: true, childList: true, subtree: true };
  const pageObserver = new MutationObserver(() => {
    handlePageChange();
  });
  const pageObserverTimer = setInterval(() => {
    const selectedElements = document.querySelectorAll("div#properties-page-wrap");
    if (selectedElements.length > 0) {
      console.log("VaultInput: pageObserver observe");
      clearInterval(pageObserverTimer);
      pageObserver.observe(selectedElements[0], pageObserverConfig);
      handlePageChange();
      initBalanceObserver();
    }
  }, 100);

  function initBalanceObserver() {
    const balanceObserverConfig = { attributes: true, childList: true, subtree: true };
    const balanceObserver = new MutationObserver(() => {
      handleBalanceChange();
    });
    const balanceObserverTimer = setInterval(() => {
      const selectedElements = document.querySelectorAll("span#user-money");
      if (selectedElements.length > 0) {
        console.log("VaultInput: balanceObserver observe");
        clearInterval(balanceObserverTimer);
        handleBalanceChange();
        balanceObserver.observe(selectedElements[0], balanceObserverConfig);
      }
    }, 100);
  }

  function handlePageChange() {
    const area = document.querySelector("div.vault-wrap.container-ask");
    const leftInput = document.querySelector("form.vault-cont.left input.input-money");
    if (!(area && leftInput)) {
      // input areas probably have not loaded
      return;
    }
    if (document.querySelector("span#scripted-btn")) {
      // buttons already exist
      return;
    }
    addButtons(area, leftInput);
    handleBalanceChange();
  }

  function handleBalanceChange() {
    const balance = document.querySelector("span#user-money");
    const rightInput = document.querySelector("form.vault-cont.right input.input-money");
    const rightButton = document.querySelector("form.vault-cont.right.deposit-box input.torn-btn");
    if (balance && rightInput && rightButton) {
      console.log("VaultInput: handleBalanceChange change balance");
      fillInput(rightInput, balance.getAttribute("data-money"));
      rightButton.focus({ focusVisible: true, preventScroll: true });
    }
  }

  const fillInput = (input, target) => {
    input.value = target.toString();
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };

  function addButtons(area, leftInput) {
    const text = document.createElement("span");
    text.innerHTML = "Withdraw value:&nbsp;&nbsp;&nbsp;&nbsp;";
    text.id = "scripted-btn";
    text.classList.add("m-top10");
    text.classList.add("bold");
    area.parentElement.insertBefore(text, area);

    for (const value of presetWithDrawValues) {
      const btn = document.createElement("button");
      btn.innerText = numberFormatter(value.toString());
      btn.classList.add("torn-btn");
      btn.onclick = () => {
        fillInput(leftInput, value);
      };
      area.parentElement.insertBefore(btn, area);
    }
  }

  function numberFormatter(num, digits = 1) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }
})();
