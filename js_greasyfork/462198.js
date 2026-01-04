// ==UserScript==
// @name         客優雲待處理訂單功能
// @namespace    http://tampermonkey.net/
// @version      2025-12-22
// @description  客優雲選特定物流
// @author       You
// @match        https://erp.keyouyun.com/orders/pending
// @match        https://world.keyouyun.com/orders/pending
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyouyun.com
// @grant        GM_xmlhttpRequest
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462198/%E5%AE%A2%E5%84%AA%E9%9B%B2%E5%BE%85%E8%99%95%E7%90%86%E8%A8%82%E5%96%AE%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/462198/%E5%AE%A2%E5%84%AA%E9%9B%B2%E5%BE%85%E8%99%95%E7%90%86%E8%A8%82%E5%96%AE%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{

        //<button type="button" class="v-btn" style="" id="okbutton"><div class="v-btn__content">勾選ok mart</div></button>
        //<button type="button" class="v-btn" style="" id="familybutton"><div class="v-btn__content">勾選Family</div></button>
        //<button type="button" class="v-btn" style="" id="711button"><div class="v-btn__content">勾選7-11</div></button>
        //<button type="button" class="v-btn" style="" id="hilifebutton"><div class="v-btn__content">勾選Hi-Life</div></button>
        //<button type="button" class="v-btn" style="" id="test"><div class="v-btn__content">測試</div></button>
        //<button type="button" class="v-btn" style="" id="print711Order"><div class="v-btn__content">列印-7-11特定單號</div></button>
        //<button type="button" class="v-btn" style="" id="applyTrackNumber"><div class="v-btn__content">申請運單號</div></button>
        //<button type="button" class="v-btn" style="" id="moveToDid"><div class="v-btn__content">移動到已處理</div></button>
        //<button type="button" class="v-btn" style="background-color: #7686da" id="printhilifebutton"><div class="v-btn__content">1.列印-Hi-Life</div></button>
        //<button type="button" class="v-btn" style="background-color: #7686da" id="print711button"><div class="v-btn__content">2.列印-7-11</div></button>
        //<button type="button" class="v-btn" style="background-color: #7686da" id="printfamilybutton"><div class="v-btn__content">3.列印-全家</div></button>
        //<button type="button" class="v-btn" style="background-color: #7686da" id="printokbutton"><div class="v-btn__content">4.列印-OK</div></button>
        //

        var button = $('button[data-v-ta="batchApplicationWaybillNumber"]:contains("申請寄件編號")').first();
        button.before(`<div  class="flex order-top-operation-button-group py-2 xs10">
        <button type="button" class="v-btn" style="" id="tagbutton"><div class="v-btn__content">上物流標籤</div></button>
        <button type="button" class="v-btn" style="" id="uploadToGoogle"><div class="v-btn__content">上傳至雲端分單</div></button>

        <button type="button" class="v-btn" style="" id="checkCanApply"><div class="v-btn__content">挑選可配貨</div></button>
        <button type="button" class="v-btn" style="" id="printPickList"><div class="v-btn__content">列印揀貨單</div></button>
        <button type="button" class="v-btn" style="" id="printInvoice"><div class="v-btn__content">列印配貨單</div></button>
</div>
    `);
        var button1 = $('button[data-v-ta="batchSpeedPrintSheet"]:contains(" 列印寄件單 ")').first();
        button1.after(`<div  class="flex order-top-operation-button-group py-1 xs2">

        <button type="button" class="v-btn" style="" id="printAlreadybutton"><div class="v-btn__content">上已代打包標籤</div></button>
</div>
    `);
        var apiDomainMapping = {'world':'world','erp':'api'};
        var subDomain = window.location.host.split('.')[0];
        var thisWareHouseId = getWareHouseId();
        checkWareHouse();

        $('button:contains("發貨預報")').hide();
        $('#applyTrackNumber').hide();
        $('button[data-v-ta="searchReset"]').click(function(){

            checkWareHouse();
        });

        $('#printPickList').click(function(){
            setTimeout(()=>{
                let ordersns = getCheckedOrdersns();
                var orderList = [];
                window.open(`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/pick-list-print/v2?ordersns=${ordersns.join(',')}&logisticsId=true`);


            },1000);

        });

        $('#printInvoice').click(function(){
            setTimeout(()=>{
                triggerKYYPrintInvoice();
            },1000);

        });

        $('#print711Order').click(function(){
            print711Order();
        });

        $('#okbutton').click(function(){
            unSelectAll();
            setTimeout(()=>{
                selectOK();

                setTimeout(()=>{
                    setTimeout(()=>{
                        //triggerKYYPrint();
                    },3000);
                },1000);
            },1000);
        });



        var tagsMapping = {"7-ELEVEN":"E1663D","萊爾富":"62B171","全家":"7B4119","蝦皮店到店":"A9F956","OK Mart":"A9F956","蝦皮店到店 - 隔日到貨":"A9F956","店到家宅配":"A9F956"};

        $('#moveToDid').click(function(){
            let ordersns = getCheckedOrdersns();
            var params={"ordersns":ordersns,"type":2,"moveToStatus":"PENDED_ORDER"};

            $.ajax({
                url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/pending/status`,
                type:"PUT",
                data:JSON.stringify(params),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    console.log(data);

                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });

            params.type=3;

            $.ajax({
                url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/pending/status`,
                type:"PUT",
                data:JSON.stringify(params),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    console.log(data);

                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });
            $('.v-tabs__item:contains("已處理")').get(0).click();
        });

        $('#applyTrackNumber').click(function(){

            setTimeout(()=>{
                let ordersns = getCheckedOrdersns();
                var orderList = [];
                if(ordersns.length>0){

                    /*
                    $.ajax({
                        url:'https://world.keyouyun.com/jax/api/order/shop-recent-orders/v4',
                        type:"POST",
                        data:JSON.stringify({"page":0,"size":100,"likeOrdersn":`${ordersns.join(' ')}`,kyyOrderStatus:"PENDING","orderStatus":"READY_TO_SHIP","beginDateTime":"","endDateTime":""}),
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


                    var senderRealName = "廖娜綺";

                    for(var i=0;i<orderList.length;i++){

                        var order = orderList[i];
                        var assignSlug = tagsMapping[order.shippingCarrier] == tagsMapping["蝦皮店到店"] ? "&slug=SLTW001":"";

                        if(!tagsMapping[order.shippingCarrier]){
                            continue;
                        }
                        //console.log(assignSlug);
                        $.ajax({
                            url:'https://world.keyouyun.com/jax/api/order/apply-trackNumber/v2',
                            type:"GET",
                            data:`dropoff=true&senderRealName=${senderRealName}&ordersn=${order.ordersn}&shopId=${order.shopId}${assignSlug}`,
                            success: function(data){
                                console.log(data);

                            },
                            xhrFields: {
                                withCredentials: true
                            },
                            async: false
                        });
                    }
                    */
                    triggerKYYApplicationWaybillNumber();
                    $('.v-tabs__item:contains("已申請寄件編號")').get(0).click()
                }

                $('#applyTrackNumber').hide();

            },1000);

        });


        $('#checkCanApply').click(function(){
            selectAll();
            setTimeout(()=>{
                let ordersns = getCheckedOrdersns();
                var orderList = [];
                $.ajax({
                    url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/shop-recent-orders/v4`,
                    type:"POST",
                    data:JSON.stringify({"page":0,"size":100,"likeOrdersn":`${ordersns.join(' ')}`,kyyOrderStatus:"PENDING","orderStatus":"READY_TO_SHIP","beginDateTime":"","endDateTime":"","warehouseId":thisWareHouseId}),
                    contentType:"application/json; charset=utf-8",
                    dataType:"json",
                    success: function(data){
                        console.log(data);
                        orderList = data.orderList;

                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    async: false
                });


                var getStockParams = {"warehouseOrderStockList": ordersns.map(x=>({"ordersn":x,"warehouseId":thisWareHouseId}))};
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
                    xhrFields: {
                        withCredentials: true
                    },
                    async: false
                });


                var stockNotReadyList = stockList.filter(x=>x.stockStatus.no!=2).map(x=>x.ordersn);

                var readyList = stockList.filter(x=>x.stockStatus.no==2).map(x=>x.ordersn);


                unSelectTargetList(readyList,stockNotReadyList);

                alert("ok");
                $('#applyTrackNumber').show();

            },1000);
        });

        function triggerKYYPrintInvoice(){
            $('a>div.v-list__tile__content>div.v-list__tile__title:contains("快速列印配貨單")').first().click();

        }

        function triggerKYYPrint(){
            $('button[data-v-ta="batchSpeedPrintSheet"]:contains(" 列印寄件單 ")').click();
        }

        function triggerKYYApplicationWaybillNumber(){
            $('button[data-v-ta="batchApplicationWaybillNumber"]:contains(" 申請寄件編號 ")').click();
        }



        function selectAll(){

            var check = $('div.order-data-table__header .v-input--selection-controls__ripple.primary--text');
            if(check.length==0){

                $('div.order-data-table__header .v-input--selection-controls__ripple').first().click();

            }

        }

        function unSelectAll(){

            var check = $('div.order-data-table__header .v-input--selection-controls__ripple.primary--text');
            if(check.length>0){
                $('div.order-data-table__header .v-input--selection-controls__ripple').first().click();

            }else{
                $('div.order-data-table__header .v-input--selection-controls__ripple').first().click();
                $('div.order-data-table__header .v-input--selection-controls__ripple').first().click();
            }

        }

        function unSelectTargetList(selectList,unSelectList){
            $('div.pending-order-item ').each((index,ele)=>{

                var check = $(ele).find('div.v-input--selection-controls__ripple.primary--text');
                if(check.length>0){

                    var orderid = $(ele).find(`div.v-order-item-header p:contains('assignment') span`).text() ? $(ele).find(`div.v-order-item-header p:contains('assignment') span`).text(): $(ele).find(`div.ordersn-wrapper span`).text();

                    if(!selectList.includes(orderid) || unSelectList.includes(orderid)){
                        $(ele).find('div.v-input--selection-controls__ripple').first().click();

                    }
                }
            });
        }

        function getCheckedOrdersns(){
            let ordersns = [];
            $('div.pending-order-item ').each((index,ele)=>{

                var check = $(ele).find('div.v-input--selection-controls__ripple.primary--text');
                if(check.length>0){

                    var orderid = $(ele).find(`div.v-order-item-header p:contains('assignment') span`).text() ? $(ele).find(`div.v-order-item-header p:contains('assignment') span`).text(): $(ele).find(`div.ordersn-wrapper span`).text();

                    ordersns.push(orderid);

                }
            });
            console.log(ordersns);
            return ordersns;
        }

        $('#okbutton').click(function(){
            selectOK();
            alert("ok");
        });
        $('#711button').click(function(){

            $('div.pending-order-item:contains(" 7-ELEVEN")').each((index,ele)=>{
                console.log($(ele));
                $(ele).find('div.v-input--selection-controls__ripple').first().click();
            });
            //alert("ok");
        });

        $('#hilifebutton').click(function(){

            $('div.pending-order-item:contains(" 萊爾富")').each((index,ele)=>{
                console.log($(ele));
                $(ele).find('div.v-input--selection-controls__ripple').first().click();
            });
            alert("ok");
        });

        $('#familybutton').click(function(){

            selectFamily();
            alert("ok");
        });

        function selectOK(){
            $('div.pending-order-item:contains(" OK Mart")').each((index,ele)=>{
                //console.log($(ele));
                $(ele).find('div.v-input--selection-controls__ripple').first().click();
            });
            $('div.pending-order-item:contains(" 蝦皮店到店")').each((index,ele)=>{
                //console.log($(ele));
                $(ele).find('div.v-input--selection-controls__ripple').first().click();
            });
            $('div.pending-order-item:contains(" 店到家宅配")').each((index,ele)=>{
                //console.log($(ele));
                $(ele).find('div.v-input--selection-controls__ripple').first().click();
            });
        }

        function selectFamily(){

            $('div.pending-order-item:contains(" 全家")').each((index,ele)=>{
                //console.log($(ele));
                $(ele).find('div.v-input--selection-controls__ripple').first().click();
            });

        }


        $('#printokbutton').click(function(){


            unSelectAll();
            setTimeout(()=>{
                selectOK();

                setTimeout(()=>{
                    setTimeout(()=>{
                        triggerKYYPrint();
                    },3000);
                },1000);
            },1000);
        });

        $('#printfamilybutton').click(function(){
            unSelectAll();
            setTimeout(()=>{
                selectFamily();
                setTimeout(()=>{
                    setTimeout(()=>{
                        triggerKYYPrint();
                    },3000);
                },1000);
            },1000);
        });

        $('#print711button').click(function(){
            selectAll();
            let ordersns = getCheckedOrdersns();
            var orderList = [];
            $.ajax({
                url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/shop-recent-orders/v4`,
                type:"POST",
                data:JSON.stringify({"page":0,"size":100,"likeOrdersn":`${ordersns.join(' ')}`,kyyOrderStatus:"PENDED_ORDER","orderStatus":"READY_TO_SHIP","beginDateTime":"","endDateTime":"","tagIds":["proxyPackage"],"includeTags":false,"warehouseId":thisWareHouseId}),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    console.log(data);
                    orderList = data.orderList;

                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });

            orderList = orderList.sort(sortByCreateTime);
            console.log(orderList);

            var orderList711 = orderList.filter(x=>x.shippingCarrier=="7-ELEVEN").map(x=>x.trackingNo);





            var form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", "https://epayment.7-11.com.tw/C2C/C2CWeb/MultiplePrintC2CPinCode.aspx");



            var fields = {"eshopid": "833,832","PinCodes":orderList711.join(','),"BackTag":"https://seller.shopee.tw/portal/sale/","member_pwd": "833833,832832"};

            for(var field in fields){
                var hiddenField = document.createElement("input");

                hiddenField.setAttribute("name", field);
                hiddenField.setAttribute("value", fields[field]);
                form.appendChild(hiddenField);
            }

            function submitToPopup(f) {
                var w = window.open('', 'form-target', 'width=600, height=400, any-other-option, ...');
                f.target = 'form-target';
                f.submit();
            };

            document.body.appendChild(form);

            submitToPopup(form);

            form.remove();


            /*
            var params={"ordersn":"220909CR71MWQ6","tagIds":["waybill","pickList","A9F956"]};
            $.ajax({
                url:'https://world.keyouyun.com/jax/api/order/tag',
                type:"OPTIONS",
                data:JSON.stringify(params),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    console.log(data);
                    stockList = data;

                },
                async: false
            });
            $.ajax({
                url:'https://world.keyouyun.com/jax/api/order/tag',
                type:"PUT",
                data:JSON.stringify(params),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    console.log(data);
                    stockList = data;

                },
                async: false
            });
            */

        });

        function print711Order(){

            var orderList711 = ["R93007840385"];





            var form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", "https://epayment.7-11.com.tw/C2C/C2CWeb/MultiplePrintC2CPinCode.aspx");



            var fields = {"eshopid": "833,832","PinCodes":orderList711.join(','),"BackTag":"https://seller.shopee.tw/portal/sale/","member_pwd": "833833,832832"};

            for(var field in fields){
                var hiddenField = document.createElement("input");

                hiddenField.setAttribute("name", field);
                hiddenField.setAttribute("value", fields[field]);
                form.appendChild(hiddenField);
            }

            function submitToPopup(f) {
                var w = window.open('', 'form-target', 'width=600, height=400, any-other-option, ...');
                f.target = 'form-target';
                f.submit();
            };

            document.body.appendChild(form);

            submitToPopup(form);

            form.remove();



        }

        $('#printhilifebutton').click(function(){

            selectAll();
            let ordersns = getCheckedOrdersns();
            var orderList = [];
            $.ajax({
                url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/shop-recent-orders/v4`,
                type:"POST",
                data:JSON.stringify({"page":0,"size":100,"likeOrdersn":`${ordersns.join(' ')}`,kyyOrderStatus:"PENDED_ORDER","orderStatus":"READY_TO_SHIP","beginDateTime":"","endDateTime":"","tagIds":["proxyPackage"],"includeTags":false,"warehouseId":thisWareHouseId}),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    console.log(data);
                    orderList = data.orderList;

                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });

            orderList = orderList.sort(sortByCreateTime);
            console.log(orderList);

            var orderListHilife = orderList.filter(x=>x.shippingCarrier=="萊爾富").map(x=>x.trackingNo);


            var w = window.open(`https://external2.shopee.tw/ext/hilife/live/ec_orders_tagC2C.aspx?EshopId=901&OrderNo=${orderListHilife.join('%3B')}&ParentId=022`);//%3B

        });

        $('#printAlreadybutton').click(function(){

            var orderList = [];
            $.ajax({
                url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/shop-recent-orders/v4`,
                type:"POST",
                data:JSON.stringify({"page":0,"size":1000,kyyOrderStatus:"PENDED_ORDER","orderStatus":"READY_TO_SHIP","beginDateTime":"","endDateTime":"","warehouseId":thisWareHouseId}),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    console.log(data);
                    orderList = data.orderList;
                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });



            for(var i=0;i<orderList.length;i++){

                var order = orderList[i];
                var assignTag = "proxyPackage";
                var assignTags = [];

                if(assignTag && order.tagIds && !order.tagIds.includes(assignTag)){
                    assignTags = [assignTag].concat(order.tagIds);
                    tagToKYY(order.ordersn,assignTags);
                }else if (assignTag && !order.tagIds){
                    assignTags = [assignTag];
                    tagToKYY(order.ordersn,assignTags);
                }
            }

            $('button:contains("重置")').click();
        });


        $('#tagbutton').click(function(){

            var orderList = [];
            $.ajax({
                url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/shop-recent-orders/v4`,
                type:"POST",
                data:JSON.stringify({"page":0,"size":1000,kyyOrderStatus:"","orderStatus":"READY_TO_SHIP","beginDateTime":"","endDateTime":"","warehouseId":thisWareHouseId}),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    //console.log(data);
                    orderList = data.orderList;
                    var needToReload = false;

                    for(var i=0;i<orderList.length;i++){



                        (function(orderList,i){

                            const order = orderList[i];
                            var assignTag = tagsMapping[order.shippingCarrier];
                            var assignTags = [];

                            if(assignTag && order.tagList && !order.tagList.map(x=>x.tagId).includes(assignTag)){
                                assignTags = [assignTag].concat(order.tagList.map(x=>x.tagId));
                                tagToKYY(order.ordersn,assignTags);
                                needToReload = true;
                            }else if (assignTag && !order.tagList){
                                assignTags = [assignTag];
                                tagToKYY(order.ordersn,assignTags);
                                needToReload = true;
                            }


                            if(tagsMapping[order.shippingCarrier] == tagsMapping["蝦皮店到店"] && order.sellerShippingCarrier!="蝦皮店到店"){
                                //console.log(tagsMapping[order.shippingCarrier]);
                                //console.log(`1-${tagsMapping[order.shippingCarrier]}==${tagsMapping["蝦皮店到店"]}, ${order.sellerShippingCarrier}!="蝦皮店到店"`);
                                //setSellerShippingCarrier(order.ordersn);
                                //needToReload = true;
                            }else if(tagsMapping[order.shippingCarrier] != tagsMapping["蝦皮店到店"] && order.sellerShippingCarrier!="默认"){
                                //console.log(`2-${tagsMapping[order.shippingCarrier]}!=${tagsMapping["蝦皮店到店"]}, ${order.sellerShippingCarrier}!=""`);
                                //setSellerShippingCarrier(order.ordersn,"");
                                //needToReload = true;
                            }
                        }(orderList,i));

                    }

                    if(needToReload){
                        $('.v-tabs__item:contains("待處理")').get(0).click();
                    }
                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });



        });

        function tagToKYY(ordersn,tagIds){
            var params={"ordersn":ordersn,"tagIds":tagIds};

            $.ajax({
                url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/tag`,
                type:"PUT",
                data:JSON.stringify(params),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    console.log(data);

                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });
        }

        function setSellerShippingCarrier(ordersn,shippingCarrier="蝦皮店到店"){

            $.ajax({
                url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/save-seller-shipping-carrier?ordersn=${ordersn}&logisticsName=${shippingCarrier}`,
                type:"GET",
                //data:JSON.stringify(params),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    console.log(data);

                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });
        }

        $('#uploadToGoogle').click(function(){

            var orderList = [];
            $.ajax({
                url:`https://${apiDomainMapping[subDomain]}.keyouyun.com/jax/api/order/shop-recent-orders/v4`,
                type:"POST",
                data:JSON.stringify({"page":0,"size":1000,kyyOrderStatus:"PENDING","orderStatus":"READY_TO_SHIP","beginDateTime":"","endDateTime":"","orderByStr":"create_time","isAsc": true,"warehouseId":thisWareHouseId}),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    orderList = data.orderList;
                    var orderDetails = [];

                    for(var i=0;i<orderList.length;i++){
                        var order = orderList[i];
                        for(var j = 0;j<order.items.length;j++){
                            var item = order.items[j];
                            var orderDetail = {"子交易序號":i+1,
                                               "平台訂單編號":order.ordersn,
                                               "商品倉庫儲位":item.itemSku,
                                               "商品編號":item.variationSku,
                                               "小計數量":item.variationQuantityPurchased,
                                               "出貨類型":order.shippingCarrier};
                            orderDetails.push(orderDetail);
                        }
                    }

                    postToGoogle(orderDetails);

                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });



        });

        function postToGoogle(data){
            var response = JSON.parse($.ajax({type: "GET",
                                              url: `https://script.google.com/macros/s/AKfycbzeVm36LjJzHxc8MAXSyNun2Fh0_q2f6f_SJKk0_WB4fK7YXpT55n2PFgEjFEHZQfLmTw/exec?type=queryUrl`,
                                              async: false}
                                            ).responseText);
            var storeid = getStoreId();
            var formData = {storeid,data};

            var url = response.url;
            GM_xmlhttpRequest ( {
                method:     "POST",
                url:        url,
                data:       JSON.stringify(formData),
                followAllRedirects: true,
                headers:    {
                    "Content-Type": "application/json;charset=utf-8"
                },
                onload:     function (response) {
                    console.log(response.responseText);
                    alert("上傳結束，請確認雲端檔案");

                }
            } );

        }

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

        function checkWareHouse(){
            var uidMapping = {"422735":"富喜園","508423":"崙背建國","508819":"富喜園","512507":"富喜園","512508":"富喜園"};
            var uid = localStorage.getItem("uid");
            var keyword = uidMapping[uid];
            if(keyword){
                console.log("searchReset");

                setTimeout(()=>{
                    //console.log($('div.k-select-input:contains("全部")').length);
                    $('div.k-select-input:contains("全部")').click();
                    //$('div.k-select-input:contains("全部")').trigger("click");

                    setTimeout(()=>{
                        //console.log($('div.v-list__tile__content:contains("富喜園")').length);
                        $(`div.v-list__tile__content:contains("${keyword}")`).click();

                        $('button[data-v-ta="search"]').click();
                    },300);
                },1000);
            }

        }
        function getStoreId(){

            var defaultStoreId = "1314";
            var uidStoreIdMapping = {"508423":"1313"};
            var uid = localStorage.getItem("uid");
            var storeId = uidStoreIdMapping[uid];
            if(!storeId){
                storeId = defaultStoreId;
            }
            return storeId;
        }

        function getWareHouseId(){

            var defaultWareHouseId = "1454426052596420608";
            var uidWareHouseIdMapping = {"508423":"1861049227549401088"};
            var uid = localStorage.getItem("uid");
            var warehouseId = uidWareHouseIdMapping[uid];
            if(!warehouseId){
                warehouseId = defaultWareHouseId;
            }
            return warehouseId;
        }

    },5000);
    // Your code here...
})();