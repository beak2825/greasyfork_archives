// ==UserScript==
// @name         自动搜索助手
// @author       icexmoon@qq.com
// @namespace    cn.icexmoon.js
// @license      MIT
// @description  配合 douban=helper 实现自动展示搜索结果 
// @version      1.0.3
// @match        https://www.yingshicang.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537388/%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/537388/%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

function getWdParam(url) {
    const queryString = url.split('?')[1] || '';
    const params = queryString.split('&');

    for (const param of params) {
        const [key, value] = param.split('=');
        if (key === 'auto_search_key') {
            return decodeURIComponent(value || '');
        }
    }
    return null; // 未找到时返回 null
}

function goSearch(keyword) {
    // console.log("执行匿名函数", keyword)
    // 定位搜索输入框和表单
    const searchInput = document.querySelector('input[class="search-input"]');
    const searchForm = document.querySelector('form[action="/vodsearch/-------------/"]');

    if (searchInput && searchForm) {
        searchInput.value = keyword;
        searchForm.submit(); // 自动提交表单
    }
}

(function () {
    'use strict';
    // 目标关键词（从第三方网站传递）
    // const urlParams = new URLSearchParams(window.location.search);
    // console.log(window.location.href);
    const keyword = getWdParam(window.location.href);
    // console.log(urlParams)
    // console.log(keyword)
    if (keyword) {
        // 等待页面加载完成
        window.addEventListener('load', function () {
            // 等待 10 毫秒
            setTimeout((kw) => {
                // console.log("匿名函数获取到keyword", kw)
                goSearch(kw)
            }, 100, keyword);
        });
    }

})();