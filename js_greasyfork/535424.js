// ==UserScript==
// @name         Powerline.io Follow Mouse Cursor "Hacks"
// @namespace    http://tampermonkey.net/
// @version      1.91
// @author Heptatron
// @description  Move snake toward mouse using separate timers for WASD based on angle, togglable with space key, display precise mouse angle and visual guides, with a settings menu and shift-based angle locking.
// @match        *://powerline.io/*
// @license         MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535424/Powerlineio%20Follow%20Mouse%20Cursor%20%22Hacks%22.user.js
// @updateURL https://update.greasyfork.org/scripts/535424/Powerlineio%20Follow%20Mouse%20Cursor%20%22Hacks%22.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let frequency = 13; // presses per second
    let baseInterval = 1000 / frequency; // 50ms for 20Hz
    let angleStepIncrement = 10;
    let angleLockValue = 90;
    let isShiftKeyPressed = false;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentAngle = 0;

    const keyTimers = {
        W: { last: 0, delay: Infinity },
        A: { last: 0, delay: Infinity },
        S: { last: 0, delay: Infinity },
        D: { last: 0, delay: Infinity }
    };

    let isActive = false; // Flag to track whether the functionality is active or not
    let angleCanvas;
    let ctx;
    let angleDisplay;
    let settingsMenu;
    let frequencyInput;
    let angleStepInput;
    let angleLockInput;

    function createSettingsMenu() {
        settingsMenu = document.createElement('div');
        settingsMenu.style.position = 'fixed';
        settingsMenu.style.top = '10px';
        settingsMenu.style.left = '10px';
        settingsMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        settingsMenu.style.color = 'white';
        settingsMenu.style.padding = '10px';
        settingsMenu.style.borderRadius = '5px';
        settingsMenu.style.zIndex = '2000';
        settingsMenu.style.fontFamily = 'sans-serif';
        settingsMenu.style.fontSize = '12px';

        const freqLabel = document.createElement('label');
        freqLabel.textContent = 'Frequency: ';
        frequencyInput = document.createElement('input');
        frequencyInput.type = 'number';
        frequencyInput.value = frequency;
        frequencyInput.style.width = '50px';
        frequencyInput.addEventListener('change', updateFrequency);

        const angleStepLabel = document.createElement('label');
        angleStepLabel.textContent = 'Angle Step (°): ';
        angleStepInput = document.createElement('input');
        angleStepInput.type = 'number';
        angleStepInput.value = angleStepIncrement;
        angleStepInput.style.width = '50px';
        angleStepInput.addEventListener('change', updateAngleStep);

        const angleLockLabel = document.createElement('label');
        angleLockLabel.textContent = 'Angle Lock (°): ';
        angleLockInput = document.createElement('input');
        angleLockInput.type = 'number';
        angleLockInput.value = angleLockValue;
        angleLockInput.style.width = '50px';
        angleLockInput.addEventListener('change', updateAngleLockValue);

        settingsMenu.appendChild(freqLabel);
        settingsMenu.appendChild(frequencyInput);
        settingsMenu.appendChild(document.createElement('br'));
        settingsMenu.appendChild(angleStepLabel);
        settingsMenu.appendChild(angleStepInput);
        settingsMenu.appendChild(document.createElement('br'));
        settingsMenu.appendChild(angleLockLabel);
        settingsMenu.appendChild(angleLockInput);

        document.body.appendChild(settingsMenu);
    }

    function updateFrequency() {
        const newFrequency = parseInt(frequencyInput.value, 10);
        if (!isNaN(newFrequency) && newFrequency > 0) {
            frequency = newFrequency;
            baseInterval = 1000 / frequency;
        } else {
            frequencyInput.value = frequency;
        }
    }

    function updateAngleStep() {
        const newAngleStep = parseInt(angleStepInput.value, 10);
        if (!isNaN(newAngleStep) && newAngleStep >= 0) {
            angleStepIncrement = newAngleStep;
        } else {
            angleStepInput.value = angleStepIncrement;
        }
    }

    function updateAngleLockValue() {
        const newAngleLock = parseInt(angleLockInput.value, 10);
        if (!isNaN(newAngleLock) && newAngleLock >= 0) {
            angleLockValue = newAngleLock;
        } else {
            angleLockInput.value = angleLockValue;
        }
    }

    // --- Angle Display Functions ---
    function createAngleDisplay() {
        angleDisplay = document.createElement('div');
        angleDisplay.style.position = 'fixed';
        angleDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        angleDisplay.style.color = 'white';
        angleDisplay.style.padding = '5px';
        angleDisplay.style.borderRadius = '5px';
        angleDisplay.style.zIndex = '1000';
        angleDisplay.style.fontFamily = 'sans-serif';
        angleDisplay.style.fontSize = '12px';
        document.body.appendChild(angleDisplay);
    }

    function updateAngleDisplay() {
        if (angleDisplay) {
            const degrees = currentAngle * 180 / Math.PI;
            angleDisplay.textContent = `${degrees.toFixed(1)}°`;
            angleDisplay.style.left = mouseX + 10 + 'px';
            angleDisplay.style.top = mouseY + 10 + 'px';
        }
    }

    // --- Angle Canvas Functions ---
    function createAngleCanvas() {
        angleCanvas = document.createElement('canvas');
        angleCanvas.style.position = 'fixed';
        angleCanvas.style.top = '0';
        angleCanvas.style.left = '0';
        angleCanvas.style.width = '100vw';
        angleCanvas.style.height = '100vh';
        angleCanvas.style.pointerEvents = 'none';
        angleCanvas.style.zIndex = '999';
        document.body.appendChild(angleCanvas);
        ctx = angleCanvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        if (angleCanvas) {
            angleCanvas.width = window.innerWidth;
            angleCanvas.height = window.innerHeight;
            drawAngleLines();
        }
    }

    function drawAngleLines() {
        if (!ctx) return;

        ctx.clearRect(0, 0, angleCanvas.width, angleCanvas.height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        const centerX = angleCanvas.width / 2;
        const centerY = angleCanvas.height / 2;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

        // Function to draw a line at a given angle
        function drawLine(angleRad) {
            const endX = centerX + maxDistance * Math.cos(angleRad);
            const endY = centerY + maxDistance * Math.sin(angleRad);

            // Calculate the starting point on the opposite side
            const startX = centerX - (endX - centerX);
            const startY = centerY - (endY - centerY);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }

        drawLine(0);
        drawLine(Math.PI / 4);
        drawLine(Math.PI / 2);
        drawLine(-Math.PI / 4);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateAngle();
        if (angleDisplay && isActive) {
            updateAngleDisplay();
        }
    });

    function updateAngle() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        let dx = mouseX - centerX;
        let dy = mouseY - centerY;
        let rawAngleDegrees = Math.atan2(dy, dx) * 180 / Math.PI;

        if (isShiftKeyPressed && angleLockValue > 0) {
            rawAngleDegrees = Math.round(rawAngleDegrees / angleLockValue) * angleLockValue;
        } else if (angleStepIncrement > 0) {
            rawAngleDegrees = Math.round(rawAngleDegrees / angleStepIncrement) * angleStepIncrement;
        }

        currentAngle = rawAngleDegrees * Math.PI / 180;

        const originalDistance = Math.sqrt(dx * dx + dy * dy) || 1;
        dx = originalDistance * Math.cos(currentAngle);
        dy = originalDistance * Math.sin(currentAngle);
        mouseX = centerX + dx;
        mouseY = centerY + dy;
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Spacebar') { // Toggle active state
            isActive = !isActive;
            if (isActive && !angleCanvas) {
                createAngleCanvas();
                drawAngleLines();
            } else if (!isActive && angleCanvas) {
                document.body.removeChild(angleCanvas);
                angleCanvas = null;
                ctx = null;
                window.removeEventListener('resize', resizeCanvas);
            }
            if (isActive && !angleDisplay) {
                createAngleDisplay();
                updateAngleDisplay();
            } else if (isActive && angleDisplay) {
                updateAngleDisplay();
            } else if (!isActive && angleDisplay) {
                document.body.removeChild(angleDisplay);
                angleDisplay = null;
            }
        } else if (e.key === 'Shift') {
            isShiftKeyPressed = true;
            updateAngle();
            if (angleDisplay && isActive) {
                updateAngleDisplay();
            }
        }
    });

    document.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') {
        isShiftKeyPressed = false;


        updateAngle();

        if (angleDisplay && isActive) {
            updateAngleDisplay();
        }
    }
});


    function sendKey(key) {
        const keyCode = key.charCodeAt(0);
        const down = new KeyboardEvent("keydown", { bubbles: true });
        Object.defineProperty(down, 'keyCode', { get: () => keyCode });
        Object.defineProperty(down, 'which', { get: () => keyCode });
        Object.defineProperty(down, 'key', { get: () => key });
        Object.defineProperty(down, 'code', { get: () => 'Key' + key });
        document.dispatchEvent(down);

        const up = new KeyboardEvent("keyup", { bubbles: true });
        Object.defineProperty(up, 'keyCode', { get: () => keyCode });
        Object.defineProperty(up, 'which', { get: () => keyCode });
        Object.defineProperty(up, 'key', { get: () => key });
        Object.defineProperty(up, 'code', { get: () => 'Key' + key });
        document.dispatchEvent(up);
    }

    function updateDelays() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const dx = mouseX - centerX;
        const dy = mouseY - centerY;

        const magnitude = Math.sqrt(dx * dx + dy * dy) || 1;
        const unitX = dx / magnitude;
        const unitY = dy / magnitude;


        keyTimers.W.delay = unitY < 0 ? baseInterval / Math.abs(unitY) : Infinity;
        keyTimers.S.delay = unitY > 0 ? baseInterval / Math.abs(unitY) : Infinity;


        keyTimers.A.delay = unitX < 0 ? baseInterval / Math.abs(unitX) : Infinity;
        keyTimers.D.delay = unitX > 0 ? baseInterval / Math.abs(unitX) : Infinity;
    }

    setInterval(() => {
        if (isActive) {
            updateDelays();

            const now = Date.now();
            for (const key in keyTimers) {
                const timer = keyTimers[key];
                if (now - timer.last >= timer.delay) {
                    timer.last = now;
                    sendKey(key);
                }
            }
        }
    }, 1);

    createSettingsMenu();

    updateAngle();
})();