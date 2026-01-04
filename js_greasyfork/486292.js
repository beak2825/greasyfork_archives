// ==UserScript==
// @name         NOC自动15倍播放视频(时间精力有限停止维护，已删除)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  视频自动倍速播放，不用一直观察是不是被系统暂停了。
// @author       朱海
// @match        http://ccp.noc.net.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=noc.net.cn
// @license      End-User License Agreement


// @downloadURL https://update.greasyfork.org/scripts/486292/NOC%E8%87%AA%E5%8A%A815%E5%80%8D%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%28%E6%97%B6%E9%97%B4%E7%B2%BE%E5%8A%9B%E6%9C%89%E9%99%90%E5%81%9C%E6%AD%A2%E7%BB%B4%E6%8A%A4%EF%BC%8C%E5%B7%B2%E5%88%A0%E9%99%A4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/486292/NOC%E8%87%AA%E5%8A%A815%E5%80%8D%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%28%E6%97%B6%E9%97%B4%E7%B2%BE%E5%8A%9B%E6%9C%89%E9%99%90%E5%81%9C%E6%AD%A2%E7%BB%B4%E6%8A%A4%EF%BC%8C%E5%B7%B2%E5%88%A0%E9%99%A4%29.meta.js
// ==/UserScript==

(function () {
    // 创建一个日志框
    var logdiv = document.createElement('div');
    logdiv.id = 'logdiv';
    logdiv.style.position = 'fixed';
    //logdiv.style.backgroundColor = '#ee3f4d';
    //logdiv.style.backgroundColor = '#fff';
    logdiv.style.width = '500px';
    logdiv.style.height = '50px';
    logdiv.style.left = '20px';
    logdiv.style.top = '50px';
    logdiv.style.overflowY = 'scroll';
    document.body.appendChild(logdiv);

    //暂停了几次
    var num = 0;
    // 获取播放按钮
    var btn = document.getElementById('btnPlay')
    // 获取视频
    var v = document.querySelector('video');

   
})();

function setLog(info) {
    let span = document.createElement('span');
    span.innerHTML = getDate() + " - " + info;
    logdiv.appendChild(span);
    let br = document.createElement('br');
    logdiv.appendChild(br);
}

function getDate() {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var date = myDate.getDate();
    var h = myDate.getHours();
    var m = myDate.getMinutes();
    var s = myDate.getSeconds();
    //var now = year + '年' + month + "月" + date + "日" + h + ':' + m + ":" + s;
     var now =   h + ':' + m + ":" + s;
    return now;
}