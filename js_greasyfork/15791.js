// ==UserScript==
// @name         抢魅族官网手机
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在魅族官网任意手机购买页面都可以使用
// @author       mountainguan
// @match        http://store.meizu.com/product/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15791/%E6%8A%A2%E9%AD%85%E6%97%8F%E5%AE%98%E7%BD%91%E6%89%8B%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/15791/%E6%8A%A2%E9%AD%85%E6%97%8F%E5%AE%98%E7%BD%91%E6%89%8B%E6%9C%BA.meta.js
// ==/UserScript==

var Selected = function(n){
    var arryList2 = $(".ver_btn");
    for(var i = 0;i< arryList2.length;i++){
        if(arryList2[i].getAttribute("data-flag")==n){
            arryList2[i].click();
        }
    }
};

//==================选中公开版=============
Selected(11);

//=================公开版选不到============
var btnn = document.getElementById("buyBtn");
if(btnn.getAttribute("class")=="less_btn"){
    //=================选YunOS版=============
    Selected(7);
    var btnn2 = document.getElementById("buyBtn");
        //选到加入购物车
    if(btnn2.getAttribute("class")!="less_btn") $("#addBtn")[0].click();
        //===============选不到刷新=========
    else location.reload();
}
else $("#addBtn")[0].click();