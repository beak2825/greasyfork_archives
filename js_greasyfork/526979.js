// ==UserScript==
// @name thisav或missav永远播放
// @description thisav或missav永远播放！重写了播放器的pause方法，只有在页面具有焦点时才执行原始的暂停操作。更改match里的内容适配更多网站。
// @description:en Remove lose focus -> stop playing + Remove first click pop-up advert

// @namespace http://tampermonkey.net/
// @author lowo
// @license AGPL-3.0
// @version 1.0.6

// @match        https://missav.com/*
// @match        https://missav.ws/*
// @match        https://missav.ai/*
// @match        https://thisav.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/526979/thisav%E6%88%96missav%E6%B0%B8%E8%BF%9C%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/526979/thisav%E6%88%96missav%E6%B0%B8%E8%BF%9C%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 当页面加载完成后执行以下代码
    document.addEventListener('ready', () => {
        console.log('ready'); // 输出“ready”到控制台，用于调试
        // 禁止使用window.open函数，防止页面打开新窗口
        window.open = () => { };
        // 获取播放器的原始暂停方法，保存到变量pause中
        const pause = window.player.pause;
        // 重写播放器的pause方法
        window.player.pause = () => {
            console.log('pasu'); // 输出“pasu”到控制台，用于调试
            // 检查页面是否具有焦点，只有在页面具有焦点时才执行原始的暂停操作
            if (document.hasFocus()) {
                pause(); // 调用原始的pause方法，暂停播放器
            }
        };
    });
    // Your code here...
})();
