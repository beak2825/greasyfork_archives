// ==UserScript==
// @name         GitHub Repo Star Time
// @namespace    http://github.com/qbosen/tm-gh-star-time
// @version      0.3
// @description  Display the time stared at for GitHub repositories on the repository page.
// @author       qbosen
// @match        https://github.com/*/*
// @connect      api.github.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521091/GitHub%20Repo%20Star%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/521091/GitHub%20Repo%20Star%20Time.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let githubToken = GM_getValue('githubToken', '');

    // 注册菜单命令，用于设置 Token
    GM_registerMenuCommand("Setup GitHub Token", function () {
        const token = prompt("Input GitHub Personal Access Token\n(Permission: 'Metadata' repository permissions (read) and 'Starring' user permissions (read)):", githubToken);
        if (token !== null) {
            GM_setValue('githubToken', token);
            githubToken = token;
            alert("GitHub Token Saved");
        }
    });
    // 清理 缓存 命令
    GM_registerMenuCommand("Clean Cache", function () {
        GM_setValue('starredRepos', '{"repos": [], "timestamp": 0}');
        alert("Cache Cleaned");
    });

    if (!githubToken) {
        console.warn("请先设置 GitHub Token。");
        return; // 没有 Token，不执行后续操作
    }

    // 检查是否 star 过
    function checkStarred(owner, repo, callback) {
        // https://docs.github.com/en/rest/activity/starring?apiVersion=2022-11-28#check-if-a-repository-is-starred-by-the-authenticated-user
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.github.com/user/starred/${owner}/${repo}`,
            headers: {
                "Authorization": `token ${githubToken}`,
                "Accept": "application/vnd.github.v3+json",
                "X-GitHub-Api-Version": "2022-11-28"
            },
            onload: function (response) {
                if (response.status === 204) {
                    callback(true);
                } else if (response.status === 404) {
                    callback(false);
                } else {
                    console.error(`检查 star 状态失败: ${response.status} ${response.statusText}`);
                    callback(false);
                }
            },
            onerror: function (error) {
                console.error("检查 star 状态错误:", error);
                callback(false);
            }
        });
    }

    // 获取用户所有star过的仓库
    function getAllStarredRepos(username, callback) {
        let allRepos = [];
        let page = 1;
        const perPage = 100; // 每页 100 个

        function fetchPage(page) {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.github.com/users/${username}/starred?per_page=${perPage}&page=${page}`,
                headers: {
                    "Authorization": `token ${githubToken}`,
                    "Accept": "application/vnd.github.star+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const repos = JSON.parse(response.responseText);
                            // 只提取需要的字段
                            const simplifiedRepos = repos.map(repo => ({
                                full_name: repo.repo.full_name,
                                starred_at: repo.starred_at
                            }));
                            allRepos = allRepos.concat(simplifiedRepos);

                            if (repos.length === perPage) {
                                fetchPage(page + 1);
                            } else {
                                callback(allRepos);
                            }
                        } catch (error) {
                            console.error("解析 JSON 失败:", error);
                            callback(null);
                        }
                    } else {
                        console.error(`获取 star 列表失败: ${response.status} ${response.statusText}`);
                        callback(null);
                    }
                },
                onerror: function (error) {
                    console.error("获取 star 列表错误:", error);
                    callback(null);
                }
            });
        }

        fetchPage(page);
    }


    const pathParts = window.location.pathname.split('/');
    if (pathParts.length < 3) return;
    const owner = pathParts[1];
    const repo = pathParts[2];

    const username = document.querySelector('meta[name="user-login"]').content;

    checkStarred(owner, repo, function (isStarred) {
        if (isStarred) {
            let cachedStarredRepos = JSON.parse(GM_getValue('starredRepos', '{"repos": [], "timestamp": 0}'));
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;

            if (now - cachedStarredRepos.timestamp > oneDay || cachedStarredRepos.repos.length === 0) { // 修改判断条件
                getAllStarredRepos(username, function (repos) {
                    if (repos) {
                        GM_setValue('starredRepos', JSON.stringify({ repos: repos, timestamp: now }));
                        cachedStarredRepos = { repos: repos, timestamp: now };
                        displayStarTime(cachedStarredRepos, owner, repo);
                    }
                });
            } else {
                displayStarTime(cachedStarredRepos, owner, repo);
            }
        }
    });

    function displayStarTime(cachedStarredRepos, owner, repo) {
        const fullName = `${owner}/${repo}`;
        const starredRepo = cachedStarredRepos.repos.find(r => r.full_name === fullName);

        if (starredRepo) {
            const starredAt = new Date(starredRepo.starred_at);
            const timeString = starredAt.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false // 使用 24 小时制
            })

            const detailsElement = document.querySelector('.BorderGrid .BorderGrid-cell');
            if (detailsElement) {
                const timeElement = document.createElement('div');
                timeElement.textContent = `Starred at ${timeString}`;
                detailsElement.appendChild(timeElement);
            } else {
                console.log(`star time: ${timeString}`);
            }
        }
    }
})();