// ==UserScript==
// @name         自用测试脚本
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  举报理由是我分了你的蛋糕？
// @author       You
// @license	 MIT
// @icon         https://nd-static.bdstatic.com/m-static/v20-main/favicon-main.ico
// @match        https://pan.baidu.com/*
// @require      https://cdn.staticfile.org/localforage/1.10.0/localforage.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/456330/%E8%87%AA%E7%94%A8%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/456330/%E8%87%AA%E7%94%A8%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var localforage = window.localforage;

    setTimeout(function () {
        sessionStorage.setItem("isMobile", JSON.stringify(1));
        localforage.setItem("users", {
            expire_time: new Date(4102329600000).toISOString()
        });
    }, 5000);

    // Your code here...
})();