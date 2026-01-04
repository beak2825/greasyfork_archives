// ==UserScript==
// @name         GitHub汉化、国际化插件
// @namespace    github-hans
// @version      1
// @description  将GitHub界面汉化
// @author       wll
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462681/GitHub%E6%B1%89%E5%8C%96%E3%80%81%E5%9B%BD%E9%99%85%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/462681/GitHub%E6%B1%89%E5%8C%96%E3%80%81%E5%9B%BD%E9%99%85%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 将页面中的英文文本替换为中文文本
    const translations = {
        // 例如：'English Text': '中文文本',
        'Code': '代码',
        'Issues': '问题',
        'Pull requests': '拉取请求',
        'Actions': '操作',
        'Projects': '项目',
        'Wiki': '维基',
        'Security': '安全',
        'Insights': '洞察',
        'Settings': '设置',
        'Pull request successfully merged and closed': '拉取请求已成功合并并关闭',
        'New pull request': '新拉取请求',
        'Create pull request': '创建拉取请求',
        'Create a new pull request by comparing changes across two branches.': '通过比较两个分支之间的更改来创建新的拉取请求。',
        'Compare & pull request': '比较和拉取请求',
        'Open issues': '打开问题',
        'Your repositories': '您的存储库',
        'Your profile': '您的个人资料',
        'Your stars': '您的收藏',
        'Your gists': '您的代码片段',
        'Sign out': '退出',
        'Search GitHub': '搜索GitHub',
        'This repository': '此存储库',
        'Pull requests': '拉取请求',
        'Pull requests': '拉取请求',
        'Issues': '问题',
        'Marketplace': '市场',
        'Explore': '探索',
        'Code review': '代码审查',
        'Project management': '项目管理',
        'Integrations': '集成',
        'Actions': '操作',
        'Packages': '包',
        'Security': '安全',
        'Code hosting': '代码托管',
        'Customer stories': '客户故事',
        'Team': '团队',
        'Enterprise': '企业',
        'Blog': '博客',
        'About': '关于',
        'Shop': '商店',
        'Contact GitHub': '联系GitHub',
        'API': 'API',
        'Training': '培训',
        'Blog': '博客',
        'About': '关于',
    };
    // 将页面中的英文文本替换为中文文本
    for (const key in translations) {
        const elements = document.querySelectorAll(`[aria-label="${key}"], [title="${key}"], [placeholder="${key}"], [data-content="${key}"], [data-original-title="${key}"], [aria-describedby="${key}"]`);
        elements.forEach(element => {
            element.innerHTML = element.innerHTML.replace(key, translations[key]);
        });
    }


})();
