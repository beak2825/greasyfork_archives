// ==UserScript==
// @name         Rust Twitch Drop bot
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Twitch Auto Claim, Drop, change channel and auto track progress
// @author       gig4d3v
// @match        https://www.twitch.tv/drops/inventory
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @license      GPLv3

// @downloadURL https://update.greasyfork.org/scripts/466510/Rust%20Twitch%20Drop%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/466510/Rust%20Twitch%20Drop%20bot.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEFAULT_CONFIG = {
    checkDropsInterval: 60000,
    checkStreamerStatusInterval: 20000,
    updateStreamerOnlineStatusInterval: 20000,
    pageRefreshInterval: 3600000,
    watchdogInterval: 60000,
    retryInterval: 2000,
    maxRetries: 5,
    elementTimeout: 5000,
    tabSwitchDelay: 5000,
    refreshCooldown: 300000,
    selectedCampaign: null,
    availableCampaigns: [],
    muteIframe: "true",
    iframeQuality: "low",
  };

  const CONFIG =
    JSON.parse(localStorage.getItem("twitchDropsManagerConfig")) ||
    DEFAULT_CONFIG;

  let allOnlineStreamersHaveAllItems = false;
  let streamers = [];
  let currentStreamerIndex = 0;
  let lastActivityTimestamp = Date.now();
  let startTime = Date.now();
  let consecutiveRefreshCount = 0;
  const maxConsecutiveRefreshes = 5;
  let initialDataLoaded = false;
  let lastRefreshTimestamp = 0;
  let actionPill;

  const StateHelper = {
    state: new Set(),

    setState(action) {
      this.state.add(action);
      this.updateActionPill();
    },

    clearState(action) {
      this.state.delete(action);
      this.updateActionPill();
    },

    updateActionPill() {
      const states = {
        initializing: "Initializing...",
        fetching: "Fetching Data...",
        streaming: "Streaming...",
        checkingDrops: "Checking Drops...",
        updatingStatus: "Updating Status...",
        refreshing: "Refreshing Page...",
        error: "Error",
        idle: "Idle",
      };
      const activeStates =
        Array.from(this.state)
          .map((state) => states[state] || state)
          .join(" | ") || "Idle";
      actionPill.text(activeStates);
    },
  };

  function saveConfig() {
    localStorage.setItem("twitchDropsManagerConfig", JSON.stringify(CONFIG));
  }

  function resetToDefaults() {
    Object.assign(CONFIG, DEFAULT_CONFIG);
    saveConfig();
    refreshPage();
  }

  function saveLog(message) {
    const logs = JSON.parse(localStorage.getItem("twitchDropsLogs")) || [];
    const timestamp = new Date().toISOString();
    logs.push({ timestamp, message });
    if (logs.length > 100) {
      logs.shift();
    }
    localStorage.setItem("twitchDropsLogs", JSON.stringify(logs));
  }

  function applyStyles() {
    GM_addStyle(`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css');
        .tab-content::-webkit-scrollbar {
      width: 5px !important;
  }
  
  .tab-content::-webkit-scrollbar-track {
      background-color: #ebebeb !important;
      -webkit-border-radius: 10px !important;
      border-radius: 10px !important;
  }
  
  .tab-content::-webkit-scrollbar-thumb {
      -webkit-border-radius: 10px !important;
      border-radius: 10px !important;
      background: #6d6d6d !important;
  }
      `);
  }

  function createComponent(tag, className, content, attrs = {}) {
    const element = $(
      `<${tag} class="${className} custom-scrollbar">${content}</${tag}>`
    );
    for (const [key, value] of Object.entries(attrs)) {
      element.attr(key, value);
    }
    return element;
  }

  function centerPopup(popup) {
    const winWidth = $(window).width();
    const winHeight = $(window).height();
    const popupWidth = popup.outerWidth();
    const popupHeight = popup.outerHeight();
    const left = (winWidth - popupWidth) / 2;
    const top = (winHeight - popupHeight) / 2;

    popup.css({ left: `${left}px`, top: `${top}px` });
  }

  function createPopup(id, title, content) {
    const popup = createComponent(
      "div",
      "fixed z-50 bg-gray-800 text-white rounded-lg shadow-lg custom-scrollbar",
      "",
      {
        id,
        style: "display: none; min-width: 300px; position: fixed !important;",
      }
    );
    const header = createComponent(
      "div",
      "popup-header bg-gray-900 p-2 rounded-t-lg flex justify-between items-center cursor-move",
      `
        <span class="text-xl font-bold">${title}</span>
        <button class="close-popup bg-red-600 text-white px-2 rounded">X</button>
      `
    );
    const body = createComponent("div", "popup-content p-2", content);

    popup.append(header).append(body);
    $("body").append(popup);

    popup.draggable({ handle: ".popup-header" }).resizable();

    header.find(".close-popup").on("click", () => popup.hide());

    centerPopup(popup);

    return popup;
  }

  function createMainPopup() {
    const content = `
        <ul class="tabs flex space-x-2">
          <li class="tab active p-2 cursor-pointer bg-gray-800 rounded-t-lg" data-target="#streamer-list-content">Streamer List</li>
          <li class="tab p-2 cursor-pointer bg-gray-800 rounded-t-lg" data-target="#inventory-logs-content">Inventory Logs</li>
          <li class="tab p-2 cursor-pointer bg-gray-800 rounded-t-lg" data-target="#online-status-logs-content">Online Status Logs</li>
          <li class="tab p-2 cursor-pointer bg-gray-800 rounded-t-lg" data-target="#streamer-logs-content">Streamer Logs</li>
          <li class="tab p-2 cursor-pointer bg-gray-800 rounded-t-lg" data-target="#global-logs-content">Global Logs</li>
          <li class="tab p-2 cursor-pointer bg-gray-800 rounded-t-lg" data-target="#config-content">Config</li>
        </ul>
        <div class="tab-content p-4 bg-gray-800 rounded-b-lg text-lg overflow-y-scroll custom-scrollbar" style='width: 700px; height: 340px;'>
          <div id="streamer-list-content" class="tab-pane active">
            <p class="text-lg font-bold mb-2">Current Streamer: <span id="current-streamer" class="font-normal"></span></p>
            <ul id="streamer-list" class="list-disc pl-5 space-y-1 custom-scrollbar"></ul>
          </div>
          <div id="inventory-logs-content" class="tab-pane hidden">
            <p class="text-lg font-bold mb-2">Inventory Logs:</p>
            <ul id="inventory-logs-list" class="list-disc pl-5 space-y-1 custom-scrollbar"></ul>
          </div>
          <div id="online-status-logs-content" class="tab-pane hidden">
            <p class="text-lg font-bold mb-2">Online Status Logs:</p>
            <ul id="online-status-logs-list" class="list-disc pl-5 space-y-1 custom-scrollbar"></ul>
          </div>
          <div id="streamer-logs-content" class="tab-pane hidden">
            <p class="text-lg font-bold mb-2">Streamer Logs:</p>
            <ul id="streamer-logs-list" class="list-disc pl-5 space-y-1 custom-scrollbar"></ul>
          </div>
          <div id="global-logs-content" class="tab-pane hidden">
            <p class="text-lg font-bold mb-2">Global Logs:</p>
            <ul id="global-logs-list" class="list-disc pl-5 space-y-1 custom-scrollbar"></ul>
          </div>
          <div id="config-content" class="tab-pane hidden">
            <p class="text-lg font-bold mb-2">Configuration:</p>
            <label class="block mb-2">
              <span>Check Drops Interval (ms):</span>
              <input type="number" id="check-drops-interval" class="bg-gray-700 text-white p-2 rounded w-full" value="${
                CONFIG.checkDropsInterval
              }">
            </label>
            <label class="block mb-2">
              <span>Check Streamer Status Interval (ms):</span>
              <input type="number" id="check-streamer-status-interval" class="bg-gray-700 text-white p-2 rounded w-full" value="${
                CONFIG.checkStreamerStatusInterval
              }">
            </label>
            <label class="block mb-2">
              <span>Update Streamer Online Status Interval (ms):</span>
              <input type="number" id="update-streamer-online-status-interval" class="bg-gray-700 text-white p-2 rounded w-full" value="${
                CONFIG.updateStreamerOnlineStatusInterval
              }">
            </label>
            <label class="block mb-2">
              <span>Page Refresh Interval (ms):</span>
              <input type="number" id="page-refresh-interval" class="bg-gray-700 text-white p-2 rounded w-full" value="${
                CONFIG.pageRefreshInterval
              }">
            </label>
            <label class="block mb-2">
              <span>Watchdog Timer Interval (ms):</span>
              <input type="number" id="watchdog-interval" class="bg-gray-700 text-white p-2 rounded w-full" value="${
                CONFIG.watchdogInterval
              }">
            </label>
            <label class="block mb-2">
              <span>Element Timeout (ms):</span>
              <input type="number" id="element-timeout" class="bg-gray-700 text-white p-2 rounded w-full" value="${
                CONFIG.elementTimeout
              }">
            </label>
            <label class="block mb-2">
              <span>Tab Switch Delay (ms):</span>
              <input type="number" id="tab-switch-delay" class="bg-gray-700 text-white p-2 rounded w-full" value="${
                CONFIG.tabSwitchDelay
              }">
            </label>
            <label class="block mb-2">
              <span>Refresh Cooldown (ms):</span>
              <input type="number" id="refresh-cooldown" class="bg-gray-700 text-white p-2 rounded w-full" value="${
                CONFIG.refreshCooldown
              }">
            </label>
            <label class="block mb-2">
              <span>Mute Iframe:</span>
              <select id="mute-iframe" class="bg-gray-700 text-white p-2 rounded w-full">
                <option value="true" ${
                  CONFIG.muteIframe === "true" ? "selected" : ""
                }>Yes</option>
                <option value="false" ${
                  CONFIG.muteIframe === "false" ? "selected" : ""
                }>No</option>
              </select>
            </label>
            <label class="block mb-2">
              <span>Iframe Quality:</span>
              <select id="iframe-quality" class="bg-gray-700 text-white p-2 rounded w-full">
                <option value="low" ${
                  CONFIG.iframeQuality === "low" ? "selected" : ""
                }>Low</option>
                <option value="medium" ${
                  CONFIG.iframeQuality === "medium" ? "selected" : ""
                }>Medium</option>
                <option value="high" ${
                  CONFIG.iframeQuality === "high" ? "selected" : ""
                }>High</option>
              </select>
            </label>
            <label class="block mb-2">
              <span>Selected Campaign:</span>
              <select id="selected-campaign" class="bg-gray-700 text-white p-2 rounded w-full">
                ${CONFIG.availableCampaigns
                  .map(
                    (campaign) =>
                      `<option value="${campaign}" ${
                        CONFIG.selectedCampaign === campaign ? "selected" : ""
                      }>${campaign}</option>`
                  )
                  .join("")}
              </select>
            </label>
            <button id="save-config" class="bg-green-600 text-white px-4 py-2 rounded">Save</button>
            <button id="reset-config" class="bg-red-600 text-white px-4 py-2 rounded mt-2">Reset to Defaults</button>
          </div>
        </div>
      `;
    return createPopup("info-popup", "Twitch Drops Manager", content);
  }

  function createCampaignSelectionPopup() {
    const content = `
        <select id="campaign-select" class="bg-gray-700 text-white p-2 rounded w-full"></select>
        <button id="select-campaign-button" class="bg-green-600 text-white px-4 py-2 rounded mt-2 w-full">Select</button>
      `;
    return createPopup(
      "campaign-selection-popup",
      "Select a Campaign",
      content
    );
  }

  function createStreamerFrame() {
    const container = createComponent(
      "div",
      "fixed z-50 bg-gray-800 rounded-lg shadow-lg draggable resizable custom-scrollbar",
      "",
      {
        id: "streamer-frame-container",
        style:
          "display: none; width: fit-content; height: fit-content; position: fixed !important;",
      }
    );
    const header = createComponent(
      "div",
      "popup-header bg-gray-900 p-2 rounded-t-lg flex justify-between items-center cursor-move",
      `
        <span class="text-xl font-bold" id="streamer-title">Streamer Window</span>
        <button id="minimize-streamer" class="bg-blue-600 text-white px-2 rounded">-</button>
      `
    );
    const iframe = createComponent("iframe", "", "", {
      id: "streamer-frame",
      src: "https://www.kcchanphotography.com/resources/website/common/images/loading-spin.svg",
      style: "width: 700px; height: 500px",
    });

    container.append(header).append(iframe);
    $("body").append(container);

    container.draggable({ handle: ".popup-header" }).resizable();

    header.find("#minimize-streamer").on("click", () => {
      const minimized = container.hasClass("minimized");
      container.toggleClass("minimized", !minimized);
      iframe.toggle(minimized);
      header.find("#minimize-streamer").text(minimized ? "+" : "-");
    });

    centerPopup(container);

    return container;
  }

  function createActionButton() {
    const button = createComponent(
      "button",
      "fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded shadow-lg z-50 custom-scrollbar",
      "Twitch Drops Manager"
    );
    actionPill = createComponent(
      "span",
      "fixed bottom-4 left-4 bg-gray-700 text-white p-2 rounded shadow-lg z-50 custom-scrollbar",
      "Initializing..."
    );

    button.on("click", () => $("#info-popup").toggle());

    $("body").append(button).append(actionPill);

    return actionPill;
  }

  function addEventListeners() {
    $(document).on("click", ".tab", function () {
      $(".tab").removeClass("active");
      $(this).addClass("active");
      $(".tab-pane").removeClass("active").addClass("hidden");
      $($(this).data("target")).removeClass("hidden").addClass("active");
    });

    $("#save-config").on("click", () => {
      CONFIG.checkDropsInterval = parseInt(
        $("#check-drops-interval").val(),
        10
      );
      CONFIG.checkStreamerStatusInterval = parseInt(
        $("#check-streamer-status-interval").val(),
        10
      );
      CONFIG.updateStreamerOnlineStatusInterval = parseInt(
        $("#update-streamer-online-status-interval").val(),
        10
      );
      CONFIG.pageRefreshInterval = parseInt(
        $("#page-refresh-interval").val(),
        10
      );
      CONFIG.watchdogInterval = parseInt($("#watchdog-interval").val(), 10);
      CONFIG.elementTimeout = parseInt($("#element-timeout").val(), 10);
      CONFIG.tabSwitchDelay = parseInt($("#tab-switch-delay").val(), 10);
      CONFIG.refreshCooldown = parseInt($("#refresh-cooldown").val(), 10);
      CONFIG.muteIframe = $("#mute-iframe").val();
      CONFIG.iframeQuality = $("#iframe-quality").val();
      CONFIG.selectedCampaign = $("#selected-campaign").val();
      saveConfig();
      alert("Configuration saved!");
      refreshPage();
    });

    $("#reset-config").on("click", () => {
      if (confirm("Are you sure you want to reset to defaults?")) {
        resetToDefaults();
      }
    });

    $("#select-campaign-button").on("click", () => {
      const selectedCampaign = $("#campaign-select").val();
      if (selectedCampaign) {
        CONFIG.selectedCampaign = selectedCampaign;
        CONFIG.availableCampaigns = $("#campaign-select option")
          .map((_, option) => option.value)
          .toArray();
        saveConfig();
        $("#campaign-selection-popup").hide();
        refreshPage();
      }
    });
  }

  function addLog(containerId, message) {
    const logsListElement = $(`#${containerId}`);
    const logItem = createComponent("li", "", message);
    logsListElement.append(logItem);
    saveLog(message);
    if (logsListElement.children().length > 100) {
      logsListElement.children().first().remove();
    }
  }

  function loadGlobalLogs() {
    const logs = JSON.parse(localStorage.getItem("twitchDropsLogs")) || [];
    const logsListElement = $("#global-logs-list");
    logsListElement.empty();
    logs.forEach((log) => {
      const logItem = createComponent(
        "li",
        "",
        `${log.timestamp}: ${log.message}`
      );
      logsListElement.append(logItem);
    });
  }

  function retryFetch(
    fetchFunction,
    maxRetries = CONFIG.maxRetries,
    interval = CONFIG.retryInterval
  ) {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const executeFetch = async () => {
        try {
          const result = await fetchFunction();
          resolve(result);
        } catch (error) {
          if (attempts < maxRetries) {
            attempts++;
            setTimeout(executeFetch, interval);
          } else {
            reject(error);
          }
        }
      };

      executeFetch();
    });
  }

  function timeoutPromise(ms, promise) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Request timed out"));
      }, ms);

      promise
        .then((value) => {
          clearTimeout(timer);
          resolve(value);
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  async function getStreamerOnlineStatus(streamerNames) {
    try {
      const streamerStatuses = {};

      const fetchStatus = (name) => {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.twitch.tv/${name}`,
            onload: (response) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(
                response.responseText,
                "text/html"
              );
              const scripts = doc.querySelectorAll("script");
              let isLive = false;

              scripts.forEach((script) => {
                if (script.textContent.includes("isLiveBroadcast")) {
                  isLive = true;
                }
              });

              streamerStatuses[name] = isLive;
              resolve();
            },
            onerror: () => {
              streamerStatuses[name] = false;
              reject(new Error(`Failed to fetch status for ${name}`));
            },
          });
        });
      };

      await Promise.all(
        streamerNames.map((name) =>
          retryFetch(() =>
            timeoutPromise(CONFIG.elementTimeout, fetchStatus(name))
          )
        )
      );
      return streamerStatuses;
    } catch (error) {
      addLog(
        "online-status-logs-list",
        `Error fetching streamer statuses: ${error}`
      );
      refreshPage();
      throw error;
    }
  }

  async function switchTabs(tabName) {
    return retryFetch(() =>
      timeoutPromise(
        CONFIG.elementTimeout,
        new Promise((resolve, reject) => {
          try {
            const tabList = document.querySelectorAll('[role="tablist"]')[0];
            if (tabList) {
              const tabs = tabList.children;
              for (let i = 0; i < tabs.length; i++) {
                if (tabs[i].textContent.trim() === tabName) {
                  tabs[i].children[0].click();
                  setTimeout(resolve, CONFIG.tabSwitchDelay);
                  return;
                }
              }
            }
            reject(new Error(`Tab ${tabName} not found`));
          } catch (error) {
            reject(error);
          }
        })
      )
    );
  }

  async function getInventoryData() {
    try {
      await switchTabs("All Campaigns");
      await switchTabs("Inventory");
      addLog("inventory-logs-list", "Reloaded inventory progress.");
      setTimeout(async () => {
        addLog("inventory-logs-list", "Checking for claim button...");
        const claimButton = await getClaimButton();
        if (claimButton) {
          claimButton.click();
          addLog("inventory-logs-list", "Claimed a drop.");
        }
      }, CONFIG.tabSwitchDelay);
    } catch (error) {
      addLog("inventory-logs-list", `Error getting inventory data: ${error}`);
      refreshPage();
    }
  }

  function getClaimButton() {
    return retryFetch(() =>
      timeoutPromise(
        CONFIG.elementTimeout,
        new Promise((resolve, reject) => {
          try {
            const xpathExpression = "//div[text()='Claim Now']";
            const result = document.evaluate(
              xpathExpression,
              document,
              null,
              XPathResult.ANY_TYPE,
              null
            );
            const divElement = result.iterateNext();
            let grandparentElement = null;

            if (divElement) {
              const parentElement = divElement.parentNode;
              grandparentElement = parentElement.parentNode;
              resolve(grandparentElement);
            } else {
              reject(new Error("Claim button not found"));
            }
          } catch (error) {
            reject(error);
          }
        })
      )
    );
  }

  function getCampaigns() {
    return retryFetch(() =>
      timeoutPromise(
        CONFIG.elementTimeout,
        new Promise((resolve, reject) => {
          try {
            const cleanArray = (arr) => {
              const filteredArray = arr.filter(
                (item) =>
                  item !== null && item !== undefined && !Number.isNaN(item)
              );
              const uniqueArray = [...new Set(filteredArray)];
              return uniqueArray;
            };
            const aTags = document.getElementsByTagName("div");
            let found = [];
            const result = [];

            for (let i = 0; i < aTags.length; i++) {
              if (aTags[i].textContent === "Watch to Redeem") {
                found.push(
                  aTags[
                    i
                  ].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].querySelector(
                    "h3.tw-title"
                  )?.textContent
                );
              }
            }

            if (found.length > 0) {
              resolve(cleanArray(found));
            } else {
              reject(new Error("No campaigns found"));
            }
          } catch (error) {
            reject(error);
          }
        })
      )
    );
  }

  function getCampaignData() {
    return retryFetch(() =>
      timeoutPromise(
        CONFIG.elementTimeout,
        new Promise((resolve, reject) => {
          try {
            const aTags = document.getElementsByTagName("h3");
            let found;
            const result = [];

            for (let i = 0; i < aTags.length; i++) {
              if (aTags[i].textContent === CONFIG.selectedCampaign) {
                found = aTags[i];
                break;
              }
            }

            if (found) {
              const mainContainer =
                found.parentElement.parentElement.parentElement.parentElement
                  .parentElement.parentElement;

              mainContainer.querySelectorAll("a").forEach((streamer) => {
                const container =
                  streamer.parentElement.parentElement.parentElement
                    .parentElement.parentElement.parentElement;
                if (
                  container.children[0].children[0].textContent ===
                  "How to Earn the Drop"
                ) {
                  const name =
                    streamer.textContent === "a participating live channel"
                      ? "general"
                      : streamer.textContent.toLowerCase();
                  const items =
                    container.parentElement.children[1].children[1].children[0].querySelectorAll(
                      "img"
                    ).length;
                  const itemNames = [];
                  container.parentElement.children[1].children[1].children[0]
                    .querySelectorAll("img")
                    .forEach((imgEl) => {
                      itemNames.push(
                        imgEl.parentElement.parentElement.parentElement
                          .children[1].children[0].children[0].textContent
                      );
                    });

                  result.push({ name, items, itemNames });
                }
              });
            }
            if (result.length > 0) {
              resolve(result);
            } else {
              reject(new Error("No campaigns found"));
            }
          } catch (error) {
            reject(error);
          }
        })
      )
    );
  }

  function getClaimedItemsNamesInv() {
    return retryFetch(() =>
      timeoutPromise(
        CONFIG.elementTimeout,
        new Promise((resolve, reject) => {
          try {
            const aTags = document.getElementsByTagName("h5");
            let found;
            const result = [];

            for (let i = 0; i < aTags.length; i++) {
              if (aTags[i].textContent === "Claimed") {
                found = aTags[i];
                break;
              }
            }

            if (found) {
              const itemImgs =
                found.parentElement.parentElement.parentElement.children[1].querySelectorAll(
                  "img"
                );
              itemImgs.forEach((imgEl) => {
                result.push(
                  imgEl.parentElement.parentElement.parentElement.children[1]
                    .children[1].children[0].textContent
                );
              });
              resolve(result);
            } else {
              reject(new Error("Claimed items not found"));
            }
          } catch (error) {
            reject(error);
          }
        })
      )
    );
  }

  function switchToTab(tabName) {
    return retryFetch(() =>
      timeoutPromise(
        CONFIG.elementTimeout,
        new Promise((resolve, reject) => {
          try {
            const tabList = document.querySelectorAll('[role="tablist"]')[0];
            if (tabList) {
              const tabs = tabList.children;
              for (let i = 0; i < tabs.length; i++) {
                if (tabs[i].textContent.trim() === tabName) {
                  tabs[i].children[0].click();
                  setTimeout(resolve, CONFIG.tabSwitchDelay);
                  return;
                }
              }
            }
            reject(new Error(`Tab ${tabName} not found`));
          } catch (error) {
            reject(error);
          }
        })
      )
    );
  }

  async function updateInfoPanel() {
    return retryFetch(() =>
      timeoutPromise(
        CONFIG.elementTimeout,
        new Promise((resolve, reject) => {
          try {
            const currentStreamer = streamers[currentStreamerIndex];
            if (!currentStreamer) {
              throw new Error("Current streamer not found");
            }
            $("#current-streamer").text(currentStreamer.name);
            const streamerListElement = $("#streamer-list");
            streamerListElement.empty();
            streamers.forEach((streamer) => {
              const missingItems = streamer.itemNames
                ? streamer.itemNames.filter(
                    (item) => !streamer.claimedItems.includes(item)
                  )
                : [];
              const listItem = createComponent(
                "li",
                "",
                `
              ${streamer.name}: ${streamer.online ? "Online" : "Offline"} - ${
                  streamer.claimedItems.length
                }/${streamer.allItems} - Missing Items: ${
                  missingItems.length ? missingItems.join(", ") : "none"
                }
            `
              );
              streamerListElement.append(listItem);
            });

            const streamerTitle = `${currentStreamer.name} - ${
              currentStreamer.online ? "Online" : "Offline"
            } - ${currentStreamer.claimedItems.length}/${
              currentStreamer.allItems
            }`;
            $("#streamer-title").text(streamerTitle);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
      )
    );
  }

  async function initStreamers() {
    try {
      await getInitialDataFromCampaigns();
      const streamerNames = streamers.map((s) => s.name);
      const streamerData = await getStreamerOnlineStatus(streamerNames);
      streamers.forEach((streamer) => {
        streamer.online = streamerData[streamer.name];
      });
      initialDataLoaded = true;
    } catch (error) {
      addLog("inventory-logs-list", `Error initializing streamers: ${error}`);
      refreshPage();
    }
  }

  async function getInitialDataFromCampaigns() {
    try {
      await switchToTab("All Campaigns");
      return new Promise((resolve) =>
        setTimeout(async () => {
          try {
            const campaignData = await getCampaignData();
            if (
              !campaignData ||
              !Array.isArray(campaignData) ||
              campaignData.length === 0 ||
              campaignData.some(
                (data) => !data || !data.name || !data.items || !data.itemNames
              )
            ) {
              addLog(
                "inventory-logs-list",
                "Campaign data invalid or empty, refreshing page."
              );
              refreshPage();
              return;
            }

            addLog(
              "inventory-logs-list",
              `Campaign data retrieved: ${JSON.stringify(campaignData)}`
            );
            streamers = campaignData.map((data) => ({
              name: data.name.replace(/^\//, ""),
              online: false,
              allItems: data.items,
              itemNames: data.itemNames,
              claimedItems: [],
            }));
            resolve();
          } catch (error) {
            addLog(
              "inventory-logs-list",
              `Error getting campaign data: ${error}`
            );
            refreshPage();
          }
        }, CONFIG.tabSwitchDelay)
      );
    } catch (error) {
      addLog(
        "inventory-logs-list",
        `Error getting initial data from campaigns: ${error}`
      );
      refreshPage();
    }
  }

  async function checkDropsAndUpdateStreamers() {
    try {
      StateHelper.setState("checkingDrops");
      await switchToTab("Inventory");
      return new Promise((resolve) =>
        setTimeout(async () => {
          try {
            await getInventoryData();
            const claimedItems = await getClaimedItemsNamesInv();
            addLog(
              "inventory-logs-list",
              `Claimed items retrieved: ${JSON.stringify(claimedItems)}`
            );
            streamers.forEach((streamer) => {
              streamer.claimedItems = claimedItems.filter((item) =>
                streamer.itemNames.includes(item)
              );
            });

            await updateInfoPanel();
            resolve();
          } catch (error) {
            addLog(
              "inventory-logs-list",
              `Error checking drops and updating streamers: ${error}`
            );
            refreshPage();
          } finally {
            StateHelper.clearState("checkingDrops");
          }
        }, CONFIG.tabSwitchDelay)
      );
    } catch (error) {
      addLog(
        "inventory-logs-list",
        `Error checking drops and updating streamers: ${error}`
      );
      refreshPage();
    }
  }

  async function checkStreamerStatus() {
    try {
      StateHelper.setState("updatingStatus");
      const currentStreamer = streamers[currentStreamerIndex];
      if (!currentStreamer) {
        throw new Error("Current streamer not found");
      }
      allOnlineStreamersHaveAllItems = streamers
        .filter((s) => s.online)
        .every((s) => s.allItems === s.claimedItems.length);

      if (
        (!currentStreamer.online ||
          currentStreamer.claimedItems.length === currentStreamer.allItems) &&
        !allOnlineStreamersHaveAllItems
      ) {
        let nextStreamerFound = false;
        for (let i = 0; i < streamers.length; i++) {
          currentStreamerIndex = (currentStreamerIndex + 1) % streamers.length;
          const nextStreamer = streamers[currentStreamerIndex];
          if (
            nextStreamer &&
            nextStreamer.allItems > nextStreamer.claimedItems.length
          ) {
            nextStreamerFound = true;
            break;
          }
        }
        if (nextStreamerFound) {
          await updateInfoPanel();
          setIframeSrc(streamers[currentStreamerIndex].name);
          addLog(
            "streamer-logs-list",
            `Switched to next streamer: ${streamers[currentStreamerIndex].name}`
          );
        } else {
          addLog(
            "streamer-logs-list",
            "No more streamers with available drops."
          );
        }
      } else if (!currentStreamer.online && allOnlineStreamersHaveAllItems) {
        addLog("streamer-logs-list", "All streamers have all items.");
        let nextStreamerFound = false;
        for (let i = 0; i < streamers.length; i++) {
          currentStreamerIndex = Math.floor(Math.random() * streamers.length);
          const nextStreamer = streamers[currentStreamerIndex];
          if (nextStreamer && nextStreamer.online) {
            nextStreamerFound = true;
            break;
          }
        }
        if (nextStreamerFound && currentStreamer != nextStreamerFound) {
          await updateInfoPanel();
          setIframeSrc(streamers[currentStreamerIndex].name);
          addLog(
            "streamer-logs-list",
            `Switched to random online streamer: ${streamers[currentStreamerIndex].name}`
          );
        } else {
          addLog("streamer-logs-list", "No more online streamers.");
        }
      } else {
        addLog("streamer-logs-list", "No need to change streamer");
        if (
          $("#streamer-frame").attr("src") ===
          "https://www.kcchanphotography.com/resources/website/common/images/loading-spin.svg"
        ) {
          setIframeSrc(currentStreamer.name);
        }
      }
    } catch (error) {
      addLog("streamer-logs-list", `Error checking streamer status: ${error}`);
      refreshPage();
    } finally {
      StateHelper.clearState("updatingStatus");
    }
  }

  async function updateStreamerOnlineStatus() {
    try {
      StateHelper.setState("updatingStatus");
      const streamerNames = streamers.map((s) => s.name);
      const streamerData = await getStreamerOnlineStatus(streamerNames);
      streamers.forEach((streamer) => {
        streamer.online = streamerData[streamer.name];
        addLog(
          "online-status-logs-list",
          `${streamer.name} is ${streamer.online ? "online" : "offline"}`
        );
      });
      await updateInfoPanel();
    } catch (error) {
      addLog(
        "online-status-logs-list",
        `Error updating streamer status: ${error}`
      );
      refreshPage();
    } finally {
      StateHelper.clearState("updatingStatus");
    }
  }

  async function refreshPage() {
    const now = Date.now();
    if (now - lastRefreshTimestamp > CONFIG.refreshCooldown) {
      StateHelper.setState("refreshing");
      window.location.href = "https://www.twitch.tv/drops/inventory";
    } else {
      addLog(
        "inventory-logs-list",
        "Refresh cooldown in effect, skipping refresh."
      );
    }
  }

  async function promptForCampaignChoice() {
    await switchToTab("All Campaigns");
    setTimeout(async () => {
      const campaigns = await getCampaigns();
      const campaignSelect = $("#campaign-select");
      campaignSelect.empty();
      campaigns.forEach((campaign) => {
        const option = createComponent("option", "", campaign, {
          value: campaign,
        });
        campaignSelect.append(option);
      });
      CONFIG.availableCampaigns = campaigns;
      saveConfig();
      $("#campaign-selection-popup").show();
    }, CONFIG.tabSwitchDelay);
  }

  async function main() {
    try {
      StateHelper.setState("initializing");
      if (!CONFIG.selectedCampaign) {
        await promptForCampaignChoice();
      } else {
        StateHelper.setState("fetching");
        $("#streamer-frame-container").show();
        await initStreamers();
        await checkDropsAndUpdateStreamers();
        await checkStreamerStatus();
        StateHelper.setState("streaming");
        setInterval(checkDropsAndUpdateStreamers, CONFIG.checkDropsInterval);
        setInterval(checkStreamerStatus, CONFIG.checkStreamerStatusInterval);
        setInterval(
          updateStreamerOnlineStatus,
          CONFIG.updateStreamerOnlineStatusInterval
        );
        setInterval(refreshPage, CONFIG.pageRefreshInterval);
        setInterval(watchdogTimer, CONFIG.watchdogInterval);
        setInterval(updateRunningTime, 1000);
      }
    } catch (error) {
      StateHelper.setState("error");
      addLog("inventory-logs-list", `Error in main function: ${error}`);
      refreshPage();
    } finally {
      StateHelper.clearState("initializing");
      StateHelper.clearState("fetching");
    }
  }

  function watchdogTimer() {
    const currentTime = Date.now();
    if (currentTime - lastActivityTimestamp > CONFIG.watchdogInterval * 2) {
      if (initialDataLoaded) {
        if (consecutiveRefreshCount < maxConsecutiveRefreshes) {
          addLog(
            "inventory-logs-list",
            "Watchdog timer triggered, refreshing page."
          );
          consecutiveRefreshCount++;
          refreshPage();
        } else {
          addLog(
            "inventory-logs-list",
            "Max consecutive refreshes reached. Pausing refreshes."
          );
          setTimeout(() => {
            consecutiveRefreshCount = 0;
          }, CONFIG.refreshCooldown);
        }
      } else {
        addLog(
          "inventory-logs-list",
          "Watchdog timer check: waiting for initial data to load."
        );
      }
    } else {
      addLog(
        "inventory-logs-list",
        "Watchdog timer check: script is running fine."
      );
      consecutiveRefreshCount = 0;
    }
  }

  function updateLastActivity() {
    lastActivityTimestamp = Date.now();
    addLog("inventory-logs-list", "Heartbeat log: script is running.");
  }

  function updateRunningTime() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const hours = Math.floor(elapsedTime / 3600000);
    const minutes = Math.floor((elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    $("#bot-running-time").text(`${hours}h ${minutes}m ${seconds}s`);
  }

  const originalSetInterval = setInterval;
  const originalSetTimeout = setTimeout;

  window.setInterval = function (callback, interval) {
    const wrappedCallback = function () {
      updateLastActivity();
      callback();
    };
    return originalSetInterval(wrappedCallback, interval);
  };

  window.setTimeout = function (callback, timeout) {
    const wrappedCallback = function () {
      updateLastActivity();
      callback();
    };
    return originalSetTimeout(wrappedCallback, timeout);
  };

  window.addEventListener("load", () => {
    applyStyles();
    createStreamerFrame();
    createMainPopup();
    createCampaignSelectionPopup();
    actionPill = createActionButton();
    loadGlobalLogs();
    addEventListeners();
    setTimeout(main, 10000);
  });

  function setIframeSrc(streamerName) {
    const currentStreamer = streamers[currentStreamerIndex];
    const streamerTitle = `${currentStreamer.name} - ${
      currentStreamer.online ? "Online" : "Offline"
    } - ${currentStreamer.claimedItems.length}/${currentStreamer.allItems}`;
    $("#streamer-title").text(streamerTitle);
    $("#streamer-frame").attr(
      "src",
      `https://player.twitch.tv/?channel=${streamerName}&parent=www.twitch.tv&muted=${
        CONFIG.muteIframe === "true"
      }&quality=${CONFIG.iframeQuality}`
    );
  }
})();
