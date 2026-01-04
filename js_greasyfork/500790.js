// ==UserScript==
// @name         智慧人社自动跳转到账号登录
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  智慧人社系统自动跳转到账号登录
// @author       qiuqiu_xqy
// @match        *://10.10.50.10/auth-ui/*
// @match        *://10.10.50.11/web-auth-ui/*
// @icon         https://s11.ax1x.com/2020/09/17/wWLYVS.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500790/%E6%99%BA%E6%85%A7%E4%BA%BA%E7%A4%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/500790/%E6%99%BA%E6%85%A7%E4%BA%BA%E7%A4%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

window.onload = function () {
    //页面和所有外部资源加载完成，可以执行需要在页面加载完成后执行的操作
    
    let evt = document.createEvent('HTMLEvents');

    let tab_first = document.querySelector("#tab-first");//账号密码登录
    let tab_second = document.querySelector("#tab-second");//电子社保卡登录
    let tab_third = document.querySelector("#tab-third");//短信验证码登录
    let tab_forth = document.querySelector("#tab-forth");//正在维护

    //让账号密码登录模块显示出来
    tab_first.style.display = "inline-block";

    //模拟点击账号密码登录模块
    evt.initEvent('click', true, false);
    tab_first.dispatchEvent(evt);

    //赋账号密码值
    let accountLogin = document.querySelector("#pane-first");
    let usernameInput = document.querySelector("#username");
    let passwordInput = document.querySelector("#password");
    accountLogin.style.display = "block";
    let newUserNameText = "XXX";
    let httpUrl = window.location.href;
    let myIP = httpUrl.split("/", "-1")[2];
    let newPasswordText = myIP == "10.10.50.10" ? "123!@#qweQWE" : myIP == "10.10.50.11" ? "123!@#qweQWE" : "";
    usernameInput.value = newUserNameText;
    passwordInput.value = newPasswordText;
    evt.initEvent('input', true, true);
    usernameInput.dispatchEvent(evt);
    passwordInput.dispatchEvent(evt);
}
