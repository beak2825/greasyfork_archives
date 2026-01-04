// ==UserScript==
// @name         SteamPY一键打开Steam商店
// @namespace    https://greasyfork.org/zh-CN/users/314234
// @version      1.0.0
// @description  SteamPY购买CDKey页面一键打开steam商店
// @author       YongHuM1ng
// @match        *://steampy.com/cdKey/cdKey*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampy.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534979/SteamPY%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80Steam%E5%95%86%E5%BA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/534979/SteamPY%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80Steam%E5%95%86%E5%BA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .gameblock {
            position: relative !important;
        }
        .steam-link-btn {
            position: absolute;
            top: 10px;
            left: 10px;
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s;
            height: 24px;  /* 固定高度 */
        }
        .steam-link-btn img {
            height: 100%;
            vertical-align: middle;
            transition: filter 0.3s;
        }
        .steam-link-btn:hover img {
            filter: brightness(1.2) drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
    `;
    document.head.appendChild(style);

    function addSteamButtons() {
        const gameBlocks = document.querySelectorAll('.gameblock:not([data-steam-btn-added])');

        gameBlocks.forEach(block => {
            block.dataset.steamBtnAdded = "true";
            const img = block.querySelector('.cdkGameIcon');
            if(!img) return;

            const src = img.dataset.src || img.src;
            const steamAppId = src.match(/\/apps\/(\d+)\//)?.[1];
            if(!steamAppId) return;

            // 创建按钮容器
            const btn = document.createElement('div');
            btn.className = 'steam-link-btn';

            // 创建图片元素
            const badgeImg = document.createElement('img');
            badgeImg.src = 'https://img.shields.io/badge/steam%E5%95%86%E5%BA%97-blue?logo=steam';
            badgeImg.alt = 'Steam商店';
            badgeImg.title = '前往Steam商店页面';

            // 优化图片加载
            badgeImg.loading = 'lazy';
            badgeImg.decoding = 'async';

            btn.appendChild(badgeImg);

            // 点击事件处理
            btn.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(`https://store.steampowered.com/app/${steamAppId}/`, '_blank');
            };

            block.appendChild(btn);
        });
    }

    // 防抖函数
    let timeout;
    function debouncedAddButtons() {
        clearTimeout(timeout);
        timeout = setTimeout(addSteamButtons, 300);
    }

    // 初始运行
    addSteamButtons();

    // MutationObserver
    const observer = new MutationObserver(mutations => {
        if (document.querySelector('.gameblock:not([data-steam-btn-added])')) {
            debouncedAddButtons();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();