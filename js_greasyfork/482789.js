// ==UserScript==
// @name         福利吧 Lite
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  移除福利吧主站网页的多余元素。
// @author       L
// @match        https://fulibus.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fuliba.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482789/%E7%A6%8F%E5%88%A9%E5%90%A7%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/482789/%E7%A6%8F%E5%88%A9%E5%90%A7%20Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 删除TopBar
    var topbar = document.querySelector('.topbar');
    if (topbar) {
        topbar.parentNode.removeChild(topbar);
    }
    var header = document.querySelector('.header');
    if (header) {
        header.style.padding = '20px 0';
    }

    // 删除breadcrumbs
    var breadcrumbs = document.querySelector('.breadcrumbs');
    if (breadcrumbs) {
        breadcrumbs.parentNode.removeChild(breadcrumbs);
    }

    // 删除branding
    var branding = document.querySelector('.branding');
    if (branding) {
        branding.parentNode.removeChild(branding);
    }

    // 删除karbar
    var karbar = document.querySelector('.karbar');
    if (karbar) {
        karbar.parentNode.removeChild(karbar);
    }

    // 删除头部横幅
    var focusslide = document.querySelector('#focusslide');
    if (focusslide) {
        focusslide.parentNode.removeChild(focusslide);
    }

    // 删除右侧SideBar
    var sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.parentNode.removeChild(sidebar);
    }
    var content = document.querySelector('.content');
    if (content) {
        content.style.marginRight = '0';
    }

    // 简化导航
    var ulElement = document.querySelector('ul.site-nav.site-navbar');
    if (ulElement) {
        var liElements = ulElement.querySelectorAll('li');
        liElements.forEach(function(li) {
            if (!li.textContent.includes('福')) {
                li.parentNode.removeChild(li);
            }
        });
    }

    // 删除文章中的推广内容（依据点赞>100判断）
    if (content) {
        var articles = content.querySelectorAll('article');
        articles.forEach(function(article) {
            var span = article.querySelector('.post-like span');
            if (span) {
                var spanValue = span.textContent;
                if (spanValue && parseInt(spanValue) > 100) {
                    article.parentNode.removeChild(article);
                }
            }
        });
    }

    // 删除传送门
    var portal = document.querySelector('.title.excerpts-title .more');
    if (portal) {
        portal.parentNode.removeChild(portal);
    }

    // 删除版权信息
    var copyright = document.querySelector('.post-copyright');
    if (copyright) {
        copyright.parentNode.removeChild(copyright);
    }

    // 删除分享
    var shares = document.querySelector('.shares');
    if (shares) {
        shares.parentNode.removeChild(shares);
    }

    // 删除赞赏
    var rewards = document.querySelector('.action.action-rewards');
    if (rewards) {
        rewards.parentNode.removeChild(rewards);
    }
})();