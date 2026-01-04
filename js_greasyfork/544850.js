// ==UserScript==
// @name         RR Daily Profit Tracker & Auto Bet Filler
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Tracks RR profit & auto-fills bet.
// @author       aquagloop 
// @license      MIT
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/544850/RR%20Daily%20Profit%20Tracker%20%20Auto%20Bet%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/544850/RR%20Daily%20Profit%20Tracker%20%20Auto%20Bet%20Filler.meta.js
// ==/UserScript==

(function() {
    'use-strict';

    const STORAGE_KEY = 'RR_PROFIT_LIVE_CACHE';
    let gameInProgress = true;
    let betHasBeenFilledForThisGame = false;

    function log(message) {
        console.log(`[RR Tracker v4.1] ${message}`);
    }
    log("Script starting.");

    
    function setAndVerifyValue(element, value, retries = 20) {
        if (retries <= 0) {
            log("FINAL ATTEMPT FAILED. The input value could not be set permanently.");
            return;
        }

        log(`Attempting to set value to '${value}'. Retries left: ${retries}`);

        
        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        valueSetter.call(element, value);
        const event = new Event('input', { bubbles: true });
        element.dispatchEvent(event);

        
        setTimeout(() => {
            if (element.value !== value) {
                log(`Value was reverted by the framework. Retrying...`);
               
                setAndVerifyValue(element, value, retries - 1);
            } else {
                log(`Value successfully set to '${value}' and it stuck.`);
            }
        }, 50); 
    }


    function autoFillBetWithCash() {
        const moneyElement = document.querySelector('#user-money');
        if (!moneyElement) return false;

        const cashAmount = moneyElement.getAttribute('data-money');
        if (cashAmount === null) return false;

        const betInputElement = document.querySelector('.betBlock___Rz6OK input.input-money');
        if (!betInputElement) return false;

        if (betInputElement.value !== "" && betInputElement.value !== "10") {
            return true;
        }

       
        setAndVerifyValue(betInputElement, cashAmount);
        return true;
    }



    function createFloatingContainer() {
        if (document.getElementById('rr-profit-container')) return;
        const container = document.createElement('div');
        container.id = 'rr-profit-container';
        Object.assign(container.style, {
            position: 'fixed', top: '20px', right: '20px', backgroundColor: '#333',
            border: '1px solid #555', borderRadius: '8px', padding: '12px',
            zIndex: '99999', color: '#ddd', fontFamily: 'Arial, sans-serif',
            fontSize: '14px', cursor: 'move', boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
            minWidth: '150px'
        });
        container.innerHTML = `
            <div style="text-align: center; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #555; padding-bottom: 5px;">RR Net Profit (Today)</div>
            <div id="rr-profit-value" style="font-size: 18px; text-align: center; font-weight: bold;">...</div>`;
        document.body.appendChild(container);
        makeDraggable(container);
    }

    function makeDraggable(element) {
        let p1=0, p2=0, p3=0, p4=0;
        element.onmousedown = e => { e.preventDefault(); p3=e.clientX; p4=e.clientY; document.onmouseup=dragEnd; document.onmousemove=dragMove; };
        function dragMove(e) {
            e.preventDefault(); p1=p3-e.clientX; p2=p4-e.clientY; p3=e.clientX; p4=e.clientY;
            element.style.top=(element.offsetTop-p2)+"px"; element.style.left=(element.offsetLeft-p1)+"px";
        }
        function dragEnd() { document.onmouseup=null; document.onmousemove=null; }
    }

    async function updateDisplay(profit) {
        const display = document.getElementById('rr-profit-value');
        if (!display) return;
        const cache = await GM_getValue(STORAGE_KEY, { day: '', profit: 0 });
        const todayUTCString = new Date().toISOString().split('T')[0];
        if (cache.day !== todayUTCString) {
            await GM_setValue(STORAGE_KEY, { profit: 0, day: todayUTCString });
            profit = 0;
        }
        if (typeof profit === 'number') {
            const color = profit > 0 ? '#4CAF50' : profit < 0 ? '#F44336' : '#ddd';
            display.textContent = `$${profit.toLocaleString('en-US')}`;
            display.style.color = color;
        }
    }

    const observerCallback = async function(mutationsList, observer) {
        const gameFinishedElement = document.querySelector('.barrel___o3LEh.finished___G8Od9');
        if (gameFinishedElement && gameInProgress) {
            gameInProgress = false;
            const potElement = document.querySelector('span.count___U4X8W');
            if(potElement) {
                const potAmount = parseInt(potElement.textContent.replace(/[$,]/g, ''), 10);
                const netAmount = potAmount / 2;
                const winMessage = document.querySelector('.message___tinv3.green___l1nCX');
                const lossMessage = document.querySelector('.message___tinv3.red___NL13X');
                const cache = await GM_getValue(STORAGE_KEY, { profit: 0, day: new Date().toISOString().split('T')[0] });
                let currentProfit = cache.profit;
                if (winMessage?.textContent.includes("You take your winnings")) currentProfit += netAmount;
                else if (lossMessage?.textContent.includes("You fall down")) currentProfit -= netAmount;
                else return;
                await GM_setValue(STORAGE_KEY, { profit: currentProfit, day: new Date().toISOString().split('T')[0] });
                updateDisplay(currentProfit);
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

    function initializeObserver() {
        const targetNode = document.querySelector('.appContainer___DyC9r');
        if (!targetNode) { setTimeout(initializeObserver, 1000); return; }
        const observer = new MutationObserver(observerCallback);
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    async function main() {
        createFloatingContainer();
        const cache = await GM_getValue(STORAGE_KEY, { profit: 0 });
        updateDisplay(cache.profit);
        initializeObserver();
    }

    main();
})();