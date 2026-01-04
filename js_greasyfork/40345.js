// ==UserScript==
// @name         Fanatical Price Checker
// @name:zh-CN   Fanatical 跨区价格查询
// @name:zh-TW   Fanatical 跨區價格查詢
// @namespace    https://www.fanatical.com/
// @version      0.3.1
// @description  Check the price of different regions for Fanatical.
// @description:zh-CN 查询不同区域的Fanatical游戏/慈善包的价格
// @description:zh-TW 查詢不同區域的Fanatical遊戲/慈善包的價格
// @icon         https://cdn.fanatical.com/production/icons/android-chrome-192x192.png
// @author       Thesharing
// @license      MIT
// @include      /^https?://www\.fanatical\.com/en/bundle/.+$
// @include      /^https?://www\.fanatical\.com/en/game/.+$
// @include      /^https?://www\.fanatical\.com/en/dlc/.+$
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/40345/Fanatical%20Price%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/40345/Fanatical%20Price%20Checker.meta.js
// ==/UserScript==

var totalNum = 0;
var priceList = [];
var regionList = ["USD", "CAD", "EUR", "GBP"];
var curList = {};
var urlType = document.URL.split('/')[4];
var targetCur = "CNY";

(function () {
    'use strict';
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var target = document.querySelector('#root');
    var config = {
        attributes: true,
        childList: true,
        characterData: true
    };
    var continuousObserver = new MutationObserver(function (mutations, me) {
        var normalPageContainer = document.getElementsByClassName('product-commerce-container');
        var starDealPageContainer = document.getElementsByClassName('purchase-info-container');
        if (starDealPageContainer.length > 0){
            console.log('STARDEAL');
            addStarDealButton(starDealPageContainer[0]);
        }
        if (normalPageContainer.length > 0) {
            console.log('NORMAL');
            addNormalButton(normalPageContainer[0]);
        }
    });

    var subObserver = new MutationObserver(function (mutations, me) {
        var normalPageContainer = document.getElementsByClassName('product-commerce-container');
        if (normalPageContainer.length > 0) {
            addNormalButton(normalPageContainer[0]);
            var subContent = document.querySelector('.content').querySelector('div');
            continuousObserver.observe(subContent, config);
            me.disconnect();
        }
    });
    
    var observer = new MutationObserver(function (mutations, me) {
        var content = document.querySelector('.content');
        if (content) {
            subObserver.observe(content, config);
            me.disconnect();
        }
    });
    observer.observe(target, config);
})();

function addNormalButton(container) {
    var outsideContainer = document.createElement('div');
    outsideContainer.className = 'col-12 col-md-6 col-lg-12';
    container.appendChild(outsideContainer);
    var priceContainer = document.createElement('div');
    priceContainer.className = 'p-3 pl-md-1 pl-lg-3 card-block';
    priceContainer.id = 'checkPrice';
    outsideContainer.appendChild(priceContainer);
    var button = document.createElement('button');
    button.className = 'mt-3 cart-btn btn btn-primary btn-lg btn-block';
    button.id = 'checkPriceButton';
    button.onclick = checkPrice;
    var buttonText = document.createElement('b');
    buttonText.id = 'checkPriceButtonText';
    buttonText.appendChild(document.createTextNode('Check Price'));
    button.appendChild(buttonText);
    priceContainer.appendChild(button);
    var checkPriceList = document.createElement('div');
    checkPriceList.id = 'checkPriceList';
    checkPriceList.className = 'mt-3';
    priceContainer.appendChild(checkPriceList);
}

function addStarDealButton(container) {
    var priceContainer = document.createElement('div');
    priceContainer.id = 'checkPrice';
    container.appendChild(priceContainer);
    var button = document.createElement('button');
    button.className = 'cart-btn btn btn-primary btn-lg';
    button.id = 'checkPriceButton';
    button.onclick = checkPrice;
    button.style = 'height: 48px; margin-left: 10px;';
    var buttonText = document.createElement('b');
    buttonText.id = 'checkPriceButtonText';
    buttonText.appendChild(document.createTextNode('Check Price'));
    button.appendChild(buttonText);
    priceContainer.appendChild(button);
    var checkPriceList = document.createElement('div');
    checkPriceList.id = 'checkPriceList';
    var title = document.getElementsByClassName('purchase-info-title')[0];
    title.appendChild(checkPriceList);
}

function checkPrice() {
    var buttonText = document.getElementById('checkPriceButtonText');
    buttonText.innerText = 'Checking Price...';
    if (urlType == 'bundle') {
        var bundleName = document.URL.split('/')[5];
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.fanatical.com/api/products/" + bundleName,
            onload: function (response) {
                var bundleData = JSON.parse(response.responseText);
                priceList.length = 0;
                for (var i = 0; i < bundleData.bundles.length; i++) {
                    var bundlePrice = {};
                    for (var j = 0; j < regionList.length; j++) {
                        var priceItem = {
                            'price': bundleData.bundles[i].price[regionList[j]] / 100,
                            'targetCur': 0
                        };
                        bundlePrice[regionList[j]] = priceItem;
                    }
                    priceList.push(bundlePrice);
                }
                fetchCurrency(buttonText);
            }
        });
    } else if (urlType == 'game' || urlType == 'dlc') {
        var gameName = document.URL.split('/')[5];
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.fanatical.com/api/products/" + gameName,
            onload: function (response) {
                var gameData = JSON.parse(response.responseText);
                var discount = 1.0;
                if('current_discount' in gameData && 'percent'in gameData.current_discount){
                    discount = 1 - gameData.current_discount.percent;
                }
                priceList.length = 0;
                gamePrice = {};
                for (var i = 0; i < regionList.length; i++) {
                    var priceItem = {
                        'price': gameData.price[regionList[i]] * discount / 100,
                        'targetCur': 0
                    };
                    gamePrice[regionList[i]] = priceItem;
                }
                priceList.push(gamePrice);
                fetchCurrency(buttonText);
            }
        });
    }
}

function fetchCurrency(buttonText) {
    for (var k = 0; k < regionList.length; k++) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://finance.google.cn/finance/converter?a=1&from=" + regionList[k] + "&to=" + targetCur,
            context: {
                'region': regionList[k],
            },
            onload: function (response) {
                var responseDocument = new DOMParser().parseFromString(response.responseText, "text/html");
                var result = responseDocument.getElementById('currency_converter_result').innerText;
                curList[response.context.region] = extractCurrency(result);
                if (Object.keys(curList).length >= regionList.length) {
                    buttonText.innerText = 'Finished!';
                    if (urlType == 'bundle') {
                        displayBundleResult();
                    } else if (urlType == 'game' || urlType == 'dlc') {
                        displayGameResult();
                    }
                }
            }
        });
    }
}

function extractCurrency(str) {
    return parseFloat(str.trim().split(' ')[3]);
}

function displayBundleResult() {
    var cheapList = [];
    for (var i = 0; i < priceList.length; i++) {
        var cheapPrice = 10000.0;
        var cheapRegion = 'USD';
        for (var j = 0; j < regionList.length; j++) {
            var priceItem = priceList[i][regionList[j]];
            priceItem.targetCur = (curList[regionList[j]] * priceItem.price);
            if (priceItem.targetCur < cheapPrice) {
                cheapPrice = priceItem.targetCur;
                cheapRegion = regionList[j];
            }
        }
        cheapList.push(cheapRegion);
    }
    // RENDER
    var c = document.getElementById('checkPriceList');
    while (c.firstChild) {
        c.removeChild(c.firstChild);
    }
    for (var k = 0; k < priceList.length; k++) {
        var container = document.createElement('div');
        container.className = 'mt-3';
        c.appendChild(container);
        var titleText = document.createElement('b');
        titleText.appendChild(document.createTextNode('Tier ' + (k + 1).toString()));
        var title = document.createElement('h4');
        title.appendChild(titleText);
        container.appendChild(title);
        for (var l = 0; l < regionList.length; l++) {
            var priceText;
            if (regionList[l] == cheapList[k]) {
                priceText = document.createElement('b');
            } else {
                priceText = document.createElement('span');
            }
            var priceValue = priceList[k][regionList[l]];
            priceText.appendChild(document.createTextNode(priceValue.price.toFixed(2) + ' ' + regionList[l] + ' = ' + priceValue.targetCur.toFixed(2) + ' ' + targetCur));
            container.appendChild(priceText);
            container.appendChild(document.createElement('br'));
        }
    }
}

function displayGameResult() {
    var cheapPrice = 10000.0;
    var cheapRegion = 'USD';
    for (var j = 0; j < regionList.length; j++) {
        var priceItem = priceList[0][regionList[j]];
        priceItem.targetCur = (curList[regionList[j]] * priceItem.price);
        if (priceItem.targetCur < cheapPrice) {
            cheapPrice = priceItem.targetCur;
            cheapRegion = regionList[j];
        }
    }
    // RENDER
    var c = document.getElementById('checkPriceList');
    while (c.firstChild) {
        c.removeChild(c.firstChild);
    }
    var container = document.createElement('div');
    container.className = 'mt-3';
    c.appendChild(container);
    for (var l = 0; l < regionList.length; l++) {
        var priceText;
        if (regionList[l] == cheapRegion) {
            priceText = document.createElement('b');
        } else {
            priceText = document.createElement('span');
        }
        var priceValue = priceList[0][regionList[l]];
        priceText.appendChild(document.createTextNode(priceValue.price.toFixed(2) + ' ' + regionList[l] + ' = ' + priceValue.targetCur.toFixed(2) + ' ' + targetCur));
        container.appendChild(priceText);
        container.appendChild(document.createElement('br'));
    }
}