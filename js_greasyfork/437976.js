// ==UserScript==
// @name        自动追加过滤网站（百度搜索）
// @namespace   append filters automatically in Baidu search
// @match       https://www.baidu.com/
// @grant       none
// @author      vccorz
// @version     0.0.1
// @description 在百度搜索自动追加过滤网站
// @downloadURL https://update.greasyfork.org/scripts/437976/%E8%87%AA%E5%8A%A8%E8%BF%BD%E5%8A%A0%E8%BF%87%E6%BB%A4%E7%BD%91%E7%AB%99%EF%BC%88%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/437976/%E8%87%AA%E5%8A%A8%E8%BF%BD%E5%8A%A0%E8%BF%87%E6%BB%A4%E7%BD%91%E7%AB%99%EF%BC%88%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%EF%BC%89.meta.js
// ==/UserScript==
var FILTERS = " -(site:zhidao.baidu.com | site:360doc.com)";
window.onload = function(){
    // 监听输入框的 enter 键
    var kw = document.getElementById("kw");
    // 监听输入框的“百度一下”按钮
    var su = document.getElementById("su");
    // 似乎按下 enter 键，就已经监听了“百度一下”按钮。
    // kw.onkeydown=function(ev){
    //     var event=ev || event;
    //     if(event.keyCode==13){
    //         console.log("自动追加过滤网站（百度搜索）：按了 enter 键。");
    //         kw.value= kw.value + FILTERS;
    //     }
    // }
    su.onclick=function(){
        console.log("自动追加过滤网站（百度搜索）：按了“百度一下”按钮。");
        kw.value= kw.value + FILTERS;
    }
}


