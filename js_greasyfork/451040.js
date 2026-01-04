// ==UserScript==
// @name         阿里重新登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击新建窗口阿里直接登录
// @license      MIT
// @author       Torin
// @match        https://*.aliyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451040/%E9%98%BF%E9%87%8C%E9%87%8D%E6%96%B0%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/451040/%E9%98%BF%E9%87%8C%E9%87%8D%E6%96%B0%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function doSomething(){
        window.open("https://signin.aliyun.com/zkh.onaliyun.com/login.htm")
    }
    const div = document.createElement("div");
    div.id = "tbButton"
    div.style = "border: 1px solid #dde3e7;border-radius: 4px;z-index: 9999;right: 0px;top: 100px;width: 16px;height: 16px;background-color: rgb(99 143 180);position: fixed !important; cursor: pointer;";
    div.title = '登录'
    div.onclick=doSomething
    document.body.appendChild(div);
})();