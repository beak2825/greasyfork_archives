// ==UserScript==
// @name         Nexus Mods Mod Blacklister
// @namespace    https://www.nexusmods.com/
// @version      3
// @license      MIT
// @description  Blacklist mods by title on Nexus Mods
// @author       PhiZero
// @include      http://www.nexusmods.com/*
// @include      https://www.nexusmods.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539520/Nexus%20Mods%20Mod%20Blacklister.user.js
// @updateURL https://update.greasyfork.org/scripts/539520/Nexus%20Mods%20Mod%20Blacklister.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Styles
  const styles = {
    button:
      "margin-bottom: 1em; width: 100%; background: #222; color: #fff; border: 1px solid #444; border-radius: 4px; padding: 0.5em; cursor: pointer; font-size: 14px; transition: background-color 0.2s, border-color 0.2s;",
    popupOverlay:
      "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center;",
    popupDialog:
      "background: #2a2a2a; color: #ffffff; padding: 2em; border-radius: 8px; min-width: 400px; max-width: 90vw; max-height: 80vh; box-shadow: 0 4px 20px rgba(0,0,0,0.5); overflow-y: auto;",
    popupTitle: "margin-top: 0; margin-bottom: 1em; color: #ffffff;",
    popupDescription: "margin-bottom: 1.5em; color: #cccccc;",
    entriesContainer: "margin-bottom: 1.5em;",
    entryRow:
      "display: flex; gap: 0.5em; margin-bottom: 0.5em; align-items: center;",
    entryInput:
      "flex: 1; padding: 0.5em; border: 1px solid #555; border-radius: 4px; background: #1a1a1a; color: #ffffff; font-size: 14px;",
    deleteButton:
      "width: 30px; height: 30px; border: none; border-radius: 4px; background: #d32f2f; color: white; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center;",
    addButton:
      "background: #4caf50; color: white; border: none; border-radius: 4px; padding: 0.5em 1em; cursor: pointer; margin-bottom: 1.5em; font-size: 14px;",
    buttonContainer: "display: flex; gap: 1em; justify-content: flex-end;",
    saveButton:
      "background: #4caf50; color: white; border: none; border-radius: 4px; padding: 0.5em 1.5em; cursor: pointer; font-size: 14px;",
    cancelButton:
      "background: #f44336; color: white; border: none; border-radius: 4px; padding: 0.5em 1.5em; cursor: pointer; font-size: 14px;",
  };

  const STORAGE_KEY = "nexusmods_blacklist";

  function loadBlacklist() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn(
          "[NexusMods Blacklister] Failed to parse blacklist from storage"
        );
      }
    }
    return [""];
  }

  function saveBlacklist(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  let blacklist = loadBlacklist();

  function isBlacklisted(title) {
    return blacklist.some((term) =>
      title.toLowerCase().includes(term.toLowerCase())
    );
  }

function updateBlockedCount(blockedCount) {
    const resultCountElem = document.querySelector(
      '[data-e2eid="result-count"]'
    );
    if (!resultCountElem) return;

    const match = resultCountElem.textContent.match(/^(\d+(?:,\d+)*) results/i);
    if (!match) return;

    const baseText = `${match[1]} results`;

    if (blockedCount > 0) {
      resultCountElem.textContent = `${baseText} (${blockedCount} blocked)`;
    } else {
      resultCountElem.textContent = baseText;
    }
  }

  let hasInitialized = false;
  let gridObserver = null;
  let currentUrl = window.location.href;
  let isTransitioning = false;

  function setupNavigationInterception() {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      isTransitioning = true;
      cleanup();
      const result = originalPushState.apply(history, args);

      setTimeout(() => {
        isTransitioning = false;
        currentUrl = window.location.href;
        initializeImmediately();
      }, 500);

      return result;
    };

    history.replaceState = function (...args) {
      isTransitioning = true;
      cleanup();
      const result = originalReplaceState.apply(history, args);

      setTimeout(() => {
        isTransitioning = false;
        currentUrl = window.location.href;
        initializeImmediately();
      }, 500);

      return result;
    };

    window.addEventListener("popstate", () => {
      isTransitioning = true;
      cleanup();

      setTimeout(() => {
        isTransitioning = false;
        currentUrl = window.location.href;
        initializeImmediately();
      }, 500);
    });
  }

  function removeBlacklistedMods() {
    if (isTransitioning) return;

    const grid = document.querySelector(".mods-grid");
    if (!grid) return;

    const modTiles = grid.querySelectorAll('[data-e2eid="mod-tile"]');
    let blocked = 0;

    modTiles.forEach((tile) => {
      try {
        if (isTransitioning) return;

        const titleLink = tile.querySelector('[data-e2eid="mod-tile-title"]');
        if (titleLink && isBlacklisted(titleLink.textContent.trim())) {
          if (tile.style.display !== "none") {
            tile.style.display = "none";
            blocked++;
          }
        } else {
          if (tile.style.display === "none") {
            tile.style.display = "";
          }
        }
      } catch (e) {
        // Silently ignore DOM manipulation errors during page transitions
      }
    });

    updateBlockedCount(blocked);
  }

  function checkAndInitialize() {
    if (hasInitialized || isTransitioning) return;

    hasInitialized = true;

    addBlacklistButton();
    removeBlacklistedMods();

    const grid = document.querySelector(".mods-grid");
    if (grid) {
      gridObserver = new MutationObserver((mutations) => {
        if (isTransitioning) return;

        let hasNewMods = false;

        for (const mutation of mutations) {
          if (isTransitioning) return;

          for (const node of mutation.addedNodes) {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.matches('[data-e2eid="mod-tile"]')
            ) {
              hasNewMods = true;
              break;
            }
          }
          if (hasNewMods) break;
        }

        if (hasNewMods && !isTransitioning) {
          setTimeout(() => {
            if (!isTransitioning) {
              removeBlacklistedMods();
            }
          }, 100);
        }
      });

      gridObserver.observe(grid, { childList: true });
    }
  }

  function cleanup() {
    if (gridObserver) {
      gridObserver.disconnect();
      gridObserver = null;
    }
    hasInitialized = false;
  }

  function initializeImmediately() {
    if (hasInitialized || isTransitioning) return;
    checkAndInitialize();
  }

  setupNavigationInterception();

  window.addEventListener("beforeunload", cleanup);
  window.addEventListener("pagehide", cleanup);

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initializeImmediately);
  } else {
    initializeImmediately();
  }

  window.addEventListener("load", () => {
    if (!hasInitialized && !isTransitioning) {
      setTimeout(() => {
        if (!isTransitioning) {
          checkAndInitialize();
        }
      }, 200);
    }
  });

  function addBlacklistButton() {
    if (document.querySelector("#edit-blacklist-btn")) {
      return true;
    }

    let filtersPanel = document.querySelector('[aria-label="Filters panel"]');
    if (!filtersPanel) {
      filtersPanel = document.querySelector("#filters-panel");
      if (!filtersPanel) return false;
    }

    const btn = document.createElement("button");
    btn.id = "edit-blacklist-btn";
    btn.textContent = "Edit Mod Blacklist";
    btn.style = styles.button;
    btn.onmouseover = () => {
      btn.style.backgroundColor = "#333";
      btn.style.borderColor = "#555";
    };
    btn.onmouseout = () => {
      btn.style.backgroundColor = "#222";
      btn.style.borderColor = "#444";
    };
    btn.onclick = showBlacklistPopup;

    const hideBtn = filtersPanel.querySelector(
      '[data-e2eid="hide-filters-panel"]'
    );

    if (hideBtn) {
      const container = hideBtn.closest(".mb-6") || hideBtn.parentElement;
      if (container && container.parentElement) {
        const nextSibling = container.nextSibling;
        if (nextSibling) {
          container.parentElement.insertBefore(btn, nextSibling);
        } else {
          container.parentElement.appendChild(btn);
        }
        return true;
      }
    }

    filtersPanel.insertBefore(btn, filtersPanel.firstChild);
    return true;
  }

  function showBlacklistPopup() {
    if (document.getElementById("blacklist-popup")) return;

    const popup = document.createElement("div");
    popup.id = "blacklist-popup";
    popup.style = styles.popupOverlay;

    const dialog = document.createElement("div");
    dialog.style = styles.popupDialog;

    const title = document.createElement("h2");
    title.textContent = "Edit Mod Blacklist";
    title.style = styles.popupTitle;

    const description = document.createElement("p");
    description.textContent =
      "Mods containing any of these terms will be hidden from the grid.";
    description.style = styles.popupDescription;

    const entriesContainer = document.createElement("div");
    entriesContainer.id = "blacklist-entries";
    entriesContainer.style = styles.entriesContainer;

    function createEntryRow(text = "", isNew = false) {
      const row = document.createElement("div");
      row.style = styles.entryRow;

      const input = document.createElement("input");
      input.type = "text";
      input.value = text;
      input.placeholder = "Enter blacklist term...";
      input.style = styles.entryInput;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "−";
      deleteBtn.style = styles.deleteButton;
      deleteBtn.onclick = () => row.remove();

      row.appendChild(input);
      row.appendChild(deleteBtn);

      if (isNew) {
        input.focus();
      }

      return row;
    }

    function addNewEntry() {
      const newRow = createEntryRow("", true);
      entriesContainer.appendChild(newRow);
    }

    blacklist.forEach((term) => {
      entriesContainer.appendChild(createEntryRow(term));
    });

    if (blacklist.length === 0) {
      entriesContainer.appendChild(createEntryRow("", true));
    }

    const addBtn = document.createElement("button");
    addBtn.textContent = "+ Add Entry";
    addBtn.style = styles.addButton;
    addBtn.onclick = addNewEntry;

    const buttonsDiv = document.createElement("div");
    buttonsDiv.style = styles.buttonContainer;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.style = styles.saveButton;

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.style = styles.cancelButton;

    saveBtn.onclick = () => {
      const inputs = entriesContainer.querySelectorAll("input");
      blacklist = Array.from(inputs)
        .map((input) => input.value.trim())
        .filter((val) => val.length > 0);

      saveBlacklist(blacklist);
      popup.remove();
      removeBlacklistedMods();
    };

    cancelBtn.onclick = () => popup.remove();

    popup.onclick = (e) => {
      if (e.target === popup) popup.remove();
    };

    buttonsDiv.appendChild(saveBtn);
    buttonsDiv.appendChild(cancelBtn);

    dialog.appendChild(title);
    dialog.appendChild(description);
    dialog.appendChild(entriesContainer);
    dialog.appendChild(addBtn);
    dialog.appendChild(buttonsDiv);

    popup.appendChild(dialog);
    document.body.appendChild(popup);
  }
})();
