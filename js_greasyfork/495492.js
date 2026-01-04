// ==UserScript==
// @name         dlsite-hide-favorite
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  隐藏DLsite列表上的收藏项目
// @author       crudBoy
// @match        https://*.dlsite.com/*
// @icon         https://www.dlsite.com/images/web/common/logo/pc/logo-dlsite.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495492/dlsite-hide-favorite.user.js
// @updateURL https://update.greasyfork.org/scripts/495492/dlsite-hide-favorite.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("脚本启动");

    // 等待网页完成加载
    window.addEventListener('load', function () {
        console.log("网页加载完成");
        hideFavorite();
        observeMutations();

        console.log("脚本运行完成");
    }, false);

    // 隐藏收藏项目的函数
    function hideFavorite() {
        console.log("执行hideFavorite");
        // 纵向列表
        let trs = document.querySelectorAll("#search_result_list > table.work_1col_table.n_worklist > tbody > tr");
        for (let i = 0; i < trs.length; i++) {
            let tr = trs[i];
            let length = tr.getElementsByClassName("btn_favorite_in").length;
            if (length > 0) {
                tr.remove();
            }
        }

        // 流式布局
        let lis = document.querySelectorAll("#search_result_img_box > li");
        for (let i = 0; i < lis.length; i++) {
            let li = lis[i];
            let length = li.getElementsByClassName("btn_favorite_in").length;
            if (length > 0) {
                li.remove();
            }
        }
    }

    // 监视DOM变化的函数
    function observeMutations() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        let debounceTimeout;

        const callback = function(mutationsList, observer) {
            console.log('检测到DOM变化');
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(function() {
                console.log("延迟1秒后执行hideFavorite");
                hideFavorite();
            }, 1000);
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
})();
