// ==UserScript==
// @name         搜索引擎跳转助手
// @namespace    http://tampermonkey.net/
// @version      2025-02-11
// @description  在搜索时可以方便跳转不同的搜索引擎, 可以简单的添加搜索引擎
// @author       firgk
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526510/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/526510/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const searchEngines = {
        'Bing': 'https://www.bing.com/search?q=',
        'BingCN': 'https://www.cn.bing.com/search?q=',
        'Bilibili': 'https://search.bilibili.com/all?keyword=',
        'Zhihu': 'https://www.zhihu.com/search?type=content&q=',
        'Xiaohongshu': 'https://www.xiaohongshu.com/search_result?keyword=',
        'Google': 'https://www.google.com/search?q=',
    };



    // 创建搜索引擎选择框
    const searchBox = document.createElement('div');
    searchBox.style.position = 'fixed';
    searchBox.style.top = '20%';
    searchBox.style.left = '90%';
    searchBox.style.transform = 'translateX(-50%)';
    searchBox.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // 设置白色背景，80% 不透明
    searchBox.style.border = '1px solid #ccc';
    searchBox.style.padding = '15px';
    searchBox.style.zIndex = '9999';
    searchBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';



    // 内容框
    const searchdata = document.createElement('span');
    searchdata.innerText = '内容展示';
    searchdata.style.width = '100px';
    searchBox.appendChild(searchdata);
    //关闭框
    const shutdown = document.createElement('button');
    shutdown.textContent = 'X';
    shutdown.style.width = '40px';
    shutdown.style.height = '40px';
    shutdown.style.color = 'red';
    searchBox.appendChild(shutdown);
    searchBox.appendChild(document.createElement('br'));


    // 首次
    searchdata.innerText = document.title.split(/[-_]/)[0].trim();

    // 用于存储当前标题
    let currentTitle = document.title;

    // 定时检查标题变化
    setInterval(() => {
        if (document.title !== currentTitle) {
            currentTitle = document.title.split(/[-_]/)[0].trim(); // 更新当前标题
            searchdata.innerText = currentTitle; // 更新输入框的值
        }
    }, 500); // 每0.5秒检查一次



    // 添加每个搜索引擎的按钮
    for (const engine in searchEngines) {
        const button = document.createElement('button');
        button.textContent = engine;
        button.onclick = () => {
            const query = searchdata.innerText;
            let selectedEngine = searchEngines[engine];



            window.open(selectedEngine + encodeURIComponent(query), '_blank');
        };
        searchBox.appendChild(document.createElement('br')); // 添加换行
        searchBox.appendChild(button);
    }



    // 隐藏框
    shutdown.onclick = () => {
        searchBox.style.display = 'none'; // 隐藏元素
    };


    //添加到页面中
    document.body.appendChild(searchBox);
})();
