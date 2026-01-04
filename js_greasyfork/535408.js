// ==UserScript==
// @name         Grab4K
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  跳转下载与自动登录. v1.1:更新url.
// @author       houq
// @match        *://*.grab4k.com/down/*
// @match        http://aliang.s.odn.cc/@login*
// @icon         https://grab4k.com/mxstatic/image/logo.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535408/Grab4K.user.js
// @updateURL https://update.greasyfork.org/scripts/535408/Grab4K.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待收藏按钮加载
    function waitForCollectButton(callback) {
        const collectButton = document.querySelector('.mac_ulog.btn-large.btn-collect:not(.video-info-play)');
        if (collectButton) {
            callback(collectButton);
            return;
        }
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                const newButton = mutation.addedNodes.find(node =>
                    node instanceof Element && node.matches('.mac_ulog.btn-large.btn-collect')
                );
                if (newButton) {
                    callback(newButton);
                    observer.disconnect();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 获取影片分类类型
    function getMovieType() {
        const targetTypes = ['动画', '剧集', '纪录片', '演唱会'];
        const tagElement = document.querySelector('.tag-link .video-tag-icon .video-tag-icon');
        if (tagElement) {
            const tagText = tagElement.textContent.trim();
            if (targetTypes.includes(tagText)) {
                return tagText;
            }
        }
        return '电影';
    }

    // 生成目标URL
    function generateTargetUrl() {
        const url = "http://guangying.s.odn.cc";

        const movieId = window.location.pathname.match(/down\/(\d+)/)?.[1];
        const movieName = document.querySelector('.page-title').textContent.trim();
        const doubanId = document.querySelector('a[href*="douban.com/subject/"]')?.href.match(/subject\/(\d+)/)?.[1];
        const movieType = getMovieType();

        // 仅检查 movieId 和 movieName 是否存在
        if (!movieId || !movieName) return '';

        // 替换特殊字符（如有需要）
        const safeName = movieName.replace(/[()]/g, '');

        // 根据豆瓣 ID 是否存在生成不同的 URL
        if (doubanId) {
            return `${url}/${movieType}/${movieId}.${safeName}(${doubanId}).md`;
        } else {
            return `${url}/${movieType}/${movieId}.${safeName}.md`;
        }
    }

    // 创建下载按钮
    function createDownloadButton(collectButton) {
        const targetUrl = generateTargetUrl();
        if (!targetUrl) return;

        const downloadButton = document.createElement('a');
        downloadButton.className = 'btn-aux btn-aux-o btn-large gotodownloadlist'; // 沿用现有按钮样式
        downloadButton.href = targetUrl;
        downloadButton.target = '_blank';
        downloadButton.rel = 'noopener noreferrer';
        downloadButton.innerHTML = '<i class="icon-download"></i><strong>下载</strong>'; // 使用现有下载图标

        // 在收藏按钮后插入
        collectButton.parentNode.insertBefore(downloadButton, collectButton.nextSibling);
    }

    // 执行主逻辑
    waitForCollectButton(collectButton => {
        createDownloadButton(collectButton);
    });
})();