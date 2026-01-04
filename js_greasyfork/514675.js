// ==UserScript==
// @name         Overdose Clairvoyant
// @version      20241113212540896
// @namespace    http://tampermonkey.net/
// @description  Warns against Xanax usage with high Energy and/or Nerve.
// @author       Marches
// @match        https://www.torn.com/item.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514675/Overdose%20Clairvoyant.user.js
// @updateURL https://update.greasyfork.org/scripts/514675/Overdose%20Clairvoyant.meta.js
// ==/UserScript==
(() => {
  // ts/XanaxWarning.ts
  (() => {
    "use strict";
    const WARNING_ENERGY = 20;
    const WARNING_NERVE = 5;
    const WARNING_CONTAINER = injectWarningContainer();
    let drugContainer = getDrugContainer();
    if (!drugContainer) {
      console.warn("Could not determine drug status.");
      return;
    }
    handleDrugStatus(hasDrugCooldown(drugContainer));
    new MutationObserver((_) => {
      handleDrugStatus(hasDrugCooldown(drugContainer));
    }).observe(drugContainer, {
      childList: true
    });
    function injectWarningContainer() {
      const injectBeforeClass = "equipped-items-wrap";
      let target = document.getElementsByClassName(injectBeforeClass)[0];
      let element = getWarningContainer();
      target.before(element);
      return element;
    }
    ;
    function getWarningContainer() {
      let container = document.createElement("div");
      container.style["backgroundColor"] = "#ffc107";
      container.style["border"] = "red solid 4px";
      container.style["borderRadius"] = "5px";
      container.style["color"] = "#000000";
      container.style["display"] = "none";
      container.style["fontSize"] = "1.5rem";
      container.style["marginBottom"] = "10px";
      container.style["padding"] = "0.5rem";
      return container;
    }
    ;
    function getDrugContainer() {
      return document.querySelector('[class*="status-icons"]');
    }
    ;
    function hasDrugCooldown(element) {
      if (!element) {
        return false;
      }
      return !!element.querySelector('[class*="icon49"],[class*="icon50"],[class*="icon51"],[class*="icon52"],[class*="icon53"]');
    }
    ;
    function handleDrugStatus(onCooldown) {
      if (onCooldown) {
        WARNING_CONTAINER.style["display"] = "none";
        return;
      }
      let statusValues = getStatusValues();
      let problems = [];
      if (statusValues.energy > WARNING_ENERGY) {
        problems.push("Energy");
      }
      if (statusValues.nerve > WARNING_NERVE) {
        problems.push("Nerve");
      }
      if (problems.length) {
        WARNING_CONTAINER.textContent = `Your ${problems.join(" and ")} ${problems.length === 1 ? "is" : "are"} high, and will be lost if you overdose on Xanax.`;
        WARNING_CONTAINER.style["display"] = "block";
      }
    }
    function getStatusValues() {
      return {
        energy: getBarValue('[class*="bar"][class*="energy"]'),
        nerve: getBarValue('[class*="bar"][class*="nerve"]')
      };
    }
    ;
    function getBarValue(selector) {
      let container = document.querySelector(selector);
      if (!container) {
        return 0;
      }
      let textDescription = container.querySelector('[class*="bar-value"]');
      if (!textDescription?.textContent) {
        return 0;
      }
      return Number(textDescription.textContent.split("/")[0]);
    }
  })();
})();
