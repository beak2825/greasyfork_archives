// ==UserScript==
// @name         town star BlueSteel
// @namespace    wiolentmonkey
// @version      0.3
// @description  BlueSteel
// @author       gela
// @match        https://townstar.sandbox-games.com/launch/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/436492/town%20star%20BlueSteel.user.js
// @updateURL https://update.greasyfork.org/scripts/436492/town%20star%20BlueSteel.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const gasLimit = 1;
    const trackedItems = [
        {item: 'Wood', count: 0, first: 0, oneMin: 6, oneHour: 0},
        {item: 'Gasoline', count: 0, first: 0, oneMin: 6, oneHour: 0},
        {item: 'Energy', count: 0, first: 0, oneMin: 6, oneHour: 0},
        {item: 'Wool_Yarn', count: 0, first: 0, oneMin: 6, oneHour: 0},
        {item: 'Uniforms', count: 0, first: 0, oneMin: 6, oneHour: 0},
        {item: 'Iron', count: 0, first: 0, oneMin: 6, oneHour: 0},
        {item: 'Steel', count: 0, first: 0, oneMin: 6, oneHour: 0},
        {item: 'Blue_Steel', count: 0, first: 0, oneMin: 6, oneHour: 0},
    ];
    let loaded = 0;
 
    const craftedItems = [
        {item: 'Jet_Fuel', keepAmt: 0, sellMin: 10},
        {item: 'Water_Drum', keepAmt: 5, sellMin: 10},
        {item: 'Wood', keepAmt: 7, sellMin: 10},
        {item: 'Cotton', keepAmt: 2, sellMin: 10},
        {item: 'Milk', keepAmt: 0, sellMin: 10},
        {item: 'Salt', keepAmt: 0, sellMin: 10},
        {item: 'Sugar', keepAmt: 0, sellMin: 10},
        {item: 'Lumber', keepAmt: 3, sellMin: 10},
        {item: 'Wool', keepAmt: 0, sellMin: 10},
        {item: 'Wool_Yarn', keepAmt: 0, sellMin: 10},
        {item: 'Cotton', keepAmt: 10, sellMin: 10},
        {item: 'Cotton_Yarn', keepAmt: 0, sellMin: 10},
        {item: 'Wheat', keepAmt: 10, sellMin: 10},
        {item: 'Uniforms', keepAmt: 1, sellMin: 10},
        {item: 'Energy', keepAmt: 10, sellMin: 10},
        {item: 'Petroleum', keepAmt: 5, sellMin: 10},
        {item: 'Gasoline', keepAmt: 10, sellMin: 10},
        {item: 'Iron', keepAmt: 3, sellMin: 10},
        {item: 'Steel', keepAmt: 0, sellMin: 10},
        {item: 'Blue_Steel', keepAmt: 0, sellMin: 10},
    ]
 
    new MutationObserver(function(mutations) {
        if (document.querySelector('.hud .right .hud-right') && loaded == 0) {
            loaded = 1;
            LoadProductionMonitor();
        }
 
 
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
 
    function LoadProductionMonitor() {
        let trackedHud = document.createElement('div');
        trackedHud.id = 'tracked-items';
        let trackedItemHeader = document.createElement('div');
        trackedItemHeader.id = 'tracked-item-header';
        trackedItemHeader.classList.add('bank');
        trackedItemHeader.style = 'width: 75%;';
        trackedItemHeader.innerHTML = 'Craft:&nbsp;Count&nbsp;|&nbsp;/1Min&nbsp;|&nbsp;/1Hour';
        trackedHud.appendChild(trackedItemHeader);
        let hudRight = document.querySelector('.hud .right .hud-right');
        hudRight.insertBefore(trackedHud, hudRight.querySelector('.right-hud').nextSibling);
 
        for (let item of trackedItems) {
            let trackedItemElem = document.createElement('div');
            trackedItemElem.id = 'tracked-item-' + item.item;
            trackedItemElem.classList.add('bank', 'contextual');
            trackedItemElem.style = 'width: 75%;';
            trackedItemElem.innerHTML = item.item + ':&nbsp;Count&nbsp;|&nbsp;/1Min&nbsp;|&nbsp;/1Hour';
            trackedHud.appendChild(trackedItemElem);
        }
 
        class TrackUnitDeliverOutputTask extends UnitDeliverOutputTask {
            onArrive() {
                super.onArrive();
                let trackedItem = trackedItems.find(item => item.item.toUpperCase() == this.craft.toUpperCase())
                if (trackedItem) {
                    trackedItem.count++;
                    if (trackedItem.count == 1) {
                        trackedItem.first = Date.now();
                    } else {
                        let timeDiff = Date.now() - trackedItem.first;
                        trackedItem.oneMin = trackedItem.count / (timeDiff / 60000)
                        trackedItem.oneHour = trackedItem.count / (timeDiff / 3600000)
                    }
                    document.getElementById('tracked-item-' + trackedItem.item).innerHTML = trackedItem.item + ':&nbsp;<b>' + trackedItem.count + '</b>&nbsp;|&nbsp;<b>' + trackedItem.oneMin.toFixed(2) + '</b>&nbsp;|&nbsp;<b>' + trackedItem.oneHour.toFixed(2) + '</b>';
                }
            }
        }
 
        let origfindDeliverOutputTask = TS_UnitLogic.prototype.findDeliverOutputTask;
        TS_UnitLogic.prototype.findDeliverOutputTask = function(t) {
            let origReturn = origfindDeliverOutputTask.call(this, t);
            return origReturn ? new TrackUnitDeliverOutputTask(origReturn.unit,origReturn.targetObject,t) : null
        }
    }
 
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
        if (Game.town.GetStoredCrafts()['Gasoline'] >= gasLimit) {
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
                        Game.town.selectObject(targetTradeObj);
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