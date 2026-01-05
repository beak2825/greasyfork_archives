// ==UserScript==
// @name        还原淘宝登陆
// @namespace   Taobao
// @include     https://login.taobao.com/*
// @version     1
// @grant       none
// @description 避免出现淘宝二维码登录界面
// @downloadURL https://update.greasyfork.org/scripts/25837/%E8%BF%98%E5%8E%9F%E6%B7%98%E5%AE%9D%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/25837/%E8%BF%98%E5%8E%9F%E6%B7%98%E5%AE%9D%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==
function clickIt() {
    var j_Quick = document.getElementById("J_Quick2Static");
    if (j_Quick) {
        // alert("yse");
        j_Quick.click();
    }
}
var QRcode=document.getElementById("J_QRCodeLogin");
if(QRcode)
{
    QRcode.parentNode.parentNode.removeChild(QRcode.parentNode);
}
else{
    console.warn("未找到QRcode");
}

// clickIt();
window.onload = clickIt; 