// ==UserScript==
// @name         BOXED.GG Gem Drop Joiner
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Enhanced auto-joiner with advanced anti-detection, human simulation and full stealth mode
// @match        https://boxed.gg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539077/BOXEDGG%20Gem%20Drop%20Joiner.user.js
// @updateURL https://update.greasyfork.org/scripts/539077/BOXEDGG%20Gem%20Drop%20Joiner.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== ANTI-DETECTION PROTECTIONS =====
    // These need to run immediately before any other code

    // 1. Protect against fingerprinting (based on the security report)
    const protectFingerprinting = () => {
        // Store original functions to avoid detection of overrides
        const originalGetPrototypeOf = Object.getPrototypeOf;
        const originalDefineProperty = Object.defineProperty;
        const originalKeys = Object.keys;
        const originalPerformanceNow = performance.now;
        const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

        // Patch navigator properties to add subtle randomization
        const navigatorHandler = {
            get: function(target, prop) {
                // Add very slight random variance to hardwareConcurrency
                if (prop === 'hardwareConcurrency') {
                    // 90% chance to return true value, 10% chance to return +/-1
                    return Math.random() < 0.9
                        ? target[prop]
                        : Math.max(1, target[prop] + (Math.random() > 0.5 ? 1 : -1));
                }

                // Randomize deviceMemory slightly
                if (prop === 'deviceMemory') {
                    // Small random variation if property exists
                    return target[prop] ? target[prop] + (Math.random() * 0.1 - 0.05) : target[prop];
                }

                // For userAgent and other string props, return normal value
                // Modifying these is too easily detected
                return target[prop];
            }
        };

        // Apply the proxy stealthily by copying all descriptors
        try {
            const navProto = Object.getPrototypeOf(navigator);
            const navProps = Object.getOwnPropertyDescriptors(navProto);

            // For each property, create a custom getter that adds tiny variations
            for (const prop of ['hardwareConcurrency', 'deviceMemory', 'platform']) {
                if (navProps[prop] && navProps[prop].get) {
                    const originalGetter = navProps[prop].get;

                    // Modify the getter subtly
                    Object.defineProperty(Navigator.prototype, prop, {
                        get: function() {
                            const value = originalGetter.call(this);

                            // Only modify numeric properties with tiny variations
                            if (typeof value === 'number') {
                                // Add noise that's too small to be noticeable but breaks fingerprinting
                                return value + (Math.random() * 0.0001);
                            }

                            return value;
                        }
                    });
                }
            }
        } catch (e) {
            // Silently fail if prototype manipulation doesn't work
        }

        // Screen property protection with subtle variations
        try {
            const screenProto = Object.getPrototypeOf(screen);
            const screenProps = Object.getOwnPropertyDescriptors(screenProto);

            // Apply subtle variations to numeric screen properties
            for (const prop of ['width', 'height', 'availWidth', 'availHeight']) {
                if (screenProps[prop] && screenProps[prop].get) {
                    const originalGetter = screenProps[prop].get;

                    Object.defineProperty(Screen.prototype, prop, {
                        get: function() {
                            const value = originalGetter.call(this);

                            // Only add variation 30% of the time to avoid detection
                            if (Math.random() < 0.3) {
                                // Add +/-0.01 variation - too small to notice but breaks exact matching
                                return value + (Math.random() * 0.02 - 0.01);
                            }

                            return value;
                        }
                    });
                }
            }
        } catch (e) {
            // Silently fail if prototype manipulation doesn't work
        }

        // 2. Protect against timing analysis
        // The security report showed extensive use of performance.now() for timing detection
        performance.now = function() {
            // Add small random noise to defeat timing analysis
            // Use different variance ranges to avoid detection patterns
            const variance = Math.random() < 0.7 ?
                (Math.random() * 0.1) : // 70% chance of tiny variance
                (Math.random() * 2);    // 30% chance of larger variance

            return originalPerformanceNow.call(performance) + variance;
        };

        // 3. Hide automation signs
        // Hide from common detection methods
        try {
            Object.defineProperty(window, 'webdriver', {
                get: () => false,
                configurable: true
            });

            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
                configurable: true
            });
        } catch (e) {
            // Silently fail
        }

        // 4. Protect against script detection in stack traces
        try {
            Error.prepareStackTrace = (error, structuredStackTrace) => {
                // Filter out references to userscript in stack traces
                const filteredStack = structuredStackTrace.filter(frame => {
                    const fileName = frame.getFileName();
                    return !(fileName &&
                           (fileName.includes('userscript') ||
                            fileName.includes('tampermonkey') ||
                            fileName.includes('greasemonkey')));
                });

                // Format the stack trace as a string without script identifiers
                return filteredStack.map(frame => {
                    const functionName = frame.getFunctionName() || 'anonymous';
                    const fileName = frame.getFileName() || 'unknown';
                    const lineNumber = frame.getLineNumber();
                    const columnNumber = frame.getColumnNumber();

                    // Sanitize the file name to remove any userscript indicators
                    const sanitizedFileName = fileName
                        .replace(/userscript/gi, 'script')
                        .replace(/tampermonkey/gi, 'script')
                        .replace(/greasemonkey/gi, 'script');

                    return `    at ${functionName} (${sanitizedFileName}:${lineNumber}:${columnNumber})`;
                }).join('\n');
            };
        } catch (e) {
            // Silently fail if stack trace manipulation is not supported
        }

        // 5. Neutralize known trackers from the security report
        const neutralizeTrackers = () => {
            // Based on the security report findings

            // Clarity (Microsoft)
            if (window.clarity) {
                window.clarity = new Proxy(window.clarity, {
                    get: (target, prop) => {
                        // Return functions that do nothing
                        if (typeof target[prop] === 'function') {
                            return () => {};
                        }
                        return target[prop];
                    }
                });
            }

            // Facebook Pixel
            if (window.fbq) {
                window.fbq = function() {};
            }

            // Klaviyo
            if (window._learnq) {
                window._learnq = new Proxy(window._learnq, {
                    get: (target, prop) => {
                        if (typeof target[prop] === 'function') {
                            return () => {};
                        }
                        return target[prop];
                    }
                });
            }

            // Google Analytics
            if (window.ga) {
                window.ga = function() {};
            }

            // Google Tag Manager
            if (window.gtag) {
                window.gtag = function() {};
            }

            // Disable additional tracking scripts identified in the report
            ['bat.bing.com', 'clarity.ms', 'googleadservices.com', 'connect.facebook.net', 'static.klaviyo.com'].forEach(tracker => {
                // Find and neutralize script elements from these domains
                const scripts = document.querySelectorAll(`script[src*="${tracker}"]`);
                scripts.forEach(script => {
                    // Don't remove them (would be detected) but make them harmless
                    script.dataset.neutralized = true;

                    // Override any global functions they set
                    if (tracker.includes('klaviyo') && window._klaviyo) {
                        window._klaviyo = { push: () => {} };
                    }
                });
            });
        };

        // Run neutralization periodically to catch scripts that load later
        setInterval(neutralizeTrackers, 2000);
        neutralizeTrackers();
    };

    // Run protection immediately
    protectFingerprinting();

    // ===== SECURE STATE MANAGEMENT =====
    // Don't store state in window properties (was using window._boxedDropOpened)

    // Create closure for secure state storage with randomized key names
    const secureState = (() => {
        // Generate random keys for each session to avoid detection
        const generateRandomKey = (prefix) => {
            return prefix + '_' + Math.random().toString(36).substring(2, 10);
        };

        const keys = {
            dropOpened: generateRandomKey('state'),
            lastAction: generateRandomKey('timestamp')
        };

        // Use sessionStorage with encryption for state management
        const setValue = (key, value) => {
            try {
                // Simple obfuscation (not true encryption, but enough to hide from simple detection)
                const obfuscated = btoa(JSON.stringify(value) + '_' + Date.now());
                sessionStorage.setItem(keys[key], obfuscated);
            } catch (e) {
                // Fallback to in-memory if sessionStorage fails
                keys[key + '_value'] = value;
            }
        };

        const getValue = (key, defaultValue = null) => {
            try {
                const item = sessionStorage.getItem(keys[key]);
                if (!item) return defaultValue;

                // Deobfuscate
                const decoded = atob(item);
                // Extract the value part (before the timestamp)
                const valueStr = decoded.split('_')[0];
                return JSON.parse(valueStr);
            } catch (e) {
                // Fallback
                return keys[key + '_value'] || defaultValue;
            }
        };

        return {
            setValue,
            getValue,
            // Helper functions for common state
            setDropOpened: (value) => setValue('dropOpened', value),
            isDropOpened: () => getValue('dropOpened', false),
            setLastAction: (time) => setValue('lastAction', time),
            getLastAction: () => getValue('lastAction', 0)
        };
    })();

    // Session variance - different parameters each time the script runs
    const sessionVariance = {
        joinDelayMin: 185 + Math.floor(Math.random() * 5),
        joinDelayMax: 205 + Math.floor(Math.random() * 5),
        mouseCurveIntensity: 0.8 + (Math.random() * 0.4),
        panelOpenDelayMin: 5000,
        panelOpenDelayMax: 15000
    };

    let autoJoinEnabled = location.href.includes('/pokemon');
    let joined = false;
    let minimized = false;
    let internalTimerStarted = false;
    let internalTimerStartTime = 0;
    let debugMode = false;
    let lastTimerValue = null;
    let targetJoinDelaySeconds = 0; // Will store our random join delay
    let lastMouseX = null;
    let lastMouseY = null;
    let lastInteractionTime = 0;

    const isGiveawayPage = () => location.href.includes('/pokemon');

    // Helper function for logging when debug is enabled
    const debugLog = (...args) => {
        if (debugMode) console.log('[BOXED Joiner]', ...args);
    };

    // Function to get random join time between min and max from session variance
    function getRandomJoinDelay() {
        return Math.floor(Math.random() * (sessionVariance.joinDelayMax - sessionVariance.joinDelayMin + 1)) + sessionVariance.joinDelayMin;
    }

    // Function to get random time value with small variance
    function getRandomTime(baseTime, variance = 0.2) {
        // Add +/- variance percentage to the base time
        const randomFactor = 1 + (Math.random() * variance * 2 - variance);
        return Math.floor(baseTime * randomFactor);
    }

    // Function to create Bezier curve points for smooth mouse movement
    function createBezierPoints(startX, startY, endX, endY, numPoints = 25) {
        const points = [];

        // Use session variance for curve intensity
        const intensityFactor = sessionVariance.mouseCurveIntensity;

        // Create two random control points for natural curve
        const controlX1 = startX + (Math.random() * 100 - 50) * intensityFactor;
        const controlY1 = startY + (Math.random() * 100 - 50) * intensityFactor;

        const controlX2 = endX + (Math.random() * 100 - 50) * intensityFactor;
        const controlY2 = endY + (Math.random() * 100 - 50) * intensityFactor;

        // Generate points along the bezier curve
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;

            // Cubic Bezier formula
            const x = Math.pow(1-t, 3) * startX +
                      3 * Math.pow(1-t, 2) * t * controlX1 +
                      3 * (1-t) * Math.pow(t, 2) * controlX2 +
                      Math.pow(t, 3) * endX;

            const y = Math.pow(1-t, 3) * startY +
                      3 * Math.pow(1-t, 2) * t * controlY1 +
                      3 * (1-t) * Math.pow(t, 2) * controlY2 +
                      Math.pow(t, 3) * endY;

            points.push({x, y});
        }

        return points;
    }

    // Function for occasional random mouse movements
    function performRandomMouseMovement() {
        if (!autoJoinEnabled || Math.random() > 0.1) return; // Only 10% chance of executing

        // Only move mouse if it's been at least 20 seconds since last interaction
        const now = Date.now();
        if (now - lastInteractionTime < 20000) return;

        lastInteractionTime = now;

        // Get random coordinates within the viewport
        const targetX = Math.random() * window.innerWidth;
        const targetY = Math.random() * window.innerHeight;

        // Get start position (either last known position or viewport center)
        const startX = lastMouseX || window.innerWidth / 2;
        const startY = lastMouseY || window.innerHeight / 2;

        // Create Bezier curve points
        const points = createBezierPoints(startX, startY, targetX, targetY);

        // Move mouse along the curve
        let pointIndex = 0;
        function moveAlongCurve() {
            if (pointIndex >= points.length) return;

            const point = points[pointIndex];
            lastMouseX = point.x;
            lastMouseY = point.y;

            document.dispatchEvent(new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: point.x,
                clientY: point.y
            }));

            pointIndex++;

            // Occasionally add a longer delay (human thinking pause)
            if (Math.random() < 0.1) { // 10% chance
                setTimeout(moveAlongCurve, 100 + Math.random() * 400);
            } else {
                setTimeout(moveAlongCurve, 5 + Math.random() * 15);
            }
        }

        moveAlongCurve();
    }

    window.addEventListener('load', () => {
        // === Notification Popup ===
        const notificationPopup = document.createElement('div');
        Object.assign(notificationPopup.style, {
            position: 'fixed',
            top: '20px',
            right: '50%',
            transform: 'translateX(50%)',
            padding: '12px 20px',
            backgroundColor: '#202123',
            color: '#ffffff',
            border: '2px solid #10a37f',
            borderRadius: '8px',
            zIndex: '10000',
            display: 'none',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            fontWeight: 'bold'
        });
        document.body.appendChild(notificationPopup);

        // === Panel Container ===
        const controlBox = document.createElement('div');
        controlBox.setAttribute('id', 'boxed-control-box');
        Object.assign(controlBox.style, {
            position: 'fixed',
            bottom: '90px',
            left: '20px',
            padding: '12px',
            backgroundColor: '#202123',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            border: '1px solid #444',
            borderRadius: '10px',
            zIndex: '10000',
            boxShadow: '0 0 15px rgba(0,0,0,0.5)',
            width: '250px',
            transition: 'all 0.3s ease'
        });

        // Add rainbow animation style
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbowText {
                0% { color: #ff0000; }
                16% { color: #ff8800; }
                33% { color: #ffff00; }
                50% { color: #00ff00; }
                66% { color: #00ffff; }
                83% { color: #0088ff; }
                100% { color: #ff00ff; }
            }
            .rainbow-text {
                animation: rainbowText 3s linear infinite;
                font-weight: bold;
            }
        `;
        document.head.appendChild(rainbowStyle);

        // Title with version - cleaner design
        const title = document.createElement('div');
        title.innerHTML = '<span class="rainbow-text">🎁 BOXED.GG</span> Gem Drop Joiner <span style="color:#888;font-size:11px">v2.0</span>';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '14px';
        title.style.marginBottom = '12px';
        title.style.textAlign = 'center';
        controlBox.appendChild(title);

        // Status container with better styling
        const statusContainer = document.createElement('div');
        statusContainer.style.backgroundColor = '#2a2b2d';
        statusContainer.style.padding = '10px';
        statusContainer.style.borderRadius = '6px';
        statusContainer.style.marginBottom = '10px';
        statusContainer.style.fontSize = '13px';
        statusContainer.style.lineHeight = '1.4';
        controlBox.appendChild(statusContainer);

        // Status text area
        const status = document.createElement('div');
        statusContainer.appendChild(status);

        // Progress bar for internal timer
        const progressContainer = document.createElement('div');
        progressContainer.style.height = '4px';
        progressContainer.style.backgroundColor = '#3a3b3d';
        progressContainer.style.borderRadius = '2px';
        progressContainer.style.marginTop = '8px';
        progressContainer.style.overflow = 'hidden';
        progressContainer.style.display = 'none';

        const progressBar = document.createElement('div');
        progressBar.id = 'join-timer-progress';
        progressBar.style.height = '100%';
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#10a37f';
        progressBar.style.transition = 'width 1s linear';

        progressContainer.appendChild(progressBar);
        statusContainer.appendChild(progressContainer);

        // Debug info with cleaner formatting
        const debugInfo = document.createElement('div');
        debugInfo.style.fontSize = '11px';
        debugInfo.style.marginTop = '6px';
        debugInfo.style.color = '#888';
        debugInfo.style.backgroundColor = 'rgba(0,0,0,0.2)';
        debugInfo.style.padding = '6px';
        debugInfo.style.borderRadius = '4px';
        debugInfo.style.display = debugMode ? 'block' : 'none';
        statusContainer.appendChild(debugInfo);

        // Button container for better layout
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '8px';
        controlBox.appendChild(buttonContainer);

        // Main toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = autoJoinEnabled ? '⏹️ Stop' : '▶️ Start';
        Object.assign(toggleBtn.style, {
            flex: '1',
            backgroundColor: autoJoinEnabled ? '#e74c3c' : '#10a37f',
            color: '#ffffff',
            border: 'none',
            padding: '10px',
            fontSize: '14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s'
        });

        // Debug toggle button (now as a single button)
        const debugBtn = document.createElement('button');
        debugBtn.textContent = '🔍 Debug';
        Object.assign(debugBtn.style, {
            width: '100%',
            marginTop: '8px',
            backgroundColor: '#333',
            color: '#aaa',
            border: 'none',
            padding: '8px',
            fontSize: '12px',
            borderRadius: '6px',
            cursor: 'pointer'
        });

        // Add buttons to containers
        buttonContainer.appendChild(toggleBtn);
        controlBox.appendChild(debugBtn);

        // Instructions button
        const instructionsBtn = document.createElement('button');
        instructionsBtn.textContent = 'ℹ️ How to use';
        Object.assign(instructionsBtn.style, {
            width: '100%',
            backgroundColor: '#333',
            color: '#ccc',
            border: 'none',
            padding: '6px',
            fontSize: '11px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '10px'
        });

        // Create instructions slide-out panel
        const instructionsPanel = document.createElement('div');
        Object.assign(instructionsPanel.style, {
            position: 'fixed',
            bottom: '160px', // Position above the main panel
            left: '-250px', // Start off-screen
            width: '220px',
            padding: '12px',
            backgroundColor: '#202123',
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            border: '1px solid #444',
            borderRadius: '0 10px 10px 0',
            zIndex: '10001', // Higher z-index than the main panel
            boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
            transition: 'left 0.3s ease',
            fontSize: '13px',
            lineHeight: '1.4'
        });

        // Close button for instructions panel
        const closeInstructionsBtn = document.createElement('button');
        closeInstructionsBtn.textContent = '✕';
        Object.assign(closeInstructionsBtn.style, {
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: 'transparent',
            color: '#888',
            border: 'none',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '3px 6px'
        });

        // Instructions content
        const instructionsContent = document.createElement('div');
        instructionsContent.innerHTML = `
            <div style="font-weight:bold;margin-bottom:8px;color:#10a37f;font-size:14px;text-align:center;">How to Use</div>
            <p style="margin-bottom:8px;">1. Go to <a href="https://boxed.gg/pokemon" style="color:#10a37f;text-decoration:underline;">boxed.gg/pokemon</a></p>
            <p style="margin-bottom:8px;">2. The script will automatically detect and join gem drops at the optimal time.</p>
            <p style="margin-bottom:8px;">3. You can minimize this panel with the "—" button.</p>
            <p>4. The script runs in the background while you browse.</p>
            <p style="margin-top:8px;font-size:11px;color:#888;">v2.0 includes enhanced stealth features to avoid detection.</p>
        `;

        instructionsPanel.appendChild(instructionsContent);
        instructionsPanel.appendChild(closeInstructionsBtn);
        document.body.appendChild(instructionsPanel);

        let instructionsPanelVisible = false;

        instructionsBtn.onclick = () => {
            instructionsPanelVisible = !instructionsPanelVisible;
            instructionsPanel.style.left = instructionsPanelVisible ? '0px' : '-250px';
        };

        closeInstructionsBtn.onclick = () => {
            instructionsPanelVisible = false;
            instructionsPanel.style.left = '-250px';
        };

        controlBox.appendChild(instructionsBtn);

        // Footer with credit (moved to bottom)
        const footer = document.createElement('div');
        footer.textContent = '@drcatto';
        Object.assign(footer.style, {
            fontSize: '11px',
            color: '#666',
            textAlign: 'center',
            marginTop: '0px',
            fontStyle: 'italic'
        });
        controlBox.appendChild(footer);

        // Timer functions
        const nextGiveawayCountdown = () => {
            const now = new Date();
            const mins = now.getMinutes();
            const secs = now.getSeconds();
            const nextDrop = mins >= 57 ? 87 : (mins >= 27 ? 57 : 27);
            const minsLeft = nextDrop - mins;
            const secsLeft = 60 - secs;
            const pad = n => String(n).padStart(2, '0');
            return `${pad(minsLeft % 60)}m ${pad(secsLeft % 60)}s`;
        };

        const updateStatus = () => {
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');

            // Cleaner status display with color coding
            let statusHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:5px">
                <span style="color:#aaa">Status:</span>
                <span style="color:${autoJoinEnabled ? '#4caf50' : '#999'};font-weight:bold">${autoJoinEnabled ? '✅ Running' : '⏸️ Paused'}</span>
            </div>`;

            statusHTML += `<div style="display:flex;justify-content:space-between;margin-bottom:5px">
                <span style="color:#aaa">Time:</span>
                <span>${hh}:${mm}:${ss}</span>
            </div>`;

            // Add countdown to next drop
            statusHTML += `<div style="display:flex;justify-content:space-between">
                <span style="color:#aaa">Next drop:</span>
                <span>${nextGiveawayCountdown()}</span>
            </div>`;

            // Add internal timer info if it's running
            if (internalTimerStarted && !joined) {
                const elapsedSecs = Math.floor((Date.now() - internalTimerStartTime) / 1000);
                const remainingSecs = targetJoinDelaySeconds - elapsedSecs;

                if (remainingSecs > 0) {
                    const mins = Math.floor(remainingSecs / 60);
                    const secs = remainingSecs % 60;

                    // Show progress bar
                    progressContainer.style.display = 'block';
                    const progressPercent = (elapsedSecs / targetJoinDelaySeconds) * 100;
                    progressBar.style.width = `${progressPercent}%`;

                    // Color the progress bar based on time remaining
                    if (remainingSecs < 30) {
                        progressBar.style.backgroundColor = '#e74c3c'; // Red when close to joining
                    } else if (remainingSecs < 60) {
                        progressBar.style.backgroundColor = '#f39c12'; // Yellow when getting closer
                    } else {
                        progressBar.style.backgroundColor = '#10a37f'; // Green when plenty of time
                    }

                    // Add timer text
                    statusHTML += `<div style="text-align:center;margin-top:6px;font-weight:bold;color:#f39c12">
                        ⏱️ Joining in: ${mins}m ${String(secs).padStart(2, '0')}s
                    </div>`;
                }
            } else {
                progressContainer.style.display = 'none';
            }

            status.innerHTML = statusHTML;

            // Update debug info if enabled
            if (debugMode) {
                const timerInfo = findTimerElement();
                const timerData = parseTimerText(timerInfo);

                let debugText = `<div style="margin-bottom:3px">Timer: <b>${timerInfo || 'Not found'}</b></div>`;
                debugText += `<div style="margin-bottom:3px">Internal timer: <b>${internalTimerStarted ? 'Started' : 'Not started'}</b></div>`;

                if (internalTimerStarted) {
                    const elapsedSecs = Math.floor((Date.now() - internalTimerStartTime) / 1000);
                    debugText += `<div style="margin-bottom:3px">Elapsed: <b>${elapsedSecs}s</b></div>`;
                    debugText += `<div style="margin-bottom:3px">Target join: <b>${Math.floor(targetJoinDelaySeconds/60)}m ${targetJoinDelaySeconds%60}s</b></div>`;
                }

                debugText += `<div style="margin-bottom:3px">Joined: <b>${joined ? 'Yes' : 'No'}</b></div>`;
                debugText += `<div style="margin-bottom:3px">Button: <b>${findJoinButton() ? 'Found' : 'Not found'}</b></div>`;
                debugText += `<div style="margin-bottom:3px">Session: <b>${sessionVariance.joinDelayMin}-${sessionVariance.joinDelayMax}s</b></div>`;

                // Add anti-detection status
                debugText += `<div style="margin-bottom:3px">Stealth: <b>Active</b></div>`;

                debugInfo.innerHTML = debugText;
            }
        };

        // Button event handlers
        toggleBtn.onclick = () => {
            autoJoinEnabled = !autoJoinEnabled;
            toggleBtn.textContent = autoJoinEnabled ? '⏹️ Stop' : '▶️ Start';
            toggleBtn.style.backgroundColor = autoJoinEnabled ? '#e74c3c' : '#10a37f';
            updateStatus();
            if (autoJoinEnabled && !isGiveawayPage()) {
                window.location.href = 'https://boxed.gg/pokemon';
            }
        };

        debugBtn.onclick = () => {
            debugMode = !debugMode;
            debugBtn.textContent = debugMode ? '🔍 Hide Debug' : '🔍 Debug';
            debugInfo.style.display = debugMode ? 'block' : 'none';
            updateStatus();
        };

        // Minimize button
        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '—';
        Object.assign(minimizeBtn.style, {
            position: 'absolute',
            top: '7px',
            right: '7px',
            background: 'transparent',
            color: '#888',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '3px 6px'
        });

        minimizeBtn.onclick = () => {
            minimized = true;
            controlBox.style.display = 'none';
            toggleBookmark.style.display = 'flex';
        };

        controlBox.appendChild(minimizeBtn);

        // Bookmark toggle (minimized view)
        const toggleBookmark = document.createElement('div');
        Object.assign(toggleBookmark.style, {
            position: 'fixed',
            bottom: '90px',
            left: '0px',
            padding: '10px',
            backgroundColor: '#10a37f',
            color: '#fff',
            borderRadius: '0 8px 8px 0',
            fontSize: '18px',
            cursor: 'pointer',
            zIndex: '9999',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.3)'
        });

        // Show auto-join status in minimized view
        const updateBookmark = () => {
            toggleBookmark.innerHTML = '📌';
        };

        toggleBookmark.onclick = () => {
            minimized = false;
            controlBox.style.display = 'block';
            toggleBookmark.style.display = 'none';
        };

        document.body.appendChild(controlBox);
        document.body.appendChild(toggleBookmark);
        updateBookmark();

        // Notification function
        function showNotification(message, duration = 3000) {
            notificationPopup.innerHTML = message;
            notificationPopup.style.display = 'block';

            // Add slight randomization to notification duration
            setTimeout(() => {
                notificationPopup.style.display = 'none';
            }, getRandomTime(duration, 0.1));
        }

        // Reminder for drops with randomized check times to avoid detection patterns
        const setupDropReminders = () => {
            // Instead of checking at exact intervals, add randomization
            const checkTime = () => {
                const now = new Date();
                const mins = now.getMinutes();
                const secs = now.getSeconds();

                // Check near minutes 25 and 55, but not exactly at 0 seconds
                // This makes detection harder as we won't always trigger at xx:25:00 and xx:55:00
                if ((mins === 24 && secs >= 50) || (mins === 25 && secs <= 10) ||
                    (mins === 54 && secs >= 50) || (mins === 55 && secs <= 10)) {
                    if (!isGiveawayPage() || !autoJoinEnabled) {
                        showNotification('💎 Gem Drop soon! <a href="/pokemon" style="color:#10a37f;text-decoration:underline;">Go to Pokemon</a>', 8000);
                    }
                }

                // Schedule next check with random interval (800-1200ms)
                setTimeout(checkTime, 800 + Math.random() * 400);
            };

            // Start checks with a small random delay
            setTimeout(checkTime, Math.random() * 1000);
        };

        setupDropReminders();

        // Keep page active with randomized interval
        setInterval(() => {
            if (autoJoinEnabled) {
                // Subtle page activity that's harder to detect than scroll
                // Randomly choose between different methods
                const activityType = Math.floor(Math.random() * 4);

                switch (activityType) {
                    case 0:
                        // Tiny scroll
                        window.scrollBy(0, 1);
                        setTimeout(() => window.scrollBy(0, -1), 10 + Math.random() * 20);
                        break;
                    case 1:
                        // Focus on a random element briefly
                        const elements = document.querySelectorAll('a, button, input');
                        if (elements.length > 0) {
                            const randomElement = elements[Math.floor(Math.random() * elements.length)];
                            if (randomElement && typeof randomElement.focus === 'function') {
                                randomElement.focus();
                                setTimeout(() => randomElement.blur(), 50 + Math.random() * 100);
                            }
                        }
                        break;
                    case 2:
                        // Mouse movement
                        performRandomMouseMovement();
                        break;
                    case 3:
                        // Do nothing this time (important for randomness)
                        break;
                }
            }
        }, getRandomTime(5000, 0.5)); // Much more variable timing

        // Enhanced mouse movement function with Bezier curve
        function dispatchMouseEvents(el) {
            if (!el) {
                debugLog('No element to dispatch events on');
                return;
            }

            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Get start position (either last known position or viewport center)
            const startX = lastMouseX || window.innerWidth / 2;
            const startY = lastMouseY || window.innerHeight / 2;

            // Create points along a Bezier curve for natural movement
            const numPoints = 25 + Math.floor(Math.random() * 15); // Variable number of points
            const points = createBezierPoints(startX, startY, centerX, centerY, numPoints);

            // Move along the curve with variable timing
            let pointIndex = 0;

            function moveToNextPoint() {
                if (pointIndex >= points.length) {
                    // Finished the curve, now click
                    performClick();
                    return;
                }

                const point = points[pointIndex];
                lastMouseX = point.x; // Store last position
                lastMouseY = point.y;

                // Dispatch mousemove event
                document.dispatchEvent(new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: point.x,
                    clientY: point.y
                }));

                // Move to next point with variable delay
                pointIndex++;

                // Occasionally add a longer delay (human thinking pause)
                if (Math.random() < 0.1) { // 10% chance
                    setTimeout(moveToNextPoint, 100 + Math.random() * 400);
                } else {
                    setTimeout(moveToNextPoint, 5 + Math.random() * 15);
                }
            }

            function performClick() {
                // Occasionally overshoot and correct (human-like behavior)
                const shouldOvershoot = Math.random() < 0.3;

                if (shouldOvershoot) {
                    // Overshoot target slightly
                    const overshootX = centerX + (Math.random() * 10 - 5);
                    const overshootY = centerY + (Math.random() * 10 - 5);

                    document.dispatchEvent(new MouseEvent('mousemove', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: overshootX,
                        clientY: overshootY
                    }));

                    // Short delay before correcting
                    setTimeout(() => {
                        // Move back to target
                        document.dispatchEvent(new MouseEvent('mousemove', {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            clientX: centerX,
                            clientY: centerY
                        }));

                        // Click sequence
                        setTimeout(() => clickElement(), 50 + Math.random() * 100);
                    }, 100 + Math.random() * 150);
                } else {
                    // Click directly
                    clickElement();
                }
            }

            function clickElement() {
                lastInteractionTime = Date.now();
                secureState.setLastAction(Date.now());

                // Sequence for clicking with natural delays
                el.dispatchEvent(new MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: centerX,
                    clientY: centerY
                }));

                setTimeout(() => {
                    el.dispatchEvent(new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: centerX,
                        clientY: centerY,
                        buttons: 1
                    }));

                    setTimeout(() => {
                        el.dispatchEvent(new MouseEvent('mouseup', {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            clientX: centerX,
                            clientY: centerY
                        }));

                        el.dispatchEvent(new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            clientX: centerX,
                            clientY: centerY
                        }));
                    }, 30 + Math.random() * 70);
                }, 20 + Math.random() * 50);
            }

            // Start the mouse movement
            moveToNextPoint();
        }

        // Find timer element with multiple methods to increase reliability
        function findTimerElement() {
            // Method 1: Look for specific class and format
            const timerContainer = Array.from(document.querySelectorAll('div')).find(div =>
                div.className.includes('w-[122px]') && /\d+m \d+s/.test(div.textContent)
            );

            if (timerContainer) {
                const time = timerContainer.querySelector('span')?.textContent?.trim();
                return time;
            }

            // Method 2: Look for any element containing timer-like text
            const allElements = Array.from(document.querySelectorAll('div, span'));
            const timerElement = allElements.find(el =>
                /^\d+m\s+\d+s$/.test(el.textContent.trim())
            );

            if (timerElement) {
                return timerElement.textContent.trim();
            }

            // Method 3: Find any element with timer-like pattern
            const timerRegex = /(\d+)m\s+(\d+)s/;
            for (const el of allElements) {
                const match = el.textContent.trim().match(timerRegex);
                if (match) {
                    return match[0];
                }
            }

            return null;
        }

        function parseTimerText(text) {
            if (!text) return null;

            const match = text.match(/(\d+)m\s+(\d+)s/);
            if (match) {
                return {
                    minutes: parseInt(match[1]),
                    seconds: parseInt(match[2])
                };
            }
            return null;
        }

        function runAutoJoiner() {
            if (!autoJoinEnabled || !isGiveawayPage()) return;

            // Open the drop panel if it's not already opened
            if (!secureState.isDropOpened()) {
                // Random delay between 5-15 seconds to open the panel
                const panelOpenDelay = Math.floor(Math.random() * (sessionVariance.panelOpenDelayMax - sessionVariance.panelOpenDelayMin + 1)) + sessionVariance.panelOpenDelayMin;

                setTimeout(() => {
                    debugLog(`Trying to open drop panel after ${panelOpenDelay}ms delay`);
                    const wrapper = document.querySelector('a.flex.items-center.justify-center.gap-1');
                    if (wrapper) {
                        const btn = wrapper.querySelector('button.group');
                        if (btn) {
                            debugLog('Found open button');
                            dispatchMouseEvents(btn);
                            secureState.setDropOpened(true);
                        }
                    }
                }, panelOpenDelay);
            }

            // Find the timer
            const timerText = findTimerElement();
            const timerData = parseTimerText(timerText);

            // Check if timer is around 3 minutes (between 2:58 and 3:02)
            if (timerData && !internalTimerStarted && !joined) {
                const totalSeconds = timerData.minutes * 60 + timerData.seconds;

                // If timer is around 3 minutes (between 2:58 and 3:02)
                if (totalSeconds >= 178 && totalSeconds <= 182) {
                    debugLog(`Timer is around 3 minutes (${timerData.minutes}m ${timerData.seconds}s), starting internal timer`);
                    internalTimerStarted = true;
                    internalTimerStartTime = Date.now();

                    // Generate random join delay (between min and max from session variance)
                    targetJoinDelaySeconds = getRandomJoinDelay();
                    debugLog(`Will join in ${Math.floor(targetJoinDelaySeconds/60)}m ${targetJoinDelaySeconds%60}s`);

                    // Show notification
                    showNotification(`⏱️ Drop detected! Will join soon`, 3000);
                    updateBookmark();
                }
            }

            // Store last timer value
            if (timerData) {
                lastTimerValue = timerData;
            }

            // Check if internal timer has completed
            if (internalTimerStarted && !joined) {
                const elapsedSecs = Math.floor((Date.now() - internalTimerStartTime) / 1000);

                if (elapsedSecs >= targetJoinDelaySeconds) {
                    debugLog('Internal timer completed, trying to join now!');
                    joined = true;
                    tryClickJoin(15);
                    updateBookmark();
                }
            }
        }

        // Enhanced join button finder with multiple methods for reliability
        function findJoinButton() {
            // Method 1: Original approach
            const joinBtn1 = Array.from(document.querySelectorAll('button')).find(btn =>
                btn.querySelector('div')?.textContent.trim() === 'Count Me In!'
            );

            if (joinBtn1) return joinBtn1;

            // Method 2: Look for text content directly
            const joinBtn2 = Array.from(document.querySelectorAll('button')).find(btn =>
                btn.textContent.includes('Count Me In!')
            );

            if (joinBtn2) return joinBtn2;

            // Method 3: Look for elements with specific classes
            const joinBtn3 = document.querySelector('button.group.rounded-md.py-2.text-size-14.font-semibold.border.text-center.justify-center');

            if (joinBtn3 && joinBtn3.textContent.includes('Count Me In')) return joinBtn3;

            // Method 4: Find the closest match based on class structure
            const allButtons = Array.from(document.querySelectorAll('button'));
            const joinBtn4 = allButtons.find(btn =>
                btn.className.includes('rounded-md') &&
                btn.className.includes('text-size-14') &&
                (btn.textContent.includes('Count') || btn.innerHTML.includes('Count'))
            );

            if (joinBtn4) return joinBtn4;

            // Method 5: Look for any button with a div containing text similar to "Count Me In"
            const joinBtn5 = allButtons.find(btn => {
                const innerText = btn.textContent.toLowerCase().trim();
                return innerText.includes('count') && innerText.includes('in');
            });

            if (joinBtn5) return joinBtn5;

            // Method 6: Look for any button that might be related to joining
            const joinBtn6 = allButtons.find(btn => {
                const btnText = btn.textContent.toLowerCase();
                return (btnText.includes('join') ||
                        btnText.includes('enter') ||
                        btnText.includes('count') ||
                        btnText.includes('claim') ||
                        btnText.includes('participate'));
            });

            if (joinBtn6) return joinBtn6;

            return null;
        }

        function tryClickJoin(retries) {
            const joinBtn = findJoinButton();

            if (joinBtn) {
                debugLog('Join button found, clicking it');
                dispatchMouseEvents(joinBtn);
                setTimeout(confirmJoinThenClose, 2000); // Keep this exact delay as requested
            } else if (retries > 0) {
                debugLog(`Join button not found, retrying... (${retries} attempts left)`);
                setTimeout(() => tryClickJoin(retries - 1), 1000); // Keep this delay as requested
            } else {
                debugLog('Failed to find join button after all attempts');
                joined = false;
                internalTimerStarted = false; // Reset internal timer
                updateBookmark();
            }
        }

        function confirmJoinThenClose() {
            // Enhanced confirmation detection
            // Method 1: Look for specific text
            const confirmationTexts = ["You're In!", "You're in!", "Joined Successfully", "Successfully Joined", "Success"];

            let confirmation = null;

            // Check for common confirmation texts
            for (const text of confirmationTexts) {
                const foundElement = Array.from(document.querySelectorAll('div')).find(div =>
                    div.textContent.includes(text)
                );

                if (foundElement) {
                    confirmation = foundElement;
                    break;
                }
            }

            // Method 2: Look for success elements or icons
            if (!confirmation) {
                confirmation = document.querySelector('div.text-green-500') ||
                              document.querySelector('svg.text-green-500') ||
                              document.querySelector('[data-success="true"]');
            }

            if (confirmation) {
                debugLog('Join confirmation found, closing dialog');
                showNotification('✅ Successfully joined the gem drop!', 5000);

                // Try to find close button with enhanced detection
                const closeBtn = document.querySelector('button.flex.items-center.group.hover\\:bg-dark-3') ||
                                 document.querySelector('button[aria-label="Close"]') ||
                                 document.querySelector('button.absolute.top-2.right-2') ||
                                 document.querySelector('svg[aria-label="Close"]')?.closest('button') ||
                                 Array.from(document.querySelectorAll('button')).find(btn =>
                                     btn.innerHTML.includes('svg') &&
                                     (btn.parentElement.className.includes('absolute') ||
                                      btn.className.includes('absolute'))
                                 ) ||
                                 // Look for X symbol
                                 Array.from(document.querySelectorAll('button')).find(btn =>
                                     btn.textContent === '×' || btn.textContent === 'X' || btn.textContent === '✕'
                                 );

                if (closeBtn) {
                    dispatchMouseEvents(closeBtn);
                    debugLog('Close button clicked');
                }

                // Reload page after a random delay to avoid detection
                const reloadDelay = Math.floor(Math.random() * 91) + 30;
                debugLog(`Will reload page in ${reloadDelay} seconds`);
                setTimeout(() => {
                    // Before reload, introduce more randomness in behavior
                    const shouldReload = Math.random() > 0.3; // 70% chance to reload

                    if (shouldReload) {
                        location.reload();
                    } else {
                        // Alternative: just reset state and stay on page
                        joined = false;
                        internalTimerStarted = false;
                        secureState.setDropOpened(false);
                        updateBookmark();

                        // Navigate to a different section then back
                        const otherPages = ['/anime', '/cards', '/sneakers', '/'];
                        const randomPage = otherPages[Math.floor(Math.random() * otherPages.length)];

                        // 30% chance to visit another page briefly
                        setTimeout(() => {
                            if (autoJoinEnabled) {
                                window.location.href = randomPage;

                                // Return to pokemon page after 3-10 seconds
                                setTimeout(() => {
                                    window.location.href = '/pokemon';
                                }, 3000 + Math.random() * 7000);
                            }
                        }, 1000 + Math.random() * 3000);
                    }
                }, reloadDelay * 1000);
            } else {
                debugLog('Join confirmation not found, resetting joined status');
                joined = false;
                internalTimerStarted = false; // Reset internal timer
                updateBookmark();
            }
        }

        // Run auto joiner with a randomized interval and variable execution pattern
        function scheduleAutoJoiner() {
            // Add randomness to execution pattern
            const randomFactor = Math.random();

            if (randomFactor < 0.9) { // 90% chance to run normally
                runAutoJoiner();
                updateStatus();

                // Only sometimes perform random mouse movement (40% chance)
                if (Math.random() < 0.4) {
                    performRandomMouseMovement();
                }
            } else {
                // 10% chance to skip a cycle entirely (makes patterns less predictable)
                debugLog('Randomly skipping a cycle');
            }

            // Highly variable interval between 800-1200ms
            const nextInterval = 800 + Math.random() * 400;
            setTimeout(scheduleAutoJoiner, nextInterval);
        }

        // Start the auto joiner loop with random intervals
        setTimeout(scheduleAutoJoiner, 1000 + Math.random() * 2000); // Random initial delay
        updateStatus();
    });
})();