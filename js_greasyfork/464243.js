// ==UserScript==
// @name         客優雲手工下單-根據供應商自動全選商品
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  客優雲手工下單-根據供應商自動全選商品 功能
// @author       You
// @match        https://erp.keyouyun.com/purchase/create-purchase-order/order/normal
// @match        https://world.keyouyun.com/purchase/create-purchase-order/order/normal
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyouyun.com
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464243/%E5%AE%A2%E5%84%AA%E9%9B%B2%E6%89%8B%E5%B7%A5%E4%B8%8B%E5%96%AE-%E6%A0%B9%E6%93%9A%E4%BE%9B%E6%87%89%E5%95%86%E8%87%AA%E5%8B%95%E5%85%A8%E9%81%B8%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/464243/%E5%AE%A2%E5%84%AA%E9%9B%B2%E6%89%8B%E5%B7%A5%E4%B8%8B%E5%96%AE-%E6%A0%B9%E6%93%9A%E4%BE%9B%E6%87%89%E5%95%86%E8%87%AA%E5%8B%95%E5%85%A8%E9%81%B8%E5%95%86%E5%93%81.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setTimeout(()=>{

        var button = $('div.v-btn__content:contains("查詢")').last().parent();
        button.after(`
        <button type="button" class="v-btn theme--light primary" id="getVendorProducts"><div class="v-btn__content">查詢供應商</div></button>
    `);



        $('#getVendorProducts').click(function(){


            var interval = 10;
            var providerId = $('input[item-value="id"]').val();
            console.log(providerId);

            $('i:contains("clear")').get(0).click();
            var prodNos = getProdNosByProviderid(providerId);
            var i= 0;
            for(var prodNo of prodNos){

                (function(i,prodNo){
                    setTimeout(()=>{

                        selectProductsByProdNo(prodNo);
                        console.log(prodNo);
                    },interval*1000*(i));
                }(i,prodNo));

                i++;
            }
            setTimeout(()=>{
                //console.log($('div.v-dialog__content--active div.v-btn__content:contains("確定")'));
                $('div.v-dialog__content--active div.v-btn__content:contains("確定")').click();
            },interval*1000*i+5000);
            console.log($('.v-text-field__slot input[aria-label="輸入貨品名稱進行搜索"]'));
            //alert("ok");

        });

        function getProdNosByProviderid(id){
            var settings = getGoogleSheetSettings(id);
            return settings.map(x=>x["貨號"]);
        }

        function selectProductsByProdNo(prodNo){
            inputChangeValue($('.v-text-field__slot input[aria-label="輸入貨品名稱進行搜索"]').get(0),prodNo);
            button.click();
            setTimeout(()=>{

                $('th div.v-input--selection-controls__ripple').click();
                for(var i = 1;i<$('button.v-pagination__item').length;i++){
                    (function(i){
                        setTimeout(()=>{

                            //$('th div.v-input--selection-controls__ripple').first().get(0).click();
                            $(`button.v-pagination__item:eq(${i})`).click();
                            setTimeout(()=>{
                                $('th div.v-input--selection-controls__ripple').click();
                            },1000);
                        },2000*(i+1));
                    }(i));
                }
            },2000);
        }

        $('.v-tabs__item:contains("手工下單")').get(0).click()
        console.log($('a:contains("手工下單")'));

        function inputChangeValue(input, newValue){
            let lastValue = input.value;
            input.value = newValue;
            let event = new Event('input', { bubbles: true });
            // hack React15
            event.simulated = true;
            // hack React16 内部定义了descriptor拦截value，此处重置状态
            let tracker = input._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            input.dispatchEvent(event);
        }

        function getGoogleSheetSettings(providerId){
            var sheetName = "供應商";
            var responseText = $.ajax({
                type: "GET",
                url: `https://docs.google.com/spreadsheets/u/3/d/1ZxQ_l5Nx3wTSarilsjH1M23J4P-s8DGfC1xkpquoF14/gviz/tq?&sheet=${sheetName}&headers=1&tq=SELECT+A,B,C+WHERE+B+='${providerId}' order by A`,
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
    },5000);
    // Your code here...
})();