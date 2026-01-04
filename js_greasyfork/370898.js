// ==UserScript==
// @name         Torn company stock order
// @version      0.2.11
// @description  Automatically calculate stock percent based on sale and enter the order amount to order up to max capasity.
// @author       Nemithrell
// @match        https://www.torn.com/companies.php*
// @run-at       document-start
// @grant        none
// @namespace    Nemithrell
// @downloadURL https://update.greasyfork.org/scripts/370898/Torn%20company%20stock%20order.user.js
// @updateURL https://update.greasyfork.org/scripts/370898/Torn%20company%20stock%20order.meta.js
// ==/UserScript==

    window.onload = function() {

        //add CSS for API key entry
        var style_api = document.createElement("style");
        style_api.type = "text/css";
        style_api.innerHTML = `
         #apiKey {
        height: 18px;
        font-size: 1.5em;
        width: 400px;
        font-family: Verdana;
        letter-spacing: .05em;
        margin-left: 5px;
        margin-bottom: 5px;
        padding: 5px;
        }
.d .manage-company .stock .stock-list-title>li.name, .d .manage-company .stock .stock-list .name {
    width: 185px;
}
.d .manage-company .stock .stock-list-title>li.stock, .d .manage-company .stock .stock-list .stock {
    width: 96px;
}

.d .manage-company .stock .stock-list-title>li.sold-daily, .d .manage-company .stock .stock-list .sold-daily {
    width: 70px;
}
        `
        document.head.appendChild(style_api);
        if (document.getElementById("stock").getElementsByClassName("stock-list-wrap").length != 0) {
            if (addUI()){
                run();
            }
        }

        //Add observer to triger when the stock tab is selected
        var targetNode = document.getElementById("stock");
        var config = { attributes: true, childList: true, subtree: true };
        var callback = function(mutationsList) {
            for(var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    if (addUI()){
                        run();
                    }
                }
            }
        };
        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

}

function addUI (){
    if ( document.getElementsByClassName("StockAutoFill").length == 0 ){
        var div_api = document.createElement("div");
        div_api.className = "StockAutoFill";
        var apiKey = document.createElement("input");
        apiKey.type = "text";
        apiKey.id = "apiKey";
        apiKey.placeholder = "Enter API key here";
        apiKey.value = localStorage.getItem("_apiKey") ? localStorage.getItem("_apiKey") : "";
        div_api.appendChild(apiKey);

        var button_save = document.createElement("button");
        button_save.type = "button";
        button_save.innerText = "Save";
        button_save.id = "btn_save";
        div_api.appendChild(button_save);

        var cw = document.getElementById("stock").getElementsByClassName("stock-list-wrap");
        cw[0].parentNode.insertBefore(div_api, cw[0]);

//         var ms = document.getElementById("stock").querySelectorAll("div.info-wrap.left");
//         console.log(ms);
//         for(var i = 0; i < ms.length; ++i){
//             var div_maxStock = document.createElement("div");
//             div_maxStock.id = "maxStock";
//             div_maxStock.className = "delivery";
//             var span_maxStock = document.createElement("span");
//             span_maxStock.innerText = "";
//             div_maxStock.appendChild(span_maxStock);
//             ms[i].insertBefore(div_maxStock, ms[i].lastElementChild);
//         }

        document.getElementById("btn_save").addEventListener("click", function() {
            var key = document.getElementById("apiKey");
            if(localStorage.getItem("_apiKey") != key.value){
                localStorage.setItem("_apiKey", key.value);
                run();
            }
        });
        return true;
    }
    else{
        return false;
    }
}

function run(){
    var urlStock = 'https://api.torn.com/company/?selections=stock&key=';
    var urlStorage = 'https://api.torn.com/company/?selections=detailed&key=';
    urlStock += localStorage.getItem("_apiKey") ? localStorage.getItem("_apiKey") : '';
    urlStorage += localStorage.getItem("_apiKey") ? localStorage.getItem("_apiKey") : '';
    var storage

    fetch(urlStorage)
        .then(function(response) {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
        .then(function(myJson) {
        if (myJson.error){
            throw new Error(myJson.error.error);
        }
        storage = myJson.company_detailed.upgrades.storage_space;
    });

    fetch(urlStock)
        .then(function(response) {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
        .then(function(myJson) {
        if (myJson.error){
            throw new Error(myJson.error.error);
        }

        var totalSold = 0;
        var totalStock = 0;
        var availableStock = 0;
        var totalNeededStock = 0;
        var maxStock = 0;
        for (var key1 in myJson.company_stock) {
            totalSold += myJson.company_stock[key1].sold_amount;
            totalStock += myJson.company_stock[key1].in_stock;
            totalStock += myJson.company_stock[key1].on_order;
        }

        availableStock = storage - totalStock;
        for (var key2 in myJson.company_stock) {
            maxStock = 0;
            maxStock = storage * (myJson.company_stock[key2].sold_amount/totalSold);
            totalNeededStock += maxStock - (myJson.company_stock[key2].on_order + myJson.company_stock[key2].in_stock) > 0 ?  maxStock - (myJson.company_stock[key2].on_order + myJson.company_stock[key2].in_stock) : 0;
        }

        $( ".stock-list-title.bold.t-hide" ).find(".name")[0].firstChild.after(" (MaxStock)");
        $( ".stock-list-title.bold.t-hide" ).find(".stock")[0].firstChild.after(" (+order)");

        for (var key in myJson.company_stock) {
            if (myJson.company_stock.hasOwnProperty(key)) {
                var orderPercent = myJson.company_stock[key].sold_amount/totalSold
                var orderAmount = 0;
                maxStock = 0;
                maxStock = storage * (myJson.company_stock[key].sold_amount/totalSold);
                var neededStock = maxStock - (myJson.company_stock[key].on_order + myJson.company_stock[key].in_stock)
                var neededPercent = neededStock > 0 ? neededStock/totalNeededStock : 0;
                //var maxOrderAmount = Math.floor((storage * orderPercent) - myJson.company_stock[key].in_stock - myJson.company_stock[key].on_order);
                //var orderOfAvailable = Math.floor(availableStock * orderPercent);

                orderAmount = Math.floor(availableStock * neededPercent);
                //orderAmount = maxOrderAmount > 0 ? orderOfAvailable > 0 ? orderOfAvailable > maxOrderAmount ? maxOrderAmount : orderOfAvailable : 0 : 0;

//                 $( ".stock-list.fm-list.t-blue-cont.h" ).find("div:contains("+key+")").parent().find("#maxStock").find("span").text(Math.floor(maxStock));
                $( ".stock-list.fm-list.t-blue-cont.h" ).find("div:contains("+key+")").append(" (" + new Intl.NumberFormat('en-US').format(Math.floor(maxStock)) + ")");
                $( ".stock-list.fm-list.t-blue-cont.h" ).find("div:contains("+key+")").parent().find(".stock").append(" (" + new Intl.NumberFormat('en-US').format(myJson.company_stock[key].on_order + myJson.company_stock[key].in_stock) + ")");
//                $( ".stock-list.fm-list.t-blue-cont.h" ).find("div:contains("+key+")").parent().find(".cost").append(" (" + new Intl.NumberFormat('en-US').format(myJson.company_stock[key].sold_amount) + ")");
                if(orderAmount != 0)
                {
                    $( ".stock-list.fm-list.t-blue-cont.h" ).find("div:contains("+key+")").parent().find(".quantity").find("input").val(orderAmount);
                }
                $( ".stock-list.fm-list.t-blue-cont.h" ).find("div:contains("+key+")").parent().find(".quantity").find("input").trigger('keyup');
            }
        }
    }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ', error.message);
    });
}