// ==UserScript==
// @name         Doge Rocket follower
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Doge Rocket following your mouse every website
// @author       Dandelion75
// @license      GPL-3.0-or-later
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530280/Doge%20Rocket%20follower.user.js
// @updateURL https://update.greasyfork.org/scripts/530280/Doge%20Rocket%20follower.meta.js
// ==/UserScript==

/*
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

(function () {
    'use strict';

    // Configuration Variables
    const config = {
        minSpeed: 10,
        maxSpeed: 50,
        acceleration: 0.2,
        delay: 1000,
        startVisible: true,
        startFollowing: true,
        startKeyboardControl: false,
        rocketImage: 'https://www.memecoin.org/_next/static/media/doge_rocket.3fc8e2ac.gif',
        offsetXRight: -77,
        offsetXLeft: -37,
        offsetY: -85,
        easeThreshold: 100 // Added ease-out threshold
    };

    // Load settings from localStorage
    let settings = {
        followerEnabled: localStorage.getItem('dogeFollowerEnabled') !== 'false',
        rocketVisible: localStorage.getItem('dogeRocketVisible') !== 'false',
        keyboardControlEnabled: localStorage.getItem('dogeKeyboardControlEnabled') === 'true'
    };

    // Prevent duplicate rockets
    if (document.getElementById('doge-rocket-container')) return;

    // Create rocket container
    const dogeContainer = document.createElement('div');
    dogeContainer.id = 'doge-rocket-container';
    dogeContainer.style.position = 'absolute';
    dogeContainer.style.zIndex = '9999';
    dogeContainer.style.pointerEvents = 'none';
    dogeContainer.style.display = settings.rocketVisible ? 'block' : 'none';
    document.body.appendChild(dogeContainer);

    // Create rocket image
    const dogeRocketImg = document.createElement('img');
    dogeRocketImg.src = config.rocketImage;
    dogeRocketImg.style.width = '114px';
    dogeRocketImg.style.height = '64px';
    dogeContainer.appendChild(dogeRocketImg);
    dogeContainer.style.userSelect = 'none';
    dogeContainer.style.webkitUserSelect = 'none'; // For Safari
    dogeContainer.style.msUserSelect = 'none'; // For older IE/Edge


    // Position tracking variables
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let currentDirection = 1;
    const mousePositionQueue = [];

    // Updated position update with ease-out
    function updateDogePosition() {
        if (!settings.followerEnabled) return;

        let targetX = currentX;
        let targetY = currentY;

        // Process mouse queue
        while (mousePositionQueue.length > 0 && Date.now() - mousePositionQueue[0].time > config.delay) {
            ({x: targetX, y: targetY} = mousePositionQueue.shift());
        }

        // Calculate movement
        const deltaX = targetX - currentX;
        const deltaY = targetY - currentY;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        // Calculate base speed
        let currentSpeed = Math.min(
            config.minSpeed + distance * config.acceleration,
            config.maxSpeed
        );

        // Apply ease-out when approaching target
        if (distance < config.easeThreshold) {
            const easeFactor = distance / config.easeThreshold;
            currentSpeed *= easeFactor;
        }

        // Calculate movement components
        const angle = Math.atan2(deltaY, deltaX);
        const moveX = Math.cos(angle) * currentSpeed;
        const moveY = Math.sin(angle) * currentSpeed;

        // Update position
        currentX += moveX;
        currentY += moveY;

        // Update direction
        if (Math.abs(deltaX) > 1) {
            currentDirection = deltaX > 0 ? 1 : -1;
            dogeRocketImg.style.transform = `scaleX(${currentDirection})`;
        }

        // Apply final position with offsets
        const offsetX = currentDirection === 1 ? config.offsetXRight : config.offsetXLeft;
        dogeContainer.style.left = `${currentX + offsetX}px`;
        dogeContainer.style.top = `${currentY + config.offsetY}px`;
    }

    // Mouse movement handler
    document.addEventListener('mousemove', e => {
        mousePositionQueue.push({
            x: e.clientX + window.scrollX,
            y: e.clientY + window.scrollY,
            time: Date.now()
        });
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        updateDogePosition();
    }
    animate();

    // Keyboard controls (unchanged)
    document.addEventListener('keydown', e => {
        if (!settings.keyboardControlEnabled) return;

        const speed = config.minSpeed;
        switch (e.key) {
            case 'ArrowUp': currentY -= speed; break;
            case 'ArrowDown': currentY += speed; break;
            case 'ArrowLeft':
                currentX -= speed;
                currentDirection = -1;
                dogeRocketImg.style.transform = 'scaleX(-1)';
                break;
            case 'ArrowRight':
                currentX += speed;
                currentDirection = 1;
                dogeRocketImg.style.transform = 'scaleX(1)';
                break;
        }
    });

    // Toggle shortcuts (unchanged)
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.altKey && e.code === 'KeyF') {
            settings.rocketVisible = !settings.rocketVisible;
            dogeContainer.style.display = settings.rocketVisible ? 'block' : 'none';
            localStorage.setItem('dogeRocketVisible', settings.rocketVisible);
        }

    });

    // Handle dynamic content (unchanged)
    new MutationObserver(() => {
        if (!document.body.contains(dogeContainer)) {
            document.body.appendChild(dogeContainer);
        }
    }).observe(document.body, { childList: true });
})();