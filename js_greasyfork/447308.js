// ==UserScript==
// @name               Convert Steam ARS$ to GBP
// @description        View ARS in GBP
// @namespace          ARS2GBPsteam
// @license            MIT
// @version            1.0
// @match              https://store.steampowered.com/*
// @downloadURL https://update.greasyfork.org/scripts/447308/Convert%20Steam%20ARS%24%20to%20GBP.user.js
// @updateURL https://update.greasyfork.org/scripts/447308/Convert%20Steam%20ARS%24%20to%20GBP.meta.js
// ==/UserScript==


var er = 150.56;
var labels = [
    'discount_original_price',                     
    'discount_final_price',                        
    'game_purchase_price',                         
    'game_area_dlc_price',                         
    'global_action_link',                          
    'salepreviewwidgets_StoreSalePriceBox_3j4dI',  
    'cart_estimated_total',                        
    'price',
    'salepreviewwidgets_StoreSalePriceBox_Wh0L8',
    'salepreviewwidgets_StoreOriginalPrice_1EKGZ'
];





//console.log(discount_items);



function moneyExchange(labels){
    var norm_price_items = [];
    var discount_items = [];
    var new_arr = []
    var elementsArr = document.getElementsByClassName("col search_price responsive_secondrow");
    try {
        for(elm in elementsArr){
            if(((elementsArr[elm].textContent.match(/ARS/g) || []).length) == 1){
                norm_price_items.push(elementsArr[elm]);
            }
            if (((elementsArr[elm].textContent.match(/ARS/g) || []).length) == 2){
                discount_items.push(elementsArr[elm]);
            }


        }
    }
    catch(err) {

    }

    // CHANGE PRICE OF NORMAL ITEMS]
    for(item in norm_price_items){
        var floatp
        try {
        var getprice = norm_price_items[item].textContent.trim().slice(5).replace(".","").replace(",",".")
        floatp = parseFloat(getprice)
        norm_price_items[item].textContent = '£' + (floatp / er).toFixed(2)
        }
        catch(err){
        }
    }


    //CHANGE PRICE OF DISCOUNT ITEMS
    for(item in discount_items){
        try{
            var stringarr = discount_items[item].textContent.split("ARS$ ")
            var oldformatorig = "ARS$ " + stringarr[1]
            var oldformatnew = "ARS$ " + stringarr[2]
            var newformatorig = parseFloat(stringarr[1].replace(".","").replace(",","."))
            var newformatnew = parseFloat(stringarr[2].replace(".","").replace(",","."))
            newformatorig = '£' + (newformatorig / er).toFixed(2)
            newformatnew = '£' + (newformatnew / er).toFixed(2)
            discount_items[item].innerHTML = discount_items[item].innerHTML.replace(oldformatorig,newformatorig).replace(oldformatnew,newformatnew)

        }
        catch(err){
        }

    }






    var re = /(\D*)(\d\S*)/;
    for(label in labels){
        try{
            let price = document.querySelectorAll(`.${labels[label]}`);
            if(price.length == 0) continue;
            for(ind in price){
                if(re.test(price[ind].textContent)){
                    let matchItem = re.exec(price[ind].textContent);
                    if(matchItem[1].indexOf('ARS') >= 0){
                        let p = matchItem[2].replace('.','').replace(',','.');
                        price[ind].textContent = '£' + (p / er).toFixed(2);
                    }
                }
            }
        }
        catch(err){
            console.log(err)
        }
    }

}
setTimeout(function(){moneyExchange(labels)}, 1000);
setInterval(function(){moneyExchange(labels)}, 3000);
window.onload = function(){moneyExchange(labels)};