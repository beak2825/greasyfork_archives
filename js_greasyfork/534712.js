// ==UserScript==
// @name         Torn War Pay Calculator
// @namespace    https://greasyfork.org/users/pimpypoo
// @version      4.2
// @description  Calculates war pay for faction members based on chain hits with a subscription system (1 Xanax/week to pimpypoo [3586395], owner [3586395] exempt with unlimited access). Features customizable pay rates, CSV export, subscription status, result sorting, draggable UI (defaults to top, minimizes to toggle button), and improved player ID detection with owner fallback.
// @author       pimpypoo [3586395]
// @match        https://www.torn.com/factions.php?step=your
// @grant        GM_addStyle
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/XXXXX-torn-war-pay-calculator
// @supportURL   https://greasyfork.org/en/scripts/XXXXX-torn-war-pay-calculator/feedback
// @downloadURL https://update.greasyfork.org/scripts/534712/Torn%20War%20Pay%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/534712/Torn%20War%20Pay%20Calculator.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 pimpypoo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
  'use strict';

  const OWNER_ID = 3586395; // pimpypoo's Torn ID
  const ITEM_ID_XANAX = 206; // Xanax item ID
  const XANAX_PER_WEEK = 1; // 1 Xanax for 1 week
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
  const API_BASE = 'https://api.torn.com';
  const UI_ID = 'warpay-container';
  const TRADE_WINDOW = 24 * 60 * 60 * 1000; // 24 hours for trade detection
  const CACHE_DURATION = 5 * 60 * 1000; // Cache API results for 5 minutes

  // Load API keys and manual ID
  let factionKey = localStorage.getItem('factionApiKey');
  let ownerKey = localStorage.getItem('ownerLogKey');
  let manualPlayerId = localStorage.getItem('warpay_manual_id');

  // Get player ID with fallbacks
  const getPlayerId = () => {
    console.log('Attempting to detect player ID');
    if (manualPlayerId) {
      console.log('Using manual player ID:', manualPlayerId);
      return manualPlayerId;
    }

    const selectors = [
      'a.user.name', // Profile link
      'a[href*="XID="]', // Any XID link
      '[data-user-id]', // Data attribute
      '.user-info a[href*="user.php"]', // User info link
      '.faction-info a[href*="profiles.php"]', // Faction profile link
      'a[href*="profiles.php?XID="]', // Profile page link
      '#profile-sidebar a[href*="profiles.php"]' // Sidebar user link (specific to your screenshot)
    ];

    let playerId = null;
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        playerId = element.href?.match(/XID=(\d+)/)?.[1] ||
                   element.getAttribute('data-user-id') ||
                   element.textContent?.match(/\[\d+\]/)?.[0]?.replace(/\[|\]/g, '');
        if (playerId) {
          console.log(`Player ID detected via ${selector}: ${playerId}`);
          return playerId;
        }
      }
    }

    // Fallback: Scan near username or sidebar for [3586395]
    const usernameElement = document.querySelector('#profile-sidebar .name');
    if (usernameElement) {
      const text = usernameElement.textContent || usernameElement.innerText;
      const match = text.match(/\[\d+\]/);
      if (match) {
        playerId = match[0].replace(/\[|\]/g, '');
        console.log(`Player ID detected via username scan: ${playerId}`);
        return playerId;
      }
    }

    console.error('Player ID detection failed, selectors tried:', selectors);
    return null;
  };

  // Prompt for manual ID
  const promptManualId = () => {
    const id = prompt('Player ID detection failed. Enter your Torn player ID (e.g., 3586395):');
    if (id && /^\d+$/.test(id)) {
      localStorage.setItem('warpay_manual_id', id);
      console.log('Manual player ID saved:', id);
      return id;
    }
    console.warn('Invalid manual ID entered:', id);
    return null;
  };

  // Retryable fetch with caching
  const fetchWithRetry = async (url, cacheKey, retries = 2, delay = 1000) => {
    console.log('Fetching:', url);
    const cached = JSON.parse(localStorage.getItem(cacheKey) || '{}');
    if (cached.data && cached.expiry > Date.now()) {
      console.log('Using cached data for:', cacheKey);
      return cached.data;
    }

    for (let i = 0; i <= retries; i++) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log('API response:', data);
        if (!data.error) {
          localStorage.setItem(cacheKey, JSON.stringify({
            data,
            expiry: Date.now() + CACHE_DURATION
          }));
        }
        return data;
      } catch (error) {
        console.error('Fetch attempt', i + 1, 'failed:', error);
        if (i < retries) await new Promise(resolve => setTimeout(resolve, delay));
        else throw error;
      }
    }
  };

  // Check subscription with owner fallback
  const checkAccess = async (playerId) => {
    console.log('Checking access for player:', playerId);
    if (!playerId) {
      console.warn('No player ID detected, defaulting to owner (3586395)');
      playerId = OWNER_ID.toString(); // Fallback to owner if detection fails
    }

    if (parseInt(playerId) === OWNER_ID) {
      console.log('Owner access granted for ID:', playerId);
      return { access: true, message: 'Owner access granted (unlimited).' };
    }

    const subscriptions = JSON.parse(localStorage.getItem('warpaySubscriptions') || '{}');
    const sub = subscriptions[playerId];
    if (sub && sub.expiry > Date.now()) {
      const daysLeft = Math.ceil((sub.expiry - Date.now()) / (24 * 60 * 60 * 1000));
      console.log('Active subscription found, expires in', daysLeft, 'days');
      return { access: true, message: `Subscription active! Expires in ${daysLeft} day(s).` };
    }

    // Skip API check if no ownerKey for owner fallback
    if (!ownerKey) {
      console.warn('No personal API key set, skipping subscription check for owner fallback');
      return { access: true, message: 'Owner access granted (unlimited, no key set).' };
    }

    try {
      const cacheKey = `warpay_log_${playerId}`;
      const data = await fetchWithRetry(
        `${API_BASE}/user/?selections=log&log=trade&key=${ownerKey}`,
        cacheKey
      );

      if (data.error) {
        console.error('API error:', data.error);
        return { access: false, message: `API error: ${data.error.error}. Ensure your personal API key has log access (trade).` };
      }

      const logs = data?.log || {};
      let totalXanax = 0;
      let latest = 0;

      for (const id in logs) {
        const log = logs[id];
        const { type, timestamp, data } = log;
        if (type !== 'trade') continue;

        const isFromUser = parseInt(data?.user_id) === parseInt(playerId);
        const isToOwner = parseInt(data?.receiver_id) === OWNER_ID;
        const tradeTime = timestamp * 1000;
        if (isFromUser && isToOwner && tradeTime > Date.now() - TRADE_WINDOW) {
          const items = data?.items || [];
          const xanaxQty = items.reduce((sum, item) => sum + (parseInt(item.ID) === ITEM_ID_XANAX ? item.quantity : 0), 0);
          totalXanax += xanaxQty;
          if (tradeTime > latest) latest = tradeTime;
          console.log('Found valid trade:', { id, xanaxQty, tradeTime });
        }
      }

      if (totalXanax >= XANAX_PER_WEEK) {
        const expiry = latest + (totalXanax / XANAX_PER_WEEK) * MS_PER_WEEK;
        subscriptions[playerId] = { expiry };
        localStorage.setItem('warpaySubscriptions', JSON.stringify(subscriptions));
        const daysLeft = Math.ceil((expiry - Date.now()) / (24 * 60 * 60 * 1000));
        console.log('Subscription activated, valid for', daysLeft, 'days');
        return { access: true, message: `Subscription activated! Valid for ${daysLeft} day(s).` };
      }

      console.log('No valid Xanax trade found for player:', playerId);
      return {
        access: false,
        message: `No valid Xanax trade found. Send ${XANAX_PER_WEEK} Xanax to pimpypoo [${OWNER_ID}] via trade (within 24 hours).`
      };
    } catch (error) {
      console.error('Check access error:', error);
      return { access: false, message: 'Error checking subscription. Check your internet or try again.' };
    }
  };

  // Make element draggable
  const makeDraggable = (element) => {
    console.log('Initializing draggable for element:', element);
    let isDragging = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;

    // Load saved position or default to top
    const positionKey = 'warpay_ui_position';
    const savedPos = JSON.parse(localStorage.getItem(positionKey) || '{}');
    if (savedPos.left !== undefined && savedPos.top !== undefined) {
      currentX = savedPos.left;
      currentY = savedPos.top;
      element.style.left = currentX + 'px';
      element.style.top = currentY + 'px';
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      console.log('Loaded saved position:', { left: currentX, top: currentY });
    } else {
      element.style.right = '10px';
      element.style.top = '10px';
      element.style.left = 'auto';
      element.style.bottom = 'auto';
      console.log('Set default position: top: 10px; right: 10px');
    }

    const dragStart = (e) => {
      console.log('Drag start: mousedown');
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
      isDragging = true;
      element.style.transition = 'none';
      e.preventDefault();
    };

    const dragMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.clientX - initialX;
      const y = e.clientY - initialY;

      currentX = Math.max(0, Math.min(x, window.innerWidth - element.offsetWidth));
      currentY = Math.max(0, Math.min(y, window.innerHeight - element.offsetHeight));

      element.style.left = currentX + 'px';
      element.style.top = currentY + 'px';
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      console.log('Dragging to:', { left: currentX, top: currentY });
    };

    const dragEnd = () => {
      console.log('Drag end, saving position:', { left: currentX, top: currentY });
      isDragging = false;
      element.style.transition = 'all 0.2s ease';
      try {
        localStorage.setItem(positionKey, JSON.stringify({
          left: currentX,
          top: currentY
        }));
      } catch (error) {
        console.error('Error saving position:', error);
      }
    };

    const dragHandle = element.querySelector('#drag-handle');
    if (dragHandle) {
      dragHandle.style.cursor = 'move';
      dragHandle.addEventListener('mousedown', dragStart);
    } else {
      console.warn('Drag handle not found');
    }

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
  };

  // Build main UI
  const buildUI = (statusMessage, playerId) => {
    if (document.getElementById(UI_ID)) return;

    console.log('Building main UI');
    const wrapper = document.createElement('div');
    wrapper.id = UI_ID;
    wrapper.innerHTML = `
      <div id="warpay-main" style="position:absolute;background:#111;color:#fff;padding:1rem;border-radius:12px;z-index:9999;max-width:350px;box-shadow:0 0 10px #000;font-family:sans-serif;transition:all 0.2s ease">
        <h3 id="drag-handle" style="margin:0 0 10px;cursor:move;">💸 War Pay Calculator</h3>
        <p id="status" style="font-size:0.8em;margin:0 0 10px;color:#ffc107">${statusMessage}</p>
        <p style="font-size:0.8em;margin:0 0 10px;color:#aaa">Detected ID: ${playerId || 'None'} <button id="override-id" style="padding:2px 5px;font-size:0.7em;background:#6c757d;color:white;border:none;border-radius:3px;cursor:pointer">Override</button></p>
        <label>Pay per hit ($):</label>
        <input id="pay-rate" type="number" placeholder="e.g. 50000" style="width:100%;margin:5px 0;padding:5px">
        <div style="display:flex;gap:5px;margin-bottom:10px">
          <button id="calc-pay" style="flex:1;padding:5px;background:#28a745;color:white;border:none;border-radius:5px;cursor:pointer">Calculate</button>
          <button id="sort-pay" style="flex:1;padding:5px;background:#17a2b8;color:white;border:none;border-radius:5px;cursor:pointer">Sort by Pay</button>
        </div>
        <pre id="output" style="margin:0 0 10px;font-size:0.9em;white-space:pre-wrap;max-height:200px;overflow:auto;background:#222;padding:5px;border-radius:5px"></pre>
        <div style="display:flex;gap:5px">
          <button id="download-csv" style="flex:1;padding:5px;background:#007bff;color:white;border:none;border-radius:5px;cursor:pointer">📥 Export CSV</button>
          <button id="settings" style="flex:1;padding:5px;background:#6c757d;color:white;border:none;border-radius:5px;cursor:pointer">⚙️ Settings</button>
        </div>
        <button id="check-sub" style="width:100%;margin:5px 0;padding:5px;background:#ffc107;color:black;border:none;border-radius:5px;cursor:pointer">🔄 Check Subscription</button>
        <button id="minimize-ui" style="width:100%;padding:5px;background:#dc3545;color:white;border:none;border-radius:5px;cursor:pointer">Minimize</button>
      </div>
    `;

    document.body.appendChild(wrapper);
    const uiElement = wrapper.querySelector('#warpay-main');
    makeDraggable(uiElement);

    document.getElementById('calc-pay').onclick = async () => {
      const rate = parseInt(document.getElementById('pay-rate').value);
      if (!rate) return alert('Enter a valid pay amount.');
      const currentPlayerId = getPlayerId();
      if (!currentPlayerId) return alert('Could not detect player ID.');
      document.getElementById('output').textContent = 'Checking access...';
      const { access, message } = await checkAccess(currentPlayerId);
      document.getElementById('status').textContent = message;
      if (access) {
        calculatePay(rate);
      } else {
        document.getElementById('output').textContent = message;
      }
    };

    document.getElementById('sort-pay').onclick = () => {
      if (!window.warpayData) return alert('Calculate war pay first.');
      const sorted = window.warpayData.slice().sort((a, b) => {
        const payA = parseInt(a.match(/\$([\d,]+)/)?.[1].replace(/,/g, '') || 0);
        const payB = parseInt(b.match(/\$([\d,]+)/)?.[1].replace(/,/g, '') || 0);
        return payB - payA;
      });
      document.getElementById('output').textContent = sorted.join('\n');
    };

    document.getElementById('download-csv').onclick = () => {
      downloadCSV();
    };

    document.getElementById('settings').onclick = () => {
      showSettings();
    };

    document.getElementById('check-sub').onclick = async () => {
      const currentPlayerId = getPlayerId();
      if (!currentPlayerId) return alert('Could not detect player ID.');
      document.getElementById('output').textContent = 'Checking subscription...';
      const { access, message } = await checkAccess(currentPlayerId);
      document.getElementById('status').textContent = message;
      document.getElementById('output').textContent = message;
    };

    document.getElementById('minimize-ui').onclick = () => {
      console.log('Minimizing UI');
      wrapper.querySelector('#warpay-main').style.display = 'none';
      showToggleButton();
    };

    document.getElementById('override-id').onclick = () => {
      const newId = promptManualId();
      if (newId) {
        localStorage.setItem('warpay_manual_id', newId);
        wrapper.remove();
        initializeScript();
      }
    };
  };

  // Show toggle button
  const showToggleButton = () => {
    if (document.getElementById('warpay-toggle')) return;
    console.log('Showing toggle button');
    const toggle = document.createElement('div');
    toggle.id = 'warpay-toggle';
    toggle.innerHTML = `
      <div style="position:absolute;background:#111;color:#fff;padding:5px;border-radius:5px;z-index:9999;cursor:move;box-shadow:0 0 5px #000;font-family:sans-serif">
        <h4 id="drag-handle" style="margin:0;font-size:0.9em;">💸 War Pay</h4>
        <button id="restore-ui" style="padding:3px;background:#28a745;color:white;border:none;border-radius:3px;cursor:pointer;font-size:0.8em">Restore</button>
      </div>
    `;
    document.body.appendChild(toggle);
    const toggleElement = toggle.querySelector('div');
    makeDraggable(toggleElement);

    document.getElementById('restore-ui').onclick = () => {
      console.log('Restoring UI');
      toggle.remove();
      const wrapper = document.getElementById(UI_ID);
      if (wrapper) wrapper.querySelector('#warpay-main').style.display = 'block';
    };
  };

  // Show settings panel
  const showSettings = () => {
    const settingsId = 'warpay-settings';
    if (document.getElementById(settingsId)) return;

    console.log('Showing settings panel');
    const wrapper = document.createElement('div');
    wrapper.id = settingsId;
    wrapper.innerHTML = `
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#111;color:#fff;padding:1rem;border-radius:12px;z-index:10000;max-width:400px;box-shadow:0 0 10px #000;font-family:sans-serif">
        <h3 style="margin:0 0 10px;">⚙️ Settings</h3>
        <label>Faction API Key:</label>
        <input id="faction-key" type="text" value="${factionKey || ''}" style="width:100%;margin:5px 0;padding:5px">
        <label>Personal API Key:</label>
        <input id="owner-key" type="text" value="${ownerKey || ''}" style="width:100%;margin:5px 0;padding:5px">
        <p style="font-size:0.8em;color:#ffc107">Get keys from Torn’s API settings. Faction key needs chainreport; personal key needs log (trade).</p>
        <div style="display:flex;gap:5px">
          <button id="save-keys" style="flex:1;padding:5px;background:#28a745;color:white;border:none;border-radius:5px;cursor:pointer">Save</button>
          <button id="clear-keys" style="flex:1;padding:5px;background:#dc3545;color:white;border:none;border-radius:5px;cursor:pointer">Clear Keys</button>
        </div>
        <button id="close-settings" style="width:100%;margin-top:5px;padding:5px;background:#6c757d;color:white;border:none;border-radius:5px;cursor:pointer">Close</button>
      </div>
    `;

    document.body.appendChild(wrapper);

    document.getElementById('save-keys').onclick = () => {
      const newFactionKey = document.getElementById('faction-key').value.trim();
      const newOwnerKey = document.getElementById('owner-key').value.trim();
      if (newFactionKey) localStorage.setItem('factionApiKey', newFactionKey);
      if (newOwnerKey) localStorage.setItem('ownerLogKey', newOwnerKey);
      factionKey = newFactionKey || factionKey;
      ownerKey = newOwnerKey || ownerKey;
      alert('Keys saved! Refresh the page to apply.');
      wrapper.remove();
    };

    document.getElementById('clear-keys').onclick = () => {
      localStorage.removeItem('factionApiKey');
      localStorage.removeItem('ownerLogKey');
      localStorage.removeItem('warpaySubscriptions');
      localStorage.removeItem('warpay_ui_position');
      localStorage.removeItem('warpay_manual_id');
      alert('Keys, subscriptions, UI position, and manual ID cleared! Refresh the page.');
      wrapper.remove();
    };

    document.getElementById('close-settings').onclick = () => {
      wrapper.remove();
    };
  };

  // Calculate war pay
  const calculatePay = async (rate) => {
    console.log('Calculating war pay with rate:', rate);
    try {
      document.getElementById('output').textContent = 'Fetching faction data...';
      const cacheKey = 'warpay_chainreport';
      const data = await fetchWithRetry(
        `${API_BASE}/faction/?selections=chainreport&key=${factionKey}`,
        cacheKey
      );

      if (data.error) {
        console.error('Chainreport API error:', data.error);
        document.getElementById('output').textContent = `API error: ${data.error.error}. Ensure your faction API key has chainreport access.`;
        return;
      }

      const chainReport = data.chainreport || {};
      const output = [];
      let totalPay = 0;

      for (const memberId in chainReport) {
        const hits = chainReport[memberId].hits || 0;
        const pay = hits * rate;
        totalPay += pay;
        output.push(`${memberId}: ${hits} hits = $${pay.toLocaleString()}`);
      }

      output.push(`Total Pay: $${totalPay.toLocaleString()}`);
      document.getElementById('output').textContent = output.join('\n');
      window.warpayData = output;
      console.log('War pay calculated:', output);
    } catch (error) {
      console.error('Calculate pay error:', error);
      document.getElementById('output').textContent = 'Error calculating war pay. Check your internet or try again.';
    }
  };

  // Download CSV
  const downloadCSV = () => {
    console.log('Downloading CSV');
    if (!window.warpayData) return alert('No data to export. Calculate war pay first.');
    const csv = 'Player ID,Hits,Pay\n' + window.warpayData.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'warpay.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Initialize script
  const initializeScript = async () => {
    console.log('Script initializing');
    let playerId = getPlayerId();
    if (!playerId) {
      console.warn('No player ID detected, defaulting to owner (3586395)');
      playerId = OWNER_ID.toString(); // Fallback to owner
    }

    const { access, message } = await checkAccess(playerId);
    if (access) {
      buildUI(message, playerId);
    } else {
      console.log('Building subscription prompt UI');
      const wrapper = document.createElement('div');
      wrapper.id = UI_ID;
      wrapper.innerHTML = `
        <div id="warpay-main" style="position:absolute;background:#111;color:#fff;padding:1rem;border-radius:12px;z-index:9999;max-width:350px;box-shadow:0 0 10px #000;font-family:sans-serif;transition:all 0.2s ease">
          <h3 id="drag-handle" style="margin:0 0 10px;cursor:move;">💸 War Pay Calculator</h3>
          <p style="font-size:0.9em;margin:0 0 10px">${message}</p>
          <p style="font-size:0.8em;margin:0 0 10px;color:#aaa">Detected ID: ${playerId || 'None'} <button id="override-id" style="padding:2px 5px;font-size:0.7em;background:#6c757d;color:white;border:none;border-radius:3px;cursor:pointer">Override</button></p>
          <button id="check-sub" style="width:100%;padding:5px;background:#ffc107;color:black;border:none;border-radius:5px;cursor:pointer">🔄 Check Subscription</button>
          <button id="minimize-ui" style="width:100%;margin-top:5px;padding:5px;background:#dc3545;color:white;border:none;border-radius:5px;cursor:pointer">Minimize</button>
        </div>
      `;
      document.body.appendChild(wrapper);

      const uiElement = wrapper.querySelector('#warpay-main');
      makeDraggable(uiElement);

      document.getElementById('check-sub').onclick = async () => {
        wrapper.querySelector('#check-sub').textContent = 'Checking...';
        const currentPlayerId = getPlayerId();
        const { access, message } = await checkAccess(currentPlayerId || OWNER_ID.toString());
        wrapper.querySelector('#check-sub').textContent = '🔄 Check Subscription';
        wrapper.querySelector('p:not([style*="color:#aaa"])').textContent = message;
        if (access) {
          wrapper.remove();
          buildUI(message, currentPlayerId || OWNER_ID.toString());
        }
      };

      document.getElementById('minimize-ui').onclick = () => {
        console.log('Minimizing subscription prompt UI');
        wrapper.querySelector('#warpay-main').style.display = 'none';
        showToggleButton();
      };

      document.getElementById('override-id').onclick = () => {
        const newId = promptManualId();
        if (newId) {
          localStorage.setItem('warpay_manual_id', newId);
          wrapper.remove();
          initializeScript();
        }
      };
    }
  };

  // Wait for DOM to load
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting script');
    initializeScript();
  });

  // Fallback in case DOMContentLoaded already fired
  if (document.readyState !== 'loading') {
    console.log('DOM already loaded, starting script immediately');
    initializeScript();
  }
})();