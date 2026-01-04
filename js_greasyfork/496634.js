// ==UserScript==
// @name         StakeUS/COM increase bet by % button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Alters the betting interface on most stake originals, to replace the bet max button with a bet by % button instead. Enabling the bet max button will deactivate this button.
// @author       telegram: @sighb3r  LTC: ltc1qvpmsjyn6y7vk080uhje8v63mvty4adp7ewk20c <- PLS SEN I LOSE ALL
// @license MIT
// @match        https://stake.us/casino/games/mines
// @match        https://stake.us/casino/games/plinko
// @match        https://stake.us/casino/games/dice
// @match        https://stake.us/casino/games/limbo
// @match        https://stake.us/casino/games/roulette
// @match        https://stake.us/casino/games/crash
// @match        https://stake.us/casino/games/keno
// @match        https://stake.us/casino/games/dragon-tower
// @match        https://stake.us/casino/games/tome-of-life
// @match        https://stake.us/casino/games/hilo
// @match        https://stake.us/casino/games/wheel
// @match        https://stake.us/casino/games/video-poker
// @match        https://stake.us/casino/games/diamonds
// @match        https://stake.us/casino/games/slide
// @match        https://stake.us/casino/games/slots-samurai
// @match        https://stake.us/casino/games/baccarat
// @match        https://stake.us/casino/games/slots
// @match        https://stake.com/casino/games/mines
// @match        https://stake.com/casino/games/plinko
// @match        https://stake.com/casino/games/dice
// @match        https://stake.com/casino/games/limbo
// @match        https://stake.com/casino/games/roulette
// @match        https://stake.com/casino/games/crash
// @match        https://stake.com/casino/games/keno
// @match        https://stake.com/casino/games/dragon-tower
// @match        https://stake.com/casino/games/tome-of-life
// @match        https://stake.com/casino/games/hilo
// @match        https://stake.com/casino/games/wheel
// @match        https://stake.com/casino/games/video-poker
// @match        https://stake.com/casino/games/diamonds
// @match        https://stake.com/casino/games/slide
// @match        https://stake.com/casino/games/slots-samurai
// @match        https://stake.com/casino/games/baccarat
// @match        https://stake.com/casino/games/slots
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496634/StakeUSCOM%20increase%20bet%20by%20%25%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/496634/StakeUSCOM%20increase%20bet%20by%20%25%20button.meta.js
// ==/UserScript==
(function() {
    'use strict';

    console.log('Tampermonkey script loaded.');

    let buttonAdded = false;

    function createPercentButton() {
        const percentButton = document.createElement('button');
        percentButton.type = 'button';
        percentButton.tabIndex = 0;
        percentButton.className = 'inline-flex relative items-center gap-2 justify-center rounded-sm font-semibold whitespace-nowrap ring-offset-background transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] bg-grey-400 text-white betterhover:hover:bg-grey-300 betterhover:hover:text-white focus-visible:outline-white text-sm leading-none py-[0.8125rem] px-[1rem] shadow-none';
        percentButton.dataset.buttonRoot = '';
        percentButton.innerText = '%';
        return percentButton;
    }

    function createDialogBox() {
        const dialogBox = document.createElement('div');
        dialogBox.style.position = 'absolute';
        dialogBox.style.background = '#213743';
        dialogBox.style.border = '1px solid var(--grey-700)';
        dialogBox.style.padding = '10px';
        dialogBox.style.borderRadius = '0.5rem';
        dialogBox.style.zIndex = 1000;
        dialogBox.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        dialogBox.style.color = 'var(--grey-200)';

        const inputLabel = document.createElement('label');
        inputLabel.innerText = 'Increase bet by (%):';
        inputLabel.style.display = 'block';
        inputLabel.style.marginBottom = '5px';
        dialogBox.appendChild(inputLabel);

        const inputField = document.createElement('input');
        inputField.type = 'number';
        inputField.min = 0;
        inputField.value = 10;
        inputField.style.width = '100%';
        inputField.style.padding = '5px';
        inputField.style.marginBottom = '10px';
        inputField.style.borderRadius = '0.25rem';
        inputField.style.border = '1px solid var(--grey-600)';
        inputField.style.backgroundColor = '#2F4553';
        inputField.style.color = 'var(--grey-200)';
        dialogBox.appendChild(inputField);

        const submitButton = document.createElement('button');
        submitButton.innerText = 'OK';
        submitButton.className = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
        submitButton.style.backgroundColor = '#00E701';
        submitButton.style.color = 'black';
        dialogBox.appendChild(submitButton);

        document.body.appendChild(dialogBox);

        function onClickOutside(event) {
            if (!dialogBox.contains(event.target) && event.target !== submitButton) {
                closeDialog();
            }
        }

        function closeDialog() {
            const percentValue = parseFloat(inputField.value);
            if (!isNaN(percentValue) && percentValue > 0) {
                localStorage.setItem('betIncreasePercent', percentValue);
            } else {
                alert('Please enter a valid percentage greater than 0.');
            }
            dialogBox.style.display = 'none';
            document.removeEventListener('click', onClickOutside);
        }

        submitButton.addEventListener('click', closeDialog);

        dialogBox.style.display = 'none';
        return { dialogBox, inputField, submitButton, onClickOutside };
    }

    function showTooltip(button) {
        const tooltip = document.createElement('div');
        tooltip.innerText = 'Right-click to set the % value';
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'rgba(0, 0, 0, 0.75)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.zIndex = '1000';
        tooltip.style.transition = 'opacity 0.3s ease';
        tooltip.style.opacity = '0';
        document.body.appendChild(tooltip);

        const buttonRect = button.getBoundingClientRect();
        tooltip.style.top = `${buttonRect.top + window.scrollY}px`;
        tooltip.style.left = `${buttonRect.left + window.scrollX + buttonRect.width + 10}px`;

        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.remove();
            }, 300);
        }, 3000);
    }

    function addPercentButton(buttonContainer) {
        if (buttonAdded) {
            console.log('Percent button already exists.');
            return;
        }

        const percentButton = createPercentButton();
        const { dialogBox, inputField, submitButton, onClickOutside } = createDialogBox();

        buttonContainer.appendChild(percentButton);
        console.log('Percent button added.');

        buttonAdded = true;

        let betIncreasePercent = parseFloat(localStorage.getItem('betIncreasePercent')) || 10;

        percentButton.addEventListener('click', () => {
            console.log('Percent button clicked.');

            const betSelector = 'input[data-test="input-game-amount"]';
            console.log(`Trying bet selector: ${betSelector}`);
            const betInputs = document.querySelectorAll(betSelector);
            if (betInputs.length === 0) {
                console.error('Bet input not found. Please ensure the selector is correct.');
                return;
            }

            betInputs.forEach(betInput => {
                const currentBet = parseFloat(betInput.value) || 0;

                const balanceSelector = '*[data-test="coin-toggle"][data-active-currency] span.numeric';
                console.log(`Trying balance selector: ${balanceSelector}`);
                const balanceElement = document.querySelector(balanceSelector);

                if (!balanceElement) {
                    console.error('Balance element not found. Please ensure the selector is correct.');
                    return;
                }
                const currentBalance = parseFloat(balanceElement.innerText.replace(/[^\d.]/g, '')) || 0;
                const newBet = currentBet * (1 + (betIncreasePercent / 100));

                if (newBet > currentBalance) {
                    console.log(`New bet exceeds balance. Betting entire balance: ${currentBalance}`);
                    betInput.value = currentBalance.toFixed(2);
                } else {
                    console.log(`Current bet: ${currentBet}, Increase by: ${betIncreasePercent}%, New bet: ${newBet.toFixed(2)}`);
                    betInput.value = newBet.toFixed(2);
                }

                const event = new Event('input', { bubbles: true });
                betInput.dispatchEvent(event);
                const changeEvent = new Event('change', { bubbles: true });
                betInput.dispatchEvent(changeEvent);
            });
        });

        percentButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            dialogBox.style.display = 'block';
            dialogBox.style.top = `${e.pageY}px`;
            dialogBox.style.left = `${e.pageX}px`;

            document.addEventListener('click', onClickOutside);
        });

        const observer = new MutationObserver(() => {
            const maxButton = buttonContainer.querySelector('button[data-testid="amount-max"]');
            if (maxButton && maxButton.style.display !== 'none') {
                percentButton.style.display = 'none';
            } else {
                percentButton.style.display = 'inline-flex';
            }
        });

        observer.observe(buttonContainer, { childList: true, subtree: true });

        percentButton.addEventListener('mouseover', () => {
            if (!percentButton.dataset.tooltipShown) {
                showTooltip(percentButton);
                percentButton.dataset.tooltipShown = 'true';
            }
        });
    }

    function init() {
        console.log('Initializing script...');

        setTimeout(() => {
            const observer = new MutationObserver((mutations, observerInstance) => {
                if (buttonAdded) return;

                const buttonContainer = Array.from(document.querySelectorAll('.input-button-wrap'))
                    .find(container => container.textContent.includes('½') && container.textContent.includes('2×'));

                if (buttonContainer) {
                    console.log('Button container found by MutationObserver.');
                    addPercentButton(buttonContainer);
                    observerInstance.disconnect();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            const interval = setInterval(() => {
                if (buttonAdded) {
                    clearInterval(interval);
                    return;
                }

                const buttonContainer = Array.from(document.querySelectorAll('.input-button-wrap'))
                    .find(container => container.textContent.includes('½') && container.textContent.includes('2×'));

                if (buttonContainer) {
                    console.log('Button container found by interval check.');
                    clearInterval(interval);
                    addPercentButton(buttonContainer);
                    buttonAdded = true;
                } else {
                    console.log('% Button Check Running...');
                }
            }, 1000);
        }, 2000);
    }

    window.addEventListener('load', init);
})();