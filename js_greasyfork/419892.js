// ==UserScript==
// @name               Steam Currency Convert: Convert ARS to CNY only
// @name:zh            Steam货币转换：目前仅支持阿根廷比索换算人民币
// @description        A simple way to make Steam Argentine user perceive the low prices. Convert ARS to CNY only，for now.
// @description:zh     用简单粗暴的方式让Steam阿根廷区用户感受低价区的魅力，一遍遍汇率换算或者查SteamDB真的烦。目前仅支持阿根廷比索换算人民币。
// @version            1.0
// @author             无敌X哥 
// @namespace          SteamCurrencyConvert
// @match              https://store.steampowered.com/*
// @license            MIT License
// @downloadURL https://update.greasyfork.org/scripts/419892/Steam%20Currency%20Convert%3A%20Convert%20ARS%20to%20CNY%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/419892/Steam%20Currency%20Convert%3A%20Convert%20ARS%20to%20CNY%20only.meta.js
// ==/UserScript==


var er = 14.57;                                    //汇率
var labels = [
    'discount_original_price',                     //原价
    'discount_final_price',                        //折扣价
    'game_purchase_price',                         //详情页价格
    'game_area_dlc_price',                         //DLC
    'global_action_link',                          //忘记了
    'salepreviewwidgets_StoreSalePriceBox_3j4dI',  //一些特卖价格
    'cart_estimated_total',                        //购物车单价
    'price'                                        //购物车总价  
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
                    price[ind].textContent = '￥' + (p / er).toFixed(2);
                }
            }
        }
    }
}
setTimeout(function(){moneyExchange(labels)}, 1000);
// window.onload = function(){moneyExchange(labels)};