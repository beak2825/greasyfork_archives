// ==UserScript==
// @name         FB Marketplace Auto Scroll (Simplified Input)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Auto-scroll halus ke bawah di FB Marketplace, input detik dan skala px disederhanakan (s dan x10). Cocok buat pemakaian santai dan responsif visual scroll-nya 😎
// @author       Behesty
// @match        https://www.facebook.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544310/FB%20Marketplace%20Auto%20Scroll%20%28Simplified%20Input%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544310/FB%20Marketplace%20Auto%20Scroll%20%28Simplified%20Input%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let scrolling = false;
    let scrollInterval;
    let uiInjected = false;

    function injectUI() {
        if (uiInjected) return;
        uiInjected = true;

        // Default values
        let intervalSec = 1; // in seconds
        let scrollUnit = 100; // will be multiplied by 10

        // UI container
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            background: '#18191a',
            color: '#fff',
            padding: '12px',
            zIndex: 9999,
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'Arial',
            boxShadow: '0 0 10px rgba(0,0,0,0.6)'
        });

        // Interval (s)
        const label1 = document.createElement('label');
        label1.textContent = 'Interval (s): ';
        container.appendChild(label1);

        const input = document.createElement('input');
        input.type = 'number';
        input.value = intervalSec;
        input.style.width = '60px';
        input.style.margin = '0 10px 0 5px';
        container.appendChild(input);

        // Scroll (unit x10 px)
        const label2 = document.createElement('label');
        label2.textContent = 'Scroll (x10 px): ';
        container.appendChild(label2);

        const stepInput = document.createElement('input');
        stepInput.type = 'number';
        stepInput.value = scrollUnit;
        stepInput.style.width = '50px';
        stepInput.style.marginLeft = '5px';
        container.appendChild(stepInput);

        // Start button
        const startBtn = document.createElement('button');
        startBtn.textContent = '▶️ Mulai';
        startBtn.style.margin = '0 5px';
        container.appendChild(startBtn);

        // Stop button
        const stopBtn = document.createElement('button');
        stopBtn.textContent = '⛔ Stop';
        container.appendChild(stopBtn);

        // Start scrolling
        startBtn.onclick = () => {
            if (scrolling) return;
            intervalSec = parseFloat(input.value) || 1;
            scrollUnit = parseInt(stepInput.value) || 100;

            let intervalMs = intervalSec * 1000;
            let scrollAmount = scrollUnit * 10;

            scrollInterval = setInterval(() => {
                window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            }, intervalMs);

            scrolling = true;
        };

        // Stop scrolling
        stopBtn.onclick = () => {
            clearInterval(scrollInterval);
            scrolling = false;
        };

        document.body.appendChild(container);
    }

    const checkInterval = setInterval(() => {
        if (window.location.href.includes("/marketplace/you/selling") && document.body) {
            injectUI();
            clearInterval(checkInterval);
        }
    }, 1000);
})();
