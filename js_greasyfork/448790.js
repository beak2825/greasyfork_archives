// ==UserScript==
// @name         easy-fight
// @namespace    seintz.torn.easy-fight
// @version      6.2.1
// @author       seintz [2460991], finally [2060206], Anxiety [2149726]
// @description  move start fight and outcome button for easy click
// @license      GNU GPLv3
// @source       https://update.greasyfork.org/scripts/448790/easy-fight.user.js
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448790/easy-fight.user.js
// @updateURL https://update.greasyfork.org/scripts/448790/easy-fight.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.nstEasyFightSettings = {
    /*! leave, mug, or hosp */
    outcome: "mug",
    /*! primary, secondary, melee */
    defaultWeapon: "melee",
    /*! true or false */
    useTemp: false
  };
  /*!
   * -------------------------------------------------------------------------
   * |    DO NOT MODIFY BELOW     |
   * -------------------------------------------------------------------------
   */
  const { outcome, useTemp, defaultWeapon } = window.nstEasyFightSettings;
  const dialogSelector = 'div[class^="dialogButtons"]';
  const defenderSelector = 'div[class^="playerArea"] [class^="playerWindow"] [class*="defender"]';
  const wepImgSel = '[class^="weaponImage"] img';
  const wepWrapSel = {
    primary: "#weapon_main",
    secondary: "#weapon_second",
    melee: "#weapon_melee",
    temp: "#weapon_temp"
  };
  const waitForElement = (callback, waitElement) => {
    const element = document == null ? void 0 : document.querySelector(waitElement);
    if (element) callback(element);
    let elemFound = false;
    const obs = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        var _a;
        if (elemFound) return;
        const mutAddedNodes = Array.from(mutation.addedNodes);
        for (const mutNode of mutAddedNodes) {
          if (!(mutNode == null ? void 0 : mutNode.querySelector)) continue;
          const elem = mutNode == null ? void 0 : mutNode.querySelector(waitElement);
          const parElem = (_a = mutNode == null ? void 0 : mutNode.parentElement) == null ? void 0 : _a.querySelector(waitElement);
          const element2 = elem ? elem : parElem ? parElem : false;
          if (!element2) continue;
          callback(element2);
          elemFound = true;
          obs.disconnect();
          break;
        }
      });
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  };
  const moveButton = (startButton) => {
    if (!startButton) return;
    const startFight = startButton.innerText.toLowerCase().includes("fight");
    const wepSel = useTemp && startFight ? wepWrapSel.temp : wepWrapSel[defaultWeapon];
    const wepImgElem = document.querySelector(`${wepSel} ${wepImgSel}`);
    const wepWrapElem = document.querySelector(wepSel);
    if (!wepImgElem || !wepWrapElem) return;
    const buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add("nst-easy-fight");
    buttonWrapper.appendChild(startButton);
    wepWrapElem.insertBefore(buttonWrapper, wepImgElem.nextSibling);
    buttonWrapper.style.position = "absolute";
    buttonWrapper.style.top = wepImgElem.offsetTop + "px";
    buttonWrapper.style.left = "15px";
    startButton.addEventListener("click", () => {
      buttonWrapper.remove();
    });
  };
  const checkButtons = (node = document) => {
    if (!node) node = document;
    const buttonsList = Array.from(node == null ? void 0 : node.querySelectorAll(`${dialogSelector} button`));
    if (!buttonsList || buttonsList.length < 1) return;
    const buttonToMove = buttonsList.find((btn) => {
      const text = btn.innerText.toLowerCase();
      return text.includes(outcome.toLowerCase()) || text.includes("fight");
    });
    if (buttonToMove) moveButton(buttonToMove);
  };
  const startObs = (node) => {
    checkButtons(node);
    obsButtons.disconnect();
    obsButtons.observe(node.parentNode, { attributes: true, childList: true, subtree: true });
  };
  const obsButtons = new MutationObserver(() => checkButtons());
  const attachObs = () => waitForElement(startObs, defenderSelector);
  attachObs();
  window.addEventListener("resize", attachObs);

})();