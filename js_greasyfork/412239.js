// ==UserScript==
// @name         强国每日答题
// @namespace    qg
// @version      1.1
// @description  自动点击
// @author       qg
// @match        https://pc.xuexi.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412239/%E5%BC%BA%E5%9B%BD%E6%AF%8F%E6%97%A5%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/412239/%E5%BC%BA%E5%9B%BD%E6%AF%8F%E6%97%A5%E7%AD%94%E9%A2%98.meta.js
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

//选择题
var xuanzheti = function(){
var xuanzheti = document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-header")
if (xuanzheti.innerText == "多选题"){
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(1)").click();//全选“Abcd”
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(2)").click();
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(3)").click();
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(4)").click();
        document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.action-row > button").click();
   }
if (xuanzheti.innerText == "单选题"){
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(1)").click();//只选“A”
        document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.action-row > button").click();
   }

}

//单空填空题
var tiankongti = function(){
var tiankongti = document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-header")
if (tiankongti.innerText == "填空题"){
    var kongge = document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-body > div > input");
    var daan = document.querySelector("#body-body > div:nth-child(12) > div > div > div > div.ant-popover-inner > div > div > div > font").innerText;
    kongge.value = daan;
   }
}
// 点击“下一题”
setInterval(function(){
    document.querySelector("#app > div > div > div > div.detail-body > div.action-row > button").click();
},700);

// 点击“再来一组”  页面限制10秒内只能答题一次
setInterval(function(){
    document.querySelector("#app > div > div.layout-body > div > div.ant-spin-nested-loading > div > div > div.action-row > button").click();
},7000);

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
setInterval(quedingdaxiao,1000);

//选择题-重复执行
setInterval(xuanzheti,2000);

//填空题-重复执行
setInterval(tiankongti,3000);
