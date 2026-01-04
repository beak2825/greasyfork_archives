// ==UserScript==
// @name         Simple Calendly Tennis Monitor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Monitor Calendly tennis class availability
// @match        https://calendly.com/santitennis*
// @grant        GM_notification
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527864/Simple%20Calendly%20Tennis%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/527864/Simple%20Calendly%20Tennis%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let monitorInterval = null;
    const CHECK_INTERVAL = 60000; // Check every 60 seconds
    const AUDIO_URL = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_99b282eb1c.mp3?filename=notification-sound-7062.mp3';

    // Simple UI
    const COLORS = {
        primary: '#1a365d',
        success: '#22c55e',
    };

    // Toast notifications
    class ToastSystem {
        constructor() {
            this.container = document.createElement('div');
            this.container.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
            `;
            document.body.appendChild(this.container);
        }

        show(message, type = 'info', duration = 3000) {
            const toast = document.createElement('div');
            toast.style.cssText = `
                background: ${type === 'success' ? COLORS.success : COLORS.primary};
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                margin-top: 8px;
                font-family: -apple-system, system-ui, sans-serif;
                font-size: 14px;
            `;
            toast.textContent = message;
            this.container.appendChild(toast);

            if (duration > 0) {
                setTimeout(() => toast.remove(), duration);
            }
            return toast;
        }
    }

    function findAvailableTimeSlot() {
        const buttons = document.querySelectorAll('button');
        return Array.from(buttons).find(button =>
            !button.disabled && button.getAttribute('aria-label')?.includes('Horas disponibles')
        );
    }

    function playNotificationSound() {
        const audio = new Audio(AUDIO_URL);
        audio.play();
    }

    function checkAvailability() {
        const availableButton = findAvailableTimeSlot();

        if (availableButton) {
            if (Notification.permission === "granted") {
                new Notification("Tennis Class Available!", {
                    body: "New slots available!",
                    requireInteraction: true
                });
            }
            toastSystem.show('Slots Available!', 'success', 0);
            monitorButton.style.background = COLORS.success;
            playNotificationSound();
        }
    }

    function toggleMonitoring() {
        if (monitorInterval) {
            clearInterval(monitorInterval);
            monitorInterval = null;
            monitorButton.textContent = '▶️';
            toastSystem.show('Monitoring stopped', 'info');
            monitorButton.style.background = COLORS.primary;
        } else {
            if (Notification.permission === "default") {
                Notification.requestPermission();
            }

            checkAvailability();
            monitorInterval = setInterval(checkAvailability, CHECK_INTERVAL);
            monitorButton.textContent = '⏸️';
            toastSystem.show('Monitoring started', 'success');
        }
    }

    // Create minimal UI
    const monitorButton = document.createElement('button');
    monitorButton.textContent = '▶️';
    monitorButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: ${COLORS.primary};
        color: white;
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        z-index: 10000;
    `;
    monitorButton.onclick = toggleMonitoring;
    document.body.appendChild(monitorButton);

    const toastSystem = new ToastSystem();
})();