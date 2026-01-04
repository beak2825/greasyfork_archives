// ==UserScript==
// @name         Web Speed Controller
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  control the speed of website timers, animations, and videos without changing video playback rate
// @author       Minoa
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527158/Web%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/527158/Web%20Speed%20Controller.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Create UI elements
    const controls = document.createElement('div');
    controls.style.cssText = `
        position: fixed;
        top: 13px;
        right: 18px;
        background: rgba(15, 23, 42, 0.8);
        padding: 4px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        z-index: 9999999;
        display: flex;
        gap: 4px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        align-items: center;
        transition: all 0.3s ease;
        width: 45px;
        overflow: hidden;
    `;

    const input = document.createElement('input');
    input.type = 'number';
    input.step = '1';
    input.value = '1';
    input.style.cssText = `
        width: 22px;
        height: 22px;
        background: rgba(30, 41, 59, 0.8);
        border: 1px solid rgba(148, 163, 184, 0.1);
        color: rgba(226, 232, 240, 0.6);
        border-radius: 6px;
        padding: 2px;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        outline: none;
        transition: all 0.3s ease;
        -moz-appearance: textfield;
        cursor: pointer;
    `;

    // Remove spinner arrows
    input.style.cssText += `
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    `;

    const toggleButton = document.createElement('button');
    toggleButton.textContent = '▶';
    toggleButton.style.cssText = `
        background: rgba(59, 130, 246, 0.5);
        color: rgba(255, 255, 255, 0.6);
        border: none;
        border-radius: 6px;
        width: 20px;
        height: 20px;
        font-size: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: none;
        align-items: center;
        justify-content: center;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        white-space: nowrap;
        padding: 0;
    `;

    let isExpanded = false;
    let isEnabled = false;

    // Hover effect for small state
    controls.addEventListener('mouseenter', () => {
        if (!isExpanded) {
            controls.style.background = 'rgba(15, 23, 42, 0.45)';
            input.style.background = 'rgba(30, 41, 59, 0.5)';
            input.style.color = 'rgba(226, 232, 240, 0.8)';
        }
    });

    controls.addEventListener('mouseleave', () => {
        if (!isExpanded) {
            controls.style.background = 'rgba(15, 23, 42, 0.25)';
            input.style.background = 'rgba(30, 41, 59, 0.3)';
            input.style.color = 'rgba(226, 232, 240, 0.6)';
        }
    });

    function expandControls() {
        if (!isExpanded) {
            controls.style.width = 'auto';
            controls.style.padding = '16px';
            controls.style.background = 'rgba(15, 23, 42, 0.85)';
            controls.style.backdropFilter = 'blur(10px)';
            controls.style.webkitBackdropFilter = 'blur(10px)';
            controls.style.borderRadius = '12px';
            controls.style.gap = '12px';
            controls.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
            controls.style.border = '1px solid rgba(255, 255, 255, 0.1)';

            input.style.width = '70px';
            input.style.height = '36px';
            input.style.padding = '4px 8px';
            input.style.fontSize = '14px';
            input.style.background = 'rgba(30, 41, 59, 0.8)';
            input.style.borderRadius = '8px';
            input.style.border = '2px solid rgba(148, 163, 184, 0.2)';
            input.style.color = '#e2e8f0';

            toggleButton.style.display = 'flex';
            toggleButton.style.width = '90px';
            toggleButton.style.height = '36px';
            toggleButton.style.padding = '8px 16px';
            toggleButton.style.fontSize = '14px';
            toggleButton.style.borderRadius = '8px';
            toggleButton.textContent = 'Enable';
            toggleButton.style.background = '#3b82f6';
            toggleButton.style.color = '#ffffff';

            isExpanded = true;
        }
    }

    function adjustInputWidth() {
        if (isExpanded) {
            const span = document.createElement('span');
            span.style.cssText = `
                position: absolute;
                top: -9999px;
                font: ${window.getComputedStyle(input).font};
                padding: ${window.getComputedStyle(input).padding};
            `;
            span.textContent = input.value;
            document.body.appendChild(span);
            const newWidth = Math.max(70, span.offsetWidth + 24);
            input.style.width = `${newWidth}px`;
            document.body.removeChild(span);
        }
    }

    // Expand on input focus
    input.addEventListener('focus', () => {
        expandControls();
        input.style.borderColor = '#3b82f6';
        input.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
    });

    input.addEventListener('blur', () => {
        if (isExpanded) {
            input.style.borderColor = 'rgba(148, 163, 184, 0.2)';
            input.style.boxShadow = 'none';
        }
        input.value = Math.round(input.value) || 1;
    });

    // Handle input changes
    input.addEventListener('input', () => {
        input.value = Math.round(input.value);
        adjustInputWidth();
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
        const currentValue = parseInt(input.value) || 1;
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const newValue = currentValue + 1;
            input.value = newValue;
            adjustInputWidth();
            if (isEnabled) updateSpeed();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newValue = Math.max(1, currentValue - 1);
            input.value = newValue;
            adjustInputWidth();
            if (isEnabled) updateSpeed();
        }
    });

    // Button styling
    toggleButton.addEventListener('mouseover', () => {
        if (isExpanded) {
            toggleButton.style.background = isEnabled ? '#dc2626' : '#2563eb';
            toggleButton.style.transform = 'translateY(-1px)';
        }
    });

    toggleButton.addEventListener('mouseout', () => {
        if (isExpanded) {
            toggleButton.style.background = isEnabled ? '#ef4444' : '#3b82f6';
            toggleButton.style.transform = 'translateY(0)';
        }
    });

    // Store original timing functions
    const original = {
        setTimeout: window.setTimeout.bind(window),
        setInterval: window.setInterval.bind(window),
        requestAnimationFrame: window.requestAnimationFrame.bind(window),
        dateNow: Date.now.bind(Date),
        originalDate: Date,
        // Store original media element methods
        mediaElementCurrentTime: Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime'),
        mediaElementPlaybackRate: Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate'),
        mediaElementPlay: HTMLMediaElement.prototype.play,
        mediaElementPause: HTMLMediaElement.prototype.pause
    };

    let speedMultiplier = 1;
    let startTime = original.dateNow();
    let modifiedTime = startTime;

    function updateSpeed() {
        speedMultiplier = parseInt(input.value) || 1;
        modifiedTime = original.dateNow();
        startTime = original.dateNow();
        applySpeedMultiplier();
    }

    function applySpeedMultiplier() {
        window.setTimeout = function(callback, delay, ...args) {
            return original.setTimeout(callback, delay / speedMultiplier, ...args);
        };

        window.setInterval = function(callback, delay, ...args) {
            return original.setInterval(callback, delay / speedMultiplier, ...args);
        };

        window.requestAnimationFrame = function(callback) {
            return original.requestAnimationFrame((timestamp) => {
                const adjustedTimestamp = timestamp * speedMultiplier;
                callback(adjustedTimestamp);
            });
        };

        function TimeWarpDate(...args) {
            if (args.length === 0) {
                const now = original.dateNow();
                const timePassed = now - startTime;
                const adjustedTime = modifiedTime + (timePassed * speedMultiplier);
                return new original.originalDate(adjustedTime);
            }
            return new original.originalDate(...args);
        }

        TimeWarpDate.prototype = original.originalDate.prototype;

        TimeWarpDate.now = function() {
            const now = original.dateNow();
            const timePassed = now - startTime;
            return modifiedTime + (timePassed * speedMultiplier);
        };

        TimeWarpDate.parse = original.originalDate.parse;
        TimeWarpDate.UTC = original.originalDate.UTC;

        window.Date = TimeWarpDate;
        
        // Override HTMLMediaElement methods to control video timing
        const mediaElements = {};
        const mediaStartTimes = {};
        
        // Override currentTime getter and setter
        Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
            get: function() {
                const originalGet = original.mediaElementCurrentTime.get;
                const actualTime = originalGet.call(this);
                return actualTime;
            },
            set: function(value) {
                const originalSet = original.mediaElementCurrentTime.set;
                const id = this.dataset.speedControllerId || (this.dataset.speedControllerId = Math.random().toString(36).substr(2, 9));
                mediaElements[id] = this;
                
                // Store the start time if not already stored
                if (!mediaStartTimes[id]) {
                    mediaStartTimes[id] = {
                        realTime: original.dateNow(),
                        mediaTime: value
                    };
                }
                
                originalSet.call(this, value);
            },
            configurable: true
        });
        
        // Override play method
        HTMLMediaElement.prototype.play = function() {
            const id = this.dataset.speedControllerId || (this.dataset.speedControllerId = Math.random().toString(36).substr(2, 9));
            mediaElements[id] = this;
            
            // Update start time when play is called
            mediaStartTimes[id] = {
                realTime: original.dateNow(),
                mediaTime: this.currentTime
            };
            
            return original.mediaElementPlay.call(this);
        };
        
        // Override pause method
        HTMLMediaElement.prototype.pause = function() {
            return original.mediaElementPause.call(this);
        };
        
        // Create a function to update all media elements
        function updateMediaElements() {
            for (const id in mediaElements) {
                const element = mediaElements[id];
                if (!element.paused && mediaStartTimes[id]) {
                    const originalGet = original.mediaElementCurrentTime.get;
                    const originalSet = original.mediaElementCurrentTime.set;
                    
                    const currentRealTime = original.dateNow();
                    const realTimePassed = currentRealTime - mediaStartTimes[id].realTime;
                    const adjustedTimePassed = realTimePassed * speedMultiplier;
                    const newMediaTime = mediaStartTimes[id].mediaTime + (adjustedTimePassed / 1000);
                    
                    // Only update if the difference is significant
                    const currentMediaTime = originalGet.call(element);
                    if (Math.abs(newMediaTime - currentMediaTime) > 0.1) {
                        originalSet.call(element, newMediaTime);
                        
                        // Update start time to prevent drift
                        mediaStartTimes[id] = {
                            realTime: currentRealTime,
                            mediaTime: newMediaTime
                        };
                    }
                }
            }
            
            // Continue updating media elements
            if (speedMultiplier !== 1) {
                original.setTimeout(updateMediaElements, 100);
            }
        }
        
        // Start updating media elements
        if (speedMultiplier !== 1) {
            updateMediaElements();
        }
    }

    function restoreOriginal() {
        window.setTimeout = original.setTimeout;
        window.setInterval = original.setInterval;
        window.requestAnimationFrame = original.requestAnimationFrame;
        window.Date = original.originalDate;
        modifiedTime = original.dateNow();
        startTime = original.dateNow();
        
        // Restore HTMLMediaElement methods
        Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', original.mediaElementCurrentTime);
        HTMLMediaElement.prototype.play = original.mediaElementPlay;
        HTMLMediaElement.prototype.pause = original.mediaElementPause;
    }

    input.addEventListener('change', () => {
        if (isEnabled) {
            updateSpeed();
        }
    });

    toggleButton.addEventListener('click', () => {
        isEnabled = !isEnabled;
        toggleButton.textContent = isEnabled ? 'Disable' : 'Enable';
        toggleButton.style.background = isEnabled ? '#ef4444' : '#3b82f6';

        if (isEnabled) {
            updateSpeed();
        } else {
            restoreOriginal();
        }
    });

    controls.appendChild(input);
    controls.appendChild(toggleButton);
    document.body.appendChild(controls);
})();