// ==UserScript==
// @name         bilibili block user | 快捷拉黑B站Up猪的脚本
// @namespace    http://tampermonkey.net/
// @version     3.0.0
// @description  快捷拉黑B站Up猪的脚本
// @author       givingkwan
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/492760/bilibili%20block%20user%20%7C%20%E5%BF%AB%E6%8D%B7%E6%8B%89%E9%BB%91B%E7%AB%99Up%E7%8C%AA%E7%9A%84%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/492760/bilibili%20block%20user%20%7C%20%E5%BF%AB%E6%8D%B7%E6%8B%89%E9%BB%91B%E7%AB%99Up%E7%8C%AA%E7%9A%84%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';


const ele = document.querySelector('body')
const userList = {}
ele.addEventListener('mouseenter', function (event) {
    const classname = event.target.classList;
    if (classname.contains('up-name__text') || classname.contains('bili-video-card__info--author') || classname.contains('name')) {
        const username = event.target.innerText;
        console.log('用户:', username);
        if (username) {
            if (!userList[username]) {
                userList[username] = {};
                userList[username].done = true;
                // 创建新的元素
                var newElement = document.createElement('span');
                newElement.textContent = '🤐';
                newElement.style.paddingLeft = '5px';
                // 添加点击事件处理程序
                newElement.addEventListener('click', function (e) {
                    const formData = userList[username].formData
                    console.error("block it", formData)
                    e.stopPropagation();
                    if (formData) {
                        postDataWithFormData('https://api.bilibili.com/x/relation/modify', formData)
                            .then(data => {
                                newElement.textContent = '✔';
                                console.log('封杀成功:', data);
                            })
                            .catch(error => {
                                console.error('封杀时出现错误:', error);
                            });
                    }

                });
                event.target.insertAdjacentElement('afterend', newElement);
                const url = 'https://api.bilibili.com/x/web-interface/wbi/search/all/v2?keyword=' + username;
                fetchRemoteData(url)
                    .then(data => {
                        var mid = data.data.result.find(i => i.result_type == "bili_user").data[0].mid;
                        console.log('用户id:', mid);
                        if (mid) {
                            var formData = new FormData();
                            formData.append('csrf', getCookieValue('bili_jct'));
                            formData.append('fid', mid);
                            formData.append('act', '5');
                            formData.append('re_src', '1');
                            userList[username].formData = formData;
                        }
                    })
                    .catch(error => {
                        console.error('获取远程数据时出现错误:', error);
                    });
            }
        }

    }
}, true);

function fetchRemoteData(url, options = {}) {
    // 默认使用 GET 请求
    options.method = options.method || 'GET';
    // 包含凭据，以便发送同源策略下的 Cookie
    options.credentials = 'include';

    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // 解析 JSON 响应
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function postDataWithFormData(url, formData) {
    return fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function getCookieValue(cookieName) {
    // 将 cookie 字符串分割成键值对数组
    var cookies = document.cookie.split(';');

    // 遍历数组，查找特定的 cookie 值
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // 检查 cookie 是否以指定的名称开头
        if (cookie.startsWith(cookieName + '=')) {
            // 如果是，则返回 cookie 的值（从等号后开始截取）
            return cookie.substring(cookieName.length + 1);
        }
    }
    // 如果没有找到指定的 cookie，则返回 null
    return null;
}

})();