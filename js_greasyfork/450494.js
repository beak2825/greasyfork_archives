// ==UserScript==
// @name         Subeta Shop Pricer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically prices items
// @author       You
// @match        https://subeta.net/user_shops.php/mine/49965*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=subeta.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450494/Subeta%20Shop%20Pricer.user.js
// @updateURL https://update.greasyfork.org/scripts/450494/Subeta%20Shop%20Pricer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let prices = [...document.querySelectorAll('.price_field')].filter((e)=>e.value == '');
    if (prices.length > 0) {
        prices.forEach((e)=>{e.value=e.parentElement.children[2].innerText.split(':')[1].strip();});
        document.querySelector('input[value="Update Items"]').click();
    }
    let myShopData = localStorage.getItem('META_MY_SHOP');
    if (myShopData) {
        myShopData = JSON.parse(myShopData);
        let data = new Set(myShopData.data);
        document.querySelectorAll('table.table tbody tr').forEach((e) => {
            let itemName = e.children[1].innerText.trim().toLowerCase().split('\n').filter(e=>e.length>0&&e!='+ wishlist')[0];
            let quantity = parseInt(e.children[2].innerText.trim());
            if (quantity >= 3) {
                data.add(itemName);
            } else {
                data.delete(itemName);
            }
        });
        myShopData.expires = Date.now() + 900 * 1000;
        myShopData.data = [...data];
        localStorage.setItem('META_MY_SHOP', JSON.stringify(myShopData));
        console.log(myShopData.data);
    }
    // Your code here...
})();