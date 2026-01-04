// ==UserScript==
// @name         zeroRefresh
// @namespace    https://greasyfork.org/zh-CN/users/101499
// @version      1.0.0.2
// @description  每天0点后自动刷新一次页面，配合其他脚本或扩展挂机
// @include      *://live.bilibili.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/35400/zeroRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/35400/zeroRefresh.meta.js
// ==/UserScript==

var pM = 10;  //检测间隔分钟数，即刷新时间精度
var hh = 0;   //小时数，24小时
var mm = 0;   //分钟数

if (Number((new Date()).getDate())==9) hh=7; //10号刷新签到取得月费老爷3天，延迟几小时刷新

function checkrefresh(){
    var d = new Date();
    if(Number(d.getHours()) == hh && Number(d.getMinutes()) >= mm && Number(d.getMinutes()) <= mm + pM){
        location.reload(true);
    }
}
setInterval(checkrefresh, 60000 * pM);