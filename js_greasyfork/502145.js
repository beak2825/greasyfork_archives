// ==UserScript==
// @name         Twitch Seeking
// @namespace    https://greasyfork.org/users/45933
// @version      0.5.3
// @author       Fizzfaldt
// @description  Keyboard shortcuts to seek more easily in Twitch VODs
// @run-at       document-idle
// @grant        none
// @noframes
// @match        *://*.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502145/Twitch%20Seeking.user.js
// @updateURL https://update.greasyfork.org/scripts/502145/Twitch%20Seeking.meta.js
// ==/UserScript==

// Useful things:
//&& e.altKey
//&& e.shiftKey
//&& e.ctrlKey

var player;
var seek;
var enabled = false;
var seekPopup;
var movePopup;

// --- Popup Timing Variables ---
// Duration (in milliseconds) that the popup remains fully visible before fading out
var POPUP_DURATION = 1000;
// Fade-out duration in milliseconds
var FADEOUT_DURATION = 250;

// Helper: Get the current container (full screen element if active, else document.body)
function getPopupContainer() {
    return document.fullscreenElement || document.body;
}

// Helper: If popup is not in the current container, reattach it.
function reattachPopup(popup) {
    const container = getPopupContainer();
    if (popup.parentElement !== container) {
        popup.remove();
        container.appendChild(popup);
    }
}

// Listen for fullscreen changes to reattach popups if needed.
document.addEventListener("fullscreenchange", () => {
    if (seekPopup) reattachPopup(seekPopup);
    if (movePopup) reattachPopup(movePopup);
});

// by chatgpt
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.padStart(4, "0")}`;
}

// by chatgpt
function createSeekPopup() {
    seekPopup = document.createElement("div");
    seekPopup.style.position = "fixed";
    seekPopup.style.top = "10px";
    seekPopup.style.left = "50%";
    seekPopup.style.transform = "translateX(-50%)";
    seekPopup.style.padding = "10px 20px";
    seekPopup.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    seekPopup.style.color = "white";
    seekPopup.style.fontSize = "18px";
    seekPopup.style.borderRadius = "5px";
    seekPopup.style.zIndex = "10000";
    // No transition for fade-in; will set fade-out later.
    seekPopup.style.transition = "none";
    seekPopup.style.opacity = "0";
    getPopupContainer().appendChild(seekPopup);
}

// by chatgpt
function createMovePopup() {
    movePopup = document.createElement("div");
    movePopup.style.position = "fixed";
    movePopup.style.top = "50px";
    movePopup.style.left = "50%";
    movePopup.style.transform = "translateX(-50%)";
    movePopup.style.padding = "10px 20px";
    movePopup.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    movePopup.style.color = "white";
    movePopup.style.fontSize = "18px";
    movePopup.style.borderRadius = "5px";
    movePopup.style.zIndex = "10000";
    movePopup.style.transition = "none";
    movePopup.style.opacity = "0";
    getPopupContainer().appendChild(movePopup);
}

function showChangeSeekPopup() {
    if (!seekPopup) {
        createSeekPopup();
    } else {
        reattachPopup(seekPopup);
    }
    seekPopup.textContent = `Seek: ${seek}s`;
    // Instant fade-in:
    seekPopup.style.transition = "none";
    seekPopup.style.opacity = "1";
    setTimeout(() => {
        // Fade out using configured duration:
        seekPopup.style.transition = `opacity ${FADEOUT_DURATION}ms ease-out`;
        seekPopup.style.opacity = "0";
    }, POPUP_DURATION);
}

function showSeekPopup(amount, direction, targetTime) {
    if (!seekPopup) {
        createSeekPopup();
    } else {
        reattachPopup(seekPopup);
    }
    const symbol = direction === "forward" ? ">>" : "<<";
    const formattedTime = formatTime(targetTime);
    seekPopup.textContent = `${symbol} ${amount}s to ${formattedTime}`;
    // Instant fade-in:
    seekPopup.style.transition = "none";
    seekPopup.style.opacity = "1";
    setTimeout(() => {
        // Fade out:
        seekPopup.style.transition = `opacity ${FADEOUT_DURATION}ms ease-out`;
        seekPopup.style.opacity = "0";
    }, POPUP_DURATION);
}

function showMovePopup(targetTime, percentage) {
    if (!movePopup) {
        createMovePopup();
    } else {
        reattachPopup(movePopup);
    }
    const formattedTime = formatTime(targetTime);
    movePopup.textContent = `${formattedTime} (${percentage}%)`;
    // Instant fade-in:
    movePopup.style.transition = "none";
    movePopup.style.opacity = "1";
    setTimeout(() => {
        // Fade out:
        movePopup.style.transition = `opacity ${FADEOUT_DURATION}ms ease-out`;
        movePopup.style.opacity = "0";
    }, POPUP_DURATION);
}

function ensure_player() {
    'use strict';
    if (!player) {
        console.log("Finding video player for seeking");
        player = document.querySelector('video');
        if (!player) {
            alert("Failed to initialize video player for seeking");
            return;
        }
    }
    if (!player) {
        alert("Video player lost after initializations");
        return;
    }
}

function ensure_seeking() {
    'use strict';
    ensure_player();
    if (typeof(player.currentTime) !== 'number') {
        alert("Cannot find current time in player");
        return;
    }
}

function ensure_percent_seeking() {
    'use strict';
    ensure_seeking();
    if (typeof(player.duration) !== 'number') {
        alert("Cannot find duration in player");
        return;
    }
}

function increase_seek() {
    'use strict';
    ensure_player();
    const increases = {
           1 :    5,
           5 :   10,
          10 :   30,
          30 :   60,
          60 :  300,
         300 :  600,
         600 : 1800,
        1800 : 3600,
        3600 : 3600,
    };
    if (seek in increases) {
        seek = increases[seek];
    } else {
        alert("Cannot find " + seek + " in increase dictionary");
        seek = 60;
    }
    console.log("Seek amount is now " + seek);
    showChangeSeekPopup();
}

function decrease_seek() {
    'use strict';
    ensure_player();
    const decreases = {
           1 :    1,
           5 :    1,
          10 :    5,
          30 :   10,
          60 :   30,
         300 :   60,
         600 :  300,
        1800 :  600,
        3600 : 1800,
    };
    if (seek in decreases) {
        seek = decreases[seek];
    } else {
        alert("Cannot find " + seek + " in decrease dictionary");
        seek = 60;
    }
    console.log("Seek amount is now " + seek);
    showChangeSeekPopup();
}

function seek_forwards() {
    'use strict';
    ensure_seeking();
    const before = player.currentTime;
    const targetTime = Math.min(before + seek, player.duration - 1.0);
    console.log(`Seeking ${seek} seconds forward from ${formatTime(before)} to ${formatTime(targetTime)}`);
    player.currentTime = targetTime;
    showSeekPopup(seek, "forward", targetTime);
}

function seek_backwards() {
    'use strict';
    ensure_seeking();
    const before = player.currentTime;
    const targetTime = Math.max(before - seek, 0.001); // Hack cause it doesn't like 0 for some reason
    console.log(`Seeking ${seek} seconds backward from ${formatTime(before)} to ${formatTime(targetTime)}`);
    player.currentTime = targetTime;
    showSeekPopup(seek, "backward", targetTime);
}

function seek_percent(n) {
    'use strict';
    ensure_percent_seeking();
    const targetTime = Math.max(player.duration * n * 0.1, 0.001); // Hack cause it doesn't like 0 for some reason
    const percentage = n * 10;
    player.currentTime = targetTime;
    showMovePopup(targetTime, percentage);
}

function seek_callback(e) {
    'use strict';
    if (!enabled) {
        return;
    }
    if (!e.ctrlKey) {
        return;
    }
    if (e.shiftKey) {
        switch (e.code) {
            case "ArrowUp":
                increase_seek();
                break;
            case "ArrowDown":
                decrease_seek();
                break;
            case "Digit0":
            case "Digit1":
            case "Digit2":
            case "Digit3":
            case "Digit4":
            case "Digit5":
            case "Digit6":
            case "Digit7":
            case "Digit8":
            case "Digit9":
                seek_percent(Number(e.code[5]));
                break;
            default:
                break;
        }
    } else {
        switch (e.code) {
            case "ArrowRight":
                seek_forwards();
                break;
            case "ArrowLeft":
                seek_backwards();
                break;
            default:
                break;
        }
    }
}

function enable_twitch_seeking() {
    player = null;
    seek = 60; // default seek amount
    enabled = true;
    document.addEventListener('keyup', seek_callback, false);
    console.log("enabling twitch seeking for " + window.location);
}

function disable_twitch_seeking() {
    player = null;
    seek = 60;
    enabled = false;
    document.removeEventListener('keyup', seek_callback, false);
    console.log("disabling twitch seeking for " + window.location);
}


// @match        *://*.twitch.tv/video/*
// @match        *://*.twitch.tv/videos/*
// @match        *://*.twitch.tv/*/video/*
// @match        *://*.twitch.tv/*/videos/*
// @match        *://*.twitch.tv/clip/*
// @match        *://*.twitch.tv/*/clip/*
// @match        *://clips.twitch.tv/*
function handleNavigate() {
    const pathname = window.location.pathname;

    const hostname = window.location.hostname;


    // Define regular expressions for each pattern
    const matchPatterns = [
        // Matches "/video[s]/*"
        /^\/videos?\//,

        // Matches "/<user>/video[s]/*"
        /^\/[^/]+\/videos?\//,

        // Matches "/clip[s]/*"
        /^\/clips?\//,

        // Matches "/<user>/clip[s]/*"
        /^\/[^/]+\/clips?\//,
    ];
    const isTwitchMatch = matchPatterns.some(pattern => pattern.test(pathname));
    const isClipMatch = hostname === 'clips.twitch.tv';
    if (isTwitchMatch || isClipMatch) {
        enable_twitch_seeking();
    } else {
        disable_twitch_seeking();
    }
}

(function() {
    'use strict';
    handleNavigate();
    /* Prioritize navigation api if it exists. As of 2024-12-13 this does not work in firefox
     * See
     * https://developer.mozilla.org/en-US/docs/Web/API/Navigation/navigatesuccess_event#browser_compatibility
     * and
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1777171
     */
    if (self.navigation) {
        self.navigation.addEventListener('navigatesuccess', handleNavigate);
    } else {
        let u = location.href;
        new MutationObserver(() => u !== (u = location.href) && handleNavigate())
            .observe(document, {subtree: true, childList: true});
    }
})();