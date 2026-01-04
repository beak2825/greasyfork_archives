// ==UserScript==
// @name     New Ozonetel Timer Script
// @namespace  http://tampermonkey.net/
// @version   1.1.1
// @description Timer, break tracking, and disposition alerts for Ozonetel with statistics display
// @match    https://agent.cloudagent.ozonetel.com/*
// @grant    GM_xmlhttpRequest
// @license  MIT
// @author   Melvin Benedict
// @downloadURL https://update.greasyfork.org/scripts/521024/New%20Ozonetel%20Timer%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/521024/New%20Ozonetel%20Timer%20Script.meta.js
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
  primary: '#3D8BF8',   // Bright blue from the button
  primaryHover: '#357ADC', // Slightly darker shade for hover effect
  secondary: '#2E6CC0', // Even darker shade for accents
  text: '#FFFFFF',      // White text
  shadow: 'rgba(0, 0, 0, 0.2)' // Subtle shadow
};



  // UI Config
  const UI_CONFIG = {
    timerDisplay: {
      styles: {
        position: 'fixed',
        bottom: '20px',
        right: '40px',
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
        right: '8px',
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
        right: '20px',
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
  const pauseButton = document.querySelector('.oz-tb-agentState-pause-icon');
  const playButton = document.querySelector('.oz-tb-agentState-play-icon');
  let foundPlayIcon = false;
  let foundPauseIcon = false;

  // Detect if the pause button is visible (active)
  if (pauseButton && pauseButton.style.display !== 'none') {
    foundPauseIcon = true;
  }

  // Detect if the play button is visible (active)
  if (playButton && playButton.style.display !== 'none') {
    foundPlayIcon = true;
  }

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
    state.timer.display.style.backgroundColor = '#DC2626'; // Red color during break

    // Log "on break" status to Google Sheets (Break Status sheet)
    logToGoogleSheet("on break");

    // Set a timeout to log break time if it crosses one minute
    state.timer.breakTimeout = setTimeout(() => {
        const breakDuration = (Date.now() - state.timer.currentBreakStart) / 1000; // Current break duration in seconds
        if (breakDuration >= 600) {
            logBreakTime(breakDuration); // Log break time to Slack Trigger Sheet
        }
    }, 600000); // Trigger after 1 minute
}

function endBreak() {
    if (state.timer.currentBreakStart) {
        const breakDuration = (Date.now() - state.timer.currentBreakStart) / 1000;
        console.log('Break ended, duration:', breakDuration);
        state.timer.breaks.push(breakDuration);
        state.timer.totalBreakTime += breakDuration;
        state.timer.currentBreakStart = null;

        // Reset timer display color
        state.timer.display.style.backgroundColor = COLORS.primary;

        // Clear the 1-minute timeout if the break ends before 1 minute
        if (state.timer.breakTimeout) {
            clearTimeout(state.timer.breakTimeout);
            state.timer.breakTimeout = null;
        }

        // Log "active" status to Google Sheets (Break Status sheet)
        logToGoogleSheet("active");
    }
}

function logBreakTime(breakDuration) {
    // Get the current timestamp in "YYYY-MM-DD HH:MM:SS" format
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Extract the agent's initials from the avatar element
    const avatarElement = document.querySelector('.MuiAvatar-root.MuiAvatar-circular.MuiAvatar-colorDefault');

    if (avatarElement) {
        // Access the text content of the avatar to get the initials
        const agentInitials = avatarElement.textContent.trim();
        console.log('Agent Initials:', agentInitials); // Logs the initials (e.g., "MB")
    } else {
        console.error('Avatar element not found!');
        return; // Exit early if avatar element is not found
    }

    // Replace with your Web App URL
    const sheetEndpoint = "https://script.google.com/macros/s/AKfycbzqzymoOVct0gRPYr_RYiZmAYM4VPfUSd0FZWrI6PElOV5O4fIiz7nQ8_t_zBchDFlk/exec";

    // Create the POST payload as JSON, including agent initials, break duration, and timestamp
    const postData = {
        agentName: agentInitials,  // Use initials instead of full name
        status: "on break",        // Status should be on break for Slack Trigger sheet
        break_duration: Math.floor(breakDuration), // Log whole seconds
        timestamp: timestamp      // Timestamp when break time was logged
    };

    // Send the request using GM_xmlhttpRequest
    GM_xmlhttpRequest({
        method: "POST",
        url: sheetEndpoint,
        headers: {
            "Content-Type": "application/json" // Specify JSON format
        },
        data: JSON.stringify(postData), // Convert payload to JSON string
        onload: function(response) {
            if (response.status === 200) {
                console.log(`Logged break time successfully for ${agentInitials} at ${timestamp}. Duration: ${breakDuration} seconds.`);
            } else {
                console.error(`Failed to log break time. HTTP status: ${response.status}, Message: ${response.statusText}`);
            }
        },
        onerror: function(error) {
            console.error("Error logging break time:", error);
        }
    });
}

function logToGoogleSheet(status) {
    // Get the current timestamp in "YYYY-MM-DD HH:MM:SS" format
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Extract the agent's initials from the avatar element (for status logging)
    const avatarElement = document.querySelector('.MuiAvatar-root.MuiAvatar-circular.MuiAvatar-colorDefault');
    const agentInitials = avatarElement ? avatarElement.textContent.trim() : 'Unknown Agent';
    console.log('Agent Initials:', agentInitials); // Logs the initials (e.g., "MB")

    // Replace with your Web App URL
    const sheetEndpoint = "https://script.google.com/macros/s/AKfycbzqzymoOVct0gRPYr_RYiZmAYM4VPfUSd0FZWrI6PElOV5O4fIiz7nQ8_t_zBchDFlk/exec";

    // Create the POST payload as JSON, including agent initials, status, and timestamp
    const postData = {
        agentName: agentInitials,  // Use initials instead of full name
        status: status,           // "on break" or "active"
        timestamp: timestamp,     // Timestamp when status was logged
    };

    // Send the request using GM_xmlhttpRequest
    GM_xmlhttpRequest({
        method: "POST",
        url: sheetEndpoint,
        headers: {
            "Content-Type": "application/json" // Specify JSON format
        },
        data: JSON.stringify(postData), // Convert payload to JSON string
        onload: function(response) {
            if (response.status === 200) {
                console.log(`Logged status '${status}' successfully for ${agentInitials} at ${timestamp}.`);
            } else {
                console.error(`Failed to log status. HTTP status: ${response.status}, Message: ${response.statusText}`);
            }
        },
        onerror: function(error) {
            console.error("Error logging status:", error);
        }
    });
}


  function detectDisposition() {
    const button = document.querySelector('button.oz-tb-callback-dialog-save-button.oz-tb-call-end-diposition-button');
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
