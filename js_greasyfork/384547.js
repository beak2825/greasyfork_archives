// ==UserScript==
// @name         让微博按正确的时间线排序
// @namespace    https://hehome.xyz/
// @version      0.2.6
// @icon         https://weibo.com/favicon.ico
// @description  自动切换到最新微博，恢复正确的时间线
// @author       hemengyang
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384547/%E8%AE%A9%E5%BE%AE%E5%8D%9A%E6%8C%89%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%97%B6%E9%97%B4%E7%BA%BF%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/384547/%E8%AE%A9%E5%BE%AE%E5%8D%9A%E6%8C%89%E6%AD%A3%E7%A1%AE%E7%9A%84%E6%97%B6%E9%97%B4%E7%BA%BF%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 判断是否是新版微博
    var isNewVersion = document.querySelector('a.gn_name') === null;

    if (isNewVersion) {
        // 新版微博
        // 切换到最新微博
        function switchToLatest() {
            // 侧边栏的最新微博按钮
            var latestButton = document.querySelector('div[title="最新微博"]');
            if (latestButton === null) {
                // 无法找到最新微博的按钮，且不在主页时，
                // 会尝试重新加载网页
                if (window.location.pathname !== '/') {
                    window.location = '/';
                }
            } else {
                latestButton.click();
            }
        }
        // 首页按钮
        var homeButton = document.querySelector('div[aria-label="首页"]');
        if (homeButton !== null) {
            // 通过 div[aria-label="首页"] 获取元素的父元素也能单击回到全部关注
            // 需要替换那个元素，否则单击主页按钮边缘会回到全部关注而不是最新微博
            homeButton = homeButton.parentElement
            // 替换首页按钮点击事件
            homeButton.addEventListener('click', (e) => { switchToLatest(); e.stopPropagation(); e.preventDefault(); }, true);
        }
        // 左上角的图标
        var homeIcon = document.querySelector('a[aria-label="Weibo"]');
        if (homeIcon !== null) {
            // 替换左上角的微博图标点击事件
            homeIcon.addEventListener('click', (e) => { switchToLatest(); e.stopPropagation(); e.preventDefault(); }, true);
        }
        // 每隔 500 毫秒检查一下
        // 如果在微博主页自动切换到最新微博
        var switchInterval = setInterval(function () {
            if (window.location.pathname === '/') {
                switchToLatest();
            } else {
                clearInterval(switchInterval);
            }
        }, 500);
    }
    else {
        // 老版微博
        var userId = document.querySelector('a.gn_name').href.split('/')[3];
        var isHome = window.location.pathname.split('/')[3] === 'home';
        var isNew = window.location.search.indexOf('is_new') !== -1;
        // 自动切换到最新微博
        if (isHome && !isNew) {
            window.location = '/home?is_new=1';
        }
        // 替换左上角的微博图标点击后网址为最新微博
        document.querySelector('a.box').setAttribute('href', '/u/' + userId + '/home?is_new=1');
    }
})();
