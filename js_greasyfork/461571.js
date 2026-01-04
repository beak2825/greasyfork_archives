// ==UserScript==
// @name         莫筆克訂單排序
// @namespace    http://tampermonkey.net/
// @version      0.312111
// @description  莫筆克訂單排序功能
// @author       You
// @match        https://ec.mallbic.com/Module/2_Order/Order_Entry.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mallbic.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461571/%E8%8E%AB%E7%AD%86%E5%85%8B%E8%A8%82%E5%96%AE%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/461571/%E8%8E%AB%E7%AD%86%E5%85%8B%E8%A8%82%E5%96%AE%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        var button = $('li[title^="暫存區"]').last();
        //<li class="invert" id="sortOrderList1" title="訂單排序1 ▼"><p class="tag_l_corner"></p><p class="tag_title"><span class="undefined"></span>訂單排序1 ▼</p><p class="tag_r_corner"></p></li>
        button.after(`
        <li class="invert" id="sortOrderList" title="訂單排序 ▼"><p class="tag_l_corner"></p><p class="tag_title"><span class="undefined"></span>訂單排序 ▼</p><p class="tag_r_corner"></p></li>
    `);

        $('#sortOrderList').click(function(){
            var body = $('table:contains("配送日期")').last().find('tbody');
            if(body.length==0){
                body = $('table:contains("撿貨日期")').last().find('tbody');
            }
            if(body.length==0){
                body = $('table:contains("建立日期")').last().find('tbody');
            }
            if(body.length==0){
                body = $('table:contains("確認日期")').last().find('tbody');
            }

            var rows = body.find('tr');
            body.empty();
            var result = [];
            var rowdata=``;

            rowdata = prompt("請輸入子交易序號", "035100012345678");
            console.log(rowdata);
            var i = 1;
            for(var data of rowdata.split('\n')){
                if(data){
                    data = data.trim();
                    if(data.length==15){
                        body.append(`${i}.${data}<input type="checkbox" name="chk_order_txn" value="${data.substr(7,8)}|${data.substr(0,1)}|${parseInt(data.substr(1,2))}|${data.substr(3,1)}" qreason="44">`);
                    }else{
                        body.append(`${i}.${data}<input type="checkbox" name="chk_order_txn" value="${parseInt(data.substr(data.length-11,11))}|${data.substr(0,1)}|${parseInt(data.substr(1,2))}|${data.substr(3,data.length-11-3)}" qreason="44">`);
                    }
                    //body.append(`<input type="checkbox" name="chk_order_txn" value="${data.TxnNum}|${data.TxnPart}|${data.TxnSys}|${data.TxnShopId}" qreason="44">`);
                    i++;
                }
            }
            $('input[name="chk_order_txn"]').click();
            /*
            Mallbic.U.Sale.Ajax.OrderUtil.GetPrintTxnInfo([], m_TabMgnt.getCurrentTab().getPageCacheID(), false, function (ret) {
                result = dictionaryToMap(ret.value);
                var all = result[0];
                console.log(all);

                for(var data of all){
                    body.append(`<input type="checkbox" name="chk_order_txn" value="${data.TxnNum}|${data.TxnPart}|${data.TxnSys}|${data.TxnShopId}" qreason="44">`);
                }
                $('input[name="chk_order_txn"]').click();
            });
            */

        });

        $('#sortOrderList1').click(function(){
            var body = $('table:contains("配送日期")').last().find('tbody');
            var cloneBody = body.clone();
            var rows = body.find('tr');
            body.empty();


            //console.log($('#input_section textarea').val());
            var orderSeq = $('#input_section textarea').val().split('\n');
            //console.log(orderSeq);
            for(var order of orderSeq){
                var trs = cloneBody.find(`#${order}`);
                body.append(trs);
            }
            //console.log(rows);


            $('#chk_select_all').click();
        });


    },500);
    // Your code here...
})();