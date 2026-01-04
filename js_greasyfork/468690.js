// ==UserScript==
// @name         客優雲設置懶餅乾規格
// @namespace    http://tampermonkey.net/
// @version      0.1321
// @description  客優雲設置懶餅乾規格功能
// @author       You
// @match        https://erp.keyouyun.com/offers/posts/*?isNew=1*
// @match        https://erp.keyouyun.com/offers/posts/*
// @match        https://world.keyouyun.com/offers/posts/*?isNew=1*
// @match        https://world.keyouyun.com/offers/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyouyun.com
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468690/%E5%AE%A2%E5%84%AA%E9%9B%B2%E8%A8%AD%E7%BD%AE%E6%87%B6%E9%A4%85%E4%B9%BE%E8%A6%8F%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/468690/%E5%AE%A2%E5%84%AA%E9%9B%B2%E8%A8%AD%E7%BD%AE%E6%87%B6%E9%A4%85%E4%B9%BE%E8%A6%8F%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        var button = $('button:contains("管理违禁词")').last();
        button.after(`<button type="button" class="v-btn theme--light primary" id="setLazyCookieSpec"><div class="v-btn__content">設置懶餅乾規格</div></button>`);



        $('#setLazyCookieSpec').click(function(){

            setTimeout(()=>{
                window.scrollBy(0,800);
                //$('div.variation-option-creator input[placeholder="輸入規格選項，例如：紅色、白色等"]').get(0).scrollIntoView()
            },50);
            setTimeout(()=>{
                window.scrollBy(0,800);
                //$('div.variation-option-creator input[placeholder="輸入規格選項，例如：紅色、白色等"]').get(0).scrollIntoView()
            },100);
            setTimeout(()=>{
                window.scrollBy(0,800);
                //$('div.variation-option-creator input[placeholder="輸入規格選項，例如：紅色、白色等"]').get(0).scrollIntoView()
            },150);
            setTimeout(()=>{
                window.scrollBy(0,800);
                //$('div.variation-option-creator input[placeholder="輸入規格選項，例如：紅色、白色等"]').get(0).scrollIntoView()
            },200);
            setTimeout(()=>{
                window.scrollBy(0,800);
                //$('div.variation-option-creator input[placeholder="輸入規格選項，例如：紅色、白色等"]').get(0).scrollIntoView()
            },250);
            setTimeout(()=>{
                setSpecFromGoogle();
            },1000);



        });

        function setSpecFromGoogle(){

            console.log(settings);
            console.log($('div.variation-option-creator input[placeholder="輸入規格選項，例如：紅色、白色等"]'));



            var prodId = $('div[title="商品編碼"]').parent().find('input').val();
            var settings = getGoogleSheetSettings(null,prodId);
            $('div.variation-option-creator input[placeholder="輸入規格選項，例如：紅色、白色等"]').each((index,ele)=>{

                var value = $(ele).val();
                //console.log(value);
                var prefix = `${String.fromCharCode(65+index)}`
                var newValue = `${prefix}.${value}`;
                console.log(value);
                console.log(newValue);
                var filteredData = settings.filter(x=>x.商品規格名稱 == value || `${prefix}.${x.商品規格名稱}` == value);
                console.log(filteredData.length);
                if(filteredData.length==1){

                    var setting = filteredData[0];
                    console.log("first");
                    console.log(setting);
                    if(setting.商品規格名稱 == value){
                        setting["新商品規格名稱"]=newValue;
                        inputChangeValue($(ele).get(0), newValue);
                        (function(element,newValue,i){
                            setTimeout(()=>{

                                inputChangeValue(element, newValue);
                            },1000*(i+1));
                        }($(ele).get(0),newValue,index));
                    }else{
                        setting["新商品規格名稱"] = `${prefix}.${setting.商品規格名稱}`;
                    }
                }



                console.log(settings);
            });


            $('div.inventory-form__list tbody tr').each((index,ele)=>{
                console.log($(ele).find('td:eq(-2) .k-text-field-content-value__text'));

                var target = $(ele).find('td:eq(-2) input.k-text-field__input');
                //target.html('zzz');
                var message = $(ele).find('td:eq(1)').text().trim();
                console.log(message);
                var filteredData = settings.filter(x=>x.商品規格名稱==message || x.新商品規格名稱 == message);
                if(filteredData.length==1){
                    message = filteredData[0].品項條碼;
                    console.log("filteredData");
                    console.log(message);
                    (function(element,newValue,i){
                        setTimeout(()=>{

                            inputChangeValue(element, newValue);
                        },300*(i+1));
                    }(target.get(0),message,index));
                }


            });

            var weight = $('input[suffix="KG"]');
            if(weight.length>0){
                inputChangeValue(weight.get(0), '0.2');

                weight = $('input[label="長"]');
                inputChangeValue(weight.get(0), 30);
                weight = $('input[label="寬"]');
                inputChangeValue(weight.get(0), 30);
                weight = $('input[label="高"]');
                inputChangeValue(weight.get(0), 30);
            }
        }

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
    },5000);
    function getGoogleSheetSettings(sheetName="上架清單",prodId = 'CL023'){
        var responseText = $.ajax({
            type: "GET",
            url: `https://docs.google.com/spreadsheets/u/3/d/1wOHAOt3macyRcDlKUKaoopngzfZ-eKOTqnq9GQIKE0Y/gviz/tq?&sheet=${sheetName}&tq=SELECT+C,D,E,F,A+WHERE+A+is not null and (D='${prodId}' or A='${prodId}')`,
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


    // Your code here...
})();