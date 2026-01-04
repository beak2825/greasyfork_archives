// ==UserScript==
// @name         Stock Advisor
// @namespace    http://tampermonkey.net/
// @version      1.0.23
// @description  Sets buy and sell prices for stocks and advise on either depending on current stock price.
// @author       AlienZombie [2176352]
// @match        https://www.torn.com/stockexchange.php
// @source       https://greasyfork.org/en/scripts/389899-stock-advisor
// @downloadURL https://update.greasyfork.org/scripts/389899/Stock%20Advisor.user.js
// @updateURL https://update.greasyfork.org/scripts/389899/Stock%20Advisor.meta.js
// ==/UserScript==

/*
The stockInfo object has the following structure:
{stocks: [{
    title: "",
    code: "",
    sellPrice: 0,
    buyPrice: 0
}]}
*/

(function() {
    'use strict';

    console.log('Stock Advisor Started')

    var stockData = [{
        title: "Torn City Stock Exchange",
        code: "TCSE",
        maximum: 12533,
        minimum: 11791,
        detail: ""
    },{
        title: "Mc Smoogle Corp",
        code: "MCS",
        maximum: 1000000, //2101,
        minimum: 0, //1880,
        detail: ""
    },{
        title: "Performance Ribaldry Network",
        code: "PRN",
        maximum: 1030,
        minimum: 893,
        detail: "DROPPING!"
    },{
        title: "Symbiotic Ltd.",
        code: "SYM",
        maximum: 1000000, //715,
        minimum: 0, //507,
        detail: ""
    },{
        title: "Wind Lines Travel",
        code: "WLT",
        maximum: 1000000, //772,
        minimum: 0, //619,
        detail: ""
    },{
        title: "Lucky Shots Casino",
        code: "LSC",
        maximum: 1000000, //673,
        minimum: 0, //551,
        detail: ""
    },{
        title: "Torn City Health Service",
        code: "TCHS",
        maximum: 366,
        minimum: 334,
        detail: ""
    },{
        title: "Torn City Investment Banking",
        code: "TCB",
        maximum: 1000000, //542,
        minimum: 0, //467,
        detail: ""
    },{
        title: "Crude & Co.",
        code: "CNC",
        maximum: 1000000, //736,
        minimum: 0, //475,
        detail: ""
    },{
        title: "Torn City and Shanghai Banking Corporation",
        code: "TSBC",
        maximum: 1000000, //499,
        minimum: 0, //481,
        detail: ""
    },{
        title: "Syscore MFG",
        code: "SYS",
        maximum: 1000000, //498,
        minimum: 0, //469,
        detail: ""
    },{
        title: "Home Retail Group",
        code: "HRG",
        maximum: 420,
        minimum: 352,
        detail: ""
    },{
        title: "Eaglewood Mercenary",
        code: "EWM",
        maximum: 230,
        minimum: 186,
        detail: ""
    },{
        title: "Big Al's Gun Shop",
        code: "BAG",
        maximum: 1000000, //383,
        minimum: 0, //322,
        detail: ""
    },{
        title: "TC Music Industries",
        code: "TMI",
        maximum: 1000000, //348,
        minimum: 0, //309,
        detail: ""
    },{
        title: "Torn City Motors",
        code: "TCM",
        maximum: 1000000, //304,
        minimum: 0, //288,
        detail: ""
    },{
        title: "International School TC",
        code: "ISTC",
        maximum: 1000000, //300,
        minimum: 0, //250,
        detail: ""
    },{
        title: "Feathery Hotels Group",
        code: "FHG",
        maximum: 1000000, //261,
        minimum: 0, //253,
        detail: ""
    },{
        title: "Grain",
        code: "GRN",
        maximum: 1000000, //305,
        minimum: 0, //251,
        detail: ""
    },{
        title: "Torn City Clothing",
        code: "TCC",
        maximum: 1000000, //253,
        minimum: 0, //225,
        detail: ""
    },{
        title: "Evil Ducks Candy Corp",
        code: "EVL",
        maximum: 1000000, //293,
        minimum: 0, //226,
        detail: ""
    },{
        title: "Insured On Us",
        code: "IOU",
        maximum: 246,
        minimum: 184,
        detail: ""
    },{
        title: "TC Media Productions",
        code: "TCP",
        maximum: 214,
        minimum: 178,
        detail: ""
    },{
        title: "Society and Legal Authorities Group",
        code: "SLAG",
        maximum: 1000000, //214,
        minimum: 0, //193,
        detail: ""
    },{
        title: "The Empty Lunchbox Building Traders",
        code: "ELBT",
        maximum: 235,
        minimum: 182,
        detail: ""
    },{
        title: "The Torn City Times",
        code: "TCT",
        maximum: 227,
        minimum: 183,
        detail: ""
    },{
        title: "Messaging Inc.",
        code: "MSG",
        maximum: 145,
        minimum: 120,
        detail: ""
    },{
        title: "West Side South Bank University",
        code: "WSSB",
        maximum: 101,
        minimum: 80,
        detail: ""
    },{
        title: "Tell Group Plc.",
        code: "TGP",
        maximum: 100,
        minimum: 80,
        detail: ""
    },{
        title: "I Industries Ltd.",
        code: "IIL",
        maximum: 78,
        minimum: 65,
        detail: ""
    },{
        title: "Yazoo",
        code: "YAZ",
        maximum: 80,
        minimum: 42,
        detail: ""
    },];

    var saveInfo = JSON.parse(localStorage.stockInfo || "{}");
    var stockInfo = {};

    $(document).ready(start_up);

    function start_up () {
        load_stock_info();
    }

    var intervalId = setInterval(lookForStock, 500);

    function lookForStock() {
        var stockList = document.querySelector('.stock-list');
        var stockItems = stockList.querySelectorAll("li.item");

        if (stockItems) {
            ProcessStock(stockItems);
            clearInterval(intervalId);
        }
    }

    function load_stock_info() {
        stockInfo.stocks = saveInfo.stocks || stockData;
    }
    
    function save_stock_info() {
        localStorage.stockInfo = JSON.stringify(stockInfo);
    }

    function ProcessStock(stockItems) {
        stockItems.forEach(function(stockItem) {
            if (!stockItem) { 
                console.log("Failing on stockItem.");
                console.log(stockItem);
                return;
            }

            var stockTitleItem = stockItem.querySelector(".abbr-name");

            if (!stockTitleItem) { 
                console.log("Failing on stockTitleItem.");
                console.log(stockTitleItem);
                return;
            }
            
            var stockTitle = stockTitleItem.getAttribute("title");
            var stockCode = stockTitleItem.innerText;
            var stockPriceItem = stockItem.querySelector(".price");

            if (!stockPriceItem) { 
                console.log("Failing on stockPriceItem.");
                console.log(stockPriceItem);
                return;
            }
            
            var stockPriceText = stockPriceItem.innerText;
            var priceIdx = stockPriceText.indexOf("$") + 1;
            var formattedPrice = stockPriceText.substring(priceIdx, stockPriceText.length);
            var price = formattedPrice.replace(",","");
            var stockNameItem = stockItem.querySelector(".name");

            if (!stockNameItem) { 
                console.log("Failing on stockNameItem.");
                console.log(stockNameItem);
                return;
            }
            
            var advisorInfo = {};
            for (var i = 0; i < stockInfo.stocks.length; i++) {
                if (stockInfo.stocks[i].code == stockCode) {
                    advisorInfo = stockInfo.stocks[i];
                    break;
                }
            }

            if (!advisorInfo) {
                console.log("Failing on advisorInfo. Possibly the stockCode is not found. stockCode:");
                console.log(stockCode);
                return;
            }

            var diff = advisorInfo.maximum - advisorInfo.minimum;
            var average = (diff / 2) + advisorInfo.minimum;
            var sellPrice = advisorInfo.maximum - (diff / 4);
            var buyPrice = advisorInfo.minimum + (diff / 4);

            if (price > sellPrice) {
                var overAverage = price - average;
                var fromMaximum = advisorInfo.maximum - price;
                stockNameItem.insertAdjacentHTML("beforeend", "<span style='background-color: aquamarine; border: 1px solid #0bb79d; border-radius: 5px; padding: 3px; margin-left: 5px;'>SELL</span><span>Over Average: " + overAverage + "</span><span>From Max: " + fromMaximum + "</span>");
            } else if (price < buyPrice) {
                var belowAverage = average - price;
                var aboveMinimum = price - advisorInfo.minimum;
                stockNameItem.insertAdjacentHTML("beforeend", "<span style='background-color: #59bf59; border: 1px solid #028204; border-radius: 5px; padding: 3px; margin-left: 5px;'>BUY</span><span>Below Average: " + belowAverage + "</span><span>Above Min: " + aboveMinimum + "</span>");
            } else {
                stockNameItem.insertAdjacentHTML("beforeend", "<span style='background-color: khaki; border: 1px solid #c7b724; border-radius: 5px; padding: 3px; margin-left: 5px;'>WAIT</span>");
            }
        });
    }
})();