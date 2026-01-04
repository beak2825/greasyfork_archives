// ==UserScript==
// @name         DeepJH的留言板id:396363135
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  请不要安装这个脚本，这仅仅只是我的留言板，仅仅只是给我等人看的。我有一些信息(比如链接)需要随时获取，但github又不稳定，故跑这儿来了。希望大家多多包涵，别举报我，也希望审核饶我一命，谢谢。这个脚本是复制的，应该是无害的，只是为了发出来，原脚本：https://greasyfork.org/zh-CN/scripts/489134-%E6%B7%BB%E5%8A%A0%E6%8C%89%E9%92%AE-huggingface-%E4%B8%BB%E7%AB%99%E8%B7%B3%E8%BD%AC%E5%88%B0%E9%95%9C%E5%83%8F%E7%AB%99
// @author       nobody
// @match        *://huggingface.co/*
// @grant        none
// @run-at       document-end
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/489148/DeepJH%E7%9A%84%E7%95%99%E8%A8%80%E6%9D%BFid%3A396363135.user.js
// @updateURL https://update.greasyfork.org/scripts/489148/DeepJH%E7%9A%84%E7%95%99%E8%A8%80%E6%9D%BFid%3A396363135.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function addButtonIfNeeded() {
        // 检查按钮是否已经存在
        if (document.getElementById('mirror-redirect-button')) return;
 
        // 找到放置按钮的合适位置，这个选择器可能需要根据页面的实际结构进行调整
        const targetElement = document.querySelector('.container.relative h1');
        if (!targetElement) return;
 
        // 创建按钮并设置样式
        const button = document.createElement('button');
        button.textContent = '跳转往镜像站🚀';
        button.id = 'mirror-redirect-button';
        // 应用样式，可以是自定义的，也可以尝试复用页面上已有的样式类
        button.className = 'btn cursor-pointer text-sm flex-auto sm:flex-none'; // 假设这是页面上已有的样式类
        button.style.marginLeft = '10px'; // 可选的，根据需要调整样式
        button.onclick = function() {
            window.location.href = window.location.href.replace('huggingface.co', 'hf-mirror.com');
        };
 
        // 将按钮添加到页面上
        targetElement.appendChild(button);
    }
 
    // 创建MutationObserver实例来监听DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                addButtonIfNeeded();
            }
        });
    });
 
    // 配置观察器选项：子节点的变动
    const config = { childList: true, subtree: true };
 
    // 开始监听document.body的变化
    observer.observe(document.body, config);
 
    // 页面初次加载时尝试添加按钮
    addButtonIfNeeded();
})();