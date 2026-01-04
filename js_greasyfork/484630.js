// ==UserScript==
// @name         客優雲出入庫-更新蝦皮庫存
// @namespace    http://tampermonkey.net/
// @version      2025-08-26
// @description  客優雲出入庫-更新蝦皮庫存 功能
// @author       You
// @match        https://erp.keyouyun.com/depot/active*
// @match        https://world.keyouyun.com/depot/active*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyouyun.com
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/484630/%E5%AE%A2%E5%84%AA%E9%9B%B2%E5%87%BA%E5%85%A5%E5%BA%AB-%E6%9B%B4%E6%96%B0%E8%9D%A6%E7%9A%AE%E5%BA%AB%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/484630/%E5%AE%A2%E5%84%AA%E9%9B%B2%E5%87%BA%E5%85%A5%E5%BA%AB-%E6%9B%B4%E6%96%B0%E8%9D%A6%E7%9A%AE%E5%BA%AB%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{

        var warehouses = [];
        var button = $('button:contains("新增採購入庫")').last();
        button.after(`
        <button type="button" class="v-btn" style="" id="updateCargo"><div class="v-btn__content">更新蝦皮庫存 </div></button>
        <button type="button" class="v-btn" style="" id="addTransferOrder"><div class="v-btn__content">出庫單調撥入庫 </div></button>
    `);

        $('#addTransferOrder').click(function(){

            var transferWareHouseName =  prompt('請輸入調撥入庫倉庫名稱');
            if (!transferWareHouseName){
                alert("沒輸入");
                return;
            }else{
                if(warehouses.length==0){
                    getWarehouses();
                }

                var filters = warehouses.filter(x=>x.warehouseName == transferWareHouseName);
                if(filters.length==0){
                    alert("無此倉庫名稱");
                    return;
                }
                var warehouse=filters[0];

                var orders = [];
                $('div.v-offer-item-Wrap').each((index,ele)=>{
                    var check = $(ele).find('div.v-input--selection-controls__ripple.primary--text');
                    if(check.length>0){

                        var order = $(ele).find('.grey--text:eq(1)').text();
                        orders.push(order);
                    }
                });

                console.log(orders);

                var flows;
                $.ajax({
                    url:`https://world.keyouyun.com/vn/api/warehouse/flow?page=1&size=50&action=OUT&codes=${orders.join(',')}`,
                    type:"GET",
                    contentType:"application/json; charset=utf-8",
                    //dataType:"json",
                    success: function(data){
                        flows = data;
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    async: false
                });

                console.log(flows);

                var skuCodesMapping = {};

                for(var flow of flows){

                    var skuCodes=[];
                    for(var warehouseFlowItem of flow.warehouseFlowItem){
                        if(!skuCodesMapping.hasOwnProperty(warehouseFlowItem.skuCode)){
                            skuCodes.push(warehouseFlowItem.skuCode);
                        }
                    }
                    if(skuCodes.length>0){
                        $.ajax({
                            url:`https://world.keyouyun.com/vn/api/sc-item?page=1&size=100&skuCodes=${flow.warehouseFlowItem.map(x=>x.skuCode).join(',')}`,
                            type:"GET",
                            contentType:"application/json; charset=utf-8",
                            //dataType:"json",
                            success: function(data){
                                for(var scItem of data){
                                    if(!skuCodesMapping.hasOwnProperty(scItem.skuCode)){
                                        skuCodesMapping[scItem.skuCode]=scItem;
                                    }
                                }
                            },
                            xhrFields: {
                                withCredentials: true
                            },
                            async: false
                        });
                        console.log(skuCodesMapping);
                    }


                    var tmp = flow.warehouseFlowItem.map(x=>{

                        var mapping = skuCodesMapping[x.skuCode];
                        return {
                            "position":"WHJ-1-1",
                            "id":mapping.id,
                            "count":x.count,
                            "skuCode":x.skuCode,
                            "scItemId":mapping.scItemId,
                            "costPrice":mapping.costPrice,
                            "price":mapping.costPrice,
                            "shelfCode":"1531594197984563200"
                        }
                    });
                    var params = {
                        "scItems":tmp,
                        "warehouseId":warehouse.warehouseId,
                        "itemType":1,
                        "memo":`調撥原單號:${flow.code}${flow.ordersn ? ";銷售原單號:"+flow.ordersn:""}`
                    }
                    console.log(params);

                    $.ajax({
                        url:'https://world.keyouyun.com/vn/api/v2/warehouse/flow/in',
                        type:"POST",
                        data:JSON.stringify(params),
                        contentType:"application/json; charset=utf-8",
                        dataType:"json",
                        success: function(data){
                            console.log(data);
                            $('button:contains("重置")').click();
                            if(data){
                                alert(`調撥成功`);
                            }else{
                                alert(`調撥失敗`);
                            }
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        async: false
                    });
                   break;
                }
            }
        });

        $('#updateCargo').click(function(){

            $('.v-offer-item__info').each((index,ele)=>{

                var skuCode = $(ele).find('div.v-offer-item__info-skuCode').text();
                console.log(skuCode);
                console.log(skuCode.length);
                if(skuCode.length == 10){
                    updateCargoBySkuCode(skuCode);
                    singleOpenOverSell(skuCode);
                }
            });

        });

        function getWarehouses(){
            $.ajax({
                url:`https://world.keyouyun.com/vn/api/all/warehouse/v2?shareSign=false&thirdSign=false`,
                type:"GET",
                contentType:"application/json; charset=utf-8",
                //dataType:"json",
                success: function(data){
                    warehouses = data.ownerWarehouses;
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