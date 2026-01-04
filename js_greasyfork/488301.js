// ==UserScript==
// @name         Apply Binarize Filter to Any Page
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Inject and apply thread filter to the body of any webpage
// @author       hatrd
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488301/Apply%20Binarize%20Filter%20to%20Any%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/488301/Apply%20Binarize%20Filter%20to%20Any%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前滤镜反转状态
    var filterInverted = GM_getValue('filterInverted', false);

    // 创建 SVG 和 filter 元素
    var svgHtml = `
    <svg id="filterSvg" height="0" style="position:absolute; width:0; height:0">
        <filter id="normalThreshold">
            <feColorMatrix type="matrix" values="0.21 0.72 0.07 0 0
                                                   0.21 0.72 0.07 0 0
                                                   0.21 0.72 0.07 0 0
                                                   0    0    0    1 0" />
            <feComponentTransfer>
                <feFuncR type="discrete" tableValues="0 1" />
                <feFuncG type="discrete" tableValues="0 1" />
                <feFuncB type="discrete" tableValues="0 1" />
            </feComponentTransfer>
        </filter>
        <filter id="invertedThreshold">
            <feColorMatrix type="matrix" values="0.21 0.72 0.07 0 0
                                                   0.21 0.72 0.07 0 0
                                                   0.21 0.72 0.07 0 0
                                                   0    0    0    1 0" />
            <feComponentTransfer>
                <feFuncR type="discrete" tableValues="1 0" />
                <feFuncG type="discrete" tableValues="1 0" />
                <feFuncB type="discrete" tableValues="1 0" />
            </feComponentTransfer>
        </filter>
    </svg>
    `;

    // 将 SVG 插入页面中
    document.body.insertAdjacentHTML('beforeend', svgHtml);

    // 应用滤镜到 body
    applyFilter();

    // 注册菜单命令以切换滤镜反转
    GM_registerMenuCommand("Toggle Filter Inversion", function() {
        filterInverted = !filterInverted;
        GM_setValue('filterInverted', filterInverted); // 更新存储的状态
        applyFilter(); // 应用新的滤镜
    }, "t");

    function applyFilter() {
        // 根据 filterInverted 的值选择使用哪一个滤镜
        document.body.style.filter = filterInverted ? 'url(#invertedThreshold)' : 'url(#normalThreshold)';
    }
})();
