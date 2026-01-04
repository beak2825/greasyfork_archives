// ==UserScript==
// @name         TORN: Ghost Bank
// @namespace    dekleinekobini.private.ghostbank
// @version      1.3.0
// @author       DeKleineKobini [2114440]
// @description  Make trades easier to use as a bank.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/trade.php*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/498997/TORN%3A%20Ghost%20Bank.user.js
// @updateURL https://update.greasyfork.org/scripts/498997/TORN%3A%20Ghost%20Bank.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" ._gbButtons_tfnt2_1{display:flex;gap:5px}._gbButton_tfnt2_1{font-family:Fjalla One,Arial,serif;font-size:14px;font-weight:400;text-transform:uppercase;border-radius:5px;padding:0 10px;cursor:pointer;color:var(--btn-color, #555);text-shadow:var(--btn-text-shadow, 0 1px 0 rgba(255, 255, 255, .2509803922));background:var(--btn-background, linear-gradient(180deg, #dedede 0%, #f7f7f7 25%, #cfcfcf 60%, #e7e7e7 78%, #d9d9d9 100%));border:var(--btn-border, 1px solid #aaa);height:34px;line-height:34px}._gbButton_tfnt2_1:hover,._gbButton_tfnt2_1:focus{color:var(--btn-hover-color, #444);text-shadow:var(--btn-hover-text-shadow, 0 0 5px #fff);background:var(--btn-hover-background, linear-gradient(180deg, #cccccc 0%, #ffffff 25%, #bbbbbb 60%, #eeeeee 78%, #bbbbbb 100%));border:var(--btn-hover-border, 1px solid #999)}._gbButton_tfnt2_1:active{color:var(--btn-active-color, #444);text-shadow:var(--btn-active-text-shadow, 0 0 5px #fff);background:var(--btn-active-background, linear-gradient(180deg, #c4c4c4 0%, #e9e9e9 100%));border:var(--btn-active-border, none);box-shadow:var(--btn-active-box-shadow, inset 0 1px 0 rgba(0, 0, 0, .0705882353), 0 1px 0 #fff)}._gbButton_tfnt2_1:disabled{color:var(--btn-disable-color, #aaa);text-shadow:var(--btn-disable-text-shadow, none);background:var(--btn-disable-background, linear-gradient(180deg, #c4c4c4 0%, #e9e9e9 100%));border:var(--btn-disable-border, none);box-shadow:var(--btn-disable-box-shadow, inset 0 1px 0 rgba(0, 0, 0, .0705882353), 0 1px 0 #fff);cursor:default}._gbInput_tfnt2_43{display:inline-block;vertical-align:middle;text-align:left;color:var(--input-money-color, #000);background:var(--input-money-background-color, #fff);border:1px solid var(--input-money-border-color, #ccc);padding:9px 5px;border-radius:5px;line-height:14px} ");

(function () {
  'use strict';

  async function findDelayed(node, findElement, timeout) {
    return new Promise((resolve, reject) => {
      const initialElement = findElement();
      if (initialElement) {
        resolve(initialElement);
        return;
      }
      const observer = new MutationObserver(() => {
        const element = findElement();
        element && (clearTimeout(timeoutId), observer.disconnect(), resolve(element));
      }), timeoutId = setTimeout(() => {
        observer.disconnect(), reject("Failed to find the element within the acceptable timeout.");
      }, timeout);
      observer.observe(node, { childList: true, subtree: true });
    });
  }
  async function findBySelectorDelayed(node = document, selector, timeout = 5e3) {
    return findDelayed(node, () => node.querySelector(selector), timeout);
  }
  function formatNumber(original, decimals = 2) {
    const pattern = `\\d(?=(\\d{3})+${decimals > 0 ? "\\." : "$"})`;
    return original.toFixed(Math.max(0, ~~decimals)).replace(new RegExp(pattern, "g"), "$&,");
  }
  const gbButtons = "_gbButtons_tfnt2_1";
  const gbButton = "_gbButton_tfnt2_1";
  const gbInput = "_gbInput_tfnt2_43";
  const styles = {
    gbButtons,
    gbButton,
    gbInput
  };
  function displayButtons() {
    if (document.querySelector(`.${styles.gbButtons}`) ?? !window.location.hash.includes("step=addmoney")) return;
    const tradeContentElement = document.querySelector(`form[action*='addmoney'] .inputs`);
    if (!tradeContentElement) {
      console.error("[GB] Failed to find trade content element");
      return;
    }
    const delimiter = document.createElement("hr");
    delimiter.classList.add("delimiter");
    tradeContentElement.appendChild(delimiter);
    const gbButtons2 = document.createElement("div");
    gbButtons2.classList.add(styles.gbButtons);
    const gbMaxButton = document.createElement("button");
    gbMaxButton.classList.add(styles.gbButton);
    gbMaxButton.addEventListener("click", (event) => {
      event.preventDefault();
      const currentAmount = getTradeAmount();
      const moneyOnHand = getMoneyOnHand();
      if (moneyOnHand <= 0) return;
      gbMaxButton.setAttribute("disabled", "");
      setMoneyValue(currentAmount + moneyOnHand).then((response) => {
        gbMaxButton.removeAttribute("disabled");
        updateTradeUI(response);
      }).catch((cause) => console.error("[GB] Some error occurred when updating the trade amount.", cause));
      setTimeout(() => {
        if (gbMaxButton.checkVisibility() && gbMaxButton.hasAttribute("disabled")) {
          gbMaxButton.removeAttribute("disabled");
        }
      }, 1e3);
    });
    gbMaxButton.textContent = "Max";
    gbButtons2.appendChild(gbMaxButton);
    const gbAddInput = document.createElement("input");
    gbAddInput.classList.add(styles.gbInput);
    gbButtons2.appendChild(gbAddInput);
    const gbAddButton = document.createElement("button");
    gbAddButton.classList.add(styles.gbButton);
    gbAddButton.addEventListener("click", (event) => {
      event.preventDefault();
      const currentAmount = getTradeAmount();
      const inputAmount = moneyTextToNumber(gbAddInput.value);
      if (inputAmount <= 0) return;
      gbAddButton.setAttribute("disabled", "");
      setMoneyValue(currentAmount + inputAmount).then((response) => {
        gbAddButton.removeAttribute("disabled");
        updateTradeUI(response);
      }).catch((cause) => console.error("[GB] Some error occurred when updating the trade amount.", cause));
      setTimeout(() => {
        if (gbAddButton.checkVisibility() && gbAddButton.hasAttribute("disabled")) {
          gbAddButton.removeAttribute("disabled");
        }
      }, 1e3);
    });
    gbAddButton.textContent = "Add";
    gbButtons2.appendChild(gbAddButton);
    tradeContentElement.appendChild(gbButtons2);
  }
  async function setMoneyValue(newAmount) {
    const trade = new URLSearchParams(window.location.hash).get("ID");
    return await fetch("https://www.torn.com/trade.php", {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest"
      },
      referrer: "https://www.torn.com/trade.php",
      body: `step=view&ID=${trade}&ajax=true&amount=${newAmount}&sub_step=addmoney2`,
      method: "POST"
    }).then((response) => response.text());
  }
  function moneyTextToNumber(moneyText) {
    let modifiedMoneyText = moneyText.replaceAll(",", "");
    if (modifiedMoneyText.startsWith("$")) {
      modifiedMoneyText = modifiedMoneyText.substring(1);
    }
    const output = parseInt(modifiedMoneyText, 10);
    if (!output) return 0;
    return output;
  }
  function getTradeAmount() {
    const moneyInput = document.querySelector(".input-money[type='hidden']");
    if (!(moneyInput == null ? void 0 : moneyInput.value)) return 0;
    return parseInt(moneyInput.value, 10);
  }
  function getMoneyOnHand() {
    const userMoneyElement = document.getElementById("user-money");
    if (!userMoneyElement) return 0;
    const numberString = userMoneyElement.dataset.money;
    if (!numberString) return 0;
    return parseInt(numberString, 10);
  }
  function updateTradeUI(response) {
    var _a, _b;
    const templateElement = document.createElement("div");
    templateElement.innerHTML = response;
    const newMoneyRow = templateElement.querySelector(".trade-cont .user.left .cont > li");
    const newMoneyValueText = (_b = (_a = newMoneyRow.querySelector(".name")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    const moneyField = document.querySelector(".input-money[type='text']");
    const moneyFieldHidden = document.querySelector(".input-money[type='hidden']");
    if (newMoneyValueText && moneyField && moneyFieldHidden) {
      const newMoney = moneyTextToNumber(newMoneyValueText);
      moneyField.value = formatNumber(newMoney, 0);
      moneyFieldHidden.value = newMoney.toString();
    }
  }
  const SHORTCUTS = ["Shift", "Enter"];
  (() => {
    window.addEventListener("hashchange", () => {
      if (!window.location.hash.includes("step=addmoney")) return;
      const tradeContainer = document.querySelector(`#trade-container`);
      if (!tradeContainer) {
        console.error("[GB] Failed to find trade container.");
        return;
      }
      void findBySelectorDelayed(tradeContainer, ".init-trade").then(() => displayButtons());
    });
    window.addEventListener("keydown", (event) => {
      if (!window.location.hash.includes("step=addmoney")) return;
      if (!SHORTCUTS.includes(event.key)) return;
      const currentAmount = getTradeAmount();
      const moneyOnHand = getMoneyOnHand();
      if (moneyOnHand <= 0) return;
      setMoneyValue(currentAmount + moneyOnHand).then((response) => updateTradeUI(response)).catch((cause) => console.error("[GB] Some error occurred when updating the trade amount.", cause));
    });
    void findBySelectorDelayed(document, ".init-trade").then(() => displayButtons());
  })();

})();