// ==UserScript==
// @name         missav修改页面
// @namespace    http://tampermonkey.net/
// @version      0.7.4
// @description        该脚本修改missav页面，使视频标题不再被隐藏，完整显示。为首页推荐标签添加链接，删除广告，禁用window.open，并在窗口聚焦时自动暂停视频。
// @description:zh-CN  该脚本修改missav页面，使视频标题不再被隐藏，完整显示。为首页推荐标签添加链接，删除广告，禁用window.open，并在窗口聚焦时自动暂停视频。
// @description:zh-TW  該指令碼修改missav頁面，使視頻標題不再被隱藏，完整顯示。為首頁推薦標籤添加鏈接，刪除廣告，禁用window.open，並在窗口聚焦時自動暫停視頻。
// @description:en     This script modifies the missav page to fully display video titles, adds links to homepage tags, removes ads, disables window.open, and pauses the video when the window is in focus.
// @description:ko     이 스크립트는 missav 페이지를 수정하여 비디오 제목을 완전히 표시하고, 홈 페이지 태그에 링크를 추가하며, 광고를 제거하고 window.open을 비활성화하며 창이 포커스될 때 비디오를 일시 중지합니다.
// @description:ja     このスクリプトは、missavページを修正し、ビデオタイトルを完全に表示し、ホームページのタグにリンクを追加し、広告を削除し、window.openを無効にし、ウィンドウがフォーカスされているときにビデオを一時停止します。
// @author       mrhydra
// @license      MIT
// @match        *://*.missav.com/*
// @match        *://missav.com/*
// @match        *://*.missav.ws/*
// @match        *://missav.ws/*
// @match        *://*.missav.ai/*
// @match        *://missav.ai/*
// @icon         https://www.google.com/s2/favicons?domain=missav.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488770/missav%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/488770/missav%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;
    const origin = window.location.origin;

    // 清理class并将特定文本转换为链接
    function clearClassAndConvertToLink() {
        const allDivs = document.querySelectorAll('div.my-2.text-sm.text-nord4.truncate, div.flex-1.min-w-0');
        console.log(`[missav页面修改] 找到 ${allDivs.length} 个需要处理的元素`);

        allDivs.forEach(div => {
            console.log(`[missav页面修改] 正在处理的 div 的 class 属性: ${div.className}`);

            if (div.matches('div.my-2.text-sm.text-nord4.truncate')) {
                const a = div.querySelector('a');
                if (a && a.href.includes(hostname)) {
                    div.className = '';
                }
            } else if (div.matches('div.flex-1.min-w-0')) {
                const h2 = div.querySelector('h2');
                if (h2) {
                    const text = h2.innerText;
                    const link = document.createElement('a');
                    link.href = `${origin}/genres/${text}`;
                    link.innerText = text;
                    h2.innerHTML = '';
                    h2.appendChild(link);
                    console.log(`[missav页面修改] 已经将文本 "${text}" 转换为链接`);
                }
            }
        });
    }

    // 删除iframe和特定的div元素
    function removeElements() {
        const allElements = document.querySelectorAll(
            'div[class^="root"], ' +
            'div[class*="fixed"][class*="right-"][class*="bottom-"], ' +
            'div[class*="pt-"][class*="pb-"][class*="px-"]:not([class*="sm:"]), ' +
            'div[class*="lg:hidden"], ' +
            'div[class*="lg:block"], ' +
            'div.ts-outstream-video, ' +
            'div.grid.md\\:grid-cols-2.gap-8, ' +
            'iframe'
        );

        console.log(`[missav页面修改] 找到 ${allElements.length} 个需要处理的元素`);

        allElements.forEach(el => {
            if (el.tagName.toLowerCase() === 'iframe') {
                console.log(`[missav页面修改] 正在移除的 iframe 元素`);
                el.remove();
            } else {
                console.log(`[missav页面修改] 正在隐藏的 div 元素，class 属性: ${el.className}`);
                el.style.display = 'none';
            }
        });
    }

    // 节流函数，防止频繁触发
    function throttle(fn, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return fn(...args);
        }
    }

    // 监听DOM变化并执行处理函数
    const observer = new MutationObserver(throttle(() => {
        console.log('[missav页面修改] MutationObserver 触发');
        clearClassAndConvertToLink();
        removeElements();
    }, 500));
    observer.observe(document, { childList: true, subtree: true });

    console.log('[missav页面修改] 初始化执行');
    setTimeout(clearClassAndConvertToLink, 2500);
    clearClassAndConvertToLink();
    removeElements();

    document.addEventListener('click', () => {
        window.open = () => {}
    });
    //禁用window.open并修改视频暂停逻辑
    document.addEventListener('ready', () => {
        console.log('ready')
        window.open = () => {}
        const pause = window.player.pause
        window.player.pause = () => {
            console.log('pasu')
            if (document.hasFocus()) {
                pause()
            }
        }
    });
})();