// ==UserScript==
// @name		淘宝网自动匿名购买。
// @description	自动勾选匿名购买。
// @namespace   bac818db1a548ba71e11b6923634275d
// @include     https://buy.taobao.com/auction/order/confirm_order.htm*
// @include     https://buy.taobao.com/auction/buy_now.jhtml*
// @author			ejin
// @version     2017.09.22
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33723/%E6%B7%98%E5%AE%9D%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8C%BF%E5%90%8D%E8%B4%AD%E4%B9%B0%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/33723/%E6%B7%98%E5%AE%9D%E7%BD%91%E8%87%AA%E5%8A%A8%E5%8C%BF%E5%90%8D%E8%B4%AD%E4%B9%B0%E3%80%82.meta.js
// ==/UserScript==



//貌似速度太快了不能给表单填入内容，延迟一下
var thefunid=setInterval(function (){
    if (document.body.innerHTML.indexOf("匿名购买")) {
        if ( document.getElementById("anonymous_1").getElementsByClassName("toggle-checkbox")[0].checked === false ){
            document.getElementById("anonymous_1").getElementsByClassName("toggle-checkbox")[0].click();
        }
        clearInterval(thefunid);
    }
},1000);