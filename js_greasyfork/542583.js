// ==UserScript==
// @name         获取TMDB影片介绍并显示（适配iOS）
// @version      1.0
// @description  插入按钮，通过API获取影片介绍并在页面中显示（兼容iOS Safari）
// @author       Copilot
// @match        https://www.themoviedb.org/*/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @namespace https://greasyfork.org/users/1405902
// @downloadURL https://update.greasyfork.org/scripts/542583/%E8%8E%B7%E5%8F%96TMDB%E5%BD%B1%E7%89%87%E4%BB%8B%E7%BB%8D%E5%B9%B6%E6%98%BE%E7%A4%BA%EF%BC%88%E9%80%82%E9%85%8DiOS%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542583/%E8%8E%B7%E5%8F%96TMDB%E5%BD%B1%E7%89%87%E4%BB%8B%E7%BB%8D%E5%B9%B6%E6%98%BE%E7%A4%BA%EF%BC%88%E9%80%82%E9%85%8DiOS%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForTitleAndInsertButton() {
        const titleBlock = document.querySelector('.title') || document.querySelector('[data-testid="hero-title-block"]');
        const titleEl = titleBlock?.querySelector('h2') || document.querySelector('h2[data-testid="hero-title-block__title"]');
        if (!titleBlock || !titleEl) {
            setTimeout(waitForTitleAndInsertButton, 500);
            return;
        }

        if (document.getElementById('tmdb-api-button')) return;

        const btn = document.createElement('button');
        btn.id = 'tmdb-api-button';
        btn.textContent = '📋 获取介绍';
        Object.assign(btn.style, {
            display: 'block',
            marginBottom: '10px',
            padding: '6px 12px',
            fontSize: '0.85em',
            backgroundColor: '#21d07a',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        });

        btn.onclick = () => {
            const mediaLink = window.location.href;
            const language = 'zh-CN';
            const match = mediaLink.match(/\/season\/(\d+)/);
            const season = match ? match[1] : '';
            let apiURL = `http://localhost:12280/introduction?media_link=${encodeURIComponent(mediaLink)}&language=${language}`;
            if (season) apiURL += `&season_number=${season}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: apiURL,
                onload: res => {
                    if (res.status === 200) {
                        showOverlay(res.responseText);
                    } else {
                        showOverlay(`⚠️ 请求失败：${res.status}`);
                    }
                },
                onerror: () => {
                    showOverlay('⚠️ 网络错误或无法访问 API');
                }
            });
        };

        titleBlock.parentNode.insertBefore(btn, titleBlock);
    }

    function showOverlay(content) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '9999',
            background: '#fff',
            border: '2px solid #01b4e4',
            borderRadius: '8px',
            padding: '1em',
            maxWidth: '90%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        });

        const label = document.createElement('div');
        label.textContent = '✅ 以下是影片介绍，请长按复制：';
        label.style.marginBottom = '8px';
        label.style.fontSize = '0.9em';

        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.rows = 8;
        textarea.style.width = '100%';
        textarea.style.fontSize = '0.85em';
        textarea.style.fontFamily = 'monospace';
        textarea.style.padding = '6px';
        textarea.select();

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        Object.assign(closeBtn.style, {
            marginTop: '8px',
            padding: '4px 10px',
            backgroundColor: '#ccc',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        });
        closeBtn.onclick = () => document.body.removeChild(overlay);

        overlay.appendChild(label);
        overlay.appendChild(textarea);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
    }

    waitForTitleAndInsertButton();
})();
