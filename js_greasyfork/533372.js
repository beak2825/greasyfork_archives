// ==UserScript==
// @name               Twitter (X) & YouTube Refresh with Scroll Top/Bottom
// @name:zh-CN         Twitter & YouTube v1
// @namespace          https://gist.github.com/4lrick/bedb39b069be0e4c94dc20214137c9f5
// @version            2.58
// @description        Adds circular buttons with '顶' (top) and '底' (bottom) text, centered on gradient background, for scrolling to page top/bottom. On Twitter (X), top button scrolls up, shows ring animation, and reliably refreshes timeline by simulating home button click and verifying content update
// @description:zh-CN  添加圆形按钮，显示“顶”和“底”文字，居中于渐变背景，滚动到页面顶部/底部。Twitter (X) 首页点击“顶”按钮滚动顶部、显示圆环动画并通过模拟主页按钮点击和验证
// @author             jiang
// @match              https://x.com/*
// @match              https://www.youtube.com/*
// @match              https://m.youtube.com/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @license            GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/533372/Twitter%20%28X%29%20%20YouTube%20Refresh%20with%20Scroll%20TopBottom.user.js
// @updateURL https://update.greasyfork.org/scripts/533372/Twitter%20%28X%29%20%20YouTube%20Refresh%20with%20Scroll%20TopBottom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent duplicate script execution
    const key = encodeURIComponent('RefreshAndScroll:执行判断');
    if (window[key]) { return; }
    window[key] = true;

    try {
        // Twitter (X) refresh interval configuration
        let refreshInterval = GM_getValue('refreshInterval', 5);
        let menuCommandId = null;

        // Display a loading spinner animation
        function showSpinner() {
            const spinner = document.createElement('div');
            spinner.id = 'refresh-spinner';
            spinner.innerHTML = `
                <div class="neon-ring"></div>
                <div class="neon-ring inner-ring" style="animation-delay: 0.1s;"></div>
                <div class="spark"></div>
                <div class="spark" style="animation-delay: 0.2s; transform: rotate(90deg);"></div>
                <div class="spark" style="animation-delay: 0.4s; transform: rotate(180deg);"></div>
                <div class="spark" style="animation-delay: 0.6s; transform: rotate(270deg);"></div>
            `;
            spinner.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100px;
                height: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;
            document.body.appendChild(spinner);
            return spinner;
        }

        // Remove the spinner animation
        function hideSpinner(spinner) {
            if (spinner) spinner.remove();
        }

        // Refresh Twitter (X) timeline
        function refreshTimeline() {
            if (window.location.href.startsWith('https://x.com/home')) {
                // Expanded selectors for Twitter home button
                const refreshButton = document.querySelector(
                    '[href="/home"], [aria-label*="Home"], [data-testid="AppTabBar_Home_Link"], ' +
                    '[role="link"][href="/home"], [aria-label*="Timeline"], [data-testid*="home"], ' +
                    '[aria-label="Home timeline"], a[href="/home"]'
                );
                if (refreshButton) {
                    const spinner = showSpinner();
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    // Store initial top tweet ID to verify refresh
                    const initialTopTweet = document.querySelector('article[data-testid="tweet"]');
                    const initialTweetId = initialTopTweet ? initialTopTweet.querySelector('a[href*="/status/"]')?.href : null;

                    // Simulate click to refresh timeline
                    refreshButton.click();

                    // Verify content update
                    let attempts = 0;
                    const maxAttempts = 5;
                    const checkInterval = setInterval(() => {
                        const newTopTweet = document.querySelector('article[data-testid="tweet"]');
                        const newTweetId = newTopTweet ? newTopTweet.querySelector('a[href*="/status/"]')?.href : null;

                        if (newTweetId && newTweetId !== initialTweetId || attempts >= maxAttempts) {
                            clearInterval(checkInterval);
                            hideSpinner(spinner);
                        } else {
                            // Retry click if no update
                            refreshButton.click();
                            attempts++;
                        }
                    }, 1000);
                } else {
                    console.log('RefreshAndScroll: Refresh button not found');
                    const spinner = showSpinner();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setTimeout(() => hideSpinner(spinner), 1500);
                }
            }
        }

        // Refresh non-Twitter pages (including YouTube)
        function refreshPage() {
            const spinner = showSpinner();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const reloadPromise = new Promise((resolve) => {
                window.addEventListener('load', resolve, { once: true });
                window.location.reload();
            });
            reloadPromise.then(() => {
                setTimeout(() => hideSpinner(spinner), 100);
            });
        }

        // YouTube preloading and layout logic
        function customizeYouTubeLayout() {
            if (!window.location.href.startsWith('https://www.youtube.com/') && !window.location.href.startsWith('https://m.youtube.com/')) return;

            // Preloading logic
            const preloadThreshold = window.innerHeight * 2; // Two screen heights
            let isLoading = false;

            const scrollHandler = () => {
                if (isLoading) return;

                const scrollPosition = window.scrollY + window.innerHeight;
                const pageHeight = document.documentElement.scrollHeight;

                if (pageHeight - scrollPosition < preloadThreshold) {
                    isLoading = true;
                    const lastVideo = document.querySelector('ytd-rich-item-renderer:last-of-type:not([is-shorts])') ||
                                     document.querySelector('ytd-video-renderer:last-of-type:not([is-shorts])') ||
                                     document.querySelector('ytd-grid-video-renderer:last-of-type:not([is-shorts])');
                    if (lastVideo) {
                        lastVideo.scrollIntoView({ behavior: 'instant' });
                        window.dispatchEvent(new Event('scroll'));
                        setTimeout(() => window.dispatchEvent(new Event('scroll')), 100);
                        setTimeout(() => window.dispatchEvent(new Event('scroll')), 200);
                        const observer = new MutationObserver(() => {
                            isLoading = false;
                            observer.disconnect();
                        });
                        const target = document.querySelector('#contents') || document.body;
                        observer.observe(target, { childList: true, subtree: true });
                        setTimeout(() => {
                            if (isLoading) {
                                isLoading = false;
                                observer.disconnect();
                            }
                        }, 5000);
                    } else {
                        isLoading = false;
                    }
                }
            };

            let isThrottled = false;
            window.addEventListener('scroll', () => {
                if (!isThrottled) {
                    isThrottled = true;
                    scrollHandler();
                    setTimeout(() => { isThrottled = false; }, 200);
                }
            });

            // Video layout and Shorts removal logic
            const style = document.createElement('style');
            style.textContent = `
                #contents.ytd-rich-grid-renderer {
                    display: grid !important;
                    grid-template-columns: repeat(auto-fill, minmax(50%, 1fr)) !important;
                    gap: 10px !important;
                    padding: 10px !important;
                    box-sizing: border-box !important;
                }
                ytd-rich-item-renderer:not([is-shorts]), ytd-video-renderer:not([is-shorts]), ytd-grid-video-renderer:not([is-shorts]) {
                    height: ${window.innerHeight / 4}px !important;
                    margin: 0 !important;
                    overflow: hidden !important;
                    border-radius: 8px !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                }
                ytd-rich-item-renderer:not([is-shorts]):nth-child(3n), ytd-video-renderer:not([is-shorts]):nth-child(3n), ytd-grid-video-renderer:not([is-shorts]):nth-child(3n) {
                    grid-column: span 2 !important;
                    width: 100% !important;
                }
                ytd-rich-item-renderer:not([is-shorts]) #thumbnail, ytd-video-renderer:not([is-shorts]) #thumbnail, ytd-grid-video-renderer:not([is-shorts]) #thumbnail {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                }
                ytd-rich-item-renderer:not([is-shorts]) #details, ytd-video-renderer:not([is-shorts]) #details, ytd-grid-video-renderer:not([is-shorts]) #details {
                    display: none !important;
                }
                /* Shorts removal */
                ytd-reel-shelf-renderer,
                ytd-rich-shelf-renderer[is-shorts],
                ytd-shorts,
                ytd-reel-item-renderer,
                ytd-rich-item-renderer[is-shorts],
                ytd-video-renderer[is-shorts],
                ytd-grid-video-renderer[is-shorts],
                ytd-guide-entry-renderer:has(a[href*="/shorts"]),
                ytd-mini-guide-entry-renderer:has(a[href*="/shorts"]),
                ytm-pivot-bar-item-renderer:has(.pivot-shorts),
                ytm-pivot-bar-item-renderer[tab-identifier="FEshorts"],
                ytd-guide-entry-renderer:has([title="Shorts"]),
                ytd-mini-guide-entry-renderer:has([title="Shorts"]),
                ytm-rich-item-renderer:has([data-style="SHORTS"]),
                ytm-reel-shelf-renderer,
                ytm-rich-section-renderer:has(ytm-reel-shelf-renderer),
                #chips-wrapper yt-chip-cloud-chip-renderer[chip-style*="STYLE_HOME_FILTER"]:has(a[href*="/shorts"]),
                ytd-rich-section-renderer:has(#rich-shelf-header:contains("Shorts")),
                ytd-item-section-renderer:has([overlay-style="SHORTS"]),
                ytd-browse[page-subtype="shorts"],
                ytd-rich-grid-row:empty,
                #contents.ytd-rich-grid-row:empty {
                    display: none !important;
                }
                /* Fix grid layout after removing Shorts */
                ytd-rich-grid-row, #contents.ytd-rich-grid-row {
                    display: contents !important;
                }
            `;
            document.head.appendChild(style);

            // Apply layout and remove Shorts dynamically
            const applyLayoutAndRemoveShorts = () => {
                // Apply video layout
                const contents = document.querySelector('#contents.ytd-rich-grid-renderer');
                if (contents) {
                    contents.style.display = 'grid';
                    const videos = document.querySelectorAll('ytd-rich-item-renderer:not([is-shorts]), ytd-video-renderer:not([is-shorts]), ytd-grid-video-renderer:not([is-shorts])');
                    videos.forEach((video, index) => {
                        video.style.height = `${window.innerHeight / 4}px`;
                        if ((index + 1) % 3 === 0) {
                            video.style.gridColumn = 'span 2';
                            video.style.width = '100%';
                        } else {
                            video.style.gridColumn = 'auto';
                            video.style.width = 'auto';
                        }
                    });
                }

                // Remove Shorts elements
                const shortsSelectors = [
                    'ytd-reel-shelf-renderer',
                    'ytd-rich-shelf-renderer[is-shorts]',
                    'ytd-shorts',
                    'ytd-reel-item-renderer',
                    'ytd-rich-item-renderer[is-shorts]',
                    'ytd-video-renderer[is-shorts]',
                    'ytd-grid-video-renderer[is-shorts]',
                    'ytd-guide-entry-renderer:has(a[href*="/shorts"])',
                    'ytd-mini-guide-entry-renderer:has(a[href*="/shorts"])',
                    'ytm-pivot-bar-item-renderer:has(.pivot-shorts)',
                    'ytm-pivot-bar-item-renderer[tab-identifier="FEshorts"]',
                    'ytd-guide-entry-renderer:has([title="Shorts"])',
                    'ytd-mini-guide-entry-renderer:has([title="Shorts"])',
                    'ytm-rich-item-renderer:has([data-style="SHORTS"])',
                    'ytm-reel-shelf-renderer',
                    'ytm-rich-section-renderer:has(ytm-reel-shelf-renderer)',
                    '#chips-wrapper yt-chip-cloud-chip-renderer[chip-style*="STYLE_HOME_FILTER"]:has(a[href*="/shorts"])',
                    'ytd-rich-section-renderer:has(#rich-shelf-header:contains("Shorts"))',
                    'ytd-item-section-renderer:has([overlay-style="SHORTS"])',
                    'ytd-browse[page-subtype="shorts"]'
                ];
                const shortsElements = document.querySelectorAll(shortsSelectors.join(','));
                shortsElements.forEach(el => el.remove());

                // Clean up empty grid rows
                const emptyRows = document.querySelectorAll('ytd-rich-grid-row:empty, #contents.ytd-rich-grid-row:empty');
                emptyRows.forEach(row => row.remove());
            };

            // Observe DOM changes to reapply layout and Shorts removal
            const observer = new MutationObserver(() => {
                applyLayoutAndRemoveShorts();
            });
            const target = document.body;
            observer.observe(target, { childList: true, subtree: true });

            // Redirect /shorts/ URLs to /watch?v=
            const redirectShorts = () => {
                if (window.location.href.includes('youtube.com/shorts/')) {
                    const newUrl = window.location.href.replace('/shorts/', '/watch?v=');
                    window.location.replace(newUrl);
                }
            };
            redirectShorts();
            window.addEventListener('popstate', redirectShorts);

            // Initial application
            applyLayoutAndRemoveShorts();
        }

        // Set custom refresh interval for Twitter (X)
        function setCustomInterval() {
            const newInterval = prompt("Enter refresh interval in seconds:", refreshInterval);
            if (newInterval !== null) {
                const parsedInterval = parseInt(newInterval);
                if (!isNaN(parsedInterval) && parsedInterval > 0) {
                    refreshInterval = parsedInterval;
                    GM_setValue('refreshInterval', refreshInterval);
                    updateMenuCommand();
                } else {
                    alert("Please enter a valid positive number.");
                }
            }
        }

        // Update the menu command for refresh interval
        function updateMenuCommand() {
            if (menuCommandId) {
                GM_unregisterMenuCommand(menuCommandId);
            }
            menuCommandId = GM_registerMenuCommand(`Set Refresh Interval (current: ${refreshInterval}s)`, setCustomInterval);
        }

        // Scroll to top or bottom with conditional refresh
        function scrollToPosition(y, isTopButton = false) {
            window.scrollTo({ top: y, behavior: 'smooth' });
            if (y === 0) {
                if (window.location.href.startsWith('https://x.com/home')) {
                    setTimeout(() => refreshTimeline(), 500);
                } else if (isTopButton) {
                    setTimeout(() => refreshPage(), 500);
                }
            }
        }

        // Create a visual click effect
        function createClickEffect(x, y) {
            const effect = document.createElement('div');
            effect.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 10px;
                height: 10px;
                background: transparent;
                border: 2px solid #00ff88;
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                animation: shockwave 0.5s ease-out forwards;
                box-shadow: 0 0 10px #00ccff, 0 0 20px #00ff88;
            `;
            document.body.appendChild(effect);
            setTimeout(() => effect.remove(), 500);
        }

        // Inject CSS styles for buttons and animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            @keyframes shockwave {
                0% {
                    transform: scale(1);
                    opacity: 1;
                    border-width: 2px;
                }
                100% {
                    transform: scale(10);
                    opacity: 0;
                    border-width: 0;
                }
            }
            @keyframes neonPulse {
                0% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                    box-shadow: 0 0 10px #00ff88, 0 0 20px #00ccff;
                }
                50% {
                    transform: scale(1.2) rotate(180deg);
                    opacity: 0.8;
                    box-shadow: 0 0 20px #00ff88, 0 0 40px #00ccff;
                }
                100% {
                    transform: scale(1) rotate(360deg);
                    opacity: 1;
                    box-shadow: 0 0 10px #00ff88, 0 0 20px #00ccff;
                }
            }
            @keyframes sparkBurst {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(20px, 20px) scale(0);
                    opacity: 0;
                }
            }
            .neon-ring {
                position: absolute;
                width: 80px;
                height: 80px;
                border: 4px solid transparent;
                border-top-color: #00ff88;
                border-right-color: #00ccff;
                border-radius: 50%;
                animation: neonPulse 1.5s linear infinite;
            }
            .inner-ring {
                width: 60px;
                height: 60px;
                border-top-color: #00ccff;
                border-right-color: #00ff88;
                animation-direction: reverse;
            }
            .spark {
                position: absolute;
                width: 8px;
                height: 8px;
                background: #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 10px #00ff88, 0 0 15px #00ccff;
                animation: sparkBurst 1.5s ease-out infinite;
            }
            #sky-scrolltop, #sky-scrolltbtm {
                font-family: 'Microsoft YaHei', 'Arial', sans-serif !important;
                font-style: normal;
                font-weight: 700;
                font-size: 16px;
                line-height: 48px !important;
                text-align: center !important;
                background: linear-gradient(135deg, #00ff88, #00ccff) !important;
                border-radius: 50% !important;
                width: 48px !important;
                height: 48px !important;
                color: #ffffff !important;
                cursor: pointer;
                position: fixed;
                z-index: 999999;
                user-select: none;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                animation: pulse 2s infinite;
                visibility: visible !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
            }
            #sky-scrolltop:hover, #sky-scrolltbtm:hover {
                transform: scale(1.15);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
            }
            #sky-scrolltop:active, #sky-scrolltbtm:active {
                transform: scale(0.95);
            }
            #sky-scrolltop.editing, #sky-scrolltbtm.editing {
                background: linear-gradient(135deg, #ff4444, #ff8888) !important;
                animation: none;
            }
        `;
        document.head.appendChild(style);

        // Create scroll buttons for top and bottom navigation
        const scrollTop = document.createElement('div');
        scrollTop.id = 'sky-scrolltop';
        scrollTop.innerText = '顶';
        scrollTop.setAttribute('data-text', '顶');
        scrollTop.style.visibility = 'visible';
        document.body.appendChild(scrollTop);
        console.log('RefreshAndScroll: Created top button with text:', scrollTop.innerText);

        const scrollBottom = document.createElement('div');
        scrollBottom.id = 'sky-scrolltbtm';
        scrollBottom.innerText = '底';
        scrollBottom.setAttribute('data-text', '底');
        scrollBottom.style.visibility = 'visible';
        document.body.appendChild(scrollBottom);
        console.log('RefreshAndScroll: Created bottom button with text:', scrollBottom.innerText);

        // Periodically check and restore button text
        setInterval(() => {
            const topButton = document.querySelector('#sky-scrolltop');
            const bottomButton = document.querySelector('#sky-scrolltbtm');
            if (topButton && topButton.innerText !== '顶') {
                console.error('RefreshAndScroll: Top button text missing, restoring...');
                topButton.innerText = topButton.getAttribute('data-text') || '顶';
            }
            if (bottomButton && bottomButton.innerText !== '底') {
                console.error('RefreshAndScroll: Bottom button text missing, restoring...');
                bottomButton.innerText = bottomButton.getAttribute('data-text') || '底';
            }
        }, 1000);

        // Initialize button positions
        let positions = GM_getValue('buttonPositions', { left: '20px', topBottom: '20%', bottomBottom: '12%' });
        scrollTop.style.left = positions.left;
        scrollTop.style.bottom = positions.topBottom;
        scrollBottom.style.left = positions.left;
        scrollBottom.style.bottom = positions.bottomBottom;

        // Position editing logic
        let isEditing = false;
        let startX, startY, initialLeft, initialBottomTop;
        const fixedSpacing = 60;

        // Start editing button positions on long press
        function startEditing(e) {
            e.preventDefault();
            isEditing = true;
            scrollTop.classList.add('editing');
            scrollBottom.classList.add('editing');
            startX = e.clientX || (e.touches && e.touches[0].clientX);
            startY = e.clientY || (e.touches && e.touches[0].clientY);
            initialLeft = parseFloat(scrollTop.style.left) || 20;
            initialBottomTop = parseFloat(scrollTop.style.bottom) || (window.innerHeight * 0.20);
            document.addEventListener('contextmenu', preventDefault, { capture: true });
            document.addEventListener('touchstart', preventDefault, { capture: true, passive: false });
        }

        // Move buttons during editing mode
        function moveButtons(e) {
            if (!isEditing) return;
            e.preventDefault();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            if (!clientX || !clientY) return;

            const deltaX = clientX - startX;
            const deltaY = startY - clientY;

            const buttonWidth = 48;
            const buttonHeight = 48;
            let newLeft = initialLeft + deltaX;
            let newBottomTop = initialBottomTop + deltaY;
            let newBottomBtm = newBottomTop - fixedSpacing;

            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - buttonWidth));
            newBottomTop = Math.max(fixedSpacing, Math.min(newBottomTop, window.innerHeight - buttonHeight));
            newBottomBtm = newBottomTop - fixedSpacing;

            if (newBottomBtm >= 0) {
                scrollTop.style.left = `${newLeft}px`;
                scrollTop.style.bottom = `${newBottomTop}px`;
                scrollBottom.style.left = `${newLeft}px`;
                scrollBottom.style.bottom = `${newBottomBtm}px`;
            }
        }

        // Stop editing and save positions
        function stopEditing(e) {
            if (!isEditing) return;
            e.preventDefault();
            isEditing = false;
            scrollTop.classList.remove('editing');
            scrollBottom.classList.remove('editing');
            positions = {
                left: scrollTop.style.left,
                topBottom: scrollTop.style.bottom,
                bottomBottom: scrollBottom.style.bottom
            };
            GM_setValue('buttonPositions', positions);
            document.removeEventListener('contextmenu', preventDefault, { capture: true });
            document.removeEventListener('touchstart', preventDefault, { capture: true });
        }

        // Prevent default browser actions during editing
        function preventDefault(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // Long-press detection for editing mode
        let longPressTimer;
        const longPressDuration = 300;

        function handleLongPressStart(e) {
            clearTimeout(longPressTimer);
            longPressTimer = setTimeout(() => startEditing(e), longPressDuration);
        }

        function handleLongPressCancel() {
            clearTimeout(longPressTimer);
        }

        // Attach event listeners to buttons
        scrollTop.addEventListener('mousedown', handleLongPressStart);
        scrollTop.addEventListener('touchstart', handleLongPressStart, { passive: false });
        scrollTop.addEventListener('mouseup', handleLongPressCancel);
        scrollTop.addEventListener('mouseleave', handleLongPressCancel);
        scrollTop.addEventListener('touchend', handleLongPressCancel);
        scrollTop.addEventListener('click', (e) => {
            if (!isEditing) {
                const rect = scrollTop.getBoundingClientRect();
                createClickEffect(rect.left + rect.width / 2, rect.top + rect.height / 2);
                scrollToPosition(0, true);
            }
        });

        scrollBottom.addEventListener('mousedown', handleLongPressStart);
        scrollBottom.addEventListener('touchstart', handleLongPressStart, { passive: false });
        scrollBottom.addEventListener('mouseup', handleLongPressCancel);
        scrollBottom.addEventListener('mouseleave', handleLongPressCancel);
        scrollBottom.addEventListener('touchend', handleLongPressCancel);
        scrollBottom.addEventListener('click', (e) => {
            if (!isEditing) {
                const rect = scrollBottom.getBoundingClientRect();
                createClickEffect(rect.left + rect.width / 2, rect.top + rect.height / 2);
                scrollToPosition(document.body.scrollHeight);
            }
        });

        // Global event listeners for button movement
        document.addEventListener('mousemove', moveButtons);
        document.addEventListener('touchmove', moveButtons, { passive: false });
        document.addEventListener('mouseup', stopEditing);
        document.addEventListener('touchend', stopEditing);

        // Initialize Twitter (X) menu command
        if (window.location.href.startsWith('https://x.com/')) {
            updateMenuCommand();
        }

        // Initialize YouTube customizations
        customizeYouTubeLayout();
    } catch (err) {
        console.log('RefreshAndScroll:', err);
    }
})();