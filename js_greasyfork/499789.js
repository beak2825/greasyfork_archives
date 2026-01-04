// ==UserScript==
// @name         Github中文搜索净化
// @namespace    http://danke666.top/
// @version      1.5
// @author       DanKe
// @description  Github中文搜索净化，屏蔽特定用户群
// @match        https://github.com/search*
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499789/Github%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/499789/Github%E4%B8%AD%E6%96%87%E6%90%9C%E7%B4%A2%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要检测和删除的用户名列表
    const usernamesToRemove = [
        'cirosantilli', //我去你妈了个表就是你这私人东西祸害环境
        'tjqJ62cESiHPj6DdR6vXDAcPp',
        'Bellum45',
        'Daravai1234',
        'cheezcharmer',
        'chinese-dictatorship',
        'Daravai1234',
        'b0LBwZ7r5HOeh6CBMuQIhVu3-s-random-fork',
        'random-fork',
        'zpc1314521',
        'jjzhang166',
        '1lixia',
        'panbinibn',
        'zaohmeing',
        'zhaohmng-outlook-com',
        'pxvr-official',
    ];

    function addBlockedNotice() {
        const resultsList = document.querySelector('div[data-testid="results-list"]');
        if (resultsList) {
            const notice = document.createElement('div');
            notice.style.cssText = 'text-align: center; padding: 10px; margin: 10px; background-color: #f9f9f9; border: 1px solid #e1e4e8;';
            notice.textContent = '已屏蔽不受欢迎的仓库';
            resultsList.appendChild(notice);
        }
    }

    function removeElementsWithUsername() {
        const resultsList = document.querySelector('div[data-testid="results-list"]');
        if (resultsList) {
            const userElements = resultsList.querySelectorAll('.Box-sc-g0xbh4-0');
            let hasRemoved = false;
            userElements.forEach(element => {
                const usernameElement = element.querySelector('a[href^="/"]');
                if (usernameElement) {
                    const username = usernameElement.getAttribute('href').split('/')[1];
                    if (usernamesToRemove.includes(username)) {
                        element.remove();
                        hasRemoved = true;
                    }
                }
            });
            if (hasRemoved) {
                addBlockedNotice();
            }
        }
    }

    function observerCallback(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                removeElementsWithUsername();
            }
        }
    }

    const observer = new MutationObserver(observerCallback);

    function init() {
        const resultsList = document.querySelector('div[data-testid="results-list"]');
        if (resultsList) {
            removeElementsWithUsername();
            observer.observe(resultsList, {
                childList: true,
                subtree: true
            });
        }
    }

    // 尝试在页面加载后立即初始化
    window.onload = init;

    // 设置一个定时器，每2秒执行一次removeElementsWithUsername函数
    setInterval(removeElementsWithUsername, 2000);

    // 对于动态内容，使用MutationObserver来持续监听DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


})();
