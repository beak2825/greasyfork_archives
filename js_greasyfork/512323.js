// ==UserScript==
// @name         Rain.GG Case Battle Verifier
// @namespace    https://gge.gg
// @version      1.11
// @description  Verify case battle fairness directly on the site.
// @match        https://rain.gg/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/hmac-sha512.min.js
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rain.gg
// @license      WTFPL
// @author       twitter.com/thes0meguy
// @downloadURL https://update.greasyfork.org/scripts/512323/RainGG%20Case%20Battle%20Verifier.user.js
// @updateURL https://update.greasyfork.org/scripts/512323/RainGG%20Case%20Battle%20Verifier.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function waitForModal() {
        const modal = document.getElementById('modal_window');
        if (modal && !modal.dataset.verifierInjected) {
            injectVerifier(modal);
            modal.dataset.verifierInjected = 'true';
        }
    }

    const modalCheckInterval = setInterval(waitForModal, 500);

    function injectVerifier(modal) {
        let serverSeed = getInputValueByLabelText(modal, 'Server seed');
        let eosBlockHash = getInputValueByLabelText(modal, 'EOS block hash');

        if (!serverSeed || !eosBlockHash) {
            console.warn('Could not automatically find Server seed or EOS block hash.');
            return;
            serverSeed = prompt('Please enter the Server seed:', '');
            eosBlockHash = prompt('Please enter the EOS block hash:', '');

            if (!serverSeed || !eosBlockHash) {
                alert('Error: Server seed and EOS block hash are required.');
                return;
            }
        }

        const roundsDiv = createInputDiv('Number of Rounds', `<input type="number" min="1" value="1" id="rounds-input" style="display: flex;
    flex-grow: 1;
    padding: 9px 12px;
    border: 0px;
    outline: none;
    min-height: 38px;
    background-color: transparent;
    color: inherit;
    font-family: var(--font-geogrotesque-wide);
    font-weight: 500;
    font-size: 14px;
    line-height: 1.42957;
    text-transform: none;
    caret-color: rgb(240, 242, 245) !important;">`);
        const playersDiv = createInputDiv('Number of Players', `
            <select id="players-select" style="display: flex;
    flex-grow: 1;
    padding: 9px 12px;
    border: 0px;
    outline: none;
    min-height: 38px;
    background-color: transparent;
    color: inherit;
    font-family: var(--font-geogrotesque-wide);
    font-weight: 500;
    font-size: 14px;
    line-height: 1.42957;
    text-transform: none;
    caret-color: rgb(240, 242, 245) !important;">
                <option value="2">2 players</option>
                <option value="3">3 players</option>
                <option value="4">4 players</option>
                <option value="6">6 players</option>
            </select>
        `);

        const buttonDiv = document.createElement('div');
        buttonDiv.style.textAlign = 'center';
        buttonDiv.style.marginTop = '15px';
        buttonDiv.innerHTML = `
            <button id="verify-btn" style="    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    outline: none;
    border-radius: 8px;
    letter-spacing: 0.6px;
    background-color: rgb(246, 175, 22);
    color: rgb(1, 16, 30);
    min-height: 32px;
    padding: 7px 12px;
    width: 100%;
    font-family: var(--font-geogrotesque-wide);
    font-weight: 900;">VERIFY</button>
        `;

        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'results';
        resultsDiv.style.marginTop = '20px';

        const insertPoint = modal.querySelector('div[class*="sc-482ebc6f-0"]');
        if (!insertPoint) {
            console.error('Could not find the insert point in the modal.');
            return;
        }

        insertPoint.appendChild(roundsDiv);
        insertPoint.appendChild(playersDiv);
        insertPoint.appendChild(buttonDiv);
        insertPoint.appendChild(resultsDiv);

        document.getElementById('verify-btn').addEventListener('click', function() {
            const rounds = parseInt(document.getElementById('rounds-input').value);
            const players = parseInt(document.getElementById('players-select').value);

            if (isNaN(rounds) || rounds < 1) {
                alert('Please enter a valid number of rounds.');
                return;
            }

            resultsDiv.innerHTML = '';

            let tableHtml = '<table style="width: 100%; border-collapse: collapse;">';
            tableHtml += '<thead style="text-align: inherit;  color: rgb(240, 242, 245);font-family: var(--font-geogrotesque-wide);font-weight: 500;font-size: 12px;line-height: 1.33433;text-transform: none;"><tr><th style="border: 0px solid #ccc; padding: 2px;">Round</th>';

            for (let playerNum = 0; playerNum < players; playerNum++) {
                tableHtml += `<th style="border: 0px solid #ccc; padding: 2px;">Slot ${playerNum}</th>`;
            }
            tableHtml += '</tr></thead><tbody style="text-align: center;  color: rgb(240, 242, 245);font-family: var(--font-geogrotesque-wide);font-weight: 500;font-size: 12px;line-height: 1.33433;text-transform: none;">';

            for (let roundNum = 1; roundNum <= rounds; roundNum++) {
                tableHtml += `<tr><td style="border: 0px solid #ccc; padding: 2px;">${roundNum}</td>`;
                for (let playerNum = 0; playerNum < players; playerNum++) {
                    const randomNumber = roll(serverSeed, eosBlockHash, roundNum, playerNum);
                    tableHtml += `<td style="border: 0px solid #ccc; padding: 2px;">${randomNumber}</td>`;
                }
                tableHtml += '</tr>';

                if (roundNum === rounds) {
                    tableHtml += `<tr><td style="border: 0px solid #ccc; padding: 2px;">Tie</td>`;
                    for (let playerNum = 0; playerNum < players; playerNum++) {
                        const tie = tieRoll(serverSeed, eosBlockHash, roundNum, playerNum);
                        tableHtml += `<td style="border: 0px solid #ccc; padding: 2px;">${tie}</td>`;
                    }
                    tableHtml += '</tr>';
                }
            }

            tableHtml += '</tbody></table>';

            resultsDiv.innerHTML = tableHtml;
        });
    }

    function getInputValueByLabelText(modal, labelText) {
        const spans = modal.querySelectorAll('span');
        for (let span of spans) {
            if (span.textContent.trim() === labelText) {
                let parentDiv = span.closest('div');
                let inputDiv = parentDiv.nextElementSibling;
                if (inputDiv) {
                    const input = inputDiv.querySelector('input');
                    if (input) {
                        return input.value;
                    }
                }
            }
        }
        return null;
    }

    function createInputDiv(labelText, inputHTML) {
        const containerDiv = document.createElement('div');
        containerDiv.style.marginTop = '10px';
        containerDiv.innerHTML = `
            <div style="margin-bottom: 5px;">
                <span style="text-align: inherit;color: rgb(240, 242, 245);font-family: var(--font-geogrotesque-wide);font-weight: 500;font-size: 12px;line-height: 1.33433;text-transform: none;">${labelText}</span>
            </div>
            <div style="display: flex; background-color: rgb(1, 16, 30); color: rgb(133, 150, 173); align-items: center; margin-top: 4px; border: 1px solid rgb(37, 57, 82); border-radius: 8px; overflow: hidden;">
                ${inputHTML}
            </div>
        `;
        return containerDiv;
    }


    function* getBytesChunks(serverSeed, clientSeed, nonce) {
        let step = 0;
        let counter = 0;

        while (true) {
            const hmac = CryptoJS.HmacSHA512(`${clientSeed}:${nonce}:${step}`, serverSeed);
            const hashValue = hmac.toString(CryptoJS.enc.Hex);

            while (counter < 16) {
                const hashBytes = [];

                for (let i = 0; i < 4; i++) {
                    const byteHex = hashValue.substring(i * 2 + counter * 8, i * 2 + 2 + counter * 8);
                    hashBytes.push(parseInt(byteHex, 16));
                }

                yield hashBytes;
                counter += 1;
            }

            counter = 0;
            step += 1;
        }
    }

    function getFloats(serverSeed, clientSeed, nonce, count) {
        const bytesGenerator = getBytesChunks(serverSeed, clientSeed, nonce);
        const floats = [];

        while (floats.length < count) {
            const bytes = bytesGenerator.next().value;
            const float = bytes.reduce((acc, value, i) => acc + value / Math.pow(256, i + 1), 0);
            floats.push(float);
        }

        return floats;
    }

    function roll(serverSeed, eosBlockHash, roundNum, playerNum) {
        const nonce = `${roundNum}:${playerNum}`;
        const float = getFloats(serverSeed, eosBlockHash, nonce, 1)[0];

        return Math.floor(float * 10000000 + 1);
    }

    function tieRoll(serverSeed, eosBlockHash, roundNum, playerNum) {
        const nonce = `${roundNum}:${playerNum}:tie`;
        const float = getFloats(serverSeed, eosBlockHash, nonce, 1)[0];

        return Math.floor(float * (9999 - 1000 + 1) + 1000);
    }

})();
