// ==UserScript==
// @name         MinerCoin Auto Claim Faucet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       alb3rt0_21
// @match        https://minercoin.site/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @description  Auto claim for MinerCoin faucet
// @downloadURL https://update.greasyfork.org/scripts/536631/MinerCoin%20Auto%20Claim%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/536631/MinerCoin%20Auto%20Claim%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uiPosition = {
        top: '600px',
        right: '70px'
    };

    const config = {
        selectors: {
            loginForm: 'form[action*="auth.controller.php"]',
            usernameInput: 'input[name="user"]',
            passwordInput: 'input[name="password"]',
            loginButton: 'button[name="login"]',
            claimButton: 'button[name="faucet"]',
            turnstileResponse: 'input[name="cf-turnstile-response"]',
            countdown: '.minutes, .seconds',
            waitVariable: 'wait',
            logoutButton: 'a[href*="logout"]'
        },
        timeouts: {
            afterLogin: 3000,
            afterClaim: 5000,
            checkInterval: 1000
        }
    };

    const state = {
        isRunning: true,
        claims: GM_getValue('claims', 0),
        credentials: GM_getValue('credentials', { username: '', password: '' })
    };

    function createUI() {
        GM_addStyle(`
            #faucetBotUI {
                position: fixed;
                top: ${uiPosition.top};
                right: ${uiPosition.right};
                width: 300px;
                background: #2c3e50;
                color: white;
                border-radius: 10px;
                padding: 15px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                z-index: 9999;
                font-family: Arial, sans-serif;
            }
            #faucetBotUI h3 {
                margin-top: 0;
                color: #f39c12;
                border-bottom: 1px solid #34495e;
                padding-bottom: 10px;
            }
            #faucetBotUI .status {
                margin: 10px 0;
                padding: 8px;
                border-radius: 5px;
                background: #34495e;
            }
            #faucetBotUI .credential-form input {
                width: 100%;
                padding: 8px;
                margin: 5px 0;
                border-radius: 4px;
                border: none;
            }
            #faucetBotUI .credential-form button {
                width: 100%;
                padding: 8px;
                margin: 5px 0;
                background: #f39c12;
                border: none;
                border-radius: 4px;
                color: white;
                cursor: pointer;
            }
            #faucetBotUI .stats {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
            }
            #faucetBotUI .next-claim {
                color: #f39c12;
                font-weight: bold;
            }
        `);

        const ui = document.createElement('div');
        ui.id = 'faucetBotUI';
        ui.innerHTML = `
            <h3>Auto Claim Faucet</h3>
            <div class="status" id="botStatus">Initializing...</div>
            ${!state.credentials.username ? `
                <div class="credential-form">
                    <input type="text" id="botUsername" placeholder="Username">
                    <input type="password" id="botPassword" placeholder="Password">
                    <button id="saveCredentials">Save Credentials</button>
                </div>
            ` : `
                <div class="stats">
                    <span>Claims: <span id="claimCount">${state.claims}</span></span>
                    <span class="next-claim" id="nextClaim">--:--</span>
                </div>
            `}
        `;
        document.body.appendChild(ui);

        if (state.credentials.username) {
            updateStatus('Checking login status...');
            updateNextClaim();
        }

        $('#saveCredentials').click(saveCredentials);
    }

    function saveCredentials() {
        state.credentials = {
            username: $('#botUsername').val(),
            password: $('#botPassword').val()
        };
        GM_setValue('credentials', state.credentials);
        $('#faucetBotUI .credential-form').remove();
        updateStatus('Credentials saved. Reloading...');
        setTimeout(() => location.reload(), 1000);
    }

    function updateStatus(message) {
        $('#botStatus').text(message);
    }

    function updateNextClaim() {
        const waitTime = getWaitTime();
        if (waitTime > 0) {
            const minutes = Math.floor(waitTime / 60);
            const seconds = waitTime % 60;
            $('#nextClaim').text(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
        } else {
            $('#nextClaim').text('Now');
        }
    }

    function getWaitTime() {
        return typeof window[config.selectors.waitVariable] !== 'undefined' ?
               window[config.selectors.waitVariable] : 0;
    }

    function incrementClaimCount() {
        state.claims++;
        GM_setValue('claims', state.claims);
        $('#claimCount').text(state.claims);
    }

    function isCaptchaSolved() {
        const tokenInput = $(config.selectors.turnstileResponse);
        return tokenInput.length && tokenInput.val().length > 10;
    }

    function isLoggedIn() {
        return $(config.selectors.logoutButton).length > 0;
    }

    function handleWaitAndClaim() {
        const waitTime = getWaitTime();

        if (waitTime > 0) {
            updateStatus(`Waiting ${waitTime} seconds...`);
            setTimeout(handleWaitAndClaim, config.timeouts.checkInterval);
            return;
        }

        if (isCaptchaSolved()) {
            makeClaim();
        } else {
            updateStatus('Waiting for captcha...');
            setTimeout(handleWaitAndClaim, config.timeouts.checkInterval);
        }
    }

    function makeClaim() {
        const claimButton = $(config.selectors.claimButton);

        if (claimButton.length && !claimButton.prop('disabled')) {
            claimButton.click();
            incrementClaimCount();
            updateStatus('Claim made. Reloading...');
            setTimeout(() => location.reload(), config.timeouts.afterClaim);
        } else {
            updateStatus('Claim button not available');
            setTimeout(handleWaitAndClaim, config.timeouts.checkInterval);
        }
    }

    function handleLogin() {
        const loginForm = $(config.selectors.loginForm);
        const usernameInput = $(config.selectors.usernameInput);
        const passwordInput = $(config.selectors.passwordInput);
        const loginButton = $(config.selectors.loginButton);

        if (loginForm.length && usernameInput.length && passwordInput.length && loginButton.length) {
            usernameInput.val(state.credentials.username);
            passwordInput.val(state.credentials.password);
            loginButton.click();
            updateStatus('Logging in...');
            setTimeout(() => {
                if (isLoggedIn()) {
                    updateStatus('Login successful. Redirecting...');
                    window.location.href = 'https://minercoin.site/faucet';
                } else {
                    updateStatus('Login failed. Retrying...');
                    handleLogin();
                }
            }, config.timeouts.afterLogin);
        } else {
            updateStatus('Login form not found');
            setTimeout(() => location.reload(), config.timeouts.checkInterval * 5);
        }
    }

    function initFaucetProcess() {
        setInterval(updateNextClaim, config.timeouts.checkInterval);
        handleWaitAndClaim();
    }

    function init() {
        createUI();

        if (!state.credentials.username) {
            updateStatus('Please enter your credentials');
            return;
        }

        if (!isLoggedIn()) {
            if (window.location.pathname.includes('/login') || window.location.pathname.includes('/auth')) {
                handleLogin();
            } else {
                updateStatus('Redirecting to login...');
                window.location.href = 'https://minercoin.site/login';
            }
        } else if (!window.location.pathname.includes('/faucet')) {
            updateStatus('Navigating to faucet...');
            window.location.href = 'https://minercoin.site/faucet';
        } else {
            initFaucetProcess();
        }
    }

    $(document).ready(init);
})();