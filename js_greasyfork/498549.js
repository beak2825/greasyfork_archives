// ==UserScript==
// @name         TORN: Revive Percentage
// @namespace    dekleinekobini.private.revivepercentage
// @version      1.0.5
// @author       DeKleineKobini [2114440]
// @description  Show whether a revive would be covered under the contract.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/profiles.php*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/498549/TORN%3A%20Revive%20Percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/498549/TORN%3A%20Revive%20Percentage.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" ._rpHostileRevive_1pb1u_1{color:red;float:right;margin-right:10px}._rpReviveNotCovered_1pb1u_7{color:red}._rpReviveCovered_1pb1u_11{color:green} ");

(function () {
  'use strict';

  function isElement(node) {
    return node.nodeType === Node.ELEMENT_NODE;
  }
  function isHTMLElement(node) {
    return isElement(node) && node instanceof HTMLElement;
  }
  const rpHostileRevive = "_rpHostileRevive_1pb1u_1";
  const rpReviveNotCovered = "_rpReviveNotCovered_1pb1u_7";
  const rpReviveCovered = "_rpReviveCovered_1pb1u_11";
  const styles = {
    rpHostileRevive,
    rpReviveNotCovered,
    rpReviveCovered
  };
  const REVIVE_CONTRACTS = [
    { faction: "Dystopia", percentage: 50 },
    { faction: "Monarch HQ", percentage: 30 },
    { faction: "Xenon", percentage: 50 },
  ];
  function startRevivePercentage(contract) {
    const profileContainer = document.querySelector(".profile-container");
    if (!profileContainer) {
      console.error("[RP] Couldn't find profile container.");
      return;
    }
    new MutationObserver((mutations) => {
      const filteredMutations = mutations.filter(
        (mutation) => Array.from(mutation.addedNodes).filter(isHTMLElement).find((node) => {
          var _a;
          return node.classList.contains("profile-buttons-dialog") && ((_a = node.textContent) == null ? void 0 : _a.includes("Reviving"));
        })
      );
      if (!filteredMutations.length) return;
      handleRevivePercentage(contract);
    }).observe(profileContainer, { childList: true });
  }
  function handleRevivePercentage(contract) {
    const profileButtonsDialogElement = document.querySelector(".profile-buttons-dialog");
    if (!profileButtonsDialogElement) {
      console.error("[RP] Couldn't find the profile buttons dialog.");
      return;
    }
    const reviveTextBoldElements = Array.from(profileButtonsDialogElement.querySelectorAll(".text b"));
    if (reviveTextBoldElements.length <= 0) {
      console.error("[RP] Couldn't find the revive text element.");
      return;
    }
    const successRateElement = reviveTextBoldElements.find((element) => {
      var _a;
      return (_a = element.textContent) == null ? void 0 : _a.includes("%");
    });
    if (!successRateElement || successRateElement.textContent === null) {
      console.error("[RP] Couldn't find the revive text element.");
      return;
    }
    const successRate = parseFloat(successRateElement.textContent);
    const isCovered = successRate >= contract.percentage;
    profileButtonsDialogElement.classList.add(isCovered ? styles.rpReviveCovered : styles.rpReviveNotCovered);
    console.log("DKK revive percentage", successRate, isCovered);
  }
  function warnHostileRevive() {
    const actionsTitle = document.querySelector(".profile-action .title-black");
    if (!actionsTitle) {
      console.error("[RP] Couldn't find actions title.");
      return;
    }
    const warnElement = document.createElement("span");
    warnElement.className = styles.rpHostileRevive;
    warnElement.textContent = "!!! POSSIBLE NON-CONTRACT REVIVE !!!";
    actionsTitle.appendChild(warnElement);
  }
  function initiateProfile(infoTable) {
    var _a;
    const factionName = (_a = infoTable.querySelector(".user-info-value a[href*='factions']")) == null ? void 0 : _a.textContent;
    if (!factionName) return;
    const contract = REVIVE_CONTRACTS.find((c) => c.faction === factionName);
    if (contract) startRevivePercentage(contract);
    else warnHostileRevive();
  }
  (() => {
    const infoTable = document.querySelector(".info-table");
    if (infoTable) initiateProfile(infoTable);
    else {
      const userProfile = document.querySelector(".user-profile");
      new MutationObserver((_, observer) => {
        const tableElement = document.querySelector(".info-table");
        if (!tableElement) return;
        observer.disconnect();
        initiateProfile(tableElement);
      }).observe(userProfile, { childList: true, subtree: true });
    }
  })();

})();