// ==UserScript==
// @name         Auto Reload
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically reloads weapon and toggles on/off with C key, with visual indicator. Pauses on mouse click.
// @author       blah_blah1.
// @match        *://*.battledudes.io/*
// @license      MIT
// @icon         https://sun9-74.userapi.com/impg/6jY26kEuZ0qU5I9x7mdBOdQ2zA8pG8H9s3AkDw/BTLz1oDKei0.jpg?size=604x340&quality=96&sign=9fe860f5ff054a01d1ffef1c2f9c79fb&type=album
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502338/Auto%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/502338/Auto%20Reload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoReloadEnabled = false;
    let intervalId;
    let mousePressed = false;

    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.top = '40px';
    indicator.style.right = '10px';
    indicator.style.padding = '10px';
    indicator.style.backgroundColor = 'rgba(51, 51, 51, 0.8)';
    indicator.style.color = 'white';
    indicator.style.border = '2px solid #666';
    indicator.style.borderRadius = '5px';
    indicator.style.zIndex = '1000';
    indicator.style.overflow = 'hidden';
    indicator.innerText = 'Auto Reload: OFF';
    document.body.appendChild(indicator);

    function updateIndicator() {
        if (autoReloadEnabled) {
            indicator.style.backgroundColor = 'rgba(51, 51, 51, 0.8)';
            indicator.innerText = 'Auto Reload: ON';
        } else {
            indicator.style.backgroundColor = 'rgba(51, 51, 51, 0.8)';
            indicator.innerText = 'Auto Reload: OFF';
        }
    }

    function autoReload() {
        const keyDownEvent = new KeyboardEvent('keydown', { key: 'R', code: 'KeyR', keyCode: 82, which: 82, bubbles: true });
        const keyUpEvent = new KeyboardEvent('keyup', { key: 'R', code: 'KeyR', keyCode: 82, which: 82, bubbles: true });

        document.dispatchEvent(keyDownEvent);
        setTimeout(() => {
            document.dispatchEvent(keyUpEvent);
        }, 0);
    }

    function startAutoReload() {
        intervalId = setInterval(() => {
            if (autoReloadEnabled && !mousePressed) {
                autoReload();
            }
        }, 0);
    }

    function stopAutoReload() {
        clearInterval(intervalId);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'c' || event.key === 'C') {
            autoReloadEnabled = !autoReloadEnabled;
            updateIndicator();
            if (autoReloadEnabled) {
                startAutoReload();
            } else {
                stopAutoReload();
            }
            console.log(`Auto Reload: ${autoReloadEnabled ? 'Enabled' : 'Disabled'}`);
        }
    });

    document.addEventListener('mousedown', () => {
        mousePressed = true;
    });

    document.addEventListener('mouseup', () => {
        mousePressed = false;
    });

    if (autoReloadEnabled) {
        startAutoReload();
    } else {
        stopAutoReload();
    }

})();
