// ==UserScript==
// @name         赖于凡你干嘛哎呦😏
// @version      4
// @grant        none
// @author       FalwIpbfYygy
// @match        https://lookup.maimemo.com/*
// @description  墨墨选中
// @namespace    https://falwipbfyygy.rth1.one/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465178/%E8%B5%96%E4%BA%8E%E5%87%A1%E4%BD%A0%E5%B9%B2%E5%98%9B%E5%93%8E%E5%91%A6%F0%9F%98%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/465178/%E8%B5%96%E4%BA%8E%E5%87%A1%E4%BD%A0%E5%B9%B2%E5%98%9B%E5%93%8E%E5%91%A6%F0%9F%98%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听所有 AJAX 请求
    window.addEventListener('load', function(event) {
        // 检查当前 URL 是否包含 https://lookup.maimemo.com/
        if (window.location.href.includes('https://lookup.maimemo.com/')) {
            // 将 JavaScript 代码置于一个字符串变量中
            var jsCode = `
                var eles = document.getElementsByTagName('*');
                for (var i = 0; i < eles.length; i++) {
                    eles[i].style.userSelect = 'text';
                }
            `;

            // 输出提示及执行代码
        console.log('Enabling text selection on Maimemo Lookup...');

        // 在网页上找到所有 div 标签并注册点击事件
        var divEls = document.querySelectorAll('div');
        if (divEls) {
            divEls.forEach(function(divEl) {
                divEl.addEventListener('click', function(event) {
                    
                    // 执行代码并输出结果
                    console.log(eval(jsCode));
                });
            });
        } else {
            console.log('Failed to find any div element!');
        }

        }
    });
})();