// ==UserScript==
// @name         Torn Crimes Rewards Value
// @namespace    https://github.com/1208nn
// @version      0.7.3
// @description  Shows the market value of all crime rewards. Thanks to https://greasyfork.org/scripts/476788
// @author       1208nn
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.torn.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/490660/Torn%20Crimes%20Rewards%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/490660/Torn%20Crimes%20Rewards%20Value.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    let db;
    let crimeChain = localStorage.getItem('silmaril-crimes-rewards-value-crime-chain') ?? 0;
    let penaltyCounter = localStorage.getItem('silmaril-crimes-rewards-value-penalty-counter') ?? 0;
    let apiKey = '###PDA-APIKEY###';
    if ('#' == apiKey[0]) { apiKey = localStorage.getItem('silmaril-crimes-rewards-value-apikey'); }
    let lastUpdatedDate = localStorage.getItem('silmaril-crimes-rewards-value-last-updated-date');
    const marketValuesUrl = 'https://api.torn.com/torn/?selections=items&key={apiKey}&comment=Cri%2FRwdVal';
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    const numberPattern = /\/(\d+)\//;

    const styles = `
div.silmaril-crimes-rewards-value {
    text-align: center;
    font-size: xx-small;
}
`;

    if (isTampermonkeyEnabled) {
        GM_addStyle(styles);
    } else {
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = styles;
        while (document.head == null) {
            await sleep(50);
        }
        document.head.appendChild(style);
    }

    try {
        GM_registerMenuCommand('Set Api Key', function () { checkApiKey(false); });
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
                if (data.error != null && data.error.code === 2) {
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
            if (mutation.type === 'childList' && mutationTarget.classList.contains('arrowButton___gYTVW')) {
                $("div.currentCrime___KNKYQ").on("click", "div.topSection___HchKK div.crimeBanner___LiKtj div.crimeSliderArrowButtons___N_y4N button.arrowButton___gYTVW", function () {
                    observer.disconnect();
                    setTimeout(function () {
                        observer.observe(targetNode, observerConfig);
                    }, 800);
                });
            }
            if (mutation.type === 'childList' && mutationTarget.classList.contains('outcomePanel___yyL3R')) {
                let outcomeDiv = mutationTarget.querySelector('div.outcome___Tnb4M');
                if (outcomeDiv == null || outcomeDiv.hasAttribute('data-value-set')) {
                    continue;
                }
                outcomeDiv.setAttribute('data-value-set', '');

                try {
                    const outcomeTitle = outcomeDiv.querySelector('div.outcomeReward___E34U7 > p.title___IrNe6').innerText;
                    crimeChain = localStorage.getItem('silmaril-crimes-rewards-value-crime-chain') ?? 0;
                    penaltyCounter = localStorage.getItem('silmaril-crimes-rewards-value-penalty-counter') ?? 0;
                    switch (outcomeTitle) {
                        case 'SUCCESS':
                            crimeChain++;
                            penaltyCounter--;
                            break;
                        case 'FAILURE':
                            crimeChain = Math.floor(crimeChain / 2);
                            penaltyCounter--;
                            break;
                        case 'JAIL':
                        case 'HOSPITAL':
                        case 'INJURY':
                            penaltyCounter = 20;
                            crimeChain = 0;
                            break;
                        case 'ERROR':
                            console.error('Error while making crime attempt');
                            break;
                    }
                } catch (e) {
                    console.error('Couldnt parse outcome result', e);
                }
                localStorage.setItem('silmaril-crimes-rewards-value-crime-chain', crimeChain);
                localStorage.setItem('silmaril-crimes-rewards-value-penalty-counter', penaltyCounter);


                let rewards = outcomeDiv.querySelectorAll('div.itemCell___aZaUE');
                if (rewards.length > 0) {
                    const itemIds = [];
                    rewards.forEach(reward => {
                        const imageDiv = reward.querySelector('img.image___gA5CC');
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
                        const itemQuantity = parseInt(reward.querySelector('span.count___hBmtm')?.textContent) ?? 1;
                        const itemMarketValue = itemsInfo[index]?.marketValue;
                        if (itemMarketValue == null) {
                            return;
                        }
                        const itemMarketValueBlock = document.createElement("div");
                        itemMarketValueBlock.className = "silmaril-crimes-rewards-value";
                        if (itemQuantity > 1 && itemMarketValue >= 0) {
                            const itemTotalMarketValue = itemQuantity * itemMarketValue;
                            itemMarketValueBlock.textContent = `$${itemTotalMarketValue.toLocaleString()} ($${itemMarketValue.toLocaleString()})`;
                        } else {
                            itemMarketValueBlock.textContent = itemMarketValue >= 0 ? `$${itemMarketValue.toLocaleString()}` : '???';
                        }

                        reward.appendChild(itemMarketValueBlock);
                    });
                }
                break;
            }
        }
    });
    observer.observe(targetNode, observerConfig);


    function checkApiKey(checkExisting = true) {
        if (!checkExisting || apiKey === null || apiKey.length != 16) {
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

    function getItemIdFromImage(image) {
        let match = image.src.match(numberPattern);
        if (match) {
            return match[1];
        } else {
            console.error("[TornCrimesRewardsValue] ItemId not found!");
        }
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