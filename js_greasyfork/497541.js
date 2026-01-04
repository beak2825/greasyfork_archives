// ==UserScript==
// @name         GTA Token Clicker by t.me/stiflerhub
// @name:ru      GTA Token Кликер by t.me/stiflerhub
// @version      0.8
// @description  Automated GTA Token Clicker
// @description:ru Скрипт для автоматического боя с бандитами GTA
// @author       stiflerproger
// @match        https://clicgta.com/*
// @supportURL   https://github.com/stiflerproger/gta-monkey
// @homepageURL  https://github.com/stiflerproger/gta-monkey
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clicgta.com
// @grant        none
// @run-at document-start
// @license MIT
// @namespace https://greasyfork.org/users/1315776
// @downloadURL https://update.greasyfork.org/scripts/497541/GTA%20Token%20Clicker%20by%20tmestiflerhub.user.js
// @updateURL https://update.greasyfork.org/scripts/497541/GTA%20Token%20Clicker%20by%20tmestiflerhub.meta.js
// ==/UserScript==

// отключаем модалку "Закрыть сайт?"
EventTarget.prototype.addEventListenerBase =
  EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener) {
  if (type === "beforeunload") {
    return;
  }
  this.addEventListenerBase(type, listener);
};

(async function () {
  addConfigMenu();

  const Selectors = {
    menuBattle: "#battle-navigation",
    menuUpgrades: "#upgrades-navigation",
    menuLeaderboard: "#leaderboard-navigation",
    menuReferrals: "#referrals-navigation",
    energyPercentage: ".battle__footer-energy-percentage",
    energyPopup: ".energy-popup",
    enemySpine: ".battle__player-container",
    cyclePopup: "#CyclePopup",
  };

  const fightEndReasons = {
    noEnergy: 1,
    allEnemiesKilled: 2,
  };

  await waitForElement(Selectors.menuBattle);
  await sleep(5000);

  const endReason = await fight();

  await sleep(5000);
  window.close();

  async function fight() {
    await goto("battle");

    await waitForElement(Selectors.enemySpine);

    let energy = await getEnergy();

    const enemyCoords = getSelectorCoords(Selectors.enemySpine);

    while (
      !document.querySelector(Selectors.energyPopup) &&
      !document.querySelector(Selectors.cyclePopup)
    ) {
      (await waitForElement(Selectors.enemySpine)).dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          clientX: enemyCoords.x,
          clientY: enemyCoords.y,
        }),
      );

      await sleep(randomInt(50, 250));

      energy = await getEnergy();
    }

    if (document.querySelector(Selectors.cyclePopup)) {
      return fightEndReasons.allEnemiesKilled;
    }

    if (!energy) {
      return fightEndReasons.noEnergy;
    }

    return 0;
  }

  function getSelectorCoords(selector) {
    const coords = document.querySelector(selector).getBoundingClientRect();

    return {
      x: randomInt(
        Math.floor(coords.left + 1),
        Math.floor(coords.left + coords.width - 1),
      ),
      y: randomInt(
        Math.floor(coords.top + 1),
        Math.floor(coords.top + coords.height - 1),
      ),
    };
  }

  async function getEnergy() {
    await waitForElement(Selectors.energyPercentage);

    return parseInt(
      document.querySelector(Selectors.energyPercentage).innerText,
    );
  }

  async function goto(page) {
    if (page === "battle") {
      await waitForElementAndClick(Selectors.menuBattle);
    }
  }

  async function waitForElement(selector) {
    while (true) {
      if (document.querySelector(selector)) {
        return document.querySelector(selector);
      }

      await sleep(500);
    }
  }

  async function waitForElementAndClick(selector) {
    const el = await waitForElement(selector);
    el.click();
    await sleep(1000);
  }

  function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})();

function addConfigMenu() {
  const menuStyle = document.createElement("style");
  menuStyle.innerHTML = `
    #botMenu {
      display: flex;
      position: absolute;
      right: 20px;
      top: 20px;
      border: 1px solid #e8e8e8;
      border-radius: 10px;
      padding: 15px;
      color: white;
    }
  `;

  const menuEl = document.createElement("div");
  menuEl.id = "botMenu";
  menuEl.innerHTML = `
    <div class="botTitle">GTA Token Clicker by t.me/stiflerhub</div>
  `;

  document.body.append(menuStyle);
  document.body.append(menuEl);
}
