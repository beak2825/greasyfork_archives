// ==UserScript==
// @name         Dead Frontier Marketeer
// @namespace    http://tampermonkey.net/
// @version      0.8010
// @description  QoL features for the Dead Frontier Market. Displays the price per quantity of items (such as ammunition). And allows you to double click items to search.
// @author       bogidot
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @icon         https://i.imgur.com/5lJ3Jb1.png
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/453390/Dead%20Frontier%20Marketeer.user.js
// @updateURL https://update.greasyfork.org/scripts/453390/Dead%20Frontier%20Marketeer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('DFM: Marketeer is here');

    setTimeout(() => {

        console.log("DFM: Starting Marketeer");

        function is_buy_tab () {
            const buyingTab = document.getElementById('loadBuying');
            if (buyingTab.disabled) {
                return true;
            } else {
                return false;
            }
        }

        function get_prices () {
            itemObserver.disconnect()
            keyCheck = true;

            const itemDisplay = document.getElementById('itemDisplay');
            if (itemDisplay.childNodes.length <= 0) {
                console.log("DFM: no items found");
                return
            }

            var items = document.querySelectorAll(".fakeItem");
            var price = document.querySelectorAll(".salePrice");

            var i = 0;
            items.forEach ((item) => {

                //if (item.dataset.quantity > 1 || typeof item.dataset.quantity != 'string') {
                    var pricePer = item.dataset.price / item.dataset.quantity;

                    pricePer = Math.round((pricePer + Number.EPSILON) * 100) / 100;

                    var add = '';
                    if (price.item(i).innerHTML.length + pricePer.toString().length >= 12){
                        add = "<br>";
                        item.style.paddingBottom = '0.75rem';
                    }

                    price.item(i).innerHTML += `${add}<span style="background: -webkit-linear-gradient(#eeeeee, #969696);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;">($${pricePer})</span>`;
                    i++;
                //}
            })
        }

        function check_for_items () {
            const itemDisplay = document.getElementById('itemDisplay');

            if (itemDisplay.childNodes.length > 0) {
                return true;
            } else {
                return false;
            }
        }

        function get_item_name () {
            const infobox = document.querySelector('#infoBox > .itemName');
            return infobox.innerText
        }

        function observe_market (target = itemDisplay) {
            const itemDisplay = document.getElementById('itemDisplay');
            itemObserver.observe(target, observerOptions);
        }

        const itemObserver = new MutationObserver(get_prices);
        const observerOptions = {
            childList: true,
            subtree: true
        }

        var keyCheck = true;
        const marketplace = document.getElementById('invController');
        marketplace.addEventListener("click", (e) => {

            if (e.target.dataset.page == "buy" && check_for_items()) {
                get_prices()
            }

            if (e.target.id == "makeSearch") {
                observe_market();
            }

            if (e.target.id == "searchField") {
                console.log("jeez");
                const field = document.getElementById("searchField").select()
            }

            if (e.target.dataset.action == "buyItem") {
                const popup = document.getElementById('gamecontent')
                popup.addEventListener("click", (e) => {
                    if (e.target.innerHTML == "Yes") {
                        observe_market();
                    } else if (e.target.innerHTML == "No") {
                        popup.removeEventListener()
                    }
                })
            }
        }) 

        marketplace.addEventListener("keydown", (e) => {
            if (e.target.id == "searchField" && e.key == "Enter" && keyCheck) {
                keyCheck = false;
                observe_market();
            }
        })

        marketplace.addEventListener("dblclick", (e) => {

            if (e.target.classList.contains('item') && is_buy_tab()) {
                const searchField = document.getElementById('searchField');
                const searchButton = document.getElementById('makeSearch');

                searchField.value = '';
                searchField.value = get_item_name();
                searchButton.disabled = false;
                searchButton.click();
            }
        })
    }, 1000)


})();