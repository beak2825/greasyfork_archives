// ==UserScript==
// @name		淘宝网小功能
// @description	1.自动勾选匿名购买。
// @namespace   bac818db1a548ba71e11b6923634275d
// @match     https://buy.taobao.com/auction/order/confirm_order.htm*
// @match     https://buy.taobao.com/auction/buy_now.jhtml*
// @author			ejin
// @version     2024.05.05.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24957/%E6%B7%98%E5%AE%9D%E7%BD%91%E5%B0%8F%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/24957/%E6%B7%98%E5%AE%9D%E7%BD%91%E5%B0%8F%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

// 2024.05.05 改版
// 2017.03.22 初版
//貌似速度太快了不能给表单填入内容，延迟一下
var thefunid=setInterval(function (){
    if (document.body.innerHTML.indexOf("匿名购买") != -1) {
        var ele=document.querySelector("input[id*=anonymous"); //包含关键词
        if ( ele && ele.checked == false ){
            ele.click();
        }
        clearInterval(thefunid);
    }
},1000);