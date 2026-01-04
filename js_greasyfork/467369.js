// ==UserScript==
// @name         自动炒股
// @namespace    ke3470.com
// @version      0.0.6
// @description  Zod自动炒股
// @author       ke3470
// @license      GPL-3.0 License
// @match        https://zodgame.xyz/plugin.php?id=jninvest
// @match        https://zodgame.xyz/plugin.php?id=jninvest:jninvest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zodgame.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467369/%E8%87%AA%E5%8A%A8%E7%82%92%E8%82%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/467369/%E8%87%AA%E5%8A%A8%E7%82%92%E8%82%A1.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async function() {
    'use strict';

    var lsMarketStock = [];
    var lsBought = [];
    const lastBuyHour = 22;
    const startHour = 9;
    const startMinute = 0;
    const endHour = 23;
    const endMinute = 40;
    const offDay = 0;
    var nextCheckTime = new Date();
    const priceMinDiff = 0.15;
    const priceMinDiffExp = 0.25;
    const priceMinExp = 0.5;

    const defaultMaxWaitTime = 10;
    const screenLoadingWaitTime = 30;

    await run();

    async function run() {
        await waitScreenLoaded();
        refreshStockList();
        refreshBoughtList();
        try {
            await buy();
            await sell();
            await waitIfClose();
            await waitUntilRefresh();
        } catch (error) {
            await reloadpage();
        }

    }

    function refreshStockList() {
        lsMarketStock = [];

        var lsStock = Array.from(document.querySelectorAll("#profilelist")[0].children[0].children);
        for (let i=1; i<lsStock.length; i++) {
            var stockId = lsStock[i].children[1].innerText;
            var price = lsStock[i].children[3].innerText;
            var available = lsStock[i].children[4].innerText;
            var basePrice = lsStock[i].children[6].innerText;
            var state = lsStock[i].children[8].innerText;
            var buyAction = lsStock[i].children[9].firstChild;

            lsMarketStock.push({
                stockId: stockId,
                price: +price,
                available: +available,
                basePrice: +basePrice,
                state: state,
                buyAction: buyAction,
            });
        }
    }

    function refreshBoughtList() {
        lsBought = [];
        if (document.querySelectorAll("#profilelist")[1].children[0].children[1].innerText.match(/您暂时没有任何股票投资/) != null) {
            return;
        }

        var lsStock = Array.from(document.querySelectorAll("#profilelist")[1].children[0].children);
        for (let i=1; i<lsStock.length; i++) {
            var stockId = lsStock[i].children[1].innerText;
            var price = lsStock[i].children[2].innerText;
            var quantity = lsStock[i].children[3].innerText;
            var basePrice = lsStock[i].children[4].innerText;
            var sellAction = lsStock[i].children[5].firstChild;

            lsBought.push({
                stockId: stockId,
                price: +price,
                quantity: +quantity,
                basePrice: +basePrice,
                sellAction: sellAction,
            });
        }

    }

    function getDivCanBuy() {
        return document.querySelector("#profilelist > tbody > tr > td > p[style*='color: red;!important']");
    }

    async function buy() {
        var hour = (new Date()).getHours();
        if ( hour > lastBuyHour) {
            return;
        }

        for (const stock of lsMarketStock) {
            if (lsBought.find(x => x.stockId == stock.stockId) != null) {
                continue;
            }

            if (stock.available < 1000) {
                continue;
            }

            if (lastBuyHour - hour < 1 && stock.price > priceMinExp) {
                continue;
            }

            if (lastBuyHour - hour < 2 && stock.price > priceMinExp*2) {
                continue;
            }

            if (stock.state.match(/跌停/) == null) {
                if ((stock.price - stock.basePrice)/stock.basePrice > -priceMinDiff) {
                    continue;
                }

                if (stock.price > priceMinExp && (stock.price - stock.basePrice)/stock.basePrice >= -priceMinDiffExp) {
                    continue;
                }
            }

            if (stock.stockId == "[028]") {
                continue;
            }

            stock.buyAction.click();

            var now = new Date();
            var divCanBuy = null;
            do {
                divCanBuy = getDivCanBuy();
                await exceedWaitingTime(now, defaultMaxWaitTime);
                await delay(0.1);
            } while (divCanBuy == null);


            var canBuy = +divCanBuy.innerText.match(/\d+/g);
            if (canBuy <= 0) {
                document.querySelector("#fctrl_investbuy > span > a").click();
                return;
            }

            document.getElementById("paymount").value = 10;
            document.querySelector("#donate > p > button").click();

            do {
                divCanBuy = getDivCanBuy();
                await exceedWaitingTime(now, defaultMaxWaitTime);
                await delay(0.1);
            } while (divCanBuy != null);

            return;
        }
    }

    async function sell() {
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();

        for (const stock of lsBought) {
            var market = lsMarketStock.find(x => x.stockId == stock.stockId);

            if (stock.stockId == "[028]") {
                continue;
            }

            if ((stock.price - stock.basePrice)/stock.basePrice >= priceMinDiff*2
            || (market.basePrice > priceMinExp && market.price > market.basePrice)
            || (market.basePrice > priceMinExp && endHour - hour <= 1 && (stock.price - stock.basePrice)/stock.price >= 0.05)
            || (market != null && market.state.match(/涨停/) != null)
            || hour == endHour && minute >= endMinute) {
                stock.sellAction.click();

                var btnSubmit = null;
                do {
                    btnSubmit = document.querySelector("#fwin_dialog_submit");
                    await exceedWaitingTime(now, defaultMaxWaitTime);
                    await delay(0.1);
                } while (btnSubmit == null);

                btnSubmit.click();

                return;
            }
        }
    }

    async function waitIfClose() {
        var now = new Date();

        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();

        if (hour < startHour || (hour == startHour && minute < startMinute)) {
            nextCheckTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
        } else if (hour > endHour || (hour == endHour && (minute > endMinute || (minute == endMinute && second > 0)))) {
            nextCheckTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, startHour, startMinute);
        }

        // 休市期延后一天
        if (nextCheckTime.getDay() == offDay) {
            nextCheckTime.setDate(nextCheckTime.getDate()+1);
        }

        if (now < nextCheckTime) {
            console.log("waitIfClose", nextCheckTime);
            await waitUntil(nextCheckTime);
            await reloadpage();
        }
    }

    async function waitUntilRefresh() {
        var now = new Date();

        nextCheckTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), parseInt(now.getMinutes()/20 +1)*20, 1);
        console.log("waitUntilRefresh", nextCheckTime);
        await waitUntil(nextCheckTime);
        await reloadpage();
    }

    function delay(seconds){
        return new Promise(resolve => {
            setTimeout(resolve, seconds*1000);
        });
    }

    async function reloadpage() {
        location.reload();
        await delay(60);
    }

    async function waitUntil(nextCheck) {
        var now = new Date();
        while (now < nextCheck) {
            var diff = Math.floor((nextCheck - now)/1000);
            var maxGap = 60*5;
            await delay(diff > maxGap ? maxGap : diff);
            now = new Date();
        }
    }

    async function waitScreenLoaded() {
        var now = new Date();

        while(document.readyState != 'complete') {
            await exceedWaitingTime(now, screenLoadingWaitTime);
            await delay(0.1);
        }
        while (document.querySelector("#profilelist") == null) {
            await exceedWaitingTime(now, screenLoadingWaitTime);
            await delay(0.1);
        }
    }

    async function exceedWaitingTime(startTime, maxWaitTime) {
        var diff = (new Date() - startTime)/1000;
        if (diff > maxWaitTime) {
            await reloadpage();
        }
    }

})();