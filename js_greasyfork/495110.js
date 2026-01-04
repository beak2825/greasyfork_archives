// ==UserScript==
// @name         mcmod-tctool optimization
// @name:zh-CN	 mcmod神秘时代研究助手简单优化
// @version      2024-05-16
// @description  为部分步骤数增加了按钮以减少鼠标操作，增加了点击空白区域直接关闭弹窗的优化
// @author       GensouSakuya
// @match        https://www.mcmod.cn/tools/tctool/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mcmod.cn
// @grant        none
// @namespace https://greasyfork.org/users/194737
// @downloadURL https://update.greasyfork.org/scripts/495110/mcmod-tctool%20optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/495110/mcmod-tctool%20optimization.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here
    function setVal(value){
        $("#tctool-result-spinner").val(''+value);
        console.log("setvalue:"+value);
    }

    $("#tctool-result-close").parent().append('<input class="btn" type="button" id="tctool-1" value="1">')
    $("#tctool-result-close").parent().append('<input class="btn" type="button" id="tctool-2" value="2">')
    $("#tctool-result-close").parent().append('<input class="btn" type="button" id="tctool-3" value="3">')
    $("#tctool-result-close").parent().append('<input class="btn" type="button" id="tctool-4" value="4">')
    $("#tctool-result-close").parent().append('<input class="btn" type="button" id="tctool-5" value="5">')
    $("#tctool-result-close").parent().append('<input class="btn" type="button" id="tctool-6" value="6">')
    $("#tctool-result-close").parent().append('<input class="btn" type="button" id="tctool-7" value="7">')
    $("#tctool-result-close").parent().append('<input class="btn" type="button" id="tctool-8" value="8">')
    $("#tctool-result-close").parent().append('<input class="btn" type="button" id="tctool-9" value="9">')
    $("#tctool-1").on("click",()=>{setVal(1)})
    $("#tctool-2").on("click",()=>{setVal(2)})
    $("#tctool-3").on("click",()=>{setVal(3)})
    $("#tctool-4").on("click",()=>{setVal(4)})
    $("#tctool-5").on("click",()=>{setVal(5)})
    $("#tctool-6").on("click",()=>{setVal(6)})
    $("#tctool-7").on("click",()=>{setVal(7)})
    $("#tctool-8").on("click",()=>{setVal(8)})
    $("#tctool-9").on("click",()=>{setVal(9)})
    let dialog;
    $(".col-lg-12 .common-center").on("click",()=>{
        let dd = $(".ui-dialog").last();
        if(dd.css("display") === 'block')
        {
            if(dialog === undefined)
            {
                dialog = dd
            }
            else
            {
                $(".ui-dialog-titlebar-close").last().click()
                dialog= undefined;
                $(".tctool-result-frame").remove()
                $(".ui-dialog").remove()
            }
        }
        else if(dd.css("display") === 'none'){
            dialog= undefined;
            $(".tctool-result-frame").remove()
            $(".ui-dialog").remove()
        }
    });
})();