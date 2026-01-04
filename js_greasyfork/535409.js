// ==UserScript==
// @name         Apex Hosting - Zendesk QoL toolkit
// @namespace    https://apexminecrafthosting.com/
// @version      8.1
// @description  Collection of QoL features for Zendesk.
// @author       santiago.miguel@nitrado.net
// @match        *://*.zendesk.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @icon64       https://i.imgur.com/w3N6ZAx.png
// @icon         https://i.imgur.com/eGpVPYq.png
// @license      Proprietary. For internal use at Apex Hosting only.
// @downloadURL https://update.greasyfork.org/scripts/535409/Apex%20Hosting%20-%20Zendesk%20QoL%20toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/535409/Apex%20Hosting%20-%20Zendesk%20QoL%20toolkit.meta.js
// ==/UserScript==

/*
 * APEX HOSTING INTERNAL TOOL
 * Do not distribute.
 * This script is the property of Apex Hosting and is only for use by employees.
 */

(function () {
    'use strict';

    const SCRIPT_DELAY = 5000;
    const COLORS = {
        overlayBackground: '#262626',
        textColor: '#fff',
    };
    let draggedTab = null;
    let tabListObserver = null;

    function log(message) {
        console.log(`[Apex Scripts] ${message}`);
    }

    function createAutoShiftFeature(key, displayName, description, settingKey, defaultTime, statusText) {
        return {
            displayName,
            description,
            enabled: false,
            settings: {
                [settingKey]: defaultTime
            },
            settingKey,
            label: settingKey === 'shiftStart' ? 'Shift Start' : 'Shift End',
            statusText,
            lastStatusChangeTime: null,
            initialized: false,
            clockUpdateListener: null,
            init: function() {
                if (this.initialized) return;
                this.initialized = true;
                this.loadSettings();
                this.connectToUtcClock();
                log(`${this.displayName} initialized`);
            },
            disable: function() {
                this.disconnectFromUtcClock();
                if (this.fallbackTimer) {
                    clearInterval(this.fallbackTimer);
                    this.fallbackTimer = null;
                }
                log(`${this.displayName} disabled`);
            },
            loadSettings: function() {
                const savedSettings = GM_getValue(`${key}_settings`);
                if (savedSettings) {
                    this.settings = savedSettings;
                }
            },
            saveSettings: function() {
                GM_setValue(`${key}_settings`, this.settings);
            },
            connectToUtcClock: function() {
                const utcClockFeature = features.utcClock;
                if (!utcClockFeature || !utcClockFeature.enabled) {
                    log('UTC Clock feature not available or not enabled. Using fallback timer.');
                    this.startFallbackTimer();
                    return;
                }
                this.clockUpdateListener = () => this.checkShiftStatus();
                utcClockFeature.updateListeners.push(this.clockUpdateListener);

                this.checkShiftStatus();
                log('Connected to UTC Clock for status monitoring');
            },
            disconnectFromUtcClock: function() {
                const utcClockFeature = features.utcClock;
                if (utcClockFeature && Array.isArray(utcClockFeature.updateListeners) && this.clockUpdateListener) {
                    utcClockFeature.updateListeners = utcClockFeature.updateListeners.filter(l => l !== this.clockUpdateListener);
                    this.clockUpdateListener = null;
                }
            },
            startFallbackTimer: function() {
                this.fallbackTimer = setInterval(() => this.checkShiftStatus(), 60000);
                log('Started fallback shift status monitor');
            },
            checkShiftStatus: function() {
                const now = new Date();
                const currentHours = now.getUTCHours();
                const currentMinutes = now.getUTCMinutes();
                const currentTimeString = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

                const [targetHours, targetMinutes] = this.settings[this.settingKey].split(':').map(Number);
                const targetString = `${targetHours.toString().padStart(2, '0')}:${targetMinutes.toString().padStart(2, '0')}`;

                if (currentTimeString === targetString) {
                    this.setAgentStatus(this.statusText);
                }
            },
            setAgentStatus: function(status) {
                const now = Date.now();
                if (this.lastStatusChangeTime && (now - this.lastStatusChangeTime) < 10000) {
                    return;
                }

                const profileMenuButton = document.querySelector('[data-test-id="toolbar-profile-menu-button"]');
                if (!profileMenuButton) {
                    log('Profile menu button not found');
                    return;
                }

                const statusIndicator = profileMenuButton.querySelector('figcaption');
                const currentStatus = statusIndicator ? statusIndicator.getAttribute('aria-label') : null;

                const statusLabelMap = {
                    'Online': 'available',
                    'Offline': 'offline'
                };
                const expectedLabel = statusLabelMap[status] || status.toLowerCase();

                if (currentStatus && currentStatus.toLowerCase() === expectedLabel.toLowerCase()) {
                    log(`Status already set to ${status}, no change needed`);
                    return;
                }

                log(`Attempting to set status to ${status} at ${new Date().toISOString()}`);

                profileMenuButton.click();

                setTimeout(() => {
                    const statusItems = document.querySelectorAll('[data-test-id="profile-menu-agent-status"]');
                    let targetItem = null;

                    for (const item of statusItems) {
                        const caption = item.querySelector('figcaption');
                        if (caption && caption.textContent === status) {
                            targetItem = item;
                            break;
                        }
                    }

                    if (targetItem) {
                        targetItem.click();
                        this.lastStatusChangeTime = Date.now();
                        log(`Status set to ${status}`);
                    } else {
                        log(`Status menu item for ${status} not found`);
                    }

                    if (profileMenuButton.getAttribute('aria-expanded') === 'true') {
                        profileMenuButton.click();
                    }
                }, 300);
            }
        };
    }

    /* =====================
       Feature Modules
       ===================== */
    const features = {
        draggableTabs: {
            displayName: 'Draggable Tabs',
            description: '📨 Allows rearranging of chats and tickets by dragging them in the tab list, similar to how you can arrange tabs in your browser.',
            enabled: true,
            disableFeatures: ['none'],
            alwaysOn: true,
            init: function() {
                setupTabListObserver();
                log(`${this.displayName} initialized`);
            },
            statusElement: null,
        },
        utcClock: {
            displayName: 'UTC Clock',
            description: '⌚ Displays current UTC time in the top right of the site.<br><br>↗️ Click the clock to toggle 12/24 hour format.',
            enabled: true,
            disableFeatures: ['none'],
            clockElement: null,
            updateInterval: null,
            is12HourFormat: false,
            updateListeners: [],

            init: function() {
                this.loadFormatPreference();

                this.clockElement = document.createElement('div');
                this.clockElement.className = 'apex-utc-clock';
                this.clockElement.style.cssText = `
                   display: flex;
                   flex-direction: column;
                   align-items: center;
                   justify-content: center;
                   height: 40px;
                   width: 40px;
                   margin: 0 5px;
                   font-size: 12px;
                   font-weight: bold;
                   color: #555;
                   cursor: pointer;
                   transition: background-color 0.2s;
                   line-height: 1.1;
                   text-align: center;
               `;

                this.clockElement.addEventListener('mouseenter', () => {
                    this.clockElement.style.backgroundColor = '#f5f5f5';
                    this.clockElement.style.borderRadius = '3px';
                });
                this.clockElement.addEventListener('mouseleave', () => {
                    this.clockElement.style.backgroundColor = '';
                    this.clockElement.style.borderRadius = '';
                });

                this.clockElement.addEventListener('click', () => {
                    this.is12HourFormat = !this.is12HourFormat;
                    this.saveFormatPreference();
                    this.updateTime();
                });

                const userOptions = document.getElementById('user_options');
                if (userOptions) {
                    const profileMenu = document.getElementById('profile_menu');
                    userOptions.insertBefore(this.clockElement, profileMenu || null);

                    this.updateTime();
                    this.updateInterval = setInterval(() => this.updateTime(), 1000);
                }
                log(`${this.displayName} initialized`);
            },

            updateTime: function() {
                if (!this.clockElement) return;

                const now = new Date();
                let hours = now.getUTCHours();
                const minutes = now.getUTCMinutes().toString().padStart(2, '0');

                if (this.is12HourFormat) {
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12 || 12;
                    this.clockElement.innerHTML = `
                       <div style="font-size: 12px;">${hours}:${minutes}</div>
                       <div style="font-size: 11px;">${ampm}</div>
                   `;
                    this.clockElement.title = `UTC Time: ${hours}:${minutes} ${ampm}`;
                } else {
                    this.clockElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes}`;
                    this.clockElement.title = `UTC Time: ${hours.toString().padStart(2, '0')}:${minutes}`;
                }

                if (Array.isArray(this.updateListeners)) {
                    this.updateListeners.forEach(listener => {
                        try {
                            listener();
                        } catch (e) {
                            log('UTC Clock listener error: ' + e);
                        }
                    });
                }
            },

            loadFormatPreference: function() {
                this.is12HourFormat = localStorage.getItem('apexUtcClockFormat') === '12hour';
            },

            saveFormatPreference: function() {
                localStorage.setItem('apexUtcClockFormat', this.is12HourFormat ? '12hour' : '24hour');
            },

            disable: function() {
                clearInterval(this.updateInterval);
                if (this.clockElement?.parentNode) {
                    this.clockElement.parentNode.removeChild(this.clockElement);
                }
                log(`${this.displayName} disabled`);
            }
        },
        autoRefresher: {
            displayName: 'Ticket Auto Refresher',
            description: '🔄️ Automatically refreshes ticket list at specified intervals',
            enabled: true,
            disableFeatures: ['none'],
            frequency: 10,
            intervalId: null,
            setupIntervalBound: null,
            init: function() {
                this.setupIntervalBound = this.setupInterval.bind(this);
                this.setupInterval();
                window.addEventListener("focus", this.setupIntervalBound);
                log(`${this.displayName} initialized with frequency ${this.frequency}s`);
            },
            disable: function() {
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
                if (this.setupIntervalBound) {
                    window.removeEventListener("focus", this.setupIntervalBound);
                }
                log(`${this.displayName} disabled`);
            },
            clickRefresh: function() {
                const refresh = document.querySelector("[data-test-id='views_views-list_header-refresh']");
                if (refresh && window.location.href.includes(".zendesk.com/agent/filters/")) {
                    refresh.click();
                    log(`🔄️ Clicked ticket refresh button`);
                }
            },
            setupInterval: function() {
                if (this.intervalId) clearInterval(this.intervalId);
                this.intervalId = setInterval(() => {
                    this.clickRefresh();
                }, this.frequency * 1000);
            },
            setFrequency: function(newFrequency) {
                this.frequency = newFrequency;
                this.setupInterval();
                log(`${this.displayName} frequency updated to ${this.frequency}s`);
            }
        },
        ticketReplyCounter: {
            displayName: 'Reply Counter',
            description: '🧮 Lets you track the amount of tickets you have replied to during the day. <br><br>🤖 It automatically detects when you reply to a ticket so you dont have to press + each time',
            enabled: true,
            disableFeatures: ['none'],
            count: 0,
            storageKey: 'apex_ticket_reply_count',
            observer: null,
            counterElement: null,
            lastSubmissionTime: 0,
            debounceTime: 2000,

            init: function() {
                this.loadCount();
                this.createCounterUI();
                this.setupReplyObserver();
                log(`${this.displayName} initialized`);
            },

            disable: function() {
                this.observer?.disconnect();
                this.observer = null;

                if (this.counterElement?.parentNode) {
                    this.counterElement.parentNode.removeChild(this.counterElement);
                }
                this.counterElement = null;

                document.removeEventListener('click', this.delegatedClickHandler, true);
                log(`${this.displayName} disabled`);
            },

            loadCount: function() {
                const savedCount = localStorage.getItem(this.storageKey);
                this.count = savedCount ? parseInt(savedCount) : 0;
            },

            saveCount: function() {
                localStorage.setItem(this.storageKey, this.count.toString());
            },

            createCounterUI: function() {
                this.counterElement = document.createElement('div');
                this.counterElement.className = 'apex-reply-counter';
                this.counterElement.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                padding: 6px 0;
                margin: 8px 0;
                background: rgba(255,255,255,0.1);
                border-radius: 4px;
                width: 60px;
                box-sizing: border-box;
            `;

                // Count display
                const countDisplay = document.createElement('div');
                countDisplay.className = 'apex-reply-count';
                countDisplay.textContent = this.count;
                countDisplay.style.cssText = `
                   font-weight: bold;
                   font-size: 18px;
                   color: #e0e0e0;
                   margin-bottom: 2px;
                   width: 100%;
                   text-align: center;
               `;

                // Button row
                const buttonRow = document.createElement('div');
                buttonRow.style.cssText = `
                   display: flex;
                   justify-content: space-between;
                   width: 100%;
                   gap: 2px;
                   padding: 0 4px;
               `;

                // Button factory
                const createButton = (text, bgColor, customWidth) => {
                    const button = document.createElement('button');
                    button.textContent = text;
                    button.style.cssText = `
                    height: 20px;
                    width: ${customWidth || '16px'};
                    border: none;
                    border-radius: 2px;
                    cursor: pointer;
                    font-size: 11px;
                    background: ${bgColor};
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                `;
                    return button;
                };

                // Create buttons
                const decButton = createButton('-', '#c62828');
                decButton.onclick = () => this.updateCount(-1);

                const resetButton = createButton('R', '#616161', '20px');
                resetButton.title = 'Reset counter';
                resetButton.onclick = () => {
                    if (confirm('Reset reply counter to 0?')) {
                        this.count = 0;
                        this.saveCount();
                        this.updateCounterDisplay();
                    }
                };

                const incButton = createButton('+', '#2e7d32');
                incButton.onclick = () => this.updateCount(1);

                // Assemble UI
                buttonRow.append(decButton, resetButton, incButton);
                this.counterElement.append(countDisplay, buttonRow);

                const navObserver = new MutationObserver((mutations, obs) => {
                    const navbar = document.querySelector('.StyledNavList-sc-1s0nkfb-0.jOusVy.sc-141p82p-1.gKyxeA');
                    if (navbar && !navbar.querySelector('.apex-reply-counter')) {
                        const refNode = navbar.querySelector('#zendesk-apex-scripts-button')?.parentElement || navbar.children[2];
                        navbar.insertBefore(this.counterElement, refNode.nextSibling);
                        obs.disconnect();
                    }
                });
                navObserver.observe(document.body, { childList: true, subtree: true });
            },

            updateCount: function(change) {
                this.count = Math.max(0, this.count + change);
                this.saveCount();
                this.updateCounterDisplay();
                log(`Ticket count updated: ${this.count}`);

                if (this.count === 100) {
                    this.triggerCelebration();
                }
            },

            // Easter egg :p
            triggerCelebration: function() {
                const colors = ['#13425E', '#FFD744', '#40B350', '#ffff00', '#ff00ff'];
                const duration = 1500;
                const audio = new Audio('https://audio.jukehost.co.uk/zmX2eSaL9LR9AegCGSmGfHWQlRhUhb5w.mp3');
                audio.volume = 1.0
                audio.play().catch(e => log('Auto-play prevented:', e));

                GM_addStyle(`
                   @keyframes apex-confetti-fall {
                       to {
                           transform: translateY(100vh);
                           opacity: 0;
                       }
                   }
               `);

                const end = Date.now() + duration;
                (function frame() {
                    if (Date.now() > end) return;
                    const particleCount = 3 + Math.floor(Math.random() * 3);
                    for (let i = 0; i < particleCount; i++) {
                        const particle = document.createElement('div');
                        particle.style.cssText = `
                           position: fixed;
                           top: -10px;
                           left: ${Math.random() * 100}vw;
                           width: 6px;
                           height: 6px;
                           background: ${colors[Math.floor(Math.random() * colors.length)]};
                           border-radius: 50%;
                           pointer-events: none;
                           z-index: 9999;
                           transform: rotate(${Math.random() * 360}deg);
                           animation: apex-confetti-fall ${Math.random() * 0.5 + 0.5}s linear forwards;
                       `;
                        document.body.appendChild(particle);
                        setTimeout(() => particle.remove(), 600);
                    }
                    requestAnimationFrame(frame);
                })();
            },

            updateCounterDisplay: function() {
                const display = this.counterElement?.querySelector('.apex-reply-count');
                if (display) {
                    display.textContent = `${this.count}`;
                }
            },

            setupReplyObserver: function() {
                const handleSubmission = () => {
                    const now = Date.now();
                    if (now - this.lastSubmissionTime < this.debounceTime) {
                        log('Submission ignored due to debounce');
                        return;
                    }
                    const isTicket = document.querySelector('[role="tab"][data-selected="true"][data-is-chat="false"]');
                    if (!isTicket) return;
                    this.lastSubmissionTime = now;
                    log('Submission detected, updating count');
                    this.updateCount(1);
                };

                this.delegatedClickHandler = (e) => {
                    const target = e.target;
                    if (target.closest('[data-test-id="submit_button-button"], [data-tracking-id^="submit_button-menu-"]')) {
                        handleSubmission();
                    }
                };
                document.addEventListener('click', this.delegatedClickHandler, true);

                this.observer = new MutationObserver(() => {
                });
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                document.addEventListener('submit', (e) => {
                    if (e.target.closest('.comment-form')) {
                        handleSubmission();
                    }
                }, true);
            }
        },
        autoNotificationCloser: {
            displayName: 'Auto-Close Notifications',
            description: '❎ Automatically dismisses notifications/errors after 5 seconds.<br>Zendesk has built-in notifications that have to be manually closed, so this feature can help with that.<br><br>⚠️ This doesn\'t remove Windows notifications. If you have those, you can disable the site permission to send notifications through Windows, in your browser settings.',
            enabled: true,
            disableFeatures: ['none'],
            observer: null,
            timeouts: new Set(),
            init: function() {
                const closeNotification = (notification) => {
                    const closeButton = notification.querySelector(
                        '[data-test-id="notification-close-btn"], [data-test-id="action-notification-close-btn"]'
                    );
                    if (closeButton && !this.timeouts.has(notification)) {
                        const timeoutId = setTimeout(() => {
                            closeButton.click();
                            this.timeouts.delete(notification);
                        }, 5000);
                        this.timeouts.add(notification);
                    }
                };
                document.querySelectorAll(
                    '[data-test-id="notification"], [data-test-id="action-notification"]'
                ).forEach(closeNotification);

                this.observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches('[data-test-id="notification"], [data-test-id="action-notification"]')) {
                                    closeNotification(node);
                                }
                                const notifications = node.querySelectorAll(
                                    '[data-test-id="notification"], [data-test-id="action-notification"]'
                                );
                                notifications.forEach(closeNotification);
                            }
                        });
                    });
                });

                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                log(`${this.displayName} initialized`);
            },
            disable: function() {
                if (this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                }
                this.timeouts.forEach(notification => {
                    const closeButton = notification.querySelector(
                        '[data-test-id="notification-close-btn"]'
                    );
                    if (closeButton) closeButton.click();
                });
                this.timeouts.clear();
                log(`${this.displayName} disabled`);
            }
        },
        agentStatusMonitor: {
            displayName: 'Chat status banner',
            description: '🚩 Displays a warning banner when agent status is set to Away or Invisible<br><br>💫 Useful for remembering to switch back to accepting chats after coming back from a break.',
            enabled: true,
            disableFeatures: ['none'],
            observer: null,
            currentState: null,
            bodyObserver: null,

            init: function() {
                this.checkStatus();
                this.setupObserver();
                log(`${this.displayName} initialized`);
            },

            disable: function() {
                if (this.observer) this.observer.disconnect();
                if (this.bodyObserver) this.bodyObserver.disconnect();
                this.removeBanner();
                log(`${this.displayName} disabled`);
            },

            createBanner: function() {
                this.removeBanner();

                const sandboxBanner = document.getElementById('sandbox_banner') || this.createSandboxContainer();
                const banner = document.createElement('div');
                banner.id = 'apex-agent-status-warning';
                Object.assign(banner.style, {
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#B94A4D',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    fontSize: '14px',
                    borderRadius: '4px',
                    margin: '8px 0'
                });

                banner.textContent = `⚠️ You are currently ${this.currentState.toUpperCase()} - You are not accepting chats.`;
                sandboxBanner.appendChild(banner);
            },

            removeBanner: function() {
                const banner = document.getElementById('apex-agent-status-warning');
                if (banner) banner.remove();
            },

            createSandboxContainer: function() {
                const container = document.createElement('div');
                container.id = 'sandbox-banner';
                document.body.insertAdjacentElement('afterbegin', container);
                return container;
            },

            checkStatus: function() {
                const statusButton = document.querySelector('[data-test-id="toolbar-profile-menu-button"]');
                if (!statusButton) return;

                const statusIndicator = statusButton.querySelector('figcaption[aria-label]');
                if (!statusIndicator) return;

                const newState = statusIndicator.getAttribute('aria-label');
                if (newState === this.currentState) return;

                this.currentState = newState;

                if (newState === 'available') {
                    this.removeBanner();
                } else {
                    this.createBanner();
                }
            },

            setupObserver: function() {
                const statusButton = document.querySelector('[data-test-id="toolbar-profile-menu-button"]');
                const statusIndicator = statusButton ? statusButton.querySelector('figcaption[aria-label]') : null;
                if (!statusButton || !statusIndicator) {
                    setTimeout(() => this.setupObserver(), 1000);
                    return;
                }

                this.observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.attributeName === 'aria-label') {
                            this.checkStatus();
                        }
                    });
                });

                this.observer.observe(statusIndicator, {
                    attributes: true,
                    attributeFilter: ['aria-label']
                });

                this.bodyObserver = new MutationObserver(() => {
                    if (!document.contains(statusButton)) {
                        this.checkStatus();
                        this.setupObserver();
                    }
                    if (this.currentState && this.currentState !== 'available') {
                        const banner = document.getElementById('apex-agent-status-warning');
                        if (!banner) {
                            this.createBanner();
                        }
                    }
                });

                this.bodyObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        },
        statusSoundNotifier: {
            displayName: 'Status Sound Notifier',
            description: '🔊 Plays a sound notification when your agent status changes between Available and Offline.',
            enabled: true,
            disableFeatures: ['none'],
            observer: null,
            lastStatus: null,
            lastPlayedSound: null,
            defaultSoundUrls: {
                available: 'https://audio.jukehost.co.uk/teLfBvHayko1cNPq8BybuKWWWEuxoffh.mp3',
                offline: 'https://audio.jukehost.co.uk/1RYHVAFyEEmHfU871t8u6qSor8qs7VGt.mp3'
            },
            soundUrls: {
                available: 'https://audio.jukehost.co.uk/teLfBvHayko1cNPq8BybuKWWWEuxoffh.mp3',
                offline: 'https://audio.jukehost.co.uk/1RYHVAFyEEmHfU871t8u6qSor8qs7VGt.mp3'
            },
            volume: 0.8,

            init: function() {
                this.loadLastPlayedSound();
                this.loadSoundSettings();
                this.setupStatusObserver();
                log(`${this.displayName} initialized`);
            },

            disable: function() {
                if (this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                }
                log(`${this.displayName} disabled`);
            },

            loadLastPlayedSound: function() {
                this.lastPlayedSound = localStorage.getItem('apexStatusSoundLastPlayed');
            },

            saveLastPlayedSound: function(status) {
                this.lastPlayedSound = status;
                localStorage.setItem('apexStatusSoundLastPlayed', status);
            },

            setupStatusObserver: function() {
                this.checkCurrentStatus();
                this.observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'attributes' &&
                            mutation.attributeName === 'aria-label' &&
                            mutation.target.tagName.toLowerCase() === 'figcaption') {

                            const newStatus = mutation.target.getAttribute('aria-label');
                            this.handleStatusChange(newStatus);
                        }
                    }
                });
                this.observer.observe(document.body, {
                    attributes: true,
                    attributeFilter: ['aria-label'],
                    subtree: true
                });
                setInterval(() => this.checkCurrentStatus(), 5000);
            },

            checkCurrentStatus: function() {
                const statusIndicator = document.querySelector('figcaption[aria-label]');
                if (statusIndicator) {
                    const currentStatus = statusIndicator.getAttribute('aria-label');
                    if (currentStatus && this.lastStatus !== currentStatus) {
                        this.handleStatusChange(currentStatus);
                    }
                }
            },

            handleStatusChange: function(newStatus) {
                if (this.lastStatus === newStatus) return;

                log(`Agent status changed from ${this.lastStatus || 'unknown'} to ${newStatus}`);
                this.lastStatus = newStatus;
                // Play sound based on status
                if (newStatus === 'available') {
                    this.playSound('available');
                } else if (newStatus === 'offline') {
                    this.playSound('offline');
                }
            },

            playSound: function(statusType) {
                if (this.lastPlayedSound === statusType) {
                    return;
                }

                const soundUrl = this.soundUrls[statusType];
                if (soundUrl) {
                    const audio = new Audio(soundUrl);
                    audio.volume = this.volume;
                    audio.play().catch(e => log(`Failed to play ${statusType} sound: ${e}`));
                    this.saveLastPlayedSound(statusType);
                    log(`Played ${statusType} status sound`);
                }
            },

            setVolume: function(newVolume) {
                this.volume = Math.max(0, Math.min(1, newVolume));
                log(`Status Sound Notifier volume set to ${this.volume}`);
            },

            loadSoundSettings: function() {
                const avail = localStorage.getItem('apexStatusSoundUrl_available');
                const off = localStorage.getItem('apexStatusSoundUrl_offline');
                if (avail) this.soundUrls.available = avail;
                if (off) this.soundUrls.offline = off;
            },

            saveSoundSettings: function() {
                localStorage.setItem('apexStatusSoundUrl_available', this.soundUrls.available);
                localStorage.setItem('apexStatusSoundUrl_offline', this.soundUrls.offline);
            },

            setSoundUrl: function(type, url) {
                if (this.soundUrls[type] !== undefined) {
                    this.soundUrls[type] = url;
                    this.saveSoundSettings();
                }
            },

            resetSoundUrl: function(type) {
                if (this.defaultSoundUrls[type]) {
                    this.soundUrls[type] = this.defaultSoundUrls[type];
                    this.saveSoundSettings();
                }
            }
        },
        chatResponseTimer: {
            displayName: 'Chat Response Timer',
            description: '⏰ Creates a timer for each chat, and notifies you if you have not sent a message after 8 minutes. <br><br>Useful to prevent forgetting about chats or to ask for updates if the client is testing something.<br><br>🤖 Enabling this will disable the Hide Chats feature',
            enabled: true,
            disableFeatures: ['chatHider'],
            timers: new Map(),
            lastActivityTimes: new Map(),
            displayInterval: null,
            defaultSoundUrl: 'https://audio.jukehost.co.uk/dvafhtPS9C7DURxuwoWra0BVGHwHyEH8.mp3',
            soundUrl: 'https://audio.jukehost.co.uk/dvafhtPS9C7DURxuwoWra0BVGHwHyEH8.mp3',
            volume: 0.8,

            init: function() {
                this.loadVolumeSettings();
                this.loadSoundSettings();
                this.observeChatActivity();
                this.observeMessageSending();
                this.observeChatStatus();
                this.startDisplayInterval();
                log(`${this.displayName} initialized`);
            },

            disable: function() {
                this.timers.forEach(clearTimeout);
                this.timers.clear();

                if (this.displayInterval) {
                    clearInterval(this.displayInterval);
                    this.displayInterval = null;
                }

                document.querySelectorAll('.apex-chat-timer').forEach(el => el.remove());
                log(`${this.displayName} disabled`);
            },

            observeChatActivity: function() {
                // observe DOM for any changes (new or updated chat containers)
                new MutationObserver(() => {
                    document.querySelectorAll('[data-entity-type="chat"]').forEach(chatElement => {
                        const chatId = chatElement.getAttribute('data-entity-id');
                        if (!this.lastActivityTimes.has(chatId)) {
                            this.lastActivityTimes.set(chatId, Date.now());
                        }
                        this.ensureTimerBadge(chatElement);

                        if (chatElement.getAttribute('data-selected') === 'true' && !this.timers.has(chatId)) {
                            this.startInactivityTimer(chatId, chatElement);
                        }
                    });
                }).observe(document.body, { childList: true, subtree: true });
            },

            observeMessageSending: function() {
                document.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        this.handleMessageSent();
                    }
                });

                document.addEventListener('click', (event) => {
                    if (event.target.matches('[data-test-id="omnichannel-omnicomposer-send-button"]')) {
                        this.handleMessageSent();
                    }
                });
            },

            observeChatStatus: function() {
                // Watch the chat avatar for changes in status. I have to use the avatar due to that zendesk is a bit dumb and tracking changes to the data-entity-type is not reliable
                const avatar = document.querySelector('[data-test-id="header-chat-tab-avatar"]');
                if (!avatar) return;
                const avatarObserver = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
                            const status = avatar.getAttribute('aria-label');
                            if (status === 'offline') {
                                // If the active chat goes offline, clear its timer.
                                const activeChat = document.querySelector('[data-entity-type="chat"][data-selected="true"]');
                                if (activeChat) {
                                    const chatId = activeChat.getAttribute('data-entity-id');
                                    if (this.timers.has(chatId)) {
                                        clearTimeout(this.timers.get(chatId));
                                        this.timers.delete(chatId);
                                    }
                                    this.lastActivityTimes.delete(chatId);
                                    this.updateTimerBadge(activeChat, 'ended');
                                }
                            }
                        }
                    });
                });
                avatarObserver.observe(avatar, { attributes: true });
            },

            handleMessageSent: function() {
                const activeChat = document.querySelector('[data-entity-type="chat"][data-selected="true"]');
                if (!activeChat) return;
                const chatId = activeChat.getAttribute('data-entity-id');
                this.lastActivityTimes.set(chatId, Date.now());
                this.resetInactivityTimer(chatId, activeChat);
            },

            startInactivityTimer: function(chatId, chatElement) {
                const timer = setTimeout(() => {
                    this.alertUser(chatElement);
                    // Timer for chats, 8 minutes by default. Change this if you want a different timer for some reason (?. Time is in miliseconds
                }, 480000);
                this.timers.set(chatId, timer);
            },

            resetInactivityTimer: function(chatId, chatElement) {
                if (this.timers.has(chatId)) {
                    clearTimeout(this.timers.get(chatId));
                    this.timers.delete(chatId);
                }
                this.startInactivityTimer(chatId, chatElement);
            },

            startDisplayInterval: function() {
                this.displayInterval = setInterval(() => {
                    this.lastActivityTimes.forEach((lastTime, chatId) => {
                        const chatElement = document.querySelector(`[data-entity-type="chat"][data-entity-id="${chatId}"]`);
                        if (chatElement) {
                            const elapsed = Date.now() - lastTime;
                            const formatted = this.formatTime(elapsed);
                            this.updateTimerBadge(chatElement, formatted);
                        }
                    });
                }, 1000);
            },

            formatTime: function(milliseconds) {
                const totalSeconds = Math.floor(milliseconds / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            },

            ensureTimerBadge: function(chatElement) {
                let badge = chatElement.querySelector('.apex-chat-timer');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'apex-chat-timer';
                    badge.style.position = 'absolute';
                    badge.style.top = '1px';
                    badge.style.right = '8px';
                    badge.style.padding = '2px 4px';
                    badge.style.backgroundColor = 'rgba(0,0,0,0.3)';
                    badge.style.color = '#fc0345';
                    badge.style.fontSize = '10px';
                    badge.style.borderRadius = '2px';
                    chatElement.style.position = 'relative';
                    chatElement.appendChild(badge);
                }
            },

            updateTimerBadge: function(chatElement, text) {
                const badge = chatElement.querySelector('.apex-chat-timer');
                if (badge) {
                    badge.textContent = text;
                }
            },

            alertUser: function(chatElement) {
                const activeChat = document.querySelector('[data-entity-type="chat"][data-selected="true"]');
                if (!activeChat || activeChat.getAttribute('data-entity-id') !== chatElement.getAttribute('data-entity-id')) {
                    return;
                }
                const audio = new Audio(this.soundUrl);
                audio.volume = this.volume;
                audio.play();
                chatElement.style.animation = 'fadeBlinkRed 1.5s infinite';
                chatElement.style.zIndex = '9999';
                setTimeout(() => {
                    chatElement.style.animation = '';
                    chatElement.style.zIndex = '';
                }, 10000);
            },

            loadVolumeSettings: function() {
                const savedVolume = localStorage.getItem('apexChatResponseTimerVolume');
                if (savedVolume !== null) {
                    this.volume = parseFloat(savedVolume);
                }
            },

            saveVolumeSettings: function() {
                localStorage.setItem('apexChatResponseTimerVolume', this.volume.toString());
            },

            setVolume: function(newVolume) {
                this.volume = Math.max(0, Math.min(1, newVolume));
                this.saveVolumeSettings();
                log(`Chat Response Timer volume set to ${this.volume}`);
            },

            loadSoundSettings: function() {
                const saved = localStorage.getItem('apexChatResponseTimerSound');
                if (saved) this.soundUrl = saved;
            },

            saveSoundSettings: function() {
                localStorage.setItem('apexChatResponseTimerSound', this.soundUrl);
            },

            setSoundUrl: function(url) {
                this.soundUrl = url;
                this.saveSoundSettings();
            },

            resetSoundUrl: function() {
                this.soundUrl = this.defaultSoundUrl;
                this.saveSoundSettings();
            }
        },
        chatHider: {
            displayName: 'Hide Chats',
            description: '👻 Hides chats from the tab list and blocks chat notification sounds. <br><br>🖥️🖥️ Recommended if you are using two monitors, one for tickets and one for chats. Enable this on the screen you want to dedicate to tickets.<br>Disabling the feature will bring your chats back, so do not worry about activating this accidentally 😜<br><br>🤖 Enabling this will disable the Chat Response Timer feature',
            enabled: false,
            forceDisabled: true, // This feature doesn't need to be enabled on startup, can produce some confusion so I'm having it disabled on startup
            disableFeatures: ['chatResponseTimer'],
            observers: [],
            hiddenContainers: new Set(),
            originalAudioPlay: null,

            init: function() {
                // Intercept Audio.prototype.play to block Zendesk notification sounds
                if (!this.originalAudioPlay) {
                    this.originalAudioPlay = Audio.prototype.play;
                    Audio.prototype.play = function() {
                        // Block sounds from Zendesk's domain but allow other sounds
                        if (this.src && this.src.includes('static.zdassets.com/agent/assets/react/js/')) {
                            log(`Blocked notification sound: ${this.src}`);
                            return Promise.resolve();
                        }
                        return features.chatHider.originalAudioPlay.apply(this);
                    };
                    log('Audio interception initialized');
                }

                const processChats = () => {
                    document.querySelectorAll('[data-is-chat="true"]').forEach(chat => {
                        const container = chat.closest(
                            '[data-garden-container-id="containers.tooltip"]'
                        );

                        if (container && !this.hiddenContainers.has(container)) {
                            container.style.display = 'none';
                            this.hiddenContainers.add(container);
                            log(`Hidden chat container: ${chat.dataset.entityId}`);
                        }
                    });
                };

                const observer = new MutationObserver(processChats);
                observer.observe(document.querySelector('[data-test-id="header-tablist"]'), {
                    childList: true,
                    subtree: true
                });
                this.observers.push(observer);

                processChats();
                log(`${this.displayName} initialized`);
            },

            disable: function() {
                // Restore original Audio.prototype.play
                if (this.originalAudioPlay) {
                    Audio.prototype.play = this.originalAudioPlay;
                    this.originalAudioPlay = null;
                    log('Restored original audio playback');
                }

                // Unhide chat containers
                this.hiddenContainers.forEach(container => {
                    container.style.display = '';
                });
                this.hiddenContainers.clear();

                // Disconnect observers
                this.observers.forEach(observer => observer.disconnect());
                this.observers = [];

                log(`${this.displayName} disabled`);
            }
        },
        autoShiftStart: createAutoShiftFeature(
            'autoShiftStart',
            'Auto Shift Start',
            '⏱️ Automatically sets Online status at your configured shift start time (UTC).<br><br>- Recommendation per shift:<br><br>🌃 Midnight shift: 04:00 AM<br>🌅 Morning Shift: 12:00 PM <br>🌇 Afternoon Shift: 08:00 PM',
            'shiftStart',
            '09:00',
            'Online'
        ),
        autoShiftEnd: createAutoShiftFeature(
            'autoShiftEnd',
            'Auto Shift End',
            '⏱️ Automatically sets Offline status at your configured shift end time (UTC).<br><br>- Recommendation per shift:<br><br>🌃 Midnight shift: 12:00 PM<br>🌅 Morning Shift: 08:00 PM <br>🌇 Afternoon Shift: 04:00 AM',
            'shiftEnd',
            '17:00',
            'Offline'
        ),
        tabHighlighter: {
            displayName: 'Tab Highlighter',
            description: '🎯 Makes the currently selected chat or ticket more visible with a customizable colored border. <br><br>❗ Make sure to click Save Settings for your change to apply.',
            enabled: true,
            disableFeatures: ['none'],
            settings: {
                borderColor: '#13425E',
                borderWidth: '2px',
                borderStyle: 'solid'
            },
            observer: null,

            init: function() {
                this.loadSettings();
                this.applyHighlightStyles();
                this.setupTabObserver();
                log(`${this.displayName} initialized`);
            },

            disable: function() {
                if (this.observer) {
                    this.observer.disconnect();
                    this.observer = null;
                }

                const styleElement = document.getElementById('apex-tab-highlighter-styles');
                if (styleElement) {
                    styleElement.remove();
                }

                log(`${this.displayName} disabled`);
            },

            loadSettings: function() {
                const savedSettings = GM_getValue('tabHighlighter_settings');
                if (savedSettings) {
                    try {
                        const parsed = JSON.parse(savedSettings);
                        this.settings = {...this.settings, ...parsed};
                    } catch (e) {
                        log('Error parsing tab highlighter settings');
                    }
                }
            },

            saveSettings: function() {
                GM_setValue('tabHighlighter_settings', JSON.stringify(this.settings));
                log('Tab highlighter settings saved');
                this.applyHighlightStyles();
            },

            applyHighlightStyles: function() {
                let styleElement = document.getElementById('apex-tab-highlighter-styles');
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.id = 'apex-tab-highlighter-styles';
                    document.head.appendChild(styleElement);
                }

                const { borderColor, borderWidth, borderStyle } = this.settings;

                styleElement.textContent = `
                    [role="tab"][data-selected="true"] {
                        border: ${borderWidth} ${borderStyle} ${borderColor} !important;
                        border-radius: 3px !important;
                        position: relative !important;
                        z-index: 1 !important;
                    }
                `;
            },

            setupTabObserver: function() {
                // Watch for tab selection changes
                this.observer = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'attributes' &&
                            mutation.attributeName === 'data-selected') {
                            this.applyHighlightStyles();
                        }
                    });
                });

                const setupObserver = () => {
                    const tabList = document.querySelector('[data-test-id="header-tablist"]');
                    if (!tabList) {
                        setTimeout(setupObserver, 500);
                        return;
                    }

                    const tabs = tabList.querySelectorAll('[role="tab"]');
                    tabs.forEach(tab => {
                        this.observer.observe(tab, {
                            attributes: true,
                            attributeFilter: ['data-selected']
                        });
                    });

                    this.observer.observe(tabList, {
                        childList: true,
                        subtree: false
                    });
                };

                setupObserver();
            }
        },
        transferNotification: {
            displayName: 'Transfer Notification',
            description: '🗞️ Notifies you whenever a chat is transferred to you. <br><br>🤔 Whenever an agent or department transfers you a chat, Zendesk does not notify you in any way. This fixes that by playing a sound and making the chat blink.',
            enabled: true,
            elements: new Set(),
            observers: [],
            pendingChecks: new Map(),
            defaultSoundUrl: 'https://audio.jukehost.co.uk/oMgjmKtsT7C4y4N5jdBbCxFvFrUMyNue.mp3',
            soundUrl: 'https://audio.jukehost.co.uk/oMgjmKtsT7C4y4N5jdBbCxFvFrUMyNue.mp3',
            volume: 1.0,

            init: function() {
                this.loadVolumeSettings();
                this.loadSoundSettings();
                this.setupTablistObserver();
                this.setupTooltipObserver();

                this.audioElement = new Audio(this.soundUrl);
                this.audioElement.preload = 'auto';
                this.audioElement.volume = this.volume;
                log(`${this.displayName} initialized`);
            },

            disable: function() {
                this.elements.forEach(el => {
                    el.style.animation = '';
                });
                this.elements.clear();
                this.observers.forEach(obs => {
                    obs.disconnect();
                });
                this.observers = [];

                this.pendingChecks.forEach((value, key) => {
                    clearTimeout(value.timeout);
                });
                this.pendingChecks.clear();

                if (this.audioElement) {
                    this.audioElement.pause();
                    this.audioElement = null;
                }

                log(`${this.displayName} disabled`);
            },

            setupTablistObserver: function() {
                const tablistContainer = document.querySelector('[role="tablist"]') ||
                      document.querySelector('.sc-lzuyri-0');

                if (!tablistContainer) {
                    setTimeout(() => this.setupTablistObserver(), 1000);
                    return;
                }

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) {
                                if (this.isConversationTab(node)) {
                                    const entityId = this.getEntityId(node);
                                    if (entityId) {
                                        this.checkTooltipStatus(entityId, node);
                                    }
                                }
                            }
                        });
                    });
                });

                observer.observe(tablistContainer, { childList: true, subtree: true });
                this.observers.push(observer);
            },

            isConversationTab: function(node) {
                const tabElement = node.querySelector('[role="tab"], [data-test-id="header-tab"]');
                if (!tabElement) {
                    return false;
                }

                const ariaLabel = tabElement.getAttribute('aria-label') || '';
                const isConversation = ariaLabel.includes('Conversation with');
                return isConversation;
            },

            getEntityId: function(node) {
                const tabElement = node.querySelector('[role="tab"], [data-test-id="header-tab"]');
                const entityId = tabElement?.getAttribute('data-entity-id');
                return entityId;
            },

            checkTooltipStatus: function(entityId, chatNode) {
                this.pendingChecks.set(entityId, {
                    chatNode,
                    timeout: setTimeout(() => {
                        this.pendingChecks.delete(entityId);
                    }, 5000)
                });

                const existingTooltip = this.findTooltipInContainer(entityId);
                if (existingTooltip) {
                    this.verifyTooltipStatus(existingTooltip, entityId);
                    return;
                }

                const tabElement = chatNode.querySelector('[role="tab"], [data-test-id="header-tab"]');
                if (tabElement) {
                    tabElement.dispatchEvent(new MouseEvent('mouseover', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                }
            },

            setupTooltipObserver: function() {
                const tooltipContainer = document.getElementById('tooltip-container');
                if (!tooltipContainer) {
                    setTimeout(() => this.setupTooltipObserver(), 1000);
                    return;
                }

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1 && node.matches('[role="tooltip"][data-entity-id]')) {
                                const entityId = node.getAttribute('data-entity-id');

                                if (this.pendingChecks.has(entityId)) {
                                    this.verifyTooltipStatus(node, entityId);
                                }
                            }
                        });
                    });
                });

                observer.observe(tooltipContainer, {
                    childList: true,
                    subtree: true
                });
                this.observers.push(observer);
            },

            findTooltipInContainer: function(entityId) {
                const container = document.getElementById('tooltip-container');
                if (!container) return null;

                return container.querySelector(
                    `[role="tooltip"][data-entity-id="${entityId}"]`
                );
            },

            verifyTooltipStatus: function(tooltip, entityId) {
                const pendingCheck = this.pendingChecks.get(entityId);
                if (!pendingCheck) {
                    return;
                }

                clearTimeout(pendingCheck.timeout);
                this.pendingChecks.delete(entityId);

                const statusBadge = tooltip.querySelector(
                    '[data-test-id="status-badge-open"]'
                );

                log(`[TransferNotification] Status check for ${entityId}:`, {
                    statusBadgeExists: !!statusBadge,
                    statusText: statusBadge?.textContent?.trim()
                });

                if (statusBadge && statusBadge.textContent.trim().toLowerCase() === 'open') {
                    log(`[TransferNotification] Valid transferred chat confirmed for ${entityId}`);
                    this.triggerNotification(pendingCheck.chatNode);
                } else {
                    log(`[TransferNotification] Invalid status for ${entityId}`);
                }
            },

            triggerNotification: function(chatNode) {
                if (this.audioElement) {
                    this.audioElement.currentTime = 0;
                    this.audioElement.volume = this.volume;
                    this.audioElement.play().catch(e => {
                        log('[TransferNotification] Error playing sound:', e);
                    });
                }

                if (chatNode) {
                    if (!document.getElementById('apex-blink-animation')) {
                        const style = document.createElement('style');
                        style.id = 'apex-blink-animation';
                        style.textContent = `
                            @keyframes apexBlinkEffect {
                                0% { box-shadow: 0 0 0 0 rgba(185, 74, 77, 0.9); }
                                50% { box-shadow: 0 0 0 10px rgba(185, 74, 77, 0.5); }
                                100% { box-shadow: 0 0 0 0 rgba(185, 74, 77, 0); }
                            }
                        `;
                        document.head.appendChild(style);
                    }

                    // Animatiokn
                    chatNode.style.animation = 'apexBlinkEffect 1s infinite';
                    chatNode.style.position = 'relative';
                    chatNode.style.zIndex = '9999';

                    this.elements.add(chatNode);

                    setTimeout(() => {
                        chatNode.style.animation = '';
                        chatNode.style.zIndex = '';
                        this.elements.delete(chatNode);
                    }, 10000);
                }
            },

            loadVolumeSettings: function() {
                const savedVolume = localStorage.getItem('apexTransferNotificationVolume');
                if (savedVolume !== null) {
                    this.volume = parseFloat(savedVolume);
                }
            },

            saveVolumeSettings: function() {
                localStorage.setItem('apexTransferNotificationVolume', this.volume.toString());
            },

            setVolume: function(newVolume) {
                this.volume = Math.max(0, Math.min(1, newVolume));
                this.saveVolumeSettings();
                if (this.audioElement) {
                    this.audioElement.volume = this.volume;
                }
                log(`Transfer Notification volume set to ${this.volume}`);
            },

            loadSoundSettings: function() {
                const saved = localStorage.getItem('apexTransferNotificationSound');
                if (saved) this.soundUrl = saved;
            },

            saveSoundSettings: function() {
                localStorage.setItem('apexTransferNotificationSound', this.soundUrl);
            },

            setSoundUrl: function(url) {
                this.soundUrl = url;
                this.saveSoundSettings();
                if (this.audioElement) {
                    this.audioElement.src = this.soundUrl;
                    this.audioElement.load();
                }
            },

            resetSoundUrl: function() {
                this.soundUrl = this.defaultSoundUrl;
                this.saveSoundSettings();
                if (this.audioElement) {
                    this.audioElement.src = this.soundUrl;
                    this.audioElement.load();
                }
            }
        }
        // Future features will be added here :]
    };

    /* =====================
       Tooltip Functions
       ===================== */
    function createTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'apex-feature-tooltip';
        tooltip.innerHTML = text;
        tooltip.style.position = 'fixed';
        tooltip.style.zIndex = '1000000';

        return tooltip;
    }
    function updateFeatureUI(featureKey) {
        const feature = features[featureKey];
        if (!feature) return;

        document.querySelectorAll(`[data-feature-id="${featureKey}"] .feature-status`).forEach(el => {
            el.textContent = feature.enabled ? 'Running' : 'Disabled';
            el.style.backgroundColor = feature.enabled ? '#40B350' : '#B94A4D';

            if (featureKey === 'autoRefresher') {
                el.textContent = `${feature.enabled ? 'Running' : 'Disabled'} (${feature.frequency}s)`;
            }
        });
    }
    function updateDependentFeatures(disabledFeatures) {
        disabledFeatures.forEach(featureKey => {
            GM_setValue(`feature_${featureKey}`, false);
            updateFeatureUI(featureKey);
            if (features[featureKey].observer) {
                features[featureKey].observer.disconnect();
            }
        });
    }

    /* =====================
       Overlay Menu Creation
       ===================== */
    function getFeaturesThatDisableThis(targetKey) {
        return Object.keys(features).filter(
            key => features[key].disableFeatures?.includes(targetKey)
        );
    }

    function createOverlay() {
        const oldOverlay = document.getElementById('zendesk-apex-scripts-overlay');
        if (oldOverlay) oldOverlay.remove();

        const overlay = document.createElement('div');
        overlay.id = 'zendesk-apex-scripts-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '104px',
            left: '62px',
            background: COLORS.overlayBackground,
            border: '1px solid #000',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 1)',
            padding: '15px',
            display: 'none',
            color: COLORS.textColor,
            minWidth: '300px',
            maxHeight: '70vh',
            overflowY: 'auto',
            zIndex: '999999',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        });

        // Title
        const title = document.createElement('div');
        title.textContent = 'Zendesk QoL Toolkit Menu';
        title.style.marginBottom = '10px';
        title.style.fontWeight = 'bold';
        title.style.textAlign = 'center';
        overlay.appendChild(title);

        // Search Box
        const searchBox = document.createElement('div');
        searchBox.className = 'apex-search-box';
        searchBox.innerHTML = `
        <input type="text" placeholder="Search features..." style="
            width: 96%;
            padding: 6px;
            margin-bottom: 10px;
            background: rgba(255,255,255,0.1);
            border: 1px solid #444;
            border-radius: 3px;
            color: white;
        ">
    `;
        overlay.appendChild(searchBox);

        // Tab Container
        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.borderBottom = '1px solid #444';
        tabContainer.style.marginBottom = '10px';
        overlay.appendChild(tabContainer);

        // Content Container
        const contentContainer = document.createElement('div');
        contentContainer.style.maxHeight = '65vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.paddingRight = '5px';
        overlay.appendChild(contentContainer);

        // Categorize features
        const categories = {
            'Tickets': ['autoRefresher', 'ticketReplyCounter'],
            'Chats': ['chatHider', 'autoShiftStart', 'autoShiftEnd', 'chatResponseTimer', 'transferNotification'],
            'Utilities': ['draggableTabs', 'utcClock', 'autoNotificationCloser', 'agentStatusMonitor', 'statusSoundNotifier', 'tabHighlighter']
        };

        // Create tabs
        Object.keys(categories).forEach(category => {
            const tab = document.createElement('button');
            tab.textContent = category;
            tab.style.cssText = `
                flex: 1;
                background: none;
                border: none;
                color: ${COLORS.textColor};
                padding: 8px;
                cursor: pointer;
                font-weight: normal;
            `;
            tab.addEventListener('click', () => switchTab(category, tabContainer, contentContainer));
            tabContainer.appendChild(tab);
        });

        // Create content panels
        Object.entries(categories).forEach(([category, featureKeys]) => {
            const panel = document.createElement('div');
            panel.dataset.category = category.toLowerCase();
            panel.style.display = 'none';

            featureKeys.forEach(featureKey => {
                const feature = features[featureKey];
                if (feature) {
                    const featureDiv = createFeatureControl(featureKey);
                    panel.appendChild(featureDiv);
                }
            });

            contentContainer.appendChild(panel);
        });

        // Close Button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            display: block;
            width: 100%;
            padding: 8px;
            margin-top: 10px;
            background: #B94A4D;
            color: ${COLORS.textColor};
            border: none;
            border-radius: 3px;
            cursor: pointer;
            `;
        closeButton.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
        overlay.appendChild(closeButton);

        // Activate first tab
        const firstTab = tabContainer.querySelector('button');
        if (firstTab) {
            firstTab.style.fontWeight = 'bold';
            const firstPanel = contentContainer.querySelector(`[data-category="${Object.keys(categories)[0].toLowerCase()}"]`);
            if (firstPanel) firstPanel.style.display = 'block';
        }

        // Search functionality
        const searchInput = searchBox.querySelector('input');
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.apex-feature-container').forEach(container => {
                const matches = container.dataset.featureName.includes(term) ||
                      container.textContent.toLowerCase().includes(term);
                container.style.display = matches ? 'block' : 'none';
            });
        });

        // Add to body and force reflow
        document.body.appendChild(overlay);
        void overlay.offsetHeight;

        return overlay;
    }

    function createFeatureControl(featureKey) {
        const feature = features[featureKey];
        const container = document.createElement('div');
        container.dataset.featureId = featureKey;
        container.dataset.featureName = feature.displayName.replace(/\s+/g, '-').toLowerCase();
        container.classList.add('apex-feature-container');
        container.style.marginBottom = '10px';
        container.style.position = 'relative';

        // Header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '8px';

        // Title
        const title = document.createElement('div');
        title.textContent = feature.displayName;
        title.style.flexGrow = '1';

        // Info Icon
        const infoIcon = document.createElement('div');
        infoIcon.textContent = '?';
        infoIcon.style.cssText = `
            width: 18px;
            height: 18px;
            border: 1px solid ${COLORS.textColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8em;
            cursor: help;
            opacity: 0.7;
            transition: opacity 0.2s;
        `;
        infoIcon.addEventListener('mouseenter', (e) => {
            const tooltip = createTooltip(feature.description);
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = `${rect.right + window.scrollX + 5}px`;
            tooltip.style.top = `${rect.top + window.scrollY}px`;
            document.body.appendChild(tooltip);
            e.target.tooltip = tooltip;
            setTimeout(() => {
                const tooltipRect = tooltip.getBoundingClientRect();
                if (tooltipRect.right > window.innerWidth) {
                    tooltip.style.left = `${rect.left + window.scrollX - tooltipRect.width - 5}px`;
                }
                if (tooltipRect.bottom > window.innerHeight) {
                    tooltip.style.top = `${window.innerHeight - tooltipRect.height - 5}px`;
                }
            }, 10);
        });
        infoIcon.addEventListener('mouseleave', () => {
            if (infoIcon.tooltip) {
                infoIcon.tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (infoIcon.tooltip && infoIcon.tooltip.parentNode) {
                        infoIcon.tooltip.parentNode.removeChild(infoIcon.tooltip);
                    }
                }, 150);
            }
        });

        header.append(title, infoIcon);
        container.appendChild(header);

        // Status Control
        const featureDiv = document.createElement('div');
        featureDiv.className = 'feature-status';
        featureDiv.style.cssText = `
        padding: 5px;
        background: ${feature.enabled ? '#40B350' : '#B94A4D'};
        border-radius: 3px;
        text-align: center;
        cursor: ${feature.alwaysOn ? 'default' : 'pointer'};
        transition: background-color 0.3s;
    `;

        if (featureKey === 'autoRefresher') {
            featureDiv.textContent = `${feature.enabled ? 'Running' : 'Disabled'} (${feature.frequency}s)`;
        } else {
            featureDiv.textContent = feature.enabled ? 'Running' : 'Disabled';
        }

        if (!feature.alwaysOn) {
            featureDiv.addEventListener('click', () => toggleFeature(featureKey));
        }

        container.appendChild(featureDiv);

        // Sound URL controls for statusSoundNotifier
        if (featureKey === 'statusSoundNotifier') {
            const soundContainer = document.createElement('div');
            soundContainer.style.cssText = `
                margin-top: 8px;
                padding: 5px;
                background: rgba(19, 66, 94, 0.3);
                border-radius: 3px;
            `;

            ['available', 'offline'].forEach(type => {
                const row = document.createElement('div');
                row.style.cssText = 'display:flex; align-items:center; gap:4px; margin-bottom:4px;';
                const label = document.createElement('span');
                label.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}:`;
                label.style.cssText = 'font-size:12px; color:' + COLORS.textColor + '; min-width:70px;';
                const input = document.createElement('input');
                input.type = 'text';
                input.value = feature.soundUrls[type];
                input.style.cssText = 'flex-grow:1; font-size:11px;';
                input.addEventListener('change', () => {
                    feature.setSoundUrl(type, input.value.trim());
                });
                const resetBtn = document.createElement('button');
                resetBtn.textContent = 'Reset';
                resetBtn.style.cssText = `padding:2px 6px; background:#13425E; color:${COLORS.textColor}; border:none; border-radius:3px; font-size:11px; cursor:pointer;`;
                resetBtn.addEventListener('click', () => {
                    feature.resetSoundUrl(type);
                    input.value = feature.soundUrls[type];
                });
                row.appendChild(label);
                row.appendChild(input);
                row.appendChild(resetBtn);
                soundContainer.appendChild(row);
            });

            container.appendChild(soundContainer);
        }

        // Special controls for autoRefresher
        if (featureKey === 'autoRefresher') {
            const freqButton = document.createElement('button');
            freqButton.textContent = 'Set Frequency';
            freqButton.style.cssText = `
            display: block;
            width: 100%;
            padding: 5px;
            margin-top: 5px;
            background: #13425E;
            color: ${COLORS.textColor};
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
            freqButton.addEventListener('click', () => {
                const input = prompt("Enter refresh frequency in seconds:", feature.frequency);
                const newFreq = parseFloat(input);
                if (!isNaN(newFreq) && newFreq > 0) {
                    feature.setFrequency(newFreq);
                    featureDiv.textContent = `${feature.enabled ? 'Running' : 'Disabled'} (${feature.frequency}s)`;
                }
            });
            container.appendChild(freqButton);
        }

        // Volume controls for chatResponseTimer and transferNotification
        if (featureKey === 'chatResponseTimer' || featureKey === 'transferNotification') {
            const volumeContainer = document.createElement('div');
            volumeContainer.style.cssText = `
                margin-top: 8px;
                padding: 5px;
                background: rgba(19, 66, 94, 0.3);
                border-radius: 3px;
            `;

            const volumeLabel = document.createElement('div');
            volumeLabel.textContent = 'Sound Volume:';
            volumeLabel.style.cssText = `
                font-size: 12px;
                margin-bottom: 5px;
                color: ${COLORS.textColor};
            `;

            const volumeControls = document.createElement('div');
            volumeControls.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
            `;

            const volumeSlider = document.createElement('input');
            volumeSlider.type = 'range';
            volumeSlider.min = '0';
            volumeSlider.max = '1';
            volumeSlider.step = '0.1';
            volumeSlider.value = feature.volume;
            volumeSlider.style.cssText = `
                flex-grow: 1;
                accent-color: #13425E;
            `;

            const volumeValue = document.createElement('span');
            volumeValue.textContent = Math.round(feature.volume * 100) + '%';
            volumeValue.style.cssText = `
                font-size: 12px;
                min-width: 36px;
                text-align: right;
                color: ${COLORS.textColor};
            `;

            volumeSlider.addEventListener('input', () => {
                const newVolume = parseFloat(volumeSlider.value);
                feature.setVolume(newVolume);
                volumeValue.textContent = Math.round(newVolume * 100) + '%';
            });

            const testButton = document.createElement('button');
            testButton.textContent = 'Test';
            testButton.style.cssText = `
                padding: 2px 6px;
                background: #13425E;
                color: ${COLORS.textColor};
                border: none;
                border-radius: 3px;
                font-size: 11px;
                cursor: pointer;
            `;
            testButton.addEventListener('click', () => {
                const audio = new Audio(feature.soundUrl);
                audio.volume = feature.volume;
                audio.play().catch(e => log(`Error playing test sound: ${e}`));
            });

            volumeControls.appendChild(volumeSlider);
            volumeControls.appendChild(volumeValue);
            volumeControls.appendChild(testButton);

            volumeContainer.appendChild(volumeLabel);
            volumeContainer.appendChild(volumeControls);
            container.appendChild(volumeContainer);

            const soundContainer = document.createElement('div');
            soundContainer.style.cssText = `
                margin-top: 8px;
                padding: 5px;
                background: rgba(19, 66, 94, 0.3);
                border-radius: 3px;
            `;

            const soundLabel = document.createElement('div');
            soundLabel.textContent = 'Sound URL:';
            soundLabel.style.cssText = `
                font-size: 12px;
                margin-bottom: 5px;
                color: ${COLORS.textColor};
            `;

            const soundControls = document.createElement('div');
            soundControls.style.cssText = 'display:flex; gap:8px; align-items:center;';

            const soundInput = document.createElement('input');
            soundInput.type = 'text';
            soundInput.value = feature.soundUrl;
            soundInput.style.cssText = 'flex-grow:1; font-size:11px;';
            soundInput.addEventListener('change', () => {
                feature.setSoundUrl(soundInput.value.trim());
            });

            const resetBtn = document.createElement('button');
            resetBtn.textContent = 'Reset';
            resetBtn.style.cssText = `padding:2px 6px; background:#13425E; color:${COLORS.textColor}; border:none; border-radius:3px; font-size:11px; cursor:pointer;`;
            resetBtn.addEventListener('click', () => {
                feature.resetSoundUrl();
                soundInput.value = feature.soundUrl;
            });

            soundControls.appendChild(soundInput);
            soundControls.appendChild(resetBtn);
            soundContainer.appendChild(soundLabel);
            soundContainer.appendChild(soundControls);
            container.appendChild(soundContainer);
        }

        // Special controls for autoShiftStart & autoShiftEnd
        if (featureKey === 'autoShiftStart' || featureKey === 'autoShiftEnd') {
            const settingsPanel = document.createElement('div');
            settingsPanel.className = 'apex-settings-panel';
            settingsPanel.style.display = 'block';
            settingsPanel.innerHTML = `
                <div class="apex-setting-row">
                    <label>${feature.label} (UTC):</label>
                    <input type="time" value="${feature.settings[feature.settingKey]}"
                           class="apex-time-input" data-setting="${feature.settingKey}">
                </div>
                <div class="apex-status-feedback"></div>
                <button class="apex-save-btn">Save Schedule</button>
            `;

            settingsPanel.querySelector('.apex-save-btn').addEventListener('click', () => {
                feature.settings[feature.settingKey] = settingsPanel.querySelector(`[data-setting="${feature.settingKey}"]`).value;
                feature.saveSettings();

                const feedbackEl = settingsPanel.querySelector('.apex-status-feedback');
                if (feedbackEl) {
                    feedbackEl.textContent = 'Settings saved!';
                    feedbackEl.className = 'apex-status-feedback apex-feedback-success';
                    setTimeout(() => {
                        feedbackEl.textContent = '';
                        feedbackEl.className = 'apex-status-feedback';
                    }, 3000);
                }

                feature.checkShiftStatus();
                log(`${feature.label} updated`);
            });

            container.appendChild(settingsPanel);
        }

        // Special controls for tabHighlighter
        if (featureKey === 'tabHighlighter') {
            // Create settings panel
            const settingsPanel = document.createElement('div');
            settingsPanel.className = 'apex-settings-panel';
            settingsPanel.style.display = 'block';
            settingsPanel.innerHTML = `
                <div class="apex-setting-row">
                    <label>Border Color:</label>
                    <input type="color" value="${feature.settings.borderColor}"
                           class="apex-color-input" data-setting="borderColor">
                </div>
                <div class="apex-setting-row">
                    <label>Border Width:</label>
                    <select data-setting="borderWidth" class="apex-select-input">
                        <option value="1px" ${feature.settings.borderWidth === '1px' ? 'selected' : ''}>Thin (1px)</option>
                        <option value="2px" ${feature.settings.borderWidth === '2px' ? 'selected' : ''}>Medium (2px)</option>
                        <option value="3px" ${feature.settings.borderWidth === '3px' ? 'selected' : ''}>Thick (3px)</option>
                    </select>
                </div>
                <div class="apex-setting-row">
                    <label>Border Style:</label>
                    <select data-setting="borderStyle" class="apex-select-input">
                        <option value="solid" ${feature.settings.borderStyle === 'solid' ? 'selected' : ''}>Solid</option>
                        <option value="dashed" ${feature.settings.borderStyle === 'dashed' ? 'selected' : ''}>Dashed</option>
                        <option value="dotted" ${feature.settings.borderStyle === 'dotted' ? 'selected' : ''}>Dotted</option>
                    </select>
                </div>
                <div class="apex-status-feedback"></div>
                <button class="apex-save-btn">Save Settings</button>
            `;

            // Add event listeners
            settingsPanel.querySelector('.apex-save-btn').addEventListener('click', () => {
                feature.settings.borderColor = settingsPanel.querySelector('[data-setting="borderColor"]').value;
                feature.settings.borderWidth = settingsPanel.querySelector('[data-setting="borderWidth"]').value;
                feature.settings.borderStyle = settingsPanel.querySelector('[data-setting="borderStyle"]').value;
                feature.saveSettings();

                // Show feedback
                const feedbackEl = settingsPanel.querySelector('.apex-status-feedback');
                if (feedbackEl) {
                    feedbackEl.textContent = 'Settings saved!';
                    feedbackEl.className = 'apex-status-feedback apex-feedback-success';
                    setTimeout(() => {
                        feedbackEl.textContent = '';
                        feedbackEl.className = 'apex-status-feedback';
                    }, 3000);
                }

                log('Tab highlighter settings updated');
            });

            container.appendChild(settingsPanel);
        }

        return container;
    }

    function toggleFeature(featureKey) {
        const feature = features[featureKey];
        const currentState = feature.enabled;

        try {
            if (currentState) {
                feature.disable?.();
                feature.enabled = false;
            } else {
                const featuresToDisable = feature.disableFeatures || [];
                if (featuresToDisable.length > 0) {
                    featuresToDisable.forEach(otherKey => {
                        if (features[otherKey]?.enabled) {
                            features[otherKey].disable();
                            features[otherKey].enabled = false;
                            updateFeatureUI(otherKey);
                        }
                    });
                }
                feature.init?.();
                feature.enabled = true;
            }
            GM_setValue(`feature_${featureKey}`, feature.enabled);
        } catch (error) {
            console.error(`Error toggling ${featureKey}:`, error);
        } finally {
            updateFeatureUI(featureKey);
        }
    }

    function switchTab(category, tabContainer, contentContainer) {
        tabContainer.querySelectorAll('button').forEach(btn => {
            btn.style.fontWeight = btn.textContent === category ? 'bold' : 'normal';
        });

        contentContainer.querySelectorAll('[data-category]').forEach(panel => {
            panel.style.display = panel.dataset.category === category.toLowerCase() ? 'block' : 'none';
        });
    }

    /* =====================
       Draggable Tabs Functions
       ===================== */
    function initDraggableTabs() {
        const tabList = document.querySelector('[data-test-id="header-tablist"]');
        if (!tabList) return;

        const tabs = tabList.querySelectorAll(':scope > div');
        tabs.forEach(tab => {
            if (!tab.dataset.draggableSetup) {
                tab.draggable = true;
                tab.addEventListener('dragstart', handleDragStart);
                tab.addEventListener('dragend', handleDragEnd);
                tab.addEventListener('dragover', handleDragOver);
                tab.addEventListener('drop', handleDrop);
                tab.dataset.draggableSetup = "true";
                log(`Initialized draggable tab: ${tab.textContent.trim()}`);
            }
        });
    }

    function handleDragStart(e) {
        draggedTab = this;
        this.style.opacity = '0.5';
        e.dataTransfer.setData("text/plain", "dummy");
    }

    function handleDragEnd() {
        this.style.opacity = '1';
        draggedTab = null;
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    function handleDrop(e) {
        e.preventDefault();
        if (draggedTab && draggedTab !== this) {
            const rect = this.getBoundingClientRect();
            const insertBefore = e.clientX < rect.left + (rect.width / 2);
            this.parentNode.insertBefore(draggedTab, insertBefore ? this : this.nextSibling);
            log('Tab position updated');
        }
    }

    function setupTabListObserver() {
        const tabList = document.querySelector('[data-test-id="header-tablist"]');
        if (!tabList) {
            setTimeout(setupTabListObserver, 500);
            return;
        }

        initDraggableTabs();

        // Observe for newly added tabs
        tabListObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    setTimeout(initDraggableTabs, 100);
                }
            });
        });

        tabListObserver.observe(tabList, {
            childList: true,
            subtree: false,
            attributes: false
        });

        log('Tab list observer activated');
    }

    /* =====================
       Navbar Button Implementation
       ===================== */
    function addNavbarButton() {
        const observer = new MutationObserver((mutations, obs) => {
            const supportNav = document.querySelector('nav[data-test-id="support_nav"]');
            if (!supportNav) return;
            const navbar = supportNav.querySelector('[data-garden-id="chrome.nav_list"]');
            if (!navbar) return;

            if (document.getElementById('zendesk-apex-scripts-button')) {
                log('Button already exists');
                return;
            }

            // Create button container
            const li = document.createElement('li');
            Object.assign(li, {
                'data-garden-id': 'chrome.nav_list_item',
                'data-garden-version': '9.5.2',
                className: 'StyledNavListItem-sc-18cj2v7-0 bbgdDD',
            });

            const button = document.createElement('button');
            Object.assign(button, {
                id: 'zendesk-apex-scripts-button',
                tabIndex: '0',
                title: 'Apex Scripts',
                'data-garden-id': 'chrome.nav_button',
                'data-garden-version': '9.5.2',
                className: 'StyledBaseNavItem-sc-zvo43f-0 StyledNavButton-sc-f5ux3-0 gvFgbC bkva-dj',
                style: 'cursor: pointer;',
            });

            // Button icon
            const icon = document.createElement('div');
            icon.className = 'sc-rmw0n7-0 ecmypT';
            icon.innerHTML = `
                <span class="sc-lkdwmp-0 bZaEcR">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-80 120-280v-400l360-200 360 200v400L480-80ZM364-590q23-24 53-37t63-13q33 0 63 13t53 37l120-67-236-131-236 131 120 67Zm76 396v-131q-54-14-87-57t-33-98q0-11 1-20.5t4-19.5l-125-70v263l240 133Zm40-206q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm40 206 240-133v-263l-125 70q3 10 4 19.5t1 20.5q0 55-33 98t-87 57v131Z"/></svg>
                </span>
            `;

            // Button text
            const text = document.createElement('span');
            Object.assign(text, {
                className: 'StyledNavItemText-sc-13m84xl-0 iOGbGR apex-scripts-text',
                textContent: 'Apex Scripts',
            });

            // Assemble the button
            button.append(icon, text);
            li.appendChild(button);
            navbar.insertBefore(li, navbar.children[2]);

            // Create overlay and assign toggle behavior to the button
            const overlay = createOverlay();

            button.onclick = () => {
                const overlay = document.getElementById('zendesk-apex-scripts-overlay');
                if (!overlay) return;

                if (overlay.classList.contains('apex-visible')) {
                    overlay.classList.remove('apex-visible');
                    setTimeout(() => {
                        overlay.style.display = 'none';
                    }, 150); // Match transition duration
                } else {
                    overlay.style.display = 'block';
                    void overlay.offsetHeight;
                    overlay.classList.add('apex-visible');
                }
            };

            obs.disconnect();
            log('Navbar button added successfully');
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* =====================
       Main Initialization
       ===================== */
    for (const key in features) {
        if (features.hasOwnProperty(key)) {
            if (features[key].forceDisabled) {
                features[key].enabled = false;
                GM_setValue(`feature_${key}`, false);
            } else {
                features[key].enabled = GM_getValue(`feature_${key}`, features[key].enabled);
            }
        }
    }

    for (const key in features) {
        const feature = features[key];
        if (feature.enabled) {
            const conflicts = feature.disableFeatures || [];
            if (conflicts.length > 0) {
                const disabledFeatures = [];

                conflicts.forEach(otherKey => {
                    if (features[otherKey]?.enabled) {
                        log(`Auto-disabling ${otherKey} due to ${key} being enabled`);
                        features[otherKey].enabled = false;
                        disabledFeatures.push(otherKey);
                    }
                });
                if (disabledFeatures.length > 0) {
                    updateDependentFeatures(disabledFeatures);
                }
            }
        }
    }

    setTimeout(() => {
        for (const key in features) {
            if (features.hasOwnProperty(key)) {
                const feature = features[key];
                if (feature.enabled && typeof feature.init === 'function') {
                    feature.init();
                }
            }
        }
        addNavbarButton();

        log('All systems initialized 😎');
    }, SCRIPT_DELAY);

    // Global Styles
    GM_addStyle(`

:root {
  /* Color Variables */
  --apex-primary: #262626;
  --apex-text: #fff;
  --apex-success: #40B350;
  --apex-error: #B94A4D;
  --apex-warning: #FFA500;
  --apex-blue: #13425E;
}

/* =====================
   Core Interactive Elements
   ===================== */
[draggable="true"] {
  cursor: move !important;
  user-select: none;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.7 !important;
  }
}

/* =====================
   Overlay & UI Components
   ===================== */
#zendesk-apex-scripts-overlay {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--apex-primary) !important;
  color: var(--apex-text);
  z-index: 999999;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);

  /* Scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
  }
}

/* =====================
   Tab System
   ===================== */
.apex-tab-container {
  button {
    &:hover {
      background: rgba(255,255,255,0.1);
    }
  }
}

/* =====================
   Feature Cards
   ===================== */
.apex-feature-container {
  background: rgba(255,255,255,0.05);
  padding: 10px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255,255,255,0.1);
  }
}

/* =====================
   Tooltip System (Consolidated)
   ===================== */
.apex-feature-tooltip {
  position: fixed !important;
  z-index: 1000000 !important;
  background: var(--apex-primary) !important;
  color: var(--apex-text) !important;
  padding: 8px 12px !important;
  border-radius: 4px !important;
  max-width: 300px !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
  pointer-events: none !important;
  border: 1px solid #444 !important;
  font-size: 13px !important;
  line-height: 1.4 !important;
  white-space: normal !important;
  backdrop-filter: blur(2px) !important;
  animation: apex-tooltip-fade 0.15s ease-out !important;
}

/* =====================
   Status Indicators
   ===================== */
.feature-status {
  position: relative;
  transition: background-color 0.3s;

  &.enabled { background: var(--apex-success); }
  &.disabled { background: var(--apex-error); }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &[data-conflict]::after {
    content: "⚡";
    position: absolute;
    right: 5px;
    color: #ff0000;
  }
}

/* =====================
   Reply Counter
   ===================== */
.apex-reply-counter {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  button {
    outline: none !important;
    line-height: 1;

    &:hover { opacity: 0.9; }
    &:active { opacity: 1; }
  }
}

/* =====================
   Animations (Consolidated)
   ===================== */
@keyframes apex-fade-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeBlinkRed {
  0%, 100% { opacity: 1; background-color: transparent; }
  50% { opacity: 0.7; background-color: rgba(185, 74, 77, 0.9); }
}

@keyframes apex-tooltip-fade {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes apex-highlight {
  from { background-color: #FFFF00; }
  to { background-color: inherit; }
}

.apex-updated { animation: apex-highlight 0.5s; }
#apex-agent-status-warning { animation: apex-fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1); }

/* =====================
   Zendesk Overrides
   ===================== */
[data-garden-id="tooltips.tooltip"] {
  z-index: 99999 !important; /* Below our tooltips */
}

/* =====================
   Search Box
   ===================== */
.apex-search-box {
  input {
    &:focus {
      outline: none;
      border-color: var(--apex-success) !important;
    }
  }
}
/* Overlay Animation */
#zendesk-apex-scripts-overlay {
    opacity: 0;
    transform: translateY(5px);
    transition:
        opacity 0.15s ease-out,
        transform 0.15s ease-out,
        visibility 0.15s;
    visibility: hidden;
}

#zendesk-apex-scripts-overlay.apex-visible {
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
}
/* Feature-specific container */
.apex-feature-settings-container {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.1);
}

.apex-settings-panel {
    display: none;
    padding: 10px;
    margin-top: 8px;
    background: rgba(255,255,255,0.05);
    border-radius: 4px;
}

.apex-setting-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.apex-setting-row label {
    flex: 1;
    font-size: 13px;
    color: rgba(255,255,255,0.8);
}

.apex-time-input, .apex-select-input {
    background: rgba(255,255,255,0.1);
    border: 1px solid #444;
    border-radius: 3px;
    color: white;
    padding: 3px 5px;
    width: 90px;
}

.apex-color-input {
    width: 40px;
    height: 25px;
    border: none;
    border-radius: 3px;
    background: none;
    cursor: pointer;
}

.apex-save-btn {
    width: 100%;
    padding: 5px;
    margin-top: 5px;
    background: #13425E;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.2s;
}

.apex-save-btn:hover {
    background: #1a5a7a;
}

.apex-test-btn:hover {
    background: #ff8c00;
}

.apex-status-feedback {
    padding: 8px;
    margin: 0px 0;
    border-radius: 4px;
    font-size: 13px;
    text-align: center;
    transition: all 0.3s;
}

.apex-feedback-success {
    background-color: rgba(64, 179, 80, 0.2);
    color: #40B350;
    border: 1px solid #40B350;
}

.apex-feedback-error {
    background-color: rgba(185, 74, 77, 0.2);
    color: #B94A4D;
    border: 1px solid #B94A4D;
}

.apex-feedback-warning {
    background-color: rgba(255, 165, 0, 0.2);
    color: #FFA500;
    border: 1px solid #FFA500;
}

.apex-feedback-info {
    background-color: rgba(19, 66, 94, 0.2);
    color: #13425E;
    border: 1px solid #13425E;
}
#apex-quick-close-chat {
    transition: color 0.2s ease;
    margin-right: 16px; /* Match Zendesk's spacing */
    color: #B94A4D; /* Make it red to indicate destructive action */
}

#apex-quick-close-chat:hover {
    color: #ff6b6b; /* Lighter red on hover */
    text-decoration: underline;
}

#apex-quick-close-chat:active {
    opacity: 0.8;
}

/* Ensure proper spacing between footer items */
.sc-177ytgv-1.WxSHa > .StyledFooterItem-sc-1cktm85-0:not(:last-child) {
    margin-right: 16px;
}
#apex-quick-close-chat.processing {
    position: relative;
    opacity: 0.7;
    pointer-events: none;
}

#apex-quick-close-chat.processing::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    margin-left: 8px;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: apex-spin 0.8s linear infinite;
}

@keyframes apex-spin {
    to { transform: rotate(360deg); }
}

`);
})();