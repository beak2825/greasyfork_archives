// ==UserScript==
// @name         Talibri Guild Market
// @namespace    http://tampermonkey.net/
// @version      1.15
// @description  Adding inventory function for a Talibri guild market
// @author       Reznal
// @match        https://talibri.com/*
// @grant        GM_xmlhttpRequest
// @connect      afk-brb.tk
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/37991/Talibri%20Guild%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/37991/Talibri%20Guild%20Market.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let page = document.URL.split('/').splice(3).join('/');
    let user = document.getElementsByClassName('fa-user-circle')[0].parentNode.text.trim();

    let filterText = (text, filter, replace, cb) => {
        text = text.split(filter).join(replace);
        cb(text);
    };

    let removeOrder = (username, action, cat, type, post) => {
        let url = `http://afk-brb.tk/market/delete?user=${username}&action=${action}&category=${cat}&type=${type}&post=${post}`;
        GM_xmlhttpRequest({
            method: "DELETE",
            url: url,
            onload: function(response) {
                console.log('Item removed');
            }
        });
    };

    let submitSale = (items, item, baseType) => {
        let rarity = {
            "Elder": "Elder",
            "Rare": "Rare",
            "Ancient": "Ancient",
            "Imbued": "Imbued",
            "Legendary": "Legendary",
            "Infernal": "Infernal",
            "Celestial": "Celestial",
            "Ascendent": "Ascendent"
        };

        let request = null;

        if (baseType === 'component') {
            let description = item[1].innerHTML.trim();
            let tier = item[3].innerHTML.trim();
            let type = item[0].innerHTML.trim().split(' ');
            let stats = item[1].innerHTML.trim().split(' ');
            let stars = item[2].getElementsByClassName('fa-star').length + (item[2].getElementsByClassName('fa-star-half-o').length / 2);
            let id = items.getElementsByTagName("input")[0].value;
            let price = items.getElementsByTagName("input")[1].value;

            if(isNaN(price.trim()) || price.trim() == '' || price.trim().length == 0){
                alert('Invalid price!');
                return;
            }

            if (description.split(' ').length > 1) {
                description = description.split(' ');
                let tempDescription = '';
                for (let word in description) {
                    if (word !== '+') {
                        tempDescription += description[word];
                    }
                }
                description = tempDescription;
            }

            if (type.length > 1) {
                if (rarity[type[0]]) {
                    type = type.slice(1).join(' ');
                }
            } else {
                type = type.join(' ');
            }

            let statsArray = [];

            while (stats[1] !== '+') {
                stats[0] += ` ${stats[1]}`;
                stats.splice(1, 1);
            }

            for (let s = 0; s < stats.length; s++) {
                if (s === 0 || s % 3 == 0) {
                    statsArray.push(stats[s].slice(0, -1));
                }
            }

            stats = statsArray.join('-');

            request = {
                username: user,
                baseType,
                market: {
                    sell: {
                        id,
                        type,
                        stats,
                        description,
                        price,
                        qty: 1,
                        stars,
                        tier
                    }
                }
            };
        } else if (baseType === 'material') {
            let type = item[2].innerHTML.trim();
            let description = item[0].innerHTML.trim();
            let currentQty = item[1].innerHTML;

            let price = items.getElementsByTagName("input")[0].value;
            let qtyToSell = items.getElementsByTagName("input")[1].value;

            if(isNaN(price) || price.split('').length === 0){
                alert('Invalid price!');
                return;
            }

            if(isNaN(qtyToSell) || qtyToSell.split('').length === 0){
                alert('Invalid Quantity!');
                return;
            }

            if (type === 'Material') {
                let tempType = description.split(' ');
                let lastIndex = tempType.length - 1;
                if (tempType[lastIndex] === 'Ore') {
                    type = 'Ore';
                } else if (tempType[lastIndex] === 'Logs') {
                    type = 'Logs';
                }
            } else if (type === 'Refined Material') {
                let tempType = description.split(' ');
                let lastIndex = tempType.length - 1;
                if (tempType[lastIndex] === 'Plank') {
                    type = 'Plank';
                } else if (tempType[lastIndex] === 'Bar') {
                    type = 'Bar';
                } else if (tempType[lastIndex] === 'Cloth') {
                    type = 'Cloth';
                }
            }

            if (currentQty < qtyToSell) {
                alert('Not enough stock');
                return;
            }

            request = {
                username: user,
                baseType,
                market: {
                    sell: {
                        type,
                        description,
                        price,
                        qty: qtyToSell
                    }
                }
            };
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: "http://afk-brb.tk/market",
            data: JSON.stringify(request),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function (response) {
                console.log('Successfully posted to market!');
            }
        });
    };

    let addGuildInventoryButton = () => {
        let panel = document.getElementsByClassName('components-panel')[0],
            header = panel.getElementsByClassName('panel-heading')[0];

        let guildButton = `
                            <button type="button" class="btn btn-default" aria-haspopup="true" aria-expanded="false">
                            Guild post
                            </button>
                            `;

        header.innerHTML += guildButton;

        let buttons = header.getElementsByTagName('button');

        buttons[7].addEventListener('click', function () {
            inventory(buttons[7]);
        }, false);

        buttons[5].addEventListener('click', function () {
            buttons[7].disabled = false;
        }, false);

        buttons[4].addEventListener('click', function () {
            buttons[7].disabled = false;
        }, false);
    };

    let inventory = (buttonIn) => {

        buttonIn.disabled = true;

        let start = '<form>';
        let qtyInput = '<td class="btn-group"><input type="text" class="form-control" id="qtyInput" placeholder="Enter qty"></td>';
        let input = '<td class="btn-group"><input type="text" class="form-control" id="priceInput" placeholder="Enter price"></td>';
        let button = '<td class="btn-group"><button type="button" class="btn btn-success"">Post to guild</button></td>';
        let end = '</form>';

        if(document.getElementById('component-table')){
            let table = document.getElementById('component-table'),
            tbody = table.getElementsByTagName('tbody')[0],
            items = table.getElementsByTagName('tr');

            for (let i = 1; i < items.length; i++) {
                let rows = items[i].getElementsByTagName('td');

                if (rows.length === 5) {
                    items[i].innerHTML += `${start} ${input} ${button} ${end}`;

                    let item = items[i].getElementsByTagName('td');

                    let buttonObj = items[i].getElementsByTagName('button')[0];
                    buttonObj.addEventListener('click', function () {
                        submitSale(items[i], item, 'component');
                    }, false);
                }
            }
        }

        let iTable = document.getElementById('inventory-table'),
            iBody = iTable.getElementsByTagName('tbody')[0],
            iItems = iTable.getElementsByTagName('tr');

        for (let i = 1; i < iItems.length; i++) {
            if(iItems[i].getElementsByClassName('btn-group').length !== 0){
                return;
            }

            iItems[i].innerHTML += `${start} ${input} ${qtyInput} ${button} ${end}`;

            let item = iItems[i].getElementsByTagName('td');

            let buttonObj = iItems[i].getElementsByTagName('button')[0];
            buttonObj.addEventListener('click', function () {
                submitSale(iItems[i], item, 'material');
            }, false);
        }
    };

    let getMarket = (params, callback) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `http://afk-brb.tk/market/list?${params}`,
            onload: function (response) {
                response = JSON.parse(response.response);
                callback(response);
            }
        });
    };

    let guildMarket = () => {
        let panel = document.getElementsByClassName('panel panel-success')[0],
            header = panel.getElementsByClassName('panel-heading')[0],
            body = panel.getElementsByClassName('panel-body')[0],
            bodyDiv = body.getElementsByClassName('row')[0],
            bodyCols = bodyDiv.getElementsByTagName('div');

        let leol = header.getElementsByClassName('pull-left')[0];

        header.innerHTML = leol.outerHTML + 'AFK/BRB Market District';

        if (bodyCols[2]) {
            bodyCols[0].parentNode.removeChild(bodyCols[0]);
            bodyCols[0].parentNode.removeChild(bodyCols[0]);

            bodyCols[0].classList.remove('col-md-8');
            bodyCols[0].classList.add('col-md-12');

            bodyCols = bodyCols[0];
        }

        let selectors = `
            <select class="action-select" id="action-select">
                <option selected>Action</option>
                <option value="buy">People are buying</option>
                <option value="sell">People are selling</option>
            </select>

            <select class="cat-select" id="cat-select">
                <option selected>Category</option>
            </select>

            <select class="type-select" id="type-select">
                <option selected>Type</option>
            </select>
        `;

        let baseTable = `
            <div class="order-results-table">
                <table class="table table-hover tablesorter tablesorter-default" id="inventory-table" role="grid">
                    <thead>
                        <tr role="row" class="tablesorter-headerRow">
                        <th class="tablesorter-header tablesorter-headerUnSorted" role="columnheader"><div class="tablesorter-header-inner">Category</div></th>
                        <th class="tablesorter-header tablesorter-headerUnSorted" role="columnheader"><div class="tablesorter-header-inner">Description</div></th>
                        <th class="tablesorter-header tablesorter-headerUnSorted" role="columnheader"><div class="tablesorter-header-inner">Quantity</div></th>
                        <th class="tablesorter-header tablesorter-headerUnSorted" role="columnheader"><div class="tablesorter-header-inner">Cost Per Item</div></th>
                        <th class="tablesorter-header tablesorter-headerUnSorted" role="columnheader"><div class="tablesorter-header-inner">Buyer/Seller</div></th>
                        </tr>
                    </thead>
                    <tbody aria-live="polite" aria-relevant="all"></tbody>
                </table>
            </div>
        `;

        header.innerHTML += '<br/>';
        header.innerHTML += selectors;

        bodyCols.innerHTML = baseTable;

        let tableBody = bodyCols.getElementsByTagName('tbody');
        tableBody = tableBody[0];

        let selectorObjs = header.getElementsByTagName('select');

        let actionSelect = selectorObjs[0];
        let catSelect = selectorObjs[1];
        let typeSelect = selectorObjs[2];


        actionSelect.addEventListener('change', function () {
            getMarket(`action=${actionSelect.value}`, cb => {
                let cat = '<option selected>Category</option>';
                for (let category in cb) {
                    cat += `<option value=${category.split(' ').join('%20')}>${category}</option>`;
                }
                catSelect.innerHTML = cat;
            });
        });

        catSelect.addEventListener('change', function () {
            getMarket(`action=${actionSelect.value}&cat=${catSelect.value}`, cb => {
                let cat = '<option selected>Type</option>';
                for (let category in cb) {
                    cat += `<option value=${category.split(' ').join('%20')}>${category}</option>`;
                }
                typeSelect.innerHTML = cat;
            });
        });

        typeSelect.addEventListener('change', function () {
            getMarket(`action=${actionSelect.value}&cat=${catSelect.value}&type=${typeSelect.value}`, cb => {
                let classes = [];
                tableBody.innerHTML = '';

                for (let sale in cb) {
                    let postUser = '';
                    let desc = '';

                    if (isNaN(sale)) {
                        postUser = sale;
                        desc = typeSelect.value;
                    }else{
                        postUser = cb[sale].user;
                        desc = cb[sale].description;
                    }

                    filterText(catSelect.value, '%20', ' ', cat => {
                        filterText(desc, '%20', ' ', desc => {
                            classes.push(sale);

                            let row = `<tr role="row" class="${sale}">`;
                                row += `<td class="name game-tooltip" data-placement="left" data-container="body" title="" data-html="true" tooltip-loaded="true">${cat}</td>`;
                                row += `<td class="description">${desc}</td>`;
                                row += `<td class="quantity">${cb[sale].qty}</td>`;
                                row += `<td class="cost">${cb[sale].price}</td>`;

                                if(user === postUser){
                                    row += `<td class="actions"><button id="cancel-button" name="button" class="btn btn-danger ${sale}">Cancel Order</button></td>`;
                                }else{
                                    row += `<td class="buyer-seller"><a href="">${postUser}</a></td>`;
                                }

                                row += `</td>`;
                                row += `</tr>`;

                            tableBody.innerHTML += row;

                            if(user === postUser){
                            }
                        });
                    });
                }
                let rows = tableBody.getElementsByTagName('tr');
                for (let i = 0; i < rows.length; i++) {
                    let cells = rows[i].getElementsByTagName('td');
                    let cat = cells[0].innerHTML;

                    if(rows[i].getElementsByTagName('button')[0]){
                        let buttonObj = rows[i].getElementsByTagName('button')[0];
                        buttonObj.addEventListener('click', function () {
                            let row = buttonObj.parentNode.parentNode;
                            row.parentNode.removeChild(row);
                            removeOrder(user, actionSelect.value, cat, typeSelect.value, classes[i]);
                        }, false);
                    }
                }
            });
        });
    };

    let checkPage = () => {
        page = document.URL.split('/').splice(3).join('/');
        let navBar = document.getElementById('bs-example-navbar-collapse-1'),
            navList = navBar.getElementsByTagName('ul')[0],
            guildButton = document.getElementById('guild-market-button');

        if (guildButton === null) {
            navList.innerHTML += '<li id="guild-market-button"><a href="/trade/1?guild">Guild Market</a><li>';
        }

        if (page === 'inventory') {
            addGuildInventoryButton();
        } else if (page === 'trade/1?guild') {
            guildMarket();
        }
    };
    waitForKeyElements(".main-page", checkPage);
})();