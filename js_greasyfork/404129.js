// ==UserScript==
// @name         学习强国小辅
// @namespace    Ragvivsw.
// @version      2.8964
// @description  作用非常局限，仅限于「自动点击提示」，方便看答案
// @author       Ragvivsw
// @match        https://pc.xuexi.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404129/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E5%B0%8F%E8%BE%85.user.js
// @updateURL https://update.greasyfork.org/scripts/404129/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E5%B0%8F%E8%BE%85.meta.js
// ==/UserScript==

//定义函数-页面加载
var loadFunc = function(func){
    if (document.addEventListener) {
        window.addEventListener("load", func, false);
    }
    else if (document.attachEvent) {
        window.attachEvent("onload", func);
    }
}

//定义函数-「确定」按钮加大
var quedingdaxiao = function(){
    let queding = document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.action-row > button")
    let jiexi = document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.solution")
    if (queding.disabled){
        window.scrollTo(0,0)
    }else{
        queding.style.height = "300px";
        queding.style.width = "300px";
        jiexi.style="pointer-events:none;"
    }
}

//定义函数-点击提示
var dianjitishi = function(){
    let dianji = document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-footer > span")
    switch (dianji.className.length) {
        case 4:
            document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-footer > span").click();
            break;
    }
}

//添加「全选」按钮
var tianjiaquanxuan = function(){
    var btnall = document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-header")
    btnall.style.width="460px";
    btnall.style.height="36px";
    btnall.style.border="medium double #0000FF";
    btnall.innerText = "「多选用 - 全部选择」";
    btnall.onclick=function(){
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(1)").click();
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(2)").click();
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(3)").click();
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(4)").click();
    }
}

//移除顶部
var dingbu = document.querySelector("#app > div > div.layout-header")
if (dingbu != null){
    dingbu.parentNode.removeChild(dingbu);
}
//移除底部
var dibu = document.querySelector("#app > div > div.layout-footer")
if (dibu != null){
    dibu.parentNode.removeChild(dibu);
}
//点击提示-重复执行
setInterval(dianjitishi,200);

//「确定」按钮加大-重复执行
setInterval(quedingdaxiao,500);

//添加「全选」按钮-重复执行
setInterval(tianjiaquanxuan,700);
