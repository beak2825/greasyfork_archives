// ==UserScript==
// @name         Market Search Utilities
// @namespace    http://tampermonkey.net/
// @version      4.2.2
// @description  Adds various utilities to the marketplace
// @author       Rebekah
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/480766/Market%20Search%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/480766/Market%20Search%20Utilities.meta.js
// ==/UserScript==

const debug = false;

(function() {
    'use strict';
    //#region Globals
        let autoCompleteList = [];
        let favourites = GM_getValue('favourites', []);
        let pins = GM_getValue('pins', []);
        let history = GM_getValue('history', []);
        let lastSearch = GM_getValue('lastSearch', 'truff');
        let categories = GM_getValue('categories', {favourites:[], history:[], lastSearch:0});
        let catList = [];
        let statSearch;
        let timeOut;
    //#endregion

    //#region Initial Functions
        function pageMod()
        {

            GM_addStyle(`
                .markethint {
                    margin: 2px 0 0 0 !important;
                    font-size: 10px !important;
                    color: rgb(100,100,100) !important;
                }
                .markethintattention {
                    color: rgb(160, 0, 0) !important;
                }
        
                .resulthighlight {
                    background-color: rgba(0, 255, 0, 0.25) !important;
                }
            `);

            //#region Definitions
                let mainSelect = document.getElementById('marketplace');
                let secondarySelect = document.getElementById('inventoryholder').parentElement.parentElement.parentElement;
                let container;
                let button;
                let p;
            //#endregion
            //#region Main
                container = document.createElement('div');
                container.setAttribute('style', 'display:grid;grid-template-rows:1fr 1fr;row-gap:5px;position:absolute;padding:6.165px;background-color:rgba(0,0,0,0.75);border:0.667px solid rgb(153,0,0);z-index:20;left:43.12px;top:60px;');
                button = document.createElement('button');
                button.id = 'searchHistoryFavourites';
                button.innerText = '\u{2B50}';
                button.title = 'Favourite Searches';
                button.onclick = function()
                {
                    this.disabled = true;
                    this.nextElementSibling.disabled = false;
                    menuManager('favourite', this);
                };
                container.appendChild(button);
                button = document.createElement('button');
                button.id = 'searchHistoryHistory';
                button.innerText = '\u{1F4D6}';
                button.title = 'Search History';
                button.onclick = function()
                {
                    this.disabled = true;
                    this.previousElementSibling.disabled = false;
                    menuManager('history', this);
                };
                container.appendChild(button);
                mainSelect.appendChild(container);
                button = document.createElement('button');
                button.innerText = '\u{1F5D8}';
                button.id = 'searchHistoryLast';
                button.title = `Last Search ('${lastSearch}' in '${catList[categories.lastSearch].catname === '' ? 'Everything' : catList[categories.lastSearch].value}')`;
                button.setAttribute('style', 'position:absolute;top:8px;right:8px');
                button.onclick = function()
                {
                    document.getElementById('searchHistoryContainer') ? document.getElementById('searchHistoryContainer').remove() : null;
                    document.getElementById('searchHistoryFavourites').disabled = false;
                    document.getElementById('searchHistoryHistory').disabled = false;
                    searchManager('searchLast');
                };
                document.getElementById('searchArea').appendChild(button);
                if(!document.getElementById('marketHint'))
                {
                    p = document.createElement('p');
                    p.innerText = 'Double-Click an item to Quicksearch, Shift + Double-Click to Quicksearch for a rename.';
                    p.id = 'marketHint';
                    p.classList.add('markethint');
                    p.align = 'center';
                    secondarySelect.insertBefore(p, secondarySelect.lastElementChild);
                };
            //#endregion
        };
        
        function autocomplete(inp, arr)
        {
            let currentFocus;

            GM_addStyle(`
                .autocomplete-items {
                    position: absolute !important;
                    width: 184px !important;
                    max-height: 239.184px !important;
                    padding: 2px !important;
                    background-color: rgba(0, 0, 0, 0.75) !important;
                    border: 0.667px solid rgb(153, 0, 0) !important;
                    z-index: 20 !important;
                    left: 8px !important;
                    top: 42.26px !important;
                    box-sizing: border-box !important;
                    backdrop-filter: blur(2px) !important;
                    overflow-y: auto !important;
                }

                .autocomplete-items div {
                    white-space: nowrap;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    cursor: pointer !important;
                }

                .autocomplete-items div:hover {
                    background-color: rgba(255, 255, 255, 0.25) !important;
                }

                .markethighlight {
                    color: goldenrod !important;
                    text-shadow: 0 0 3px rgba(218, 165, 32, 0.6) !important;
                    border: none !important;
                }
            `);

            inp.addEventListener('input', function(e)
            {
                let a, b, i, x = false, val = this.value;
                closeAllLists();
                if(!val)
                { 
                    return false;
                };
                currentFocus = -1;
                a = document.createElement('div');
                a.setAttribute('id', 'autocomplete-list');
                a.setAttribute('class', 'autocomplete-items');
                document.getElementById('searchArea').appendChild(a);
                for(i = 0; i < arr.length; i++)
                {
                    const item = arr[i];
                    const itemUpper = item.toUpperCase();
                    const valUpper = val.toUpperCase();
                    const match = val.length < 3 ? itemUpper.startsWith(valUpper) : itemUpper.includes(valUpper);

                    if(match)
                    {
                        debug ? console.log(true) : null;

                        const valueTruncated = item.length >= 20 ? item.substring(item.length - 20) : item;
                        const valueSafe = val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                        const regex = new RegExp(`(${valueSafe})`, "ig");
                        const highlighted = val.length < 3 ? `<span class="markethighlight">${item.substr(0, val.length)}</span>` + item.substr(val.length) : item.replace(regex, `<span class="markethighlight">$1</span>`);

                        x = true;
                        b = document.createElement('div');

                        b.innerHTML = '';
                        const span = document.createElement('span');
                        span.innerHTML = highlighted;
                        b.appendChild(span);
                        const hidden = document.createElement('input');
                        hidden.type = 'hidden';
                        hidden.value = valueTruncated;
                        b.appendChild(hidden);
                        b.title = `Search for '${item}' in '${document.getElementById('categoryChoice').firstElementChild.innerHTML}'`;
                        b.addEventListener('click', function(e)
                        {
                            inp.value = this.getElementsByTagName('input')[0].value;
                            closeAllLists();
                            searchManager('searchReal');
                            search();
                        });
                        a.appendChild(b);
                    };
                };
                !x ? closeAllLists() : null;
            });

            inp.addEventListener('click', function(e)
            {
                if(!document.getElementById('autocomplete-list') && this.value.match(/^[A-Za-z0-9]/))
                {
                    inp.dispatchEvent(new Event('input'));
                };
            })
            
            function closeAllLists(elmnt)
            {
                let x = document.getElementsByClassName('autocomplete-items');
                for (let i = 0; i < x.length; i++)
                {
                    elmnt != x[i] && elmnt != inp ? x[i].parentNode.removeChild(x[i]) : null;
                };
            };

            document.addEventListener('click', function (e)
            {
                closeAllLists(e.target);
            });
        };

        function aggregateAutoComplete()
        {
            const exclusionDictionary = ['M61 Vulcan', 'M134 Minigun', 'Broken Item; Contact Support', '20mm Rifle Bullets'];

            for(let x in unsafeWindow.globalData)
            {
                if(unsafeWindow.globalData[x].name && (!unsafeWindow.globalData[x].no_transfer || (unsafeWindow.globalData[x].no_transfer && unsafeWindow.globalData[x].no_transfer === '0')) && !autoCompleteList.includes(unsafeWindow.globalData[x].name))
                {
                    !exclusionDictionary.includes(unsafeWindow.globalData[x].name) ? autoCompleteList.push(unsafeWindow.globalData[x].name) : null;
                };
            };
        };
    //#endregion

    //#region Main Functions
        function menuManager(action, source)
        {
            document.getElementById('searchHistoryContainer') ? document.getElementById('searchHistoryContainer').remove() : null;
            //#region Definitions
                let mainSelect = document.getElementById('searchArea');
                let container;
                let content;
                let subContainer;
                let button;
            //#endregion
            //#region Main
                container = document.createElement('div');
                container.id = 'searchHistoryContainer';
                container.setAttribute('style', 'display:grid;row-gap:5px;position:absolute;width:184px;padding:6.165px;background-color:rgba(0,0,0,0.75);border:0.667px solid rgb(153,0,0);z-index:20;left:8px;top:42.26px;box-sizing:border-box;backdrop-filter:blur(2px)');
                switch(action)
                {
                    case 'favourite':
                        content = document.createElement('div');
                        content.setAttribute('style', 'display:grid;row-gap:5px;max-height:200.938px;');
                        favourites.length > 10 ? content.style.overflowY = 'auto' : null;
                        for(let i = 0; i < favourites.length; i++)
                        {
                            subContainer = document.createElement('div');
                            subContainer.setAttribute('style', 'display:grid;grid-template-columns:1fr max-content max-content;');
                            pins.includes(favourites[i]) ? subContainer.style.backgroundColor = 'rgba(153, 0, 0, 0.5)' : null;
                            button = document.createElement('button');
                            button.innerText = favourites[i];
                            button.title = `Search for '${favourites[i]}' in '${catList[categories.favourites[i]].catname === '' ? 'Everything' : catList[categories.favourites[i]].value}'`;
                            button.setAttribute('style', 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;');
                            button.dataset.index = i;
                            button.onclick = function()
                            {
                                source.disabled = false;
                                searchManager('searchSaved', this.innerText, catList[categories.favourites[this.dataset.index]]);
                                this.parentElement.parentElement.parentElement.remove();
                            };
                            subContainer.appendChild(button);
                            button = document.createElement('button');
                            button.innerText = '\u{1F4CC}';
                            button.title = pins.includes(favourites[i]) ? 'Unpin' : 'Pin';
                            button.dataset.index = i;
                            button.onclick = function()
                            {
                                pins.includes(favourites[this.dataset.index]) ? pins.splice(pins.indexOf(favourites[this.dataset.index]), 1) : pins.unshift(favourites[this.dataset.index]);
                                saveData();
                                this.parentElement.parentElement.parentElement.remove();
                                menuManager('favourite', source);
                            };
                            subContainer.appendChild(button);
                            button = document.createElement('button');
                            button.innerText = '\u{274C}';
                            button.title = 'Remove from favourites';
                            button.dataset.index = i;
                            button.onclick = function()
                            {
                                pins.includes(favourites[this.dataset.index]) ? pins.splice(pins.indexOf(favourites[this.dataset.index]), 1) : null;
                                favourites.splice(this.dataset.index, 1);
                                categories.favourites.splice(this.dataset.index, 1);
                                saveData();
                                this.parentElement.parentElement.parentElement.remove();
                                menuManager('favourite', source);
                            };
                            subContainer.appendChild(button);
                            pins.includes(favourites[i]) ? content.insertBefore(subContainer, content.firstElementChild) : content.appendChild(subContainer);
                        };
                        container.appendChild(content);
                        break;
                    case 'history':
                        for(let i = 0; i < history.length; i++)
                        {
                            subContainer = document.createElement('div');
                            subContainer.setAttribute('style', 'display:grid;grid-template-columns:1fr max-content;');
                            button = document.createElement('button');
                            button.innerText = history[i];
                            button.title = `Search for '${history[i]}' in '${catList[categories.history[i]].catname === '' ? 'Everything' : catList[categories.history[i]].value}'`;
                            button.setAttribute('style', 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;');
                            button.dataset.index = i;
                            button.onclick = function()
                            {
                                source.disabled = false;
                                searchManager('searchSaved', this.innerText, catList[categories.history[this.dataset.index]]);
                                this.parentElement.parentElement.remove();
                            };
                            subContainer.appendChild(button);
                            button = document.createElement('button');
                            button.innerText = '\u{2B50}';
                            button.title = 'Add to favourites';
                            favourites.includes(history[i]) ? button.disabled = true : null;
                            button.dataset.index = i;
                            button.onclick = function()
                            {
                                this.disabled = true;
                                favourites.unshift(this.previousElementSibling.innerText);
                                categories.favourites.unshift(categories.history[this.dataset.index]);
                                saveData();
                            };
                            subContainer.appendChild(button);
                            container.appendChild(subContainer);
                        };
                        break;
                    default:
                        debug ? console.log('This is a debug message that shouldn\'t show; one of the function calls is broken.') : null;
                };
                button = document.createElement('button');
                button.innerText = 'Close';
                button.setAttribute('style', 'padding:2px !important;border-top:0.667px solid rgb(153,0,0);');
                button.onclick = function()
                {
                    source.disabled = false;
                    this.parentElement.remove();
                };
                container.appendChild(button);
                mainSelect.appendChild(container);
            //#endregion
        };

        function searchManager(action, value, category)
        {
            switch(action)
            {
                case 'searchReal':
                    if(!(document.getElementById('searchField').value === ''))
                    {
                        if(!history.includes(document.getElementById('searchField').value))
                        {
                            history.unshift(document.getElementById('searchField').value);
                            categories.history.unshift(catList.findIndex(x => x.catname === document.getElementById('categoryChoice').dataset.catname));
                        };
                        if(history.length > 10)
                        {
                            history.pop();
                            categories.history.pop();
                        };
                        lastSearch = document.getElementById('searchField').value;
                        categories.lastSearch = catList.findIndex(x => x.catname === document.getElementById('categoryChoice').dataset.catname);
                        document.getElementById('searchHistoryLast').title = `Last Search ('${lastSearch}' in ${catList[categories.lastSearch].catname === '' ? 'Everything' : catList[categories.lastSearch].value})`;
                        saveData();
                    };
                    break;
                case 'searchLast':
                    document.getElementById('searchField').value = lastSearch.substring(lastSearch.length >= 20 ? lastSearch.length - 20 : 0);
                    document.getElementById('categoryChoice').firstElementChild.innerText = catList[categories.lastSearch].value;
                    document.getElementById('categoryChoice').dataset.catname = catList[categories.lastSearch].catname;
                    document.getElementById('categoryChoice').dataset.cattype = catList[categories.lastSearch].cattype;
					document.getElementById('makeSearch').disabled = false;
                    search();
                    break;
                case 'searchSaved':
                    document.getElementById('searchField').value = value.substring(value.length >= 20 ? value.length - 20 : 0);
                    document.getElementById('categoryChoice').firstElementChild.innerText = category.value;
                    document.getElementById('categoryChoice').dataset.catname = category.catname;
                    document.getElementById('categoryChoice').dataset.cattype = category.cattype;
					document.getElementById('makeSearch').disabled = false;
                    search();
                    break;
                default:
                    debug ? console.log('This is a debug message that shouldn\'t show; one of the function calls is broken.') : null;
            };
        };
    //#endregion

    //#region Miscellaneous Functions
        function saveData()
        {
            GM_setValue('favourites', favourites);
            GM_setValue('pins', pins);
            GM_setValue('history', history);
            GM_setValue('lastSearch', lastSearch);
            GM_setValue('categories', categories);
        };

        function itemListeners()
        {
            document.querySelectorAll('div.item').forEach(node => {
                node.addEventListener('dblclick', e =>
                {
                    debug ? console.log(e.target) : null;

                    const modifier = unsafeWindow.activeKeys.includes('shift');

                    const itemType = e.target.dataset.type;
                    const itemCode = itemType.split('_')[0];
                    if(autoCompleteList.includes(unsafeWindow.globalData[itemCode].name) && itemType.split('_')[1] != 'nt')
                    {
                        const itemStats = /^stats\d{3}$/i.test(itemType.split('_')[1]) ? itemType.split('_')[1] : null;

                        const itemName = modifier && itemType.split('_name')[1] ? itemType.split('_name')[1] : unsafeWindow.globalData[itemCode].name;
                        const itemNameTruncated = itemName.length >= 20 ? itemName.substring(itemName.length - 20) : itemName;

                        if(itemStats)
                        {
                            const itemCodeConcat = modifier ? itemType : [itemCode, itemStats].join('_');

                            statSearch = itemCodeConcat;
                        };

                        document.getElementById('searchField').value = itemNameTruncated

                        searchManager('searchReal');
                        search();
                        document.getElementById('itemDisplay').scroll(0,0);
                    } else
                    {
                        hintHandler();
                    };
                });
            });
        };

        function findFirstResult()
        {
            const nodeList = document.getElementById('itemDisplay').children;

            for(let i = 0; i < nodeList.length; i++)
            {
                const node = nodeList[i];

                if(node.dataset.type === statSearch)
                {
                    node.classList.add('resulthighlight');
                    node.scrollIntoView({behavior: 'smooth', block: 'center', container: 'nearest'});
                    break;
                };
            };

            statSearch = null;
        };

        function hintHandler()
        {
            const hintOutput = document.getElementById('marketHint');

            clearTimeout(timeOut);

            hintOutput.innerText = 'That item cannot be traded.';
            hintOutput.classList.add('markethintattention');

            timeOut = setTimeout(() => {
                hintOutput.innerText = 'Double-Click an item to Quicksearch, Shift + Double-Click to Quicksearch for a rename.';
                hintOutput.classList.remove('markethintattention');
            }, 5000);
        };
    //#endregion

    //#region Startup
        function startUp()
        {
            document.getElementById('makeSearch').addEventListener('click', function()
            {
                document.getElementById('searchHistoryContainer') ? document.getElementById('searchHistoryContainer').remove() : null;
                document.getElementById('searchHistoryFavourites').disabled = false;
                document.getElementById('searchHistoryHistory').disabled = false;
                searchManager('searchReal');
            });

            document.getElementById('searchField').addEventListener('keyup', e =>
            {
                e.code === 'Enter' ? searchManager('searchReal') : null;
            });

            document.getElementById('searchField').addEventListener('click', e =>
            {
                document.getElementById('searchHistoryContainer') ? document.getElementById('searchHistoryContainer').remove() : null;
                document.getElementById('searchHistoryFavourites').disabled = false;
                document.getElementById('searchHistoryHistory').disabled = false;
            });

            if(!catList[0])
            {
                for(let i = 0; i < document.getElementById('categoryList').children.length; i++)
                {
                    let elem = document.getElementById('categoryList').children[i];
                    catList.push({value:elem.innerText, catname:elem.dataset.catname === undefined ? '': elem.dataset.catname, cattype:elem.dataset.cattype ? elem.dataset.cattype : ''});
                };
            };

            if(!autoCompleteList[0])
            {
                aggregateAutoComplete();
            };

            pageMod();
            autocomplete(document.getElementById('searchField'), autoCompleteList);
        };

        const configMarketplace = {childList: true};
        const callbackMarketplace = (marketplaceMutationList) => {
            for(const marketplaceMutation of marketplaceMutationList)
            {
                debug ? console.log(marketplaceMutation) : null;
                let found = false;

                for(let i = 0; i < marketplaceMutation.addedNodes.length; i++)
                {
                    if(marketplaceMutation.addedNodes[i].id === 'searchArea' && document.getElementById('searchArea'))
                    {
                        const callbackResults = (resultsMutationList) => {
                            if(statSearch)
                            {
                                findFirstResult();
                            };
                        };
                        const observerResults = new MutationObserver(callbackResults);
                        observerResults.observe(document.getElementById('itemDisplay'), configMarketplace);

                        found = true;
                        startUp();
                        break;
                    };
                };

                if(found)
                {
                    break;
                };
            };
        };
        const observerMarketplace = new MutationObserver(callbackMarketplace);
        observerMarketplace.observe(document.getElementById('marketplace'), configMarketplace);

        const configInventory = {childList: true, subtree: true}
        const callbackInventory = (inventoryMutationList) => {
            debug ? console.log(inventoryMutation) : null;

            itemListeners();
        };
        const observerInventory = new MutationObserver(callbackInventory);
        observerInventory.observe(document.getElementById('inventory'), configInventory);
    //#endregion
})();