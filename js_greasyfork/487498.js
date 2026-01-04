// ==UserScript==
// @name         Useless Things Series: Blur Screen After Idle
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This script adds a blur overlay to the screen. Through the set idle time and pressing Ctrl B. Even if the page is refreshed the overlay will persists.
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/487498/Useless%20Things%20Series%3A%20Blur%20Screen%20After%20Idle.user.js
// @updateURL https://update.greasyfork.org/scripts/487498/Useless%20Things%20Series%3A%20Blur%20Screen%20After%20Idle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the idle time in seconds
    const idleTimeSeconds = 10; // 10 seconds
    const idleTimeMilliseconds = idleTimeSeconds * 1000;

    let idleTimer;
    let blurEnabled = localStorage.getItem('blurEnabled') === 'true';

    const overlayDiv = document.createElement('div');
    overlayDiv.style.position = 'fixed';
    overlayDiv.style.top = 0;
    overlayDiv.style.left = 0;
    overlayDiv.style.width = '100%';
    overlayDiv.style.height = '100%';
    overlayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // semi-transparent black background
    overlayDiv.style.backdropFilter = 'blur(10px)'; // apply a blur effect
    overlayDiv.style.zIndex = 9999;
    overlayDiv.style.display = blurEnabled ? 'block' : 'none';

    // Append the overlay to the body
    document.body.appendChild(overlayDiv);

    function startIdleTimer() {
        idleTimer = setTimeout(() => {
            if (!blurEnabled) {
                overlayDiv.style.display = 'block';
                localStorage.setItem('blurEnabled', true);
            }
        }, idleTimeMilliseconds);
    }

    function clearIdleTimer() {
        clearTimeout(idleTimer);
        startIdleTimer();
        if (!blurEnabled) {
            overlayDiv.style.display = 'none';
            localStorage.setItem('blurEnabled', false);
        }
    }

    //Function to store the state of the cover overlay to local storage
    function toggleBlur() {
        blurEnabled = !blurEnabled;
        if (!blurEnabled) {
            overlayDiv.style.display = 'none';
            localStorage.setItem('blurEnabled', false);
        } else {
            overlayDiv.style.display = 'block';
            localStorage.setItem('blurEnabled', true);
        }
    }

    document.addEventListener('mousemove', clearIdleTimer);
    document.addEventListener('keydown', clearIdleTimer);
    document.addEventListener('click', clearIdleTimer);
    document.addEventListener('scroll', clearIdleTimer);

    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'b') {
            toggleBlur();
        }
    });
    document.addEventListener('scroll', clearIdleTimer);

    startIdleTimer();
})();
