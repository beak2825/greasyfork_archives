// ==UserScript==
// @name         DF Storage List
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Shows your storage, but as a list. Features filters and sorting.
// @author       Runonstof
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @grant        unsafeWindow
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486171/DF%20Storage%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/486171/DF%20Storage%20List.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    
    /******************************************************
     * Initialize script
     ******************************************************/

    const searchParams = new URLSearchParams(window.location.search);
    const page = parseInt(searchParams.get('page'));
    // If is not on the storage page, stop script
    if (page != 50) {
        return;
    }

    /******************************************************
     * Global variables
     ******************************************************/

    const WEBCALL_HOOKS = {
        before: {},
        after: {},
        afterAll: [],
        beforeAll: [],
    };
    
    const SORT_OPTIONS = {
        '': {
            label: 'none',
            strategy: null,
        },
        'name': {
            label: 'name',
            strategy: 'string',
            getter: (item) => unsafeWindow.itemNamer(item.type, item.quantity),
        },
        'quantity': {
            label: 'quantity',
            strategy: 'number',
            getter: (item) => parseInt(item.quantity),
        },
        'scrap': {
            label: 'scrap value',
            strategy: 'number',
            getter: (item) => unsafeWindow.scrapValue(item.type, item.quantity),
        },
    };

    const ITEM_TYPE_OPTIONS = {
        weapon: {
            label: 'Weapons',
            values: ['weapon'],
        },
        ammo: {
            label: 'Ammo',
            values: ['ammo'],
        },
        armour: {
            label: 'Armour',
            values: ['armour'],
        },
        item: {
            label: 'Items',
            values: ['item'],
        },
        implant: {
            label: 'Implants',
            values: ['implant'],
        },
        clothing: {
            label: 'Clothing',
            values: ['hat', 'mask', 'coat', 'shirt', 'trousers'],
        },
    };

    const LOOKUP = {
        category__item_id: {},
        item_types: [],
    };

    unsafeWindow.LOOKUP = LOOKUP;
    
    /******************************************************
     * Utility functions
     ******************************************************/
    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyle_Runon_storage_list") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyle_Runon_storage_list";
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

    function getGlobalDataItemId(rawItemId) {
        return rawItemId.split('_')[0];
    }

    function getBaseItemId(rawItemId) {
        return rawItemId.replace(/_stats\d+/, '');
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

    
    
    /******************************************************
     * Storage list object
     ******************************************************/

    const STORAGE_LIST = {
        shown: false,
        maxItems: 480,
        initialized: false,
        
        values: {
            search: '',
            sort: '',
            sortDirection: 'asc',
            types: [], // If empty, all types are shown, contains 'item', 'ammo', 'armour', 'implant'
            scrollY: 0,
        },

        async load() {
            // this.shown = true;
            this.shown = await GM.getValue('storage_list_shown', false);
            const values = await GM.getValue('storage_list_values', {});

            mergeDeep(this.values, values);
        },
        async save() {
            await GM.setValue('storage_list_values', this.values);
        },
        saveDebounced() {
            if (this.saveDebounceTimeout) {
                clearTimeout(this.saveDebounceTimeout);
            }

            this.saveDebounceTimeout = setTimeout(() => {
                this.save();
            }, 200);
        },
        async toggle() {
            this.shown = !this.shown;
            await GM.setValue('storage_list_shown', this.shown);
            this.updateInventoryHolder();
        },
        storageKey(key) {
            return 'storage_list_' + key + '_' + userVars.userID;
        },
        *iterator() {
            for(let i = 0; i < this.maxItems; i++) {
                const item = this.item(i);
                if (!item) {
                    continue;
                }

                yield item;
            }
        },
        count() {
            return Array.from(this.iterator()).length;
        },
        items() {
            let items = Array.from(this.iterator());

            if (this.values.types.length || this.values.search) {
                const allowedItemTypes = this.values.types.flatMap(itemType => ITEM_TYPE_OPTIONS[itemType].values);
                items = items.filter(item => {
                    if (this.values.search) {
                        const itemName = unsafeWindow.itemNamer(item.type, item.quantity).toLowerCase();

                        if (!itemName.includes(this.values.search.toLowerCase()) && !item.type.includes(this.values.search.toLowerCase())) {
                            return false;
                        }
                        
                    }

                    if (!allowedItemTypes.length) {
                        return true;
                    }

                    const itemId = getGlobalDataItemId(item.type);
                    const itemType = getItemType(unsafeWindow.globalData[itemId]);

                    return allowedItemTypes.includes(itemType);
                });
            }

            if (this.values.sort) {
                items.sort((a, b) => {
                    const strategy = SORT_OPTIONS[this.values.sort].strategy;

                    if (!strategy) {
                        return 0;
                    }

                    const getter = SORT_OPTIONS[this.values.sort].getter;
                    
                    const valueA = getter(a);
                    const valueB = getter(b);

                    if (strategy === 'string') {
                        return valueA.localeCompare(valueB);
                    }

                    if (strategy === 'number') {
                        return valueA - valueB;
                    }

                    return 0;
                });

                if (this.values.sortDirection === 'desc') {
                    items.reverse();
                }
            }

            return items;
        },
        item(index) {
            if (!unsafeWindow.storageBox.hasOwnProperty('df_store' + index + '_type')) {
                return null;
            }

            return {
                slot: index,
                type: unsafeWindow.storageBox['df_store' + index + '_type'],
                quantity: unsafeWindow.storageBox['df_store' + index + '_quantity'],
            };
        },
        updateInventoryHolder() {
            if (this.shown) {
                // Hide the regular storage box
                unsafeWindow.inventoryholder.classList.add('hide-box');
                // Show the storage list
                unsafeWindow.storageListingHolder.classList.remove('hide-list');
            } else {
                // Show the regular storage box
                unsafeWindow.inventoryholder.classList.remove('hide-box');
                // Hide the storage list
                unsafeWindow.storageListingHolder.classList.add('hide-list');
            }
        },
        // removeStorageListHolder() {
        //     const storageListElem = document.getElementById('storageListing');
        //     if (storageListElem) {
        //         storageListElem.remove();
        //     }
        // },
        init() {
            if (this.initialized) {
                return;
            }

            // Insert the storage list holder
            const storageListHolderElem = document.createElement('div');
            storageListHolderElem.id = 'storageListingHolder';

            unsafeWindow.inventoryholder.appendChild(storageListHolderElem);

            // Insert count display
            const countDisplay = document.createElement('div');
            countDisplay.id = 'storageListCount';
            countDisplay.style.position = 'absolute';
            countDisplay.style.left = '150px';
            countDisplay.style.top = '54px';
            countDisplay.style.textAlign = 'left';
            countDisplay.style.fontSize = '9pt';
            countDisplay.style.width = '400px';
            countDisplay.style.height = '20px';
            unsafeWindow.inventoryholder.appendChild(countDisplay);

            // Insert search input
            let renderTimeout;
            const searchInput = document.createElement('input');
            searchInput.id = 'storageListSearch';
            searchInput.placeholder = 'Search';
            searchInput.value = this.values.search;
            searchInput.addEventListener('input', function () {
                STORAGE_LIST.values.search = this.value;
                STORAGE_LIST.values.scrollY = 0;

                STORAGE_LIST.saveDebounced();


                const render = function () {
                    STORAGE_LIST.render();
                };

                if (renderTimeout) {
                    clearTimeout(renderTimeout);
                }

                renderTimeout = setTimeout(render, 250);
            });

            searchInput.style.position = 'absolute';
            searchInput.style.left = '0';
            searchInput.style.top = '90px';
            searchInput.style.width = '130px';

            unsafeWindow.inventoryholder.appendChild(searchInput);

            // Insert toggle button
            const toggleButton = document.createElement('button');
            toggleButton.id = 'toggleStorageList';
            toggleButton.textContent = this.shown ? 'Show box' : 'Show list';
            toggleButton.addEventListener('click', async function () {
                await STORAGE_LIST.toggle();

                if (STORAGE_LIST.shown) {
                    this.textContent = 'Show box';
                } else {
                    this.textContent = 'Show list';
                }
            });
            toggleButton.style.position = 'absolute';
            toggleButton.style.right = '160px';
            toggleButton.style.top = '70px';

            unsafeWindow.inventoryholder.appendChild(toggleButton);

            // Insert toggle sort button
            const toggleSortButton = document.createElement('button');
            toggleSortButton.id = 'toggleStorageListSort';

            const getSortLabel = function () {
                const sortLabel = SORT_OPTIONS[STORAGE_LIST.values.sort].label;

                if (STORAGE_LIST.values.sort === '') {
                    return `Sort by:<br>none`;
                }

                const sortDirectionLabel = STORAGE_LIST.values.sortDirection === 'asc' ? 'asc' : 'desc';

                return `Sort by:<br>${sortLabel} (${sortDirectionLabel})`;
            };

            toggleSortButton.innerHTML = getSortLabel();
            toggleSortButton.addEventListener('click', async function () {
                // if empty then goto next sort option immediately
                if (STORAGE_LIST.values.sort === '') {
                    STORAGE_LIST.values.sort = 'name';
                    STORAGE_LIST.values.sortDirection = 'asc';
                } else {
                    // if asc, goto desc, if desc, goto next sort option

                    if (STORAGE_LIST.values.sortDirection === 'asc') {
                        STORAGE_LIST.values.sortDirection = 'desc';
                    }else {
                        const sortKeys = Object.keys(SORT_OPTIONS);

                        const currentSortIndex = sortKeys.indexOf(STORAGE_LIST.values.sort);
                        const nextSortIndex = currentSortIndex + 1;

                        if (nextSortIndex >= sortKeys.length) {
                            STORAGE_LIST.values.sort = '';
                        } else {
                            STORAGE_LIST.values.sort = sortKeys[nextSortIndex];
                        }

                        STORAGE_LIST.values.sortDirection = 'asc';
                    }
                }

                STORAGE_LIST.values.scrollY = 0;
                this.innerHTML = getSortLabel();

                await STORAGE_LIST.save();

                STORAGE_LIST.render();
            });

            toggleSortButton.style.position = 'absolute';
            toggleSortButton.style.left = '0';
            toggleSortButton.style.top = '120px';
            toggleSortButton.style.textAlign = 'left';

            unsafeWindow.inventoryholder.appendChild(toggleSortButton);

            // Insert filter buttons
            let optionIndex = 0;
            for(const itemType in ITEM_TYPE_OPTIONS) {
                const itemTypeOption = ITEM_TYPE_OPTIONS[itemType];

                const getOptionLabel = function () {
                    const isChecked = STORAGE_LIST.values.types.includes(itemType);

                    return `[${isChecked ? 'x' : ' '}] ${itemTypeOption.label}`;
                };

                const toggleOptionButton = document.createElement('button');
                toggleOptionButton.classList.add('toggleStorageListOption');
                toggleOptionButton.id = 'toggleStorageListOption_' + itemType;
                toggleOptionButton.innerHTML = getOptionLabel();
                toggleOptionButton.addEventListener('click', async function () {
                    const isChecked = STORAGE_LIST.values.types.includes(itemType);

                    if (isChecked) {
                        STORAGE_LIST.values.types.splice(STORAGE_LIST.values.types.indexOf(itemType), 1);
                    } else {
                        STORAGE_LIST.values.types.push(itemType);
                    }

                    STORAGE_LIST.values.scrollY = 0;
                    this.innerHTML = getOptionLabel();

                    await STORAGE_LIST.save();

                    STORAGE_LIST.render();
                });

                toggleOptionButton.style.position = 'absolute';
                toggleOptionButton.style.left = '0';
                toggleOptionButton.style.top = (180 + (optionIndex * 14)) + 'px';
                toggleOptionButton.style.textAlign = 'left';

                unsafeWindow.inventoryholder.appendChild(toggleOptionButton);

                optionIndex++;
            }

            this.updateInventoryHolder();
            this.initialized = true;
        },
        render() {
            unsafeWindow.storageListingHolder.innerHTML = '';

            const storageListElement = document.createElement('div');
            storageListElement.id = 'storageListing';
            storageListElement.addEventListener('scroll', function () {
                STORAGE_LIST.values.scrollY = this.scrollTop;

                STORAGE_LIST.saveDebounced();
            });

            unsafeWindow.storageListingHolder.appendChild(storageListElement);

            const items = this.items();

            const userSlots = unsafeWindow.userVars.DFSTATS_df_storage_slots;
            const isFiltered = items.length < this.count();
            unsafeWindow.storageListCount.innerHTML = `${isFiltered ? '' : '<br>'}Space used ${this.count()}/${userSlots}`;
            if (isFiltered) {
                unsafeWindow.storageListCount.innerHTML += `<br>Showing ${items.length} results`;
            } 

            const hasInvSpace = unsafeWindow.findFirstEmptyGenericSlot('inv') !== false;

            for(const item of items) {
                const itemElem = document.createElement('div');
                itemElem.classList.add('fakeItem');
                itemElem.classList.add('listItem');
                itemElem.dataset.type = item.type;
                itemElem.dataset.quantity = item.quantity;
                const itemId = getGlobalDataItemId(item.type);
                itemElem.dataset.itemtype = unsafeWindow.getItemType(unsafeWindow.globalData[itemId]);
                const itemName = unsafeWindow.itemNamer(item.type, item.quantity);

                const quantityText = item.quantity > 1 ? `(${item.quantity})` : '';

                itemElem.innerHTML = `
                    <div class="itemName cashhack credits" data-cash="${itemName}">${itemName}</div>    
                    ${quantityText}
                `;
                
                const takeButton = document.createElement('button');
                takeButton.classList.add('takeButton');
                takeButton.classList.add('opElem');	
                if (!hasInvSpace) {
                    takeButton.disabled = true;
                } else {
                    takeButton.addEventListener('click', function () {
                        if (this.disabled) {
                            return;
                        }
                        const invSlot = unsafeWindow.findFirstEmptyGenericSlot("inv");
                        if (invSlot === false) {
                            return;
                        }

                        const itemData = [
                            item.slot,
                            item.type,
                            'storage',
                        ];

                        const extraData = [itemData];
			            extraData[1] = [invSlot, "", "inventory"];

                        this.disabled = true;
                        unsafeWindow.updateInventory(extraData);
                    });
                }
                takeButton.textContent = 'Take';
                takeButton.style.right = '10px';

                itemElem.appendChild(takeButton);

                storageListElement.appendChild(itemElem);
            }

            
            storageListElement.scrollTop = this.values.scrollY;
        },
    };

    unsafeWindow.STORAGE_LIST = STORAGE_LIST;
    
    /******************************************************
     * Styles
     ******************************************************/

    GM_addStyle_object('#inventoryholder', {
        '$ &.hide-box': {
            '$ & #storage': {
                display: 'none',
            },
            '$ & #storageBackward, & #storageForward': {
                display: 'none!important',
            },
            '$ & #buyStorageSlots': {
                display: 'none',
    
                '$ & + .opElem': {
                    display: 'none',
                },
            },
        },
        '$ &:not(.hide-box)': {   
            '$ & #storageListSearch, & #toggleStorageListSort, & .toggleStorageListOption, & #storageListCount': {
                display: 'none',
            },
        }
    });

    GM_addStyle_object('#storageListingHolder', {
        '$ &.hide-list': {
            display: 'none',

        },
        '$ & #storageListing': {
            position: 'relative',
            overflowY: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
            border: '1px solid #990000',
            backgroundColor: 'rgba(0,0,0,0.8)',
            top: '91px',
            width: '400px',
            height: '320px',

            '$ & .listItem': {
                position: 'relative',
                width: 'calc(100% - 6px)',
                paddingLeft: '6px',
                textAlign: 'left',
                fontSize: '9pt',
                height: '16px',

                '$ & > div': {
                    display: 'inline-block',
                    position: 'relative',
                },

                '$ & + .listItem': {
                    borderTop: '1px #330000 solid',
                },

                '$ & .itemName': {
                    // paddingLeft: '6px',
                    // '$ &.cashhack:before, &.cashhack:after': {
                        // position: 'absolute',
                    // },
                    margin: 'auto 0',
                },
                
                '$ &:hover': {
                    backgroundColor: 'rgba(125, 0, 0, 0.4)',
                },
            },
        },
    });

    // GM_addStyle_object('#selectCategory', {
    //     position: 'absolute',
    //     width: '100%',
    //     top: '40px',
    //     fontSize: '12pt',
    // });
    
    /******************************************************
     * DF Function Overrides
     ******************************************************/

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
            const dataObj = Object.fromEntries(new URLSearchParams(data).entries());
            const responseDataObj = Object.fromEntries(new URLSearchParams(xhr.responseText).entries());

            const request = {
                call,
                params,
                callback,
                hashed,
            };

            const response = {
                dataObj,
                response: responseDataObj,
                data,
                status,
                xhr,
            };

            // Call all 'before' hooks
            if (WEBCALL_HOOKS.before.hasOwnProperty(call)) {
                // Copy the array, incase that hooks remove themselves during their execution
                const beforeHooks = WEBCALL_HOOKS.before[call].slice();

                for (const beforeHook of beforeHooks) {
                    beforeHook(request, response);
                }
            }

            // Call all 'beforeAll' hooks
            const beforeAllHooks = WEBCALL_HOOKS.beforeAll.slice();
            for (const beforeAllHook of beforeAllHooks) {
                beforeAllHook(request, response);
            }
            
            // Execute the original callback
            const result = callback.call(unsafeWindow, data, status, xhr);

            // Call all 'after' hooks
            if (WEBCALL_HOOKS.after.hasOwnProperty(call)) {

                // Copy the array, incase that hooks remove themselves during their execution
                const afterHooks = WEBCALL_HOOKS.after[call].slice();

                for (const afterHook of afterHooks) {
                    afterHook(request, response, result);
                }
            }

            // Call all 'afterAll' hooks
            const afterAllHooks = WEBCALL_HOOKS.afterAll.slice();
            for (const afterAllHook of afterAllHooks) {
                afterAllHook(request, response, result);
            }

            // Return the original callback result
            // As far as I see in the source code, the callbacks never return anything, but its cleaner to return it anyway
            return result;
        };

        // Call the original webCall function, but with our hooked callback function
        return originalWebCall.call(unsafeWindow, call, params, callbackWithHooks, hashed);
    };


    /******************************************************
     * Await Page Initialization
     ******************************************************/

    // A promise that resolves when document is fully loaded and globalData is filled with stackables
    // This is because DeadFrontier does a request to stackables.json, which is needed for the max stack of items
    // Only after this request is done, globalData will contain ammo with a max_quantity
    console.log('awaitin page init');
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

    console.log('awaitin storage init');
    await new Promise(resolve => {
        if (unsafeWindow.storageBox) {
            resolve();
            return;
        }

        let checkExistsInterval;

        const checkExists = () => {
            if (unsafeWindow.storageBox) {
                clearInterval(checkExistsInterval);
                resolve();
            }
        };

        checkExistsInterval = setInterval(checkExists, 100);
    });

    // Wait until #normalContainer exists, resolve if it already exists
    console.log('awaitin normalContainer');
    await new Promise(resolve => {
        const checkExists = () => {
            console.log('checking');
            if (document.getElementById('normalContainer')) {
                resolve();
                return true;
            }
            return false;
        };
        const exists = checkExists();
        if (exists) {
            return;
        }

        const checkExistInterval = setInterval(function() {
            if (checkExists()) {
                clearInterval(checkExistInterval);
            }
        }, 100);
    });


    //Populate LOOKUP
    for (const itemId in unsafeWindow.globalData) {
        const item = unsafeWindow.globalData[itemId];
        const categoryId = item.itemcat;

        if (!LOOKUP.category__item_id.hasOwnProperty(categoryId)) {
            LOOKUP.category__item_id[categoryId] = [];
        }

        LOOKUP.category__item_id[categoryId].push(itemId);


        const itemType = getItemType(item);

        if (!LOOKUP.item_types.includes(itemType)) {
            LOOKUP.item_types.push(itemType);
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


    /******************************************************
     * Script start
     ******************************************************/

    console.log('loading');
    await STORAGE_LIST.load();
    console.log('loaded');
    STORAGE_LIST.init();
    STORAGE_LIST.render();

    onAfterWebCall('get_storage', function (request, response) {
        if (response.xhr.status !== 200) {
            return;
        }

        console.log('shown: ' , STORAGE_LIST.shown)
        if (!STORAGE_LIST.shown) {
            return;
        }

        STORAGE_LIST.init();
        STORAGE_LIST.render();
    }); 
})();