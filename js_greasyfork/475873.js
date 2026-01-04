// ==UserScript==
// @name         隐藏Bilibili热搜推荐
// @namespace    https://github.com/zhangkaixuan98/
// @version      1.0
// @description  Hide Bilibili Hot Search
// @description:zh-cn  隐藏Bilibili热搜推荐
// @author       zkx、ChatGPT
// @homepageURL  https://github.com/zhangkaixuan98/Hide_Bilibili_Hot_Search/
// @match        https://www.bilibili.com/*
// @license MIT
// @grant        none
// @connect      zhangkaixuan98.github.io
// @connect      raw.gitmirror.com
// @connect      raw.githubusercontents.com
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/475873/%E9%9A%90%E8%97%8FBilibili%E7%83%AD%E6%90%9C%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/475873/%E9%9A%90%E8%97%8FBilibili%E7%83%AD%E6%90%9C%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('持续检测Bilibili搜索框预填充文字更改');

    // 等待搜索框输入框出现的最大尝试次数
    var maxAttempts = 30; // maxAttempts次 每次等待0.1秒
    var currentAttempt = 0;
    var newPlaceholderText = "没有不进步的人生，只有不进取的人！"; // 你的新的预填充文字

    // 定义函数来检查搜索框是否出现
    function checkForSearchInput() {
        var searchInput = document.querySelector('.nav-search-input');
        if (searchInput) {
            // 在这里设置你想要的新的预填充文字
            // 定义MutationObserver回调函数
            var observer = new MutationObserver(function(mutationsList, observer) {
                // 检查输入框的值是否等于newPlaceholderText
                if (searchInput.placeholder === newPlaceholderText) {
                    console.log('输入框的值与预填充文字相同：' + newPlaceholderText);
                    // 在这里执行你的自定义操作，比如触发一个事件或者执行其他的逻辑
                } else {
                    // 等待5秒后执行其他操作
                    console.log('预填充文字为：' + searchInput.placeholder + '已更改为：' + newPlaceholderText);

                    // 在这里执行你的自定义操作，比如触发一个事件或者执行其他的逻辑
                    searchInput.placeholder = newPlaceholderText;
                }
            });
            // 搜索框输入框已经出现
            console.log("搜索框输入框已出现" + searchInput.placeholder);
            searchInput.placeholder = newPlaceholderText;
            observer.observe(searchInput, { attributes: true, attributeFilter: ['placeholder'] });
            // 所以，为了避免不必要的监视，你可以在检查到searchPanel已经存在且监视器已经设置后，取消对searchPanel元素的进一步监视。可以在这样做之后添加一个return语句来退出函数
            return;
        } else {
            currentAttempt++;
            if (currentAttempt < maxAttempts) {
                // 继续等待，每1秒检查一次
                setTimeout(checkForSearchInput, 100);
            } else {
                console.log("已达到最大尝试次数，搜索框输入框未出现");
            }
        }
    }

    // 开始检查搜索框是否出现
    checkForSearchInput();
})();

(function() {
    'use strict';
    console.log('Hide the search panel on Bilibili.com when it becomes visible');

    // 等待搜索框输入框出现的最大尝试次数
    var maxAttempts = 30; // maxAttempts次 每次等待0.1秒
    var currentAttempt = 0;

    // 定义函数来检查搜索框是否出现
    function checkForSearchBar() {
        const searchPanel = document.querySelector('.search-panel');
        const navSearchForm = document.querySelector('form#nav-searchform');
        if (searchPanel) {
            // 创建一个 MutationObserver 实例来监视 display 属性的变化
            const observerSearchPanel = new MutationObserver((mutationsList, observer) => {
                mutationsList.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        // 如果元素隐藏了，将其隐藏
                        searchPanel.style.display = 'none';
                    }
                });
            });
            const observerSearchForm = new MutationObserver((mutationsList, observer) => {
                mutationsList.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                            // 设置border-radius为8px
                            navSearchForm.style.borderRadius = '8px';
                    }
                });
            });

            // 开始监视 searchPanel 的属性变化
            if (searchPanel) {
                searchPanel.style.display = 'none';
                if (!navSearchForm.hasAttribute('style')) {
                    navSearchForm.setAttribute('style', '');
                }
                navSearchForm.style.borderRadius = '8px';
                observerSearchPanel.observe(searchPanel, { attributes: true, attributeFilter: ['style']});

                // 搜索框输入框边框
                observerSearchForm.observe(navSearchForm, { attributes: true, attributeFilter: ['style'] });
            }
        } else {
            currentAttempt++;
            if (currentAttempt < maxAttempts) {
                // 继续等待，每0.1秒检查一次
                setTimeout(checkForSearchBar, 100);
            } else {
                console.log("已达到最大尝试次数，搜索框热搜未出现");
            }
        }
    }

    // 开始检查搜索框是否出现
    checkForSearchBar();
})();
