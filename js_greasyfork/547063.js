// ==UserScript==
// @name         Kemono Add Savename
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Add savename below title on kemono post pages.在kemono的作品页面上添加“作者_标题_”文字，方便存图时直接复制为文件命名. 
// @author       kumiko
// @match        https://kemono.cr/*/user/*/post/*
// @match        https://kemono.cr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547063/Kemono%20Add%20Savename.user.js
// @updateURL https://update.greasyfork.org/scripts/547063/Kemono%20Add%20Savename.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标页面的路径模式 - 匹配所有 https://kemono.cr/*/user/*/post/* 格式的页面
    const TARGET_PATH_PATTERN = /^\/[^\/]+\/user\/[^\/]+\/post\/[^\/]+/;

    // 移除作品名末尾特定后缀的函数
    function trimTitleSuffix(title) {
        const suffixes = [
            " (Patreon)",
            " (Pixiv Fanbox)"
        ];

        let trimmedTitle = title;
        suffixes.forEach(suffix => {
            if (trimmedTitle.endsWith(suffix)) {
                trimmedTitle = trimmedTitle.substring(0, trimmedTitle.length - suffix.length);
            }
        });

        return trimmedTitle;
    }

    // 检查并添加savename的核心函数
    function tryAddSaveName() {
        // 先移除已存在的savename（防止重复）
        const existingElement = document.querySelector('.post__added[data-savename="true"]');
        if (existingElement) {
            existingElement.remove();
        }

        // 获取必要元素
        const authorElement = document.querySelector('.fancy-link.fancy-link--kemono.post__user-name');
        const titleElement = document.querySelector('.post__title');
        const addedElement = document.querySelector('.post__added');

        if (!authorElement || !titleElement || !addedElement) {
            return false;
        }

        // 处理名称
        const authorName = authorElement.textContent.trim() || 'UnknownAuthor';
        let workTitle = titleElement.textContent.trim() || 'UnknownTitle';
        workTitle = trimTitleSuffix(workTitle);
        const saveNameContent = `${authorName}_${workTitle}_`;

        // 创建savename元素
        const saveNameElement = document.createElement('div');
        saveNameElement.className = 'post__added';
        saveNameElement.style.margin = '0.125rem 0px';
        saveNameElement.setAttribute('data-savename', 'true');

        const spanElement = document.createElement('span');
//        const labelDiv = document.createElement('div');
//        labelDiv.style.width = '89px';
//        labelDiv.style.display = 'inline-block';
 //       labelDiv.textContent = 'Save name: ';

//        spanElement.appendChild(labelDiv);
        spanElement.appendChild(document.createTextNode(saveNameContent));
        saveNameElement.appendChild(spanElement);

        // 插入到标题下方
        titleElement.parentNode.insertBefore(saveNameElement, titleElement.nextSibling);

        return true;
    }

    // 检查当前页面是否为目标页面
    function isTargetPage() {
        return TARGET_PATH_PATTERN.test(window.location.pathname);
    }

    // 当页面变化时触发的处理函数
    function handlePageChange() {
        if (isTargetPage()) {
            // 目标页面，尝试添加savename
            if (!tryAddSaveName()) {
                // 元素未准备好，启动轮询
                let checkCount = 0;
                const maxChecks = 30;
                const checkInterval = setInterval(() => {
                    checkCount++;
                    if (tryAddSaveName() || checkCount >= maxChecks) {
                        clearInterval(checkInterval);
                    }
                }, 500);
            }
        }
    }

    // 监听URL变化的函数
    function setupUrlChangeMonitor() {
        // 保存原始的pushState和replaceState方法
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        // 重写pushState方法
        history.pushState = function(...args) {
            const result = originalPushState.apply(this, args);
            // URL变化后触发处理函数
            handlePageChange();
            return result;
        };

        // 重写replaceState方法
        history.replaceState = function(...args) {
            const result = originalReplaceState.apply(this, args);
            // URL变化后触发处理函数
            handlePageChange();
            return result;
        };

        // 监听popstate事件（如浏览器前进/后退按钮）
        window.addEventListener('popstate', handlePageChange);
    }

    // 初始化
    function init() {
        // 设置URL变化监测
        setupUrlChangeMonitor();

        // 初始页面检查
        handlePageChange();
    }

    // 启动脚本
    init();
})();
