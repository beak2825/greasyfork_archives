// ==UserScript==
// @name         WAX CPU Usage Indicator
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Show WAX CPU percentage used in top left corner
// @author       Xortrox
// @esversion:   6
// @match        https://play.arenaofglory.io/*
// @icon         https://play.arenaofglory.io/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440830/WAX%20CPU%20Usage%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/440830/WAX%20CPU%20Usage%20Indicator.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const API_URL = 'https://nftgaming.global.binfra.one/v1/chain';

    const walletAddressKey = 'user-script-wallet-address';
    let walletAddress = localStorage.getItem(walletAddressKey) || undefined;

    const cpuDivId = 'user-script-cpu';
    const walletInputId = 'user-script-wallet-address';
    const walletSaveButtonId = 'user-script-wallet-save';

    const cpuUpdateIntervalMS = 60000 * 5;

    async function getWaxAccount(accountName) {
        return (await fetch(`${API_URL}/get_account`, { method: 'POST', body: JSON.stringify({account_name: accountName}) })).json();
    }

    async function getWaxCPUPercentage(accountName) {
        const account = await getWaxAccount(accountName);

        return (account.cpu_limit.used / account.cpu_limit.max * 100).toFixed(2);
    }

    function touchCPUDiv() {
        const exists = document.getElementById(cpuDivId);

        if (!exists) {
            const div = document.createElement('div');
            div.id = cpuDivId;
            div.setAttribute('style', 'position: fixed; left: 5px; top: 5px; height: 25px; background: rgba(1,1,1,0.7); border: 1px solid limegreen; color: limegreen; padding: 3px; cursor: pointer;');

            const walletSaveButton = document.createElement('button');
            walletSaveButton.id = walletSaveButtonId;
            walletSaveButton.setAttribute('style', 'background: transparent; color: limegreen; height: 25px; cursor: pointer;');
            walletSaveButton.innerText = 'Save';
            walletSaveButton.addEventListener('click', () => {
                const walletInput = document.getElementById(walletInputId);
                localStorage.setItem(walletAddressKey, walletInput.value);
                walletAddress = localStorage.getItem(walletAddressKey) || undefined;
                updateCPUPercentage();
            });

            const walletInput = document.createElement('input');
            walletInput.id = walletInputId;
            walletInput.setAttribute('style', 'width: 100px; background: transparent; color: limegreen; height: 25px;');
            walletInput.setAttribute('data-lpignore', 'true');
            walletInput.setAttribute('type', 'text');
            walletInput.setAttribute('name', 'user-script-wallet');
            walletInput.setAttribute('placeholder', 'Wallet Address');
            walletInput.setAttribute('value', walletAddress);
            walletInput.addEventListener('input', () => {
                console.log('input', walletInput.value);
            });
            walletInput.addEventListener('blur', () => {
                console.log('blur', walletInput.value);
            });

            div.appendChild(walletSaveButton);

            div.appendChild(walletInput);

            const cpuSpan = document.createElement('span');
            cpuSpan.id = cpuDivId + '-span';
            cpuSpan.setAttribute('style', 'padding: 3px;');

            div.appendChild(cpuSpan);

            div.addEventListener('click', () => {
                updateCPUPercentage();
            });

            document.body.appendChild(div);
        }

        return document.getElementById(cpuDivId + '-span');
    }

    async function updateCPUPercentage() {
        if (!getUserScriptGlobals().gameVisible) {
            console.log('[AoG User Script]: Skipping CPU update as game was hidden.');
            return;
        }

        const div = touchCPUDiv();

        if (walletAddress) {
            div.innerText = `CPU usage: ${await getWaxCPUPercentage(walletAddress)}%`;
        }
    }

    function getUserScriptGlobals() {
        if (!window.UserScript) {
            window.UserScript = { gameVisible: true };
        }

        return window.UserScript;
    }

    function registerVisibilityChange() {
        document.addEventListener("visibilitychange", (event) => {
            const hidden = event?.target?.hidden
            getUserScriptGlobals().gameVisible = hidden !== undefined && hidden !== true;
        });
    }

    registerVisibilityChange();

    updateCPUPercentage();

    setInterval(updateCPUPercentage, cpuUpdateIntervalMS);
})();