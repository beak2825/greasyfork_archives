// ==UserScript==
// @name            BNBFree AutoBet Fibonacci Bot [v1.0]
// @name:en         BNBFree AutoBet Fibonacci Bot [v1.0]
// @namespace       https://bnbfree.in/
// @version         1.0
// @description     Bot de apuestas automáticas para BNBFree.in usando estrategia Fibonacci. Automatiza AutoRoll y optimiza ganancias en faucets BNB.
// @description:en  Automatic Fibonacci betting bot for BNBFree.in. Automates AutoRoll and optimizes earnings on BNB faucets.
// @tags            bnb, faucet, bnbfree, autobet, auto roll, fibonacci, bot, crypto, bnb faucet, bnb bot, bnb roll, bnbfree bot, autoclick, autoroll, crypto faucet, passive income, gambling, automation
// @author          Jan
// @match           https://bnbfree.in/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=bnbfree.in
// @license         MIT
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/538941/BNBFree%20AutoBet%20Fibonacci%20Bot%20%5Bv10%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/538941/BNBFree%20AutoBet%20Fibonacci%20Bot%20%5Bv10%5D.meta.js
// ==/UserScript==

// Tu código aquí...


(function () {
    'use strict';

    let baseBet = 0.00000001;
    const targetProfit = 1.00000000;
    let index = 0;
    let stop = false;
    let startingBalance = 0;
    let currentBalance = 0;
    let maxBetSatoshi = 0;
    let buttonContainer = null;
    let togglePanelBtn = null;

    function createTogglePanelButton() {
        togglePanelBtn = document.createElement('button');
        togglePanelBtn.id = 'toggle_panel_btn';
        togglePanelBtn.innerText = '⚙️';
        togglePanelBtn.title = 'Mostrar/Ocultar Panel';
        togglePanelBtn.style.position = 'fixed';
        togglePanelBtn.style.top = '20px';
        togglePanelBtn.style.right = '20px';
        togglePanelBtn.style.zIndex = '10000';
        togglePanelBtn.style.padding = '10px 14px';
        togglePanelBtn.style.fontSize = '20px';
        togglePanelBtn.style.backgroundColor = '#ff8c00';
        togglePanelBtn.style.border = 'none';
        togglePanelBtn.style.borderRadius = '50%';
        togglePanelBtn.style.color = 'white';
        togglePanelBtn.style.cursor = 'pointer';
        togglePanelBtn.style.boxShadow = '0 0 10px rgba(0,0,0,0.4)';
        togglePanelBtn.style.transition = 'transform 0.3s ease';
        togglePanelBtn.onmouseenter = () => togglePanelBtn.style.transform = 'rotate(30deg)';
        togglePanelBtn.onmouseleave = () => togglePanelBtn.style.transform = 'rotate(0deg)';
        togglePanelBtn.onclick = () => {
            buttonContainer.style.display = buttonContainer.style.display === 'none' ? 'flex' : 'none';
        };

        document.body.appendChild(togglePanelBtn);
    }

    function createControlButtons() {
        buttonContainer = document.createElement('div');
        buttonContainer.id = 'bnb_bot_container';
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '80px';
        buttonContainer.style.right = '20px';
        buttonContainer.style.zIndex = '9999';
        buttonContainer.style.background = '#ff8c00';
        buttonContainer.style.padding = '20px';
        buttonContainer.style.borderRadius = '20px';
        buttonContainer.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
        buttonContainer.style.maxWidth = '90vw';
        buttonContainer.style.minWidth = '250px';
        buttonContainer.style.fontFamily = 'Arial, sans-serif';
        buttonContainer.style.color = '#fff';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.transition = 'all 0.5s ease';

        const style = document.createElement('style');
        style.innerHTML = `
        @media (max-width: 600px) {
            .radio-container {
                flex-wrap: wrap !important;
            }
            .radio-container label {
                flex: 0 0 45% !important;
            }
            #toggle_panel_btn {
                top: 60px !important;
            }
        }`;
        document.head.appendChild(style);

        const optionsLabel = document.createElement('div');
        optionsLabel.innerText = 'SELECT BASE BET:';
        optionsLabel.style.marginBottom = '10px';
        optionsLabel.style.fontWeight = 'bold';
        optionsLabel.style.textTransform = 'uppercase';
        optionsLabel.style.color = 'black';
        buttonContainer.appendChild(optionsLabel);

        const bets = [
            { label: '1 satoshi', value: 0.00000001 },
            { label: '10 satoshis', value: 0.00000010 },
            { label: '100 satoshis', value: 0.00000100 },
            { label: '1000 satoshis', value: 0.00001000 }
        ];

        const radioContainer = document.createElement('div');
        radioContainer.className = 'radio-container';
        radioContainer.style.display = 'flex';
        radioContainer.style.flexWrap = 'nowrap';
        radioContainer.style.justifyContent = 'center';
        radioContainer.style.marginBottom = '10px';
        radioContainer.style.gap = '10px';

        bets.forEach((bet) => {
            const option = document.createElement('label');
            option.style.flex = '1';
            option.style.textAlign = 'center';
            option.style.padding = '5px 10px';
            option.style.backgroundColor = '#007BFF';
            option.style.borderRadius = '10px';
            option.style.color = 'white';
            option.style.cursor = 'pointer';
            option.style.whiteSpace = 'nowrap';
            option.style.transition = 'transform 0.3s ease';

            option.onmouseenter = () => option.style.transform = 'scale(1.1)';
            option.onmouseleave = () => option.style.transform = 'scale(1)';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'baseBet';
            radio.value = bet.value;
            radio.style.marginRight = '5px';

            option.appendChild(radio);
            option.appendChild(document.createTextNode(bet.label));
            radioContainer.appendChild(option);
        });

        buttonContainer.appendChild(radioContainer);

        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';
        buttonRow.style.justifyContent = 'space-between';
        buttonRow.style.width = '100%';
        buttonRow.style.marginBottom = '10px';
        buttonRow.style.gap = '10px';

        const startButton = document.createElement('button');
        startButton.innerText = 'START BOT';
        startButton.style.flex = '1';
        startButton.style.padding = '10px';
        startButton.style.backgroundColor = '#28a745';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '10px';
        startButton.style.color = 'white';
        startButton.style.fontSize = '16px';
        startButton.style.cursor = 'pointer';
        startButton.style.transition = 'transform 0.3s ease';
        startButton.onmouseenter = () => startButton.style.transform = 'scale(1.05)';
        startButton.onmouseleave = () => startButton.style.transform = 'scale(1)';
        startButton.onclick = () => {
            const selected = document.querySelector('input[name="baseBet"]:checked');
            if (!selected) {
                alert("⛔ Please select a base bet option before starting the bot.");
                return;
            }
            baseBet = parseFloat(selected.value);
            // Simula clic en MULTIPLY BNB
            const multiplyLink = document.querySelector('a.double_your_btc_link');
            if (multiplyLink) multiplyLink.click();
            startBot();
        };

        const stopButton = document.createElement('button');
        stopButton.innerText = 'STOP BOT';
        stopButton.style.flex = '1';
        stopButton.style.padding = '10px';
        stopButton.style.backgroundColor = '#dc3545';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '10px';
        stopButton.style.color = 'white';
        stopButton.style.fontSize = '16px';
        stopButton.style.cursor = 'pointer';
        stopButton.style.transition = 'transform 0.3s ease';
        stopButton.onmouseenter = () => stopButton.style.transform = 'scale(1.05)';
        stopButton.onmouseleave = () => stopButton.style.transform = 'scale(1)';
        stopButton.onclick = stopBot;

        buttonRow.appendChild(startButton);
        buttonRow.appendChild(stopButton);
        buttonContainer.appendChild(buttonRow);

        const statusText = document.createElement('div');
        statusText.id = 'bot_status';
        statusText.style.fontSize = '14px';
        statusText.style.color = '#333';
        statusText.style.marginTop = '10px';
        buttonContainer.appendChild(statusText);

        document.body.appendChild(buttonContainer);
    }

    function getFibonacciValue(n) {
        if (n === 0 || n === 1) return baseBet;
        let a = baseBet, b = baseBet, result;
        for (let i = 2; i <= n; i++) {
            result = parseFloat((a + b).toFixed(8));
            a = b;
            b = result;
        }
        return result;
    }

    function updateStatus(profit, currentBet) {
        const statusText = document.getElementById('bot_status');
        if (statusText) {
            if (currentBet * 100000000 > maxBetSatoshi) {
                maxBetSatoshi = Math.floor(currentBet * 100000000);
            }
            statusText.innerText = `Win: ${(profit * 100000000).toFixed(0)} sat | Max Bet: ${maxBetSatoshi} sat`;
        }
    }

    function startBot() {
        stop = false;

        const interval = setInterval(() => {
            const balanceSpan = document.getElementById("balance");
            const stakeInput = document.querySelector("#double_your_btc_stake");
            const hiButton = document.querySelector("#double_your_btc_bet_hi_button");
            const payoutInput = document.querySelector("#double_your_btc_payout_multiplier");

            if (balanceSpan && stakeInput && hiButton && payoutInput) {
                clearInterval(interval);
                payoutInput.value = "3.00";
                startingBalance = parseFloat(balanceSpan.innerText.replace(/,/g, ''));
                currentBalance = startingBalance;
                runBot(stakeInput, hiButton, balanceSpan);
            }
        }, 1000);
    }

    function stopBot() {
        stop = true;
        console.log("⛔ Bot detenido.");
    }

    function runBot(stakeInput, hiButton, balanceSpan) {
        function makeBet() {
            if (stop) return;
            const currentBet = getFibonacciValue(index);
            stakeInput.value = currentBet.toFixed(8);
            hiButton.click();
            waitForResult(currentBet);
        }

        function waitForResult(currentBet) {
            setTimeout(() => {
                const newBalance = parseFloat(balanceSpan.innerText.replace(/,/g, ''));
                const profit = newBalance - startingBalance;
                updateStatus(profit, currentBet);

                if (profit >= targetProfit) {
                    stop = true;
                    console.log("🎉 Meta diaria alcanzada.");
                    return;
                }

                if (newBalance > currentBalance) {
                    index = 0;
                } else {
                    index++;
                }

                currentBalance = newBalance;
                setTimeout(makeBet, 500);
            }, 4000);
        }

        makeBet();
    }

    window.addEventListener("load", () => {
        createControlButtons();
        createTogglePanelButton();
    });
})();