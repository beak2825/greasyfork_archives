// ==UserScript==
// @name         Asura Bookmark Manager
// @namespace    Violentmonkey Scripts
// @match        https://asuracomic.net/*
// @grant        none
// @version      4.0
// @icon         https://asuracomic.net/images/logo.webp
// @description  Track your manga reading progress with bookmarks, want-to-read list, and remove titles.
// @author       Moose, GitHub Copilot, GPT
// @downloadURL https://update.greasyfork.org/scripts/541870/Asura%20Bookmark%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/541870/Asura%20Bookmark%20Manager.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Don't run on chapter pages
  if (location.pathname.includes('/chapter/')) {
    return;
  }

  const bookmarkKey = 'asuraManualBookmarks';
  const hideKey = 'asuraManualHidden';
  const wantKey = 'asuraManualWantToRead';
  const completedKey = 'asuraManualCompleted';

  const load = (key) => JSON.parse(localStorage.getItem(key) || '{}');
  const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  let bookmarks = load(bookmarkKey);
  let hidden = load(hideKey);
  let wantToRead = load(wantKey);
  let completed = load(completedKey);

  // --- Default colors (can be customized) ---
  let colors = {
    bookmarked: '#c084fc',     // Purple for bookmarked titles
    wantToRead: '#FFD700',     // Gold for want-to-read titles
    defaultTitle: '#00BFFF',   // Blue for default titles
    completed: '#32CD32',      // Lime green for completed titles
    chapterBookmarked: '#c084fc', // Purple for last read chapter
    chapterUnread: '#1cdf2d',     // Green for unread chapters
    chapterBookmarkedBg: '#45025f', // Darker purple background (series page)
    chapterUnreadBg: '#414101'      // Darker yellow/green background (series page)
  };

  // Load saved colors
  function loadColors() {
    const savedColors = localStorage.getItem('asuraBookmarkColors');
    if (savedColors) {
      colors = { ...colors, ...JSON.parse(savedColors) };
    }
    updateStyles();
  }

  // Save colors
  function saveColors() {
    localStorage.setItem('asuraBookmarkColors', JSON.stringify(colors));
    updateStyles();
  }

  // Update CSS styles with current colors
  function updateStyles() {
    const existingStyle = document.getElementById('asura-dynamic-styles');
    if (existingStyle) existingStyle.remove();

    const dynamicStyle = document.createElement('style');
    dynamicStyle.id = 'asura-dynamic-styles';
    dynamicStyle.textContent = `
      /* CHAPTER HIGHLIGHTING */
      .chapter-bookmarked, a[href*='/chapter/'].chapter-bookmarked {
        color: ${colors.chapterBookmarked} !important; font-weight: bold !important;
      }
      .chapter-unread, a[href*='/chapter/'].chapter-unread {
        color: ${colors.chapterUnread} !important; font-weight: bold !important;
      }

      /* Series page specific highlighting */
      body[data-series-page="true"] .chapter-bookmarked,
      body[data-series-page="true"] a[href*='/chapter/'].chapter-bookmarked {
        background: ${colors.chapterBookmarkedBg} !important;
      }
      body[data-series-page="true"] .chapter-unread,
      body[data-series-page="true"] a[href*='/chapter/'].chapter-unread {
        background: ${colors.chapterUnreadBg} !important;
      }
    `;
    document.head.appendChild(dynamicStyle);
  }

  // --- STYLES ---
  const style = document.createElement('style');
  style.textContent = `
    /* Main panel button */
    .floating-panel-btn {
      position: fixed; top: 5px; right: 5px;
      background-color: #4b0082; color: white;
      padding: 11px 14px; border-radius: 8px;
      z-index: 9999; border: none; cursor: pointer;
    }

    /* Bookmark panel */
    .bookmark-panel {
      position: fixed; top: 60px; right: 40px; width: 630px;
      background: #1a1a1a; color: #fff; border: 1px solid #4b0082;
      border-radius: 10px; padding: 10px; z-index: 9999;
      display: none; max-height: 90vh; overflow: hidden;
      display: flex; flex-direction: column;
    }

    /* Panel tabs */
    .panel-tabs {
      display: flex; gap: 10px; margin-bottom: 10px; justify-content: center;
      position: sticky; top: 0; background: #1a1a1a; z-index: 2;
      padding: 14px 0; border-radius: 10px 10px 0 0;
      box-shadow: 0 4px 16px 0 rgba(0,0,0,0.18);
    }
    .tab-btn {
      flex: 1; padding: 12px 16px; cursor: pointer;
      background: #2a2a2a; text-align: center; border: none;
      color: white; font-weight: bold; border-radius: 10px;
    }
    .tab-btn.active { background: #4b0082; }

    /* Panel content */
    .panel-content {
      display: flex; flex-direction: column; overflow-y: auto;
      max-height: calc(80vh - 100px); padding-top: 0; padding-bottom: 20px;
    }
    .panel-entry {
      display: flex; gap: 10px; margin: 4px 0; padding: 6px;
      background: #2a2a2a; border-radius: 6px; align-items: center;
    }
    .panel-entry img {
      width: 90px; height: 120px; object-fit: cover; border-radius: 4px;
    }
    .panel-entry .info {
      display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1;
    }
    .panel-entry button {
      align-self: flex-start; background: #6a0dad; border: none;
      color: white; border-radius: 4px; padding: 2px 6px;
      font-size: 12px; cursor: pointer; margin-top: 6px;
    }

    /* Action buttons */
    .asura-btn {
      margin-left: 6px; font-size: 14px; cursor: pointer;
      border: none; background: none;
    }

    /* Hidden manga */
    .asura-hidden { display: none !important; }

    /* Settings styles */
    .settings-section {
      margin-bottom: 25px; padding: 15px; background: #2a2a2a; border-radius: 8px;
    }
    .settings-section h4 {
      margin: 0 0 15px 0; color: #c084fc; font-size: 16px;
    }
    .color-input-group {
      display: flex; align-items: center; margin: 10px 0; gap: 10px;
    }
    .color-input-group label {
      min-width: 150px; font-size: 14px;
    }
    .color-input-group input[type="color"] {
      width: 50px; height: 30px; border: none; border-radius: 4px; cursor: pointer;
    }
    .color-input-group input[type="text"] {
      width: 80px; padding: 5px; border: 1px solid #444; border-radius: 4px;
      background: #1a1a1a; color: white; font-family: monospace;
    }
    .settings-tabs {
      display: flex; gap: 5px; margin-bottom: 15px;
    }
    .settings-tab-btn {
      padding: 8px 16px; background: #444; color: white; border: none;
      border-radius: 4px; cursor: pointer; font-size: 12px;
    }
    .settings-tab-btn.active {
      background: #6a0dad;
    }
  `;
  document.head.appendChild(style);

  // --- UTILITIES ---
  function debounce(func, delay = 100) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }

  function extractTitleFromHref(href) {
    const match = href.match(/\/series\/([a-z0-9-]+)/i);
    if (!match) return null;
    let slug = match[1].replace(/-\w{6,}$/, '');
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  // Enhanced getUrlKey with more flexible pattern matching
  function getUrlKey(url) {
    const match = url.match(/\/series\/[^\/]+/);
    if (!match) return url;

    const seriesPath = match[0];
    // More flexible hash pattern - handles various hash lengths
    return seriesPath.replace(/-[a-f0-9]{6,}$/, '');
  }

  // Simplified function to get display title
  function getDisplayTitle(obj) {
    if (obj.displayTitle) return obj.displayTitle;
    if (obj.url) return extractTitleFromHref(obj.url) || obj.title || 'Unknown Title';
    return obj.title || 'Unknown Title';
  }

  // Enhanced function to find matching key using fuzzy title matching (for backwards compatibility)
  function findMatchingKey(searchTitle, dataObject) {
    if (!searchTitle) return null;

    // First try exact URL key match
    const urlKey = getUrlKey(searchTitle);
    if (dataObject[urlKey]) return urlKey;

    // Try with hash patterns too - look for both normalized and hash versions
    for (const key of Object.keys(dataObject)) {
      if (getUrlKey(key) === urlKey) return key;
    }

    // Clean the search title for comparison
    const cleanSearchTitle = searchTitle.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Try to find by title or displayTitle
    for (const [key, obj] of Object.entries(dataObject)) {
      if (!obj) continue;

      // Check displayTitle first
      if (obj.displayTitle) {
        const cleanDisplayTitle = obj.displayTitle.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (cleanDisplayTitle === cleanSearchTitle) return key;
      }

      // Check title
      if (obj.title) {
        const cleanTitle = obj.title.toLowerCase()
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (cleanTitle === cleanSearchTitle) return key;
      }

      // Check if key itself matches (for old title-based keys)
      const cleanKey = key.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleanKey === cleanSearchTitle) return key;
    }

    return null;
  }

  // Enhanced function to find ALL matching keys (including hash variants)
  function findAllMatchingKeys(searchTitle, dataObject) {
    if (!searchTitle) return [];

    const matches = [];
    const urlKey = getUrlKey(searchTitle);

    // Find all keys that normalize to the same URL key
    for (const key of Object.keys(dataObject)) {
      if (getUrlKey(key) === urlKey) {
        matches.push(key);
      }
    }

    // Also check by title matching
    const cleanSearchTitle = searchTitle.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    for (const [key, obj] of Object.entries(dataObject)) {
      if (!obj || matches.includes(key)) continue;

      const objTitle = obj.displayTitle || obj.title || '';
      const cleanObjTitle = objTitle.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanObjTitle === cleanSearchTitle) {
        matches.push(key);
      }
    }

    return matches;
  }

  // --- PANEL RENDERING ---
  function updatePanel(container, tab) {
    container.innerHTML = '';
    let items = [];

    if (tab === 'bookmarks') {
      items = Object.values(bookmarks).sort((a, b) => (b.lastRead || 0) - (a.lastRead || 0));
    } else if (tab === 'want') {
      items = Object.values(wantToRead).reverse();
    } else if (tab === 'completed') {
      items = Object.values(completed).reverse();
    } else if (tab === 'hidden') {
      items = Object.values(hidden);
    }

    items.forEach(obj => {
      const displayTitle = getDisplayTitle(obj);
      const urlKey = getUrlKey(obj.url || '');

      const entry = document.createElement('div');
      entry.className = 'panel-entry';

      const img = document.createElement('img');
      img.src = obj.cover || '';
      entry.appendChild(img);

      const info = document.createElement('div');
      info.className = 'info';

      const link = document.createElement('a');
      link.href = obj.url?.split('/chapter/')[0] || '#';
      link.target = '_blank';
      link.style.color = 'white';
      link.textContent = displayTitle;

      const titleEl = document.createElement('strong');
      titleEl.appendChild(link);

      const chapterEl = document.createElement('div');
      chapterEl.textContent = obj.chapter || '';

      // Add last read date for all tabs
      const lastReadEl = document.createElement('div');
      lastReadEl.style.fontSize = '12px';
      lastReadEl.style.color = '#888';
      lastReadEl.textContent = `Last read: ${obj.lastRead ? new Date(obj.lastRead).toLocaleDateString() : 'Unknown'}`;

      info.appendChild(titleEl);
      info.appendChild(chapterEl);
      info.appendChild(lastReadEl);

      // Panel Buttons
      const btnGroup = document.createElement('span');

      if (tab === 'bookmarks') {
        // Move to Want to Read
        const wantBtn = document.createElement('button');
        wantBtn.className = 'asura-btn';
        wantBtn.textContent = '📙';
        wantBtn.title = 'Move to Want to Read';
        wantBtn.onclick = () => {
          wantToRead[urlKey] = { ...obj, displayTitle, removable: true };
          delete bookmarks[urlKey];
          save(bookmarkKey, bookmarks);
          save(wantKey, wantToRead);
          updatePanel(container, tab);
          updateTitleButtons();
        };
        btnGroup.appendChild(wantBtn);

        // Move to Hidden
        const hideBtn = document.createElement('button');
        hideBtn.className = 'asura-btn';
        hideBtn.textContent = '❌';
        hideBtn.title = 'Move to Hidden';
        hideBtn.onclick = () => {
          hidden[urlKey] = { cover: obj.cover, url: obj.url, displayTitle, removable: true };
          delete bookmarks[urlKey];
          save(bookmarkKey, bookmarks);
          save(hideKey, hidden);
          updatePanel(container, tab);
          updateTitleButtons();
        };
        btnGroup.appendChild(hideBtn);

        // Move to Completed
        const completedBtn = document.createElement('button');
        completedBtn.className = 'asura-btn';
        completedBtn.textContent = '✅';
        completedBtn.title = 'Mark as Completed';
        completedBtn.onclick = () => {
          completed[urlKey] = { ...obj, displayTitle, lastRead: Date.now(), removable: true };
          delete bookmarks[urlKey];
          save(bookmarkKey, bookmarks);
          save(completedKey, completed);
          updatePanel(container, tab);
          updateTitleButtons();
        };
        btnGroup.appendChild(completedBtn);

        // Remove completely - Enhanced to handle all variants
        const removeBtn = document.createElement('button');
        removeBtn.className = 'asura-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.title = 'Remove from all lists';
        removeBtn.style.opacity = obj.removable === false ? '0.5' : '1';
        removeBtn.disabled = obj.removable === false;
        removeBtn.onclick = () => {
          if (obj.removable === false) {
            alert('This item cannot be removed (marked as non-removable)');
            return;
          }

          // Find and remove ALL matching keys
          const allKeys = findAllMatchingKeys(displayTitle, { ...bookmarks, ...wantToRead, ...completed, ...hidden });

          allKeys.forEach(key => {
            delete bookmarks[key];
            delete wantToRead[key];
            delete completed[key];
            delete hidden[key];
          });

          save(bookmarkKey, bookmarks);
          save(wantKey, wantToRead);
          save(completedKey, completed);
          save(hideKey, hidden);
          updatePanel(container, tab);
          updateTitleButtons();
        };
        btnGroup.appendChild(removeBtn);
      }
      // Want to read tab: Remove button only
      else if (tab === 'want') {
        // Remove button - Enhanced to handle all variants
        const removeBtn = document.createElement('button');
        removeBtn.className = 'asura-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.title = 'Remove from all lists';
        removeBtn.style.opacity = obj.removable === false ? '0.5' : '1';
        removeBtn.disabled = obj.removable === false;
        removeBtn.onclick = () => {
          if (obj.removable === false) {
            alert('This item cannot be removed (marked as non-removable)');
            return;
          }

          // Find and remove ALL matching keys
          const allKeys = findAllMatchingKeys(displayTitle, { ...bookmarks, ...wantToRead, ...completed, ...hidden });

          allKeys.forEach(key => {
            delete bookmarks[key];
            delete wantToRead[key];
            delete completed[key];
            delete hidden[key];
          });

          save(bookmarkKey, bookmarks);
          save(wantKey, wantToRead);
          save(completedKey, completed);
          save(hideKey, hidden);
          updatePanel(container, tab);
          updateTitleButtons();
        };
        btnGroup.appendChild(removeBtn);
      }
      // Completed tab: 📌📙❌
      else if (tab === 'completed') {
        // 📌 Move to Bookmarks
        const pinBtn = document.createElement('button');
        pinBtn.className = 'asura-btn';
        pinBtn.textContent = '📌';
        pinBtn.title = 'Move to Bookmarks';
        pinBtn.onclick = () => {
          bookmarks[urlKey] = { ...obj, displayTitle, chapter: obj.chapter || 'Chapter 0' };
          delete completed[urlKey];
          save(bookmarkKey, bookmarks);
          save(completedKey, completed);
          updatePanel(container, tab);
          updateTitleButtons();
        };
        btnGroup.appendChild(pinBtn);

        // 📙 Move to Want to Read
        const wantBtn = document.createElement('button');
        wantBtn.className = 'asura-btn';
        wantBtn.textContent = '📙';
        wantBtn.title = 'Move to Want to Read';
        wantBtn.onclick = () => {
          wantToRead[urlKey] = { ...obj, displayTitle };
          delete completed[urlKey];
          save(wantKey, wantToRead);
          save(completedKey, completed);
          updatePanel(container, tab);
          updateTitleButtons();
        };
        btnGroup.appendChild(wantBtn);

        // ❌ Move to Hidden
        const hideBtn = document.createElement('button');
        hideBtn.className = 'asura-btn';
        hideBtn.textContent = '❌';
        hideBtn.title = 'Move to Hidden';
        hideBtn.onclick = () => {
          hidden[urlKey] = { cover: obj.cover, url: obj.url, displayTitle };
          delete completed[urlKey];
          save(hideKey, hidden);
          save(completedKey, completed);
          updatePanel(container, tab);
          updateTitleButtons();
        };
        btnGroup.appendChild(hideBtn);

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'asura-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.title = 'Remove from all lists';
        removeBtn.style.opacity = obj.removable === false ? '0.5' : '1';
        removeBtn.disabled = obj.removable === false;
        removeBtn.onclick = () => {
          if (obj.removable === false) {
            alert('This item cannot be removed (marked as non-removable)');
            return;
          }

          // Find and remove ALL matching keys
          const allKeys = findAllMatchingKeys(displayTitle, { ...bookmarks, ...wantToRead, ...completed, ...hidden });

          allKeys.forEach(key => {
            delete bookmarks[key];
            delete wantToRead[key];
            delete completed[key];
            delete hidden[key];
          });

          save(bookmarkKey, bookmarks);
          save(wantKey, wantToRead);
          save(completedKey, completed);
          save(hideKey, hidden);
          updatePanel(container, tab);
          updateTitleButtons();
        };
        btnGroup.appendChild(removeBtn);
      }
      // Hidden tab: 📌📙
      else if (tab === 'hidden') {
        // 📌 Move to Bookmarks
        const pinBtn = document.createElement('button');
        pinBtn.className = 'asura-btn';
        pinBtn.textContent = '📌';
        pinBtn.title = 'Move to Bookmarks';
        pinBtn.onclick = () => {
          bookmarks[urlKey] = { ...obj, displayTitle, chapter: obj.chapter || 'Chapter 0' };
          delete hidden[urlKey];
          save(bookmarkKey, bookmarks);
          save(hideKey, hidden);
          updatePanel(container, tab);
          updateTitleButtons();
        };
        btnGroup.appendChild(pinBtn);

        // 📙 Move to Want to Read
        const wantBtn = document.createElement('button');
        wantBtn.className = 'asura-btn';
        wantBtn.textContent = '📙';
        wantBtn.title = 'Move to Want to Read';
        wantBtn.onclick = () => {
          wantToRead[urlKey] = { ...obj, displayTitle };
          delete hidden[urlKey];
          save(wantKey, wantToRead);
          save(hideKey, hidden);
          updatePanel(container, tab);
          updateTitleButtons();
        };
        btnGroup.appendChild(wantBtn);

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'asura-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.title = 'Remove from all lists';
        removeBtn.style.opacity = obj.removable === false ? '0.5' : '1';
        removeBtn.disabled = obj.removable === false;
        removeBtn.onclick = () => {
          if (obj.removable === false) {
            alert('This item cannot be removed (marked as non-removable)');
            return;
          }

          // Find and remove ALL matching keys
          const allKeys = findAllMatchingKeys(displayTitle, { ...bookmarks, ...wantToRead, ...completed, ...hidden });

          allKeys.forEach(key => {
            delete bookmarks[key];
            delete wantToRead[key];
            delete completed[key];
            delete hidden[key];
          });

          save(bookmarkKey, bookmarks);
          save(wantKey, wantToRead);
          save(completedKey, completed);
          save(hideKey, hidden);
          updatePanel(container, tab);
          updateTitleButtons();
        };
        btnGroup.appendChild(removeBtn);
      }
      info.appendChild(btnGroup);
      entry.appendChild(info);
      container.appendChild(entry);
    });
  }

  // --- SETTINGS PANEL ---
  function updateSettingsPanel(container) {
    container.innerHTML = `
      <div style="padding: 20px;">
        <div class="settings-tabs">
          <button class="settings-tab-btn active" data-settings-tab="general">🔧 General</button>
          <button class="settings-tab-btn" data-settings-tab="colors">🎨 Colors</button>
          <button class="settings-tab-btn" data-settings-tab="completed">✅ Completed</button>
          <button class="settings-tab-btn" data-settings-tab="hidden">🚫 Hidden</button>
        </div>
        <div id="settings-content"></div>
      </div>
    `;

    const settingsContent = container.querySelector('#settings-content');
    const settingsTabs = container.querySelectorAll('.settings-tab-btn');
    let currentSettingsTab = 'general';

    function updateSettingsContent(tab) {
      if (tab === 'general') {
        settingsContent.innerHTML = `
          <div class="settings-section">
            <h4>📤 Import/Export Data</h4>
            <button id="export-btn" style="background: #4b0082; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
              📤 Export All Data
            </button>
            <button id="import-btn" style="background: #4b0082; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer;">
              📥 Import Data
            </button>
            <input type="file" id="import-file" accept=".json" style="display: none;">
            <div style="font-size: 12px; color: #888; margin-top: 10px;">
              Export saves all your bookmarks, want-to-read, and hidden lists to a JSON file.<br>
              Import will merge data with existing entries (newer entries take priority).
            </div>
          </div>

          <div class="settings-section">
            <h4>🗑️ Quick Actions</h4>
            <button id="clear-all-btn" style="background: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">
              🗑️ Clear All Data
            </button>
          </div>
        `;

        // Add event listeners for general settings
        document.getElementById('export-btn').onclick = () => {
          const allData = {
            bookmarks: load(bookmarkKey),
            wantToRead: load(wantKey),
            completed: load(completedKey),
            hidden: load(hideKey),
            colors: colors,
            exportDate: new Date().toISOString()
          };

          const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `asura-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
        };

        // Import functionality
        document.getElementById('import-btn').onclick = () => {
          document.getElementById('import-file').click();
        };

        document.getElementById('import-file').onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const importedData = JSON.parse(e.target.result);

              // Merge bookmarks
              if (importedData.bookmarks) {
                const currentBookmarks = load(bookmarkKey);
                Object.assign(currentBookmarks, importedData.bookmarks);
                save(bookmarkKey, currentBookmarks);
              }

              // Merge want-to-read
              if (importedData.wantToRead) {
                const currentWant = load(wantKey);
                Object.assign(currentWant, importedData.wantToRead);
                save(wantKey, currentWant);
              }

              // Merge completed
              if (importedData.completed) {
                const currentCompleted = load(completedKey);
                Object.assign(currentCompleted, importedData.completed);
                save(completedKey, currentCompleted);
              }

              // Merge hidden
              if (importedData.hidden) {
                const currentHidden = load(hideKey);
                Object.assign(currentHidden, importedData.hidden);
                save(hideKey, currentHidden);
              }

              // Reload data
              bookmarks = load(bookmarkKey);
              wantToRead = load(wantKey);
              completed = load(completedKey);
              hidden = load(hideKey);

              alert('Data imported successfully!');
              updateTitleButtons();
            } catch (error) {
              alert('Error importing data: ' + error.message);
            }
          };
          reader.readAsText(file);
        };

        // Clear all functionality
        document.getElementById('clear-all-btn').onclick = () => {
          if (confirm('Are you sure you want to clear ALL bookmark data? This cannot be undone!')) {
            localStorage.removeItem(bookmarkKey);
            localStorage.removeItem(wantKey);
            localStorage.removeItem(completedKey);
            localStorage.removeItem(hideKey);
            bookmarks = {};
            wantToRead = {};
            completed = {};
            hidden = {};
            alert('All data cleared!');
            updateTitleButtons();
          }
        };
      } else if (tab === 'colors') {
        settingsContent.innerHTML = `
          <div class="settings-section">
            <h4>🎨 Title Colors</h4>
            <div class="color-input-group">
              <label>Bookmarked titles:</label>
              <input type="color" id="color-bookmarked" value="${colors.bookmarked}">
              <input type="text" id="text-bookmarked" value="${colors.bookmarked}">
            </div>
            <div class="color-input-group">
              <label>Want to read titles:</label>
              <input type="color" id="color-wantToRead" value="${colors.wantToRead}">
              <input type="text" id="text-wantToRead" value="${colors.wantToRead}">
            </div>
            <div class="color-input-group">
              <label>Completed titles:</label>
              <input type="color" id="color-completed" value="${colors.completed}">
              <input type="text" id="text-completed" value="${colors.completed}">
            </div>
            <div class="color-input-group">
              <label>Default titles:</label>
              <input type="color" id="color-defaultTitle" value="${colors.defaultTitle}">
              <input type="text" id="text-defaultTitle" value="${colors.defaultTitle}">
            </div>
          </div>

          <div class="settings-section">
            <h4>📖 Chapter Colors</h4>
            <div class="color-input-group">
              <label>Last read chapter:</label>
              <input type="color" id="color-chapterBookmarked" value="${colors.chapterBookmarked}">
              <input type="text" id="text-chapterBookmarked" value="${colors.chapterBookmarked}">
            </div>
            <div class="color-input-group">
              <label>Unread chapters:</label>
              <input type="color" id="color-chapterUnread" value="${colors.chapterUnread}">
              <input type="text" id="text-chapterUnread" value="${colors.chapterUnread}">
            </div>
            <div class="color-input-group">
              <label>Last read background:</label>
              <input type="color" id="color-chapterBookmarkedBg" value="${colors.chapterBookmarkedBg}">
              <input type="text" id="text-chapterBookmarkedBg" value="${colors.chapterBookmarkedBg}">
            </div>
            <div class="color-input-group">
              <label>Unread background:</label>
              <input type="color" id="color-chapterUnreadBg" value="${colors.chapterUnreadBg}">
              <input type="text" id="text-chapterUnreadBg" value="${colors.chapterUnreadBg}">
            </div>
          </div>

          <div class="settings-section">
            <button id="apply-colors-btn" style="background: #4b0082; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
              ✅ Apply Colors
            </button>
            <button id="reset-colors-btn" style="background: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">
              🔄 Reset to Default Colors
            </button>
          </div>
        `;

        // Store temporary colors while user is adjusting
        let tempColors = { ...colors };

        // Update only temp colors without applying (no lag)
        Object.keys(colors).forEach(colorKey => {
          const colorInput = document.getElementById(`color-${colorKey}`);
          const textInput = document.getElementById(`text-${colorKey}`);

          if (colorInput && textInput) {
            // Color picker changes text and temp value only
            colorInput.addEventListener('input', (e) => {
              const newColor = e.target.value;
              textInput.value = newColor;
              tempColors[colorKey] = newColor;
            });
            // Text input changes color and temp value only
            textInput.addEventListener('input', (e) => {
              const newColor = e.target.value;
              if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
                colorInput.value = newColor;
                tempColors[colorKey] = newColor;
              }
            });
          }
        });

        // Apply button applies all temp colors at once
        document.getElementById('apply-colors-btn').onclick = () => {
          colors = { ...tempColors };
          saveColors();
          updateTitleButtons();
        };

        document.getElementById('reset-colors-btn').onclick = () => {
          if (confirm('Reset all colors to default values?')) {
            colors = {
              bookmarked: '#c084fc',
              wantToRead: '#FFD700',
              defaultTitle: '#00BFFF',
              completed: '#32CD32',
              chapterBookmarked: '#c084fc',
              chapterUnread: '#1cdf2d',
              chapterBookmarkedBg: '#45025f',
              chapterUnreadBg: '#414101'
            };
            tempColors = { ...colors };
            saveColors();
            updateSettingsContent('colors');
            updateTitleButtons();
          }
        };

      } else if (tab === 'hidden') {
        const hiddenItems = Object.entries(hidden).map(([urlKey, obj]) => ({
          urlKey,
          title: getDisplayTitle(obj),
          chapter: obj.chapter || '',
          url: obj.url || '',
          cover: obj.cover || ''
        }));

        let hiddenHTML = `
          <div class="settings-section">
            <h4>🚫 Hidden Manga (${hiddenItems.length})</h4>
        `;

        if (hiddenItems.length === 0) {
          hiddenHTML += '<p style="color: #888; font-style: italic;">No hidden manga</p>';
        } else {
          hiddenItems.forEach(obj => {
            const displayTitle = obj.title;

            hiddenHTML += `
              <div class="panel-entry">
                <img src="${obj.cover || ''}" alt="">
                <div class="info">
                  <strong>${displayTitle || 'No title'}</strong>
                  <span>
                    <button class="asura-btn" onclick="unhideItem('${obj.urlKey}')" title="Move to Bookmarks">📌</button>
                    <button class="asura-btn" onclick="moveToWant('${obj.urlKey}')" title="Move to Want to Read">📙</button>
                    <button class="asura-btn" onclick="removeItem('${obj.urlKey}')" title="Remove completely">Remove</button>
                  </span>
                </div>
              </div>
            `;
          });
        }

        hiddenHTML += '</div>';
        settingsContent.innerHTML = hiddenHTML;

        // Add global functions for hidden item management
        window.unhideItem = (urlKey) => {
          const obj = hidden[urlKey];
          if (obj) {
            bookmarks[urlKey] = { ...obj, chapter: obj.chapter || 'Chapter 0', lastRead: Date.now() };
            delete hidden[urlKey];
            save(bookmarkKey, bookmarks);
            save(hideKey, hidden);
            updateSettingsContent('hidden');
            updateTitleButtons();
          }
        };

        window.moveToWant = (urlKey) => {
          const obj = hidden[urlKey];
          if (obj) {
            wantToRead[urlKey] = { ...obj };
            delete hidden[urlKey];
            save(wantKey, wantToRead);
            save(hideKey, hidden);
            updateSettingsContent('hidden');
            updateTitleButtons();
          }
        };

        window.removeItem = (urlKey) => {
          delete bookmarks[urlKey];
          delete wantToRead[urlKey];
          delete completed[urlKey];
          delete hidden[urlKey];
          save(bookmarkKey, bookmarks);
          save(wantKey, wantToRead);
          save(completedKey, completed);
          save(hideKey, hidden);
          updateSettingsContent('hidden');
          updateTitleButtons();
        };
      } else if (tab === 'completed') {
        const completedItems = Object.entries(completed).map(([urlKey, obj]) => ({
          urlKey,
          title: getDisplayTitle(obj),
          chapter: obj.chapter || '',
          url: obj.url || '',
          cover: obj.cover || '',
          lastRead: obj.lastRead || 0
        }));

        let completedHTML = `
          <div class="settings-section">
            <h4>✅ Completed Manga (${completedItems.length})</h4>
        `;

        if (completedItems.length === 0) {
          completedHTML += '<p style="color: #888; font-style: italic;">No completed manga</p>';
        } else {
          completedItems.forEach(obj => {
            const displayTitle = obj.title;

            completedHTML += `
              <div class="panel-entry">
                <img src="${obj.cover || ''}" alt="">
                <div class="info">
                  <strong>${displayTitle || 'No title'}</strong>
                  <div>${obj.chapter || ''}</div>
                  <div style="font-size: 12px; color: #888;">Last read: ${obj.lastRead ? new Date(obj.lastRead).toLocaleDateString() : 'Unknown'}</div>
                  <span>
                    <button class="asura-btn" onclick="moveCompletedToBookmarks('${obj.urlKey}')" title="Move to Bookmarks">📌</button>
                    <button class="asura-btn" onclick="moveCompletedToWant('${obj.urlKey}')" title="Move to Want to Read">📙</button>
                    <button class="asura-btn" onclick="moveCompletedToHidden('${obj.urlKey}')" title="Move to Hidden">❌</button>
                    <button class="asura-btn" onclick="removeCompletedItem('${obj.urlKey}')" title="Remove completely">Remove</button>
                  </span>
                </div>
              </div>
            `;
          });
        }

        completedHTML += '</div>';
        settingsContent.innerHTML = completedHTML;

        // Add global functions for completed item management
        window.moveCompletedToBookmarks = (urlKey) => {
          const obj = completed[urlKey];
          if (obj) {
            bookmarks[urlKey] = { ...obj, chapter: obj.chapter || 'Chapter 0', lastRead: Date.now() };
            delete completed[urlKey];
            save(bookmarkKey, bookmarks);
            save(completedKey, completed);
            updateSettingsContent('completed');
            updateTitleButtons();
          }
        };

        window.moveCompletedToWant = (urlKey) => {
          const obj = completed[urlKey];
          if (obj) {
            wantToRead[urlKey] = { ...obj };
            delete completed[urlKey];
            save(wantKey, wantToRead);
            save(completedKey, completed);
            updateSettingsContent('completed');
            updateTitleButtons();
          }
        };

        window.moveCompletedToHidden = (urlKey) => {
          const obj = completed[urlKey];
          if (obj) {
            hidden[urlKey] = { cover: obj.cover, url: obj.url, displayTitle: getDisplayTitle(obj) };
            delete completed[urlKey];
            save(hideKey, hidden);
            save(completedKey, completed);
            updateSettingsContent('completed');
            updateTitleButtons();
          }
        };

        window.removeCompletedItem = (urlKey) => {
          delete bookmarks[urlKey];
          delete wantToRead[urlKey];
          delete completed[urlKey];
          delete hidden[urlKey];
          save(bookmarkKey, bookmarks);
          save(wantKey, wantToRead);
          save(completedKey, completed);
          save(hideKey, hidden);
          updateSettingsContent('completed');
          updateTitleButtons();
        };
      }
    }

    settingsTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        settingsTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentSettingsTab = tab.dataset.settingsTab;
        updateSettingsContent(currentSettingsTab);
      });
    });

    updateSettingsContent(currentSettingsTab);
  }

  // --- UI CREATION ---
  function createUI() {
    const btn = document.createElement('button');
    btn.textContent = '📂 Bookmarks';
    btn.className = 'floating-panel-btn';
    document.body.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'bookmark-panel';
    panel.innerHTML = `
      <div class="panel-tabs">
        <button class="tab-btn active" data-tab="bookmarks">📌 Bookmarks</button>
        <button class="tab-btn" data-tab="want">📙 Want to Read</button>
        <button class="tab-btn" data-tab="settings">⚙️ Settings</button>
      </div>
      <div class="panel-content"></div>
    `;
    document.body.appendChild(panel);

    const contentArea = panel.querySelector('.panel-content');
    let currentTab = 'bookmarks';
    const tabs = panel.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentTab = tab.dataset.tab;
        if (currentTab === 'settings') {
          updateSettingsPanel(contentArea);
        } else {
          updatePanel(contentArea, currentTab);
        }
        updateTabCounts(tabs);
      });
    });
    // Hide the panel by default on page load
    panel.style.display = 'none';
    btn.onclick = () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      if (panel.style.display === 'block') {
        if (currentTab === 'settings') {
          updateSettingsPanel(contentArea);
        } else {
          updatePanel(contentArea, currentTab);
        }
        updateTabCounts(tabs);
      }
    };
    updatePanel(contentArea, currentTab);
    updateTabCounts(tabs);
  }

  // --- TAB COUNT UPDATE ---
  function updateTabCounts(tabs) {
    tabs.forEach(tab => {
      const tabType = tab.dataset.tab;
      let count = 0;
      if (tabType === 'bookmarks') count = Object.keys(bookmarks).length;
      if (tabType === 'hidden') count = Object.keys(hidden).length;
      if (tabType === 'want') count = Object.keys(wantToRead).length;
      if (tabType === 'bookmarks') tab.textContent = `📌 Bookmarks - ${count}`;
      if (tabType === 'hidden') tab.textContent = `🚫 Hidden - ${count}`;
      if (tabType === 'want') tab.textContent = `📙 Want to Read - ${count}`;
      if (tabType === 'settings') tab.textContent = `⚙️ Settings`;
    });
  }

  // --- TITLE BUTTONS ---
  let debouncedUpdateTitleButtons;
  function updateTitleButtons() {
    // --- Existing grid page logic ---
    const cards = document.querySelectorAll('.col-span-9');
    cards.forEach(card => {
      const titleLink = card.querySelector('a[href^="/series/"]');
      if (!titleLink) return;
      const href = titleLink.getAttribute('href');
      const urlKey = getUrlKey(href);
      const title = extractTitleFromHref(href);
      if (!title) return;

      const container = card.closest('.grid-cols-12');
      if (hidden[urlKey]) container?.classList.add('asura-hidden');
      else container?.classList.remove('asura-hidden');
      card.querySelectorAll('.asura-btn-group').forEach(el => el.remove());

      const imgSrc = container?.querySelector('img.rounded-md.object-cover')?.src || '';
      const btnGroup = document.createElement('span');
      btnGroup.className = 'asura-btn-group';

      // Set title color based on status using URL keys
      let titleColorSet = false;

      // First try exact URL key matches
      if (completed[urlKey]) {
        titleLink.style.color = colors.completed;
        titleColorSet = true;
      } else if (wantToRead[urlKey]) {
        const isLocked = wantToRead[urlKey].locked;
        if (isLocked) {
          titleLink.style.color = colors.wantToRead;
        } else {
          titleLink.style.color = colors.defaultTitle;
        }
        titleColorSet = true;
      } else if (bookmarks[urlKey]) {
        titleLink.style.color = colors.bookmarked;
        titleColorSet = true;
      }

      // If not found by URL key, try fallback matching
      if (!titleColorSet) {
        const foundCompletedKey = findMatchingKey(title, completed);
        const foundWantKey = findMatchingKey(title, wantToRead);
        const foundBookmarkKey = findMatchingKey(title, bookmarks);

        if (foundCompletedKey) {
          titleLink.style.color = colors.completed;
        } else if (foundWantKey) {
          const isLocked = wantToRead[foundWantKey].locked;
          if (isLocked) {
            titleLink.style.color = colors.wantToRead;
          } else {
            titleLink.style.color = colors.defaultTitle;
          }
        } else if (foundBookmarkKey) {
          titleLink.style.color = colors.bookmarked;
        } else {
          titleLink.style.color = colors.defaultTitle;
        }
      }

      // Check for buttons based on URL key or fallback
      const isBookmarked = bookmarks[urlKey] || findMatchingKey(title, bookmarks);
      const wantEntry = wantToRead[urlKey] || (findMatchingKey(title, wantToRead) ? wantToRead[findMatchingKey(title, wantToRead)] : null);

      // Bookmarked 📌
      if (isBookmarked) {
        const pinBtn = document.createElement('button');
        pinBtn.className = 'asura-btn';
        pinBtn.textContent = '📌';
        pinBtn.title = 'Marked as read';
        pinBtn.onclick = (e) => {
          e.preventDefault();
          // Remove from both URL key and any found fallback key
          delete bookmarks[urlKey];
          const fallbackKey = findMatchingKey(title, bookmarks);
          if (fallbackKey) delete bookmarks[fallbackKey];

          // Also remove any old hash-based keys for this title
          Object.keys(bookmarks).forEach(key => {
            const bookmarkTitle = bookmarks[key].displayTitle || bookmarks[key].title;
            if (bookmarkTitle && bookmarkTitle.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim() ===
                title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()) {
              delete bookmarks[key];
            }
          });

          save(bookmarkKey, bookmarks);
          setTimeout(updateTitleButtons, 0);
        };
        btnGroup.appendChild(pinBtn);
      } else {
        const isWantLocked = wantEntry && wantEntry.locked;
        // 📙 Move to Want to Read
        const wantBtn = document.createElement('button');
        wantBtn.className = 'asura-btn';
        wantBtn.textContent = '📙';
        wantBtn.title = 'Want to read';
        wantBtn.onclick = (e) => {
          e.preventDefault();
          if (isWantLocked) {
            // Enhanced removal - find and remove ALL matching keys
            const allKeys = findAllMatchingKeys(title, wantToRead);
            allKeys.forEach(key => delete wantToRead[key]);
          } else {
            // Remove from bookmarks if present
            delete bookmarks[urlKey];
            const fallbackBookmarkKey = findMatchingKey(title, bookmarks);
            if (fallbackBookmarkKey) delete bookmarks[fallbackBookmarkKey];

            wantToRead[urlKey] = {
              title: title,
              displayTitle: title,
              chapter: 'Chapter 0',
              url: href,
              cover: imgSrc,
              locked: true,
              removable: true  // New items are removable by default
            };
          }
          save(bookmarkKey, bookmarks);
          save(wantKey, wantToRead);
          setTimeout(updateTitleButtons, 0);
        };
        btnGroup.appendChild(wantBtn);
        if (!isWantLocked) {
          // 📍 Mark as Read
          const markBtn = document.createElement('button');
          markBtn.className = 'asura-btn';
          markBtn.textContent = '📍';
          markBtn.title = 'Mark as read';
          markBtn.onclick = (e) => {
            e.preventDefault();
            // Remove from want to read if present
            delete wantToRead[urlKey];
            const fallbackWantKey = findMatchingKey(title, wantToRead);
            if (fallbackWantKey) delete wantToRead[fallbackWantKey];

            bookmarks[urlKey] = {
              title: title,
              displayTitle: title,
              chapter: 'Chapter 0',
              url: href,
              cover: imgSrc,
              lastRead: Date.now()
            };
            save(bookmarkKey, bookmarks);
            save(wantKey, wantToRead);
            setTimeout(updateTitleButtons, 0);
          };
          btnGroup.appendChild(markBtn);
          // ❌ Hide
          const hideBtn = document.createElement('button');
          hideBtn.className = 'asura-btn';
          hideBtn.textContent = '❌';
          hideBtn.title = 'Hide comic';
          hideBtn.onclick = (e) => {
            e.preventDefault();
            hidden[urlKey] = {
              cover: imgSrc,
              url: href,
              displayTitle: title
            };
            save(hideKey, hidden);
            setTimeout(updateTitleButtons, 0);
          };
          btnGroup.appendChild(hideBtn);
        }
      }
      titleLink.parentElement.appendChild(btnGroup);

      // --- Chapter Highlighting ---
      let bookmarkedChapterRaw = '';
      let bookmarkedNum = null;

      // Try URL key first, then fallback to title matching
      if (bookmarks[urlKey]?.chapter) {
        bookmarkedChapterRaw = bookmarks[urlKey].chapter;
      } else {
        // Fallback: try to find bookmark by title matching
        const fallbackKey = findMatchingKey(title, bookmarks);
        if (fallbackKey && bookmarks[fallbackKey]?.chapter) {
          bookmarkedChapterRaw = bookmarks[fallbackKey].chapter;
        }
      }

      if (bookmarkedChapterRaw) {
        const bookmarkedMatch = bookmarkedChapterRaw.match(/(\d+(?:\.\d+)?)/);
        if (bookmarkedMatch) bookmarkedNum = parseFloat(bookmarkedMatch[1]);
      }

      const chapterLinks = card.querySelectorAll('a[href*="/chapter/"]');
      chapterLinks.forEach(chapLink => {
        // Try to get chapter number from <p> inside the link, then fallback to text, then URL
        let chapterNum = null;
        let chapterText = '';
        const p = chapLink.querySelector('p');
        if (p && p.textContent) {
          chapterText = p.textContent.trim();
        } else {
          // Try to find any text node with a number
          const walker = document.createTreeWalker(chapLink, NodeFilter.SHOW_TEXT, null);
          let node;
          while ((node = walker.nextNode())) {
            if (/\d/.test(node.textContent)) {
              chapterText = node.textContent.trim();
              break;
            }
          }
          if (!chapterText && chapLink.textContent) {
            chapterText = chapLink.textContent.trim();
          }
        }
        chapterText = chapterText.replace(/,/g, '').replace(/\s+/g, ' ');
        let match = chapterText.match(/(\d+(?:\.\d+)?)/);
        if (match) {
          chapterNum = parseFloat(match[1]);
        } else {
          const chapterHref = chapLink.getAttribute('href');
          const urlMatch = chapterHref.match(/chapter\/([\d.]+)/i);
          if (urlMatch) chapterNum = parseFloat(urlMatch[1]);
        }
        chapLink.classList.remove('chapter-bookmarked', 'chapter-unread', 'chapter-read');
        // Debug output
        // console.log('Chapter link:', chapLink, 'chapterNum:', chapterNum, 'bookmarkedNum:', bookmarkedNum);
        if (bookmarkedNum !== null && chapterNum !== null) {
          if (chapterNum === bookmarkedNum) {
            chapLink.classList.add('chapter-bookmarked'); // Purple (last read)
            // console.log('Applied: chapter-bookmarked');
          } else if (chapterNum > bookmarkedNum) {
            chapLink.classList.add('chapter-unread'); // Yellow (unread/new)
            // console.log('Applied: chapter-unread');
          }
        }
        // Save on middle or left click
        const saveClick = () => {
          const urlKey = getUrlKey(chapLink.getAttribute('href'));
          const displayTitle = extractTitleFromHref(chapLink.getAttribute('href')) || title;

          // Clean chapter text - extract only "Chapter X" format
          let cleanChapterText = chapterText;
          const chapterMatch = chapterText.match(/Chapter\s*(\d+(?:\.\d+)?)/i);
          if (chapterMatch) {
            cleanChapterText = `Chapter ${chapterMatch[1]}`;
          }

          // Add to top when saving new chapter progress
          const newBookmarkEntry = {
            ...(bookmarks[urlKey] || {}),
            title: displayTitle,
            displayTitle,
            chapter: cleanChapterText,
            url: chapLink.getAttribute('href'),
            cover: bookmarks[urlKey]?.cover || imgSrc || '',
            lastRead: Date.now()
          };

          delete bookmarks[urlKey];
          bookmarks = { [urlKey]: newBookmarkEntry, ...bookmarks };
          save(bookmarkKey, bookmarks);
          debouncedUpdateTitleButtons();
        };
        chapLink.addEventListener('auxclick', e => { if (e.button === 1) saveClick(); });
        chapLink.addEventListener('click', e => { if (e.button === 0) saveClick(); });
      });
    });

    // --- Simplified /series/ page logic ---
    if (location.pathname.startsWith('/series/')) {
      // Remove any previously injected button group
      const prevBtnGroup = document.querySelector('.asura-series-btn-group');
      if (prevBtnGroup) prevBtnGroup.remove();

      // Find the title element
      let titleHeader =
        document.querySelector('h1, h2, .font-bold.text-3xl, .font-bold.text-2xl, .font-bold.text-xl') ||
        document.querySelector('.text-xl.font-bold');
      if (!titleHeader) {
        const alt = document.querySelector('.text-center.sm\\:text-left .text-xl.font-bold');
        if (alt) titleHeader = alt;
      }
      if (!titleHeader) return;

      // Get URL key for this series page
      const urlKey = getUrlKey(location.pathname);

      // Get title
      let pageTitle = titleHeader.textContent?.trim() || '';

      // If title contains "Chapter", use only the last word (the actual title)
      if (/^Chapter\s+/i.test(pageTitle)) {
        pageTitle = pageTitle.replace(/^Chapter\s+/i, '').trim();
      }
      // If title contains multiple lines, use only the first non-empty line
      if (pageTitle.includes('\n')) {
        pageTitle = pageTitle.split('\n').map(l => l.trim()).filter(Boolean)[0] || pageTitle;
      }
      // Remove any trailing hex if present (for consistency)
      pageTitle = pageTitle.replace(/-\w{6,}$/, '');

      // If we still don't have a good title, extract from URL as fallback
      if (!pageTitle || pageTitle.length < 3) {
        const urlTitle = extractTitleFromHref(location.pathname);
        if (urlTitle) {
          pageTitle = urlTitle;
        }
      }

      // --- Set title color based on status using URL keys ---
      if (completed[urlKey]) {
        titleHeader.style.color = colors.completed;
      } else if (wantToRead[urlKey]) {
        titleHeader.style.color = colors.wantToRead;
      } else if (bookmarks[urlKey]) {
        titleHeader.style.color = colors.bookmarked;
      } else {
        titleHeader.style.color = colors.defaultTitle;
      }

      // --- Chapter highlighting and save ---
      const chapterGroups = document.querySelectorAll('.group.w-full');
      let bookmarkedChapterRaw = '';
      let bookmarkedNum = null;

      // Try URL key first, then fallback to title matching
      if (bookmarks[urlKey]?.chapter) {
        bookmarkedChapterRaw = bookmarks[urlKey].chapter;
      } else {
        // Fallback: try to find bookmark by title matching
        const fallbackKey = findMatchingKey(pageTitle, bookmarks);
        if (fallbackKey && bookmarks[fallbackKey]?.chapter) {
          bookmarkedChapterRaw = bookmarks[fallbackKey].chapter;
        }
      }

      if (bookmarkedChapterRaw) {
        const bookmarkedMatch = bookmarkedChapterRaw.match(/(\d+(?:\.\d+)?)/);
        if (bookmarkedMatch) bookmarkedNum = parseFloat(bookmarkedMatch[1]);
      }

      chapterGroups.forEach(groupDiv => {
        const chapLink = groupDiv.querySelector('a[href*="/chapter/"]');
        if (!chapLink) return;
        let chapterNum = null;
        let chapterText = '';
        // Try to get chapter number from h3
        const h3s = chapLink.querySelectorAll('h3');
        for (const h3 of h3s) {
          const match = h3.textContent.match(/Chapter\s*(\d+(?:\.\d+)?)/i);
          if (match) {
            chapterNum = parseFloat(match[1]);
            // Clean chapter text - only keep "Chapter X" format
            chapterText = `Chapter ${match[1]}`;
            break;
          }
        }
        if (!chapterNum) {
          // fallback: try to extract from href
          const chapterHref = chapLink.getAttribute('href');
          const urlMatch = chapterHref.match(/chapter\/([\d.]+)/i);
          if (urlMatch) chapterNum = parseFloat(urlMatch[1]);
        }
        // Remove old classes
        groupDiv.classList.remove('chapter-bookmarked', 'chapter-unread');
        chapLink.classList.remove('chapter-bookmarked', 'chapter-unread');
        // Apply color classes to the group div and the link
        if (bookmarkedNum !== null && chapterNum !== null) {
          if (chapterNum === bookmarkedNum) {
            groupDiv.classList.add('chapter-bookmarked');
            chapLink.classList.add('chapter-bookmarked');
          } else if (chapterNum > bookmarkedNum) {
            groupDiv.classList.add('chapter-unread');
            chapLink.classList.add('chapter-unread');
          }
        }
        // Save on middle or left click
        const saveClick = () => {
          const urlKey = getUrlKey(location.pathname);
          const displayTitle = extractTitleFromHref(location.pathname) || pageTitle;

          // Remove from wantToRead if present before adding to bookmarks
          if (wantToRead[urlKey]) {
            delete wantToRead[urlKey];
            save(wantKey, wantToRead);
          }

          // Try to get a cover image if missing
          let cover = bookmarks[urlKey]?.cover;
          if (!cover) {
            const posterImg = document.querySelector('img[alt="poster"].rounded.mx-auto.md\\:mx-0') ||
                              document.querySelector('img[alt="poster"].rounded.mx-auto') ||
                              document.querySelector('img[alt="poster"]');
            cover = posterImg?.src || '';
          }

          // Add to top when saving new chapter progress
          const newBookmarkEntry = {
            ...(bookmarks[urlKey] || {}),
            title: displayTitle,
            displayTitle,
            chapter: chapterText,
            url: location.pathname,
            cover,
            lastRead: Date.now()
          };

          delete bookmarks[urlKey];
          bookmarks = { [urlKey]: newBookmarkEntry, ...bookmarks };
          save(bookmarkKey, bookmarks);
          debouncedUpdateTitleButtons();
        };
        chapLink.addEventListener('auxclick', e => { if (e.button === 1) saveClick(); });
        chapLink.addEventListener('click', e => { if (e.button === 0) saveClick(); });
      });
    }
  }
  debouncedUpdateTitleButtons = debounce(updateTitleButtons, 200);

  // --- MIGRATION FUNCTION ---
  // Enhanced migration function with proper duplicate handling
  let migrationCompleted = false;
  function migrateToUrlKeys() {
    if (migrationCompleted) return;

    try {
      let migrated = false;

      // Migrate bookmarks with duplicate consolidation
      const newBookmarks = {};
      const titleTracker = new Map(); // Track by clean title to merge duplicates

      for (const [key, obj] of Object.entries(bookmarks)) {
        if (obj.url && !key.startsWith('/series/')) {
          const urlKey = getUrlKey(obj.url);
          if (urlKey !== key) {
            const cleanTitle = obj.displayTitle || extractTitleFromHref(obj.url) || obj.title;

            // Check if we already have this title
            if (titleTracker.has(cleanTitle)) {
              const existingKey = titleTracker.get(cleanTitle);
              const existing = newBookmarks[existingKey];

              // Keep the entry with newer lastRead
              if ((obj.lastRead || 0) > (existing.lastRead || 0)) {
                delete newBookmarks[existingKey];
                newBookmarks[urlKey] = {
                  ...obj,
                  displayTitle: cleanTitle
                };
                titleTracker.set(cleanTitle, urlKey);
              }
              // If existing is newer, skip this duplicate
            } else {
              newBookmarks[urlKey] = {
                ...obj,
                displayTitle: cleanTitle
              };
              titleTracker.set(cleanTitle, urlKey);
            }
            migrated = true;
          } else {
            const cleanTitle = obj.displayTitle || obj.title;
            if (titleTracker.has(cleanTitle)) {
              const existingKey = titleTracker.get(cleanTitle);
              const existing = newBookmarks[existingKey];

              if ((obj.lastRead || 0) > (existing.lastRead || 0)) {
                delete newBookmarks[existingKey];
                newBookmarks[key] = obj;
                titleTracker.set(cleanTitle, key);
              }
            } else {
              newBookmarks[key] = obj;
              titleTracker.set(cleanTitle, key);
            }
          }
        } else {
          // Handle existing URL-based keys, check for duplicates
          const cleanTitle = obj.displayTitle || obj.title;
          const normalizedKey = getUrlKey(key); // Normalize the key

          if (titleTracker.has(cleanTitle)) {
            const existingKey = titleTracker.get(cleanTitle);
            const existing = newBookmarks[existingKey];

            if ((obj.lastRead || 0) > (existing.lastRead || 0)) {
              delete newBookmarks[existingKey];
              newBookmarks[normalizedKey] = obj;
              titleTracker.set(cleanTitle, normalizedKey);
              migrated = true;
            }
          } else {
            if (normalizedKey !== key) {
              newBookmarks[normalizedKey] = obj;
              migrated = true;
            } else {
              newBookmarks[key] = obj;
            }
            titleTracker.set(cleanTitle, normalizedKey !== key ? normalizedKey : key);
          }
        }
      }

      if (migrated) {
        bookmarks = newBookmarks;
        save(bookmarkKey, bookmarks);
      }

      // Migrate wantToRead
      migrated = false;
      const newWantToRead = {};
      for (const [key, obj] of Object.entries(wantToRead)) {
        if (obj.url && !key.startsWith('/series/')) {
          const urlKey = getUrlKey(obj.url);
          if (urlKey !== key) {
            newWantToRead[urlKey] = {
              ...obj,
              displayTitle: obj.displayTitle || extractTitleFromHref(obj.url) || obj.title
            };
            migrated = true;
          } else {
            newWantToRead[key] = obj;
          }
        } else {
          newWantToRead[key] = obj;
        }
      }
      if (migrated) {
        wantToRead = newWantToRead;
        save(wantKey, wantToRead);
      }

      // Migrate completed
      migrated = false;
      const newCompleted = {};
      for (const [key, obj] of Object.entries(completed)) {
        if (obj.url && !key.startsWith('/series/')) {
          const urlKey = getUrlKey(obj.url);
          if (urlKey !== key) {
            newCompleted[urlKey] = {
              ...obj,
              displayTitle: obj.displayTitle || extractTitleFromHref(obj.url) || obj.title
            };
            migrated = true;
          } else {
            newCompleted[key] = obj;
          }
        } else {
          newCompleted[key] = obj;
        }
      }
      if (migrated) {
        completed = newCompleted;
        save(completedKey, completed);
      }

      // Migrate hidden (special handling since they may not have URLs)
      migrated = false;
      const newHidden = {};
      for (const [key, obj] of Object.entries(hidden)) {
        if (obj.url && !key.startsWith('/series/')) {
          const urlKey = getUrlKey(obj.url);
          if (urlKey !== key) {
            newHidden[urlKey] = {
              ...obj,
              displayTitle: obj.displayTitle || extractTitleFromHref(obj.url) || key
            };
            migrated = true;
          } else {
            newHidden[key] = obj;
          }
        } else if (!key.startsWith('/series/')) {
          // For hidden items without URLs, try to find a matching URL from other data
          let foundUrl = null;
          for (const data of [bookmarks, wantToRead, completed]) {
            for (const [urlKey, dataObj] of Object.entries(data)) {
              if (dataObj.displayTitle === key || dataObj.title === key) {
                foundUrl = dataObj.url || urlKey;
                break;
              }
            }
            if (foundUrl) break;
          }

          if (foundUrl && foundUrl.startsWith('/series/')) {
            const urlKey = getUrlKey(foundUrl);
            newHidden[urlKey] = {
              ...obj,
              url: foundUrl,
              displayTitle: key
            };
            migrated = true;
          } else {
            // Keep as-is if no URL found
            newHidden[key] = obj;
          }
        } else {
          newHidden[key] = obj;
        }
      }
      if (migrated) {
        hidden = newHidden;
        save(hideKey, hidden);
      }
      migrationCompleted = true;
      localStorage.setItem('asuraMigrationCompleted', 'true');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }

  // Add cleanup for global functions
  function cleanupGlobalFunctions() {
    delete window.unhideItem;
    delete window.moveToWant;
    delete window.removeItem;
    delete window.moveCompletedToBookmarks;
    delete window.moveCompletedToWant;
    delete window.moveCompletedToHidden;
    delete window.removeCompletedItem;
  }

  // --- INITIALIZATION ---
  function waitForContent() {
    // Check if migration was already completed
    migrationCompleted = localStorage.getItem('asuraMigrationCompleted') === 'true';

    const observer = new MutationObserver((_, obs) => {
      if (document.querySelector('.grid-cols-12') || location.pathname.startsWith('/series/')) {
        obs.disconnect();

        // Cleanup any existing global functions
        cleanupGlobalFunctions();

        if (location.pathname.startsWith('/series/')) {
          document.body.setAttribute('data-series-page', 'true');
        } else {
          document.body.removeAttribute('data-series-page');
        }
        loadColors();
        migrateToUrlKeys(); // Migrate existing data to URL-based keys

        // Add removable property to existing items that don't have it
        [bookmarks, wantToRead, completed, hidden].forEach(dataSet => {
          Object.values(dataSet).forEach(obj => {
            if (obj.removable === undefined) {
              obj.removable = true; // Default to removable
            }
          });
        });

        // Save the updated data with removable properties
        save(bookmarkKey, bookmarks);
        save(wantKey, wantToRead);
        save(completedKey, completed);
        save(hideKey, hidden);

        createUI();
        updateTitleButtons();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  waitForContent();
})();