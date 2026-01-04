// ==UserScript==
// @name         SPM Enhancer
// @namespace    https://jlcareglio.github.io/
// @version      0.5.1
// @description  Mejora las planillas de Steam Profit Maker agregando filtros y interactividad
// @icon         https://user-images.githubusercontent.com/23004689/241535018-7a2f7e2e-c469-4843-a223-56d8c946e98d.svg
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @author       Jesús Lautaro Careglio Albornoz
// @match        https://docs.google.com/spreadsheets/*/pub*
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/472774/SPM%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/472774/SPM%20Enhancer.meta.js
// ==/UserScript==

(() => {
  if (!document.title.includes("💰 Steam Profit Maker")) return;

  const defaultFilters = {
    adult: false,
    commentLevel: 1,
    aveProfit: -Infinity,
    maxProfit: -Infinity,
    minProfit: -Infinity,
    hidingGames: false,
    hiddenGames: [],
  };

  const states = {
    adult: [
      { state: "🔞❎", value: false },
      { state: "🔞✅", value: true },
    ],
    commentLevel: [
      { state: "💬👀🔴", value: 0 },
      { state: "💬👀🟠", value: 1 },
      { state: "💬👀🟡", value: 2 },
      { state: "💬👀🟢", value: 3 },
    ],
    hidingGames: [
      { state: "🐵🎮", value: false, run: fetchUserGames },
      { state: "🙈🎮", value: true },
    ],
  };

  let filters = loadFilters();
  filters = filters ? { ...defaultFilters, ...filters } : defaultFilters;

  let firstFetchGames = true;

  hideElements([
    "#doc-title",
    "#footer",
    "div > tr:nth-child(7)",
    "tr:nth-child(8)",
    "tr:nth-child(9)",
  ]);
  document.querySelector("#sheets-viewport").style.height = "auto";

  const [homeSheet, ...gameSheets] = document.querySelectorAll(
    "div > table > tbody"
  );
  const games = gameSheets.flatMap((gameSheet) =>
    Array.from(gameSheet.querySelectorAll("tr:not(:first-child)"))
  );

  applyFilters();

  function loadFilters() {
    const storedFilters = localStorage.getItem("filters");
    return JSON.parse(storedFilters, (key, value) =>
      value === "Infinity"
        ? Infinity
        : value === "-Infinity"
        ? -Infinity
        : value
    );
  }

  function saveFilters() {
    localStorage.setItem(
      "filters",
      JSON.stringify(filters, (key, value) =>
        value === Infinity
          ? "Infinity"
          : value === -Infinity
          ? "-Infinity"
          : value
      )
    );
  }

  function hideElements(selectors) {
    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) element.style.display = "none";
    });
  }

  function applyFilters() {
    games.forEach((row) => {
      const cellAdult = row.querySelector("td:nth-child(2)");
      const adultState =
        cellAdult.querySelector("svg > use")?.href.baseVal ===
        "#checked-checkbox-id";

      const cellName = row.querySelector("td:nth-child(4)");
      const gameId = parseInt(
        cellName.querySelector("a").href.match(/\/app\/(\d+)/)[1]
      );

      const cellComment = row.querySelector("td:nth-child(11)").textContent;
      let commentLevel;
      if (cellComment.includes("no se vende")) commentLevel = 0;
      else if (cellComment.includes("muy poco")) commentLevel = 1;
      else if (cellComment.includes("algunas ventas")) commentLevel = 2;
      else if (cellComment.includes("con frecuencia")) commentLevel = 3;
      else commentLevel = 4;

      const cellAveProfit = row.querySelector("td:nth-child(8)");
      const cellMaxProfit = row.querySelector("td:nth-child(9)");
      const cellMinProfit = row.querySelector("td:nth-child(10)");
      const aveProfit = parseFloat(cellAveProfit.textContent.replace("$", ""));
      const maxProfit = parseFloat(cellMaxProfit.textContent.replace("$", ""));
      const minProfit = parseFloat(cellMinProfit.textContent.replace("$", ""));

      const showByAdult = filters.adult === true ? true : !adultState;

      let showByHiddenGames = true;
      if (filters.hidingGames)
        showByHiddenGames = !filters.hiddenGames.includes(gameId);

      const showByComment = commentLevel >= filters.commentLevel;
      const showByAveProfit = aveProfit > filters.aveProfit;
      const showByMaxProfit = maxProfit > filters.maxProfit;
      const showByMinProfit = minProfit > filters.minProfit;

      row.style.display =
        showByAdult &&
        showByHiddenGames &&
        showByComment &&
        showByAveProfit &&
        showByMaxProfit &&
        showByMinProfit
          ? ""
          : "none";
    });

    saveFilters();
  }

  function fetchUserGames() {
    if (!firstFetchGames) return;

    const msj =
      "¿Quieres ocultar en la lista tus juegos ya adquiridos?\nLos juegos a ocultar se obtendrán desde tu cuenta de Steam actual";
    const userConfirm = filters.hiddenGames.length ? true : confirm(msj);

    if (userConfirm) {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://store.steampowered.com/dynamicstore/userdata/",
        headers: { "Content-Type": "application/json" },
        onload: function (response) {
          const ownedApps = JSON.parse(response?.response)?.rgOwnedApps;
          if (ownedApps && ownedApps.length) filters.hiddenGames = ownedApps;
          else
            alert(
              "ERROR: o tu sesión de Steam no está iniciada o no tienes productos adquiridos"
            );
          applyFilters();
        },
      });
    }

    firstFetchGames = false;
  }

  function createToggleButton(buttonStates, filterKey) {
    let index = buttonStates.findIndex(
      (state) => state.value === filters[filterKey]
    );

    if (index === -1)
      [index, filters[filterKey]] = [0, defaultFilters[filterKey]];

    const button = document.createElement("button");
    button.textContent = buttonStates[index].state;
    button.style.margin = "0px 2px";
    document.querySelector("#sheet-menu").appendChild(button);

    button.addEventListener("click", () => {
      if (buttonStates[index].run) buttonStates[index].run();
      index = (index + 1) % buttonStates.length;
      button.textContent = buttonStates[index].state;
      filters[filterKey] = buttonStates[index].value;
      applyFilters();
    });
  }

  function createProfitButtons(buttons) {
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "inline-flex";
    buttonContainer.style.margin = "0px 0px 0px 2px";

    function createButtonPair(buttonIndex) {
      const buttonElement = document.createElement("button");
      buttonElement.textContent = buttons[buttonIndex].state;

      const inputElement = document.createElement("input");
      inputElement.type = "number";
      inputElement.style.width = "38px";
      inputElement.style.height = "18px";
      inputElement.style.textAlign = "center";
      inputElement.step = 0.2;
      inputElement.value = parseFloat(filters[buttons[buttonIndex].filterKey]);

      const buttonPairContainer = document.createElement("div");
      buttonPairContainer.style.alignItems = "center";
      buttonPairContainer.appendChild(buttonElement);
      buttonPairContainer.appendChild(inputElement);

      buttonPairContainer.style.display =
        inputElement.value == "" ? "none" : "inline-flex";
      buttonContainer.appendChild(buttonPairContainer);

      buttonElement.addEventListener("click", () => {
        const buttonPairs = Array.from(buttonContainer.querySelectorAll("div"));
        const [hiddenButtons, shownButtons] = Array.from(buttonPairs).reduce(
          ([hidden, shown], e) => {
            if (e.style.display == "none") hidden.push(e);
            else if (e.style.display == "inline-flex") shown.push(e);
            return [hidden, shown];
          },
          [[], []]
        );

        const emptyInputs = shownButtons.filter(
          (e) =>
            e.querySelector("input").value == "" && e != buttonPairContainer
        );

        if (emptyInputs.length)
          emptyInputs.forEach((e) => (e.style.display = "none"));
        else {
          if (inputElement.value == "") {
            buttonPairContainer.style.display = "none";
          }
          if (hiddenButtons.length) {
            hiddenButtons.at(-1).style.display = "inline-flex";
            buttonContainer.prepend(hiddenButtons.at(-1));
          }
        }
      });

      inputElement.addEventListener("change", () => {
        const valueParsed = parseFloat(inputElement.value);
        filters[buttons[buttonIndex].filterKey] = isNaN(valueParsed)
          ? -Infinity
          : valueParsed;
        applyFilters();
      });
    }

    for (let i = 0; i < buttons.length; i++) createButtonPair(i);

    document.querySelector("#sheet-menu").appendChild(buttonContainer);
    if (
      Array.from(buttonContainer.querySelectorAll("div")).every(
        (e) => e.style.display == "none"
      )
    )
      buttonContainer.querySelectorAll("div")[0].style.display = "inline-flex";
  }

  createToggleButton(states.hidingGames, "hidingGames");
  createToggleButton(states.adult, "adult");
  createToggleButton(states.commentLevel, "commentLevel");

  createProfitButtons([
    { state: "min💸➡️", filterKey: "aveProfit" },
    { state: "min💸↘️", filterKey: "minProfit" },
    { state: "min💸↗️", filterKey: "maxProfit" },
  ]);
})();

GM_addStyle(`
    :root {
        --dark: #1c1e1f;
        --gray: #3b3b3b;
        --gray-light: #878787;
        --primary: #322702;
        --secondary: #473503;
        --terciary: #473503;
        --green-primary: #0e3726;
        --green-secondary: #18583e;
        --blue-primary: #0a383f;
        --blue-secondary: #0f5a64;
        --blue-terciary: #56a3f1;
        --text: #f3f3f3;
    }
    body {
        background-color: var(--dark);
        text-align: center;
    }
    #top-bar {
        border: none;
    }
    th {
        border-color: var(--dark)!important;
    }
    .grid-container {
        background-color: var(--dark);
    }
    table {
        margin: 0 auto;
    }
    #sheet-menu {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    #sheet-menu a, #sheet-menu a:visited{
        color: var(--blue-terciary);
    }
    #sheet-menu li.active {
        background-color: var(--dark);
        border-bottom: none;
        border-radius: 8px 8px 0px 0px;
    }
    #sheet-menu li a:hover {
        text-decoration: none;
    }
    button,
    input {
        background-color: var(--gray);
        border: 1px solid var(--dark);
        border-radius: 4px;
        color: var(--text);
    }
    button:hover,
    input:hover {
        background-color: var(--gray-light);
    }
    `);
