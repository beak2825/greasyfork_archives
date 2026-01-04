// ==UserScript==
// @name         GitHub Repo Size Display
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Display repository size on GitHub repository pages
// @author       RainbowBird
// @match        https://github.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @downloadURL https://update.greasyfork.org/scripts/545286/GitHub%20Repo%20Size%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/545286/GitHub%20Repo%20Size%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 工具函数：转换文件大小为人类可读格式
    function convertSizeToHumanReadableFormat(bytes) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return {
            size: size.toFixed(1),
            measure: units[unitIndex]
        };
    }

    // 工具函数：从 URL 获取用户名和仓库名
    function getUsernameWithReponameFromGithubURL() {
        const pathnameParts = window.location.pathname.split('/').filter(Boolean);
        return {
            user: pathnameParts[0],
            repo: pathnameParts[1]
        };
    }

    // 添加仓库大小到页面
    function appendRepoSizeElement(repoSize) {
        // 移除已存在的仓库大小显示（如果有）
        const existingSize = document.querySelector('.eg-repo-size');
        if (existingSize) {
            existingSize.remove();
        }

        // 寻找插入位置
        const sidebarElement = document.querySelector('.Layout-sidebar .hide-sm.hide-md');
        if (!sidebarElement) return;

        const formattedFileSize = convertSizeToHumanReadableFormat(repoSize * 1024); // GitHub API 返回的大小单位是 KB

        const html = `
            <h3 class="sr-only">Repo Size</h3>
            <div class="mt-2 eg-repo-size">
                <a href="javascript:void(0);" data-view-component="true" class="Link Link--muted">
                    <svg class="octicon octicon-database mr-2" mr="2" aria-hidden="true" height="16" version="1.1" viewBox="0 0 12 16" width="16">
                        <path d="M6 15c-3.31 0-6-.9-6-2v-2c0-.17.09-.34.21-.5.67.86 3 1.5 5.79 1.5s5.12-.64 5.79-1.5c.13.16.21.33.21.5v2c0 1.1-2.69 2-6 2zm0-4c-3.31 0-6-.9-6-2V7c0-.11.04-.21.09-.31.03-.06.07-.13.12-.19C.88 7.36 3.21 8 6 8s5.12-.64 5.79-1.5c.05.06.09.13.12.19.05.1.09.21.09.31v2c0 1.1-2.69 2-6 2zm0-4c-3.31 0-6-.9-6-2V3c0-1.1 2.69-2 6-2s6 .9 6 2v2c0 1.1-2.69 2-6 2zm0-5c-2.21 0-4 .45-4 1s1.79 1 4 1 4-.45 4-1-1.79-1-4-1z"></path>
                    </svg>
                    <strong>${formattedFileSize.size}</strong>
                    <span>${formattedFileSize.measure}</span>
                </a>
            </div>
        `;

        sidebarElement.insertAdjacentHTML('beforeend', html);
    }

    // 获取仓库信息并显示大小
    function fetchRepoSizeAndDisplay() {
        const path = getUsernameWithReponameFromGithubURL();

        // 只在仓库主页执行
        if (!path.repo) return;

        const apiUrl = `https://api.github.com/repos/${path.user}/${path.repo}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            },
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    if (data && data.size) {
                        appendRepoSizeElement(data.size);
                    }
                }
            }
        });
    }

    // 监听页面 URL 变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            fetchRepoSizeAndDisplay();
        }
    }).observe(document, { subtree: true, childList: true });

    // 初始加载
    fetchRepoSizeAndDisplay();
})();