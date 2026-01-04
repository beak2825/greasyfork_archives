// ==UserScript==
// @name         IMDb 海报悬停预览 (最终版)
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  增加“无预览图”提示。通用ID补零，自动将5位、6位等不足7位的ID补全。精准移除父级span的title提示，并显示电影海报。
// @author       Orange7
// @author       满洲里有鹅
// @match        https://springsunday.net/torrents.php*
// @connect      omdbapi.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544176/IMDb%20%E6%B5%B7%E6%8A%A5%E6%82%AC%E5%81%9C%E9%A2%84%E8%A7%88%20%28%E6%9C%80%E7%BB%88%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544176/IMDb%20%E6%B5%B7%E6%8A%A5%E6%82%AC%E5%81%9C%E9%A2%84%E8%A7%88%20%28%E6%9C%80%E7%BB%88%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const API_KEY = '';
    const POPUP_MAX_WIDTH = 300;
    const CURSOR_OFFSET = 15

    // --- 缓存 ---
    const posterCache = new Map();

    // --- 浮动框元素 ---
    let popup = null;

    function createPopup() {
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'imdb-poster-popup';
            document.body.appendChild(popup);
            popup.style.position = 'absolute';
            popup.style.zIndex = '99999';
            popup.style.border = '2px solid #ccc';
            popup.style.borderRadius = '5px';
            popup.style.boxShadow = '3px 3px 10px rgba(0,0,0,0.5)';
            popup.style.padding = '0';
            popup.style.backgroundColor = '#333';
            popup.style.fontSize = '14px';
            popup.style.fontFamily = 'sans-serif';
            popup.style.color = '#fff';
            popup.style.textAlign = 'center';
        }
        popup.style.display = 'none';
    }

    function showPopup(event, content) {
        if (!popup) createPopup();
        popup.innerHTML = content;
        popup.style.display = 'block';
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;

        const cursorX = event.clientX;
        const cursorY = event.clientY;

        let left;
        if (cursorX + CURSOR_OFFSET + popupWidth > viewportWidth) {
            left = event.pageX - popupWidth - CURSOR_OFFSET;
        } else {
            left = event.pageX + CURSOR_OFFSET;
        }

        let top;
        if (cursorY + CURSOR_OFFSET + popupHeight > viewportHeight) {
            top = event.pageY - popupHeight - CURSOR_OFFSET;
        } else {
            top = event.pageY + CURSOR_OFFSET;
        }

        popup.style.left = left + 'px';
        popup.style.top = top + 'px';
    }

    function hidePopup() {
        if (popup) {
            popup.style.display = 'none';
            popup.innerHTML = '';
        }
    }

    function getPoster(imdbId, event) {
        if (posterCache.has(imdbId)) {
            const posterUrl = posterCache.get(imdbId);
            if (posterUrl) {
                showPopup(event, `<img src="${posterUrl}" style="max-width: ${POPUP_MAX_WIDTH}px; display: block; border-radius: 4px;">`);
            } else {
                // 如果缓存中记录的是“无图”，则显示无图提示
                const message = `<div style="padding: 15px 20px; font-family: sans-serif; color: #ddd;">无预览图</div>`;
                showPopup(event, message);
            }
            return;
        }

        showPopup(event, `<div style="padding: 15px 20px;">加载中...</div>`);
        const apiUrl = `https://www.omdbapi.com/?i=${imdbId}&apikey=${API_KEY}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.Response === "True" && data.Poster && data.Poster !== "N/A") {
                    const posterUrl = data.Poster;
                    posterCache.set(imdbId, posterUrl);
                    if (event.target.closest('a[href*="search="]:hover')) {
                       showPopup(event, `<img src="${posterUrl}" style="max-width: ${POPUP_MAX_WIDTH}px; display: block; border-radius: 4px;">`);
                    }
                } else {
                    // ==========================================================
                    // == 核心更新：当无海报时，显示提示信息而非直接隐藏 ==
                    // ==========================================================
                    // 1. 缓存“无图”这个结果，防止重复请求
                    posterCache.set(imdbId, null);

                    // 2. 准备提示信息
                    const message = `<div style="padding: 15px 20px; font-family: sans-serif; color: #ddd;">无预览图</div>`;

                    // 3. 确认鼠标仍在目标上，然后显示提示
                    if (event.target.closest('a[href*="search="]:hover')) {
                       showPopup(event, message);
                    }
                }
            },
            onerror: function(error) {
                console.error('OMDb API 请求失败:', error);
                posterCache.set(imdbId, null);
                const message = `<div style="padding: 15px 10px; font-family: sans-serif; color: #ffdddd;">请求失败</div>`;
                if (event.target.closest('a[href*="search="]:hover')) {
                    showPopup(event, message);
                }
            }
        });
    }

    function handleMouseOver(event) {
        const link = event.currentTarget;
        const href = link.getAttribute('href');
        const match = href.match(/search=(\d+)/);

        if (match && match[1]) {
            let numericId = match[1];
            numericId = numericId.padStart(7, '0');
            const imdbId = 'tt' + numericId;
            getPoster(imdbId, event);
        }
    }

    function init() {
        createPopup();
        const imdbLinks = document.querySelectorAll('a:has(img[alt="imdb"])');
        imdbLinks.forEach(imdbLink => {
            const containerSpan = imdbLink.parentElement;
            if (containerSpan && containerSpan.tagName === 'SPAN' && containerSpan.title) {
                containerSpan.title = '';
            }
            imdbLink.addEventListener('mouseover', handleMouseOver);
            imdbLink.addEventListener('mouseout', hidePopup);
        });
    }

    window.addEventListener('load', init);

})();