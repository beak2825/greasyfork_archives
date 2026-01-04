// ==UserScript==
// @name         隐藏看准网的无用提示
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  隐藏看准网左下角的“手机浏览更方便”；隐藏公司 PK；隐藏 app 下载提示；隐藏通知；（没有修改页底）
// @author       Entityless
// @match        *://www.kanzhun.com/*
// @match        *://www.kanzhun.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405536/%E9%9A%90%E8%97%8F%E7%9C%8B%E5%87%86%E7%BD%91%E7%9A%84%E6%97%A0%E7%94%A8%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/405536/%E9%9A%90%E8%97%8F%E7%9C%8B%E5%87%86%E7%BD%91%E7%9A%84%E6%97%A0%E7%94%A8%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    // 左下角的“手机浏览更方便”
    try{document.getElementsByClassName("promotion-sider")[0].style.display = 'none';} catch(err){}
    // 咨询师
    try{document.getElementsByClassName("counselling-sider")[0].style.display = 'none';}catch(err){}
    // 右上角的下载 app 提示
    try{document.getElementsByClassName("title")[0].style.display = 'none';} catch(err){}
    // 公司 PK
    try{document.getElementsByClassName("pk-sider")[0].style.display = 'none';} catch(err){}
    // 通知 icon
    try{document.getElementsByClassName("user-news")[0].style.display = 'none';} catch(err){}
    // 右边的下载 app 提示
    try{document.getElementsByClassName("app_container clearfix js-sidebar-download-app")[0].style.display = 'none';} catch(err){}
    // 右边的下载 app 气泡
    try{document.getElementsByClassName("download-side-wrap")[0].style.display = 'none';} catch(err){}
    // 二维码
    try{document.getElementsByClassName("qrcode_container")[0].style.display = 'none';} catch(err){}
    // “更多职场问题，找人求助”
    try{document.getElementsByClassName("counselling-sider-title")[0].style.display = 'none';} catch(err){}
    // 右下角的悬浮按钮
    try{document.getElementsByClassName("guide")[0].style.display = 'none';} catch(err){}
})();
