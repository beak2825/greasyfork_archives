// ==UserScript==
// @name         Torn Crimes Rewards Value
// @namespace    https://github.com/SOLiNARY
// @version      0.4.1
// @description  Shows the market value of all crime rewards.
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/476788/Torn%20Crimes%20Rewards%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/476788/Torn%20Crimes%20Rewards%20Value.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let db;
    let apiKey = localStorage.getItem('silmaril-crimes-rewards-value-apikey');
    let lastUpdatedDate = localStorage.getItem('silmaril-crimes-rewards-value-last-updated-date');
    const marketValuesUrl = 'https://api.torn.com/torn/?selections=items&key={apiKey}';
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    const numberPattern = /\/(\d+)\//;

    const styles = `
div.silmaril-crimes-rewards-value {
    text-align: center;
    font-size: xx-small;
}

span#silmaril-crimes-rewards-value-total {
    color: var(--crimes-outcome-failure-largeColoredText-color);
}
`;

    if (isTampermonkeyEnabled){
        GM_addStyle(styles);
    } else {
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = styles;
        while (document.head == null){
            await sleep(50);
        }
        document.head.appendChild(style);
    }

    try {
        GM_registerMenuCommand('Set Api Key', function() { checkApiKey(false); });
    } catch (error) {
        console.log('[TornCrimesRewardsValue] Tampermonkey not detected!');
    }

    openDatabase();

    if (lastUpdatedDate !== getToday()) {
        checkApiKey();
        const requestUrl = marketValuesUrl.replace("{apiKey}", apiKey);
        fetch(requestUrl)
            .then(response => response.json())
            .then(data => {
            if (data.error != null && data.error.code === 2){
                apiKey = null;
                localStorage.setItem("silmaril-crimes-rewards-value-apikey", null);
                console.error("[TornCrimesRewardsValue] Incorrect Api Key:", data);
                return;
            }
            putData(data.items);
            localStorage.setItem("silmaril-crimes-rewards-value-last-updated-date", getToday());
            lastUpdatedDate = getToday();
        })
            .catch(error => {
            console.error("[TornCrimesRewardsValue] Error fetching data:", error);
        });
    }
    else {
        console.log('[TornCrimesRewardsValue] Database is up to date!');
    }

    const targetNode = document.querySelector("div.crimes-app");
    const observerConfig = { childList: true, subtree: true };
    const observer = new MutationObserver(async (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            let mutationTarget = mutation.target;
            if (mutation.type === 'childList' && mutationTarget.className.includes('arrowButton___')) {
                $("div[class*=currentCrime___]").on("click", "div[class*=topSection___] div[class*=crimeBanner___] div[class*=crimeSliderArrowButtons___] button[class*=arrowButton___]", function(){
                    observer.disconnect();
                    setTimeout(function(){
                        observer.observe(targetNode, observerConfig);
                    }, 800);
                });
            }
            if (mutationTarget.className.includes('outcomePanel___') || mutationTarget.className.includes('outcomeWrapper___')) {
                let outcomeDivs = mutationTarget.querySelectorAll('div[class*=outcome___]');
                let outcomeDiv = outcomeDivs[outcomeDivs.length - 1];
                if (outcomeDiv == null || outcomeDiv.hasAttribute('data-value-set')) {
                    continue;
                }
                outcomeDiv.setAttribute('data-value-set', '');
                let rewards = outcomeDiv.querySelectorAll('div[class*=itemCell___]');
                let totalValue = 0;
                if (rewards.length > 0) {
                    const itemIds = [];
                    rewards.forEach(reward => {
                        const imageDiv = reward.querySelector('img[class*=image___]');
                        if (imageDiv == null) {
                            reward.setAttribute('data-unknown-item', '');
                            return;
                        }
                        const itemId = getItemIdFromImage(imageDiv);
                        itemIds.push(itemId);
                    });

                    const itemsInfo = await getData(itemIds);

                    rewards.forEach(async (reward, index) => {
                        if (reward.hasAttribute('data-unknown-item')) {
                            return;
                        }
                        const itemQuantity = parseInt(reward.querySelector('span[class*=count___]')?.textContent) ?? 1;
                        const itemMarketValue = itemsInfo[index]?.marketValue;
                        if (itemMarketValue == null) {
                            return;
                        }
                        const itemMarketValueBlock = document.createElement("div");
                        itemMarketValueBlock.className = "silmaril-crimes-rewards-value";
                        if (itemQuantity > 1 && itemMarketValue >= 0) {
                            const itemTotalMarketValue = itemQuantity * itemMarketValue;
                            totalValue += itemTotalMarketValue;
                            itemMarketValueBlock.textContent = `$${itemTotalMarketValue.toLocaleString()} ($${itemMarketValue.toLocaleString()})`;
                        } else {
                            totalValue += itemMarketValue;
                            itemMarketValueBlock.textContent = itemMarketValue >= 0 ? `$${itemMarketValue.toLocaleString()}` : '???';
                        }

                        reward.appendChild(itemMarketValueBlock);
                    });
                    addToTotal(totalValue);
                } else {
                    let moneyGainedSpan = outcomeDiv.querySelector('[class*=reward___]');
                    if (moneyGainedSpan != null && moneyGainedSpan.textContent.indexOf('$') == 0 && moneyGainedSpan.parentNode.parentNode.querySelector('p[class*=title___]').textContent == 'SUCCESS') {
                        let moneyGained = Number(moneyGainedSpan.textContent.replace('$', ' ').replaceAll(',', ''));
                        totalValue += moneyGained;
                        addToTotal(totalValue);
                    }
                }
                break;
            }
        }
    });
    observer.observe(targetNode, observerConfig);

    function checkApiKey(checkExisting = true) {
        if (!checkExisting || apiKey === null || apiKey.length != 16){
            let userInput = prompt("Please enter a PUBLIC Api Key, it will be used to get today's item market values:", apiKey ?? '');
            if (userInput !== null && userInput.length == 16) {
                apiKey = userInput;
                localStorage.setItem("silmaril-crimes-rewards-value-apikey", userInput);
            } else {
                console.error("[TornCrimesRewardsValue] User cancelled the Api Key input.");
            }
        }
    }

    function getToday() {
        const now = document.querySelector('span.server-date-time').textContent.split(' ');
        return now[now.length - 1];
    }

    function openDatabase() {
        const request = indexedDB.open('silmarilCrimesRewardsValue', 1);
        request.onsuccess = function (event) {
            db = event.target.result;
            console.log("[TornCrimesRewardsValue] Database opened successfully", db);
        };
        request.onerror = function (event) {
            console.error("[TornCrimesRewardsValue] Error opening database:", event.target.error);
        };
        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            const objectStore = db.createObjectStore("itemMarketValuesStore", { keyPath: "itemId" });

            objectStore.createIndex("itemId", "itemId", { unique: true });
        };
    }

    async function putData(data) {
        while (db == null) {
            await sleep(25);
        }

        const writeTransaction = db.transaction("itemMarketValuesStore", "readwrite");
        const writeObjectStore = writeTransaction.objectStore("itemMarketValuesStore");

        for (const itemId in data) {
            if (data.hasOwnProperty(itemId)) {
                const item = data[itemId];
                const itemProxy = new ItemProxy(itemId, item.market_value, item.circulation);
                const request = await writeObjectStore.put(itemProxy);

                request.onerror = function (event) {
                    console.error("[TornCrimesRewardsValue] Error adding/updating data:", event.target.error);
                };
            }
        }

    }

    async function getData(itemIds) {
        while (db == null) {
            await sleep(25);
        }

        const transaction = db.transaction("itemMarketValuesStore", "readonly");
        const objectStore = transaction.objectStore("itemMarketValuesStore");

        const results = [];

        const promises = itemIds.map((itemId) => {
            return new Promise((resolve, reject) => {
                const request = objectStore.get(itemId);
                request.onsuccess = function (e) {
                    results.push(e.target.result);
                    resolve();
                };
                request.onerror = function (e) {
                    reject(e.target.error);
                };
            });
        });

        await Promise.all(promises);

        transaction.oncomplete = function () {
            console.log("[TornCrimesRewardsValue] All get queries completed.");
        };

        transaction.onerror = function (event) {
            console.error("[TornCrimesRewardsValue] Error during transaction:", event.target.error);
        };

        return results;
    }

    function getItemIdFromImage(image){
        let match = image.src.match(numberPattern);
        if (match) {
            return match[1];
        } else {
            console.error("[TornCrimesRewardsValue] ItemId not found!");
        }
    }

    function addToTotal(sumToAdd){
        let counter = getTotalCounter();
        let prevTotal = Number(sessionStorage.getItem('silmaril-crimes-rewards-value-total') ?? 0);
        let newTotal = prevTotal + sumToAdd;
        sessionStorage.setItem('silmaril-crimes-rewards-value-total', newTotal);
        counter.textContent = `$${newTotal.toLocaleString()}`;
    }

    function getTotalCounter(){
        let totalElement = document.getElementById('silmaril-crimes-rewards-value-total');
        if (totalElement != null){
            return totalElement;
        }
        let elementToClone = document.querySelector('.crimes-app .crime-root [class*=resultCount___][class*=successes___] span[class*=count___]');
        totalElement = elementToClone.cloneNode(true);
        totalElement.id = 'silmaril-crimes-rewards-value-total';
        let rawSessionTotal = sessionStorage.getItem('silmaril-crimes-rewards-value-total') ?? 0;
        if (isNaN(rawSessionTotal) || rawSessionTotal == 0){
            sessionStorage.setItem('silmaril-crimes-rewards-value-total', 0);
            rawSessionTotal = 0;
        }
        let sessionTotal = Number(rawSessionTotal);
        totalElement.textContent = `$${sessionTotal.toLocaleString()}`;
        elementToClone.parentNode.parentNode.insertBefore(totalElement, elementToClone.parentNode);
        return totalElement;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    class ItemProxy {
        constructor(itemId, marketValue, circulation) {
            this.itemId = itemId;
            this.marketValue = marketValue;
            this.circulation = circulation;
        }
    }
})();