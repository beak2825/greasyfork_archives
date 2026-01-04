// ==UserScript==
// @name:en         [MWI]UI Optimization: Borderless Theme Style
// @name   [银河奶牛]UI优化：无边框主题样式
// @namespace    https://github.com/shenhuanjie
// @version      1.0.4
// @description:en  This script auto-converts UIs to borderless themes via rendering parameter tweaks and CSS injection, seamlessly modernizing interfaces for immersive experiences.
// @description [银河奶牛]通过微调渲染参数和注入 CSS 样式，自动将用户界面转换为无边框主题，无缝实现界面现代化并提升沉浸体验。
// @author       shenhuanjie
// @match        https://www.milkywayidle.com/game*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        GM_addStyle
// @license      MIT
// @homepageURL  https://github.com/shenhuanjie/userscripts
// @supportURL   https://github.com/shenhuanjie/userscripts/issues
// @run-at       document-start
// @compatible   chrome Tampermonkey
// @compatible   firefox Greasemonkey
// @compatible   edge Tampermonkey
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535772/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5DUI%E4%BC%98%E5%8C%96%EF%BC%9A%E6%97%A0%E8%BE%B9%E6%A1%86%E4%B8%BB%E9%A2%98%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/535772/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5DUI%E4%BC%98%E5%8C%96%EF%BC%9A%E6%97%A0%E8%BE%B9%E6%A1%86%E4%B8%BB%E9%A2%98%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply global border removal style
    // 应用全局无边框样式
    GM_addStyle(`
        * {
            border: none !important;
        }
    `);

    console.log('[Global Border Remover] Loaded. All element borders have been removed.');
    console.log('[全局无边框样式] 已加载，所有元素边框已被移除');
})();