// ==UserScript==
// @name         Google Maps Details Checker
// @namespace    https://github.com/gncnpk/google-maps-details-checker
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @version      0.0.2
// @description  Highlights a place if it has missing information and adds it to a shared list on Google Maps.
// @match        https://*.google.com/maps/*@*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com/maps
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545766/Google%20Maps%20Details%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/545766/Google%20Maps%20Details%20Checker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let currentPlaceId = null;
  let isProcessing = false;
  let pendingOperations = new Set();
  let cachedElements = new Map();

  // Optimized configuration
  const CONFIG = {
    retryDelay: 500, // Reduced from 1000ms
    maxRetries: 3,
    checkDelay: 500, // Reduced from 2000ms
    operationDelay: 150, // Reduced from 300ms
    dialogDelay: 200, // Reduced from 500ms
    colors: {
      pass: "rgba(0,255,0,0.1)",
      not_checked: "rgba(255,255,0,0.1)",
      fail: "rgba(255,0,0,0.1)",
    },
    missingInfoText: {
      "Add hours": "Missing hours",
      "Add place's phone number": "Missing phone number",
      "Add website": "Missing website",
      "Add a photo": "Missing photo",
    },
    selectors: {
      placeHeader: ".lMbq3e",
      headerChildren: ".RWPxGd",
      expandArrow: ".Cw1rxd.google-symbols.SwaGS",
      savedElements: ".Io6YTe.fontBodyMedium.kR99db.fdkmkc",
      saveButton: ".etWJQ.jym1ob.kdfrQc.k17Vqe.WY7ZIb [aria-label*='Save']",
      saveDialog: ".MMWRwe.fxNQSd",
      backdrop: ".RveJvd.snByac",
      missingInfoSection: ".zSdcRe",
      actionButtons: ".MngOvd.fontBodyMedium.Hk4XGb.zWArOe",
    },
  };

  function extractPlaceId(url) {
    try {
      const match = url.match(/\/place\/([^\/\?#]+)/);
      if (!match) return null;

      const encoded = match[1];
      const withSpaces = encoded.replace(/\+/g, " ");
      return decodeURIComponent(withSpaces);
    } catch (error) {
      console.warn("Error extracting place ID:", error);
      return null;
    }
  }

  function hasPlaceChanged() {
    const newPlaceId = extractPlaceId(document.location.href);
    const changed = newPlaceId !== currentPlaceId;

    if (changed) {
      console.log(`Place changed: "${currentPlaceId}" -> "${newPlaceId}"`);
      currentPlaceId = newPlaceId;
      cachedElements.clear(); // Clear cache on place change
    }

    return changed;
  }

  function isOnPlacePage() {
    return currentPlaceId !== null;
  }

  function cancelPendingOperations() {
    console.log(`Cancelling ${pendingOperations.size} pending operations`);
    pendingOperations.clear();
  }

  // Optimized element waiting with early resolution
  function waitForElement(selector, timeout = 3000) {
    return new Promise((resolve, reject) => {
      // Check cache first
      const cached = cachedElements.get(selector);
      if (cached && document.contains(cached)) {
        resolve(cached);
        return;
      }

      const element = document.querySelector(selector);
      if (element) {
        cachedElements.set(selector, element);
        resolve(element);
        return;
      }

      let timeoutId;
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          clearTimeout(timeoutId);
          cachedElements.set(selector, element);
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      timeoutId = setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  function setPlaceStatus(status) {
    const placeHeader = document.querySelector(CONFIG.selectors.placeHeader);
    if (!placeHeader) return;

    const color = CONFIG.colors[status] || CONFIG.colors.not_checked;
    placeHeader.style.background = color;

    // Batch style updates
    requestAnimationFrame(() => {
      try {
        const headerChildren = document.querySelector(
          CONFIG.selectors.headerChildren
        );
        if (headerChildren) {
          Array.from(headerChildren.children).forEach((element) => {
            element.style.background = color;
          });
        }
      } catch (error) {
        if (placeHeader.nextSibling) {
          placeHeader.nextSibling.style.background = color;
        }
      }
    });
  }

  async function toggleSavedLists(forceState = null) {
    const expandArrow = document.querySelector(CONFIG.selectors.expandArrow);
    if (!expandArrow) return false;

    const ariaLabel = expandArrow.parentElement.parentElement.ariaLabel;

    if (forceState === "expand" && ariaLabel === "Hide place lists details")
      return true;
    if (forceState === "collapse" && ariaLabel === "Show place lists details")
      return true;

    if (
      ariaLabel === "Show place lists details" ||
      ariaLabel === "Hide place lists details"
    ) {
      console.log(
        `${
          ariaLabel === "Show place lists details" ? "Expanding" : "Collapsing"
        } saved lists section...`
      );
      expandArrow.click();

      // Wait for animation with shorter delay
      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.operationDelay)
      );
      return true;
    }

    return false;
  }

  async function getSavedLists() {
    await toggleSavedLists("expand");

    const savedElements = Array.from(
      document.querySelectorAll(CONFIG.selectors.savedElements)
    ).filter((e) => e.innerText.includes("Saved"));

    if (savedElements.length === 0) return [];

    const savedLists = [];

    savedElements.forEach((element) => {
      const savedText = element.innerText.trim();
      if (
        savedText &&
        savedText !== "Not saved" &&
        !savedText.includes("more lists")
      ) {
        let listsText = savedText.replace(/^Saved (?:to|in) /, "");

        const lists = listsText
          .split(/[,&]/)
          .map((list) => list.trim())
          .filter((list) => list.length > 0);

        savedLists.push(...lists);
      }
    });

    return [...new Set(savedLists)];
  }

  async function openSaveDialog() {
    try {
      // Check if dialog is already open
      if (document.querySelector(CONFIG.selectors.saveDialog)) {
        return true;
      }

      const saveButton = document.querySelector(CONFIG.selectors.saveButton);
      if (!saveButton) {
        throw new Error("Save button not found");
      }

      saveButton.children[0].click();
      await waitForElement(CONFIG.selectors.saveDialog, 2000);

      // Shorter delay for dialog stabilization
      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.dialogDelay)
      );

      return true;
    } catch (error) {
      console.warn("Failed to open save dialog:", error);
      return false;
    }
  }

  async function getAvailableLists() {
    // Micro delay instead of 200ms
    await new Promise((resolve) => setTimeout(resolve, 50));

    const listElements = document.querySelectorAll(CONFIG.selectors.saveDialog);
    const lists = [];

    listElements.forEach((element) => {
      const lines = element.innerText.split("\n");
      const listName = lines[lines.length - 1];

      if (listName && listName.trim()) {
        lists.push({
          name: listName.trim(),
          element: element,
        });
      }
    });

    return lists;
  }

  async function toggleListMembership(listName) {
    try {
      const dialogOpened = await openSaveDialog();
      if (!dialogOpened) {
        throw new Error("Failed to open save dialog");
      }

      const availableLists = await getAvailableLists();
      const targetList = availableLists.find((list) => list.name === listName);

      if (targetList) {
        console.log(`Toggling list: ${listName}`);
        targetList.element.click();
        await new Promise((resolve) =>
          setTimeout(resolve, CONFIG.operationDelay)
        );
        await closeSaveDialog();
        return true;
      } else {
        console.warn(`List not found: ${listName}`);
        await closeSaveDialog();
        return false;
      }
    } catch (error) {
      console.warn(`Failed to toggle list ${listName}:`, error);
      await closeSaveDialog();
      return false;
    }
  }

  async function closeSaveDialog() {
    try {
      const dialogElement = document.querySelector(CONFIG.selectors.saveDialog);
      if (!dialogElement) return;

      const backdrop = document.querySelector(CONFIG.selectors.backdrop);
      if (backdrop) {
        backdrop.click();
      } else {
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Escape",
            keyCode: 27,
            bubbles: true,
          })
        );
      }

      // Reduced dialog close delay
      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.operationDelay)
      );
    } catch (error) {
      console.warn("Error closing dialog:", error);
    }
  }

  async function manageMissingLists(
    requiredMissingItems,
    operationId,
    retries = 0
  ) {
    if (!pendingOperations.has(operationId)) {
      console.log("Operation cancelled, aborting list management");
      return;
    }

    if (retries >= CONFIG.maxRetries) {
      console.warn("Max retries reached for managing lists");
      pendingOperations.delete(operationId);
      return;
    }

    try {
      const currentLists = await getSavedLists();
      console.log("Current saved lists:", currentLists);
      console.log("Required missing items:", requiredMissingItems);

      if (!pendingOperations.has(operationId)) {
        console.log("Operation cancelled during execution, aborting");
        return;
      }

      const currentMissingLists = currentLists.filter((list) =>
        list.startsWith("Missing")
      );

      const listsToAdd = requiredMissingItems.filter(
        (item) => !currentMissingLists.includes(item)
      );
      const listsToRemove = currentMissingLists.filter(
        (list) => !requiredMissingItems.includes(list)
      );

      if (listsToAdd.length === 0 && listsToRemove.length === 0) {
        console.log("Missing lists are already up to date");
        await toggleSavedLists("collapse");
        pendingOperations.delete(operationId);
        return;
      }

      console.log("Missing lists to add:", listsToAdd);
      console.log("Missing lists to remove:", listsToRemove);

      // Batch operations for better performance
      const allOperations = [
        ...listsToAdd.map((list) => ({ action: "add", list })),
        ...listsToRemove.map((list) => ({ action: "remove", list })),
      ];

      for (const op of allOperations) {
        if (!pendingOperations.has(operationId)) {
          console.log("Operation cancelled during batch operations, aborting");
          return;
        }

        console.log(`${op.action === "add" ? "Adding to" : "Removing from"} list: ${op.list}`);
        await toggleListMembership(op.list);
        // Micro delay between operations instead of 300ms
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      await toggleSavedLists("collapse");
      pendingOperations.delete(operationId);
    } catch (error) {
      console.warn(`Manage lists attempt ${retries + 1} failed:`, error);
      await closeSaveDialog();

      if (pendingOperations.has(operationId)) {
        setTimeout(
          () =>
            manageMissingLists(requiredMissingItems, operationId, retries + 1),
          CONFIG.retryDelay
        );
      }
    }
  }

  function checkPlace() {
    if (isProcessing || !isOnPlacePage()) {
      return;
    }

    cancelPendingOperations();
    isProcessing = true;

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      let isDetailsComplete = true;
      let missingItems = [];

      try {
        setPlaceStatus("not_checked");

        // Batch DOM queries
        const missingInfoElements = document.querySelectorAll(
          CONFIG.selectors.missingInfoSection
        );
        const actionButtons = document.querySelectorAll(
          CONFIG.selectors.actionButtons
        );

        // Check for missing information section
        missingInfoElements.forEach((element) => {
          const text = element.innerText.split("\n")[0];
          if (text === "Add missing information") {
            isDetailsComplete = false;
          }
        });

        // Check for specific missing information buttons
        actionButtons.forEach((element) => {
          const lines = element.innerText.split("\n");
          const buttonText = lines[1] || lines[0];

          if (buttonText && CONFIG.missingInfoText[buttonText]) {
            isDetailsComplete = false;
            missingItems.push(CONFIG.missingInfoText[buttonText]);
          }
        });

        const operationId = Date.now() + Math.random();
        pendingOperations.add(operationId);

        if (isDetailsComplete) {
          setPlaceStatus("pass");
          console.log(
            `${currentPlaceId} is complete - removing from any missing lists`
          );

          // Reduced delay before list management
          setTimeout(() => {
            manageMissingLists([], operationId);
          }, CONFIG.checkDelay);
        } else {
          setPlaceStatus("fail");
          console.log(`${currentPlaceId} has missing info:`, missingItems);

          setTimeout(() => {
            manageMissingLists(missingItems, operationId);
          }, CONFIG.checkDelay);
        }
      } catch (error) {
        console.error("Error checking place:", error);
        setPlaceStatus("not_checked");
      } finally {
        isProcessing = false;
      }
    });
  }

  function handleUrlChange() {
    if (hasPlaceChanged()) {
      console.log(`New place detected: "${currentPlaceId}"`);
      // Reduced initial delay
      setTimeout(checkPlace, CONFIG.checkDelay);
    }
  }

  function initialize() {
    currentPlaceId = extractPlaceId(document.location.href);

    if (isOnPlacePage()) {
      setTimeout(checkPlace, CONFIG.checkDelay);
    }

    // Use passive listeners for better performance
    const observer = new MutationObserver(handleUrlChange);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("popstate", handleUrlChange, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
