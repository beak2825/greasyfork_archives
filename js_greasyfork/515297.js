// ==UserScript==
// @name    Ozonetel Timer Script
// @namespace  http://tampermonkey.net/
// @version   1.1.3
// @description Timer, break tracking, and disposition alerts for Ozonetel with statistics display
// @match    https://in-ccaas.ozonetel.com/*
// @grant    none
// @author   Melvin Benedict
// @downloadURL https://update.greasyfork.org/scripts/515297/Ozonetel%20Timer%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/515297/Ozonetel%20Timer%20Script.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Constants
  const STORAGE_KEY = 'ozonetelTimerState';
  const UPDATE_INTERVAL = 5000;
  const SAVE_INTERVAL = 300000;
  const DISPOSITION_WARNING_TIME = 30000;
  const DISPOSITION_ALERT_TIME = 80000;

  // CSS Constants
  const COLORS = {
    primary: '#2563EB',   // Modern blue
    primaryHover: '#1D4ED8',
    secondary: '#1E40AF',
    text: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.2)'
  };

  // UI Config
  const UI_CONFIG = {
    timerDisplay: {
      styles: {
        position: 'fixed',
        bottom: '20px',
        left: '40px',
        padding: '12px 20px',
        backgroundColor: COLORS.primary,
        color: COLORS.text,
        borderRadius: '12px',
        zIndex: '1000',
        fontSize: '18px',
        fontWeight: '500',
        boxShadow: `0 4px 15px ${COLORS.shadow}`,
        cursor: 'pointer',
        transition: 'all 0.7s ease',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    },
    collapseButton: {
      styles: {
        position: 'fixed',
        bottom: '20px',
        left: '10px',
        padding: '8px',
        backgroundColor: COLORS.secondary,
        color: COLORS.text,
        borderRadius: '30%',
        zIndex: '1001',
        fontSize: '24px',
        fontWeight: 'bold',
        boxShadow: `0 4px 15px ${COLORS.shadow}`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        userSelect: 'none'
      }
    },
    statsPanel: {
      styles: {
        position: 'absolute',
        bottom: '90px',
        left: '20px',
        padding: '20px',
        backgroundColor: COLORS.secondary,
        color: COLORS.text,
        borderRadius: '12px',
        zIndex: '999',
        fontSize: '14px',
        display: 'none',
        minWidth: '320px',
        maxHeight: '70vh',
        overflowY: 'auto',
        boxShadow: `0 4px 20px ${COLORS.shadow}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateY(10px)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }
    }
  };

  // State management
  const state = {
    timer: {
      display: null,
      statsPanel: null,
      interval: null,
      loginTime: 0,
      startTime: null,
      currentBreakStart: null,
      breaks: [],
      showingStats: false,
      totalBreakTime: 0,
      isOnBreak: false // New flag to track break status
    },
    disposition: {
      buttonFound: false,
      notificationSent: false,
      audioPlayed: false,
      startTime: null,
      audio: null
    }
  };

  function initialize() {
    console.log('Initializing Ozonetel Timer Script...');
    createUIElements();
    loadSavedState();
    setupEventListeners();
    initializeAudio();
    console.log('Initialization complete');
  }

  function createUIElements() {
    // Timer Display with icon
    state.timer.display = createElement('div', UI_CONFIG.timerDisplay.styles);
    state.timer.display.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span>Login Time: 00:00:00</span>
    `;

    // Collapse Button
    const collapseButton = createElement('div', UI_CONFIG.collapseButton.styles);
    collapseButton.innerHTML = '⏳';
    collapseButton.addEventListener('click', toggleTimerDisplay);

    // Stats Panel with modern layout
    state.timer.statsPanel = createElement('div', UI_CONFIG.statsPanel.styles);
    state.timer.statsPanel.innerHTML = `
      <div style="margin-bottom: 20px; font-size: 18px; font-weight: 600;">Activity Statistics</div>
      <div class="stat-item" style="margin-bottom: 15px;">
        <div style="color: rgba(255,255,255,0.8);">Login Duration</div>
        <div id="loginTimeDisplay" style="font-size: 16px; font-weight: 500;">00:00:00</div>
      </div>
      <div class="stat-item" style="margin-bottom: 15px;">
        <div style="color: rgba(255,255,255,0.8);">Total Break Time</div>
        <div id="totalBreakTime" style="font-size: 16px; font-weight: 500;">00:00:00</div>
      </div>
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
        <div style="color: rgba(255,255,255,0.8); margin-bottom: 10px;">Break History</div>
        <div id="breakHistoryDisplay" style="font-size: 14px;">No breaks taken yet.</div>
      </div>
    `;

    // Add hover effects
    addHoverEffect(state.timer.display);
    // Append elements to body
    document.body.appendChild(state.timer.display);
    document.body.appendChild(collapseButton);
    document.body.appendChild(state.timer.statsPanel);
    // Add click handler for stats toggle
    state.timer.display.addEventListener('click', toggleStats);
  }

  function toggleTimerDisplay() {
    if (state.timer.display.style.display === 'none' || !state.timer.display.style.display) {
      state.timer.display.style.display = 'flex';
    } else {
      state.timer.display.style.display = 'none';
    }
  }

  function createElement(tag, styles) {
    const element = document.createElement(tag);
    Object.assign(element.style, styles);
    return element;
  }

  function addHoverEffect(element) {
    element.addEventListener('mouseover', () => {
      element.style.backgroundColor = COLORS.primaryHover;
      element.style.transform = 'translateY(-2px)';
    });
    element.addEventListener('mouseout', () => {
      element.style.backgroundColor = COLORS.primary;
      element.style.transform = 'translateY(0)';
    });
  }

  function toggleStats() {
    state.timer.showingStats = !state.timer.showingStats;
    state.timer.statsPanel.style.display = state.timer.showingStats ? 'block' : 'none';
    if (state.timer.showingStats) {
      setTimeout(() => {
        state.timer.statsPanel.style.transform = 'translateY(0)';
        state.timer.statsPanel.style.opacity = '1';
      }, 50);
      updateStatsDisplay();
    } else {
      state.timer.statsPanel.style.transform = 'translateY(10px)';
      state.timer.statsPanel.style.opacity = '0';
    }
  }

  function initializeAudio() {
    state.disposition.audio = new Audio('https://dl.dropboxusercontent.com/scl/fi/ilepbnobrix5g36zd9qiu/mixkit-facility-alarm-908.wav?rlkey=o9dak8j28dqcpir765od9tb6k&st=6zdjcfpf');
    state.disposition.audio.preload = 'none';
  }

  function loadSavedState() {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedState?.loginTime) {
      const restore = confirm("Do you want to restore your previous logged-in time?");
      state.timer.loginTime = restore ? savedState.loginTime : 0;
      if (savedState.breaks && restore) {
        state.timer.breaks = savedState.breaks;
        state.timer.totalBreakTime = savedState.breaks.reduce((a, b) => a + b, 0);
      }
      updateDisplay();
    }
  }

  function setupEventListeners() {
    window.addEventListener('beforeunload', saveState);
    setInterval(detectLoginState, UPDATE_INTERVAL);
    setInterval(detectDisposition, UPDATE_INTERVAL);
    setInterval(saveState, SAVE_INTERVAL);
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      loginTime: state.timer.loginTime,
      breaks: state.timer.breaks,
      totalBreakTime: state.timer.totalBreakTime
    }));
  }

  function startTimer() {
    if (!state.timer.interval) {
      state.timer.startTime = Date.now() - (state.timer.loginTime * 1000);
      state.timer.interval = setInterval(updateTimer, 1000);
    }
  }

  function stopTimer() {
    if (state.timer.interval) {
      clearInterval(state.timer.interval);
      state.timer.interval = null;
    }
  }

  function updateTimer() {
    state.timer.loginTime = Math.floor((Date.now() - state.timer.startTime) / 1000);
    updateDisplay();
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600) % 24;
    const minutes = Math.floor(seconds / 60) % 60;
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateDisplay() {
    const timeStr = formatTime(state.timer.loginTime);
    state.timer.display.querySelector('span').textContent = `Login Time: ${timeStr}`;
    if (state.timer.showingStats) {
      document.getElementById('loginTimeDisplay').textContent = timeStr;
    }
  }

  function detectLoginState() {
    const icons = document.querySelectorAll('i.material-icons');
    let foundPlayIcon = false;
    let foundPauseIcon = false;
    icons.forEach(icon => {
      const iconText = icon.textContent?.trim();
      if (iconText?.includes("pause_circle_outline")) {
        foundPauseIcon = true;
      } else if (icon.classList.contains("ready") && iconText?.includes("play_circle_outline")) {
        foundPlayIcon = true;
      }
    });
    // Break detection logic
    if (foundPlayIcon && !state.timer.isOnBreak) {
      // Agent went on break
      startBreak();
      state.timer.isOnBreak = true;
      stopTimer();
    } else if (foundPauseIcon && state.timer.isOnBreak) {
      // Agent returned from break
      endBreak();
      state.timer.isOnBreak = false;
      startTimer();
    } else if (foundPauseIcon) {
      // Normal working state
      startTimer();
    }
  }

  function startBreak() {
    console.log('Break started');
    state.timer.currentBreakStart = Date.now();
    // Visual indication of break status
    state.timer.display.style.backgroundColor = '#DC2626'; // Red color during break
  }

  function endBreak() {
    if (state.timer.currentBreakStart) {
      const breakDuration = (Date.now() - state.timer.currentBreakStart) / 1000;
      console.log('Break ended, duration:', breakDuration);
      state.timer.breaks.push(breakDuration);
      state.timer.totalBreakTime += breakDuration;
      state.timer.currentBreakStart = null;
      updateStatsDisplay();
      // Reset timer display color
      state.timer.display.style.backgroundColor = COLORS.primary;
    }
  }

  function detectDisposition() {
    const button = document.querySelector('button.btn.btn-lg.btn-secondary.rounded-0');
    if (button) {
      if (!state.disposition.buttonFound) {
        state.disposition.buttonFound = true;
        state.disposition.startTime = Date.now();
        return;
      }
      const elapsedTime = Date.now() - state.disposition.startTime;
      if (elapsedTime >= DISPOSITION_WARNING_TIME && !state.disposition.notificationSent) {
        showNotification();
        state.disposition.notificationSent = true;
      }
      if (elapsedTime >= DISPOSITION_ALERT_TIME && !state.disposition.audioPlayed) {
        playDispositionAlert();
      }
    } else {
      resetDispositionState();
    }
  }

  function playDispositionAlert() {
    state.disposition.audio.load();
    state.disposition.audio.play().catch(error => console.error('Audio playback failed:', error));
    state.disposition.audioPlayed = true;
  }

  function resetDispositionState() {
    Object.assign(state.disposition, {
      buttonFound: false,
      notificationSent: false,
      audioPlayed: false,
      startTime: null
    });
  }

  function showNotification() {
    if (!("Notification" in window)) return;
    Notification.requestPermission()
      .then(permission => {
        if (permission === "granted") {
          new Notification("Disposition Alert", {
            body: "Disposition Pending!",
            icon: 'https://example.com/icon.png'
          }).onclick = function() {
            window.focus();
            this.close();
          };
        }
      })
      .catch(error => console.error('Notification error:', error));
  }

  function updateStatsDisplay() {
    if (!state.timer.showingStats) return;
    const breakHistory = state.timer.breaks.map((breakTime, index) => `
      <div style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1)">
        <span style="color: rgba(255,255,255,0.7)">Break ${index + 1}:</span>
        <span style="float: right">${formatTime(Math.floor(breakTime))}</span>
      </div>
    `).join('');
    document.getElementById('breakHistoryDisplay').innerHTML = breakHistory ||
      '<div style="color: rgba(255,255,255,0.6)">No breaks taken yet.</div>';
    document.getElementById('totalBreakTime').textContent = formatTime(Math.floor(state.timer.totalBreakTime));
  }

  // Initialize the script
  initialize();
})();
