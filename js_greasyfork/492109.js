// ==UserScript==
// @name         京东自动价格保护
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  打开京东价格保护页面，自动触发，可设置webhook以便登录失效时候通知
// @author       Austin.Young
// @match        *://pcsitepp-fm.jd.com/*
// @match        *://passport.jd.com/new/login.aspx?ReturnUrl=https%3A%2F%2Fpcsitepp-fm.jd.com%2Frest%2Fpricepro%2Fpriceapply
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492109/%E4%BA%AC%E4%B8%9C%E8%87%AA%E5%8A%A8%E4%BB%B7%E6%A0%BC%E4%BF%9D%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/492109/%E4%BA%AC%E4%B8%9C%E8%87%AA%E5%8A%A8%E4%BB%B7%E6%A0%BC%E4%BF%9D%E6%8A%A4.meta.js
// ==/UserScript==
let globalCount = 0;
let refreshHour = 8;
let delayClickSec = 15;
let globalInterval1 = null;
let globalInterval2 = null;

(function () {
    'use strict';
    // 匹配地址
    if (location.href.indexOf('//pcsitepp-fm.jd.com/') > -1) {
        autoPrice()
    }
})();

function autoClick() {
    if (globalCount > 3600 * refreshHour) {
        location.reload()
    }
    document.title = '已经刷新' + globalCount++ + '秒'
}

function doPUll() {
    window.scrollTo(0, document.body.scrollHeight); var a, b; function clickBtn(i) { console.log(i); if (i >= b) { return } window.scrollTo(0, a.eq(i).offset().top - 150); if (!!a.eq(i).attr("style")) { clickBtn(i + 1); return } if (a.eq(i).closest(".co-th").hasClass("has-apply") !== true) { a.eq(i).click() } var d = parseInt(1501 * Math.random() + 500, 10); setTimeout(function () { clickBtn(i + 1) }, d) } setTimeout(function () { $(".modifyRefundType").attr("value", "1"); a = $(".apply-list .co-th .btn a"); b = a.length; clickBtn(0) }, 1500);
}
function noDom(doc) {
    if ($(doc).length == 0) {
        console.log('找不到DOM对象:' + doc)
        return true
    }
    return false
}
function autoPrice() {
    let html = `<span style="float:right;padding:0 5px;margin-right:40px;">
    <input id="id_delayClickSec" type="number" min="1" max="9999">秒后自动点击,
    <input id="id_refreshHour" type="number" min="1" max="999">小时后自动刷新,
   <input id="jdonclick" type="button" value="设置"/>
   <input id="statstop" type="button" value="停止"/>
   </span>`
    if (noDom("#main .jb-header")) return;
    $("#main .jb-header").append(html)

    $("#jdonclick").click(function () {
        savePara()
    })
    $("#statstop").click(function () {
        statStop()
    })
    readPara();
    startIt()
}
function createFun(strFun)
{
    if(strFun.trim() == '')
    {
        strFun = "alert('logout!!')"
    }
    return new Function(strFun);
}
function savePara() {
    stopIt()
    refreshHour = $('#id_refreshHour').val();
    delayClickSec = $('#id_delayClickSec').val();
    localStorage.setItem('austinPrice-refreshHour', refreshHour)
    localStorage.setItem('austinPrice-delayClickSec', delayClickSec)
}
function readPara() {
    refreshHour = localStorage.getItem('austinPrice-refreshHour') ?? refreshHour
    delayClickSec = localStorage.getItem('austinPrice-delayClickSec') ?? delayClickSec

    if(noDom("#id_refreshHour"))return;
    $('#id_refreshHour').val(refreshHour);
    $('#id_delayClickSec').val(delayClickSec);
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
    $("#statstop").val('停止')
}
function stopIt() {
    clearInterval(globalInterval1)
    clearInterval(globalInterval2)
    globalInterval1 = null
    document.title = '运行'+globalCount+'秒后手动停止'
    $("#statstop").val('启动')
}