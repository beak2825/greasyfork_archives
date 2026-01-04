// ==UserScript==
// @name         Android Swipe to Seek Video
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds swipe seeking to Firefox android or any other browser efficiently
// @author       Modified by Assistant
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521474/Android%20Swipe%20to%20Seek%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/521474/Android%20Swipe%20to%20Seek%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration with default values
    const DEFAULT_CONFIG = {
        // Base seconds to seek per 100 pixels of swipe
        seekRate: 10,
        // Maximum seconds that can be seeked in one swipe
        maxSeekAmount: 60
    };

    // Get config with defaults
    function getConfig() {
        const savedConfig = GM_getValue('seekConfig', DEFAULT_CONFIG);
        return { ...DEFAULT_CONFIG, ...savedConfig };
    }

    // Save config
    function saveConfig(config) {
        GM_setValue('seekConfig', { ...DEFAULT_CONFIG, ...config });
    }

    // Config UI
    function showConfigUI() {
        const config = getConfig();
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: white !important;
            padding: 20px !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
            z-index: 2147483647 !important;
            width: 300px !important;
            font-family: Arial, sans-serif !important;
        `;

        dialog.innerHTML = `
            <h2 style="margin: 0 0 15px 0 !important; font-size: 18px !important;">Swipe Seek Configuration</h2>
            <div style="margin-bottom: 15px !important;">
                <label style="display: block !important; margin-bottom: 5px !important;">
                    Seek Rate (seconds per 100px swipe):
                    <input type="number" id="seekRate" value="${config.seekRate}" 
                           style="width: 100% !important; padding: 5px !important; margin-top: 5px !important;">
                </label>
            </div>
            <div style="margin-bottom: 15px !important;">
                <label style="display: block !important; margin-bottom: 5px !important;">
                    Maximum Seek Amount (seconds):
                    <input type="number" id="maxSeekAmount" value="${config.maxSeekAmount}"
                           style="width: 100% !important; padding: 5px !important; margin-top: 5px !important;">
                </label>
            </div>
            <div style="text-align: right !important;">
                <button id="cancelConfig" style="margin-right: 10px !important; padding: 5px 10px !important;">Cancel</button>
                <button id="saveConfig" style="padding: 5px 10px !important;">Save</button>
            </div>
        `;

        document.body.appendChild(dialog);

        document.getElementById('cancelConfig').onclick = () => dialog.remove();
        document.getElementById('saveConfig').onclick = () => {
            const newConfig = {
                seekRate: parseFloat(document.getElementById('seekRate').value),
                maxSeekAmount: parseFloat(document.getElementById('maxSeekAmount').value)
            };
            saveConfig(newConfig);
            dialog.remove();
            showToast('Configuration saved');
        };
    }

    // Register config menu
    GM_registerMenuCommand('Configure Swipe Seek', showConfigUI);

    let isInFullscreen = false;
    let isPlaying = false;
    let initialX = null;
    let currentSeekAmount = 0;
    let seekIndicator = null;
    
    // Get current domain
    function getCurrentDomain() {
        return window.location.hostname;
    }

    // Check if current site is blacklisted
    function isBlacklisted() {
        const blacklist = GM_getValue('blacklistedSites', []);
        return blacklist.includes(getCurrentDomain());
    }

    // Toggle blacklist for current site
    function toggleBlacklist() {
        const domain = getCurrentDomain();
        const blacklist = GM_getValue('blacklistedSites', []);
        const isCurrentlyBlacklisted = blacklist.includes(domain);

        if (isCurrentlyBlacklisted) {
            const newBlacklist = blacklist.filter(site => site !== domain);
            GM_setValue('blacklistedSites', newBlacklist);
            showToast('Site removed from blacklist');
        } else {
            blacklist.push(domain);
            GM_setValue('blacklistedSites', blacklist);
            showToast('Site added to blacklist');
        }
    }

    // Register blacklist menu command
    GM_registerMenuCommand('Toggle Blacklist for Current Site', toggleBlacklist);

    function showToast(message) {
        if (!seekIndicator) {
            seekIndicator = createSeekIndicator();
        }
        seekIndicator.textContent = message;
        seekIndicator.style.opacity = '1';
        setTimeout(() => {
            seekIndicator.style.opacity = '0';
        }, 2000);
    }

    function createSeekIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'video-seek-indicator';
        indicator.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: rgba(0, 0, 0, 0.8) !important;
            color: white !important;
            padding: 15px 25px !important;
            border-radius: 25px !important;
            font-size: 18px !important;
            font-family: Arial, sans-serif !important;
            z-index: 2147483647 !important;
            pointer-events: none !important;
            opacity: 0 !important;
            transition: opacity 0.2s !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        `;
        document.body.appendChild(indicator);
        return indicator;
    }

    function updateSeekIndicator(seekAmount) {
        if (!seekIndicator) {
            seekIndicator = createSeekIndicator();
        }

        const arrow = seekAmount > 0 ? '→' : '←';
        const absAmount = Math.abs(seekAmount);
        seekIndicator.textContent = `${arrow} ${absAmount.toFixed(1)}s`;
        seekIndicator.style.opacity = '1';
        seekIndicator.style.borderLeft = `4px solid ${seekAmount > 0 ? '#4CAF50' : '#f44336'}`;
    }

    function hideSeekIndicator() {
        if (seekIndicator) {
            seekIndicator.style.opacity = '0';
        }
    }

    function calculateSeekAmount(deltaX) {
        const config = getConfig();
        // Convert pixel distance to seconds based on seekRate
        const rawAmount = (deltaX / 100) * config.seekRate;
        // Clamp the seek amount to the configured maximum
        return Math.max(Math.min(rawAmount, config.maxSeekAmount), -config.maxSeekAmount);
    }

    function handleTouch(video, event) {
        if (!isInFullscreen || isBlacklisted()) return;

        switch(event.type) {
            case 'touchstart':
                initialX = event.touches[0].clientX;
                currentSeekAmount = 0;
                break;

            case 'touchmove':
                if (initialX === null) return;

                const currentX = event.touches[0].clientX;
                const deltaX = currentX - initialX;
                
                currentSeekAmount = calculateSeekAmount(deltaX);
                updateSeekIndicator(currentSeekAmount);
                event.preventDefault();
                break;

            case 'touchend':
                if (initialX !== null && currentSeekAmount !== 0) {
                    if (video.player && typeof video.player.currentTime === 'function') {
                        video.player.currentTime(video.player.currentTime() + currentSeekAmount);
                    } else {
                        video.currentTime += currentSeekAmount;
                    }

                    setTimeout(hideSeekIndicator, 500);
                }
                initialX = null;
                currentSeekAmount = 0;
                break;
        }
    }

    function attachTouchHandlers(video) {
        const touchHandler = (event) => handleTouch(video, event);
        
        video.addEventListener('touchstart', touchHandler, { passive: true });
        video.addEventListener('touchmove', touchHandler, { passive: false });
        video.addEventListener('touchend', touchHandler, { passive: true });
    }

    function handleFullscreenChange() {
        const isNowFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.querySelector('.video-js.vjs-fullscreen')
        );

        if (isNowFullscreen && !isInFullscreen) {
            isInFullscreen = true;
            const video = document.querySelector('video');
            if (video) attachTouchHandlers(video);
        } else if (!isNowFullscreen) {
            isInFullscreen = false;
            hideSeekIndicator();
        }
    }

    // Watch for video elements
    const observer = new MutationObserver((mutations, obs) => {
        const video = document.querySelector('video');
        if (video) {
            attachTouchHandlers(video);

            video.addEventListener('webkitbeginfullscreen', () => {
                isInFullscreen = true;
                attachTouchHandlers(video);
            });

            video.addEventListener('webkitendfullscreen', () => {
                isInFullscreen = false;
                hideSeekIndicator();
            });

            const videoJs = document.querySelector('.video-js');
            if (videoJs) {
                const classObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            handleFullscreenChange();
                        }
                    });
                });

                classObserver.observe(videoJs, {
                    attributes: true,
                    attributeFilter: ['class']
                });
            }

            obs.disconnect();
        }
    });

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange, true);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange, true);

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();