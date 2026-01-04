// ==UserScript==
// @name         Auto-Next Chapter
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically clicks the next chapter button after customizable time, continues timer after audio ends, auto-minimizes on inactivity
// @author       You
// @match        https://inovel*.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/533032/Auto-Next%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/533032/Auto-Next%20Chapter.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Configuration
    const DEFAULT_MAX_CHAPTERS = 4; // Default maximum number of chapters
    // Default countdown will be determined based on audio duration or fallback to 7 minutes
 
    // Load user preferences from localStorage or use defaults
    let userSettings = JSON.parse(localStorage.getItem('autoNextSettings')) || {};
    let MAX_CHAPTERS = userSettings.maxChapters || DEFAULT_MAX_CHAPTERS;
    let isMinimized = userSettings.isMinimized || false;
    
    // Initialize with a temporary default that will be updated
    let COUNTDOWN_MINUTES = 7; // Will be updated based on audio duration
 
    // Selector for the next chapter button
    const NEXT_BUTTON_SELECTOR = 'a.nextchap[rel="next"]';
    // Selector for the previous chapter button
    const PREV_BUTTON_SELECTOR = 'a.prevchap[rel="prev"]';
    
    // Auto-minimize settings
    const INACTIVITY_TIMEOUT = 4000; // Auto-minimize after 4 seconds of inactivity
    let inactivityTimer = null;
 
    // Convert minutes to milliseconds (initial value, will be updated)
    let countdownMs = COUNTDOWN_MINUTES * 60 * 1000;
 
    // Chapter counter - initialize or retrieve from session storage
    let chaptersNavigated = parseInt(sessionStorage.getItem('auto_next_chapters_count') || '0');
 
    // Check if this is a "next chapter" page by checking session storage
    const isFirstPage = !sessionStorage.getItem('auto_next_started');
 
    // Timer states
    let isRunning = false;
    let isPaused = false;
    let startTime = 0;
    let endTime = 0;
    let remainingTime = countdownMs;
    let countdownInterval;
    let settingsPanelOpen = false;
    let audioHasEnded = false; // Flag to track if audio ended naturally
 
    // Create main container
    const mainContainer = document.createElement('div');
    mainContainer.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 20px;
        z-index: 9999;
    `;
    document.body.appendChild(mainContainer);
 
    // Create the expanded view container
    const expandedView = document.createElement('div');
    expandedView.className = 'auto-next-expanded';
    expandedView.style.cssText = `
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-size: 16px;
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        min-width: 180px;
        max-width: 250px;
        touch-action: manipulation;
    `;
 
    // Create minimized bubble view with timer
    const bubbleView = document.createElement('div');
    bubbleView.className = 'auto-next-bubble';
    bubbleView.style.cssText = `
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 5px;
    `;
 
    // Create timer icon
    const bubbleIcon = document.createElement('div');
    bubbleIcon.style.cssText = `
        font-size: 20px;
        margin-bottom: 2px;
    `;
    bubbleIcon.innerHTML = '⏱️';
 
    // Create timer text for bubble
    const bubbleTimer = document.createElement('div');
    bubbleTimer.style.cssText = `
        font-size: 12px;
        color: white;
        font-weight: bold;
    `;
    bubbleTimer.textContent = COUNTDOWN_MINUTES + ':00';
 
    bubbleView.appendChild(bubbleIcon);
    bubbleView.appendChild(bubbleTimer);
    
    // Function to reset the inactivity timer
    function resetInactivityTimer() {
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            inactivityTimer = null;
        }
        
        if (!isMinimized) {
            inactivityTimer = setTimeout(() => {
                toggleView(); // Auto-minimize after timeout
            }, INACTIVITY_TIMEOUT);
        }
    }
 
    // Function to toggle between views
    function toggleView() {
        isMinimized = !isMinimized;
        updateViewState();
 
        // Reset inactivity timer when toggling
        resetInactivityTimer();
        
        // Save state
        userSettings.isMinimized = isMinimized;
        localStorage.setItem('autoNextSettings', JSON.stringify(userSettings));
    }
 
    // Function to update the view based on minimized state
    function updateViewState() {
        if (isMinimized) {
            // Show bubble view, hide expanded view
            if (mainContainer.contains(expandedView)) {
                mainContainer.removeChild(expandedView);
            }
            if (!mainContainer.contains(bubbleView)) {
                mainContainer.appendChild(bubbleView);
            }
            
            // Clear any inactivity timer
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
                inactivityTimer = null;
            }
        } else {
            // Show expanded view, hide bubble view
            if (mainContainer.contains(bubbleView)) {
                mainContainer.removeChild(bubbleView);
            }
            if (!mainContainer.contains(expandedView)) {
                mainContainer.appendChild(expandedView);
            }
            
            // Start inactivity timer
            resetInactivityTimer();
        }
    }
 
    // Add click handler to bubble
    bubbleView.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent document click from interfering
        toggleView();
    });
 
    // Create timer text element
    const timerText = document.createElement('div');
    timerText.className = 'timer-text';
    timerText.style.cssText = `
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
        text-align: center;
        width: 100%;
    `;
    timerText.textContent = `Next chapter in: ${COUNTDOWN_MINUTES}:00`;
    expandedView.appendChild(timerText);
 
    // Create chapter counter text element
    const chapterCounterText = document.createElement('div');
    chapterCounterText.className = 'chapter-counter-text';
    chapterCounterText.style.cssText = `
        font-size: 14px;
        color: #ffcc00;
        margin-bottom: 5px;
        text-align: center;
        width: 100%;
    `;
    chapterCounterText.textContent = `Chapters: ${chaptersNavigated}/${MAX_CHAPTERS}`;
    expandedView.appendChild(chapterCounterText);
 
    // Create playback rate display element
    const playbackRateText = document.createElement('div');
    playbackRateText.className = 'playback-rate-text';
    playbackRateText.style.cssText = `
        font-size: 12px;
        color: #8cf;
        margin-bottom: 5px;
        text-align: center;
        width: 100%;
    `;
    const currentPlaybackRate = parseFloat(localStorage.getItem('audio_playback_rate')) || 1.0;
    playbackRateText.textContent = `Playback Speed: ${currentPlaybackRate.toFixed(1)}x`;
    expandedView.appendChild(playbackRateText);
 
    // Create version display
    const versionDisplay = document.createElement('div');
    versionDisplay.style.cssText = `
        color: #aaaaaa;
        font-size: 9px;
        text-align: right;
        width: 100%;
        margin-bottom: 5px;
        font-style: italic;
    `;
    versionDisplay.textContent = `v1.5`;
    expandedView.appendChild(versionDisplay);
 
    // Create settings panel (initially hidden)
    const settingsPanel = document.createElement('div');
    settingsPanel.style.cssText = `
        background-color: rgba(40, 40, 40, 0.95);
        padding: 12px;
        border-radius: 5px;
        margin-top: 8px;
        display: none;
        width: 100%;
    `;
 
    // Create minutes input with label
    const timerSettingContainer = document.createElement('div');
    timerSettingContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    `;
 
    const timerLabel = document.createElement('label');
    timerLabel.textContent = 'Timer (minutes):';
    timerLabel.style.marginRight = '10px';
 
    const timerInput = document.createElement('input');
    timerInput.type = 'number';
    timerInput.min = '0.5';
    timerInput.max = '60';
    timerInput.step = '0.5';
    timerInput.value = COUNTDOWN_MINUTES;
    timerInput.style.cssText = `
        width: 60px;
        background-color: #333;
        color: white;
        border: 1px solid #555;
        border-radius: 3px;
        padding: 4px;
    `;
 
    timerSettingContainer.appendChild(timerLabel);
    timerSettingContainer.appendChild(timerInput);
 
    // Create max chapters input with label
    const maxChaptersContainer = document.createElement('div');
    maxChaptersContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    `;
 
    const maxChaptersLabel = document.createElement('label');
    maxChaptersLabel.textContent = 'Max Chapters:';
    maxChaptersLabel.style.marginRight = '10px';
 
    const maxChaptersInput = document.createElement('input');
    maxChaptersInput.type = 'number';
    maxChaptersInput.min = '1';
    maxChaptersInput.max = '20';
    maxChaptersInput.step = '1';
    maxChaptersInput.value = MAX_CHAPTERS;
    maxChaptersInput.style.cssText = `
        width: 60px;
        background-color: #333;
        color: white;
        border: 1px solid #555;
        border-radius: 3px;
        padding: 4px;
    `;
 
    maxChaptersContainer.appendChild(maxChaptersLabel);
    maxChaptersContainer.appendChild(maxChaptersInput);
 
    // Create save and cancel buttons
    const settingsButtonContainer = document.createElement('div');
    settingsButtonContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    `;
 
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.cssText = `
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 5px 10px;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        cursor: pointer;
        border-radius: 4px;
    `;
 
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
        background-color: #f44336;
        border: none;
        color: white;
        padding: 5px 10px;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        cursor: pointer;
        border-radius: 4px;
    `;
 
    settingsButtonContainer.appendChild(saveButton);
    settingsButtonContainer.appendChild(cancelButton);
 
    // Add components to settings panel
    settingsPanel.appendChild(timerSettingContainer);
    settingsPanel.appendChild(maxChaptersContainer);
    settingsPanel.appendChild(settingsButtonContainer);
 
    // Add settings panel to expanded view
    expandedView.appendChild(settingsPanel);
 
    // Create a button container for all controls
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 5px;
        width: 100%;
    `;
    expandedView.appendChild(buttonContainer);
 
    // Create the main multi-function button (Row 1)
    const actionButton = document.createElement('button');
    actionButton.textContent = isFirstPage ? 'Start' : 'Pause';
    actionButton.style.cssText = `
        background-color: ${isFirstPage ? '#2196F3' : '#4CAF50'};
        border: none;
        color: white;
        padding: 10px 15px;
        text-align: center;
        text-decoration: none;
        font-size: 17px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 6px;
        width: 100%;
    `;
    buttonContainer.appendChild(actionButton);
 
    // Create container for time adjustment buttons (Row 2)
    const adjustButtonsContainer = document.createElement('div');
    adjustButtonsContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 10px;
    `;
 
    // Create -30s button
    const minusButton = document.createElement('button');
    minusButton.textContent = '-30s';
    minusButton.style.cssText = `
        background-color: #FF9800;
        border: none;
        color: white;
        padding: 8px 0;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        cursor: pointer;
        border-radius: 4px;
        flex: 1;
    `;
 
    // Create +30s button
    const plusButton = document.createElement('button');
    plusButton.textContent = '+30s';
    plusButton.style.cssText = `
        background-color: #9C27B0;
        border: none;
        color: white;
        padding: 8px 0;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        cursor: pointer;
        border-radius: 4px;
        flex: 1;
    `;
 
    // Add time adjustment buttons to their container
    adjustButtonsContainer.appendChild(minusButton);
    adjustButtonsContainer.appendChild(plusButton);
    buttonContainer.appendChild(adjustButtonsContainer);
 
    // Create container for minimize and settings buttons (Row 3)
    const controlButtonsContainer = document.createElement('div');
    controlButtonsContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 10px;
    `;
 
    // Create minimize button with text and icon (switched position)
    const minimizeButton = document.createElement('button');
    minimizeButton.innerHTML = '− Minimize';
    minimizeButton.style.cssText = `
        background-color: #607D8B;
        border: none;
        color: white;
        padding: 8px 0;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        cursor: pointer;
        border-radius: 4px;
        flex: 1;
    `;
    minimizeButton.addEventListener('click', toggleView);
 
    // Create settings button with text and icon (switched position)
    const settingsButton = document.createElement('button');
    settingsButton.innerHTML = '⚙️ Settings';
    settingsButton.style.cssText = `
        background-color: #2196F3;
        border: none;
        color: white;
        padding: 8px 0;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        cursor: pointer;
        border-radius: 4px;
        flex: 1;
    `;
 
    // Add minimize and settings buttons to their container (switched order)
    controlButtonsContainer.appendChild(minimizeButton);
    controlButtonsContainer.appendChild(settingsButton);
    buttonContainer.appendChild(controlButtonsContainer);
 
    // Create Stop button (Row 4)
    const stopButton = document.createElement('button');
    stopButton.textContent = '⛔ Stop Permanently';
    stopButton.style.cssText = `
        background-color: #f44336;
        border: none;
        color: white;
        padding: 8px 0;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 4px;
        width: 100%;
        margin-top: 5px;
    `;
    buttonContainer.appendChild(stopButton);
 
    // Create container for navigation buttons (Row 5 - new addition)
    const navButtonsContainer = document.createElement('div');
    navButtonsContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 10px;
        margin-top: 10px;
    `;
 
    // Create Previous Chapter button
    const prevChapterButton = document.createElement('button');
    prevChapterButton.innerHTML = '⬅️ Previous';
    prevChapterButton.style.cssText = `
        background-color: #FF9800;
        border: none;
        color: white;
        padding: 8px 0;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        cursor: pointer;
        border-radius: 4px;
        flex: 1;
    `;
 
    // Create Next Chapter button
    const nextChapterButton = document.createElement('button');
    nextChapterButton.innerHTML = 'Next ➡️';
    nextChapterButton.style.cssText = `
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 8px 0;
        text-align: center;
        text-decoration: none;
        font-size: 14px;
        cursor: pointer;
        border-radius: 4px;
        flex: 1;
    `;
 
    // Add navigation buttons to their container
    navButtonsContainer.appendChild(prevChapterButton);
    navButtonsContainer.appendChild(nextChapterButton);
    buttonContainer.appendChild(navButtonsContainer);
 
    // Function to get audio duration and set default countdown with retry mechanism
    function setTimerFromAudioDuration() {
        let retryCount = 0;
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 1000; // 1 second between retries
        const BUFFER_TIME = 10; // 10 seconds buffer time
        
        function tryGetDuration() {
            const audioElements = document.querySelectorAll('audio');
            if (audioElements.length > 0) {
                // Get the first audio element
                const audio = audioElements[0];
                
                // If duration is already available
                if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
                    // Get current playback rate from localStorage (set by the Audio Controls script)
                    // Default to 1 if not found
                    const playbackRate = parseFloat(localStorage.getItem('audio_playback_rate')) || 1.0;
                    
                    // Set timer to (audio duration ÷ playback speed) + buffer time (converted to minutes)
                    const adjustedDuration = (audio.duration / playbackRate) + BUFFER_TIME;
                    const durationInMinutes = adjustedDuration / 60;
                    COUNTDOWN_MINUTES = Math.ceil(durationInMinutes * 10) / 10; // Round to 1 decimal
                    console.log(`[Auto-Next] Set timer to ${COUNTDOWN_MINUTES} minutes based on audio duration (${audio.duration.toFixed(1)}s) and playback rate (${playbackRate}x) (attempt ${retryCount + 1})`);
                    
                    // Update countdown values
                    countdownMs = COUNTDOWN_MINUTES * 60 * 1000;
                    remainingTime = countdownMs;
                    updateCountdown();
 
                    // Update playback rate display
                    playbackRateText.textContent = `Playback Speed: ${playbackRate.toFixed(1)}x`;
                    
                    return true; // Successfully got duration
                } else {
                    retryCount++;
                    if (retryCount < MAX_RETRIES) {
                        console.log(`[Auto-Next] Couldn't get audio duration, retry ${retryCount}/${MAX_RETRIES}...`);
                        // Try again after delay
                        setTimeout(tryGetDuration, RETRY_DELAY);
                        return false; // Still trying
                    } else {
                        // Max retries reached, use default
                        console.log(`[Auto-Next] Max retries (${MAX_RETRIES}) reached. Using default timer of 7 minutes`);
                        COUNTDOWN_MINUTES = 7;
                        countdownMs = COUNTDOWN_MINUTES * 60 * 1000;
                        remainingTime = countdownMs;
                        updateCountdown();
                        return true; // Finished with fallback value
                    }
                }
            } else {
                // No audio found after retry
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    console.log(`[Auto-Next] No audio found, retry ${retryCount}/${MAX_RETRIES}...`);
                    setTimeout(tryGetDuration, RETRY_DELAY);
                    return false;
                } else {
                    // Max retries reached, use default
                    console.log(`[Auto-Next] No audio found after ${MAX_RETRIES} retries. Using default timer of 7 minutes`);
                    COUNTDOWN_MINUTES = 7;
                    countdownMs = COUNTDOWN_MINUTES * 60 * 1000;
                    remainingTime = countdownMs;
                    updateCountdown();
                    return true;
                }
            }
        }
 
        // Listen for metadata loaded event on any audio that appears
        document.addEventListener('DOMNodeInserted', function(e) {
            if (e.target.tagName === 'AUDIO' || (e.target.querySelector && e.target.querySelector('audio'))) {
                const audio = e.target.tagName === 'AUDIO' ? e.target : e.target.querySelector('audio');
                if (audio) {
                    audio.addEventListener('loadedmetadata', function() {
                        if (!isRunning && !isPaused && retryCount < MAX_RETRIES) {
                            // If timer hasn't started yet and we're still in retry phase
                            tryGetDuration();
                        }
                    });
                }
            }
        });
        
        // Start the first attempt
        tryGetDuration();
    }
 
    // Function to monitor playback rate changes
    function setupPlaybackRateMonitor() {
        // Check localStorage every 2 seconds for playback rate changes
        const playbackRateCheckInterval = setInterval(() => {
            const currentPlaybackRate = parseFloat(localStorage.getItem('audio_playback_rate')) || 1.0;
            const storedPlaybackRate = parseFloat(localStorage.getItem('auto_next_last_playback_rate')) || currentPlaybackRate;
            
            // Update playback rate display regardless of whether it changed
            playbackRateText.textContent = `Playback Speed: ${currentPlaybackRate.toFixed(1)}x`;
            
            // If playback rate has changed significantly (more than 0.01 difference)
            if (Math.abs(currentPlaybackRate - storedPlaybackRate) > 0.01) {
                console.log(`[Auto-Next] Playback rate changed from ${storedPlaybackRate}x to ${currentPlaybackRate}x, adjusting timer...`);
                
                // Store new rate
                localStorage.setItem('auto_next_last_playback_rate', currentPlaybackRate.toString());
                
                // Only adjust timer if it's running
                if (isRunning && !isPaused) {
                    // Calculate ratio of change
                    const ratioChange = storedPlaybackRate / currentPlaybackRate;
                    
                    // Adjust remaining time proportionally
                    // If playback is faster, time should decrease; if slower, time should increase
                    const currentRemainingTime = endTime - Date.now();
                    const adjustedRemainingTime = currentRemainingTime * ratioChange;
                    
                    // Update end time based on adjusted remaining time
                    endTime = Date.now() + adjustedRemainingTime;
                    remainingTime = adjustedRemainingTime;
                    
                    // Update display immediately
                    updateCountdown();
                    console.log(`[Auto-Next] Timer adjusted to ${Math.floor(remainingTime / 60000)}:${Math.floor((remainingTime % 60000) / 1000).toString().padStart(2, '0')}`);
                }
            }
        }, 2000); // Check every 2 seconds
        
        // Store initial playback rate
        const initialPlaybackRate = parseFloat(localStorage.getItem('audio_playback_rate')) || 1.0;
        localStorage.setItem('auto_next_last_playback_rate', initialPlaybackRate.toString());
    }
 
    // Function to set up audio state listeners
    function setupAudioStateListeners() {
        const audioElements = document.querySelectorAll('audio');
        if (audioElements.length > 0) {
            const audio = audioElements[0];
            
            // Listen for play events
            audio.addEventListener('play', function() {
                console.log('[Auto-Next] Audio play event detected');
                // Start timer if not running yet
                if (!isRunning && !isPaused) {
                    startTimer();
                    console.log('[Auto-Next] Starting timer because audio is playing');
                }
                // Resume timer if it was paused
                else if (isPaused && !isRunning) {
                    resumeTimer();
                    console.log('[Auto-Next] Resuming timer because audio is playing');
                }
                
                // Reset ended state if playing again
                audioHasEnded = false;
            });
            
            // Listen for pause events - only pause timer if it's not ended
            audio.addEventListener('pause', function() {
                console.log('[Auto-Next] Audio pause event detected');
                
                // Check if this is from the ended event
                if (audioHasEnded) {
                    console.log('[Auto-Next] Ignoring pause event because audio has ended naturally');
                    return; // Don't pause the timer if audio ended naturally
                }
                
                // Only pause timer if it was manually paused
                if (isRunning && !isPaused) {
                    pauseTimer();
                    console.log('[Auto-Next] Pausing timer because audio is paused manually');
                }
            });
            
            // Listen for ended events - CRITICAL: don't pause timer when audio ends naturally
            audio.addEventListener('ended', function() {
                console.log('[Auto-Next] Audio ended event detected');
                // Mark that audio ended naturally
                audioHasEnded = true;
                
                // IMPORTANT: We DO NOT pause the timer here
                console.log('[Auto-Next] Audio ended naturally, timer continues running');
                
                // If timer isn't running for some reason, start it
                if (!isRunning && !isPaused) {
                    startTimer();
                    console.log('[Auto-Next] Starting timer after audio ended');
                }
                
                // Force update the countdown to ensure it's still running
                updateCountdown();
            });
            
            // Set initial state based on audio
            if (audio.paused && !audioHasEnded && isRunning) {
                pauseTimer();
            }
        }
    }
    
    // Function to handle clicks outside the control panel
    function setupOutsideClickHandler() {
        document.addEventListener('click', function(event) {
            if (!isMinimized) {
                // Check if click is outside the panel and not on the bubble view
                if (!expandedView.contains(event.target) && 
                    event.target !== expandedView && 
                    event.target !== bubbleView && 
                    !bubbleView.contains(event.target)) {
                    // Minimize the panel
                    toggleView();
                }
            }
        });
        
        // Prevent clicks inside the panel from bubbling up
        expandedView.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
 
    // Function to toggle settings panel
    function toggleSettingsPanel() {
        settingsPanelOpen = !settingsPanelOpen;
        settingsPanel.style.display = settingsPanelOpen ? 'block' : 'none';
 
        // Reset input values to current settings
        timerInput.value = COUNTDOWN_MINUTES;
        maxChaptersInput.value = MAX_CHAPTERS;
    }
 
    // Function to save settings
    function saveSettings() {
        // Get and validate timer minutes (ensure it's a valid number)
        const newTimerMinutes = parseFloat(timerInput.value);
 
        if (isNaN(newTimerMinutes) || newTimerMinutes < 0.5 || newTimerMinutes > 60) {
            alert('Please enter a valid time between 0.5 and 60 minutes.');
            return;
        }
 
        // Get and validate max chapters
        const newMaxChapters = parseInt(maxChaptersInput.value);
 
        if (isNaN(newMaxChapters) || newMaxChapters < 1 || newMaxChapters > 20) {
            alert('Please enter a valid number of chapters between 1 and 20.');
            return;
        }
 
        // Update settings
        COUNTDOWN_MINUTES = newTimerMinutes;
        countdownMs = COUNTDOWN_MINUTES * 60 * 1000;
 
        // Update max chapters
        MAX_CHAPTERS = newMaxChapters;
        chapterCounterText.textContent = `Chapters: ${chaptersNavigated}/${MAX_CHAPTERS}`;
 
        // If timer is not running, update the remaining time
        if (!isRunning) {
            remainingTime = countdownMs;
            updateCountdown();
        }
 
        // Save to localStorage
        userSettings.timerMinutes = COUNTDOWN_MINUTES;
        userSettings.maxChapters = MAX_CHAPTERS;
        localStorage.setItem('autoNextSettings', JSON.stringify(userSettings));
 
        // Close settings panel
        toggleSettingsPanel();
        
        // Reset inactivity timer after settings change
        resetInactivityTimer();
    }
    
    // Settings button click handler
    settingsButton.addEventListener('click', toggleSettingsPanel);
 
    // Save button click handler
    saveButton.addEventListener('click', saveSettings);
 
    // Cancel button click handler
    cancelButton.addEventListener('click', toggleSettingsPanel);
 
    // Function to start the timer
    function startTimer() {
        isRunning = true;
        isPaused = false;
        startTime = Date.now();
        endTime = startTime + remainingTime;
 
        // Store in session storage that we've started
        sessionStorage.setItem('auto_next_started', 'true');
 
        // Update button
        actionButton.textContent = 'Pause';
        actionButton.style.backgroundColor = '#4CAF50';
 
        // Start the countdown interval
        if (!countdownInterval) {
            countdownInterval = setInterval(updateCountdown, 1000);
        }
        
        // Reset inactivity timer when starting
        resetInactivityTimer();
    }
 
    // Function to pause the timer
    function pauseTimer() {
        isPaused = true;
        isRunning = false;
 
        // Store the remaining time when paused
        remainingTime = Math.max(0, endTime - Date.now());
 
        // Update button
        actionButton.textContent = 'Resume';
        actionButton.style.backgroundColor = '#f44336';
        
        // Reset inactivity timer when pausing
        resetInactivityTimer();
    }
 
    // Function to resume the timer
    function resumeTimer() {
        isPaused = false;
        isRunning = true;
 
        // Recalculate the end time based on the remaining time
        endTime = Date.now() + remainingTime;
 
        // Update button
        actionButton.textContent = 'Pause';
        actionButton.style.backgroundColor = '#4CAF50';
        
        // Reset inactivity timer when resuming
        resetInactivityTimer();
    }
    
    // Update the countdown display
    function updateCountdown() {
        if (isRunning && !isPaused) {
            remainingTime = Math.max(0, endTime - Date.now());
        }
 
        const minutesLeft = Math.floor(remainingTime / 60000);
        const secondsLeft = Math.floor((remainingTime % 60000) / 1000);
        const formattedTime = `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;
 
        // Update the timer text in expanded view
        timerText.textContent = `Next chapter in: ${formattedTime}`;
 
        // Update the timer text in bubble view
        if (bubbleTimer) {
            bubbleTimer.textContent = formattedTime;
        }
 
        if (remainingTime <= 0 && isRunning && !isPaused) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            clickNextChapter();
        }
        
        // Reset inactivity timer when updating display (user is watching)
        resetInactivityTimer();
    }
 
    // Button click handler - cycles through Start, Pause, Resume
    actionButton.addEventListener('click', function() {
        if (!isRunning && !isPaused) {
            // Start the timer
            startTimer();
        } else if (isRunning && !isPaused) {
            // Pause the timer
            pauseTimer();
        } else if (!isRunning && isPaused) {
            // Resume the timer
            resumeTimer();
        }
        
        // Reset inactivity timer after button click
        resetInactivityTimer();
    });
 
    // Add 30 seconds to the timer
    plusButton.addEventListener('click', function() {
        // Only allow adjustment if timer is running or paused
        if (isRunning || isPaused) {
            // If paused, just adjust the remaining time
            if (isPaused) {
                remainingTime += 30000; // 30 seconds in milliseconds
            } else {
                // If running, adjust the end time
                endTime += 30000;
            }
 
            // Update the display immediately
            updateCountdown();
        }
        
        // Reset inactivity timer after button click
        resetInactivityTimer();
    });
 
    // Subtract 30 seconds from the timer
    minusButton.addEventListener('click', function() {
        // Only allow adjustment if timer is running or paused
        if (isRunning || isPaused) {
            if (isPaused) {
                // Don't let it go below zero
                remainingTime = Math.max(0, remainingTime - 30000);
            } else {
                // Adjust end time but don't let it go below current time
                endTime = Math.max(Date.now(), endTime - 30000);
                // Recalculate remaining time
                remainingTime = Math.max(0, endTime - Date.now());
            }
 
            // Update the display immediately
            updateCountdown();
 
            // If we reduced to zero, trigger next chapter
            if (remainingTime <= 0 && isRunning) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                clickNextChapter();
            }
        }
        
        // Reset inactivity timer after button click
        resetInactivityTimer();
    });
    
    // Function to check if we should stop due to chapter limit
    function checkChapterLimit() {
        if (chaptersNavigated >= MAX_CHAPTERS) {
            // Update the UI to show we've reached the limit
            timerText.textContent = `Reached limit of ${MAX_CHAPTERS} chapters`;
            chapterCounterText.textContent = `Chapters: ${chaptersNavigated}/${MAX_CHAPTERS} - Limit reached!`;
            chapterCounterText.style.color = '#ff6666';
 
            // Reset the chapter counter after reaching the limit
            chaptersNavigated = 0;
            sessionStorage.setItem('auto_next_chapters_count', '0');
 
            // Stop the timer
            stopPermanently();
 
            return true;
        }
        return false;
    }
 
    // Function to click the next chapter button
    function clickNextChapter() {
        // Increment chapter counter before checking
        chaptersNavigated++;
        sessionStorage.setItem('auto_next_chapters_count', chaptersNavigated.toString());
 
        // Update chapter counter display
        chapterCounterText.textContent = `Chapters: ${chaptersNavigated}/${MAX_CHAPTERS}`;
 
        // Check if we've reached the limit
        if (checkChapterLimit()) {
            // We've reached the limit, don't proceed
            return;
        }
 
        // Update the timer text
        timerText.textContent = 'Moving to next chapter...';
 
        // Try to find the next chapter button
        const nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
 
        if (nextButton) {
            // Highlight the button being clicked
            const originalBackground = nextButton.style.backgroundColor;
            const originalTransition = nextButton.style.transition;
 
            nextButton.style.transition = 'background-color 0.3s ease';
            nextButton.style.backgroundColor = 'yellow';
 
            // Click after a short delay to show the highlight
            setTimeout(() => {
                nextButton.click();
 
                // If for some reason we're still on the page after clicking
                setTimeout(() => {
                    nextButton.style.backgroundColor = originalBackground;
                    nextButton.style.transition = originalTransition;
                    timerText.textContent = 'Click failed or redirecting...';
                }, 1000);
            }, 500);
        } else {
            timerText.textContent = 'Next button not found! Adjust the selector in the script.';
 
            // Error message will remain visible
        }
    }
    
    // Function to permanently stop the script
    function stopPermanently() {
        // Clear any running intervals
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
 
        // Reset states
        isRunning = false;
        isPaused = false;
 
        // Reset chapter counter
        chaptersNavigated = 0;
        sessionStorage.setItem('auto_next_chapters_count', '0');
 
        // Update UI
        timerText.textContent = 'Timer stopped permanently';
        chapterCounterText.textContent = `Chapters: ${chaptersNavigated}/${MAX_CHAPTERS}`;
        chapterCounterText.style.color = '#ffcc00'; // Reset color
 
        if (bubbleTimer) {
            bubbleTimer.textContent = 'Stopped';
        }
 
        // Disable timer control buttons but NOT navigation buttons
        actionButton.disabled = true;
        minusButton.disabled = true;
        plusButton.disabled = true;
        stopButton.disabled = true;
        // Keep navigation buttons enabled
 
        // Change button appearances for timer controls only
        actionButton.style.backgroundColor = '#999';
        minusButton.style.backgroundColor = '#999';
        plusButton.style.backgroundColor = '#999';
        stopButton.style.backgroundColor = '#999';
        stopButton.textContent = 'Stopped';
    }
 
    // Function to navigate to previous chapter
    function goToPrevChapter() {
        const prevButton = document.querySelector(PREV_BUTTON_SELECTOR);
        if (prevButton) {
            // Highlight the button being clicked
            const originalBackground = prevButton.style.backgroundColor;
            const originalTransition = prevButton.style.transition;
 
            prevButton.style.transition = 'background-color 0.3s ease';
            prevButton.style.backgroundColor = 'yellow';
 
            // Click after a short delay to show the highlight
            setTimeout(() => {
                prevButton.click();
            }, 300);
        } else {
            timerText.textContent = 'Previous chapter button not found!';
        }
        
        // Reset inactivity timer after navigation
        resetInactivityTimer();
    }
    
    // Function to navigate to next chapter immediately
    function goToNextChapter() {
        const nextButton = document.querySelector(NEXT_BUTTON_SELECTOR);
        if (nextButton) {
            // Increment chapter counter (just like the auto-next function)
            chaptersNavigated++;
            sessionStorage.setItem('auto_next_chapters_count', chaptersNavigated.toString());
 
            // Update chapter counter display
            chapterCounterText.textContent = `Chapters: ${chaptersNavigated}/${MAX_CHAPTERS}`;
 
            // Check if we've reached the limit before navigating
            if (checkChapterLimit()) {
                // We've reached the limit, don't proceed
                return;
            }
 
            // Highlight the button being clicked
            const originalBackground = nextButton.style.backgroundColor;
            const originalTransition = nextButton.style.transition;
 
            nextButton.style.transition = 'background-color 0.3s ease';
            nextButton.style.backgroundColor = 'yellow';
 
            // Click after a short delay to show the highlight
            setTimeout(() => {
                nextButton.click();
            }, 300);
        } else {
            timerText.textContent = 'Next chapter button not found!';
        }
        
        // Reset inactivity timer after navigation
        resetInactivityTimer();
    }
 
    // Add stop button click handler
    stopButton.addEventListener('click', stopPermanently);
 
    // Add click handlers for navigation buttons
    prevChapterButton.addEventListener('click', goToPrevChapter);
    nextChapterButton.addEventListener('click', goToNextChapter);
    
    // Initialize - try to get audio duration first
    function initialize() {
        console.log('[Auto-Next] Initializing script v1.5');
        
        // Set timer based on audio duration
        setTimerFromAudioDuration();
        
        // Set up audio state listeners
        setupAudioStateListeners();
        
        // Set up playback rate change monitor
        setupPlaybackRateMonitor();
        
        // Set up outside click handler
        setupOutsideClickHandler();
        
        // Reset inactivity timer when panel is expanded
        resetInactivityTimer();
        
        // Add event listeners for interactivity
        expandedView.addEventListener('mouseenter', resetInactivityTimer);
        expandedView.addEventListener('mousemove', resetInactivityTimer);
        expandedView.addEventListener('click', resetInactivityTimer);
        expandedView.addEventListener('touchstart', resetInactivityTimer);
        
        // Check if we've already reached the chapter limit
        if (chaptersNavigated >= MAX_CHAPTERS) {
            checkChapterLimit();
        } else {
            // Set initial view state based on preference
            updateViewState();
 
            // Don't automatically start timer - wait for audio play event instead
            
            // Update countdown display initially
            updateCountdown();
        }
    }
    
    // If DOM is already loaded, initialize immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Try again after full page load (helps with audio elements loaded dynamically)
    window.addEventListener('load', function() {
        // Check if audio elements are now available
        const audioElements = document.querySelectorAll('audio');
        if (audioElements.length > 0 && !isRunning && !isPaused) {
            // Re-set timer if needed
            setTimerFromAudioDuration();
            setupAudioStateListeners();
        }
    });
})();