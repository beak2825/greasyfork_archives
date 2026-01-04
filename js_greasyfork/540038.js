// ==UserScript==
// @name         FetLife Group Members Auto-Follow
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Automatically follow all members in a FetLife group
// @author       You
// @match        https://fetlife.com/groups/*/members*
// @match        https://www.fetlife.com/groups/*/members*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540038/FetLife%20Group%20Members%20Auto-Follow.user.js
// @updateURL https://update.greasyfork.org/scripts/540038/FetLife%20Group%20Members%20Auto-Follow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('👥 FetLife Group Auto-Follow script loaded!');
    console.log('Current URL:', window.location.href);

    let MIN_DELAY = 10;
    let MAX_DELAY = 50;
    const MAX_RETRIES = 2;
    const TAB_PROCESS_DELAY = 1000; // Time to wait for tab to load

    const SPEED_PRESETS = {
        'fast': { min: 10, max: 50, label: '🚀 Fast' },
        'normal': { min: 100, max: 300, label: '⚖️ Normal' },
        'slow': { min: 500, max: 1500, label: '🐌 Slow' },
        'stealth': { min: 2000, max: 5000, label: '🥷 Stealth' },
        'human': { min: 8000, max: 15000, label: '👤 Human' }
    };

    let followCount = 0;
    let isRunning = false;
    let processedMembers = new Set();
    let currentPage = 1;
    let sessionKey = '';
    let isProcessing = false; // Prevent double execution

    // Session persistence functions
    function saveSessionData() {
        if (!sessionKey) return;
        const data = {
            followCount,
            processedMembers: Array.from(processedMembers),
            isRunning,
            currentPage: getCurrentPageNumber(),
            timestamp: Date.now()
        };
        localStorage.setItem(`fetlife_group_follow_${sessionKey}`, JSON.stringify(data));
        console.log(`💾 Saved session data: ${followCount} follows, page ${data.currentPage}`);
    }

    function loadSessionData() {
        if (!sessionKey) return false;
        const saved = localStorage.getItem(`fetlife_group_follow_${sessionKey}`);
        if (!saved) return false;

        try {
            const data = JSON.parse(saved);
            // Check if session is less than 1 hour old
            if (Date.now() - data.timestamp > 3600000) {
                localStorage.removeItem(`fetlife_group_follow_${sessionKey}`);
                return false;
            }

            followCount = data.followCount || 0;
            processedMembers = new Set(data.processedMembers || []);
            isRunning = data.isRunning || false;
            currentPage = data.currentPage || 1;

            console.log(`📂 Loaded session data: ${followCount} follows, page ${currentPage}`);
            return true;
        } catch (error) {
            console.error('Error loading session data:', error);
            return false;
        }
    }

    function clearSessionData() {
        if (sessionKey) {
            localStorage.removeItem(`fetlife_group_follow_${sessionKey}`);
            console.log('🗑️ Cleared session data');
        }
    }

    function getGroupId() {
        const match = window.location.pathname.match(/\/groups\/(\d+)/);
        return match ? match[1] : 'unknown';
    }

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

    function createButton() {
        console.log('Creating group follow button...');

        const existingBtn = document.getElementById('auto-group-follow-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        const button = document.createElement('div');
        button.id = 'auto-group-follow-btn';
        button.innerHTML = `
            <div class="btn-content">
                <span class="btn-text">👥❤️ Follow All Members</span>
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
            top: 50% !important;
            right: 20px !important;
            transform: translateY(-50%) !important;
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
            #auto-group-follow-btn .btn-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                position: relative;
            }

            #auto-group-follow-btn .btn-text {
                transition: opacity 0.3s ease;
            }

            #auto-group-follow-btn .loading-spinner {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #auto-group-follow-btn .spinner {
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

            #auto-group-follow-btn .pause-btn {
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

            #auto-group-follow-btn .pause-btn:hover {
                background: rgba(229, 62, 62, 0.25) !important;
                border-color: rgba(229, 62, 62, 0.5) !important;
                transform: scale(1.05) !important;
                color: #ff6b6b !important;
            }

            #auto-group-follow-btn .speed-dropdown {
                margin-top: 8px;
                padding: 8px 12px;
                background: rgba(26, 26, 26, 0.95) !important;
                border: 1px solid rgba(64, 64, 64, 0.8) !important;
                border-radius: 8px !important;
                backdrop-filter: blur(10px) !important;
            }

            #auto-group-follow-btn .speed-header {
                color: #e53e3e !important;
                font-size: 11px !important;
                font-weight: 600 !important;
                margin-bottom: 6px !important;
                text-align: center !important;
            }

            #auto-group-follow-btn .speed-select {
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

            #auto-group-follow-btn .speed-select:hover {
                background: rgba(61, 45, 45, 0.9) !important;
                border-color: rgba(229, 62, 62, 0.4) !important;
            }

            #auto-group-follow-btn .speed-select:focus {
                border-color: rgba(229, 62, 62, 0.6) !important;
                box-shadow: 0 0 0 2px rgba(229, 62, 62, 0.1) !important;
            }

            #auto-group-follow-btn .speed-select option {
                background: #2d2d2d !important;
                color: #e53e3e !important;
            }
        `;
        document.head.appendChild(style);

        button.addEventListener('mouseenter', () => {
            if (!isRunning) {
                button.style.background = 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 100%) !important';
                button.style.color = '#ff6b6b !important';
                button.style.transform = 'translateY(-50%) translateY(-2px) scale(1.02)';
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
                button.style.transform = 'translateY(-50%)';
                button.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1) !important';
                button.style.borderColor = '#404040 !important';

                const dropdown = button.querySelector('.speed-dropdown');
                if (dropdown) dropdown.style.display = 'none';
            }
        });

        button.addEventListener('click', function(e) {
            if (e.target.classList.contains('pause-btn')) return;

            console.log('Group follow button clicked!');
            if (isRunning) {
                stopGroupFollow();
            } else {
                startGroupFollow();
            }
        });

        const pauseBtn = button.querySelector('.pause-btn');
        pauseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Pause button clicked!');
            stopGroupFollow();
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
        console.log('Group follow button added to page!');
    }

    function updateButton(text, isActive = false) {
        const button = document.getElementById('auto-group-follow-btn');
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

            if (spinner) {
                spinner.style.setProperty('display', 'flex', 'important');
            }
            if (pauseBtn) {
                pauseBtn.style.setProperty('display', 'block', 'important');
            }

            const dropdown = button.querySelector('.speed-dropdown');
            if (dropdown) dropdown.style.display = 'none';

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
        }
    }

    function getCurrentPageNumber() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('page')) || 1;
    }

    function getProfileLinks() {
        const links = [];

        // Find profile links - they are relative links like /StanleyM
        document.querySelectorAll('a[href^="/"][class*="text-red-500"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('/') && !href.includes('/groups/') && !href.includes('/users/') && href.length > 1) {
                // Make sure it's a full URL and looks like a username (no additional paths)
                const pathOnly = href.split('?')[0]; // Remove query params
                if (!pathOnly.includes('/', 1)) { // No additional slashes after the first one
                    const fullUrl = `https://fetlife.com${pathOnly}`;
                    if (!processedMembers.has(fullUrl)) {
                        links.push(fullUrl);
                        console.log(`Found profile: ${pathOnly} -> ${fullUrl}`);
                    }
                }
            }
        });

        // Fallback: look for any links that look like usernames
        if (links.length === 0) {
            document.querySelectorAll('a[href^="/"]').forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/') && href.length > 1) {
                    const pathOnly = href.split('?')[0];
                    // Check if it looks like a username (no slashes, not a known path)
                    if (!pathOnly.includes('/', 1) &&
                        !pathOnly.includes('groups') &&
                        !pathOnly.includes('users') &&
                        !pathOnly.includes('events') &&
                        !pathOnly.includes('writings') &&
                        pathOnly.match(/^\/[a-zA-Z0-9_-]+$/)) {
                        const fullUrl = `https://fetlife.com${pathOnly}`;
                        if (!processedMembers.has(fullUrl)) {
                            links.push(fullUrl);
                            console.log(`Found profile (fallback): ${pathOnly} -> ${fullUrl}`);
                        }
                    }
                }
            });
        }

        // Remove duplicates
        const uniqueLinks = [...new Set(links)];
        console.log(`Found ${uniqueLinks.length} unique profile links on page ${getCurrentPageNumber()}`);

        return uniqueLinks;
    }

    async function followUserInTab(profileUrl, userIndex) {
        return new Promise((resolve) => {
            console.log(`🔗 Opening profile ${userIndex + 1}: ${profileUrl}`);

            const newTab = window.open(profileUrl, '_blank');

            setTimeout(() => {
                try {
                    // Check if tab loaded and find follow button
                    const followButton = newTab.document.querySelector('button[type="submit"]');
                    const followButtons = newTab.document.querySelectorAll('button');

                    let targetButton = null;
                    for (const btn of followButtons) {
                        if (btn.textContent.trim() === 'Follow') {
                            targetButton = btn;
                            break;
                        }
                    }

                    if (targetButton) {
                        console.log(`👆 Clicking follow button for user ${userIndex + 1}`);
                        targetButton.click();

                        setTimeout(() => {
                            followCount++;
                            console.log(`✅ Successfully followed user ${userIndex + 1} (Total: ${followCount})`);
                            processedMembers.add(profileUrl);
                            saveSessionData(); // Save progress after each follow
                            newTab.close();
                            resolve(true);
                        }, 500);

                    } else {
                        console.log(`❌ No follow button found for user ${userIndex + 1}`);
                        processedMembers.add(profileUrl); // Mark as processed even if no follow button
                        saveSessionData();
                        newTab.close();
                        resolve(false);
                    }

                } catch (error) {
                    console.error(`Error processing user ${userIndex + 1}:`, error);
                    processedMembers.add(profileUrl); // Mark as processed to avoid retry
                    saveSessionData();
                    newTab.close();
                    resolve(false);
                }
            }, TAB_PROCESS_DELAY);
        });
    }

    function hasNextPage() {
        // Look for next page link or pagination
        const nextPageLink = document.querySelector('a[rel="next"]') ||
                           document.querySelector('a[href*="page=' + (getCurrentPageNumber() + 1) + '"]');
        return !!nextPageLink;
    }

    function goToNextPage() {
        const nextPage = getCurrentPageNumber() + 1;
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('page', nextPage);
        window.location.href = currentUrl.toString();
    }

    async function continueGroupFollow() {
        if (isProcessing) {
            console.log('⚠️ Already processing, skipping duplicate call');
            return;
        }

        if (!isRunning) {
            console.log('❌ Session says running but isRunning is false, restarting...');
            isRunning = true;
            saveSessionData();
        }

        isProcessing = true;
        console.log(`🔄 Continuing group follow from page ${getCurrentPageNumber()}, ${followCount} follows completed`);
        updateButton(`👥❤️ Following... (${followCount})`, true);

        await sleep(500);

        try {
            while (isRunning) {
                console.log(`\n📄 Processing page ${getCurrentPageNumber()}...`);

                const profileLinks = getProfileLinks();

                if (profileLinks.length === 0) {
                    console.log('No profile links found on this page');
                    break;
                }

                for (let i = 0; i < profileLinks.length; i++) {
                    if (!isRunning) {
                        console.log('🛑 Group follow stopped by user');
                        break;
                    }

                    const profileUrl = profileLinks[i];
                    console.log(`\n--- Processing member ${i + 1}/${profileLinks.length} ---`);

                    await followUserInTab(profileUrl, i);
                    updateButton(`👥❤️ Following... (${followCount})`, true);

                    if (i < profileLinks.length - 1 && isRunning) {
                        await randomDelay();
                    }
                }

                if (!isRunning) break;

                // Check if there's a next page
                if (hasNextPage()) {
                    console.log(`📄 Moving to next page...`);
                    saveSessionData(); // Save before navigation
                    await sleep(1000); // Wait before navigating
                    isProcessing = false; // Reset before navigation
                    goToNextPage();
                    return; // Script will restart on new page
                } else {
                    console.log('🏁 Reached last page');
                    break;
                }
            }

            if (isRunning) {
                console.log(`\n🎉 Group follow complete! Followed ${followCount} members total`);
                updateButton(`✅ Done! (${followCount} members)`, false);
                clearSessionData(); // Clear data when completely done

                setTimeout(() => {
                    updateButton('👥❤️ Follow All Members', false);
                }, 5000);
            }

            isRunning = false;
            saveSessionData();
        } finally {
            isProcessing = false;
        }
    }

    async function startGroupFollow() {
        if (isRunning || isProcessing) {
            console.log('⚠️ Already running or processing, ignoring click');
            return;
        }

        console.log('👥 Starting group members auto-follow process...');
        isRunning = true;
        saveSessionData(); // Save that we're running

        updateButton(`👥❤️ Following... (${followCount})`, true);

        await continueGroupFollow();
    }

    function stopGroupFollow() {
        console.log('🛑 Stopping group follow...');
        isRunning = false;
        isProcessing = false;
        saveSessionData();

        setTimeout(() => {
            updateButton('👥❤️ Follow All Members', false);
        }, 100);
    }

    function init() {
        console.log('Document ready state:', document.readyState);

        // Only show button on group members pages
        if (window.location.pathname.includes('/groups/') && window.location.pathname.includes('/members')) {
            sessionKey = getGroupId(); // Set session key based on group ID

            // Try to load existing session data
            const hasSession = loadSessionData();

            createButton();

            if (hasSession && isRunning) {
                console.log(`🔄 Resuming session: ${followCount} follows completed, page ${getCurrentPageNumber()}`);
                updateButton(`👥❤️ Following... (${followCount})`, true);

                // Resume the process immediately but prevent user clicks during auto-resume
                setTimeout(() => {
                    if (!isProcessing) { // Only resume if not already processing
                        continueGroupFollow();
                    }
                }, 2000); // Longer delay to ensure page is fully loaded
            } else if (hasSession) {
                console.log(`📋 Previous session found: ${followCount} follows completed`);
                updateButton(`👥❤️ Continue (${followCount} done)`, false);
            }

            console.log('💡 FetLife Group Auto-Follow Ready!');
            console.log('📍 Navigate to a group members page and click the button');
            console.log('⏱️  Speed control: Hover over button to adjust follow speed');
            console.log('📄 Pagination support - will follow ALL members across all pages');
            console.log('🔄 Click button again to stop mid-process');
            console.log('💾 Progress is automatically saved and will resume on page changes');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    setTimeout(init, 1000);
    setTimeout(init, 3000);

    console.log('FetLife Group Auto-Follow script setup complete!');
})();