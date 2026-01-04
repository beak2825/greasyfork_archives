// ==UserScript==
// @name         客優雲配貨單
// @namespace    http://tampermonkey.net/
// @version      0.1112111
// @description  客優雲配貨單 功能
// @author       You
// @match        https://erp.keyouyun.com/printPreview/invoice/*
// @match        https://world.keyouyun.com/printPreview/invoice/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyouyun.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463389/%E5%AE%A2%E5%84%AA%E9%9B%B2%E9%85%8D%E8%B2%A8%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/463389/%E5%AE%A2%E5%84%AA%E9%9B%B2%E9%85%8D%E8%B2%A8%E5%96%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var apiDomainMapping = {'world':'world','erp':'api'};
    var subDomain = window.location.host.split('.')[0];
    var paths = window.location.pathname.split('/');
    //console.log(paths[paths.length-1]);
    var fileName = paths[paths.length-1];

    var data = JSON.parse(sessionStorage.getItem(`printData${fileName}`));

    var firstStocks = ["A1","B1","C1","D1"];

    var orginMapping = {};
    data.boxInfos.orderNos.forEach(function (value, i) {
        orginMapping[i+1]=value;
    });

    //console.log(orginMapping);


    var ordersns = data.boxInfos.orderNos;
    //console.log(ordersns);
    var orderList = [];
    $.ajax({
        url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/shop-recent-orders/v4`,
        type:"POST",
        data:JSON.stringify({"page":0,"size":1000,"likeOrdersn":`${ordersns.join(' ')}`,"kyyOrderStatus":"","orderStatus":"READY_TO_SHIP","beginDateTime":"","endDateTime":""}),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data){
            //console.log(data);
            orderList = data.orderList;

        },
        xhrFields: {
            withCredentials: true
        },
        async: false
    });

    orderList = orderList.sort(sortByCreateTime);
    orderList = orderList.sort(sortByStore);


    //console.log(orderList);

    ordersns = orderList.map(x=>x.ordersn);

    var newMapping = {};
    ordersns.forEach(function (value, i) {
        newMapping[value]=i+1;
    });



    //console.log(data);

    for(var item of data.items){
        item.orderNumber = item.goodsCode.value;
        if(firstStocks.includes(item.orderNumber.substring(0,2))){
            item.stockBlock = 0;
        }else{
            item.stockBlock = 1;
        }
        /*
        var boxList = [];
        for(var boxs of item.boxInfos.value){
            //console.log(`old:${boxs}`);
            var matches=/盒子号: (\d+),/g.exec(boxs)
            var originBox = matches[0];
            var newBox = newMapping[orginMapping[matches[1]]];
            boxs = boxs.replace(originBox,`盒子号: ${newBox},`);
            //console.log(`new:${boxs}`);
            boxList.push({newBox,boxs});
        }
        item.boxInfos.value = boxList.sort(function(a, b) {
            return a.newBox-b.newBox;
        }).map(x=>x.boxs);
       */

    }
    data.items = data.items.sort(sortByStockBlockProduct);

    //console.log(data);



    data.boxInfos.orderNos = ordersns;

    sessionStorage.setItem(`printData${fileName}`,JSON.stringify(data));

    var tmp = localStorage.getItem(fileName);
    console.log(tmp);
    if(tmp!=null){

        console.log(1);
    }else{
        console.log(2);
        localStorage.setItem(fileName,fileName);
        window.location.reload();

    }



    setTimeout(()=>{
        $('.goods-list__item').each((index,ele)=>{
            $(ele).attr('style',"page-break-inside: avoid;");
        });
        $('.k-zoomable-image-wrapper').each((index,ele)=>{
            $(ele).attr('style',"width: 180px; height: 180px;");
        });

        $('.goods-list__item__body__number-info__goods-preempt').each((index,ele)=>{
            //console.log($(ele));
            var text = $(ele).text().trim();
            console.log(text);
            if(text!="货品预占总数: 1"){
                $(ele).html(`總數量: <span style="color:red;font-weight:bold;font-size: xxx-large;">${text.replace("货品预占总数: ","")}</span>`);
            }else{
                $(ele).html(`總數量: <span style="color:blue;font-weight:bold;font-size: x-large;">${text.replace("货品预占总数: ","")}</span>`);
            }
        });

        $('.goods-list__item__body__goods-info__goods-sku-attribute').each((index,ele)=>{
            //console.log($(ele));
            var text = $(ele).text().trim();
            $(ele).html(`SKU:<span style="color:blue;font-weight:bold;font-size: xx-large;">${text.replace("货品sku属性: ","")}</span>`);

        });

        $('.box-info-margin').each((index,ele)=>{
            //console.log($(ele));
            $(ele).attr('style',"margin-left: 190px;");

            var text = $(ele).text().trim();
            var html = `<span>${text.replace("盒子信息: ","")}`;
            html = html.replaceAll(/盒子号: /ig,`</span><br/><span style="font-size: large;">盒子:</span><span style="color:brown;font-weight:bold;font-size: xx-large;">`).replaceAll(/, 需要数量: /ig,`</span>, 數量: <span style="color:blue;font-weight:bold;font-size: xx-large;">`);
            $(ele).html(html);

        });


        $('.goods-list__item__body__depot-info').remove();



        var totalHeight = $(".v-card__text.card-text").prop('scrollHeight');

        var times = parseInt(totalHeight/200);
        console.log(times);
        for(var j=1;j<=times;j++){

            (function(times,j){
                setTimeout(()=>{
                    scrollDiv(j*200);
                },5000/times*j);
            }(times,j));
        }


        setTimeout(()=>{
            setTimeout(()=>{
                $('#appRoot').html($('#printInvoicePreview').html());
            },5000);

        },5000);
    },5000);


    //
    //<div style="page-break-after: always;"></div>

    function scrollDiv(height){
        console.log(height);
        $(".v-card__text.card-text").scrollTop(height);
    }

    function sortByStockBlockProduct(a, b) {

        if(a.stockBlock>b.stockBlock){
            return 1;
        }
        if(a.stockBlock<b.stockBlock){
            return -1
        }

        if (a.orderNumber < b.orderNumber) {
            return -1;
        }
        if (a.orderNumber > b.orderNumber) {
            return 1;
        }
        // names must be equal
        return 0;
    };

    function sortByProduct(a, b) {

        if (a.orderNumber < b.orderNumber) {
            return -1;
        }
        if (a.orderNumber > b.orderNumber) {
            return 1;
        }
        // names must be equal
        return 0;
    };


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
    // Your code here...
})();