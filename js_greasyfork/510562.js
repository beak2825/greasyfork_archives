// ==UserScript==
// @name         It's Raining Mortogs
// @version      2025.01.08
// @description  It's always raining Mortogs
// @match        *://*.neopets.com/*
// @icon         https://images.neopets.com/new_shopkeepers/t_1900.gif
// @author       Posterboy
// @namespace    https://greasyfork.org/users/1277376
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/510562/It%27s%20Raining%20Mortogs.user.js
// @updateURL https://update.greasyfork.org/scripts/510562/It%27s%20Raining%20Mortogs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        fallingSpeed: 0.3, // Falling speed in seconds 0.3 is approximately what Neopets uses
        maxVisibleMortogs: 50, // Throttle limit of mortogs on screen at a time
        mortogsPerSecond: 50, // Mortogs to create per second

//images can be replaced with just standard neopets.com green mortogs if so desired

        mortogImages: [
            'https://i.imgur.com/CLxfgmq.png',
            'https://i.imgur.com/jbAzG1I.png',
            'https://i.imgur.com/TtBjq01.png',
            'https://i.imgur.com/VllQVFg.png',
            'https://i.imgur.com/DgNMTdR.png',
            'https://i.imgur.com/FvNreXu.png',
            'https://i.imgur.com/9MiYGQY.png',
            'https://i.imgur.com/M6KS8tS.png',
            'https://i.imgur.com/rUo8osf.png',
            'https://i.imgur.com/BhtUf2V.png',
            'https://i.imgur.com/ykkxh2o.png',
            'https://i.imgur.com/ji1aZPq.png'
        ]
    };

    // Preload images
    const mortogImages = config.mortogImages.map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });

    const mortogContainer = document.createElement('div');
    Object.assign(mortogContainer.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        pointerEvents: 'none',
        zIndex: '9999'
    });
    document.body.appendChild(mortogContainer);

    let currentMortogs = 0;

    function getRandomMortogImage() {
        const randomIndex = Math.floor(Math.random() * mortogImages.length);
        return mortogImages[randomIndex].src;
    }

    function createFallingMortog() {
        if (currentMortogs >= config.maxVisibleMortogs) return;

        const img = document.createElement('img');
        img.src = getRandomMortogImage();
        img.classList.add('falling-mortog');
        Object.assign(img.style, {
            position: 'absolute',
            top: '-100px',
            width: '100px',
            height: 'auto'
        });

        const viewportWidth = window.innerWidth;
        const leftOffset = (viewportWidth - viewportWidth * 0.9) / 2;
        const randomLeft = Math.floor(Math.random() * (viewportWidth * 0.9 - 100)) + leftOffset;
        img.style.left = `${randomLeft}px`;

        mortogContainer.appendChild(img);
        currentMortogs++;

        let startTime;
        function animate(time) {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const topPosition = Math.min((elapsed / (config.fallingSpeed * 1000)) * window.innerHeight, window.innerHeight);
            img.style.top = `${topPosition}px`;

            if (topPosition < window.innerHeight) {
                requestAnimationFrame(animate);
            } else {
                img.style.transition = 'opacity 0.5s';
                img.style.opacity = '0';
                setTimeout(() => {
                    img.remove();
                    currentMortogs--;
                }, 500);
            }
        }

        requestAnimationFrame(animate);
    }

    const interval = 1000 / config.mortogsPerSecond;
    let totalMortogs = config.mortogsPerSecond * config.duration;
    const intervalId = setInterval(() => {
        if (totalMortogs <= 0) {
            clearInterval(intervalId);
            return;
        }
        createFallingMortog();
        totalMortogs--;
    }, interval);
})();