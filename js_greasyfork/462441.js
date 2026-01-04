// ==UserScript==
// @name         客優雲設置規格
// @namespace    http://tampermonkey.net/
// @version      2025-12-18
// @description  客優雲設置規格功能
// @author       You
// @match        https://erp.keyouyun.com/offers/posts/*
// @match        https://world.keyouyun.com/offers/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keyouyun.com
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462441/%E5%AE%A2%E5%84%AA%E9%9B%B2%E8%A8%AD%E7%BD%AE%E8%A6%8F%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/462441/%E5%AE%A2%E5%84%AA%E9%9B%B2%E8%A8%AD%E7%BD%AE%E8%A6%8F%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        var button = $('button:contains("一鍵設置")').last();
        button.after(`
        <button type="button" class="v-btn v-btn--block theme--light primary" id="setSpec"><div class="v-btn__content">設置規格編號</div></button>
        <button type="button" class="v-btn v-btn--block theme--light primary" id="setPolywellSpec"><div class="v-btn__content">設置寶利威爾規格編號</div></button>
        `);



        $('#setSpec').click(function(){
            var totalCol = $('div.inventory-form__list thead th').length;
            console.log(totalCol);

            var prodId = $('div.v-form-item:contains("商品編碼") input').first().val();
            if(!prodId){
                var title = $('div.shopee-sensitive-words-input__mask').first().text();
                prodId = title.substring(title.length-5);
            }
            console.log(prodId);


            var targetIndex=0;
            var priceIndex = 0;

            $('div.inventory-form__list thead th').each((index,ele)=>{
                console.log($(ele).text());

                if($(ele).text().includes("規格編碼")){
                    targetIndex = index;
                }
                switch($(ele).text()){
                        //case " 規格編碼 自动 |  批量 ":
                        //targetIndex = index;
                        //break;
                    case "價格價格":
                        priceIndex = index;
                        break;

                }
            });

            console.log(targetIndex);
            console.log(priceIndex);

            $('div.inventory-form__list tbody tr').each((index,ele)=>{
                //console.log($(ele).find('td:eq(-2) .k-text-field-content-value__text'));


                var target = $(ele).find(`td:eq(${targetIndex}) input.k-text-field__input`);

                if(target.length==0){
                    target = $(ele).find('td:eq(5) input.k-text-field__input');
                }
                //target.html('zzz');
                var message = $(ele).find('td:eq(1)').text().trim();
                if(message.substring(0,5)!=prodId){
                    message = prodId+"-"+message;
                }
                if(priceIndex==3){
                    message += "-"+$(ele).find('td:eq(2)').text().trim();
                }
                //console.log(message);
                inputChangeValue(target.get(0), message);

            });
        });

        $('#setPolywellSpec').click(function(){
            var totalCol = $('div.inventory-form__list thead th').length;
            console.log(totalCol);

            var prodId = $('div.v-form-item:contains("商品編碼") input').first().val();
            if(!prodId){
                var title = $('div.shopee-sensitive-words-input__mask').first().text();
                prodId = title.substring(title.length-5);
            }
            console.log(prodId);

            var stocks = getStockByProdId(prodId);
            var skuCodes = stocks.map(s=>s.productSkuCode[0]);

            var targetIndex=0;
            var priceIndex = 0;

            $('div.inventory-form__list thead th').each((index,ele)=>{
                console.log($(ele).text());

                if($(ele).text().includes("規格編碼")){
                    targetIndex = index;
                }
                switch($(ele).text()){
                        //case " 規格編碼 自动 |  批量 ":
                        //targetIndex = index;
                        //break;
                    case "價格價格":
                        priceIndex = index;
                        break;

                }
            });

            console.log(targetIndex);
            console.log(priceIndex);

            $('div.inventory-form__list tbody tr').each((index,ele)=>{
                //console.log($(ele).find('td:eq(-2) .k-text-field-content-value__text'));


                var target = $(ele).find(`td:eq(${targetIndex}) input.k-text-field__input`);

                if(target.length==0){
                    target = $(ele).find('td:eq(5) input.k-text-field__input');
                }
                //target.html('zzz');
                var message = $(ele).find('td:eq(1)').text().trim();
                if(message.substring(0,5)!=prodId){
                    message = prodId+"-"+message+"-";
                }

                if(priceIndex==3){
                    message += "-"+$(ele).find('td:eq(2)').text().trim();
                }
                var filtered = skuCodes.filter(s=>s.includes(message));
                if(filtered.length>0){
                    var newOne = filtered[0];
                    message= newOne;
                }
                //console.log(message);
                inputChangeValue(target.get(0), message);

            });
        });

        function getStockByProdId(prodId){
            var prods;
            $.ajax({
                url:`https://world.keyouyun.com/vn/api/sc-item?itemSkuCode=&title=${prodId}&keyword=&beginDate=&endDate=&ubenginDate=&uendDate=&page=1&size=100&providerId=&source=&type=0`,
                type:"GET",
                contentType:"application/json; charset=utf-8",
                //dataType:"json",
                success: function(data){
                    prods = data;
                },
                xhrFields: {
                    withCredentials: true
                },
                async: false
            });
            return prods;

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
    },10000);
})();