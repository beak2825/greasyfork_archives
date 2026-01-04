// ==UserScript==
// @name         donutgang fixer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  this site is ass
// @author       aprilfools
// @match        *://donutgang.vercel.app/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505520/donutgang%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/505520/donutgang%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of Family Guy clip URLs
    const clips = [
        'https://www.youtube.com/embed/lO5UR0cIThQ?autoplay=1',
        'https://www.youtube.com/embed/qMTY4l8_miI?autoplay=1',
        'https://www.youtube.com/embed/VvALFQDWj6Q?autoplay=1',
        'https://www.youtube.com/embed/bQ5kejGjA4Y?autoplay=1',
        'https://www.youtube.com/embed/h_r8sVdY7do?autoplay=1',
        'https://www.youtube.com/embed/7ghSziUQnhs?autoplay=1',
        'https://www.youtube.com/embed/dvjy6V4vLlI?autoplay=1',
        'https://www.youtube.com/embed/L_fcrOyoWZ8?autoplay=1',
        'https://www.youtube.com/embed/ObhmrE6FyNs?autoplay=1',
        'https://www.youtube.com/embed/fXCUaRE-5Rc?autoplay=1',
        'https://www.youtube.com/embed/u7kdVe8q5zs?autoplay=1',
        'https://www.youtube.com/embed/vXc0Jmn-frw?autoplay=1',
        'https://www.youtube.com/embed/uVKxtdMgJVU?autoplay=1',
        'https://www.youtube.com/embed/ZtLrNBdXT7M?autoplay=1',
        'https://www.youtube.com/embed/2LaCKzfTEoA?autoplay=1'
    ];

    let spawningEnabled = true;
    let limitedto10 = false;
    let howMuchTo10 = 0;
    let bounceSpeed = 4; // Default bounce speed

    function spawnIframe() {
        // Randomly select a clip
        const randomClip = clips[Math.floor(Math.random() * clips.length)];

        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.width = '300'; // Set smaller width for easier bouncing
        iframe.height = '170';
        iframe.src = randomClip;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        // Initial position of the iframe (center of the screen)
        iframe.style.position = 'fixed';
        iframe.style.top = `${(window.innerHeight / 2) - (iframe.height / 2)}px`;
        iframe.style.left = `${(window.innerWidth / 2) - (iframe.width / 2)}px`;
        iframe.style.zIndex = '1000';

        // Append the iframe to the body
        document.body.appendChild(iframe);

        // Bouncing logic
        let x = Math.random() * 2 + bounceSpeed;
        let y = Math.random() * 2 + bounceSpeed;

        const interval = setInterval(() => {
            let rect = iframe.getBoundingClientRect();

            // Reverse direction if hitting a boundary
            if (rect.left + x < 0 || rect.right + x > window.innerWidth) {
                x = -x;
                if (spawningEnabled && !limitedto10) {
                    spawnIframe();
                    howMuchTo10 += 1;
                }
            }
            if (rect.top + y < 0 || rect.bottom + y > window.innerHeight) {
                y = -y;
                if (spawningEnabled && !limitedto10) {
                    spawnIframe();
                    howMuchTo10 += 1;
                }
            }

            // Move the iframe
            iframe.style.left = rect.left + x + 'px';
            iframe.style.top = rect.top + y + 'px';
        }, 10);

        // Add the interval ID to the iframe so it can be cleared when removed
        iframe.dataset.intervalId = interval;
    }

    // Button to stop spawning new iframes
    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop Spawning Iframes';
    stopButton.style.position = 'fixed';
    stopButton.style.bottom = '50px';
    stopButton.style.left = '10px';
    stopButton.style.zIndex = '10000';
    stopButton.onclick = () => {
        spawningEnabled = false;
    };
    document.body.appendChild(stopButton);

    // Input box and button to set the iframe limit
    const limitInput = document.createElement('input');
    limitInput.type = 'number';
    limitInput.placeholder = 'Set IFrame Limit';
    limitInput.style.position = 'fixed';
    limitInput.style.bottom = '90px';
    limitInput.style.left = '10px';
    limitInput.style.zIndex = '10000';
    document.body.appendChild(limitInput);

    const limitButton = document.createElement('button');
    limitButton.textContent = 'Set Limit';
    limitButton.style.position = 'fixed';
    limitButton.style.bottom = '90px';
    limitButton.style.left = '140px';
    limitButton.style.zIndex = '10000';
    limitButton.onclick = () => {
        limitedto10 = true;
        howMuchTo10 = parseInt(limitInput.value) || 0;
    };
    document.body.appendChild(limitButton);

    // Button and input to change bounce speed
    const speedInput = document.createElement('input');
    speedInput.type = 'number';
    speedInput.placeholder = 'Set Bounce Speed';
    speedInput.style.position = 'fixed';
    speedInput.style.bottom = '130px';
    speedInput.style.left = '10px';
    speedInput.style.zIndex = '10000';
    document.body.appendChild(speedInput);

    const speedButton = document.createElement('button');
    speedButton.textContent = 'Set Speed';
    speedButton.style.position = 'fixed';
    speedButton.style.bottom = '130px';
    speedButton.style.left = '140px';
    speedButton.style.zIndex = '10000';
    speedButton.onclick = () => {
        bounceSpeed = parseFloat(speedInput.value) || 4;
    };
    document.body.appendChild(speedButton);

    // Button to remove the last iframe
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove Last Iframe';
    removeButton.style.position = 'fixed';
    removeButton.style.bottom = '10px';
    removeButton.style.left = '10px';
    removeButton.style.zIndex = '10000';
    removeButton.onclick = () => {
        const iframes = document.querySelectorAll('iframe');
        if (iframes.length > 0) {
            const lastIframe = iframes[iframes.length - 1];
            clearInterval(lastIframe.dataset.intervalId); // Clear the bouncing interval
            lastIframe.remove(); // Remove the iframe
            howMuchTo10 -= 1;
        }
    };
    document.body.appendChild(removeButton);

    // Start by spawning the first iframe
    spawnIframe();
})();