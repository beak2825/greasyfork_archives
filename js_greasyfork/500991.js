// ==UserScript==
// @grant        none
// @version      1.6
// @author       mrWoogy
// @namespace mrWoogy
// @name         1win Token Autoclicker
// @description  18.07.2024
// @match        *://cryptocklicker-frontend-rnd-prod.100hp.app/*
// @icon         https://img.cryptorank.io/coins/w_coin1718038816897.png
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500991/1win%20Token%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/500991/1win%20Token%20Autoclicker.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let isClicking = false;
    let clickInterval;

  let GAME_SETTINGS = {
    minDelay: 60,
    maxDelay: 140,
    clickOffset: 10,
    pressureFactor: 0.5
  };


  const randomDelay = (min, max) => Math.random() * (max - min) + min;
  const randomOffset = range => Math.random() * range * 2 - range;
  const randomPressure = () => Math.random() * GAME_SETTINGS.pressureFactor + GAME_SETTINGS.pressureFactor;

  function getCoords(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
    return { clientX: x, clientY: y, screenX: window.screenX + x, screenY: window.screenY + y };
  }


  function createEvent(type, target, options) {
    target.dispatchEvent(new PointerEvent(type, {
        bubbles: true, cancelable: true, view: window, detail: 1, pointerId: 1, width: 1, height: 1,
        tangentialPressure: 0, tiltX: 0, tiltY: 0, pointerType: 'touch', isPrimary: true, ...options
    }));
  }

    // Function to create and dispatch a click event on the target element
    function clickElement(target) {
        const { clientX, clientY, screenX, screenY } = getCoords(target);
        const options = {
            clientX: clientX + randomOffset(GAME_SETTINGS.clickOffset),
            clientY: clientY + randomOffset(GAME_SETTINGS.clickOffset),
            screenX: screenX + randomOffset(GAME_SETTINGS.clickOffset),
            screenY: screenY + randomOffset(GAME_SETTINGS.clickOffset),
            pressure: randomPressure()
        };
        ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(type => createEvent(type, target, options));
    }

    // Function to continuously click the element with ID "clicker"
    function autoClick() {
        if (isClicking) {
            const target = document.getElementById('clicker');
            if (target) {
                clickElement(target);
            } else {
                console.warn('Element with ID "clicker" not found.');
            }
        }
    }

    // Function to start the auto-clicking
    function startClicking() {
        if (!isClicking) {
            isClicking = true;
            clickInterval = setInterval(autoClick, 20); // 50 clicks per second
            toggleButton.textContent = 'Stop Autoclick';
            toggleButton.style.backgroundColor = '#e06c75';
            console.log('Auto-clicking started.');
        }
    }

    // Function to stop the auto-clicking
    function stopClicking() {
        if (isClicking) {
            isClicking = false;
            clearInterval(clickInterval);
            toggleButton.textContent = 'Start Autoclick';
            toggleButton.style.backgroundColor = '#98c379';
            console.log('Auto-clicking stopped.');
        }
    }

    // Create and append the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Start Autoclick';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.backgroundColor = '#98c379';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '4px';
    toggleButton.style.padding = '10px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '10000';
    toggleButton.onclick = () => {
        if (isClicking) {
            stopClicking();
        } else {
            startClicking();
        }
    };

    document.body.appendChild(toggleButton);

    console.log('Toggle button added to the page.');
})();