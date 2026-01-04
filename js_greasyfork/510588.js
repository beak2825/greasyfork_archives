// ==UserScript==
// @name         在outlook邮件中 Markdown 转换到 HTML
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将选定的 Markdown 文本转换为 HTML 并在 outlook.office.com 中替换它
// @author       ohao
// @match        https://outlook.office.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510588/%E5%9C%A8outlook%E9%82%AE%E4%BB%B6%E4%B8%AD%20Markdown%20%E8%BD%AC%E6%8D%A2%E5%88%B0%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/510588/%E5%9C%A8outlook%E9%82%AE%E4%BB%B6%E4%B8%AD%20Markdown%20%E8%BD%AC%E6%8D%A2%E5%88%B0%20HTML.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Markdown to HTML conversion function
    function markdownToHtml(markdown) {
        const html = markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\> (.*)/gim, '<blockquote style="--md-primary-color:#0F4C81;text-align:left;line-height:1.75;font-family:-apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size:14;font-style:normal;border-left:none;padding:1em;border-radius:8px;color:rgba(0,0,0,0.5);background:#f7f7f7;margin:2em 8px"><p style="--md-primary-color:#0F4C81;text-align:left;line-height:1.75;font-family:-apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size:1em;display:block;letter-spacing:0.1em;color:rgb(80, 80, 80)">$1</blockquote>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
         .replace(/!\[(.*?)\]\((.*?)\)/gim, '<div style="text-align: center; margin: 5px;"><img alt="$1" src="$2" style="max-width: 50%;border: 7px solid #f1e0e0;"/></div>')
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
        .replace(/\n/g, '<br />');
        return html;
    }

    // Create context menu
    function createContextMenu(event) {
        event.preventDefault();

        const menu = document.createElement('div');
        menu.style.position = 'absolute';
        menu.style.top = `${event.clientY}px`;
        menu.style.left = `${event.clientX}px`;
        menu.style.backgroundColor = '#fff';
        menu.style.border = '1px solid #ccc';
        menu.style.padding = '5px';
        menu.style.zIndex = 1000;

        const menuItem = document.createElement('div');
        menuItem.textContent = 'Convert Markdown to HTML';
        menuItem.style.cursor = 'pointer';
        menuItem.style.padding = '5px';

        menuItem.onclick = () => {
            const selection = window.getSelection();
            const markdown = selection.toString();
            if (markdown) {
                const html = markdownToHtml(markdown);
                const range = selection.getRangeAt(0);
                range.deleteContents();
                const div = document.createElement('div');
                div.innerHTML = html;
                range.insertNode(div);
            }
            document.body.removeChild(menu);
        };

        menu.appendChild(menuItem);
        document.body.appendChild(menu);

        document.addEventListener('click', () => {
            if (document.body.contains(menu)) {
                document.body.removeChild(menu);
            }
        }, { once: true });
    }

    document.addEventListener('contextmenu', function(event) {
        if (event.ctrlKey) {
            createContextMenu(event);
        }
    });
})();
