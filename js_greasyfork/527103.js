// ==UserScript==
// @name         豆瓣电影 YTS 之间快捷跳转
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  更新网址为yts.lt
// @author       DeepSeek
// @match        https://movie.douban.com/subject/*
// @match        https://yts.lt/movies/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527103/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20YTS%20%E4%B9%8B%E9%97%B4%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/527103/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20YTS%20%E4%B9%8B%E9%97%B4%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
        a.douban-yts-link {
            color: inherit !important;
            text-decoration: none !important;
            background: none !important;
            cursor: pointer !important;
        }
    `;
    document.head.appendChild(style);

    // 豆瓣电影处理函数
    const processDouban = () => {
        const imdbLink = document.querySelector('a[href*="imdb.com/title/tt"]');
        if (!imdbLink) return;

        try {
            // 提取IMDb ID
            const imdbId = imdbLink.href.match(/tt\d+/)[0];
            const ytsUrl = `https://yts.lt/browse-movies/${imdbId}/all/all/0/featured/0/all`;
            
            // 处理所有标题元素（适配多语言标题情况）
            document.querySelectorAll('h1 span').forEach(titleElement => {
                if (!titleElement.querySelector('a')) {
                    titleElement.innerHTML = `<a class="douban-yts-link" href="${ytsUrl}" target="_blank">${titleElement.textContent}</a>`;
                }
            });
        } catch (e) {
            console.log('[YTS跳转脚本] IMDB ID提取失败:', e);
        }
    };

    // YTS电影处理函数
    const processYTS = () => {
        const titleElement = document.querySelector('.hidden-xs h1, .info-content h1');
        if (!titleElement) return;

        try {
            // 清洗标题
            const rawTitle = titleElement.textContent;
            const cleanTitle = rawTitle
                .replace(/\s*$\d{4}$$/, '')  // 移除年份
                .trim()                        // 去除首尾空格
                .replace(/\s+/g, ' ');         // 合并连续空格

            // 编码处理
            const encodedTitle = encodeURIComponent(cleanTitle)
                .replace(/[!'()*~]/g, match => 
                    `%${match.charCodeAt(0).toString(16).toUpperCase()}`
                );

            // 构建豆瓣搜索链接
            const doubanUrl = `https://search.douban.com/movie/subject_search?search_text=${encodedTitle}&cat=1002`;
            
            // 精准替换原始标题
            titleElement.innerHTML = titleElement.innerHTML.replace(
                rawTitle, 
                `<a class="douban-yts-link" href="${doubanUrl}" target="_blank">${cleanTitle}</a>`
            );
        } catch (e) {
            console.log('[豆瓣跳转脚本] 标题处理失败:', e);
        }
    };

    // 页面路由
    if (location.host.includes('douban.com')) {
        // 豆瓣页面延迟1秒执行（等待IMDb链接加载）
        setTimeout(processDouban, 1000);
    } else if (location.host.includes('yts.lt')) {
        // YTS页面立即执行
        processYTS();
    }
})();