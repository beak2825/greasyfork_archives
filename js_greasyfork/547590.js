// ==UserScript==
// @name         Zed City - Footer Timers Bar (Optimized)
// @namespace    http://tampermonkey.net/
// @version      3.18
// @description  Optimized timers bar with modular architecture and reduced lag
// @match        https://www.zed.city/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547590/Zed%20City%20-%20Footer%20Timers%20Bar%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547590/Zed%20City%20-%20Footer%20Timers%20Bar%20%28Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================
    // CONFIGURATION
    // ============================
    const CONFIG = {
        UPDATE_INTERVAL: 1000,
        DETECTION_DEBOUNCE: 250,
        STORAGE_PREFIX: 'zed_timer_',
        SUB_STORAGE_PREFIX: 'zed_subtimer_',

        TIMERS: [
            { id: "fuel", label: "Fuel" },
            { id: "store", label: "St" },
            { id: "blackmarket", label: "BM" },
            { id: "furnace", label: "Furnace" },
            { id: "radio", label: "Radio" },
            { id: "rations", label: "Rations" },
            { id: "raid", label: "Raid" },
            { id: "demo", label: "Demo" },
            { id: "const", label: "Const" },
        ],

        SUB_TIMERS: {
            demo: {
                lockpick1: "🔓 Lockpick",
                lockpick2: "🔓 Lockpick",
            },
            fuel: {
                card: "🎫 Security Card"
            },
            const: {
                lockpick: "🔓 Lockpick",
                explosives: "💣 Explosives"
            }
        }
    };

    // ============================
    // UTILITY FUNCTIONS
    // ============================
    const Utils = {
        parseTimeToSeconds(timeString) {
            timeString = timeString.trim();
            
            // Handle "Xd Xh" or "Xd" or "Xh" format (e.g., "1d 23h", "6d", "23h")
            if (timeString.includes('d') || timeString.includes('h') || timeString.includes('m')) {
                const parts = timeString.split(' ');
                let totalSeconds = 0;
                
                for (const part of parts) {
                    if (part.includes('d')) {
                        const days = parseInt(part.replace('d', ''));
                        if (!isNaN(days)) totalSeconds += days * 24 * 3600;
                    } else if (part.includes('h')) {
                        const hours = parseInt(part.replace('h', ''));
                        if (!isNaN(hours)) totalSeconds += hours * 3600;
                    } else if (part.includes('m')) {
                        const minutes = parseInt(part.replace('m', ''));
                        if (!isNaN(minutes)) totalSeconds += minutes * 60;
                    } else if (part.includes('s')) {
                        const seconds = parseInt(part.replace('s', ''));
                        if (!isNaN(seconds)) totalSeconds += seconds;
                    }
                }
                
                return totalSeconds;
            }
            
            // Handle "HH:MM:SS" or "MM:SS" format
            const parts = timeString.split(':').map(Number);
            if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
            if (parts.length === 2) return parts[0] * 60 + parts[1];
            return 0;
        },

        formatTime(seconds) {
            const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
            const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
            const s = String(seconds % 60).padStart(2, '0');
            return `${h}:${m}:${s}`;
        },

        formatTimeShort(seconds) {
            const d = Math.floor(seconds / 86400);
            const h = Math.floor((seconds % 86400) / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            
            let parts = [];
            if (d > 0) parts.push(`${d}D`);
            if (h > 0) parts.push(`${h}H`);
            if (m > 0) parts.push(`${m}M`);
            if (s > 0 || parts.length === 0) parts.push(`${s}S`);
            
            return parts.join(' ');
        },

        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

    // ============================
    // STORAGE MANAGER
    // ============================
    const StorageManager = {
        save(key, value) {
            try {
                localStorage.setItem(CONFIG.STORAGE_PREFIX + key, value.toString());
                return true;
            } catch (error) {
                console.warn(`Failed to save ${key}:`, error);
                return false;
            }
        },

        load(key) {
            try {
                const saved = localStorage.getItem(CONFIG.STORAGE_PREFIX + key);
                return saved ? parseInt(saved) : null;
            } catch (error) {
                console.warn(`Failed to load ${key}:`, error);
                return null;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(CONFIG.STORAGE_PREFIX + key);
                return true;
            } catch (error) {
                console.warn(`Failed to remove ${key}:`, error);
                return false;
            }
        },

        saveSubTimer(parent, child, endTime) {
            try {
                localStorage.setItem(`${CONFIG.SUB_STORAGE_PREFIX}${parent}_${child}`, endTime.toString());
                return true;
            } catch (error) {
                console.warn(`Failed to save subtimer ${parent}.${child}:`, error);
                return false;
            }
        },

        loadSubTimer(parent, child) {
            try {
                const saved = localStorage.getItem(`${CONFIG.SUB_STORAGE_PREFIX}${parent}_${child}`);
                return saved && parseInt(saved) > Date.now() ? parseInt(saved) : null;
            } catch (error) {
                console.warn(`Failed to load subtimer ${parent}.${child}:`, error);
                return null;
            }
        }
    };

    // ============================
    // TIMER MANAGER
    // ============================
    class TimerManager {
        constructor() {
            this.timers = new Map();
            this.subTimers = new Map();
            this.updateInterval = null;
            this.isUpdating = false;

            this.loadAllTimers();
            this.startUpdateLoop();
        }

        loadAllTimers() {
            CONFIG.TIMERS.forEach(timer => {
                const saved = StorageManager.load(timer.id);
                if (saved && saved > Date.now()) {
                    this.timers.set(timer.id, saved);
                }
            });

            for (const [parent, subs] of Object.entries(CONFIG.SUB_TIMERS)) {
                for (const child of Object.keys(subs)) {
                    const saved = StorageManager.loadSubTimer(parent, child);
                    if (saved) {
                        this.subTimers.set(`${parent}.${child}`, saved);
                    }
                }
            }
        }

        setTimer(id, endTime) {
            this.timers.set(id, endTime);
            StorageManager.save(id, endTime);
            console.log(`Timer ${id} set to ${new Date(endTime).toLocaleTimeString()}`);
        }

        setSubTimer(parent, child, endTime) {
            const key = `${parent}.${child}`;
            this.subTimers.set(key, endTime);
            StorageManager.saveSubTimer(parent, child, endTime);
            console.log(`SubTimer ${key} set to ${new Date(endTime).toLocaleTimeString()}`);
        }

        clearTimer(id) {
            this.timers.delete(id);
            StorageManager.remove(id);
            console.log(`Timer ${id} cleared`);
        }

        getTimerData(id) {
            const endTime = this.timers.get(id);
            if (!endTime) return { text: `${CONFIG.TIMERS.find(t => t.id === id)?.label || id}: 00:00:00`, color: "#666", title: "No active timer" };

            const now = Date.now();
            const diff = Math.max(0, Math.floor((endTime - now) / 1000));
            const timeText = Utils.formatTime(diff);

            return {
                text: `${CONFIG.TIMERS.find(t => t.id === id)?.label || id}: ${timeText}`,
                color: diff === 0 ? "#ff6b6b" : "#fff",
                expired: diff === 0,
                title: diff === 0 ? "Timer expired! Click to clear." : `Ends at ${new Date(endTime).toLocaleTimeString()}`
            };
        }

        getSubTimerData(parent, child) {
            const key = `${parent}.${child}`;
            const endTime = this.subTimers.get(key);
            const label = CONFIG.SUB_TIMERS[parent]?.[child] || child;

            if (!endTime) {
                return { text: `${label}: 0S`, color: "#666" };
            }

            const now = Date.now();
            const diff = Math.max(0, Math.floor((endTime - now) / 1000));
            const timeText = Utils.formatTimeShort(diff);

            return {
                text: `${label}: ${timeText}`,
                color: diff === 0 ? "#ff6b6b" : "#fff"
            };
        }

        startUpdateLoop() {
            if (this.updateInterval) return;

            this.updateInterval = setInterval(() => {
                if (!this.isUpdating) {
                    this.isUpdating = true;
                    UI.updateDisplay();
                    this.isUpdating = false;
                }
            }, CONFIG.UPDATE_INTERVAL);
        }

        stop() {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }
        }
    }

    // ============================
    // UI MANAGER
    // ============================
    const UI = {
        elements: {
            footer: null,
            timerBar: null,
            subFooter: null
        },

        init() {
            this.injectStyles();
            this.waitForFooter();
        },

        injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes zed-blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0.3; }
                }
                footer.q-footer { padding-bottom: 0 !important; }
                #zedTimersBar {
                    background: rgba(15,15,15,0.95);
                    color: #fff;
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    padding: 8px 10px;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    flex-wrap: wrap;
                    gap: 8px;
                    width: 100%;
                }
                #zedTimersBar span {
                    font-weight: bold;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
                    white-space: nowrap;
                    font-size: 11px;
                    cursor: pointer;
                    padding: 2px 4px;
                    border-radius: 3px;
                    transition: background 0.2s ease;
                }
                #zedTimersBar span:hover {
                    background: rgba(255,255,255,0.1);
                }
                #zedSubFooter {
                    background: rgba(25,25,25,0.95);
                    color: #fff;
                    font-size: 11px;
                    padding: 6px 8px;
                    display: none;
                    justify-content: center;
                    gap: 16px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                @media (max-width: 600px) {
                    #zedTimersBar { font-size: 10px !important; padding: 6px 8px !important; }
                    #zedTimersBar span { font-size: 9px !important; }
                }
            `;
            document.head.appendChild(style);
        },

        waitForFooter() {
            const footer = document.querySelector('footer.q-footer');
            if (footer) {
                this.elements.footer = footer;
                this.createTimerBar();
                return;
            }
            setTimeout(() => this.waitForFooter(), 500);
        },

        createTimerBar() {
            if (!this.elements.footer) return;

            let existingTimerBar = document.getElementById('zedTimersBar');
            if (existingTimerBar) {
                this.elements.timerBar = existingTimerBar;
                this.elements.subFooter = document.getElementById('zedSubFooter');
                this.setupEventListeners();
                return;
            }

            this.elements.timerBar = document.createElement("div");
            this.elements.timerBar.id = "zedTimersBar";
            this.elements.footer.insertBefore(this.elements.timerBar, this.elements.footer.firstChild);

            CONFIG.TIMERS.forEach(timer => {
                const span = document.createElement("span");
                span.id = `timer_${timer.id}`;
                span.dataset.timerId = timer.id;
                span.textContent = `${timer.label}: 00:00:00`;
                this.elements.timerBar.appendChild(span);
            });

            this.elements.subFooter = document.createElement("div");
            this.elements.subFooter.id = "zedSubFooter";
            this.elements.timerBar.insertAdjacentElement('afterend', this.elements.subFooter);

            this.setupEventListeners();
        },

        setupEventListeners() {
            if (!this.elements.footer || this.elements.footer.__zedTimersClickBound) return;

            this.elements.footer.addEventListener('click', (e) => {
                const target = e.target.closest('#zedTimersBar span[id^="timer_"]');
                if (!target) return;

                const timerId = target.dataset.timerId;
                this.toggleSubFooter(timerId);
            });

            this.elements.footer.__zedTimersClickBound = true;
        },

        toggleSubFooter(timerId) {
            if (!this.elements.subFooter) return;

            if (this.elements.subFooter.dataset.activeParent === timerId) {
                this.elements.subFooter.style.display = "none";
                this.elements.subFooter.dataset.activeParent = "";
                return;
            }

            const subs = CONFIG.SUB_TIMERS[timerId];
            if (!subs) {
                this.elements.subFooter.style.display = "none";
                return;
            }

            this.elements.subFooter.innerHTML = "";

            for (const [child, label] of Object.entries(subs)) {
                const data = timerManager.getSubTimerData(timerId, child);
                const span = document.createElement("span");
                span.id = `subtimer_${timerId}_${child}`;
                span.textContent = data.text;
                span.style.cssText = `white-space:nowrap; font-weight:bold; color: ${data.color};`;
                this.elements.subFooter.appendChild(span);
            }

            this.elements.subFooter.style.display = "flex";
            this.elements.subFooter.dataset.activeParent = timerId;
        },

        updateDisplay() {
            CONFIG.TIMERS.forEach(timer => {
                const element = document.getElementById(`timer_${timer.id}`);
                if (!element) return;

                const data = timerManager.getTimerData(timer.id);
                if (element.textContent !== data.text) element.textContent = data.text;
                if (element.style.color !== data.color) element.style.color = data.color;
                if (element.title !== data.title) element.title = data.title;

                const animation = data.expired ? "zed-blink 1s infinite" : "none";
                if (element.style.animation !== animation) element.style.animation = animation;
            });

            this.updateSubTimers();
        },

        updateSubTimers() {
            for (const [parent, subs] of Object.entries(CONFIG.SUB_TIMERS)) {
                for (const child of Object.keys(subs)) {
                    const element = document.getElementById(`subtimer_${parent}_${child}`);
                    const data = timerManager.getSubTimerData(parent, child);

                    if (element) {
                        if (element.textContent !== data.text) element.textContent = data.text;
                        if (element.style.color !== data.color) element.style.color = data.color;
                    } else if (this.elements.subFooter &&
                             this.elements.subFooter.dataset.activeParent === parent &&
                             this.elements.subFooter.style.display === "flex") {
                        this.createSubTimerElement(parent, child, data);
                    }
                }
            }
        },

        createSubTimerElement(parent, child, data) {
            if (!this.elements.subFooter) return;

            const span = document.createElement("span");
            span.id = `subtimer_${parent}_${child}`;
            span.textContent = data.text;
            span.style.cssText = `white-space:nowrap; font-weight:bold; color: ${data.color};`;
            this.elements.subFooter.appendChild(span);
        }
    };

    // ============================
    // DETECTION MANAGER
    // ============================
    class DetectionManager {
        constructor() {
            this.debouncedDetect = Utils.debounce(() => this.detectPageTimers(), CONFIG.DETECTION_DEBOUNCE);
            this.setupObserver();
            this.setupKeyboardShortcut();
            this.setupButtonClickDetection();
        }

        setupObserver() {
            const observer = new MutationObserver(Utils.throttle((mutations) => {
                let shouldDetect = false;

                for (const mutation of mutations) {
                    if (mutation.type !== 'childList') continue;

                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== 1) continue;

                        if (this.isRelevantNode(node)) {
                            shouldDetect = true;
                            break;
                        }
                    }

                    if (shouldDetect) break;
                }

                if (shouldDetect) {
                    this.debouncedDetect();
                }
            }, 100));

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        isRelevantNode(node) {
            if (node.classList?.contains('q-footer') || node.querySelector?.('footer.q-footer')) {
                setTimeout(() => UI.createTimerBar(), 100);
                return false;
            }

            const text = node.textContent || '';
            if (text.includes('Furnace') ||
                text.includes('Radio Tower') ||
                text.includes('Limit Reset') ||
                text.includes('Rations resupply') ||
                text.includes('Black Market') ||
                /\d+:\d+:\d+/.test(text)) {
                return true;
            }

            const className = String(node.className || '');
            if (className.includes('building') ||
                className.includes('countdown') ||
                className.includes('overlay-cont')) {
                return true;
            }

            if (node.querySelector) {
                return !!(
                    node.querySelector('[class*="building"]') ||
                    node.querySelector('[class*="countdown"]') ||
                    node.querySelector('.countdown-timer') ||
                    node.querySelector('.building-icon') ||
                    node.querySelector('.overlay-cont')
                );
            }

            return false;
        }

        setupKeyboardShortcut() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                    console.log("=== Manual timer detection triggered ===");
                    this.detectPageTimers();
                }
            });
        }

        setupButtonClickDetection() {
            document.addEventListener('click', Utils.throttle((e) => {
                const target = e.target;
                const isButton = target.tagName === 'BUTTON' ||
                                target.type === 'button' ||
                                target.classList.contains('q-btn') ||
                                target.closest('button') ||
                                target.closest('.q-btn') ||
                                target.role === 'button';

                if (isButton) {
                    console.log("🔄 Button clicked - rechecking timers in 1 second...");
                    setTimeout(() => {
                        console.log("=== Button click timer recheck ===");
                        this.detectPageTimers();
                    }, 1000);
                }
            }, 500));
        }

        detectPageTimers() {
            const url = window.location.href;

            try {
                if (url.includes('/store/junk')) {
                    this.detectStoreTimer();
                }

                if (url.includes('/store/blackmarket')) {
                    this.detectBlackMarketTimer();
                }

                this.detectBuildingTimer();
                this.detectRaidTimer();
                this.detectRadioTimer();
                this.detectRationsTimer();
                this.detectExploringTimers();
                this.detectLockpickTimers();

            } catch (error) {
                console.error("Error in timer detection:", error);
            }
        }

        detectStoreTimer() {
            const allElements = document.querySelectorAll('.float-right, [class*="float-right"]');
            
            for (const container of allElements) {
                const limitResetText = Array.from(container.querySelectorAll('*')).find(el =>
                    el.textContent?.trim() === 'Limit Reset'
                );
                
                if (limitResetText) {
                    const countdownTimer = container.querySelector('.countdown-timer');
                    if (countdownTimer) {
                        this.setTimerFromElement('store', countdownTimer);
                        console.log(`✓ Store timer detected: ${countdownTimer.textContent}`);
                        return;
                    }
                }
            }
        }

        detectBuildingTimer() {
            console.log("🔍 Detecting building timer...");

            let buildingNameEl = document.querySelector('.building-name.non-selectable');
            
            if (!buildingNameEl) {
                console.log("❌ No building name element found");
                return;
            }

            const buildingName = buildingNameEl.textContent.trim().toLowerCase();
            console.log(`🏗️ Building name detected: "${buildingName}"`);

            let timerId = null;
            if (buildingName === 'furnace') timerId = 'furnace';
            else if (buildingName === 'radio tower') timerId = 'radio';
            else {
                console.log(`❌ Unknown building name: "${buildingName}"`);
                return;
            }

            const allDivs = document.querySelectorAll('div');
            let timerEl = null;
            
            for (const div of allDivs) {
                const divText = div.textContent || '';
                if (divText.includes('Total Time Left:') && div.classList.contains('time-left-total')) {
                    const timer = div.querySelector('.countdown-timer');
                    if (timer) {
                        timerEl = timer;
                        console.log("✓ Found Total Time Left timer:", timer.textContent);
                        break;
                    }
                }
            }

            if (!timerEl) {
                console.log("❌ No Total Time Left timer found");
                console.log("Attempting alternative search...");
                
                const allTimers = document.querySelectorAll('.countdown-timer');
                console.log(`Found ${allTimers.length} countdown timers`);
                
                let longestTime = 0;
                for (const timer of allTimers) {
                    const timeText = timer.textContent.trim();
                    const seconds = Utils.parseTimeToSeconds(timeText);
                    console.log(`  Timer: ${timeText} = ${seconds} seconds`);
                    if (seconds > longestTime) {
                        longestTime = seconds;
                        timerEl = timer;
                    }
                }
                
                if (timerEl) {
                    console.log(`✓ Selected longest timer: ${timerEl.textContent}`);
                }
            }

            if (!timerEl) {
                console.log("❌ No timer element found");
                return;
            }

            console.log(`🎯 Setting ${timerId} timer from building detection`);
            this.setTimerFromElement(timerId, timerEl);
        }

        detectRaidTimer() {
            const raidEl = Array.from(document.querySelectorAll('div.output-negative.inline-block'))
                .find(el => el.textContent.includes("You can raid again in"));
            if (!raidEl) return;

            const countdownSpan = raidEl.querySelector('.countdown-timer');
            if (countdownSpan) {
                this.setTimerFromElement('raid', countdownSpan);
            }
        }

        detectRationsTimer() {
            const allElements = document.querySelectorAll('.text-center.text-no-bg-light.subtext-large');
            
            for (const container of allElements) {
                if (container.textContent.includes('Rations resupply')) {
                    const countdownEl = container.querySelector('span.countdown-timer');
                    if (countdownEl) {
                        this.setTimerFromElement('rations', countdownEl);
                        console.log(`✓ Rations timer detected: ${countdownEl.textContent}`);
                        return;
                    }
                }
            }
        }

        detectRadioTimer() {
            const radioContainer = document.querySelector('div.text-center.text-no-bg-light.subtext-large.q-my-md');
            if (!radioContainer || !radioContainer.textContent.includes('Trades expire in')) return;

            const countdownEl = radioContainer.querySelector('span.countdown-timer');
            if (countdownEl) {
                this.setTimerFromElement('radio', countdownEl);
            }
        }

        detectBlackMarketTimer() {
            const allContainers = document.querySelectorAll('div');
            
            for (const container of allContainers) {
                const countdownEl = container.querySelector('span.countdown-timer');
                if (countdownEl && window.location.href.includes('/store/blackmarket')) {
                    const parentText = container.textContent;
                    if (!parentText.includes('Total Time Left') && 
                        !parentText.includes('Limit Reset')) {
                        this.setTimerFromElement('blackmarket', countdownEl);
                        console.log(`✓ Black Market timer detected: ${countdownEl.textContent}`);
                        return;
                    }
                }
            }
        }

        detectExploringTimers() {
            // Look for job containers
            const jobContainers = document.querySelectorAll('div.job-cont');

            jobContainers.forEach(job => {
                const jobNameEl = job.querySelector('div.job-name');
                if (!jobNameEl) return;

                const jobName = jobNameEl.textContent.trim().toLowerCase();
                console.log(`Found job: "${jobName}"`);
                
                const countdownEl = job.querySelector('span.countdown-timer, .countdown-timer');
                if (!countdownEl) return;

                console.log(`  Timer: ${countdownEl.textContent}`);

                if (jobName.includes('fuel trade')) {
                    this.setTimerFromElement('fuel', countdownEl);
                } else if (jobName.includes('explosive debris cache')) {
                    this.setTimerFromElement('demo', countdownEl);
                } else if (jobName.includes('lockbox')) {
                    this.setTimerFromElement('const', countdownEl);
                }
            });
        }

        detectLockpickTimers() {
            // Fuel security card (changed from lockpick)
            const securePanel = [...document.querySelectorAll(".job-name")]
                .find(el => el.textContent.trim() === "Secure Panel");

            if (securePanel) {
                const countdownEl = securePanel.closest(".job-main")?.querySelector(".countdown-timer");
                if (countdownEl) {
                    this.setSubTimerFromElement('fuel', 'card', countdownEl);
                }
            }

            // Demo lockpicks
            const secureGate = [...document.querySelectorAll(".job-name")]
                .find(el => el.textContent.trim() === "Secure Gate");

            if (secureGate) {
                const submenu = document.querySelector('.q-tabs.submenu');
                if (submenu) {
                    const activeTab = submenu.querySelector('.q-tab.q-tab--active .q-tab__label');
                    if (activeTab) {
                        const activeTabLabel = activeTab.textContent.trim();
                        const countdownEl = secureGate.closest(".job-main")?.querySelector(".countdown-timer");

                        if (countdownEl) {
                            if (activeTabLabel === "Zone 1") {
                                this.setSubTimerFromElement('demo', 'lockpick1', countdownEl);
                            } else if (activeTabLabel === "Zone 2") {
                                this.setSubTimerFromElement('demo', 'lockpick2', countdownEl);
                            }
                        }
                    }
                }
            }

            // Construction Gates
            const secureLockupGate = [...document.querySelectorAll(".job-name")]
                .find(el => el.textContent.trim() === "Secure Lockup Door");

            if (secureLockupGate) {
                const countdownEl = secureLockupGate.closest(".job-main")?.querySelector(".countdown-timer");
                if (countdownEl) {
                    this.setSubTimerFromElement('const', 'lockpick', countdownEl);
                }
            }

            const secureVault = [...document.querySelectorAll(".job-name")]
                .find(el => el.textContent.trim() === "Security Vault");

            if (secureVault) {
                const countdownEl = secureVault.closest(".job-main")?.querySelector(".countdown-timer");
                if (countdownEl) {
                    this.setSubTimerFromElement('const', 'explosives', countdownEl);
                }
            }
        }

        setTimerFromElement(timerId, element) {
            const timeText = element.textContent.trim();
            const seconds = Utils.parseTimeToSeconds(timeText);
            if (seconds > 0) {
                const endTime = Date.now() + seconds * 1000;
                timerManager.setTimer(timerId, endTime);
                console.log(`✓ ${timerId} timer set: ${timeText}`);
            }
        }

        setSubTimerFromElement(parent, child, element) {
            const timeText = element.textContent.trim();
            const seconds = Utils.parseTimeToSeconds(timeText);
            if (seconds > 0) {
                const endTime = Date.now() + seconds * 1000;
                timerManager.setSubTimer(parent, child, endTime);
                console.log(`✓ ${parent}.${child} subtimer set: ${timeText}`);
            }
        }
    }

    // ============================
    // INITIALIZATION
    // ============================
    let timerManager;
    let detectionManager;

    function initialize() {
        console.log("Zed City Footer Timers (v3.2) - Optimized version loading...");

        timerManager = new TimerManager();
        detectionManager = new DetectionManager();

        UI.init();

        setTimeout(() => {
            detectionManager.detectPageTimers();
        }, 1000);

        console.log("Zed City Footer Timers (v3.2) loaded successfully!");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    window.addEventListener('beforeunload', () => {
        if (timerManager) {
            timerManager.stop();
        }
    });

})();