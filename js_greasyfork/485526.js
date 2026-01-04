// ==UserScript==
// @name         Market History
// @namespace    http://tampermonkey.net/
// @version      1.9.3
// @description  Keep track of your market buy/sale history for Dead Frontier to instantly see your profit and losses
// @author       Runonstof
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @grant        unsafeWindow
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485526/Market%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/485526/Market%20History.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    /******************************************************
     * Initialize script
     ******************************************************/

    const searchParams = new URLSearchParams(window.location.search);
    const page = parseInt(searchParams.get('page'));
    // If is not on the market page or yard page, stop script
    if (![35, 24].includes(page)) {
        return;
    }

    /**
     * Detect if SilverScripts is installed
     * 
     * We only need to know this to render hover item info differently
     * Because if SilverScripts is installed and its HoverPrices are enabled
     * The hover info box can get cluttered and overflows, causing data to be hidden (Found out during testing)
     * So if this is detected, a setting will appear to show our data only when the shift key is pressed
     */
    const silverScriptsInstalled = unsafeWindow.hasOwnProperty('silverRequestItem');

    /* === Global variables === */
    unsafeWindow.historyScreen = 'list'; // 'list', 'stats'
    unsafeWindow.historyScreenSet = false;

    // Will be set after page init (below script)
    // Because DeadFrontier does a call to stackables.json, we need to wait for that to complete
    let SEARCHABLE_ITEMS = [];

    const TIMEFRAME_OPTIONS = {
        all: 'All time',
        last_24hr: 'Last 24 hours',
        last_week: 'Last week',
        last_month: 'Last month',
        last_3_months: 'Last 3 months',
        last_6_months: 'Last 6 months',
        last_year: 'Last year',
        ytd: 'Since january 1st',
        mtd: 'Since 1st of month',
        wtd: 'Since monday',
    };

    const SHIFT_HOVER_OPTIONS = {
        disabled: 'Disabled', // Just show everything
        history: 'Enabled', // Show history info when shift is pressed
    };

    if (silverScriptsInstalled) {
        SHIFT_HOVER_OPTIONS.history = 'History'; // Only show history info when shift is pressed
        SHIFT_HOVER_OPTIONS.silverscripts = 'SilverScripts'; // Show SilverScripts HoverPrices when shift is pressed
    }

    const WEBCALL_HOOKS = {
        before: {},
        after: {},
        afterAll: [],
        beforeAll: [],

        lastExecutedAt: {},
    };

    const LOOKUP = {
        category__item_id: {},
    };
    
    // Our history object
    // That is responsible for keeping track of all trades
    // And calculating statistics
    const _HISTORY = {
        entries: [],
        selectedItem: null,
        filters: {
            minDate: null,
            maxDate: null,
            type: 'all',
        },

        getFilteredEntries() {
            let historyEntries = this.entries;

            if (this.selectedItem || this.filters.minDate || this.filters.maxDate || this.filters.type !== 'all') {
                historyEntries = historyEntries.filter(entry => {

                    // Check by item id
                    if (this.selectedItem && (!entry.item || getBaseItemId(entry.item) != HISTORY.selectedItem)) {
                        return false;
                    }

                    // Check by action type
                    if (this.filters.type === 'buy' && entry.action !== 'buy') {
                        return false;
                    }

                    if (this.filters.type === 'sell' && entry.action !== 'sell') {
                        return false;
                    }

                    if (this.filters.type === 'scrap' && entry.action !== 'scrap') {
                        return false;
                    }

                    if (this.filters.type === 'sell_scrap' && entry.action !== 'sell' && entry.action !== 'scrap') {
                        return false;
                    }

                    // Check by date
                    if (this.filters.minDate && entry.date < this.filters.minDate) {
                        return false;
                    }

                    if (this.filters.maxDate) {
                        const checkMaxDate = this.filters.maxDate + 86400000; // Add 1 day

                        if (entry.date > checkMaxDate) {
                            return false;
                        }
                    }

                    return true;
                });
            }

            return historyEntries;
        },

        // Cached values, to prevent having to loop through all entries every time
        // Causing performance to improve
        cache: {},
        resetCache() {
            this.cache = {
                trade_id: {}, // trades indexed by trade_id
                item_id: {}, // trades indexed by item_id
    
                item_id__amount_sold: {}, // total sell numbers, indexed by item_id
                item_id__amount_bought: {}, // total buy numbers, indexed by item_id
                item_id__avg_price_sold: {}, // average sell price, indexed by item_id
                item_id__avg_price_bought: {}, // average buy price, indexed by item_id
                item_id__total_price_sold: {}, // total sell price, indexed by item_id
                item_id__total_price_bought: {}, // total buy price, indexed by item_id
                item_id__last_price_sold: {}, // last sell price, indexed by item_id
                item_id__last_price_bought: {}, // last buy price, indexed by item_id
                item_id__last_quantity_sold: {}, // last sell quantity, indexed by item_id
                item_id__last_quantity_bought: {}, // last buy quantity, indexed by item_id
                item_id__last_date_sold: {}, // last sell date, indexed by item_id
                item_id__last_date_bought: {}, // last buy date, indexed by item_id
    
                item_id__sold: {}, // trades indexed by trade_id
                item_id__bought: {}, // trades indexed by trade_id
                item_id__scrapped: {}, // trades indexed by trade_id
    
                pending_trade_ids: [], // trade_ids of pending trades
            };

            this.initCache();
        },
        storageKey(key) {
            return 'HISTORY_' + key + '_' + unsafeWindow.userVars.userID;
        },
        initCache() {
            const entries = this.entries;
            for (const entry of entries) {
                const tradeId = entry.trade_id;
                const itemId = getBaseItemId(entry.item);
                // const globalItemId = getGlobalDataItemId(entry.item);

                this.cache.trade_id[tradeId] = entry;

                if (!this.cache.item_id.hasOwnProperty(itemId)) {
                    this.cache.item_id[itemId] = [];
                }
                this.cache.item_id[itemId].push(entry);

                // if (!this.cache.item_id__amount_sold.hasOwnProperty(itemId)) {
                //     this.cache.item_id__amount_sold[itemId] = 0;
                // }

                // if (!this.cache.item_id__amount_bought.hasOwnProperty(itemId)) {
                //     this.cache.item_id__amount_bought[itemId] = 0;
                // }

                // const action = entry.action; // 'buy' or 'sell'
                // const itemcat = unsafeWindow.globalData[globalItemId].itemcat;
                // const quantity = realQuantity(entry.quantity, itemcat)

                // if (action === 'buy') {
                //     this.cache.item_id__amount_bought[itemId] += quantity;
                // } else if (action === 'sell') {
                //     this.cache.item_id__amount_sold[itemId] += quantity;
                // }
            }
        },
        clearCacheForItem(itemId) {
            delete this.cache.item_id__avg_price_sold[itemId];
            delete this.cache.item_id__avg_price_bought[itemId];
            delete this.cache.item_id__last_price_sold[itemId];
            delete this.cache.item_id__last_price_bought[itemId];
            delete this.cache.item_id__last_quantity_sold[itemId];
            delete this.cache.item_id__last_quantity_bought[itemId];
            delete this.cache.item_id__last_date_sold[itemId];
            delete this.cache.item_id__last_date_bought[itemId];
        },
        getTrade(tradeId) {
            if (this.cache.item_id.hasOwnProperty(tradeId)) {
                return this.cache.item_id[tradeId];
            }

            return this.cache.item_id[tradeId] = this.entries.find(entry => entry.trade_id === tradeId);;
        },
        async pushTrade(entry) {
            if (!entry.date) {
                entry.date = Date.now();
            }

            await this.load();
            this.entries.push(entry);
            await this.forceSave();

            this.cache.trade_id[entry.trade_id] = entry;

            const itemId = getBaseItemId(entry.item);

            // Update cache
            if (!this.cache.item_id.hasOwnProperty(itemId)) {
                this.cache.item_id[itemId] = [];
            }

            this.cache.item_id[itemId].push(entry);

            // Init amount sold and amount bought cache
            if (!this.cache.item_id__amount_sold.hasOwnProperty(itemId)) {
                this.cache.item_id__amount_sold[itemId] = 0;
            }

            if (!this.cache.item_id__amount_bought.hasOwnProperty(itemId)) {
                this.cache.item_id__amount_bought[itemId] = 0;
            }

            // Add to quantity cache
            const action = entry.action; // 'buy' or 'sell'
            const quantity = parseInt(entry.quantity);

            if (action === 'buy') {
                // TODO: check date treshold?
                this.cache.item_id__amount_bought[itemId] += quantity;
            } else if (action === 'sell') {
                // TODO: check date treshold?
                this.cache.item_id__amount_sold[itemId] += quantity;
            }

            this.clearCacheForItem(itemId);
        },

        async sortEntries() {
            await this.load();
            this.entries.sort((a, b) => (a.date > b.date) ? 1 : -1);
            await this.forceSave();
        },

        // Remove trade from history
        async removeTrade(tradeId, isIndex = false) {
            await this.load();
            let index = isIndex ? tradeId : this.entries.findIndex(entry => entry.trade_id === tradeId);

            if (isIndex) {
                if (index < 0 || index >= this.entries.length) {
                    return false;
                }
            }

            if (index == -1) {
                return false;
            }

            const entry = this.entries[index];

            this.entries.splice(index, 1);
            await this.forceSave();

            // Update cache
            delete this.cache.trade_id[tradeId];

            // Remove from item_id cache
            const itemId = getBaseItemId(entry.item);
            if (this.cache.item_id.hasOwnProperty(itemId)) {
                const itemIndex = this.cache.item_id[itemId].findIndex(entry => entry.trade_id === tradeId);
                if (itemIndex > -1) {
                    this.cache.item_id[itemId].splice(itemIndex, 1);
                }
            }

            const quantity = entry.quantity;
            const action = entry.action; // 'buy' or 'sell'
            
            if (action === 'buy' && this.cache.item_id__amount_bought.hasOwnProperty(itemId)) {
                this.cache.item_id__amount_bought[itemId] -= quantity;
            }
            else if (action === 'sell' && this.cache.item_id__amount_sold.hasOwnProperty(itemId)) {
                this.cache.item_id__amount_sold[itemId] -= quantity;
            }

            const pendingTradeIndex = this.cache.pending_trade_ids.indexOf(tradeId);
            if (pendingTradeIndex > -1) {
                this.cache.pending_trade_ids.splice(pendingTradeIndex, 1);
            }

            this.clearCacheForItem(itemId);
            return true;
        },

        // Get info about an item, based on its trades
        // Looks up the cache first, if not found, calculates it
        getItemInfo(itemId, key, timeframe = undefined) {
            let cacheKey = 'item_id__' + key;
            let trades, total, action, amount, lastTradeId, lastTradePrice, lastTradeQuantity, lastTradeDate;
            const isDateInTreshold = function (entry) {
                const entryDate = entry.date;
                const tresholdDate = getTresholdDateForTimeframe(SETTINGS.values.hoverStatisticsTimeframe);

                if (tresholdDate === null) {
                    return true;
                }

                return entryDate >= tresholdDate.getTime();
            }
            switch (key) {
                case 'amount_sold':
                case 'amount_bought':
                    if (this.cache[cacheKey].hasOwnProperty(itemId)) {
                        return this.cache[cacheKey][itemId];
                    }

                    trades = this.cache.item_id[itemId] || [];
                    action = key == 'amount_sold' ? 'sell' : 'buy';

                    return this.cache[cacheKey][itemId] = trades.reduce((total, trade) => {
                        if (!isDateInTreshold(trade)) {
                            return total;
                        }
                        
                        let isAction = trade.action === action;
                        if (!isAction && SETTINGS.values.countScraps && action == 'sell') {
                            isAction = trade.action === 'scrap';
                        }

                        if (!isAction) {
                            return total;
                        }

                        const tradeItemId = getGlobalDataItemId(trade.item);
                        
                        const quantity = realQuantity(trade.quantity, unsafeWindow.globalData[tradeItemId].itemcat);
                        return total + quantity;
                    }, 0);
                    break;

                case 'last_price_sold':
                case 'last_price_bought':
                    if (this.cache[cacheKey].hasOwnProperty(itemId)) {
                        return this.cache[cacheKey][itemId];
                    }

                    trades = this.cache.item_id[itemId] || [];
                    action = key == 'last_price_sold' ? 'sell' : 'buy';

                    lastTradeId = 0;
                    lastTradeDate = 0;
                    lastTradePrice = 0;

                    let tradeCount = 0;

                    for (const trade of trades) {
                        if (!isDateInTreshold(trade)) {
                            continue;
                        }
                        let isAction = trade.action === action;
                        if (!isAction && SETTINGS.values.countScraps && action == 'sell') {
                            isAction = trade.action === 'scrap';
                        }

                        if (!isAction) {
                            continue;
                        }
                        if (trade.item !== itemId) {
                            continue;
                        }

                        if (trade.date <= lastTradeDate) {
                            continue;
                        }

                        tradeCount++;
                        lastTradeId = trade.trade_id;
                        lastTradePrice = trade.price;
                        lastTradeDate = trade.date;
                    }

                    if (tradeCount === 0) {
                        return this.cache[cacheKey][itemId] = null;
                    }
                    
                    return this.cache[cacheKey][itemId] = lastTradePrice;
                    break;

                case 'last_quantity_sold':
                case 'last_quantity_bought':
                    if (this.cache[cacheKey].hasOwnProperty(itemId)) {
                        return this.cache[cacheKey][itemId];
                    }

                    trades = this.cache.item_id[itemId] || [];
                    action = key == 'last_quantity_sold' ? 'sell' : 'buy';

                    lastTradeId = 0;
                    lastTradeQuantity = 0;

                    for (const trade of trades) {
                        if (!isDateInTreshold(trade)) {
                            continue;
                        }

                        if (trade.action !== action) {
                            continue;
                        }
                        if (trade.date <= lastTradeDate) {
                            continue;
                        }
                        const tradeItemId = getGlobalDataItemId(trade.item);

                        lastTradeId = trade.trade_id;
                        lastTradeQuantity = realQuantity(trade.quantity, unsafeWindow.globalData[tradeItemId].itemcat);
                        lastTradeDate = trade.date;
                    }
                    
                    return this.cache[cacheKey][itemId] = lastTradeQuantity;
                    break;

                case 'last_date_sold':
                case 'last_date_bought':
                    if (this.cache[cacheKey].hasOwnProperty(itemId)) {
                        return this.cache[cacheKey][itemId];
                    }

                    trades = this.cache.item_id[itemId] || [];
                    action = key == 'last_date_sold' ? 'sell' : 'buy';

                    lastTradeId = 0;
                    lastTradeDate = 0;

                    for (const trade of trades) {
                        if (!isDateInTreshold(trade)) {
                            continue;
                        }
                        
                        if (trade.action !== action) {
                            continue;
                        }
                        if (trade.date <= lastTradeDate) {
                            continue;
                        }

                        lastTradeId = trade.trade_id;
                        lastTradeDate = trade.date;
                    }

                    return this.cache[cacheKey][itemId] = lastTradeDate;
                    break;

                case 'avg_price_sold':
                case 'avg_price_bought':
                    if (this.cache[cacheKey].hasOwnProperty(itemId)) {
                        return this.cache[cacheKey][itemId];
                    }

                    amount = this.getItemInfo(itemId, key.replace('avg_price', 'amount')); // amount_sold or amount_bought
                    if (amount == 0) {
                        return this.cache[cacheKey][itemId] = 0;
                    }

                    action = (key == 'avg_price_sold' ? 'sell' : 'buy');

                    trades = this.cache.item_id[itemId];
                    total = this.getItemInfo(itemId, key.replace('avg_price', 'total_price')); // total_price_sold or total_price_bought

                    return this.cache[cacheKey][itemId] = total / amount;
                    break;

                case 'total_price_sold':
                case 'total_price_bought':
                    if (this.cache[cacheKey].hasOwnProperty(itemId)) {
                        return this.cache[cacheKey][itemId];
                    }

                    amount = this.getItemInfo(itemId, key.replace('total_price', 'amount')); // amount_sold or amount_bought
                    if (amount == 0) {
                        return this.cache[cacheKey][itemId] = 0;
                    }

                    action = (key == 'total_price_sold' ? 'sell' : 'buy');

                    trades = this.cache.item_id[itemId];
                    total = 0;
                    for (const trade of trades) {
                        if (!isDateInTreshold(trade)) {
                            continue;
                        }
                        let isAction = trade.action === action;
                        if (!isAction && SETTINGS.values.countScraps && action == 'sell') {
                            isAction = trade.action === 'scrap';
                        }

                        if (!isAction) {
                            continue;
                        }
                        total += parseInt(trade.price);
                    }

                    return this.cache[cacheKey][itemId] = total;
                    break;

                case 'avg_stack_price_sold':
                case 'avg_stack_price_bought':
                    const avgPrice = this.getItemInfo(itemId, key.replace('avg_stack_price', 'avg_price')); // avg_price_sold or avg_price_bought
                    // const totalAmount = this.getItemInfo(itemId, key.replace('avg_stack_price', 'amount')); // amount_sold or amount_bought
                    const stack = maxStack(itemId);

                    return avgPrice * stack;
                    break;
            }

            throw new Error('Invalid key: ' + key);
        },
        

        async forceSave() {
            if (this._debugMode) {
                return;
            }
            await GM.setValue(this.storageKey('entries'), this.entries);
        },
        // Called during debugging
        async clearEntries() {
            this.entries = [];
            await this.forceSave();
        },

        async setSelectedItem(item) {
            this.selectedItem = item ? getBaseItemId(item) : null;
            await GM.setValue(this.storageKey('selectedItem'), item);
        },
        async saveFilters() {
            await GM.setValue(this.storageKey('filters'), this.filters);
        },
        async init() {
            this.selectedItem = await GM.getValue(this.storageKey('selectedItem'), null);
            this.filters = mergeDeep({}, this.filters, await GM.getValue(this.storageKey('filters'), {}));
            await this.load();
        },
        async load() {
            if (this._debugMode) {
                return;
            }
            this.entries = await GM.getValue(this.storageKey('entries'), []);
        },
        _debugMode: false,
        debugMode(mode = null) {
            if (mode === null) {
                this.debugMode(!this._debugMode);
                return;
            }

            this._debugMode = mode;
        },

        renderEntryPrompt(entry) {
            pageLock = true;

			unsafeWindow.prompt.classList.remove("warning");
			unsafeWindow.prompt.classList.remove("redhighlight");

        	unsafeWindow.prompt.style.height = "200px";

            const imgItemId = getGlobalDataItemId(entry.item);
            const imgUrl = 'https://files.deadfrontier.com/deadfrontier/inventoryimages/large/' + imgItemId + '.png';
            
            unsafeWindow.prompt.innerHTML = `
                <div style="text-align: center; text-decoration: underline;">Edit entry</div>
                <div style="text-align: right; position: absolute; right: 0;"><img src="${imgUrl}" /></div>
                <div style="z-index: 1000; position: relative;">
                    <span style="text-decoration: underline;">Item:</span><br>
                    ${entry.itemname}${entry.item == 'credits' ? '' : ` x${entry.quantity}`}
                </div>
                <br>
                <div style="position: relative;">
                    <div style="position: absolute;">
                        <span style="text-decoration: underline;">Action:</span><br>
                        <span style="color: #00FF00;">${entry.action}</span>
                    </div>
                    <div style="position: absolute; left: 100px;">
                        <span style="text-decoration: underline;">Price:</span><br>
                        ${formatMoneyHtml(entry.price, true)}
                    </div>
                    <br>
                    <br>
                </div>
                <br>
                <div>
                    <span style="text-decoration: underline;">Datetime:</span><br>
                    ${formatDate(new Date(entry.date))}
                </div>
            `;


            const historyEntryHolder = document.createElement("div");
            historyEntryHolder.id = "historyEntryHolder";

            
            // const footerButton = document.createElement("button");
            // footerButton.style.position = "absolute";
            // footerButton.style.bottom = "12px";
            // if (footerButtonInfo.action) {
            //     footerButton.addEventListener("click", footerButtonInfo.action);
            // }

            // footerButton.textContent = footerButtonInfo.label;
            
            // for(const styleKey in footerButtonInfo.style) {
            //     footerButton.style[styleKey] = footerButtonInfo.style[styleKey];
            // }
            // unsafeWindow.prompt.appendChild(footerButton);

            const closeBtn = document.createElement("button");
            closeBtn.style.position = "absolute";
            closeBtn.style.bottom = "12px";
            closeBtn.style.right = "12px";
            closeBtn.textContent = "close";
            closeBtn.addEventListener("click", () => {
                HISTORY.closeEntryPrompt();
            });
            unsafeWindow.prompt.appendChild(closeBtn);

            const itemInfoBtn = document.createElement("button");
            itemInfoBtn.style.position = "absolute";
            itemInfoBtn.style.bottom = "12px";
            itemInfoBtn.style.left = "100px";
            itemInfoBtn.textContent = "item stats";
            itemInfoBtn.addEventListener("click", () => {
                HISTORY.closeEntryPrompt();
                unsafeWindow.historyScreen = 'stats';
                HISTORY.setSelectedItem(entry.item);
                loadMarket();
            });
            unsafeWindow.prompt.appendChild(itemInfoBtn);

            const removeBtn = document.createElement("button");
            removeBtn.style.position = "absolute";
            removeBtn.style.bottom = "12px";
            removeBtn.style.left = "12px";
            removeBtn.textContent = "remove";
            removeBtn.addEventListener("click", async () => {
                const confirmed = confirm('Are you sure you want to remove this entry?');
                if (!confirmed) {
                    return;
                }
                
                unsafeWindow.prompt.innerHTML = "<div style='text-align: center'>Loading, please wait...</div>";
                const removed = await HISTORY.removeTrade(entry.trade_id);
                if (!removed) {
                    alert('Could not remove entry');
                    return;
                }

                HISTORY.closeEntryPrompt();
                // HISTORY.resetCache();
                loadMarket();
            });

            unsafeWindow.prompt.appendChild(removeBtn);

            const editBtn = document.createElement("button");
            editBtn.style.position = "absolute";
            editBtn.style.bottom = "30px";
            editBtn.style.left = "12px";
            editBtn.textContent = "edit";
            editBtn.addEventListener("click", async () => {
                HISTORY.renderEntryFormPrompt(entry);

                // const confirmed = confirm('Are you sure you want to remove this entry?');
                // if (!confirmed) {
                //     return;
                // }

                // const removed = await HISTORY.removeTrade(entry.trade_id);
                // if (!removed) {
                //     alert('Could not remove entry');
                //     return;
                // }

                // HISTORY.closeEntryPrompt();
                // // HISTORY.resetCache();
                // loadMarket();
            });

            unsafeWindow.prompt.appendChild(editBtn);
            
            unsafeWindow.prompt.parentNode.style.display = "block";
            unsafeWindow.prompt.focus();

        },
        renderEntryFormPrompt(entry) {
            pageLock = true;


			unsafeWindow.prompt.classList.remove("warning");
			unsafeWindow.prompt.classList.remove("redhighlight");

        	unsafeWindow.prompt.style.height = "200px";

            const imgItemId = getGlobalDataItemId(entry.item);
            const imgUrl = 'https://files.deadfrontier.com/deadfrontier/inventoryimages/large/' + imgItemId + '.png';

            
            const itemData = unsafeWindow.globalData[imgItemId];
            if (!entry.itemname) {
                entry.itemname = unsafeWindow.itemNamer(entry.item, '');
            }
            
            const maxQuantity = maxStack(entry.item, false);

            unsafeWindow.prompt.innerHTML = `
                <div class="historyEntryForm">
                    <div style="text-align: center; text-decoration: underline;">${entry.trade_id ? 'Edit' : 'Create'} entry</div>
                    <div style="text-align: right; position: absolute; right: 0;"><img src="${imgUrl}" /></div>
                    <div style="z-index: 1000; position: relative;">
                        <span style="text-decoration: underline;">Item:</span><br>
                        ${entry.itemname}
                        <br>
                        <input type="number" min="0" max="${maxQuantity}" placeholder="Quantity" style="width: 50px;" id="entryFormQuantity" value="${entry.quantity || maxQuantity}" />
                    </div>
                    <br>
                    <div style="position: relative;">
                        <div style="position: absolute;">
                            <span style="text-decoration: underline;">Action:</span><br>

                            <div data-value="${entry.action || 'buy'}" id="entryFormAction" class="historySelectComponent">
                                <div class="selectChoice">
                                    <span></span>
                                    <span></span>
                                </div>
                                <div class="selectList">
                                    <div data-value="buy" class="selectOption">Buy</div>
                                    <div data-value="sell" class="selectOption">Sell</div>
                                    <div data-value="scrap" class="selectOption">Scrap</div>
                                </div>
                            </div>

                        </div>
                        <div style="position: absolute; left: 100px;">
                            <span style="text-decoration: underline;">Price:</span><br>
                            <span style="color: #FFCC00;">$</span>&nbsp;<input type="number" min="1" max="9999999999" placeholder="Price" style="width: 50px;" id="entryFormPrice" value="${entry.price || 0}" />
                        </div>
                        <br>
                        <br>
                    </div>
                    <br>
                    <div>
                        <span style="text-decoration: underline;">Datetime:</span><br>
                        <input type="datetime-local" id="entryFormDate" value="${formatDate(new Date(entry.date || Date.now()))}" />
                    </div>
                </div>
            `;

            initHistorySelects();


            const historyEntryHolder = document.createElement("div");
            historyEntryHolder.id = "historyEntryHolder";

            
            // const footerButton = document.createElement("button");
            // footerButton.style.position = "absolute";
            // footerButton.style.bottom = "12px";
            // if (footerButtonInfo.action) {
            //     footerButton.addEventListener("click", footerButtonInfo.action);
            // }

            // footerButton.textContent = footerButtonInfo.label;
            
            // for(const styleKey in footerButtonInfo.style) {
            //     footerButton.style[styleKey] = footerButtonInfo.style[styleKey];
            // }
            // unsafeWindow.prompt.appendChild(footerButton);

            const closeBtn = document.createElement("button");
            closeBtn.style.position = "absolute";
            closeBtn.style.bottom = "12px";
            closeBtn.style.right = "12px";
            closeBtn.textContent = "cancel";
            closeBtn.addEventListener("click", () => {
                HISTORY.closeEntryPrompt();
            });
            unsafeWindow.prompt.appendChild(closeBtn);

            // const itemInfoBtn = document.createElement("button");
            // itemInfoBtn.style.position = "absolute";
            // itemInfoBtn.style.bottom = "12px";
            // itemInfoBtn.style.left = "100px";
            // itemInfoBtn.textContent = "item stats";
            // itemInfoBtn.addEventListener("click", () => {
            //     HISTORY.closeEntryPrompt();
            //     unsafeWindow.historyScreen = 'stats';
            //     HISTORY.setSelectedItem(entry.item);
            //     loadMarket();
            // });
            // unsafeWindow.prompt.appendChild(itemInfoBtn);

            const saveBtn = document.createElement("button");
            saveBtn.style.position = "absolute";
            saveBtn.style.bottom = "12px";
            saveBtn.style.left = "12px";
            saveBtn.textContent = entry.trade_id ? "save" : "add";
            saveBtn.addEventListener("click", async () => {
                if (saveBtn.disabled) {
                    return;
                }

                // validate and parse values
                const quantity = parseInt(document.getElementById('entryFormQuantity').value);
                const price = parseInt(document.getElementById('entryFormPrice').value);
                const date = new Date(document.getElementById('entryFormDate').value);
                const action = document.getElementById('entryFormAction').dataset.value;

                const maxQuantity = maxStack(entry.item, true);
                
                if (isNaN(quantity) || quantity < 1 || quantity > maxQuantity) {
                    alert('Invalid quantity, max is ' + maxQuantity);
                    return;
                }

                if (isNaN(price) || price < 0 || price > 9999999999) {
                    alert('Invalid price');
                    return;
                }

                if (isNaN(date.getTime())) {
                    alert('Invalid date');
                    return;
                }

                if (entry.trade_id) {
                    const confirmed = confirm('Are you sure you want to overwrite this entry?');
                    if (!confirmed) {
                        return;
                    }

                    saveBtn.disabled = true;

                    const newEntryData = {
                        quantity,
                        price,
                        date: date.getTime(),
                        action,
                    };

                    if (entry.item == 'credits') {
                        entry.itemname = unsafeWindow.itemNamer(entry.item, quantity);
                    }

                    const newEntry = mergeDeep({}, entry, newEntryData);

                    const removed = await HISTORY.removeTrade(entry.trade_id);
                    if (!removed) {
                        alert('Could not remove entry');
                        return;
                    }
                    
                    unsafeWindow.prompt.innerHTML = "<div style='text-align: center'>Loading, please wait...</div>";
                    await HISTORY.pushTrade(newEntry);
                } else {
                    saveBtn.disabled = true;
                    const newEntry = {
                        trade_id: uniqid(16),
                        item: entry.item,
                        itemname: unsafeWindow.itemNamer(entry.item, quantity),
                        quantity,
                        price,
                        date: date.getTime(),
                        action,
                    };
                    unsafeWindow.prompt.innerHTML = "<div style='text-align: center'>Loading, please wait...</div>";
                    await HISTORY.pushTrade(newEntry);
                }

                await HISTORY.sortEntries();
                
                HISTORY.closeEntryPrompt();
                loadMarket();
            });

            unsafeWindow.prompt.appendChild(saveBtn);

            // const editBtn = document.createElement("button");
            // editBtn.style.position = "absolute";
            // editBtn.style.bottom = "30px";
            // editBtn.style.left = "12px";
            // editBtn.textContent = "edit";
            // editBtn.addEventListener("click", async () => {
            //     // const confirmed = confirm('Are you sure you want to remove this entry?');
            //     // if (!confirmed) {
            //     //     return;
            //     // }

            //     // const removed = await HISTORY.removeTrade(entry.trade_id);
            //     // if (!removed) {
            //     //     alert('Could not remove entry');
            //     //     return;
            //     // }

            //     // HISTORY.closeEntryPrompt();
            //     // // HISTORY.resetCache();
            //     // loadMarket();
            // });

            // unsafeWindow.prompt.appendChild(editBtn);
            
            unsafeWindow.prompt.parentNode.style.display = "block";
            unsafeWindow.prompt.focus();

        },
        closeEntryPrompt() {
            pageLock = false;
            unsafeWindow.prompt.parentNode.style.display = "none";
            unsafeWindow.prompt.innerHTML = "";
			unsafeWindow.prompt.classList.remove("warning");
			unsafeWindow.prompt.classList.remove("redhighlight");

        },

        /**
         * Executed when an item is sold, and then the new sell listing is retrieved
         * The response contains the trade id, which is what we need to keep track of the trade
         */
        onSellItem(request, response) {
            // console.log('trying to push sell trade: ', JSON.stringify(response.dataObj, null, 4));
            // console.log('Share this info with Runon if needed');
            const tradeCount = response.dataObj.tradelist_totalsales;
            if (tradeCount == 0) {
                return;
            }
    
            let recentTrade = null;
            const props = [
                'category',
                'deny_private',
                'id_member',
                'id_member_to',
                'item',
                'itemname',
                'member_name',
                'member_to_name',
                'price',
                'pricerper',
                'quantity',
                'trade_id',
                'trade_zone',
            ];
            for(let i = 0; i < tradeCount; i++) {
                const tradeId = response.dataObj['tradelist_' + i + '_trade_id'];
    
                if (recentTrade && recentTrade.trade_id >= tradeId) {
                    continue;
                }
    
                const entry = {
                    action: 'sell',
                };
    
                for (const prop of props) {
                    entry[prop] = response.dataObj['tradelist_' + i + '_' + prop];
                }
    
                recentTrade = entry;
            }
    
            if (!recentTrade) {
                return;
            }
    
            this.pushTrade(recentTrade);
        },
    };

    const HISTORY = new Proxy(_HISTORY, {
        get(target, prop) {
            return Reflect.get(...arguments);
        },
        set(target, prop, value) {
            return Reflect.set(...arguments);
        },
    });

    const SETTINGS = {
        ui: {
            main: {
                title: 'History Menu',
                text: 'Welcome to History Help and Settings!',
                elements: {
                    settings: {
                        type: 'button',
                        title: 'Settings',
                        action() {
                            SETTINGS.renderSettingsPrompt('settings');
                        }
                    },
                    help: {
                        type: 'button',
                        title: 'Help',
                        action() {
                            SETTINGS.renderSettingsPrompt('help');
                        }
                    },
                    export: {
                        type: 'button',
                        title: 'Export',
                        action() {
                            SETTINGS.renderSettingsPrompt('export');
                        }
                    },
                    actions: {
                        type: 'button',
                        title: 'Actions',
                        action() {
                            SETTINGS.renderSettingsPrompt('actions');
                        }
                    },
                    credits: {
                        type: 'button',
                        title: 'Credits',
                        action() {
                            SETTINGS.renderSettingsPrompt('credits');
                        }
                    },
                },
                footerButtons: [
                    {
                        label: 'close',
                        action() {
                            SETTINGS.closePrompt();
                        },
                        style: {
                            right: '12px',
                        }
                    }
                ],
            },
            help: {
                text: 'This script keeps track of all your market trades and your item scraps, and calculates statistics like average sell price.<br><br><span style="color: #FF0000">NOTE:</span> Your history is saved into TamperMonkey data, so if you log in on another computer, your history will not be available there.<br><br>Use the export function to export your history',
                title: 'Help',
                elements: {},
                footerButtons: [
                    {
                        label: 'back',
                        action() {
                            SETTINGS.renderSettingsPrompt('main');
                        },
                        style: {
                            left: '12px',
                        }
                    },
                    {
                        label: 'close',
                        action() {
                            SETTINGS.closePrompt();
                        },
                        style: {
                            right: '12px',
                        }
                    }
                ],
            },
            export: {
                title: 'Export',
                text: 'Export your history to a csv file',
                elements: {
                    exportSortBy: {
                        title: 'Sort by',
                        type: 'switch',
                        description: 'The column to sort by',
                        options: {
                            name: 'Item name',
                            quantity: 'Quantity',
                            price: 'Price',
                            action: 'Trade type',
                            date: 'Date',
                        },
                    },
                    exportSortDirection: {
                        title: 'Sort direction',
                        type: 'switch',
                        description: 'The direction to sort by',
                        options: {
                            asc: 'Ascending',
                            desc: 'Descending',
                        },
                    },
                    exportTimeframe: {
                        title: 'Export timeframe',
                        // type: 'timeframeselect',
                        type: 'switch',
                        description: 'The timeframe that will be used to export the history.',
                        options: TIMEFRAME_OPTIONS
                    },
                    download: {
                        type: 'button',
                        title: 'Download export',
                        description: 'Starts the exports and downloads the csv file',
                        async action() {
                            await HISTORY.load();

                            const sortBy = SETTINGS.values.exportSortBy;
                            const sortDirection = SETTINGS.values.exportSortDirection;
                            const timeframe = SETTINGS.values.exportTimeframe;
                            const tresholdDate = getTresholdDateForTimeframe(timeframe);

                            let filteredEntries = HISTORY.entries.filter(entry => {
                                const entryDate = new Date(entry.date);
                                if (tresholdDate && entryDate < tresholdDate) {
                                    return false;
                                }
                                return true;
                            });

                            const sortByKey = sortBy == 'name' ? 'item' : sortBy;
                            const sortDirectionMultiplier = sortDirection == 'asc' ? 1 : -1;
                            const sortStrategy = ['price', 'quantity'].includes(sortByKey) ? 'numeric' : 'string';

                            filteredEntries.sort((a, b) => {
                                const aKey = a[sortByKey];
                                const bKey = b[sortByKey];

                                if (sortStrategy == 'numeric') {
                                    return (aKey - bKey) * sortDirectionMultiplier;
                                }

                                if (sortStrategy == 'string') {
                                    if (aKey < bKey) {
                                        return -1 * sortDirectionMultiplier;
                                    }
                                    if (aKey > bKey) {
                                        return 1 * sortDirectionMultiplier;
                                    }
                                    return 0;
                                }

                                throw new Error('Invalid sort strategy: ' + sortStrategy);
                            });

                            filteredEntries = filteredEntries.map(entry => [
                                entry.trade_id,
                                entry.item,
                                entry.itemname,
                                entry.quantity,
                                entry.price,
                                entry.action,
                                formatDate(new Date(entry.date)),
                            ]);

                            // Insert header at top
                            filteredEntries.unshift(['id', 'item', 'name', 'quantity', 'price', 'action', 'date']);

                            exportToCsv('market_trades_tracker_export.csv', filteredEntries, SETTINGS.values.exportSeperator);
                        }
                    }
                },
                footerButtons: [
                    {
                        label: 'back',
                        action() {
                            SETTINGS.renderSettingsPrompt('main');
                        },
                        style: {
                            left: '12px',
                        }
                    },
                    {
                        label: 'close',
                        action() {
                            SETTINGS.closePrompt();
                        },
                        style: {
                            right: '12px',
                        }
                    }
                ],
            },
            actions: {
                title: 'Actions',
                text: '',
                elements: {
                    clear: {
                        type: 'button',
                        title: 'Clear history',
                        description: 'Clears all market sell/buy/scrap history older than a specific timeframe<br><br><span style="color: #FF0000">WARNING:</span> This cannot be undone!',
                        action() {
                            SETTINGS.renderSettingsPrompt('clear_confirm');
                        }
                    },
                    clearCache: {
                        type: 'button',
                        title: 'Clear cache',
                        description: 'Clears the cache, which will cause the script to recalculate all statistics',
                        action() {
                            HISTORY.resetCache();
                            alert('Cache cleared');
                        }
                    },
                },
                footerButtons: [
                    {
                        label: 'back',
                        action() {
                            SETTINGS.renderSettingsPrompt('main');
                        },
                        style: {
                            left: '12px',
                        }
                    },
                    {
                        label: 'close',
                        action() {
                            SETTINGS.closePrompt();
                        },
                        style: {
                            right: '12px',
                        }
                    }
                ],
            },
            clear_confirm: {
                class: 'warning',
                title: 'Clear history',
                text: 'Are you really sure you want to clear history?<br><br>You can delete single entries by clicking on them in the history tab.<br><br><span style="color: #FF0000">WARNING:</span> This cannot be undone!',
                descriptionTop: '200px',
                elements: {
                    clearHistoryTimeframe: {
                        title: 'Timeframe',
                        type: 'switch',
                        description: 'History entries that are older than this timeframe will be deleted.',
                        options: TIMEFRAME_OPTIONS
                    },
                },
                footerButtons: [
                    {
                        label: 'no',
                        action() {
                            SETTINGS.renderSettingsPrompt('actions');
                        },
                        style: {
                            left: '12px',
                        }
                    },
                    {
                        label: 'yes',
                        async action() {
                            if (!confirm('Are you really sure? All entries OLDER than the selected timeframe will be deleted!')) {
                                return;
                            }

                            if (SETTINGS.values.clearHistoryTimeframe == 'all') {
                                await HISTORY.clearEntries();
                            } else {
                                const tresholdDate = getTresholdDateForTimeframe(SETTINGS.values.clearHistoryTimeframe);
                                await HISTORY.load();
                                const entries = HISTORY.entries.filter(entry => {
                                    const entryDate = new Date(entry.date);
                                    return entryDate >= tresholdDate;
                                });
                                HISTORY.entries = entries;
                                await HISTORY.forceSave();
                            }
                            HISTORY.resetCache();
                            SETTINGS.closePrompt();
                            window.location.reload();
                        },
                        style: {
                            right: '12px',
                        }
                    }
                ]
            },
            credits: {
                title: 'Credits',
                text: 'This script was made by <span style="color: #FF0000">Runonstof</span>. If you have any questions or suggestions, feel free to contact me on Discord: <span style="color: #FF0000">runon</span>',
                elements: {
                    donate: {
                        type: 'button',
                        title: 'Donate',
                        description: 'Redirects to my profile page, where you can donate anything if you want to support me.',
                        action() {
                            window.location.href = '/onlinezombiemmo/index.php?action=profile;u=12925065';
                        }
                    }
                },
                footerButtons: [
                    {
                        label: 'back',
                        action() {
                            SETTINGS.renderSettingsPrompt('main');
                        },
                        style: {
                            left: '12px',
                        }
                    },
                    {
                        label: 'close',
                        action() {
                            SETTINGS.closePrompt();
                        },
                        style: {
                            right: '12px',
                        }
                    }
                ],
            },
            settings: {
                title: 'Settings',
                text: '',
                elements: {
                    hoverSettings: {
                        type: 'button',
                        title: '>>  Hover info settings',
                        description: 'Settings for the hover info module.',
                        action() {
                            SETTINGS.renderSettingsPrompt('hoverSettings');
                        }
                    },
                    // hoverAvgPriceEnabled: {
                    //     title: 'Avg price hover enabled',
                    //     description: 'Show average sell/buy price and profit/loss in set timeframe on item hover',
                    //     type: 'checkbox',
                    // },
                    // hoverLastPriceEnabled: {
                    //     title: 'Last price hover enabled',
                    //     description: 'Show last sell/buy price and date on item hover',
                    //     type: 'checkbox',
                    // },
                    

                    // autoFillBreakEvenPrice: {
                    //     title: 'Auto fill price',
                    //     type: 'checkbox',
                    //     description: 'When selling an item, the price will be automatically filled in with the average sell price in the set timeframe.',
                    // },
                    countPendingTrades: {
                        title: 'Calculate with pending',
                        type: 'checkbox',
                        meta: {
                            resetCache: true,
                        },
                        description: 'When calculating statistics, pending trades will be taken into account, if changed, you might have to reload statistics screen.',
                    },
                    countScraps: {
                        title: 'Calculate with scraps',
                        type: 'checkbox',
                        meta: {
                            resetCache: true,
                        },
                        description: 'When calculating statistics, scraps will be taken into account, if changed, you might have to reload statistics screen.',
                    },
                    hoverStatisticsTimeframe: {
                        title: 'Timeframe',
                        // type: 'timeframeselect',
                        type: 'switch',
                        description: 'The timeframe that will be used to calculate statistics.',
                        options: {
                            all: 'All time',
                            last_24hr: 'Last 24 hours',
                            last_week: 'Last week',
                            last_month: 'Last month',
                            last_3_months: 'Last 3 months',
                            last_6_months: 'Last 6 months',
                            last_year: 'Last year',
                            ytd: 'Since january 1st',
                            mtd: 'Since 1st of month',
                        },
                        meta: {
                            resetCache: true,
                        },
                    },
                    defaultHistoryPage: {
                        title: 'Default page',
                        type: 'switch',
                        description: 'The page that will be shown by default when opening the history tab.',
                        options: {
                            list: 'List',
                            stats: 'Statistics',
                        },
                    },
                },
                footerButtons: [
                    {
                        label: 'back',
                        action() {
                            SETTINGS.renderSettingsPrompt('main');
                        },
                        style: {
                            left: '12px',
                        }
                    },
                    {
                        label: 'close',
                        action() {
                            SETTINGS.closePrompt();
                        },
                        style: {
                            right: '12px',
                        }
                    }
                ],
            },
            hoverSettings: {
                title: 'Hover settings',
                text: 'Here you can configure what elements you see when you hover an item.',
                descriptionStrategy: 'text',
                style: {
                    position: 'absolute',
                    bottom: '50px',
                },
                elements: {
                    hoverEnabled: {
                        title: 'Hover info enabled',
                        description: 'Show info on item hover',
                        type: 'checkbox',
                    },
                    hoverAvgSellPriceEnabled: {
                        title: 'Average sell price',
                        description: 'Show average sell price in set timeframe.',
                        type: 'checkbox',
                        disabled() {
                            return !SETTINGS.values.hoverEnabled;
                        },
                    },
                    hoverAvgBuyPriceEnabled: {
                        title: 'Average buy price',
                        description: 'Show average buy price in set timeframe.',
                        type: 'checkbox',
                        disabled() {
                            return !SETTINGS.values.hoverEnabled;
                        },
                    },
                    hoverAmountSoldEnabled: {
                        title: 'Amount sold',
                        description: 'Show amount sold in set timeframe.',
                        type: 'checkbox',
                        disabled() {
                            return !SETTINGS.values.hoverEnabled;
                        },
                    },
                    hoverAmountBoughtEnabled: {
                        title: 'Amount bought',
                        description: 'Show amount bought in set timeframe.',
                        type: 'checkbox',
                        disabled() {
                            return !SETTINGS.values.hoverEnabled;
                        },
                    },
                    hoverLastSellPriceEnabled: {
                        title: 'Last sell price',
                        description: 'Show the most recent price you sold this item for.',
                        type: 'checkbox',
                        disabled() {
                            return !SETTINGS.values.hoverEnabled;
                        },
                    },
                    hoverLastBuyPriceEnabled: {
                        title: 'Last buy price',
                        description: 'Show the most recent price you bought this item for.',
                        type: 'checkbox',
                        disabled() {
                            return !SETTINGS.values.hoverEnabled;
                        },
                    },
                    hoverAvgProfitEnabled: {
                        title: 'Average profit per item',
                        description: 'Show average profit per item in set timeframe.',
                        type: 'checkbox',
                        disabled() {
                            return !SETTINGS.values.hoverEnabled;
                        }
                    },
                    shiftHoverMode: {
                        title: 'Hold shift mode',
                        type: 'switch',
                        description() {
                            if (SETTINGS.values.shiftHoverMode == 'disabled') {
                                return 'Shift hover is disabled' + (silverScriptsInstalled ? ', both SilverScripts and History Data are shown without holding SHIFT.' : ', History Data is shown without holding SHIFT.');
                            } else if (SETTINGS.values.shiftHoverMode == 'history') {
                                return 'When SHIFT is held, History Data will only be shown' + (silverScriptsInstalled ? ', otherwise SilverScripts\' HoverPrices are shown.' : '.');
                            } else if (SETTINGS.values.shiftHoverMode == 'silverscripts') {
                                return 'When SHIFT is held, SilverScripts\' HoverPrices are only shown, otherwise History Data is shown.';
                            }

                            return '';
                        },
                        disabled() {
                            return !SETTINGS.values.hoverEnabled;
                        },
                        options: SHIFT_HOVER_OPTIONS,
                    },
                },
                footerButtons: [
                    {
                        label: 'back',
                        action() {
                            SETTINGS.renderSettingsPrompt('settings');
                        },
                        style: {
                            left: '12px',
                        }
                    },
                    {
                        label: 'close',
                        action() {
                            SETTINGS.closePrompt();
                        },
                        style: {
                            right: '12px',
                        }
                    }
                ],
            },
        },
        // Seperate values object, where settings are loaded one by one, for if i decide to add settings later on
        values: {
            // If true, sell/buy statistics will be shown in the item tooltip when an item is hovered
            hoverEnabled: true,
            
            hoverAvgSellPriceEnabled: true,
            hoverAvgBuyPriceEnabled: true,
            hoverAmountSoldEnabled: true,
            hoverAmountBoughtEnabled: true,
            hoverLastSellPriceEnabled: true,
            hoverLastBuyPriceEnabled: true,
            hoverAvgProfitEnabled: true,
            shiftHoverMode: silverScriptsInstalled ? 'history' : 'disabled', // 'disabled', 'history', 'silverscripts'

            defaultHistoryPage: 'list',
            hoverStatisticsTimeframe: 'all',
            clearHistoryTimeframe: 'all',

            // If true, the script will automatically fill in the price when selling an item
            // The price will be the average buy price of the item of the configured timeframe
            autoFillBreakEvenPrice: true,
            // If true, the script will take trades that are still pending into account when calculating statistics
            countPendingTrades: true,
            countScraps: true,
            exportSortBy: 'date',
            exportSortDirection: 'asc',
            exportTimeframe: 'all',
            exportSeperator: ';',
        },
        async reset() {
            await GM.setValue('SETTINGS_values', {});
            this.values = {};

            await this.load();
        },
        async load() {
            const values = await GM.getValue('SETTINGS_values', {});

            // Merge values with default values
            this.values = mergeDeep(this.values, values);

            if (!silverScriptsInstalled && this.values.shiftHoverMode == 'silverscripts') {
                this.values.shiftHoverMode = 'disabled';
            }

            if (!unsafeWindow.historyScreenSet) {
                unsafeWindow.historyScreen = this.values.defaultHistoryPage;
                unsafeWindow.historyScreenSet = true;
            }
        },
        async save() {
            await GM.setValue('SETTINGS_values', this.values);
        },
        async toggle(setting) {
            await this.load();
            this.values[setting] = !this.values[setting];
            await this.save();
        },
        async set(setting, value) {
            await this.load();
            this.values[setting] = value;
            await this.save();
        },
        closePrompt() {
            unsafeWindow.prompt.parentNode.style.display = "none";
            unsafeWindow.prompt.innerHTML = "";
            unsafeWindow.prompt.style.height = "";
            pageLock = false;
			unsafeWindow.prompt.classList.remove("warning");
			unsafeWindow.prompt.classList.remove("redhighlight");

            console.log('reloading market:' + unsafeWindow.marketScreen + ' ' + unsafeWindow.historyScreen);
            if (unsafeWindow.marketScreen == 'history' && unsafeWindow.historyScreen == 'stats') {
                unsafeWindow.loadMarket();
            }
        },
        renderSettingsPrompt(page = 'main') {
            pageLock = true;

			unsafeWindow.prompt.classList.remove("warning");
			unsafeWindow.prompt.classList.remove("redhighlight");

            const pageInfo = this.ui[page];

            if (pageInfo.class) {
                unsafeWindow.prompt.classList.add(pageInfo.class);
            }

        	unsafeWindow.prompt.style.height = "280px";
            unsafeWindow.prompt.innerHTML = pageInfo.title ? '<div style="text-align: center; text-decoration: underline">' + pageInfo.title + '</div>' : '';
            if (pageInfo.text) {
                unsafeWindow.prompt.innerHTML += '<div id="historySettingsPageText">' + pageInfo.text + '</div>';
            }
            unsafeWindow.prompt.innerHTML += '<br />';

            const historySettingsHolder = document.createElement("div");
            historySettingsHolder.id = "historySettingsHolder";
            // historySettingsHolder.style.position = "absolute";

            this._renderUi(historySettingsHolder, page);

            unsafeWindow.prompt.appendChild(historySettingsHolder);

            for(const footerButtonInfo of pageInfo.footerButtons || []) {

                const footerButton = document.createElement("button");
                footerButton.style.position = "absolute";
                footerButton.style.bottom = "12px";
                if (footerButtonInfo.action) {
                    footerButton.addEventListener("click", footerButtonInfo.action);
                }

                footerButton.textContent = footerButtonInfo.label;
                
                for(const styleKey in footerButtonInfo.style) {
                    footerButton.style[styleKey] = footerButtonInfo.style[styleKey];
                }
                unsafeWindow.prompt.appendChild(footerButton);
            }

            
            unsafeWindow.prompt.parentNode.style.display = "block";
            unsafeWindow.prompt.focus();
        },
        _renderDescription(holder, descriptionText, pageInfo) {
            const strategy = pageInfo.descriptionStrategy || 'bottom';

            if (typeof descriptionText === 'function') {
                descriptionText = descriptionText();
            }

            if (strategy == 'bottom') {
                const descriptionElement = document.getElementById('historySettingsDescription');
                // delete the element
                if (descriptionElement) {
                    descriptionElement.parentNode.removeChild(descriptionElement);
                }
    
                if (!descriptionText) {
                    return;
                }
    
                const description = document.createElement('div');
                description.id = 'historySettingsDescription';
                description.innerHTML = descriptionText;
                description.style.position = 'absolute';
                const top = pageInfo.descriptionTop || '140px';
                description.style.top = top;
    
                holder.appendChild(description);
            } else if (strategy == 'text') {
                const historySettingsPageText = document.getElementById('historySettingsPageText');
                if (!historySettingsPageText) {
                    return;
                }
                historySettingsPageText.style.display = 'none';

                const existingDescription = document.getElementById('historySettingsDescription');
                if (existingDescription) {
                    existingDescription.parentNode.removeChild(existingDescription);
                }

                if (!descriptionText) {
                    historySettingsPageText.style.display = '';
                    return;
                }

                const description = document.createElement('div');
                description.id = 'historySettingsDescription';
                description.innerHTML = descriptionText;

                historySettingsPageText.parentNode.insertBefore(description, historySettingsPageText.nextSibling);
            }
        },
        _renderUi(holder, page = 'main') {
            const pageInfo = this.ui[page];

            if (pageInfo.style) {
                for(const styleKey in pageInfo.style) {
                    holder.style[styleKey] = pageInfo.style[styleKey];
                }
            }

            const elements = pageInfo.elements;
            holder.innerHTML = '';

            const self = this;
            
            for(const settingKey in elements) {
                const setting = elements[settingKey];
                const buttonHolder = document.createElement('div');

                switch (setting.type) {
                    case 'paragraph':
                        break;
                    case 'checkbox':
                        const checkbox = document.createElement('button');
                        checkbox.innerText = '[' + (this.values[settingKey] ? 'x' : ' ') + '] ' + setting.title;
                        if (typeof setting.disabled === 'function') {
                            checkbox.disabled = setting.disabled();
                        }

                        if (checkbox.disabled) {
                            buttonHolder.appendChild(checkbox);
                            holder.appendChild(buttonHolder);
                            break;
                        }

                        checkbox.addEventListener('click', async () => {
                            await self.toggle(settingKey);
                            if (setting.meta) {
                                if (setting.meta.resetCache) {
                                    HISTORY.resetCache();
                                }
                            }
                            self._renderUi(holder, page);
                        });
                        if (setting.description) {
                            checkbox.addEventListener('mouseover', function () {
                                self._renderDescription(holder, setting.description, pageInfo);
                            });
                            checkbox.addEventListener('mouseout', function () {
                                self._renderDescription(holder, null, pageInfo);
                            });
                        }
                        buttonHolder.appendChild(checkbox);
                        holder.appendChild(buttonHolder);
                        break;
                    case 'switch':
                        const switcher = document.createElement('button');
                        const settingValue = this.values[settingKey];
                        const settingValueTitle = setting.options[settingValue];
                        switcher.innerText = setting.title + ': ' + settingValueTitle;

                        if (typeof setting.disabled === 'function') {
                            switcher.disabled = setting.disabled();
                        }

                        if (switcher.disabled) {
                            buttonHolder.appendChild(switcher);
                            holder.appendChild(buttonHolder);
                            break;
                        }

                        switcher.addEventListener('click', async e => {
                            const valueKeys = Object.keys(setting.options);
                            const valueIndex = valueKeys.indexOf(settingValue);
                            let nextValueIndex = 0;
                            if (e.shiftKey) {
                                nextValueIndex = valueIndex - 1 < 0 ? valueKeys.length - 1 : valueIndex - 1;
                            } else {
                                nextValueIndex = valueIndex + 1 >= valueKeys.length ? 0 : valueIndex + 1;
                            }
                            const nextValue = valueKeys[nextValueIndex];
                            await self.set(settingKey, nextValue);
                            if (setting.meta) {
                                if (setting.meta.resetCache) {
                                    HISTORY.resetCache();
                                }
                            }
                            if (typeof setting.afterSaving === 'function') {
                                setting.afterSaving();
                            }
                            self._renderUi(holder, page);
                        });
                        if (setting.description) {
                            switcher.addEventListener('mouseover', function () {
                                self._renderDescription(holder, setting.description, pageInfo);
                            });
                            switcher.addEventListener('mouseout', function () {
                                self._renderDescription(holder, null, pageInfo);
                            });
                        }
                        buttonHolder.appendChild(switcher);
                        holder.appendChild(buttonHolder);
                        break;
                    case 'button':
                        const button = document.createElement('button');
                        button.innerText = setting.title;
                        
                        button.addEventListener('click', setting.action);
                        if (setting.description) {
                            button.addEventListener('mouseover', function () {
                                self._renderDescription(holder, setting.description, pageInfo);
                            });
                            button.addEventListener('mouseout', function () {
                                self._renderDescription(holder, null, pageInfo);
                            });
                        }
                        buttonHolder.appendChild(button);
                        holder.appendChild(buttonHolder);
                        break;
                }
            }
        }
    };

    const HOVER_INFOBOX_DATA = {
        event: null,
        run (shift=true) {
            if (infoBox.style.visibility == 'hidden') {
                // console.log('infoBox is hidden');
                return;
            }
            if (!this.event) {
                // console.log('no event');
                return;
            }
            if (!SETTINGS.values.hoverEnabled) {
                // console.log('hover info disabled');
                return;
            }
            if (SETTINGS.values.shiftHoverMode == 'disabled') {
                // console.log('shift hover mode disabled');
                return;
            }

            Object.defineProperty(this.event, 'shiftKey', {
                value: shift,
                writable: false,
                configurable: true,
            });

            unsafeWindow.infoCard(this.event);
        },
    };


    /******************************************************
     * Utility functions
     ******************************************************/
    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyle_Runon") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyle_Runon";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
 
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }
 
    function GM_addStyle_object(selector, rules) {
        const nested = [];

        let ruleCount = 0;
        let css = selector + "{";
        for (const key in rules) {
            if (key[0] == '$') {
                nested.push({selector: key.substr(1).trim(), rules: rules[key]})
                continue;
            }
            ruleCount++;
            css += key.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`) + ":" + rules[key] + ";";
        }
        css += "}";

        if (ruleCount) {
            GM_addStyle(css);
        }

        for(const nestedRules of nested) {
            const nestedSelector = nestedRules.selector.replace(/\&/g, selector);

            GM_addStyle_object(nestedSelector, nestedRules.rules);
        }

    }

    function stringExplode(string) {
        return Object.fromEntries(
            string.split("&").map((x) => x.split("="))
        );
    }

    function realQuantity(quantity, itemcategory) {
        if (itemcategory == 'armour' || itemcategory == 'weapon') {
            return 1;
        }

        return parseInt(quantity);
    }
 
    function maxStack(itemId, loose = false) {
        itemId = getGlobalDataItemId(itemId);
        const itemcat = unsafeWindow.globalData[itemId].itemcat;
        if (itemcat == 'armour' || itemcat == 'weapon') {
            return 1;
        }

        // TODO: check if doesnt cause unwanted side effects
        if (itemcat == 'credits') {
            return loose ? 9999999 : 1;
        }

        return unsafeWindow.globalData[itemId].max_quantity;
    }

    function uniqid(length = 16) { 
        return window.btoa(Array.from(window.crypto.getRandomValues(new Uint8Array(length * 2))).map((b) => String.fromCharCode(b)).join("")).replace(/[+/]/g, "").substr(0, length);
    }

    /**
     * Simple object check.
     * @param item
     * @returns {boolean}
     */
    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }
    
    /**
     * Deep merge two objects.
     * @param target
     * @param ...sources
     */
    function mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();
    
        if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target.hasOwnProperty(key)) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
        }
    
        return mergeDeep(target, ...sources);
    }


    // Hook into webCall, after request is done, but before callback is executed
    function onBeforeWebCall(call, callback) {
        if (!call) { // If call is not specified, hook into all calls
            WEBCALL_HOOKS.beforeAll.push(callback);
            return;
        }

        if (!WEBCALL_HOOKS.before.hasOwnProperty(call)) {
            WEBCALL_HOOKS.before[call] = [];
        }

        WEBCALL_HOOKS.before[call].push(callback);
    }

    // Remove hook from webCall
    function offBeforeWebCall(call, callback) {
        if (!call) { // If call is not specified, remove hook from all calls
            const index = WEBCALL_HOOKS.beforeAll.indexOf(callback);
            if (index > -1) {
                WEBCALL_HOOKS.beforeAll.splice(index, 1);
            }
            return;
        }

        if (!WEBCALL_HOOKS.before.hasOwnProperty(call)) {
            return;
        }

        const index = WEBCALL_HOOKS.before[call].indexOf(callback);
        if (index > -1) {
            WEBCALL_HOOKS.before[call].splice(index, 1);
        }
    }

    // Hook into webCall, after request is done and after callback is executed
    function onAfterWebCall(call, callback) {
        if (!call) { // If call is not specified, hook into all calls
            WEBCALL_HOOKS.afterAll.push(callback);
            return;
        }

        if (!WEBCALL_HOOKS.after.hasOwnProperty(call)) {
            WEBCALL_HOOKS.after[call] = [];
        }

        WEBCALL_HOOKS.after[call].push(callback);
    }

    // Remove hook from webCall
    function offAfterWebCall(call, callback) {
        if (!call) { // If call is not specified, remove hook from all calls
            const index = WEBCALL_HOOKS.afterAll.indexOf(callback);
            if (index > -1) {
                WEBCALL_HOOKS.afterAll.splice(index, 1);
            }
            return;
        }

        if (!WEBCALL_HOOKS.after.hasOwnProperty(call)) {
            return;
        }

        const index = WEBCALL_HOOKS.after[call].indexOf(callback);
        if (index > -1) {
            WEBCALL_HOOKS.after[call].splice(index, 1);
        }
    }

    function formatDate(date, options = {}) {
        const {
            format = 'datetime',
        } = options;

        const offset = date.getTimezoneOffset()
        date = new Date(date.getTime() - (offset*60*1000))

        if (format == 'datetime') {
            return date.toISOString().split('.')[0].replace('T', ' ');
        } else if (format == 'date') {
            return date.toISOString().split('T')[0];
        }

        throw new Error('Invalid date format: ' + format);
    }

    function formatNumber(num, options = {}) {
        const {
            minimumFractionDigits = 0,
            maximumFractionDigits = 2,
        } = options;

        return (new Number(num))
            .toLocaleString('en-US', {minimumFractionDigits, maximumFractionDigits})
            .replace(/\.0+$/, '');
    }

    function formatMoney(num, options = {}) {
        if (typeof options == 'boolean') {
            options = { plus: options };
        }

        const {
            plus = false,
            showFree = false,
        } = options;

        if (num == 0 && showFree) {
            return 'Free';
        }

        const plusSign = plus ? '+' : '';

        return (num < 0 ? '-' : plusSign) + '$' + formatNumber(Math.abs(num), options);
    }

    function formatMoneyHtml(num, options = {}) {
        if (typeof options == 'boolean') {
            options = { neutralColor: options, plus: false };
        }

        const {
            neutralColor = false,
        } = options;

        let color = '#FFCC00';
        if (!neutralColor) {
            color = num < 0 ? '#FF0000' : '#00FF00';
        }

        return '<span style="color: ' + color + '">' + formatMoney(num, options) + '</span>';
    }

    function historyAction(e) {

        var question = false;
        var action;
        var extraData = {};
        switch(e.target.dataset.action) {
            case 'switchHistory':
                unsafeWindow.prompt.innerHTML = "<div style='text-align: center'>Loading, please wait...</div>";
                unsafeWindow.prompt.parentNode.style.display = "block";
                unsafeWindow.historyScreen = e.target.dataset.page;
                loadMarket();
                return;
                break;
        }
    }

    function debouncedItemSearch() {
        const searchFn = function (query) {
            query = query.toLowerCase().replace(/[\.\s]/g, '').trim();
            if (!query.length) {
                return [];
            }
            return SEARCHABLE_ITEMS
                .filter(itemId => {
                    const itemName = unsafeWindow.itemNamer(itemId, '')
                        .toLowerCase()
                        .replace(/[\.\s]/g, '');
                    return itemName.includes(query) || itemId.includes(query);
                })
                .map(item => {
                    return {
                        item,
                        // name: itemNamer(item, maxStack(item)),
                        name: itemNamer(item, ''),
                    }
                })
                .sort((a, b) => {
                    const aName = a.name?.toLowerCase();
                    const bName = b.name?.toLowerCase();
                    return aName.localeCompare(bName);
                });
        };
        
        let timeout;
        return function (query, callback) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                callback(searchFn(query));
            }, 400);
        };
    }

    // To be called to check if results box should be hidden
    function onDocumentClick(e) {
        const historyItemSearchResultBox = document.getElementById('historyItemSearchResultBox');
        if (!historyItemSearchResultBox || (e.target.closest('#historyItemSearchResultBox') || e.target.closest('#historySearchArea input'))) {
            return;
        }
        historyItemSearchResultBox.classList.add('hidden');
    }

    unsafeWindow.addEventListener('click', onDocumentClick);

    // @see https://stackoverflow.com/a/24922761
    function exportToCsv(filename, rows, seperator) {
        var processRow = function (row) {
            var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null ? '' : row[j].toString();

                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString();
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n|\s)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += seperator;
                finalVal += result;
            }
            return finalVal + '\n';
        };
    
        var csvFile = '';
        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }
    
        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    function getGlobalDataItemId(rawItemId) {
        return rawItemId.split('_')[0];
    }

    function getBaseItemId(rawItemId) {
        return rawItemId.replace(/_stats\d+/, '');
    }

    function getTresholdDateForTimeframe(timeframe) {
        let tresholdDate = null;
        switch (timeframe) {
            case 'last_24hr':
                tresholdDate = new Date();
                tresholdDate.setDate(tresholdDate.getDate() - 1);
                break;
            case 'last_week':
                tresholdDate = new Date();
                tresholdDate.setDate(tresholdDate.getDate() - 7);
                break;
            case 'last_month':
                tresholdDate = new Date();
                tresholdDate.setMonth(tresholdDate.getMonth() - 1);
                break;
            case 'last_3_months':
                tresholdDate = new Date();
                tresholdDate.setMonth(tresholdDate.getMonth() - 3);
                break;
            case 'last_6_months':
                tresholdDate = new Date();
                tresholdDate.setMonth(tresholdDate.getMonth() - 6);
                break;
            case 'last_year':
                tresholdDate = new Date();
                tresholdDate.setFullYear(tresholdDate.getFullYear() - 1);
                break;
            case 'ytd':
                tresholdDate = new Date();
                tresholdDate.setMonth(0);
                tresholdDate.setDate(1);
                break;
            case 'mtd':
                tresholdDate = new Date();
                tresholdDate.setDate(1);
                break;
            case 'wtd':
                tresholdDate = new Date();
                tresholdDate.setDate(tresholdDate.getDate() - tresholdDate.getDay());
                break;
        }

        return tresholdDate;
    }

    function parseDateTimeString(value) {
        const pattern = /^(\d{4})\-(\d{2})\-(\d{2})(?:\s(\d{2}):(\d{2})(?:\:(\d{2}))?)?$/;
        const match = value.match(pattern);

        if (!match) {
            return null;
        }

        const year = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const day = parseInt(match[3]);
        const hour = parseInt(match[4]) || 0;
        const minute = parseInt(match[5]) || 0;
        const second = parseInt(match[6]) || 0;

        return new Date(year, month, day, hour, minute, second);
    }

    function ready() {
        return new Promise(resolve => {
            if (document.readyState === "complete" || document.readyState === "interactive") {
                resolve();
            } else {
                document.addEventListener("DOMContentLoaded", resolve);
            }
        });
    }

    function injectHistoryTabIntoMarketplace() {
        if (unsafeWindow.document.getElementById('loadHistory')) {
            return;
        }
        const pageNavigation = document.getElementById('selectMarket');
        if (!pageNavigation) {
            return;
        }
        
        // Async context, i dont like nested callbacks, i like async/await
        (async function () {
            // Add history button
            const historyBtn = document.createElement('button');
            historyBtn.setAttribute('data-action', 'switchMarket');
            historyBtn.setAttribute('data-page', 'history');
            historyBtn.setAttribute('id', 'loadHistory');
            historyBtn.innerText = 'history';
            historyBtn.addEventListener("click", marketAction);
            pageNavigation.appendChild(historyBtn);

    
            switch (unsafeWindow.marketScreen) {
                case 'history':
                    historyBtn.disabled = true;
                    pageLogo.textContent = "Market History";

                    const historyNavigation = document.createElement('div');
                    historyNavigation.id = 'selectHistoryCategory';
                    pageNavigation.after(historyNavigation);

                    const listBtn = document.createElement('button');
                    listBtn.setAttribute('data-action', 'switchHistory');
                    listBtn.setAttribute('data-page', 'list');
                    listBtn.setAttribute('id', 'historyList');
                    listBtn.innerText = 'list';
                    listBtn.addEventListener("click", historyAction);
                    
                    const statsBtn = document.createElement('button');
                    statsBtn.setAttribute('data-action', 'switchHistory');
                    statsBtn.setAttribute('data-page', 'stats');
                    statsBtn.setAttribute('id', 'historyStats');
                    statsBtn.innerText = 'statistics';
                    statsBtn.addEventListener("click", historyAction);


                    historyNavigation.appendChild(listBtn);
                    historyNavigation.appendChild(statsBtn);

                    const searchBox = document.createElement("div");
                    searchBox.id = "historySearchArea";

                    const filterBox = document.createElement("div");
                    filterBox.id = "historyFilterArea";

                    filterBox.innerHTML = `
                    <div style="position: relative;">
                        <div class="opElem" id="filterActionTypeWrapper">
                            <div data-value="${HISTORY.filters.type}" id="filterActionType" class="historySelectComponent">
                                <div class="selectChoice">
                                    <span></span>
                                    <span></span>
                                </div>
                                <div class="selectList">
                                    <div data-value="all" class="selectOption">- All -</div>
                                    <div data-value="buy" class="selectOption">Buy</div>
                                    <div data-value="sell" class="selectOption">Sell</div>
                                    <div data-value="scrap" class="selectOption">Scrap</div>
                                    <div data-value="sell_scrap" class="selectOption">Sell/Scrap</div>
                                </div>
                            </div>
                        </div>
                        
                        <input type="date" id="filterMinDate" class="opElem" value="${HISTORY.filters.minDate ? formatDate(new Date(HISTORY.filters.minDate), {format: 'date'}) : ''}"/>
                        <input type="date" id="filterMaxDate" class="opElem" value="${HISTORY.filters.maxDate ? formatDate(new Date(HISTORY.filters.maxDate), {format: 'date'}) : ''}"/>

                        <button id="filterGo" class="opElem">Filter</button>
                    </div>
                    `;

                    initHistorySelects();

                    let searchInput;

                    if (HISTORY.selectedItem) {
                        const itemName = unsafeWindow.itemNamer(HISTORY.selectedItem, HISTORY.selectedItem == 'credits' ? '' : maxStack(HISTORY.selectedItem));
                        /*<div style='display: inline-block;' class="itemName cashhack cashhack-relative" data-cash="${itemName}">
                            </div> */
                        searchBox.innerHTML = `
                            <button id="clearHistoryItem">[x]</button>

                            <div class="opElem" id="selectedItemsWrapper">
                                <div data-value="${HISTORY.selectedItem}" id="selectedItems" class="historySelectComponent">
                                    <div class="selectChoice">
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <div class="selectList">
                                        <div data-value="${HISTORY.selectedItem}" class="selectOption">${itemName}</div>
                                    </div>
                                </div>
                            </div>
                        `;

                        const clearHistoryItemBtn = searchBox.querySelector('#clearHistoryItem');
                        clearHistoryItemBtn.addEventListener('click', function () {
                            HISTORY.setSelectedItem(null);
                            loadMarket();
                        });
                    } else {
                        searchBox.innerHTML = `
                            <div style='text-align: left; width: 185px; display: inline-block;'>
                                <input id='historySearchField' placeholder='Type to search' type='text' name='historySearch' />
                            </div>
                        `;
                        
                        searchInput = searchBox.querySelector('#historySearchField');

                        
                        const searchFn = debouncedItemSearch();

                        searchInput.addEventListener('input', function () {
                            const value = this.value;
                            searchFn(value, function (results) {
                                searchResultBox.innerHTML = '';
                                for(const result of results) {
                                    // const resultRow = document.createElement('div');

                                    const resultButton = document.createElement('button');
                                    resultButton.innerText = result.name;
                                    resultButton.style.width = '100%';
                                    resultButton.style.textAlign = 'left';
                                    resultButton.classList.add("fakeItem");
                                    resultButton.setAttribute("data-type", result.item);
                                    resultButton.setAttribute("data-quantity", result.item == 'credits' ? '' : maxStack(result.item));
        
                                    resultButton.addEventListener('click', async function () {
                                        this.disabled = true;
                                        await HISTORY.setSelectedItem(result.item)
                                        searchResultBox.innerHTML = '';
                                        searchResultBox.classList.add('hidden');

                                        loadMarket();
                                        // searchInput.value = result.name;
                                        // searchResultBox.innerHTML = '';
                                    });
                                    // resultRow.appendChild(resultButton);
                                    // searchResultBox.appendChild(resultRow);
                                    searchResultBox.appendChild(resultButton);
                                }

                                if (!value.length) {
                                    searchResultBox.classList.add('hidden');
                                } else {
                                    searchResultBox.classList.remove('hidden');

                                    if (!results.length) {
                                        const noResults = document.createElement('div');
                                        noResults.innerText = 'No results found';
                                        searchResultBox.appendChild(noResults);
                                    }
                                }
                            });
                        });
                        searchInput.addEventListener('blur', function (e) {
                            // Check if not focused on result box
                            if (e.relatedTarget && e.relatedTarget.parentNode.id == 'historyItemSearchResultBox') {
                                return;
                            }

                            searchResultBox.classList.add('hidden');
                        });
                        searchInput.addEventListener('focus', function () {
                            // If result box has results, show it
                            if (searchResultBox.children.length) {
                                searchResultBox.classList.remove('hidden');
                            }
                        });

                        const searchResultBox = document.createElement("div");
                        searchResultBox.id = "historyItemSearchResultBox";
                        searchResultBox.classList.add("hidden");
                        
                        searchBox.appendChild(searchResultBox);

                    }
                    marketHolder.appendChild(searchBox);

                    if (unsafeWindow.historyScreen == 'list') {

                        marketHolder.appendChild(filterBox);
                        unsafeWindow.document.getElementById('filterActionType').oncustomselect = function (event) {
                            if (event.cause == 'init') {
                                return;
                            }
                            
                            HISTORY.filters.type = event.value;
    
                            // loadMarket();
                        }
    
                        unsafeWindow.document.getElementById('filterMinDate').addEventListener('change', function () {
                            // console.log('min date change');
                            // console.log(this.value);
                            let value = this.value || null;
    
                            if (value) {
                                // Convert yyyy-mm-dd to timestamp like from Date.now()
                                value = new Date(value).getTime();
                            }
    
                            HISTORY.filters.minDate = value;
                        });
    
                        unsafeWindow.document.getElementById('filterMaxDate').addEventListener('change', function () {
                            // console.log('max date change');
                            // console.log(this.value);
                            let value = this.value || null;
    
                            if (value) {
                                // Convert yyyy-mm-dd to timestamp like from Date.now()
                                value = new Date(value).getTime();
                            }
    
                            HISTORY.filters.maxDate = value;
                        });
    
                        unsafeWindow.document.getElementById('filterGo').addEventListener('click', async function () {
                            if (this.disabled) {
                                return;
                            }
    
                            this.disabled = true;
                            
                            await HISTORY.saveFilters();
                            
                            loadMarket();
                        });
                    }

                    initHistorySelects();
                    // Add history navbar below
    
                    switch (unsafeWindow.historyScreen) {
                        case 'list':
                            listBtn.disabled = true;

                            let historyEntries = HISTORY.getFilteredEntries();
                            
                            
                            const boxLabels = document.createElement("div");
                            boxLabels.id = "historyLabels";
                            boxLabels.innerHTML = `
                                <span>Item Name</span>
                                <span style='position: absolute; left: 208px; width: 80px; width: max-content;'>Type</span>
                                <span style='position: absolute; left: 320px; width: max-content;'>Price</span>
                                <span style='position: absolute; left: 480px; width: 70px; width: max-content;'>Datetime</span>
                            `;
                            boxLabels.classList.add("opElem");
                            boxLabels.style.top = "141px";
                            boxLabels.style.left = "26px";

                            const insertBtn = document.createElement("button");
                            insertBtn.id = "historyInsertBtn";
                            insertBtn.classList.add("opElem");
                            insertBtn.style.top = "80px";
                            insertBtn.style.right = "20px";
                            insertBtn.innerText = 'Create new entry';
                            insertBtn.addEventListener('click', function () {
                                if (pageLock) return;
                                if (!HISTORY.selectedItem) {
                                    alert('Please select an item first to create an entry of');
                                    searchInput?.focus();
                                    return;
                                }
                                HISTORY.renderEntryFormPrompt({
                                    item: HISTORY.selectedItem,
                                });
                            });

                            marketHolder.appendChild(insertBtn);


                            const historyResultsText = document.createElement("div");
                            historyResultsText.id = "historyResultsText";
                            historyResultsText.classList.add("opElem");
                            historyResultsText.style.top = "80px";
                            historyResultsText.style.left = "20px";
                            // historyResultsText.style.width = "100%";
                            historyResultsText.innerText = historyEntries.length + ' result' + (historyEntries.length == 1 ? '' : 's') + ' found';
            
                            const historyItemDisplay = document.createElement("div");
                            historyItemDisplay.id = "historyItemDisplay";
                            historyItemDisplay.classList.add("marketDataHolder");
                            historyItemDisplay.setAttribute('data-offset', 0);
                            historyItemDisplay.setAttribute('data-per-page', 20);
                            
                            const renderHistoryItems = function () {
                                const offset = parseInt(historyItemDisplay.getAttribute('data-offset'));
                                const perPage = parseInt(historyItemDisplay.getAttribute('data-per-page'));
        
                                const entryCount = historyEntries.length;
        
                                if (offset >= entryCount) {
                                    return false;
                                }
                                
                                for(let i = 0; i < perPage; i++) {
                                    const entryIndex = entryCount - offset - i - 1;
                                    const entry = historyEntries[entryIndex] || null;
                                    // const entryIndex = i + offset;
                                    // const entry = historyEntries[entryIndex] || null;
                                    if (!entry) {
                                        continue;
                                    }
                                    const isPending = HISTORY.cache.pending_trade_ids.includes(entry.trade_id);
                                    
                                    // if (isPending) {
                                    //     continue;
                                    // }
        
                                    // <div class="fakeItem" data-type="avalanchemg14_stats777" data-quantity="1" data-price="53000000"><div class="itemName cashhack credits" data-cash="Avalanche MG14">Avalanche MG14</div> <span style="color: #c0c0c0;">(AC)</span><div class="tradeZone">Outpost</div><div class="seller">ScarHK</div><div class="salePrice" style="color: red;">$53,000,000</div><button disabled="" data-action="buyItem" data-item-location="1" data-buynum="350533865">buy</button></div>
                                    const row = document.createElement("div");
                                    row.classList.add("fakeItem");
                                    if (isPending) {
                                        row.classList.add("pending");
                                    }
                                    row.setAttribute("data-type", entry.item || 'broken');
                                    row.setAttribute("data-quantity", entry.quantity || 1);
                                    row.setAttribute("data-price", entry.price || 0);
                                    row.setAttribute("data-trade-id", entry.trade_id);

                                    row.addEventListener('click', function () {
                                        if (pageLock) return;

                                        const type = this.getAttribute('data-type');
                                        if (type == 'broken') {
                                            alert('Entry is broken, contact Runon with this data: ' + JSON.stringify(entry));

                                            if (confirm('Remove this entry instead?')) {
                                                // const tradeId = this.getAttribute('data-trade-id');
                                                HISTORY.removeTrade(entryIndex, true);
                                                loadMarket();
                                            }

                                            return;
                                        }

                                        const tradeId = this.getAttribute('data-trade-id');
                                        let trade = HISTORY.cache.trade_id[tradeId];
                                        if (!trade) {
                                            trade = HISTORY.entries.find(trade => trade.trade_id == tradeId);
                                        }

                                        if (!trade) {
                                            alert('Could not find trade in cache or entries (ID: ' + tradeId + ')');
                                            return;
                                        }

                                        HISTORY.renderEntryPrompt(trade);
                                    });

        
                                    let afterName = entry.item ? calcMCTag(entry.item, false, "span", "") || '' : '';
        
                                    const itemId = entry.item ? getGlobalDataItemId(entry.item) : 'broken';
                                    const itemCat = entry.item ? getItemType(unsafeWindow.globalData[itemId]) : null;
                                    if (itemCat == 'ammo') {
                                        afterName += ' <span>(' + entry.quantity + ')</span>';
                                    }
                                    const displayPrice = formatMoney(entry.price || 0, {showFree: true});
                                    
                                    row.innerHTML = `
                                        <div class="itemName cashhack credits" data-cash="${entry.itemname}">${entry.itemname}</div>
                                        ${afterName}
                                        <div class="tradeType">${entry.action}</div>
                                        <div class="salePrice">${displayPrice}</div>
                                        <div class="saleDate">${formatDate(new Date(entry.date))}</div>
                                    `;
                                    // row.innerHTML = "<div class='itemName cashhack credits' data-cash='" + entry.itemname + "'>" + entry.itemname + "</div><div class='tradeZone'>" + entry.trade_zone + "</div><div class='seller'>" + entry.member_name + "</div><div class='salePrice' style='color: red;'>$" + entry.price + "</div>";
                                    historyItemDisplay.appendChild(row);
                                }
        
                                return true;
                            };
                            
                            const onHistoryScroll = function () {
                                const fullScrollHeight = historyItemDisplay.scrollHeight;
                                const scrolledHeight = historyItemDisplay.scrollTop + historyItemDisplay.clientHeight;
                                const diff = fullScrollHeight - scrolledHeight;
        
                                if (diff > 50) {
                                    return;
                                }
        
                                const perPage = parseInt(historyItemDisplay.getAttribute('data-per-page'));
                                historyItemDisplay.removeEventListener('scroll', onHistoryScroll);
                                historyItemDisplay.setAttribute('data-offset', parseInt(historyItemDisplay.getAttribute('data-offset')) + perPage);
                                const hasMore = renderHistoryItems();
                                if (hasMore) {
                                    historyItemDisplay.addEventListener('scroll', onHistoryScroll);
                                }
                            };
        
                            marketHolder.appendChild(historyItemDisplay);
                            marketHolder.appendChild(boxLabels);
                            marketHolder.appendChild(historyResultsText);
            
                            await HISTORY.load();
                            // retrieve current user's pending trades
                            await new Promise(resolve => {
                                const now = Date.now();
                                const lastCheck = WEBCALL_HOOKS.lastExecutedAt.trade_search || 0;

                                // Check if last check was less than 30 seconds ago
                                if (lastCheck && (now - lastCheck) < 30000) {
                                    resolve();
                                    return;
                                }

                                var dataArray = {};
        
                                dataArray["pagetime"] = userVars["pagetime"];
                                dataArray["tradezone"] = "";
                                dataArray["searchname"] = "";
                                dataArray["searchtype"] = "sellinglist";
                                dataArray["search"] = "trades";
                                dataArray["memID"] = userVars["userID"];
                                dataArray["category"] = "";
                                dataArray["profession"] = "";
                                
                                WEBCALL_HOOKS.lastExecutedAt.trade_search = now;

                                // Execute webCall
                                webCall("trade_search", dataArray, resolve, true);
                                // Cache will be updated by webCall hook somewhere else in the code
                            });
                            
                            renderHistoryItems();
                            historyItemDisplay.addEventListener('scroll', onHistoryScroll);
                            break;
                        case 'stats':
                            statsBtn.disabled = true;

                            // const filterBox = document.createElement("div");
                            // filterBox.id = "historyFilterArea";
                            // Filter box shows items that are added to search on
                            // But also a date range select
                            // filterBox.innerHTML =

                            // categorySelect += "<div style='display: inline-block; width: 260px;'>In Category:<br/><div id='categoryChoice' data-catname=''><span id='cat'>Everything</span><span id='dog' style='float: right;'>&#9668;</span></div>";
                            // <div class="historyDetailsText">Click on a trade to see more info</div>
                            const historyInfoBox = document.createElement("div");
                            historyInfoBox.id = "historyInfoBox";

                            if (HISTORY.selectedItem) {
                                const globalStatisticItem = unsafeWindow.globalData[getGlobalDataItemId(HISTORY.selectedItem)];
                                const isAmmo = globalStatisticItem.itemcat == 'ammo';
                                

                                const stackSize = maxStack(HISTORY.selectedItem);

                                const perNamer = function (amount) {
                                    let perName = 'item';
                                    if (isAmmo) {
                                        perName = 'round';
                                    }

                                    if (HISTORY.selectedItem == 'fuelammo') {
                                        return 'mL';
                                    }

                                    return perName + (amount == 1 ? '' : 's');
                                };
                                const perStackNamer = function (amount) {
                                    return 'stack' + (amount == 1 ? '' : 's');
                                };

                    
                                // === START OF STATS RENDER

                                // Title with timeframe
                                const timeframe = SETTINGS.values.hoverStatisticsTimeframe;

                                // Bought stats
                                const amountBought = HISTORY.getItemInfo(HISTORY.selectedItem, 'amount_bought');
                                const amountBoughtStacks = new Number(amountBought / stackSize).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2});

                                const totalPriceBought = HISTORY.getItemInfo(HISTORY.selectedItem, 'total_price_bought');
                                const avgPriceBought = HISTORY.getItemInfo(HISTORY.selectedItem, 'avg_price_bought');

              
                                // Sold stats
                                const amountSold = HISTORY.getItemInfo(HISTORY.selectedItem, 'amount_sold');
                                const amountSoldStacks = new Number(amountSold / stackSize).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 2});

                                const totalPriceSold = HISTORY.getItemInfo(HISTORY.selectedItem, 'total_price_sold');
                                const avgPriceSold = HISTORY.getItemInfo(HISTORY.selectedItem, 'avg_price_sold');

                                // Profit/Loss stats
                                const averageProfit = avgPriceSold - avgPriceBought;
                                const totalProfit = totalPriceSold - totalPriceBought;



                                const totalProfitItemCount = Math.min(amountSold, amountBought);
                                let totalRealProfit = 0;

                                if (totalProfitItemCount > 0) {
                                    totalRealProfit = (totalProfitItemCount * avgPriceSold) - (totalProfitItemCount * avgPriceBought);
                                }


                                const lastBoughtAt = HISTORY.getItemInfo(HISTORY.selectedItem, 'last_date_bought');
                                const lastBoughtFor = HISTORY.getItemInfo(HISTORY.selectedItem, 'last_price_bought');

                                const lastSoldAt = HISTORY.getItemInfo(HISTORY.selectedItem, 'last_date_sold');
                                const lastSoldFor = HISTORY.getItemInfo(HISTORY.selectedItem, 'last_price_sold');

                                // === END OF STATS RENDER

                                historyInfoBox.innerHTML = `
                                    <table>
                                        <tr class="row">
                                            <td>Amount bought</td>
                                            <td>
                                                <span style="color: #FFCC00;">${amountBought}</span> ${perNamer(amountBought)}
                                                ${isAmmo
                                                    ? `<br>≈ <span style="color: #FFCC00;">${amountBoughtStacks}</span> ${perStackNamer(amountBoughtStacks)}`
                                                    : ``
                                                }
                                            </td>
                                            <td>
                                                for ${formatMoneyHtml(totalPriceBought, true)} total
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>Amount sold</td>
                                            <td>
                                                <span style="color: #FFCC00;">${amountSold}</span> ${perNamer(amountSold)}
                                                ${isAmmo
                                                    ? `<br>≈ <span style="color: #FFCC00;">${amountSoldStacks}</span> ${perStackNamer(amountSoldStacks)}`
                                                    : ``
                                                }
                                            </td>
                                            <td>
                                                for ${formatMoneyHtml(totalPriceSold, true)} total
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>Average buy price</td>
                                            <td>
                                                ${formatMoneyHtml(avgPriceBought, true)} per ${perNamer(1)}
                                                ${isAmmo
                                                    ? `<br>${formatMoneyHtml(avgPriceBought * stackSize, true)} per ${perStackNamer(1)}`
                                                    : ``
                                                }
                                            </td>
                                            <td>
                                                
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>Average sell price</td>
                                            <td>
                                                ${formatMoneyHtml(avgPriceSold, true)} per ${perNamer(1)}
                                                ${isAmmo
                                                    ? `<br>${formatMoneyHtml(avgPriceSold * stackSize, true)} per ${perStackNamer(1)}`
                                                    : ``
                                                }
                                            </td>
                                            <td>
                                                
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>Average profit/loss</td>
                                            <td>
                                                ${formatMoneyHtml(averageProfit, {neutralColor: false, maximumFractionDigits: 4})} per ${perNamer(1)}
                                                ${isAmmo
                                                    ? `<br>${formatMoneyHtml(averageProfit * stackSize, {neutralColor: false, maximumFractionDigits: 4})} per ${perStackNamer(1)}`
                                                    : ``
                                                }
                                            </td>
                                            <td>
                                                ${SETTINGS.values.countScraps
                                                    ? '(With scraps)'
                                                    : '(Without scraps)'
                                                }
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>Real total profit/loss</td>
                                            <td>
                                                ${formatMoneyHtml(totalRealProfit, false)}
                                            </td>
                                            <td>
                                                (Based on <span style="color: #FFCC00;">${totalProfitItemCount}</span> buys & sells)
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>Total profit/loss</td>
                                            <td>
                                                ${formatMoneyHtml(totalProfit, false)}
                                            </td>
                                            <td>
                                                (Based on <span style="color: #FFCC00;">${amountBought}</span> buys, <span style="color: #FFCC00;">${amountSold}</span> sells)
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>Last bought</td>
                                            <td>
                                                ${lastBoughtAt
                                                    ? `at <span style="color: #FFCC00;">${formatDate(new Date(lastBoughtAt))}</span>`
                                                    : `Never bought`
                                                }
                                            </td>
                                            <td>
                                                ${lastBoughtFor
                                                    ? `for ${formatMoneyHtml(lastBoughtFor, true)}`
                                                    : ``
                                                }
                                            </td>
                                        </tr>
                                        <tr class="row">
                                            <td>Last sold</td>
                                            <td>
                                                ${lastSoldAt
                                                    ? `at <span style="color: #FFCC00;">${formatDate(new Date(lastSoldAt))}</span>`
                                                    : `Never sold`
                                                }
                                            </td>
                                            <td>
                                                ${lastSoldFor
                                                    ? `for ${formatMoneyHtml(lastSoldFor, true)}`
                                                    : ``
                                                }
                                            </td>
                                        </tr>

                                    </table>
                                `;


                            } else {
                                historyInfoBox.innerHTML = `
                                    <div class="historyDetailsContainer">
                                        <div class="historyDetailsText">Search for an item to see its statistics</div>
                                    </div>
                                `;
                            }


                            // marketHolder.appendChild(filterBox);
                            marketHolder.appendChild(historyInfoBox);

                            break;
                    }
                    
                    promptEnd();
                    break;
            }
        })();
    }

    function initHistorySelects() {

        const historySelectComponents = document.getElementsByClassName('historySelectComponent');
    
        for(const historySelectComponent of historySelectComponents) {
            if (historySelectComponent.dataset.init) {
                continue;
            }
    
            const initValue = historySelectComponent.dataset.value;
            const choiceElem = historySelectComponent.getElementsByClassName('selectChoice')[0];
            const [name, dog] = choiceElem.children;
            dog.textContent = '◄';
            const listElem = historySelectComponent.getElementsByClassName('selectList')[0];
    
            const options = listElem.children;
            listElem.style.display = 'none';
    
            const selectOption = function (value, isInit = false) {
                const eventObject = {
                    target: historySelectComponent,
                    value: value,
                    canceled: false,
                    cause: isInit ? 'init' : 'change',
                };

                if (historySelectComponent.oncustomselect) {
                    historySelectComponent.oncustomselect(eventObject);
                }

                if (eventObject.canceled) {
                    return;
                }

                historySelectComponent.dataset.value = value;
    
                const label = Array.from(options).find(option => option.dataset.value == value)?.textContent;
    
                name.textContent = label;
            };
    
            const toggleSelect = function () {
                const display = listElem.style.display;
                const isHidden = display == 'none';
    
                if (isHidden) {
                    listElem.style.display = 'block';
                    dog.textContent = '▼';
                } else {
                    listElem.style.display = 'none';
                    dog.textContent = '◄';
                }
            };
    
            choiceElem.addEventListener('click', toggleSelect);
    
            for(const option of options) {
                option.addEventListener('click', function () {
                    const value = this.dataset.value;
                    selectOption(value);
                    toggleSelect();
                });
            }
    
            if (initValue) {
                selectOption(initValue, true);
            }

            historySelectComponent.dataset.init = true;
        }
    }

    /******************************************************
     * Styles
     ******************************************************/
    // GM_addStyle_object('#marketplace', {});
    GM_addStyle_object('.cashhack.cashhack-relative', {
        '$ &:before': {
            position: 'relative',
        },
        position: 'relative',
    });

    GM_addStyle_object('.historyInfoContainer', {
        textAlign: 'left',
    });

    GM_addStyle_object('#marketplace #historySettings', {
        position: 'absolute',
        top: '5px',
        right: '5px',
        width: '20px',
        height: '20px',
        backgroundImage: 'url(../images/df_gear.png)',
        backgroundSize: 'cover',
        cursor: 'pointer',
    });

    GM_addStyle_object('#marketplace #historyItemDisplay', {
        top: '155px',
        bottom: '110px',
    });
    GM_addStyle_object('.historyEntryForm', {
        '$ & input::placeholder': {
            color: 'rgba(255, 255, 0, 0.3)',
        },
    });

    GM_addStyle_object('#marketplace #historySearchArea', {
        position: 'absolute',
        top: '100px',
        left: '20px',
        // right: '80px',
        height: '16px',
        width: '250px',
        padding: '8px',
        border: '1px #990000 solid',
        textAlign: 'left',
        backgroundColor: 'rgba(0,0,0,0.8)',

        '$ & #historySearchField::placeholder': {
            color: 'rgba(255, 255, 0, 0.3)',
        },
        
        '$ & #historyItemSearchResultBox': {
            position: 'absolute',
            // top: '184px',
            width: '250px',
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '4px',
            border: '1px #990000 solid',
            textAlign: 'left',
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: '100',

            '$ &.hidden': {
                display: 'none',
            },
        },
    });
    GM_addStyle_object('#marketplace #historyFilterArea', {
        position: 'absolute',
        top: '100px',
        left: '290px',
        right: '20px',
        height: '16px',
        padding: '8px',
        border: '1px #990000 solid',
        textAlign: 'left',
        backgroundColor: 'rgba(0,0,0,0.8)',

        '$ & #filterMinDate': {
            left: '110px',
        },
        '$ & #filterMaxDate': {
            left: '210px',
        },
        '$ & #filterGo': {
            left: '310px',
        },
    });

    GM_addStyle_object('#marketplace #historyInfoBox', {
        position: 'absolute',
        overflowY: 'auto',
        top: '141px',
        left: '20px',
        right: '20px',
        bottom: '110px',
        // padding: '8px',
        border: '1px #990000 solid',
        textAlign: 'left',
        backgroundColor: 'rgba(0,0,0,0.8)',

        '$ & .historyDetailsContainer': {
            fontSize: '14px',
            width: '100%',
            height: '100%',
            '$ & .historyDetailsText': {
                margin: '0',
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                textAlign: 'center',
                transform: 'translateY(-50%) translateX(-50%)',
            }
        },

        '$ & table': {
            fontSize: '12px',
            fontFamily: '"Courier New", "Arial"',
            lineHeight: '1',
            width: '100%',
            borderCollapse: 'collapse',

            // Table is full width, but only the last td takes up as much space, the rest is just as wide as the content
            '$ & td': {
                width: '1%',
                whiteSpace: 'nowrap',
                // padding: '4px',
                //padding x is 4px, padding y is 2px
                padding: '0px 4px',
                // border: '1px #990000 solid',
                textAlign: 'left',
                height: '32px',

                '$ &:first-child': {
                    width: '200px',
                },
                '$ &:last-child': {
                    width: '100%',
                },
            },


            '$ & tr': {
                borderBottom: '1px #990000 solid',
                '$ &.row:hover': {
                    backgroundColor: 'rgba(125, 0, 0, 0.4)',
                },
            },
        },

    });

    GM_addStyle_object('#marketplace #historyItemDisplay .fakeItem', {
        paddingLeft: '6px',
        fontSize: '9pt',
        height: '16px',
        cursor: 'pointer',
        userSelect: 'none',

        '$ &.pending': {
            opacity: '0.5',
        },
        '$ &:hover': {
            backgroundColor: 'rgba(125, 0, 0, 0.8)',
        },
        '$ & > div': {
            display: 'inline-block',
            position: 'relative',
        },
        '$ & .tradeType': {
            position: 'absolute',
            left: '214px',
            color: '#00FF00',
        },
        '$ & .salePrice': {
            position: 'absolute',
            left: '326px',
            color: '#FFCC00',
        },
        '$ & .saleDate': {
            position: 'absolute',
            left: '486px',
        },
    });

    GM_addStyle_object('#marketplace #selectHistoryCategory', {
        position: 'absolute',
        width: '100%',
        top: '70px',
        fontSize: '12pt',

        '$ & button': {
            width: '120px',
        },
    });

    GM_addStyle_object('.historySelectComponent', {
        position: 'relative',
        '$ & .selectChoice': {
            position: 'absolute',
            cursor: 'pointer',
            width: '80px',
            display: 'inline-block',
            textAlign: 'center',
            backgroundColor: '#222',
            border: '1px solid #990000',

            '$ & span:last-child': {
                position: 'absolute',
                right: '0',
            },

        },
        '$ & .selectList': {
            position: 'absolute',
            display: 'none',
            position: 'absolute',
            zIndex: '10',
            top: '18px',
            width: '80px',
            // overflowY: 'auto',
            // left: '193px',
            backgroundColor: '#111',
            // borderLeft: '1px solid #990000',
            border: '1px solid #990000',
            textAlign: 'center',

            '$ & div': {
                cursor: 'pointer',
                '$ &:hover': {
                    backgroundColor: '#333',
                },
            },

        },
    });

    GM_addStyle_object('#selectedItemsWrapper', {
        width: '200px',
        top: '8px',
        left: '40px',

        '$ & .historySelectComponent': {
            width: '100%',

            '$ & .selectChoice': {
                width: '100%',
            },
            '$ & .selectList': {
                width: '100%',
            },
        },
    });

    GM_addStyle_object('#filterActionTypeWrapper', {
        width: '100px',
        // top: '8px',
        // left: '40px',

        '$ & .historySelectComponent': {
            width: '100%',

            '$ & .selectChoice': {
                width: '100%',
            },
            '$ & .selectList': {
                width: '100%',
            },
        },
    });

    
    /******************************************************
     * DF Function Overrides
     ******************************************************/

    // Source: market.js
    // Explanation:
    // Allows this script to add a 'history' tab seemlessly into the marketplace
    // This approach should make it still compatible with other userscripts and official site scripts.
    const origLoadMarket = unsafeWindow.loadMarket;
    unsafeWindow.loadMarket = function() {
        console.log('override loadmarket');
        // Execute original function
        origLoadMarket.apply(unsafeWindow, arguments);

        injectHistoryTabIntoMarketplace();
    };

    // Source: base.js
    // Explanation:
    // Allows this script to hook into before and after the callback of webCall.
    // Which prevents us having to do extra requests while still getting the data we need
    // The less requests, the better.
    // Plus DeadFrontier's webCalls are executed at exactly the right moments we need (like after selling)
    // This approach should make it still compatible with other userscripts and official site scripts.
    const originalWebCall = unsafeWindow.webCall;
    unsafeWindow.webCall = function (call, params, callback, hashed) {
        // Override the callback function to execute any hooks
        // This still executes the original callback function, but with our hooks
        const callbackWithHooks = function(data, status, xhr) {
            const dataObj = stringExplode(data)
            const response = stringExplode(xhr.responseText);

            // Call all 'before' hooks
            if (WEBCALL_HOOKS.before.hasOwnProperty(call)) {
                // Copy the array, incase that hooks remove themselves during their execution
                const beforeHooks = WEBCALL_HOOKS.before[call].slice();

                for (const beforeHook of beforeHooks) {
                    beforeHook(
                        {
                            call,
                            params,
                            callback,
                            hashed,
                        },
                        {
                            dataObj,
                            response,
                            data,
                            status,
                            xhr,
                        }
                    );
                }
            }

            // Call all 'beforeAll' hooks
            const beforeAllHooks = WEBCALL_HOOKS.beforeAll.slice();
            for (const beforeAllHook of beforeAllHooks) {
                beforeAllHook(
                    {
                        call,
                        params,
                        callback,
                        hashed,
                    },
                    {
                        dataObj,
                        response,
                        data,
                        status,
                        xhr,
                    }
                );
            }
            
            // Execute the original callback
            const result = callback.call(unsafeWindow, data, status, xhr);

            // Call all 'after' hooks
            if (WEBCALL_HOOKS.after.hasOwnProperty(call)) {

                // Copy the array, incase that hooks remove themselves during their execution
                const afterHooks = WEBCALL_HOOKS.after[call].slice();

                for (const afterHook of afterHooks) {
                    afterHook(
                        {
                            call,
                            params,
                            callback,
                            hashed,
                        },
                        {
                            dataObj,
                            response,
                            data,
                            status,
                            xhr,
                        },
                        result
                    );
                }
            }

            // Call all 'afterAll' hooks
            const afterAllHooks = WEBCALL_HOOKS.afterAll.slice();
            for (const afterAllHook of afterAllHooks) {
                afterAllHook(
                    {
                        call,
                        params,
                        callback,
                        hashed,
                    },
                    {
                        dataObj,
                        response,
                        data,
                        status,
                        xhr,
                    },
                    result
                );
            }

            // Return the original callback result
            // As far as I see in the source code, the callbacks never return anything, but its cleaner to return it anyway
            return result;
        };

        // Call the original webCall function, but with our hooked callback function
        return originalWebCall.call(unsafeWindow, call, params, callbackWithHooks, hashed);
    };

    // Bugfix for DeadFrontier code
    const origAllowedInfoCard = unsafeWindow.allowedInfoCard;
    unsafeWindow.allowedInfoCard = function (elem) {
        if(elem && typeof elem.classList !== "undefined" && (elem.classList.contains("item") || elem.classList.contains("fakeItem") || elem.parentNode?.classList.contains("fakeItem")))
        {
            return true;
        } else
        {
            return false;
        }
    }
    
    // Source: inventory.js
    // Explanation:
    // Allows this script to hook into the infoCard function, which is used to display item info when hovering over an item
    // This approach makes it still compatible with SilverScript's HoverPrices
    var origInfoCard = unsafeWindow.infoCard || null;
    if (origInfoCard) {
        inventoryHolder.removeEventListener("mousemove", origInfoCard, false);
 
        unsafeWindow.infoCard = function (e) {
            // infoBox.style.color = '';
            
            //Remove previous history info
            let elems = document.getElementsByClassName("historyInfoContainer");
            for(var i = elems.length - 1; i >= 0; i--) {
                elems[i].parentNode.removeChild(elems[i]);
            }
            elems = document.getElementsByClassName("historyShiftNotice");
            for(var i = elems.length - 1; i >= 0; i--) {
                elems[i].parentNode.removeChild(elems[i]);
            }

            // Call the original infoCard function
            origInfoCard(e);
            if(active || pageLock || !allowedInfoCard(e.target)) {
                return;
            }
 
            var target;
            if(e.target.parentNode.classList.contains("fakeItem"))
            {
                target = e.target.parentNode;
            } else
            {
                target = e.target;
            }
            
            // if (!wasHidden) {
            //     return;
            // }
            
            // Used in the history tab
            if (target.classList.contains('pending')) {
                const container = document.createElement('div');
                // container.className = 'itemData historyInfoContainer';
                container.classList.add('itemData');
                container.classList.add('historyInfoContainer');
                container.style.color = '#FFCC00';
                container.style.marginTop = 'auto';
                container.innerHTML = 'This sale is still pending';
                infoBox.appendChild(container);
            }

            if (target.classList.contains('item') && SETTINGS.values.hoverEnabled) {
                HOVER_INFOBOX_DATA.event = e;

                if (SETTINGS.values.shiftHoverMode !== 'disabled') {
                    const shiftHoverStyle = document.createElement('style');
                    shiftHoverStyle.classList.add('historyInfoContainer'); // Will be removed when infoCard is called again
                    if (SETTINGS.values.shiftHoverMode == 'history') {
                        const classNameToHide = e.shiftKey ? 'silverStats' : 'historyData';
                        shiftHoverStyle.innerHTML = '.' + classNameToHide + ' { display: none; }';
                    }
                    if (SETTINGS.values.shiftHoverMode == 'silverscripts') {
                        const classNameToHide = e.shiftKey ? 'historyData' : 'silverStats';
                        shiftHoverStyle.innerHTML = '.' + classNameToHide + ' { display: none; }';
                    }
                    infoBox.appendChild(shiftHoverStyle);
                }

                const infoContainer = document.createElement('div');
                const isAmmo = target.dataset.itemtype == 'ammo';
                const item = target.dataset.type;
                const quantity = parseInt(target.dataset.quantity);
                infoContainer.classList.add('historyInfoContainer');
                infoContainer.classList.add('itemData');
                infoContainer.classList.add('historyData');
                let infoText = '';

                const perNamer = function (amount) {
                    let perName = 'unit';
                    if (isAmmo) {
                        perName = 'round';
                    }

                    if (item == 'fuelammo') {
                        return 'mL';
                    }

                    return perName + (amount == 1 ? '' : 's');
                };
                
                if (SETTINGS.values.hoverAvgBuyPriceEnabled) {
                    const avgPriceBought = HISTORY.getItemInfo(target.dataset.type, 'avg_price_bought');
                    infoText += 'Average buy price: ' + formatMoneyHtml(avgPriceBought, true) + '/' + perNamer(1);
                    if (isAmmo) {
                        infoText += ', ' + formatMoneyHtml(avgPriceBought * quantity, true) + '/stack(' + quantity + ')';
                    }
                    infoText += '<br>';
                }
                if (SETTINGS.values.hoverAvgSellPriceEnabled) {
                    const avgPriceSold = HISTORY.getItemInfo(target.dataset.type, 'avg_price_sold');
                    infoText += 'Average sell price: ' + formatMoneyHtml(avgPriceSold, true) + '/' + perNamer(1);
                    if (isAmmo) {
                        infoText += ', ' + formatMoneyHtml(avgPriceSold * quantity, true) + '/stack(' + quantity + ')';
                    }
                    infoText += '<br>';
                }
                if (SETTINGS.values.hoverAmountBoughtEnabled) {
                    const amountBought = HISTORY.getItemInfo(target.dataset.type, 'amount_bought');
                    infoText += 'Amount bought: ' + amountBought + '<br>';
                }
                if (SETTINGS.values.hoverAmountSoldEnabled) {
                    const amountSold = HISTORY.getItemInfo(target.dataset.type, 'amount_sold');
                    infoText += 'Amount sold: ' + amountSold + '<br>';
                }
                if (SETTINGS.values.hoverLastBuyPriceEnabled) {
                    const lastBuyPrice = HISTORY.getItemInfo(target.dataset.type, 'last_price_bought');
                    if (isAmmo) {
                        const lastBuyQuantity = HISTORY.getItemInfo(target.dataset.type, 'last_quantity_bought');
                        const lastBuyPerRound = lastBuyPrice === null ? null : (lastBuyPrice / lastBuyQuantity);
                        const lastBuyPerStack = lastBuyPrice === null ? null : (lastBuyPerRound * quantity);
                        infoText += 'Last bought for: ' + (lastBuyPerRound === null ? 'Never bought' : formatMoneyHtml(lastBuyPerRound, true) + '/round, ' + formatMoneyHtml(lastBuyPerStack, true) + '/stack(' + quantity + ')') + '<br>';
                    } else {
                        infoText += 'Last bought for: ' + (lastBuyPrice === null ? 'Never bought' : formatMoneyHtml(lastBuyPrice, true)) + '<br>';
                    }
                }
                if (SETTINGS.values.hoverLastSellPriceEnabled) {
                    const lastSellPrice = HISTORY.getItemInfo(target.dataset.type, 'last_price_sold');
                    if (isAmmo) {
                        const lastSellQuantity = HISTORY.getItemInfo(target.dataset.type, 'last_quantity_sold');
                        const lastSellPerRound = lastSellPrice === null ? null : (lastSellPrice / lastSellQuantity);
                        const lastSellPerStack = lastSellPrice === null ? null : (lastSellPerRound * quantity);
                        infoText += 'Last sold for: ' + (lastSellPerRound === null ? 'Never sold' : formatMoneyHtml(lastSellPerRound, true) + '/round, ' + formatMoneyHtml(lastSellPerStack, true) + '/stack(' + quantity + ')') + '<br>';
                    } else {
                        infoText += 'Last sold for: ' + (lastSellPrice === null ? 'Never sold' : formatMoneyHtml(lastSellPrice, true)) + '<br>';
                    }
                }
                if (SETTINGS.values.hoverAvgProfitEnabled) {
                    const avgPriceSold = HISTORY.getItemInfo(target.dataset.type, 'avg_price_sold');
                    const avgPriceBought = HISTORY.getItemInfo(target.dataset.type, 'avg_price_bought');
                    const avgProfit = avgPriceSold - avgPriceBought;
                    infoText += 'Average profit/loss: ' + formatMoneyHtml(avgProfit, false) + '/' + perNamer(1);
                    if (isAmmo) {
                        const avgProfitStack = avgProfit * quantity;
                        infoText += ', ' + formatMoneyHtml(avgProfitStack, false) + '/stack(' + quantity + ')';
                    }
                    infoText += '<br>';
                }
                

                if (infoText.trim()) {
                    infoText = '<div style="text-decoration: underline; text-align: center;">History Data</div>' + infoText;
                }

                if (SETTINGS.values.hoverEnabled && SETTINGS.values.shiftHoverMode == 'silverscripts' && !e.shiftKey && silverScriptsInstalled) {
                    infoText += '<div style="text-decoration: underline; font-size: 8pt;">Hold SHIFT to show SilverScript\'s HoverPrices</div>'
                }
                if (SETTINGS.values.hoverEnabled && SETTINGS.values.shiftHoverMode == 'history' && !e.shiftKey) {
                    const historyShiftNotice = document.createElement('div');
                    historyShiftNotice.classList.add('historyShiftNotice');
                    historyShiftNotice.innerHTML = '<div style="text-decoration: underline; font-size: 8pt;">Hold SHIFT to show History Data</div>'

                    infoBox.appendChild(historyShiftNotice);
                }

                infoContainer.innerHTML = infoText;
                infoBox.appendChild(infoContainer);
            }

        }.bind(unsafeWindow);
 
        inventoryHolder.addEventListener("mousemove", unsafeWindow.infoCard, false);
    }

    // Source: market.js
    var origSellMenuItemPopulate = unsafeWindow.SellMenuItemPopulate;
    unsafeWindow.SellMenuItemPopulate = function (itemElem) {
        // Call original function
        origSellMenuItemPopulate(itemElem);
    };

    /******************************************************
     * Webcall hooks
     ******************************************************/

    // Hook into when an item is sold
    onBeforeWebCall('inventory_new', function (request, response) {
        if (request.params.action !== 'newsell') {
            return;
        }
        if (response.xhr.status != 200) {
            return;
        }
        // if (!response.dataObj.hasOwnProperty('OK') && response.dataObj.done != '1') {
        //     return;
        // }
        
        // When the sell is successful, DeadFrontier will do a new webCall to retrieve the new sell listing
        // We hook ONCE into this webCall, to retrieve the trade id
        const onSellSuccess = function (request, response) {
            if (response.xhr.status == 200) {
                HISTORY.onSellItem(request, response);
            }
            
            // Remove self from hook
            offAfterWebCall('trade_search', onSellSuccess);
        };
        
        // Hook into the new sell listing webCall
        onAfterWebCall('trade_search', onSellSuccess);
    });

    // Hook into when credits are sold
    onBeforeWebCall('inventory_new', function (request, response) {
        if (request.params.action !== 'newsellcredits') {
            return;
        }
        if (response.xhr.status != 200) {
            return;
        }
        // if (!response.dataObj.hasOwnProperty('OK') && response.dataObj.done != '1') {
        //     return;
        // }

        // When the sell is successful, DeadFrontier will do a new webCall to retrieve the new sell listing
        // We hook ONCE into this webCall, to retrieve the trade id
        const onSellSuccess = function (request, response) {
            if (response.xhr.status == 200) {
                HISTORY.onSellItem(request, response);
            }

            // Remove self from hook
            offAfterWebCall('trade_search', onSellSuccess);
        };

        // Hook into the new sell listing webCall
        onAfterWebCall('trade_search', onSellSuccess);
    });

    // Hook into when an item is bought
    onAfterWebCall('inventory_new', function (request, response) {
        if (request.params.action !== 'newbuy') {
            return;
        }
        if (response.xhr.status != 200) {
            return;
        }
        if (!response.dataObj.hasOwnProperty('OK')) {
            return;
        }

        const dataObj = {};

        for(const key in response.dataObj) {
            if (key.indexOf('df_inv') !== 0) {
                continue;
            }

            dataObj[key.replace(/^df_inv\d+_/, '')] = response.dataObj[key];
        }
        
        const entry = {
            trade_id: request.params.buynum,
            action: 'buy',
            price: request.params.expected_itemprice,
            item: dataObj.type,
            itemname: unsafeWindow.itemNamer(dataObj.type, dataObj.quantity),
            quantity: dataObj.quantity, 
        };

        HISTORY.pushTrade(entry);
    });

    // Hook into when an item is scrapped
    onBeforeWebCall('inventory_new', function (request, response) {
        if (request.params.action !== 'scrap') {
            return;
        }
        if (response.xhr.status != 200) {
            return;
        }
        if (!response.dataObj.hasOwnProperty('OK')) {
            return;
        }

        const itemnum = request.params.itemnum;
        const quantity = unsafeWindow.userVars['DFSTATS_df_inv' + itemnum + '_quantity'];
        const itemTypeId = unsafeWindow.userVars['DFSTATS_df_inv' + itemnum + '_type'];

        if (!itemTypeId) {
            const logData = {
                price: request.params.price,
                item: request.params.expected_itemtype,
                itemnum,
                itemTypeId,
                quantity,
            };
            alert('Error: Could not find item type id for scrapped item\n\nContact Runonstof with this data: ' + JSON.stringify(logData));
            alert('You can also check the console (F12) for the data to share with Runonstof');
            console.info(JSON.stringify(logData, null, 2));
            console.info('Only share above data with Runonstof');
            return;
        }

        const entry = {
            trade_id: hash(objectJoin(request.params)),
            action: 'scrap',
            price: request.params.price,
            item: request.params.expected_itemtype,
            itemname: unsafeWindow.itemNamer(itemTypeId, quantity),
            quantity,
        };

        HISTORY.pushTrade(entry);
    });

    // Hook into when a sale is canceled
    onAfterWebCall('inventory_new', function (request, response) {
        if (request.params.action !== 'newcancelsale') {
            return;
        }
        if (response.xhr.status != 200) {
            return;
        }
        const tradeId = request.params.buynum;
        HISTORY.removeTrade(tradeId);
    });

    // Update 'pending sales' trade cache
    onAfterWebCall('trade_search', function (request, response) {
        if (response.xhr.status != 200) {
            return;
        }
        const tradeCount = response.dataObj.tradelist_totalsales;
        if (tradeCount == 0) {
            return;
        }

        const pendingTradeIds = [];
        for(let i = 0; i < tradeCount; i++) {
            const tradeId = response.dataObj['tradelist_' + i + '_trade_id'];
            pendingTradeIds.push(tradeId);
        }

        HISTORY.cache.pending_trade_ids = pendingTradeIds;
    });
    
    
    /******************************************************
     * Await Page Initialization
     ******************************************************/
    console.log('awaiting page initialization');
    // A promise that resolves when document is fully loaded and globalData is filled with stackables
    // This is because DeadFrontier does a request to stackables.json, which is needed for the max stack of items
    // Only after this request is done, globalData will contain ammo with a max_quantity
    await new Promise(resolve => {
        if (unsafeWindow.globalData.hasOwnProperty('32ammo')) {
            resolve();
            return;
        }

        // This is the original function that is called when the stackables.json request is done
        const origUpdateIntoArr = unsafeWindow.updateIntoArr;
        unsafeWindow.updateIntoArr = function (flshArr, baseArr) {
            // Execute original function
            origUpdateIntoArr.apply(unsafeWindow, [flshArr, baseArr]);

            // Check if globalData is filled with stackables
            if (unsafeWindow.globalData != baseArr) {
                return;
            }

            // revert override, we dont need it anymore
            unsafeWindow.updateIntoArr = origUpdateIntoArr;
            resolve();
        }
    });

    /******************************************************
     * Script Initialization
     ******************************************************/

    SEARCHABLE_ITEMS = Object.keys(unsafeWindow.globalData)
        .filter(itemId => !['brokenitem', 'undefined'].includes(itemId) && unsafeWindow.globalData[itemId].no_transfer != '1');

    SEARCHABLE_ITEMS.forEach(itemId => {
            const item = unsafeWindow.globalData[itemId];
            if (!item.needcook || item.needcook != '1') {
                return;
            }

            SEARCHABLE_ITEMS.push(itemId + '_cooked');
        });

    unsafeWindow.SEARCHABLE_ITEMS = SEARCHABLE_ITEMS;
    
    // Load History
    console.log('awaiting history initialization');
    await HISTORY.init();
    HISTORY.resetCache();
    // HISTORY.initCache();

    // Load settings
    console.log('awaiting settings initialization');
    await SETTINGS.load();

    //Populate LOOKUP
    for (const itemId in unsafeWindow.globalData) {
        const item = unsafeWindow.globalData[itemId];
        const categoryId = item.itemcat;

        if (!LOOKUP.category__item_id.hasOwnProperty(categoryId)) {
            LOOKUP.category__item_id[categoryId] = [];
        }
    }

    for (const categoryId in LOOKUP.category__item_id) {
        LOOKUP.category__item_id[categoryId].sort((a, b) => {
            const itemA = unsafeWindow.globalData[a];
            const itemB = unsafeWindow.globalData[b];

            const nameA = itemA.name?.toLowerCase() || '';
            const nameB = itemB.name?.toLowerCase() || '';

            return nameA.localeCompare(nameB);
        });
    }

    delete LOOKUP.category__item_id['broken'];

    // DEBUG
    unsafeWindow.LOOKUP = LOOKUP;
    unsafeWindow.SETTINGS = SETTINGS;
    unsafeWindow.HISTORY = HISTORY;


    var historySettingsButton = document.createElement("button");
    historySettingsButton.classList.add("opElem");
    historySettingsButton.style.left = page == 35 ? "200px" : "400px";
    historySettingsButton.style.bottom = "86px";
    historySettingsButton.textContent = "History Menu";
    inventoryHolder.appendChild(historySettingsButton);

    
    historySettingsButton.addEventListener("click", function () {
        const fn = SETTINGS.renderSettingsPrompt.bind(SETTINGS);

        fn();
    });

    console.log('awaiting ready');
    await ready();

    document.getElementById("invController").removeEventListener("contextmenu", unsafeWindow.openSellContextMenu, false);
    document.getElementById("invController").addEventListener("contextmenu", unsafeWindow.openSellContextMenu, false);

    const onShiftRelease = function (event) {
        if (event.key != 'Shift') {
            return;
        }

        // console.log('shift hover mode: ' + SETTINGS.values.shiftHoverMode);
        HOVER_INFOBOX_DATA.run(false);

        unsafeWindow.document.removeEventListener('keyup', onShiftRelease);
    };

    unsafeWindow.document.addEventListener('keydown', function (event) {
        if (event.key != 'Shift') {
            return;
        }

        // console.log('shift hover mode: ' + SETTINGS.values.shiftHoverMode);
        HOVER_INFOBOX_DATA.run(true);
        unsafeWindow.document.addEventListener('keyup', onShiftRelease);
    });


    // Create button if script loaded too early
    if (page == 35) {
        injectHistoryTabIntoMarketplace();
    }
})();