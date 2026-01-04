// ==UserScript==
// @name               通用_开放注册检测
// @name:zh-CN         通用_开放注册检测
// @name:en-US         Uni_Allow reg checker
// @description        通过比对元素文本判断，检测开放注册状态。
// @version            1.1.4
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/LiuliPack/UserScript
// @match              *://*/*
// @grant              GM_log
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/458625/%E9%80%9A%E7%94%A8_%E5%BC%80%E6%94%BE%E6%B3%A8%E5%86%8C%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458625/%E9%80%9A%E7%94%A8_%E5%BC%80%E6%94%BE%E6%B3%A8%E5%86%8C%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

'use strict';

/* 参数示范 / Config demo
let cfg = {
    "页面地址": ["元素", "文本", 延迟(秒)]
    "URL": ["ele", "text", delay(seconds)]
}*/

// 定义参数(cfg)、页面地址(URL)和网页标题(title)变量，快捷元素选择($(元素定位符))函数
let cfg = {
    "https://www.rarbgprx.org/login": [".lista-rounded td[align=\"justify\"] div:nth-child(9)", "Registrations are now closed!", 0],
    "https://v2.uploadbt.com/?r=invite": [".badge", "已占用", 0],
    "https://nyaa.si/register": ["body", "Registration is temporarily unavailable", 0],
    "https://t66y.com/register.php": ["tr.tr3:nth-child(7) > th:nth-child(1)", " 邀請註冊碼*本站開啟邀請註冊,請填寫邀請碼!", 0],
    "https://btbtt15.com/user-create.htm": [".box.bg2 h1", "\n\t\t\t\t\t\t\t\t当前注册功能已经关闭1。\t\t\t\t\t\t\t\t\n\t\t\t\t\n\t\t\t", 0]
},
    URL = location.href,
    title = document.title,
    $ = ele => document.querySelector(ele);

// 判断当前页面是否有参数可用
if(cfg[URL] !== undefined) {
    // 等待指定时间
    setTimeout(function() {
        // 判断可注册状况
        if($(cfg[URL][0]).textContent !== cfg[URL][1]) {
            // 可注册
            document.title = `[开放注册]${title}`;
        }else {
            // 无法注册
            document.title = `[无法注册]${title}`;
            window.close();
        }
    }, cfg[URL][2] * 1000);
}else {
    GM_log('开放注册检测_状况判断 > 找不到对应参数。')
}