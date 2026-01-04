// ==UserScript==
// @name         签到脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  网站和论坛自动签到脚本
// @author       shaoyang_v
// @match        https://bbs.kafan.cn/
// @match        http://ishare.iask.sina.com.cn/ucenter/sign
// @match        http*://www.52pojie.cn/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34990/%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/34990/%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 转自：https://greasyfork.org/zh-CN/scripts/22511-%E8%AE%BA%E5%9D%9B%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7

if (isURL("bbs.kafan.cn")) {
    //卡饭论坛
    var imgs = document.getElementById("pper_a").getElementsByTagName("IMG");
    if (imgs[0].src.indexOf("wb.png") == -1) {
        var a = document.getElementById("pper_a");
        a.click();
        return;
    }
}

if (isURL("ishare.iask.sina.com.cn/ucenter/sign")) {
    //爱问共享
    var btns = document.getElementById("J_btn-sign");
    if (btns.innerHTML == "马上签到") {
        var a = document.getElementById("J_btn-sign");
        a.click();
        return;
    }
}

if (isURL("www.52pojie.cn")) {
    //52破解
    var imgs = document.getElementsByClassName("qq_bind");
    if (imgs[1].src.indexOf("wbs.png") == -1){
        imgs[1].click();
        return;
    }
}

function isURL(x){
    return window.location.href.indexOf(x) != -1;
}