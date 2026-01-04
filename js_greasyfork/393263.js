// ==UserScript==
// @author 殁漂遥
// @namespace http://tampermonkey.net/
// @name 自用工具库
// @version 1.00
// @grant none
// ==/UserScript==

// 设置 Cookie 默认时间 一年
function setCookie(name, value) {
    let exp = new Date();
    exp.setTime(exp.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}