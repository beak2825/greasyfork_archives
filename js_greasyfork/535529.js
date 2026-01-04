// ==UserScript==
// @name         Claimcoin AutoClaim
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Simple auto-claim with antibot detection
// @author       @alb3rt0_21
// @match        *://claimcoin.in/faucet
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/535529/Claimcoin%20AutoClaim.user.js
// @updateURL https://update.greasyfork.org/scripts/535529/Claimcoin%20AutoClaim.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const config = {
        checkInterval: 1000,
        minClaimDelay: 8000,
        panelPosition: {
            right: '10px',
            bottom: '700px'
        },
        antibotCheckInterval: 500
    };
    let claims = GM_getValue('totalClaims', 0);
    let lastClaimTime = 0;
    let isClaiming = false;
    let hasAntibot = false;
    let antibotSolved = false;

    function createPanel() {
        GM_addStyle(`
            #claimcoin-panel {
                position: fixed;
                right: ${config.panelPosition.right};
                bottom: ${config.panelPosition.bottom};
                background: rgba(20, 20, 20, 0.95);
                color: #e0e0e0;
                border-radius: 8px;
                padding: 12px;
                font-family: Arial;
                font-size: 13px;
                z-index: 9999;
                border: 1px solid #333;
                min-width: 120px;
            }
            #claimcoin-title {
                font-weight: bold;
                color: #4CAF50;
                margin-bottom: 5px;
            }
            #claimcoin-count {
                color: #FFC107;
                margin: 5px 0;
                font-weight: bold;
            }
            #claimcoin-status {
                min-height: 20px;
            }
            .highlight { color: #4CAF50; }
            .warning { color: #FF9800; }
            .error { color: #F44336; }
        `);
        const panel = document.createElement('div');
        panel.id = 'claimcoin-panel';
        panel.innerHTML = `
            <div id="claimcoin-title">AutoClaim</div>
            <div id="claimcoin-count">Claims: ${claims}</div>
            <div id="claimcoin-status">Starting...</div>
            <div id="claimcoin-antibot-status" class="warning" style="margin-top: 5px; font-size: 11px;"></div>
        `;
        document.body.appendChild(panel);
    }

    function updateStatus(message, type = 'normal') {
        const statusEl = document.getElementById('claimcoin-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = '';
            if (type !== 'normal') statusEl.classList.add(type);
        }
    }

    function updateAntibotStatus(message, type = 'normal') {
        const statusEl = document.getElementById('claimcoin-antibot-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = type !== 'normal' ? type : 'warning';
        }
    }

    function checkForAntibot() {
        const hasAntibotCode = document.body.innerHTML.includes('var ablinks =') ||
                               document.body.innerHTML.includes('var ablinks=');

        const isSolved = document.querySelector('.captcha-solver img[src*="success.png"]') !== null;

        if (hasAntibotCode) {
            hasAntibot = true;
            if (isSolved) {
                antibotSolved = true;
                updateAntibotStatus("Antibot solved!", "highlight");
            } else {
                antibotSolved = false;
                updateAntibotStatus("Antibot detected! Waiting for solution...", "error");
            }
        } else {
            hasAntibot = false;
            antibotSolved = true;
            updateAntibotStatus("No antibot detected", "highlight");
        }

        return antibotSolved;
    }

    function attemptClaim() {
        if (isClaiming) return;

        if (!checkForAntibot()) {
            updateStatus("Waiting for antibot solution...", "warning");
            return;
        }

        const now = Date.now();
        const waitTime = typeof wait !== 'undefined' ? wait : 0;

        if (waitTime > 0) {
            updateStatus(`Next in: ${waitTime}s`);
            return;
        }

        if (now - lastClaimTime < config.minClaimDelay) {
            const remaining = Math.ceil((config.minClaimDelay - (now - lastClaimTime))/1000);
            updateStatus(`Wait: ${remaining}s`);
            return;
        }

        const btn = document.querySelector('.claim-button:not([disabled])');
        if (btn && btn.innerText.includes('Collect your reward')) {
            isClaiming = true;
            updateStatus("Claiming...", "highlight");
            btn.click();
            claims++;
            GM_setValue('totalClaims', claims);
            document.getElementById('claimcoin-count').textContent = `Claims: ${claims}`;
            lastClaimTime = Date.now();
            isClaiming = false;
            updateStatus("Claimed! Waiting...");
        } else {
            updateStatus("Waiting Active Button");
        }
    }

    createPanel();
    checkForAntibot();
    setInterval(attemptClaim, config.checkInterval);
    setInterval(checkForAntibot, config.antibotCheckInterval);
})();