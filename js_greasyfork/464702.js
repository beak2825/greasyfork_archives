// ==UserScript==
// @name         Anti-Robot Detection Script
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Bypass robot detection and appear as a human to websites.
// @author       Wrldz
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464702/Anti-Robot%20Detection%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/464702/Anti-Robot%20Detection%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isScriptEnabled = true;

    // Check for anti-robot detection mechanisms
    var antiRobotElements = document.querySelectorAll("[id*='captcha'],[class*='captcha'],[name*='captcha'],[id*='recaptcha'],[class*='recaptcha'],[name*='recaptcha']");
    var antiRobotDetected = antiRobotElements.length > 0;

    // Random mouse movements
    var simulateMouseMovement = function() {
        var dx = Math.floor(Math.random() * 6) - 3;
        var dy = Math.floor(Math.random() * 6) - 3;
        var event = new MouseEvent('mousemove', {
            view: window,
            bubbles: false,
            cancelable: true,
            clientX: window.innerWidth/2 + dx,
            clientY: window.innerHeight/2 + dy
        });
        window.dispatchEvent(event);
    };

    // Random typing delays
    var simulateTypingDelay = function() {
        var delay = Math.floor(Math.random() * 1000) + 500;
        return delay;
    };

    // Simulate human behavior
    var simulateHumanBehavior = function() {
        simulateMouseMovement();
        var delay = simulateTypingDelay();
        return delay;
    };

    var originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay) {
        if (!isScriptEnabled || antiRobotDetected) {
            return originalSetTimeout.apply(this, arguments);
        }

        var newCallback = function() {
            var result = callback.apply(this, arguments);
            if(typeof result === 'boolean'){
                return result || simulateHumanBehavior(); // Return original result or simulate human behavior
            }else{
                return result;
            }
        };
        return originalSetTimeout.call(this, newCallback, delay);
    };

    var originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay) {
        if (!isScriptEnabled || antiRobotDetected) {
            return originalSetInterval.apply(this, arguments);
        }

        var newCallback = function() {
            var result = callback.apply(this, arguments);
            if(typeof result === 'boolean'){
                return result || simulateHumanBehavior(); // Return original result or simulate human behavior
            }else{
                return result;
            }
        };
        return originalSetInterval.call(this, newCallback, delay);
    };

    // Allow the user to toggle the script on and off
    document.addEventListener('keydown', function(event) {
        if (event.code === 'KeyR' && event.ctrlKey && event.altKey) { // Ctrl + Alt + R to toggle the script
            isScriptEnabled = !isScriptEnabled;
            console.log('Anti-Robot Detection Script ' + (isScriptEnabled ? 'enabled' : 'disabled'));
        }
    });
})();