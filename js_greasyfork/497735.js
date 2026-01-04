// ==UserScript==
// @name         Auto Reload Script with Indicator for battledudes.io
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically reloads weapon and toggles on/off with C key, with visual indicator. Pauses on mouse click.
// @author       blahblah & hornex.pro
// @match        *://*.battledudes.io/*
// @license      MIT
// @icon         https://sun9-74.userapi.com/impg/6jY26kEuZ0qU5I9x7mdBOdQ2zA8pG8H9s3AkDw/BTLz1oDKei0.jpg?size=604x340&quality=96&sign=9fe860f5ff054a01d1ffef1c2f9c79fb&type=album
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497735/Auto%20Reload%20Script%20with%20Indicator%20for%20battledudesio.user.js
// @updateURL https://update.greasyfork.org/scripts/497735/Auto%20Reload%20Script%20with%20Indicator%20for%20battledudesio.meta.js
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
    indicator.style.backgroundColor = 'red';
    indicator.style.color = 'white';
    indicator.style.zIndex = '1000';
    indicator.innerText = 'Auto Reload: OFF';
    document.body.appendChild(indicator);

    function updateIndicator() {
        if (autoReloadEnabled) {
            indicator.style.backgroundColor = 'green';
            indicator.innerText = 'Auto Reload: ON';
        } else {
            indicator.style.backgroundColor = 'red';
            indicator.innerText = 'Auto Reload: OFF';
        }
    }

    function autoReload() {
        const keyDownEvent = new KeyboardEvent('keydown', { key: 'R', code: 'KeyR', keyCode: 82, which: 82, bubbles: true });
        const keyUpEvent = new KeyboardEvent('keyup', { key: 'R', code: 'KeyR', keyCode: 82, which: 82, bubbles: true });

        document.dispatchEvent(keyDownEvent);
        setTimeout(() => {
            document.dispatchEvent(keyUpEvent);
        }, 104);
    }

    function startAutoReload() {
        intervalId = setInterval(() => {
            if (autoReloadEnabled && !mousePressed) {
                autoReload();
            }
        }, 509);
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
