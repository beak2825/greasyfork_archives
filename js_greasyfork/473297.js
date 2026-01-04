// ==UserScript==
// @name         Ta Zła Giełda - Skrypt do automatycznego grania na giełdzie premium
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Skrypt do automatycznego grania na giełdzie premium
// @author       You
// @match        https://*.plemiona.pl/game.php?*screen=market&mode=exchange*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plemiona.pl
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/473297/Ta%20Z%C5%82a%20Gie%C5%82da%20-%20Skrypt%20do%20automatycznego%20grania%20na%20gie%C5%82dzie%20premium.user.js
// @updateURL https://update.greasyfork.org/scripts/473297/Ta%20Z%C5%82a%20Gie%C5%82da%20-%20Skrypt%20do%20automatycznego%20grania%20na%20gie%C5%82dzie%20premium.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var localStorageData;

    const buySellAmount = 2800;
    const freeMerchants = parseInt($("#market_merchant_available_count").text());
    const merchantsLimit = 3;

    const resouces = {wood:TribalWars.getGameData().village.wood,stone: TribalWars.getGameData().village.stone,iron: TribalWars.getGameData().village.iron};
    const resoucesLimit = {wood:5000,stone:5000,iron:4000};

    var isProcessing = false;
    var accurateResouces = 0, accuratePP = 0;

    var attempts = 0;
    const maxAttempts = 10;

    const storageMax = TribalWars.getGameData().village.storage_max;
    const storageMaxPercent = 0.95;

    const arrivingResourcesElements = document.querySelectorAll('tr > th > span.nowrap');
    let arrivingResources = {wood:0,stone:0,iron:0};

    [...arrivingResourcesElements].forEach(element => {
        let resourceName = element.querySelector('.icon').getAttribute('data-title');

        switch(resourceName) {
            case 'Drewno':
                resourceName = 'wood';
                break;
            case 'Glina':
                resourceName = 'stone';
                break;
            case 'Żelazo':
                resourceName = 'iron';
                break;
            default:
                break;
        }

        let resourceValue = parseFloat(element.innerText.replace('.', '').replace(',', '.')) || 0;
        arrivingResources[resourceName] = resourceValue;
    });

    main();

    function main(){
        localStorageData = JSON.parse(localStorage.getItem('ta-zla-gielda-data'));
        initData();
        drawBilans();

        if(localStorageData.isWorking){
            setTimeout(() => {
                location.reload();
            }, Math.random() * 30000 + 30000);
        }

        setInterval(working, 8000);
    }

    function initData(){
        localStorageData = JSON.parse(localStorage.getItem('ta-zla-gielda-data'));
        if (!localStorageData) {
            localStorageData = {
                isWorking: false,
                bilans: {
                    pp: 0,
                    surowce: 0
                },
                data: {
                    sell:{
                        wood: 400,
                        stone: 400,
                        iron: 400
                    },
                    buy:{
                        wood: 800,
                        stone: 800,
                        iron: 800
                    },
                    ppAmount: 500
                }
            };
            localStorage.setItem('ta-zla-gielda-data', JSON.stringify(localStorageData));
        }
    }

    function drawBilans() {
        const pp = (localStorageData.bilans.pp > 0 ? "+" : "") + localStorageData.bilans.pp;
        const surowce = (localStorageData.bilans.surowce > 0 ? "+" : "") + localStorageData.bilans.surowce;

        const html = `
            <div id="ta-zla-gielda">
                <table style="width: 100%" class="vis premium-exchange">
                    <colgroup>
                        <col style="width: 25%">
                        <col style="width: 25%">
                        <col style="width: 25%">
                        <col style="width: 25%">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th style="text-align: left" colspan="2">Ta Zła Giełda: Bilans</th>
                            <td>
                                <div id="ta-zla-gielda-bilans-pp" class="center">
                                    <span class="icon header premium"></span>${pp}
                                </div>
                            </td>
                            <td>
                                <div id="ta-zla-gielda-bilans-surowce" class="center">
                                    <span class="icon header resouces"></span>${surowce}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button id="ta-zla-gielda-btn-edit" class="btn">Edytuj</button>
                <button id="ta-zla-gielda-btn-start" class="btn" style="${localStorageData.isWorking ? 'display: none;' : ''}">Start</button>
                <button id="ta-zla-gielda-btn-stop" class="btn" style="${localStorageData.isWorking ? '' : 'display: none;'}">Stop</button>
            </div>
            </div>
        `;

        const newElement = document.createElement('div');
        newElement.innerHTML = html;
        const target = document.getElementById('market_status_bar');
        target.parentNode.insertBefore(newElement, target.nextSibling);

        document.getElementById('ta-zla-gielda-btn-edit').onclick = drawManager;
        document.getElementById('ta-zla-gielda-btn-start').onclick = start;
        document.getElementById('ta-zla-gielda-btn-stop').onclick = stop;
    }

    function start() {
        let localStorageData = JSON.parse(localStorage.getItem('ta-zla-gielda-data'));
        localStorageData.isWorking = true;
        localStorage.setItem('ta-zla-gielda-data', JSON.stringify(localStorageData));

        location.reload();
    }

    function stop() {
        let localStorageData = JSON.parse(localStorage.getItem('ta-zla-gielda-data'));
        localStorageData.isWorking = false;
        localStorage.setItem('ta-zla-gielda-data', JSON.stringify(localStorageData));

        location.reload();
    }

    function drawManager(){
        const pp = (localStorageData.bilans.pp > 0 ? "+" : "") + localStorageData.bilans.pp;
        const surowce = (localStorageData.bilans.surowce > 0 ? "+" : "") + localStorageData.bilans.surowce;

        let html = `
        <div id="ta-zla-gielda">
        <table style="width: 100%" class="vis premium-exchange">
            <colgroup>
                <col style="width: 25%">
                <col style="width: 25%">
                <col style="width: 25%">
                <col style="width: 25%">
            </colgroup>
            <tbody>
                <tr>
                    <th>Ta Zła Giełda</th>
                    <th><img src="https://dspl.innogamescdn.com/asset/338943cf/graphic/resources/wood_21x18.png" class=""
                            data-title="Drewno"> Drewno</th>
                    <th><img src="https://dspl.innogamescdn.com/asset/338943cf/graphic/resources/stone_21x18.png" class=""
                            data-title="Glina"> Glina</th>
                    <th><img src="https://dspl.innogamescdn.com/asset/338943cf/graphic/resources/iron_21x18.png" class=""
                            data-title="Żelazo"> Żelazo</th>
                </tr>

                <tr>
                    <th style="text-align: left">Kupuj za:</th>
                    <td class="center">
                        <div class="premium-exchange-sep">
                            <input type="text" id="ta-zla-gielda-data-wood-buy" value = "{wood-buy}">
                        </div>
                        <div class="premium-exchange-sep">
                            ⇄
                        </div>
                        <div class="premium-exchange-sep">
                            <div class="cost-container cost-container-buy">
                                <span class="icon header premium" data-title="Punkty Premium"> </span> <span
                                    class="cost">1</span>
                            </div>
                        </div>
                    </td>
                    <td class="center">
                        <div class="premium-exchange-sep">
                            <input type="text" id="ta-zla-gielda-data-stone-buy" value = "{stone-buy}">
                        </div>
                        <div class="premium-exchange-sep">
                            ⇄
                        </div>
                        <div class="premium-exchange-sep">
                            <div class="cost-container cost-container-buy">
                                <span class="icon header premium" data-title="Punkty Premium"> </span> <span
                                    class="cost">1</span>
                            </div>
                        </div>
                    </td>
                    <td class="center">
                        <div class="premium-exchange-sep">
                            <input type="text" id="ta-zla-gielda-data-iron-buy" value = "{iron-buy}">
                        </div>
                        <div class="premium-exchange-sep">
                            ⇄
                        </div>
                        <div class="premium-exchange-sep">
                            <div class="cost-container cost-container-buy">
                                <span class="icon header premium" data-title="Punkty Premium"> </span> <span
                                    class="cost">1</span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th style="text-align: left">Sprzedaj surowce</th>
                    <td class="center">
                        <div class="premium-exchange-sep">
                            <input type="text" id="ta-zla-gielda-data-wood-sell" value = "{wood-sell}">
                        </div>
                        <div class="premium-exchange-sep">
                            ⇄
                        </div>
                        <div class="premium-exchange-sep">
                            <div class="cost-container cost-container-sell">
                                <span class="icon header premium" data-title="Punkty Premium"> </span> <span
                                    class="cost">1</span>
                            </div>
                        </div>
                    </td>
                    <td class="center">
                        <div class="premium-exchange-sep">
                            <input type="text" id="ta-zla-gielda-data-stone-sell" value = "{stone-sell}">
                        </div>
                        <div class="premium-exchange-sep">
                            ⇄
                        </div>
                        <div class="premium-exchange-sep">
                            <div class="cost-container cost-container-sell">
                                <span class="icon header premium" data-title="Punkty Premium"> </span> <span
                                    class="cost">1</span>
                            </div>
                        </div>
                    </td>
                    <td class="center">
                        <div class="premium-exchange-sep">
                            <input type="text" id="ta-zla-gielda-data-iron-sell" value = "{iron-sell}">
                        </div>
                        <div class="premium-exchange-sep">
                            ⇄
                        </div>
                        <div class="premium-exchange-sep">
                            <div class="cost-container cost-container-sell">
                                <span class="icon header premium" data-title="Punkty Premium"> </span> <span
                                    class="cost">1</span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th style="text-align: left">PP-Manager</th>
                    <td class="center">
                        <div>
                            <span class="icon header premium" data-title="Punkty Premium"></span>
                            <input type="text" id="ta-zla-gielda-data-pp-to-spend" value="{pp}">
                        </div>
                    </td>
                    <td>
                        <div id="ta-zla-gielda-bilans-pp" class="center">
                            <span class="icon header premium"></span>${pp}
                        </div>
                    </td>
                    <td>
                        <div id="ta-zla-gielda-bilans-surowce" class="center">
                            <span class="icon header resouces"></span>${surowce}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <button id="ta-zla-gielda-btn-save" class="btn">Save</button>
    </div>
        `;

        html = html.replace('{pp}', localStorageData.data.ppAmount.toString());
        html = html.replace('{wood-buy}', localStorageData.data.buy.wood.toString());
        html = html.replace('{stone-buy}', localStorageData.data.buy.stone.toString());
        html = html.replace('{iron-buy}', localStorageData.data.buy.iron.toString());
        html = html.replace('{wood-sell}', localStorageData.data.sell.wood.toString());
        html = html.replace('{stone-sell}', localStorageData.data.sell.stone.toString());
        html = html.replace('{iron-sell}', localStorageData.data.sell.iron.toString());

        const newElement = document.createElement('div');
        newElement.innerHTML = html;

        const target = document.getElementById('ta-zla-gielda');
        target.parentNode.replaceChild(newElement, target);

        document.getElementById('ta-zla-gielda-btn-save').onclick = saveDataToLocalStorage;
    }

    function saveDataToLocalStorage() {
        localStorageData.data.ppAmount = document.getElementById('ta-zla-gielda-data-pp-to-spend').value;
        localStorageData.data.sell.wood = document.getElementById('ta-zla-gielda-data-wood-sell').value;
        localStorageData.data.sell.stone = document.getElementById('ta-zla-gielda-data-stone-sell').value;
        localStorageData.data.sell.iron = document.getElementById('ta-zla-gielda-data-iron-sell').value;
        localStorageData.data.buy.wood = document.getElementById('ta-zla-gielda-data-wood-buy').value;
        localStorageData.data.buy.stone = document.getElementById('ta-zla-gielda-data-stone-buy').value;
        localStorageData.data.buy.iron = document.getElementById('ta-zla-gielda-data-iron-buy').value;

        localStorage.setItem('ta-zla-gielda-data', JSON.stringify(localStorageData));

        location.reload();
    }

    function working(){
        const bilanspp = parseInt(localStorageData.bilans.pp);
        const pp = parseInt(localStorageData.data.ppAmount);

        const buyButton = $('.btn-premium-exchange-buy');
        if(!buyButton.text().includes("Poczekaj") || !buyButton.prop('disabled')){
            isProcessing = false;
        }
        else{
            isProcessing = true;
        }
        if(!localStorageData.isWorking || isProcessing) return;

        const rates = {
            wood: document.querySelector('#premium_exchange_rate_wood .premium-exchange-sep:nth-child(1)').innerText,
            stone: document.querySelector('#premium_exchange_rate_stone .premium-exchange-sep:nth-child(1)').innerText,
            iron: document.querySelector('#premium_exchange_rate_iron .premium-exchange-sep:nth-child(1)').innerText,
        };

        for (const resource in rates) {
            if(isProcessing) return;
            const price = parseInt(rates[resource], 10);
            if (price <= localStorageData.data.sell[resource] && freeMerchants > merchantsLimit && resouces[resource]>resoucesLimit[resource]) {
                isProcessing = true;
                const input = document.querySelector(`input[name="sell_${resource}"]`);
                input.value = buySellAmount;

                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                input.dispatchEvent(event);

                const submitBtn= document.querySelector(`.btn-premium-exchange-buy`);
                submitBtn.click();

                setTimeout(() => {
                    const confirmButton = document.querySelector(".btn-confirm-yes");

                    let confirmationMsg = document.querySelector("#confirmation-msg");

                    if (confirmationMsg) {
                        let tdText = $(confirmationMsg).find('td').last().text()
                        // Szukaj tekstu "Sprzedaż LICZBA za LICZBA" w confirmationMsg
                        let resourcesMatch = tdText.match(/Sprzedaż  (\d+) za  (\d+)/);
                        if (resourcesMatch) {
                            accurateResouces = parseInt(resourcesMatch[1], 10) * -1;
                            accuratePP = parseInt(resourcesMatch[2], 10);
                        }
                        console.log(accurateResouces,accuratePP);
                    }

                    if (confirmButton) {
                        confirmButton.click();
                        const checkSuccessBox = () => {
                            let successBox = $(".autoHideBox.success");
                            if (successBox.length) {
                                updateBilansData(accurateResouces, accuratePP);
                            } else if (attempts < maxAttempts) {
                                attempts += 1;
                                setTimeout(checkSuccessBox, 500);
                            } else {
                                location.reload();
                            }
                        };

                        checkSuccessBox();
                    }
                }, 400);
                break;
            }
            if(price >= localStorageData.data.buy[resource]){
                if(pp+bilanspp<=0)continue;

                if(storageMax*storageMaxPercent <= resouces[resource]+buySellAmount+arrivingResources[resource])continue;

                isProcessing = true;
                const input = document.querySelector(`input[name="buy_${resource}"]`);
                input.value = buySellAmount;

                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                input.dispatchEvent(event);

                const submitBtn= document.querySelector(`.btn-premium-exchange-buy`);
                submitBtn.click();

                setTimeout(() => {
                    const confirmButton = document.querySelector(".btn-confirm-yes");

                    let confirmationMsg = document.querySelector("#confirmation-msg");

                    if (confirmationMsg) {
                        let tdText = $(confirmationMsg).find('td').last().text()
                        // Szukaj tekstu "Kupno LICZBA za LICZBA" w confirmationMsg
                        let resourcesMatch = tdText.match(/Kupno  (\d+) za  (\d+)/);
                        if (resourcesMatch) {
                            accurateResouces = parseInt(resourcesMatch[1], 10);
                            accuratePP = parseInt(resourcesMatch[2], 10) * -1;
                        }
                        console.log(accurateResouces,accuratePP);
                    }

                    if (confirmButton) {
                        confirmButton.click();
                        const checkSuccessBox = () => {
                            let successBox = $(".autoHideBox.success");
                            if (successBox.length) {
                                updateBilansData(accurateResouces, accuratePP);
                            } else if (attempts < maxAttempts) {
                                attempts += 1;
                                setTimeout(checkSuccessBox, 500);
                            } else {
                                location.reload();
                            }
                        };

                        checkSuccessBox();
                    }
                }, 400);
            }
        }
    }

    function updateBilansData(resources, price) {
        console.log(resources,price);
        localStorageData.bilans.surowce += resources;
        localStorageData.bilans.pp += price

        attempts = 0;

        localStorage.setItem('ta-zla-gielda-data', JSON.stringify(localStorageData));
        location.reload();
    }
})();