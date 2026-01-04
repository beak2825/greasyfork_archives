// ==UserScript==
// @name         蓝奏云手机端直链解析 (Mobile Only)
// @namespace    https://example.com
// @version      1.1
// @description  蓝奏云手机端直链解析，避免无意义页面跳转。
// @match        *://*.lanzou*.com/*
// @exclude      *://*/tp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513297/%E8%93%9D%E5%A5%8F%E4%BA%91%E6%89%8B%E6%9C%BA%E7%AB%AF%E7%9B%B4%E9%93%BE%E8%A7%A3%E6%9E%90%20%28Mobile%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513297/%E8%93%9D%E5%A5%8F%E4%BA%91%E6%89%8B%E6%9C%BA%E7%AB%AF%E7%9B%B4%E9%93%BE%E8%A7%A3%E6%9E%90%20%28Mobile%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止按钮重复插入
    let buttonInserted = false;

    // 获取当前页面的URL
    let currentUrl = window.location.href;

    // 构造解析链接
    let parserUrl = `https://lz.qaiu.top/json/parser?url=${encodeURIComponent(currentUrl)}`;

    // 处理点击按钮后获取JSON并跳转
    function fetchDirectLink(url, password = '') {
        let apiUrl = url;
        if (password) {
            apiUrl += `&pwd=${encodeURIComponent(password)}`;
        }

        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.data && data.data.directLink) {
                // 跳转到直链
                window.location.href = data.data.directLink;
            } else if (data.msg === "LzTool - 解析异常: 密码不正确") {
                // 请求密码
                let pwd = prompt("请输入密码：");
                if (pwd) {
                    fetchDirectLink(parserUrl, pwd); // 重新请求并带上密码
                }
            } else {
                alert('无法获取直链');
            }
        })
        .catch(error => {
            console.error('Error fetching directLink:', error);
            alert('请求出错：',error);
        });
    }

    // 插入按钮函数
    function insertButton() {
        if (buttonInserted) return; // 如果已经插入，直接返回

        // 查找符合条件的下载按钮
        const submitLink = document.querySelector('#downurl');

        if (submitLink) {
            const button = document.createElement('a');
            button.textContent = '解析链接';
            button.style.color = '#fff';
            button.style.backgroundColor = '#007bff';
            button.style.padding = '10px';
            button.style.marginTop = '10px';
            button.style.borderRadius = '20px';
            button.style.display = 'inline-block';
            button.href = '#'; // 防止页面刷新

            // 点击按钮时解析并跳转
            button.addEventListener('click', (event) => {
                event.preventDefault();
                fetchDirectLink(parserUrl);
            });

            // 插入到合适的地方
            submitLink.parentElement.insertBefore(button, submitLink.nextSibling);
            buttonInserted = true; // 标记按钮已插入
        }
    }

    // 监听DOM变化，确保按钮最快插入
    const observer = new MutationObserver(() => {
        if (document.querySelector('#downurl')) {
            insertButton(); // 一旦找到按钮，立即插入解析按钮
            observer.disconnect(); // 插入后停止观察
        }
    });

    // 观察整个body的子节点变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 如果已经加载完毕，直接插入按钮
    insertButton(); // 尝试立即插入按钮，防止 observer 过慢
})();