// ==UserScript==
// @name         FetLife Auto-Follow
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically follow all users on a FetLife followers page
// @author       You
// @match        https://fetlife.com/*
// @match        https://www.fetlife.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539614/FetLife%20Auto-Follow.user.js
// @updateURL https://update.greasyfork.org/scripts/539614/FetLife%20Auto-Follow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 FetLife Auto-Follow script loaded!');
    console.log('Current URL:', window.location.href);

    let MIN_DELAY = 50;
    let MAX_DELAY = 200;
    const MAX_RETRIES = 3;
    const SCROLL_DELAY = 1000;

    const SPEED_PRESETS = {
        'instant': { min: 10, max: 50, label: '⚡ Instant (10-50ms)' },
        'fast': { min: 50, max: 200, label: '🚀 Fast (50-200ms)' },
        'normal': { min: 200, max: 500, label: '⚖️ Normal (200-500ms)' },
        'slow': { min: 500, max: 1000, label: '🐌 Slow (500-1000ms)' },
        'stealth': { min: 1000, max: 2000, label: '🥷 Stealth (1-2s)' }
    };

    let followCount = 0;
    let isRunning = false;
    let totalButtons = 0;

    function getRandomDelay() {
        return Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function randomDelay() {
        const delay = getRandomDelay();
        console.log(`💤 Waiting ${delay.toFixed(0)}ms before next follow...`);
        await sleep(delay);
    }

    async function scrollToBottom() {
        return new Promise(resolve => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollTo(0, scrollHeight);
            setTimeout(resolve, SCROLL_DELAY);
        });
    }

    function createButton() {
        console.log('Creating button...');

        const existingBtn = document.getElementById('auto-follow-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        const button = document.createElement('div');
        button.id = 'auto-follow-btn';
        button.innerHTML = `
            <div class="btn-content">
                <span class="btn-text">😈❤️ Auto-Follow All</span>
                <div class="loading-spinner" style="display: none;">
                    <div class="spinner"></div>
                </div>
                <button class="pause-btn" style="display: none;" title="Pause">⏸️</button>
            </div>
            <div class="speed-dropdown" style="display: none;">
                <div class="speed-header">Follow Speed:</div>
                <select class="speed-select">
                    <option value="fast" selected>🚀 Fast</option>
                    <option value="normal">⚖️ Normal</option>
                    <option value="slow">🐌 Slow</option>
                    <option value="stealth">🥷 Stealth</option>
                    <option value="human">👤 Human</option>
                </select>
            </div>
        `;
        button.style.cssText = `
            position: fixed !important;
            top: 65px !important;
            right: 20px !important;
            z-index: 999999 !important;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
            color: #e53e3e !important;
            border: 1px solid #404040 !important;
            padding: 12px 18px !important;
            border-radius: 12px !important;
            font-weight: 600 !important;
            font-size: 13px !important;
            cursor: pointer !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            backdrop-filter: blur(10px) !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
            letter-spacing: 0.3px !important;
            user-select: none !important;
            min-width: 180px !important;
        `;

        const style = document.createElement('style');
        style.textContent = `
            #auto-follow-btn .btn-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                position: relative;
            }

            #auto-follow-btn .btn-text {
                transition: opacity 0.3s ease;
            }

            #auto-follow-btn .loading-spinner {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #auto-follow-btn .spinner {
                width: 16px;
                height: 16px;
                border: 2px solid rgba(229, 62, 62, 0.2);
                border-top: 2px solid #e53e3e;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            #auto-follow-btn .pause-btn {
                background: rgba(229, 62, 62, 0.15) !important;
                border: 1px solid rgba(229, 62, 62, 0.3) !important;
                border-radius: 6px !important;
                padding: 4px 6px !important;
                font-size: 12px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                color: #e53e3e !important;
                backdrop-filter: blur(5px) !important;
            }

            #auto-follow-btn .pause-btn:hover {
                background: rgba(229, 62, 62, 0.25) !important;
                border-color: rgba(229, 62, 62, 0.5) !important;
                transform: scale(1.05) !important;
                color: #ff6b6b !important;
            }

            #auto-follow-btn .speed-dropdown {
                margin-top: 8px;
                padding: 8px 12px;
                background: rgba(26, 26, 26, 0.95) !important;
                border: 1px solid rgba(64, 64, 64, 0.8) !important;
                border-radius: 8px !important;
                backdrop-filter: blur(10px) !important;
            }

            #auto-follow-btn .speed-header {
                color: #e53e3e !important;
                font-size: 11px !important;
                font-weight: 600 !important;
                margin-bottom: 6px !important;
                text-align: center !important;
            }

            #auto-follow-btn .speed-select {
                width: 100% !important;
                background: rgba(45, 45, 45, 0.9) !important;
                color: #e53e3e !important;
                border: 1px solid rgba(64, 64, 64, 0.6) !important;
                border-radius: 6px !important;
                padding: 6px 8px !important;
                font-size: 11px !important;
                font-family: inherit !important;
                cursor: pointer !important;
                outline: none !important;
            }

            #auto-follow-btn .speed-select:hover {
                background: rgba(61, 45, 45, 0.9) !important;
                border-color: rgba(229, 62, 62, 0.4) !important;
            }

            #auto-follow-btn .speed-select:focus {
                border-color: rgba(229, 62, 62, 0.6) !important;
                box-shadow: 0 0 0 2px rgba(229, 62, 62, 0.1) !important;
            }

            #auto-follow-btn .speed-select option {
                background: #2d2d2d !important;
                color: #e53e3e !important;
            }
        `;
        document.head.appendChild(style);

        button.addEventListener('mouseenter', () => {
            if (!isRunning) {
                button.style.background = 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%) !important';
                button.style.color = '#ff6b6b !important';
                button.style.transform = 'translateY(-2px) scale(1.02)';
                button.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15) !important';
                button.style.borderColor = '#555555 !important';

                const dropdown = button.querySelector('.speed-dropdown');
                if (dropdown) dropdown.style.display = 'block';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!isRunning) {
                button.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important';
                button.style.color = '#e53e3e !important';
                button.style.transform = 'translateY(0) scale(1)';
                button.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1) !important';
                button.style.borderColor = '#404040 !important';

                const dropdown = button.querySelector('.speed-dropdown');
                if (dropdown) dropdown.style.display = 'none';
            }
        });

        button.addEventListener('click', function(e) {
            if (e.target.classList.contains('pause-btn')) return;

            console.log('Button clicked!');
            if (isRunning) {
                stopAutoFollow();
            } else {
                startAutoFollow();
            }
        });

        const pauseBtn = button.querySelector('.pause-btn');
        pauseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Pause button clicked!');
            stopAutoFollow();
        });

        const speedSelect = button.querySelector('.speed-select');
        speedSelect.addEventListener('change', function(e) {
            e.stopPropagation();
            const preset = SPEED_PRESETS[e.target.value];
            if (preset) {
                MIN_DELAY = preset.min;
                MAX_DELAY = preset.max;
                console.log(`🎚️ Speed changed to: ${preset.label}`);
                console.log(`New delays: ${MIN_DELAY}-${MAX_DELAY}ms`);
            }
        });

        speedSelect.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        document.body.appendChild(button);
        console.log('Button added to page!');
    }

    function updateButton(text, isActive = false) {
        const button = document.getElementById('auto-follow-btn');
        if (!button) return;

        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.loading-spinner');
        const pauseBtn = button.querySelector('.pause-btn');

        if (btnText) btnText.textContent = text;

        if (isActive) {
            button.style.setProperty('background', 'linear-gradient(135deg, #2a1a1a 0%, #3d2d2d 100%)', 'important');
            button.style.setProperty('color', '#e53e3e', 'important');
            button.style.setProperty('border-color', '#555555', 'important');
            button.style.setProperty('box-shadow', '0 8px 32px rgba(229,62,62,0.15), inset 0 1px 0 rgba(255,255,255,0.1)', 'important');
            button.style.setProperty('cursor', 'pointer', 'important');

            if (spinner) {
                spinner.style.setProperty('display', 'flex', 'important');
            }
            if (pauseBtn) {
                pauseBtn.style.setProperty('display', 'block', 'important');
            }

            button.setAttribute('data-running', 'true');

        } else {
            button.style.setProperty('background', 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', 'important');
            button.style.setProperty('color', '#e53e3e', 'important');
            button.style.setProperty('border-color', '#404040', 'important');
            button.style.setProperty('box-shadow', '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)', 'important');

            if (spinner) {
                spinner.style.setProperty('display', 'none', 'important');
            }
            if (pauseBtn) {
                pauseBtn.style.setProperty('display', 'none', 'important');
            }

            button.removeAttribute('data-running');
        }

        setTimeout(() => {
            if (isActive && isRunning) {
                if (spinner) spinner.style.setProperty('display', 'flex', 'important');
                if (pauseBtn) pauseBtn.style.setProperty('display', 'block', 'important');
                console.log('Force-applied active state');
            }
        }, 50);
    }

    function findFollowButtons() {
        const buttons = [];

        document.querySelectorAll('button').forEach(btn => {
            const span = btn.querySelector('span');
            if (span && span.textContent.trim() === 'Follow') {
                buttons.push(btn);
            }
        });

        document.querySelectorAll('a[title*="Follow"] button').forEach(btn => {
            const span = btn.querySelector('span');
            if (span && span.textContent.trim() === 'Follow' && !buttons.includes(btn)) {
                buttons.push(btn);
            }
        });

        document.querySelectorAll('button').forEach(btn => {
            const text = btn.textContent.trim();
            if (text === 'Follow' && !buttons.includes(btn)) {
                buttons.push(btn);
            }
        });

        console.log(`Found ${buttons.length} follow buttons`);
        return buttons;
    }

    async function followUser(button, userIndex, retryCount = 0) {
        const startTime = Date.now();
        try {
            const span = button.querySelector('span');
            const buttonText = span ? span.textContent.trim() : button.textContent.trim();

            if (buttonText !== 'Follow') {
                console.log(`Button ${userIndex + 1}: Already followed or changed state (Current: "${buttonText}")`);
                return false;
            }

            console.log(`👆 Clicking follow button ${userIndex + 1}...`);
            const clickTime = Date.now();

            button.focus();
            await sleep(10 + Math.random() * 15);

            button.click();

            await sleep(75 + Math.random() * 50);

            const newSpan = button.querySelector('span');
            const newText = newSpan ? newSpan.textContent.trim() : button.textContent.trim();

            const totalTime = Date.now() - startTime;
            console.log(`⏱️ Follow attempt took ${totalTime}ms total`);

            if (newText === 'Following' || newText === 'Unfollow' || newText === 'Follow pending' || newText === 'Pending' || button.disabled) {
                followCount++;
                console.log(`✅ Successfully followed user ${userIndex + 1} (Total: ${followCount}) - Status: ${newText}`);
                return true;
            }

            if (retryCount < MAX_RETRIES) {
                console.log(`⚠️ Retry ${retryCount + 1} for user ${userIndex + 1}`);
                await sleep(200 + Math.random() * 100);
                return await followUser(button, userIndex, retryCount + 1);
            }

            console.log(`❌ Failed to follow user ${userIndex + 1} after ${MAX_RETRIES} attempts`);
            return false;

        } catch (error) {
            console.error(`Error following user ${userIndex + 1}:`, error);
            return false;
        }
    }

    async function startAutoFollow() {
        if (isRunning) return;

        console.log('🚀 Starting auto-follow process...');
        isRunning = true;
        followCount = 0;

        updateButton(`😈❤️ Following...`, true);

        setTimeout(() => {
            if (isRunning) {
                updateButton(`😈❤️ Following...`, true);
                console.log('Button state reinforced');
            }
        }, 100);

        await sleep(50 + Math.random() * 50);

        let processedButtons = new Set();
        let consecutiveNoNewButtons = 0;
        let totalProcessed = 0;

        while (isRunning) {
            const followButtons = findFollowButtons();
            const newButtons = followButtons.filter(btn => !processedButtons.has(btn));

            console.log(`Found ${newButtons.length} new follow buttons (Total processed: ${totalProcessed})`);

            if (newButtons.length === 0) {
                consecutiveNoNewButtons++;
                console.log(`No new buttons found (${consecutiveNoNewButtons}/3)`);

                if (consecutiveNoNewButtons >= 3) {
                    console.log('🏁 Reached end of page - scrolling to load more...');
                    await scrollToBottom();

                    const initialButtons = followButtons.length;
                    await sleep(SCROLL_DELAY / 2);

                    const newFollowButtons = findFollowButtons();
                    if (newFollowButtons.length <= initialButtons) {
                        console.log('🏁 No more content to load - finishing up');
                        break;
                    }
                    consecutiveNoNewButtons = 0;
                    continue;
                }

                await sleep(200);
                continue;
            }

            consecutiveNoNewButtons = 0;

            for (let i = 0; i < newButtons.length; i++) {
                if (!isRunning) {
                    console.log('🛑 Auto-follow stopped by user');
                    break;
                }

                const button = newButtons[i];
                processedButtons.add(button);
                totalProcessed++;

                console.log(`\n--- Processing user ${totalProcessed} ---`);
                const loopStartTime = Date.now();

                await followUser(button, totalProcessed - 1);

                if (i < newButtons.length - 1 && isRunning) {
                    const beforeDelayTime = Date.now();
                    await randomDelay();
                    const afterDelayTime = Date.now();
                    console.log(`🔄 Random delay took ${afterDelayTime - beforeDelayTime}ms`);
                }

                const loopTotalTime = Date.now() - loopStartTime;
                console.log(`🔁 Total loop iteration took ${loopTotalTime}ms`);
            }

            if (!isRunning) break;

            if (newButtons.length < 10) {
                console.log('📜 Scrolling to load more users...');
                await scrollToBottom();
            } else {
                await sleep(50);
            }
        }

        if (isRunning) {
            console.log(`\n🎉 Auto-follow complete! Followed ${followCount} users total`);
            updateButton(`✅ Done! (${followCount} users)`, false);

            setTimeout(() => {
                updateButton('😈❤️ Auto-Follow All', false);
            }, 5000);
        }

        isRunning = false;
    }

    function stopAutoFollow() {
        console.log('🛑 Stopping auto-follow...');
        isRunning = false;

        setTimeout(() => {
            updateButton('😈❤️ Auto-Follow All', false);
        }, 100);
    }

    function init() {
        console.log('Document ready state:', document.readyState);
        createButton();

        console.log('💡 FetLife Auto-Follow Ready!');
        console.log('📍 Navigate to a user\'s followers page and click the red button');
        console.log('⏱️  Speed control: Hover over button to adjust follow speed');
        console.log('📜 Infinite scroll support - will follow ALL users on the page');
        console.log('🔄 Click button again to stop mid-process');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    setTimeout(init, 1000);
    setTimeout(init, 3000);

    console.log('FetLife Auto-Follow script setup complete!');
})();