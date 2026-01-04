// ==UserScript==
// @name         淘宝自动价格保护
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  打开淘宝价格保护 https://pages.tmall.com/wow/z/marketing-tools/mkt/price-center ，自动触发，可设置webhook以便登录失效时候通知
// @author       Austin.Young
// @match        *://pages.tmall.com/wow/z/marketing-tools/mkt/price-center*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498356/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E4%BB%B7%E6%A0%BC%E4%BF%9D%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/498356/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E4%BB%B7%E6%A0%BC%E4%BF%9D%E6%8A%A4.meta.js
// ==/UserScript==
let globalCount = 0;
let refreshHour = 8;
let delayClickSec = 15;
let globalInterval1 = null;
let globalInterval2 = null;

(function () {
    'use strict';
    // 匹配地址
    if (location.href.indexOf('//pages.tmall.com/wow/z/marketing-tools/mkt/price-center') > -1) {
        autoPrice()
    }
})();

function autoClick() {
    let left = 3600 * refreshHour-globalCount
    if ( left < 0 ) {
        location.reload()
    }
    document.title = '已经刷新' + globalCount++ + '秒,余'+left+'秒'
}
function $(sel){
    let arr = document.querySelectorAll(sel)
    if(arr.length ==0) return null;
    else if(arr.length ==1)return arr[0]
    else return arr;
}
function doPUll() {
    if($("body>div>iframe")!=null){
// 登录页面
        window.open('https://login.taobao.com/member/login.jhtml?autoPrice')
        stopIt()
    }else{
        let b = document.querySelectorAll('#mallPage div.rax-view-v2.foot_btn')[0]
        b.click()
        console.log(new Date(),'has clicked')
    }
}
function noDom(doc) {
    if ($(doc)==null) {
        console.log('找不到DOM对象:' + doc)
        return true
    }
    return false
}
function autoPrice() {
    if($('#id_delayClickSec')!=null)return
    let html = `<span style="position: relative;z-index:99999;float:right;padding:0 5px;margin-right:40px;">
    <input id="id_delayClickSec" type="number" min="1" max="9999">秒后自动点击,
    <input id="id_refreshHour" type="number" min="1" max="999">小时后自动刷新,
   <input id="jdonclick" type="button" value="设置"/>
   <input id="statstop" type="button" value="停止"/>
   </span>`
    if (noDom("#mallPage")) return;
    let contentDiv = $("#mallPage")
    const newDiv = document.createElement('div');
    newDiv.innerHTML = html
    contentDiv.insertBefore(newDiv, contentDiv.firstChild);

    $("#jdonclick").click(function () {
        savePara()
    })
    $("#statstop").click(function () {
        statStop()
    })
    readPara();
    startIt()
}

function savePara() {
    stopIt()
    refreshHour = $('#id_refreshHour').value;
    delayClickSec = $('#id_delayClickSec').value;
    localStorage.setItem('austinPrice-refreshHour', refreshHour)
    localStorage.setItem('austinPrice-delayClickSec', delayClickSec)
}
function readPara() {
    refreshHour = localStorage.getItem('austinPrice-refreshHour') ?? refreshHour
    delayClickSec = localStorage.getItem('austinPrice-delayClickSec') ?? delayClickSec

    if(noDom("#id_refreshHour"))return;
    $('#id_refreshHour').value = (refreshHour);
    $('#id_delayClickSec').value =(delayClickSec);
}
function statStop() {
    if (globalInterval1 != null) {
        stopIt()
    } else {
        startIt()
    }
}

function startIt() {
    globalCount = 0
    globalInterval1 = setTimeout(doPUll, 1000 * delayClickSec);
    globalInterval2 = setInterval(autoClick, 1000);
    $("#statstop").value =('停止')
}
function stopIt() {
    clearInterval(globalInterval1)
    clearInterval(globalInterval2)
    globalInterval1 = null
    document.title = '运行'+globalCount+'秒后手动停止'
    $("#statstop").value =('启动')
}