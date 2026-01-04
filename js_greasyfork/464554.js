// ==UserScript==
// @name         运营翻译小助手
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  获取页面HTML并发送至指定服务器，接收返回的id参数并在新窗口中跳转
// @author       You
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464554/%E8%BF%90%E8%90%A5%E7%BF%BB%E8%AF%91%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/464554/%E8%BF%90%E8%90%A5%E7%BF%BB%E8%AF%91%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const btn = document.createElement('button');
    btn.innerHTML = '发送HTML';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = '100000';
    document.body.appendChild(btn);

    // 创建图标
    const icon = document.createElement('img');
    icon.style.position = 'fixed';
    icon.style.top = '50px';
    icon.style.right = '20px';
    icon.style.zIndex = '100000';
    icon.style.width = '40px';
    icon.style.height = '40px';
    icon.style.display = 'none';
    document.body.appendChild(icon);

    // 创建链接元素
    const link = document.createElement('a');
    link.style.position = 'fixed';
    link.style.top = '50px';
    link.style.right = '10px';
    link.style.zIndex = '100000';
    link.style.display = 'none';
    link.target = '_blank';
    document.body.appendChild(link);

    // 点击按钮事件
    btn.addEventListener('click', () => {
        // 获取页面HTML和URL
        const html = document.documentElement.outerHTML;
        const url = window.location.href;

        // 显示loading图标
        icon.src = 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/0.16.1/images/loader-large.gif';
        icon.style.display = 'block';

        // 发送POST请求
        GM.xmlHttpRequest({
            method: 'POST',
            url: 'http://104.208.72.35:3000/articleParser/getArticleFromBrowser',
            data: JSON.stringify({html: html, url: url}),
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            onload: (response) => {
                // 请求成功，解析返回的JSON
                try {
                    const responseData = JSON.parse(response.responseText);
                    // 如果包含id参数，跳转到新URL
                    if (responseData.d.article_operate_id) {
                        const newUrl = `http://104.208.72.35:8080/articleParser?article_operate_id=${responseData.d.article_operate_id}`;
                        link.href = newUrl;
                        link.innerHTML = newUrl;
                        link.style.display = 'block';

                        // 显示加载完成的图标
                        icon.src = 'https://cdn-icons-png.flaticon.com/512/190/190411.png'; // success图标

                        var newWindow = window.open(newUrl, '_blank');
                        // 延迟关闭当前窗口
                        setTimeout(function() {
                            newWindow.opener = null;
                        }, 1000);
                    } else {
                        // 不包含id参数，显示error图标
                        icon.src = 'https://cdn-icons-png.flaticon.com/512/1828/1828665.png'; // error图标
                    }
                } catch (e) {
                    // 解析JSON失败，显示error图标
                    icon.src = 'https://cdn-icons-png.flaticon.com/512/1828/1828665.png'; // error图标
                }
            },
            onerror: () => {
                // 请求失败，显示error图标
                icon.src = 'https://cdn-icons-png.flaticon.com/512/1828/1828665.png'; // error图标
            }
        });
    });
})();
