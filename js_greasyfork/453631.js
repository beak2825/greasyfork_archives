// ==UserScript==
// @name         填充 data-line_id
// @namespace    *
// @version      0.1
// @description  用于填充 data-line_id
// @author       yvan
// @match        https://*/*Rule/ERP/*
// @icon         https://*/favicon.ico
// @grant        none
// @license      MIT
// @require
// @downloadURL https://update.greasyfork.org/scripts/453631/%E5%A1%AB%E5%85%85%20data-line_id.user.js
// @updateURL https://update.greasyfork.org/scripts/453631/%E5%A1%AB%E5%85%85%20data-line_id.meta.js
// ==/UserScript==

(function() {
$("#select-info .divline").append('<input id="dataLineId" type="button" value="填充data-line_id" />');
    $('#dataLineId').on('click',function(){
        var trSize= $("#list1 .tablelang tbody tr").size();
        console.log(trSize);
        if(trSize===0)
        {
            alert("请先查询单据");
        }else{
            $("#list1 .tablelang tbody tr").each(function(){
                var id=$(this).attr("id");
                console.log(id);
                $(this).attr("data-line_id",id);
            });
            alert("填充完成");
        }
    });
})();