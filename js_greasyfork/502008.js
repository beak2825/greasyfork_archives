// ==UserScript==
// @name         DredCam
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-07-28
// @description  It's a camera. What do you expect? Here's what it can do. Press \ to open cam. Then join the ship you want the camera to be in. Congrats it's done.
// @author       You
// @match        https://test.drednot.io/
// @match        https://drednot.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minewatch.rf.gd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502008/DredCam.user.js
// @updateURL https://update.greasyfork.org/scripts/502008/DredCam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a mini window but keep it hidden initially
    const miniWindow = document.createElement('div');
    miniWindow.style.position = 'fixed';
    miniWindow.style.bottom = '20px';
    miniWindow.style.right = '20px';
    miniWindow.style.width = '600px';  // Increased width
    miniWindow.style.height = '400px';  // Increased height
    miniWindow.style.backgroundColor = 'white';
    miniWindow.style.border = '1px solid black';
    miniWindow.style.zIndex = '1000';
    miniWindow.style.overflow = 'hidden';
    miniWindow.style.display = 'none';  // Hide initially
    document.body.appendChild(miniWindow);

    // Create an iframe inside the mini window to sandbox the key events
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    miniWindow.appendChild(iframe);

    // Set the iframe's src to the current tab's URL
    iframe.src = window.location.href;

    // Create a battery icon
    const batteryIcon = document.createElement('div');
    batteryIcon.style.position = 'absolute';
    batteryIcon.style.bottom = '10px';
    batteryIcon.style.left = '10px';
    batteryIcon.style.width = '40px';
    batteryIcon.style.height = '20px';
    batteryIcon.style.border = '2px solid black';
    batteryIcon.style.borderRadius = '4px';
    batteryIcon.style.backgroundColor = '#eee';
    miniWindow.appendChild(batteryIcon);

    const batteryLevel = document.createElement('div');
    batteryLevel.style.width = '100%';
    batteryLevel.style.height = '100%';
    batteryLevel.style.backgroundColor = 'green';
    batteryIcon.appendChild(batteryLevel);

    // Create a button to recharge the battery
    const rechargeButton = document.createElement('button');
    rechargeButton.textContent = 'Recharge';
    rechargeButton.style.position = 'absolute';
    rechargeButton.style.bottom = '10px';
    rechargeButton.style.left = '60px';
    miniWindow.appendChild(rechargeButton);

    // Create a button to toggle night vision
    const nightVisionButton = document.createElement('button');
    nightVisionButton.textContent = 'Night Vision';
    nightVisionButton.style.position = 'absolute';
    nightVisionButton.style.top = '10px';
    nightVisionButton.style.right = '10px';
    miniWindow.appendChild(nightVisionButton);

    // Create a button to toggle static effect
    const staticEffectButton = document.createElement('button');
    staticEffectButton.textContent = 'Static Effect';
    staticEffectButton.style.position = 'absolute';
    staticEffectButton.style.top = '10px';
    staticEffectButton.style.right = '110px';
    miniWindow.appendChild(staticEffectButton);

    let level = 100;
    let charging = false;
    let nightVisionOn = false;
    let staticEffectOn = false;
    let drainRate = 1;
    let batteryInterval;

    // Function to animate battery progress
    function animateBattery() {
        if (batteryInterval) clearInterval(batteryInterval);
        batteryInterval = setInterval(() => {
            if (!charging && miniWindow.style.display !== 'none') {
                level -= drainRate;
                batteryLevel.style.width = level + '%';
                batteryLevel.style.backgroundColor = level > 20 ? 'green' : 'red';
            }

            if (level <= 0) {
                clearInterval(batteryInterval);
                miniWindow.style.display = 'none';
            }
        }, 1000);  // Battery update interval
    }

    // Function to recharge the battery
    function rechargeBattery() {
        if (level < 100) {
            level += 5;
            if (level > 100) {
                level = 100;
            }
            batteryLevel.style.width = level + '%';
            batteryLevel.style.backgroundColor = level > 20 ? 'green' : 'red';
        }
    }

    // Function to toggle night vision
    function toggleNightVision() {
        nightVisionOn = !nightVisionOn;
        iframe.style.filter = nightVisionOn ? 'grayscale(100%) sepia(100%) hue-rotate(90deg) saturate(300%)' : 'none';
        drainRate = nightVisionOn ? 2 : 1;  // Double the drain rate when night vision is on
    }

    // Function to toggle static effect
    function toggleStaticEffect() {
        staticEffectOn = !staticEffectOn;
        iframe.style.filter = staticEffectOn ? 'contrast(200%) brightness(50%)' : 'none';
    }

    // Event listener for recharge button
    rechargeButton.addEventListener('click', () => {
        charging = true;
        rechargeBattery();
        charging = false;
    });

    // Event listener for night vision button
    nightVisionButton.addEventListener('click', toggleNightVision);

    // Event listener for static effect button
    staticEffectButton.addEventListener('click', toggleStaticEffect);

    // Function to mirror key events
    function mirrorKeyEvent(event) {
        // Wait for the iframe to load before mirroring key events
        if (iframe.contentWindow.document.readyState === 'complete') {
            const mirroredEvent = new KeyboardEvent(event.type, {
                key: event.key,
                code: event.code,
                location: event.location,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
                altKey: event.altKey,
                metaKey: event.metaKey,
                repeat: event.repeat,
                isComposing: event.isComposing
            });
            iframe.contentWindow.document.dispatchEvent(mirroredEvent);
        }
    }

    // Function to toggle mini window visibility
    function toggleMiniWindow() {
        if (miniWindow.style.display === 'none') {
            miniWindow.style.display = 'block';
            animateBattery(); // Restart battery animation when mini window is opened
        } else {
            miniWindow.style.display = 'none';
            clearInterval(batteryInterval); // Stop battery animation when mini window is closed
        }
    }

    // Event listener to toggle the mini window with the backslash key
    window.addEventListener('keydown', (event) => {
        if (event.key === '\\') {
            toggleMiniWindow();
        } else {
            mirrorKeyEvent(event);
        }
    });

    // Mirror other key events
    window.addEventListener('keyup', mirrorKeyEvent);
    window.addEventListener('keypress', mirrorKeyEvent);

})();
// ==UserScript==
// @name         bot
// @namespace    http://tampermonkey.net/
// @version      2024-07-28
// @description  bot script with battery icon, minigame, night vision, and static effect
// @author       You
// @match        http://test.drednot.io/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create a mini window but keep it hidden initially
    const miniWindow = document.createElement('div');
    miniWindow.style.position = 'fixed';
    miniWindow.style.bottom = '20px';
    miniWindow.style.right = '20px';
    miniWindow.style.width = '600px';  // Increased width
    miniWindow.style.height = '400px';  // Increased height
    miniWindow.style.backgroundColor = 'white';
    miniWindow.style.border = '1px solid black';
    miniWindow.style.zIndex = '1000';
    miniWindow.style.overflow = 'hidden';
    miniWindow.style.display = 'none';  // Hide initially
    document.body.appendChild(miniWindow);

    // Create an iframe inside the mini window to sandbox the key events
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    miniWindow.appendChild(iframe);

    // Set the iframe's src to the current tab's URL
    iframe.src = window.location.href;

    // Create a battery icon
    const batteryIcon = document.createElement('div');
    batteryIcon.style.position = 'absolute';
    batteryIcon.style.bottom = '10px';
    batteryIcon.style.left = '10px';
    batteryIcon.style.width = '40px';
    batteryIcon.style.height = '20px';
    batteryIcon.style.border = '2px solid black';
    batteryIcon.style.borderRadius = '4px';
    batteryIcon.style.backgroundColor = '#eee';
    miniWindow.appendChild(batteryIcon);

    const batteryLevel = document.createElement('div');
    batteryLevel.style.width = '100%';
    batteryLevel.style.height = '100%';
    batteryLevel.style.backgroundColor = 'green';
    batteryIcon.appendChild(batteryLevel);

    // Create a button to recharge the battery
    const rechargeButton = document.createElement('button');
    rechargeButton.textContent = 'Recharge';
    rechargeButton.style.position = 'absolute';
    rechargeButton.style.bottom = '10px';
    rechargeButton.style.left = '60px';
    miniWindow.appendChild(rechargeButton);

    // Create a button to toggle night vision
    const nightVisionButton = document.createElement('button');
    nightVisionButton.textContent = 'Night Vision';
    nightVisionButton.style.position = 'absolute';
    nightVisionButton.style.top = '10px';
    nightVisionButton.style.right = '10px';
    miniWindow.appendChild(nightVisionButton);

    // Create a button to toggle static effect
    const staticEffectButton = document.createElement('button');
    staticEffectButton.textContent = 'Static Effect';
    staticEffectButton.style.position = 'absolute';
    staticEffectButton.style.top = '10px';
    staticEffectButton.style.right = '110px';
    miniWindow.appendChild(staticEffectButton);

    let level = 100;
    let charging = false;
    let nightVisionOn = false;
    let staticEffectOn = false;
    let drainRate = 1;
    let batteryInterval;

    // Function to animate battery progress
    function animateBattery() {
        if (batteryInterval) clearInterval(batteryInterval);
        batteryInterval = setInterval(() => {
            if (!charging && miniWindow.style.display !== 'none') {
                level -= drainRate;
                batteryLevel.style.width = level + '%';
                batteryLevel.style.backgroundColor = level > 20 ? 'green' : 'red';
            }

            if (level <= 0) {
                clearInterval(batteryInterval);
                miniWindow.style.display = 'none';
            }
        }, 1000);  // Battery update interval
    }

    // Function to recharge the battery
    function rechargeBattery() {
        if (level < 100) {
            level += 5;
            if (level > 100) {
                level = 100;
            }
            batteryLevel.style.width = level + '%';
            batteryLevel.style.backgroundColor = level > 20 ? 'green' : 'red';
        }
    }

    // Function to toggle night vision
    function toggleNightVision() {
        nightVisionOn = !nightVisionOn;
        iframe.style.filter = nightVisionOn ? 'grayscale(100%) sepia(100%) hue-rotate(90deg) saturate(300%)' : 'none';
        drainRate = nightVisionOn ? 2 : 1;  // Double the drain rate when night vision is on
    }

    // Function to toggle static effect
    function toggleStaticEffect() {
        staticEffectOn = !staticEffectOn;
        iframe.style.filter = staticEffectOn ? 'contrast(200%) brightness(50%)' : 'none';
    }

    // Event listener for recharge button
    rechargeButton.addEventListener('click', () => {
        charging = true;
        rechargeBattery();
        charging = false;
    });

    // Event listener for night vision button
    nightVisionButton.addEventListener('click', toggleNightVision);

    // Event listener for static effect button
    staticEffectButton.addEventListener('click', toggleStaticEffect);

    // Function to mirror key events
    function mirrorKeyEvent(event) {
        // Wait for the iframe to load before mirroring key events
        if (iframe.contentWindow.document.readyState === 'complete') {
            const mirroredEvent = new KeyboardEvent(event.type, {
                key: event.key,
                code: event.code,
                location: event.location,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
                altKey: event.altKey,
                metaKey: event.metaKey,
                repeat: event.repeat,
                isComposing: event.isComposing
            });
            iframe.contentWindow.document.dispatchEvent(mirroredEvent);
        }
    }

    // Function to toggle mini window visibility
    function toggleMiniWindow() {
        if (miniWindow.style.display === 'none') {
            miniWindow.style.display = 'block';
            animateBattery(); // Restart battery animation when mini window is opened
        } else {
            miniWindow.style.display = 'none';
            clearInterval(batteryInterval); // Stop battery animation when mini window is closed
        }
    }

    // Event listener to toggle the mini window with the backslash key
    window.addEventListener('keydown', (event) => {
        if (event.key === '\\') {
            toggleMiniWindow();
        } else {
            mirrorKeyEvent(event);
        }
    });

    // Mirror other key events
    window.addEventListener('keyup', mirrorKeyEvent);
    window.addEventListener('keypress', mirrorKeyEvent);

})();
