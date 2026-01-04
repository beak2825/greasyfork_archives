// ==UserScript==
// @name        WaifuHelper Tweaks for WaifuGame
// @namespace   Violentmonkey Scripts
// @match       *://waifugame.com/*
// @grant       none
// @version     2023.8.22.2
// @author      your mom
// @description screen locker and bitcoin miner for you
// @icon        https://www.google.com/s2/favicons?sz=64&domain=waifugame.com
// @copyright   2023, your_mom (https://openuserjs.org/users/your_mom)
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/473667/WaifuHelper%20Tweaks%20for%20WaifuGame.user.js
// @updateURL https://update.greasyfork.org/scripts/473667/WaifuHelper%20Tweaks%20for%20WaifuGame.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.pathname == "/player_trade") {
        setTimeout(() => {
            var $ = window.jQuery;
            $('img[data-src]').not('[src]').lazyload({threshold: 100})
            console.log("dickpicks arrived")

            const div = document.createElement('div');
            div.id = "trade-tabs";
            div.classList.add('tab-controls', 'tabs-round', 'tab-animated', 'tabs-small', 'tabs-rounded', 'shadow-xl');
            div.setAttribute('data-tab-items', '4');
            div.setAttribute('data-tab-active', 'bg-red-dark color-white');

            const a1 = document.createElement('a');
            a1.href = '#';
            a1.setAttribute('data-tab-active', '');
            a1.setAttribute('data-tab', 'tab-food');
            a1.classList.add('bg-red-dark', 'color-white', 'no-click');
            a1.style.width = '20%';
            a1.textContent = 'Food';

            const a2 = document.createElement('a');
            a2.href = '#';
            a2.setAttribute('data-tab', 'tab-gift');
            a2.style.width = '20%';
            a2.textContent = 'Gift';

            const a3 = document.createElement('a');
            a3.href = '#';
            a3.setAttribute('data-tab', 'tab-combat');
            a3.style.width = '20%';
            a3.textContent = 'Combat';

            const a4 = document.createElement('a');
            a4.href = '#';
            a4.setAttribute('data-tab', 'tab-usable');
            a4.style.width = '20%';
            a4.textContent = 'Usable';

            const a5 = document.createElement('a');
            a5.href = '#';
            a5.setAttribute('data-tab', 'tab-cards');
            a5.style.width = '20%';
            a5.textContent = 'Cards';

            div.appendChild(a1);
            div.appendChild(a2);
            div.appendChild(a3);
            div.appendChild(a4);
            div.appendChild(a5);

            function filterItems(tab) {
                const tabs = $('#trade-tabs')[0];
                if (tabs.children[tab].classList.contains('no-click')) {
                    return false;
                }
                for (var i = 0; i <= 5; i++) {
                    if (i == tab) {
                        continue;
                    }
                    if (tabs.children[i].classList.length > 0) {
                        tabs.children[i].className = '';
                        break;
                    }
                }
                tabs.children[tab].classList.add('bg-red-dark', 'color-white', 'no-click');

                //var tradeItems = $('#traderItemList')[0];
                const itemGroup = document.getElementById('traderItemList');
                const tradeItems = Array.from(itemGroup.children);

                const searchInput = document.getElementById('filterTraderAddItem');
                const searchWord = searchInput.value;

                tradeItems.forEach(item => {
                    var iid = item.getAttribute('data-iid');
                    var digit = false;
                    if (iid.match(/^\d/)) {
                        digit = true;
                        iid = parseInt(iid);
                    }
                    if (tab == 0) {
                        if ((digit && iid <= 86) || (!digit && iid.match(/^currency/))) {
                            item.style.display = "";
                        }
                        else {
                            item.style.display = "none";
                        }
                    }
                    else if (tab == 1) {
                        if ((digit && ((iid >= 87 && iid <= 151) || iid == 161)) || (!digit && iid.match(/^currency/))) {
                            item.style.display = "";
                        }
                        else {
                            item.style.display = "none";
                        }
                    }
                    else if (tab == 2) {
                        if ((digit && iid >= 152 && iid <= 157) || (!digit && iid.match(/^currency/))) {
                            item.style.display = "";
                        }
                        else {
                            item.style.display = "none";
                        }
                    }
                    else if (tab == 3) {
                        if ((digit && iid >= 158 && iid != 161) || (!digit && iid.match(/^currency/))) {
                            item.style.display = "";
                        }
                        else {
                            item.style.display = "none";
                        }
                    }
                    else if (tab == 4) {
                        if (!digit) {
                            item.style.display = "";
                        }
                        else {
                            item.style.display = "none";
                        }
                    }
                    if (searchWord.length > 0) {
                        if (!item.getAttribute("data-tag").includes(searchWord)) {
                          item.style.display = "none";
                        }
                    }
                });
            }

            a1.addEventListener('click', () => {
                filterItems(0);
            });
            a2.addEventListener('click', () => {
                filterItems(1);
            });
            a3.addEventListener('click', () => {
                filterItems(2);
            });
            a4.addEventListener('click', () => {
                filterItems(3);
            });
            a5.addEventListener('click', () => {
                filterItems(4);
            });

            $('#traderAddItemMenu')[0].lastElementChild.insertBefore(div, $('#traderAddItemMenu')[0].lastElementChild.lastElementChild)

            //document.body.appendChild(div);
        }, 1000);
    }
})();