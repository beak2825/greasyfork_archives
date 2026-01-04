// ==UserScript==
// @name         War Alerter 
// @author       Davrone
// @description  Audio and visual alerts for players coming online. Call the api for either side to show current life/away time. Optimized for large wars.
// @namespace    https://greasyfork.org/en/users/1469540-davrone
// @match        https://www.torn.com/*
// @match        https://pda.torn.com/*
// @version      1.4
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/538544/War%20Alerter.user.js
// @updateURL https://update.greasyfork.org/scripts/538544/War%20Alerter.meta.js
// ==/UserScript==
(() => {
  // ---- Environment Adapter ----
  if (typeof PDA_httpGet === 'function') {
    window.rD_xmlhttpRequest = d =>
      d.method.toLowerCase()==='get'
        ? PDA_httpGet(d.url).then(d.onload).catch(d.onerror)
        : PDA_httpPost(d.url, d.headers, d.data).then(d.onload).catch(d.onerror);
    window.rD_setValue    = (k,v)=>localStorage.setItem(k,v);
    window.rD_getValue    = (k,d)=>localStorage.getItem(k)||d;
    window.rD_deleteValue = k=>localStorage.removeItem(k);
  } else {
    window.rD_xmlhttpRequest = GM_xmlhttpRequest;
    window.rD_setValue       = GM_setValue;
    window.rD_getValue       = GM_getValue;
    window.rD_deleteValue    = GM_deleteValue;
  }

  // ---- Config & Defaults ----
  let API_KEY = rD_getValue('api_key','');

  // ---- PERFORMANCE OPTIMIZATION: DOM Reference Cache ----
  class DOMCache {
    constructor() {
      this.playerElements = new Map(); // userId -> Set of DOM elements
      this.elementToUserId = new WeakMap(); // DOM element -> userId
      this.pendingUpdates = new Set(); // userIds that need display updates
      this.lastCacheUpdate = 0;
      this.cacheValidFor = 2000; // REDUCED: Cache valid for 2 seconds (was 5)
    }

    // Get all elements for a user
    getPlayerElements(userId) {
      return this.playerElements.get(userId) || new Set();
    }

    // Add an element for a user
    addPlayerElement(userId, element) {
      if (!this.playerElements.has(userId)) {
        this.playerElements.set(userId, new Set());
      }
      this.playerElements.get(userId).add(element);
      this.elementToUserId.set(element, userId);
    }

    // Remove an element
    removePlayerElement(element) {
      const userId = this.elementToUserId.get(element);
      if (userId) {
        const elements = this.playerElements.get(userId);
        if (elements) {
          elements.delete(element);
          if (elements.size === 0) {
            this.playerElements.delete(userId);
          }
        }
        this.elementToUserId.delete(element);
      }
    }

    // Get userId from element (using cache)
    getUserId(element) {
      return this.elementToUserId.get(element);
    }

    // Rebuild cache if needed
    refreshCache() {
      const now = Date.now();
      if (now - this.lastCacheUpdate < this.cacheValidFor) {
        return; // Cache still valid
      }

      // Clear existing cache
      this.playerElements.clear();
      // WeakMap will clean itself up

      // Rebuild cache
      const allElements = document.querySelectorAll('.honor-text-wrap, .member');
      allElements.forEach(element => {
        const userId = getPlayerIdFromElement(element);
        if (userId) {
          this.addPlayerElement(userId, element);
        }
      });

      this.lastCacheUpdate = now;
    }

    // Schedule a display update for a user
    scheduleUpdate(userId) {
      this.pendingUpdates.add(userId);
    }

    // Get all pending updates and clear the queue
    flushPendingUpdates() {
      const updates = new Set(this.pendingUpdates);
      this.pendingUpdates.clear();
      return updates;
    }

    // Clean up removed elements
    cleanup() {
      // Remove invalid entries (elements no longer in DOM)
      for (const [userId, elements] of this.playerElements.entries()) {
        const validElements = new Set();
        for (const element of elements) {
          if (document.contains(element)) {
            validElements.add(element);
          }
        }
        if (validElements.size === 0) {
          this.playerElements.delete(userId);
        } else {
          this.playerElements.set(userId, validElements);
        }
      }
    }
  }

  const domCache = new DOMCache();

  // ---- PERFORMANCE OPTIMIZATION: Batched Updates ----
  class UpdateBatcher {
    constructor() {
      this.isScheduled = false;
    }

    schedule() {
      if (!this.isScheduled) {
        this.isScheduled = true;
        requestAnimationFrame(() => {
          this.processBatch();
          this.isScheduled = false;
        });
      }
    }

    processBatch() {
      const pendingUpdates = domCache.flushPendingUpdates();

      // Process all pending updates in one batch
      for (const userId of pendingUpdates) {
        const elements = domCache.getPlayerElements(userId);
        const statusData = playerStatuses.get(userId);

        let displayText = null;

        // Calculate display text once per user
        if (statusData) {
          if (statusData.status === 'online') {
            displayText = null; // No timer for online players
          } else if (statusData.status === 'idle' && statusData.idleStartTime) {
            displayText = formatElapsedTime(statusData.idleStartTime);
          } else if (statusData.status === 'offline' && statusData.offlineTimestamp) {
            displayText = formatElapsedTime(statusData.offlineTimestamp);
          } else if (statusData.status !== 'online') {
            // FIXED: Only check cached data if player is NOT online
            const cachedData = getCachedUserData(userId);
            if (cachedData?.offlineTimestamp) {
              displayText = formatElapsedTime(cachedData.offlineTimestamp);
            }
          }
          // If status is 'online', displayText stays null (no else block)
        }

        // Update all elements for this user
        for (const element of elements) {
          updateDisplayForStatusOptimized(element, userId, displayText);
        }
      }
    }
  }

  const updateBatcher = new UpdateBatcher();

  // ---- SLOW MODE SYSTEM ----
  let slowModeEnabled = rD_getValue('slow_mode_enabled', 'false') === 'true';
  let apiQueue = [];
  let isProcessingQueue = false;
  let currentRefreshButton = null;
  let currentRefreshSide = null; // 'left' or 'right'

  function addToQueue(userId, container) {
    // Only add to queue if we're processing the correct side
    if (currentRefreshSide) {
      const rect = container.getBoundingClientRect();
      const elementCenterX = rect.left + (rect.width / 2);
      const centerX = window.innerWidth / 2;
      const buffer = 50;

      const isLeftSide = elementCenterX < (centerX - buffer);
      const isRightSide = elementCenterX > (centerX + buffer);

      // Only add if the element matches the side we're refreshing
      if ((currentRefreshSide === 'left' && isLeftSide) ||
          (currentRefreshSide === 'right' && isRightSide)) {
        apiQueue.push({ userId, container });
      }
    } else {
      // Fallback: add all (for backwards compatibility)
      apiQueue.push({ userId, container });
    }
  }

  function updateButtonProgress() {
    if (currentRefreshButton && apiQueue.length > 0) {
      const remaining = apiQueue.length;
      const originalText = currentRefreshButton.dataset.originalText || currentRefreshButton.textContent;
      currentRefreshButton.textContent = `⏳ Processing... (${remaining} left)`;
    }
  }

  function resetButtonText() {
    if (currentRefreshButton) {
      const originalText = currentRefreshButton.dataset.originalText;
      if (originalText) {
        currentRefreshButton.textContent = originalText;
      }
      currentRefreshButton.classList.remove('refreshing');
      currentRefreshButton = null;
    }
    currentRefreshSide = null; // Clear side tracking when done
  }

  function processQueue() {
    if (isProcessingQueue || apiQueue.length === 0) {
      if (apiQueue.length === 0) {
        resetButtonText();
      }
      return;
    }

    isProcessingQueue = true;
    const { userId, container } = apiQueue.shift();

    updateButtonProgress();

    // Make the actual API call
    makeApiCall(userId, container, () => {
      isProcessingQueue = false;

      if (apiQueue.length > 0) {
        //  0.8 second delay
        setTimeout(() => {
          processQueue();
        }, 500);
      } else {
        resetButtonText();
      }
    });
  }

  function makeApiCall(userId, container, callback) {
    apiGet(`/user/${userId}?selections=basic,profile`, d => {
      // Compute Life % if available
      let lifePct = null;
      if (d.life && typeof d.life.current === 'number' && d.life.maximum) {
        lifePct = Math.round((d.life.current / d.life.maximum) * 100);
      }

      // Find last_action and extract timestamp for real-time counting
      let lastObj = null;
      let offlineTimestamp = null;
      if (d.last_action && typeof d.last_action === 'object') {
        lastObj = d.last_action;
        offlineTimestamp = d.last_action.timestamp * 1000; // Convert to milliseconds
      } else if (d.profile && d.profile.last_action && typeof d.profile.last_action === 'object') {
        lastObj = d.profile.last_action;
        offlineTimestamp = d.profile.last_action.timestamp * 1000;
      } else if (d.basic && d.basic.last_action && typeof d.basic.last_action === 'object') {
        lastObj = d.basic.last_action;
        offlineTimestamp = d.basic.last_action.timestamp * 1000;
      }

      // Store offline timestamp in player status for real-time counting
      if (offlineTimestamp) {
        const currentStatus = playerStatuses.get(userId) || {};
        playerStatuses.set(userId, {
          ...currentStatus,
          status: currentStatus.status || 'offline',
          offlineTimestamp: offlineTimestamp
        });
      }

      // Convert "32 minutes ago" → "32m", "2 hours ago" → "2h", "5 days ago" → "5d"
      let shortTime = null;
      if (lastObj && typeof lastObj.relative === 'string') {
        const mm = lastObj.relative.match(/^(\d+)\s+(\w+)/);
        if (mm) {
          const num = mm[1];
          const w   = mm[2].toLowerCase();
          let suffix = 'm';
          if      (w.startsWith('hour'))   suffix = 'h';
          else if (w.startsWith('minute')) suffix = 'm';
          else if (w.startsWith('second')) suffix = 's';
          else if (w.startsWith('day'))    suffix = 'd';
          shortTime = num + suffix;
        }
      }

      // Cache the new data including timestamp
      setCachedUserData(userId, { lifePct, shortTime, offlineTimestamp });

      // Display the fresh data (respecting current online status)
      displayUserInfo(container, userId, lifePct, shortTime);

      if (callback) callback();
    });
  }

  // ---- SOUND ALERT SETUP ----
  let enemyOnlineSound = null;
  let soundVolume = 0.5; // Default volume (50%)
  let audioUnlocked = false; // Track if we've unlocked audio playbook

  // Sound library management
  let savedSounds = {};
  let currentSoundName = '';

  // Load saved sounds and current selection
  function loadSoundLibrary() {
    try {
      const saved = rD_getValue('saved_sounds', '{}');
      savedSounds = JSON.parse(saved);

      // Ensure default sounds exist
      if (!savedSounds['Solid']) {
        savedSounds['Solid'] = 'https://files.catbox.moe/ol9op3.mp3';
      }
      if (!savedSounds['Live Mas']) {
        savedSounds['Live Mas'] = 'https://files.catbox.moe/1d0o2z.mp3';
      }

      currentSoundName = rD_getValue('current_sound_name', 'Solid');

      // Ensure current sound name exists in saved sounds
      if (!savedSounds[currentSoundName]) {
        currentSoundName = 'Solid';
      }
    } catch(e) {
      savedSounds = {
        'Solid': 'https://files.catbox.moe/ol9op3.mp3',
        'Live Mas': 'https://files.catbox.moe/1d0o2z.mp3'
      };
      currentSoundName = 'Solid';
    }
  }

  // Save sound library
  function saveSoundLibrary() {
    try {
      rD_setValue('saved_sounds', JSON.stringify(savedSounds));
      rD_setValue('current_sound_name', currentSoundName);
    } catch(e) {
      // Failed to save
    }
  }

  // Get current sound URL
  function getCurrentSoundURL() {
    return savedSounds[currentSoundName] || savedSounds['Solid'] || 'https://files.catbox.moe/ol9op3.mp3';
  }

  function unlockAudio() {
    if (audioUnlocked || !enemyOnlineSound) return;

    // Try to play a silent sound to unlock audio
    const unlockSound = () => {
      if (enemyOnlineSound) {
        const originalVolume = enemyOnlineSound.volume;
        enemyOnlineSound.volume = 0;
        enemyOnlineSound.play().then(() => {
          enemyOnlineSound.pause();
          enemyOnlineSound.currentTime = 0;
          enemyOnlineSound.volume = originalVolume;
          audioUnlocked = true;

          // Remove event listeners after first unlock
          document.removeEventListener('click', unlockSound);
          document.removeEventListener('keydown', unlockSound);
        }).catch(() => {
          // Still locked, keep trying
        });
      }
    };

    // Try to unlock on any user interaction
    document.addEventListener('click', unlockSound);
    document.addEventListener('keydown', unlockSound);

    // Also try immediately
    unlockSound();
  }

  function initializeSound() {
    try {
      const soundURL = getCurrentSoundURL();
      enemyOnlineSound = new Audio(soundURL);
      enemyOnlineSound.volume = soundVolume;
      enemyOnlineSound.preload = 'auto'; // Changed from 'metadata' to 'auto'

      // Add event listeners for debugging
      enemyOnlineSound.addEventListener('canplaythrough', () => {
        // Sound loaded and ready
      });

      enemyOnlineSound.addEventListener('error', (e) => {
        // Failed to load sound
      });

      // Try to load the sound immediately
      enemyOnlineSound.load();

    } catch (e) {
      // Failed to initialize sound
    }
  }

  function playEnemyOnlineSound() {
    if (!enemyOnlineSound) {
      return;
    }

    try {
      enemyOnlineSound.currentTime = 0;
      enemyOnlineSound.volume = soundVolume;

      const playPromise = enemyOnlineSound.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Sound played successfully
        }).catch(e => {
          // Failed to play sound - handle autoplay restrictions
          if (e.name === 'NotAllowedError') {
            // Autoplay blocked - user interaction required first
          }
        });
      }
    } catch (e) {
      // Error playing sound
    }
  }

  // ---- NAMEPLATE ALERT SYSTEM ----
  function addNameplateAlert(container, userId) {
    // Remove any existing alerts for this user
    removeNameplateAlert(container);

    // Add the flashing glow class
    container.classList.add('ff-enemy-online-alert');

    // Remove the alert after 10 seconds
    setTimeout(() => {
      removeNameplateAlert(container);
    }, 10000);
  }

  function removeNameplateAlert(container) {
    container.classList.remove('ff-enemy-online-alert');
  }

  // ---- Enemy Detection System ----
  let enemyUserIds = new Set();
  let yourFactionUserIds = new Set();
  let playerOnlineStatus = new Map(); // userId -> true/false to track who's actually online

  function identifyFactionSides() {
    // Clear existing sets
    const previousEnemyCount = enemyUserIds.size;
    const previousFactionCount = yourFactionUserIds.size;

    enemyUserIds.clear();
    yourFactionUserIds.clear();

    // Try to identify left (enemy) and right (your faction) sides
    const allElements = document.querySelectorAll('.honor-text-wrap, .member');
    const centerX = window.innerWidth / 2;

    allElements.forEach(element => {
      const userId = getPlayerIdFromElement(element);
      if (!userId) return;

      const rect = element.getBoundingClientRect();
      const elementCenterX = rect.left + (rect.width / 2);

      // Use a buffer zone around center to avoid edge cases
      const buffer = 50; // 50px buffer around center

      if (elementCenterX < (centerX - buffer)) {
        enemyUserIds.add(userId);
      } else if (elementCenterX > (centerX + buffer)) {
        yourFactionUserIds.add(userId);
      }
    });
  }

  // ---- Cache Management ----
  function getCachedData() {
    try {
      const cached = rD_getValue('faction_scout_cache', '{}');
      return JSON.parse(cached);
    } catch(e) {
      return {};
    }
  }

  function setCachedData(cache) {
    try {
      rD_setValue('faction_scout_cache', JSON.stringify(cache));
    } catch(e) {
      // Failed to save cache
    }
  }

  function getCachedUserData(userId) {
    const cache = getCachedData();
    return cache[userId] || null;
  }

  function setCachedUserData(userId, data) {
    const cache = getCachedData();
    cache[userId] = {
      ...data,
      timestamp: Date.now(),
      lifeTimestamp: data.lifePct !== undefined ? Date.now() : (cache[userId]?.lifeTimestamp || Date.now())
    };
    setCachedData(cache);
  }

  // ---- PERFORMANCE OPTIMIZATION: Memory Management ----
  function cleanupOldData() {
    // Clean up player statuses for users no longer on page
    for (const userId of playerStatuses.keys()) {
      const elements = domCache.getPlayerElements(userId);
      if (elements.size === 0) {
        playerStatuses.delete(userId);
        playerOnlineStatus.delete(userId);
      }
    }

    // Clean up DOM cache
    domCache.cleanup();

    // NOTE: We DO NOT clean up cached user data (life percentages, away times, etc.)
    // This data is valuable and costs API calls to retrieve, so we preserve it
  }

  // ---- Styles ----
  GM_addStyle(`
    /* Level column info display - positioned to left side with color coding */
    .ff-level-info {
      position: absolute;
      left: 4px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.65em;
      line-height: 1.2em;
      pointer-events: none;
      z-index: 1;
      font-weight: 500;
      text-align: left;
    }

    /* NAMEPLATE ALERT ANIMATION */
    @keyframes ff-enemy-online-glow {
      0%, 100% {
        box-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
        background-color: rgba(255, 0, 0, 0.05);
      }
      25% {
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 0 30px rgba(255, 100, 100, 0.6);
        background-color: rgba(255, 0, 0, 0.15);
      }
      50% {
        box-shadow: 0 0 30px rgba(255, 50, 50, 1), 0 0 40px rgba(255, 150, 150, 0.8);
        background-color: rgba(255, 0, 0, 0.2);
      }
      75% {
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 0 30px rgba(255, 100, 100, 0.6);
        background-color: rgba(255, 0, 0, 0.15);
      }
    }

    .ff-enemy-online-alert {
      animation: ff-enemy-online-glow 1.5s ease-in-out infinite;
      border-radius: 8px !important;
      transition: all 0.3s ease;
      position: relative;
      z-index: 100;
    }

    /* Individual refresh buttons positioned above Members headers */
    .ff-refresh-btn {
      position: relative;
      padding: 8px 12px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 3px 10px rgba(0,0,0,0.4);
      transition: all 0.2s;
      z-index: 1000;
      min-width: 130px;
    }

    .ff-refresh-btn:hover {
      background: #1976d2;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }

    .ff-refresh-btn:active {
      transform: translateY(0);
    }

    .ff-refresh-btn.refreshing {
      background: #ff9800;
      cursor: not-allowed;
    }

    .ff-refresh-btn.refreshing:hover {
      background: #ff9800;
      transform: none;
    }

    /* Modal backdrop */
    .ff-modal-backdrop {
      position:fixed; inset:0; background:rgba(0,0,0,0.7);
      z-index:9998; display:none;
    }

    /* Modal window */
    .ff-modal {
      position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
      background:#2b2b2b; color:#eee; padding:20px; border-radius:8px;
      z-index:9999; min-width:420px; max-width:500px; display:none;
      box-shadow:0 8px 24px rgba(0,0,0,0.6);
      font-family:sans-serif; max-height: 90vh; overflow-y: auto;
    }
    .ff-modal h3 {
      margin:0 0 12px; font-size:1.3em; display:flex; align-items:center;
    }
    .ff-modal h3::before { content:"⚙️"; margin-right:8px; }
    .ff-modal h4 {
      margin:0 0 12px; font-size:1.1em; color:#eee;
    }

    /* Form fields */
    .ff-modal label {
      display:block; margin:12px 0 4px; font-size:0.9em; color:#ccc;
    }
    .ff-modal input {
      width:100%; padding:6px; border:1px solid #444;
      border-radius:4px; background:#333; color:#eee;
      font-size:1em;
    }

    /* Buttons */
    .ff-modal .btn {
      display:inline-block; margin-top:16px; padding:8px 14px;
      border:none; border-radius:4px; font-size:0.95em;
      cursor:pointer; transition:background .2s;
    }
    .ff-modal .btn-save {
      background:#4caf50; color:#fff; margin-right:8px;
    }
    .ff-modal .btn-save:hover { background:#66bb6a; }
    .ff-modal .btn-cancel {
      background:#c62828; color:#fff;
    }
    .ff-modal .btn-cancel:hover { background:#e53935; }
    .ff-modal .btn-clear {
      background:#555; color:#fff; margin-left:8px;
    }
    .ff-modal .btn-clear:hover { background:#666; }
  `);

  // ---- API GET helper ----
  function apiGet(ep, cb) {
    if (!API_KEY) return;
    rD_xmlhttpRequest({
      method: 'GET',
      url: `https://api.torn.com${ep}&key=${API_KEY}`,
      onload: r => {
        try {
          const d = JSON.parse(r.responseText);
          if (!d.error) cb(d);
        } catch(e){}
      },
      onerror: console.error
    });
  }

  // ---- Get color for life percentage ----
  function getLifeColor(lifePct) {
    if (lifePct >= 80) return '#4caf50'; // Green (80-100%)
    if (lifePct >= 60) return '#ffeb3b'; // Yellow (60-79%)
    if (lifePct >= 40) return '#ff9800'; // Orange (40-59%)
    if (lifePct >= 20) return '#ff5722'; // Red-orange (20-39%)
    return '#f44336'; // Red (0-19%)
  }

  // ---- Format elapsed time from timestamp ----
  function formatElapsedTime(startTimestamp) {
    const elapsed = Math.floor((Date.now() - startTimestamp) / 1000); // seconds

    if (elapsed < 60) {
      // Show just seconds: 1, 2, 3, 4...
      return `${elapsed}`;
    } else if (elapsed < 3600) {
      // Show minutes:seconds: 1:01, 1:02, 2:30...
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      // Show hours:minutes:seconds: 1:01:01, 1:30:45...
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  // ---- Estimate current life based on regeneration ----
  function estimateCurrentLife(userId) {
    const cachedData = getCachedUserData(userId);
    if (!cachedData || cachedData.lifePct === undefined || cachedData.lifePct >= 100) {
      return cachedData?.lifePct || null;
    }

    const timeElapsed = Date.now() - (cachedData.lifeTimestamp || cachedData.timestamp);
    const fiveMinuteIntervals = Math.floor(timeElapsed / (5 * 60 * 1000)); // 5 minutes in milliseconds
    const estimatedLife = Math.min(100, cachedData.lifePct + (fiveMinuteIntervals * 5));

    return estimatedLife;
  }

  // ---- Player Status Management ----
  const playerStatuses = new Map(); // userId -> { status, idleStartTime, lastOnlineTime }

  // ---- ENHANCED: Multiple detection methods for player status ----
  function getPlayerStatus(element) {
    // Method 1: Try Faction Filter approach (.iconShow with title)
    const iconShow = element.querySelector('.member li.iconShow');
    if (iconShow && iconShow.title) {
      const title = iconShow.title.replace(/<\/?b>/g, "").toLowerCase();
      if (title.includes("online")) return 'online';
      if (title.includes("idle")) return 'idle';
      if (title.includes("offline")) return 'offline';
    }

    // Method 2: Try Reviver's Tool approach (#iconTray)
    const iconTray = element.querySelector('#iconTray li');
    if (iconTray && iconTray.title) {
      if (iconTray.title.includes("Online")) return 'online';
      if (iconTray.title.includes("Idle")) return 'idle';
      // If iconTray exists but no Online/Idle, assume offline
      return 'offline';
    }

    // Method 3: Original SVG approach (fallback)
    const svg = element.querySelector('svg[fill]') ||
                element.querySelector('.userStatusWrap svg[fill]') ||
                element.closest('.userStatusWrap')?.querySelector('svg[fill]');

    if (svg) {
      const fill = svg.getAttribute('fill');
      if (fill) {
        if (fill.includes('#svg_status_online')) return 'online';
        if (fill.includes('#svg_status_idle')) return 'idle';
        if (fill.includes('#svg_status_offline')) return 'offline';
      }
    }

    return null;
  }

  // ---- Enhanced container finding with better DOM traversal ----
  function findUserContainer(startElement) {
    let current = startElement;
    let level = 0;
    const maxLevels = 15;

    while (current && level < maxLevels) {
      if (current.nodeType === Node.ELEMENT_NODE && current.classList) {
        if (current.classList.contains('honor-text-wrap') ||
            current.classList.contains('member') ||
            current.classList.contains('userStatusWrap') ||
            current.classList.contains('iconShow')) { // Added iconShow
          return current;
        }

        if (current.className && typeof current.className === 'string' &&
            current.className.includes('honorWrap')) {
          return current;
        }
      }

      current = current.parentElement;
      level++;
    }

    return startElement;
  }

  // Update player status and handle transitions
  function updatePlayerStatus(userId, newStatus, element) {
    const currentTime = Date.now();
    const existingData = playerStatuses.get(userId) || {};

    // Check if player has cached data - don't start timers without it
    const cachedData = getCachedUserData(userId);
    const hasCache = cachedData && (cachedData.lifePct !== undefined || cachedData.shortTime !== undefined);

    // If status changed, handle the transition
    if (existingData.status !== newStatus) {
      // If this is the first time we're seeing this player (no previous status)
      if (!existingData.status) {
        playerStatuses.set(userId, {
          status: newStatus,
          lastOnlineTime: currentTime,
          idleStartTime: null,
          offlineTimestamp: null
        });
        return { shouldDisplay: true, displayText: null }; // No timer display on first detection
      }

      if (newStatus === 'online') {
        // Player came online - clear any timers, no display needed
        playerStatuses.set(userId, {
          status: 'online',
          lastOnlineTime: currentTime,
          idleStartTime: null,
          offlineTimestamp: null
        });
        return { shouldDisplay: true, displayText: null }; // Clear time display for online players

      } else if (newStatus === 'idle') {
        // CRITICAL FIX: If transitioning from offline to idle, preserve the existing timestamp
        if (existingData.status === 'offline' && existingData.offlineTimestamp) {
          // Player was offline and went to idle - keep the original offline time as idle start
          playerStatuses.set(userId, {
            status: 'idle',
            lastOnlineTime: existingData.lastOnlineTime || currentTime,
            idleStartTime: existingData.offlineTimestamp, // Keep the original timestamp
            offlineTimestamp: null
          });
          return { shouldDisplay: true, displayText: formatElapsedTime(existingData.offlineTimestamp) };
        } else {
          // Player went from online to idle - only start timer if we have cached data
          if (hasCache) {
            playerStatuses.set(userId, {
              status: 'idle',
              lastOnlineTime: existingData.lastOnlineTime || currentTime,
              idleStartTime: currentTime, // Start fresh from current time
              offlineTimestamp: null
            });
            return { shouldDisplay: true, displayText: '1' }; // Start with 1 second
          } else {
            // No cached data yet - just track status without timer
            playerStatuses.set(userId, {
              status: 'idle',
              lastOnlineTime: existingData.lastOnlineTime || currentTime,
              idleStartTime: null,
              offlineTimestamp: null
            });
            return { shouldDisplay: true, displayText: null }; // No timer without cache
          }
        }

      } else if (newStatus === 'offline') {
        // CRITICAL FIX: If transitioning from idle to offline, preserve the existing timestamp
        if (existingData.status === 'idle' && existingData.idleStartTime) {
          // Player was idle and went offline - keep the original idle time as offline start
          playerStatuses.set(userId, {
            status: 'offline',
            lastOnlineTime: existingData.lastOnlineTime || currentTime,
            idleStartTime: null,
            offlineTimestamp: existingData.idleStartTime // Keep the original timestamp
          });
          return { shouldDisplay: true, displayText: formatElapsedTime(existingData.idleStartTime) };
        } else {
          // Player went from online to offline - start fresh timer
          playerStatuses.set(userId, {
            status: 'offline',
            lastOnlineTime: existingData.lastOnlineTime || currentTime,
            idleStartTime: null,
            offlineTimestamp: currentTime // Start fresh from current time
          });
          return { shouldDisplay: true, displayText: '1' }; // Start with 1 second
        }
      }
    }

    // Handle ongoing states (no status change)
    if (newStatus === 'online') {
      return { shouldDisplay: true, displayText: null }; // Clear time display for online players
    } else if (newStatus === 'idle') {
      const statusData = playerStatuses.get(userId);
      if (statusData && statusData.idleStartTime) {
        const idleText = formatElapsedTime(statusData.idleStartTime);
        return { shouldDisplay: true, displayText: `${idleText}` };
      }
      return { shouldDisplay: true, displayText: null }; // No timer if no idleStartTime
    } else if (newStatus === 'offline') {
      const statusData = playerStatuses.get(userId);
      if (statusData && statusData.offlineTimestamp) {
        const offlineText = formatElapsedTime(statusData.offlineTimestamp);
        return { shouldDisplay: true, displayText: `${offlineText}` };
      }
      return { shouldDisplay: true, displayText: null }; // No timer if no offlineTimestamp
    }

    // For unknown status, let the existing API system handle it
    return { shouldDisplay: true, displayText: null };
  }

  // ---- FIXED: Enhanced initial status detection with multiple detection methods ----
  function performInitialStatusScan() {
    console.log('[War Alerter] Performing comprehensive initial status scan...');

    // Force cache refresh
    domCache.refreshCache();

    let onlineCount = 0;
    let processedCount = 0;
    let detectionMethods = { iconShow: 0, iconTray: 0, svg: 0, none: 0 };

    // Get all player elements and try multiple detection methods
    for (const [userId, elements] of domCache.playerElements.entries()) {
      for (const container of elements) {
        let currentStatus = null;
        let detectionMethod = 'none';

        // Try multiple detection methods in order of reliability

        // Method 1: iconShow (most reliable for faction pages)
        const iconShow = container.querySelector('.member li.iconShow');
        if (iconShow && iconShow.title) {
          const title = iconShow.title.replace(/<\/?b>/g, "").toLowerCase();
          if (title.includes("online")) {
            currentStatus = 'online';
            detectionMethod = 'iconShow';
          } else if (title.includes("idle")) {
            currentStatus = 'idle';
            detectionMethod = 'iconShow';
          } else if (title.includes("offline")) {
            currentStatus = 'offline';
            detectionMethod = 'iconShow';
          }
        }

        // Method 2: iconTray (backup method)
        if (!currentStatus) {
          const iconTray = container.querySelector('#iconTray li');
          if (iconTray && iconTray.title) {
            if (iconTray.title.includes("Online")) {
              currentStatus = 'online';
              detectionMethod = 'iconTray';
            } else if (iconTray.title.includes("Idle")) {
              currentStatus = 'idle';
              detectionMethod = 'iconTray';
            } else {
              currentStatus = 'offline';
              detectionMethod = 'iconTray';
            }
          }
        }

        // Method 3: SVG (fallback method)
        if (!currentStatus) {
          const svg = container.querySelector('svg[fill]') ||
                      container.querySelector('.userStatusWrap svg[fill]') ||
                      container.closest('.userStatusWrap')?.querySelector('svg[fill]');
          if (svg) {
            const fill = svg.getAttribute('fill');
            if (fill) {
              if (fill.includes('#svg_status_online')) {
                currentStatus = 'online';
                detectionMethod = 'svg';
              } else if (fill.includes('#svg_status_idle')) {
                currentStatus = 'idle';
                detectionMethod = 'svg';
              } else if (fill.includes('#svg_status_offline')) {
                currentStatus = 'offline';
                detectionMethod = 'svg';
              }
            }
          }
        }

        // Track detection methods for debugging
        detectionMethods[detectionMethod]++;

        if (currentStatus) {
          processedCount++;
          const result = updatePlayerStatus(userId, currentStatus, container);

          if (currentStatus === 'online') {
            onlineCount++;
            // CRITICAL: Mark as online immediately to prevent timer display
            playerOnlineStatus.set(userId, true);
            // IMPORTANT: Clear any existing timer display immediately
            const existingInfo = container.querySelector('.ff-level-info');
            if (existingInfo) {
              // Check if it has a timer (contains : or is just numbers)
              const text = existingInfo.textContent || '';
              const hasTimer = text.includes(':') || /^\d+$/.test(text.trim().split('\n').pop()?.trim() || '');
              if (hasTimer) {
                console.log(`[War Alerter] Clearing timer for online player ${userId}`);
                // Force immediate update to clear timer
                domCache.scheduleUpdate(userId);
              }
            }
          } else {
            // Mark as not online
            playerOnlineStatus.set(userId, false);
          }

          // Schedule immediate update
          domCache.scheduleUpdate(userId);
        } else {
          // Could not detect status - assume offline but don't show timer until confirmed
          console.log(`[War Alerter] Could not detect status for player ${userId}`);
        }
      }
    }

    console.log(`[War Alerter] Initial scan complete: ${processedCount} players processed, ${onlineCount} online`);
    console.log(`[War Alerter] Detection methods used:`, detectionMethods);

    // Process all updates immediately
    updateBatcher.schedule();

    return { processedCount, onlineCount };
  }

  // ---- OPTIMIZED: Selective MutationObserver with targeted monitoring ----
  function setupStatusMonitoring() {
    // Identify faction sides on load
    identifyFactionSides();

    // Initial cache refresh
    domCache.refreshCache();

    const observers = new Map(); // container -> observer

    // Find specific faction containers instead of watching entire document
    const factionContainers = [
      document.querySelector('.enemy-faction'),
      document.querySelector('.user-faction'),
      document.querySelector('table:first-of-type'), // Left side
      document.querySelector('table:last-of-type')   // Right side
    ].filter(container => container && container.querySelector('.honor-text-wrap, .member'));

    // If no specific containers found, fall back to finding player containers directly
    if (factionContainers.length === 0) {
      const playerContainers = document.querySelectorAll('.honor-text-wrap, .member');
      factionContainers.push(...Array.from(playerContainers).slice(0, 50)); // Limit to first 50 to avoid performance issues
    }

    factionContainers.forEach(container => {
      const observer = new MutationObserver((mutations) => {
        processPendingMutationsOptimized(mutations);
      });

      // Only watch this specific container, not the whole document
      observer.observe(container, {
        attributes: true,
        attributeFilter: ['fill', 'title'], // Only status-related attributes
        subtree: true,
        childList: false // Don't watch for new elements being added (handle separately)
      });

      observers.set(container, observer);
    });

    // FIXED: Consistent 1-second status checks for both enemy and faction sides
    const statusChecker = () => {
      domCache.refreshCache(); // Refresh cache periodically

      const allUserIds = new Set();
      for (const userId of domCache.playerElements.keys()) {
        allUserIds.add(userId);
      }

      allUserIds.forEach(userId => {
        const elements = domCache.getPlayerElements(userId);
        for (const element of elements) {
          const currentStatus = getPlayerStatus(element);
          const storedStatus = playerStatuses.get(userId)?.status;

          // ONLY update if there's a real difference
          if (currentStatus && currentStatus !== storedStatus) {
            const result = updatePlayerStatus(userId, currentStatus, element);
            domCache.scheduleUpdate(userId);
          }
        }
      });

      // Schedule batched updates
      updateBatcher.schedule();

      // Clean up old data
      cleanupOldData();
    };

    // Keep consistent 1-second intervals for both sides
    let statusCheckInterval = setInterval(statusChecker, 1000); // Always 1 second intervals

    return observers;
  }

  function processPendingMutationsOptimized(mutations) {
    let statusChanges = new Set();

    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && isStatusRelatedChange(mutation)) {
        const container = findUserContainer(mutation.target);
        const userId = container ? getPlayerIdFromElement(container) : null;

        if (userId) {
          statusChanges.add(userId);
        }
      }
    });

    // Process status changes
    if (statusChanges.size > 0) {
      statusChanges.forEach(userId => {
        const elements = domCache.getPlayerElements(userId);
        for (const container of elements) {
          const newStatus = getPlayerStatus(container);
          const currentStoredStatus = playerStatuses.get(userId)?.status;

          // ADDITIONAL CHECK: Only update if status actually changed
          if (newStatus && newStatus !== currentStoredStatus) {
            const result = updatePlayerStatus(userId, newStatus, container);
            domCache.scheduleUpdate(userId);
          }
        }
      });

      // Trigger batched updates
      updateBatcher.schedule();
    }
  }

  function isStatusRelatedChange(mutation) {
    const { target, attributeName } = mutation;

    if (attributeName === 'fill' && target.tagName === 'SVG') {
      // Only SVG elements that are actually status indicators
      const fill = target.getAttribute('fill');
      const isStatusSVG = target.closest('.userStatusWrap, .member, .honor-text-wrap');
      return fill && isStatusSVG && (
        fill.includes('svg_status_online') ||
        fill.includes('svg_status_idle') ||
        fill.includes('svg_status_offline')
      );
    }

    if (attributeName === 'title') {
      // Only specific classes that indicate status
      const isStatusElement = (target.classList.contains('iconShow') || target.id === 'iconTray') &&
                             target.closest('.member, .honor-text-wrap');

      if (isStatusElement) {
        const title = target.title?.toLowerCase() || '';
        return title.includes('online') ||
               title.includes('idle') ||
               title.includes('offline');
      }
    }

    return false;
  }

  // ---- PERFORMANCE OPTIMIZATION: Optimized display update function ----
  function updateDisplayForStatusOptimized(container, userId, statusText) {
    const levelCell = container.querySelector('.level, [class*="level"]') ||
                     container.closest('li')?.querySelector('.level, [class*="level"]');

    if (!levelCell) return;

    // Check if there was a timer before we update (for audio alert detection)
    const existingInfo = levelCell.querySelector('.ff-level-info');
    const hadTimer = existingInfo && (existingInfo.textContent.includes(':') ||
                    /^\d+$/.test(existingInfo.textContent.trim().split('\n').pop()?.trim() || ''));

    // AUDIO ALERT TRIGGER: ONLY for enemies (left side) when timer disappears
    if (hadTimer && !statusText) {
      // Get current element position to check faction assignment
      const rect = container.getBoundingClientRect();
      const elementCenterX = rect.left + (rect.width / 2);
      const centerX = window.innerWidth / 2;
      const isActuallyLeft = elementCenterX < (centerX - 50); // 50px buffer

      // Check if this player was already marked as online
      const wasAlreadyOnline = playerOnlineStatus.get(userId) === true;

      // CRITICAL: Only alert if this is a NEW online status (wasn't already online)
      if (isActuallyLeft && enemyUserIds.has(userId) && !wasAlreadyOnline) {
        playerOnlineStatus.set(userId, true); // Mark as online to prevent future alerts

        // Play sound alert
        playEnemyOnlineSound();

        // Add nameplate flashing alert
        addNameplateAlert(container, userId);

      } else if (!isActuallyLeft || yourFactionUserIds.has(userId)) {
        // Mark faction members as online when they come online (no alert)
        if (!statusText) {
          playerOnlineStatus.set(userId, true);
        }
        // Remove from enemy list if they're actually on the right
        if (!isActuallyLeft && enemyUserIds.has(userId)) {
          enemyUserIds.delete(userId);
          yourFactionUserIds.add(userId);
        }
      } else {
        setTimeout(() => identifyFactionSides(), 100);
      }
    }

    // Track when players go offline (have a timer) so we can alert when they come back online
    if (statusText && !hadTimer) {
      // Player just went offline/idle (got a timer) - mark as not online
      const wasOnline = playerOnlineStatus.get(userId) === true;
      if (wasOnline) {
        playerOnlineStatus.set(userId, false);
        // Remove any existing nameplate alerts when going offline
        removeNameplateAlert(container);
      }
    }

    // OPTIMIZED: Update in place if possible
    if (existingInfo) {
      // Update existing element instead of removing/recreating
      updateExistingInfo(existingInfo, userId, statusText);
    } else {
      // Create new info display only if needed
      createNewInfo(levelCell, userId, statusText);
    }
  }

  function updateExistingInfo(infoDiv, userId, statusText) {
    // ALWAYS get cached life data - even for online players
    const cachedData = getCachedUserData(userId);
    const lifePct = estimateCurrentLife(userId); // Use estimated life instead of cached

    // CRITICAL FIX: Multiple checks to NEVER show timer for online players
    const currentStatus = playerStatuses.get(userId);
    const isMarkedOnline = playerOnlineStatus.get(userId) === true;

    // If player is marked as online OR detected as online, clear timer
    if (currentStatus?.status === 'online' || isMarkedOnline) {
      statusText = null; // Force clear any timer text for online players
      console.log(`[War Alerter] Clearing timer for online player ${userId} (status: ${currentStatus?.status}, marked: ${isMarkedOnline})`);
    }

    let infoText = '';

    // ALWAYS show life percentage if available
    if (lifePct !== null && lifePct !== undefined) {
      const lifeColor = getLifeColor(lifePct);
      infoText += `<span style="color: ${lifeColor};">Life: ${lifePct}%</span>`;
    }

    // Only add status text if player is not online
    if (statusText && !isMarkedOnline && currentStatus?.status !== 'online') {
      if (infoText) infoText += '<br>';
      infoText += `<span style="color: #ccc;">${statusText}</span>`;
    }

    // Only update if content actually changed
    if (infoDiv.innerHTML !== infoText) {
      infoDiv.innerHTML = infoText;
    }

    // Remove if no content
    if (!infoText) {
      infoDiv.remove();
    }
  }

  function createNewInfo(levelCell, userId, statusText) {
    // ALWAYS get cached life data - even for online players
    const cachedData = getCachedUserData(userId);
    const lifePct = estimateCurrentLife(userId); // Use estimated life instead of cached

    // CRITICAL FIX: Multiple checks to NEVER show timer for online players
    const currentStatus = playerStatuses.get(userId);
    const isMarkedOnline = playerOnlineStatus.get(userId) === true;

    // If player is marked as online OR detected as online, clear timer
    if (currentStatus?.status === 'online' || isMarkedOnline) {
      statusText = null; // Force clear any timer text for online players
      console.log(`[War Alerter] Not showing timer for online player ${userId} (status: ${currentStatus?.status}, marked: ${isMarkedOnline})`);
    }

    // FIXED: Always create display if we have life data, regardless of online status
    if (lifePct !== null && lifePct !== undefined) {
      // Create new info display
      const infoDiv = document.createElement('div');
      infoDiv.className = 'ff-level-info';
      infoDiv.style.position = 'absolute';
      infoDiv.style.left = '4px';
      infoDiv.style.top = '50%';
      infoDiv.style.transform = 'translateY(-50%)';
      infoDiv.style.fontSize = '0.65em';
      infoDiv.style.lineHeight = '1.2em';
      infoDiv.style.pointerEvents = 'none';
      infoDiv.style.zIndex = '1';
      infoDiv.style.fontWeight = '500';
      infoDiv.style.textAlign = 'left';

      // Ensure the level cell has relative positioning
      if (window.getComputedStyle(levelCell).position === 'static') {
        levelCell.style.position = 'relative';
      }

      let infoText = '';

      // ALWAYS show life percentage if available
      const lifeColor = getLifeColor(lifePct);
      infoText += `<span style="color: ${lifeColor};">Life: ${lifePct}%</span>`;

      // Only add status text if player is not online
      if (statusText && !isMarkedOnline && currentStatus?.status !== 'online') {
        infoText += '<br>';
        infoText += `<span style="color: #ccc;">${statusText}</span>`;
      }

      infoDiv.innerHTML = infoText;
      levelCell.appendChild(infoDiv);

    } else if (statusText && !isMarkedOnline && currentStatus?.status !== 'online') {
      // If no life data but we have status text, still show status (only if not online)
      const infoDiv = document.createElement('div');
      infoDiv.className = 'ff-level-info';
      infoDiv.style.position = 'absolute';
      infoDiv.style.left = '4px';
      infoDiv.style.top = '50%';
      infoDiv.style.transform = 'translateY(-50%)';
      infoDiv.style.fontSize = '0.65em';
      infoDiv.style.lineHeight = '1.2em';
      infoDiv.style.pointerEvents = 'none';
      infoDiv.style.zIndex = '1';
      infoDiv.style.fontWeight = '500';
      infoDiv.style.textAlign = 'left';

      if (window.getComputedStyle(levelCell).position === 'static') {
        levelCell.style.position = 'relative';
      }

      infoDiv.innerHTML = `<span style="color: #ccc;">${statusText}</span>`;
      levelCell.appendChild(infoDiv);
    }
  }

  // ---- Legacy function for compatibility (redirects to optimized version) ----
  function updateDisplayForStatus(container, userId, statusText) {
    updateDisplayForStatusOptimized(container, userId, statusText);
  }

  // ---- Get player ID from various element types ----
  function getPlayerIdFromElement(element) {
    // Ensure element is a valid DOM element
    if (!element || !element.nodeType || element.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    // Check if element itself is a link
    if (element.href) {
      const match = element.href.match(/.*XID=(\d+)/);
      if (match) return match[1];
    }

    // Check parent element
    if (element.parentElement?.href) {
      const match = element.parentElement.href.match(/.*XID=(\d+)/);
      if (match) return match[1];
    }

    // Check for anchor tags within element - safely
    try {
      const anchors = element.querySelectorAll ? element.querySelectorAll('a') : [];
      for (const anchor of anchors) {
        if (anchor.href) {
          const match = anchor.href.match(/.*XID=(\d+)/);
          if (match) return match[1];
        }
      }
    } catch (e) {
      // Fallback: traverse manually if querySelectorAll fails
      let current = element.firstElementChild;
      while (current) {
        if (current.tagName === 'A' && current.href) {
          const match = current.href.match(/.*XID=(\d+)/);
          if (match) return match[1];
        }
        // Check children recursively
        const childResult = getPlayerIdFromElement(current);
        if (childResult) return childResult;

        current = current.nextElementSibling;
      }
    }

    return null;
  }

  // ---- Check if we're on a faction or war page ----
  function isFactionOrWarPage() {
    return window.location.href.includes('factions.php');
  }

  // ---- Detect faction sections for war page ----
  function getFactionSections() {
    // Look for the actual Torn war page structure
    const enemyFaction = document.querySelector('.enemy-faction');
    const userFaction = document.querySelector('.user_faction, .user-faction');

    if (enemyFaction && userFaction) {
      return [enemyFaction, userFaction];
    }

    // Alternative: look for faction-info-wrap or factionWrap
    const factionWraps = document.querySelectorAll('.faction-info-wrap, .factionWrap, .faction-war');
    if (factionWraps.length >= 2) {
      return Array.from(factionWraps).slice(0, 2);
    }

    // Fallback: look for faction-profile containers
    const factionProfiles = document.querySelectorAll('.faction-profile');
    if (factionProfiles.length >= 2) {
      return Array.from(factionProfiles).slice(0, 2);
    }

    return [document.body];
  }

  // ---- Clear existing data from elements ----
  function clearExistingData(container) {
    const existingInfo = container.querySelectorAll('.ff-level-info');
    existingInfo.forEach(info => info.remove());

    // Reset processed flag
    const processedElements = container.querySelectorAll('[data-ff-processed]');
    processedElements.forEach(el => {
      delete el.dataset.ffProcessed;
    });

    // Clear any nameplate alerts
    const alertElements = container.querySelectorAll('.ff-enemy-online-alert');
    alertElements.forEach(el => {
      removeNameplateAlert(el);
    });
  }

  // ---- Display user info with proper idle/away distinction ----
  function displayUserInfo(container, userId, lifePct, shortTime) {
    // Check current player status first
    const currentStatus = playerStatuses.get(userId);
    const cachedData = getCachedUserData(userId); // Get cached data for offline timestamps
    const isMarkedOnline = playerOnlineStatus.get(userId) === true;

    // CRITICAL: If player is online OR marked as online, don't show any time
    if (currentStatus?.status === 'online' || isMarkedOnline) {
      console.log(`[War Alerter] Not displaying timer for online player ${userId} (status: ${currentStatus?.status}, marked: ${isMarkedOnline})`);
      updateDisplayForStatusOptimized(container, userId, null); // No time display for online players
      return;
    }

    // API DATA ALWAYS OVERRIDES: When API data comes in, use it regardless of current status
    const levelCell = container.querySelector('.level, [class*="level"]') ||
                     container.closest('li')?.querySelector('.level, [class*="level"]');

    if (levelCell && (lifePct !== null || shortTime !== null)) {
      // Remove any existing info to avoid duplicates
      const existingInfo = levelCell.querySelector('.ff-level-info');
      if (existingInfo) {
        existingInfo.remove();
      }

      const infoDiv = document.createElement('div');
      infoDiv.className = 'ff-level-info';
      infoDiv.style.position = 'absolute';
      infoDiv.style.left = '4px';
      infoDiv.style.top = '50%';
      infoDiv.style.transform = 'translateY(-50%)';
      infoDiv.style.fontSize = '0.65em';
      infoDiv.style.lineHeight = '1.2em';
      infoDiv.style.pointerEvents = 'none';
      infoDiv.style.zIndex = '1';
      infoDiv.style.fontWeight = '500';
      infoDiv.style.textAlign = 'left';

      // Ensure the level cell has relative positioning
      if (window.getComputedStyle(levelCell).position === 'static') {
        levelCell.style.position = 'relative';
      }

      let infoText = '';
      if (lifePct !== null) {
        const lifeColor = getLifeColor(lifePct);
        infoText += `<span style="color: ${lifeColor};">Life: ${lifePct}%</span>`;
      }

      // FIXED: Only show API time data if player is confirmed not online
      if (shortTime !== null && currentStatus?.status !== 'online' && !isMarkedOnline) {
        if (infoText) infoText += '<br>';

        // Use real-time away timer if we have offline timestamp, otherwise use API shortTime
        let displayTime = shortTime;
        if (currentStatus?.offlineTimestamp) {
          displayTime = formatElapsedTime(currentStatus.offlineTimestamp);
        } else if (cachedData?.offlineTimestamp) {
          // Check cached data for offline timestamp
          displayTime = formatElapsedTime(cachedData.offlineTimestamp);
        }

        // Show the time from API data
        infoText += `<span style="color: #ccc;">${displayTime}</span>`;
      }

      infoDiv.innerHTML = infoText;
      levelCell.appendChild(infoDiv);
    }
  }

  // ---- Process single user element ----
  function processUserElement(element, container, forceRefresh = false) {
    const userId = getPlayerIdFromElement(element);
    if (!userId) return;

    // Add to DOM cache
    domCache.addPlayerElement(userId, container);

    if (container.dataset.ffProcessed && !forceRefresh) return;
    container.dataset.ffProcessed = '1';

    // Enforce position:relative for absolute positioning of info
    const computed = window.getComputedStyle(container);
    if (computed.position === 'static') {
      container.style.position = 'relative';
    }

    // FIXED: Always detect current status immediately, no delays
    const currentStatus = getPlayerStatus(container);
    if (currentStatus) {
      const result = updatePlayerStatus(userId, currentStatus, container);
      if (result.shouldDisplay === false || result.displayText !== undefined) {
        domCache.scheduleUpdate(userId);
        updateBatcher.schedule();
        // Continue to check cached data even if status detection worked
      }
    }

    // FIXED: Show cached data only if we don't have current status OR if it's a force refresh
    if (forceRefresh || !currentStatus) {
      const cachedData = getCachedUserData(userId);
      if (cachedData && (cachedData.lifePct !== undefined || cachedData.shortTime !== undefined)) {
        // If we have cached offline timestamp, set up real-time away timer
        if (cachedData.offlineTimestamp && !currentStatus) {
          playerStatuses.set(userId, {
            status: 'offline',
            offlineTimestamp: cachedData.offlineTimestamp
          });
        }
        displayUserInfo(container, userId, cachedData.lifePct, cachedData.shortTime);
      }
    }

    // Only make API calls if explicitly forced (when refresh buttons are clicked)
    if (!forceRefresh) {
      return; // Stop here - no API calls on page load
    }

    // SLOW MODE: Add to queue instead of immediate API call
    if (slowModeEnabled) {
      addToQueue(userId, container);
    } else {
      // Normal mode: immediate API call
      makeApiCall(userId, container);
    }
  }

  // ---- Injection: Faction and War pages only ----
  function injectList(root = document, forceRefresh = false) {
    // Only run on faction/war pages
    if (!isFactionOrWarPage()) return;

    let elements = [];

    // Look for honor bars first (these appear on various faction pages)
    const honorBars = Array.from(root.querySelectorAll('.honor-text-wrap'));
    if (honorBars.length > 0) {
      elements = honorBars;
    } else {
      // Fallback to member elements for faction pages
      elements = Array.from(root.querySelectorAll('.member'));
    }

    // Process each element
    elements.forEach(element => {
      // Find the appropriate container
      let container = element.closest('div[class*="honorWrap"]');
      if (!container) {
        container = element.closest('.member');
      }
      if (!container) {
        container = element;
      }

      processUserElement(element, container, forceRefresh);
    });

    // Start processing queue if in slow mode and we have items
    if (forceRefresh && slowModeEnabled && apiQueue.length > 0) {
      processQueue();
    }
  }

  // ---- Refresh specific faction section ----
  function refreshFactionSection(sectionIndex) {
    const sections = getFactionSections();
    if (sectionIndex >= 0 && sectionIndex < sections.length) {
      const section = sections[sectionIndex];
      clearExistingData(section);
      injectList(section, true); // Force refresh = true
    } else {
      // Fallback: refresh specific side of the war page
      if (sectionIndex === 0) {
        // Enemy faction - left side
        const leftSide = document.querySelector('table:first-of-type');
        if (leftSide) {
          clearExistingData(leftSide);
          injectList(leftSide, true); // Force refresh = true
        }
      } else {
        // Your faction - right side
        const rightSide = document.querySelector('table:last-of-type');
        if (rightSide) {
          clearExistingData(rightSide);
          injectList(rightSide, true); // Force refresh = true
        }
      }
    }
  }

  // ---- Create refresh buttons for war page ----
  function createRefreshButtons() {
    // Only show refresh buttons on faction/war pages
    if (!isFactionOrWarPage()) return;

    // Remove any existing refresh buttons
    document.querySelectorAll('.ff-refresh-btn').forEach(btn => btn.remove());

    // Create a simple floating container with both buttons - spaced apart
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '100px';
    container.style.right = '20px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.zIndex = '9999';

    // Create Enemy button (Left side)
    const enemyBtn = document.createElement('button');
    enemyBtn.className = 'ff-refresh-btn';
    enemyBtn.textContent = '🔄 Enemy (Left)';
    enemyBtn.dataset.originalText = '🔄 Enemy (Left)';
    enemyBtn.style.padding = '8px 12px';
    enemyBtn.style.background = '#e53935';
    enemyBtn.style.color = 'white';
    enemyBtn.style.border = 'none';
    enemyBtn.style.borderRadius = '6px';
    enemyBtn.style.cursor = 'pointer';
    enemyBtn.style.fontSize = '12px';
    enemyBtn.style.fontWeight = '600';
    enemyBtn.style.boxShadow = '0 3px 10px rgba(0,0,0,0.4)';
    enemyBtn.style.minWidth = '130px';
    enemyBtn.style.position = 'relative';

    enemyBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (enemyBtn.classList.contains('refreshing')) return;

      // Clear any existing queue and set side
      apiQueue.length = 0;
      currentRefreshButton = enemyBtn;
      currentRefreshSide = 'left'; // Set to left side

      enemyBtn.classList.add('refreshing');
      if (slowModeEnabled) {
        enemyBtn.textContent = '⏳ Preparing...';
      } else {
        enemyBtn.textContent = '⏳ Refreshing...';
      }
      enemyBtn.style.background = '#ff9800';

      setTimeout(() => {
        // Target left side of the page - enemy faction
        refreshLeftSide();

        if (!slowModeEnabled) {
          enemyBtn.classList.remove('refreshing');
          enemyBtn.textContent = '🔄 Enemy (Left)';
          enemyBtn.style.background = '#e53935';
          currentRefreshButton = null;
          currentRefreshSide = null;
        }
      }, 500);
    };

    // Add right-click to open settings
    enemyBtn.oncontextmenu = (e) => {
      e.preventDefault();
      openModal();
    };

    // Create Your Faction button (Right side)
    const yourBtn = document.createElement('button');
    yourBtn.className = 'ff-refresh-btn';
    yourBtn.textContent = '🔄 Your Faction (Right)';
    yourBtn.dataset.originalText = '🔄 Your Faction (Right)';
    yourBtn.style.padding = '8px 12px';
    yourBtn.style.background = '#4caf50';
    yourBtn.style.color = 'white';
    yourBtn.style.border = 'none';
    yourBtn.style.borderRadius = '6px';
    yourBtn.style.cursor = 'pointer';
    yourBtn.style.fontSize = '12px';
    yourBtn.style.fontWeight = '600';
    yourBtn.style.boxShadow = '0 3px 10px rgba(0,0,0,0.4)';
    yourBtn.style.minWidth = '130px';
    yourBtn.style.position = 'relative';

    yourBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (yourBtn.classList.contains('refreshing')) return;

      // Clear any existing queue and set side
      apiQueue.length = 0;
      currentRefreshButton = yourBtn;
      currentRefreshSide = 'right'; // Set to right side

      yourBtn.classList.add('refreshing');
      if (slowModeEnabled) {
        yourBtn.textContent = '⏳ Preparing...';
      } else {
        yourBtn.textContent = '⏳ Refreshing...';
      }
      yourBtn.style.background = '#ff9800';

      setTimeout(() => {
        // Target right side of the page - your faction
        refreshRightSide();

        if (!slowModeEnabled) {
          yourBtn.classList.remove('refreshing');
          yourBtn.textContent = '🔄 Your Faction (Right)';
          yourBtn.style.background = '#4caf50';
          currentRefreshButton = null;
          currentRefreshSide = null;
        }
      }, 500);
    };

    // Add right-click to open settings
    yourBtn.oncontextmenu = (e) => {
      e.preventDefault();
      openModal();
    };

    // Add both buttons to container
    container.appendChild(enemyBtn);
    container.appendChild(yourBtn);
    document.body.appendChild(container);
  }

  // ---- Refresh left side (enemy faction) ----
  function refreshLeftSide() {
    // Multiple targeting strategies for left side
    const leftTargets = [
      // War page selectors - left side
      document.querySelector('.enemy-faction'),
      document.querySelector('.faction-war:first-child'),
      document.querySelector('.faction-profile:first-child'),
      // Table-based layout - first table
      document.querySelector('table:first-of-type'),
      // Container-based - first half
      document.querySelector('.war-wrapper > div:first-child'),
      document.querySelector('[class*="left"]'),
      // Generic first container
      document.querySelector('.container:first-of-type')
    ];

    // Find the first valid target
    const leftSection = leftTargets.find(target => target && target.querySelector('.honor-text-wrap, .member'));

    if (leftSection) {
      clearExistingData(leftSection);
      injectList(leftSection, true);
    } else {
      // Fallback: target all elements on left half of screen
      const allElements = document.querySelectorAll('.honor-text-wrap, .member');
      const leftElements = Array.from(allElements).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.left < window.innerWidth / 2; // Left half of screen
      });

      leftElements.forEach(element => {
        const container = element.closest('div') || element;
        clearExistingData(container);
        processUserElement(element, container, true);
      });

      // Start processing queue if in slow mode and we have items
      if (slowModeEnabled && apiQueue.length > 0) {
        processQueue();
      }
    }
  }

  // ---- Refresh right side (your faction) - More precise targeting ----
  function refreshRightSide() {
    // More precise targeting strategies for right side only
    const rightTargets = [
      // War page selectors - right side (more specific)
      document.querySelector('.user-faction:not(.enemy-faction)'),
      document.querySelector('.user_faction:not(.enemy-faction)'),
      // Look for the second faction container specifically
      document.querySelectorAll('.faction-war')[1],
      document.querySelectorAll('.faction-profile')[1],
      // Table-based layout - specifically the last table that's not the first
      (() => {
        const tables = document.querySelectorAll('table');
        return tables.length > 1 ? tables[tables.length - 1] : null;
      })(),
      // Container-based - second/last faction container
      document.querySelector('.war-wrapper > div:last-child:not(:first-child)'),
      document.querySelector('[class*="right"]:not([class*="left"])'),
    ];

    // Find the first valid target that actually contains faction members
    let rightSection = null;
    for (const target of rightTargets) {
      if (target && target.querySelector('.honor-text-wrap, .member')) {
        // Make sure this isn't the same as left section
        const leftSection = document.querySelector('.enemy-faction') ||
                           document.querySelector('.faction-war:first-child') ||
                           document.querySelector('table:first-of-type');

        if (target !== leftSection) {
          rightSection = target;
          break;
        }
      }
    }

    if (rightSection) {
      clearExistingData(rightSection);
      injectList(rightSection, true);
    } else {
      // Improved fallback: More precise right-side targeting
      const allElements = document.querySelectorAll('.honor-text-wrap, .member');
      const rightElements = [];

      // Get screen center point
      const centerX = window.innerWidth / 2;

      // Also identify left elements to exclude them
      const leftElements = new Set();

      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elementCenterX = rect.left + (rect.width / 2);

        if (elementCenterX < centerX) {
          leftElements.add(el);
        } else if (elementCenterX > centerX) {
          // Only include if it's clearly on the right side
          rightElements.push(el);
        }
      });

      // Process only the right elements
      rightElements.forEach(element => {
        const container = element.closest('div') || element;
        clearExistingData(container);
        processUserElement(element, container, true);
      });

      // Start processing queue if in slow mode and we have items
      if (slowModeEnabled && apiQueue.length > 0) {
        processQueue();
      }
    }
  }

  function injectAll(forceRefresh = false) {
    injectList(document, forceRefresh);
  }

  // ---- FIXED: Load cached data with immediate status detection ----
  function loadCachedData() {
    console.log('[War Alerter] Loading cached data...');

    // FIRST: Perform immediate status scan to detect online players
    const scanResults = performInitialStatusScan();

    // THEN: Load cached data for remaining players
    injectList(document, false); // Load cached data without forcing API calls

    console.log('[War Alerter] Cached data loaded.');
  }

  // ---- Build GUI (settings modal only - no FAB) ----
  const backdrop = document.createElement('div'),
        modal    = document.createElement('div');

  backdrop.className = 'ff-modal-backdrop';
  modal.className    = 'ff-modal';
  document.body.append(backdrop, modal);

  // Load sound library before creating modal content
  loadSoundLibrary();

  // Function to build sound library dropdown options
  function buildSoundOptions() {
    let options = '';
    Object.keys(savedSounds).forEach(soundName => {
      const selected = soundName === currentSoundName ? ' selected' : '';
      options += `<option value="${soundName}"${selected}>${soundName}</option>`;
    });
    return options;
  }

  // Function to update modal content
  function updateModalContent() {
    modal.innerHTML = `
      <h3>Settings</h3>
      <div>
        <label>API Key</label>
        <input type="text" id="ff-key" value="${API_KEY}" placeholder="Enter your Torn API Key…">
        <button class="btn btn-clear" id="ff-clear-key">Clear Key</button>
      </div>

      <div style="border-top: 1px solid #444; margin: 16px 0; padding-top: 16px;">
        <h4 style="margin: 0 0 12px; color: #eee; font-size: 1.1em;">⚡ API Rate Limiting</h4>

        <div style="margin-bottom: 12px;">
          <label style="display: flex; align-items: center; cursor: pointer;">
            <input type="checkbox" id="ff-slow-mode" ${slowModeEnabled ? 'checked' : ''} style="margin-right: 8px; width: auto;">
            <span>Enable Slow Mode </span>
          </label>
          <div style="margin-top: 4px; font-size: 0.8em; color: #aaa;">
            When enabled, API calls are limited to prevent hitting the 100 calls/minute limit.
            Useful for large factions with many members.
          </div>
        </div>
      </div>

      <div style="border-top: 1px solid #444; margin: 16px 0; padding-top: 16px;">
        <h4 style="margin: 0 0 12px; color: #eee; font-size: 1.1em;">🔊 Alert Sound Library</h4>

        <div style="margin-bottom: 12px;">
          <label>Current Alert Sound</label>
          <select id="ff-sound-select" style="width: 100%; padding: 6px; border: 1px solid #444; border-radius: 4px; background: #333; color: #eee; font-size: 1em;">
            ${buildSoundOptions()}
          </select>
        </div>

        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <button class="btn btn-clear" id="ff-test-sound">🔊 Test Selected Sound</button>
          <button class="btn btn-clear" id="ff-delete-sound" style="background: #c62828;">🗑️ Delete Selected</button>
        </div>

        <div style="border: 1px solid #444; border-radius: 4px; padding: 12px; background: #1a1a1a;">
          <div style="margin-bottom: 8px; font-weight: 500; color: #ccc;">Add New Alert Sound</div>
          <div style="margin-bottom: 8px;">
            <input type="text" id="ff-new-sound-name" placeholder="Sound name (e.g., 'My Custom Alert')" style="width: 100%; padding: 6px; border: 1px solid #444; border-radius: 4px; background: #333; color: #eee; font-size: 0.9em;">
          </div>
          <div style="margin-bottom: 8px;">
            <input type="text" id="ff-new-sound-url" placeholder="Enter .mp3 URL (e.g., https://files.catbox.moe/ol9op3.mp3)" style="width: 100%; padding: 6px; border: 1px solid #444; border-radius: 4px; background: #333; color: #eee; font-size: 0.9em;">
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-clear" id="ff-add-sound" style="background: #4caf50;">➕ Add Sound</button>
            <button class="btn btn-clear" id="ff-test-new-sound">🔊 Test URL</button>
          </div>
          <div style="margin-top: 6px; font-size: 0.8em; color: #aaa;">
            💡 Need to upload a custom sound? Visit <a href="http://catbox.moe" target="_blank" style="color: #4caf50; text-decoration: none;">catbox.moe</a> to upload your .mp3 file and get a direct link
          </div>
        </div>
      </div>

      <div>
        <label id="ff-volume-label">Sound Volume (${Math.round(soundVolume * 100)}%)</label>
        <input type="range" id="ff-volume" min="0" max="100" value="${Math.round(soundVolume * 100)}" style="width: 100%;">
      </div>

      <div>
        <button class="btn btn-clear" id="ff-clear-cache">Clear Cached Data</button>
      </div>
      <div style="text-align:right;">
        <button class="btn btn-save"   id="ff-save">💾 Save & Reload</button>
        <button class="btn btn-cancel" id="ff-cancel">❌ Cancel</button>
      </div>
    `;

    // Reattach all event listeners after updating content
    attachModalEventListeners();
  }

  // Initial modal content
  updateModalContent();

  // Modal functions
  function openModal() {
    backdrop.style.display = 'block';
    modal.style.display = 'block';
  }

  function closeModal() {
    modal.style.display = 'none';
    backdrop.style.display = 'none';
  }

  // Close modal by clicking backdrop
  backdrop.onclick = closeModal;
  modal.querySelector('#ff-cancel').onclick = closeModal;

  // Function to attach all modal event listeners
  function attachModalEventListeners() {
    // Close modal by clicking backdrop or cancel
    modal.querySelector('#ff-cancel').onclick = closeModal;

    // Slow mode toggle
    modal.querySelector('#ff-slow-mode').onchange = (e) => {
      slowModeEnabled = e.target.checked;
    };

    // Volume control
    modal.querySelector('#ff-volume').oninput = (e) => {
      soundVolume = parseInt(e.target.value) / 100;
      if (enemyOnlineSound) {
        enemyOnlineSound.volume = soundVolume;
      }
      modal.querySelector('#ff-volume-label').textContent = `Sound Volume (${e.target.value}%)`;
    };

    // Sound selection change
    modal.querySelector('#ff-sound-select').onchange = (e) => {
      currentSoundName = e.target.value;
      // Reinitialize sound with new selection
      initializeSound();
    };

    // Test selected sound
    modal.querySelector('#ff-test-sound').onclick = () => {
      // This user interaction will help unlock audio
      if (!audioUnlocked) {
        unlockAudio();
      }

      playEnemyOnlineSound();
    };

    // Delete selected sound
    modal.querySelector('#ff-delete-sound').onclick = () => {
      if (currentSoundName === 'Solid' || currentSoundName === 'Live Mas') {
        alert('Cannot delete the built-in sounds');
        return;
      }

      if (Object.keys(savedSounds).length <= 2) {
        alert('Cannot delete custom sounds when only built-in sounds remain');
        return;
      }

      if (confirm(`Are you sure you want to delete "${currentSoundName}"?`)) {
        delete savedSounds[currentSoundName];
        currentSoundName = 'Solid'; // Switch to Solid
        initializeSound(); // Reinitialize with Solid
        updateModalContent(); // Refresh the UI
      }
    };

    // Add new sound
    modal.querySelector('#ff-add-sound').onclick = () => {
      const name = modal.querySelector('#ff-new-sound-name').value.trim();
      const url = modal.querySelector('#ff-new-sound-url').value.trim();

      if (!name) {
        alert('Please enter a name for the sound');
        return;
      }

      if (!url) {
        alert('Please enter a URL for the sound');
        return;
      }

      if (savedSounds[name]) {
        if (!confirm(`A sound named "${name}" already exists. Do you want to replace it?`)) {
          return;
        }
      }

      // Add the new sound
      savedSounds[name] = url;
      currentSoundName = name; // Switch to the new sound

      // Clear the input fields
      modal.querySelector('#ff-new-sound-name').value = '';
      modal.querySelector('#ff-new-sound-url').value = '';

      // Reinitialize sound and refresh UI
      initializeSound();
      updateModalContent();
    };

    // Test new sound URL without adding it
    modal.querySelector('#ff-test-new-sound').onclick = () => {
      const url = modal.querySelector('#ff-new-sound-url').value.trim();

      if (!url) {
        alert('Please enter a URL to test');
        return;
      }

      try {
        const testSound = new Audio(url);
        testSound.volume = soundVolume;

        testSound.addEventListener('canplaythrough', () => {
          // Test sound loaded successfully
        });

        testSound.addEventListener('error', (e) => {
          alert('Failed to load sound from URL. Please check if the URL is valid and accessible.');
        });

        // This user interaction will help unlock audio
        if (!audioUnlocked) {
          unlockAudio();
        }

        const playPromise = testSound.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Test sound played successfully
          }).catch(e => {
            alert('Failed to play sound. This might be due to browser autoplay restrictions or an invalid audio file.');
          });
        }
      } catch (e) {
        alert('Invalid sound URL or unsupported format');
      }
    };

    // Clear API Key
    modal.querySelector('#ff-clear-key').onclick = () => {
      rD_deleteValue('api_key');
      API_KEY = '';
      modal.querySelector('#ff-key').value = '';
      alert('API key cleared');
    };

    // Clear Cache
    modal.querySelector('#ff-clear-cache').onclick = () => {
      rD_deleteValue('faction_scout_cache');
      alert('Cached data cleared');
      // Clear displayed data
      document.querySelectorAll('.ff-level-info').forEach(info => info.remove());
      // Clear nameplate alerts
      document.querySelectorAll('.ff-enemy-online-alert').forEach(el => {
        removeNameplateAlert(el);
      });
    };

    // Save & Reload
    modal.querySelector('#ff-save').onclick = () => {
      const nk = modal.querySelector('#ff-key').value.trim();
      if (nk) rD_setValue('api_key', nk), API_KEY = nk;

      // Save slow mode setting
      rD_setValue('slow_mode_enabled', slowModeEnabled.toString());

      // Save sound library and current selection
      saveSoundLibrary();

      // Save volume setting
      rD_setValue('sound_volume', soundVolume);

      location.reload();
    };
  }

  // Auto-open API modal if no key
  if (!API_KEY) {
    openModal();
  }

  // Only initialize if we're on faction or war pages
  if (isFactionOrWarPage()) {
    // Load sound library and settings
    loadSoundLibrary();

    // Load saved volume setting
    const savedVolume = rD_getValue('sound_volume', '0.5');
    soundVolume = parseFloat(savedVolume);

    // Initialize sound system
    initializeSound();

    // Try to unlock audio playbook
    setTimeout(() => {
      unlockAudio();
    }, 1000);

    // CRITICAL: Identify faction sides FIRST before any other processing
    identifyFactionSides();

    // Setup real-time status monitoring with enhanced detection
    const statusObservers = setupStatusMonitoring();

    // FIXED: Load cached data with immediate status detection
    loadCachedData();

    // Create refresh buttons
    createRefreshButtons();

    // PERFORMANCE OPTIMIZATION: Consolidated, less frequent update timer
    setInterval(() => {
      // Schedule updates for all players that need real-time timers
      playerStatuses.forEach((statusData, userId) => {
        if (statusData.status !== 'online') {
          domCache.scheduleUpdate(userId);
        }
      });

      // Trigger batched updates
      updateBatcher.schedule();

    }, 2000); // Update every 2 seconds instead of every 1 second

    // PERFORMANCE OPTIMIZATION: Less frequent life regeneration updates
    setInterval(() => {
      const cache = getCachedData();
      Object.keys(cache).forEach(userId => {
        const cachedData = cache[userId];
        if (cachedData && cachedData.lifePct !== undefined && cachedData.lifePct < 100) {
          domCache.scheduleUpdate(userId);
        }
      });

      // Trigger batched updates
      updateBatcher.schedule();

    }, 5 * 60 * 1000); // Update every 5 MINUTES for life regeneration

    // PERFORMANCE OPTIMIZATION: Periodic cleanup
    setInterval(() => {
      cleanupOldData();
    }, 2 * 60 * 1000); // Clean up every 2 minutes

    // Only recreate buttons and reload cached data on navigation, but don't auto-fetch fresh data
    window.addEventListener('popstate', () => {
      domCache.refreshCache();
      loadCachedData();
      createRefreshButtons();
      // Re-identify faction sides after navigation
      identifyFactionSides();
    });

    // PERFORMANCE OPTIMIZATION: Less aggressive DOM change watcher
    let domChangeTimer = null;
    new MutationObserver(() => {
      // Debounce DOM changes
      if (domChangeTimer) {
        clearTimeout(domChangeTimer);
      }
      domChangeTimer = setTimeout(() => {
        if (!document.querySelector('.ff-refresh-btn')) {
          createRefreshButtons();
        }
        // Refresh cache less frequently
        domCache.refreshCache();
        loadCachedData();
        identifyFactionSides();
      }, 1000); // Wait 1 second before processing DOM changes
    }).observe(document.body, {
      childList: true,
      subtree: false, // Only watch direct children, not deep subtree
      attributes: false // Don't watch attributes here (handled by status observer)
    });
  }
})();