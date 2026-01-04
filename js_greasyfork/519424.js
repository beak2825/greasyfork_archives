// ==UserScript==
// @name        Item Market Mug Helper
// @author      Weav3r
// @match       https://www.torn.com/page.php?sid=ItemMarket*
// @grant       none
// @version     1.10
// @description Highlights expensive listings, outlines seller names based on status, allows hiding listings below a threshold, and provides customizable shortcuts for mugging
// @namespace https://greasyfork.org/users/1132291
// @downloadURL https://update.greasyfork.org/scripts/519424/Item%20Market%20Mug%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/519424/Item%20Market%20Mug%20Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Configuration Constants
  const API_RATE_LIMIT = 90;
  const RATE_LIMIT_WINDOW = 60000; // 1 minute
  const REFRESH_INTERVAL = 30000; // 30 seconds
  const ITEMS_DATA_KEY = 'tornMarketItemsData';
  const ITEMS_DATA_TIMESTAMP_KEY = 'tornMarketItemsDataTimestamp';
  const SHORTCUTS_KEY = 'tornMarketShortcuts';
  const ITEMS_DATA_REFRESH_INTERVAL = 86400000; // 24 hours

  // State Variables
  const userCache = {};
  const apiCallTimestamps = [];
  let hideBelowThreshold = false;
  let EXPENSIVE_THRESHOLD = parseInt(localStorage.getItem('expensiveThreshold')) || 50000000; // $50,000,000
  let API_KEY = localStorage.getItem('tornApiKey') || '';
  const relevantUsers = new Set();
  let itemsData = {}; // { itemID: { name: "Hammer", ... } }
  let shortcuts = []; // Array of itemIDs
  let settingsContainerAdded = false;

  // Inject CSS Styles
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Settings Container */
      .torn-market-settings {
        background: #2b2b2b;
        border: 1px solid #404040;
        padding: 16px;
        margin: 16px 0;
        display: flex;
        flex-direction: column;
        gap: 24px;
        border-radius: 8px;
      }

      .torn-market-settings-row {
        display: flex;
        align-items: center;
        gap: 24px;
        flex-wrap: wrap;
      }

      .torn-market-settings label {
        color: #c8c8c8;
        font-size: 14px;
        margin-right: 8px;
      }

      .torn-market-settings input[type="number"] {
        background: #1f1f1f;
        border: 1px solid #404040;
        color: #c8c8c8;
        padding: 8px 12px;
        width: 180px;
        border-radius: 4px;
        font-size: 14px;
      }

      .torn-market-settings button {
        background: #1c6cc9;
        color: #fff;
        border: none;
        padding: 8px 16px;
        font-size: 14px;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.3s;
        white-space: nowrap;
      }

      .torn-market-settings button:hover {
        background: #1559ab;
      }

      .highlighted-price {
        background: #ffd700 !important;
        color: #000 !important;
      }

      .seller-status-Okay {
        outline: 4px solid #2ecc71 !important;
      }
      .seller-status-Hospital {
        outline: 4px solid #f1c40f !important;
      }
      .seller-status-Jail {
        outline: 4px solid #e74c3c !important;
      }
      .seller-status-Traveling {
        outline: 4px solid #3498db !important;
      }

      /* Shortcuts Menu */
      .shortcuts-menu {
        border-top: 1px solid #404040;
        padding-top: 16px;
      }

      .shortcuts-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .shortcuts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 16px;
      }

      .shortcut-item {
        background: #1f1f1f;
        border: 1px solid #404040;
        border-radius: 4px;
        padding: 8px;
        text-align: center;
        position: relative;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .shortcut-item:hover {
        transform: scale(1.05);
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
      }

      .shortcut-item img {
        width: 60px;
        height: 60px;
        object-fit: contain;
        margin-bottom: 8px;
      }

      .shortcut-item span {
        display: block;
        color: #fff;
        font-size: 14px;
        word-wrap: break-word;
      }

      .remove-shortcut {
        position: absolute;
        top: 4px;
        right: 6px;
        background: rgba(0, 0, 0, 0.6);
        border: none;
        color: #e74c3c;
        font-weight: bold;
        cursor: pointer;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        line-height: 18px;
        text-align: center;
        padding: 0;
      }

      .remove-shortcut:hover {
        background: rgba(0, 0, 0, 0.8);
      }

      /* Add Shortcut Button */
      .add-shortcut {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #1f1f1f;
        border: 2px dashed #404040;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s, border-color 0.3s;
      }

      .add-shortcut:hover {
        background: #2a2a2a;
        border-color: #1c6cc9;
      }

      .add-shortcut span {
        color: #c8c8c8;
        font-size: 24px;
      }

      /* Modal Styles */
      .shortcut-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .shortcut-modal {
        background: #2b2b2b;
        padding: 24px;
        border-radius: 8px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
      }

      .shortcut-modal h2 {
        margin-top: 0;
        color: #fff;
        font-size: 18px;
        margin-bottom: 16px;
      }

      .shortcut-modal input[type="text"] {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #404040;
        border-radius: 4px;
        background: #1f1f1f;
        color: #c8c8c8;
        font-size: 14px;
        margin-bottom: 16px;
      }

      .shortcut-modal .modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      .shortcut-modal .modal-buttons button {
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        transition: background 0.3s;
      }

      .shortcut-modal .modal-buttons .cancel-btn {
        background: #e74c3c;
        color: #fff;
      }

      .shortcut-modal .modal-buttons .cancel-btn:hover {
        background: #c0392b;
      }

      .shortcut-modal .modal-buttons .confirm-btn {
        background: #27ae60;
        color: #fff;
      }

      .shortcut-modal .modal-buttons .confirm-btn:hover {
        background: #1e8449;
      }
    `;
    document.head.appendChild(style);
  }

  // Create Settings Container with Enhanced Styling
  function createSettingsContainer() {
    const targetContainer = document.querySelector('.appHeaderWrapper___uyPti .bottomSection___ROxsQ');

    if (!targetContainer || settingsContainerAdded) return;

    // Create the main settings container
    const container = document.createElement('div');
    container.className = 'torn-market-settings';

    // Row for Threshold and Buttons
    const settingsRow = document.createElement('div');
    settingsRow.className = 'torn-market-settings-row';

    // Threshold Input
    const thresholdContainer = document.createElement('div');

    const thresholdLabel = document.createElement('label');
    thresholdLabel.textContent = 'Threshold:';

    const thresholdInput = document.createElement('input');
    thresholdInput.type = 'number';
    thresholdInput.value = EXPENSIVE_THRESHOLD;
    thresholdInput.placeholder = 'Enter amount';

    // Immediate update without debounce
    thresholdInput.addEventListener('input', () => {
      const newThreshold = parseInt(thresholdInput.value);
      if (!isNaN(newThreshold)) {
        EXPENSIVE_THRESHOLD = newThreshold;
        localStorage.setItem('expensiveThreshold', EXPENSIVE_THRESHOLD);
        processAllListings();
      }
    });

    thresholdContainer.appendChild(thresholdLabel);
    thresholdContainer.appendChild(thresholdInput);
    settingsRow.appendChild(thresholdContainer);

    // Hide/Show Listings Toggle Button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Showing listings below threshold';

    toggleButton.addEventListener('click', () => {
      hideBelowThreshold = !hideBelowThreshold;
      toggleButton.textContent = hideBelowThreshold ? 'Hiding listings below threshold' : 'Showing listings below threshold';
      processAllListings();
    });

    settingsRow.appendChild(toggleButton);

    // API Key Button
    const apiKeyButton = document.createElement('button');
    apiKeyButton.textContent = API_KEY ? 'Edit API Key' : 'Set API Key';

    apiKeyButton.addEventListener('click', () => {
      const newApiKey = prompt('Enter your Torn API Key:', API_KEY);
      if (newApiKey !== null) {
        API_KEY = newApiKey.trim();
        localStorage.setItem('tornApiKey', API_KEY);
        apiKeyButton.textContent = API_KEY ? 'Edit API Key' : 'Set API Key';
        // Re-process listings if API key is set
        if (API_KEY) {
          loadItemsData().then(() => {
            processAllListings();
          });
        }
      }
    });

    settingsRow.appendChild(apiKeyButton);

    container.appendChild(settingsRow);

    // Shortcuts Menu
    const shortcutsMenu = createShortcutsMenu();
    container.appendChild(shortcutsMenu);

    targetContainer.appendChild(container);
    settingsContainerAdded = true;
  }

  // Create Shortcuts Menu (Always Visible)
  function createShortcutsMenu() {
    const menuContainer = document.createElement('div');
    menuContainer.className = 'shortcuts-menu';

    // Content
    const content = document.createElement('div');
    content.className = 'shortcuts-content';

    // Shortcuts Grid
    const shortcutsGrid = document.createElement('div');
    shortcutsGrid.className = 'shortcuts-grid';
    content.appendChild(shortcutsGrid);

    // Render Existing Shortcuts
    renderShortcuts(shortcutsGrid);

    menuContainer.appendChild(content);
    return menuContainer;
  }

  // Render Shortcuts
  function renderShortcuts(gridContainer) {
    gridContainer.innerHTML = ''; // Clear existing shortcuts

    shortcuts.forEach((itemID) => {
      const item = itemsData[itemID];
      if (item) {
        const shortcut = document.createElement('div');
        shortcut.className = 'shortcut-item';
        shortcut.title = item.name;

        // Click to navigate
        shortcut.addEventListener('click', () => {
          window.location.href = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${itemID}`;
        });

        // Image
        const img = document.createElement('img');
        img.src = `https://www.torn.com/images/items/${itemID}/large.png`;
        img.alt = item.name;
        shortcut.appendChild(img);

        // Name
        const name = document.createElement('span');
        name.textContent = item.name;
        shortcut.appendChild(name);

        // Remove Button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-shortcut';
        removeBtn.textContent = '✖';
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent triggering the navigation
          removeShortcut(itemID);
        });
        shortcut.appendChild(removeBtn);

        gridContainer.appendChild(shortcut);
      }
    });

    // Add "Add Shortcut" Button at the End
    const addShortcutButton = document.createElement('div');
    addShortcutButton.className = 'shortcut-item add-shortcut';
    addShortcutButton.title = 'Add Shortcut';

    const addIcon = document.createElement('span');
    addIcon.textContent = '+';
    addShortcutButton.appendChild(addIcon);

    addShortcutButton.addEventListener('click', () => {
      openAddShortcutModal();
    });

    gridContainer.appendChild(addShortcutButton);
  }

  // Open Add Shortcut Modal
  function openAddShortcutModal() {
    // Prevent multiple modals
    if (document.querySelector('.shortcut-modal-overlay')) return;

    // Create Overlay
    const overlay = document.createElement('div');
    overlay.className = 'shortcut-modal-overlay';

    // Create Modal
    const modal = document.createElement('div');
    modal.className = 'shortcut-modal';

    // Modal Title
    const title = document.createElement('h2');
    title.textContent = 'Add Shortcut';
    modal.appendChild(title);

    // Input Field
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Enter item name or ID';
    modal.appendChild(inputField);

    // Buttons Container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'modal-buttons';

    // Cancel Button
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // Confirm Button
    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'confirm-btn';
    confirmBtn.textContent = 'Add';
    confirmBtn.addEventListener('click', () => {
      const input = inputField.value.trim();
      if (input === '') {
        alert('Please enter an item name or ID.');
        return;
      }
      addShortcut(input);
      document.body.removeChild(overlay);
    });

    // Allow pressing Enter to add shortcut
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        confirmBtn.click();
      }
    });

    buttonsContainer.appendChild(cancelBtn);
    buttonsContainer.appendChild(confirmBtn);
    modal.appendChild(buttonsContainer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // Add Shortcut
  function addShortcut(input) {
    let itemID = null;
    let itemName = '';

    // Check if input is a number (ID)
    if (/^\d+$/.test(input)) {
      if (itemsData[input]) {
        itemID = input;
        itemName = itemsData[input].name;
      } else {
        alert(`No item found with ID ${input}.`);
        return;
      }
    } else {
      // Input is assumed to be a name
      const matchedItems = Object.values(itemsData).filter(item => item.name.toLowerCase() === input.toLowerCase());
      if (matchedItems.length === 1) {
        itemID = matchedItems[0].item_id;
        itemName = matchedItems[0].name;
      } else if (matchedItems.length > 1) {
        alert(`Multiple items found with the name "${input}". Please use the item ID instead.`);
        return;
      } else {
        alert(`No item found with the name "${input}".`);
        return;
      }
    }

    // Check for duplicates
    if (shortcuts.includes(itemID)) {
      alert(`Shortcut for "${itemName}" already exists.`);
      return;
    }

    // Add to shortcuts and save
    shortcuts.push(itemID);
    saveShortcuts();

    // Re-render shortcuts
    const gridContainer = document.querySelector('.shortcuts-grid');
    renderShortcuts(gridContainer);
  }

  // Remove Shortcut
  function removeShortcut(itemID) {
    const index = shortcuts.indexOf(itemID);
    if (index !== -1) {
      shortcuts.splice(index, 1);
      saveShortcuts();
      const gridContainer = document.querySelector('.shortcuts-grid');
      renderShortcuts(gridContainer);
    }
  }

  // Load Shortcuts from localStorage
  function loadShortcuts() {
    const storedShortcuts = localStorage.getItem(SHORTCUTS_KEY);
    if (storedShortcuts) {
      try {
        shortcuts = JSON.parse(storedShortcuts);
      } catch (e) {
        console.error('Error parsing shortcuts from localStorage:', e);
        shortcuts = [];
      }
    }
  }

  // Save Shortcuts to localStorage
  function saveShortcuts() {
    localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(shortcuts));
  }

  // Load Items Data from localStorage or fetch from API
  function loadItemsData() {
    const storedData = localStorage.getItem(ITEMS_DATA_KEY);
    const storedTimestamp = parseInt(localStorage.getItem(ITEMS_DATA_TIMESTAMP_KEY)) || 0;
    const now = Date.now();

    if (storedData && (now - storedTimestamp) < ITEMS_DATA_REFRESH_INTERVAL) {
      try {
        itemsData = JSON.parse(storedData);
        console.log('Loaded items data from localStorage.');
        return Promise.resolve();
      } catch (e) {
        console.error('Error parsing items data from localStorage:', e);
      }
    }

    if (!API_KEY) {
      console.warn('API Key not set. Shortcuts will not function properly.');
      return Promise.resolve();
    }

    const apiUrl = `https://api.torn.com/torn/?key=${API_KEY}&selections=items`;

    return fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching items data:', data.error);
          return;
        }
        if (data.items) {
          // Transform items data to { itemID: { name: "Hammer", ... } }
          itemsData = {};
          for (const [id, item] of Object.entries(data.items)) {
            itemsData[id] = {
              item_id: id,
              name: item.name
            };
          }
          localStorage.setItem(ITEMS_DATA_KEY, JSON.stringify(itemsData));
          localStorage.setItem(ITEMS_DATA_TIMESTAMP_KEY, now.toString());
          console.log('Fetched and stored items data.');
        } else {
          console.error('No items data found in API response.');
        }
      })
      .catch(error => {
        console.error('Error fetching items data:', error);
      });
  }

  // Check if API Call can be made without exceeding rate limit
  function canMakeApiCall() {
    if (!API_KEY) return false;
    const now = Date.now();
    while (apiCallTimestamps.length && now - apiCallTimestamps[0] > RATE_LIMIT_WINDOW) {
      apiCallTimestamps.shift();
    }
    return apiCallTimestamps.length < API_RATE_LIMIT;
  }

  // Process all listings on the page
  function processAllListings() {
    const honorWraps = document.querySelectorAll('div[class*="honorWrap"], div[class*="anonymous"]');
    honorWraps.forEach((honorWrap) => {
      processListing(honorWrap);
    });
  }

  // Process an individual listing
  function processListing(honorWrap) {
    const rowWrapper = honorWrap.closest('li[class*="rowWrapper"]');
    if (!rowWrapper) return;

    let userID = 'Anonymous';
    const profileLink = honorWrap.querySelector('a[href*="profiles.php?XID="]');
    if (profileLink) {
      const href = profileLink.getAttribute('href');
      const match = href.match(/XID=(\d+)/);
      if (match) userID = match[1];
    }

    const priceElement = rowWrapper.querySelector('div[class*="price"]');
    const priceText = priceElement ? priceElement.textContent.replace(/[^0-9.,-]+/g, '') : '0';
    const price = parseFloat(priceText.replace(/,/g, ''));

    const quantityElement = rowWrapper.querySelector('div[class*="available"]');
    const quantityText = quantityElement ? quantityElement.textContent.replace(/[^0-9,]+/g, '') : '0';
    const quantity = parseInt(quantityText.replace(/,/g, ''), 10);

    const totalValue = price * quantity;

    if (totalValue >= EXPENSIVE_THRESHOLD) {
      priceElement.classList.add('highlighted-price');
      priceElement.classList.remove('hidden-price');

      if (userID !== 'Anonymous') {
        relevantUsers.add(userID);
        fetchUserStatus(userID, profileLink);
      }
      rowWrapper.style.display = ''; // Ensure row is visible
    } else {
      priceElement.classList.remove('highlighted-price');
      priceElement.classList.add('hidden-price');

      if (profileLink) {
        // Remove any existing status classes
        profileLink.classList.remove(
          'seller-status-Okay',
          'seller-status-Hospital',
          'seller-status-Jail',
          'seller-status-Traveling'
        );
      }

      if (hideBelowThreshold) {
        rowWrapper.style.display = 'none';
      } else {
        rowWrapper.style.display = ''; // Ensure row is visible
      }

      // Remove user from relevantUsers if no longer relevant
      if (userID !== 'Anonymous') {
        relevantUsers.delete(userID);
      }
    }
  }

  // Fetch user status from Torn API
  function fetchUserStatus(userID, profileLink) {
    if (!API_KEY) return;
    const now = Date.now();

    if (userCache[userID] && now - userCache[userID].timestamp < 30000) {
      applyUserStatus(userCache[userID].data, profileLink);
      return;
    }

    if (!canMakeApiCall()) return;

    apiCallTimestamps.push(now);

    const apiUrl = `https://api.torn.com/v2/user?key=${API_KEY}&selections=basic,profile&id=${userID}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.warn(`API Error for user ${userID}:`, data.error);
          return;
        }
        if (data) {
          userCache[userID] = { data: data, timestamp: now };
          applyUserStatus(data, profileLink);
        } else {
          console.warn(`No data found for user ${userID}.`);
        }
      })
      .catch((error) => console.error(`Error fetching user ${userID}:`, error));
  }

  // Apply user status styling based on their state and job type
  function applyUserStatus(userData, profileLink) {
    const state = userData.status && userData.status.state ? userData.status.state : 'Unknown';
    const jobType = userData.job && userData.job.company_type ? userData.job.company_type : null;

    // Clear existing status classes
    profileLink.classList.remove(
      'seller-status-Okay',
      'seller-status-Hospital',
      'seller-status-Jail',
      'seller-status-Traveling'
    );

    // Do not apply any class if company_type is 5
    if (jobType === 5) {
      return;
    }

    // Add appropriate class based on the state
    switch (state) {
      case 'Okay':
        profileLink.classList.add('seller-status-Okay');
        break;
      case 'Hospital':
        profileLink.classList.add('seller-status-Hospital');
        break;
      case 'Jail':
        profileLink.classList.add('seller-status-Jail');
        break;
      case 'Traveling':
        profileLink.classList.add('seller-status-Traveling');
        break;
      default:
        // No border for unknown states
        break;
    }
  }

  // Process listings within a specific root node
  function processListings(rootNode) {
    const honorWraps = rootNode.querySelectorAll('div[class*="honorWrap"], div[class*="anonymous"]');
    honorWraps.forEach((honorWrap) => {
      processListing(honorWrap);
    });
  }

  // Initialize MutationObservers
  function initializeObservers() {
    // Observer for settings container
    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the target container is present
            const targetContainer = node.querySelector('.appHeaderWrapper___uyPti .bottomSection___ROxsQ') ||
                                    node.closest('.appHeaderWrapper___uyPti .bottomSection___ROxsQ');
            if (targetContainer && !settingsContainerAdded) {
              createSettingsContainer();
              processAllListings();
              startPeriodicUpdates();
              return;
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Observer for dynamic listings
    const listingsObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) processListings(node);
        });

        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const honorWraps = node.querySelectorAll('div[class*="honorWrap"], div[class*="anonymous"]');
            honorWraps.forEach((honorWrap) => {
              const profileLink = honorWrap.querySelector('a[href*="profiles.php?XID="]');
              if (profileLink) {
                const href = profileLink.getAttribute('href');
                const match = href.match(/XID=(\d+)/);
                if (match) {
                  const userID = match[1];
                  relevantUsers.delete(userID);
                }
              }
            });
          }
        });
      });
    });

    listingsObserver.observe(document.body, { childList: true, subtree: true });
  }

  // Start periodic updates for user statuses
  function startPeriodicUpdates() {
    setInterval(() => {
      relevantUsers.forEach((userID) => {
        const profileLink = document.querySelector(`a[href*="profiles.php?XID=${userID}"]`);
        if (profileLink && isElementVisible(profileLink.closest('li'))) {
          fetchUserStatus(userID, profileLink);
        } else {
          // If the listing is no longer visible, remove from relevantUsers
          relevantUsers.delete(userID);
        }
      });
    }, REFRESH_INTERVAL);
  }

  // Check if an element is visible in the DOM
  function isElementVisible(element) {
    return element && element.offsetParent !== null;
  }

  // Initialize the script
  async function init() {
    injectStyles();
    loadShortcuts();
    await loadItemsData();
    // Check if already on /market/ page
    if (window.location.pathname === '/page.php' && window.location.hash.startsWith('#/market')) {
      createSettingsContainer();
      processAllListings();
      startPeriodicUpdates();
    }
    initializeObservers();
  }

  // Monitor URL changes for SPA navigation
  function monitorURLChanges() {
    let currentURL = window.location.href;
    setInterval(() => {
      if (window.location.href !== currentURL) {
        currentURL = window.location.href;
        if (window.location.pathname === '/page.php' && window.location.hash.startsWith('#/market')) {
          if (!settingsContainerAdded) {
            createSettingsContainer();
            processAllListings();
            startPeriodicUpdates();
          }
        }
      }
    }, 1000); // Check every second
  }

  // Run the initializer once the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      monitorURLChanges();
    });
  } else {
    init();
    monitorURLChanges();
  }
})();