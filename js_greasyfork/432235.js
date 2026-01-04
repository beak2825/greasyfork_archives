// ==UserScript==
// @name         Splinterlands Enhanced Trading
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Add filters to splinterlands market
// @author       Cullen#1432
// @match        https://splinterlands.com/*
// @icon         https://www.google.com/s2/favicons?domain=splinterlands.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432235/Splinterlands%20Enhanced%20Trading.user.js
// @updateURL https://update.greasyfork.org/scripts/432235/Splinterlands%20Enhanced%20Trading.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    GM_addStyle(`
    .header.enhanced-trading br {
        content: "";
        display: block;
        margin: 12px;
    }

    .enhanced-trading .filter-form {
        width: 100%;
        margin: 0px !important;
        text-align: center;
    }

    #btn_refresh {
        -moz-transition: all .1s ease-in;
        -o-transition: all .1s ease-in;
        -webkit-transition: all .1s ease-in;
        transition: all .1s ease-in;
        margin-left: 20px;
    }

    #btn_refresh.awaiting {
        background-color: #3c763d;
    }

    #btn_refresh.awaiting:hover {
        background-color: #53a054;
    }

    #btn_refresh.refreshing {
        background-color: #a94442;
    }
    `)
    let isSortingTable = false;
    // Setting up the dropdowns
    function setupDropDowns() {
        // Grab the first row so we can scrap the different columns
        let trItem = document.querySelector('.card-list-container tbody tr');
        // Holds our dropdown data that we're about to build
        let dropDownBuilder = [];
        // Grab the columns
        trItem.querySelectorAll('td').forEach( tdItem => {
            // Save the column label
            let tdLabel = tdItem.classList.value;
            if(tdLabel === 'check' || tdLabel === 'cooldown'){
                return;
            }
            //Build our collection of all unique values in that column
            let targetTdItemCollection = [];
            document.querySelectorAll('.card-list-container tbody tr td.'+tdLabel).forEach(targetTdItem => {
                let targetTdItemText = targetTdItem.innerHTML;
                if(targetTdItemCollection.indexOf(targetTdItemText) === -1) {
                    targetTdItemCollection.push(targetTdItemText);
                }
            });
            // Sort collection
            let sortedCollection = targetTdItemCollection;
            if(tdLabel === 'lvl') {
                sortedCollection = targetTdItemCollection.sort((x,y) => {
                    return x.substring(2) > y.substring(2) ? 1 : -1
                });
            }
            switch(tdLabel) {
                case 'lvl':
                    sortedCollection = targetTdItemCollection.sort((x,y) => {
                        return x.substring(2) - y.substring(2);
                    });
                    break;
                case 'bcx':
                    sortedCollection = targetTdItemCollection.sort((x,y) => {
                        return x - y;
                    });
                    break;
                case 'price-bcx':
                case 'price':
                    sortedCollection = targetTdItemCollection.sort((x,y) => {
                        return x.replace(',', '').replace('$', '') - y.replace(',', '').replace('$', '');
                    });
                    break;
                default:
                    sortedCollection = targetTdItemCollection.sort((x,y) => {
                        return x > y ? 1 : -1;
                    });
                    break;
            }
            // Push the label + collection to the builder array
            dropDownBuilder.push({'name':tdLabel, 'items':sortedCollection})
        });

        let headerContainer = document.createElement('div');
        headerContainer.className = 'header enhanced-trading';

        let filterContainer = document.createElement('div');
        filterContainer.className = 'filter-form';

        let verticalCenterContainer = document.createElement('div');
        verticalCenterContainer.className = 'vertical-center';

        dropDownBuilder.forEach((dropdownItemCollection, i) => {
            if(i === 4) {
                verticalCenterContainer.appendChild(document.createElement('br'));
            }
            // Creating and adding the dropdown label
            let dropDownItemCollectionLabel = document.createElement('span');
            dropDownItemCollectionLabel.innerHTML = dropdownItemCollection.name + ' ';
            dropDownItemCollectionLabel.id = dropdownItemCollection.name+'_label';
            verticalCenterContainer.appendChild(dropDownItemCollectionLabel);
            // Creating the actual dropdown container
            let dropdownItemCollectionContainer = document.createElement('select');
            dropdownItemCollectionContainer.id = dropdownItemCollection.name+'_sort';
            // Adding option items to dropdown container
            dropdownItemCollection.items.forEach((dropdownItem, j) => {
                if(j === 0) {
                    let dropdownItemContainerAll = document.createElement('option');
                    dropdownItemContainerAll.value = 'All';
                    dropdownItemContainerAll.innerHTML = 'All';
                    dropdownItemCollectionContainer.appendChild(dropdownItemContainerAll);
                }
                let dropdownItemContainer = document.createElement('option');
                dropdownItemContainer.value = dropdownItem;
                dropdownItemContainer.innerHTML = dropdownItem;
                dropdownItemCollectionContainer.appendChild(dropdownItemContainer);
            });
            // Add event listeners
            dropdownItemCollectionContainer.addEventListener('change',(e) => {
                hideRowsFor(e.target.id.replace('_sort', ''), e.target.value);
            })
            // Adding the dropdown container to the ui
            verticalCenterContainer.appendChild(dropdownItemCollectionContainer);
        });
        // Boring adding-all-ui-containers part
        filterContainer.appendChild(verticalCenterContainer);
        headerContainer.appendChild(filterContainer);
        document.querySelector('.header').after(headerContainer);
    }
    function hideRowsFor(row, val) {
        // Reset the other selectors
        document.querySelectorAll('.enhanced-trading select').forEach(dropdown => {
            if(row+'_sort' !== dropdown.id) {
                dropdown.selectedIndex = 0;
            }
        })
        isSortingTable = true;
        // Show them all
        document.querySelectorAll('.card-list-container tbody tr[style*="display: none"]').forEach(trItem => {
            trItem.style.display = 'table-row';
        })
        // We're done here if they selected All
        if(val === 'All') {
            isSortingTable = false;
            return;
        }
        // Hide the ones we hate
        document.querySelectorAll('.card-list-container tbody tr').forEach(trItem => {
            if (trItem.querySelector('.'+row).innerHTML != val) {
                trItem.style.display = 'none';
            }
        })
        // Give observers a chance to finish processing mutations before telling them we're done table sorting
        setTimeout(() => {isSortingTable = false}, 1);
    }
    function setupRefresh() {
        let refreshButton = document.createElement('button');
        refreshButton.id = 'btn_refresh';
        refreshButton.className = 'new-button awaiting'
        refreshButton.innerHTML = 'REFRESH';
        refreshButton.addEventListener('click', e => {
            let tab = document.querySelector('.tournament-header-buttons .selected').id;
            if(['tab_market', 'tab_rentals'].includes(tab)) {
                document.querySelector('#btn_refresh').innerHTML = 'REFRESHING...';
                document.querySelector('#btn_refresh').className = 'new-button refreshing';
                document.querySelector('.scroll-container table').style.opacity = 0.4;
                SM.Api('/market/for_' + (tab === 'tab_market' ? 'sale' : 'rent') + '_by_card', {
                    card_detail_id: id,
                    gold: gold,
                    edition: edition
                }, response => {
                    response.forEach(r => r.bcx = SM.GetCardBCX(r));
                    var data = {
                        items: response.sort((a, b) => parseFloat(a.buy_price) / a.bcx - parseFloat(b.buy_price) / b.bcx),
                        id: id,
                        gold: gold,
                        edition: edition
                    };
                    SM._for_sale_by_card = data;
                    let htmlData = SM.ShowComponent('/cards/' + (tab === 'tab_market' ? 'market' : 'rental') + '_details', data);
                    let htmlContainer = document.createElement('div');
                    htmlContainer.innerHTML = htmlData.trim();
                    let htmlTable = htmlContainer.querySelector('.card-list.noselect');
                    document.querySelector('.card-list.noselect').innerHTML = htmlTable.innerHTML;
                    document.querySelector('#btn_refresh').innerHTML = 'REFRESH';
                    document.querySelector('#btn_refresh').className = 'new-button awaiting'
                    document.querySelector('.scroll-container table').style.opacity = 1;
                    triggerSort()
                });
            }
        });
        document.querySelector('.buttons .filter-form').appendChild(refreshButton);
    }
    function triggerSort() {
        var order = $('#market_sort').val();
		var items = SM._for_sale_by_card.items;
        let tab = document.querySelector('.tournament-header-buttons .selected').id;
		switch(order) {
			case 'price':
				items.sort((a, b) => parseFloat(a.buy_price) - parseFloat(b.buy_price));
				break;
			case 'price_desc':
				items.sort((a, b) => parseFloat(b.buy_price) - parseFloat(a.buy_price));
				break;
			case 'price_bcx':
				items.sort((a, b) => parseFloat(a.buy_price) / a.bcx - parseFloat(b.buy_price) / b.bcx);
				break;
			case 'price_bcx_desc':
				items.sort((a, b) => parseFloat(b.buy_price) / b.bcx - parseFloat(a.buy_price) / a.bcx);
				break;
			case 'bcx':
				items.sort((a, b) => a.bcx - b.bcx);
				break;
			case 'bcx_desc':
				items.sort((a, b) => b.bcx - a.bcx);
				break;
		}
        // Sadly this line only uses the first 1000 results sorted, despite SM._for_sale_by_card.items sometimes showing more
        // Ideally you wanna disect SM.ShowComponent which runs a function called render. toString the render() and maybe remake that call without the 1k limit so filters can be applied BEFORE that
        // Can't just filter on SM._for_sale_by_card.items because that doesn't include card level (I think? unless xp does that)
		$('.card-list').html(SM.ShowComponent('/cards/' + (tab === 'tab_market' ? 'market' : 'rental') + '_details_list', items));
        init();
    }
    let tableObserver = null;
    let uhoh = 0;
    function setupTableListener() {
        tableObserver?.disconnect();
        const tableTargetNode = document.querySelector('.card-list.noselect');
        const tableConfig = { attributes: true, childList: true, subtree: true };
        const tableCallback = function(mutationList, observer){
            if(!isSortingTable) {
                document.querySelectorAll('.enhanced-trading select').forEach(dropdown => {
                    if(dropdown.selectedIndex !== 0) {
                        let row = dropdown.id.replace('_sort', '')
                        let val = dropdown.options[dropdown.selectedIndex].value;
                        hideRowsFor(row, val);
                    }
                })
            }
        }
        tableObserver = new MutationObserver(tableCallback);
        tableObserver.observe(tableTargetNode, tableConfig);
    }
    //Main handlers, sets up most things
    const initTargetNode = document.body;
    const initConfig = { attributes: true, childList: true, subtree: true };
    const initCallback = function(mutationList, observer){
        const isUILoaded = !!document.querySelector('.scroll-container');
        const isEnhancedTradingLoaded = !!document.querySelector('.enhanced-trading');
        if (isUILoaded && !isEnhancedTradingLoaded) {
            setupDropDowns();
            setupRefresh();
            setupTableListener();
	    }
    };
    const initObserver = new MutationObserver(initCallback);
	initObserver.observe(initTargetNode, initConfig);
})();