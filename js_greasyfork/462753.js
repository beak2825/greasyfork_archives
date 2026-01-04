// ==UserScript==
// @name         兔咩 批次改貨號
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  兔咩 批次改貨號 功能
// @author       You
// @match        https://ec.mallbic.com/Module/2_Good/Good_Entry.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mallbic.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462753/%E5%85%94%E5%92%A9%20%E6%89%B9%E6%AC%A1%E6%94%B9%E8%B2%A8%E8%99%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/462753/%E5%85%94%E5%92%A9%20%E6%89%B9%E6%AC%A1%E6%94%B9%E8%B2%A8%E8%99%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        var button = $('li[title*="條碼作業"]').last();
        button.after(`
        <li class="invert" id="batchChange" title="批次改貨號"><p class="tag_l_corner"></p><p class="tag_title"><span class="undefined"></span>批次改貨號</p><p class="tag_r_corner"></p></li>
    `);

        $('#batchChange').click(function(){
            var origin = prompt("請輸入要取代的舊貨號", "ZY1012024");
            var target = prompt("請輸入要修改的新貨號", "G10219");

            $('#input_section textarea').val(origin);
            var e = $.Event("keypress");
            e.keyCode = 13; // # Some key code value
            $('#input_section textarea').trigger(e);

            setTimeout(()=>{
                batchModify(origin,target);
            },1000);
        });


        function batchModify(origin,target){
            var interval=4;
            var rows = $(`td.good_id:contains("${origin}")`);
            for(var j =0;j<rows.length;j++){
                var row = rows[j];
                //console.log(row);
                (function(ele,j){
                    setTimeout(()=>{
                        $(`td.good_id:contains("${origin}")`).first().click();
                        setTimeout(()=>{
                            window.parent.$("#basic_good_edit").click();
                            var originalValue = window.parent.$("#txt_good_id input").val();
                            if(originalValue.startsWith(originalValue)){
                                window.parent.$("#txt_good_id input").val(originalValue.replace(origin,target));
                                setTimeout(()=>{
                                    window.parent.$("#basic_good_save").click();
                                },200);
                            }
                            setTimeout(()=>{
                                window.parent.$(".btn_close_m").click();
                            },1200);

                        },1000);
                    },1000*interval*(j+1));
                }($(row).get(0),j));
            }
        }
    },500);
    // Your code here...
})();