// ==UserScript==
// @name         [Captured Unique AJAX Paths] 记录页面所有的 Ajax 请求
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  [Captured Unique AJAX Paths] 记录页面所有的 Ajax 请求，并支持复制全部，自动过滤重复
// @match        *://*/*
// @grant        none
// @author       Enda
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515314/%5BCaptured%20Unique%20AJAX%20Paths%5D%20%E8%AE%B0%E5%BD%95%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E7%9A%84%20Ajax%20%E8%AF%B7%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/515314/%5BCaptured%20Unique%20AJAX%20Paths%5D%20%E8%AE%B0%E5%BD%95%E9%A1%B5%E9%9D%A2%E6%89%80%E6%9C%89%E7%9A%84%20Ajax%20%E8%AF%B7%E6%B1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const paths = new Set();
    let isVisible = false; // 用于跟踪浮窗的显示状态

    // 创建一个浮动窗口，显示并复制接口路径
    const displayBox = document.createElement('div');
    displayBox.style.position = 'fixed';
    displayBox.style.bottom = '10px';
    displayBox.style.right = '10px';
    displayBox.style.width = '800px'; // 可以适当缩小宽度
    displayBox.style.maxHeight = '800px'; // 设置最大高度
    displayBox.style.overflowY = 'auto'; // 启用垂直滚动条
    displayBox.style.backgroundColor = '#fff';
    displayBox.style.border = '1px solid #ccc';
    displayBox.style.padding = '10px';
    displayBox.style.fontSize = '13px'; // 增大整体字体
    displayBox.style.lineHeight = '2.0'; // 增加行高
    displayBox.style.zIndex = '10000';
    displayBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    displayBox.style.display = 'none'; // 默认显示
    displayBox.innerHTML = `
        <strong>Captured Unique AJAX Paths</strong><br>
        <button id="copyPaths" style="margin: 5px 0; padding: 5px; cursor: pointer;">Copy All</button>
        <button id="clearPaths" style="margin: 5px 0; padding: 5px; cursor: pointer;">Clear All</button>
        <div id="pathList"></div>`;
    document.body.appendChild(displayBox);

    const pathList = document.getElementById('pathList');
    const copyButton = document.getElementById('copyPaths');
    const clearButton = document.getElementById('clearPaths');

    copyButton.onclick = () => {
        const allPaths = Array.from(paths).join('\n');
        navigator.clipboard.writeText(allPaths).then(() => {
        });
    };

    clearButton.onclick = () => {
        paths.clear(); // 清空存储的路径
        pathList.innerHTML = ''; // 清空显示的路径
    };

    // 添加隐藏按钮
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '⚙️'; // 使用小图标作为按钮
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.fontSize = '20px';
    toggleButton.style.zIndex = '10001'; // 确保在浮动窗口之上
    toggleButton.style.backgroundColor = 'transparent';
    toggleButton.style.border = 'none';
    toggleButton.style.cursor = 'pointer';
    document.body.appendChild(toggleButton);

    // 切换浮动窗口的显示和隐藏
    toggleButton.onclick = () => {
        isVisible = !isVisible; // 切换状态
        displayBox.style.display = isVisible ? 'block' : 'none';
    };

    // Function to process and store unique path with parameters without domain
    function capturePath(url) {
        try {
            const urlObj = new URL(url, location.origin);
            let pathWithParams = urlObj.pathname;
            if (urlObj.pathname == '/index.php'){
                const urlParams = new URLSearchParams(urlObj.search);
                const [app, mod, act] = [urlParams.get('app'), urlParams.get('mod'), urlParams.get('act')];
                // 只有当 app, mod, act 都存在时，才构建新的路径
                if (app && mod && act) {
                    pathWithParams = `/${app}/${mod}/${act}`;
                }
            }

            if (!paths.has(pathWithParams)) {
                paths.add(pathWithParams);
                const pathItem = document.createElement('div');
                pathItem.textContent = pathWithParams;
                pathItem.style.fontSize = '13px'; // 增大单行字体
                pathItem.style.lineHeight = '2.0'; // 增加单行行高
                pathList.appendChild(pathItem);
            }
        } catch (error) {
            console.error('Error processing URL:', url);
        }
    }

    // Intercept XMLHttpRequest requests
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener('load', () => capturePath(this._url));
        return originalSend.apply(this, arguments);
    };

    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = input instanceof Request ? input.url : input;
        const response = await originalFetch(input, init);
        capturePath(url);
        return response;
    };

})();
