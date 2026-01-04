// ==UserScript==
// @name        Novel-Ezy-Coin
// @namespace   https://github.com/Salvora
// @version     1.9.0
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @resource    customCSS https://github.com/Salvora/Novel-Ezy-Coin/raw/refs/heads/main/Resources/styles.css?v=1.7.3#sha256=d2536e3cbe470c94ce8295efe16a5672838340cfa94b419454d4e2c16c129187
// @resource    SETTINGS_HTML https://github.com/Salvora/Novel-Ezy-Coin/raw/refs/heads/main/Resources/ezy-coin-settings.html?v=1.1.5#sha256=b907b17ee8de2d213e06ce056df9519f1be0e0a414b583bd649aba9c44512c2c
// @resource    SiteConfig https://github.com/Salvora/Novel-Ezy-Coin/raw/refs/heads/main/Config/SiteConfig.json?v=1.1.8#sha256=fc1ff1599ea7f81e988649a5b9fe98d03e9570458174c59580bebc16c5c91aae
// @author      Salvora
// @icon        https://raw.githubusercontent.com/Salvora/Novel-Ezy-Coin/refs/heads/main/Images/coins-solid.png#sha256=493177e879b9f946174356a0ed957ff36682d83ff5a94040cd274d2cbeefd77b
// @homepageURL https://github.com/Salvora/Novel-Ezy-Coin
// @supportURL  https://github.com/Salvora/Novel-Ezy-Coin/issues
// @description Userscript to spend your coins to unlock chapters easily
// @match       https://darkstartranslations.com/manga/*
// @match       https://hiraethtranslation.com/novel/*
// @match       https://luminarynovels.com/novel/*
// @license     GPL-3.0-or-later
// @noframes
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/516727/Novel-Ezy-Coin.user.js
// @updateURL https://update.greasyfork.org/scripts/516727/Novel-Ezy-Coin.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  const processingStateMap = new WeakMap(); // Set to track coins being processed
  const buttonStateMap = new WeakMap(); // Track button states
  const eventListenerMap = new WeakMap(); // Track event listeners
  let balance = null; // Variable to store the balance value
  let totalCost = null; // Variable to store the total cost of all chapters
  let observer; // Define the observer globally
  let autoUnlockSetting = GM_getValue(
    `autoUnlock_${window.location.hostname}`,
    false
  ); // Initialize the variable from settings
  let balanceLock = false; // Lock to ensure atomic balance updates
  let concurrencyLimit = GM_getValue("concurrencyLimit", 1);
  let enableChapterLog = GM_getValue("enableChapterLog", false);
  let settingsUIVisibility = GM_getValue("settingsUIVisibility", true);
  let chapterLogMenuId; // Variable to store the menu command ID
  let settingsVisibilityMenuId;

  // Parameters
  const ACTION_DISABLE = "disable";
  const ACTION_ENABLE = "enable";
  const ACTION_ADD = "add";
  const ACTION_DELETE = "delete";

  // Cache for selectors
  const selectorCache = new Map();
  const SETTINGS = {
    checkboxId: "auto-unlock-checkbox",
    resourceName: "SETTINGS_HTML",
  };

  const siteConfig = JSON.parse(GM_getResourceText("SiteConfig"));

  /**
   * Debounce function to limit the rate at which a function can fire.
   *
   * @param {Function} func - The function to debounce.
   * @param {number} wait - The number of milliseconds to delay.
   * @returns {Function} - The debounced function.
   */
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedFindAndLinkifyCoins = debounce(findAndLinkifyCoins, 250);
  const debouncedHandleCoinClick = debounce(handleCoinClick, 200);

  /**
   * Function to toggle and register the enableChapterLog setting
   * This single function handles both toggling the setting and updating the menu.
   *
   * @param {boolean} [toggle=false] - If true, toggles the enableChapterLog setting.
   *                                    If false or undefined, only registers the menu.
   * @returns {void}
   * @throws {Error} - Throws an error if toggling fails.
   */
  function manageChapterLogMenu(toggle = false) {
    if (toggle) {
      // Toggle the enableChapterLog value
      enableChapterLog = !enableChapterLog;
      GM_setValue("enableChapterLog", enableChapterLog);
      console.log(`enableChapterLog is now set to: ${enableChapterLog}`);
    }

    // Unregister the old menu command if it exists
    if (chapterLogMenuId !== undefined) {
      GM_unregisterMenuCommand(chapterLogMenuId);
    }

    // Define the new menu text based on the current state
    const menuText = `Enable Chapter Log: ${enableChapterLog ? "On" : "Off"}`;

    // Register the updated menu command and store its ID
    chapterLogMenuId = GM_registerMenuCommand(menuText, () => {
      manageChapterLogMenu(true); // Pass 'true' to toggle on click
    });
  }

  /**
   * Function to toggle and register the settingsUIVisibility setting
   *
   * @param {boolean} [toggle=false] - If true, toggles the setting value.
   * @returns {void}
   * @throws {Error} - Throws an error if toggling fails.
   */
  function manageSettingsVisibility(toggle = false) {
    if (toggle) {
      // Toggle the visibility
      settingsUIVisibility = !settingsUIVisibility;
      GM_setValue("settingsUIVisibility", settingsUIVisibility);

      // Handle UI update
      const existingUI = document.getElementById("ezy-coin-settings-ui");
      if (settingsUIVisibility) {
        if (!existingUI) {
          settingsUI(); // Create UI if it doesn't exist
        } else {
          existingUI.style.display = "flex"; // Show existing UI
        }
      } else {
        if (existingUI) {
          existingUI.style.display = "none"; // Hide UI
        }
      }
    }

    // Unregister existing menu command if it exists
    if (settingsVisibilityMenuId !== undefined) {
      GM_unregisterMenuCommand(settingsVisibilityMenuId);
    }

    // Register new menu command with updated text
    const menuText = `Settings UI: ${settingsUIVisibility ? "On" : "Off"}`;
    settingsVisibilityMenuId = GM_registerMenuCommand(menuText, () => {
      manageSettingsVisibility(true);
    });
  }

  /**
   * Updates the concurrency limit with validation and storage.
   *
   * @returns {void} - This function does not return a value.
   * @throws {Error} - Throws an error if the provided limit is invalid or if storage fails.
   */
  function updateConcurrencyLimit() {
    const fallbackConcurrencyLimit = concurrencyLimit;
    const input = prompt("Enter new limit (1-5):", concurrencyLimit);

    if (input !== null) {
      const newConcurrencyLimit = parseInt(input, 10);
      if (
        Number.isInteger(newConcurrencyLimit) &&
        newConcurrencyLimit >= 0 &&
        newConcurrencyLimit <= 5
      ) {
        concurrencyLimit = newConcurrencyLimit;
        GM_setValue("concurrencyLimit", concurrencyLimit); // Store the new value
        console.log(`Concurrency limit updated to ${concurrencyLimit}`);
        return true; // Indicate success
      } else {
        console.warn(
          `Invalid concurrency limit entered: "${input}". Reverting to ${fallbackConcurrencyLimit}.`
        );
        concurrencyLimit = fallbackConcurrencyLimit; // Revert to the previous value
        return false; // Indicate failure
      }
    }
    return false; // Indicate cancellation
  }

  /**
   * Function to get the appropriate chapter list selector based on the current URL with caching
   *
   * @param {string} url - The URL of the current site
   * @returns {object} The selector for the current site
   * @throws {Error} - Throws an error if URL is not provided or invalid.
   */
  function getSelector(url) {
    if (!selectorCache.has(url)) {
      selectorCache.set(url, siteConfig[url]);
    }
    return selectorCache.get(url);
  }

  /**
   * Creates the settings UI for the Ezy-Coin application.
   *
   * @returns {void}
   */
  function settingsUI() {
    // Check if the settings UI already exists
    if (document.getElementById("ezy-coin-settings-ui")) {
      console.log("Settings UI already exists. Skipping creation.");
      return;
    }

    if (!settingsUIVisibility) {
      console.log("Settings UI visibility is disabled. Skipping creation.");
      return;
    }
    console.log("Creating UI for settings");
    const menuTemplate = GM_getResourceText(SETTINGS.resourceName);
    document.body.insertAdjacentHTML("beforeend", menuTemplate);

    const checkbox = document.getElementById(SETTINGS.checkboxId);
    if (checkbox) {
      checkbox.checked = autoUnlockSetting;

      // Add event listener using WeakMap to prevent duplicates
      if (!eventListenerMap.has(checkbox)) {
        const listener = async (e) => {
          autoUnlockSetting = e.target.checked;
          GM_setValue(
            `autoUnlock_${window.location.hostname}`,
            autoUnlockSetting
          );
          console.log(`Auto Unlock setting changed to: ${autoUnlockSetting}`);

          const isChapterPage = getSelector(
            window.location.origin
          ).chapterPageKeywordList.some((keyword) =>
            window.location.pathname.includes(`/${keyword}`)
          );

          if (autoUnlockSetting && isChapterPage) {
            console.log(
              "Auto Unlock enabled on a chapter page. Initiating auto unlock..."
            );
            await autoUnlockChapters();
          } else if (!autoUnlockSetting && isChapterPage) {
            console.log("Auto Unlock disabled.");
          }
        };

        checkbox.addEventListener("change", listener);
        eventListenerMap.set(checkbox, listener);
      }
    } else {
      console.error(`Checkbox with ID "${SETTINGS.checkboxId}" not found.`);
    }
  }

  /**
   * Adds or removes a coin from the processingStateMap.
   *
   * @param {HTMLElement} coin - The coin element to be added or removed.
   * @param {string} action - The action to perform: `'add'` to add the coin, `'delete'` to remove it.
   * @returns {boolean} - Returns `true` if the action was successful, `false` otherwise.
   */
  function setProcessingCoin(coin, action) {
    if (!(coin instanceof HTMLElement)) {
      console.error("Invalid coin element provided.");
      return false;
    }
    if (action === ACTION_ADD) {
      processingStateMap.set(coin, true);
      console.log("Coin added to processingStateMap");
      return true;
    } else if (action === ACTION_DELETE) {
      const wasDeleted = processingStateMap.delete(coin);
      console.log(`Coin removed from processingStateMap: ${wasDeleted}`);
      return wasDeleted;
    } else {
      console.error(
        `Invalid action "${action}". Use '${ACTION_ADD}' or '${ACTION_DELETE}'.`
      );
      return false;
    }
  }

  /**
   * Enables or disables a button both functionally and visually.
   *
   * @param {HTMLElement} button - The button element to be enabled or disabled.
   * @param {string} action - The action to perform: `'enable'` to enable the button, `'disable'` to disable it.
   * @returns {boolean} - Returns `true` if the action was successful, `false` otherwise.
   */
  function setButtonState(button, action) {
    if (!(button instanceof HTMLElement)) {
      console.error("Invalid button element provided to setButtonState.");
      return false;
    }
    if (!buttonStateMap.has(button)) {
      buttonStateMap.set(button, { disabled: false });
    }
    const state = buttonStateMap.get(button);

    if (action === ACTION_DISABLE) {
      state.disabled = true;
      button.disabled = true;
      button.classList.add("disabled");
      // console.log("Button disabled.");
      return true;
    } else if (action === ACTION_ENABLE) {
      state.disabled = false;
      button.disabled = false;
      button.classList.remove("disabled");
      // console.log("Button enabled.");
      return true;
    } else {
      console.error(
        `Invalid action "${action}" provided to setButtonState. Use '${ACTION_ENABLE}' or '${ACTION_DISABLE}'.`
      );
      return false;
    }
  }

  /**
   * Validates document structure
   *
   * @param {Document} doc - Document to validate
   * @param {string} url - The URL of the current site
   * @returns {boolean} True if valid
   * @throws {Error} - Throws an error if parameters are invalid.
   */
  function isValidDocument(doc, url) {
    return doc?.querySelector(getSelector(url).coinPlaceholder) !== null;
  }

  /**
   * Parses HTML content and validates document
   *
   * @param {string} content - HTML content
   * @param {string} url - The URL of the current site
   * @returns {Document|null} Parsed document or null
   * @throws {Error} - Throws an error if parsing fails.
   */
  function parseHTML(content, url) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      return isValidDocument(doc, url) ? doc : null;
    } catch (error) {
      console.error("Error parsing HTML:", error);
      return null;
    }
  }

  /**
   * Gets the user's balance from document
   *
   * @param {Document} doc - Document to search
   * @returns {number|null} User's balance or null if not found
   * @throws {Error} - Throws an error if parameters are invalid.
   */
  function getBalance(doc) {
    if (!doc || !(doc instanceof Document)) {
      console.error("Invalid document provided");
      return null;
    }

    try {
      const balanceElement = doc.querySelector(
        getSelector(window.location.origin).balancePlaceholder
      );
      if (!balanceElement) {
        console.error("Balance element not found");
        return null;
      }

      const balanceText = balanceElement.textContent.trim();
      const pattern = new RegExp(
        getSelector(window.location.origin).balanceRegex
      );
      const balanceMatch = balanceText.match(pattern);
      if (!balanceMatch) {
        console.error("Invalid balance format");
        return null;
      }

      const parsedBalance = parseInt(balanceMatch[1].replace(/,/g, ""), 10);
      return isNaN(parsedBalance) ? null : parsedBalance;
    } catch (error) {
      console.error("Error getting balance:", error);
      return null;
    }
  }

  /**
   * Gets dynamic user balance from user-settings page
   *
   * @returns {Promise<number|null>} User's current balance or null if failed
   * @throws {Error} - Throws an error if the request fails.
   */
  async function getDynamicBalance() {
    const TIMEOUT_MS = 10000;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const coinPage = getSelector(window.location.origin).coinPage;
    const coinPageBaseURL = new URL(coinPage).origin;

    try {
      const response = await sendRequest(
        coinPage,
        { method: "GET", signal: controller.signal },
        TIMEOUT_MS
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let content = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          const doc = parseHTML(content + decoder.decode(), coinPageBaseURL);
          return doc ? getBalance(doc) : null;
        }

        content += decoder.decode(value, { stream: true });

        if (
          content.includes(getSelector(window.location.origin).balanceString)
        ) {
          controller.abort();
          const doc = parseHTML(content, coinPageBaseURL);
          return doc ? getBalance(doc) : null;
        }
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request aborted: timeout or balance not found");
      } else {
        console.error("Error fetching balance:", error);
      }
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Function to update the user's balance
   *
   * @param {number} delta - The amount to subtract from the balance
   * @returns {Promise<void>}
   * @throws {Error} - Throws an error if delta is invalid or update fails.
   */
  async function updateBalance(delta) {
    while (balanceLock) {
      await new Promise((resolve) => setTimeout(resolve, 10)); // Wait for the lock to be released
    }
    balanceLock = true; // Acquire the lock

    try {
      if (typeof delta !== "number" || isNaN(delta)) {
        throw new Error("Invalid delta value for balance update");
      }
      balance = Math.max(0, balance - delta); // Prevent negative balance
      const balanceElement = document.querySelector(
        getSelector(window.location.origin).balancePlaceholder
      );
      if (balanceElement) {
        console.log("Updating UI with new Balance:", balance);
        const balanceTextNode =
          balanceElement.childNodes[balanceElement.childNodes.length - 1];
        if (balanceTextNode.nodeType === Node.TEXT_NODE) {
          balanceTextNode.textContent = ` ${balance.toLocaleString()}`;
        } else {
          balanceElement.textContent = ` ${balance.toLocaleString()}`;
        }
      } else {
        console.error("Balance element not found");
      }
    } catch (error) {
      console.error("Error updating balance:", error);
    } finally {
      balanceLock = false; // Release the lock
    }
  }

  /**
   * Function to check if the user has enough balance
   *
   * @param {number} cost - The cost to check against the balance
   * @returns {Promise<boolean>} True if the user has enough balance, false otherwise
   * @throws {Error} - Throws an error if balance retrieval fails.
   */
  async function checkBalance(cost) {
    try {
      console.log("Checking balance for cost:", cost);
      balance = await getDynamicBalance();

      if (balance === null) {
        console.error("Failed to retrieve balance. Balance is null.");
        return false;
      }

      if (cost > balance) {
        console.error(
          `Balance (${balance.toLocaleString()}) is not enough for purchasing the chapter with cost: ${cost.toLocaleString()} !!!`
        );
        return false;
      }

      console.log(
        `Balance (${balance.toLocaleString()}) is sufficient for purchasing the chapter(s) with cost: ${cost.toLocaleString()}`
      );
      return true;
    } catch (error) {
      console.error("Error checking balance:", error);
      return false; // Return false to indicate insufficient balance or error
    }
  }

  /**
   * Extracts the coin cost from an element.
   * Handles both textContent and class-based indicators.
   *
   * @param {HTMLElement} element - The element containing the coin cost.
   * @returns {number|null} The extracted coin cost or null if not found.
   * @throws {Error} - Throws an error if the element is invalid.
   */
  function getCoinCost(element) {
    if (!element || !(element instanceof HTMLElement)) {
      console.error("Invalid element provided to getCoinCost.");
      return null;
    }

    // 1. Attempt to extract from textContent
    const rawText = element.textContent.replace(/,/g, "").trim();
    let coinCost = parseInt(rawText, 10);

    if (!isNaN(coinCost)) {
      return coinCost;
    }

    // 2. Attempt to extract from class names (e.g., 'coin-6')
    const coinClass = Array.from(element.classList).find((cls) =>
      cls.startsWith("coin-")
    );

    if (coinClass) {
      const parts = coinClass.split("-");
      if (parts.length >= 2) {
        const coinNumber = parseInt(parts[1], 10);
        if (!isNaN(coinNumber)) {
          return coinNumber;
        }
      }
    }

    // 3. Optionally, handle data attributes if available
    // Example: <span data-coin-cost="6">...</span>
    if (element.dataset && element.dataset.coinCost) {
      const dataCoinCost = parseInt(element.dataset.coinCost, 10);
      if (!isNaN(dataCoinCost)) {
        return dataCoinCost;
      }
    }

    // Unable to find coin cost
    console.error("Unable to extract coin cost from element:", element);
    return null;
  }
  /**
   * Handles newly added elements by linkifying coins in the Ezy-Coin application using event delegation.
   *
   * @returns {void}
   */
  function findAndLinkifyCoins() {
    try {
      // Retrieve selectors based on the current origin
      const currentSelectors = getSelector(window.location.origin);
      const containerSelector = currentSelectors.chapterHolderBlockClass; // The common parent for chapters
      const coinSelector = currentSelectors.premiumChapterIndicator;

      const container = document.querySelector(containerSelector);
      if (!container) {
        console.warn(
          `Chapter container with selector "${containerSelector}" not found. Wait for the page to fully load.`
        );
        return;
      }

      // Add event delegation listener if not already added
      if (!container.dataset.eventDelegationAdded) {
        container.addEventListener("click", function (event) {
          // Identify the closest coin element from the clicked target
          const coin = event.target.closest(coinSelector);

          // If a coin element is clicked within the container
          if (coin && container.contains(coin)) {
            debouncedHandleCoinClick(event);
          }
        });
        container.dataset.eventDelegationAdded = "true";
        // console.log("Event delegation listener added to container.");
      }

      // Select all coin elements within the container
      const coinElements = container.querySelectorAll(coinSelector);
      console.log(`Found ${coinElements.length} locked premium chapters`);

      // Add the custom class to each coin (only once)
      coinElements.forEach((coin) => {
        if (!coin.classList.contains("c-btn-custom-1")) {
          coin.classList.add("c-btn-custom-1");
        }
      });

      // Calculate the total cost from all coin elements
      totalCost = Array.from(coinElements).reduce(
        (total, coin) =>
          total + (parseInt(coin.textContent.replace(/,/g, ""), 10) || 0),
        0
      );

      // Update the "Unlock All" button if it exists
      const unlockAllButton = document.getElementById("unlock-all-button");
      if (
        unlockAllButton &&
        typeof unlockAllButton.updateContent === "function"
      ) {
        unlockAllButton.updateContent();
      }

      console.log(`Total cost calculated: ${totalCost}`);

      // Log details if the feature is enabled
      if (enableChapterLog) {
        logDetails(coinElements);
      }
    } catch (error) {
      console.error("Error finding and linkifying coins:", error);
    }
  }

  /**
   * Function to show or hide a spinner on an element
   *
   * @param {HTMLElement} element - The element to show or hide the spinner on
   * @param {boolean} show - Whether to show or hide the spinner
   * @returns {void}
   * @throws {Error} - Throws an error if parameters are invalid.
   */
  function elementSpinner(element, show) {
    let spinner = element.querySelector(".spinner");

    if (show) {
      if (!spinner) {
        // Create spinner element if it doesn't exist
        spinner = document.createElement("span");
        spinner.classList.add("spinner");
        const icon = document.createElement("i");
        icon.classList.add("fas", "fa-spinner", "fa-spin");
        spinner.appendChild(icon);
        element.appendChild(spinner);
      }
      spinner.classList.add("show"); // Show spinner
      console.log("elementSpinner: Spinner shown");
    } else {
      if (spinner) {
        spinner.classList.remove("show"); // Hide spinner
        element.removeChild(spinner); // Remove spinner element
        console.log("elementSpinner: Spinner hidden and removed");
      } else {
        console.warn("elementSpinner: Spinner element not found");
      }
    }
  }

  /**
   * Handles newly added elements by linkifying coins in the Ezy-Coin application using event delegation.
   *
   * @returns {void}
   */
  async function handleCoinClick(event) {
    event.preventDefault();
    const currentSelectors = getSelector(window.location.origin);
    const coin = event.target.closest(currentSelectors.premiumChapterIndicator);
    if (!coin) return;

    if (processingStateMap.get(coin)) {
      console.log("Coin is already being processed, ignoring...");
      return;
    }

    setProcessingCoin(coin, ACTION_ADD); // Add coin to the set
    setButtonState(coin, ACTION_DISABLE); // Disable the button

    coin.classList.add("clicked");
    console.log("Coin clicked");
    elementSpinner(coin, true);

    // Temporarily disconnect the observer
    if (observer) {
      observer.disconnect();
    }

    try {
      setTimeout(() => coin.classList.remove("clicked"), 100);
      const chapterCoinCost = parseInt(coin.textContent.replace(/,/g, ""), 10);
      if (!(await checkBalance(chapterCoinCost))) {
        await flashCoin(coin, false);
        setButtonState(coin, ACTION_ENABLE); // Re-enable the coin element
        return;
      }
      const result = await unlockChapter(coin, "series-page");
      if (!result) {
        await flashCoin(coin, false);
        setButtonState(coin, ACTION_ENABLE); // Re-enable the coin element
        console.error(`Failed to unlock chapter for coin: ${coin.textContent}`);
        return;
      }
    } catch (error) {
      await flashCoin(coin, false);
      setButtonState(coin, ACTION_ENABLE); // Re-enable the coin element
      console.error(
        `Error unlocking chapter for coin: ${coin.textContent}`,
        error
      );
      return;
    } finally {
      setProcessingCoin(coin, ACTION_DELETE); // Remove coin from the set
      elementSpinner(coin, false);
      // Reconnect the observer
      if (observer) {
        const targetDiv = document.querySelector(
          getSelector(window.location.origin).chapterList
        );
        if (targetDiv) {
          observer.observe(targetDiv, { childList: true, subtree: true });
        }
      }
    }
  }

  /**
   * Flashes the coin element by temporarily removing its text and applying a flash class.
   *
   * @param {HTMLElement} coin - The coin element to flash.
   * @param {boolean} isSuccess - Determines the type of flash: `true` for success, `false` for failure.
   * @returns {Promise<void>} - A promise that resolves after the flash effect is complete.
   */
  async function flashCoin(coin, isSuccess) {
    // Locate the text node within the coin element
    const textNode = Array.from(coin.childNodes).find(
      (node) =>
        node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""
    );

    const originalText = textNode.textContent;
    textNode.textContent = "";
    const flashClass = isSuccess ? "flashing-success" : "flashing-failure";
    coin.classList.add(flashClass);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    coin.classList.remove(flashClass);

    // Restore the original text
    textNode.textContent = originalText;
  }

  /**
   * Retrieves the chapter ID and corresponding chapter element based on the provided coin and page type.
   *
   * @param {HTMLElement} coin - The DOM element representing the coin.
   * @param {string} page - The type of page, either 'series-page' or 'chapter-page'.
   * @returns {{ chapterId: string|null, chapterElement: HTMLElement|null }}
   *          An object containing the chapterId and chapterElement, or null values if not found.
   * @throws {Error}
   *          If an invalid page type is provided or if the chapter element/class is not found.
   */
  function getChapterId(coin, page) {
    const indicator = getSelector(window.location.origin).chapterIdIndicator;
    let chapterElement;
    if (page === "series-page") {
      chapterElement = coin.closest(
        getSelector(window.location.origin).chapterClassFromSeriesPage
      );
    } else if (page === "chapter-page") {
      chapterElement = coin;
    } else {
      console.error(
        `Invalid page type "${page}" provided. Use 'series-page' or 'chapter-page'.`
      );
      return { chapterId: null, chapterElement: null };
    }

    // Check if chapterElement was successfully assigned
    if (!chapterElement) {
      console.error("Chapter element not found.");
      return { chapterId: null, chapterElement: null };
    }

    // Extract the chapter ID from the class name
    const chapterClass =
      Array.from(chapterElement?.classList || []).find((className) =>
        className.startsWith(indicator)
      ) || null;

    if (!chapterClass) {
      console.error("Chapter class not found.");
      return { chapterId: null, chapterElement: null };
    }

    const chapterId = chapterClass.split("-")[2] || null;
    return { chapterId, chapterElement };
  }

  /**
   * Retrieves the nonce element from the DOM based on the current window location.
   *
   * @returns {HTMLElement|null}
   *          The nonce element if found, otherwise null.
   * @throws {Error} - Throws an error if the selector is invalid.
   */
  function getNonceElement() {
    return document.querySelector(
      getSelector(window.location.origin).noncePlaceholder
    );
  }

  /**
   * Function to unlock a chapter
   *
   * @param {HTMLElement} coin - The coin element
   * @param {string} origin - The origin of the unlock request ('series-page' or 'chapter-page')
   * @returns {Promise<boolean>} True if the chapter was unlocked successfully, false otherwise
   * @throws {Error} - Throws an error if unlocking fails due to network issues or invalid data.
   */
  async function unlockChapter(coin, origin) {
    if (!coin || !(coin instanceof Element)) {
      console.error("Invalid coin element");
      return false;
    }
    const { chapterId, chapterElement } = getChapterId(coin, origin);
    const nonce = getNonceElement()?.value;

    if (!chapterElement || !chapterId || !nonce) {
      console.error("Required element not found");
      return false;
    }

    // Extract the coin cost using the universal function
    const chapterCoinCost = getCoinCost(coin);
    if (chapterCoinCost === null) {
      console.error("Unable to determine coin cost.");
      return false;
    }

    const postData = new URLSearchParams({
      action: getSelector(window.location.origin).unlockAction,
      chapter: chapterId,
      nonce: nonce,
    });

    try {
      const response = await sendRequest(
        getSelector(window.location.origin).unlockRequestURL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: postData.toString(),
        }
      );

      if (!response.ok) {
        console.error("Network response was not ok");
        return false;
      }

      const data = await response.json();
      console.log("Successfully sent the request:", data);
      if (data.success && data.data.status) {
        // Update the balance element
        try {
          // Attempt to update the balance
          await updateBalance(chapterCoinCost);
        } catch (error) {
          console.error("Error calling updateBalance:", error);
        }

        // Remove the premium-block class from the chapter element
        chapterElement.classList.remove(
          getSelector(window.location.origin).premiumIndicatorClass
        );

        // Remove the c-btn-custom-1 class from the coin element
        coin.classList.remove("c-btn-custom-1");

        // Update the href attribute of the <a> element with the URL from the response
        const linkElement = chapterElement.querySelector("a");
        if (linkElement) {
          linkElement.href = data.data.url;

          // Update the icon class from fas fa-lock to fas fa-lock-open
          const iconElement = linkElement.querySelector("i.fas.fa-lock");
          if (iconElement) {
            iconElement.classList.remove("fa-lock");
            iconElement.classList.add("fa-lock-open");
          } else {
            console.warn(
              "Lock Icon element not found! Cannot update the icon class"
            );
          }

          // Clone the <a> element to remove all event listeners
          const newLinkElement = linkElement.cloneNode(true);
          linkElement.parentNode.replaceChild(newLinkElement, linkElement);
        } else {
          console.warn(
            "Link element not found! Cannot update the href attribute"
          );
        }

        // Remove the event listener after success
        coin.removeEventListener("click", handleCoinClick);

        // Call findAndLinkifyCoins to update the total cost and button text
        if (origin === "series-page") {
          debouncedFindAndLinkifyCoins();
        }
        return true;
      } else {
        console.error("Failed to buy chapter:", data.data.message);
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  /**
   * Send HTTP request with timeout
   *
   * @param {string} url - The URL to send the request to
   * @param {Object} [options={}] - Request options
   * @param {number} [timeout=10000] - Timeout in milliseconds
   * @returns {Promise<Response>} Fetch response
   * @throws {Error} - Throws an error if the request fails or times out.
   */
  async function sendRequest(url, options = {}, timeout = 10000) {
    const { signal, ...fetchOptions } = options;

    return Promise.race([
      fetch(url, { ...fetchOptions, signal }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), timeout)
      ),
    ]);
  }

  /**
   * Creates and appends the "Unlock All" button to the user interface.
   *
   * This function initializes the button's properties, sets up event listeners,
   * and ensures that clicking the button will unlock all chapters in the Ezy-Coin application.
   *
   * @returns {HTMLButtonElement} - The created "Unlock All" button element.
   * @throws {Error} - Throws an error if the button cannot be created or appended to the DOM.
   */
  function createUnlockAllButton() {
    try {
      const targetElement = document.querySelector(
        getSelector(window.location.origin).buttonLocation
      );
      if (targetElement) {
        const button = document.createElement("button");
        button.id = "unlock-all-button"; // Assign an ID
        button.classList.add("c-btn", "c-btn_style-1", "nav-links");

        // Create a span element for the button text
        const buttonText = document.createElement("span");

        const updateButtonContent = () => {
          // Clear existing content
          buttonText.textContent = "Unlock All ";

          // Create and append the icon element
          const icon = document.createElement("i");
          icon.classList.add("fas", "fa-coins");
          buttonText.appendChild(icon);

          // Append the total cost text
          const costText = document.createTextNode(` ${totalCost}`);
          buttonText.appendChild(costText);

          // Update the button's state based on totalCost
          console.log("Updating the UnlockAllButton State");
          setButtonState(
            button,
            totalCost === 0 ? ACTION_DISABLE : ACTION_ENABLE
          );
        };

        updateButtonContent();
        button.appendChild(buttonText);
        //elementSpinner(button, false);
        targetElement.appendChild(button);
        console.log("Button inserted successfully");

        // Expose updateButtonContent function for external calls
        button.updateContent = updateButtonContent;

        button.addEventListener("click", async () => {
          const originalWidth = button.offsetWidth; // Save original button width
          button.style.width = `${originalWidth}px`; // Set button width to its original width
          buttonText.style.display = "none"; // Hide button text
          elementSpinner(button, true); // Show spinner
          setButtonState(button, ACTION_DISABLE); // Disable the button

          try {
            await unlockAllChapters();
          } catch (error) {
            console.error("Error unlocking all chapters:", error);
          } finally {
            elementSpinner(button, false); // Hide spinner
            updateButtonContent(); // Restore original button content dynamically then enable or disable button depending on total cost
            buttonText.style.display = "inline"; // Show button text
            button.style.width = "auto"; // Reset button width to auto
          }
        });
        return button;
      } else {
        console.error("Target element for button not found");
        return null;
      }
    } catch (error) {
      console.error("Error creating unlock all button:", error);
      return null;
    }
  }

  /**
   * Executes asynchronous tasks with a specified concurrency limit.
   *
   * @param {number} limit - The maximum number of concurrent tasks.
   * @param {Array<Function>} tasks - An array of functions that return Promises.
   * @returns {Promise<Array>} - Resolves when all tasks have completed.
   * @throws {Error} - If the concurrency limit is less than zero.
   */
  async function withConcurrencyLimit(limit, tasks) {
    if (limit < 0) {
      throw new Error("Concurrency limit must be greater than 0");
    }
    if (limit === 0) {
      const promises = tasks.map((task) => task());
      return Promise.all(promises);
    }

    const results = [];
    const executing = new Set();

    for (const task of tasks) {
      // If we've reached the limit, wait for one task to complete
      if (executing.size >= limit) {
        await Promise.race(executing);
      }

      // Add delay before starting next task (except for the first task in each batch)
      if (executing.size > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const p = task();
      results.push(p);
      executing.add(p);

      // Once a task completes, remove it from the executing set
      p.finally(() => executing.delete(p));
    }

    return Promise.all(results);
  }

  /**
   * Unlocks all chapters in the Ezy-Coin application.
   *
   * @returns {Promise<void>} - Resolves when all chapters have been successfully unlocked.
   * @throws {Error} - Throws an error if unlocking fails due to network issues or invalid chapter data.
   */
  async function unlockAllChapters() {
    try {
      const hasEnoughBalance = await checkBalance(totalCost);
      if (!hasEnoughBalance) {
        if (balance === null) {
          alert(
            "Unable to retrieve your balance. Please check your network connection and try again."
          );
        } else {
          alert(
            `Balance (${balance.toLocaleString()}) is not enough to unlock all chapters! (Cost: ${totalCost.toLocaleString()})`
          );
        }
        return;
      }

      if (totalCost === 0) {
        return;
      }
      const userConfirmed = confirm(
        `You are about to spend ${totalCost} coins to unlock all chapters.
      Current Balance: ${balance}
      Calculated New Balance: ${balance - totalCost}
      Do you want to proceed?`
      );

      if (!userConfirmed) {
        return;
      }
      const premiumChapterIndicator = getSelector(
        window.location.origin
      ).premiumChapterIndicator;
      const coinElements = Array.from(
        document.querySelectorAll(premiumChapterIndicator)
      ).reverse();

      await withConcurrencyLimit(
        concurrencyLimit,
        coinElements.map((coin) => async () => {
          try {
            setProcessingCoin(coin, ACTION_ADD);
            setButtonState(coin, ACTION_DISABLE); // Disable the button
            elementSpinner(coin, true);
            const result = await unlockChapter(coin, "series-page");
            if (!result) {
              await flashCoin(coin, false);
              console.error(
                `Failed to unlock chapter for coin: ${coin.textContent}`
              );
              setButtonState(coin, ACTION_ENABLE); // Re-enable the button
            }
          } catch (error) {
            await flashCoin(coin, false);
            setButtonState(coin, ACTION_ENABLE); // Re-enable the button
            console.error(
              `Error unlocking chapter for coin: ${coin.textContent}`,
              error
            );
          } finally {
            setProcessingCoin(coin, ACTION_DELETE); // Ensure coin is removed from the set
            elementSpinner(coin, false);
          }
        })
      );
      console.log("All chapters have been processed!");
    } catch (error) {
      console.error("Error processing chapters:", error);
      alert("An error occurred while processing chapters. Please try again.");
    }
  }

  /**
   * Automatically unlocks chapters in the Ezy-Coin application.
   *
   * @returns {Promise<void>} - Resolves when the chapters have been successfully unlocked.
   * @throws {Error} - Throws an error if unlocking fails due to network issues.
   */
  async function autoUnlockChapters() {
    const {
      chapterNextButtonClass,
      chapterNextButtonHeadId,
      chapterNextButtonFootId,
    } = getSelector(window.location.origin);

    const headNextButton = document
      .getElementById(chapterNextButtonHeadId)
      ?.querySelector(chapterNextButtonClass);
    const footNextButton = document
      .getElementById(chapterNextButtonFootId)
      ?.querySelector(chapterNextButtonClass);

    let nextButton = headNextButton || footNextButton;

    if (!nextButton) {
      console.log("Next button not found! Possibly, this is the last chapter.");
      return;
    }

    const checkAndMarkNextChapter = () => {
      const linkElement = nextButton.querySelector("a");
      if (!linkElement) {
        console.warn("Link element not found.");
        return false;
      }

      const isUnlocked = !nextButton.classList.contains(
        getSelector(window.location.origin).premiumIndicatorClass
      );
      const addClass = isUnlocked ? "unlocked-green" : "locked-red";
      const removeClass = isUnlocked ? "locked-red" : "unlocked-green";

      console.log(
        `Next chapter is ${isUnlocked ? "already unlocked" : "locked"}`
      );

      linkElement.classList.add(addClass);
      linkElement.classList.remove(removeClass);
      return isUnlocked;
    };

    // Initial check before attempting to unlock
    if (checkAndMarkNextChapter()) {
      return;
    }

    try {
      await unlockChapter(nextButton, "chapter-page");
      checkAndMarkNextChapter();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /**
   * Retrieves the title of the current series from the page.
   *
   * @returns {string} The title of the series, or 'Unknown Series' if not found.
   * @throws {Error} - Throws an error if selection fails.
   */
  function getSeriesTitle() {
    const seriesTitleElement = document.querySelector(
      getSelector(window.location.origin).seriesTitleFromSeriesPage
    );
    return seriesTitleElement
      ? seriesTitleElement.textContent.trim()
      : "Unknown Series";
  }

  /**
   * Logs detailed information about each chapter associated with the provided coin elements.
   *
   * @param {NodeListOf<HTMLElement>} coinElements - A collection of coin elements representing chapters.
   * @returns {void}
   * @throws {Error} - Throws an error if logging fails.
   */
  function logDetails(coinElements) {
    const seriesMap = new Map();

    coinElements.forEach((coin) => {
      const { chapterId } = getChapterId(coin, "series-page");
      const nonce = getNonceElement()?.value;
      const action = getSelector(window.location.origin).unlockAction;

      // Find the ancestor element that contains the chapter title
      const ancestorElement = coin.closest(
        getSelector(window.location.origin).chapterClassFromSeriesPage
      );
      const chapterTitle =
        ancestorElement?.querySelector("a")?.textContent.trim() ||
        "Unknown Title";

      // Construct the unlock request URL
      const unlockRequestURL = getSelector(
        window.location.origin
      ).unlockRequestURL;

      // Only push if chapterId is available to ensure data integrity
      if (chapterId) {
        const seriesTitle = getSeriesTitle();
        if (!seriesMap.has(seriesTitle)) {
          seriesMap.set(seriesTitle, []);
        }

        seriesMap.get(seriesTitle).push({
          chapterTitle,
          chapterDetails: {
            chapter: chapterId,
            nonce,
            action,
            unlockRequestURL,
          },
        });
      } else {
        console.warn(
          `Chapter ID not found for chapter titled "${chapterTitle}".`
        );
      }
    });

    const seriesArray = Array.from(seriesMap.entries()).map(
      ([seriesTitle, chapters]) => ({
        seriesTitle,
        chapters,
      })
    );

    const result = { series: seriesArray };

    console.log(JSON.stringify(result, null, 2));
  }

  /**
   * Enhanced Function to Check if Cloudflare Human Verification Page is Present
   * Utilizes multiple detection strategies for increased reliability.
   *
   * @returns {boolean} True if Cloudflare verification page detected, false otherwise
   * @throws {Error} - Throws an error if detection fails unexpectedly.
   */
  function isCloudflarePage() {
    console.log("Checking for Cloudflare human verification page...");
    const verificationTexts = [
      "Verify you are human",
      "Checking your browser",
      "Just a moment",
      "Please complete the security check to access",
    ];

    // Check for verification texts
    const textMatch = verificationTexts.some((text) =>
      document.body.innerText.includes(text)
    );

    // Check if the title includes "Just a moment"
    const titleMatch = document.title.includes("Just a moment");

    // Check for specific verification elements using valid selectors
    const selectorMatch =
      document.querySelector('div[class*="challenge-form"]') !== null ||
      document.querySelector('div[class*="cf-browser-verification"]') !== null;

    const isCloudflare = textMatch || titleMatch || selectorMatch;
    return isCloudflare;
  }

  /**
   * Initializes unlock functionality on non-chapter pages in the Ezy-Coin application.
   *
   * @returns {void} - This function does not return a value.
   * @throws {Error} - Throws an error if initialization fails due to missing elements or unexpected page structure.
   */
  function initializeUnlockAll() {
    totalCost = 0;
    createUnlockAllButton();

    observer = new MutationObserver((mutations) => {
      const shouldUpdate = mutations.some(
        (mutation) => mutation.addedNodes.length || mutation.removedNodes.length
      );
      if (shouldUpdate) {
        debouncedFindAndLinkifyCoins();
      }
    });

    // Add cleanup listener
    window.addEventListener("unload", () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    });

    const targetDiv = document.querySelector(
      getSelector(window.location.origin).chapterList
    );
    if (targetDiv) {
      debouncedFindAndLinkifyCoins();
      observer.observe(targetDiv, { childList: true, subtree: true });
    } else {
      console.error("Target div not found");
    }
  }

  /**
   * Initializes unlock functionality on chapter pages in the Ezy-Coin application.
   *
   * @returns {void} - This function does not return a value.
   * @throws {Error} - Throws an error if initialization fails due to missing elements or unexpected page structure.
   */
  function initializeChapterPage() {
    if (autoUnlockSetting) {
      console.log("Auto unlock is enabled. Starting auto unlock...");
      autoUnlockChapters();
    }
  }

  /**
   * Registers the Settings UI and Menu Commands in the Ezy-Coin application.
   *
   * @returns {void} - This function does not return a value.
   * @throws {Error} - Throws an error if registration fails due to missing elements or conflicts.
   */
  function setupUIAndMenus() {
    try {
      settingsUI();
      GM_registerMenuCommand("Set Limit", updateConcurrencyLimit);
      manageSettingsVisibility();
      manageChapterLogMenu();
    } catch (error) {
      console.error("Error creating Settings UI block:", error);
    }
  }

  /**
   * Main initialization function.
   *
   * @returns {void} - This function does not return a value.
   * @throws {Error} - Throws an error if initialization fails due to configuration issues or missing dependencies.
   */
  function init() {
    // Abort script if Cloudflare verification is detected
    if (isCloudflarePage()) {
      console.log("Cloudflare human verification detected. Script aborted.");
      return;
    }

    try {
      balance = getBalance(document);
      if (balance === null) {
        console.error(
          "Balance not found (Maybe not logged in?), stopping the script"
        );
        return;
      }

      // Apply custom styles
      GM_addStyle(GM_getResourceText("customCSS"));

      // Determine page type
      const isChapterPage = getSelector(
        window.location.origin
      ).chapterPageKeywordList.some((keyword) =>
        window.location.pathname.includes(`/${keyword}`)
      );
      setupUIAndMenus();
      // Initialize based on page type
      if (!isChapterPage) {
        initializeUnlockAll();
      } else {
        initializeChapterPage();
      }
    } catch (error) {
      console.error("Error during initialization:", error);
    }
  }

  init();
})();
