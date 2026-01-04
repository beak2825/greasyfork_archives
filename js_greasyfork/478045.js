// ==UserScript==
// @name         光貿發送中獎發票
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  光貿發送中獎發票 功能
// @author       You
// @match        https://invoice.amego.tw/vendor/88469296/invoice_lottery_report
// @icon         https://www.google.com/s2/favicons?domain=amego.tw
// @grant        unsafeWindow
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/478045/%E5%85%89%E8%B2%BF%E7%99%BC%E9%80%81%E4%B8%AD%E7%8D%8E%E7%99%BC%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/478045/%E5%85%89%E8%B2%BF%E7%99%BC%E9%80%81%E4%B8%AD%E7%8D%8E%E7%99%BC%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(()=>{
        var button = $('button:contains("送出")');
        button.parent().parent().after(`
    <div>
        <button class="btn btn-sm btn-primary" id="sendNotification">發送至蝦皮</button>
    </div>
    `);},3000);

    setTimeout(()=>{



        $('#sendNotification').click(function(){
            console.log("start");
            var j = 0;
            $('tr:gt(0)').each((index,ele)=>{
                var invoice_id = $(ele).find('td').eq(1).text().replace(/ /ig,"").replace(/\s/ig,"");
                console.log(`'${invoice_id}'`);
                (function(id,j){setTimeout(()=>{
                    window.open(`https://seller.shopee.tw/portal/sale/order?search=${id}&lottery=1`);
                },25*1000*j);
                               }(invoice_id,j));
                j++;

            });
        });

    },8000);



    // Your code here...
})();