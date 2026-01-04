// ==UserScript==
// @name Steam_ARS&pуб_to_RMB
// @namespace Steam_ARS&pуб_to_RMB
// @match https://store.steampowered.com/*
// @match https://steamcommunity.com/*
// @license MIT License
// @description 把steam上的俄罗斯卢布和阿根廷比索换算成人民币
// @version 2.5.211223
// @downloadURL https://update.greasyfork.org/scripts/421511/Steam_ARSp%D1%83%D0%B1_to_RMB.user.js
// @updateURL https://update.greasyfork.org/scripts/421511/Steam_ARSp%D1%83%D0%B1_to_RMB.meta.js
// ==/UserScript==


var ars2rmb = 16
var rus2rmb = 11.5049



function trans(price) {
    let ind;
    let re_ars = /(\D*)(\d\S*)/;
    let re_rus = /(\d\S*)(\D*)/;
    for (ind in price) {
        if (re_ars.test(price[ind].textContent)) {
            var matchItem = re_ars.exec(price[ind].textContent)
            if (matchItem[1].indexOf('ARS') >= 0) {
                let p = matchItem[2].replace('.', '').replace(',', '.')
                price[ind].textContent = '￥' + (p / ars2rmb).toFixed(2)
            }
        }
        if (re_rus.test(price[ind].textContent)) {
            var matchItem = re_rus.exec(price[ind].textContent)
            if (matchItem[2].indexOf('pуб') >= 0) {
                let p = matchItem[1].replace('.', '').replace(',', '.')
                price[ind].textContent = '￥' + (p / rus2rmb).toFixed(2)
            }
        }
    }
}

var elements = new Array('.game_area_dlc_price', '.game_purchase_price.price', '.discount_final_price',
    '.btn_addtocart btn_packageinfo', '.game_purchase_price', '.game_area_dlc_price',
    '.global_action_link', '.discount_original_price','.price.bundle_final_package_price',
    '.price.bundle_final_price_with_discount','.savings.bundle_savings','.col.search_price  responsive_secondrow')


for (var temp in elements) {
    let price = document.querySelectorAll(elements[temp])
    trans(price)
}

