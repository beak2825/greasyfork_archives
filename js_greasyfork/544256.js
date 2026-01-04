// ==UserScript==
// @name         Foreign Stock Restock Notifier
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Monitors foreign stock API and sends desktop notifications when items are restocked
// @author       ingine
// @match        https://www.torn.com/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/544256/Foreign%20Stock%20Restock%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/544256/Foreign%20Stock%20Restock%20Notifier.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    checkInterval: 30000, // Check every 30 seconds
    apiUrl: "/api/v1/travel/export/",
    notificationTimeout: 5000,
    maxNotifications: 10, // Max notifications per restock event
    prioritizeTravelCountry: true, // Prioritize notifications for country you're traveling to
  };

  // Country code to name mapping (only Torn countries)
  const COUNTRY_NAMES = {
    mex: "Mexico",
    cay: "Cayman Islands",
    can: "Canada",
    haw: "Hawaii",
    uk: "United Kingdom",
    arg: "Argentina",
    swi: "Switzerland",
    jpn: "Japan",
    chi: "China",
    uae: "United Arab Emirates",
    sou: "South Africa",
  };

  // Storage keys
  const STORAGE_KEYS = {
    lastStocks: "foreignStockNotif_lastStocks",
    lastUpdate: "foreignStockNotif_lastUpdate",
    notifications: "foreignStockNotif_notifications",
    travelStatus: "foreignStockNotif_travelStatus",
  };

  // Color scheme matching Torn's style
  const colorObj = {
    normal_font: {
      darkmode: "rgb(221, 221, 221)",
      lightmode: "rgb(51, 51, 51)",
    },
    link: {
      darkmode: "rgb(116, 192, 252)",
      lightmode: "#006699",
    },
    recolor: {
      green: {
        darkmode: "rgb(130, 201, 30)",
        lightmode: "rgb(92, 148, 13)",
      },
      yellow: {
        darkmode: "rgb(252, 196, 25)",
        lightmode: "rgb(199, 139, 7)",
      },
      red: {
        darkmode: "rgb(255, 135, 135)",
        lightmode: "rgb(224, 49, 49)",
      },
      blue: {
        darkmode: "rgb(59, 201, 219)",
        lightmode: "rgb(12, 133, 153)",
      },
    },
    userindicatorbg: {
      darkmode: "rgb(63, 68, 45)",
      lightmode: "rgb(238, 241, 228)",
    },
    fancyBg: {
      darkmode: "inherit",
      lightmode: "#fff",
    },
    buttons: {
      background: {
        lightmode:
          "linear-gradient(rgb(255, 255, 255) 0%, rgb(221, 221, 221) 100%)",
        darkmode: "linear-gradient(rgb(85, 85, 85) 0%, rgb(51, 51, 51) 100%)",
      },
      textcolor: {
        lightmode: "rgb(102, 102, 102)",
        darkmode: "rgb(221, 221, 221)",
      },
      hovercolor: {
        lightmode: "rgb(200,200,200)",
        darkmode: "rgb(28,28,28)",
      },
    },
  };

  // Get current color display mode
  function getColorDisplayMode() {
    return document.body.classList.contains("dark-mode")
      ? "darkmode"
      : "lightmode";
  }

  class ForeignStockNotifier {
    constructor() {
      this.lastStocks = this.loadLastStocks();
      this.lastUpdate = this.loadLastUpdate();
      this.travelStatus = this.loadTravelStatus();
      this.apiKey = localStorage.getItem("foreignStockNotif_apiKey") || "";
      this.notificationCount = 0;
      this.isRunning = false;

      // Load saved settings
      this.loadSavedSettings();
    }

    // Load saved settings from localStorage
    loadSavedSettings() {
      const savedPrioritizeTravel = localStorage.getItem(
        "foreignStockNotif_prioritizeTravel"
      );
      const savedCheckInterval = localStorage.getItem(
        "foreignStockNotif_checkInterval"
      );

      if (savedPrioritizeTravel !== null) {
        CONFIG.prioritizeTravelCountry = savedPrioritizeTravel === "true";
      }

      if (savedCheckInterval !== null) {
        CONFIG.checkInterval = parseInt(savedCheckInterval);
      }
    }

    // Load previous stock data from storage
    loadLastStocks() {
      try {
        const stored = GM_getValue(STORAGE_KEYS.lastStocks, "{}");
        return JSON.parse(stored);
      } catch (e) {
        console.warn("Failed to load last stocks:", e);
        return {};
      }
    }

    // Save current stock data to storage
    saveLastStocks(stocks) {
      try {
        GM_setValue(STORAGE_KEYS.lastStocks, JSON.stringify(stocks));
      } catch (e) {
        console.warn("Failed to save last stocks:", e);
      }
    }

    // Load last update timestamp
    loadLastUpdate() {
      return GM_getValue(STORAGE_KEYS.lastUpdate, 0);
    }

    // Save last update timestamp
    saveLastUpdate(timestamp) {
      GM_setValue(STORAGE_KEYS.lastUpdate, timestamp);
    }

    // Load travel status
    loadTravelStatus() {
      try {
        const stored = GM_getValue(STORAGE_KEYS.travelStatus, "{}");
        return JSON.parse(stored);
      } catch (e) {
        console.warn("Failed to load travel status:", e);
        return {};
      }
    }

    // Save travel status
    saveTravelStatus(status) {
      try {
        GM_setValue(STORAGE_KEYS.travelStatus, JSON.stringify(status));
      } catch (e) {
        console.warn("Failed to save travel status:", e);
      }
    }

    // Save API key
    saveApiKey(apiKey) {
      try {
        localStorage.setItem("foreignStockNotif_apiKey", apiKey);
      } catch (e) {
        console.warn("Failed to save API key:", e);
      }
    }

    // Get API key (no prompt - user must set it manually)
    async getApiKey() {
      return this.apiKey || null;
    }

    // Get current timestamp
    getCurrentTimestamp() {
      return Math.floor(Date.now() / 1000);
    }

    // Check if we should skip this update (too soon after last)
    shouldSkipUpdate(newTimestamp) {
      if (!this.lastUpdate) return false;

      // Skip if less than 5 seconds since last update
      const timeDiff = newTimestamp - this.lastUpdate;
      return timeDiff < 5;
    }

    // Fetch stock data from API
    async fetchStockData() {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: window.location.origin + CONFIG.apiUrl,
          onload: function (response) {
            try {
              const data = JSON.parse(response.responseText);
              resolve(data);
            } catch (e) {
              reject(new Error("Failed to parse API response: " + e.message));
            }
          },
          onerror: function (error) {
            reject(new Error("API request failed: " + error.statusText));
          },
        });
      });
    }

    // Fetch user travel status
    async fetchTravelStatus() {
      const apiKey = await this.getApiKey();
      if (!apiKey) {
        // Return empty data if no API key
        return { status: { state: "OK", description: "" } };
      }

      return new Promise((resolve, reject) => {
        const userApiUrl = `https://api.torn.com/user/?key=${apiKey}&comment=TornAPI&selections=basic`;
        GM_xmlhttpRequest({
          method: "GET",
          url: userApiUrl,
          onload: function (response) {
            try {
              const data = JSON.parse(response.responseText);
              resolve(data);
            } catch (e) {
              reject(
                new Error("Failed to parse user API response: " + e.message)
              );
            }
          },
          onerror: function (error) {
            reject(new Error("User API request failed: " + error.statusText));
          },
        });
      });
    }

    // Extract country from travel description
    extractTravelCountry(description) {
      if (!description) return null;

      const travelText = description.toLowerCase();
      for (const [code, name] of Object.entries(COUNTRY_NAMES)) {
        if (
          travelText.includes(name.toLowerCase()) ||
          travelText.includes(code.toLowerCase())
        ) {
          return code;
        }
      }
      return null;
    }

    // Compare stocks and find restocked items
    findRestockedItems(currentStocks) {
      const restockedItems = [];
      const travelCountry = this.travelStatus.travelCountry;

      for (const [countryCode, countryData] of Object.entries(currentStocks)) {
        if (!countryData.stocks || !Array.isArray(countryData.stocks)) continue;

        const previousCountryStocks =
          this.lastStocks[countryCode]?.stocks || [];
        const previousStockMap = new Map();

        // Create map of previous stocks by ID
        previousCountryStocks.forEach((item) => {
          previousStockMap.set(item.id, item.quantity);
        });

        // Check current stocks for restocks
        countryData.stocks.forEach((item) => {
          const previousQuantity = previousStockMap.get(item.id) || 0;

          // Item was restocked (went from 0 to positive)
          if (previousQuantity === 0 && item.quantity > 0) {
            const isTravelCountry =
              travelCountry &&
              countryCode.toLowerCase() === travelCountry.toLowerCase();

            restockedItems.push({
              country:
                COUNTRY_NAMES[countryCode.toLowerCase()] ||
                countryCode.toUpperCase(),
              name: item.name,
              quantity: item.quantity,
              id: item.id,
              isTravelCountry: isTravelCountry,
              countryCode: countryCode.toLowerCase(),
            });
          }
        });
      }

      // Sort by travel country priority if enabled
      if (CONFIG.prioritizeTravelCountry && travelCountry) {
        restockedItems.sort((a, b) => {
          if (a.isTravelCountry && !b.isTravelCountry) return -1;
          if (!a.isTravelCountry && b.isTravelCountry) return 1;
          return 0;
        });
      }

      return restockedItems;
    }

    // Send desktop notification
    sendNotification(title, message, data = null) {
      if (this.notificationCount >= CONFIG.maxNotifications) {
        console.log("Max notifications reached, skipping...");
        return;
      }

      GM_notification({
        text: message,
        title: title,
        timeout: CONFIG.notificationTimeout,
        onclick: () => {
          // Focus the window when notification is clicked
          window.focus();
        },
      });

      this.notificationCount++;
    }

    // Send restock notifications
    sendRestockNotifications(restockedItems) {
      if (restockedItems.length === 0) return;

      // Reset notification count for new restock event
      this.notificationCount = 0;

      // Check if any items are from travel country
      const travelCountryItems = restockedItems.filter(
        (item) => item.isTravelCountry
      );
      const otherCountryItems = restockedItems.filter(
        (item) => !item.isTravelCountry
      );

      // Send travel country notifications first (if any)
      if (travelCountryItems.length > 0) {
        if (travelCountryItems.length === 1) {
          const item = travelCountryItems[0];
          this.sendNotification(
            "🚨 TRAVEL COUNTRY RESTOCK!",
            `${item.name} restocked in ${item.country}\nQuantity: ${item.quantity}`
          );
        } else {
          const itemNames = travelCountryItems
            .map((item) => item.name)
            .join(", ");
          this.sendNotification(
            "🚨 TRAVEL COUNTRY RESTOCKS!",
            `${travelCountryItems.length} items restocked in ${travelCountryItems[0].country}:\n${itemNames}`
          );
        }
      }

      // Send other country notifications
      if (otherCountryItems.length > 0) {
        if (otherCountryItems.length === 1) {
          const item = otherCountryItems[0];
          this.sendNotification(
            "Foreign Stock Restocked!",
            `${item.name} restocked in ${item.country}\nQuantity: ${item.quantity}`
          );
        } else {
          const itemNames = otherCountryItems
            .map((item) => item.name)
            .join(", ");
          this.sendNotification(
            "Multiple Foreign Stocks Restocked!",
            `${otherCountryItems.length} items restocked:\n${itemNames}`
          );
        }
      }
    }

    // Main check function
    async checkForRestocks() {
      if (this.isRunning) return;
      this.isRunning = true;

      try {
        // Fetch both stock data and travel status
        const [stockData, userData] = await Promise.all([
          this.fetchStockData(),
          this.fetchTravelStatus(),
        ]);

        if (!stockData || !stockData.stocks || !stockData.timestamp) {
          console.warn("Invalid stock API response structure");
          return;
        }

        // Update travel status
        if (userData && userData.status) {
          const travelCountry = this.extractTravelCountry(
            userData.status.description
          );
          this.travelStatus = {
            isTraveling: userData.status.state === "Traveling",
            travelCountry: travelCountry,
            description: userData.status.description,
          };
          this.saveTravelStatus(this.travelStatus);

          if (travelCountry) {
            console.log(
              `Traveling to: ${COUNTRY_NAMES[travelCountry] || travelCountry}`
            );
          } else if (userData.status.state === "Traveling") {
            console.log(
              `Traveling but couldn't detect country from: "${userData.status.description}"`
            );
          }
        }

        // Check if we should skip this update
        if (this.shouldSkipUpdate(stockData.timestamp)) {
          console.log("Skipping update - too soon after last update");
          return;
        }

        // Find restocked items
        const restockedItems = this.findRestockedItems(stockData.stocks);

        // Send notifications if items were restocked
        if (restockedItems.length > 0) {
          console.log("Restocked items found:", restockedItems);
          this.sendRestockNotifications(restockedItems);
        }

        // Update stored data
        this.saveLastStocks(stockData.stocks);
        this.saveLastUpdate(stockData.timestamp);
        this.lastStocks = stockData.stocks;
        this.lastUpdate = stockData.timestamp;
      } catch (error) {
        console.error("Error checking for restocks:", error);
      } finally {
        this.isRunning = false;
      }
    }

    // Start monitoring
    start() {
      console.log("Foreign Stock Notifier started");

      // Initial check after a short delay
      setTimeout(() => {
        this.checkForRestocks();
      }, 2000);

      // Set up periodic checking
      setInterval(() => {
        this.checkForRestocks();
      }, CONFIG.checkInterval);
    }

    // Stop monitoring
    stop() {
      this.isRunning = false;
      console.log("Foreign Stock Notifier stopped");
    }
  }

  // Initialize and start the notifier
  const notifier = new ForeignStockNotifier();
  notifier.start();

  // Check if we're on the settings page
  if (window.location.pathname.search("foreignStockNotif_settings") >= 0) {
    // Wait for page to be ready, then set up settings page
    const setupSettingsPage = () => {
      // Set page title
      document.title = "Foreign Stock Notifier - Settings | TORN";

      // Remove 404 styling if present (same as OC 2.0 helper)
      const mainWrap = document.querySelector("div.main-wrap");
      if (mainWrap) {
        mainWrap.classList.remove("error-404");
      }

      // Update page title
      const contentTitle = document.querySelector(
        "div.content-title #skip-to-content"
      );
      if (contentTitle) {
        contentTitle.textContent = "Foreign Stock Notifier: Settings";
      }

      // Clear the main content area and inject our settings
      const mainContent = document.querySelector("div.content-wrapper");
      if (mainContent) {
        mainContent.innerHTML = ""; // Clear existing content
      }

      // Prepare and show settings page
      prepareSettingsPage();
    };

    // Try to set up immediately, but also wait for DOM to be ready
    setupSettingsPage();

    // Also set up when DOM is ready (in case page is still loading)
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setupSettingsPage);
    }
  }

  // Register menu commands
  try {
    GM_registerMenuCommand("Foreign Stock Notifier - Open Settings", () => {
      window.open("https://www.torn.com/foreignStockNotif_settings", "_blank");
    });
    console.log("Foreign Stock Notifier: Menu command registered successfully");
  } catch (error) {
    console.error(
      "Foreign Stock Notifier: Failed to register menu command:",
      error
    );
  }

  // Prepare settings page (following Torn OC 2.0 helper pattern)
  function prepareSettingsPage() {
    const colorDisplayMode = getColorDisplayMode();
    const moreInfoHover = `<svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="${colorObj.link[colorDisplayMode]}" stroke-width="2"/><path d="M12 7H12.01" stroke="${colorObj.link[colorDisplayMode]}" stroke-width="2" stroke-linecap="round"/><path d="M10 11H12V16" stroke="${colorObj.link[colorDisplayMode]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 16H14" stroke="${colorObj.link[colorDisplayMode]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    const settingsHTML = `
      <div id="foreignStockNotif-settings" class="category-wrap m-top10">
        <div class="title-black top-round t-overflow" style="background: repeating-linear-gradient(90deg, #2e2e2e, #2e2e2e 2px, #282828 0, #282828 4px); padding: 10px; font-weight: bold; color: ${
          colorObj.fancyBg[colorDisplayMode]
        }; text-align: center; font-size: 16px;">Foreign Stock Notifier Settings</div>
        
        <div class="cont-gray" style="padding: 20px;">
          <ul class="table-body" style="display: flex; flex-direction: column; gap: 15px;">
            
            <!-- API Key Section -->
            <li class="table-cell" style="display: flex; flex-direction: column; width: 100%; font-size: 12px;">
              <div class="OC2-titleCell OC2-fancyBg" style="width: 100%; background: repeating-linear-gradient(90deg, #2e2e2e, #2e2e2e 2px, #282828 0, #282828 4px); padding: 5px 10px; font-weight: bold; color: ${
                colorObj.fancyBg[colorDisplayMode]
              }; margin-bottom: 10px;">API Key</div>
              <div class="OC2-settingsCell" style="padding: 5px 0; margin-left: 15px; font-weight: normal; width: 100%;">
                <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                  <input id="foreignStockNotif-apiInput" type="text" style="flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; background: ${
                    colorDisplayMode === "darkmode" ? "#333" : "#fff"
                  }; color: ${
      colorObj.normal_font[colorDisplayMode]
    };" value="${
      notifier.apiKey || ""
    }" placeholder="Enter your Torn API key" />
                  <button id="foreignStockNotif-testApi" class="OC2-button" style="margin-left: 5px; padding: 5px 10px; text-align: center; display: inline-block; background: ${
                    colorObj.buttons.background[colorDisplayMode]
                  }; cursor: pointer; color: ${
      colorObj.buttons.textcolor[colorDisplayMode]
    };">Test</button>
                  <button id="foreignStockNotif-clearApi" class="OC2-button" style="margin-left: 5px; padding: 5px 10px; text-align: center; display: inline-block; background: ${
                    colorObj.buttons.background[colorDisplayMode]
                  }; cursor: pointer; color: ${
      colorObj.buttons.textcolor[colorDisplayMode]
    };">Clear</button>
                </div>
                <div id="foreignStockNotif-apiResult" style="margin-top: 5px; font-size: 12px; padding: 5px; background-color: ${
                  colorObj.userindicatorbg[colorDisplayMode]
                }; display: none;"></div>
              </div>
            </li>

            <!-- Configuration Section -->
            <li class="table-cell" style="display: flex; flex-direction: column; width: 100%; font-size: 12px;">
              <div class="OC2-titleCell OC2-fancyBg" style="width: 100%; background: repeating-linear-gradient(90deg, #2e2e2e, #2e2e2e 2px, #282828 0, #282828 4px); padding: 5px 10px; font-weight: bold; color: ${
                colorObj.fancyBg[colorDisplayMode]
              }; margin-bottom: 10px;">Configuration</div>
              <div class="OC2-settingsCell" style="padding: 5px 0; margin-left: 15px; font-weight: normal; width: 100%;">
                
                <fieldset class="OC2-choice" style="display: inline-block; width: 100%; margin: 5px 0 5px 10px;">
                  <legend style="float: left; width: 50%;">
                    <span title="If enabled, notifications for items restocked in your current travel destination will be prioritized and shown with a special alert." class="OC2-infoHover" style="padding-right: 8px; vertical-align: middle;">${moreInfoHover}</span>
                    Prioritize travel country notifications?
                  </legend>
                  <div class="OC2-choice-buttons" style="display: flex; flex-direction: row;">
                    <input type="radio" name="OC2-display-choice-prioritizeTravel" id="prioritize-travel-show" value="true" ${
                      CONFIG.prioritizeTravelCountry ? "checked" : ""
                    } style="display: none;" />
                                         <label for="prioritize-travel-show">Yes</label>
                     <input type="radio" name="OC2-display-choice-prioritizeTravel" id="prioritize-travel-hide" value="false" ${
                       !CONFIG.prioritizeTravelCountry ? "checked" : ""
                     } style="display: none;" />
                     <label for="prioritize-travel-hide">No</label>
                  </div>
                </fieldset>

                <div style="margin: 15px 0;">
                  <div class="OC2-settingsLabel" style="width: 50%; display: inline-block;">
                    <span title="How often the script checks for new restocks (in seconds). Lower values mean faster notifications but more API calls." class="OC2-infoHover" style="padding-right: 8px; vertical-align: middle;">${moreInfoHover}</span>
                    Check interval (seconds):
                  </div>
                  <input type="number" id="foreignStockNotif-checkInterval" value="${
                    CONFIG.checkInterval / 1000
                  }" min="10" max="300" style="width: 80px; padding: 4px; margin-left: 10px; border: 1px solid #ccc; background: ${
      colorDisplayMode === "darkmode" ? "#333" : "#fff"
    }; color: ${colorObj.normal_font[colorDisplayMode]};" />
                </div>
              </div>
            </li>

            <!-- Action Buttons -->
            <li class="table-cell" style="display: flex; flex-direction: column; width: 100%; font-size: 12px;">
              <div class="OC2-buttonDiv" style="display: flex; flex-direction: row; justify-content: center; margin-top: 20px;">
                <button id="foreignStockNotif-saveSettings" style="margin-left: 5px; padding: 5px 10px; text-align: center; display: inline-block; background: ${
                  colorObj.buttons.background[colorDisplayMode]
                }; cursor: pointer; color: ${
      colorObj.buttons.textcolor[colorDisplayMode]
    }; margin-right: 10px;">Save Settings</button>
                <button id="foreignStockNotif-backToGame" class="OC2-button" style="margin-left: 5px; padding: 5px 10px; text-align: center; display: inline-block; background: ${
                  colorObj.buttons.background[colorDisplayMode]
                }; cursor: pointer; color: ${
      colorObj.buttons.textcolor[colorDisplayMode]
    };">Back to Game</button>
              </div>
            </li>

          </ul>
        </div>
      </div>
    `;

    // Clear any existing settings and inject new ones
    const existingSettings = document.getElementById(
      "foreignStockNotif-settings"
    );
    if (existingSettings) {
      existingSettings.remove();
    }

    // Inject settings into the main content area
    const mainContent = document.querySelector("div.content-wrapper");
    if (mainContent) {
      mainContent.innerHTML = settingsHTML;
    } else {
      // Fallback to body if content-wrapper not found
      document.body.insertAdjacentHTML("beforeend", settingsHTML);
    }

    // Add event listeners
    document
      .getElementById("foreignStockNotif-testApi")
      .addEventListener("click", testApiKey);
    document
      .getElementById("foreignStockNotif-clearApi")
      .addEventListener("click", clearApiKey);
    document
      .getElementById("foreignStockNotif-saveSettings")
      .addEventListener("click", saveSettings);
    document
      .getElementById("foreignStockNotif-backToGame")
      .addEventListener("click", () => {
        window.location.href = "https://www.torn.com/";
      });

    // Add radio button functionality
    document
      .querySelectorAll('input[name="OC2-display-choice-prioritizeTravel"]')
      .forEach((radio) => {
        radio.addEventListener("change", function () {
          // Update all labels to unselected state
          const labels = document.querySelectorAll(
            'label[for^="prioritize-travel-"]'
          );
          labels.forEach((label) => {
            label.style.background = "transparent";
            label.style.color =
              colorObj.buttons.textcolor[getColorDisplayMode()];
          });

          // Update selected label
          const selectedLabel = document.querySelector(
            `label[for="${this.id}"]`
          );
          if (selectedLabel) {
            selectedLabel.style.background =
              colorObj.buttons.background[getColorDisplayMode()];
            selectedLabel.style.color =
              colorObj.buttons.textcolor[getColorDisplayMode()];
          }
        });
      });

    // Add click handlers to labels to ensure radio buttons are selected
    document
      .querySelectorAll('label[for^="prioritize-travel-"]')
      .forEach((label) => {
        label.addEventListener("click", function (e) {
          // Prevent default to avoid double-triggering
          e.preventDefault();

          // Get the associated radio button
          const radioId = this.getAttribute("for");
          const radio = document.getElementById(radioId);

          if (radio) {
            // Uncheck all radio buttons first
            document
              .querySelectorAll(
                'input[name="OC2-display-choice-prioritizeTravel"]'
              )
              .forEach((r) => {
                r.checked = false;
              });

            // Check this radio button
            radio.checked = true;

            // Trigger the change event
            radio.dispatchEvent(new Event("change"));
          }
        });
      });

    // Add button hover effects
    document.querySelectorAll(".OC2-button").forEach((button) => {
      button.addEventListener("mouseenter", function () {
        this.style.background =
          colorObj.buttons.hovercolor[getColorDisplayMode()];
      });
      button.addEventListener("mouseleave", function () {
        this.style.background =
          colorObj.buttons.background[getColorDisplayMode()];
      });
    });

    // Style the settings
    styleSettings();

    // Ensure radio button styling is applied immediately
    setTimeout(() => {
      styleSettings();
    }, 100);
  }

  // Style settings to match Torn's theme
  function styleSettings() {
    const colorDisplayMode = getColorDisplayMode();

    // Style radio button labels to look like buttons (same as OC 2.0 helper)
    document
      .querySelectorAll('label[for^="prioritize-travel-"]')
      .forEach((label) => {
        const radio = document.getElementById(label.getAttribute("for"));
        if (radio && radio.checked) {
          label.style.background =
            colorObj.buttons.background[colorDisplayMode];
          label.style.color = colorObj.buttons.textcolor[colorDisplayMode];
        } else {
          label.style.background = "transparent";
          label.style.color = colorObj.buttons.textcolor[colorDisplayMode];
        }

        // Apply button-like styling to all labels
        label.style.cursor = "pointer";
        label.style.padding = "5px 10px";
        label.style.border = "1px solid #ccc";
        label.style.display = "inline-block";
        label.style.margin = "0 10px 0 5px";
        label.style.textAlign = "center";
        label.style.minWidth = "40px";
      });
  }

  // Test API key
  async function testApiKey() {
    const apiKey = document
      .getElementById("foreignStockNotif-apiInput")
      .value.trim();
    const resultDiv = document.getElementById("foreignStockNotif-apiResult");
    const colorDisplayMode = getColorDisplayMode();

    if (!apiKey) {
      resultDiv.innerHTML = `<span style="color: ${colorObj.recolor.red[colorDisplayMode]};">Please enter an API key</span>`;
      resultDiv.style.display = "block";
      return;
    }

    if (apiKey.length !== 16) {
      resultDiv.innerHTML = `<span style="color: ${colorObj.recolor.red[colorDisplayMode]};">Invalid API key length (should be 16 characters)</span>`;
      resultDiv.style.display = "block";
      return;
    }

    resultDiv.innerHTML = `<span style="color: ${colorObj.recolor.blue[colorDisplayMode]};">Testing API key...</span>`;
    resultDiv.style.display = "block";

    try {
      const response = await fetch(
        `https://api.torn.com/user/?key=${apiKey}&comment=TornAPI&selections=basic`
      );
      const data = await response.json();

      if (data.error) {
        resultDiv.innerHTML = `<span style="color: ${colorObj.recolor.red[colorDisplayMode]};">API Error: ${data.error.error}</span>`;
      } else {
        resultDiv.innerHTML = `<span style="color: ${colorObj.recolor.green[colorDisplayMode]};">✓ API key valid! User: ${data.name}</span>`;
      }
    } catch (error) {
      resultDiv.innerHTML = `<span style="color: ${colorObj.recolor.red[colorDisplayMode]};">Failed to test API key</span>`;
    }
  }

  // Clear API key
  function clearApiKey() {
    document.getElementById("foreignStockNotif-apiInput").value = "";
    document.getElementById("foreignStockNotif-apiResult").innerHTML = "";
    document.getElementById("foreignStockNotif-apiResult").style.display =
      "none";
  }

  // Save settings
  function saveSettings() {
    const apiKey = document
      .getElementById("foreignStockNotif-apiInput")
      .value.trim();
    const prioritizeTravel =
      document.querySelector(
        'input[name="OC2-display-choice-prioritizeTravel"]:checked'
      ).value === "true";
    const checkInterval =
      parseInt(
        document.getElementById("foreignStockNotif-checkInterval").value
      ) * 1000;
    const colorDisplayMode = getColorDisplayMode();

    // Validate API key
    if (apiKey && apiKey.length !== 16) {
      document.getElementById(
        "foreignStockNotif-apiResult"
      ).innerHTML = `<span style="color: ${colorObj.recolor.red[colorDisplayMode]};">Invalid API key length (should be 16 characters)</span>`;
      document.getElementById("foreignStockNotif-apiResult").style.display =
        "block";
      return;
    }

    // Save API key
    notifier.apiKey = apiKey;
    notifier.saveApiKey(apiKey);

    // Save other settings
    CONFIG.prioritizeTravelCountry = prioritizeTravel;
    CONFIG.checkInterval = checkInterval;
    localStorage.setItem(
      "foreignStockNotif_prioritizeTravel",
      prioritizeTravel
    );
    localStorage.setItem("foreignStockNotif_checkInterval", checkInterval);

    document.getElementById(
      "foreignStockNotif-apiResult"
    ).innerHTML = `<span style="color: ${colorObj.recolor.green[colorDisplayMode]};">Settings saved successfully!</span>`;
    document.getElementById("foreignStockNotif-apiResult").style.display =
      "block";

    // Don't auto-close on dedicated settings page
    if (window.location.pathname.search("foreignStockNotif_settings") < 0) {
      setTimeout(() => {
        closeSettings();
      }, 1500);
    }
  }

  // Close settings
  function closeSettings() {
    const settingsDiv = document.getElementById("foreignStockNotif-settings");
    if (settingsDiv) {
      settingsDiv.remove();
    }
  }

  // Expose notifier to global scope for debugging
  window.foreignStockNotifier = notifier;

  // Add manual check function to console
  window.checkForeignStocks = () => {
    notifier.checkForRestocks();
  };

  // Add debug function to test API response
  window.testForeignStockAPI = async () => {
    try {
      const data = await notifier.fetchStockData();
      console.log("API Response:", data);

      // Show summary of countries and items
      const summary = {};
      for (const [country, countryData] of Object.entries(data.stocks)) {
        const countryName = COUNTRY_NAMES[country] || country;
        const totalItems = countryData.stocks.length;
        const inStockItems = countryData.stocks.filter(
          (item) => item.quantity > 0
        ).length;
        summary[countryName] = `${inStockItems}/${totalItems} items in stock`;
      }
      console.log("Stock Summary:", summary);
    } catch (error) {
      console.error("API Test failed:", error);
    }
  };

  // Add function to set/change API key
  window.setApiKey = () => {
    const newApiKey = prompt(
      "Enter your Torn API key:\n\n" +
        "You can find your API key at: https://www.torn.com/preferences.php#tab=api\n\n" +
        "Leave empty to clear the stored API key.",
      notifier.apiKey || ""
    );

    if (newApiKey === null) {
      console.log("API key change cancelled");
      return;
    }

    if (newApiKey.trim() === "") {
      notifier.apiKey = "";
      notifier.saveApiKey("");
      console.log("API key cleared");
    } else if (newApiKey.trim().length !== 16) {
      console.error(
        "Invalid API key length. API keys should be 16 characters long."
      );
    } else {
      notifier.apiKey = newApiKey.trim();
      notifier.saveApiKey(notifier.apiKey);
      console.log("API key updated successfully");
    }
  };

  // Add function to check current API key status
  window.checkApiKey = () => {
    if (notifier.apiKey) {
      console.log("API key is set:", notifier.apiKey.substring(0, 8) + "...");
      console.log("Travel status detection is enabled");
    } else {
      console.log("No API key set. Travel status detection is disabled.");
      console.log("Use setApiKey() to add your API key");
    }
  };

  // Add function to open settings page
  window.openSettings = () => {
    window.open("https://www.torn.com/foreignStockNotif_settings", "_blank");
  };

  console.log(
    "Foreign Stock Notifier loaded successfully!\n" +
      "Available console functions:\n" +
      "- checkForeignStocks() - manually check for restocks\n" +
      "- testForeignStockAPI() - test the stock API\n" +
      "- setApiKey() - set or change your API key\n" +
      "- checkApiKey() - check current API key status\n" +
      "- openSettings() - open settings page\n\n" +
      "Menu command should appear in Tampermonkey menu (right-click extension icon)"
  );
})();
