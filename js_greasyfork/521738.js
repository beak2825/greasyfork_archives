// ==UserScript==
// @name         XPath 文本复制工具
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在页面右下角输入XPath并复制匹配的文本内容
// @author       qztan
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521738/XPath%20%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/521738/XPath%20%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #xpathCopyTool {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 10000;
            font-family: Arial, sans-serif;
        }
        #xpathCopyTool input {
            width: calc(100% - 20px);
            padding: 8px;
            margin-bottom: 10px;
            border: none;
            border-radius: 4px;
        }
        #xpathCopyTool button {
            width: 100%;
            padding: 10px;
            background: #28a745;
            border: none;
            border-radius: 4px;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
        }
        #xpathCopyTool button:hover {
            background: #218838;
        }
        #xpathCopyTool .close-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 20px;
            height: 20px;
            background: none;
            border: none;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            line-height: 20px;
            text-align: center;
            padding: 0;
        }
        #xpathCopyTool .close-btn:hover {
            color: #ff4d4f;
        }
        #xpathCopyTool .message {
            margin-top: 10px;
            font-size: 12px;
            color: #28a745;
        }
    `);

    // 创建提示框容器
    const container = document.createElement('div');
    container.id = 'xpathCopyTool';

    // 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'close-btn';
    closeBtn.title = '关闭';
    closeBtn.onclick = () => container.style.display = 'none';
    container.appendChild(closeBtn);

    // 输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '请输入XPath路径';
    container.appendChild(input);

    // 复制按钮
    const button = document.createElement('button');
    button.textContent = '复制';
    container.appendChild(button);

    // 消息显示
    const message = document.createElement('div');
    message.className = 'message';
    container.appendChild(message);

    // 添加到页面
    document.body.appendChild(container);

    // 复制功能
    button.addEventListener('click', () => {
        const xpath = input.value.trim();
        if (!xpath) {
            message.textContent = '请输入有效的XPath路径。';
            return;
        }
        try {
            const result = [];
            const nodesSnapshot = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
                const node = nodesSnapshot.snapshotItem(i);
                if (node && node.textContent) {
                    result.push(node.textContent.trim());
                }
            }
            if (result.length === 0) {
                message.textContent = '没有找到匹配的内容。';
                return;
            }
            const textToCopy = result.join('\n');
            GM_setClipboard(textToCopy, 'text');
            message.textContent = '已复制 ' + result.length + ' 条内容到剪贴板。';
        } catch (error) {
            console.error('XPath 错误:', error);
            message.textContent = 'XPath 路径有误，请检查。';
        }
    });

})();
