// ==UserScript==
// @name         GitHub AI 代码分析助手
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description:en Add an AI-powered code analysis button for GitHub repositories, supporting intelligent code interpretation via zread.ai and deepwiki.com
// @description:zh-CN  为 GitHub 仓库添加 AI 驱动的代码分析按钮，支持 zread.ai 和 deepwiki.com 智能解读代码
// @description:zh-TW 為 GitHub 倉庫添加 AI 驅動的代碼分析按鈕，支援 zread.ai 與 deepwiki.com 智能解讀代碼
// @match        https://github.com/*/*
// @grant        none
// @license      MIT
// @description 为 GitHub 仓库添加 AI 驱动的代码分析按钮，支持 zread.ai 和 deepwiki.com 智能解读代码
// @downloadURL https://update.greasyfork.org/scripts/545686/GitHub%20AI%20%E4%BB%A3%E7%A0%81%E5%88%86%E6%9E%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/545686/GitHub%20AI%20%E4%BB%A3%E7%A0%81%E5%88%86%E6%9E%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function insertButton() {
        try {
            // 提取用户名和仓库名
            const pathParts = window.location.pathname.split('/').filter(Boolean);
            if (pathParts.length < 2) {
                console.log('AI Code Analysis: Not a repository page');
                return;
            }
            const user = pathParts[0];
            const repo = pathParts[1];

            // 只在仓库主页、Code 页面插入
            const subPath = pathParts[2] || '';
            if (subPath && subPath !== 'tree' && subPath !== 'blob') {
                console.log('AI Code Analysis: Not on main repository page');
                return;
            }

            // 避免重复插入
            if (document.querySelector('#zread-ai-btn') || document.querySelector('#code-reader-dropdown')) {
                console.log('AI Code Analysis: Button already exists');
                return;
            }

            // 更简单的策略：查找所有可能的按钮容器
            let targetContainer = null;

            // 方法1: 直接查找 ul.pagehead-actions (这是最正确的容器)
            targetContainer = document.querySelector('ul.pagehead-actions');
            if (targetContainer) {
                // 创建li包装
                const li = document.createElement('li');

                // 创建按钮组容器
                const btnGroup = document.createElement('div');
                btnGroup.className = 'BtnGroup d-flex';
                btnGroup.style.marginLeft = '8px';

                // 创建主按钮
                const mainBtn = document.createElement('button');
                mainBtn.id = 'zread-ai-btn';
                mainBtn.type = 'button';
                mainBtn.className = 'btn btn-sm BtnGroup-item';
                mainBtn.innerHTML = '🤖 AI Analysis';

                // GitHub 原生按钮样式
                mainBtn.style.cssText = `
                    position: relative;
                    display: inline-block;
                    padding: 5px 16px;
                    font-size: 12px;
                    font-weight: 500;
                    line-height: 20px;
                    white-space: nowrap;
                    vertical-align: middle;
                    cursor: pointer;
                    user-select: none;
                    background-repeat: repeat-x;
                    background-position: -1px -1px;
                    background-size: 110% 110%;
                    border: 1px solid rgba(31,35,40,0.15);
                    border-radius: 6px 0 0 6px;
                    appearance: none;
                    color: #24292f;
                    background-color: #f6f8fa;
                    background-image: linear-gradient(180deg,#f9fbfc,#f6f8fa 90%);
                    box-shadow: rgba(31, 35, 40, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset;
                `;

                // 创建下拉按钮
                const dropdownBtn = document.createElement('button');
                dropdownBtn.type = 'button';
                dropdownBtn.className = 'btn btn-sm BtnGroup-item px-2';
                dropdownBtn.innerHTML = `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-triangle-down">
                    <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"></path>
                </svg>`;

                dropdownBtn.style.cssText = `
                    position: relative;
                    display: inline-block;
                    padding: 5px 8px;
                    font-size: 12px;
                    font-weight: 500;
                    line-height: 20px;
                    white-space: nowrap;
                    vertical-align: middle;
                    cursor: pointer;
                    user-select: none;
                    background-repeat: repeat-x;
                    background-position: -1px -1px;
                    background-size: 110% 110%;
                    border: 1px solid rgba(31,35,40,0.15);
                    border-radius: 0 6px 6px 0;
                    border-left: 0;
                    appearance: none;
                    color: #24292f;
                    background-color: #f6f8fa;
                    background-image: linear-gradient(180deg,#f9fbfc,#f6f8fa 90%);
                    box-shadow: rgba(31, 35, 40, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset;
                `;

                // 创建下拉菜单
                const dropdown = document.createElement('div');
                dropdown.id = 'code-reader-dropdown';
                dropdown.style.cssText = `
                    position: absolute;
                    top: 100%;
                    right: 0;
                    z-index: 100;
                    width: 200px;
                    margin-top: 5px;
                    background-color: #ffffff;
                    border: 1px solid rgba(31,35,40,0.15);
                    border-radius: 6px;
                    box-shadow: 0 8px 24px rgba(31,35,40,0.12);
                    display: none;
                `;

                // 菜单选项
                const options = [
                    {
                        name: 'zread.ai',
                        url: 'https://zread.ai',
                        icon: '<svg aria-hidden="true" viewBox="0 0 32 32" version="1.1" width="16" height="16" data-view-component="true" class="v-align-middle" style="display: inline-block; vertical-align: middle;"><path d="M9.91922 3.2002H4.47922C3.77229 3.2002 3.19922 3.77327 3.19922 4.4802V9.9202C3.19922 10.6271 3.77229 11.2002 4.47922 11.2002H9.91922C10.6261 11.2002 11.1992 10.6271 11.1992 9.9202V4.4802C11.1992 3.77327 10.6261 3.2002 9.91922 3.2002Z" fill="currentColor"></path><path d="M9.91922 20.7998H4.47922C3.77229 20.7998 3.19922 21.3729 3.19922 22.0798V27.5198C3.19922 28.2267 3.77229 28.7998 4.47922 28.7998H9.91922C10.6261 28.7998 11.1992 28.2267 11.1992 27.5198V22.0798C11.1992 21.3729 10.6261 20.7998 9.91922 20.7998Z" fill="currentColor"></path><path d="M27.5208 3.2002H22.0808C21.3739 3.2002 20.8008 3.77327 20.8008 4.4802V9.9202C20.8008 10.6271 21.3739 11.2002 22.0808 11.2002H27.5208C28.2277 11.2002 28.8008 10.6271 28.8008 9.9202V4.4802C28.8008 3.77327 28.2277 3.2002 27.5208 3.2002Z" fill="currentColor"></path><path d="M8 24L24 8L8 24Z" fill="currentColor"></path><path d="M8 24L24 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>',
                        desc: 'Powered by Z.ai'
                    },
                    {
                        name: 'deepwiki.com',
                        url: 'https://deepwiki.com',
                        icon: '<svg viewBox="0 0 44 50" width="16" height="16" style="display: inline-block; vertical-align: middle; stroke: none;"><path style="fill: #2A6DCE;" d="M1.117,20.553l5.351,3.089c0.192,0.111,0.406,0.165,0.621,0.165c0.214,0,0.429-0.057,0.621-0.165l5.351-3.089 c0,0,0.015-0.012,0.022-0.017c0.081-0.049,0.158-0.108,0.227-0.175c0.01-0.01,0.02-0.022,0.03-0.032 c0.059-0.064,0.113-0.133,0.158-0.207c0.007-0.012,0.017-0.022,0.022-0.035c0.047-0.081,0.081-0.167,0.108-0.259 c0.005-0.02,0.01-0.039,0.015-0.059c0.022-0.094,0.039-0.19,0.039-0.291v-3.089c0-1.192,0.643-2.303,1.675-2.9s2.316-0.596,3.35,0 l2.675,1.545c0.086,0.049,0.177,0.084,0.271,0.111c0.02,0.005,0.04,0.012,0.059,0.017c0.091,0.022,0.185,0.035,0.278,0.037 c0.005,0,0.01,0,0.012,0c0.01,0,0.02-0.005,0.029-0.005c0.086,0,0.173-0.012,0.256-0.035c0.015-0.003,0.03-0.005,0.044-0.01 c0.091-0.025,0.18-0.062,0.264-0.108c0.007-0.005,0.017-0.005,0.025-0.01l5.351-3.089c0.384-0.222,0.621-0.631,0.621-1.074V4.69 c0-0.443-0.236-0.852-0.621-1.074l-5.356-3.087c-0.384-0.222-0.855-0.222-1.239,0l-5.351,3.089c0,0-0.015,0.012-0.022,0.017 c-0.081,0.049-0.158,0.108-0.227,0.175c-0.01,0.01-0.02,0.022-0.03,0.032c-0.059,0.064-0.113,0.133-0.158,0.207 c-0.007,0.012-0.017,0.022-0.022,0.034c-0.047,0.081-0.081,0.168-0.108,0.259c-0.005,0.02-0.01,0.039-0.015,0.059 c-0.022,0.094-0.039,0.19-0.039,0.291v3.089c0,1.192-0.643,2.303-1.675,2.902c-1.032,0.596-2.316,0.596-3.35,0L7.705,9.139 C7.618,9.09,7.527,9.055,7.434,9.028c-0.02-0.005-0.039-0.012-0.059-0.017C7.283,8.989,7.19,8.977,7.096,8.974 c-0.015,0-0.027,0-0.042,0c-0.089,0-0.175,0.012-0.259,0.034c-0.015,0.002-0.027,0.005-0.042,0.01 C6.663,9.043,6.574,9.08,6.49,9.127c-0.007,0.005-0.017,0.005-0.025,0.01l-5.348,3.092c-0.384,0.222-0.621,0.631-0.621,1.074v6.178 c0,0.444,0.236,0.852,0.621,1.074V20.553z"></path><path style="fill: #1DC19C;" d="M30.262,22.097c1.032-0.596,2.316-0.596,3.35,0l2.675,1.545c0.086,0.049,0.177,0.084,0.271,0.111 c0.02,0.005,0.039,0.012,0.059,0.017c0.091,0.022,0.185,0.034,0.278,0.037c0.005,0,0.01,0,0.012,0c0.01,0,0.02-0.003,0.029-0.005 c0.086,0,0.173-0.012,0.256-0.034c0.015-0.003,0.03-0.005,0.044-0.01c0.091-0.025,0.177-0.062,0.264-0.108 c0.007-0.005,0.017-0.005,0.027-0.01l5.351-3.089c0.384-0.222,0.621-0.631,0.621-1.074v-6.179c0-0.443-0.237-0.852-0.621-1.074 L37.53,9.134c-0.384-0.222-0.855-0.222-1.239,0l-5.351,3.089c0,0-0.015,0.012-0.022,0.017c-0.081,0.049-0.158,0.108-0.227,0.175 c-0.01,0.01-0.02,0.022-0.029,0.032c-0.059,0.064-0.113,0.133-0.158,0.207c-0.007,0.012-0.017,0.022-0.022,0.035 c-0.047,0.081-0.081,0.168-0.108,0.259c-0.005,0.02-0.01,0.039-0.015,0.059c-0.022,0.094-0.039,0.19-0.039,0.291v3.089 c0,1.192-0.643,2.303-1.675,2.902c-1.032,0.596-2.316,0.596-3.35,0l-2.675-1.545c-0.086-0.049-0.177-0.084-0.271-0.111 c-0.02-0.005-0.039-0.012-0.059-0.017c-0.091-0.022-0.185-0.035-0.278-0.037c-0.015,0-0.027,0-0.042,0 c-0.089,0-0.175,0.012-0.259,0.035c-0.015,0.003-0.027,0.005-0.042,0.01c-0.091,0.025-0.18,0.062-0.264,0.108 c-0.007,0.005-0.017,0.005-0.025,0.01l-5.351,3.089c-0.384,0.222-0.621,0.631-0.621,1.074v6.179c0,0.443,0.236,0.852,0.621,1.074 l5.351,3.089c0,0,0.017,0.005,0.025,0.01c0.084,0.047,0.173,0.084,0.264,0.108c0.015,0.005,0.03,0.005,0.044,0.01 c0.084,0.02,0.17,0.032,0.256,0.035c0.01,0,0.02,0.005,0.03,0.005c0.005,0,0.01,0,0.012,0c0.094,0,0.185-0.015,0.278-0.037 c0.02-0.005,0.039-0.01,0.059-0.017c0.094-0.027,0.185-0.062,0.271-0.111l2.675-1.545c1.032-0.596,2.316-0.596,3.35,0 c1.032,0.596,1.675,1.707,1.675,2.9v3.089c0,0.101,0.015,0.197,0.039,0.291c0.005,0.02,0.01,0.039,0.015,0.059 c0.027,0.091,0.061,0.177,0.108,0.259c0.007,0.012,0.015,0.022,0.022,0.034c0.044,0.074,0.099,0.143,0.158,0.207 c0.01,0.01,0.02,0.022,0.029,0.032c0.067,0.066,0.143,0.123,0.227,0.175c0.007,0.005,0.012,0.012,0.022,0.017l5.351,3.089 c0.192,0.111,0.407,0.165,0.621,0.165c0.214,0,0.429-0.057,0.621-0.165l5.351-3.089c0.384-0.222,0.621-0.631,0.621-1.074v-6.179 c0-0.443-0.236-0.852-0.621-1.074l-5.351-3.089c0,0-0.017-0.005-0.025-0.01c-0.084-0.047-0.173-0.084-0.264-0.108 c-0.015-0.005-0.027-0.005-0.042-0.01c-0.086-0.02-0.172-0.032-0.261-0.035c-0.012,0-0.027,0-0.039,0 c-0.094,0-0.187,0.015-0.278,0.037c-0.02,0.005-0.037,0.01-0.057,0.017c-0.094,0.027-0.185,0.062-0.271,0.111l-2.675,1.545 c-1.032,0.596-2.316,0.596-3.348,0c-1.032-0.596-1.675-1.707-1.675-2.902c0-1.195,0.643-2.303,1.675-2.9H30.262z"></path><path style="fill: #1796E2;" d="M27.967,38.054l-5.351-3.089c0,0-0.017-0.005-0.025-0.01c-0.084-0.047-0.172-0.084-0.264-0.108 c-0.015-0.005-0.03-0.005-0.044-0.01c-0.086-0.02-0.172-0.032-0.259-0.035c-0.015,0-0.027,0-0.042,0 c-0.094,0-0.187,0.015-0.278,0.037c-0.02,0.005-0.037,0.01-0.057,0.017c-0.094,0.027-0.185,0.062-0.271,0.111l-2.675,1.545 c-1.032,0.596-2.316,0.596-3.348,0c-1.032-0.596-1.675-1.707-1.675-2.902V30.52c0-0.101-0.015-0.197-0.039-0.291 c-0.005-0.02-0.01-0.039-0.015-0.059c-0.027-0.091-0.062-0.177-0.108-0.259c-0.007-0.012-0.015-0.022-0.022-0.035 c-0.044-0.074-0.099-0.143-0.158-0.207c-0.01-0.01-0.02-0.022-0.03-0.032c-0.066-0.066-0.143-0.123-0.227-0.175 c-0.007-0.005-0.012-0.012-0.022-0.017l-5.351-3.089c-0.384-0.222-0.855-0.222-1.239,0l-5.351,3.089 c-0.384,0.222-0.621,0.631-0.621,1.074v6.179c0,0.443,0.236,0.852,0.621,1.074l5.351,3.089c0,0,0.017,0.007,0.025,0.01 c0.084,0.047,0.17,0.084,0.261,0.108c0.015,0.005,0.03,0.007,0.044,0.01c0.084,0.02,0.17,0.032,0.256,0.035 c0.01,0,0.02,0.005,0.032,0.005c0.005,0,0.01,0,0.015,0c0.094,0,0.185-0.015,0.276-0.037c0.02-0.005,0.039-0.01,0.059-0.017 c0.094-0.027,0.185-0.062,0.271-0.111l2.675-1.545c1.032-0.596,2.316-0.596,3.35,0c1.032,0.596,1.675,1.707,1.675,2.9v3.089 c0,0.101,0.015,0.197,0.039,0.291c0.005,0.02,0.01,0.039,0.015,0.059c0.027,0.091,0.062,0.177,0.108,0.259 c0.007,0.012,0.015,0.022,0.022,0.035c0.044,0.074,0.099,0.143,0.158,0.207c0.01,0.01,0.02,0.022,0.03,0.032 c0.067,0.067,0.143,0.123,0.227,0.175c0.007,0.005,0.012,0.012,0.022,0.017l5.351,3.089c0.192,0.111,0.406,0.165,0.621,0.165 s0.429-0.057,0.621-0.165l5.351-3.089c0.384-0.222,0.621-0.631,0.621-1.074V39.13c0-0.443-0.236-0.852-0.621-1.074L27.967,38.054z"></path></svg>',
                        desc: 'Powered by Devin.ai'
                    },
                    {
                        name: 'gitingest.com',
                        url: 'https://gitingest.com',
                        icon: '<svg viewBox="0 0 100 100" width="16" height="16" style="display: inline-block; vertical-align: middle;"><path d="M50 10 C55 10 60 15 65 20 L80 35 C85 40 90 45 90 50 C90 55 85 60 80 65 L65 80 C60 85 55 90 50 90 C45 90 40 85 35 80 L20 65 C15 60 10 55 10 50 C10 45 15 40 20 35 L35 20 C40 15 45 10 50 10 Z" fill="#4ade80" stroke="none"/><circle cx="50" cy="50" r="15" fill="transparent" stroke="none"/></svg>',
                        desc: 'Code repository digest'
                    },
                    {
                        name: 'context7.com',
                        url: 'https://context7.com',
                        icon: '<svg width="16" height="16" viewBox="0 0 42 47" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;"><path d="M11.9415 26.599C11.9415 32.535 9.53346 37.491 5.61346 42.055H14.7415L14.7415 46.479H0.741455V42.279C5.02546 37.435 6.67746 33.487 6.67746 26.599L11.9415 26.599Z" fill="currentColor"/><path d="M30.0586 26.599C30.0586 32.535 32.4666 37.491 36.3866 42.055H27.2586V46.479H41.2586V42.279C36.9746 37.435 35.3226 33.487 35.3226 26.599H30.0586Z" fill="currentColor"/><path d="M11.9415 19.9576C11.9415 14.0216 9.53348 9.06564 5.61348 4.50164L14.7415 4.50164V0.077638L0.741486 0.0776367V4.27764C5.02549 9.12164 6.67748 13.0696 6.67748 19.9576L11.9415 19.9576Z" fill="currentColor"/><path d="M30.0586 19.9576C30.0586 14.0216 32.4667 9.06564 36.3867 4.50164L27.2586 4.50164L27.2587 0.0776382L41.2586 0.0776394V4.27764C36.9746 9.12164 35.3226 13.0696 35.3226 19.9576H30.0586Z" fill="currentColor"/></svg>',
                        desc: 'Powered by Context7'
                    },
                    {
                        name: 'gitpodcast.com',
                        url: 'https://www.gitpodcast.com',
                        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;"><circle cx="12" cy="12" r="10" fill="#ff6b6b" stroke="none"/><circle cx="12" cy="12" r="6" fill="none" stroke="white" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="white"/><path d="M8 8l8 8M16 8l-8 8" stroke="white" stroke-width="1" opacity="0.3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round"/></svg>',
                        desc: 'Convert repo to podcast'
                    },
                    {
                        name: 'gitdiagram.com',
                        url: 'https://gitdiagram.com',
                        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; vertical-align: middle;"><rect x="2" y="2" width="20" height="20" rx="2" fill="#6366f1" stroke="none"/><circle cx="7" cy="7" r="2" fill="white"/><circle cx="17" cy="7" r="2" fill="white"/><circle cx="7" cy="17" r="2" fill="white"/><circle cx="17" cy="17" r="2" fill="white"/><path d="M9 7h6M7 9v6M9 17h6M17 9v6" stroke="white" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12" r="1.5" fill="white"/></svg>',
                        desc: 'Quickly visualizing projects'
                    },
                    {
                        name: 'gitmcp.io',
                        url: 'https://gitmcp.io',
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#000000" fill="none" style="display: inline-block; vertical-align: middle;"><path d="M3.49994 11.7501L11.6717 3.57855C12.7762 2.47398 14.5672 2.47398 15.6717 3.57855C16.7762 4.68312 16.7762 6.47398 15.6717 7.57855M15.6717 7.57855L9.49994 13.7501M15.6717 7.57855C16.7762 6.47398 18.5672 6.47398 19.6717 7.57855C20.7762 8.68312 20.7762 10.474 19.6717 11.5785L12.7072 18.543C12.3167 18.9335 12.3167 19.5667 12.7072 19.9572L13.9999 21.2499" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.4999 9.74921L11.3282 15.921C10.2237 17.0255 8.43272 17.0255 7.32823 15.921C6.22373 14.8164 6.22373 13.0255 7.32823 11.921L13.4999 5.74939" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
                        desc: 'Remote MCP integration'
                    },
                    {
                        name: 'repomix.com',
                        url: 'https://repomix.com',
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="96.259 93.171 300 300" style="display: inline-block; vertical-align: middle;"><g transform="matrix(1.160932, 0, 0, 1.160932, 97.635941, 94.725143)"><path style="fill-rule: nonzero; fill-opacity: 1; stroke-width: 2; fill: rgb(234, 127, 58);" d="M 128.03 -1.486 L 21.879 65.349 L 21.848 190.25 L 127.979 256.927 L 234.2 190.27 L 234.197 65.463 L 128.03 -1.486 Z M 208.832 70.323 L 127.984 121.129 L 47.173 70.323 L 128.144 19.57 L 208.832 70.323 Z M 39.669 86.367 L 119.188 136.415 L 119.255 230.529 L 39.637 180.386 L 39.669 86.367 Z M 136.896 230.506 L 136.887 136.575 L 216.469 86.192 L 216.417 180.46 L 136.896 230.506 Z M 136.622 230.849"/></g></svg>',
                        desc: 'Pack repo into single file'
                    }
                ];

                options.forEach(option => {
                    const menuItem = document.createElement('a');
                    menuItem.href = '#';
                    menuItem.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">${option.icon}</span>
                                <div>
                                    <div style="font-weight: 500;">${option.name}</div>
                                    <div style="font-size: 11px; color: #656d76; margin-top: 2px;">${option.desc}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    menuItem.style.cssText = `
                        display: block;
                        padding: 12px 16px;
                        color: #24292f;
                        text-decoration: none;
                        border-bottom: 1px solid rgba(31,35,40,0.06);
                        font-size: 14px;
                        line-height: 20px;
                        transition: background-color 0.2s ease;
                    `;

                    menuItem.addEventListener('mouseenter', function () {
                        this.style.backgroundColor = '#f6f8fa';
                    });

                    menuItem.addEventListener('mouseleave', function () {
                        this.style.backgroundColor = 'transparent';
                    });

                    menuItem.addEventListener('click', function (e) {
                        e.preventDefault();
                        let targetUrl;
                        if (option.name === 'context7.com') {
                            // Context7 需要将用户名和仓库名转换为小写
                            targetUrl = `${option.url}/${user.toLowerCase()}/${repo.toLowerCase()}`;
                        } else if (option.name === 'repomix.com') {
                            // Repomix 使用查询参数格式
                            targetUrl = `${option.url}/?repo=https://github.com/${user}/${repo}`;
                        } else {
                            targetUrl = `${option.url}/${user}/${repo}`;
                        }
                        window.open(targetUrl, '_blank');
                        dropdown.style.display = 'none';
                    });

                    dropdown.appendChild(menuItem);
                });

                // 默认点击事件 (使用 zread.ai)
                mainBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    window.open(`https://zread.ai/${user}/${repo}`, '_blank');
                });

                // 下拉按钮点击事件
                dropdownBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const isVisible = dropdown.style.display === 'block';
                    dropdown.style.display = isVisible ? 'none' : 'block';
                });

                // 点击其他地方隐藏下拉菜单
                document.addEventListener('click', function (e) {
                    if (!btnGroup.contains(e.target)) {
                        dropdown.style.display = 'none';
                    }
                });

                // 按钮悬停效果
                [mainBtn, dropdownBtn].forEach(btn => {
                    btn.addEventListener('mouseenter', function () {
                        this.style.backgroundColor = '#f3f4f6';
                        this.style.borderColor = 'rgba(31,35,40,0.25)';
                    });

                    btn.addEventListener('mouseleave', function () {
                        this.style.backgroundColor = '#f6f8fa';
                        this.style.borderColor = 'rgba(31,35,40,0.15)';
                    });
                });

                // 组装元素
                btnGroup.appendChild(mainBtn);
                btnGroup.appendChild(dropdownBtn);
                btnGroup.appendChild(dropdown);
                btnGroup.style.position = 'relative';

                li.appendChild(btnGroup);
                targetContainer.appendChild(li);

                console.log('AI Code Analysis: Button group inserted into pagehead-actions!');
                return;
            }

            // 方法2: 查找 Star 按钮并找到其容器
            const starButtons = document.querySelectorAll('[aria-label*="Star"]');
            for (let starBtn of starButtons) {
                if (starBtn.textContent && starBtn.textContent.includes('Star')) {
                    targetContainer = starBtn.closest('div[class*="d-flex"], div[data-view-component="true"]');
                    if (targetContainer) break;
                }
            }

            // 方法3: 查找包含 "Fork" 文本的按钮
            if (!targetContainer) {
                const forkButtons = document.querySelectorAll('*');
                for (let element of forkButtons) {
                    if (element.textContent && element.textContent.trim() === 'Fork' && element.tagName === 'BUTTON') {
                        targetContainer = element.parentElement?.parentElement;
                        if (targetContainer) break;
                    }
                }
            }

            // 方法4: 查找包含 "Watch" 文本的按钮
            if (!targetContainer) {
                const watchButtons = document.querySelectorAll('*');
                for (let element of watchButtons) {
                    if (element.textContent && element.textContent.includes('Watch') && element.tagName === 'BUTTON') {
                        targetContainer = element.closest('div');
                        if (targetContainer && targetContainer.querySelector('[aria-label*="Star"]')) {
                            break;
                        }
                    }
                }
            }

            if (!targetContainer) {
                console.log('AI Code Analysis: Could not find target container');
                return;
            }

            console.log('AI Code Analysis: Found target container:', targetContainer);

            // 创建按钮（用于非 ul.pagehead-actions 容器）
            const btn = document.createElement('button');
            btn.id = 'zread-ai-btn-fallback';
            btn.type = 'button';
            btn.innerHTML = '🤖 AI Analysis';

            // 模拟 GitHub 按钮样式
            btn.style.cssText = `
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 5px 16px;
                font-size: 14px;
                font-weight: 600;
                line-height: 20px;
                white-space: nowrap;
                vertical-align: middle;
                cursor: pointer;
                user-select: none;
                border: 1px solid #0969da;
                border-radius: 6px;
                margin-left: 8px;
                background-color: #0969da;
                color: #ffffff;
                text-decoration: none;
                transition: 80ms cubic-bezier(0.65, 0, 0.35, 1);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
                box-shadow: 0 1px 0 rgba(31, 35, 40, 0.1);
            `;

            // 添加悬停效果
            btn.addEventListener('mouseenter', function () {
                this.style.backgroundColor = '#0860ca';
                this.style.borderColor = '#0860ca';
                this.style.transform = 'translateY(-1px)';
                this.style.boxShadow = '0 3px 6px rgba(9, 105, 218, 0.15)';
            });

            btn.addEventListener('mouseleave', function () {
                this.style.backgroundColor = '#0969da';
                this.style.borderColor = '#0969da';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 1px 0 rgba(31, 35, 40, 0.1)';
            });

            // 点击事件
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                window.open(`https://zread.ai/${user}/${repo}`, '_blank');
            });

            // 插入按钮
            targetContainer.appendChild(btn);

            console.log('AI Code Analysis: Fallback button inserted successfully!');

        } catch (error) {
            console.error('AI Code Analysis: Error inserting button:', error);
        }
    }

    // 使用更健壮的页面监听
    let lastUrl = location.href;

    // 页面变化监听
    const observer = new MutationObserver((mutations) => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            console.log('AI Code Analysis: URL changed to:', currentUrl);
            setTimeout(insertButton, 1500);
        }

        // 检查是否有新的按钮容器出现
        for (let mutation of mutations) {
            if (mutation.addedNodes) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.querySelector && node.querySelector('[aria-label*="Star"]'))) {
                        setTimeout(insertButton, 500);
                        break;
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
    });

    // 多次尝试初始化
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(insertButton, 1000);
    });

    setTimeout(insertButton, 1000);
    setTimeout(insertButton, 2000);
    setTimeout(insertButton, 3000);

    // 如果页面已经加载完成
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(insertButton, 500);
    }

})();
