// ==UserScript==
// @name         遍历链接并滚动到底部-zhangtia
// @namespace    https://www.netaiseo.com
// @version      1.4
// @description  遍历链接并滚动到底部，zhangtia。
// @author       Mr.Zhang
// @license      MIT
// @match        *://*/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/522270/%E9%81%8D%E5%8E%86%E9%93%BE%E6%8E%A5%E5%B9%B6%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BA%95%E9%83%A8-zhangtia.user.js
// @updateURL https://update.greasyfork.org/scripts/522270/%E9%81%8D%E5%8E%86%E9%93%BE%E6%8E%A5%E5%B9%B6%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BA%95%E9%83%A8-zhangtia.meta.js
// ==/UserScript==
 
(function () {
    'use strict';

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = '遍历所有链接';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.left = '10px';
    button.style.zIndex = 10000;
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        // 获取页面中的所有链接
        const links = Array.from(document.querySelectorAll('a[href]')).map(a => a.href);
        const visitedLinks = []; // 用于记录已访问的链接

        // 打开并向目标页面发送滚动命令
        async function openAndSendMessage(link) {
            return new Promise((resolve) => {
                const newWindow = window.open(link, '_blank'); // 在新窗口打开链接
                if (!newWindow) {
                    console.log(`无法打开链接：${link}`);
                    resolve();
                    return;
                }

                // 等待 2 秒发送消息，通知目标页面执行滚动到底部
                const timer = setTimeout(() => {
                    newWindow.postMessage({ action: 'scrollToBottom' }, '*');
                    resolve(); // 标记当前链接处理完毕
                }, 2000);
            });
        }

        // 逐步处理链接
        async function processLinks() {
            for (const link of links) {
                if (!visitedLinks.includes(link)) {
                    visitedLinks.push(link); // 标记已访问链接
                    await openAndSendMessage(link); // 发送滚动命令到新窗口
                }
            }
            alert('所有链接已处理完毕！'); // 完成所有链接处理
        }

        processLinks(); // 开始处理链接
    });
})();
window.addEventListener('message', (event) => {
    if (event.data?.action === 'scrollToBottom') {
        console.log('收到滚动指令，开始滚动到页面底部。');
        // 滚动到页面底部
        const scrollToBottom = setInterval(() => {
            window.scrollBy(0, 100); // 滚动 100 像素
            if ((window.scrollY + window.innerHeight) >= document.body.scrollHeight) {
                clearInterval(scrollToBottom); // 停止滚动
                setTimeout(() => {
                    window.close(); // 关闭当前窗口
                }, 2000); // 停留 2 秒后关闭
            }
        }, 200); // 每 200 毫秒执行一次滚动
    }
});