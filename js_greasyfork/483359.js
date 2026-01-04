// ==UserScript==
// @name         Tag Extractor and Copier with Styled Interface
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract tags from a web page, display them in a styled panel, and provide a copy function
// @author       admin
// @match        https://danbooru.donmai.us/posts/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483359/Tag%20Extractor%20and%20Copier%20with%20Styled%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/483359/Tag%20Extractor%20and%20Copier%20with%20Styled%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';
       // 添加CSS样式
GM_addStyle(`
    .panel {
        position: fixed;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        width: 300px;
        height: 300px;
        padding: 10px;
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        z-index: 10000;
        overflow-y: auto;
        box-sizing: border-box; /* 加上这个属性以包含内边距和边框 */
    }

    .tag-text {
        /* 共同的样式 */
        display: inline-block;
        padding: 2px 5px;
        margin: 5px; /* 为了对称，给左右添加相同的margin */
        border-radius: 4px;
        font-size: 0.9em;
        cursor: pointer;
        user-select: none;
        background: #eef;
        color: #333;
    }

    .tag-text.unselected {
        /* 未选中状态的样式 */
        background: #fff;
        color: #ccc;
    }
`);





    // 创建显示标签和复制按钮的面板
    const panel = document.createElement('div');
    panel.className = 'panel'; // 默认为选中状态

    // 标签容器的样式
    const tagContainer = document.createElement('div');
    tagContainer.style.padding = '5px';
    tagContainer.style.marginBottom = '10px';
    panel.appendChild(tagContainer);

    // 复制按钮的样式
    const copyButton = document.createElement('button');
    copyButton.textContent = '复制标签';
    copyButton.style.width = '100%';
    copyButton.style.padding = '10px';
    copyButton.style.backgroundColor = '#4CAF50';
    copyButton.style.color = 'white';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '4px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.marginBottom = '10px';

    copyButton.onclick = function() {
    const selectedTags = document.querySelectorAll('.tag-text.selected');
    const tagNames = Array.from(selectedTags).map(tag => tag.textContent).join(', ');
    GM_setClipboard(tagNames);
    //alert('已复制选中的标签到剪贴板');
    };


    panel.appendChild(copyButton);

    // 将面板添加到文档中
    document.body.appendChild(panel);

    // 提取并显示标签
    const tags = document.querySelectorAll('.general-tag-list li[data-tag-name]');
    tags.forEach(tag => {
    const tagName = tag.getAttribute('data-tag-name');
    const tagDiv = document.createElement('div');
    tagDiv.textContent = tagName;
    tagDiv.className = 'tag-text selected'; // 默认为选中状态
    tagDiv.dataset.selected = 'true'; // 使用自定义数据属性跟踪选中状态

    tagDiv.addEventListener('click', function() {
        const isSelected = tagDiv.dataset.selected === 'true';
        if (isSelected) {
            tagDiv.className = 'tag-text unselected';
            tagDiv.dataset.selected = 'false';
        } else {
            tagDiv.className = 'tag-text selected';
            tagDiv.dataset.selected = 'true';
        }
    });

    tagContainer.appendChild(tagDiv);
});

})();
