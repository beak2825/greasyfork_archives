// ==UserScript==
// @name         無尾熊自動分類暫存區
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  無尾熊自動分類暫存區 功能
// @author       You
// @match        https://ec.mallbic.com/Module/2_Order/Order_Entry.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mallbic.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.6/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/463283/%E7%84%A1%E5%B0%BE%E7%86%8A%E8%87%AA%E5%8B%95%E5%88%86%E9%A1%9E%E6%9A%AB%E5%AD%98%E5%8D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/463283/%E7%84%A1%E5%B0%BE%E7%86%8A%E8%87%AA%E5%8B%95%E5%88%86%E9%A1%9E%E6%9A%AB%E5%AD%98%E5%8D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        var button = $('li[title^="暫存區"]').last();
        //<li class="invert" id="sortOrderList1" title="訂單排序1 ▼"><p class="tag_l_corner"></p><p class="tag_title"><span class="undefined"></span>訂單排序1 ▼</p><p class="tag_r_corner"></p></li>
        button.after(`
        <li class="invert" id="setTemporaryStorage" title="自動分類 ▼"><p class="tag_l_corner"></p><p class="tag_title"><span class="undefined"></span>自動分類 ▼</p><p class="tag_r_corner"></p></li>
        <li class="invert" id="autoUpload" title="自動上傳 ▼"><p class="tag_l_corner"></p><p class="tag_title"><span class="undefined"></span>自動上傳 ▼</p><p class="tag_r_corner"></p></li>
    `);

        $('#autoUpload').click(function(){
            alert("要開始上傳囉");
            var orderTab = m_TabMgnt.getCurrentTab();
            var txnkeys = orderTab.getSelTxnKeys();
            var cfgId = "638147817833130570";
            Mallbic.U.Sale.Ajax.OrderUtil.GetExportedOrderCacheID(
                { CfgName: null, CfgId: cfgId, KeyList: txnkeys }, orderTab.getPageCacheID(), function (ret) {
                    var cache_id = ret.value;
                    if (cache_id > 0){
                        getExcelFileByCacheId(cache_id);
                    }
                });
        });
        $('#setTemporaryStorage').click(function(){
            alert("要開始分類囉");
            var response = JSON.parse($.ajax({type: "GET",
                                              url: `https://script.google.com/macros/s/AKfycbzeVm36LjJzHxc8MAXSyNun2Fh0_q2f6f_SJKk0_WB4fK7YXpT55n2PFgEjFEHZQfLmTw/exec?type=queryUrl`,
                                              async: false}
                                            ).responseText);

            var url = response.url;
            var storeid =  getCookie("usale_login_store_id");

            var result = JSON.parse($.ajax({type: "GET",
                                            url: `${url}?type=getCategoryData&storeid=${storeid}`,
                                            async: false}
                                          ).responseText);

            //console.log(result);
            var j = 1;
            var interval = 25;
            for(var key in result){
                var page = key;
                var conditions =result[key].join("\n");
                (function(page,conditions,j){
                    setTimeout(()=>{
                        console.log(page);
                        //console.log(conditions);
                        console.log(j);
                        setByConditions(page,conditions);
                    },1000*interval*(j));
                }(page,conditions,j));

                j++;
            }
            setTimeout(()=>{
                alert("置入暫存區okay");
            },1000*interval*(j));


        });

    },700);

    function getExcelFileByCacheId(cacheId){
        var url = `https://ec.mallbic.com/Module/2_Order/Order_Export.aspx?cache_id=${cacheId}`;
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.responseType = "arraybuffer";

        oReq.onload = function(e) {
            var arraybuffer = oReq.response;
            console.log(arraybuffer);
            /* convert data to binary string */
            var data = new Uint8Array(arraybuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");

            /* Call XLSX */
            var workbook = XLSX.read(bstr, {
                type: "binary"
            });

            /* DO SOMETHING WITH workbook HERE */
            var first_sheet_name = workbook.SheetNames[0];
            /* Get worksheet */
            var worksheet = workbook.Sheets[first_sheet_name];
            var result = XLSX.utils.sheet_to_json(worksheet, {
                raw: true
            });
            postToGoogle(result);

            console.log(result);
        }

        oReq.send();
    }

    function postToGoogle(data){
        var response = JSON.parse($.ajax({type: "GET",
                                          url: `https://script.google.com/macros/s/AKfycbzeVm36LjJzHxc8MAXSyNun2Fh0_q2f6f_SJKk0_WB4fK7YXpT55n2PFgEjFEHZQfLmTw/exec?type=queryUrl`,
                                          async: false}
                                        ).responseText);
        var storeid = getCookie("usale_login_store_id");
        var formData = {storeid,data};

        var url = response.url;
        GM_xmlhttpRequest ( {
            method:     "POST",
            url:        url,
            data:       JSON.stringify(formData),
            followAllRedirects: true,
            headers:    {
                "Content-Type": "application/json;charset=utf-8"
            },
            onload:     function (response) {
                console.log(response.responseText);
                alert("上傳結束，請確認雲端檔案");

            }
        } );

    }

    function setByConditions(page,conditions){
        //var conditions = prompt("請輸入子交易序號", "035100012345678");

        filterByConditions(conditions);

        setTimeout(()=>{
            //$('#chk_select_all').click();
            setTimeout(()=>{
                //$('.op_into_queue').click();
                $(`li.group-item[dropdown-group="自動分單"]:contains("${page}")`).click();
                //<span id="a_confirm" class="btn_text_m" style="margin-right: 5px; padding: 5px 10px; float: right;">確認</span>
                setTimeout(()=>{
                    if(window.parent.$('#a_confirm').is(':visible')){
                        window.parent.$('#a_confirm').click();
                    }
                },500);

            },1000);
        },10500);
    }

    function filterByConditions(conditions){
        $('#srch_field').val(15);
        //$('#srch_status').val(0);
        $('#full-match-search').click();
        $('#input_section textarea').val(conditions);
        var e = $.Event("keypress");
        e.keyCode = 13; // # Some key code value
        $('#input_section textarea').trigger(e);


    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // Your code here...
})();