// ==UserScript==
// @name         FetLife Auto-Unfollow
// @namespace    https://violentmonkey.github.io/
// @version      1.1
// @description  Automatically unfollow all users on a FetLife following page
// @author       You
// @match        https://fetlife.com/*
// @match        https://www.fetlife.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540016/FetLife%20Auto-Unfollow.user.js
// @updateURL https://update.greasyfork.org/scripts/540016/FetLife%20Auto-Unfollow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('💔 FetLife Auto-Unfollow script loaded!');
    console.log('Current URL:', window.location.href);

    let MIN_DELAY = 10;
    let MAX_DELAY = 50;
    const MAX_RETRIES = 2;
    const SCROLL_DELAY = 500;

    const SPEED_PRESETS = {
        'fast': { min: 10, max: 50, label: '🚀 Fast' },
        'normal': { min: 100, max: 300, label: '⚖️ Normal' },
        'slow': { min: 500, max: 1500, label: '🐌 Slow' },
        'stealth': { min: 2000, max: 5000, label: '🥷 Stealth' },
        'human': { min: 8000, max: 15000, label: '👤 Human' }
    };

    let unfollowCount = 0;
    let isRunning = false;

    function getRandomDelay() {
        return Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function randomDelay() {
        const delay = getRandomDelay();
        console.log(`💤 Waiting ${delay.toFixed(0)}ms before next unfollow...`);
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
        console.log('Creating unfollow button...');

        const existingBtn = document.getElementById('auto-unfollow-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        const button = document.createElement('div');
        button.id = 'auto-unfollow-btn';
        button.innerHTML = `
            <div class="btn-content">
                <span class="btn-text">💔❌ Auto-Unfollow All</span>
                <div class="loading-spinner" style="display: none;">
                    <div class="spinner"></div>
                </div>
                <button class="pause-btn" style="display: none;" title="Pause">⏸️</button>
            </div>
            <div class="speed-dropdown" style="display: none;">
                <div class="speed-header">Unfollow Speed:</div>
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
            bottom: 20px !important;
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
            #auto-unfollow-btn .btn-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                position: relative;
            }

            #auto-unfollow-btn .btn-text {
                transition: opacity 0.3s ease;
            }

            #auto-unfollow-btn .loading-spinner {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #auto-unfollow-btn .spinner {
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

            #auto-unfollow-btn .pause-btn {
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

            #auto-unfollow-btn .pause-btn:hover {
                background: rgba(229, 62, 62, 0.25) !important;
                border-color: rgba(229, 62, 62, 0.5) !important;
                transform: scale(1.05) !important;
                color: #ff6b6b !important;
            }

            #auto-unfollow-btn .speed-dropdown {
                margin-top: 8px;
                padding: 8px 12px;
                background: rgba(26, 26, 26, 0.95) !important;
                border: 1px solid rgba(64, 64, 64, 0.8) !important;
                border-radius: 8px !important;
                backdrop-filter: blur(10px) !important;
            }

            #auto-unfollow-btn .speed-header {
                color: #e53e3e !important;
                font-size: 11px !important;
                font-weight: 600 !important;
                margin-bottom: 6px !important;
                text-align: center !important;
            }

            #auto-unfollow-btn .speed-select {
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

            #auto-unfollow-btn .speed-select:hover {
                background: rgba(61, 45, 45, 0.9) !important;
                border-color: rgba(229, 62, 62, 0.4) !important;
            }

            #auto-unfollow-btn .speed-select:focus {
                border-color: rgba(229, 62, 62, 0.6) !important;
                box-shadow: 0 0 0 2px rgba(229, 62, 62, 0.1) !important;
            }

            #auto-unfollow-btn .speed-select option {
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

            console.log('Unfollow button clicked!');
            if (isRunning) {
                stopAutoUnfollow();
            } else {
                startAutoUnfollow();
            }
        });

        const pauseBtn = button.querySelector('.pause-btn');
        pauseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Pause button clicked!');
            stopAutoUnfollow();
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
        console.log('Unfollow button added to page!');
    }

    function updateButton(text, isActive = false) {
        const button = document.getElementById('auto-unfollow-btn');
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

            const dropdown = button.querySelector('.speed-dropdown');
            if (dropdown) dropdown.style.display = 'none';

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

    function findFollowingButtons() {
        const dropdowns = [];

        // Find all "Following" dropdown buttons
        document.querySelectorAll('button').forEach(btn => {
            const span = btn.querySelector('span');
            if (span && span.textContent.trim() === 'Following') {
                // Make sure it's the dropdown type with an arrow
                const svg = btn.querySelector('svg');
                if (svg) {
                    dropdowns.push(btn);
                }
            }
        });

        console.log(`Found ${dropdowns.length} following dropdown buttons`);
        return dropdowns;
    }

    async function unfollowUser(dropdownButton, userIndex, retryCount = 0) {
        try {
            const span = dropdownButton.querySelector('span');
            const buttonText = span ? span.textContent.trim() : dropdownButton.textContent.trim();

            if (buttonText !== 'Following') {
                console.log(`Button ${userIndex + 1}: Not a following button (Current: "${buttonText}")`);
                return false;
            }

            console.log(`👆 Opening dropdown for user ${userIndex + 1}...`);

            // Step 1: Click the dropdown button to open the menu
            dropdownButton.focus();
            await sleep(10 + Math.random() * 15);
            dropdownButton.click();

            // Wait for dropdown to appear
            await sleep(150 + Math.random() * 100);

            // Step 2: Find the unfollow option in ALL dropdown menus that appeared
            let unfollowLink = null;

            // Method 1: Look for visible dropdown boxes
            const visibleDropdowns = document.querySelectorAll('.dropdown-box[data-dropdown][style*="display: block"], .dropdown-box[data-dropdown]:not([style*="display: none"])');
            console.log(`Found ${visibleDropdowns.length} visible dropdown boxes`);

            for (const dropdown of visibleDropdowns) {
                const links = dropdown.querySelectorAll('a.dropdown-menu-entry');
                for (const link of links) {
                    if (link.textContent.toLowerCase().includes('unfollow')) {
                        unfollowLink = link;
                        console.log(`Found unfollow link: "${link.textContent.trim()}"`);
                        break;
                    }
                }
                if (unfollowLink) break;
            }

            // Method 2: If no visible dropdowns found, look for any unfollow links
            if (!unfollowLink) {
                const allUnfollowLinks = document.querySelectorAll('a[href="#0"]');
                for (const link of allUnfollowLinks) {
                    if (link.textContent.toLowerCase().includes('unfollow') &&
                        link.classList.contains('dropdown-menu-entry')) {
                        unfollowLink = link;
                        console.log(`Found unfollow link (method 2): "${link.textContent.trim()}"`);
                        break;
                    }
                }
            }

            // Method 3: Look for any element containing "Unfollow" text
            if (!unfollowLink) {
                const allElements = document.querySelectorAll('*');
                for (const element of allElements) {
                    if (element.textContent.toLowerCase().includes('unfollow') &&
                        element.tagName === 'A' &&
                        element.getAttribute('href') === '#0') {
                        unfollowLink = element;
                        console.log(`Found unfollow link (method 3): "${element.textContent.trim()}"`);
                        break;
                    }
                }
            }

            if (!unfollowLink) {
                console.log(`❌ Could not find unfollow option for user ${userIndex + 1}`);
                console.log('Available dropdown content:');
                visibleDropdowns.forEach((dropdown, idx) => {
                    console.log(`Dropdown ${idx}: ${dropdown.textContent}`);
                });
                return false;
            }

            console.log(`👆 Clicking unfollow: "${unfollowLink.textContent.trim()}" for user ${userIndex + 1}...`);
            unfollowLink.click();

            // Wait to see if unfollow was successful
            await sleep(200 + Math.random() * 150);

            // Check if the dropdown button is gone or changed (successful unfollow)
            const stillExists = document.body.contains(dropdownButton);
            const newText = dropdownButton.querySelector('span')?.textContent?.trim();

            if (!stillExists || newText !== 'Following' || dropdownButton.style.display === 'none') {
                unfollowCount++;
                console.log(`✅ Successfully unfollowed user ${userIndex + 1} (Total: ${unfollowCount})`);
                return true;
            }

            if (retryCount < MAX_RETRIES) {
                console.log(`⚠️ Retry ${retryCount + 1} for user ${userIndex + 1}`);
                await sleep(300 + Math.random() * 200);
                return await unfollowUser(dropdownButton, userIndex, retryCount + 1);
            }

            console.log(`❌ Failed to unfollow user ${userIndex + 1} after ${MAX_RETRIES} attempts`);
            return false;

        } catch (error) {
            console.error(`Error unfollowing user ${userIndex + 1}:`, error);
            return false;
        }
    }

    async function startAutoUnfollow() {
        if (isRunning) return;

        console.log('💔 Starting auto-unfollow process...');
        isRunning = true;
        unfollowCount = 0;

        updateButton(`💔❌ Unfollowing...`, true);

        setTimeout(() => {
            if (isRunning) {
                updateButton(`💔❌ Unfollowing...`, true);
                console.log('Button state reinforced');
            }
        }, 100);

        await sleep(50 + Math.random() * 50);

        let processedButtons = new Set();
        let consecutiveNoNewButtons = 0;
        let totalProcessed = 0;

        while (isRunning) {
            const followingButtons = findFollowingButtons();
            const newButtons = followingButtons.filter(btn => !processedButtons.has(btn));

            console.log(`Found ${newButtons.length} new following buttons (Total processed: ${totalProcessed})`);

            if (newButtons.length === 0) {
                consecutiveNoNewButtons++;
                console.log(`No new buttons found (${consecutiveNoNewButtons}/3)`);

                if (consecutiveNoNewButtons >= 3) {
                    console.log('🏁 Reached end of page - scrolling to load more...');
                    await scrollToBottom();

                    const initialButtons = followingButtons.length;
                    await sleep(SCROLL_DELAY / 2);

                    const newFollowingButtons = findFollowingButtons();
                    if (newFollowingButtons.length <= initialButtons) {
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
                    console.log('🛑 Auto-unfollow stopped by user');
                    break;
                }

                const button = newButtons[i];
                processedButtons.add(button);
                totalProcessed++;

                console.log(`\n--- Processing user ${totalProcessed} ---`);

                await unfollowUser(button, totalProcessed - 1);

                if (i < newButtons.length - 1 && isRunning) {
                    await randomDelay();
                }
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
            console.log(`\n🎉 Auto-unfollow complete! Unfollowed ${unfollowCount} users total`);
            updateButton(`✅ Done! (${unfollowCount} unfollowed)`, false);

            setTimeout(() => {
                updateButton('💔❌ Auto-Unfollow All', false);
            }, 5000);
        }

        isRunning = false;
    }

    function stopAutoUnfollow() {
        console.log('🛑 Stopping auto-unfollow...');
        isRunning = false;

        setTimeout(() => {
            updateButton('💔❌ Auto-Unfollow All', false);
        }, 100);
    }

    function init() {
        console.log('Document ready state:', document.readyState);
        createButton();

        console.log('💡 FetLife Auto-Unfollow Ready!');
        console.log('📍 Navigate to your following page and click the red button');
        console.log('⏱️  Speed control: Hover over button to adjust unfollow speed');
        console.log('📜 Infinite scroll support - will unfollow ALL users on the page');
        console.log('🔄 Click button again to stop mid-process');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    setTimeout(init, 1000);
    setTimeout(init, 3000);

    console.log('FetLife Auto-Unfollow script setup complete!');
})();