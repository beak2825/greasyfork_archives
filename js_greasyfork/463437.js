// ==UserScript==
// @name         Google site search on IThome
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将IT之家搜索替换为谷歌site语法搜索
// @author       entr0pia, AI
// @match        https://www.ithome.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463437/Google%20site%20search%20on%20IThome.user.js
// @updateURL https://update.greasyfork.org/scripts/463437/Google%20site%20search%20on%20IThome.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待 DOM 加载
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(() => {
        const input = document.querySelector('.search input[name="q"]');
        const button = document.querySelector('.search button[name="sa"]');

        if (!input || !button) return;

        // 执行 Google 搜索
        function goSearch() {
            const keyword = input.value.trim();
            if (keyword.length === 0) return;

            const url = `https://www.google.com/search?q=${encodeURIComponent("site:ithome.com "+keyword)}`;
            window.location.href = url;
        }

        // 点击按钮触发
        button.addEventListener('click', goSearch);

        // 输入框按回车触发
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                goSearch();
            }
        });
    });
})();
