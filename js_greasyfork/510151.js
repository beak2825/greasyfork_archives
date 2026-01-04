// ==UserScript==
// @name         Live Stock Roi
// @version      2024-09-25.1
// @description  This script uses current MP for calculating ROI
// @author       Elvay [3095345]
// @match        https://www.torn.com/page.php?sid=stocks
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_info
// @namespace https://greasyfork.org/users/1279378
// @downloadURL https://update.greasyfork.org/scripts/510151/Live%20Stock%20Roi.user.js
// @updateURL https://update.greasyfork.org/scripts/510151/Live%20Stock%20Roi.meta.js
// ==/UserScript==

'use strict';

var apiKey;
if (GM_getValue('apiKey') != undefined) {
    apiKey = GM_getValue('apiKey')
} else {

    apiKey = prompt("Enter ApiKey");
    GM_setValue('apiKey', apiKey);
}

var stocks = {
    "stocks": {
        "1": {
            "stock_id": 1,
            "acronym": "TSB",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 31,
                "requirement": 3000000,
                "description": "$50,000,000",
                "reward": 50000000,
            },
        },
        "2": {
            "stock_id": 2,
            "acronym": "TCI",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 1500000,
                "description": "a 10% bank interest bonus",
            },
        },
        "3": {
            "stock_id": 3,
            "acronym": "SYS",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 3000000,
                "description": "an Advanced firewall",
            },
        },
        "4": {
            "stock_id": 4,
            "acronym": "LAG",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 750000,
                "description": "1x Lawyer's Business Card",
                "reward": null,
                "itemId": 368,
            },
        },
        "5": {
            "stock_id": 5,
            "acronym": "IOU",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 31,
                "requirement": 3000000,
                "description": "$12,000,000",
                "reward": 12000000,
            },
        },
        "6": {
            "stock_id": 6,
            "acronym": "GRN",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 31,
                "requirement": 500000,
                "description": "$4,000,000",
                "reward": 4000000,
            },
        },
        "7": {
            "stock_id": 7,
            "acronym": "THS",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 150000,
                "description": "1x Box of Medical Supplies",
                "reward": null,
                "itemId": 365,
            },
        },
        "8": {
            "stock_id": 8,
            "acronym": "YAZ",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 1000000,
                "description": "Free banner advertising",
            },
        },
        "9": {
            "stock_id": 9,
            "acronym": "TCT",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 31,
                "requirement": 100000,
                "description": "$1,000,000",
                "reward": 1000000,
            },
        },
        "10": {
            "stock_id": 10,
            "acronym": "CNC",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 31,
                "requirement": 7500000,
                "description": "$80,000,000",
                "reward": 80000000,
            },
        },
        "11": {
            "stock_id": 11,
            "acronym": "MSG",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 300000,
                "description": "Free classified advertising",
            },
        },
        "12": {
            "stock_id": 12,
            "acronym": "TMI",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 31,
                "requirement": 6000000,
                "description": "$25,000,000",
                "reward": 25000000,
            },
        },
        "13": {
            "stock_id": 13,
            "acronym": "TCP",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 1000000,
                "description": "a Company sales boost",
            },
        },
        "14": {
            "stock_id": 14,
            "acronym": "IIL",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 1000000,
                "description": "50% coding time reduction",
            },
        },
        "15": {
            "stock_id": 15,
            "acronym": "FHG",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 2000000,
                "description": "1x Feathery Hotel Coupon",
                "reward": null,
                "itemId": 367,
            },
        },
        "16": {
            "stock_id": 16,
            "acronym": "SYM",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 500000,
                "description": "1x Drug Pack",
                "reward": null,
                "itemId": 370,
            },
        },
        "17": {
            "stock_id": 17,
            "acronym": "LSC",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 500000,
                "description": "1x Lottery Voucher",
                "reward": null,
                "itemId": 369,
            },
        },
        "18": {
            "stock_id": 18,
            "acronym": "PRN",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 1000000,
                "description": "1x Erotic DVD",
                "reward": null,
                "itemId": 366,
            },
        },
        "19": {
            "stock_id": 19,
            "acronym": "EWM",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 1000000,
                "description": "1x Box of Grenades",
                "reward": null,
                "itemId": 364,
            },
        },
        "20": {
            "stock_id": 20,
            "acronym": "TCM",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 1000000,
                "description": "10% racing skill gain boost",
            },
        },
        "21": {
            "stock_id": 21,
            "acronym": "ELT",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 5000000,
                "description": "10% home upgrade discount",
            },
        },
        "22": {
            "stock_id": 22,
            "acronym": "HRG",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 31,
                "requirement": 10000000,
                "description": "1x Random Property",
                "reward": 45456057.6923076,
            },
        },
        "23": {
            "stock_id": 23,
            "acronym": "TGP",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 2500000,
                "description": "a Company advertising boost",
            },
        },
        "24": {
            "stock_id": 24,
            "acronym": "MUN",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 5000000,
                "description": "1x Six-Pack of Energy Drink",
                "reward": null,
                "itemId": 818,
            },
        },
        "25": {
            "stock_id": 25,
            "acronym": "WSU",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 1000000,
                "description": "a 10% education course time reduction",
            },
        },
        "26": {
            "stock_id": 26,
            "acronym": "IST",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 100000,
                "description": "Free education courses",
            },
        },
        "27": {
            "stock_id": 27,
            "acronym": "BAG",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 3000000,
                "description": "1x Ammunition Pack",
                "reward": 0,
            },
        },
        "28": {
            "stock_id": 28,
            "acronym": "EVL",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 100000,
                "description": "1000 happiness",
                "reward": 0,
            },
        },
        "29": {
            "stock_id": 29,
            "acronym": "MCS",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 350000,
                "description": "100 energy",
                "reward": 0,
            },
        },
        "30": {
            "stock_id": 30,
            "acronym": "WLT",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 9000000,
                "description": "Private jet access",
            },
        },
        "31": {
            "stock_id": 31,
            "acronym": "TCC",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 31,
                "requirement": 7500000,
                "description": "1x Clothing Cache",
                "reward": null,
            },
        },
        "32": {
            "stock_id": 32,
            "acronym": "ASS",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 1000000,
                "description": "1x Six-Pack of Alcohol",
                "reward": null,
                "itemId": 817,
            },
        },
        "33": {
            "stock_id": 33,
            "acronym": "CBD",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 350000,
                "description": "50 nerve",
                "reward": 0,
            },
        },
        "34": {
            "stock_id": 34,
            "acronym": "LOS",
            "current_price": null,
            "benefit": {
                "type": "passive",
                "frequency": 7,
                "requirement": 7500000,
                "description": "25% boost to mission credits and money earned",
            },
        },
        "35": {
            "stock_id": 35,
            "acronym": "PTS",
            "current_price": null,
            "benefit": {
                "type": "active",
                "frequency": 7,
                "requirement": 10000000,
                "description": "100 points",
                "reward": null,
            },
        },
    },
};


function calcRoi(price, profit, duration) {
    return ((100 / price) * (profit / duration * 365))
}
async function updateCurrentStockPrice() {
    var link = "https://api.torn.com/torn/?selections=stocks&key=" + apiKey;

    await fetch(link)
        .then(async response => {
            var data = await response.json();
            Object.keys(stocks.stocks).forEach(function (stockId) {
                if (stocks.stocks[stockId])
                    stocks.stocks[stockId].current_price = data.stocks[stockId].current_price;
            })
        });

}
async function fetchItemMarketValue() {

    Object.keys(stocks.stocks).forEach(async function (stockId) {
        if (stocks.stocks[stockId].benefit.itemId != undefined) {
            await fetch('https://api.torn.com/torn/' + stocks.stocks[stockId].benefit.itemId + '?selections=items&key=' + apiKey)
                .then(async response => {
                    let data = await response.json();
                    console.log("Name ->" + data.items[stocks.stocks[stockId].benefit.itemId].name + " Price ->" + data.items[stocks.stocks[stockId].benefit.itemId].market_value)
                    stocks.stocks[stockId].benefit.reward = data.items[stocks.stocks[stockId].benefit.itemId].market_value;
                });

        }
    })
}

const patch = setTimeout(() => {
    updateCurrentStockPrice();
    fetchItemMarketValue();
    const table = document.querySelector('div[class^="stockMarket"]');
    if (table != null) {
        table.childNodes.forEach(function (item) {
            if (item.nodeName === 'UL') {
                item.childNodes.forEach(function (tab) {
                    if (tab.id === 'priceTab') {
                        var value = document.createElement("p");
                        value.style.cssText = "font-weight:bold;color: green;text-align: right;"
                        value.id = "Roi__" + item.id
                        tab.appendChild(value);
                    }
                });

            }
        });
    }
}, 1000);
var stocksApi = 'https://api.torn.com/torn/?selections=stocks&key=' + apiKey;

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js';
document.getElementsByTagName('head')[0].appendChild(script);


function updateEntries() {
    Object.keys(stocks.stocks).forEach(function (stockId) {
        var element = stocks.stocks[stockId];
        if (element.benefit.type == "active") {

            document.getElementById("Roi__" + element.stock_id).innerText = (calcRoi(element.benefit.requirement * element.current_price, element.benefit.reward, element.benefit.frequency).toFixed(2));
        }
    })

}

setInterval(updateEntries, 1000);

