// ==UserScript==
// @name         为豆瓣导航条和个人页面添加游戏链接
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       samsu
// @license      MIT
// @description  为豆瓣导航条和个人页面添加游戏链接。
// @match        http://www.douban.com/*
// @match        http://*.douban.com/*
// @match        https://www.douban.com/*
// @match        https://*.douban.com/*
// @icon         https://img1.doubanio.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525314/%E4%B8%BA%E8%B1%86%E7%93%A3%E5%AF%BC%E8%88%AA%E6%9D%A1%E5%92%8C%E4%B8%AA%E4%BA%BA%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E6%B8%B8%E6%88%8F%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/525314/%E4%B8%BA%E8%B1%86%E7%93%A3%E5%AF%BC%E8%88%AA%E6%9D%A1%E5%92%8C%E4%B8%AA%E4%BA%BA%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E6%B8%B8%E6%88%8F%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var newItem = document.createElement('li');
        var newLink = document.createElement('a');
        newLink.href = 'https://www.douban.com/game/explore';
        newLink.target = '_blank';
        newLink.innerHTML = '游戏';
        newItem.appendChild(newLink);
        var navbar = document.querySelector('.global-nav-items > ul');
        if (navbar) {
            var musicItem = navbar.querySelector('li:nth-child(4)');
            if (musicItem) {
                musicItem.insertAdjacentElement('afterend', newItem);
            }
        }

        var personalInfoNavbar = document.querySelector('.info > ul');
        if (personalInfoNavbar) {
            var gameItem = document.createElement('li');
            gameItem.className = 'content-menu-item';
            var userHomePageUrl = window.location.href.split('/').slice(0, 5).join('/') + '/';
            var gamesUrl = userHomePageUrl + 'games';
            gameItem.innerHTML = `<a href="${gamesUrl}">游戏</a>`;
            personalInfoNavbar.appendChild(gameItem); // 将新项添加到个人信息导航条
        }
    });
})();