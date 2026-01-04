// ==UserScript==
// @name         Krunker Aimbot
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a predictive aimbot to Krunker.io for mobile browsers
// @author       You
// @match        https://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473392/Krunker%20Aimbot.user.js
// @updateURL https://update.greasyfork.org/scripts/473392/Krunker%20Aimbot.meta.js
// ==/UserScript==

(function() {
    const delay = 10; // Delay in milliseconds
    const target = "head"; // Target area: "head", "body", or "any"
    let lastTargetX = 0;
    let lastTargetY = 0;

    const canvas = document.getElementById("gameCanvas");

    function aimAtPredictive(targetX, targetY) {
        const targetElement = document.querySelector(`.${target}`);
        if (!targetElement) return;

        const targetRect = targetElement.getBoundingClientRect();
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;

        const velocityX = (targetCenterX - lastTargetX) / delay;
        const velocityY = (targetCenterY - lastTargetY) / delay;

        const predictedX = targetX + (velocityX * delay);
        const predictedY = targetY + (velocityY * delay);

        const event = new TouchEvent("touchmove", {
            touches: [{ clientX: predictedX, clientY: predictedY }],
            target: canvas,
            bubbles: true,
            cancelable: true
        });
        canvas.dispatchEvent(event);

        lastTargetX = targetCenterX;
        lastTargetY = targetCenterY;
    }

    function getRandomDelay() {
        return Math.random() * delay;
    }

    function getRandomTargetPosition() {
        const targetElement = document.querySelector(`.${target}`);
        if (!targetElement) return null;

        const targetRect = targetElement.getBoundingClientRect();
        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;

        return { x: centerX, y: centerY };
    }

    setInterval(() => {
        const targetPosition = getRandomTargetPosition();
        if (targetPosition) {
            aimAtPredictive(targetPosition.x, targetPosition.y);
        }
    }, delay + getRandomDelay());
})();
