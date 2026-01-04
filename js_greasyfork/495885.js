// ==UserScript==
// @name         Dynamic Personal Greeting Message (DPGM) (CEST)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show a greeting message based on the time of day in CEST, also it's in a modern style too! :D
// @author       Emree.el on Instagram :)
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495885/Dynamic%20Personal%20Greeting%20Message%20%28DPGM%29%20%28CEST%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495885/Dynamic%20Personal%20Greeting%20Message%20%28DPGM%29%20%28CEST%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get the current domain
    function getDomain() {
        return window.location.hostname;
    }

    // Function to check if the script has already run for this domain in this session
    function hasScriptRunForDomain(domain) {
        return sessionStorage.getItem('scriptRun_' + domain);
    }

    // Function to mark the script as run for this domain in this session
    function setScriptRunForDomain(domain) {
        sessionStorage.setItem('scriptRun_' + domain, 'true');
    }

    // Get the current domain
    const domain = getDomain();

    // Check if the script has already run for this domain
    if (hasScriptRunForDomain(domain)) {
        return; // Exit if the script has already run for this domain in this session
    }

    // Mark the script as run for this domain
    setScriptRunForDomain(domain);

    // Function to get the current time in CEST
    function getCESTTime() {
        let now = new Date();
        let utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        let cestOffset = 2; // CEST is UTC+2
        return new Date(utc + (3600000 * cestOffset));
    }

    // Function to determine the appropriate greeting
    function getGreeting() {
        const hours = getCESTTime().getHours();
        if (hours < 12) {
            return "Good morning, Emree";
        } else if (hours < 18) {
            return "Good afternoon, Emree";
        } else {
            return "Good evening, Emree";
        }
    }

    // Create the greeting box
    const greetingBox = document.createElement('div');
    greetingBox.style.position = 'fixed';
    greetingBox.style.top = '50%';
    greetingBox.style.left = '50%';
    greetingBox.style.transform = 'translate(-50%, -50%)';
    greetingBox.style.padding = '20px';
    greetingBox.style.backgroundColor = '#171717';
    greetingBox.style.color = '#FFFFFF';
    greetingBox.style.fontWeight = 'bold';
    greetingBox.style.fontSize = '24px';
    greetingBox.style.borderRadius = '10px';
    greetingBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    greetingBox.style.zIndex = '9999';
    greetingBox.style.opacity = '0';
    greetingBox.style.transition = 'opacity 1s, transform 1s';
    greetingBox.innerText = getGreeting();

    document.body.appendChild(greetingBox);

    // Animation to make the box appear
    setTimeout(() => {
        greetingBox.style.opacity = '1';
        greetingBox.style.transform = 'translate(-50%, -50%) scale(1.1)';
    }, 100);

    // Animation to make the box disappear
    setTimeout(() => {
        greetingBox.style.opacity = '0';
        greetingBox.style.transform = 'translate(-50%, -50%) scale(1)';
        setTimeout(() => {
            document.body.removeChild(greetingBox);
        }, 1000); // Wait for the fade-out transition to complete before removing
    }, 2000); // Show the box for 2 seconds
})();
