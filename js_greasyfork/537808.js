// ==UserScript==
// @name         Chess.com Clock Enhancer - Right Side
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Makes chess.com clock readable with enhanced 3D effect, positioned on right side
// @author       You
// @match        https://www.chess.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537808/Chesscom%20Clock%20Enhancer%20-%20Right%20Side.user.js
// @updateURL https://update.greasyfork.org/scripts/537808/Chesscom%20Clock%20Enhancer%20-%20Right%20Side.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS styles
    const styles = `
        /* Custom clock container on the right side */
        #custom-clock-container {
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            z-index: 9999;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            min-width: 200px;
        }

        /* Individual clock styling */
        .custom-clock {
            margin: 15px 0;
            text-align: center;
            padding: 15px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
            perspective: 200px;
        }

        .custom-clock.active {
            background: rgba(255, 255, 255, 0.1);
            transform: scale(1.05);
        }

        .custom-clock.inactive {
            opacity: 0.4;
            filter: grayscale(1);
        }

        /* Player labels */
        .custom-clock-label {
            font-size: 1rem;
            color: #ccc;
            margin-bottom: 8px;
            font-family: Arial, sans-serif;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Clock time display */
        .custom-clock-time {
            font-size: 16rem !important;
            color: #fff9d6 !important;
            font-family: "Garamond", serif !important;
            font-weight: bold !important;
            line-height: 1em !important;
            text-shadow:
                1px 1px 0 #f5eed6,
                2px 2px 0 #e0d6b3,
                3px 3px 0 #c0b693,
                4px 4px 0 #a09673,
                5px 5px 0 #c59673,
                6px 6px 0 #8b7355,
                7px 7px 0 #705d44,
                8px 8px 0 #594a37,
                -2px -2px 0 #000, 2px -2px 0 #000,
                -2px 2px 0 #000, 2px 2px 0 #000,
                -3px 0 0 #000, 3px 0 0 #000,
                0 -3px 0 #000, 0 3px 0 #000;
            transform: rotateY(-3deg);
            transform-style: preserve-3d;
            transition: all 0.3s ease;
        }

        /* Low time styling */
        .custom-clock.low-time .custom-clock-time {
            color: #FF3333 !important;
            text-shadow:
                1px 1px 0 #ff6666,
                2px 2px 0 #ff4d4d,
                3px 3px 0 #cc0000,
                4px 4px 0 #990000,
                5px 5px 0 #cc3333,
                6px 6px 0 #aa1111,
                7px 7px 0 #880000,
                8px 8px 0 #660000,
                -2px -2px 0 #000, 2px -2px 0 #000,
                -2px 2px 0 #000, 2px 2px 0 #000,
                -3px 0 0 #000, 3px 0 0 #000,
                0 -3px 0 #000, 0 3px 0 #000;
            animation: pulseColor 1.5s infinite ease-in-out;
        }

        /* Pulse animation */
        @keyframes pulseColor {
            0% {
                color: #FF3333;
                transform: rotateY(-3deg) scale(1);
            }
            50% {
                color: #FF6666;
                transform: rotateY(-3deg) scale(1.02);
            }
            100% {
                color: #FF3333;
                transform: rotateY(-3deg) scale(1);
            }
        }

        /* Hide original clocks to avoid confusion */
        .clock-component {
            display: none !important;
        }

        /* Make container draggable */
        #custom-clock-container.dragging {
            cursor: grabbing;
        }

        #custom-clock-container:hover {
            cursor: grab;
        }
    `;

    // Add styles to the document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    let customClockContainer = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // Create custom clock container
    function createCustomClockContainer() {
        if (customClockContainer) return;

        customClockContainer = document.createElement('div');
        customClockContainer.id = 'custom-clock-container';
        customClockContainer.innerHTML = `
            <div class="custom-clock" id="custom-clock-white">
                <div class="custom-clock-label">White</div>
                <div class="custom-clock-time">--:--</div>
            </div>
            <div class="custom-clock" id="custom-clock-black">
                <div class="custom-clock-label">Black</div>
                <div class="custom-clock-time">--:--</div>
            </div>
        `;

        document.body.appendChild(customClockContainer);

        // Add drag functionality
        customClockContainer.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    // Drag functionality
    function startDrag(e) {
        isDragging = true;
        customClockContainer.classList.add('dragging');
        const rect = customClockContainer.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        customClockContainer.style.left = `${x}px`;
        customClockContainer.style.top = `${y}px`;
        customClockContainer.style.right = 'auto';
        customClockContainer.style.transform = 'none';
    }

    function stopDrag() {
        isDragging = false;
        if (customClockContainer) {
            customClockContainer.classList.remove('dragging');
        }
    }

    // Function to update custom clocks
    function updateCustomClocks() {
        if (!customClockContainer) return;

        const originalClocks = document.querySelectorAll('.clock-component');

        // Hide container if no clocks are found (not in a game)
        if (originalClocks.length < 2) {
            customClockContainer.style.display = 'none';
            return;
        } else {
            customClockContainer.style.display = 'block';
        }

        const whiteCustomClock = document.getElementById('custom-clock-white');
        const blackCustomClock = document.getElementById('custom-clock-black');

        originalClocks.forEach((clock, index) => {
            const timeElement = clock.querySelector('.clock-time-monospace');
            if (!timeElement) return;

            const timeText = timeElement.textContent.trim();
            const isActive = clock.classList.contains('clock-player-turn');

            // Determine which clock this is (white is typically first/bottom, black is second/top)
            const targetClock = index === 0 ? whiteCustomClock : blackCustomClock;
            const customTimeElement = targetClock.querySelector('.custom-clock-time');

            if (customTimeElement) {
                customTimeElement.textContent = timeText;

                // Update active state
                if (isActive) {
                    targetClock.classList.add('active');
                    targetClock.classList.remove('inactive');
                } else {
                    targetClock.classList.remove('active');
                    targetClock.classList.add('inactive');
                }

                // Check for low time
                const timeParts = timeText.split(':');
                let totalSeconds;

                if (timeParts.length === 2) {
                    totalSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
                } else {
                    totalSeconds = parseInt(timeText);
                }

                if (!isNaN(totalSeconds) && totalSeconds < 10) {
                    targetClock.classList.add('low-time');
                } else {
                    targetClock.classList.remove('low-time');
                }
            }
        });
    }

    // Initialize when page loads
    function initialize() {
        // Wait a bit for the page to load
        setTimeout(() => {
            createCustomClockContainer();
            updateCustomClocks();
        }, 1000);
    }

    // Check for clocks and update every 100ms
    setInterval(() => {
        if (!customClockContainer) {
            createCustomClockContainer();
        }
        updateCustomClocks();
    }, 100);

    // Initialize
    initialize();

    // Re-initialize when navigating (for single-page app behavior)
    let currentUrl = location.href;
    setInterval(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            setTimeout(initialize, 500);
        }
    }, 1000);
})();