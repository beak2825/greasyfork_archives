// ==UserScript==
// @name         聚名网辅助工具
// @namespace    http://md5.vip/
// @version      1.1
// @description  可使用一键检测注册状态按钮，一键检测所有域名注册状态
// @author       md5
// @match        http://*.juming.com/*
// @match        http://*.3306.cc/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462738/%E8%81%9A%E5%90%8D%E7%BD%91%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/462738/%E8%81%9A%E5%90%8D%E7%BD%91%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
function clickbutton() {
    //替换包含title="一键检测域名注册状态"的A标签
    var button = document.querySelectorAll('a[title="一键检测域名注册状态"]');
    console.log(button);//打印出所有的按钮
    for (var i = 0; i < button.length; i++) {
        //替换文字
        button[i].innerHTML = "一键检测";
        //点击按钮
        button[i].click();
    }
}
//查找页面中文字是否有“一键检测域名注册状态”
if (document.body.innerText.indexOf("域名得标后域名可以立即解析使用") != -1) {
    //弹窗提示
    alert("🔐此域名注册即可使用");
}
//查找页面中文字是否有“一键检测域名注册状态”
if (document.body.innerText.indexOf("该类型域名是用户发布的拍卖") != -1) {
    //弹窗提示
    alert("⚠️别点了，这个坑很深，不要买");
}
//查找页面中文字是否有“一键检测域名注册状态”
if (document.body.innerText.indexOf("竞拍号512508") != -1 || document.body.innerText.indexOf("竞拍号57399") != -1 || document.body.innerText.indexOf("竞拍号13113") != -1) {
    //弹窗提示
    alert("⚠️有傻逼小心点");
}


//间隔5秒执行一次clickbutton函数
setInterval(clickbutton, 5000);