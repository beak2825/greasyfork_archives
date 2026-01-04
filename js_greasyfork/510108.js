// ==UserScript==
// @name         WeChat Article Directory
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Generate a directory for WeChat articles with line wrapping, limited width, scrollable height, and adaptive heading matching. 微信阅读目录生成
// @author       microBeer
// @match        *://mp.weixin.qq.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510108/WeChat%20Article%20Directory.user.js
// @updateURL https://update.greasyfork.org/scripts/510108/WeChat%20Article%20Directory.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // 创建目录容器
    const directoryContainer = document.createElement('div');
    directoryContainer.style.position = 'fixed';
    directoryContainer.style.top = '10px';
    directoryContainer.style.right = '10px';
    directoryContainer.style.backgroundColor = 'white';
    directoryContainer.style.border = '1px solid #ccc';
    directoryContainer.style.padding = '10px';
    directoryContainer.style.zIndex = '9999';
    directoryContainer.style.width = '20%'; // 设置宽度为窗口的 20%
    directoryContainer.style.maxHeight = '400px'; // 设置最大高度为 400px
    directoryContainer.style.overflowY = 'auto'; // 允许垂直滚动
    directoryContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    directoryContainer.innerHTML = '<h3>文章目录</h3><ul id="article-directory" style="list-style-type: none; padding: 0;"></ul>';

    document.body.appendChild(directoryContainer);

    // 提取文章标题
    const headings = document.querySelectorAll('.rich_media_content h1, .rich_media_content h2, .rich_media_content h3, .rich_media_content h4');
    const directoryList = document.getElementById('article-directory');
    const uniqueHeadings = new Set(); // 用于存储唯一标题
    let currentLevel = directoryList; // 当前层级从目录列表开始
    let levelStack = []; // 用于跟踪层级

    headings.forEach((heading, index) => {
        const titleText = heading.innerText.trim(); // 获取标题文本并去除空格
        let level = 1; // 默认一级标题

        // 确定标题层级
        if (heading.tagName === 'H1') {
            level = 1; // 一级标题
        } else if (heading.tagName === 'H2') {
            level = 2; // 二级标题
        } else if (heading.tagName === 'H3') {
            level = 3; // 三级标题
        } else if (heading.tagName === 'H4') {
            level = 4; // 四级标题
        }

        if (!uniqueHeadings.has(titleText) && titleText) { // 检查是否已存在且非空
            uniqueHeadings.add(titleText); // 添加到集合中
            const listItem = document.createElement('li');
            listItem.style.wordWrap = 'break-word'; // 允许换行
            listItem.style.marginBottom = '5px'; // 添加底部间距
            listItem.innerHTML = `<a href="#heading-${index}" style="text-decoration: none; color: #007bff;">${titleText}</a>`;
            heading.id = `heading-${index}`; // 为每个标题添加锚点

            // 根据层级关系添加到目录中
            while (levelStack.length > 0 && levelStack[levelStack.length - 1] >= level) {
                levelStack.pop(); // 弹出较高层级
                currentLevel = currentLevel.parentNode; // 回到上一级
            }

            // 添加当前标题
            const subList = document.createElement('ul');
            subList.style.listStyleType = 'none'; // 去掉子列表的样式
            subList.style.marginTop = '5px'; // 添加顶部间距
            subList.classList.add('hidden'); // 默认折叠
            currentLevel.appendChild(subList); // 将子列表添加到当前层级中

            const subListItem = document.createElement('li');
            subListItem.style.wordWrap = 'break-word'; // 允许换行
            subListItem.style.marginBottom = '5px'; // 添加底部间距
            subListItem.style.paddingLeft = '15px'; // 添加缩进
            subListItem.innerHTML = `<a href="#heading-${index}" style="text-decoration: none; color: #007bff;">${titleText}</a>`;
            subList.appendChild(subListItem); // 将当前标题添加到子列表中

            // 添加折叠按钮
            if (level > 1) {
                const toggleButton = createToggleIcon(subList);
                listItem.prepend(toggleButton); // 将折叠按钮添加到列表项前
            }

            // 更新当前层级和层级栈
            currentLevel = subList;
            levelStack.push(level);
        }
    });

    // 创建折叠按钮
    function createToggleIcon(subList) {
        const toggleButton = document.createElement('span');
        toggleButton.innerHTML = '▶'; // 默认折叠图标
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.marginRight = '5px';
        toggleButton.onclick = function() {
            subList.classList.toggle('hidden'); // 切换隐藏类
            toggleButton.innerHTML = subList.classList.contains('hidden') ? '▶' : '▼'; // 切换图标
        };
        return toggleButton;
    }
})();
