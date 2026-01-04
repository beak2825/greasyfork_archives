// ==UserScript==
// @name         呼叫中心系统_标注后自动保存和关闭
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  置闲 > 入Call > 置忙 > 保存关闭 > 挂断
// @author       WeakET
// @match        *://8.212.1.210/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524505/%E5%91%BC%E5%8F%AB%E4%B8%AD%E5%BF%83%E7%B3%BB%E7%BB%9F_%E6%A0%87%E6%B3%A8%E5%90%8E%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%92%8C%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/524505/%E5%91%BC%E5%8F%AB%E4%B8%AD%E5%BF%83%E7%B3%BB%E7%BB%9F_%E6%A0%87%E6%B3%A8%E5%90%8E%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%92%8C%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建观察者 observer 监听页面变化
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType === 1 && node.querySelector('div[role="combobox"]')) {
                    handleCombobox(node);
                }
            });
        });
    });

    // 观察者 observer 开始观察页面
    observer.observe(document.body, { childList: true, subtree: true });

    // 延迟 4秒 点击 置闲 按钮
    setTimeout(function () {
        document.querySelector('i[class="iconfont icon-set-idle"]').click();
    }, 4000)

    // 处理 combobox 节点操作
    function handleCombobox(node) {
        // 获取 combobox 节点
        const combobox = node.querySelector('div[role="combobox"]');

        // 如果存在 combobox 节点
        if (combobox) {
            // 点击 置忙 按钮
            document.querySelector('i[class="iconfont icon-set-busy"]').click();
            // 获取 combobox 的内容
            combobox.click();
            combobox.click();
            const options = document.querySelectorAll('li[unselectable="unselectable"]');
            // 创建按钮并替换 combobox
            options.forEach(function (option) {
                const button = document.createElement('button');
                button.innerText = option.textContent;
                // 设置按钮下对齐
                button.style.marginBottom = "5px";
                // 设置按钮间距
                button.style.marginRight = "5px";
                // 设置按钮字体大小
                // button.style.fontSize = "10px";
                button.addEventListener('click', function () {
                    // 当按钮被点击模拟点击对应的option按钮
                    option.click();
                    // 点击 保存关闭 按钮
                    document.querySelector('button[class="ant-btn ant-btn-primary"]').click();
                    // 点击 挂断 按钮
                    document.querySelector('i[class="iconfont icon-hang-up"]').click();
                    // 刷新页面
                    location.reload();
                });
                combobox.parentNode.insertBefore(button, combobox);
            });
            // 隐藏combobox
            combobox.style.display = 'none';
        }
    }
})();