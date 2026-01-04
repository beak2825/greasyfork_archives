// ==UserScript==
// @name         Path of Exile Trade Auto Loader (Load More Fix)
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Automatically load all results on Path of Exile trade site by clicking the "Load More" button dynamically.
// @author       YourName
// @match        https://www.pathofexile.com/trade2/search/*
// @grant        none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/521363/Path%20of%20Exile%20Trade%20Auto%20Loader%20%28Load%20More%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521363/Path%20of%20Exile%20Trade%20Auto%20Loader%20%28Load%20More%20Fix%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isLoading = false;

    function loadAllItems() {
        if (isLoading) return; // 防止多次调用
        isLoading = true;

        // 滚动到底部
        console.log("正在滚动到页面底部...");
        window.scrollTo(0, document.body.scrollHeight);

        setTimeout(() => {
            const loadMoreButton = document.querySelector('.btn.load-more-btn'); // 修订选择器
            if (loadMoreButton) {
                console.log("发现 '加载更多' 按钮，尝试点击...");
                loadMoreButton.click(); // 点击按钮以加载更多内容

                setTimeout(() => {
                    console.log("按钮点击后，继续检查加载状态...");
                    isLoading = false;
                    loadAllItems(); // 递归调用以加载更多
                }, 800); // 按钮点击后等待内容加载完成
            } else {
                console.log("未发现 '加载更多' 按钮，检查页面高度变化...");
                const previousHeight = document.body.scrollHeight;

                setTimeout(() => {
                    const currentHeight = document.body.scrollHeight;
                    if (currentHeight > previousHeight) {
                        console.log("页面高度增加，继续加载...");
                        isLoading = false;
                        loadAllItems();
                    } else {
                        console.log("所有内容已加载完成！");
                    }
                }, 1000); // 等待页面高度变化
            }
        }, 500); // 滚动后稍作延迟
    }

    // 启动脚本
    window.onload = function () {
        console.log("脚本已启动，开始加载所有内容...");
        setTimeout(loadAllItems, 1000); // 页面加载后等待 1 秒启动
    };
})();
