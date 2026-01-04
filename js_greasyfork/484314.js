// ==UserScript==
// @name         123网盘自动填写提取码、关闭广告
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  如名
// @author       CCCC-L
// @match        https://www.123pan.com/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=123pan.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/484314/123%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%90%E5%8F%96%E7%A0%81%E3%80%81%E5%85%B3%E9%97%AD%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/484314/123%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%90%E5%8F%96%E7%A0%81%E3%80%81%E5%85%B3%E9%97%AD%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // 获取pwd参数
    let pwd = new URLSearchParams(window.location.search).get("pwd")
    // 没有pwd参数提前返回
    if (!pwd) {
        return
    }

    let shareKey = window.location.pathname.match(/\w+-\w+/)[0]
    localStorage.setItem("shareKey", shareKey)
    localStorage.setItem("SharePwd", pwd)
})();