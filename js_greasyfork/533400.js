// ==UserScript==
// @name         FarmRPG - Spam Fishing/Farming + Natsulus Quick Farming
// @namespace    duck.wowow
// @version      0.1.3
// @description  Adds button to the bottom of the left view when on farming to cycle through planting and harvesting, fishing and selling, and adds Natasulus' quick farming script
// @author       Odung
// @match        https://*.farmrpg.com/index.php
// @match        https://*.farmrpg.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/533400/FarmRPG%20-%20Spam%20FishingFarming%20%2B%20Natsulus%20Quick%20Farming.user.js
// @updateURL https://update.greasyfork.org/scripts/533400/FarmRPG%20-%20Spam%20FishingFarming%20%2B%20Natsulus%20Quick%20Farming.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const baseUrl = window.location.origin;
    const listeners = [];
    const buttons = [];


    function observePage(element) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-page') {
                    removeListeners();
                    removeButtons();
                    if (mutation.target.getAttribute('data-page') === 'xfarm') farm();
                    else if (mutation.target.getAttribute('data-page') === 'fishing') fishing();
                }
            }
        });

        observer.observe(element, { attributes: true });
    }

    function removeListeners() {
        for (const { element, type, handler } of listeners) {
            element.removeEventListener(type, handler);
        }
        listeners.length = 0;
    }

    function addListener(element, type, handler) {
        element.addEventListener(type, handler);
        listeners.push({ element, type, handler });
    }

    function removeButtons() {
        for (const el of buttons) {
            el.remove();
        }
        buttons.length = 0;
    }

    async function initNats() {
        const id = await GM.getValue('id', null);
        if (!id) return;

        let harvestBtn = document.createElement("button");
        harvestBtn.className = "button"
        harvestBtn.innerHTML = `Harvest`
        harvestBtn.addEventListener("click", async () => {
            harvestBtn.disabled = true
            await sendRequest("harvestall")
            harvestBtn.disabled = false
        })
        let plantBtn = document.createElement("button");
        plantBtn.className = "button"
        plantBtn.innerHTML = `Plant`
        plantBtn.addEventListener("click", async () => {
            plantBtn.disabled = true
            await sendRequest("plantall")
            plantBtn.disabled = false
        })
        let combinedDiv = document.createElement("div");
        combinedDiv.append(harvestBtn, plantBtn);
        let gjBtn = document.createElement("button");
        gjBtn.className = "button"
        gjBtn.innerHTML = `GJ`
        gjBtn.addEventListener("click", async () => {
            gjBtn.disabled = true
            await sendRequest("drinkgj")
            gjBtn.disabled = false
        })

        let setOnion = document.createElement("button");
        setOnion.className = "button"
        setOnion.innerHTML = `Set <img src="/img/items/seeds_onions.png" style="width:17px;vertical-align:middle">`
        setOnion.addEventListener("click", async() => {
            setSeed(34)
        })
        let setTomato = document.createElement("button");
        setTomato.className = "button"
        setTomato.innerHTML = `Set <img src="/img/items/seeds_tomato.png" style="width:17px;vertical-align:middle">`
        setTomato.addEventListener("click", async() => {
            setSeed(16)
        })
        let setCorn = document.createElement("button");
        setCorn.className = "button"
        setCorn.innerHTML = `Set <img src="/img/items/seeds_corn.png" style="width:17px;vertical-align:middle">`
        setCorn.addEventListener("click", async() => {
            setSeed(64)
        })

        let setCotton = document.createElement("button");
        setCotton.className = "button"
        setCotton.innerHTML = `Set <img src="/img/items/seeds_cotton.png" style="width:17px;vertical-align:middle">`
        setCotton.addEventListener("click", async() => {
            setSeed(255)
        })

        async function sendRequest(method) {
            const response = await fetch(`${baseUrl}/worker.php?id=${id}&go=${method}`)
            if (response.error) {
                console.log(method, "Error Request")
            }
        }
        async function setSeed(seed) {
            let randomnumber = Math.floor(Math.random() * 500000);
            const response = await fetch(`${baseUrl}/worker.php?go=setfarmseedcounts&cachebuster=${randomnumber}&id=${seed}`)
            if (response.error) {
                console.log("Error setting seed")
            }
        }

        let footerRow = document.querySelector("#bottom > .toolbar-inner > .footer-btn-row");
        footerRow.prepend(combinedDiv, gjBtn, setOnion, setTomato, setCorn, setCotton)
    }


    async function farm() {
        const element = document.querySelector('.buttons-row');
        if (!element) return;

        const id = await getFarmId();
        if (!id) return;

        const existingButton = document.querySelector('#quick-plant-odung');
        if (existingButton) return;

        const li = document.createElement('li');
        const plantBtn = document.createElement('a');
        plantBtn.id = 'quick-plant-odung';
        plantBtn.className = 'item-link close-panel';
        plantBtn.style.cursor = 'pointer';
        const itemContent = document.createElement('div');
        itemContent.className = 'item-content';
        const itemInner = document.createElement('div');
        itemInner.className = 'item-inner';
        const itemTitle = document.createElement('div');
        itemTitle.className = 'item-title';
        const icon = document.createElement('i');
        icon.className = 'fa fa-fw fa-home';
        itemTitle.appendChild(icon);
        itemTitle.appendChild(document.createTextNode(`  Plant`));

        const li2 = document.createElement('li');
        const harvestBtn = document.createElement('a');
        harvestBtn.id = 'quick-harvest-odung';
        harvestBtn.className = 'item-link close-panel';
        harvestBtn.style.cursor = 'pointer';
        harvestBtn.style.display = 'none';
        const itemContent2 = document.createElement('div');
        itemContent2.className = 'item-content';
        const itemInner2 = document.createElement('div');
        itemInner2.className = 'item-inner';
        const itemTitle2 = document.createElement('div');
        itemTitle2.className = 'item-title';
        const icon2 = document.createElement('i');
        icon2.className = 'fa fa-fw fa-home';
        itemTitle2.appendChild(icon2);
        itemTitle2.appendChild(document.createTextNode(`  Harvest`));

        let plantTimeout;
        let harvestTimeout;

        const plantHandler1 = (event) => {
            event.preventDefault();
            event.stopPropagation();
            plantBtn.style.pointerEvents = 'none';

            clearTimeout(plantTimeout);
            plantTimeout = setTimeout(() => {
                fetch(`${baseUrl}/worker.php?go=plantall&id=${id}`, { method: 'POST' });

                plantBtn.style.display = 'none';
                harvestBtn.style.display = '';
                plantBtn.style.pointerEvents = 'auto';
            }, 125);
        };

        const harvestHandler1 = (event) => {
            event.preventDefault();
            event.stopPropagation();
            harvestBtn.style.pointerEvents = 'none';

            clearTimeout(harvestTimeout);
            harvestTimeout = setTimeout(() => {
                fetch(`${baseUrl}/worker.php?id=${id}&go=harvestall`, { method: 'POST' });

                harvestBtn.style.display = 'none';
                plantBtn.style.display = '';
                harvestBtn.style.pointerEvents = 'auto';
            }, 125);
        };

        addListener(plantBtn, 'click', plantHandler1);
        addListener(harvestBtn, 'click', harvestHandler1);

        itemInner.appendChild(itemTitle);
        itemContent.appendChild(itemInner);
        plantBtn.appendChild(itemContent);
        li.appendChild(plantBtn);

        itemInner2.appendChild(itemTitle2);
        itemContent2.appendChild(itemInner2);
        harvestBtn.appendChild(itemContent2);
        li2.appendChild(harvestBtn);

        const leftPanel = document.querySelector('.panel-left');
        const placementElement = leftPanel.querySelector('.list-block > ul');

        buttons.push(li);
        buttons.push(li2);

        placementElement.appendChild(li);
        placementElement.appendChild(li2);
    }


    async function fishing() {
        const element = document.querySelector('.buttons-row');
        if (!element) return;

        const id = parseInt(window.location.href.match(/id=(\d+)/)?.[1]);
        if (!id) return;
        console.log(id);

        const existingButton = document.querySelector('#quick-fish-odung');
        if (existingButton) return;

        const li = document.createElement('li');
        const plantBtn = document.createElement('a');
        plantBtn.id = 'quick-fish-odung';
        plantBtn.className = 'item-link close-panel';
        plantBtn.style.cursor = 'pointer';
        const itemContent = document.createElement('div');
        itemContent.className = 'item-content';
        const itemInner = document.createElement('div');
        itemInner.className = 'item-inner';
        const itemTitle = document.createElement('div');
        itemTitle.className = 'item-title';
        const icon = document.createElement('i');
        icon.className = 'fa fa-fw fa-home';
        itemTitle.appendChild(icon);
        itemTitle.appendChild(document.createTextNode(`  Cast 50 Nets`));

        const li2 = document.createElement('li');
        const harvestBtn = document.createElement('a');
        harvestBtn.id = 'quick-sell-fish-odung';
        harvestBtn.className = 'item-link close-panel';
        harvestBtn.style.cursor = 'pointer';
        harvestBtn.style.display = 'none';
        const itemContent2 = document.createElement('div');
        itemContent2.className = 'item-content';
        const itemInner2 = document.createElement('div');
        itemInner2.className = 'item-inner';
        const itemTitle2 = document.createElement('div');
        itemTitle2.className = 'item-title';
        const icon2 = document.createElement('i');
        icon2.className = 'fa fa-fw fa-home';
        itemTitle2.appendChild(icon2);
        itemTitle2.appendChild(document.createTextNode(`  Sell All`));

        let plantTimeout;
        let harvestTimeout;

        const plantHandler2 = (event) => {
            event.preventDefault();
            event.stopPropagation();
            plantBtn.style.pointerEvents = 'none';

            clearTimeout(plantTimeout);
            plantTimeout = setTimeout(() => {
                fetch(`${baseUrl}/worker.php?go=castnet&id=${id}&mult=50`, { method: 'POST' });

                plantBtn.style.display = 'none';
                harvestBtn.style.display = '';
                plantBtn.style.pointerEvents = 'auto';
            }, 125);
        };

        const harvestHandler2 = (event) => {
            event.preventDefault();
            event.stopPropagation();
            harvestBtn.style.pointerEvents = 'none';

            clearTimeout(harvestTimeout);
            harvestTimeout = setTimeout(() => {
                fetch(`${baseUrl}/worker.php?go=sellalluserfish`, { method: 'POST' });

                harvestBtn.style.display = 'none';
                plantBtn.style.display = '';
                harvestBtn.style.pointerEvents = 'auto';
            }, 125);
        };

        addListener(plantBtn, 'click', plantHandler2);
        addListener(harvestBtn, 'click', harvestHandler2);

        itemInner.appendChild(itemTitle);
        itemContent.appendChild(itemInner);
        plantBtn.appendChild(itemContent);
        li.appendChild(plantBtn);

        itemInner2.appendChild(itemTitle2);
        itemContent2.appendChild(itemInner2);
        harvestBtn.appendChild(itemContent2);
        li2.appendChild(harvestBtn);

        const leftPanel = document.querySelector('.panel-left');
        const placementElement = leftPanel.querySelector('.list-block > ul');

        buttons.push(li);
        buttons.push(li2);

        placementElement.appendChild(li);
        placementElement.appendChild(li2);
    }

    async function getFarmId() {
        const match = window.location.href.match(/id=(\d+)/);
        const id = match ? match[1] : null;
        await GM.setValue('id', id);
        console.log(id);
        return id;
    }

    const observer = new MutationObserver(mutations => {
        const element = document.querySelector('#fireworks');
        if (element) {
            observePage(element);
            initNats();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();