// ==UserScript==
// @name         GitHub API Button
// @namespace    https://github.com/Jursin/GitHub-API-Button
// @version      1.0
// @description  在 GitHub 仓库/用户页导航栏添加 API 按钮，并在侧边栏显示仓库/用户 created_at、updated_at 信息
// @author       Jursin
// @match        https://github.com/*
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @supportURL   https://github.com/Jursin/GitHub-API-Button/issues
// @downloadURL https://update.greasyfork.org/scripts/546506/GitHub%20API%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/546506/GitHub%20API%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册菜单命令以设置 GitHub Token
    GM_registerMenuCommand('设置 GitHub Token', () => {
        const token = prompt('输入你的 GitHub 个人访问令牌:');
        if (token) {
            GM_setValue('githubToken', token);
            alert('GitHub Token 设置成功！');
        } else if (token === '') {
            GM_setValue('githubToken', '');
            alert('GitHub Token 已清除');
        }
    });

    // 添加API按钮
    const navBar = document.querySelector('.UnderlineNav-body.list-style-none');
    if (navBar) {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        let apiUrl = '';

        if (pathParts.length === 1) {
            apiUrl = `https://api.github.com/users/${pathParts[0]}`;
        } else if (pathParts.length >= 2) {
            apiUrl = `https://api.github.com/repos/${pathParts[0]}/${pathParts[1]}`;
        }

        if (apiUrl) {
            const svgIcon = `
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-microchip UnderlineNav-octicon d-none d-sm-inline">
                <path d="M5.5,.75c0-.42-.33-.75-.75-.75s-.75,.33-.75,.75v1.25c-1.1,0-2,.9-2,2H.75c-.42,0-.75,.33-.75,.75s.33,.75,.75,.75h1.25v1.75H.75c-.42,0-.75,.33-.75,.75s.33,.75,.75,.75h1.25v1.75H.75c-.42,0-.75,.33-.75,.75s.33,.75,.75,.75h1.25c0,1.1,.9,2,2,2v1.25c0,.42,.33,.75,.75,.75s.75-.33,.75-.75v-1.25h1.75v1.25c0,.42,.33,.75,.75,.75s.75-.33,.75-.75v-1.25h1.75v1.25c0,.42,.33,.75,.75,.75s.75-.33,.75-.75v-1.25c1.1,0,2-.9,2-2h1.25c.42,0,.75-.33,.75-.75s-.33-.75-.75-.75h-1.25v-1.75h1.25c.42,0,.75-.33,.75-.75s-.33-.75-.75-.75h-1.25v-1.75h1.25c.42,0,.75-.33,.75-.75s-.33-.75-.75-.75h-1.25c0-1.1-.9-2-2-2V.75c0-.42-.33-.75-.75-.75s-.75,.33-.75,.75v1.25h-1.75V.75c0-.42-.33-.75-.75-.75s-.75,.33-.75,.75v1.25h-1.75V.75Zm-.5,3.25h6c.55,0,1,.45,1,1v6c0,.55-.45,1-1,1H5c-.55,0-1-.45-1-1V5c0-.55,.45-1,1-1Zm.5,1.5v5h5V5.5H5.5Z"/>
                </svg>
            `;

            const newLi = document.createElement('li');
            newLi.setAttribute('data-view-component', 'true');
            newLi.className = 'd-inline-flex';

            const newAnchor = document.createElement('a');
            newAnchor.setAttribute('id', 'api-tab');
            newAnchor.setAttribute('href', apiUrl);
            newAnchor.setAttribute('target', '_blank');
            newAnchor.className = 'UnderlineNav-item no-wrap js-responsive-underlinenav-item';

            newAnchor.innerHTML = svgIcon + '<span data-content="API">API</span>';

            newLi.appendChild(newAnchor);
            navBar.appendChild(newLi);
        }
    }

    // 获取API数据并添加信息
    function fetchAndDisplayInfo() {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        let apiUrl = '';

        if (pathParts.length === 1) {
            apiUrl = `https://api.github.com/users/${pathParts[0]}`;
        } else if (pathParts.length >= 2) {
            apiUrl = `https://api.github.com/repos/${pathParts[0]}/${pathParts[1]}`;
        }

        if (!apiUrl) return;

        const token = GM_getValue('githubToken', '');

        const headers = {};
        if (token) {
            headers['Authorization'] = `token ${token}`;
        }

        fetch(apiUrl, { headers })
            .then(response => response.json())
            .then(data => {
                if (pathParts.length >= 2) {
                    const forksContainer = document.querySelector('.BorderGrid-cell .hide-sm.hide-md');
                    if (forksContainer) {
                        const createdAt = new Date(data.created_at);
                        const updatedAt = new Date(data.updated_at);

                        const dateOptions = {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            timeZone: 'Asia/Shanghai'
                        };

                        const createdAtStr = createdAt.toLocaleDateString('zh-CN', dateOptions);
                        const updatedAtStr = updatedAt.toLocaleDateString('zh-CN', dateOptions);

                        // 创建包含创建时间和更新时间的容器
                        const timeInfoContainer = document.createElement('div');
                        timeInfoContainer.className = 'mt-2';

                        const infoDiv1 = document.createElement('div');
                        infoDiv1.className = 'mt-2';
                        infoDiv1.innerHTML = `
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-clock mr-2">
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                            </svg>
                            <span class="Link Link--muted">创建于: ${createdAtStr}</span>
                        `;

                        const infoDiv2 = document.createElement('div');
                        infoDiv2.className = 'mt-2';
                        infoDiv2.innerHTML = `
                            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-history mr-2">
                                <path d="M1.643 3.143.427 1.927A.25.25 0 0 1 0 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 0 1-.177-.427L2.715 4.215a6.501 6.501 0 1 1-1.18 4.458.75.75 0 1 1 1.493.154 5.001 5.001 0 1 0 .986-3.262.75.75 0 0 1-1.004-.334.75.75 0 0 1 .334-1.003ZM8 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75H5a.75.75 0 0 1 0-1.5h2.25V4.25A.75.75 0 0 1 8 3.5Z"></path>
                            </svg>
                            <span class="Link Link--muted">更新于: ${updatedAtStr}</span>
                        `;

                        // 查找举报仓库链接
                        const reportLink = document.querySelector('.hide-sm.hide-md a[href*="report-content"]');

                        if (reportLink) {
                            // 如果有举报链接，插入到举报链接之前
                            reportLink.parentNode.parentNode.insertBefore(infoDiv1, reportLink.parentNode);
                            reportLink.parentNode.parentNode.insertBefore(infoDiv2, reportLink.parentNode);
                        } else {
                            // 否则直接添加到容器末尾
                            forksContainer.appendChild(infoDiv1);
                            forksContainer.appendChild(infoDiv2);
                        }
                    }
                } else if (pathParts.length === 1) {
                    const vcardDetails = document.querySelector('.vcard-details');
                    if (vcardDetails) {
                        const createdAt = new Date(data.created_at);
                        const updatedAt = new Date(data.updated_at);
                        const dateOptions = {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            timeZone: 'Asia/Shanghai'
                        };

                        const createdAtStr = createdAt.toLocaleDateString('zh-CN', dateOptions);
                        const updatedAtStr = updatedAt.toLocaleDateString('zh-CN', dateOptions);

                        const newLi1 = document.createElement('li');
                        newLi1.className = 'vcard-detail pt-1';

                        newLi1.innerHTML = `
                            <svg class="octicon octicon-clock" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"></path>
                            </svg>
                            <span class="Link--primary">加入于: ${createdAtStr}</span>
                        `;

                        const newLi2 = document.createElement('li');
                        newLi2.className = 'vcard-detail pt-1';

                        newLi2.innerHTML = `
                            <svg class="octicon octicon-history" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                                <path d="M1.643 3.143.427 1.927A.25.25 0 0 1 0 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 0 1-.177-.427L2.715 4.215a6.501 6.501 0 1 1-1.18 4.458.75.75 0 1 1 1.493.154 5.001 5.001 0 1 0 .986-3.262.75.75 0 0 1-1.004-.334.75.75 0 0 1 .334-1.003ZM8 3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75H5a.75.75 0 0 1 0-1.5h2.25V4.25A.75.75 0 0 1 8 3.5Z"></path>
                            </svg>
                            <span class="Link--primary">更新于: ${updatedAtStr}</span>
                        `;

                        vcardDetails.appendChild(newLi1);
                        vcardDetails.appendChild(newLi2);
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching GitHub API:', error);
            });
    }

    // 延迟执行以确保页面完全加载
    setTimeout(fetchAndDisplayInfo, 1000);
})();