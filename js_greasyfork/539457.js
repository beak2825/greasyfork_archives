// ==UserScript==
// @name         Dreaming Spanish - Widescreen Layout
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Makes the video player fill the available space for both YouTube and Shaka players, requests 1080p quality for YouTube, with toggles to hide/show sidebars, and automatically clicks the 'Not now' button on popups, ensuring playback resumes.
// @author       OthorWight
// @match        https://www.dreamingspanish.com/*
// @match        https://app.dreaming.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539457/Dreaming%20Spanish%20-%20Widescreen%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/539457/Dreaming%20Spanish%20-%20Widescreen%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MASTER_TOGGLE_ID = 'ds-widescreen-master-toggle';
    const MASTER_ENABLED_KEY = 'dsWidescreenEnabled';
    const MASTER_ENABLED_CLASS = 'ds-widescreen-active';

    const STYLE_ID = 'ds-widescreen-features-styles-987';
    const LEFT_SIDEBAR_HIDDEN_CLASS = 'ds-widescreen-left-hidden';
    const RIGHT_SIDEBAR_HIDDEN_CLASS = 'ds-widescreen-right-hidden';

    let lastUrl = location.href;

    function isMasterEnabled() {
        return localStorage.getItem(MASTER_ENABLED_KEY) !== 'false';
    }

    function waitForElement(selector, conditionFn = (el) => true) {
        return new Promise(resolve => {
            const element = document.querySelector(selector);
            if (element && conditionFn(element)) {
                return resolve(element);
            }
            const observer = new MutationObserver(() => {
                const targetElement = document.querySelector(selector);
                if (targetElement && conditionFn(targetElement)) {
                    observer.disconnect();
                    resolve(targetElement);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    function setHighQuality(iframe) {
        // This function specifically targets YouTube iframes
        if (!iframe || !iframe.src || !iframe.src.includes('youtube.com')) return;

        let src = iframe.src;
        if (!src.includes('vq=hd1080')) {
            iframe.src = src + (src.includes('?') ? '&' : '?') + 'vq=hd1080';
            console.log("DS Widescreen Script: Requested 1080p quality for YouTube player.");
        }
    }

    function addFeatures() {
        if (document.getElementById(STYLE_ID)) return;
        console.log("DS Widescreen Script: Applying features to watch page.");

        GM_addStyle(`
            /* Main layout adjustments */
            body.${MASTER_ENABLED_CLASS} .ds-page.ds-watch-page { max-width: 100% !important; margin: 0 auto; padding: 0px !important; }
            body.${MASTER_ENABLED_CLASS} .ds-watch-page__sections { gap: 0rem !important; }
            body.${MASTER_ENABLED_CLASS} .ds-video-section { flex: 1 1 auto; min-width: 500px; gap: 0rem !important; }
            body.${MASTER_ENABLED_CLASS} .ds-playlist-section, body.ds-widescreen-active .ds-sidebar-area, body.ds-widescreen-active .ds-content-area { transition: all 0.3s ease-in-out; }
            body.${MASTER_ENABLED_CLASS} .ds-playlist-section { flex: 0 0 340px; overflow: hidden; }

            /* New Shaka Player Support */
            body.${MASTER_ENABLED_CLASS} .ds-video-section__embed,
            body.${MASTER_ENABLED_CLASS} .embed-responsive,
            body.${MASTER_ENABLED_CLASS} .ds-shaka-player {
                height: 100% !important;
                width: 100% !important;
            }

            /* Sidebar toggle buttons */
            #ds-toggle-left-sidebar, #ds-toggle-right-playlist { position: fixed; top: 50%; transform: translateY(-50%); width: 30px; height: 30px; background-color: #ff9301; color: #000000; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; font-family: monospace; cursor: pointer; z-index: 9999; transition: all 0.3s ease-in-out; user-select: none; border: 2px solid #000000; border-radius: 50%; }
            #ds-toggle-left-sidebar:hover, #ds-toggle-right-playlist:hover { background-color: #ef8301; box-shadow: 0px 0px 8px rgba(0,0,0,0.3); }
            #ds-toggle-left-sidebar::after, #ds-toggle-right-playlist::after { content: 'Hide'; position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%); background-color: #222; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-family: sans-serif; white-space: nowrap; opacity: 0; visibility: hidden; transition: opacity 0.2s, visibility 0.2s; pointer-events: none; }
            #ds-toggle-left-sidebar:hover::after, #ds-toggle-right-playlist:hover::after { opacity: 1; visibility: visible; }
            #ds-toggle-left-sidebar { left: calc(var(--sidebar-width, 256px) - 40px); }
            #ds-toggle-left-sidebar::before { content: '<<'; }
            #ds-toggle-right-playlist { right: calc(340px - 40px); }
            #ds-toggle-right-playlist::before { content: '>>'; }

            /* Hidden states for sidebars */
            body.${LEFT_SIDEBAR_HIDDEN_CLASS} .ds-sidebar-area { transform: translateX(-100%); }
            body.${LEFT_SIDEBAR_HIDDEN_CLASS} .ds-content-area { padding-left: 0 !important; }
            body.${LEFT_SIDEBAR_HIDDEN_CLASS} #ds-toggle-left-sidebar { left: 5px; }
            body.${LEFT_SIDEBAR_HIDDEN_CLASS} #ds-toggle-left-sidebar::before { content: '>>'; }
            body.${LEFT_SIDEBAR_HIDDEN_CLASS} #ds-toggle-left-sidebar::after { content: 'Show'; }
            body.${RIGHT_SIDEBAR_HIDDEN_CLASS} .ds-playlist-section { flex-basis: 0 !important; min-width: 0 !important; }
            body.${RIGHT_SIDEBAR_HIDDEN_CLASS} #ds-toggle-right-playlist { right: 5px; }
            body.${RIGHT_SIDEBAR_HIDDEN_CLASS} #ds-toggle-right-playlist::before { content: '<<'; }
            body.${RIGHT_SIDEBAR_HIDDEN_CLASS} #ds-toggle-right-playlist::after { content: 'Show'; }
        `).id = STYLE_ID;

        const leftToggleButton = document.createElement('div');
        leftToggleButton.id = 'ds-toggle-left-sidebar';
        leftToggleButton.addEventListener('click', () => {
            const isHidden = document.body.classList.toggle(LEFT_SIDEBAR_HIDDEN_CLASS);
            localStorage.setItem('dsLeftSidebarHidden', isHidden);
        });

        const rightToggleButton = document.createElement('div');
        rightToggleButton.id = 'ds-toggle-right-playlist';
        rightToggleButton.addEventListener('click', () => {
            const isHidden = document.body.classList.toggle(RIGHT_SIDEBAR_HIDDEN_CLASS);
            localStorage.setItem('dsRightSidebarHidden', isHidden);
        });

        if (localStorage.getItem('dsLeftSidebarHidden') === 'true') document.body.classList.add(LEFT_SIDEBAR_HIDDEN_CLASS);
        if (localStorage.getItem('dsRightSidebarHidden') === 'true') document.body.classList.add(RIGHT_SIDEBAR_HIDDEN_CLASS);

        document.body.append(leftToggleButton, rightToggleButton);
    }

    function removeFeatures() {
        const styleTag = document.getElementById(STYLE_ID);
        if (styleTag) styleTag.remove();

        const leftBtn = document.getElementById('ds-toggle-left-sidebar');
        if (leftBtn) leftBtn.remove();
        const rightBtn = document.getElementById('ds-toggle-right-playlist');
        if (rightBtn) rightBtn.remove();

        document.body.classList.remove(LEFT_SIDEBAR_HIDDEN_CLASS, RIGHT_SIDEBAR_HIDDEN_CLASS);
        console.log("DS Widescreen Script: Features removed.");
    }

    function handlePageChange() {
        const masterToggle = document.getElementById(MASTER_TOGGLE_ID);
        if (!masterToggle) return;

        const isWatchPage = location.href.includes('/watch?');
        masterToggle.style.display = isWatchPage ? 'flex' : 'none';

        if (isWatchPage) {
            if (isMasterEnabled()) {
                // Look for either the old YouTube player or the new Shaka player embed container
                waitForElement('.ds-youtube-player, .ds-video-section__embed').then(addFeatures);

                // This part only affects the old YouTube player, it will be ignored by the new one
                const iframeSelector = '.ds-video-section iframe';
                const iframeCondition = (el) => el.src && el.src.includes('youtube.com');
                waitForElement(iframeSelector, iframeCondition).then(setHighQuality).catch(() => {
                    console.log("DS Widescreen Script: YouTube player not found, skipping HD quality request.");
                });

            } else {
                removeFeatures();
            }
        } else {
            removeFeatures();
        }
    }

    function addMasterToggleStyles() {
        GM_addStyle(`
            #${MASTER_TOGGLE_ID} {
                display: none; position: fixed; top: 10px; left: 10px;
                width: 40px; height: 25px; background-color: #d9534f;
                color: white; align-items: center; justify-content: center;
                font-size: 11px; font-weight: bold; font-family: sans-serif;
                cursor: pointer; z-index: 10001; border-radius: 5px;
                border: 1px solid #333; user-select: none; transition: background-color 0.3s ease;
            }
            body.${MASTER_ENABLED_CLASS} #${MASTER_TOGGLE_ID} {
                background-color: #5cb85c;
            }
        `);
    }

    function createMasterToggle() {
        const toggleButton = document.createElement('div');
        toggleButton.id = MASTER_TOGGLE_ID;

        const updateButtonState = (enabled) => {
            document.body.classList.toggle(MASTER_ENABLED_CLASS, enabled);
            toggleButton.textContent = enabled ? 'ON' : 'OFF';
            toggleButton.title = enabled ? 'Click to disable Widescreen features' : 'Click to enable Widescreen features';
        };

        toggleButton.addEventListener('click', () => {
            const currentlyEnabled = isMasterEnabled();
            localStorage.setItem(MASTER_ENABLED_KEY, !currentlyEnabled);
            updateButtonState(!currentlyEnabled);
            handlePageChange();
        });

        document.body.appendChild(toggleButton);
        updateButtonState(isMasterEnabled());
    }

    // --- Auto-click "Not now" button & Resume Playback ---
    function autoClickNotNow() {
        const checkInterval = 2000; // Check every 2 seconds

        setInterval(() => {
            if (!isMasterEnabled()) return;
            const buttons = document.querySelectorAll('button');
            for (const button of buttons) {
                if (button.innerText && button.innerText.trim().toLowerCase() === 'not now') {
                    console.log("DS Widescreen Script: 'Not now' button found. Clicking it automatically.");
                    button.click();

                    setTimeout(() => {
                        const videoElement = document.querySelector('video.ds-shaka-player__video');
                        if (videoElement && videoElement.paused) {
                            console.log("DS Widescreen Script: Video is paused after popup, resuming playback.");
                            videoElement.play();
                        }
                    }, 100);
                }
            }
        }, checkInterval);
    }

    // --- Script Initialization ---
    addMasterToggleStyles();
    createMasterToggle();

    const bodyObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            handlePageChange();
        }
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    handlePageChange();

    autoClickNotNow();

})();
