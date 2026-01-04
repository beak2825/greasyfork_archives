// ==UserScript==
// @name         Doubtnut Enhancer (Safe Version)
// @namespace    http://your.namespace/
// @version      1.2
// @description  Adds speed control and hides distractions on Doubtnut videos (safe, no auto-skip)
// @match        https://www.doubtnut.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534790/Doubtnut%20Enhancer%20%28Safe%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534790/Doubtnut%20Enhancer%20%28Safe%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentSpeed = 1.0;
    const speeds = [1.0, 1.5, 2.0];
    let cleanMode = false;
    let hiddenElements = [];

    // Create Speed Button
    const speedBtn = document.createElement('button');
    speedBtn.textContent = 'Speed: 1x';
    Object.assign(speedBtn.style, {
        fontSize: '18px', position: 'fixed', top: '70px', left: '20%',
        transform: 'translateX(-50%)', zIndex: '9999', backgroundColor: 'darkblue',
        color: 'white', border: '2px solid yellow', padding: '8px',
        borderRadius: '8px', cursor: 'pointer'
    });
    document.body.appendChild(speedBtn);

    speedBtn.addEventListener('click', () => {
        let index = speeds.indexOf(currentSpeed);
        index = (index + 1) % speeds.length;
        currentSpeed = speeds[index];
        speedBtn.textContent = `Speed: ${currentSpeed}x`;

        let video = document.querySelector('video');
        if (video) video.playbackRate = currentSpeed;
    });

    // Create Clean Button
    const cleanBtn = document.createElement('button');
    cleanBtn.textContent = '🧹 Clean: Off';
    Object.assign(cleanBtn.style, {
        fontSize: '18px', position: 'fixed', top: '110px', left: '20%',
        transform: 'translateX(-50%)', zIndex: '9999', backgroundColor: 'green',
        color: 'white', border: '2px solid white', padding: '8px',
        borderRadius: '8px', cursor: 'pointer'
    });
    document.body.appendChild(cleanBtn);

    cleanBtn.addEventListener('click', () => {
        cleanMode = !cleanMode;
        cleanBtn.textContent = cleanMode ? '🧹 Clean: On' : '🧹 Clean: Off';

        if (!cleanMode) {
            hiddenElements.forEach(el => el.style.display = '');
            hiddenElements = [];
        } else {
            document.querySelectorAll(
                '.bg-secondary.space-y-2.sm\\:px-6.rounded-2xl.relative.card, ' +
                '.space-y-4.lg\\:max-w-sm.pl-8.basis-1\\/4.lg\\:flex.hidden.grow.flex-col, ' +
                '.fill-primary.z-30.py-1.sm\\:px-28.px-5.flex-col.flex.bg-secondary.w-full, ' +
                'section.\\33 xl\\:max-w-full.\\32 xl\\:max-w-4xl.xl\\:max-w-screen-sm.lg\\:max-w-\\[536px\\].max-w-screen.my-0:nth-of-type(2), ' +
                '.overflow-x-auto.gap-2.justify-between.items-center.flex, ' +
                '.rounded-b-2xl.mb-2.w-full.h-16.bg-secondary.p-4, ' +
                'section.my-0:nth-of-type(1), ' +
                '#similar-questions-1, .static.text-center.max-w-full.prose, ' +
                '#knowledge-check, #similar-questions-2, ' +
                '.\\!pt-0.self-start.undefined.py-4.text-gray-700'
            ).forEach(el => {
                if (!hiddenElements.includes(el)) {
                    hiddenElements.push(el);
                    el.style.display = 'none';
                }
            });
        }
    });

    // Always apply current speed safely
    setInterval(() => {
        let video = document.querySelector('video');
        if (video && video.playbackRate !== currentSpeed) {
            video.playbackRate = currentSpeed;
            video.muted = false; // Always unmute (no forced mute)
        }
    }, 1000);

})();
