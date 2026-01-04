// ==UserScript==
// @name         FaucetEarner Auto-Claim PRO (Single Notification)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @license MIT
// @description  Automatic claiming for FaucetEarner.org with single notification
// @author       You
// @match        https://faucetearner.org/faucet.php
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/543399/FaucetEarner%20Auto-Claim%20PRO%20%28Single%20Notification%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543399/FaucetEarner%20Auto-Claim%20PRO%20%28Single%20Notification%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        claimInterval: 60500, // 60.5 seconds
        retryDelay: 3000,
        maxRetries: 20,
        notifyOnClaim: true,  // Enable desktop notifications
        playSound: false,     // Disable sound by default
        notificationId: 'faucet-earner-notification', // Fixed ID for replacing
        soundFile: 'https://www.soundjay.com/buttons/sounds/button-09.mp3'
    };

    // Statistics tracking
    let stats = {
        totalClaims: GM_getValue('totalClaims', 0),
        lastClaimTime: GM_getValue('lastClaimTime', null),
        errors: 0
    };

    // Audio for notification
    const audio = new Audio(config.soundFile);
    audio.volume = 0.3;

    function findClaimButton() {
        return document.getElementById('claimButton') ||
               document.querySelector('.claim-button') ||
               [...document.querySelectorAll('button')].find(btn =>
                   btn.textContent.includes('Claim Now'));
    }

    function clickClaimButton() {
        const button = findClaimButton();

        if (button && !button.disabled) {
            console.log('[Auto-Claim] Clicking claim button...');

            // Visual feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => button.style.transform = 'scale(1)', 200);

            // Actual click
            button.click();

            // Update stats
            stats.totalClaims++;
            stats.lastClaimTime = new Date().toISOString();
            GM_setValue('totalClaims', stats.totalClaims);
            GM_setValue('lastClaimTime', stats.lastClaimTime);

            // Single notification that replaces previous one
            if (config.notifyOnClaim) {
                GM_notification({
                    title: `Faucet Claimed! (Total: ${stats.totalClaims})`,
                    text: `Last claimed: ${new Date().toLocaleTimeString()}`,
                    silent: true,
                    id: config.notificationId, // This makes it replace previous
                    timeout: 3000 // 3 seconds
                });
            }

            if (config.playSound) {
                audio.currentTime = 0;
                audio.play().catch(e => console.log('Sound play failed:', e));
            }

            // Schedule next claim
            setTimeout(main, config.claimInterval);
            return true;
        }
        return false;
    }

    let retryCount = 0;
    function main() {
        console.log(`[Auto-Claim] Attempting claim (${retryCount}/${config.maxRetries})...`);

        if (clickClaimButton()) {
            retryCount = 0;
        } else {
            retryCount++;
            if (retryCount < config.maxRetries) {
                setTimeout(main, config.retryDelay);
            } else {
                console.log('[Auto-Claim] Max retries reached. Please reload page.');
                GM_notification({
                    title: 'Auto-Claim Error',
                    text: 'Could not find claim button',
                    id: config.notificationId,
                    timeout: 3000
                });
            }
        }
    }

    // Add stats panel to page
    function addStatsPanel() {
        const panelId = 'auto-claim-stats-panel';
        let panel = document.getElementById(panelId);

        if (!panel) {
            panel = document.createElement('div');
            panel.id = panelId;
            panel.style = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 9999;
                font-family: Arial;
                font-size: 14px;
                min-width: 200px;
            `;
            document.body.appendChild(panel);
        }

        panel.innerHTML = `
            <strong>Auto-Claim Stats</strong><br>
            Total Claims: ${stats.totalClaims}<br>
            Last Claim: ${stats.lastClaimTime ? new Date(stats.lastClaimTime).toLocaleTimeString() : 'Never'}<br>
            Next Claim: ${new Date(Date.now() + config.claimInterval).toLocaleTimeString()}
        `;

        // Update stats every second
        setTimeout(addStatsPanel, 1000);
    }

    // Initialize
    if (document.readyState === 'complete') {
        main();
        addStatsPanel();
    } else {
        window.addEventListener('load', () => {
            main();
            addStatsPanel();
        });
    }

    // Visual feedback styles
    const style = document.createElement('style');
    style.textContent = `
        #claimButton {
            animation: pulse 2s infinite;
            transition: transform 0.2s;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 255, 100, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(0, 255, 100, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 255, 100, 0); }
        }
    `;
    document.head.appendChild(style);
})();