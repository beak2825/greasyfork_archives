// ==UserScript==
// @name         涉诈网址检测器
// @namespace    website_classifier
// @version      1.1.5
// @description  此插件将检测当前访问的网址是否为涉诈网址
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/471458/%E6%B6%89%E8%AF%88%E7%BD%91%E5%9D%80%E6%A3%80%E6%B5%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/471458/%E6%B6%89%E8%AF%88%E7%BD%91%E5%9D%80%E6%A3%80%E6%B5%8B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前网页的URL
    const url = window.location.href;

    // 发送POST请求
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://minesweeping.top/text_submit',
        data: `url=${encodeURIComponent(url)}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        onload: function(response) {
            // 解析JSON响应
            const json = JSON.parse(response.responseText);

            // 获取"text"字段的值
            const text = json.text;
            const div = document.createElement('div');
			
            div.style.position = 'fixed';
            div.style.top = '40px';
            div.style.left = `calc(100% - ${400 + 20}px)`; // 将文本框放在页面右边
            div.style.width = '400px'; // 将文本框的宽度设置为400像素
			div.style.border = '1px solid #ccc'; // 添加边框样式
            //div.style.backgroundColor = '#ccc';
            // div.style.backgroundColor = 'rgba(128, 128, 128, 0.8)';//增加文本框背景透明效果
            // div.style.color = '#000'; // 将文字颜色改为黑色
            div.style.color = '#2C49BD';
            div.style.backgroundColor = '#fff';
			
            div.style.padding = '5px';
            div.style.zIndex = '9999999';
            div.style.overflowX = 'auto'; // 添加水平滚动条
            div.style.whiteSpace = 'pre-wrap'; // 自动换行显示
            div.style.wordBreak = 'break-all'; // 打断单词以确保文本完整显示
            div.innerHTML = `<span style="font-size: 20px;">涉诈网址检测</span><br>当前网址：${url}<br>检测结果：${text}`;

            document.body.appendChild(div);

            // 点击文本框时，移除文本框
            div.onclick = function() {
                div.remove();
            };

            // 避免文本框被页面内容所遮挡
            // const observer = new MutationObserver(function(mutations) {
            //     mutations.forEach(function(mutation) {
            //         if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            //             const addedNode = mutation.addedNodes[0];
            //             if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode !== div) {
            //                 const rect = div.getBoundingClientRect();
            //                 const addedRect = addedNode.getBoundingClientRect();
            //                if (addedRect.bottom > rect.top && addedRect.top < rect.top) {
            //                     div.style.top = `${addedRect.bottom + 10}px`;
            //                 }
            //             }
            //         }
            //     });
            // });
            //observer.observe(div.parentNode, { childList: true });

            // 5秒后自动删除文本框
            setTimeout(function() {
                div.remove();
            }, 5000);
        },
        onerror: function(response) {
            GM_notification('发送请求出错', '错误');
        }
    });

})();