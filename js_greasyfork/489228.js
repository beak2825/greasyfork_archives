// ==UserScript==
// @name         客優雲-未配對產生貨品貨號
// @namespace    http://tampermonkey.net/
// @version      2025-12-07
// @description  客優雲未配對產生貨品貨號 功能
// @author       You
// @match        https://world.keyouyun.com/depot/goods/post?optionType=add&productId=*&platformName=shopee
// @match        https://erp.keyouyun.com/depot/goods/post?optionType=add&productId=*&platformName=shopee
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyouyun.com
// @grant        none

// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/489228/%E5%AE%A2%E5%84%AA%E9%9B%B2-%E6%9C%AA%E9%85%8D%E5%B0%8D%E7%94%A2%E7%94%9F%E8%B2%A8%E5%93%81%E8%B2%A8%E8%99%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/489228/%E5%AE%A2%E5%84%AA%E9%9B%B2-%E6%9C%AA%E9%85%8D%E5%B0%8D%E7%94%A2%E7%94%9F%E8%B2%A8%E5%93%81%E8%B2%A8%E8%99%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var data = {};
    setTimeout(()=>{

        var button = $('div.v-btn__content:contains("生成貨品資訊")').last().parent();
        button.after(`
        <button type="button" class="v-btn theme--light primary" id="insertProdNo"><div class="v-btn__content">前面插入貨品編碼</div></button>
        <button type="button" class="v-btn theme--light primary" id="getProdDetails"><div class="v-btn__content">產生貨號</div></button>
    `);

        $('#insertProdNo').click(function(){
            var prodNo =  prompt('請輸入插入貨品編碼');
            if (!prodNo){
                alert("沒輸入貨品編碼");
                return;
            }
            var table = $('.vxe-table--body').first();
            table.find('tr').each((index,ele)=>{
                (function(i, ele) {
                    setTimeout(() => {
                        insert(i+1,ele,prodNo);
                    }, 2 * 1000 * (i+1));
                }(index, ele));
            });
        });
        $('#getProdDetails').click(function(){
            var table = $('.vxe-table--body').first();
            table.find('tr').each((index,ele)=>{




                (function(i, ele) {
                    setTimeout(() => {

                        change(i+1,ele);

                    }, 2 * 1000 * (i+1));
                }(index, ele));
            });

        });

    },6000);

    function insert(i,ele,prodNo){

        var col_4 = $(ele).find('td[colid="col_4"]');//.text();
        var name = $(ele).find('td[colid="col_5"]');//.text();
        var spec = $(ele).find('td[colid="col_6"]');//.text();

        //console.log($(ele));
        let specContent = spec.text().trim();
        specContent = `${prodNo}-${specContent}`;

        setTimeout(() => {
            $(spec).find('div').click();
            setTimeout(() => {
                inputChangeValue($(spec).find('textarea').first().get(0),specContent);
            },250);
        },250);
    }

    function change(i,ele){

        var col_4 = $(ele).find('td[colid="col_4"]');//.text();
        var name = $(ele).find('td[colid="col_5"]');//.text();
        var spec = $(ele).find('td[colid="col_6"]');//.text();

        //console.log($(ele));
        let specContent = spec.text().trim();
        let prodNo = specContent.split("-")[0];

        console.log(prodNo);
        let prodData = "";
        if(!data.hasOwnProperty(prodNo)){
            let result = getGoogleSheetSettings(prodNo);
            if(result.length>0){
                data[prodNo] = `${result[0].編號}-${result[0].商品名}`;
            }
        }
        prodData = `${data[prodNo]}-${specContent.replace(`${prodNo}-`,"")}`;

        setTimeout(() => {
            $(name).find('div').click();
            setTimeout(() => {
                inputChangeValue($(name).find('textarea').first().get(0),prodData);
            },250);
        },250);

        setTimeout(() => {
            $(col_4).find('div').click();
            setTimeout(() => {
                inputChangeValue($(col_4).find('input').first().get(0),`${prodNo}-${1000+i}`);
            },250);
        },250);


    }

    console.log(getGoogleSheetSettings());
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

    function getGoogleSheetSettings(prodNo="C2126"){
        var sheetName = "整合";
        var responseText = $.ajax({
            type: "GET",
            url: `https://docs.google.com/spreadsheets/u/3/d/1Dg5Y4tB_dq2wBTw1MzoPiRXg6Cc6vdnNK5rEB7-JCKc/gviz/tq?&sheet=${sheetName}&headers=1&tq=SELECT+A,B+WHERE+A+='${prodNo}' order by A`,
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
})();