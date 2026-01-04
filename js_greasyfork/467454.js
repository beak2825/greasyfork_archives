// ==UserScript==
// @name         1Hanime.me左下角显示标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hanime.me左下角显示标题
// @author       ccllsp
// @match        https://hanime1.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hanime1.me
// @grant        none
// @run-at       document-end
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/467454/1Hanimeme%E5%B7%A6%E4%B8%8B%E8%A7%92%E6%98%BE%E7%A4%BA%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/467454/1Hanimeme%E5%B7%A6%E4%B8%8B%E8%A7%92%E6%98%BE%E7%A4%BA%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 这是我用chatgpt写的，确实是一个很牛的工具
    // 获取要显示的内容
    var contents = document.querySelectorAll('div[style="margin-bottom: 5px"]');
    var content = contents[1].textContent;

    // 创建文本框
    var textbox = document.createElement('input');
    textbox.type = 'text';
    textbox.id = 'my-textbox';
    textbox.value = content;

    // 添加样式
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle(`
        #my-textbox {
            position: fixed;
            bottom: 20px;
            left: 0;
            width: 200px;
            height: 50px;
            background-color: #f3d9ff;
            border: 1px solid #8c64ff;
            padding: 10px;
            font-size: 16px;
            font-style: italic;
            z-index: 9999;
        }
    `);

    // 将文本框添加到页面
    document.body.appendChild(textbox);
})();
