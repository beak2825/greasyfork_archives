// ==UserScript==
// @name         Dreaming Spanish - Widescreen Layout
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Full widescreen for Dreaming Spanish with keyboard shortcuts ([ and ]), auto-clicker for 'Not now' popups (event-driven), and sidebar toggles.
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

    // --- Constants ---
    const MASTER_TOGGLE_ID = 'ds-widescreen-master-toggle';
    const MASTER_ENABLED_KEY = 'dsWidescreenEnabled';
    const MASTER_ENABLED_CLASS = 'ds-widescreen-active';

    const AUTOCLICK_TOGGLE_ID = 'ds-autoclick-toggle';
    const AUTOCLICK_ENABLED_KEY = 'dsAutoClickEnabled';
    const AUTOCLICK_ACTIVE_CLASS = 'ds-autoclick-active';

    const STYLE_ID = 'ds-widescreen-features-styles-987';
    const LEFT_SIDEBAR_HIDDEN_CLASS = 'ds-widescreen-left-hidden';
    const RIGHT_SIDEBAR_HIDDEN_CLASS = 'ds-widescreen-right-hidden';

    let lastUrl = location.href;
    let popupObserver = null; // Store observer reference

    // --- State Helpers ---
    function isMasterEnabled() { return localStorage.getItem(MASTER_ENABLED_KEY) !== 'false'; }
    function isAutoClickEnabled() { return localStorage.getItem(AUTOCLICK_ENABLED_KEY) !== 'false'; }

    // --- DOM Utilities ---
    function waitForElement(selector, conditionFn = (el) => true) {
        return new Promise(resolve => {
            const element = document.querySelector(selector);
            if (element && conditionFn(element)) return resolve(element);
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
        if (!iframe || !iframe.src || !iframe.src.includes('youtube.com')) return;
        let src = iframe.src;
        if (!src.includes('vq=hd1080')) {
            iframe.src = src + (src.includes('?') ? '&' : '?') + 'vq=hd1080';
            console.log("DS Widescreen: Requested 1080p for YouTube.");
        }
    }

    // --- Keyboard Shortcuts (Global) ---
    function handleKeyboardShortcuts(e) {
        // Ignore if typing in an input box
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        if (e.key === '[') {
            document.getElementById('ds-toggle-left-sidebar')?.click();
        } else if (e.key === ']') {
            document.getElementById('ds-toggle-right-playlist')?.click();
        } else if (e.key === '\\') {
            document.getElementById(MASTER_TOGGLE_ID)?.click();
        }
    }

    // --- Feature Injection ---
    function addFeatures() {
        if (document.getElementById(STYLE_ID)) return;

        GM_addStyle(`
            /* Layout */
            body.${MASTER_ENABLED_CLASS} .ds-page.ds-watch-page { max-width: 100% !important; margin: 0 auto; padding: 0px !important; }
            body.${MASTER_ENABLED_CLASS} .ds-watch-page__sections { gap: 0rem !important; }
            body.${MASTER_ENABLED_CLASS} .ds-video-section { flex: 1 1 auto; min-width: 500px; gap: 0rem !important; }
            body.${MASTER_ENABLED_CLASS} .ds-playlist-section, body.ds-widescreen-active .ds-sidebar-area, body.ds-widescreen-active .ds-content-area { transition: all 0.3s ease-in-out; }
            body.${MASTER_ENABLED_CLASS} .ds-playlist-section { flex: 0 0 340px; overflow: hidden; }

            /* Player Sizing */
            body.${MASTER_ENABLED_CLASS} .ds-video-section__embed,
            body.${MASTER_ENABLED_CLASS} .embed-responsive,
            body.${MASTER_ENABLED_CLASS} .ds-shaka-player { height: 100% !important; width: 100% !important; }

            /* Sidebar Toggles */
            #ds-toggle-left-sidebar, #ds-toggle-right-playlist { position: fixed; top: 50%; transform: translateY(-50%); width: 30px; height: 30px; background-color: #ff9301; color: #000000; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; font-family: monospace; cursor: pointer; z-index: 9999; transition: all 0.3s ease-in-out; user-select: none; border: 2px solid #000000; border-radius: 50%; }
            #ds-toggle-left-sidebar:hover, #ds-toggle-right-playlist:hover { background-color: #ef8301; box-shadow: 0px 0px 8px rgba(0,0,0,0.3); }
            #ds-toggle-left-sidebar { left: calc(var(--sidebar-width, 256px) - 40px); }
            #ds-toggle-left-sidebar::before { content: '<<'; }
            #ds-toggle-right-playlist { right: calc(340px - 40px); }
            #ds-toggle-right-playlist::before { content: '>>'; }

            /* Hidden States */
            body.${LEFT_SIDEBAR_HIDDEN_CLASS} .ds-sidebar-area { transform: translateX(-100%); }
            body.${LEFT_SIDEBAR_HIDDEN_CLASS} .ds-content-area { padding-left: 0 !important; }
            body.${LEFT_SIDEBAR_HIDDEN_CLASS} #ds-toggle-left-sidebar { left: 5px; }
            body.${LEFT_SIDEBAR_HIDDEN_CLASS} #ds-toggle-left-sidebar::before { content: '>>'; }
            body.${RIGHT_SIDEBAR_HIDDEN_CLASS} .ds-playlist-section { flex-basis: 0 !important; min-width: 0 !important; }
            body.${RIGHT_SIDEBAR_HIDDEN_CLASS} #ds-toggle-right-playlist { right: 5px; }
            body.${RIGHT_SIDEBAR_HIDDEN_CLASS} #ds-toggle-right-playlist::before { content: '<<'; }
        `).id = STYLE_ID;

        const leftToggle = document.createElement('div');
        leftToggle.id = 'ds-toggle-left-sidebar';
        leftToggle.title = "Toggle Left Sidebar (Hotkey: [ )";
        leftToggle.onclick = () => {
            const isHidden = document.body.classList.toggle(LEFT_SIDEBAR_HIDDEN_CLASS);
            localStorage.setItem('dsLeftSidebarHidden', isHidden);
        };

        const rightToggle = document.createElement('div');
        rightToggle.id = 'ds-toggle-right-playlist';
        rightToggle.title = "Toggle Playlist (Hotkey: ] )";
        rightToggle.onclick = () => {
            const isHidden = document.body.classList.toggle(RIGHT_SIDEBAR_HIDDEN_CLASS);
            localStorage.setItem('dsRightSidebarHidden', isHidden);
        };

        if (localStorage.getItem('dsLeftSidebarHidden') === 'true') document.body.classList.add(LEFT_SIDEBAR_HIDDEN_CLASS);
        if (localStorage.getItem('dsRightSidebarHidden') === 'true') document.body.classList.add(RIGHT_SIDEBAR_HIDDEN_CLASS);

        document.body.append(leftToggle, rightToggle);
    }

    function removeFeatures() {
        document.getElementById(STYLE_ID)?.remove();
        document.getElementById('ds-toggle-left-sidebar')?.remove();
        document.getElementById('ds-toggle-right-playlist')?.remove();
        document.body.classList.remove(LEFT_SIDEBAR_HIDDEN_CLASS, RIGHT_SIDEBAR_HIDDEN_CLASS);
    }

    // --- Logic Controller ---
    function handlePageChange() {
        const masterToggle = document.getElementById(MASTER_TOGGLE_ID);
        const autoClickToggle = document.getElementById(AUTOCLICK_TOGGLE_ID);
        const isWatchPage = location.href.includes('/watch?');

        if (masterToggle) masterToggle.style.display = isWatchPage ? 'flex' : 'none';
        if (autoClickToggle) autoClickToggle.style.display = (isWatchPage && isMasterEnabled()) ? 'flex' : 'none';

        if (isWatchPage && isMasterEnabled()) {
            waitForElement('.ds-youtube-player, .ds-video-section__embed').then(addFeatures);
            waitForElement('.ds-video-section iframe', (el) => el.src && el.src.includes('youtube.com'))
                .then(setHighQuality).catch(() => {});

            // Start observing for popups
            startPopupObserver();
        } else {
            removeFeatures();
            stopPopupObserver();
        }
    }

    // --- Toggles UI ---
    function addToggleStyles() {
        GM_addStyle(`
            #${MASTER_TOGGLE_ID}, #${AUTOCLICK_TOGGLE_ID} {
                display: none; position: fixed; top: 10px; width: 40px; height: 25px;
                background-color: #d9534f; color: white; align-items: center; justify-content: center;
                font-size: 11px; font-weight: bold; font-family: sans-serif; cursor: pointer;
                z-index: 10001; border-radius: 5px; border: 1px solid #333; user-select: none;
                transition: background-color 0.3s ease;
            }
            #${MASTER_TOGGLE_ID} { left: 10px; }
            #${AUTOCLICK_TOGGLE_ID} { left: 60px; }
            body.${MASTER_ENABLED_CLASS} #${MASTER_TOGGLE_ID}, body.${AUTOCLICK_ACTIVE_CLASS} #${AUTOCLICK_TOGGLE_ID} { background-color: #5cb85c; }
        `);
    }

    function createToggles() {
        // Master Toggle
        const master = document.createElement('div');
        master.id = MASTER_TOGGLE_ID;
        master.onclick = () => {
            const enabled = !isMasterEnabled();
            localStorage.setItem(MASTER_ENABLED_KEY, enabled);
            document.body.classList.toggle(MASTER_ENABLED_CLASS, enabled);
            master.textContent = enabled ? 'ON' : 'OFF';
            master.title = "Master Switch (Hotkey: \\ )";
            handlePageChange();
        };

        // Auto-Click Toggle
        const ac = document.createElement('div');
        ac.id = AUTOCLICK_TOGGLE_ID;
        ac.onclick = () => {
            const enabled = !isAutoClickEnabled();
            localStorage.setItem(AUTOCLICK_ENABLED_KEY, enabled);
            document.body.classList.toggle(AUTOCLICK_ACTIVE_CLASS, enabled);
            ac.title = enabled
                ? 'Auto-Clicker ACTIVE: Clicks "Not now" & resumes video. WARNING: May prevent manual pausing (force resume). Click to disable.'
                : 'Auto-Clicker INACTIVE: Click to enable. WARNING: This feature forces video playback and may interfere with manual pausing.';
        };

        // Init states
        document.body.append(master, ac);
        const masterOn = isMasterEnabled();
        const acOn = isAutoClickEnabled();

        master.textContent = masterOn ? 'ON' : 'OFF';
        ac.textContent = 'AC';
        document.body.classList.toggle(MASTER_ENABLED_CLASS, masterOn);
        document.body.classList.toggle(AUTOCLICK_ACTIVE_CLASS, acOn);

        master.title = "Master Switch (Hotkey: \\ )";
        ac.title = acOn
            ? 'Auto-Clicker ACTIVE: Clicks "Not now" & resumes video. WARNING: May prevent manual pausing (force resume). Click to disable.'
            : 'Auto-Clicker INACTIVE: Click to enable. WARNING: This feature forces video playback and may interfere with manual pausing.';
    }

    // --- Improved Auto-Clicker (MutationObserver) ---
    function startPopupObserver() {
        if (popupObserver) return; // Already running

        popupObserver = new MutationObserver((mutations) => {
            if (!isAutoClickEnabled()) return;

            // Only scan if nodes were added
            const addedNodes = mutations.some(m => m.addedNodes.length > 0);
            if (!addedNodes) return;

            const buttons = document.querySelectorAll('button');
            for (const button of buttons) {
                if (button.innerText && button.innerText.trim().toLowerCase() === 'not now') {
                    console.log("DS Widescreen: Popup detected. Closing...");
                    button.click();

                    // Only force play once, immediately after clicking
                    setTimeout(() => {
                        const video = document.querySelector('video.ds-shaka-player__video');
                        if (video && video.paused) {
                            console.log("DS Widescreen: Resuming video.");
                            video.play();
                        }
                    }, 100);
                    return; // Stop checking
                }
            }
        });

        popupObserver.observe(document.body, { childList: true, subtree: true });
        console.log("DS Widescreen: Popup observer started.");
    }

    function stopPopupObserver() {
        if (popupObserver) {
            popupObserver.disconnect();
            popupObserver = null;
            console.log("DS Widescreen: Popup observer stopped.");
        }
    }

    // --- Initialization ---
    addToggleStyles();
    createToggles();
    handlePageChange();

    // Init Global Keys
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Watch for URL changes (SPA navigation)
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            handlePageChange();
        }
    }).observe(document.body, { childList: true, subtree: true });

})();