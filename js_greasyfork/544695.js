// ==UserScript==
// @name         Now Playing Copy Button
// @namespace    http://tampermonkey.net/
// @version      v1.1
// @description  For personal use.
// @author       MeteorVE
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544695/Now%20Playing%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/544695/Now%20Playing%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function renderCopyButton() {
        try {
            const nowPlayingWidget = document.querySelector('[data-testid="now-playing-widget"]');
            if (!nowPlayingWidget) {
                // 只在 debug 時開啟，避免刷屏：console.log("[CopyBtn] 找不到 now-playing-widget");
                return;
            }

            const mainDivs = nowPlayingWidget.querySelectorAll(':scope > div');
            if (mainDivs.length < 3) {
                // console.log("[CopyBtn] 找不到第三個主要 div");
                return;
            }

            const thirdDiv = mainDivs[2];
            if (thirdDiv.querySelector('.my-copy-button')) {
                // console.log("[CopyBtn] 按鈕已存在");
                return;
            }

            // 直接插入「兩張紙」SVG icon
            const btn = document.createElement('button');
            btn.className = 'my-copy-button';
            btn.style.background = 'none';
            btn.style.border = 'none';
            btn.style.cursor = 'pointer';
            btn.style.padding = '0 0 0 8px';
            btn.title = "Copy song name";
            btn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
  <rect x="7" y="7" width="9" height="9" rx="2" fill="#888"/>
  <rect x="4" y="4" width="9" height="9" rx="2" stroke="#888" stroke-width="2" fill="none"/>
</svg>
            `;

            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                try {
                    // 動態取得歌名
                    const songTitle = nowPlayingWidget.querySelector('[data-testid="context-item-info-title"]')?.textContent.trim() || '';
                    console.log('[CopyBtn] 提取歌曲名稱：' + songTitle);

                    if (songTitle) {
                        if (typeof GM_setClipboard === 'function') {
                            GM_setClipboard(songTitle);
                        } else if (navigator.clipboard) {
                            navigator.clipboard.writeText(songTitle);
                        } else {
                            const textarea = document.createElement('textarea');
                            textarea.value = songTitle;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            textarea.remove();
                        }
                        btn.title = "已複製！";
                        setTimeout(() => btn.title = "Copy song name", 1000);
                    } else {
                        btn.title = "找不到歌名";
                        setTimeout(() => btn.title = "Copy song name", 1000);
                        console.warn('[CopyBtn] 歌名為空');
                    }
                } catch (err) {
                    console.error('[CopyBtn] 複製按鈕點擊時發生錯誤:', err);
                }
            });

            thirdDiv.appendChild(btn);
            console.log('[CopyBtn] 複製按鈕已渲染');
        } catch (err) {
            console.error('[CopyBtn] renderCopyButton 發生錯誤:', err);
        }
    }

    window.addEventListener('load', renderCopyButton);

    const observer = new MutationObserver(() => {
        renderCopyButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();