// ==UserScript==
// @name         KickSkip - Jump to Timestamps on Kick.com Videos
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  copy, paste, and jump to specific video timestamps effortlessly.
// @match        https://kick.com/*/videos/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513468/KickSkip%20-%20Jump%20to%20Timestamps%20on%20Kickcom%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/513468/KickSkip%20-%20Jump%20to%20Timestamps%20on%20Kickcom%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
        .timestamp-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
            opacity: 0;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(2px);
        }

        .timestamp-overlay.visible {
            opacity: 1;
        }

        .timestamp-modal {
            background-color: #1a1a1a;
            border-radius: 12px;
            padding: 24px;
            width: 420px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
            text-align: center;
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.2s ease;
        }

        .timestamp-overlay.visible .timestamp-modal {
            opacity: 1;
            transform: scale(1);
        }

        .timestamp-header {
            position: relative;
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .timestamp-title {
            color: white;
            font-size: 18px;
            font-weight: 600;
            margin: 0;
            text-align: center;
        }

        .close-button {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #777;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }

        .close-button:hover {
            color: #fff;
        }

        .timestamp-form {
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
        }

        .input-group {
            display: flex;
            gap: 8px;
            justify-content: center;
        }

        .time-input {
            background-color: #2a2a2a;
            border: 1px solid #3a3a3a;
            border-radius: 8px;
            color: white;
            padding: 12px;
            width: 70px;
            text-align: center;
            font-size: 16px;
        }

        .time-input:focus {
            outline: none;
            border-color: #666;
            background-color: #333;
        }

        .time-input::placeholder {
            color: #666;
        }

        .time-input:focus::placeholder {
            color: #888;
        }

        .action-buttons {
            display: flex;
            gap: 12px;
            margin-top: 8px;
            width: 100%;
        }

        .timestamp-button {
            flex: 1;
            padding: 12px;
            border-radius: 8px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        }

        .primary-button {
            background-color: #1db954;
            color: black;
            width: 100%;
        }

        .primary-button:hover {
            background-color: #1ed760;
            transform: translateY(-1px);
        }

        .secondary-button {
            background-color: #2a2a2a;
            color: white;
        }

        .secondary-button:hover {
            background-color: #3a3a3a;
            transform: translateY(-1px);
        }

        .button-row {
            display: flex;
            gap: 8px;
            width: 100%;
        }

        .button-row .timestamp-button {
            flex: 1;
        }

        #custom-timestamp-button {
            background: none;
            border: none;
            width: 32px;
            height: 32px;
            padding: 0;
            cursor: pointer;
            fill: white;
            position: relative;
        }

        #custom-timestamp-button .tooltip {
            display: none;
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            background-color: white;
            color: black;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
            z-index: 10001;
        }

        #custom-timestamp-button:hover .tooltip {
            display: block;
        }

        .tooltip::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: white transparent transparent transparent;
        }

        .toast-message {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background-color: #1db954; /* Reverted back to original color */
            color: black;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10001;
            opacity: 0;
            transition: all 0.2s ease;
        }

        .toast-message.visible {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    `;

   let toastElement;
let toastTimeout;

function showToast(message, duration = 1200) {
    // If a toast is currently visible, clear the timeout and remove the toast
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    if (toastElement) {
        toastElement.remove();
    }

    // Create and display the new toast message
    toastElement = document.createElement('div');
    toastElement.className = 'toast-message';
    toastElement.textContent = message;
    document.body.appendChild(toastElement);

    // Trigger reflow to ensure the animation plays
    toastElement.offsetHeight;
    toastElement.classList.add('visible');

    // Set a timeout to hide and remove the toast
    toastTimeout = setTimeout(() => {
        toastElement.classList.remove('visible');
        // Wait for the fade-out animation to complete before removing
        setTimeout(() => {
            toastElement.remove();
            toastElement = null; // Reset the toast element reference
        }, 300);
    }, duration);
}


    function formatTime(seconds) {
        const d = Math.floor(seconds / (24 * 3600));
        const h = Math.floor((seconds % (24 * 3600)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return {
            days: String(d).padStart(2, '0'),
            hours: String(h).padStart(2, '0'),
            minutes: String(m).padStart(2, '0'),
            seconds: String(s).padStart(2, '0')
        };
    }

    function parseTimestamp(str) {
        const match = str.match(/^(\d+:)?(\d+:)?(\d+:)?(\d+)$/);
        if (!match) return null;

        const parts = str.split(':').map(Number);
        let seconds = 0;
        if (parts.length === 4) {
            seconds = parts[0] * 24 * 3600 + parts[1] * 3600 + parts[2] * 60 + parts[3];
        } else if (parts.length === 3) {
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            seconds = parts[0] * 60 + parts[1];
        } else {
            seconds = parts[0];
        }
        return seconds;
    }

    function createTimestampModal() {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div class="timestamp-overlay">
                <div class="timestamp-modal">
                    <div class="timestamp-header">
                        <h2 class="timestamp-title">Input Time</h2>
                        <button class="close-button">×</button>
                    </div>
                    <div class="timestamp-form">
                        <div class="input-group">
                            <input type="text" class="time-input" id="days" placeholder="DD" maxlength="2">
                            <input type="text" class="time-input" id="hours" placeholder="HH" maxlength="2">
                            <input type="text" class="time-input" id="minutes" placeholder="MM" maxlength="2">
                            <input type="text" class="time-input" id="seconds" placeholder="SS" maxlength="2">
                        </div>
                        <div class="button-row">
                            <button class="timestamp-button secondary-button" id="copy-current">Copy Current</button>
                            <button class="timestamp-button secondary-button" id="paste-timestamp">Paste</button>
                        </div>
                        <button class="timestamp-button primary-button" id="jump-to">Jump to Time</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const overlay = document.querySelector('.timestamp-overlay');
        const closeButton = document.querySelector('.close-button');
        const jumpButton = document.getElementById('jump-to');
        const copyCurrentButton = document.getElementById('copy-current');
        const pasteButton = document.getElementById('paste-timestamp');
        const inputs = document.querySelectorAll('.time-input');

        function showModal() {
            overlay.style.display = 'flex';
            overlay.offsetHeight; // Trigger reflow
            overlay.classList.add('visible');
        }

        function hideModal() {
            overlay.classList.remove('visible');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 200);
        }

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideModal();
            }
        });

        closeButton.addEventListener('click', () => {
            hideModal();
        });

        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 2 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });

            input.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });
        });

        jumpButton.addEventListener('click', () => {
            const videoPlayer = document.querySelector('video');
            if (!videoPlayer) return;

            const days = parseInt(document.getElementById('days').value) || 0;
            const hours = parseInt(document.getElementById('hours').value) || 0;
            const minutes = parseInt(document.getElementById('minutes').value) || 0;
            const seconds = parseInt(document.getElementById('seconds').value) || 0;

            const totalSeconds = (days * 24 * 3600) + (hours * 3600) + (minutes * 60) + seconds;
            if (totalSeconds >= 0) {
                videoPlayer.currentTime = totalSeconds;
                hideModal();
            }
        });

        copyCurrentButton.addEventListener('click', async () => {
            const videoPlayer = document.querySelector('video');
            if (!videoPlayer) return;

            const time = formatTime(videoPlayer.currentTime);
            const timeString = `${time.days}:${time.hours}:${time.minutes}:${time.seconds}`;

            try {
                await navigator.clipboard.writeText(timeString);
                showToast('Timestamp copied to clipboard');
            } catch (err) {
                showToast('Failed to copy timestamp');
            }
        });

        pasteButton.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                const seconds = parseTimestamp(text);

                if (seconds !== null) {
                    const time = formatTime(seconds);
                    document.getElementById('days').value = time.days;
                    document.getElementById('hours').value = time.hours;
                    document.getElementById('minutes').value = time.minutes;
                    document.getElementById('seconds').value = time.seconds;
                    showToast('Timestamp pasted');
                } else {
                    showToast('Invalid timestamp format');
                }
            } catch (err) {
                showToast('Failed to paste timestamp');
            }
        });

        return { overlay, showModal, hideModal };
    }

    function addTimestampButton() {
        const controlsContainer = document.querySelector('.z-controls .flex.flex-row.items-center.gap-2');
        if (controlsContainer && !document.getElementById('custom-timestamp-button')) {
            const button = document.createElement('button');
            button.id = 'custom-timestamp-button';
            button.innerHTML =
                `<img src="https://i.ibb.co/nP8sLjf/kickship.png" alt="Logo" style="width: 36px; height: 36px; margin: 0 auto; display: block;" />` +
                `<div class="tooltip">KickSkip</div>`;

            // Add styles for the button to align it correctly
            button.style.display = "flex";
            button.style.alignItems = "center";
            button.style.justifyContent = "center";
            button.style.width = "36px"; // Set the width of the button
            button.style.height = "36px"; // Set the height of the button
            button.style.margin = "0 4px"; // Adjust margin as needed

            button.addEventListener('click', function() {
                const { showModal } = createTimestampModal();
                showModal();
            });

            // Find the clip button using its SVG path and place the new button before it
            const clipButton = Array.from(controlsContainer.querySelectorAll('button')).find(button =>
                button.querySelector('svg path[d="M1.82739 7.28856L27.0598 1.71777L28.2433 7.07867L3.01097 12.6495L1.82739 7.28856ZM3.03003 28.9699V13.6999H28.96V28.9699H3.03003ZM19.98 21.3299L13.47 16.7299V25.9299L19.98 21.3299Z"]')
            );

            if (clipButton) {
                controlsContainer.insertBefore(button, clipButton);
            } else {
                controlsContainer.appendChild(button); // Fallback if clip button not found
            }
        }
    }

    // Add styles
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Observe changes in the controls container
    const observer = new MutationObserver((mutations, obs) => {
        addTimestampButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial call to add the button if controls are already loaded
    addTimestampButton();

})();
