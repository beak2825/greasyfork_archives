// ==UserScript==
// @name         聚合搜索（神楽版）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  整合大部分网页搜索，提高搜索效率
// @author       神楽
// @license     MIT

// @match        *://www.google.com/search*
// @match        *://www.baidu.com/s*
// @match        *://*.bing.com/search*
// @match        *://*.sogou.com/*
// @match        *://*.so.com/s*

// @downloadURL https://update.greasyfork.org/scripts/545276/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%EF%BC%88%E7%A5%9E%E6%A5%BD%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545276/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%EF%BC%88%E7%A5%9E%E6%A5%BD%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

// @require      file:///Users/hina/workspace/www.farthe.com/code/chrome/search/index.js

// 搜索网址配置
const urlMapping = [
    {
        name: 'Google',
        searchUrl: 'https://www.google.com/search?q=',
        keyName: 'q',
        testUrl: /https:\/\/www.google.com\/search.*/,
    },
    {
        name: '百度',
        searchUrl: 'https://www.baidu.com/s?wd=',
        keyName: 'wd',
        testUrl: /https:\/\/www\.baidu\.com\/s.*/,
    },
    {
        name: '必应',
        searchUrl: 'https://www.bing.com/search?q=',
        keyName: 'q',
        testUrl: /https:\/\/www\.bing\.com\/search.*/,
    },
    {
        name: '搜狗',
        searchUrl: 'https://www.sogou.com/web?query=',
        keyName: 'query',
        testUrl: /https:\/\/www\.sogou\.com\/.*/,
    },
    {
        name: '360',
        searchUrl: 'https://www.so.com/s?q=',
        keyName: 'q',
        testUrl: /https:\/\/www\.so\.com\/s.*/,
    }
];

// JS获取url参数
function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let pairs = query.split("&");
    for (let pair of pairs) {
        let [key, value] = pair.split("=");
        if (key == variable) {
            return decodeURIComponent(value);
        }
    }
    return null;
};

// 从url中获取搜索关键词
function getKeywords() {
    let keywords = '';

    for (let item of urlMapping) {
        if (item.testUrl.test(window.location.href)) {
            keywords = getQueryVariable(item.keyName);
            break
        }
    }
    if (!keywords) {
        for (let item of urlMapping) {
            let input = document.querySelector('input[name="' + item.keyName + '"]');
            if (input && input.value) {
                keywords = input.value.trim();
                break;
            }
        }
    }
    console.log(keywords);
    return keywords;
};

function addBox() {
    var div = document.createElement('div')
    div.id = 'search-app-box'
    div.style = `
        position: fixed;
        top: 120px;
        left: 20px;
        width: 80px;
        font-size: 12px;
        z-index: 99999;
        border-radius: 6px;
        padding-bottom: 6px;
        transition: background-color 0.3s, color 0.3s;
    `
    document.body.insertAdjacentElement("afterBegin", div);

    // 根据主题切换颜色
    function applyTheme(e) {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        div.style.backgroundColor = isDark ? '#333333' : '#EEEEEE';
        div.style.color = isDark ? '#FFFFFF' : '#000000';
        document.querySelectorAll('#search-app-box a').forEach(a => {
            a.style.color = isDark ? '#FFFFFF' : '#333333';
        });
    }

    // 标题
    let title = document.createElement('span')
    title.innerText = "聚合搜索"
    title.style = `
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    margin-top: 10px;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: bold;
`;
    div.appendChild(title)

    // 搜索列表
    for (let index in urlMapping) {
        let item = urlMapping[index];
        let a = document.createElement('a')
        a.href = 'javascript:;'
        a.innerText = item.name
        a.style.display = "block";
        a.style.padding = "10px 0 10px 20px";
        a.style.textDecoration = "none";

        a.onmouseenter = function () {
            this.style.backgroundColor = '#bbbbbb';
        }
        a.onmouseleave = function () {
            this.style.backgroundColor = 'transparent';
        }
        a.onclick = function () {
            window.location.href = item.searchUrl + getKeywords();
        }
        div.appendChild(a)
    }

    // 初次应用主题
    applyTheme();

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
};

(function () {
    'use strict';
    addBox();
})();