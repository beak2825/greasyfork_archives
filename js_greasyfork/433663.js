// ==UserScript==
// @name         Town Star Auto-Sell
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Automatically sell crafted items.
// @author       www.bafang.app
// @match        https://townstar.sandbox-games.com/launch
// @match        https://app.gala.games/games/town-star/play
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/433663/Town%20Star%20Auto-Sell.user.js
// @updateURL https://update.greasyfork.org/scripts/433663/Town%20Star%20Auto-Sell.meta.js
// ==/UserScript==

(function() {
    'use strict';
	// keepAmt is the amount that you do not want to sell
	// sellMin is the minimum amount needed before attempting to sell
	//    setting a sellMin of 100 will ensure that the item is only sold in batches of 100 (e.g. via Freight Ship)
    const craftedItems = [
        {item: 'Sugar', keepAmt: 20, sellMin: 10},
        {item: 'Milk', keepAmt: 20, sellMin: 10},
        {item: 'Cake', keepAmt: 0, sellMin: 10},
        {item: 'Flour', keepAmt: 20, sellMin: 10},
        {item: 'Eggs', keepAmt: 0, sellMin: 10},
        {item: 'Salt', keepAmt: 20, sellMin: 10},
    ]

    new MutationObserver(function(mutations) {
        let airdropcollected = 0;
        if(document.getElementsByClassName('hud-jimmy-button')[0] && document.getElementsByClassName('hud-jimmy-button')[0].style.display != 'none'){
            document.getElementsByClassName('hud-jimmy-button')[0].click();
            document.getElementById('Deliver-Request').getElementsByClassName('yes')[0].click();
            document.getElementById('Deliver-Request').getElementsByClassName('close-button')[0].click();
        }
        if(document.getElementsByClassName('hud-airdrop-button')[0] && document.getElementsByClassName('hud-airdrop-button')[0].style.display != 'none'){
            if(airdropcollected == 0){
                airdropcollected = 1;
                document.getElementsByClassName('hud-airdrop-button')[0].click();
                document.getElementsByClassName('air-drop')[0].getElementsByClassName('yes')[0].click();
            }
        }
        if (document.getElementById("playnow-container") && document.getElementById("playnow-container").style.visibility !== "hidden") {
            if(typeof Game == 'undefined' || (Game && Game.gameData == null)) {
                window.location.reload();
            } else {
                document.getElementById("playButton").click();
                console.log(Date.now() + ' ---===ACTIVATING AUTO SELL===---');
                ActivateAutoSell();
            }
        }
    }).observe(document, {childList: true, subtree: true});

    function GetAvailableTradeObject(capacity) {
        return Object.values(Game.town.objectDict).filter(tradeObj => tradeObj.logicType === 'Trade')
            .find(tradeObj =>
                  Game.unitsData[tradeObj.objData.UnitType].Capacity == capacity
                  && !Game.town.tradesList.find(activeTrade => activeTrade.source.x == tradeObj.townX && activeTrade.source.z == tradeObj.townZ)
                 )
    }

    function CloseWindows(elements, checkParent) {
        for (let i=0, n=elements.length; i < n; i++) {
            let el = checkParent ? elements[i].closest('.container') : elements[i];
            let elVis = el.currentStyle ? el.currentStyle.visibility : getComputedStyle(el, null).visibility;
            let elDis = el.currentStyle ? el.currentStyle.display : getComputedStyle(el, null).display;
            if (!(elVis === 'hidden' || elDis === 'none')) {
                el.querySelector('.close-button') && el.querySelector('.close-button').click();
            }
        }
    }

    async function WaitForCompletion(selector) {
        while (document.querySelector(selector) !== null) {
            await new Promise( resolve => requestAnimationFrame(resolve) )
        }
        return document.querySelector(selector);
    }

    async function WaitForTradeLoad(targetTradeObj) {
        return await new Promise(resolve => {
            const waitForUpdate = setInterval(() => {
                let tradeUiObj = Game.app.root.findByName('TradeUi').script.trade.townObject;
                if (tradeUiObj && tradeUiObj.townX == targetTradeObj.townX && tradeUiObj.townZ == targetTradeObj.townZ && Game.app.root.findByName('TradeUi').script.trade.cityPaths[0].gasCost) {
                    resolve('Loaded');
                    clearInterval(waitForUpdate);
                };
            }, 500);
        });
    }

    async function WaitForElement(selector) {
        while (document.querySelector(selector) === null) {
            await new Promise( resolve => requestAnimationFrame(resolve) )
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        return document.querySelector(selector);
    }

    async function CheckCrafts() {
        let allTradeObjects = Object.values(Game.town.objectDict).filter(tradeObj => tradeObj.logicType === 'Trade');
        for (let i=0, n=allTradeObjects.length; i < n; i++) {
            if (allTradeObjects[i].logicObject.tapToCollectEntity.enabled) {
                allTradeObjects[i].logicObject.OnTapped();
            }
        }
        if (Game.town.GetStoredCrafts()['Gasoline'] >= 1) {
            for (let i=0, n=craftedItems.length; i < n; i++) {
                if (Game.town.GetStoredCrafts()[craftedItems[i].item] >= craftedItems[i].keepAmt + 10) {
                    let targetTradeObj;
                    if (Game.town.GetStoredCrafts()[craftedItems[i].item] >= 100 + craftedItems[i].keepAmt) {
                        targetTradeObj = GetAvailableTradeObject(100);
                    }
                    if (!targetTradeObj && Game.town.GetStoredCrafts()[craftedItems[i].item] >= 50 + craftedItems[i].keepAmt && craftedItems[i].sellMin <= 50){
                        targetTradeObj = GetAvailableTradeObject(50);
                    }
                    if (!targetTradeObj && Game.town.GetStoredCrafts()[craftedItems[i].item] >= 10 + craftedItems[i].keepAmt && craftedItems[i].sellMin <= 10){
                        targetTradeObj = GetAvailableTradeObject(10);
                    }
                    if (targetTradeObj){
                        CloseWindows(document.querySelectorAll('body > .container > .player-confirm .dialog-cell'), false);
                        CloseWindows(document.querySelectorAll('.container > div:not(.hud):not(.player-confirm)'), true);
                        Game.app.fire('SellClicked', {x: targetTradeObj.townX, z: targetTradeObj.townZ});
                        await WaitForCompletion('.LoadingOrders');
                        document.querySelector('#trade-craft-target [data-name="' + craftedItems[i].item + '"]').click();
                        await WaitForTradeLoad(targetTradeObj);
                        if (Game.town.GetStoredCrafts()['Gasoline'] >= Game.app.root.findByName('TradeUi').script.trade.cityPaths[0].gasCost) {
                            document.querySelector('#destination-target .destination .sell-button').click();
                            let tradeTimeout = setTimeout(function(){
								document.querySelector('.trade-connection .no').click();
							},10000);
                            await WaitForCompletion('.trade-connection .compass');
							clearTimeout(tradeTimeout);
                        } else {
                            console.log('Whoops! You have run out of gas.');
                            document.querySelector('#autosell-status .bank').textContent = 'ALERT: Out of gas!'
                            document.querySelector('.container > .trade .close-button').click();
                        }
                    }
                }
            }
        } else {
            console.log('Whoops! You have run out of gas.');
            document.querySelector('#autosell-status .bank').textContent = 'ALERT: Out of gas!'
        }
        setTimeout(CheckCrafts, 5000);
    }

    async function ActivateAutoSell() {
        let autoSellStatus = document.createElement('div');
        autoSellStatus.id = 'autosell-status';
        autoSellStatus.style.cssText = 'pointer-events: all; position: absolute; left: 50%; transform: translate(-50%, 0);';
        autoSellStatus.addEventListener( 'click', function(){this.children[0].textContent = 'Auto-Sell Active';})
        let autoSellContent = document.createElement('div');
        autoSellContent.classList.add('bank');
        autoSellContent.style.cssText = 'background-color: #fde7e3; padding-left: 10px; padding-right: 10px';
        autoSellContent.textContent = 'Auto-Sell Active';
        autoSellStatus.appendChild(autoSellContent);
        await WaitForElement('.hud');
        document.querySelector('.hud').prepend(autoSellStatus);
        CheckCrafts();
    }

})();