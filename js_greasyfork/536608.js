// ==UserScript==
// @name         GitHub仓库大小检测按钮（美化版）
// @namespace    zuxtuo-namespace
// @version      1.3
// @description  在GitHub仓库页面添加一个美观的按钮，显示仓库大小信息（MB）
// @author       ZUXTUO
// @match        https://github.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/536608/GitHub%E4%BB%93%E5%BA%93%E5%A4%A7%E5%B0%8F%E6%A3%80%E6%B5%8B%E6%8C%89%E9%92%AE%EF%BC%88%E7%BE%8E%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536608/GitHub%E4%BB%93%E5%BA%93%E5%A4%A7%E5%B0%8F%E6%A3%80%E6%B5%8B%E6%8C%89%E9%92%AE%EF%BC%88%E7%BE%8E%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 检查当前页面是否为GitHub仓库页面
    if (isRepositoryPage()) {
        // 从URL获取仓库所有者和名称
        const repositoryInfo = getRepositoryInfo();
        const owner = repositoryInfo[0];
        const name = repositoryInfo[1];
        
        // 向GitHub API发送请求以获取仓库信息
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.github.com/repos/${owner}/${name}`,
            onload: function(response) {
                try {
                    const repositoryData = JSON.parse(response.responseText);
                    
                    // 确保仓库大小数据存在且有效
                    if (repositoryData && repositoryData.size) {
                        const repositorySizeKB = repositoryData.size;
                        const repositorySizeMB = (repositorySizeKB / 1024).toFixed(2);
                        
                        // 创建显示仓库大小的按钮元素
                        createSizeButton(repositorySizeMB);
                    }
                } catch (error) {
                    console.error('Error processing repository data:', error);
                }
            },
            onerror: function(error) {
                console.error('Error fetching repository data:', error);
            }
        });
    }
    
    // 创建并添加仓库大小按钮
    function createSizeButton(sizeMB) {
        // 添加CSS样式
        GM_addStyle(`
            .repo-size-button {
                background-color: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 16px;
                position: fixed;
                top: 100px;
                right: 10px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                font-weight: 600;
                font-size: 12px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                cursor: pointer;
                display: flex;
                align-items: center;
            }
            
            .repo-size-button:hover {
                background-color: #d32f2f;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                transform: translateY(-1px);
            }
            
            .repo-size-icon {
                margin-right: 6px;
            }
        `);
        
        // 创建按钮元素
        const button = document.createElement('button');
        button.className = 'repo-size-button';
        
        // 添加硬盘图标
        const iconSvg = `<svg class="repo-size-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>`;
        
        button.innerHTML = `${iconSvg} ${sizeMB} MB`;
        
        // 将按钮添加到文档主体
        document.body.appendChild(button);
    }
    
    // 检查当前页面是否为GitHub仓库页面的函数
    function isRepositoryPage() {
        const pathSegments = window.location.pathname.split('/');
        return (pathSegments.length >= 3 && pathSegments[1] !== '' && pathSegments[2] !== '' && !['settings', 'marketplace', 'explore', 'notifications', 'issues', 'pulls', 'codespaces'].includes(pathSegments[1]));
    }
    
    // 从URL获取仓库所有者和名称的函数
    function getRepositoryInfo() {
        const pathSegments = window.location.pathname.split('/');
        const owner = pathSegments[1];
        const name = pathSegments[2];
        return [owner, name];
    }
})();