// ==UserScript==
// @name         B站订阅页面自动筛选"在看"番剧和电影(已失效)
// @namespace    https://github.com/dyxcloud
// @version      0.2
// @description  订阅页面的筛选自动选择"在看", 在"追番"和"追剧"两个页面生效
// @author       dyxLike
// @match        https://space.bilibili.com/*/bangumi*
// @match        https://space.bilibili.com/*/cinema*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424923/B%E7%AB%99%E8%AE%A2%E9%98%85%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E7%AD%9B%E9%80%89%22%E5%9C%A8%E7%9C%8B%22%E7%95%AA%E5%89%A7%E5%92%8C%E7%94%B5%E5%BD%B1%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424923/B%E7%AB%99%E8%AE%A2%E9%98%85%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E7%AD%9B%E9%80%89%22%E5%9C%A8%E7%9C%8B%22%E7%95%AA%E5%89%A7%E5%92%8C%E7%94%B5%E5%BD%B1%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function watchingFilter() {
        let span = document.querySelector('.cur-filter');
        let lis = document.querySelectorAll('.be-dropdown-menu.menu-align-left>li');
        if (lis) {
            lis[2].click();
            span.click();
        }
    }

    let currentId;

    window.onload = function () {
        watchingFilter();
        document.querySelector('.s-space').addEventListener('DOMSubtreeModified', function () {
            //判断是否切换了sheet
            let newId = document.querySelector('.s-space>div>div').id;
            if (currentId === newId) {
                return;
            }
            currentId = newId;
            watchingFilter();
        }, false);
    };

})();
