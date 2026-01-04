// ==UserScript==
// @name         全局字体优化 - 小米字体(优化)/微软/思源黑体
// @namespace    https://github.com/yourusername
// @version      1.0.0
// @description  优化网页字体显示，优先使用小米MiSans Medium，备选微软雅黑/思源黑体，并正确渲染Emoji
// @author       yuanjie221
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530234/%E5%85%A8%E5%B1%80%E5%AD%97%E4%BD%93%E4%BC%98%E5%8C%96%20-%20%E5%B0%8F%E7%B1%B3%E5%AD%97%E4%BD%93%28%E4%BC%98%E5%8C%96%29%E5%BE%AE%E8%BD%AF%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/530234/%E5%85%A8%E5%B1%80%E5%AD%97%E4%BD%93%E4%BC%98%E5%8C%96%20-%20%E5%B0%8F%E7%B1%B3%E5%AD%97%E4%BD%93%28%E4%BC%98%E5%8C%96%29%E5%BE%AE%E8%BD%AF%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义 CSS 规则
    const cssRules = `
        @font-face {
            font-family: "Apple Color Emoji";
            src: local("Apple Color Emoji");
            unicode-range: U+2100-10FFFF;
        }
        @font-face {
            font-family: "Segoe UI Emoji";
            src: local("Segoe UI Emoji");
            unicode-range: U+2100-10FFFF;
        }

        /* 全局字体规则 */
        :not(i, s, a:hover, span, textarea, [aria-hidden=true], [class^=fa], [class*=icon], #_#_) {
            font-family:
                "Apple Color Emoji", "Segoe UI Emoji",
                "MiSans Medium",        /* 小米字体英文名 */
                "小米字体 Medium",       /* 小米字体中文名 */
                "Microsoft YaHei",      /* 微软雅黑 */
                "Noto Sans CJK SC",     /* 思源黑体 */
                -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        /* 代码块专用字体 */
        pre, code, textarea, samp, kbd, var, [class*=code] {
            font-family:
                "Apple Color Emoji", "Segoe UI Emoji",
                ui-monospace, SFMono-Regular, Menlo, Consolas,
                "Source Han Mono SC", "Noto Sans Mono CJK SC", monospace !important;
        }
    `;

    // 动态插入样式
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(cssRules));
    document.head.appendChild(style);

})();