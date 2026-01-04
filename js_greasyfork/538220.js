// ==UserScript==
// @name         Torn Chain Tracker
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Torn chain tracker that prompts for and stores your API key.
// @match        https://www.torn.com/*
// @match        https://pda.torn.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-end
// @author       aquagloop
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538220/Torn%20Chain%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/538220/Torn%20Chain%20Tracker.meta.js
// ==/UserScript==

(function () {
  const POLL_INTERVAL_MS = 2000;
  const ALERT_THRESHOLD = 105;
  const DEFAULT_BG = 'rgba(30, 30, 30, 0.85)';
  const ALERT_BG = 'rgba(200, 30, 30, 0.85)';
  const POS_STORAGE_KEY = 'chainTrackerPos';
  const API_KEY_STORAGE_KEY = 'chainTrackerApiKey';

  let apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  const isMobileLayout = window.matchMedia('(max-width: 767px)').matches;

  const container = document.createElement('div');
  Object.assign(container.style, isMobileLayout
    ? {
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: DEFAULT_BG,
        color: '#fff',
        padding: '10px',
        borderRadius: '8px',
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '14px',
        zIndex: '9999',
        maxWidth: '90%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        userSelect: 'none',
        touchAction: 'none'
      }
    : {
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: DEFAULT_BG,
        color: '#fff',
        padding: '12px 18px',
        borderRadius: '8px',
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '13px',
        zIndex: '9999',
        width: '220px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        userSelect: 'none'
      }
  );

  const title = document.createElement('div');
  title.textContent = isMobileLayout ? 'Chain Tracker' : 'Faction Chain Tracker';
  Object.assign(title.style, {
    fontWeight: '600',
    marginBottom: isMobileLayout ? '8px' : '10px',
    textAlign: 'center',
    fontSize: isMobileLayout ? '16px' : '14px',
    cursor: 'move'
  });
  container.appendChild(title);

  const chainDisplayArea = document.createElement('div');
  const chainLabel = document.createElement('div');
  const timeoutLabel = document.createElement('div');

  Object.assign(chainLabel.style, { fontSize: isMobileLayout ? '15px' : '13px', marginBottom: '6px' });
  Object.assign(timeoutLabel.style, { fontSize: isMobileLayout ? '15px' : '13px' });

  chainDisplayArea.appendChild(chainLabel);
  chainDisplayArea.appendChild(timeoutLabel);
  container.appendChild(chainDisplayArea);
  document.body.appendChild(container);

  let currentChain = 0;
  let timeoutValue = 0;
  let localTimer = 0;

  function formatTime(sec) {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    const parts = [];
    if (hrs > 0) parts.push(String(hrs).padStart(2, '0'));
    parts.push(String(mins).padStart(2, '0'));
    parts.push(String(secs).padStart(2, '0'));
    return parts.join(':');
  }

  function updateDisplay() {
    chainLabel.textContent = `Chain: ${currentChain}`;
    timeoutLabel.textContent = `Timeout: ${formatTime(localTimer)}`;
    container.style.backgroundColor =
      localTimer > 0 && localTimer <= ALERT_THRESHOLD ? ALERT_BG : DEFAULT_BG;
  }
  
  function showMessage(line1, line2 = '') {
      currentChain = 0;
      localTimer = 0;
      chainLabel.textContent = line1;
      timeoutLabel.textContent = line2;
      container.style.backgroundColor = DEFAULT_BG;
  }

  function fetchChainData() {
    if (!apiKey) {
      showMessage('No API Key', 'Click title to set');
      return;
    }

    const API_URL = `https://api.torn.com/faction/?selections=chain&key=${apiKey}`;
    GM_xmlhttpRequest({
      method: 'GET',
      url: API_URL,
      onload(response) {
        try {
          const data = JSON.parse(response.responseText);
          if (data.error) {
              showMessage(`API Error: ${data.error.code}`, 'Click title to fix');
              console.error('Torn API Error:', data.error.error);
              return;
          }
          if (data.chain) {
            const newChain = data.chain.current;
            const newTimeout = data.chain.timeout;
            if (newChain !== currentChain || newTimeout !== timeoutValue) {
              currentChain = newChain;
              timeoutValue = newTimeout;
              localTimer = timeoutValue;
              updateDisplay();
            }
          }
        } catch (e) {
            showMessage('Error parsing data');
            console.error('Failed to parse API response:', e);
        }
      },
      onerror() {
          showMessage('Network Error', 'Could not reach API');
      }
    });
  }

  function startTracker() {
    fetchChainData();
    setInterval(fetchChainData, POLL_INTERVAL_MS);
    setInterval(() => {
      if (localTimer > 0) {
        localTimer -= 1;
        if (localTimer < 0) localTimer = 0;
        updateDisplay();
      }
    }, 1000);
  }
  
  function promptAndStoreApiKey() {
      const newKey = prompt('Please enter your Torn API key:', apiKey || '');
      if (newKey && newKey.trim()) {
          apiKey = newKey.trim();
          localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
          showMessage('API Key Saved!', 'Fetching data...');
          fetchChainData();
          return true;
      }
      return false;
  }

  const savedPosJSON = localStorage.getItem(POS_STORAGE_KEY);
  if (savedPosJSON) {
    try {
      const pos = JSON.parse(savedPosJSON);
      if (pos.top && pos.left) {
        container.style.top = pos.top;
        container.style.left = pos.left;
        container.style.right = 'auto';
      }
    } catch {}
  }
  
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  function onPointerMove(x, y) {
    if (!isDragging) return;
    const newLeft = x - dragOffsetX;
    const newTop = y - dragOffsetY;
    container.style.left = `${newLeft}px`;
    container.style.top = `${newTop}px`;
    container.style.right = 'auto';
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('touchmove', touchMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    document.removeEventListener('touchend', touchEndHandler);
    const pos = { top: container.style.top, left: container.style.left };
    localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(pos));
  }

  function mouseMoveHandler(e) { onPointerMove(e.clientX, e.clientY); }
  function touchMoveHandler(e) { if (e.touches.length > 0) onPointerMove(e.touches[0].clientX, e.touches[0].clientY); }
  function mouseUpHandler() { onPointerUp(); }
  function touchEndHandler() { onPointerUp(); }
  
  const startDrag = (x, y) => {
      isDragging = true;
      const rect = container.getBoundingClientRect();
      dragOffsetX = x - rect.left;
      dragOffsetY = y - rect.top;
  }

  title.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  title.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
    document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    document.addEventListener('touchend', touchEndHandler);
  });
  
  title.style.cursor = 'move';
  const titleClickable = document.createElement('div');
  Object.assign(titleClickable.style, { cursor: 'pointer' });
  title.appendChild(titleClickable);
  title.addEventListener('click', (e) => {
      if (!isDragging) {
          promptAndStoreApiKey();
      }
  });

  if (apiKey) {
      startTracker();
  } else {
      showMessage('No API Key', 'Click title to set');
  }
})();