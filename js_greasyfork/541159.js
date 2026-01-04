// ==UserScript==
// @name         隐藏 AI Studio 界面元素 (头部/推广)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hides the header and promo gallery on Google AI Studio using a robust CSS injection method.
// @description:zh-CN  通过强大的CSS注入方法，隐藏 Google AI Studio 上的头部和推广画廊。
// @author       hdh
// @match        *://aistudio.google.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541159/%E9%9A%90%E8%97%8F%20AI%20Studio%20%E7%95%8C%E9%9D%A2%E5%85%83%E7%B4%A0%20%28%E5%A4%B4%E9%83%A8%E6%8E%A8%E5%B9%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541159/%E9%9A%90%E8%97%8F%20AI%20Studio%20%E7%95%8C%E9%9D%A2%E5%85%83%E7%B4%A0%20%28%E5%A4%B4%E9%83%A8%E6%8E%A8%E5%B9%BF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectorsToHide = [
        'ms-header-root',
        'ms-promo-gallery'
    ];

    const cssSelectorString = selectorsToHide.join(', ');

    const css = `
        ${cssSelectorString} {
            display: none !important;
        }
    `;

    GM_addStyle(css);

    console.log('Tampermonkey: CSS rule to hide header and promo elements has been injected.');
})();