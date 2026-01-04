// ==UserScript==
// @name           Universal Auto Scroll
// @version        4.0
// @namespace      MedX-AA
// @author         MedX
// @license        MIT
// @description    Press Alt + X to start auto-scroll or increase speed. X to pause/resume, Space / Esc to stop. Use Up/Down to adjust speed. Page Up/Down work normally during scroll/pause. Mouse Up/Down pauses during scroll and work normally during pause.
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABGUlEQVR4nO3VsS4EURQG4E9oRCEh0ZDQi3gDjV7lHXTeAYVo9gl0ahregEapoKEh0SFRbVbIyiSjEYnd2TtzZ5PzJSeZYjbzn/2LQwghlSN8oP/PFO8caqHeAOF/pni3dfpDTuvEArlFA7lFA7lFA7lFA7lFA7lFA7lFA7lFA7m1uoE9dCuErDrd8pvJvDYYvl/OS8oFOhkW6KRcYBKnDYY/x5TEpnHZQPhrzKjJLG5qDH+LOTVbxGMN4Z+xrCGreEsY/h3rGraR6Db0sCmTLXyOEP4L2zLbGWGBXS1xUCH8vhaZwPEQ4U/K37RKca3PBgh/UceVTXmtr3Jd2VTmcfdH+HssGBNLePp1ZVeMmTU8lP988RxCkN43yek7CExEuggAAAAASUVORK5CYII=
// @grant          none
// @include        *
// @exclude       *://*.facebook.com/*
// @exclude       *://*.messenger.com/*
// @exclude       *://*.instagram.com/*
// @exclude       *://*.youtube.com/embed/*
// @exclude       *://*.tiktok.com/*
// @exclude       *://*.netflix.com/*
// @exclude       *://*.hulu.com/*
// @exclude       *://*.disneyplus.com/*
// @exclude       *://*.primevideo.com/*
// @exclude       *://*.spotify.com/*
// @exclude       *://music.youtube.com/*
// @exclude       *://*.twitch.tv/*
// @exclude       *://*.google.com/maps*
// @exclude       *://*.docs.google.com/*
// @exclude       *://*.drive.google.com/*
// @exclude       *://*.mail.google.com/*
// @exclude       *://*.outlook.live.com/*
// @exclude       *://*.teams.microsoft.com/*
// @exclude       *://*.web.whatsapp.com/*
// @exclude       *://*.slack.com/*
// @exclude       *://*.figma.com/*
// @exclude       *://*.canva.com/*
// @exclude       *://*.photos.google.com/*
// @exclude       *.pdf
// @downloadURL https://update.greasyfork.org/scripts/527062/Universal%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/527062/Universal%20Auto%20Scroll.meta.js
// ==/UserScript==

// === CONFIGURATION ===
const INITIAL_SPEED = 30;
const SPEED_MULTIPLIER = 2.0;
const SLOWDOWN_MULTIPLIER = 0.5;

const START_KEY = 88; // Alt + X
const PAUSE_KEY = 88; // X
const STOP_KEYS = new Set([27, 32]);
const SCROLL_DOWN_KEYS = new Set([40]);
const SCROLL_UP_KEYS = new Set([38]);
const PAGE_KEYS = new Set([33, 34]);

let isScrolling = false, isPaused = false, scrollSpeed = 0, lastUpdateTime, realY;
const scrollElement = document.scrollingElement || document.documentElement;
let hudTimeout;

// === HUD ===
const hud = Object.assign(document.createElement("div"), {
    style: `position:fixed; bottom:10px; right:10px; padding:5px 10px; background:rgba(0,0,0,0.7);
            color:#fff; font-size:14px; font-family:Arial; border-radius:5px; z-index:9999; display:none`
});
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => document.body.appendChild(hud));
} else {
    document.body.appendChild(hud);
}

// === KEYDOWN HANDLER ===
window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.shiftKey) return;

    // Avoid interfering with input fields or editable elements
    const el = e.target;
    if (el && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName))) return;

    if (e.keyCode === START_KEY && e.altKey) {
        e.preventDefault();
        isScrolling ? changeSpeed(SPEED_MULTIPLIER) : startScrolling();
    } else if (isScrolling) {
        if (e.keyCode === PAUSE_KEY) {
            e.preventDefault();
            togglePause();
        } else if (STOP_KEYS.has(e.keyCode)) {
            e.preventDefault();
            stopScrolling();
        } else if (SCROLL_DOWN_KEYS.has(e.keyCode)) {
            e.preventDefault();
            changeSpeed(SPEED_MULTIPLIER);
        } else if (SCROLL_UP_KEYS.has(e.keyCode)) {
            e.preventDefault();
            changeSpeed(SLOWDOWN_MULTIPLIER);
        } else if (PAGE_KEYS.has(e.keyCode)) {
            realY = scrollElement.scrollTop;
        }
    } else if (isPaused) {
        if (PAGE_KEYS.has(e.keyCode) || SCROLL_DOWN_KEYS.has(e.keyCode) || SCROLL_UP_KEYS.has(e.keyCode)) {
            realY = scrollElement.scrollTop;
        } else if (e.keyCode === PAUSE_KEY) {
            togglePause();
        } else if (STOP_KEYS.has(e.keyCode)) {
            e.preventDefault();
            stopScrolling();
        }
    }
}, false);

// === WHEEL HANDLER ===
window.addEventListener('wheel', (e) => {
    if (isScrolling) {
        e.preventDefault();
        isPaused = true;
        updateHUD();
    } else {
        realY = scrollElement.scrollTop;
    }
}, { passive: false });

// === SCROLL TRACKING ===
window.addEventListener('scroll', () => {
    if (isPaused || isScrolling) {
        realY = scrollElement.scrollTop;
    }
}, { passive: true });

// === PAUSE / RESUME ===
const togglePause = () => {
    isPaused = !isPaused;
    updateHUD();
    if (!isPaused) {
        lastUpdateTime = performance.now();
        requestAnimationFrame(scrollLoop);
    }
};

// === SPEED CHANGE ===
const changeSpeed = (multiplier) => {
    scrollSpeed = Math.max(5, scrollSpeed * multiplier);
    updateHUD();
};

// === START ===
const startScrolling = () => {
    isScrolling = true;
    isPaused = false;
    scrollSpeed = INITIAL_SPEED;
    realY = scrollElement.scrollTop;
    lastUpdateTime = performance.now();
    updateHUD();
    requestAnimationFrame(scrollLoop);
};

// === STOP ===
const stopScrolling = () => {
    isScrolling = isPaused = false;
    scrollSpeed = 0;
    hud.style.display = "none";
};

// === SCROLL LOOP ===
const scrollLoop = (timestamp) => {
    if (!isScrolling || isPaused) return;
    realY += (scrollSpeed * (timestamp - lastUpdateTime)) / 1000;
    scrollElement.scrollTop = Math.floor(realY);
    lastUpdateTime = timestamp;
    requestAnimationFrame(scrollLoop);
};

// === HUD UPDATE ===
const updateHUD = () => {
    hud.textContent = isPaused
        ? `PAUSED (Speed: ${scrollSpeed.toFixed(1)} px/s)`
        : `Speed: ${scrollSpeed.toFixed(1)} px/s`;
    hud.style.display = "block";
    clearTimeout(hudTimeout);
    if (!isPaused) hudTimeout = setTimeout(() => (hud.style.display = "none"), 2000);
};
