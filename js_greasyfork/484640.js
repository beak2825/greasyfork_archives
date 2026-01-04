// ==UserScript==
// @name         客優雲揀貨單
// @namespace    http://tampermonkey.net/
// @version      0.12111111121
// @description  客優雲 揀貨單
// @author       You
// @match        https://api.keyouyun.com/jax/api/order/pick-list-print/v2?ordersns=*
// @match        https://world.keyouyun.com/jax/api/order/pick-list-print/v2?ordersns=*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484640/%E5%AE%A2%E5%84%AA%E9%9B%B2%E6%8F%80%E8%B2%A8%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/484640/%E5%AE%A2%E5%84%AA%E9%9B%B2%E6%8F%80%E8%B2%A8%E5%96%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log($('script'));
    $('script').remove();

    var apiDomainMapping = {'world':'world','erp':'api','api':'api'};
    var subDomain = window.location.host.split('.')[0];
    let params = new URLSearchParams(document.location.search);
    let ordersns = params.get("ordersns").split(',');

    let isPrint = params.get("print");
    console.log(isPrint);

    Array.prototype.sortBy = function (propertyName, sortDirection) {

        var sortArguments = arguments;
        this.sort(function (objA, objB) {

            var result = 0;
            for (var argIndex = 0; argIndex < sortArguments.length && result === 0; argIndex += 2) {

                var propertyName = sortArguments[argIndex];
                result = (objA[propertyName] < objB[propertyName]) ? -1 : (objA[propertyName] > objB[propertyName]) ? 1 : 0;

                //Reverse if sort order is false (DESC)
                result *= !sortArguments[argIndex + 1] ? 1 : -1;
            }
            return result;
        });

    }



    //$('#ethan').append(body);
    //console.log(body);

    $('b[style="color: red"]').each((index,ele)=>{
        if($(ele).text()!="1"){
            $(ele).attr("style","color:red;font-weight:bold;font-size: xx-large;");
        }
        else{
            $(ele).attr("style","color:blue;font-weight:bold;");
        }
    });

    $('div[style="width: 240px;"]').attr('style',"width: 400px;");
    $('#img img').attr("style","width: 130px;height: 130px;");
    $('span:contains("订单号")').attr("style","color:brown;font-weight:bold; font-size: x-large");




    //console.log(ordersns.join(' '));
    var orderList = [];
    $.ajax({
        url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/shop-recent-orders/v4`,
        type:"POST",
        data:JSON.stringify({"page":0,"size":1000,"likeOrdersn":`${ordersns.join(' ')}`,"kyyOrderStatus":"","orderStatus":"READY_TO_SHIP","beginDateTime":"","endDateTime":""}),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data){
            console.log(data);
            orderList = data.orderList;

        },
        async: false
    });

    var getStockParams = {"warehouseOrderStockList": ordersns.map(x=>({"ordersn":x,"warehouseId":"1454426052596420608"}))};
    console.log(getStockParams);
    //[{"ordersn":"22090524A5X6JT","warehouseId":"1454426052596420608"},{"ordersn":"22090523NVFABU","warehouseId":"1454426052596420608"},{"ordersn":"22090522PN0TWE","warehouseId":"1454426052596420608"},{"ordersn":"22090521JQUFP9","warehouseId":"1454426052596420608"},{"ordersn":"22090520S2S0PJ","warehouseId":"1454426052596420608"},{"ordersn":"2209051YQ5FJDM","warehouseId":"1454426052596420608"},{"ordersn":"2209051Y5QKJ76","warehouseId":"1454426052596420608"},{"ordersn":"2209051Y3HYSNB","warehouseId":"1454426052596420608"},{"ordersn":"2209051UVBBW9C","warehouseId":"1454426052596420608"},{"ordersn":"2209051U8TSAPV","warehouseId":"1454426052596420608"},{"ordersn":"2209051QYWUF1G","warehouseId":"1454426052596420608"},{"ordersn":"2209051QXE580X","warehouseId":"1454426052596420608"},{"ordersn":"220904VVBKQBR5","warehouseId":"1454426052596420608"},{"ordersn":"220903S1SK7J1X","warehouseId":"1454426052596420608"}]}
    var stockList = [];
    $.ajax({
        url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/sc-item/stock`,
        type:"POST",
        data:JSON.stringify(getStockParams),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data){
            console.log(data);
            stockList = data;

        },
        async: false
    });



    var htmlList = [];
    for(var i=0;i<orderList.length;i++){
        var order = orderList[i];

        for(var j = 0;j<order.items.length;j++){
            var item = order.items[j];
            var stock = stockList.filter(x=>x.ordersn == order.ordersn && x.orderItemId == item.id);
            if(stock.length>0){
                stock = stock[0];
                var skuTitle = stock.itemStockInfo ? stock.itemStockInfo.scItemInfo.skuTitle:"";
                item.skuTitle = skuTitle;
            }


        }
        var orderHtml = $(`table:contains("${order.ordersn}")`);
        htmlList.push({'ordersn':order.ordersn,'html':orderHtml});
    }


    //console.log(htmlList);
    $('body').html('<div id="ethan"></div>');

    //var a = orderList.map(x=>({x.shippingCarrier,x.createTime}));
    //console.log(
    //var a = orderList.map(x=> ({ 'shippingCarrier': x.shippingCarrier,'createTime':x.createTime,'ordersn':x.ordersn}));
    //console.log(a);

    //orderList = orderList.sort(sortByCreateTime);

    //a = orderList.map(x=> ({ 'shippingCarrier': x.shippingCarrier,'createTime':x.createTime,'ordersn':x.ordersn}));
    //console.log(a);

    //orderList = orderList.sort(sortByStore);

    //a = orderList.map(x=> ({ 'shippingCarrier': x.shippingCarrier,'createTime':x.createTime,'ordersn':x.ordersn}));
    //console.log(a);


    var presentString = isPrint ? "":"<span style='color:red;font-weight:bold;font-size: xx-large;'>要給小禮物唷</span>";




    for( i=0;i<orderList.length;i++){
        console.log(i);
        order = orderList[i];
        order.number = order.items.map(item => item.variationQuantityPurchased).reduce((prev, next) => prev + next);
        orderHtml = htmlList.filter(x=>x.ordersn==order.ordersn)[0];
        orderHtml.html.find('td:contains("打印时间")').html(`<p>超商：${order.shippingCarrier}</p>
                            <p>總件數:<span style='color:${order.number>1?'red':'blue'};font-weight:bold;font-size: xx-large;'>${order.number}</p>
                            <p>總金額:${order.payAmount}</p>`);
        orderHtml.html.find('span:contains("店铺名称")').remove();

        orderHtml.html.find('span:contains("订单号")').html(`${orderHtml.html.find('span:contains("订单号")').html().replace("订单号：","訂單編號：")}<br>`);

        if(order.messageToSeller){
            orderHtml.html.find('p:contains("订单留言：")').attr("style","color:red;font-weight:bold; font-size: large");
            orderHtml.html.find('p:contains("订单留言")').html(`${orderHtml.html.find('p:contains("订单留言")').html().replace("订单留言","訂單留言")}<br>`);
        }else{
            orderHtml.html.find('p:contains("订单留言")').remove();
        }

        if(order.note){
            orderHtml.html.find('p:contains("内部备注：")').attr("style","color:red;font-weight:bold; font-size: large");
        }
        orderHtml.html.find('p:contains("内部备注：")').html(`${orderHtml.html.find('p:contains("内部备注：")')
                                                        .html().replace("内部备注：","內部備註：")}<br>${order.payAmount>2000? presentString:''}`)
            .after(`<p style="color:brown;font-weight:bold; font-size: x-large">訂單編號：${order.ordersn}</p>`);
        //orderHtml.html.find('#img img').attr("style","width: 130px;height: 130px;");


        //orderHtml.html.find('td:contains("內部備註：")').attr("colspan",2).after(`<td colspan="2" style="border-radius: 99em; border: 10px solid #0055d4;text-align:center;vertical-align：middle"><p>總件數:<span style='color:${order.number>1?'red':'blue'};font-weight:bold;font-size: xxx-large; border-radius: 99em;'>${order.number}</p></td>`);

        orderHtml.html.find('td:contains("內部備註：")').attr("colspan",2).after(`<td colspan="2"><div style="border: 20px solid ${order.number>1?'#0055d4':'white'};text-align:center;vertical-align：middle;"><p><span style='color:#0055d4;font-weight:bold;font-size:70px; border-radius: 99em;'>${order.number}</p></div></td>`);





        if(isPrint){
            orderHtml.html.find('#img').remove();
            orderHtml.html.find('div:contains("商品名")').remove();
            orderHtml.html.find('p:contains("內部備註：")').remove();
        }else{
            orderHtml.html.find('p:contains("商品SKU: ")').remove();

            orderHtml.html.find('td:contains("规格SKU: ")').each((index,ele)=>{
                var sku = $(ele).find('p').html().replace("规格SKU: ","");
                console.log(sku);
                var skuItems = order.items.filter(item=>item.variationSku == sku);
                var skuTitle= skuItems.length > 0 ? skuItems[0].skuTitle : sku;
                $(ele).html(`<div style="width: 400px;">商品名：${skuTitle}</div><p>規格SKU:<span style='color:blue;font-weight:bold;'>${sku}</span></p>`);
            });

        }

        /*
        orderHtml.html.find('div:contains("商品名：")').each((index,ele)=>{
            order.items.filter(item=>item.
            [index].skuTitle
            $(ele).html(`商品名：${order.items[index].skuTitle}`);
        });
*/




        $('#ethan').append(orderHtml.html);
        if(i<orderList.length-1){
            $('#ethan').append('<div class="page"></div>');
        }
    }

    if(!isPrint){
        //window.open(`${window.location.href}&print=true`);
    }
    //console.log($('#ethan').html());

    /*


    orderList = orderList.sortBy("shippingCarrier",true,"createTime",true);
    console.log(orderList.map(x=>{x.shippingCarrier,x.createTime}));
*/
    function sortByStore(a, b) {


        var mapping = {"全家":3,"萊爾富":1,"7-ELEVEN":2,"蝦皮店到店":4,"OK Mart":4,"蝦皮店到店 - 隔日到貨":4,"店到家宅配":4};
        var storeA = mapping[a.shippingCarrier]; // ignore upper and lowercase
        var storeB = mapping[b.shippingCarrier]; // ignore upper and lowercase
        if (storeA < storeB) {
            return -1;
        }
        if (storeA > storeB) {
            return 1;
        }
        // names must be equal
        return 0;
    };

    function sortByCreateTime(a,b){
        var timeA = new Date(a.createTime);
        var timeB = new Date(b.createTime);
        if (timeA < timeB) {
            return -1;
        }
        if (timeA > timeB) {
            return 1;
        }
        // names must be equal
        return 0;
    }
    //https://api.keyouyun.com/jax/api/order/shop-recent-orders/v4
    //{"page":0,"size":50,"likeOrdersn":"220904TTE4QXXJ 220903TDSQDJYN","kyyOrderStatus":"PROCESSED","orderStatus":"READY_TO_SHIP","beginDateTime":"","endDateTime":""}

    //實付=>payAmount>2000

    //成立時間=>createTime 舊的排前面

    //訂單號放大

    //超商跟總件數

    //超商 依  ok 7-11 萊爾富 全家排




    // Your code here...
})();