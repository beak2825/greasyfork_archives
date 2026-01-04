// ==UserScript==
// @name         湖北高中生网登录时自动删除Cookie
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  能够让你在登录时不用再管之前的账号是否退出
// @author       Tinyblack
// @license      GNU
// @match        http://gzkg.e21.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e21.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445070/%E6%B9%96%E5%8C%97%E9%AB%98%E4%B8%AD%E7%94%9F%E7%BD%91%E7%99%BB%E5%BD%95%E6%97%B6%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/445070/%E6%B9%96%E5%8C%97%E9%AB%98%E4%B8%AD%E7%94%9F%E7%BD%91%E7%99%BB%E5%BD%95%E6%97%B6%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4Cookie.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
        for (let t of document.getElementsByTagName("iframe"))
        {
            console.log(t);
            for (let i of t.contentDocument.getElementsByTagName("input")) {
                console.log("added eventListener.");
                i.addEventListener("onclick",function () {document.cookie = ""});
            }
        }
        for (let i of document.getElementsByClassName("submit")) {
            console.log("added eventListener.")
            i.addEventListener("onclick",function () {document.cookie = ""})
        }}, 1000);
})();