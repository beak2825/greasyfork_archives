// ==UserScript==
// @name         百度搜索自动添加“ -李彦宏”
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在百度搜索时，点击“搜索”按钮或按下Enter键时，自动在搜索内容后面添加“ -李彦宏”
// @author       你的名字
// @match        https://www.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523082/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E2%80%9C%20-%E6%9D%8E%E5%BD%A6%E5%AE%8F%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/523082/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E2%80%9C%20-%E6%9D%8E%E5%BD%A6%E5%AE%8F%E2%80%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听搜索框的按键事件
    document.querySelector('#kw').addEventListener('keydown', function(event) {
        // 如果按下的是 Enter 键
        if (event.key === 'Enter') {
            addSuffixToQuery();
        }
    });

    // 监听“百度一下”按钮的点击事件
    document.querySelector('#su').addEventListener('click', function() {
        addSuffixToQuery();
    });

    // 在搜索内容后面添加“ -李彦宏”
    function addSuffixToQuery() {
        let query = document.querySelector('#kw').value;
        // 如果查询内容不包含“ -李彦宏”，则添加
        if (!query.includes(" -李彦宏")) {
            document.querySelector('#kw').value = query + " -李彦宏";
        }
    }
})();