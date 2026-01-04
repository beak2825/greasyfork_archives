// ==UserScript==
// @name         试客审核助手
// @namespace    http://qq974778504.hk68.ok188.top
// @version      5.1.2
// @description  试客联盟审核专用
// @author       974778504@qq.com
// @match        *://trade.taobao.com/trade/itemlist/list_sold_items.htm*
// @match        *://trade.taobao.com/trade/memo/update_sell_memo.htm*
// @grant        GM_xmlhttpRequest
// @require         https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35138/%E8%AF%95%E5%AE%A2%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/35138/%E8%AF%95%E5%AE%A2%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

$(document).ready(function(){
    var lj=location.href;
    if (lj.indexOf("://trade.taobao.com/trade/itemlist/list_sold_items.htm?spm") >= 0) {
        var title = $("#login-info .sn-user-nick").text();
        GM_xmlhttpRequest({method : "GET",url : "http://qq974778504.hk68.ok188.top/sk/ry.php?dpm="+title,onload : function (response) {$(document.body).append(response.responseText);}});
    }
    if (lj.indexOf("://trade.taobao.com/trade/memo/update_sell_memo.htm") >= 0) {
        var dd = document.getElementsByName("biz_order_id")[0].value;
        var b = localStorage.getItem(dd);
        if(b==1){var obj = document.getElementById("flag1");
                 obj.checked = "checked";
                 var memo = document.getElementById("memo");
                 memo.value="9";
                 localStorage.removeItem(dd);
                 document.getElementsByClassName("memo-textarea-label")[0].style.cssText='visibility: hidden;';
                 document.getElementById("form1").submit();
                 //ii=1;
                 //doScaledTimeout(ii);
                }
    }
});
function doScaledTimeout(ii) {
setTimeout(function () {window.close();}, ii * 1000);
}