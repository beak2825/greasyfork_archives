// ==UserScript==
// @name         Planet Client
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  This is a Bloxd.io Client!
// @author       Ankit
// @match        https://bloxd.io/
// @match        https://bloxd.io/?utm_source=pwa
// @match        https://staging.bloxd.io/
// @icon         https://i.imgur.com/gfZEi7a.png
// @grant        GM_addStyle
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/490180/Planet%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/490180/Planet%20Client.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';
    document.title = "Planet Client";
    const maintext = document.querySelector('.Title.FullyFancyText');
    maintext.style.textShadow = "10px 5px 5px #000000";
    maintext.style.webkitTextStroke = "none";
    maintext.style.fontFamily = "'Baloo Paaji 2', cursive"; // Change to Baloo Paaji 2
    document.querySelector('.Title.FullyFancyText').textContent = "Planet Client";
    const background = document.querySelector(".HomeBackground");
    if (background) {
        background.style.backgroundImage = 'url(https://wallpapercrafter.com/desktop/152018-digital-art-space-stars-black-Earth-planet-pixels-pixel-art-pixelated-simple-background-square-minimalism.png)';
    }
    const modifyElements = () => {
        ['LogoContainer', 'cube'].forEach(className => {
            document.querySelectorAll('.' + className).forEach(el => el.remove());
        });
    };
    modifyElements(); // Call the function to remove elements
}, 1000); // Missing closing parenthesis

//CrossHair
setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(https://i.imgur.com/1MnSP24.pngww)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
        crosshair.style.width = "19px";
        crosshair.style.height = "19px";
    }
}, 1);

//Planet Network Overlay
(function() {
    'use strict';
    const fontLink = document.createElement('link');
    fontLink.href = 'https://db.onlinewebfonts.com/c/68c9057f4e4dc415b2648f88526aeea7?family=Reglisse-Fill';
    fontLink.rel = 'stylesheet';

    const text = document.createElement('div');
    text.style.position = "fixed";
    text.style.color = "#fff";
    text.textContent = "Planet Network";
    text.style.top = "75%";
    text.style.left = "50%";
    text.style.zIndex = "10000";
    text.style.fontWeight = "bold";
    text.style.borderRadius = "25px";
    text.style.fontSize = "18px";
    text.style.height = "6vh";
    text.style.display = "flex";
    text.style.paddingTop = "0.1rem";
    text.style.justifyContent = "center";
    text.style.width = "11vw";
    text.style.height = "6vh";
    text.style.transform = "translateX(-50%)";
    text.style.textAlign = "center";
    text.style.lineHeight = "50px";
    text.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px";
    text.style.backgroundColor = "rgba(0,0,0,.4)";
    text.style.cursor = "pointer";
    text.style.pointerEvents = "none"; // This makes the element click-through

    document.head.appendChild(fontLink);
    document.body.appendChild(text);

    function centerText() {
        text.style.top = "77%";
        text.style.left = "50%";
        text.style.transform = "translate(-50%, -50%)";
    }

    window.addEventListener('resize', centerText);
    centerText();
})();


// Keystrocks\CPS Counter
(function () {
    console.log('Script loaded');

    // Load Minecraftia font
    var fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.cdnfonts.com/css/minecraftia';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Create the main container
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '30px';
    container.style.left = '1188px';
    container.style.backgroundColor = 'transparent';
    container.style.color = 'white';
    container.style.padding = '5px';
    container.style.fontFamily = "'Minecraftia', sans-serif";
    container.style.zIndex = '9999';
    container.style.pointerEvents = 'none';

    // Create rows for keystrokes display
    var row1 = document.createElement('div');
    row1.style.display = 'flex';
    row1.style.justifyContent = 'center';

    var upKey = createKeyElement('W');

    var row2 = document.createElement('div');
    row2.style.display = 'flex';
    row2.style.justifyContent = 'center';

    var leftKey = createKeyElement('A');
    var sprintKey = createKeyElement('S');
    var rightKey = createKeyElement('D');

    var row3 = document.createElement('div');
    row3.style.display = 'flex';
    row3.style.justifyContent = 'center';

    var spaceKey = createKeyElement('____');

    var row4 = document.createElement('div');
    row4.style.display = 'flex';
    row4.style.justifyContent = 'center';

    var lmbKey = createKeyElement('LMB');
    var rmbKey = createKeyElement('RMB');

    row1.appendChild(upKey);
    row2.appendChild(leftKey);
    row2.appendChild(sprintKey);
    row2.appendChild(rightKey);
    row3.appendChild(spaceKey);
    row4.appendChild(lmbKey);
    row4.appendChild(rmbKey);
    container.appendChild(row1);
    container.appendChild(row2);
    container.appendChild(row3);
    container.appendChild(row4);

    document.body.appendChild(container);

    var pressedKeys = new Set(); // To track pressed keys

    function createKeyElement(keyText) {
        var keyElement = document.createElement('div');
        keyElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        keyElement.style.color = 'white';
        keyElement.style.padding = '15px 20px';
        keyElement.style.margin = '1px';
        keyElement.style.fontFamily = "'Minecraftia', sans-serif";
        keyElement.style.fontSize = '20px';
        keyElement.style.textAlign = 'center';
        keyElement.style.transition = 'all 0.2s ease-in-out';
        keyElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)'; // Add shadow effect
        keyElement.textContent = keyText;

        if (keyText === '____') {
            keyElement.style.padding = '12.5px 61px';
            keyElement.style.fontFamily = 'sans-serif';
        }

        if (keyText === 'LMB') {
            keyElement.style.padding = '15px 17px';
            keyElement.style.transition = 'all 0.15s ease-in-out';
        }

        if (keyText === 'RMB') {
            keyElement.style.padding = '15px 20px';
            keyElement.style.transition = 'all 0.15s ease-in-out';
        }

        return keyElement;
    }

    document.addEventListener('keydown', function (event) {
        if (!pressedKeys.has(event.key)) {
            pressedKeys.add(event.key);
            highlightKey(event.key, 'rgba(255, 255, 255, 0.5)', 'black');
        }
    });

    document.addEventListener('keyup', function (event) {
        if (pressedKeys.has(event.key)) {
            pressedKeys.delete(event.key);
            highlightKey(event.key, 'rgba(0, 0, 0, 0.5)', 'white');
        }
    });

    document.addEventListener('mousedown', function (event) {
        if (event.button === 0) {
            lmbKey.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            lmbKey.style.color = 'black';
            countLeftClick();
        } else if (event.button === 2) {
            rmbKey.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            rmbKey.style.color = 'black';
            countRightClick();
        }
    });

    document.addEventListener('mouseup', function (event) {
        if (event.button === 0) {
            lmbKey.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            lmbKey.style.color = 'white';
        } else if (event.button === 2) {
            rmbKey.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            rmbKey.style.color = 'white';
        }
    });

    function highlightKey(key, bgColor, textColor) {
        let keyElement;
        switch (key) {
            case 'w': keyElement = upKey; break;
            case 'a': keyElement = leftKey; break;
            case 's': keyElement = sprintKey; break;
            case 'd': keyElement = rightKey; break;
            case ' ': keyElement = spaceKey; break;
            default: return;
        }
        keyElement.style.backgroundColor = bgColor;
        keyElement.style.color = textColor;
    }

    // CPS Tracking
    var leftClickTimes = [];
    var rightClickTimes = [];
    var cpsDisplay = document.createElement('div');
    cpsDisplay.style.position = 'fixed';
    cpsDisplay.style.bottom = '5px';
    cpsDisplay.style.left = '1166px';
    cpsDisplay.style.color = 'white';
    cpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    cpsDisplay.style.padding = '10px';
    cpsDisplay.style.fontFamily = "'Minecraftia', sans-serif";
    cpsDisplay.style.fontSize = '14px';
    cpsDisplay.style.zIndex = '9999';
    cpsDisplay.textContent = '0 | 0';

    document.body.appendChild(cpsDisplay);

    function countLeftClick() {
        var currentTime = new Date().getTime();
        leftClickTimes.push(currentTime);
        updateCPS();
    }

    function countRightClick() {
        var currentTime = new Date().getTime();
        rightClickTimes.push(currentTime);
        updateCPS();
    }

    function updateCPS() {
        var currentTime = new Date().getTime();
        var oneSecondAgo = currentTime - 1000;

        // Filter out clicks older than 1 second
        leftClickTimes = leftClickTimes.filter(time => time >= oneSecondAgo);
        rightClickTimes = rightClickTimes.filter(time => time >= oneSecondAgo);

        // Update CPS display
        cpsDisplay.textContent = `${leftClickTimes.length} | ${rightClickTimes.length}`;
    }

    // Check for inactivity and reset CPS to 0 after 1 second
    setInterval(function () {
        var currentTime = new Date().getTime();
        if (leftClickTimes.length > 0 && currentTime - leftClickTimes[leftClickTimes.length - 1] > 1000) {
            leftClickTimes = [];
        }
        if (rightClickTimes.length > 0 && currentTime - rightClickTimes[rightClickTimes.length - 1] > 1000) {
            rightClickTimes = [];
        }

        updateCPS(); // Recheck and update the display
    }, 100);

})();

//Hotbar and Transparent name for games
(function() {
    'use strict';
    setInterval(function() {
        const hotBarItem = document.querySelectorAll(".HotBarItem");
        const selectedslot = document.querySelectorAll(".SelectedItem");
        if (hotBarItem) {
            hotBarItem.forEach(function(hotbar) {
                hotbar.style.borderRadius = "8px";
                hotbar.style.borderColor = "#000000";
                hotbar.style.backgroundColor = "transparent";
                hotbar.style.boxShadow = "none";
                hotbar.style.outline = "transparent";
            });
        }
        if (selectedslot) {
            selectedslot.forEach(function(slot) {
                slot.style.backgroundColor = "transparent";
                slot.style.boxShadow = "none";
                slot.style.borderRadius = "15px";
                slot.style.borderColor = "#FFFFFF";
                slot.style.outline = "transparent";
            });
        }
    }, 1);
})();

document.addEventListener('DOMContentLoaded', modifyElements);
setInterval(modifyElements, 1000);

function modifyElements() {
    let names = document.getElementsByClassName("AvailableGameTextInner");
    let removebox = document.getElementsByClassName("AvailableGameTextWrapperBackground");
    let imgedits = document.getElementsByClassName("AvailableGame");

    document.querySelectorAll('.AvailableGame').forEach(item => {
        item.style.border = "none";
    });

    for (let i = 0; i < names.length; i++) {
        names[i].style.textShadow = "1px 1px 2px red, -1px -1px 2px blue";
        removebox[i].style.opacity = "0";
        imgedits[i].style.border = "10px";
        imgedits[i].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.4)";
    }
}