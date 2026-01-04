// ==UserScript==
// @name         Steam Cracked & Deals Hub
// @description  Adds custom URL buttons on Steam pages for cracked and deal sites.
// @version      2.2
// @license      MIT
// @author       6969RandomGuy6969
// @match        https://store.steampowered.com/app/*
// @icon         https://i.imgur.com/8CoJnwB.png
// @namespace    https://greasyfork.org/users/1167434
// @downloadURL https://update.greasyfork.org/scripts/527651/Steam%20Cracked%20%20Deals%20Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/527651/Steam%20Cracked%20%20Deals%20Hub.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const gameName = decodeURIComponent(window.location.pathname.split("/")[3].replace(/_/g, " "));
  const ignoreButton = document.querySelector("#ignoreBtn");

  // Inject modern CSS styles
  const style = document.createElement('style');
  style.textContent = `
    .steam-hub-container {
      margin-top: 50px;
      padding: 20px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0px;
    }

    .steam-hub-section {
      margin-bottom: 30px;
    }

    .steam-hub-section:last-child {
      margin-bottom: 0;
    }

    .steam-hub-header {
      font-weight: bold;
      font-size: 21px;
      margin-bottom: 15px;
      text-transform: uppercase;
      color: inherit;
    }

    .steam-hub-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .steam-hub-button-wrapper {
      position: relative;
      display: inline-block;
    }

    .steam-hub-button {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 160px;
      height: 40px;
      text-align: center;
      cursor: pointer;
      background-color: rgba(103, 193, 245, 0.2);
      color: #67c1f5;
      font-size: 14px;
      border-radius: 6px;
      text-decoration: none;
      transition: background-color 0.2s;
    }

    .steam-hub-button:hover {
      background-color: rgba(103, 193, 245, 0.3);
    }

    .steam-hub-delete-btn {
      position: absolute;
      top: -5px;
      right: -5px;
      background: red;
      color: white;
      border: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 12px;
      display: none;
      z-index: 10;
    }

    .steam-hub-controls {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .steam-hub-add-btn {
      background: linear-gradient(to right, #6fa720 5%, #588a1b 95%);
      color: #d2efa9;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.3s;
      width: fit-content;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .steam-hub-add-btn:hover {
      background: linear-gradient(to right, #75b022 5%, #588a1b 95%);
      color: #fff;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(111, 167, 32, 0.4);
      transform: translateY(-2px);
    }

    .steam-hub-input-container {
      display: none;
      flex-direction: column;
      gap: 5px;
      margin-top: 10px;
    }

    .steam-hub-input {
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(103, 193, 245, 0.2);
      border-radius: 4px;
      color: #c7d5e0;
      font-size: 13px;
    }

    .steam-hub-input:focus {
      outline: none;
      border-color: #67c1f5;
    }

    .steam-hub-input::placeholder {
      color: rgba(199, 213, 224, 0.5);
    }

    .steam-hub-button-group {
      display: flex;
      gap: 5px;
    }

    .steam-hub-confirm-btn {
      background: linear-gradient(to right, #6fa720 5%, #588a1b 95%);
      color: white;
      border: none;
      padding: 10px 18px;
      cursor: pointer;
      border-radius: 6px;
      font-weight: 500;
      font-size: 13px;
      flex: 1;
      transition: all 0.3s;
    }

    .steam-hub-confirm-btn:hover {
      background: linear-gradient(to right, #75b022 5%, #588a1b 95%);
      box-shadow: 0 4px 12px rgba(111, 167, 32, 0.4);
    }

    .steam-hub-cancel-btn {
      background: #8f98a0;
      color: white;
      border: none;
      padding: 10px 18px;
      cursor: pointer;
      border-radius: 6px;
      font-weight: 500;
      font-size: 13px;
      flex: 1;
      transition: background 0.2s;
    }

    .steam-hub-cancel-btn:hover {
      background: #7a8288;
    }

    @media (max-width: 768px) {
      .steam-hub-button {
        min-width: 140px;
      }
    }
  `;
  document.head.appendChild(style);

  // Helpers for local storage
  function saveCustomSites(key, data) {
    localStorage.setItem("steam_links_custom_" + key, JSON.stringify(data));
  }

  function loadCustomSites(key) {
    try {
      return JSON.parse(localStorage.getItem("steam_links_custom_" + key)) || [];
    } catch {
      return [];
    }
  }

  function addCustomSite(key, site) {
    const current = loadCustomSites(key);
    current.push(site);
    saveCustomSites(key, current);
  }

  function removeCustomSite(key, site) {
    const current = loadCustomSites(key);
    const updated = current.filter(s => s.url !== site.url || s.text !== site.text);
    saveCustomSites(key, updated);
  }

  // UI Component Creators
  function createContainer() {
    const container = document.createElement("div");
    container.className = "steam-hub-container";
    return container;
  }

  function createHeader(text) {
    const header = document.createElement("div");
    header.className = "steam-hub-header";
    header.textContent = text;
    return header;
  }

  function createGridContainer() {
    const grid = document.createElement("div");
    grid.className = "steam-hub-grid";
    return grid;
  }

  function createButton(url, buttonText, isRemovable = false, onRemove = null, isEditMode = false) {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "steam-hub-button-wrapper";

    const button = document.createElement("a");
    button.className = "steam-hub-button";

    const formattedName = gameName.replace(/\s+/g, "+");
    const finalURL = url.includes("{{GAME_NAME}}")
      ? url.replace("{{GAME_NAME}}", formattedName)
      : url + encodeURIComponent(gameName);

    button.href = finalURL;
    button.target = "_blank";
    button.textContent = buttonText;

    buttonContainer.appendChild(button);

    if (isRemovable) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "steam-hub-delete-btn";
      deleteButton.textContent = "✖";
      deleteButton.style.display = isEditMode ? "block" : "none";

      deleteButton.onclick = () => {
        buttonContainer.remove();
        if (onRemove) onRemove();
      };

      buttonContainer.appendChild(deleteButton);
      buttonContainer._deleteButton = deleteButton;
    }

    return buttonContainer;
  }

  function createInputSection(category, grid) {
    let isEditMode = false;
    const deleteRefs = [];

    const addButton = document.createElement("button");
    addButton.className = "steam-hub-add-btn";
    addButton.innerHTML = '<span>Add Custom Site</span>';

    const inputContainer = document.createElement("div");
    inputContainer.className = "steam-hub-input-container";

    const inputName = document.createElement("input");
    inputName.className = "steam-hub-input";
    inputName.placeholder = "Site Name (e.g., SteamRip)";

    const inputURL = document.createElement("input");
    inputURL.className = "steam-hub-input";
    inputURL.placeholder = "Search URL (e.g., https://steamrip.com/?s=red+dead)";

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "steam-hub-button-group";

    const confirmButton = document.createElement("button");
    confirmButton.className = "steam-hub-confirm-btn";
    confirmButton.textContent = "Save";

    const cancelButton = document.createElement("button");
    cancelButton.className = "steam-hub-cancel-btn";
    cancelButton.textContent = "Cancel";

    function toggleEditMode(enable) {
      isEditMode = enable;
      inputContainer.style.display = isEditMode ? "flex" : "none";

      deleteRefs.forEach(btn => {
        btn.style.display = isEditMode ? "block" : "none";
      });
    }

    confirmButton.onclick = () => {
      const name = inputName.value.trim();
      const url = inputURL.value.trim();

      if (name && url.includes("?") && url.includes("=")) {
        const base = url.split("=")[0] + "=";
        const site = {
          url: base + "{{GAME_NAME}}",
          text: name
        };

        const btn = createButton(site.url, site.text, true, () => {
          removeCustomSite(category, site);
        }, isEditMode);

        if (btn._deleteButton) deleteRefs.push(btn._deleteButton);
        grid.appendChild(btn);
        addCustomSite(category, site);

        inputName.value = "";
        inputURL.value = "";
        toggleEditMode(false);
      } else {
        alert("Please enter a valid site name and search URL (e.g., https://steamrip.com/?s=red+dead)");
      }
    };

    cancelButton.onclick = () => toggleEditMode(false);
    addButton.onclick = () => toggleEditMode(!isEditMode);

    buttonGroup.appendChild(confirmButton);
    buttonGroup.appendChild(cancelButton);

    inputContainer.appendChild(inputName);
    inputContainer.appendChild(inputURL);
    inputContainer.appendChild(buttonGroup);

    const controls = document.createElement("div");
    controls.className = "steam-hub-controls";
    controls.appendChild(addButton);
    controls.appendChild(inputContainer);

    loadCustomSites(category).forEach(site => {
      const btn = createButton(site.url, site.text, true, () => {
        removeCustomSite(category, site);
      }, isEditMode);

      if (btn._deleteButton) {
        btn._deleteButton.style.display = "none";
        deleteRefs.push(btn._deleteButton);
      }

      grid.appendChild(btn);
    });

    return controls;
  }

  // Main UI
  const categoryContainer = createContainer();

  // Cracked Section
  const crackedSection = document.createElement("div");
  crackedSection.className = "steam-hub-section";
  const crackedHeader = createHeader("CRACKED:");
  const crackedGrid = createGridContainer();
  const crackedSites = [
    { url: "https://www.skidrowreloaded.com/?s={{GAME_NAME}}", text: "SkidrowReloaded" },
    { url: "https://igg-games.com/?s={{GAME_NAME}}", text: "IGG-Games" },
    { url: "https://x1337x.ws/srch?search={{GAME_NAME}}", text: "x1337x" },
    { url: "https://game3rb.com/?s={{GAME_NAME}}", text: "Game3rb" },
    { url: "https://online-fix.me/index.php?do=search&subaction=search&story={{GAME_NAME}}", text: "Onlinefix" },
    { url: "https://fitgirl-repacks.site/?s={{GAME_NAME}}", text: "Fitgirl Repacks" },
    { url: "https://dodi-repacks.site/?s={{GAME_NAME}}", text: "Dodi Repack" }
  ];
  crackedSites.forEach(site => crackedGrid.appendChild(createButton(site.url, site.text)));
  const crackedInputSection = createInputSection("cracked", crackedGrid);

  crackedSection.appendChild(crackedHeader);
  crackedSection.appendChild(crackedGrid);
  crackedSection.appendChild(crackedInputSection);

  // Deals Section
  const dealsSection = document.createElement("div");
  dealsSection.className = "steam-hub-section";
  const dealsHeader = createHeader("DEALS:");
  const dealsGrid = createGridContainer();
  const dealsSites = [
    { url: "https://store.epicgames.com/en-US/browse?q={{GAME_NAME}}", text: "Epic Games" },
    { url: "https://www.gog.com/en/games?query={{GAME_NAME}}", text: "GOG" },
    { url: "https://www.humblebundle.com/store/search?sort=discount&search={{GAME_NAME}}", text: "Humble Store" },
    { url: "https://www.gamestop.com/search/?q={{GAME_NAME}}", text: "GameStop" },
    { url: "https://www.cdkeys.com/catalogsearch/result/?q={{GAME_NAME}}", text: "CDKeys" },
    { url: "https://store.ubi.com/us/search?q={{GAME_NAME}}", text: "UPlay" },
    { url: "https://www.origin.com/store/search?fq=search&searchString={{GAME_NAME}}", text: "Origin" },
    { url: "https://www.greenmangaming.com/search?query={{GAME_NAME}}", text: "Green Man Gaming" },
    { url: "https://www.fanatical.com/en/search?search={{GAME_NAME}}", text: "Fanatical" },
    { url: "https://www.microsoft.com/en-us/store/search/games?q={{GAME_NAME}}", text: "Microsoft Store" }
  ];
  dealsSites.forEach(site => dealsGrid.appendChild(createButton(site.url, site.text)));
  const dealsInputSection = createInputSection("deals", dealsGrid);

  dealsSection.appendChild(dealsHeader);
  dealsSection.appendChild(dealsGrid);
  dealsSection.appendChild(dealsInputSection);

  categoryContainer.appendChild(crackedSection);
  categoryContainer.appendChild(dealsSection);

  if (ignoreButton) {
    const queueActionsContainer = ignoreButton.closest('#queueActionsCtn');
    if (queueActionsContainer && queueActionsContainer.parentNode) {
      queueActionsContainer.parentNode.insertBefore(categoryContainer, queueActionsContainer.nextSibling);
    } else {
      ignoreButton.parentNode.insertBefore(categoryContainer, ignoreButton.nextSibling);
    }
  }
})();