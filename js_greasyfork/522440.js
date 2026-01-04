// ==UserScript==
// @name         Alienware Arena Filters
// @namespace    http://updownleftdie.com/
// @version      1.1
// @description  Filter out tier-restricted content on Alienware Arena
// @author       UpDownLeftDie
// @match        https://*.alienwarearena.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/522440/Alienware%20Arena%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/522440/Alienware%20Arena%20Filters.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
 
  // Settings management
  const defaultSettings = {
    hideClosedGiveaways: true,
    hideTierRestricted: true,
    autoSyncTier: true,
    hideOutOfStock: true,
    hideClaimed: true,
  };
 
  function getSettings() {
    const savedSettings = GM_getValue('filterSettings');
    // Start with default settings as base
    const settings = { ...defaultSettings };
 
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Merge saved settings with defaults
        Object.assign(settings, parsed);
        // Ensure userTier is a number or undefined
        settings.userTier =
          parsed.userTier != null ? Number(parsed.userTier) : undefined;
 
        // If Number() returned NaN, set to undefined
        if (Number.isNaN(settings.userTier)) {
          settings.userTier = undefined;
        }
      } catch (e) {
        console.error('Error parsing saved settings:', e);
        // On error, return defaults
        return defaultSettings;
      }
    }
 
    return settings;
  }
  function saveSettings(settings) {
    const prevSettings = getSettings();
    const newSettings = {
      ...prevSettings,
      ...settings,
    };
    GM_setValue('filterSettings', JSON.stringify(newSettings));
  }
 
  // Function to extract tier number from text
  function extractTier(text) {
    const match = text.match(/Tier\s*(\d+)/i);
    return match ? parseInt(match[1]) : null;
  }
 
  // Function to check and store user's tier on control center page
  function checkAndStoreTier() {
    const tierImg = document.querySelector(
      'img[src*="/images/content/tier-tags/"]',
    );
    if (tierImg) {
      const tierMatch = tierImg.src.match(/tier-tags\/(\d+)\.png/);
      if (tierMatch) {
        const userTier = parseInt(tierMatch[1]);
        saveSettings({ userTier });
        console.log('Stored user tier:', userTier);
      }
    }
  }
 
  // Function to filter community giveaways
  function filterGiveaways() {
    const settings = getSettings();
    const userTier = settings.userTier ?? 99;
    const giveaways = document.querySelectorAll(
      'div.mb-3.community-giveaways__listing__row',
    );
 
    giveaways.forEach((giveaway) => {
      const text = giveaway.textContent;
      if (settings.hideClosedGiveaways && text.includes('Closed')) {
        giveaway.style.display = 'none';
        return;
      }
 
      if (settings.hideTierRestricted) {
        const tierNumber = extractTier(text);
        if (tierNumber && tierNumber > userTier) {
          giveaway.style.display = 'none';
        }
      }
    });
  }
 
  // Function to filter marketplace items
  function filterMarketplace() {
    const settings = getSettings();
    const userTier = settings.userTier ?? 99;
    const items = document.querySelectorAll(
      '.pointer.marketplace-game-small, .pointer.marketplace-game-large, .product-tile, .featured-tile',
    );
 
    items.forEach((item) => {
      const text = item.textContent;
      if (
        settings.hideOutOfStock &&
        text.toLowerCase().includes('out of stock')
      ) {
        item.style.display = 'none';
        return;
      }
 
      if (settings.hideClaimed && text.toLowerCase().includes('claimed')) {
        item.style.display = 'none';
        return;
      }
 
      if (settings.hideTierRestricted) {
        const tierNumber = extractTier(text);
        if (tierNumber && tierNumber > userTier) {
          item.style.display = 'none';
        }
      }
    });
 
    if (
      [...document.querySelectorAll('.row.mt-3 .featured-tile')].every(
        (tile) => tile.style.display === 'none',
      )
    ) {
      const flashDealsSection = document.querySelector(
        'div[style*="border-style: solid"][class*="row mt-3"]',
      );
      if (flashDealsSection) {
        flashDealsSection.style.display = 'none';
      }
    }
  }
 
  // Function to create settings menu
  function createSettingsMenu() {
    const settings = getSettings();
    const menuHTML = `
      <div
        id="alienware-filter-settings"
        role="dialog"
        aria-labelledby="settings-title"
        aria-modal="true">
        <div role="document">
          <!-- Title -->
          <div id="settings-title" role="heading" aria-level="1">Filter Settings</div>
 
          <!-- Settings Form -->
          <form>
            <!-- Global Settings Section -->
            <div class="settings-section" style="margin-bottom: 20px">
              <div role="heading" aria-level="2" class="section-heading">
                Global Settings
              </div>
              <div
                class="settings-group"
                role="group"
                aria-label="Global Filter Options">
                <div class="setting">
                  <label class="settingsLabel">
                    <input type="checkbox" id="hideTierRestricted" ${
                      settings.hideTierRestricted ? 'checked' : ''
                    }
                    aria-describedby="hideTierDesc"> Hide Higher Tier Content
                  </label>
                  <span id="hideTierDesc" class="sr-only"
                    >If checked, content requiring a higher tier than your current
                    tier will be hidden</span
                  >
                </div>
                <div class="setting">
                  <label class="settingsLabel">
                    <input type="checkbox" id="autoSyncTier" ${
                      !settings.hideTierRestricted ? 'disabled' : ''
                    } ${settings.autoSyncTier ? 'checked' : ''}
                    aria-describedby="autoSyncTierDesc"> Auto Sync Tier
                  </label>
                  <span id="hideTierDesc" class="sr-only"
                    >If checked, tier restrictions will be automatically synced from
                    your profile</span
                  >
                </div>
                <div class="setting">
                  <label class="settingsLabel">
                    User tier:
                    <input id="manualSetTier" type="text" inputmode="numeric" pattern="[0-9]*" size="1" maxlength="2" ${
                      settings.autoSyncTier ? 'disabled' : ''
                    } value="${settings.userTier ? settings.userTier : ''}"
                    aria-describedby="manualSetTierDesc">
                  </label>
                  <span id="manualSetTierDesc" class="sr-only">
                    The user tier that is used to filter content on the site</span>
                </div>
              </div>
            </div>
 
            <!-- Game Vault and Marketplace Section -->
            <div class="settings-section" style="margin-bottom: 20px">
              <div role="heading" aria-level="2" class="section-heading">
                Marketplace &amp; Game Vault
              </div>
              <div
                class="settings-group"
                role="group"
                aria-label="Marketplace Options">
                <div class="setting">
                  <label class="settingsLabel">
                    <input type="checkbox" id="hideOutOfStock" ${
                      settings.hideOutOfStock ? 'checked' : ''
                    }
                    aria-describedby="hideStockDesc"> Hide Out of Stock Items
                  </label>
                  <span id="hideStockDesc" class="sr-only"
                    >If checked, items that are out of stock will be hidden</span
                  >
                </div>
                <div class="setting">
                  <label class="settingsLabel">
                    <input type="checkbox" id="hideClaimed" ${
                      settings.hideClaimed ? 'checked' : ''
                    } aria-describedby="hideClaimedDesc"> Hide Claimed
                    Items
                  </label>
                  <span id="hideClaimedDesc" class="sr-only"
                    >If checked, items that you have claimed will be hidden</span
                  >
                </div>
              </div>
            </div>
 
            <!-- Community Giveaways Section -->
            <div class="settings-section" style="margin-bottom: 20px">
              <div role="heading" aria-level="2" class="section-heading">
                Community Giveaways
              </div>
              <div
                class="settings-group"
                role="group"
                aria-label="Community Giveaway Options">
                <div class="setting">
                  <label class="settingsLabel">
                    <input type="checkbox" id="hideClosedGiveaways" ${
                      settings.hideClosedGiveaways ? 'checked' : ''
                    }
                    aria-describedby="hideClosedDesc"> Hide Closed Giveaways
                  </label>
                  <span id="hideClosedDesc" class="sr-only"
                    >If checked, giveaways that are already closed will be
                    hidden</span
                  >
                </div>
              </div>
            </div>
 
            <!-- Action Buttons -->
            <div style="text-align: right">
              <button id="saveFilterSettings" type="submit">Save</button>
              <button id="closeFilterSettings" type="button">Close</button>
            </div>
          </form>
        </div>
      </div>
 
      <style>
        #alienware-filter-settings {
          display: none;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #1a1a1a;
          padding: 20px;
          border-radius: 8px;
          z-index: 10000;
          min-width: 300px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        #settings-title {
          color: #fff;
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 15px;
        }
        #manualSetTier {
          color: white;
          padding: 2px;
          text-align: center;
        }
        #manualSetTier:disabled {
          color: grey;
        }
        .section-heading {
          color: #00bc8c;
          font-size: 1.1em;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .setting {
          margin-bottom: 10px;
          margin-left: 15px;
        }
        .settingsLabel {
          color: #fff;
          display: block;
          margin-bottom: 5px;
        }
        #saveFilterSettings {
          background: #00bc8c;
          color: #fff;
          border: none;
          padding: 5px 15px;
          border-radius: 4px;
          cursor: pointer;
        }
        #closeFilterSettings {
          background: #e74c3c;
          color: #fff;
          border: none;
          padding: 5px 15px;
          border-radius: 4px;
          margin-left: 10px;
          cursor: pointer;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
      </style>
    `;
 
    // Add menu to page
    document.body.insertAdjacentHTML('beforeend', menuHTML);
 
    // Add event listeners
    document
      .getElementById('saveFilterSettings')
      .addEventListener('click', () => {
        const hideClosedGiveaways = document.getElementById(
          'hideClosedGiveaways',
        ).checked;
        const hideTierRestricted =
          document.getElementById('hideTierRestricted').checked;
        const autoSyncTier = document.getElementById('autoSyncTier').checked;
        const hideOutOfStock =
          document.getElementById('hideOutOfStock').checked;
        const hideClaimed = document.getElementById('hideClaimed').checked;
 
        const newSettings = {
          hideClosedGiveaways,
          hideTierRestricted,
          autoSyncTier,
          hideOutOfStock,
          hideClaimed,
          ...(!autoSyncTier && {
            userTier: document.getElementById('manualSetTier').value,
          }),
        };
        saveSettings(newSettings);
        document.getElementById('alienware-filter-settings').style.display =
          'none';
        location.reload(); // Reload to apply new settings
      });
 
    // Add keyboard event listeners for accessibility
    const modal = document.getElementById('alienware-filter-settings');
 
    document
      .getElementById('closeFilterSettings')
      .addEventListener('click', () => {
        modal.style.display = 'none';
      });
 
    // Handle ESC key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
      }
    });
 
    // Trap focus within modal when it's open
    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll(
          'button, input[type="checkbox"]',
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
 
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
 
  // Function to add settings button to menu
  function addSettingsButton() {
    const menuList = document.querySelector(
      '.nav-item-mus .dropdown-menu.dropdown-menu-end',
    );
    if (menuList) {
      const settingsItem = document.createElement('a');
      settingsItem.className = 'dropdown-item';
      settingsItem.href = '#';
      settingsItem.textContent = 'Filter Settings';
      settingsItem.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('alienware-filter-settings').style.display =
          'block';
      });
      menuList.insertBefore(settingsItem, menuList.lastElementChild);
    }
  }
 
  // Initialize everything based on current page
  const currentPath = window.location.pathname;
 
  // Add settings menu to all pages
  createSettingsMenu();
  addSettingsButton();
 
  const settings = getSettings();
  if (settings.autoSyncTier && currentPath === '/control-center') {
    checkAndStoreTier();
  } else if (currentPath === '/community-giveaways') {
    // Add mutation observer for dynamic content loading
    const observer = new MutationObserver((mutations, obs) => {
      filterGiveaways();
    });
 
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  } else if (currentPath.startsWith('/marketplace')) {
    // Add mutation observer for dynamic content loading
    const observer = new MutationObserver((mutations, obs) => {
      filterMarketplace();
    });
 
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();