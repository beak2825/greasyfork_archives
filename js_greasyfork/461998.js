// ==UserScript==
// @name         莫筆克自動取號功能
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  莫筆克 自動取號
// @author       You
// @match        https://ec.mallbic.com/Module/2_Order/Order_Entry.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mallbic.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461998/%E8%8E%AB%E7%AD%86%E5%85%8B%E8%87%AA%E5%8B%95%E5%8F%96%E8%99%9F%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/461998/%E8%8E%AB%E7%AD%86%E5%85%8B%E8%87%AA%E5%8B%95%E5%8F%96%E8%99%9F%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        var button = $('li[title^="暫存區"]').last();
        //<li class="invert" id="sortOrderList1" title="訂單排序1 ▼"><p class="tag_l_corner"></p><p class="tag_title"><span class="undefined"></span>訂單排序1 ▼</p><p class="tag_r_corner"></p></li>
        button.after(`
        <li class="invert" id="generateTrackNo" title="自動取號 ▼"><p class="tag_l_corner"></p><p class="tag_title"><span class="undefined"></span>自動取號 ▼</p><p class="tag_r_corner"></p></li>
        <li class="invert" id="updateMobilePhone" title="更新宅配電話 ▼"><p class="tag_l_corner"></p><p class="tag_title"><span class="undefined"></span>更新宅配電話 ▼</p><p class="tag_r_corner"></p></li>
    `);

        $('#updateMobilePhone').click(function(){
            updateMobilePhone();

        });
        $('#generateTrackNo').click(function(){
            generateTrackNo();

        });

    },700);


    function updateMobilePhone(){
        if (!confirm('開始更新宅配電話')) {
            return;
        }
        var interval=4;
        var rows = $('a[id="link_txn"]');
        for(var j =0;j<rows.length;j++){
            var row = rows[j];
            //console.log(row);
            (function(ele,j){
                setTimeout(()=>{
                    $('a[id="link_txn"]').eq(j).click();
                    //$(ele).click();

                    setTimeout(()=>{

                        var phone = window.parent.$("#recv_mobile_phone").text();
                        if(/\d{10}/ig.test(phone)){
                            var memo = window.parent.$("#td_shipment_memo").text();
                            var phonePattern = `；【${phone}】`;
                            var newMemo = memo.replace(phonePattern,"")+phonePattern;
                            window.parent.$("#modify_store_comment").click();
                            setTimeout(()=>{
                                window.parent.$("#td_shipment_memo").find('textarea').val(newMemo);
                                setTimeout(()=>{
                                    window.parent.$("#btn_save_order").click();
                                },500);
                            },500);
                        }
                    },1000);

                },1000*interval*(j));
            }($(row).get(0),j));
        }
        setTimeout(()=>{
            alert("已結束");
            window.parent.$(".btn_close_m").click();

        },1000*interval*(j+1));
    }


    var interval = 4;
    function generateTrackNo(){
        $('li:contains("出貨列印")').click();
        setTimeout(()=>{
            clickBarCode();
        },2000);
    }
    var mappingList = ["seven-stxn","family-stxn","hilife-stxn","okmart-stxn","express-stxn"];
    function clickBarCode(){
        var operationRows = window.parent.$('div.bcode:not(.disable)').closest('tr');
        operationRows.find('div.bcode').click();
        for(var j =0;j<operationRows.length;j++){
            var row = operationRows[j];
            //console.log(row);
            (function(row,j){
                setTimeout(()=>{
                    var types = $(row).attr("id").split("-");
                    types.shift();
                    if(!mappingList.includes(types.join("-"))){
                        return;
                    }

                    $(row).find('span.prt-btn-prt:contains("列印")').click();

                    setTimeout(()=>{
                        removePrint();
                        if(window.parent.$('span:contains("取得列印資料")').is(':visible')){
                            window.parent.$('span:contains("取得列印資料")').click();
                            setTimeout(()=>{
                                window.parent.$('span:contains("繼續")').click();
                            },1000);
                        }else{
                            setTimeout(()=>{
                                window.parent.$('span:contains("關閉")').click();
                            },1000);


                        }
                        //window.parent.$('#a_cancel').click();
                    },2000);

                },1000*interval*(j+1));
            }(row,j));
        }
        setTimeout(()=>{
            window.parent.$('span:contains("關閉")').click();
        },1000*interval*(j+2));
    }

    function removePrint(){
        document.execCommand = console.log;
        window.alert = console.log;
        window.print = function (){console.log("print")};
        window.parent.window.alert = console.log;
        window.parent.window.print = function (){console.log("print")};

        for(var i = 0 ;i<window.frames.length;i++){
            window.frames[i].print = function (){console.log("print")};
            window.frames[i].document.execCommand = console.log;
        }
        for( i = 0 ;i<window.parent.window.frames.length;i++){
            window.parent.window.frames[i].print = function (){console.log("print")};
            window.parent.window.frames[i].document.execCommand = console.log;
        }

    }
    // Your code here...
})();