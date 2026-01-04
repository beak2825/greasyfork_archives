// ==UserScript==
// @name         客優雲庫存清單-功能
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  客優雲庫存清單 功能
// @author       You
// @match        https://erp.keyouyun.com/depot/stock
// @match        https://world.keyouyun.com/depot/stock
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyouyun.com
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/484631/%E5%AE%A2%E5%84%AA%E9%9B%B2%E5%BA%AB%E5%AD%98%E6%B8%85%E5%96%AE-%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/484631/%E5%AE%A2%E5%84%AA%E9%9B%B2%E5%BA%AB%E5%AD%98%E6%B8%85%E5%96%AE-%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{

        //<button type="button" class="v-btn" style="" id="711button"><div class="v-btn__content">勾選7-11</div></button>
        //<button type="button" class="v-btn" style="" id="hilifebutton"><div class="v-btn__content">勾選Hi-Life</div></button>
        //<button type="button" class="v-btn" style="" id="deleteStock"><div class="v-btn__content">刪除庫存清單</div></button>

        var button = $('button:contains("批次處理")').last();
        button.after(`
        <button type="button" class="v-btn" style="" id="autoUpdateSafe"><div class="v-btn__content">自動更新安全庫存</div></button>
        <button type="button" class="v-btn" style="" id="openOverSell"><div class="v-btn__content">打開防超賣</div></button>
        <button type="button" class="v-btn" style="" id="updateCargo"><div class="v-btn__content">更新蝦皮庫存 </div></button>
    `);



        $('#autoUpdateSafe').click(function(){
            var count = 50
            var i = 1;
            var skuCodes = [];
            while(count==50){
                $.ajax({
                    url:`https://world.keyouyun.com/vn/api/stock?page=${i}&size=50&itemType=1&skuCode=&warehouseId=1454426052596420608`,
                    type:"GET",
                    contentType:"application/json; charset=utf-8",
                    //dataType:"json",
                    success: function(data){
                        //console.log(data);
                        count = data.length;
                        skuCodes = data.map(x=>x.skuCode);
                        updateSafeStock(skuCodes);
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    async: false
                });

                i++;
            }
            /*


*/


        });

        $('#openOverSell').click(function(){


            batchOpenOverSell(1);

        });

        $('#deleteStock').click(function(){


            deleteStock();

        });

        $('#updateCargo').click(function(){

            $('.v-offer-item__body').each((index,ele)=>{

                var skuCode = $(ele).find('div.v-offer-item__cell:eq(2)').text();
                console.log(skuCode);
                console.log(skuCode.length);
                if(skuCode.length == 10){
                    updateCargoBySkuCode(skuCode);
                    singleOpenOverSell(skuCode);
                }
            });

        });


        function batchOpenOverSell(i){

            var batchCount = 50;
            var count = batchCount;

            $.ajax({
                url:`https://world.keyouyun.com/vn/api/stock?page=${i}&size=${batchCount}&itemType=1&skuCode=&warehouseId=1454426052596420608`,
                type:"GET",
                contentType:"application/json; charset=utf-8",
                //dataType:"json",
                success: function(data){
                    count = data.length;

                    data.forEach(function (element) {
                        openOverSell(element);
                    });
                    if(count==batchCount){
                        setTimeout(()=>{
                            batchOpenOverSell(i+1);
                        },5000);
                    }
                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });


        }

        function singleOpenOverSell(skuCode){

            var batchCount = 50;
            var count = batchCount;

            $.ajax({
                url:`https://world.keyouyun.com/vn/api/stock?page=1&size=${batchCount}&itemType=1&skuCode=${skuCode}&warehouseId=1454426052596420608`,
                type:"GET",
                contentType:"application/json; charset=utf-8",
                //dataType:"json",
                success: function(data){
                    count = data.length;

                    data.forEach(function (element) {
                        openOverSell(element);
                    });
                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });


        }

        function openOverSell(skuData){

            var autoPush = skuData.autoSyncToPlatformConfigDTO ? skuData.autoSyncToPlatformConfigDTO.autoPush:0;
            var oversell = skuData.autoSyncToPlatformConfigDTO ? skuData.autoSyncToPlatformConfigDTO.oversell:0;

            if(!oversell){
                var params={
                    "autoPush":autoPush,
                    "preventOversell":1,
                    "oversell":1,
                    "storageScItemId":skuData.scItemId,
                    "skuCode":skuData.skuCode,
                    "warehouseId":"1454426052596420608"
                };

                $.ajax({
                    url:'https://world.keyouyun.com/vn/api/auto/config/setConfig',
                    type:"POST",
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
        }


        function updateSafeStock(skuCodes){
            var params={"warehouseId":"1454426052596420608","type":1,"skuCodes":skuCodes,"stockingDays":3};

            $.ajax({
                url:'https://world.keyouyun.com/vn/api/stock/safe-stock/v2',
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

        function deleteStock(){
            var params=[];

            $.ajax({
                url:'https://world.keyouyun.com/vn/api/sc-item/v2',
                type:"DELETE",
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

        function findCargo(skuCode){
            var params=[{"skuCode":skuCode}];

            var result;
            $.ajax({
                url:'https://world.keyouyun.com/lux/api/special/findProductSimpleInfo',
                type:"POST",
                data:JSON.stringify(params),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data){
                    console.log(data);
                    result = data;
                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });


            var finalResult = result.map(x=>({"variationIndexs":x.variationIndexs,"productId":x.productId,"platformId":10}));

            return finalResult;
        }


        function updateCargoBySkuCode(skuCode){

            var skuData = getStock(skuCode);
            console.log(skuData);


            var result = findCargo(skuData.variationSku);

            result.forEach(function (element){
                if(element.variationIndexs[0].stock<2 ){
                    if(skuData.residue>2){
                        element.variationIndexs[0].stock = 999;}
                    else{
                        element.variationIndexs[0].stock = skuData.residue;
                    }
                }else if (skuData.residue ==0 && element.variationIndexs[0].stock>0){
                    element.variationIndexs[0].stock = 0;
                }

            });

            console.log(result);
            updateCargo(skuCode,result);
        }


        function updateCargo(skuCode,variationVM){
            var params={"cargoCode":skuCode,
                        "variationVM":variationVM
                       };

            $.ajax({
                url:'https://world.keyouyun.com/lux/api/special/update_product_cargo_info',
                type:"POST",
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


        function getStock(skuCode){

            var result;
            $.ajax({
                url:`https://world.keyouyun.com/vn/api/stock?page=1&size=50&itemType=1&skuCode=${skuCode}&warehouseId=1454426052596420608`,
                type:"GET",
                contentType:"application/json; charset=utf-8",
                //dataType:"json",
                success: function(data){
                    result = data;

                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });

            if(result.length>0){
                return result[0];

            }

        }

    },5000);
    // Your code here...
})();