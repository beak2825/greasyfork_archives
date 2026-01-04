// ==UserScript==
// @name                Steam cart sorter
// @name:ZH-CN          Steam 购物车自动排序
// @namespace           http://tampermonkey.net/
// @version             0.8
// @description         sort the Steam cart by price
// @description:ZH-CN   对 Steam 购物车中的物品按照价格排序
// @author              SLAPaper
// @match               http://store.steampowered.com/cart/*
// @match               https://store.steampowered.com/cart/*
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/30864/Steam%20cart%20sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/30864/Steam%20cart%20sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        function sorter(isAsc) {
            let cart_item_list = document.querySelector('.cart_item_list');
            let old_items = Array.from(cart_item_list.children);

            let indicies = new Array(old_items.length);
            for (let i = 0; i < indicies.length; ++i) {
                indicies[i] = i;
            }

            indicies.sort((a, b) => {
                let anode = old_items[a].querySelector('.price:last-of-type');
                let bnode = old_items[b].querySelector('.price:last-of-type');

                if (!anode) {
                    return -1;
                }
                if (!bnode) {
                    return 1;
                }

                let aval = parseInt(anode.textContent.slice(2));
                let bval = parseInt(bnode.textContent.slice(2));

                if (aval - bval == 0) {
                    return a - b;
                }

                if (isAsc) {
                    return aval - bval;
                }
                else {
                    return bval - aval;
                }
            });

            for (let i = 0; i < old_items.length; ++i) {
                cart_item_list.appendChild(old_items[indicies[i]]);
            }
        }

        let sort_btn = document.createElement('div');
        sort_btn.className = 'SortCart';
        sort_btn.innerHTML = `
<button class="SortCartAsc">Sort Cart Ascend</button>
<button class="SortCartDesc">Sort Cart Descent</button>
`;

        document.querySelector('.rightcol').insertBefore(sort_btn, document.querySelector('.rightcol cart_recommendations_ctn'));

        document.querySelector('.SortCartAsc').addEventListener('click', () => {sorter(true);});
        document.querySelector('.SortCartDesc').addEventListener('click', () => {sorter(false);});
    }

    window.addEventListener('load', main);
})();