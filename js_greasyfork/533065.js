// ==UserScript==
// @name         PPM Modo Automático
// @version      0.2.1
// @description  Automação para tarefas simples.
// @author       Maçã
// @match        https://*.popmundo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/137685
// @downloadURL https://update.greasyfork.org/scripts/533065/PPM%20Modo%20Autom%C3%A1tico.user.js
// @updateURL https://update.greasyfork.org/scripts/533065/PPM%20Modo%20Autom%C3%A1tico.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(() => {
  "use strict";

  // Do not edit above this line

  const dailyItems = [
    "Pompons",
    "Bolinha antiestresse",
    "Sapatos de dança do Capitão",
    "Livro dos Segredos",
  ];

  const yearlyItems = ["Pena dourada", "Fotografia dos avós"];

  // Do not edit below this line

  const addLogMessage = (message) => {
    const logList = document.querySelector("#am-logs>ul");

    const logItem = document.createElement("li");
    logItem.innerHTML = `<span class="material-icons viponly">star</span> ${message}`;
    logList.insertBefore(logItem, logList.firstChild);

    const firstLog = document.querySelector("#am-first-log");
    if (firstLog) {
      firstLog.remove();
    }

    const logItems = logList.querySelectorAll("li");
    if (logItems.length > 10) {
      logItems[logItems.length - 1].remove();
    }

    const storedLogs = GM_getValue("amLogs", []);
    storedLogs.unshift(message);
    if (storedLogs.length > 10) storedLogs.pop();
    GM_setValue("amLogs", storedLogs);

    document.querySelector("#am-logs").style.display = "block";
  };

  const detectCharId = () => {
    if (window.location.href.includes("ChooseCharacter")) {
      const buttons = document.querySelectorAll("p.actionbuttons>input");
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const charId = button.parentElement.parentElement
            .querySelector("div.idHolder")
            .innerText.trim();
          GM_setValue("currentCharId", charId);
          // addLogMessage(
          //   `ID do personagem definido como ${charId}.`);
        });
      });
    } else {
      if (
        window.location.href === links.character ||
        window.location.href === `${links.character}/`
      ) {
        window.addEventListener("load", () => {
          const charId = document
            .querySelector("div.idHolder")
            .innerText.trim();
          GM_setValue("currentCharId", charId);
          // addLogMessage(
          //   `ID do personagem definido como ${charId}.`);
        });
      }
    }
  };

  const server = window.location.hostname.split(".")[0];
  const baseUrl = `https://${server}.popmundo.com/World`;
  const links = {
    chooseCharacter: `${baseUrl}/Popmundo.aspx/ChooseCharacter`,
    home: `${baseUrl}/Popmundo.aspx`,
    city: `${baseUrl}/Popmundo.aspx/City`,
    locale: `${baseUrl}/Popmundo.aspx/Locale`,
    moveToLocale: `${baseUrl}/Popmundo.aspx/Locale/MoveToLocale/`,
    character: `${baseUrl}/Popmundo.aspx/Character`,
    items: `${baseUrl}/Popmundo.aspx/Character/Items`,
    artist: `${baseUrl}/Popmundo.aspx/Artist`,
    chooseCompany: `${baseUrl}/Popmundo.aspx/ChooseCompany`,
    company: `${baseUrl}/Popmundo.aspx/Company`,
    guide: `${baseUrl}/Popmundo.aspx/Guide`,
    charts: `${baseUrl}/Popmundo.aspx/Charts`,
    timezone: `${baseUrl}/Popmundo.aspx/Help/TimeZone/1`,
  };

  const randomDelay = () =>
    Math.floor(Math.random() * (6000 - 1000 + 1)) + 1000;

  const simulateClick = (element) => {
    if (element) {
      const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(event);
    }
  };

  const useDailyItems = async () => {
    const itemSelector = "td.middle>a";
    const itemList = document.querySelectorAll(itemSelector);
    const useButtonSelector = 'td.right>input[alt="OK"]';
    let useButtonList = [];

    for (let item of itemList) {
      if (dailyItems.includes(item.innerText.trim())) {
        let itemParent = item.parentElement;
        let useButtonParent = itemParent.nextElementSibling;
        let useButton = useButtonParent.querySelector(useButtonSelector);
        if (useButton) {
          useButtonList.push(useButton);
        }
        continue;
      }
    }

    if (useButtonList.length === 0) {
      addLogMessage("Nenhum item diário encontrado.");
      GM_setValue("executingDailyItems", false);
      return;
    }

    let currentIndex = GM_getValue("currentIndex", 0);
    if (currentIndex === 0) {
      addLogMessage(`Encontrados ${useButtonList.length} itens diários.`);
    }
    if (currentIndex < useButtonList.length) {
      let useButton = useButtonList[currentIndex];
      await new Promise((r) => setTimeout(r, randomDelay()));
      simulateClick(useButton);
      let itemName =
        useButton.parentElement.previousElementSibling.firstElementChild
          .innerText;
      addLogMessage(`Usando o item '${itemName}'.`);
      GM_setValue("currentIndex", currentIndex + 1);
    } else {
      GM_setValue("executingDailyItems", false);
      addLogMessage("Todos os itens diários foram usados.");
      GM_setValue("amLogs", []);
    }
  };

  const createMenu = () => {
    const sidemenu = document.querySelector("div#ppm-sidemenu");
    if (!sidemenu) return;

    const menu = document.createElement("div");
    menu.id = "automatic-mode-menu";
    menu.className = "box";
    menu.innerHTML = `
            <h2>Modo Automático</h2>
            <div class="menu">
            <ul>
                <li><a href="#" id="am-use-daily-items">Usar itens diários</a></li>
            </ul>
            </div>
            <div class="menu" id="am-logs" style="display: none;">
              <h3 class="menu">Logs</h3>
              <ul>
                <li id="am-first-log"><span class="material-icons viponly">star</span> Sem mensagens.</li>
              </ul>
            </div>`;
    sidemenu.insertBefore(menu, sidemenu.firstChild);

    const storedLogs = GM_getValue("amLogs", []);
    if (storedLogs.length > 0) {
      document.querySelector("#am-logs").style.display = "block";
      const logList = document.querySelector("#am-logs>ul");
      const firstLog = document.querySelector("#am-first-log");
      if (firstLog) firstLog.remove();
      storedLogs.forEach((msg) => {
        const logItem = document.createElement("li");
        logItem.innerHTML = `<span class="material-icons viponly">star</span> ${msg}`;
        logList.appendChild(logItem);
      });
    }

    window.addEventListener("load", () => {
      const executingDailyItems = GM_getValue("executingDailyItems", false);
      if (executingDailyItems) {
        if (window.location.href.includes(links.items)) {
          useDailyItems();
        } else {
          GM_setValue("executingDailyItems", false);
          GM_setValue("amLogs", []);
        }
      } else {
        GM_setValue("amLogs", []);
      }
    });

    document
      .querySelector("#am-use-daily-items")
      .addEventListener("click", (event) => {
        event.preventDefault();
        const isExecuting = GM_getValue("executingDailyItems", false);
        if (isExecuting) {
          return;
        }

        GM_setValue("amLogs", []);
        GM_setValue("currentIndex", 0);
        GM_setValue("executingDailyItems", true);

        if (!window.location.href.includes(links.items)) {
          const charId = GM_getValue("currentCharId", 1);
          window.location.href = `${links.items}/${charId}`;
        } else {
          useDailyItems();
        }
      });
  };

  detectCharId();
  createMenu();
})();
