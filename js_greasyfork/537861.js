// ==UserScript==
// @name         B站直播自动选择最高清晰度
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  鼠标放在清晰度按钮上后，自动选择B站直播的1080P原画清晰度
// @author       You
// @match        *://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537861/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E6%B8%85%E6%99%B0%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/537861/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E6%B8%85%E6%99%B0%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_ATTEMPTS = 60; // 最大尝试次数
    const INTERVAL = 1000; // 检测间隔(毫秒)

    let attempts = 0;

    function selectHighestQuality() {
        // 如果超过最大尝试次数则停止
        if (attempts++ > MAX_ATTEMPTS) return;

        try {
            // 1. 尝试通过精确选择器查找
            let qualityOption = document.querySelector('.list-it.svelte-1n48lz1');

            // 2. 如果找不到则尝试通用选择器
            if (!qualityOption) {
                const options = document.querySelectorAll('[class*="list-it"]');
                qualityOption = Array.from(options).find(el => el.textContent.includes('1080P'));
            }

            // 3. 如果找到1080P选项
            if (qualityOption && qualityOption.textContent.includes('1080P')) {
                qualityOption.click();
                console.log('已选择1080P清晰度');
                return;
            }
        } catch (e) {
            console.error('清晰度选择出错:', e);
        }

        // 继续尝试直到成功
        setTimeout(selectHighestQuality, INTERVAL);
    }

    // 初始启动
    setTimeout(selectHighestQuality, 2000);
})();