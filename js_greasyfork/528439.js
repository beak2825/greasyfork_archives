// ==UserScript==
// @name         哔哩哔哩自定义快捷键收藏到对应收藏夹
// @namespace    http://tampermonkey.net/
// @version      2025-09-03
// @description  仅需修改 keyCollectionMap
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528439/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%94%B6%E8%97%8F%E5%88%B0%E5%AF%B9%E5%BA%94%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/528439/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%94%B6%E8%97%8F%E5%88%B0%E5%AF%B9%E5%BA%94%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let keydown_record = null;

    // 快捷键映射到收藏夹名称
    const keyCollectionMap = {
        'e': '默认收藏夹',
        'r': '音乐',
        't': '工具',
    };

    // 点击“收藏”按钮
    function clickVideoFav() {
        const favButton = document.querySelector('.video-fav');
        if (favButton) {
            favButton.click();
        }
    }

    function waitAndClick(selector, interval = 100, timeout = 10000) {
        // 等待“确定”按钮可用
        const submitMoveBtn = document.querySelector(selector);
        const intervalId = setInterval(() => {
            if (!submitMoveBtn.disabled) {
                submitMoveBtn.click();
                clearInterval(intervalId);
            }
        }, 100);

        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            console.log('操作超时，按钮未启用');
        }, timeout);
    }

    document.addEventListener('keydown', (event) => {
        const targetTag = event.target.tagName.toLowerCase();
        if (targetTag === 'input' || targetTag === 'textarea') {
            return; // 如果是输入框或文本区域，则不处理快捷键
        }
        const key = event.key.toLowerCase();
        const collectionName = keyCollectionMap[key];

        if (!collectionName) return;

        // 点击“收藏”按钮（仅在按键不是 'e' 时）
        if (key !== 'e') {
            clickVideoFav();
        }

        keydown_record = key;
    });

    const callback = (mList) => {
        for (const mutation of mList) {
            for (const addedNode of mutation.addedNodes) {
                if (null != keydown_record && 'LI' === addedNode.tagName) {
                    const favTitle = addedNode.querySelector('.fav-title')?.innerText;
                    if (favTitle && favTitle === keyCollectionMap[keydown_record]) {
                        const fav = addedNode;
                        //console.log(fav);
                        fav.querySelector('input').click();
                        waitAndClick('.submit-move');
                        keydown_record = null;
                        return; // 会暂停 mutation
                    }
                }
            }
        }
    }
    const ob = new MutationObserver(callback);
    ob.observe(document, { childList: true, subtree: true, });
})();
