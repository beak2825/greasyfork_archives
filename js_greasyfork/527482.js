// ==UserScript==
// @name         Swordz.io Clean Up + AI Spam Bot + Toggle UI
// @namespace    intuxs
// @version      1.3
// @description  Hides junk in the homescreen, other boxes on the top left, the coins display, adds an AI Spam Bot, and provides a toggle UI at the bottom left
// @author       intuxs
// @match        *.swordz.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527482/Swordzio%20Clean%20Up%20%2B%20AI%20Spam%20Bot%20%2B%20Toggle%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/527482/Swordzio%20Clean%20Up%20%2B%20AI%20Spam%20Bot%20%2B%20Toggle%20UI.meta.js
// ==/UserScript==
// ==========================================
// Ad and UI Cleanup Functionality
// ==========================================

var hideBoxesEnabled = false; // Toggle hide boxes on/off
var showPauseEnabled = false; // Toggle show pause on/off
var showCoinsEnabled = false; // Toggle show coins on/off

// Store original styles for elements
const originalStyles = new Map();

// Function to hide ads
function hideAds() {
    if (!hideBoxesEnabled) return; // Only hide ads if hideBoxesEnabled is true
    const ads = document.querySelectorAll('div[style*="background-color"], iframe, img[src*="ads"]');
    ads.forEach(ad => {
        if (ad.offsetWidth > 0 && ad.offsetHeight > 0 && !ad.classList.contains('custom-ui')) { // Skip custom UI elements
            originalStyles.set(ad, { display: ad.style.display, visibility: ad.style.visibility });
            ad.style.display = 'none';
            console.log('Ad hidden:', ad);
        }
    });
}

// Function to hide the logo
function hideLogo() {
    if (!hideBoxesEnabled) return; // Only hide logo if hideBoxesEnabled is true

    const logo = document.querySelector('img[src="https://playem.io/cache/swordzio/client/img/logo.png"]');
    if (logo && !logo.classList.contains('custom-ui')) { // Skip custom UI elements
        originalStyles.set(logo, { display: logo.style.display, visibility: logo.style.visibility });
        logo.style.display = 'none';
        console.log('Logo hidden:', logo);
    }
}

// Function to hide specific elements on the top left
function hideTopLeftElements() {
    if (!hideBoxesEnabled) return; // Only hide elements if hideBoxesEnabled is true
    const elementsToHide = [
        { id: 'buttonFullscreenImage', type: 'img' },
        { id: 'buttonFullscreen', type: 'div' },
        { id: 'buttonMusicImage', type: 'img' },
        { id: 'buttonMusic', type: 'div' },
        { id: 'buttonPauseImage', type: 'img' },
        { id: 'buttonPause', type: 'div' },
        { id: 'buttonSoundImage', type: 'img' },
        { id: 'buttonSound', type: 'div' }
    ];

    elementsToHide.forEach(element => {
        const el = document.getElementById(element.id);
        if (el && !el.classList.contains('custom-ui')) { // Skip custom UI elements
            originalStyles.set(el, { display: el.style.display, visibility: el.style.visibility });
            el.style.visibility = 'hidden';
        }
    });
}

// Function to hide the coins display
function hideCoinsDisplay() {
    if (!hideBoxesEnabled) return; // Only hide coins if hideBoxesEnabled is true
    const coinsText = document.getElementById('coinsText');
    if (coinsText && !coinsText.classList.contains('custom-ui')) { // Skip custom UI elements
        originalStyles.set(coinsText, { display: coinsText.style.display, visibility: coinsText.style.visibility });
        coinsText.style.visibility = 'hidden';
    }

    const coinsIcon = document.querySelector('img[src*="coins.png"]');
    if (coinsIcon && !coinsIcon.classList.contains('custom-ui')) { // Skip custom UI elements
        originalStyles.set(coinsIcon, { display: coinsIcon.style.display, visibility: coinsIcon.style.visibility });
        coinsIcon.style.visibility = 'hidden';
    }
}

// Function to hide the YouTube wrapper and big box on the bottom right
function hideYouTubeWrapperAndBigBox() {
    if (!hideBoxesEnabled) return; // Only hide if hideBoxesEnabled is true

    // Hide YouTube wrapper
    const youtubeWrapper = document.querySelector('.youtube-wrapper'); // Adjust selector if needed
    if (youtubeWrapper && !youtubeWrapper.classList.contains('custom-ui')) { // Skip custom UI elements
        originalStyles.set(youtubeWrapper, { display: youtubeWrapper.style.display, visibility: youtubeWrapper.style.visibility });
        youtubeWrapper.style.visibility = 'hidden';
    }

    // Hide big box on the bottom right
    const bigBox = document.querySelector('.big-box'); // Adjust selector if needed
    if (bigBox && !bigBox.classList.contains('custom-ui')) { // Skip custom UI elements
        originalStyles.set(bigBox, { display: bigBox.style.display, visibility: bigBox.style.visibility });
        bigBox.style.visibility = 'hidden';
    }
}

// Function to show hidden elements
function showHiddenElements() {
    // Restore original styles for all elements except the UI we created
    originalStyles.forEach((styles, element) => {
        if (element && !element.classList.contains('custom-ui')) { // Skip custom UI elements
            element.style.display = styles.display;
            element.style.visibility = styles.visibility;
        }
    });

    // Clear the original styles map
    originalStyles.clear();
}

// Function to toggle pause button visibility
function togglePauseButton() {
    const buttonPause = document.getElementById('buttonPause');
    const buttonPauseImage = document.getElementById('buttonPauseImage');

    if (buttonPause && buttonPauseImage) {
        if (showPauseEnabled) {
            buttonPause.style.visibility = 'visible';
            buttonPauseImage.style.visibility = 'visible';
        } else {
            buttonPause.style.visibility = 'hidden';
            buttonPauseImage.style.visibility = 'hidden';
        }
    }
}

// Function to toggle coins visibility
function toggleCoinsDisplay() {
    const coinsText = document.getElementById('coinsText');
    const coinsIcon = document.querySelector('img[src*="coins.png"]');

    if (coinsText && coinsIcon) {
        if (showCoinsEnabled) {
            coinsText.style.visibility = 'visible';
            coinsIcon.style.visibility = 'visible';
        } else {
            coinsText.style.visibility = 'hidden';
            coinsIcon.style.visibility = 'hidden';
        }
    }
}

// ==========================================
// AI Spam Bot Functionality
// ==========================================

var spam = false; // Toggle spam on/off
var spamMessage = "Subscribe to richupi YT!"; // Default spam message

// Function to send spam messages
function spamChat() {
    if (spam) {
        const message = input.value.trim() !== '' ? input.value : spamMessage;
        console.log('Sending message:', message);

        try {
            socket.emit('keyPressX', {
                inputId: 'chatMessage',
                state: message
            });
            console.log('Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}

// ==========================================
// Toggle UI Functionality
// ==========================================

// Create a UI container at the bottom left
const uiContainer = document.createElement('div');
uiContainer.style.position = 'fixed';
uiContainer.style.bottom = '10px';
uiContainer.style.left = '10px';
uiContainer.style.zIndex = '9999';
uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
uiContainer.style.padding = '10px';
uiContainer.style.borderRadius = '10px';
uiContainer.style.color = '#fff';
uiContainer.style.fontFamily = 'Montserrat, Arial, sans-serif';
uiContainer.style.transition = 'transform 0.3s ease';
uiContainer.classList.add('custom-ui'); // Add a class to identify our custom UI
document.body.appendChild(uiContainer);

// Create an arrow button to hide/show the UI
const arrowButton = document.createElement('div');
arrowButton.textContent = '◄'; // Arrow pointing left
arrowButton.style.position = 'fixed';
arrowButton.style.bottom = '20px';
arrowButton.style.left = '10px';
arrowButton.style.zIndex = '10000';
arrowButton.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
arrowButton.style.color = 'lightblue'; // Changed from white to light blue
arrowButton.style.padding = '10px';
arrowButton.style.borderRadius = '50%';
arrowButton.style.cursor = 'pointer';
arrowButton.style.userSelect = 'none';
arrowButton.style.transition = 'transform 0.3s ease';
arrowButton.classList.add('custom-ui'); // Add a class to identify our custom UI
document.body.appendChild(arrowButton);

// Toggle UI visibility
let uiVisible = true;
arrowButton.addEventListener('click', () => {
    uiVisible = !uiVisible;
    if (uiVisible) {
        uiContainer.style.transform = 'translateX(0)';
        arrowButton.style.transform = 'rotate(0deg)';
        arrowButton.textContent = '◄'; // Arrow pointing left
    } else {
        uiContainer.style.transform = 'translateX(-110%)';
        arrowButton.style.transform = 'rotate(180deg)';
        arrowButton.textContent = '►'; // Arrow pointing right
    }
});

// Spam Bot Toggle
const spamBotLabel = document.createElement('div');
spamBotLabel.textContent = 'Spam Bot [1]';
spamBotLabel.style.color = '#ffa500'; // Orange when off
spamBotLabel.style.fontSize = '14px';
spamBotLabel.style.fontWeight = 'bold';
spamBotLabel.style.marginBottom = '10px';
spamBotLabel.style.cursor = 'pointer';
uiContainer.appendChild(spamBotLabel);

// Hide Boxes Toggle
const hideBoxesLabel = document.createElement('div');
hideBoxesLabel.textContent = 'Hide Boxes [2]';
hideBoxesLabel.style.color = '#ffa500'; // Orange when off
hideBoxesLabel.style.fontSize = '14px';
hideBoxesLabel.style.fontWeight = 'bold';
hideBoxesLabel.style.marginBottom = '10px';
hideBoxesLabel.style.cursor = 'pointer';
uiContainer.appendChild(hideBoxesLabel);

// Show Pause Toggle
const showPauseLabel = document.createElement('div');
showPauseLabel.textContent = 'Show Pause [3]';
showPauseLabel.style.color = '#ffa500'; // Orange when off
showPauseLabel.style.fontSize = '14px';
showPauseLabel.style.fontWeight = 'bold';
showPauseLabel.style.marginBottom = '10px';
showPauseLabel.style.cursor = 'pointer';
uiContainer.appendChild(showPauseLabel);

// Show Coins Toggle
const showCoinsLabel = document.createElement('div');
showCoinsLabel.textContent = 'Show Coins [4]';
showCoinsLabel.style.color = '#ffa500'; // Orange when off
showCoinsLabel.style.fontSize = '14px';
showCoinsLabel.style.fontWeight = 'bold';
showCoinsLabel.style.marginBottom = '10px';
showCoinsLabel.style.cursor = 'pointer';
uiContainer.appendChild(showCoinsLabel);

// Input for custom spam message
const input = document.createElement('input');
input.style.width = '100%';
input.style.marginTop = '10px';
input.style.height = '25px';
input.style.borderRadius = '5px';
input.style.backgroundColor = '#222';
input.style.color = '#fff';
input.style.border = '1px solid #555';
input.style.padding = '5px';
input.placeholder = 'Enter spam message';
uiContainer.appendChild(input);

// Toggle Spam Bot with '1' key
document.addEventListener('keydown', function (e) {
    if (e.key === '1') { // '1' key to toggle spam bot
        spam = !spam;
        spamBotLabel.textContent = `Spam Bot [1] ${spam ? 'ON' : 'OFF'}`;
        spamBotLabel.style.color = spam ? '#32CD32' : '#ffa500'; // Lime green when on, orange when off
        console.log(`Spam Bot ${spam ? 'enabled' : 'disabled'}`);
    }
});

// Toggle Hide Boxes with '2' key
document.addEventListener('keydown', function (e) {
    if (e.key === '2') { // '2' key to toggle hide boxes
        hideBoxesEnabled = !hideBoxesEnabled;
        hideBoxesLabel.textContent = `Hide Boxes [2] ${hideBoxesEnabled ? 'ON' : 'OFF'}`;
        hideBoxesLabel.style.color = hideBoxesEnabled ? '#32CD32' : '#ffa500'; // Lime green when on, orange when off
        console.log(`Hide Boxes ${hideBoxesEnabled ? 'enabled' : 'disabled'}`);

        if (hideBoxesEnabled) {
            hideAds();
            hideLogo(); // Call the new function
            hideTopLeftElements();
            hideCoinsDisplay();
            hideYouTubeWrapperAndBigBox();
        } else {
            showHiddenElements();
        }
    }
});

// Toggle Show Pause with '3' key
document.addEventListener('keydown', function (e) {
    if (e.key === '3') { // '3' key to toggle show pause
        showPauseEnabled = !showPauseEnabled;
        showPauseLabel.textContent = `Show Pause [3] ${showPauseEnabled ? 'ON' : 'OFF'}`;
        showPauseLabel.style.color = showPauseEnabled ? '#32CD32' : '#ffa500'; // Lime green when on, orange when off
        console.log(`Show Pause ${showPauseEnabled ? 'enabled' : 'disabled'}`);
        togglePauseButton();
    }
});

// Toggle Show Coins with '4' key
document.addEventListener('keydown', function (e) {
    if (e.key === '4') { // '4' key to toggle show coins
        showCoinsEnabled = !showCoinsEnabled;
        showCoinsLabel.textContent = `Show Coins [4] ${showCoinsEnabled ? 'ON' : 'OFF'}`;
        showCoinsLabel.style.color = showCoinsEnabled ? '#32CD32' : '#ffa500'; // Lime green when on, orange when off
        console.log(`Show Coins ${showCoinsEnabled ? 'enabled' : 'disabled'}`);
        toggleCoinsDisplay();
    }
});

// Continuously send spam messages
setInterval(spamChat, 1000);