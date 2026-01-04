// ==UserScript==
// @name         Google Search Syntax Helper
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Show Google search syntax on Google homepage and search results page, with resizable and draggable functionality
// @author       而今迈步从头越
// @match        https://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502155/Google%20Search%20Syntax%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/502155/Google%20Search%20Syntax%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Google search syntax text
    const syntaxText = `
        <div id="syntax-helper" style="
            position: fixed;
            background: white;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
            width: 300px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            top: 10px;
            right: 350px;
            resize: both;
            overflow: auto;
        ">
            <div id="syntax-header" style="
                cursor: move;
                background: #f1f1f1;
                padding: 5px;
                border-bottom: 1px solid #ccc;
            ">
                <strong>Google 搜索语法:</strong>
            </div>
            <ul style="padding-left: 20px;">
                <li><code>"关键词"</code> - 精确匹配关键词</li>
                <li><code>关键词1 OR 关键词2</code> - 匹配任一关键词</li>
                <li><code>-关键词</code> - 排除某个关键词</li>
                <li><code>site:example.com</code> - 只在指定网站搜索</li>
                <li><code>filetype:pdf</code> - 搜索特定文件类型</li>
                <li><code>related:example.com</code> - 查找相似网站</li>
                <li><code>define:词汇</code> - 查询词汇定义</li>
                <li><code>intitle:关键词</code> - 标题中包含关键词</li>
                <li><code>inurl:关键词</code> - URL中包含关键词</li>
            </ul>
        </div>
    `;

    // Append the syntax helper to the body
    document.body.insertAdjacentHTML('beforeend', syntaxText);

    // Make the syntax helper draggable
    const syntaxHelper = document.getElementById('syntax-helper');
    const syntaxHeader = document.getElementById('syntax-header');

    syntaxHeader.addEventListener('mousedown', function(e) {
        let offsetX = e.clientX - syntaxHelper.getBoundingClientRect().left;
        let offsetY = e.clientY - syntaxHelper.getBoundingClientRect().top;

        function mouseMoveHandler(e) {
            syntaxHelper.style.left = `${e.clientX - offsetX}px`;
            syntaxHelper.style.top = `${e.clientY - offsetY}px`;
        }

        function mouseUpHandler() {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });

    // Ensure the syntax helper is positioned within the viewport on load
    window.addEventListener('load', function() {
        const rect = syntaxHelper.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            syntaxHelper.style.right = '10px';
        }
        if (rect.bottom > window.innerHeight) {
            syntaxHelper.style.bottom = '10px';
        }
    });
})();
