// ==UserScript==
// @name         IQRPG Audio Disco
// @namespace    https://www.iqrpg.com/
// @version      1.4.0
// @description  Advanced Audio Alerts with EASY instructions and Functional Overlay
// @author       Grogu2484
// @match        http://iqrpg.com/game.html
// @match        https://iqrpg.com/game.html
// @match        http://www.iqrpg.com/game.html
// @match        https://www.iqrpg.com/game.html
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534103/IQRPG%20Audio%20Disco.user.js
// @updateURL https://update.greasyfork.org/scripts/534103/IQRPG%20Audio%20Disco.meta.js
// ==/UserScript==

/**************************************************************************************
*                                                                                     *
*        YOU MAY EDIT ANYTHING BELOW THIS LINE UNTIL NEXT BOX LIKE THIS !!!           *
*                                                                                     *
**************************************************************************************/

// QUICK ACCESS CONTROLS
// Quickly enable or disable specific game notification types
var NOTIFICATIONS_ENABLED = {
    auto: true,           // Auto timer notifications
    dungeon: true,        // Dungeon completion notifications
    boss: true,           // Boss fight notifications
    events: true,         // Skill events notifications
    whispers: true,       // Whisper notifications
    land: true,           // Land timer notifications
    mastery: true,        // Mastery milestone notifications
    effects: true,        // Effect expiration notifications
    clan: true,          // Clan-related notifications
    bonusExp: true        // Bonus EXP notifications
};

// SOUND PROFILE SELECTION
// Choose from: "default", "subtle", "game", "natural", "custom"
var SOUND_PROFILE = "default";

/*
    SOUND PROFILE DETAILS:
    ----------------------
    - default: Original game sounds (recommended)
    - subtle: Quieter, less intrusive notifications
    - game: Video game-style voice alerts
    - natural: Nature-themed sound effects
    - custom: Use your own sound URLs (configure below)
*/

// CUSTOM SOUND PROFILE CONFIGURATION
// ONLY USE IF ------> SOUND_PROFILE is set to "custom"
var CUSTOM_SOUND_URLS = {
    auto: 'https://www.example.com/auto-sound.wav',
    boss: 'https://www.example.com/boss-sound.wav',
    bossDefeated: 'https://www.example.com/boss-defeated-sound.wav',
    event: 'https://www.example.com/event-sound.wav',
    whisper: 'https://www.example.com/whisper-sound.wav',
    land: 'https://www.example.com/land-sound.wav',
    mastery: 'https://www.example.com/mastery-sound.wav',
    effect: 'https://www.example.com/effect-sound.wav',
    watchtower: 'https://www.example.com/watchtower-sound.wav',
    bonusExp: 'https://www.example.com/bonus-exp-sound.wav'
};

/*
    MAIN CONTROLS - QUICK TOGGLE
    Set to true --->ENABLES sounds, false<--- DISABLES sounds
    -----------------------------------------------
*/

// MASTER TOGGLE - Set to false to disable ALL AUDIO(SOUND) notifications
var MASTER_AUDIO_ENABLED = true;

// MASTER TOGGLE - Set to false to disable ALL DESKTOP(Image) notifications
var MASTER_DESKTOP_ENABLED = true;

// VISUAL OVERLAY - Set to false to disable startup overlay
var SHOW_STARTUP_OVERLAY = true;

// VISUAL OVERLAY DURATION - How long to show the startup overlay (in seconds)
var OVERLAY_DURATION = 5;

/*
    VOLUME CONTROL
    --------------
    Set the master volume for all sounds (Valid range: 0.0 to 1.0 (0 = silent, 1 = maximum volume))
*/

var MASTER_VOLUME = 0.9;

/*
    INDIVIDUAL NOTIFICATION SETTINGS
    -------------------------------
    EDIT ALL THE SETTINGS BELOW! EACH SECTION CONTROLS A DIFFERENT TYPE OF NOTIFICATION
    SET AUDIO ALERTS TO LOWERCASE true TO ENABLE SOUNDS, SET TO LOWERCASE false TO DISABLE AUDIO ALERTS
    SET DESKTOP ALERTS TO LOWERCASE true TO ENABLE DESTOP NOTIFICATIONS, SET TO LOWERCASE false to DISABLE DESKTOP NOTIFICATIONS
    DEBUG IS THE LAST EDITABLE SECTION. THERE IS A BIG PAGE BREAK SO YOU DO NOT EDIT BELOW THAT LINE OR IT WILL NOT WORK..
*/

// AUTO SECTION
var autoAudioAlert = true;              // Audio alert when autos are low
var autoAlertSoundURL = 'https://www.myinstants.com/media/sounds/notification.mp3';
var autoAlertRepeatInSeconds = 10;       // How often to repeat (1-60 seconds)
var autoAlertNumber = 100;               // Alert at this number of autos (1-100)
var autoMaxNumberOfAudioAlerts = 0;     // Maximum alerts (0 = unlimited)
var autoDesktopAlert = false;           // Desktop notification when autos are low

// DUNGEON SECTION
var dungeonAudioAlert = true;           // Audio alert when dungeon completes
var dungeonDesktopAlert = false;        // Desktop notification for dungeon

// BOSS SECTION
var bossAudioAlert = true;              // Audio alert for boss events
var bossAlertSoundURL = 'https://www.myinstants.com/media/sounds/alert.mp3';
var bossDefeatedSoundURL = 'https://www.myinstants.com/media/sounds/ff-victory.mp3';
var bossDesktopAlert = false;           // Desktop notification for boss events

// EVENT SECTION
var eventDesktopAlert = true;          // Desktop notification for events
var eventAlertSoundURL = 'https://www.myinstants.com/media/sounds/alert.mp3';
var eventAlert_Woodcutting = true;      // Alert for woodcutting events
var eventAlert_Quarrying = true;        // Alert for quarrying events
var eventAlert_Mining = true;           // Alert for mining events
var eventAudioAlert = true;             // Audio alert when events start
var eventAudioAlertFinished = false;    // Audio alert when events finish

// WHISPER SECTION
var whisperAudioAlert = true;           // Audio alert for whispers
var whisperAlertSoundURL = 'https://www.myinstants.com/media/sounds/ping.mp3';
var whisperAlertOnlyWhenTabIsInactive = false;  // Only alert when tab not active
var whisperDesktopAlert = false;        // Desktop notification for whispers

// LAND SECTION
var landAudioAlert = true;              // Audio alert when land timer completes
var landAlertSoundURL = 'https://www.myinstants.com/media/sounds/coins.mp3';

// MASTERY SECTION
var masteryAudioAlert = true;           // Audio alert for mastery milestones
var masteryEveryXLevels = 10;           // Alert every X levels (1-100)
var masteryAlertSoundURL = 'https://www.myinstants.com/media/sounds/ff-victory.mp3';

// EFFECT SECTION
var effectAudioAlert = true;            // Audio alert when effects expire
var effectAutoLeft = 5;                 // Alert at this many minutes (1-60)
var effectAlertSoundURL = 'https://www.myinstants.com/media/sounds/hammer.mp3';

// CLAN SECTION
var watchtowerAudioAlert = true;       // Audio alert for watchtower events
var watchtowerAlertSoundURL = 'https://www.myinstants.com/media/sounds/alert.mp3';
var watchtowerDesktopAlert = false;     // Desktop notification for watchtower

// BONUS EXP SECTION
var bonusExpAudioAlert = true;          // Audio alert for bonus exp
var bonusExpAlertSoundURL = 'https://www.myinstants.com/media/sounds/magic.mp3';

// DEBUG SECTION
var showDebugInfo = true;              // Show debug info in console

/**************************************************************************************
*                                                                                     *
*                  !! DO NOT EDIT ANYTHING BELOW THIS LINE !!                         *
*                                                                                     *
**************************************************************************************/

(function() {
    'use strict';
    
    // Additional configuration (managed by code)
    var NOTIFICATION_DURATION = 7;
    var LOW_RESOURCE_MODE = false;
    var enableVisualIndicators = true;
    var visualAlertColor = "#ff5555";
    var visualAlertPulse = true;
    var visualAlertCorner = "top-right";
    var enableErrorLogging = true;
    var statsTracking = false;
    
    // State variables
    let alerting = false;
    let alertInterval = null;
    let currentAutoAlerts = 0;
    let canSendDesktopAlert = true;
    let desktopNotificationCooldown = false;
    let bonusExpActive = false;
    let soundProfile = {};
    let lastWhisperTime = 0;
    let visualAlertElement = null;
    let adaptedSelectors = {};
    let notificationStats = {
        total: 0,
        auto: 0,
        dungeon: 0,
        boss: 0,
        event: 0,
        whisper: 0,
        land: 0,
        mastery: 0,
        effect: 0,
        clan: 0,
        bonusExp: 0
    };
    
    // Initialize sound profiles based on selected profile
    function initSoundProfiles() {
        // Default profile (updated more reliable sounds)
        const defaultProfile = {
            auto: autoAlertSoundURL || 'https://www.myinstants.com/media/sounds/notification.mp3',
            boss: bossAlertSoundURL || 'https://www.myinstants.com/media/sounds/alert.mp3',
            bossDefeated: bossDefeatedSoundURL || 'https://www.myinstants.com/media/sounds/ff-victory.mp3',
            event: eventAlertSoundURL || 'https://www.myinstants.com/media/sounds/alert.mp3',
            whisper: whisperAlertSoundURL || 'https://www.myinstants.com/media/sounds/ping.mp3',
            land: landAlertSoundURL || 'https://www.myinstants.com/media/sounds/coins.mp3',
            mastery: masteryAlertSoundURL || 'https://www.myinstants.com/media/sounds/ff-victory.mp3',
            effect: effectAlertSoundURL || 'https://www.myinstants.com/media/sounds/hammer.mp3',
            watchtower: watchtowerAlertSoundURL || 'https://www.myinstants.com/media/sounds/alert.mp3',
            bonusExp: bonusExpAlertSoundURL || 'https://www.myinstants.com/media/sounds/magic.mp3'
        };
        
        // Set active profile based on user selection
        switch (SOUND_PROFILE.toLowerCase()) {
            case "custom":
                soundProfile = CUSTOM_SOUND_URLS;
                break;
            default:
                soundProfile = defaultProfile;
        }
        
        // Log sound profile for debugging
        if (showDebugInfo) {
            console.log("Active sound profile:", SOUND_PROFILE);
            console.log("Sound URLs:", soundProfile);
        }
    }
    
    // Play audio alert with the specified sound URL
    function playAudioAlert(soundURL, volume = MASTER_VOLUME) {
        if (!MASTER_AUDIO_ENABLED) return;
        
        try {
            console.log("Attempting to play sound:", soundURL);
            
            const audio = new Audio(soundURL);
            audio.volume = volume;
            
            // Handle autoplay policy issues
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Sound playing successfully");
                }).catch(error => {
                    console.error("Sound play failed:", error);
                    showVisualAlert("Browser blocked autoplay - click anywhere to enable", 3000);
                    
                    // Try playing on next user interaction
                    document.addEventListener('click', function playOnClick() {
                        audio.play();
                        document.removeEventListener('click', playOnClick);
                    }, { once: true });
                });
            }
            
            if (statsTracking) {
                notificationStats.total++;
            }
        } catch (error) {
            console.error('Error creating audio object:', error);
            showVisualAlert("Failed to create audio", 2000);
        }
    }
    
    // Send desktop notification
    function sendDesktopNotification(title, message, icon = null, duration = NOTIFICATION_DURATION * 1000) {
        if (!MASTER_DESKTOP_ENABLED || !canSendDesktopAlert || desktopNotificationCooldown) return;
        
        if (!("Notification" in window)) {
            if (showDebugInfo) {
                console.log('Desktop notifications not supported in this browser');
            }
            return;
        }
        
        if (Notification.permission === "denied") {
            if (showDebugInfo) {
                console.log('Desktop notifications permission denied');
            }
            return;
        }
        
        if (Notification.permission !== "granted") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    sendDesktopNotification(title, message, icon, duration);
                }
            });
            return;
        }
        
        desktopNotificationCooldown = true;
        
        const options = {
            body: message,
            icon: icon || 'https://www.iqrpg.com/favicon.ico',
            silent: true
        };
        
        const notification = new Notification(title, options);
        
        setTimeout(() => {
            notification.close();
            desktopNotificationCooldown = false;
        }, duration);
    }
    
    // Display visual alert on screen
    function showVisualAlert(message, duration = 3000) {
        if (!enableVisualIndicators) return;
        
        console.log("Showing visual alert:", message);
        
        if (!visualAlertElement) {
            visualAlertElement = document.createElement('div');
            visualAlertElement.id = 'iqrpg-audio-enhancer-alert';
            
            const style = {
                position: 'fixed',
                padding: '10px 15px',
                backgroundColor: visualAlertColor,
                color: '#fff',
                fontWeight: 'bold',
                zIndex: '9999',
                borderRadius: '5px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                opacity: '0',
                transition: 'opacity 0.3s ease-in-out',
                top: '10px',
                right: '10px'
            };
            
            Object.assign(visualAlertElement.style, style);
            
            if (visualAlertPulse) {
                visualAlertElement.style.animation = 'iqrpg-pulse 1s infinite';
                
                const styleSheet = document.createElement('style');
                styleSheet.textContent = `
                    @keyframes iqrpg-pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(styleSheet);
            }
            
            document.body.appendChild(visualAlertElement);
        }
        
        visualAlertElement.textContent = message;
        visualAlertElement.style.opacity = '1';
        
        setTimeout(() => {
            visualAlertElement.style.opacity = '0';
        }, duration);
    }
    
    // Create and show startup overlay
    function showStartupOverlay() {
        if (!SHOW_STARTUP_OVERLAY) return;
        
        const overlay = document.createElement('div');
        overlay.id = 'iqrpg-enhancer-overlay';
        
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: '10000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'opacity 1s ease-in-out',
            opacity: '0'
        });
        
        const header = document.createElement('div');
        header.textContent = 'IQRPG AUDIO ENHANCER';
        Object.assign(header.style, {
            color: '#fff',
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
            fontFamily: 'Arial, sans-serif',
            textShadow: '0 0 10px #00ccff, 0 0 20px #00ccff'
        });
        
        const status = document.createElement('div');
        status.textContent = 'SUCCESSFULLY LOADED';
        Object.assign(status.style, {
            color: '#00ff00',
            fontSize: '22px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '30px',
            fontFamily: 'Arial, sans-serif'
        });
        
        const version = document.createElement('div');
        version.textContent = 'Version 1.4.0 (Fixed)';
        Object.assign(version.style, {
            color: '#aaaaaa',
            fontSize: '16px',
            textAlign: 'center',
            marginBottom: '30px',
            fontFamily: 'Arial, sans-serif'
        });
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        Object.assign(closeButton.style, {
            marginTop: '20px',
            padding: '8px 20px',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif'
        });
        
        closeButton.addEventListener('click', () => {
            hideStartupOverlay();
        });
        
        overlay.appendChild(header);
        overlay.appendChild(status);
        overlay.appendChild(version);
        overlay.appendChild(closeButton);
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            hideStartupOverlay();
        }, OVERLAY_DURATION * 1000);
    }
    
    function hideStartupOverlay() {
        const overlay = document.getElementById('iqrpg-enhancer-overlay');
        if (!overlay) return;
        
        overlay.style.opacity = '0';
        
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 1000);
    }
    
    // Handle title change (for whispers and other notifications)
    function handleTitleChange() {
        const title = document.title;
        
        if (showDebugInfo) {
            console.log("Title changed:", title);
        }
        
        if (NOTIFICATIONS_ENABLED.whispers && title.includes('Whisper')) {
            handleWhisperNotification();
        }
        
        if (NOTIFICATIONS_ENABLED.events && title.includes('Event')) {
            handleEventNotification();
        }
        
        if (NOTIFICATIONS_ENABLED.bonusExp && title.includes('Bonus EXP')) {
            handleBonusExpNotification();
        }
    }
    
    // Handle whisper notifications
    function handleWhisperNotification() {
        if (!whisperAudioAlert) return;
        
        console.log("Whisper notification triggered");
        
        if (whisperAlertOnlyWhenTabIsInactive && document.visibilityState === 'visible') {
            console.log("Tab is active, skipping whisper alert");
            return;
        }
        
        const now = Date.now();
        if (now - lastWhisperTime < 3000) {
            console.log("Whisper alert on cooldown");
            return;
        }
        
        lastWhisperTime = now;
        
        playAudioAlert(soundProfile.whisper);
        
        if (statsTracking) {
            notificationStats.whisper++;
        }
        
        if (whisperDesktopAlert) {
            sendDesktopNotification('IQRPG Whisper', 'You received a new whisper!');
        }
        
        if (enableVisualIndicators) {
            showVisualAlert('New Whisper');
        }
    }
    
    // Handle event notifications
    function handleEventNotification() {
        if (!eventAudioAlert) return;
        
        console.log("Event notification triggered");
        
        const title = document.title;
        let eventType = 'Event';
        
        if (title.includes('Woodcutting') && eventAlert_Woodcutting) {
            eventType = 'Woodcutting';
        } else if (title.includes('Quarrying') && eventAlert_Quarrying) {
            eventType = 'Quarrying';
        } else if (title.includes('Mining') && eventAlert_Mining) {
            eventType = 'Mining';
        }
        
        playAudioAlert(soundProfile.event);
        
        if (statsTracking) {
            notificationStats.event++;
        }
        
        if (eventDesktopAlert) {
            sendDesktopNotification('IQRPG Event', `A ${eventType} event has started!`);
        }
        
        if (enableVisualIndicators) {
            showVisualAlert(`${eventType} Event Started`);
        }
    }
    
    // Handle bonus exp notifications
    function handleBonusExpNotification() {
        if (!bonusExpAudioAlert || bonusExpActive) return;
        
        console.log("Bonus EXP notification triggered");
        bonusExpActive = true;
        
        playAudioAlert(soundProfile.bonusExp);
        
        if (statsTracking) {
            notificationStats.bonusExp++;
        }
        
        if (enableVisualIndicators) {
            showVisualAlert('Bonus EXP Active!');
        }
        
        setTimeout(() => {
            bonusExpActive = false;
        }, 10000);
    }
    
    // Handle autos remaining change
    function handleAutosRemainingChange(count) {
        if (!NOTIFICATIONS_ENABLED.auto || !autoAudioAlert) return;
        
        const autosRemaining = typeof count === 'string' ? parseInt(count, 10) : count;
        
        if (showDebugInfo) {
            console.log(`Autos remaining: ${autosRemaining}`);
        }
        
        if (isNaN(autosRemaining) || autosRemaining > autoAlertNumber) {
            currentAutoAlerts = 0;
            
            if (alertInterval) {
                clearInterval(alertInterval);
                alertInterval = null;
                alerting = false;
            }
            
            return;
        }
        
        if (alerting) return;
        
        if (autoMaxNumberOfAudioAlerts > 0 && currentAutoAlerts >= autoMaxNumberOfAudioAlerts) {
            return;
        }
        
        alerting = true;
        
        console.log(`Auto alert triggered: ${autosRemaining} autos remaining`);
        
        playAudioAlert(soundProfile.auto);
        currentAutoAlerts++;
        
        if (statsTracking) {
            notificationStats.auto++;
        }
        
        if (autoDesktopAlert) {
            sendDesktopNotification('IQRPG Auto Alert', `Only ${autosRemaining} autos remaining!`);
        }
        
        if (enableVisualIndicators) {
            showVisualAlert(`${autosRemaining} Autos Left`);
        }
        
        if (autoAlertRepeatInSeconds > 0) {
            alertInterval = setInterval(() => {
                if (autoMaxNumberOfAudioAlerts > 0 && currentAutoAlerts >= autoMaxNumberOfAudioAlerts) {
                    clearInterval(alertInterval);
                    alertInterval = null;
                    alerting = false;
                    return;
                }
                
                playAudioAlert(soundProfile.auto);
                currentAutoAlerts++;
                
                if (statsTracking) {
                    notificationStats.auto++;
                }
            }, autoAlertRepeatInSeconds * 1000);
        } else {
            alerting = false;
        }
    }
    
    // Setup observers for game elements
    function setupObservers() {
        console.log("Setting up observers...");
        
        // Watch for title changes
        const titleObserver = new MutationObserver(handleTitleChange);
        const titleElement = document.querySelector('title');
        
        if (titleElement) {
            titleObserver.observe(titleElement, {
                subtree: true,
                characterData: true,
                childList: true
            });
        }
        
        // Watch for game content changes
        const gameObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Look for auto counter changes
                if (mutation.target.id === 'autosRemaining' || 
                    mutation.target.className && mutation.target.className.includes('auto')) {
                    const match = mutation.target.textContent.match(/(\d+)/);
                    if (match) {
                        handleAutosRemainingChange(parseInt(match[1], 10));
                    }
                }
                
                // Look for whisper messages in chat
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const text = node.textContent || '';
                            if (text.toLowerCase().includes('whisper') || 
                                node.className && node.className.includes('whisper')) {
                                handleWhisperNotification();
                            }
                        }
                    });
                }
            });
        });
        
        // Start observing the entire game area
        gameObserver.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
        });
        
        console.log("Observers setup complete");
    }
    
    // Add settings button to game UI
    function addSettingsButton() {
        try {
            console.log("Adding settings button...");
            
            const settingsButton = document.createElement('div');
            settingsButton.id = 'iqrpg-audio-enhancer-settings';
            settingsButton.title = 'Toggle Audio Alerts';
            
            Object.assign(settingsButton.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                backgroundColor: '#333',
                borderRadius: '50%',
                cursor: 'pointer',
                zIndex: '9999',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                border: '2px solid #555'
            });
            
            settingsButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
            `;
            
            settingsButton.addEventListener('click', function() {
                MASTER_AUDIO_ENABLED = !MASTER_AUDIO_ENABLED;
                
                if (!MASTER_AUDIO_ENABLED) {
                    this.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5555" stroke-width="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <line x1="23" y1="9" x2="17" y2="15"></line>
                            <line x1="17" y1="9" x2="23" y2="15"></line>
                        </svg>
                    `;
                    this.style.borderColor = '#ff5555';
                    showVisualAlert('Audio Alerts Disabled', 2000);
                } else {
                    this.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                    `;
                    this.style.borderColor = '#555';
                    playAudioAlert(soundProfile.auto, 0.5);
                    showVisualAlert('Audio Alerts Enabled', 2000);
                }
                
                console.log('Audio alerts:', MASTER_AUDIO_ENABLED ? 'enabled' : 'disabled');
            });
            
            document.body.appendChild(settingsButton);
            
            console.log('Settings button added');
        } catch (error) {
            console.error('Error adding settings button:', error);
        }
    }
    
    // Simple whisper detection
    function setupSimpleWhisperDetection() {
        // Check for whispers in title every 500ms
        setInterval(() => {
            if (document.title.toLowerCase().includes('whisper')) {
                handleWhisperNotification();
            }
        }, 500);
        
        // Check for common chat containers
        setInterval(() => {
            const chatContainers = document.querySelectorAll('[id*="chat"], [class*="chat"], [id*="message"], [class*="message"]');
            
            chatContainers.forEach(container => {
                const messages = container.querySelectorAll('div, p, li, span');
                messages.forEach(message => {
                    const text = message.textContent.toLowerCase();
                    if (text.includes('whisper') || text.includes('whispers') || 
                        message.className && message.className.includes('whisper')) {
                        handleWhisperNotification();
                    }
                });
            });
        }, 1000);
    }
    
    // Initialization
    function init() {
        console.log("IQRPG Audio Enhancer starting...");
        
        try {
            // Initialize sound profiles
            initSoundProfiles();
            
            // Set up observers
            setupObservers();
            
            // Add settings button
            addSettingsButton();
            
            // Show startup overlay
            showStartupOverlay();
            
            // Set up simple whisper detection
            setupSimpleWhisperDetection();
            
            // Show success message
            showVisualAlert('IQRPG Audio Enhancer activated!', 3000);
            
            console.log('IQRPG Audio Enhancer initialized!');
            console.log('Active sound profile:', SOUND_PROFILE);
            console.log('Master volume:', MASTER_VOLUME);
            
            // Enable audio on first user interaction
            document.addEventListener('click', function enableAudio() {
                console.log("User interaction detected - audio enabled");
                const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
                silentAudio.play().catch(e => console.log("Silent audio failed:", e));
                document.removeEventListener('click', enableAudio);
            }, { once: true });
            
        } catch (error) {
            console.error('IQRPG Audio Enhancer initialization error:', error);
            
            // Retry after 5 seconds
            setTimeout(() => {
                console.log('Retrying initialization...');
                init();
            }, 5000);
        }
    }
    
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Delay initialization to ensure game has loaded
        setTimeout(init, 1000);
    }
    
})();