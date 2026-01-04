// ==UserScript==
// @name         csdn免登录复制
// @namespace    xyz
// @version      1.4
// @description  csdn免登录复制；csdn免登录复制；在陌生电脑使用，防止隐私泄露；免登录便捷复制，方便工作
// @match        *://*.csdn.net/*
// @grant        none
// @icon         https://img-home.csdnimg.cn/images/20201124032511.png
// @downloadURL https://update.greasyfork.org/scripts/542960/csdn%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/542960/csdn%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addCustomHtml);
    } else {
        addCustomHtml();
    }
 
    function addCustomHtml() {
        // 查找所有class为opt-box的div
        const optBoxes = document.querySelectorAll('div.opt-box');
 
        if (optBoxes.length > 0) {
            optBoxes.forEach(optBox => {
                // 创建要添加的HTML内容
                const customHtml = `
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div><div onclick="hljs.copyCode(event);alert('已复制!!! 公众号：安全码客');"><div class="hljs-button {2}" data-title="免登录复制" onclick="mdcp.copyCode(event);alert('已复制!!! 公众号：安全码客');"></div></div></div>
                 `;
 
                // 将HTML插入到opt-box中
                optBox.insertAdjacentHTML('afterbegin', customHtml);
 
                // 如果需要为新添加的元素添加事件监听器
                const button = optBox.querySelector('#custom-button');
                if (button) {
                    button.addEventListener('click', function() {
                        alert('按钮被点击了!');
                    });
                }
            });
        } else {
            console.log('未找到class为opt-box的div元素');
        }
    }
})();