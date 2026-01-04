// ==UserScript==
// @name               Steam Currency Convert: Convert ARS to USD
// @description        View ARS currency in steam in USD
// @version            1.0
// @author             Tony Stank
// @namespace          SteamARStoUSD
// @match              https://store.steampowered.com/*
// @license            MIT License
// @downloadURL https://update.greasyfork.org/scripts/444117/Steam%20Currency%20Convert%3A%20Convert%20ARS%20to%20USD.user.js
// @updateURL https://update.greasyfork.org/scripts/444117/Steam%20Currency%20Convert%3A%20Convert%20ARS%20to%20USD.meta.js
// ==/UserScript==


var er = 115.04;                                     
var labels = [
    'discount_original_price',                     
    'discount_final_price',                        
    'game_purchase_price',                         
    'game_area_dlc_price',                         
    'global_action_link',                          
    'salepreviewwidgets_StoreSalePriceBox_3j4dI',  
    'cart_estimated_total',                        
    'price'                                          
];

function moneyExchange(labels){
    var re = /(\D*)(\d\S*)/;
    for(label in labels){
        let price = document.querySelectorAll(`.${labels[label]}`);
        if(price.length == 0) continue;
        for(ind in price){
            if(re.test(price[ind].textContent)){
                let matchItem = re.exec(price[ind].textContent);
                if(matchItem[1].indexOf('ARS') >= 0){
                    let p = matchItem[2].replace('.','').replace(',','.');
                    price[ind].textContent = '$' + (p / er).toFixed(2);
                }
            }
        }
    }
}
setTimeout(function(){moneyExchange(labels)}, 1000);
// window.onload = function(){moneyExchange(labels)};