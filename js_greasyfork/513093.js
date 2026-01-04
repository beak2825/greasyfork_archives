// ==UserScript==
// @name           为 b 站 (bilibili) 添加自定义倍速, 支持快捷键，下一个视频的倍速=上一个视频的倍速
// @namespace      /DBI/bili-more-rates
// @version        1.2.5
// @description    为b站(bilibili)添加更多倍速 (可自定义, 支持自定义快捷键): 0.25X; 2.5X; 3X; 4X。
// @author         DuckBurnIncense
// @match          https://www.bilibili.com/video/* 
// @match          https://www.bilibili.com/list/watchlater* 
// @match          https://www.bilibili.com/bangumi/play/* 
// @icon           https://www.bilibili.com/favicon.ico 
// @supportURL     https://greasyfork.org/zh-CN/scripts/462473/ 
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          unsafeWindow
// @run-at         document-end
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/513093/%E4%B8%BA%20b%20%E7%AB%99%20%28bilibili%29%20%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%2C%20%E6%94%AF%E6%8C%81%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%8C%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91%E7%9A%84%E5%80%8D%E9%80%9F%3D%E4%B8%8A%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91%E7%9A%84%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/513093/%E4%B8%BA%20b%20%E7%AB%99%20%28bilibili%29%20%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%2C%20%E6%94%AF%E6%8C%81%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%8C%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91%E7%9A%84%E5%80%8D%E9%80%9F%3D%E4%B8%8A%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91%E7%9A%84%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待播放器加载
    function waitForPlayer(callback) {
        const checkPlayer = () => {
            if (document.querySelector('.bpx-player-ctrl-playbackrate-menu')) {
                callback();
            } else {
                setTimeout(checkPlayer, 500);
            }
        };
        checkPlayer();
    }

    waitForPlayer(() => {
        const currentRate = GM_getValue('currentRate'); // 获取存储的当前倍速
        const domVideoElement = document.querySelector('video.bpx-player-video'); // 获取视频元素

        // 自定义倍速和快捷键
        const customRates = [
            { rate: 0.25, shortcut: '' },
            { rate: 2.5, shortcut: '' },
            { rate: 3, shortcut: 'shift+3' },            
            { rate: 4, shortcut: 'shift+4' },
        ];

        // 标准倍速
        const standardRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

        // 合并并去重倍速
        const allRates = [...new Set([...standardRates, ...customRates.map(r => r.rate)])];

        // 按照指定顺序排序倍速
        const orderedRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4].filter(rate => allRates.includes(rate));

        // 将倍速添加到播放器菜单
        const menu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
        menu.innerHTML = ''; // 清空现有菜单项

        orderedRates.forEach((rate) => {
            const newRateNode = document.createElement('li');
            newRateNode.innerText = `${rate}x`;
            newRateNode.classList.add('bpx-player-ctrl-playbackrate-menu-item');
            newRateNode.dataset.value = rate;

            // 绑定点击事件
            newRateNode.addEventListener('click', () => {
                domVideoElement.playbackRate = rate;
                GM_setValue('currentRate', rate); // 更新存储的当前倍速
            });

            // 添加到菜单
            menu.appendChild(newRateNode);
        });

        // 如果存在存储的倍速值，则设置播放器的倍速
        if (currentRate !== undefined && domVideoElement) {
            domVideoElement.playbackRate = currentRate;
        }

        // 监听快捷键
        document.addEventListener('keydown', (event) => {
            const pressedKey = event.key.toLowerCase();
            const { ctrlKey, altKey, shiftKey } = event;
            const controlKey = ctrlKey ? 'ctrl+' : '';
            const altKeyStr = altKey ? 'alt+' : '';
            const shiftKeyStr = shiftKey ? 'shift+' : '';

            customRates.forEach(({ rate, shortcut }) => {
                if (shortcut && `${controlKey}${altKeyStr}${shiftKeyStr}${shortcut}` === pressedKey) {
                    domVideoElement.playbackRate = rate;
                    GM_setValue('currentRate', rate); // 更新存储的当前倍速
                }
            });
        });
    });
})();