// ==UserScript==
// @name         未经授权不许复制
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  在网页试图写入剪贴板时显示一个悬浮按钮来控制复制请求，并在30秒后隐藏。红色禁止，黄色询问，绿色允许。
// @author       基于原作者:半猪人捞尸 版本修改
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501390/%E6%9C%AA%E7%BB%8F%E6%8E%88%E6%9D%83%E4%B8%8D%E8%AE%B8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/501390/%E6%9C%AA%E7%BB%8F%E6%8E%88%E6%9D%83%E4%B8%8D%E8%AE%B8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let copyMode = localStorage.getItem('copyMode') || 'forbidden'; // 读取存储的模式，默认为'forbidden'
    let hideTimeout;

    // 创建并初始化按钮
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.right = '10px';
    button.style.top = '50%';
    button.style.padding = '10px';
    button.style.borderRadius = '5px';
    button.style.opacity = '0.8';
    button.style.zIndex = '999999';
    button.style.border = '2px solid white';
    button.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
    button.style.display = 'none'; // 初始状态隐藏
    button.style.cursor = 'pointer';
    button.innerText = '复制控制';
    document.body.appendChild(button);

    // 设置按钮颜色
    setButtonColor(copyMode);

    // 截取复制请求
    document.addEventListener('copy', function(e) {
        if (copyMode === 'forbidden') {
            e.preventDefault();
            showButton();
        } else if (copyMode === 'confirm') {
            e.preventDefault();
            showButton();
            if (confirm('网页试图写入剪贴板，是否允许复制？')) {
                copyMode = 'allowed';
                setButtonColor(copyMode);
                document.execCommand('copy');
            }
        }
    }, true);

    // 显示按钮并设置隐藏定时器
    function showButton() {
        clearTimeout(hideTimeout);
        button.style.display = 'block';
        hideTimeout = setTimeout(() => {
            button.style.display = 'none';
        }, 30000); // 30秒后隐藏
    }

    // 设置按钮颜色
    function setButtonColor(mode) {
        if (mode === 'forbidden') {
            button.style.backgroundColor = 'red';
        } else if (mode === 'confirm') {
            button.style.backgroundColor = 'yellow';
        } else {
            button.style.backgroundColor = 'green';
        }
    }

    // 点击事件处理程序
    button.addEventListener('click', function() {
        if (copyMode === 'forbidden') {
            copyMode = 'confirm';
        } else if (copyMode === 'confirm') {
            copyMode = 'allowed';
        } else {
            copyMode = 'forbidden';
        }
        setButtonColor(copyMode);
        localStorage.setItem('copyMode', copyMode); // 存储模式
    });
})();
