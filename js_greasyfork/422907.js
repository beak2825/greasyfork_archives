// ==UserScript==
// @name         Elethor General Purpose - Market Module
// @description  Provides a crafting cost and market offer checker to Elethor
// @namespace    https://www.elethor.com/
// @version      1.0.2
// @author       Anders Morgan Larsen (Xortrox)
// @contributor  Kidel
// @match        https://elethor.com/*
// @match        https://www.elethor.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422907/Elethor%20General%20Purpose%20-%20Market%20Module.user.js
// @updateURL https://update.greasyfork.org/scripts/422907/Elethor%20General%20Purpose%20-%20Market%20Module.meta.js
// ==/UserScript==

(function() {
    const moduleName = 'Elethor General Purpose - Market Module';
    const version = '1.0.2';

    (async function loadMarketCraftingPrices() {
        console.log(`[${moduleName}]`)
        async function waitForField(target, field) {
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    if (target[field] !== undefined) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }

        await waitForField(window, 'axios');

        async function loadMarketData() {
            const marketData = await axios.get('/game/market');

            if (!marketData || !marketData.data) {
                console.error('Error getting marketData:', marketData);
                return;
            }

            window.egpMarketData = marketData.data;
        }

        window.egpMarketCacheInterval = 300000;
        window.egpLastMarketCache = -1;
        async function refreshMarketCache() {
            /** Refresh market data only every 5 minutes at most */
            if (Date.now() > window.egpLastMarketCache + (300000)) {
                await loadMarketData();
                window.egpLastMarketCache = Date.now();
            }
        }

        await refreshMarketCache();

        async function getMarketInstaBuyCost(recipe) {
            let totalCostSell = recipe.cost || 0;
            let totalCostBuy = recipe.cost || 0;
            let itemMarketSell = -1;
            let itemMarketBuy = -1;

            for (const mainCategory of Object.keys(window.egpMarketData.listings)) {
                for (const subCategory of Object.keys(window.egpMarketData.listings[mainCategory])) {
                    if (recipe.name === subCategory) {
                        console.log(`${recipe.name}: ${subCategory}`, window.egpMarketData.listings[mainCategory][subCategory]);

                        let itemOrdersCheapestSale = window.egpMarketData.listings[mainCategory][subCategory].map((o) => {
                            if (o.type === 'sell') {
                                return o;
                            }
                        });

                        itemOrdersCheapestSale.sort((a, b) => {
                            if (a.price < b.price) { return -1; }
                            if (a.price > b.price) { return 1; }
                            return 0;
                        });

                        let itemOrdersCheapestBuy = window.egpMarketData.listings[mainCategory][subCategory].map((o) => {
                            if (o.type === 'buy') {
                                return o;
                            }
                        });

                        itemOrdersCheapestBuy.sort((a, b) => {
                            if (a.price < b.price) { return 1; }
                            if (a.price > b.price) { return -1; }
                            return 0;
                        });

                        itemMarketSell = itemOrdersCheapestSale[0]?.price || -1;
                        itemMarketBuy = itemOrdersCheapestBuy[0]?.price || -1;
                    }
                }
            }

            for (const recipeEntry of recipe.inputs) {
                for (const mainCategory of Object.keys(window.egpMarketData.listings)) {
                    for (const subCategory of Object.keys(window.egpMarketData.listings[mainCategory])) {
                        /** Skip all items that are not in our recipe */
                        if (subCategory !== recipeEntry.item.name) {
                            continue;
                        }

                        let itemOrdersSell = window.egpMarketData.listings[mainCategory][subCategory].map((o) => {
                            if (o.type === 'sell') {
                                return o;
                            }
                        });

                        itemOrdersSell.sort((a, b) => {
                            if (a.price < b.price) { return -1; }
                            if (a.price > b.price) { return 1; }
                            return 0;
                        });

                        let itemOrdersBuy = window.egpMarketData.listings[mainCategory][subCategory].map((o) => {
                            if (o.type === 'buy') {
                                return o;
                            }
                        });

                        itemOrdersBuy.sort((a, b) => {
                            if (a.price < b.price) { return 1; }
                            if (a.price > b.price) { return -1; }
                            return 0;
                        });

                        // TODO: Can do top 2-3 average or something, or find full quantity
                        const pricePerItem = itemOrdersSell[0];

                        if (!pricePerItem) {
                            console.warn('Item listing had no sell offers:', recipeEntry);
                        } else {
                            totalCostSell += recipeEntry.quantity * pricePerItem.price;
                        }

                        const pricePerItemBuy = itemOrdersBuy[0];

                        if (!pricePerItemBuy) {
                            console.warn('Item listing had no buy offers:', recipeEntry);
                        } else {
                            totalCostBuy += recipeEntry.quantity * pricePerItemBuy.price;
                        }
                    }
                }
            }

            return [totalCostSell, totalCostBuy, itemMarketSell, itemMarketBuy];
        }

        async function getRecipesWithCost() {
            await refreshMarketCache();
            const recipes = await getCraftingRecipes();

            for (const recipe of recipes) {
                [recipe.totalCostSell, recipe.totalCostBuy, recipe.itemMarketSell, recipe.itemMarketBuy] = await getMarketInstaBuyCost(recipe);
            }

            return recipes;
        }

        async function getCraftingRecipes() {
            const craftingData = await axios.get('/game/views/craft');

            if (!craftingData || !craftingData.data) {
                console.error('Error getting craftingData:', craftingData);
                return;
            }

            return craftingData.data.recipes;
        }

        window.egpCraftRecipesWithCost = await getRecipesWithCost();
        console.log(`[${moduleName} v${version}] Market cache and crafting prices loaded.`);

        function getRecipeByName(name) {
            for (const recipe of window.egpCraftRecipesWithCost) {
                if (recipe.name === name) {
                    return recipe;
                }
            }
        }

        function getRecipeHeader() {
            const h4List = document.querySelectorAll('h4');

            for (const h4 of h4List) {
                if (h4.innerText.includes('Recipe')) {
                    return h4;
                }
            }
        }

        function formatNormalNumber(num){
            return num.toLocaleString();
        }

        document.addEventListener('click', function(e) {
            if (
                e?.target?.parentElement?.parentElement?.className?.includes('is-recipe-selector') ||
                e?.target?.parentElement?.parentElement?.parentElement?.className?.includes('is-recipe-selector') ||
                e?.target?.parentElement?.parentElement?.parentElement?.parentElement?.className?.includes('is-recipe-selector')
            ) {
                const recipe = getRecipeByName(e.target.innerText);
                const header = getRecipeHeader();

                if (header) {
                    header.innerHTML =
                        `Recipe<br><br>` +
                        `<h5 style="margin-left: -10px; font-size: 20px; width: 50%; display: inline-block; float: left;">` +
                        `<div style="width: 240px; display: inline-block;">Crafting Cost</div><br><br>` +
                        `<div style="width: 100px; display: inline-block; font-family: Lato,Helvetica Neue,Helvetica,Arial,sans-serif;">Sell</div><span class="has-text-success" style="font-family: Lato,Helvetica Neue,Helvetica,Arial,sans-serif;">${formatNormalNumber(recipe.totalCostSell)}</span><br>` +
                        `<div style="width: 100px; display: inline-block; font-family: Lato,Helvetica Neue,Helvetica,Arial,sans-serif;">Buy</div><span class="has-text-danger" style="font-family: Lato,Helvetica Neue,Helvetica,Arial,sans-serif;">${formatNormalNumber(recipe.totalCostBuy)}</span><br><br>` +
                        `</h5>` +
                        `<h5 style="font-size: 20px; width: 49%; display: inline-block;">` +
                        `<div style="width: 240px; display: inline-block;">Market Offers</div><br><br>` +
                        `<div style="width: 100px; display: inline-block; font-family: Lato,Helvetica Neue,Helvetica,Arial,sans-serif;">Sell</div><span class="has-text-success" style="font-family: Lato,Helvetica Neue,Helvetica,Arial,sans-serif;">${formatNormalNumber(recipe.itemMarketSell)}</span><br>` +
                        `<div style="width: 100px; display: inline-block; font-family: Lato,Helvetica Neue,Helvetica,Arial,sans-serif;">Buy</div><span class="has-text-danger" style="font-family: Lato,Helvetica Neue,Helvetica,Arial,sans-serif;">${formatNormalNumber(recipe.itemMarketBuy)}</span>` +
                        `</h5>`;
                }
            }
        });
    })();
})();
