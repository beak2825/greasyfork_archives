// ==UserScript==
// @name         Betfred All Games Random + Provider Filter + Random Favorite (No Provider Search)
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Improved random game picker with provider filter, scan, export, favorites, draggable UI, and more for Betfred All Games page. (No provider search box.)
// @author       The Devil
// @match        *://www.betfred.com/*
// @match        *://betfred.com/*
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541458/Betfred%20All%20Games%20Random%20%2B%20Provider%20Filter%20%2B%20Random%20Favorite%20%28No%20Provider%20Search%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541458/Betfred%20All%20Games%20Random%20%2B%20Provider%20Filter%20%2B%20Random%20Favorite%20%28No%20Provider%20Search%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- State ---
  const state = {
    playedGames: {},
    providerData: {},
    playAgainFeedback: {},
    scanProgress: { index: 0, completed: false },
    selectedProvider: '',
    initialized: false,
    scanning: false,
    scanCancelRequested: false,
    addOptionsButtonScheduled: false,
    container: null,
    optionsPanel: null,
    randomBtn: null,
    randomFavoriteBtn: null,
    providerFilterSelect: null,
    scanBtn: null,
    resetBtn: null,
    cancelScanBtn: null,
    scanToggleBtn: null,
    scanButtonsContainer: null,
    scanProgressText: null,
    gameListObserver: null,
    allGamesLinkObserver: null,
    drag: { active: false, offsetX: 0, offsetY: 0 },
    panelPosition: { left: null, top: null }
  };

  // --- Constants and Selectors ---
  const GAME_LINK_SELECTOR = 'a._19pd3t9s[href^="/games/play/"]';
  const INFO_BTN_SELECTOR = 'img._zdxht7[alt="More Info"]';
  const CLOSE_OVERLAY_SELECTOR = 'span._1ye7m8b[data-actionable][role="button"]';
  const PLAYED_GAMES_KEY = 'betfred_played_games';
  const MAPPING_KEY = 'betfred_game_to_provider';
  const YES_NO_MAYBE_KEY = 'betfred_play_again_feedback';
  const SCAN_PROGRESS_KEY = 'betfred_scan_progress';
  const PANEL_POSITION_KEY = 'betfred_panel_position';

  // --- Provider Aliases ---
  const providerAliases = {
    '1x2 Gaming': '1x2 Gaming', '4ThePlayer': '4ThePlayer', 'AGS': 'AGS',
    'Alchemy Games': 'Alchemy Gaming', 'Alchemy Gaming': 'Alchemy Gaming',
    'All For One Studios': 'All For One Studios', 'Area Vegas': 'Area Vegas',
    'Aurum Signature Studios': 'Aurum Signature Studios',
    'BTG': 'Big Time Gaming', 'Bang Bang': 'Bang Bang', 'Big Time Gaming': 'Big Time Gaming',
    'Blue Ring Studios': 'Blue Ring Studios', 'Blueprint': 'Blueprint',
    'Boomerang': 'Boomerang', 'Buck Stakes Entertainment': 'Buck Stakes Entertainment',
    'BulletProof': 'BulletProof', 'Bulletproof': 'BulletProof',
    'Chance Interactive': 'Chance Interactive', 'Circular Arrow': 'Circular Arrow',
    'Coin Machine Gaming': 'Coin Machine Gaming',
    'Crazy Tooth Studio': 'Crazy Tooth Studios', 'Crazy Tooth Studios': 'Crazy Tooth Studios',
    'DWG': 'DWG', 'ELK Studio': 'ELK Studios', 'ELK Studios': 'ELK Studios',
    'Fortune Factory': 'Fortune Factory Studios', 'Fortune Factory Studios': 'Fortune Factory Studios',
    'Foxium Studios': 'Foxium Studios', 'G Games': 'G Games', 'G Gaming': 'G Games',
    'Game Evolution': 'Game Evolution', 'GameBurger Studios': 'Gameburger Studios', 'Gameburger Studios': 'Gameburger Studios',
    'Games Global': 'Games Global', 'Gold Coin Studios': 'Gold Coin Studios',
    'Golden Rock Studios': 'Golden Rock Studios', 'Hacksaw Gaming': 'Hacksaw Gaming',
    'Hammertime Games': 'Hammertime Games', 'High Limit Studio': 'High Limit Studio',
    'Hungry Bear Gaming': 'Hungry Bear Gaming', 'IGT': 'IGT', 'INO Games': 'INO Games',
    'Infinity Dragon': 'Infinity Dragon Studios', 'Infinity Dragon Studios': 'Infinity Dragon Studios',
    'Inspired': 'Inspired', 'Jelly': 'Jelly', 'Just For The Win': 'Just For The Win',
    'Light & Wonder': 'Light & Wonder', 'Lightning Box': 'Lightning Box',
    'NYX - Pragmatic': 'Pragmatic Play', 'Nailed It Games': 'Nailed It! Games',
    'Nailed It! Games': 'Nailed It! Games', 'Nailed it! Games': 'Nailed It! Games',
    'Neon Valley Studios': 'Neon Valley Studios', 'NetEnt': 'NetEnt', 'Netent': 'NetEnt',
    'NoLimit City': 'NoLimit City', 'Nolimit City': 'NoLimit City',
    'Northern Lights': 'Northern Lights Gaming', 'Northern Lights Gaming': 'Northern Lights Gaming',
    'Old Skool Studios': 'Old Skool Studios', 'Oros Gaming': 'Oros Gaming',
    'Pear Fiction Studios': 'Pear Fiction Studios', 'Peter & Sons': 'Peter & Sons',
    "Play'n Go": "Play'n Go", 'Playtech': 'Playtech',
    'Pragmatic': 'Pragmatic Play', 'Pragmatic Play': 'Pragmatic Play',
    'Prospect Gaming': 'Prospect Gaming', 'Realistic': 'Realistic',
    'Red TIger': 'Red Tiger', 'Red Tiger': 'Red Tiger', 'RedTiger': 'Red Tiger',
    'Reel Paly': 'Reel Play', 'Reel Play': 'Reel Play', 'ReelPlay': 'Reel Play',
    'Reflex Gaming': 'Reflex Gaming', 'Scientific Games': 'Scientific Games',
    'Slingshot Studios': 'Slingshot Studios', 'Snowborn Games': 'Snowborn Studios',
    'Snowborn Studios': 'Snowborn Studios', 'Spin On': 'Spin Play Games',
    'Spin Play Games': 'Spin Play Games', 'SpinPlay Games': 'Spin Play Games',
    'Stormcraft Studios': 'Stormcraft Studios', 'Switch Studios': 'Switch Studios',
    'Thunderkick': 'Thunderkick', 'Triple Edge Studios': 'Triple Edge Studios',
    'Wishbone Games': 'Wishbone Games', 'Wizard Games': 'Wizard Games',
    'Yggdrasil': 'Yggdrasil', 'iSoftBet': 'iSoftBet', 'Unknown': 'Unknown'
  };

  // --- Utility Functions ---
  function normalizeProvider(name) {
    return providerAliases[name.trim()] || name.trim();
  }
  function prettifyTitle(title) {
    return title
      .replace(/[_\-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/(\D)(\d)/g, '$1 $2')
      .replace(/(\d)([A-Za-z])/g, '$1 $2')
      .replace(/\b(\d+)k\b/gi, (_, num) => `${num}K`)
      .replace(/\b(\d{4,})\b/g, n => Number(n).toLocaleString())
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const interval = 100;
      let elapsed = 0;
      const check = () => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        elapsed += interval;
        if (elapsed >= timeout) reject(`Element ${selector} not found`);
        else setTimeout(check, interval);
      };
      check();
    });
  }
  function getAllGameElements() {
    return [...document.querySelectorAll(GAME_LINK_SELECTOR)].map(a => a.closest('div')).filter(Boolean);
  }
  function getGamePath(href) {
    try {
      return new URL(href, location.origin).pathname;
    } catch {
      return '';
    }
  }
  function saveData() {
    localStorage.setItem(PLAYED_GAMES_KEY, JSON.stringify(state.playedGames));
    localStorage.setItem(MAPPING_KEY, JSON.stringify(state.providerData));
    localStorage.setItem(YES_NO_MAYBE_KEY, JSON.stringify(state.playAgainFeedback));
    localStorage.setItem(SCAN_PROGRESS_KEY, JSON.stringify(state.scanProgress));
    localStorage.setItem(PANEL_POSITION_KEY, JSON.stringify(state.panelPosition));
  }
  function loadData() {
    state.playedGames = JSON.parse(localStorage.getItem(PLAYED_GAMES_KEY) || '{}');
    state.providerData = JSON.parse(localStorage.getItem(MAPPING_KEY) || '{}');
    state.playAgainFeedback = JSON.parse(localStorage.getItem(YES_NO_MAYBE_KEY) || '{}');
    state.scanProgress = JSON.parse(localStorage.getItem(SCAN_PROGRESS_KEY) || '{"index":0,"completed":false}');
    state.panelPosition = JSON.parse(localStorage.getItem(PANEL_POSITION_KEY) || '{}');
  }
  function getMissedGames() {
    const allVisibleGames = getAllGameElements().filter(div => div.style.display !== 'none');
    const missed = [];
    allVisibleGames.forEach(div => {
      const link = div.querySelector(GAME_LINK_SELECTOR);
      if (!link) return;
      const path = getGamePath(link.href);
      if (!(path in state.providerData)) {
        missed.push(path);
      }
    });
    return missed;
  }

  // --- SPA URL Change Detection ---
  function onSPAUrlChange(callback) {
    let lastUrl = location.href;
    const pushState = history.pushState;
    history.pushState = function () {
      pushState.apply(this, arguments);
      callback(location.href);
    };
    const replaceState = history.replaceState;
    history.replaceState = function () {
      replaceState.apply(this, arguments);
      callback(location.href);
    };
    window.addEventListener('popstate', () => {
      callback(location.href);
    });
    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        callback(location.href);
      }
    }, 300);
  }

  // --- UI Creation & Management ---
  function styleButton(btn, bgColor, hoverColor) {
    btn.style.backgroundColor = bgColor;
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.padding = '8px 14px';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = 'bold';
    btn.style.fontSize = '14px';
    btn.style.transition = 'background-color 0.3s ease';
    btn.onmouseenter = () => { btn.style.backgroundColor = hoverColor; };
    btn.onmouseleave = () => { btn.style.backgroundColor = bgColor; };
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('role', 'button');
  }

  function createOptionsPanel() {
    // Panel
    state.optionsPanel = document.createElement('div');
    state.optionsPanel.setAttribute('role', 'dialog');
    state.optionsPanel.setAttribute('aria-label', 'Game Options');
    state.optionsPanel.style.position = 'absolute';
    state.optionsPanel.style.backgroundColor = '#0a5bab';
    state.optionsPanel.style.color = '#fff';
    state.optionsPanel.style.padding = '10px';
    state.optionsPanel.style.borderRadius = '5px';
    state.optionsPanel.style.display = 'none';
    state.optionsPanel.style.zIndex = '10000';
    state.optionsPanel.style.width = '350px';
    state.optionsPanel.style.fontFamily = 'Arial, sans-serif';
    state.optionsPanel.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    state.optionsPanel.style.userSelect = 'none';
    state.optionsPanel.style.cursor = 'move';

    // --- Draggable Panel ---
    state.optionsPanel.addEventListener('mousedown', function(e) {
      if (e.target !== state.optionsPanel) return;
      state.drag.active = true;
      state.drag.offsetX = e.clientX - state.optionsPanel.offsetLeft;
      state.drag.offsetY = e.clientY - state.optionsPanel.offsetTop;
    });
    document.addEventListener('mousemove', function(e) {
      if (!state.drag.active) return;
      state.optionsPanel.style.left = (e.clientX - state.drag.offsetX) + 'px';
      state.optionsPanel.style.top = (e.clientY - state.drag.offsetY) + 'px';
      // Save position
      state.panelPosition.left = state.optionsPanel.style.left;
      state.panelPosition.top = state.optionsPanel.style.top;
      saveData();
    });
    document.addEventListener('mouseup', function() {
      state.drag.active = false;
    });

    // --- Provider filter dropdown (NO SEARCH) ---
    state.providerFilterSelect = document.createElement('select');
    state.providerFilterSelect.style.width = '100%';
    state.providerFilterSelect.style.margin = '4px 0 15px 0';
    state.providerFilterSelect.style.padding = '6px';
    state.providerFilterSelect.style.borderRadius = '3px';
    state.providerFilterSelect.style.fontSize = '14px';
    state.providerFilterSelect.style.cursor = 'pointer';
    state.providerFilterSelect.style.color = '#000';
    state.providerFilterSelect.setAttribute('aria-label', 'Select Provider');
    state.providerFilterSelect.onchange = () => {
      state.selectedProvider = state.providerFilterSelect.value;
      filterGamesByProvider();
      updateRandomButtonText();
      updateScanButtonText();
    };
    state.optionsPanel.appendChild(state.providerFilterSelect);

    // --- Random Game Button ---
    state.randomBtn = document.createElement('button');
    state.randomBtn.style.width = '100%';
    state.randomBtn.style.marginBottom = '8px';
    styleButton(state.randomBtn, '#1877f2', '#005bb5');
    state.randomBtn.onclick = pickRandomGame;
    state.optionsPanel.appendChild(state.randomBtn);

    // --- Random Favorite Button ---
    state.randomFavoriteBtn = document.createElement('button');
    state.randomFavoriteBtn.style.width = '100%';
    state.randomFavoriteBtn.style.marginBottom = '10px';
    styleButton(state.randomFavoriteBtn, '#28a745', '#1e7e34');
    state.randomFavoriteBtn.onclick = pickRandomFavoriteGame;
    state.optionsPanel.appendChild(state.randomFavoriteBtn);

    // --- Export Button ---
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Game List (.txt)';
    styleButton(exportBtn, '#17a2b8', '#117a8b');
    exportBtn.onclick = exportGameList;
    exportBtn.style.width = '100%';
    exportBtn.style.marginBottom = '10px';
    state.optionsPanel.appendChild(exportBtn);

    // --- Scan/Reset Buttons Container ---
    state.scanButtonsContainer = document.createElement('div');
    state.scanButtonsContainer.style.display = 'none';
    state.scanButtonsContainer.style.justifyContent = 'space-between';
    state.scanButtonsContainer.style.gap = '10px';
    state.scanButtonsContainer.style.marginBottom = '10px';

    // Scan Button
    state.scanBtn = document.createElement('button');
    styleButton(state.scanBtn, '#e03e2f', '#b52a1f');
    state.scanBtn.style.flexGrow = '1';
    state.scanBtn.onclick = () => {
      if (state.scanning) return;
      state.scanCancelRequested = false;
      scanProviders(false);
    };
    state.scanButtonsContainer.appendChild(state.scanBtn);

    // Cancel Scan Button
    state.cancelScanBtn = document.createElement('button');
    state.cancelScanBtn.textContent = 'Cancel';
    styleButton(state.cancelScanBtn, '#555', '#333');
    state.cancelScanBtn.style.flexGrow = '1';
    state.cancelScanBtn.style.display = 'none';
    state.cancelScanBtn.onclick = () => {
      state.scanCancelRequested = true;
    };
    state.scanButtonsContainer.appendChild(state.cancelScanBtn);

    // Reset Button
    state.resetBtn = document.createElement('button');
    state.resetBtn.textContent = 'Reset Data';
    state.resetBtn.style.flexGrow = '1';
    styleButton(state.resetBtn, '#888', '#555');
    state.resetBtn.onclick = () => {
      showResetOptionsPrompt();
    };
    state.scanButtonsContainer.appendChild(state.resetBtn);

    state.optionsPanel.appendChild(state.scanButtonsContainer);

    // --- Scan Progress Text ---
    state.scanProgressText = document.createElement('div');
    state.scanProgressText.style.color = '#fff';
    state.scanProgressText.style.fontSize = '14px';
    state.scanProgressText.style.marginBottom = '8px';
    state.scanProgressText.textContent = '';
    state.optionsPanel.appendChild(state.scanProgressText);

    // --- Toggle Arrow for Scan/Reset ---
    const scanToggleContainer = document.createElement('div');
    scanToggleContainer.style.width = '100%';
    scanToggleContainer.style.display = 'flex';
    scanToggleContainer.style.justifyContent = 'center';
    scanToggleContainer.style.marginBottom = '10px';
    state.scanToggleBtn = document.createElement('span');
    state.scanToggleBtn.textContent = '▼';
    state.scanToggleBtn.style.cursor = 'pointer';
    state.scanToggleBtn.style.color = '#fff';
    state.scanToggleBtn.title = 'Show/Hide Scan Options';
    state.scanToggleBtn.onclick = () => {
      if (state.scanButtonsContainer.style.display === 'none') {
        state.scanButtonsContainer.style.display = 'flex';
        state.scanToggleBtn.textContent = '▲';
      } else {
        state.scanButtonsContainer.style.display = 'none';
        state.scanToggleBtn.textContent = '▼';
      }
    };
    scanToggleContainer.appendChild(state.scanToggleBtn);
    state.optionsPanel.insertBefore(scanToggleContainer, state.scanButtonsContainer);

    document.body.appendChild(state.optionsPanel);

    // Panel keyboard navigation: ESC to close
    state.optionsPanel.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') state.optionsPanel.style.display = 'none';
    });

    positionOptionsPanel();
  }

  function positionOptionsPanel() {
    // Use saved position if available
    if (state.panelPosition.left && state.panelPosition.top) {
      state.optionsPanel.style.left = state.panelPosition.left;
      state.optionsPanel.style.top = state.panelPosition.top;
      return;
    }
    // Otherwise, position relative to All Games link
    const allGamesLink = document.querySelector('a._1rwiby3._mdg8s6x[href="/games/category/all-games"]');
    if (!allGamesLink || !state.optionsPanel) return;
    const rect = allGamesLink.getBoundingClientRect();
    state.optionsPanel.style.position = 'absolute';
    state.optionsPanel.style.top = `${rect.bottom + window.scrollY + 5}px`;
    state.optionsPanel.style.left = `${rect.left + window.scrollX}px`;
  }

  async function addOptionsButton() {
    if (state.addOptionsButtonScheduled) return;
    state.addOptionsButtonScheduled = true;
    const allGamesLink = await waitForElement('a._1rwiby3._mdg8s6x[href="/games/category/all-games"]', 15000);
    if (!allGamesLink) return;
    if (state.container) {
      state.container.style.display = 'inline-block';
      return;
    }
    state.container = document.createElement('a');
    state.container.textContent = 'Options';
    state.container.title = 'Open Game Options';
    state.container.href = 'javascript:void(0)';
    state.container.className = allGamesLink.className;
    state.container.style.marginLeft = '8px';
    state.container.onclick = (e) => {
      e.preventDefault();
      if (state.optionsPanel) {
        state.optionsPanel.style.display = state.optionsPanel.style.display === 'block' ? 'none' : 'block';
        if (state.optionsPanel.style.display === 'block') {
          state.optionsPanel.focus();
        }
      }
      positionOptionsPanel();
    };
    allGamesLink.parentElement.appendChild(state.container);
    positionOptionsPanel();
  }

  function updateRandomButtonText() {
    const diceSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="vertical-align: middle;">
      <rect width="16" height="16" rx="3" ry="3" fill="#f2f2f2" stroke="#444" stroke-width="1"/>
      <circle cx="4" cy="4" r="1.2" fill="#444"/>
      <circle cx="8" cy="8" r="1.2" fill="#444"/>
      <circle cx="12" cy="12" r="1.2" fill="#444"/>
    </svg>`;
    const starSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gold" viewBox="0 0 16 16" style="vertical-align: middle;">
      <path d="M8 12.146l3.717 2.184-1-4.147 3.184-2.767-4.262-.358L8 3.5 6.361 7.058l-4.262.358 3.184 2.767-1 4.147z"/>
    </svg>`;
    const allVisibleGames = getAllGameElements().filter(div => div.style.display !== 'none');
    let filteredGames = allVisibleGames;
    if (state.selectedProvider) {
      filteredGames = allVisibleGames.filter(div => {
        const link = div.querySelector(GAME_LINK_SELECTOR);
        if (!link) return false;
        const path = getGamePath(link.href);
        const prov = state.providerData[path]?.provider;
        return prov === state.selectedProvider;
      });
    }
    const count = filteredGames.length;
    if (state.randomBtn) state.randomBtn.innerHTML = `${diceSVG} <span style="margin: 0 6px; vertical-align: middle;">Random Game${state.selectedProvider ? ' (' + state.selectedProvider + ')' : ''} (${count})</span> ${diceSVG}`;
    let favoriteGames = Object.entries(state.playAgainFeedback)
      .filter(([path, feedback]) => feedback === 'yes')
      .filter(([path]) => {
        if (!state.selectedProvider) return true;
        return state.providerData[path]?.provider === state.selectedProvider;
      });
    if (state.randomFavoriteBtn) state.randomFavoriteBtn.innerHTML = `${starSVG} <span style="margin: 0 6px; vertical-align: middle;">Random Favs${state.selectedProvider ? ' (' + state.selectedProvider + ')' : ''} (${favoriteGames.length})</span> ${starSVG}`;
  }

  function updateScanButtonText() {
    if (!state.scanBtn) return;
    const totalVisible = getAllGameElements().filter(div => div.style.display !== 'none').length;
    const totalKnown = Object.keys(state.providerData).length;
    const mismatchTolerance = 10;
    if (state.scanning) {
      state.scanBtn.textContent = 'Scanning...';
      state.scanBtn.disabled = true;
      state.scanBtn.style.opacity = '0.6';
      state.scanBtn.style.cursor = 'default';
      return;
    }
    if (!state.scanProgress.completed) {
      state.scanBtn.textContent = 'Resume Scan';
      state.scanBtn.disabled = false;
      state.scanBtn.style.opacity = '1';
      state.scanBtn.style.cursor = '';
    } else if (totalVisible === 0) {
      state.scanBtn.textContent = 'Scan (No Games)';
      state.scanBtn.disabled = true;
      state.scanBtn.style.opacity = '0.6';
      state.scanBtn.style.cursor = 'default';
    } else if (totalVisible - totalKnown > mismatchTolerance) {
      state.scanBtn.textContent = 'Scan (Update Required)';
      state.scanBtn.disabled = false;
      state.scanBtn.style.opacity = '1';
      state.scanBtn.style.cursor = '';
    } else {
      state.scanBtn.textContent = 'Up to Date';
      state.scanBtn.disabled = true;
      state.scanBtn.style.opacity = '0.6';
      state.scanBtn.style.cursor = 'default';
    }
  }

  function filterGamesByProvider() {
    const games = getAllGameElements();
    games.forEach(div => {
      const link = div.querySelector(GAME_LINK_SELECTOR);
      if (!link) {
        div.style.display = 'none';
        return;
      }
      const path = getGamePath(link.href);
      if (!state.selectedProvider) {
        div.style.display = '';
      } else {
        const provider = state.providerData[path]?.provider;
        div.style.display = provider === state.selectedProvider ? '' : 'none';
      }
    });
    updateProviderDropdownCounts();
  }

  function updateProviderDropdownCounts() {
    if (!state.providerFilterSelect) return;
    const allGames = getAllGameElements();
    // Count games per provider
    const counts = {};
    allGames.forEach(div => {
      const link = div.querySelector(GAME_LINK_SELECTOR);
      if (!link) return;
      const path = getGamePath(link.href);
      const provider = state.providerData[path]?.provider;
      if (!provider) return;
      counts[provider] = (counts[provider] || 0) + 1;
    });
    // Update option text with counts
    [...state.providerFilterSelect.options].forEach(opt => {
      if (!opt.value) {
        // default option
        const totalCount = allGames.length;
        opt.textContent = `All Providers (${totalCount})`;
      } else {
        opt.textContent = `${opt.value} (${counts[opt.value] || 0})`;
      }
    });
  }

  function updateProviderDropdown() {
    // Remove all options
    while (state.providerFilterSelect.options.length) state.providerFilterSelect.remove(0);
    // Default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = `All Providers (${getAllGameElements().length})`;
    state.providerFilterSelect.appendChild(defaultOption);
    // All unique providers sorted
    const uniqueProviders = [...new Set(Object.values(state.providerData).map(d => d.provider))].sort((a, b) => a.localeCompare(b));
    uniqueProviders.forEach(provider => {
      const option = document.createElement('option');
      option.value = provider;
      option.textContent = provider + ' (0)';
      state.providerFilterSelect.appendChild(option);
    });
    updateProviderDropdownCounts();
  }

  // --- Export ---
  function exportGameList() {
    const selectedProvider = state.providerFilterSelect?.value || '';
    const allGameDivs = getAllGameElements();
    const lines = [];
    allGameDivs.forEach(div => {
      const link = div.querySelector(GAME_LINK_SELECTOR);
      if (!link) return;
      const path = getGamePath(link.href);
      const data = state.providerData[path];
      if (selectedProvider && selectedProvider !== 'All Providers') {
        if (!data || normalizeProvider(data.provider) !== selectedProvider) return;
      }
      const title = data?.title || prettifyTitle(div.textContent.trim()) || 'Unknown Title';
      const provider = data?.provider || 'Unknown';
      lines.push(`${title} (${provider})`);
    });
    if (lines.length === 0) {
      alert('No games found to export.');
      return;
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedProvider && selectedProvider !== 'All Providers'
      ? `games-${selectedProvider}.txt`
      : 'all-games.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- Scan Providers ---
  async function scanProviders(fullScan = false) {
    if (state.scanning) return;
    state.scanning = true;
    state.scanCancelRequested = false;
    if (fullScan) {
      state.scanProgress.index = 0;
      state.providerData = {};
      state.scanProgress.completed = false;
      saveData();
    }
    if (state.scanBtn) state.scanBtn.style.display = 'none';
    if (state.cancelScanBtn) state.cancelScanBtn.style.display = '';
    if (state.scanProgressText) state.scanProgressText.textContent = 'Starting scan...';
    try {
      const gameDivs = getAllGameElements();
      const total = gameDivs.length;
      for (let i = state.scanProgress.index || 0; i < total; i++) {
        const gameDiv = gameDivs[i];
        const gameLink = gameDiv.querySelector(GAME_LINK_SELECTOR);
        const path = gameLink ? getGamePath(gameLink.href) : null;
        if (!fullScan && path && state.providerData[path]) continue;
        if (state.scanCancelRequested) {
          state.scanProgress.index = i;
          state.scanProgress.completed = false;
          saveData();
          if (state.scanProgressText) state.scanProgressText.textContent = 'Scan cancelled.';
          state.scanning = false;
          if (state.scanBtn) state.scanBtn.style.display = '';
          if (state.cancelScanBtn) state.cancelScanBtn.style.display = 'none';
          return;
        }
        const infoBtn = gameDiv.querySelector(INFO_BTN_SELECTOR);
        if (!infoBtn) {
          if (state.scanProgressText) state.scanProgressText.textContent = `Skipping game ${i + 1} (no info icon)`;
          await wait(200);
          continue;
        }
        if (state.scanProgressText) state.scanProgressText.textContent = `Scanning game ${i + 1} / ${total}...`;
        infoBtn.click();
        try {
          const titleEl = await waitForElement('h4._1dujhhk', 5000);
          await wait(80);
          let providerName = '';
          const lis = [...document.querySelectorAll('li')];
          for (const li of lis) {
            const text = li.textContent.trim();
            if (text.startsWith('Game Provider -')) {
              providerName = text.replace('Game Provider -', '').trim();
              break;
            } else if (text.startsWith('Provider -')) {
              providerName = text.replace('Provider -', '').trim();
              break;
            } else if (text.startsWith('Games Provider -')) {
              providerName = text.replace('Games Provider -', '').trim();
              break;
            }
          }
          if (!providerName) providerName = 'Unknown';
          if (providerName && gameLink && path) {
            const normalized = normalizeProvider(providerName);
            const gameTitle = titleEl ? titleEl.textContent.trim() : '';
            state.providerData[path] = { provider: normalized, title: gameTitle };
          }
        } catch {
          // Timeout or missing elements, skip
        }
        const closeBtn = document.querySelector(CLOSE_OVERLAY_SELECTOR);
        if (closeBtn) closeBtn.click();
        await wait(80);
        state.scanProgress.index = i + 1;
        saveData();
      }
      const missedGames = getMissedGames();
      if (missedGames.length > 0) {
        if (state.scanProgressText) state.scanProgressText.textContent = `Scan completed but missed ${missedGames.length} games. Consider rescanning.`;
        state.scanProgress.completed = false;
      } else {
        state.scanProgress.completed = true;
      }
      state.scanProgress.index = 0;
      saveData();
      if (state.scanProgressText) state.scanProgressText.textContent = 'Scan completed. Refresh page.';
      updateProviderDropdown();
      filterGamesByProvider();
      updateRandomButtonText();
      updateScanButtonText();
    } catch (e) {
      if (state.scanProgressText) state.scanProgressText.textContent = 'Scan error: ' + (e.message || e);
    } finally {
      state.scanning = false;
      if (state.scanBtn) state.scanBtn.style.display = '';
      if (state.cancelScanBtn) state.cancelScanBtn.style.display = 'none';
      updateScanButtonText();
    }
  }

  // --- Reset Data ---
  function showResetOptionsPrompt() {
    if (document.getElementById('resetOptionsPrompt')) return;
    const overlay = document.createElement('div');
    overlay.id = 'resetOptionsPrompt';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    overlay.style.zIndex = '20000';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.setAttribute('role', 'dialog');
    const panel = document.createElement('div');
    panel.style.backgroundColor = '#333';
    panel.style.color = '#fff';
    panel.style.padding = '20px 30px';
    panel.style.borderRadius = '8px';
    panel.style.textAlign = 'center';
    panel.style.maxWidth = '400px';
    panel.style.fontFamily = 'Arial, sans-serif';
    const title = document.createElement('h2');
    title.textContent = 'Reset Data Options';
    panel.appendChild(title);
    const msg = document.createElement('p');
    msg.textContent = 'Choose which data to reset:';
    panel.appendChild(msg);
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.marginTop = '20px';
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.justifyContent = 'space-around';
    // Reset All
    const resetAllBtn = document.createElement('button');
    resetAllBtn.textContent = 'Reset All';
    styleButton(resetAllBtn, '#dc3545', '#a71d2a');
    resetAllBtn.onclick = () => {
      state.playedGames = {};
      state.providerData = {};
      state.playAgainFeedback = {};
      state.scanProgress = { index: 0, completed: false };
      state.panelPosition = {};
      saveData();
      location.reload();
    };
    buttonsDiv.appendChild(resetAllBtn);
    // Reset Played Games
    const resetPlayedBtn = document.createElement('button');
    resetPlayedBtn.textContent = 'Reset Played Games';
    styleButton(resetPlayedBtn, '#ffc107', '#d39e00');
    resetPlayedBtn.onclick = () => {
      state.playedGames = {};
      saveData();
      location.reload();
    };
    buttonsDiv.appendChild(resetPlayedBtn);
    // Reset Provider Data
    const resetProviderBtn = document.createElement('button');
    resetProviderBtn.textContent = 'Reset Provider Data';
    styleButton(resetProviderBtn, '#007bff', '#0056b3');
    resetProviderBtn.onclick = () => {
      state.providerData = {};
      state.scanProgress = { index: 0, completed: false };
      saveData();
      location.reload();
    };
    buttonsDiv.appendChild(resetProviderBtn);
    // Cancel Button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    styleButton(cancelBtn, '#555', '#333');
    cancelBtn.onclick = () => {
      document.body.removeChild(overlay);
    };
    buttonsDiv.appendChild(cancelBtn);
    panel.appendChild(buttonsDiv);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    overlay.focus();
  }

  // --- Play Again Prompt ---
  function showPlayAgainPrompt(path, gameTitle) {
    if (state.playAgainFeedback[path] === 'yes') return;
    if (document.getElementById('playAgainPrompt')) return;
    const overlay = document.createElement('div');
    overlay.id = 'playAgainPrompt';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    overlay.style.zIndex = '20000';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Play Again Prompt');
    const panel = document.createElement('div');
    panel.style.backgroundColor = '#333';
    panel.style.color = '#fff';
    panel.style.padding = '20px 30px';
    panel.style.borderRadius = '8px';
    panel.style.textAlign = 'center';
    panel.style.maxWidth = '400px';
    panel.style.fontFamily = 'Arial, sans-serif';
    const title = document.createElement('h2');
    title.textContent = 'Would you play this game again?';
    panel.appendChild(title);
    const nameEl = document.createElement('p');
    nameEl.style.marginTop = '10px';
    nameEl.style.fontWeight = 'bold';
    nameEl.textContent = gameTitle || 'Unknown Game';
    panel.appendChild(nameEl);
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.marginTop = '20px';
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.justifyContent = 'space-around';
    // Yes button
    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'Yes';
    styleButton(yesBtn, '#28a745', '#1e7e34');
    yesBtn.onclick = () => {
      state.playAgainFeedback[path] = 'yes';
      saveData();
      closePrompt();
    };
    buttonsDiv.appendChild(yesBtn);
    // Maybe button
    const maybeBtn = document.createElement('button');
    maybeBtn.textContent = 'Maybe';
    styleButton(maybeBtn, '#ffc107', '#d39e00');
    maybeBtn.onclick = () => {
      state.playAgainFeedback[path] = 'maybe';
      saveData();
      closePrompt();
    };
    buttonsDiv.appendChild(maybeBtn);
    // No button
    const noBtn = document.createElement('button');
    noBtn.textContent = 'No';
    styleButton(noBtn, '#dc3545', '#a71d2a');
    noBtn.onclick = () => {
      state.playAgainFeedback[path] = 'no';
      saveData();
      closePrompt();
    };
    buttonsDiv.appendChild(noBtn);
    panel.appendChild(buttonsDiv);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    function closePrompt() {
      document.body.removeChild(overlay);
      updateRandomButtonText();
      updateScanButtonText();
    }
    overlay.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closePrompt();
    });
    overlay.focus();
  }

  // --- Game List Observers ---
  function observeGameListChanges() {
    if (state.gameListObserver) state.gameListObserver.disconnect();
    const gameListContainer = document.querySelector('div._1bue0p6');
    if (!gameListContainer) return;
    state.gameListObserver = new MutationObserver(() => {
      updateProviderDropdown();
      filterGamesByProvider();
      updateRandomButtonText();
      updateScanButtonText();
    });
    state.gameListObserver.observe(gameListContainer, { childList: true, subtree: true });
  }
  function disconnectGameListObserver() {
    if (state.gameListObserver) {
      state.gameListObserver.disconnect();
      state.gameListObserver = null;
    }
  }
  function observeAllGamesLink() {
    if (state.allGamesLinkObserver) state.allGamesLinkObserver.disconnect();
    const navContainer = document.querySelector('nav._7r22w2h');
    if (!navContainer) return;
    state.allGamesLinkObserver = new MutationObserver(() => {
      positionOptionsPanel();
    });
    state.allGamesLinkObserver.observe(navContainer, { childList: true, subtree: true });
  }

  // --- Game Opening and Prompts ---
  window.addEventListener('focus', () => {
    const lastGamePath = sessionStorage.getItem('betfred_last_opened_game');
    if (!lastGamePath) return;
    const gameData = state.providerData[lastGamePath];
    const feedbackExists = state.playAgainFeedback[lastGamePath];
    if (gameData && !feedbackExists) {
      const title = prettifyTitle(gameData.title || 'Unknown Game');
      showPlayAgainPrompt(lastGamePath, title);
    }
    sessionStorage.removeItem('betfred_last_opened_game');
  });
  function openGameWithPrompt(linkHref) {
    sessionStorage.setItem('betfred_last_opened_game', getGamePath(linkHref));
    window.open(linkHref, '_blank');
  }
  function pickRandomGame() {
    const games = getAllGameElements().filter(div => div.style.display !== 'none');
    if (games.length === 0) {
      alert('No games available for the selected provider.');
      return;
    }
    const gameDiv = games[Math.floor(Math.random() * games.length)];
    const gameLink = gameDiv.querySelector(GAME_LINK_SELECTOR);
    if (!gameLink) return;
    const path = getGamePath(gameLink.href);
    state.playedGames[path] = true;
    saveData();
    openGameWithPrompt(gameLink.href);
    updateRandomButtonText();
  }
  function pickRandomFavoriteGame() {
    const yesGames = Object.entries(state.playAgainFeedback).filter(([path, feedback]) => feedback === 'yes');
    if (yesGames.length === 0) {
      alert('No favourite games found. Please mark some games as "Yes" in the play again prompt.');
      return;
    }
    const [chosenPath] = yesGames[Math.floor(Math.random() * yesGames.length)];
    let gameDiv = getAllGameElements().find(gameDiv => {
      const link = gameDiv.querySelector(GAME_LINK_SELECTOR);
      if (!link) return false;
      const linkPath = getGamePath(link.href);
      return linkPath === chosenPath;
    });
    if (!gameDiv) {
      alert('Favourite game not found in the current list.');
      return;
    }
    state.playedGames[chosenPath] = true;
    saveData();
    const gameLink = gameDiv.querySelector(GAME_LINK_SELECTOR);
    if (gameLink) openGameWithPrompt(gameLink.href);
    updateRandomButtonText();
  }

  // --- Initialization ---
  async function initialize() {
    if (state.initialized) return;
    state.initialized = true;
    loadData();
    createOptionsPanel();
    await addOptionsButton();
    observeAllGamesLink();
    updateProviderDropdown();
    filterGamesByProvider();
    updateRandomButtonText();
    updateScanButtonText();
  }

  // --- SPA Navigation Handling ---
  if (location.pathname === '/games/category/all-games') {
    waitForElement(GAME_LINK_SELECTOR, 15000)
      .then(() => {
        initialize();
        observeGameListChanges();
      })
      .catch(e => {
        console.warn('Games did not load on initial page load:', e);
      });
  }
  onSPAUrlChange(async (newUrl) => {
    const urlPath = new URL(newUrl).pathname;
    if (urlPath === '/games/category/all-games') {
      try {
        await waitForElement(GAME_LINK_SELECTOR, 15000);
        await waitForElement('a._1rwiby3._mdg8s6x[href="/games/category/all-games"]', 10000);
        observeAllGamesLink();
        if (!state.initialized) {
          loadData();
          await initialize();
          observeGameListChanges();
        } else {
          if (state.container) state.container.style.display = 'inline-block';
          if (state.optionsPanel) state.optionsPanel.style.display = 'none';
          updateProviderDropdown();
          filterGamesByProvider();
          updateRandomButtonText();
          updateScanButtonText();
        }
      } catch (err) {
        state.initialized = false;
        if (state.optionsPanel) state.optionsPanel.style.display = 'none';
        if (state.container) state.container.style.display = 'none';
        disconnectGameListObserver();
        console.warn('Game elements did not load on SPA navigation:', err);
      }
    } else {
      if (state.initialized) {
        state.initialized = false;
        if (state.optionsPanel) state.optionsPanel.style.display = 'none';
        if (state.container) state.container.style.display = 'none';
        disconnectGameListObserver();
      }
    }
  });

})();
