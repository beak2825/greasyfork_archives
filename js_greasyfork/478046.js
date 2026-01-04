// ==UserScript==
// @name         蝦皮發送發票中獎通知
// @namespace    http://tampermonkey.net/
// @version      0.1111111
// @description  蝦皮發送發票中獎通知 功能
// @author       You
// @match        https://seller.shopee.tw/portal/sale/order?search=*&lottery=1
// @icon         https://www.google.com/s2/favicons?domain=amego.tw
// @grant        unsafeWindow
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/478046/%E8%9D%A6%E7%9A%AE%E7%99%BC%E9%80%81%E7%99%BC%E7%A5%A8%E4%B8%AD%E7%8D%8E%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/478046/%E8%9D%A6%E7%9A%AE%E7%99%BC%E9%80%81%E7%99%BC%E7%A5%A8%E4%B8%AD%E7%8D%8E%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(()=>{

        var message =`
恭喜您的發票中獎，請至【光貿電子發票(amego)】網站查詢領獎：

賣方統編: 88469296
中獎訂單編號: {{訂單編號}}
蝦皮帳號：（填入你的蝦皮帳號）

如果有發票兌獎上問題，請與【光貿電子發票】客服中心詢問，謝謝。

也歡迎再到賣場逛逛唷！

`;


        var orderId;
        setTimeout(()=>{
            let params = new URLSearchParams(document.location.search);
            orderId = params.get("search");
            console.log(orderId);
            $('div.shopee-option:contains("訂單編號")').click();

            inputChangeValue($("input.eds-input__input").get(0), orderId);

            setTimeout(()=>{
                $('.osh-text').click();
            },3000);

        },2000);



        setTimeout(()=>{
            sendLotteryNotification();
        },10000);
        setTimeout(()=>{
            //window.close();
        },30*1000);

        function sendLotteryNotification(){
            var firstColumn = $('a:contains("已完成")').first();
            console.log(firstColumn);
            if(firstColumn){

                if(firstColumn.find('div[class*="buyer-chat-action"] i').length==0){
                    //unsafeWindow.location.reload();
                }

                var userName = firstColumn.find('div[class*="buyer-username"]').text().replace(/( )+/ig, "").replace(/(\n)+/ig, "");

                firstColumn.find('div[class*="buyer-chat-action"] i').click();
                var keyword = `中獎訂單編號: ${orderId}`;
                var newMessage = message.replace("中獎訂單編號: {{訂單編號}}",keyword).replace("{{您的蝦皮帳號}}",userName);
                console.log(newMessage);
                setTimeout(()=>{
                    if($(`#messagesContainer pre:contains("${keyword}")`).length==0){

                        //inputChangeValue(document.querySelector("textarea"), newMessage);
                        inputChangeValue($('textarea').last().get(0), newMessage);
                        setTimeout(()=>{
                           $('textarea').parent().find('div div i').first().click();
                                //$('div[class*="send-button"] div i').click();
                        },2000);


                    }

                },6000);
                return "";
            }else{
                //unsafeWindow.location.reload();
            }
            return "";
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


    },8000);



    // Your code here...
})();