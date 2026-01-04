// ==UserScript==
// @name         TMDB-API信息获取
// @version      1.1
// @description  在TMDB页面插入按钮，通过API获取信息并复制结果内容到剪贴板（搭配https://github.com/Pixel-LH/TMDBGen项目食用）
// @author       Copilot
// @match        https://www.themoviedb.org/*/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @icon        https://www.themoviedb.org/assets/2/apple-touch-icon-57ed4b3b0450fd5e9a0c20f34e814b82adaa1085c79bdde2f00ca8787b63d2c4.png
// @namespace https://greasyfork.org/users/1405902
// @downloadURL https://update.greasyfork.org/scripts/542536/TMDB-API%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/542536/TMDB-API%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        const titleContainer = document.querySelector('.title');
        if (!titleContainer) return;

        const titleEl = titleContainer.querySelector('h2') || document.querySelector('h2[data-testid="hero-title-block__title"]');
        if (!titleEl) return;

        // 创建按钮
        const btn = document.createElement('button');
        btn.textContent = '📋 从 API 获取影片介绍';
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
            let seasonNumber = '';

            // 自动尝试识别 season_number 参数（如果存在季节路径）
            const match = mediaLink.match(/\/season\/(\d+)/);
            if (match) {
                seasonNumber = match[1];
            }

            // 构建 API 请求 URL
            let apiURL = `http://locahost:12280/introduction?media_link=${encodeURIComponent(mediaLink)}&language=${language}`;
            if (seasonNumber) {
                apiURL += `&season_number=${seasonNumber}`;
            }

            // 请求并复制返回内容
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiURL,
                onload: function (response) {
                    if (response.status === 200) {
                        const content = response.responseText;
                        navigator.clipboard.writeText(content).then(() => {
                            btn.textContent = '✅ 已复制影片介绍';
                            setTimeout(() => {
                                btn.textContent = '📋 从 API 获取影片介绍';
                            }, 2000);
                        });
                    } else {
                        btn.textContent = `⚠️ 请求失败 (${response.status})`;
                        setTimeout(() => {
                            btn.textContent = '📋 从 API 获取影片介绍';
                        }, 3000);
                    }
                },
                onerror: function () {
                    btn.textContent = '⚠️ 无法访问 API';
                    setTimeout(() => {
                        btn.textContent = '📋 从 API 获取影片介绍';
                    }, 3000);
                }
            });
        };

        // 插入按钮到标题上方
        titleContainer.parentNode.insertBefore(btn, titleContainer);
    });
})();