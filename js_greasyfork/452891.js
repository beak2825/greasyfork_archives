// ==UserScript==
// @name         Crunchyroll Auto Skip Intro/Outro, Fullscreen Video & Mouse Volume Control
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      5.1
// @description  Automatically clicks the Skip Intro button on Crunchyroll.com when available and makes the video fullscreen
// @author       JRem
// @match        https://*.crunchyroll.com/watch/*
// @match        https://static.crunchyroll.com/vilos-v2/web/vilos/player.html
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452891/Crunchyroll%20Auto%20Skip%20IntroOutro%2C%20Fullscreen%20Video%20%20Mouse%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/452891/Crunchyroll%20Auto%20Skip%20IntroOutro%2C%20Fullscreen%20Video%20%20Mouse%20Volume%20Control.meta.js
// ==/UserScript==

////////////////////////
// USER CUSTOMIZATION //
////////////////////////
// 1 = Enabled / 0 = Disabled
const enableFullscreen=1;
const enableSkipIntro=1;
const enableSkipCredits=1;
const enableVolumeControl=1;
// Volume +/- percentage
const volumePercentage = 5; // Default 5, Set the percentage of volume change (+/-)
// Volume Control Disable/Bypass
const holdDisableKey = 'Alt'; // Key to temporarily disable while being pressed (e.g., 'h')
const disableKey = 'Shift'; // Key to completely disable the event listener (e.g., 'd')
// Global user settings for toast appearance and positioning
const toastSettings = {
    toastPositionX: '45', // Default='45' (LeftCenter), Range '0' to '100' on the X axis
    toastPositionY: '0', // Default='0' (Top), Range '0' to '100' on the Y axis
    fontSize: '16px', // Font size for the toast message
    fontFamily: 'Arial, sans-serif', // Font family for the toast message
    backgroundColor: '#333', // Background color for the toast
    textColor: 'white', // Text color for the toast
    padding: '10px', // Padding around the toast text
    margin: '5px', // Margin between toasts
    borderRadius: '5px', // Border radius for rounded corners
    toastDuration: 3500, // Duration to display the toast (in ms)
    fadeDuration: 300, // Duration of the fade-in/out animation (in ms)
};

// Function to show or update toast message
function showToast(message) {
    // Create a toast container if it doesn't already exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);

        // Add styles for the toast container
        console.log(`transform: translateX(${toastSettings.toastPositionX}%);`);
        console.log(`transform: translateY(${toastSettings.toastPositionY}%);`);
        const style = document.createElement('style');
        style.innerHTML = `
            #toast-container {
                position: fixed;
                z-index: 9999;
                ${toastSettings.position}: 10px;
                ${toastSettings.align}: 50%;
                transform: translateX(${toastSettings.toastPositionX}vw);
                max-width: 90%;
                pointer-events: none; /* Prevent interaction with toasts */
            }
            .toast {
                background-color: ${toastSettings.backgroundColor};
                color: ${toastSettings.textColor};
                padding: ${toastSettings.padding};
                margin: ${toastSettings.margin};
                border-radius: ${toastSettings.borderRadius};
                font-family: ${toastSettings.fontFamily};
                font-size: ${toastSettings.fontSize};
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                opacity: 0;
                transform: translateY(${toastSettings.toastPositionY}vh);
                animation: fadeIn ${toastSettings.fadeDuration / 1000}s forwards, fadeOut 3s forwards ${toastSettings.toastDuration / 1000 - toastSettings.fadeDuration / 1000}s;
            }
            @keyframes fadeIn {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes fadeOut {
                to {
                    opacity: 0;
                    transform: translateY(20px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Function to update toast position (reverts to the original fixed position)
    function updateToastPosition() {
        // Restore the toast position as fixed on the screen
        toastContainer.style.left = ''; // Let it use the default position from toastSettings
        toastContainer.style.top = ''; // Let it use the default position from toastSettings
        toastContainer.style.width = ''; // Use max-width as defined
        toastContainer.style.height = ''; // Default height
    }

    // Update position on fullscreen change
    document.addEventListener('fullscreenchange', updateToastPosition);
    document.addEventListener('webkitfullscreenchange', updateToastPosition); // for Safari
    document.addEventListener('mozfullscreenchange', updateToastPosition); // for Firefox
    document.addEventListener('msfullscreenchange', updateToastPosition); // for IE/Edge

    // Update position initially (restores the default fixed positioning)
    updateToastPosition();

    // Check if there's an existing toast being displayed
    let currentToast = toastContainer.querySelector('.toast');
    if (currentToast) {
        // If a toast is already visible, update its text content
        currentToast.textContent = message;
        // Reset the animation so that the toast updates instantly
        currentToast.style.animation = 'none';
        currentToast.offsetHeight; // Trigger reflow to restart animation
        currentToast.style.animation = `fadeIn ${toastSettings.fadeDuration / 1000}s forwards, fadeOut 3s forwards ${toastSettings.toastDuration / 1000 - toastSettings.fadeDuration / 1000}s`;
    } else {
        // If no toast is visible, create a new toast
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        toastContainer.appendChild(toast);
    }

    // Remove the toast after the duration is finished
    setTimeout(() => {
        if (currentToast) {
            toastContainer.removeChild(currentToast);
        }
    }, toastSettings.toastDuration);
}


// Fullscreen CSS Edit
if (enableFullscreen == 1) {
var css = '.video-player-wrapper { max-height: calc(100vh - 5.625rem) !important; height: calc(100vh) !important; }';
css += '.erc-header { flex: 0 0 1.55rem !important; }';
css += '.erc-header .header-content { height: 0 !important; }';
GM_addStyle(css);
showToast('Fullscreen enabled'); };

// Volume Control via mouse scroll
// Variable to track whether the volume control event listener is active
let isVolumeControlEnabled = true;
if (enableVolumeControl == 1) {
// Function to simulate the click event
function simulate(element, event) {
    const evt = new MouseEvent(event, { bubbles: true, cancelable: true });
    element.dispatchEvent(evt);
}
    // Get the current video element
    const video = document.querySelector('video');
    // Function to adjust volume
// Function to adjust volume
function adjustVolume(video, percentage) {
    if (!video) {
        console.error("Video element not found.");
        return;
    }

    // Get the current volume (between 0 and 1)
    let currentVolume = video.volume;

    // Calculate the new volume by adjusting it with the percentage
    let volumeChange = currentVolume + (percentage / 100);

    // Ensure the volume is within the valid range of 0 to 1
    if (volumeChange > 1) {
        volumeChange = 1;
    } else if (volumeChange < 0) {
        volumeChange = 0;
    }

    // Apply the new volume to the video
    video.volume = volumeChange;
    var newVol = (video.volume * 100).toFixed(2);
    showToast(`Volume: ${newVol}%`);
}

// Event listener for mouse scroll to adjust volume
let volumeScrollListener = (event) => {
    if (!isVolumeControlEnabled) return; // If volume control is disabled, do nothing

    // Check the direction of the scroll
    if (event.deltaY < 0) {
        // Scroll up (increase volume)
        adjustVolume(video, volumePercentage);
    } else if (event.deltaY > 0) {
        // Scroll down (decrease volume)
        adjustVolume(video, -volumePercentage);
    }
    // Prevent the default action to avoid scrolling the page
    event.preventDefault();
};

// Listen for the mouse wheel event over the video
if (document.getElementById("vilos")) {
    document.getElementById("vilos").addEventListener('wheel', volumeScrollListener);
}

// Listen for keypress events to control volume event listener status
document.addEventListener('keydown', (event) => {
    // Check if the user pressed the key to toggle the event listener on/off
    if (event.key === disableKey) {
        isVolumeControlEnabled = !isVolumeControlEnabled; // Toggle the enable/disable state
        const status = isVolumeControlEnabled ? 'enabled' : 'disabled';
        showToast(`Volume control ${status}`);
    }

    // Check if the user pressed the key to temporarily disable the event listener while pressed
    if (event.key === holdDisableKey) {
        isVolumeControlEnabled = false;
    }
});

// Listen for keyup event to re-enable the temporary disable when the key is released
document.addEventListener('keyup', (event) => {
    // Re-enable volume control when the hold-disable key is released
    if (event.key === holdDisableKey) {
        isVolumeControlEnabled = true;
    }
});

};

// Check for and click Skip Intro
if (enableSkipIntro == 1 || enableSkipCredits == 1) {
setInterval(function () {
// Check for skip intro button
    if (enableSkipIntro ==1 ) {
const skipIntroBtn = document.querySelector('div[data-testid="skipIntroText"]');
if (skipIntroBtn !== null && (skipIntroBtn.textContent.includes("SKIP INTRO"))) {
    simulate(skipIntroBtn, "click");
    console.log('Skip Btn Found');
    showToast('Intro Skipped');
} };

// Check for skip credits button
    if (enableSkipIntro ==1 ) {
const skipCreditsBtn = document.querySelector('div[data-testid="skipIntroText"]');
if (skipCreditsBtn !== null && (skipCreditsBtn.textContent.includes("SKIP CREDITS"))) {
    simulate(skipCreditsBtn, "click");
    console.log('Skip Btn Found');
    showToast('Credits Skipped');
}}
}, 1000)
};

