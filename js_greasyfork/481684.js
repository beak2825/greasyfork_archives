// ==UserScript==
// @name         Raw2Repo
// @namespace    https://github.com/rickhqh
// @version      1.51
// @description  将不同代码托管平台（GitHub、Gitee、GitCode、GitLab）上的 raw URL 转换为相应的 blob/repo URL
// @author       rickhqh
// @match        http*://raw.githubusercontent.com/*
// @include      *://raw.githubusercontent.com/*
// @match        http*://gitee.com/*/raw/*
// @match        http*://raw.gitcode.com/*
// @match        http*://gitlab.com/*/raw/*
// @license      MIT
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/0cz0a0mj7wd9wcpeoukisaynmgzg
// @downloadURL https://update.greasyfork.org/scripts/481684/Raw2Repo.user.js
// @updateURL https://update.greasyfork.org/scripts/481684/Raw2Repo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const transformRaw2Repo = (rawURL) => {
        // GitHub 格式匹配
        const githubRegex = /^https:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/.+/;
        const githubMatch = rawURL.match(githubRegex);

        // Gitee 格式匹配
        const giteeRegex = /^https:\/\/gitee\.com\/([^\/]+)\/([^\/]+)\/raw\/([^\/]+)\/(.+)$/;
        const giteeMatch = rawURL.match(giteeRegex);

        // GitCode 格式匹配
        const gitCodeRegex = /^https:\/\/raw\.gitcode\.com\/([^\/]+)\/([^\/]+)\/raw\/([^\/]+)\/(.+)$/;
        const gitCodeMatch = rawURL.match(gitCodeRegex);

        //Gitlab 格式匹配
        const gitlabRegex = /^https:\/\/gitlab\.com\/([^\/]+)\/([^\/]+)\/-\/raw\/([^\/]+)\/(.+?)(?:\?.*)?$/;
        const gitlabMatch = rawURL.match(gitlabRegex);

        // 根据匹配的结果构建新的 URL
        if (githubMatch) {
            const [, githubUser, githubRepo] = githubMatch;
            return `https://github.com/${githubUser}/${githubRepo}`;
        } else if (giteeMatch) {
            const [, giteeUser, giteeRepo, giteeBranch, giteePath] = giteeMatch;
            return `https://gitee.com/${giteeUser}/${giteeRepo}/blob/${giteeBranch}/${giteePath}`;
        } else if (gitCodeMatch) {
            const [, gitCodeUser, gitCodeRepo, gitCodeBranch, gitCodePath] = gitCodeMatch;
            return `https://gitcode.com/${gitCodeUser}/${gitCodeRepo}/blob/${gitCodeBranch}/${gitCodePath}`;
        } else if (gitlabMatch) {
            const [, gitlabUser, gitlabRepo, gitlabBranch, gitlabPath] = gitlabMatch;
            return `https://gitlab.com/${gitlabUser}/${gitlabRepo}/-/blob/${gitlabBranch}/${gitlabPath}`;
        } else {
            // 如果都不匹配，返回原始 URL
            return rawURL;
        }
    };

    function openRepo() {
        // 创建跳转按钮
        const jumpButton = document.createElement('button');
        jumpButton.textContent = 'Jump to Repo';
        jumpButton.style.position = 'fixed';
        jumpButton.style.top = '10px';
        jumpButton.style.right = '10px';
        jumpButton.addEventListener('click', function () {
            window.location.href = transformRaw2Repo(window.location.href);
        });

        // 将按钮插入到页面中
        document.body.appendChild(jumpButton);
    }

    // 在页面加载后等待0.1秒再执行跳转
    setTimeout(openRepo, 100);
})();
