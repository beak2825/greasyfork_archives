// ==UserScript==
// @name         auto-lady
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  订阅小姐姐
// @author       oreki
// @match        https://www.javlibrary.com/cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507257/auto-lady.user.js
// @updateURL https://update.greasyfork.org/scripts/507257/auto-lady.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加菜单选项让用户设置订阅地址
    GM_registerMenuCommand('设置订阅地址', () => {
        const url = prompt('请输入订阅请求地址:', GM_getValue('subscriptionUrl', 'https://default-subscription-url.com/subscribe'));
        if (url) {
            GM_setValue('subscriptionUrl', url);
            alert('订阅地址已保存');
        }
    });

    // 获取所有影片条目
    const movieItems = document.querySelectorAll('.video');  // 根据页面结构修改

    // 为每个影片条目添加订阅按钮
    movieItems.forEach((movieItem) => {
        const div = document.createElement('div');
        // 创建 <a> 元素
        const subButton = document.createElement('button');
        subButton.innerText = '订阅影片';
        subButton.className = 'smallbutton'
        const idDiv = movieItem.querySelector('.id');
        const movieId = idDiv ? idDiv.innerText : '';
        // 将按钮添加到影片项中
        div.appendChild(subButton)
        idDiv.appendChild(div);
        // 绑定点击事件
        subButton.addEventListener('click', (event) => {
            event.stopPropagation();  // 阻止事件冒泡
            event.preventDefault();


            // 获取订阅请求地址并发送订阅请求
            const subscriptionUrl = GM_getValue('subscriptionUrl', '');

            // 发送POST请求
            GM_xmlhttpRequest({
                method: 'POST',
                url: subscriptionUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ code: movieId,filter:{},mode:''}),
                onload: function(response) {
                    if (response.status === 200) {
                        alert(`番号 ${movieId} 订阅成功！`);
                    } else {
                        alert(`订阅失败：${response.responseText}`);
                    }
                },
                onerror: function() {
                    alert('订阅请求失败，番号'+movieId);
                }
            });
        });
    });
})();
