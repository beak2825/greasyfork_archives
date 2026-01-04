// ==UserScript==
// @name         Torn Property Vault Quick Money Input
// @namespace    http://www.tornradio.com/
// @version      0.1
// @description  Add buttons to set money withdraw/deposit inputs to a target amount.
// @author       tornradio [2851045]
// @match        https://www.torn.com/properties.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456837/Torn%20Property%20Vault%20Quick%20Money%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/456837/Torn%20Property%20Vault%20Quick%20Money%20Input.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const timer = setInterval(function () {
    const area = document.querySelector("div.vault-wrap.container-ask");
    const leftInput = document.querySelector("form.vault-cont.left input.input-money");
    const rightInput = document.querySelector("form.vault-cont.right input.input-money");
    if (!(area && leftInput && rightInput)) {
      return false;
    }
    const vaultBalance = parseInt(leftInput.getAttribute("data-money"));
    const walletBalance = parseInt(rightInput.getAttribute("data-money"));

    clearInterval(timer);
    console.log("Found vault input elements.");

    const fillInputs = (walletBalance, target) => {
      if (walletBalance > target) {
        leftInput.value = "";
        leftInput.dispatchEvent(new Event("input", { bubbles: true }));
        rightInput.value = (walletBalance - target).toString();
        rightInput.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (walletBalance < target) {
        leftInput.value = (target - walletBalance).toString();
        leftInput.dispatchEvent(new Event("input", { bubbles: true }));
        rightInput.value = "";
        rightInput.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };

    const text = document.createElement("span");
    text.innerHTML = "Target wallet value:&nbsp;&nbsp;&nbsp;&nbsp;";
    text.classList.add("m-top10");
    text.classList.add("bold");
    area.parentElement.insertBefore(text, area);
    const zeroBtn = document.createElement("button");
    zeroBtn.innerText = "0";
    zeroBtn.classList.add("torn-btn");
    zeroBtn.onclick = () => {
      fillInputs(walletBalance, 0);
    };
    area.parentElement.insertBefore(zeroBtn, area);

    const fiftyKBtn = document.createElement("button");
    fiftyKBtn.innerText = "50k";
    fiftyKBtn.classList.add("torn-btn");
    fiftyKBtn.onclick = () => {
      fillInputs(walletBalance, 50000);
    };
    area.parentElement.insertBefore(fiftyKBtn, area);

    const twoHunKBtn = document.createElement("button");
    twoHunKBtn.innerText = "200k";
    twoHunKBtn.classList.add("torn-btn");
    twoHunKBtn.onclick = () => {
      fillInputs(walletBalance, 200000);
    };
    area.parentElement.insertBefore(twoHunKBtn, area);

    const oneMBtn = document.createElement("button");
    oneMBtn.innerText = "1M";
    oneMBtn.classList.add("torn-btn");
    oneMBtn.onclick = () => {
      fillInputs(walletBalance, 1000000);
    };
    area.parentElement.insertBefore(oneMBtn, area);

    const twoMBtn = document.createElement("button");
    twoMBtn.innerText = "2M";
    twoMBtn.classList.add("torn-btn");
    twoMBtn.onclick = () => {
      fillInputs(walletBalance, 2000000);
    };
    area.parentElement.insertBefore(twoMBtn, area);

    const fiveMBtn = document.createElement("button");
    fiveMBtn.innerText = "5M";
    fiveMBtn.classList.add("torn-btn");
    fiveMBtn.onclick = () => {
      fillInputs(walletBalance, 5000000);
    };
    area.parentElement.insertBefore(fiveMBtn, area);
  }, 100);
})();
