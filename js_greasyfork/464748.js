// ==UserScript==
// @name         客優雲匯出供應商貨號
// @namespace    http://tampermonkey.net/
// @version      2025-12-17
// @description  匯出供應商貨號 功能
// @author       You
// @match        https://erp.keyouyun.com/purchase/order
// @match        https://world.keyouyun.com/purchase/order
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyouyun.com
// @grant        GM_setClipboard
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464748/%E5%AE%A2%E5%84%AA%E9%9B%B2%E5%8C%AF%E5%87%BA%E4%BE%9B%E6%87%89%E5%95%86%E8%B2%A8%E8%99%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/464748/%E5%AE%A2%E5%84%AA%E9%9B%B2%E5%8C%AF%E5%87%BA%E4%BE%9B%E6%87%89%E5%95%86%E8%B2%A8%E8%99%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        var button = $('button:contains("自定義下單")').last();
        button.after(`
        <button type="button" class="v-btn" style="" id="exportVendorProdNo"><div class="v-btn__content">匯出供應商貨號</div></button>
        <button type="button" class="v-btn" style="" id="exportPolyWellProdNoName"><div class="v-btn__content">匯出寶利威爾貨號</div></button>
        <button type="button" class="v-btn" style="" id="exportPolyWellProdNo"><div class="v-btn__content">匯出寶利威爾貨號(無品名)</div></button>
    `);

        $('#exportVendorProdNo').click(function(){
            var content = getProdNos();
            GM_setClipboard(content);
            alert("可以貼上供應商貨號");
        });

        $('#exportPolyWellProdNoName').click(function(){

            var orders = [];
            $('div.order-table-cell').each((index,ele)=>{
                //var check = $(ele).find('input[aria-checked="true"]');
                var check = $(ele).find('div.v-input--selection-controls__ripple.primary--text');
                if(check.length>0){
                    //console.log(check);
                    var segment = $(ele).find('.sub-text:eq(1)').text().trim().split(/[\s、\/,]+/);
                    //console.log(segment);
                    var order = segment[0];
                    orders.push(order);
                }
            });

            console.log(orders);
            //https://world.keyouyun.com/vn/api/purchase-bill/item/stock/batch?purchaseBillIds=2025121160998963
            var stocks;
            $.ajax({
                url:`https://world.keyouyun.com/vn/api/purchase-bill/item/stock/batch?purchaseBillIds=${orders.join('&purchaseBillIds=')}`,
                type:"GET",
                contentType:"application/json; charset=utf-8",
                //dataType:"json",
                success: function(data){
                    stocks = data;
                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });

            var content = "";
            for(var stock of stocks){
             content +=`${stock.scItemName.slice(-13)}*${stock.count} ${stock.scItemSkuName.slice(6)}\r\n`;
            }
            console.log(content);

            GM_setClipboard(content);
            alert("可以貼上POLYWELL貨號");
        });

        $('#exportPolyWellProdNo').click(function(){

            var orders = [];
            $('div.order-table-cell').each((index,ele)=>{
                //var check = $(ele).find('input[aria-checked="true"]');
                var check = $(ele).find('div.v-input--selection-controls__ripple.primary--text');
                if(check.length>0){
                    //console.log(check);
                    var segment = $(ele).find('.sub-text:eq(1)').text().trim().split(/[\s、\/,]+/);
                    //console.log(segment);
                    var order = segment[0];
                    orders.push(order);
                }
            });

            console.log(orders);
            //https://world.keyouyun.com/vn/api/purchase-bill/item/stock/batch?purchaseBillIds=2025121160998963
            var stocks;
            $.ajax({
                url:`https://world.keyouyun.com/vn/api/purchase-bill/item/stock/batch?purchaseBillIds=${orders.join('&purchaseBillIds=')}`,
                type:"GET",
                contentType:"application/json; charset=utf-8",
                //dataType:"json",
                success: function(data){
                    stocks = data;
                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });

            var content = "";
            for(var stock of stocks){
             content +=`${stock.scItemName.slice(-13)}*${stock.count}\r\n`;
            }
            console.log(content);

            GM_setClipboard(content);
            alert("可以貼上POLYWELL貨號");
        });
        function getProdNos(){
            let ordersns = [];
            let prodNos = [];
            $('div.order-table-cell').each((index,ele)=>{

                var check = $(ele).find('div.v-input--selection-controls__ripple.primary--text');
                if(check.length>0){

                    var rows = $(ele).find('.row');//.find(`div.v-order-item-header p:contains('assignment') span`).text();
                    rows.each((index1,ele1)=>{
                        console.log($(ele1).find('.cursor-pointer'));
                        var ordersn = $(ele1).find('.cursor-pointer').first().text().trim();
                        var number = $(ele1).find('.cursor-pointer:eq(1)').text().trim();
                        //console.log($(ele1).find('.cursor-pointer').first().text());
                        ordersns.push({ordersn,number});
                        var prodNo= ordersn.split('-')[0].trim();
                        if(!prodNos.includes(prodNo)){
                            prodNos.push(prodNo);
                        }
                    });
                }
            });
            //console.log(ordersns);
            //console.log(prodNos);
            var settings = getGoogleSheetSettings(prodNos.join('|'));
            var mapping = {};
            for(var setting of settings){
                mapping[setting["貨號"]]=setting["供應商貨號"];
            }
            //console.log(mapping);

            var content = "";
            for(var ordersn of ordersns){
                var prodNo= ordersn.ordersn.split('-')[0].trim();
                content +=`${mapping[prodNo]??""}-${ordersn.ordersn.replace(`${prodNo}-`,"")}*${ordersn.number}\r\n`;
            }
            //console.log(content);
            return content;
        }
        function getGoogleSheetSettings(prodNos){
            var url = `https://docs.google.com/spreadsheets/u/3/d/1ZxQ_l5Nx3wTSarilsjH1M23J4P-s8DGfC1xkpquoF14/gviz/tq?&sheet=${sheetName}&headers=1&tq=SELECT+A,B,C+WHERE+A+matches+'${prodNos}'+order by A`;
            //console.log(url);
            var sheetName = "供應商";
            var responseText = $.ajax({
                type: "GET",
                url: url,
                async: false
            }).responseText;


            var from = responseText.indexOf("{");
            var to = responseText.lastIndexOf("}")+1;
            var result = responseText.slice(from, to);


            //console.log(result);
            var responseJSON = JSON.parse(result);
            //console.log(responseJSON);
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
})();