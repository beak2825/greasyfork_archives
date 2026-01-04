// ==UserScript==
// @name         豆瓣站外搜索下载
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  在豆瓣电影h1标题后添加美化跳转按钮
// @author       JIEMO
// @match        *://movie.douban.com/subject/*
// @icon         https://www.google.com/s2/favicons?domain=douban.com
// @grant        none
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/533898/%E8%B1%86%E7%93%A3%E7%AB%99%E5%A4%96%E6%90%9C%E7%B4%A2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/533898/%E8%B1%86%E7%93%A3%E7%AB%99%E5%A4%96%E6%90%9C%E7%B4%A2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用MutationObserver确保动态加载的内容也能被处理
    const observer = new MutationObserver(function(mutations) {
        const h1Element = document.querySelector('h1');
        if (h1Element && !document.querySelector('.douban-jump-btn')) {
            addButtonAfterH1(h1Element);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function addButtonAfterH1(h1Element) {
        // 获取标题文本
        const titleSpan = h1Element.querySelector('span[property="v:itemreviewed"]');
        if (!titleSpan) return;

        let titleText = titleSpan.textContent.trim();
        // 截断标题文本，取第一个空格前的内容
        titleText = titleText.split(' ')[0];

        // 创建按钮容器
        const btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '10px'; // 与h1的间距

        // 创建第一个跳转按钮
        const jumpButton1 = document.createElement('a');
        jumpButton1.href = `https://www.gying.si/s/1---1/${encodeURIComponent(titleText)}`;
        jumpButton1.target = '_blank';
        jumpButton1.textContent = 'gying';
        jumpButton1.className = 'douban-jump-btn';

        // 创建第二个跳转按钮
        const jumpButton2 = document.createElement('a');
        jumpButton2.href = `https://tv.kanpian.club/s/${encodeURIComponent(titleText)}.html`;
        jumpButton2.target = '_blank';
        jumpButton2.textContent = '看片咖';
        jumpButton2.className = 'douban-jump-btn';
        jumpButton2.style.marginLeft = '8px'; // 为第二个按钮添加左边距

        // 创建第三个跳转按钮
        const jumpButton3 = document.createElement('a');
        jumpButton3.href = `https://www.yppan.com/?s=${encodeURIComponent(titleText)}&cat=5`;
        jumpButton3.target = '_blank';
        jumpButton3.textContent = 'yppan';
        jumpButton3.className = 'douban-jump-btn';
        jumpButton3.style.marginLeft = '8px'; // 为第三个按钮添加左边距

        // 添加按钮样式
        if (!document.querySelector('.douban-btn-style')) {
            const style = document.createElement('style');
            style.className = 'douban-btn-style';
            style.textContent = `
                .douban-jump-btn {
                    padding: 3px 10px;
                    border: 1px solid #1565C0;
                    border-radius: 3px;
                    text-decoration: none;
                    color: white;
                    font-size: 18px;
                    font-weight: normal;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    transition: all 0.2s ease;
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 1.5;
                    //background: linear-gradient(to bottom, #2196F3, #1976D2);
                }
                .douban-jump-btn:hover {
                    background: linear-gradient(to bottom, #64B5F6, #42A5F5);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                    transform: translateY(-1px);
                }
                .douban-jump-btn:active {
                    transform: translateY(0);
                    box-shadow: none;
                }
            `;
            document.head.appendChild(style);
        }

        // 组装元素
        btnContainer.appendChild(jumpButton1);
        btnContainer.appendChild(jumpButton2);
        btnContainer.appendChild(jumpButton3);

        // 在h1后插入按钮容器
        h1Element.parentNode.insertBefore(btnContainer, h1Element.nextSibling);
    }

    // 初始检查
    const h1Element = document.querySelector('h1');
    if (h1Element) {
        addButtonAfterH1(h1Element);
    }
})();
