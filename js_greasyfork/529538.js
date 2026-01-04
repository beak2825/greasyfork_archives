// ==UserScript==
// @name         Torn Target List Enhanced
// @namespace    xentac
// @version      1.1.0
// @description  Enhances Torn's Target list with hospital timers, travel status details, and sorting options
// @author       xentac (optimized version)
// @license      MIT
// @match        https://www.torn.com/page.php?sid=list&type=targets*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/529538/Torn%20Target%20List%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/529538/Torn%20Target%20List%20Enhanced.meta.js
// ==/UserScript==
(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    storageKey: 'xentac-torn_playerlist_enhanced-apikey',
    defaultKey: '###PDA-APIKEY###',
    refreshInterval: 15000, // Refresh player list every 15 seconds
    statusCheckInterval: 20000, // Check player statuses every 20 seconds
    hospitalWarningThreshold: 60, // 1 minute
    enableSorting: true,
    maxConcurrentRequests: 5, // Limit concurrent API requests
    requestDelay: 500, // Delay between API requests in ms
    cacheTime: 30000, // Cache player data for 30 seconds
    batchSize: 10, // Number of players to check in each batch
    playerCheckCycle: 120000, // Full cycle time to check all players (2 minutes)
  };

  // Country abbreviations lookup
  const COUNTRY_ABBREVIATIONS = {
    'South Africa': 'SA',
    'Cayman Islands': 'CI',
    'United Kingdom': 'UK',
    'Argentina': 'Arg',
    'Switzerland': 'Switz',
    'Mexico': 'Mex',
    'Canada': 'Can',
    'Hawaii': 'HI',
    'Japan': 'JP',
    'China': 'CN',
    'UAE': 'UAE',
    'United Arab Emirates': 'UAE'
  };

  // Status sort priorities (lower = higher priority)
  const STATUS_PRIORITIES = {
    'Hospital': 1,
    'Jail': 2,
    'Returning': 3,
    'Abroad': 4,
    'Traveling': 5,
    'Offline': 6,
    'Online': 7,
    'Default': 10
  };

  // Styles
  GM_addStyle(`
    .playerlist_highlight {
      background-color: rgba(255, 165, 0, 0.3) !important;
    }
    .playerlist_traveling .status___o6u8R span {
      color: #F287FF !important;
    }
    .playerlist_hospital_timer {
      font-weight: bold;
    }
    .playerlist_sort_controls {
      display: flex;
      justify-content: flex-end;
      margin: 5px 0;
      gap: 5px;
      padding: 5px;
    }
    .playerlist_status_changed {
      animation: flash-status 1s;
    }
    @keyframes flash-status {
      0%, 100% { background-color: transparent; }
      50% { background-color: rgba(255, 255, 0, 0.3); }
    }
  `);

  // State
  let apiKey = localStorage.getItem(CONFIG.storageKey) ?? CONFIG.defaultKey;
  const hospitalTimers = new Map();
  const playerCache = new Map();
  const requestQueue = [];
  let processingQueue = false;
  let refreshInterval = null;
  let statusCheckInterval = null;
  let playerStatusMap = new Map(); // Track player statuses for change detection
  let pendingUpdates = new Set(); // Track player IDs with pending updates

  // Track player check status
  const playerCheckTracker = {
    lastFullCycleTime: 0,
    playerLastChecked: new Map(),
    currentIndex: 0,

    // Mark a player as checked
    markChecked(playerId) {
      this.playerLastChecked.set(playerId, Date.now());
    },

    // Get time since last check
    getTimeSinceLastCheck(playerId) {
      const lastChecked = this.playerLastChecked.get(playerId) || 0;
      return Date.now() - lastChecked;
    },

    // Reset the cycle if needed
    resetCycleIfNeeded() {
      const now = Date.now();
      if (now - this.lastFullCycleTime > CONFIG.playerCheckCycle) {
        this.lastFullCycleTime = now;
        this.currentIndex = 0;
      }
    }
  };

  // Register menu command for API key
  try {
    GM_registerMenuCommand("Set API Key", () => promptForApiKey());
  } catch (error) {
    console.log("Menu command registration failed, likely running in Torn PDA");
  }

  // API key management
  function promptForApiKey() {
    const userInput = prompt(
      "Please enter a PUBLIC API Key for basic player information:",
      apiKey === CONFIG.defaultKey ? "" : apiKey
    );

    if (userInput && userInput.length === 16) {
      apiKey = userInput;
      localStorage.setItem(CONFIG.storageKey, userInput);
      return true;
    } else if (userInput !== null) {
      alert("Invalid API key. Please enter a 16-character key.");
    }
    return false;
  }

  // Check if API key is valid
  function validateApiKey() {
    if (apiKey === CONFIG.defaultKey || apiKey.length !== 16) {
      return promptForApiKey();
    }
    return true;
  }

  // Format time remaining
  function formatTimeRemaining(seconds) {
    if (seconds <= 0) return "Okay";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // Process travel status text
  function processTravelStatus(description) {
    if (!description) return "Unknown";

    // Replace country names with abbreviations
    let result = description;
    for (const [full, abbr] of Object.entries(COUNTRY_ABBREVIATIONS)) {
      result = result.replace(full, abbr);
    }

    // Format based on travel direction
    if (result.includes("Traveling to ")) {
      return "► " + result.split("Traveling to ")[1];
    } else if (result.includes("In ")) {
      return result.split("In ")[1];
    } else if (result.includes("Returning")) {
      return "◄ " + result.split("Returning to Torn from ")[1];
    } else if (result.includes("Traveling")) {
      return "Traveling";
    }

    return result;
  }

  // Process API request queue
  async function processRequestQueue() {
    if (processingQueue || requestQueue.length === 0) return;

    processingQueue = true;

    try {
      // Process up to maxConcurrentRequests at a time
      const batch = requestQueue.splice(0, CONFIG.maxConcurrentRequests);

      // Execute requests in parallel with Promise.all
      await Promise.all(batch.map(async (request, index) => {
        // Add delay between requests
        if (index > 0) {
          await new Promise(resolve => setTimeout(resolve, CONFIG.requestDelay));
        }

        try {
          const data = await fetchPlayerData(request.playerId);
          request.resolve(data);
        } catch (error) {
          request.reject(error);
        }
      }));
    } finally {
      processingQueue = false;

      // Continue processing if there are more requests
      if (requestQueue.length > 0) {
        setTimeout(processRequestQueue, CONFIG.requestDelay);
      }
    }
  }

  // Queue player data request
  function queuePlayerDataRequest(playerId, forceFresh = false) {
    return new Promise((resolve, reject) => {
      // Check cache first (unless forceFresh is true)
      if (!forceFresh) {
        const cachedData = playerCache.get(playerId);
        if (cachedData && (Date.now() - cachedData.timestamp < CONFIG.cacheTime)) {
          resolve(cachedData.data);
          return;
        }
      }

      // Add to queue
      requestQueue.push({ playerId, resolve, reject });

      // Start processing queue if not already processing
      if (!processingQueue) {
        processRequestQueue();
      }
    });
  }

  // Fetch player data from API
  async function fetchPlayerData(playerId) {
    if (!validateApiKey()) return null;

    try {
      const response = await fetch(`https://api.torn.com/user/${playerId}?selections=profile,basic&key=${apiKey}`);
      const data = await response.json();

      if (data.error) {
        console.error(`API Error: ${data.error.error}`);
        return null;
      }

      // Cache the result
      playerCache.set(playerId, {
        data: data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error("Error fetching player data:", error);
      return null;
    }
  }

  // Check if player status has changed
  function hasStatusChanged(playerId, newStatus) {
    if (!playerStatusMap.has(playerId)) return true;

    const oldStatus = playerStatusMap.get(playerId);

    // Check if state has changed
    if (oldStatus.state !== newStatus.state) return true;

    // If in hospital, check if time has changed significantly
    if (newStatus.state === 'Hospital' && oldStatus.state === 'Hospital') {
      // If hospital time changed by more than 5 seconds, consider it changed
      return Math.abs(oldStatus.until - newStatus.until) > 5;
    }

    return false;
  }

  // Update player status in our tracking map
  function updatePlayerStatus(playerId, status) {
    playerStatusMap.set(playerId, {
      state: status.state,
      until: status.until,
      description: status.description
    });
  }

  // Update player row with status information
  async function updatePlayerRow(playerRow, forceFresh = false) {
    try {
      // Extract player ID from the row
      const playerLink = playerRow.querySelector('a[href^="/profiles.php"]');
      if (!playerLink) return;

      const playerId = playerLink.href.split('XID=')[1];
      if (!playerId) return;

      // Skip if already being updated
      if (pendingUpdates.has(playerId)) return;
      pendingUpdates.add(playerId);

      try {
        // Skip if already processed recently and not forcing fresh data
        if (!forceFresh) {
          const lastUpdate = parseInt(playerRow.getAttribute('data-last-update') || '0');
          const timeSinceUpdate = Date.now() - lastUpdate;

          // If updated in the last 15 seconds and not in hospital, skip
          if (timeSinceUpdate < 15000 &&
              playerRow.getAttribute('data-status') !== 'Hospital') {
            return;
          }

          // If updated in the last 5 seconds even if in hospital, skip
          if (timeSinceUpdate < 5000) {
            return;
          }
        }

        // Get player data
        const playerData = await queuePlayerDataRequest(playerId, forceFresh);
        if (!playerData) return;

        // Check if status has changed
        const statusChanged = hasStatusChanged(playerId, playerData.status);

        // Update our status tracking
        updatePlayerStatus(playerId, playerData.status);

        // Mark as processed
        playerRow.classList.add('playerlist_processed');
        playerRow.setAttribute('data-last-update', Date.now().toString());

        // Update status cell
        const statusCell = playerRow.querySelector('.status___o6u8R');
        if (!statusCell) return;

        const statusSpan = statusCell.querySelector('span');
        if (!statusSpan) return;

        // Set data attributes for sorting
        playerRow.setAttribute('data-player-id', playerId);
        playerRow.setAttribute('data-last-action', playerData.last_action?.timestamp || '0');

        // Clear any existing timer
        if (hospitalTimers.has(playerId)) {
          clearInterval(hospitalTimers.get(playerId));
          hospitalTimers.delete(playerId);
        }

        // Process based on status
        const status = playerData.status || { state: 'Unknown' };
        playerRow.setAttribute('data-status', status.state);
        playerRow.setAttribute('data-until', status.until || '0');

        // If status changed, add flash effect
        if (statusChanged && playerRow.classList.contains('playerlist_processed')) {
          playerRow.classList.remove('playerlist_status_changed');
          // Force reflow
          void playerRow.offsetWidth;
          playerRow.classList.add('playerlist_status_changed');
        }

        switch (status.state) {
          case 'Hospital':
            playerRow.setAttribute('data-sort-priority', STATUS_PRIORITIES.Hospital);
            playerRow.classList.remove('playerlist_traveling');

            // Update the status span to show "Hospital" if it doesn't already
            if (!statusSpan.classList.contains('user-red-status')) {
              statusSpan.className = '';
              statusSpan.classList.add('user-red-status');
            }

            // Create hospital timer
            const timerFunction = () => {
              const timeRemaining = Math.round(status.until - Date.now() / 1000) - 2;

              if (timeRemaining <= 0) {
                // Don't automatically change to Okay - we'll let the status check handle this
                statusSpan.textContent = "Checking...";
                playerRow.classList.remove('playerlist_highlight');
                clearInterval(hospitalTimers.get(playerId));
                hospitalTimers.delete(playerId);

                // Force a fresh check after hospital timer expires
                setTimeout(() => {
                  const row = document.querySelector(`li[data-player-id="${playerId}"]`);
                  if (row) updatePlayerRow(row, true);
                }, 2000);

                return;
              }

              statusSpan.textContent = formatTimeRemaining(timeRemaining);
              statusSpan.classList.add('playerlist_hospital_timer');

              // Highlight if close to release
              if (timeRemaining < CONFIG.hospitalWarningThreshold) {
                playerRow.classList.add('playerlist_highlight');
              } else {
                playerRow.classList.remove('playerlist_highlight');
              }
            };

            // Run immediately and then set interval
            timerFunction();
            hospitalTimers.set(playerId, setInterval(timerFunction, 1000));
            break;

          case 'Jail':
            playerRow.setAttribute('data-sort-priority', STATUS_PRIORITIES.Jail);
            playerRow.classList.remove('playerlist_traveling', 'playerlist_highlight');

            // Update the status span
            if (!statusSpan.classList.contains('user-red-status')) {
              statusSpan.className = '';
              statusSpan.classList.add('user-red-status');
              statusSpan.textContent = "Jail";
            }
            break;

          case 'Traveling':
            statusSpan.textContent = processTravelStatus(status.description);
            playerRow.classList.add('playerlist_traveling');
            playerRow.classList.remove('playerlist_highlight');
// Update the status span
            if (!statusSpan.classList.contains('user-blue-status')) {
              statusSpan.className = '';
              statusSpan.classList.add('user-blue-status');
            }
            if (status.description && status.description.includes('Returning')) {
              playerRow.setAttribute('data-sort-priority', STATUS_PRIORITIES.Returning);
            } else {
              playerRow.setAttribute('data-sort-priority', STATUS_PRIORITIES.Traveling);
            }
            break;

          case 'Abroad':
            statusSpan.textContent = processTravelStatus(status.description);
            playerRow.classList.add('playerlist_traveling');
            playerRow.classList.remove('playerlist_highlight');

            // Update the status span
            if (!statusSpan.classList.contains('user-blue-status')) {
              statusSpan.className = '';
              statusSpan.classList.add('user-blue-status');
            }

            playerRow.setAttribute('data-sort-priority', STATUS_PRIORITIES.Abroad);
            break;

          case 'Offline':
            playerRow.setAttribute('data-sort-priority', STATUS_PRIORITIES.Offline);
            playerRow.classList.remove('playerlist_traveling', 'playerlist_highlight');

            // Update the status span
            statusSpan.className = '';
            statusSpan.textContent = "Offline";
            break;

          case 'Online':
            playerRow.setAttribute('data-sort-priority', STATUS_PRIORITIES.Online);
            playerRow.classList.remove('playerlist_traveling', 'playerlist_highlight');

            // Update the status span
            statusSpan.className = '';
            statusSpan.textContent = "Online";
            break;

          default:
            playerRow.setAttribute('data-sort-priority', STATUS_PRIORITIES.Default);
            playerRow.classList.remove('playerlist_traveling', 'playerlist_highlight');

            // Update the status span
            statusSpan.className = '';
            statusSpan.textContent = status.state || "Unknown";
            break;
        }

        // If status changed and we're in a list, resort the list
        if (statusChanged) {
          const playerList = playerRow.closest('ul');
          if (playerList) {
            sortPlayerList(playerList, 'status');
          }
        }
      } finally {
        // Always remove from pending updates
        pendingUpdates.delete(playerId);
      }
    } catch (error) {
      console.error("Error updating player row:", error);
      pendingUpdates.delete(playerId);
    }
  }

  // Sort player list (optimized with memoization)
  function sortPlayerList(playerList, sortBy = 'status') {
    if (!CONFIG.enableSorting || !playerList) return;

    try {
      const rows = Array.from(playerList.querySelectorAll('li.tableRow___UgA6S'));
      if (rows.length === 0) return;

      // Create a map for memoizing sort values to avoid repeated DOM access
      const sortValueMap = new Map();

      const getSortValue = (row, type) => {
        const key = `${row.getAttribute('data-player-id')}-${type}`;
        if (sortValueMap.has(key)) return sortValueMap.get(key);

        let value;
        switch (type) {
          case 'priority':
            value = parseInt(row.getAttribute('data-sort-priority') || '10');
            break;
          case 'until':
            value = parseInt(row.getAttribute('data-until') || '0');
            break;
          case 'lastAction':
            value = parseInt(row.getAttribute('data-last-action') || '0');
            break;
          case 'level':
            value = parseInt(row.querySelector('.level___z78dn')?.textContent || '0');
            break;
        }

        sortValueMap.set(key, value);
        return value;
      };

      // Sort with optimized comparator
      rows.sort((a, b) => {
        switch (sortBy) {
          case 'status':
            // Sort by status priority first
            const priorityDiff = getSortValue(a, 'priority') - getSortValue(b, 'priority');
            if (priorityDiff !== 0) return priorityDiff;

            // Then by time remaining (for hospital/jail)
            return getSortValue(a, 'until') - getSortValue(b, 'until');

          case 'lastAction':
            return getSortValue(b, 'lastAction') - getSortValue(a, 'lastAction');

          case 'level':
            return getSortValue(b, 'level') - getSortValue(a, 'level');

          default:
            return 0;
        }
      });

      // Use DocumentFragment for efficient DOM manipulation
      const fragment = document.createDocumentFragment();
      rows.forEach(row => fragment.appendChild(row));
      playerList.appendChild(fragment);
    } catch (error) {
      console.error("Error sorting player list:", error);
    }
  }

  // Find new player rows in a list
  function findNewPlayerRows(playerList) {
    if (!playerList) return [];

    try {
      // Use a more efficient selector to get only unprocessed rows
      return Array.from(playerList.querySelectorAll('li.tableRow___UgA6S:not(.playerlist_processed)'));
    } catch (error) {
      console.error("Error finding new player rows:", error);
      return [];
    }
  }

  // Process player list with throttling
  async function processPlayerList(tableWrapper) {
    if (!tableWrapper) return;

    try {
      // Get player list
      const playerList = tableWrapper.querySelector('ul');
      if (!playerList) return;

      // Find new player rows
      const newPlayerRows = findNewPlayerRows(playerList);
      if (newPlayerRows.length === 0) return;

      // Process rows in batches to avoid freezing the page
      const batchSize = 10;
      for (let i = 0; i < newPlayerRows.length; i += batchSize) {
        const batch = newPlayerRows.slice(i, i + batchSize);

        // Process batch in parallel
        await Promise.all(batch.map(row => updatePlayerRow(row)));

        // Small delay between batches
        if (i + batchSize < newPlayerRows.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Sort the list
      sortPlayerList(playerList, 'status');

    } catch (error) {
      console.error("Error processing player list:", error);
    }
  }

  // Check for status changes in visible players
  async function checkPlayerStatusChanges() {
    try {
      // Reset cycle if needed
      playerCheckTracker.resetCycleIfNeeded();

      // Get all visible player rows
      const allPlayerRows = document.querySelectorAll('li.tableRow___UgA6S.playerlist_processed');
      if (allPlayerRows.length === 0) return;

      const allRows = Array.from(allPlayerRows);

      // Determine which players to check in this batch
      let rowsToCheck = [];

      // 1. First priority: Hospital patients
      const hospitalRows = allRows.filter(row =>
        row.getAttribute('data-status') === 'Hospital'
      );

      // Add hospital patients to check list
      rowsToCheck = [...hospitalRows];

      // 2. Second priority: Players in the current cycle segment
      if (rowsToCheck.length < CONFIG.batchSize) {
        const remainingSlots = CONFIG.batchSize - rowsToCheck.length;

        // Calculate how many players to check per interval to cover all in one cycle
        const playersPerInterval = Math.max(1, Math.ceil(allRows.length /
          (CONFIG.playerCheckCycle / CONFIG.statusCheckInterval)));

        // Get non-hospital rows that haven't been checked yet
        const otherRows = allRows.filter(row =>
          !hospitalRows.includes(row)
        );

        if (otherRows.length > 0) {
          // Get the next batch of players in sequence
          for (let i = 0; i < remainingSlots && i < playersPerInterval; i++) {
            const index = (playerCheckTracker.currentIndex + i) % otherRows.length;
            if (!rowsToCheck.includes(otherRows[index])) {
              rowsToCheck.push(otherRows[index]);
            }
          }

          // Update the current index for next time
          playerCheckTracker.currentIndex =
            (playerCheckTracker.currentIndex + playersPerInterval) % otherRows.length;
        }
      }

      // Check each player in the batch with parallel processing
      await Promise.all(rowsToCheck.map(async (row, index) => {
        // Add small staggered delay to prevent API rate limiting
        if (index > 0) {
          await new Promise(resolve => setTimeout(resolve, 200 * index));
        }

        const playerId = row.getAttribute('data-player-id');
        if (!playerId) return;

        await updatePlayerRow(row, true); // Force fresh data
        playerCheckTracker.markChecked(playerId);
      }));

    } catch (error) {
      console.error("Error checking player status changes:", error);
    }
  }

  // Clean up resources
  function cleanUp() {
    // Clear all hospital timers
    hospitalTimers.forEach((timer) => {
      clearInterval(timer);
    });
    hospitalTimers.clear();

    // Clear refresh interval
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }

    // Clear status check interval
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      statusCheckInterval = null;
    }

    // Clear observer
    if (observer) {
      observer.disconnect();
    }
  }

  // Set up mutation observer with debouncing
  let debounceTimer = null;
  const observer = new MutationObserver(mutations => {
    // Debounce to prevent excessive processing
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // Check for player list changes
      let tableWrapperFound = false;
      let playerRowsAdded = false;

      for (const mutation of mutations) {
        // Check for added nodes
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check for player rows added to existing lists
          const playerList = mutation.target.closest('ul');
          if (playerList) {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE &&
                  node.classList?.contains('tableRow___UgA6S')) {
                playerRowsAdded = true;
                break;
              }
            }
          }

          // Check for new table wrappers
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const tableWrapper = node.classList?.contains('tableWrapper___Imc7p')
                ? node
                : node.querySelector('.tableWrapper___Imc7p');

              if (tableWrapper) {
                tableWrapperFound = true;
                processPlayerList(tableWrapper);
              }
            }
          }
        }
      }

      // Process player lists if rows were added
      if (playerRowsAdded) {
        const tableWrappers = document.querySelectorAll('.tableWrapper___Imc7p');
        tableWrappers.forEach(wrapper => {
          processPlayerList(wrapper);
        });
      }
    }, 200); // 200ms debounce
  });

  // Start observing with error handling
  try {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } catch (error) {
    console.error("Error starting observer:", error);
  }

  // Set up periodic refresh with error handling
  refreshInterval = setInterval(() => {
    try {
      const tableWrappers = document.querySelectorAll('.tableWrapper___Imc7p');
      if (tableWrappers.length === 0) return;

      // Process all wrappers to check for new players
      tableWrappers.forEach(wrapper => {
        processPlayerList(wrapper);
      });
    } catch (error) {
      console.error("Error in refresh interval:", error);
    }
  }, CONFIG.refreshInterval);

  // Set up status check interval
  statusCheckInterval = setInterval(() => {
    try {
      // Only run if there are player lists visible
      const tableWrappers = document.querySelectorAll('.tableWrapper___Imc7p');
      if (tableWrappers.length > 0) {
        checkPlayerStatusChanges();
      }
    } catch (error) {
      console.error("Error in status check interval:", error);
    }
  }, CONFIG.statusCheckInterval);

  // Initial run with delay
  setTimeout(() => {
    try {
      const tableWrappers = document.querySelectorAll('.tableWrapper___Imc7p');
      tableWrappers.forEach(wrapper => {
        processPlayerList(wrapper);
      });
    } catch (error) {
      console.error("Error in initial run:", error);
    }
  }, 1000); // 1 second delay to ensure the page has loaded

  // Clean up on page unload
  window.addEventListener('beforeunload', cleanUp);
})();