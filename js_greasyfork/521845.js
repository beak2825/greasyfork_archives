// ==UserScript==
// @name         Update Bullet and Ordered List Colors for kdocs.cn
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change bullet and ordered list colors on kdocs.cn
// @author       You
// @match        *://*.kdocs.cn/*
// @grant        none
// @license  You
// @downloadURL https://update.greasyfork.org/scripts/521845/Update%20Bullet%20and%20Ordered%20List%20Colors%20for%20kdocscn.user.js
// @updateURL https://update.greasyfork.org/scripts/521845/Update%20Bullet%20and%20Ordered%20List%20Colors%20for%20kdocscn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义选择器和颜色
    const bulletSelector = '#root .ProseMirror .outline-bullet-list-item .text-block-content-container';
    const orderListSelector = '#root .ProseMirror .outline-order-list-item .otl-list-str';
    const defaultColor = '#8549EB'; // 将伪元素的默认颜色设置为 #8549EB

    // 为 bullet 列表项的伪元素应用默认颜色
    function applyBulletStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            ${bulletSelector}::before {
                display: inline-block;
                content: "\\2022";
                font-family: "kingsoft-unsequence";
                pointer-events: none;
                width: 24px;
                max-width: 32px;
                box-sizing: border-box;
                line-height: 1.3em;
                text-align: left;
                text-indent: 0;
                padding-right: 8px;
                white-space: nowrap;
                color: ${defaultColor};  /* 将默认颜色设置为 #8549EB */
                font-size: .8em;
                vertical-align: middle;
                margin-bottom: .2em;
                padding-left: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    // 为 ordered 列表项的伪元素应用默认颜色
    function applyOrderListStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            ${orderListSelector}::before {
                content: var(--numStr);
                color: ${defaultColor};  /* 将默认颜色设置为 #8549EB */
            }
        `;
        document.head.appendChild(style);
    }

    // 初始化脚本
    function init() {
        applyBulletStyles();      // 应用 bullet 列表项的样式
        applyOrderListStyles();   // 应用 ordered 列表项的样式
    }

    // 页面加载后执行初始化
    window.addEventListener('load', init);

})();