// ==UserScript==
// @name         低端影视：去横幅
// @description  将 sajdhfbjwhe 广告容器替换为纯黑图片，并缩小到不可见。
// @version      1.03
// @author       yzcjd
// @author2       ChatGPT4辅助
// @namespace    https://greasyfork.org/users/1171320
// @match        https://ddys.pro/*
// @match        https://ddys.mov/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544624/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%EF%BC%9A%E5%8E%BB%E6%A8%AA%E5%B9%85.user.js
// @updateURL https://update.greasyfork.org/scripts/544624/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%EF%BC%9A%E5%8E%BB%E6%A8%AA%E5%B9%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BLACK_IMG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

    function replaceAd() {
        const ad = document.querySelector('#sajdhfbjwhe');
        if (ad) {
            ad.innerHTML = '';
            Object.assign(ad.style, {
                width: '1px',
                height: '1px',
                position: 'absolute',
                top: '0',
                left: '0',
                backgroundColor: 'black',
                backgroundImage: `url(${BLACK_IMG})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                display: 'block',
                visibility: 'visible',
                overflow: 'hidden',
                zIndex: '-1', // 防止遮挡其他内容
                pointerEvents: 'none' // 不可交互
            });
        }
    }

    replaceAd();

    new MutationObserver(() => replaceAd())
        .observe(document.documentElement, {
            childList: true,
            subtree: true
        });
})();

