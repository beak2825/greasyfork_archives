

    // ==UserScript==
    // @name         速卖通上货beta
    // @namespace    http://tampermonkey.net/
    // @version      0.253
    // @description  上货。
    // @author       wwp
    // @match        *://gsp.aliexpress.com/apps/product/publish*
    // @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426896/%E9%80%9F%E5%8D%96%E9%80%9A%E4%B8%8A%E8%B4%A7beta.user.js
// @updateURL https://update.greasyfork.org/scripts/426896/%E9%80%9F%E5%8D%96%E9%80%9A%E4%B8%8A%E8%B4%A7beta.meta.js
    // ==/UserScript==
     

//main
(function() {
    console.log("页面加载完成");
    console.log( $("#struct-nav > div > ul"));
    var Span_ClearGoods = '<li role="menuitem" title=" 扩展:清空商品" aria-selected="false" tabindex="-1" class="next-menu-item next-nav-item"><div class="next-menu-item-inner"><span class="next-menu-item-text"><span style="color:red;" onclick="ClearGoods()">清空商品</span></span></div></li>';
    $("#struct-nav > div > ul")[0].innerHTML = $("#struct-nav > div > ul").innerHTML + Span_ClearGoods;
})();

window.onload=function(){
    console.log("页面加载完成");
    console.log( $("#struct-nav > div > ul"));
    var Span_ClearGoods = '<li role="menuitem" title=" 扩展:清空商品" aria-selected="false" tabindex="-1" class="next-menu-item next-nav-item"><div class="next-menu-item-inner"><span class="next-menu-item-text"><span style="color:red;" onclick="ClearGoods()">清空商品</span></span></div></li>';
    $("#struct-nav > div > ul")[0].innerHTML = $("#struct-nav > div > ul").innerHTML + Span_ClearGoods;
    }
    


//清空商品
function ClearGoods() {
    var _length = $("#struct-saleProp > div:nth-child(1) > div.next-col.next-col-20.sell-o-addon-content > div > div.info-content > div > div > div").children.length;
    for (var i = 1; i < _length; i++) {
        console.log(i);
        $("#struct-saleProp > div:nth-child(1) > div.next-col.next-col-20.sell-o-addon-content > div > div.info-content > div > div > div > div:nth-child(" + i + ") > div > span.color-upload-wrap > button").click();
    }
}