// ==UserScript==
// @name         广轻心理测试
// @version      1.1
// @author       BaiLu
// @description  一键全部选择从无
// @match        https://www.psy.com.cn/*
// @license MIT
// @grant        none
// @namespace https://greasyfork.org/users/1411786
// @downloadURL https://update.greasyfork.org/scripts/532321/%E5%B9%BF%E8%BD%BB%E5%BF%83%E7%90%86%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/532321/%E5%B9%BF%E8%BD%BB%E5%BF%83%E7%90%86%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 添加样式以显示按钮
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        #TextBtn {
            position: fixed;
            bottom: 70px;
            right: 20px;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: background-color 0.3s ease;
        }
        #TextBtn:hover {
            background-color: #0056b3;
        }
        #TextBtn:active {
            background-color: #004494;
        }
    `;
    document.head.appendChild(style);
    var btn = document.createElement('button');
    btn.id = 'TextBtn';
    btn.textContent = '心理答题';
    document.body.appendChild(btn);

    async function psychologicalTest() {
        var a = document.querySelectorAll('.am-panel');
        a.forEach(e => {
            e.querySelector('.am-radio.am-danger').click();
        });
    }

    btn.addEventListener('click', function () {
        psychologicalTest();
    });

})();