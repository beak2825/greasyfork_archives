// ==UserScript==
// @name         aquagloops Russian Roulette Helper
// @namespace    http://tampermonkey.net/
// @version      19.0
// @description  updated for fixes
// @author       aquagloop
// @license      MIT
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/546848/aquagloops%20Russian%20Roulette%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/546848/aquagloops%20Russian%20Roulette%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_SETTINGS = {
        RESET_HOUR_UTC: 0,
        position: {
            top: '20px',
            left: null,
            right: '20px'
        }
    };
    const PROFIT_STORAGE_KEY = 'RR_PROFIT_LIVE_CACHE_V2';
    const SETTINGS_STORAGE_KEY = 'RR_SETTINGS_V2';

    let currentSettings;
    let gameInProgress = true;
    let betHasBeenFilledForThisGame = false;
    const ORIGINAL_CONTAINER_WIDTH = '220px';
    let lockedHeight = '';

    let lastClickX = 0;
    let lastClickY = 0;
    let expectedConfirmButtonText = null;

    function setAndVerifyValue(element, value, retries = 20) {
        if (retries <= 0) return;
        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        valueSetter.call(element, value);
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);
        setTimeout(() => {
            if (element.value !== value) setAndVerifyValue(element, value, retries - 1);
        }, 50);
    }

    function autoFillBetWithCash() {
        const moneyElement = document.querySelector('#user-money');
        if (!moneyElement) return false;

        const cashAmount = moneyElement.getAttribute('data-money');
        if (cashAmount === null) return false;

        const betInputElement = document.querySelector('.betBlock___Rz6OK input.input-money');
        if (!betInputElement) return false;

        const cashValue = parseInt(cashAmount, 10);
        const currentBetValue = parseInt(betInputElement.value.replace(/[$,]/g, ''), 10) || 0;

        if (currentBetValue !== cashValue) {
            setAndVerifyValue(betInputElement, cashAmount);
        }

        return true;
    }


    function getCurrentGameDay() {
        const now = new Date();
        now.setUTCHours(now.getUTCHours() - currentSettings.RESET_HOUR_UTC);
        return now.toISOString().split('T')[0];
    }

    function lockDimensions(element, lock = true) {
        if (lock) {
            if (!lockedHeight) {
                lockedHeight = `${element.offsetHeight}px`;
            }
            element.style.setProperty('height', lockedHeight, 'important');
            element.style.setProperty('min-height', lockedHeight, 'important');
            element.style.setProperty('max-height', lockedHeight, 'important');
        } else {
            element.style.removeProperty('height');
            element.style.removeProperty('min-height');
            element.style.removeProperty('max-height');
        }
    }

    function createFloatingContainer() {
        if (document.getElementById('rr-profit-container')) return;
        const container = document.createElement('div');
        container.id = 'rr-profit-container';

        const savedPos = currentSettings.position || DEFAULT_SETTINGS.position;
        let positionStyle = `top: ${savedPos.top};`;
        if (savedPos.left) {
            positionStyle += `left: ${savedPos.left};`;
        } else {
            positionStyle += `right: ${savedPos.right};`;
        }

        container.setAttribute('style', `
            position: fixed; ${positionStyle} background-color: #333;
            border: 1px solid #555; border-radius: 8px; padding: 12px;
            z-index: 99999; color: #ddd; font-family: Arial, sans-serif;
            font-size: 14px; box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            width: ${ORIGINAL_CONTAINER_WIDTH} !important;
            min-width: ${ORIGINAL_CONTAINER_WIDTH} !important;
            max-width: ${ORIGINAL_CONTAINER_WIDTH} !important;
            transition: min-width 0.2s ease-in-out, height 0.2s ease-in-out;
            resize: none !important;
            user-select: none;
            -webkit-user-select: none;
        `);

        container.innerHTML = `
            <div id="rr-header" style="cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #555; padding-bottom: 5px; margin-bottom: 8px;">
                <span id="rr-title" style="font-weight: bold; white-space: nowrap;">RR Net Profit (Today)</span>
                <div id="rr-header-controls" style="display: flex; align-items: center;">
                    <button id="rr-settings-btn" title="Settings" style="cursor: pointer; background:none; border:none; color:#ddd; font-size:16px; margin-right: 5px; padding: 0 4px;">⚙️</button>
                    <button id="rr-minimize-btn" title="Minimize" style="cursor: pointer; background:none; border:none; color:#ddd; font-size:16px; padding: 0 4px;">[–]</button>
                </div>
            </div>
            <div id="rr-profit-content">
                <div id="rr-profit-value" style="font-size: 20px; text-align: center; font-weight: bold; margin-bottom: 10px;">...</div>
                <button id="rr-override-btn" style="width: 100%; padding: 5px; background-color: #555; color: #fff; border: 1px solid #777; border-radius: 4px; cursor: pointer;">Override Total</button>
                <div id="rr-settings-panel" style="display: none; margin-top: 10px; border-top: 1px solid #555; padding-top: 10px;">
                    <label for="rr-reset-hour-input" style="display: block; margin-bottom: 5px; cursor: default;">Reset Hour (TCT):</label>
                    <input type="number" id="rr-reset-hour-input" min="0" max="23" style="width: 60px; padding: 4px; background-color: #222; color: #fff; border: 1px solid #777; border-radius: 4px; user-select: text; cursor: text;">
                    <button id="rr-save-settings-btn" style="padding: 5px 10px; margin-left: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                </div>
            </div>`;
        document.body.appendChild(container);

        lockDimensions(container);
        makeDraggable(container);
        document.getElementById('rr-minimize-btn').addEventListener('click', handleMinimizeToggle);
        document.getElementById('rr-override-btn').addEventListener('click', handleManualOverride);
        document.getElementById('rr-settings-btn').addEventListener('click', toggleSettingsPanel);
        document.getElementById('rr-save-settings-btn').addEventListener('click', saveSettings);
    }

    function makeDraggable(element) {
        let p1=0, p2=0, p3=0, p4=0;
        const header = document.getElementById('rr-header');

        function dragStart(e) {
            if (e.target.closest('button, input, a')) return;
            e.preventDefault();
            e.stopImmediatePropagation();

            const event = e.touches ? e.touches[0] : e;
            p3 = event.clientX;
            p4 = event.clientY;
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';

            if (e.type === 'touchstart') {
                document.addEventListener('touchend', dragEnd, { capture: true });
                document.addEventListener('touchmove', dragMove, { capture: true, passive: false });
            } else {
                document.addEventListener('mouseup', dragEnd, { capture: true });
                document.addEventListener('mousemove', dragMove, { capture: true });
            }
        }

        function dragMove(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            const event = e.touches ? e.touches[0] : e;
            p1=p3-event.clientX; p2=p4-event.clientY; p3=event.clientX; p4=event.clientY;
            element.style.top=(element.offsetTop-p2)+"px";
            element.style.left=(element.offsetLeft-p1)+"px";
            element.style.right = 'auto';
        }

        async function dragEnd(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            document.body.style.userSelect = 'auto';
            document.body.style.webkitUserSelect = 'auto';

            document.removeEventListener('mouseup', dragEnd, true);
            document.removeEventListener('mousemove', dragMove, true);
            document.removeEventListener('touchend', dragEnd, true);
            document.removeEventListener('touchmove', dragMove, true);

            currentSettings.position = {
                top: element.style.top,
                left: element.style.left,
                right: null
            };
            await GM_setValue(SETTINGS_STORAGE_KEY, currentSettings);
        }

        header.addEventListener('mousedown', dragStart, { capture: true });
        header.addEventListener('touchstart', dragStart, { capture: true, passive: false });
    }

    function handleMinimizeToggle() {
        const container = document.getElementById('rr-profit-container');
        const content = document.getElementById('rr-profit-content');
        const btn = document.getElementById('rr-minimize-btn');
        const title = document.getElementById('rr-title');
        const settingsBtn = document.getElementById('rr-settings-btn');

        const isMinimized = content.style.display === 'none';
        if (isMinimized) {
            content.style.display = 'block';
            btn.textContent = '[–]';
            title.textContent = 'RR Net Profit (Today)';
            settingsBtn.style.display = 'inline-block';
            container.style.setProperty('min-width', ORIGINAL_CONTAINER_WIDTH, 'important');
            lockDimensions(container, true);
        } else {
            if (document.getElementById('rr-settings-panel').style.display !== 'none') toggleSettingsPanel();
            content.style.display = 'none';
            btn.textContent = '[+]';
            title.textContent = 'RR Tracker';
            settingsBtn.style.display = 'none';
            container.style.setProperty('min-width', 'auto', 'important');
            lockDimensions(container, false);
        }
    }

    function toggleSettingsPanel() {
        const panel = document.getElementById('rr-settings-panel');
        const profitDisplay = document.getElementById('rr-profit-value');
        const overrideBtn = document.getElementById('rr-override-btn');

        const isHidden = panel.style.display === 'none';
        if (isHidden) {
            document.getElementById('rr-reset-hour-input').value = currentSettings.RESET_HOUR_UTC;
            panel.style.display = 'block';
            profitDisplay.style.display = 'none';
            overrideBtn.style.display = 'none';
        } else {
            panel.style.display = 'none';
            profitDisplay.style.display = 'block';
            overrideBtn.style.display = 'block';
        }
    }

    async function saveSettings() {
        const input = document.getElementById('rr-reset-hour-input');
        const newHour = parseInt(input.value, 10);
        if (!isNaN(newHour) && newHour >= 0 && newHour <= 23) {
            currentSettings.RESET_HOUR_UTC = newHour;
            await GM_setValue(SETTINGS_STORAGE_KEY, currentSettings);
            const btn = document.getElementById('rr-save-settings-btn');
            btn.textContent = 'Saved!';
            setTimeout(() => {
                btn.textContent = 'Save';
                toggleSettingsPanel();
            }, 1000);
        } else {
            alert('Please enter a valid hour (0-23).');
        }
    }

    async function handleManualOverride() {
        const currentData = await GM_getValue(PROFIT_STORAGE_KEY, { profit: 0 });
        const userInput = prompt('Enter the correct total profit for today:', currentData.profit);
        if (userInput === null) return;
        const newProfit = parseInt(userInput.replace(/[$,]/g, ''), 10);
        if (!isNaN(newProfit)) {
            await GM_setValue(PROFIT_STORAGE_KEY, { profit: newProfit, day: getCurrentGameDay() });
            updateDisplay(newProfit);
        } else {
            alert('Invalid number entered.');
        }
    }

    async function updateDisplay(profit) {
        const display = document.getElementById('rr-profit-value');
        if (!display) return;
        const currentGameDay = getCurrentGameDay();
        const cache = await GM_getValue(PROFIT_STORAGE_KEY, { day: currentGameDay, profit: 0 });
        if (cache.day !== currentGameDay) {
            await GM_setValue(PROFIT_STORAGE_KEY, { profit: 0, day: currentGameDay });
            profit = 0;
        } else {
            profit = cache.profit;
        }
        const color = profit > 0 ? '#4CAF50' : profit < 0 ? '#F44336' : '#ddd';
        display.textContent = `$${profit.toLocaleString('en-US')}`;
        display.style.color = color;
    }

    const observerCallback = async function(mutationsList, observer) {
        if (lastClickX > 0 && expectedConfirmButtonText) {
            const confirmButtons = document.querySelectorAll('button[data-type="confirm"]');
            for (const confirmButton of confirmButtons) {
                const buttonText = confirmButton.textContent.trim().toLowerCase();

                if (buttonText === expectedConfirmButtonText) {
                    const btnRect = confirmButton.getBoundingClientRect();
                    const parentContainer = confirmButton.closest('div[class*="buttons-wrapper"]');
                    if (parentContainer) parentContainer.style.position = 'relative';

                    Object.assign(confirmButton.style, {
                        position: 'fixed',
                        zIndex: '999999',
                        left: `${lastClickX - (btnRect.width / 2)}px`,
                        top: `${lastClickY - (btnRect.height / 2)}px`,
                        transform: 'scale(1.5)',
                        transformOrigin: 'center center'
                    });

                    lastClickX = 0;
                    lastClickY = 0;
                    expectedConfirmButtonText = null;
                    break;
                }
            }
        }

        const gameFinishedElement = document.querySelector('.barrel___o3LEh.finished___G8Od9');
        if (gameFinishedElement && gameInProgress) {
            gameInProgress = false;
            const potElement = document.querySelector('span.count___U4X8W');
            if(potElement) {
                const potAmount = parseInt(potElement.textContent.replace(/[$,]/g, ''), 10);
                const netAmount = potAmount / 2;
                const winMessage = document.querySelector('.message___tinv3.green___l1nCX');
                const lossMessage = document.querySelector('.message___tinv3.red___NL13X');
                const currentGameDay = getCurrentGameDay();
                const cache = await GM_getValue(PROFIT_STORAGE_KEY, { profit: 0, day: currentGameDay });
                let currentProfit = (cache.day === currentGameDay) ? cache.profit : 0;
                let profitChange = 0;
                if (winMessage?.textContent.includes("You take your winnings")) profitChange = netAmount;
                else if (lossMessage?.textContent.includes("You fall down")) profitChange = -netAmount;
                if (profitChange !== 0) {
                    currentProfit += profitChange;
                    await GM_setValue(PROFIT_STORAGE_KEY, { profit: currentProfit, day: currentGameDay });
                    updateDisplay(currentProfit);
                }
            }
            return;
        }
        if (!gameFinishedElement && !gameInProgress) {
            gameInProgress = true;
            betHasBeenFilledForThisGame = false;
        }
        if (gameInProgress && !betHasBeenFilledForThisGame) {
            if (autoFillBetWithCash()) {
                betHasBeenFilledForThisGame = true;
            }
        }
    };

    function initializeObserver(selector, callback, options) {
        const targetNode = document.querySelector(selector);
        if (!targetNode) {
            setTimeout(() => initializeObserver(selector, callback, options), 500);
            return;
        }
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, options);
    }

    async function main() {
        currentSettings = await GM_getValue(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS);
        createFloatingContainer();
        await updateDisplay();
        initializeObserver('.appContainer___DyC9r', observerCallback, { childList: true, subtree: true });
        initializeObserver('#user-money', () => autoFillBetWithCash(), { attributes: true, attributeFilter: ['data-money'] });

        document.addEventListener('click', (e) => {
            const actionButton = e.target.closest('button[class*="submit___"]');
            if (actionButton) {
                lastClickX = e.clientX;
                lastClickY = e.clientY;

                const buttonText = actionButton.textContent.trim().toLowerCase();
                if (buttonText.includes('start')) {
                    expectedConfirmButtonText = 'yes';
                } else {
                    expectedConfirmButtonText = 'join';
                }
            }
        }, true);
    }

    main();
})();