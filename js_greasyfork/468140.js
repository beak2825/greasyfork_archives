// ==UserScript==
// @name         MetZi
// @namespace    zero.markettracker.torn
// @version      0.2
// @description  checks your bazaar price against the best market price
// @author       -zero [2669774]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468140/MetZi.user.js
// @updateURL https://update.greasyfork.org/scripts/468140/MetZi.meta.js
// ==/UserScript==

const api = ''; // ENTER YOUR API HERE


const result = `<div id ="metzi" ><table id="metZiTable" style="margin:auto;border:2px solid white;width:50%;s"><th>Item Id</th><th>Price</th><th>Best Price</th></table></div>`;
var itemInfo = {};
async function bestPrice(id){
    var priceData = await $.getJSON(`https://api.torn.com/market/${id}?selections=bazaar,itemmarket&key=${api}&comment=MetZi`);
    var bbazar = 0;
    var iprice = 0;
    if (priceData.bazaar){
        bbazar = parseInt(priceData.bazaar[0].cost);
    }
    if (priceData.itemmarket){
        iprice = parseInt(priceData.itemmarket[0].cost);
    }
    if (bbazar == 0 && iprice > 0){
        return iprice;
    }
    if (bbazar > 0 && iprice == 0){
        return bbazar;
    }



    if (bbazar < iprice){
        return bbazar;
    }
    return iprice;

}

async function check(){
    var bazitems =await $.getJSON(`https://api.torn.com/user/?selections=bazaar&key=${api}&comment=MetZi`);
    var caution = "";

    for (var itemsN in bazitems.bazaar){
        var items = bazitems.bazaar[itemsN];
        console.log(items);
        var itemid = items.ID;
        var price = items.price;
        var bestprice = await bestPrice(itemid);
        var color = 'green';

        if (bestprice < price){
            color = 'red';
        }
        var block = `<tr id = "metzi${itemid}">
                     <td style="color:${color};text-align: center;border:2px solid white;">${itemInfo[itemid].name}</td>
                     <td style="color:${color};text-align: center;border:2px solid white;">${price.toLocaleString("en-US")}</td>
                     <td style="color:${color};text-align: center;border:2px solid white;">${bestprice.toLocaleString("en-US")}</td>
                     </tr>`;
        if ($(`#metzi${itemid}`).length == 0){

            $(`#metZiTable`).append(block);
        }
        else{
            var nblock = `<td style="color:${color};text-align: center;border:2px solid white;">${itemInfo[itemid].name}</td>
                     <td style="color:${color};text-align: center;border:2px solid white;">${price.toLocaleString("en-US")}</td>
                     <td style="color:${color};text-align: center;border:2px solid white;">${bestprice.toLocaleString("en-US")}</td>`;
            $(`#metzi${itemid}`).html(nblock);
            if (bestprice < price){
                caution += `Price for ${itemInfo[itemid].name} has been undercut. Your Price: ${price} Current Best Price:${bestprice}` + "\n";
                // alert(`Price for ${itemInfo[itemid].name} has been undercut. Your Price: ${price} Current Best Price:${bestprice}`);
            }

        }




        console.log(`${itemInfo[itemid].name} Price:${price} BPrice:${bestprice} ${color}`);

    }
    if (caution){
        alert(caution);
    }

}

async function insert(){
    if ($('#header-root').length > 0){
        $('#header-root').append(result);
        var resp =await $.getJSON(`https://api.torn.com/torn/?selections=items&key=${api}`);
        itemInfo = resp.items;
        check();

    }
    else{
        setTimeout(insert, 300);
    }

}

(function() {
    'use strict';

    insert();
    setTimeout(check, 20000);
})();