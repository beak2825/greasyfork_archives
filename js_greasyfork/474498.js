// ==UserScript==
// @name         Random Clicker
// @namespace    
// @version      1.12
// @description  Auto Clicker for Browsers!!
// @author       
// @match        https://www.torn.com/city.php
// @grant        none
// @icon         
// @compatible               chrome
// @compatible               firefox
// @compatible               opera
// @compatible               safari
// @downloadURL https://update.greasyfork.org/scripts/474498/Random%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/474498/Random%20Clicker.meta.js
// ==/UserScript==

let x, y, minCPS = 500, maxCPS = 1500, autoClick;
let isAutoClicking = false;

function startAutoClick(x, y) {
    autoClick = setInterval(function () {
        if (x !== undefined && y !== undefined && isAutoClicking) {
            click(x, y); // Pass the coordinates to the click function
        }
    }, getRandomCPS()); // Start with a random CPS
}

function stopAutoClick() {
    clearInterval(autoClick); // Clear the autoClick interval
    isAutoClicking = false;
    x = undefined;
    y = undefined;
}

function getRandomCPS() {
    // Generate a new random CPS between minCPS and maxCPS
    return Math.floor(Math.random() * (maxCPS - minCPS + 1)) + minCPS;
}

document.addEventListener('keydown', function (evt) {
    if (evt.shiftKey && evt.key === 'J') {
        if (isAutoClicking) {
            stopAutoClick(); // Stop the autoclick when Shift+J is pressed
        } else {
            updateInfo("You may now click on any point in this tab to set the autoclicker to it. Have fun !!");
        }
    }
});

document.addEventListener('click', function (event) {
    if (!isAutoClicking) {
        x = event.clientX;
        y = event.clientY;
        updateInfo(`Mouse click at X: ${x}, Y: ${y}, Click Frequency: Initializing...`);
        isAutoClicking = true; // Start autoclicking at the new coordinates
        startAutoClick(x, y);
    }
});

function click(x, y) {
    let randomCPS = getRandomCPS(); // Generate a new random CPS
    updateInfo(`Mouse click at X: ${x}, Y: ${y}, Click Frequency: ${randomCPS} CPS`);
    
    let ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
    });

    let el = document.elementFromPoint(x, y);
    el.dispatchEvent(ev);
}

// Helper function to update the information on the page
function updateInfo(message) {
    let infoElement = document.getElementById("autoclick-info");
    if (!infoElement) {
        infoElement = document.createElement("div");
        infoElement.id = "autoclick-info";
        infoElement.style.position = "fixed";
        infoElement.style.top = "10px";
        infoElement.style.left = "10px";
        infoElement.style.backgroundColor = "white"; // White background
        infoElement.style.color = "black"; // Black text
        infoElement.style.fontWeight = "bold"; // Bold text
        document.body.appendChild(infoElement);
    }
    infoElement.textContent = message;
}
