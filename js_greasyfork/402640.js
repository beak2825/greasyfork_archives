// ==UserScript==
// @name         Aliexpress - Orders CSV2Clipboard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Exportando para CSV
// @author       Fernando Mendes
// @match        https://trade.aliexpress.com/orderList.htm*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/402640/Aliexpress%20-%20Orders%20CSV2Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/402640/Aliexpress%20-%20Orders%20CSV2Clipboard.meta.js
// ==/UserScript==

(function() {
    'use strict';
})();

var orders = [];
var reqs = [];
$(".order-item-wraper").each((ind, el)=>{
    var products = [];

//PRODUCTS
    $(el).find(".order-body").each((i,e)=>{
        $(e).find(".product-sets").each((i,e)=>{
            let obj = {
                title: $(e).find(".product-title").text().trim(),
                model: parseFloat($(e).find(".product-property span:first()").text().trim().slice(1).trim()),
                quantity: parseFloat($(e).find(".product-amount span:first()").text().trim().slice(1).trim()),
                price: parseFloat($(e).find(".product-amount span:first()").text().trim().slice(1).trim()),
                amount: $(e).find(".product-amount span:eq(1)").text().trim().slice(1)
            };
            products.push(obj);
            //        console.log(obj);
        });
        //  console.log(products);
    });

    var hasTracking = $(el).find(".button-logisticsTracking ").length > 0;


// ORDERS
    let order = {
        id: $(el).find(".order-info .first-row .info-body ").text().trim(),
        orderDate: Date.parse($(el).find(".order-info .second-row .info-body ").text().trim()),
        orderDateTxt: $(el).find(".order-info .second-row .info-body ").text().trim(),
        Store: $(el).find(".store-info .first-row .info-body ").text().trim(),
        StoreLnk: $(el).find(".store-info .second-row ").find('a').attr('href'),
        status: $(el).find(".order-status .f-left").text().trim(),
        timeleft: $(el).find(".left-sendgoods-day").getlefttime,
        orderPrice: $(el).find(".amount-num").textContent,
        productsPrice: products.map((it)=> it.price).reduce((a, b) => a + b, 0),
        productsNames: products.map((it)=> it.title).join(", "),
        productsModels: products.map((it)=> it.model).join(", "),
        quantity: products.map((it)=> it.quantity).join(", "),

        hasTracking: hasTracking,
        products: products,
    };

    var req = new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://trade.aliexpress.com/order_detail.htm?orderId=" + order.id,
            onload:(data)=>{
                order.shippingprice = data.textContent;
                resolve(order);
                orders.push(order);
            },
            onerror: () => reject(400)
        });
    });
//    reqs.push(req);


    if (hasTracking){
        var req = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://ilogisticsaddress.aliexpress.com/ajax_logistics_track.htm?orderId=" + order.id + "&callback=test",
                onload:(data)=>{
                    order.tracking = eval(data.responseText).tracking;
                    order.trackingNumber = order.tracking.map(it=>it.mailNo).join(", ");
                    resolve(order);
                    orders.push(order);
                },
                onerror: () => reject(400)
            });
        });
        reqs.push(req);
    } else{
        orders.push(order);
    }
});



$.when.apply(null, reqs).done(function(){
     console.log(orders);
     console.log(orders.length);
});
//<button id="search-btn" class="ui-button ui-button-primary search-btn" type="button">Search</button>


$('#mybutton').one('click', function(){
    var r=$('<input/>').attr({
        type: "button",
        id: "field",
        value: 'LOAD CSV'
    });
    $("body").append(r);
});
$('<button/>', {
    text: "LOAD", //set text 1 to 10
    id: 'csvBtn',
    click: function () {
        $("#csvBtn").text("Loading...");
        Promise.all(reqs).then(o =>{
            var s = "Id\tOrder_Date(ms)\tOrder_Date(txt)\tStore\tStore_Link\tStatus\tOrder_Price\tShipping_Cost\tAdjust_Price\tDiscount\tTotal_Amount\tPayment_Total\tPayment_Received\tPayment_Method\tPayment_Date\ttrackingNumber\tProduct_Id\t Product_Name\t Product_Model\t Quantity\t Product_Price\t url\n";
            orders.forEach(e=> {
                console.log(e);
                s += e.id + "\t";
                s += e.orderDate + "\t";
                s += e.orderDateTxt + "\t";
                s += e.Store + "\t";
                s += e.StoreLnk + "\t";
                s += e.status + "\t";
                s += e.timeleft + "\t";
                s += e.shippingprice + "\t";
                s += (e.trackingNumber || ' ') + "\t";
                s += e.productsNames + "\t";
//                s += e.productsModels + "\t";
                s += e.orderPrice + "\t";
                s += e.productsPrice + "\t";
                s += "https://trade.aliexpress.com/order_detail.htm?orderId=" + e.id;
                s += "\n";


            });
            console.log(s);
            GM_setClipboard (s);
            $("#csvBtn").text("Loaded to clipboard");
        });
    }
}).appendTo("#appeal-alert");

function test(data){ return data;}
