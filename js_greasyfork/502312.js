// ==UserScript==
// @name         linuxdo-fakeKing
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  你好，我是秦始皇
// @author       uniqueww
// @match        https://linux.do/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502312/linuxdo-fakeKing.user.js
// @updateURL https://update.greasyfork.org/scripts/502312/linuxdo-fakeKing.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let userName;
    let userAccount;
    let userAccount_low;
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://connect.linux.do',
        onload: (response) => {
            const bodyRegex = /你好，([^()]+) \(([^)]+)\)/;
            const matches = bodyRegex.exec(response.responseText);

            if (matches) {
                userName = matches[1].trim(); 
                userAccount = matches[2].trim(); 
                userAccount_low = userAccount.toLowerCase();
                console.log(`User Name: ${userName}`);
                console.log(`User Account: ${userAccount}`);
                processElements();
            } else {
                console.error('No matches found.');
            }
        },
        onerror: (error) => {
            console.error('Request failed:', error);
        }
    });

    // 插入 icon 的函数
    const insertIcon = (userCardElement) => {
        let parentElement = userCardElement.parentNode;
        const existingFlair = parentElement.querySelector('.avatar-flair');
        if (existingFlair) {
            existingFlair.remove();
        }
        let icon = `
        <svg class="fa d-icon d-icon-battery-quarter svg-icon svg-node" aria-hidden="true">
            <use xlink:href="#battery-quarter"></use>
        </svg>`;
        let iconElement = document.createElement('div');
        iconElement.className = 'avatar-flair rounded';
        iconElement.style.backgroundColor = '#00aeff';
        iconElement.style.color = '#fff';
        iconElement.title = 'admins';
        iconElement.innerHTML = icon;
        userCardElement.appendChild(iconElement)
    };

    // 样式 avatar 的函数
    const styleAvatar = (element) => {
        element.style.borderRadius = '10%';
        element.style.setProperty('border-radius', '10%', 'important');
    };

    // 替换 span 的函数
    const replaceSpan = (spanElement) => {
        let parentSpan = spanElement.parentElement;
        let newContent = `
            <span class="first full-name staff admin moderator">
                <a href="/u/${userAccount}" data-user-card="${userAccount}" class="">${userName}</a>
                <span title="此用户是版主" class="svg-icon-title">
                    <svg class="fa d-icon d-icon-shield-alt svg-icon svg-node" aria-hidden="true">
                        <use xlink:href="#shield-alt"></use>
                    </svg>
                </span>
            </span>`;
        parentSpan.outerHTML = newContent;
    };

    // 处理所有匹配的元素
    const processElements = () => {
        if (!userAccount) return; // 确保 userAccount 已定义
        document.querySelectorAll(`a.trigger-user-card[data-user-card="${userAccount}"]`).forEach(userCardElement => {
            if (!userCardElement.closest('div.topic-map-post.created-at')) {
                insertIcon(userCardElement);
            }
        });
        document.querySelectorAll(`img.avatar[src^="https://cdn.linux.do/user_avatar/linux.do/${userAccount_low}/"]`).forEach(styleAvatar);
        document.querySelectorAll(`span.first.full-name a[data-user-card="${userAccount}"]`).forEach(replaceSpan);
    };

    // 监听 URL 变化
    const observeURLChange = () => {
        let oldHref = document.location.href;
        const body = document.querySelector('body');
        const observer = new MutationObserver((mutations) => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                processElements();
            }
        });
        observer.observe(body, { childList: true, subtree: true });
    };

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        observeURLChange();
    });
})();
