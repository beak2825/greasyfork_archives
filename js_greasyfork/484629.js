// ==UserScript==
// @name         客優雲自動更新安全庫存 on 採購建議
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  客優雲自動更新安全庫存 on 採購建議 功能
// @author       You
// @match        https://erp.keyouyun.com/purchase/purchasing
// @match        https://world.keyouyun.com/purchase/purchasing
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyouyun.com
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/484629/%E5%AE%A2%E5%84%AA%E9%9B%B2%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E5%AE%89%E5%85%A8%E5%BA%AB%E5%AD%98%20on%20%E6%8E%A1%E8%B3%BC%E5%BB%BA%E8%AD%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/484629/%E5%AE%A2%E5%84%AA%E9%9B%B2%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E5%AE%89%E5%85%A8%E5%BA%AB%E5%AD%98%20on%20%E6%8E%A1%E8%B3%BC%E5%BB%BA%E8%AD%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{

        //<button type="button" class="v-btn" style="" id="711button"><div class="v-btn__content">勾選7-11</div></button>
        //<button type="button" class="v-btn" style="" id="hilifebutton"><div class="v-btn__content">勾選Hi-Life</div></button>
        //<button type="button" class="v-btn" style="" id="test"><div class="v-btn__content">TEST</div></button>

        var button = $('button:contains("更換供貨商")').last();
        button.after(`
        <button type="button" class="v-btn" style="" id="autoUpdateSafe"><div class="v-btn__content">自動更新安全庫存</div></button>

    `);

        $('div.v-btn__content:contains("暫不採購")').click(function(){
            deleteAndInsertToGoogle();
        });


        function insertToGoogleSheet(skuCode,url){
            $.ajax({
                type: "POST",
                // url為Google Form按下submit的aciotn
                url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLScxAZfGOH-qiOBc1SwaESTlpDfIfUOvxp99xhUjV3yIIv1Pkw/formResponse",
                crossDomain: true,//解決跨網域CORS的問題
                data: {// entry.xxxxx 這些需要填寫您表單裡面的值，與其相互對應
                    "entry.232505530":  skuCode,
                    "entry.711702336": url,
                },

                //dataType: "JSONP"
            });
        }


        $('#test').click(function(){



            var result = getGoogleSheetSettings();

            console.log(result);
        });

        function deleteAndInsertToGoogle(){

            let skuCodes = [];
            $('div.purchase-table div.suggest-table-cell').each((index,ele)=>{

                var check = $(ele).find('div.v-input--selection-controls__ripple.primary--text');
                if(check.length>0){

                    var skuCode = $(ele).find(`a`).last().text();
                    var response = JSON.parse($.ajax({type: "GET",
                                                      url: `https://api.keyouyun.com/vn/api/purchasing?skuCode=${skuCode}&itemSkuCode=&type=-1&providerName=&startDate=&endDate=&page=0&size=50`,
                                                      xhrFields: {withCredentials: true},
                                                      async: false}
                                                    ).responseText);


                    if(response.length==1){
                        response = response[0].data[0];

                    }
                    console.log(response);
                    skuCodes.push(skuCode);


                    insertToGoogleSheet(skuCode,response.image);
                }
            });
            console.log(skuCodes);
            return skuCodes;


        }

        function getGoogleSheetSettings(){
            var responseText = $.ajax({
                type: "GET",
                url: `https://docs.google.com/spreadsheets/u/3/d/1JC4Ln7ZsBGPfyBfzIv8zQmyCfRvVzrOFsUux2V2Pavg/gviz/tq?tq=SELECT+B`,
                async: false
            }).responseText;


            var from = responseText.indexOf("{");
            var to = responseText.lastIndexOf("}")+1;
            var result = responseText.slice(from, to);


            console.log(result);
            var responseJSON = JSON.parse(result);
            console.log(responseJSON);
            /*
            var rowsArray = [];
            responseJSON.table.rows.forEach(function(row){
                var rowArray = [];
                row.c.forEach(function(prop){ rowArray.push( (new Function('return ' + prop.v))()); });
                rowsArray.push(rowArray);
            });
            console.log(rowsArray);
            */

            var rows = [];
            responseJSON.table.rows.forEach(function(row){
                var rowObject = {};
                row.c.forEach(function(prop,index){
                    if(responseJSON.table.cols[index].type =="datetime"){
                        rowObject[responseJSON.table.cols[index].label] = (new Function("",`return new ${prop.v}`))().getTime()/1000;
                    }else{
                        rowObject[responseJSON.table.cols[index].label] = prop.v;
                    }
                });

                //console.log(rowObject.start_time.getTime());
                rows.push(rowObject);
            });

            //console.log(rows);

            return rows;

        }

        function deleteFromPurchasing(purchasingIds){



            var params=purchasingIds;

            $.ajax({
                url:'https://world.keyouyun.com/vn/api/purchasing',
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

        $('#autoUpdateSafe').click(function(){

            var noPurchasingSkuCodes = getGoogleSheetSettings().map(x=>x.ProdNo);
            console.log(noPurchasingSkuCodes);
            var count = 50
            var i = 0;
            var skuCodes = [];
            var purchasingIds = [];
            while(count==50){
                $.ajax({
                    url:`https://world.keyouyun.com/vn/api/purchasing?skuCode=&itemSkuCode=&type=-1&providerName=&startDate=&endDate=&page=${i}&size=50`,
                    type:"GET",
                    contentType:"application/json; charset=utf-8",
                    //dataType:"json",
                    success: function(data){
                        //console.log(data);
                        count = data.length;
                        console.log(count);
                        var newPurchasingIds = data.map(x=>({skuCode:x.data[0].skuCode,purchasingId:x.data[0].purchasingId}));

                        console.log(newPurchasingIds);
                        skuCodes = newPurchasingIds.filter(x=>!noPurchasingSkuCodes.includes(x.skuCode) ).map(x=>x.skuCode);//&& (x.skuCode && !x.skuCode.toString().startWith("Z"))

                        console.log(skuCodes.length);
                        //updateSafeStock(skuCodes);

                        purchasingIds = purchasingIds.concat(newPurchasingIds.filter(x=>noPurchasingSkuCodes.includes(x.skuCode)));
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    async: false
                });

                i++;
            }

            if(purchasingIds.length>0){
                deleteFromPurchasing(purchasingIds.map(x=>x.purchasingId));
            }
            console.log(purchasingIds);

            $('button:contains("查詢")').click()


        });

        function updateSafeStock(skuCodes){
            var params={"warehouseId":"1454426052596420608","type":1,"skuCodes":skuCodes,"stockingDays":0,"dailySales":7};

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


    },5000);
    // Your code here...
})();