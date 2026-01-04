// ==UserScript==
// @name         强制使用苹方Heavy
// @version      1.0.0
// @description  强制使用苹方字体
// @author       ddatsh
// @include      *
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @namespace https://greasyfork.org/users/443499
// @downloadURL https://update.greasyfork.org/scripts/528208/%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E8%8B%B9%E6%96%B9Heavy.user.js
// @updateURL https://update.greasyfork.org/scripts/528208/%E5%BC%BA%E5%88%B6%E4%BD%BF%E7%94%A8%E8%8B%B9%E6%96%B9Heavy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 安全注入 CSS 样式
     * 优先使用 GM_addStyle（Tampermonkey 内置函数），否则回退到手动创建 <style> 标签。
     *
     * @param {string} cssText - 要注入的 CSS 代码
     */
    function addGlobalStyle(cssText) {
        if (typeof GM_addStyle === 'function') {
            GM_addStyle(cssText);
        } else {
            const style = document.createElement('style');
            style.textContent = cssText;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    /**
     * 强制设置页面字体
     *
     * 提供 4 种模式以适应不同的页面加载情况和样式覆盖需求：
     *
     *   模式 0：立即注入样式，采用完整的排除选择器（图标、字体图标、LOGO 等不受影响）。
     *   模式 1：与模式 0 类似，但原版采用延时注入，此处统一即时注入（如确实有延时需求，可自行添加 setTimeout）。
     *   模式 2：先立即注入一份规则，然后延时（300ms）再注入一份略微不同的规则，以增强对动态加载样式的覆盖。
     *   模式 3：调整排除选择器及字体序列顺序，适用于特殊页面。
     *
     * @param {string} font - 要应用的目标字体（非空字符串才会生效）
     * @param {number} mode - 注入模式（0、1、2、3），默认为 0
     */
    function changeFont(font, mode = 0) {
        if (!font) return; // 如果没有指定字体，则不作处理

        let cssRule = '';

        switch (mode) {
            case 0:
            case 1:
                // 模式 0 和 1：统一采用完整排除选择器
                cssRule = `
                    *:not([class*="icon"]):not([class*="fa"]):not([class*="logo"]):not([class*="mi"]):not([class*="hwic"]):not([class*="code"]):not(i) {
                        font-family: ${font}, Arial, "Material Icons Extended", stonefont, iknow-qb_share_icons, review-iconfont, mui-act-font, fontAwesome, tm-detail-font, office365icons, MWF-MDL2, global-iconfont, "Bowtie", myfont, sans-serif !important;
                    }
                `;
                addGlobalStyle(cssRule);
                break;

            case 2:
                // 模式 2：先立即注入一份规则
                cssRule = `
                    *:not([class*="icon"]):not([class*="fa"]):not([class*="logo"]):not([class*="mi"]):not([class*="hwic"]):not([class*="code"]):not(i) {
                        font-family: ${font}, Arial, "Material Icons Extended", stonefont, iknow-qb_share_icons, review-iconfont, mui-act-font, fontAwesome, tm-detail-font, office365icons, MWF-MDL2, global-iconfont, "Bowtie", myfont, sans-serif !important;
                    }
                `;
                addGlobalStyle(cssRule);

                // 延时注入第二份规则（适应动态加载的样式），选择器略有调整
                setTimeout(() => {
                    const delayedRule = `
                        *:not([class*="icon"]):not([class*="fa"]):not([class*="logo"]):not([class*="mi"]):not([class*="code"]):not(i) {
                            font-family: ${font}, Arial, "Material Icons Extended", stonefont, iknow-qb_share_icons, review-iconfont, mui-act-font, fontAwesome, tm-detail-font, office365icons, MWF-MDL2, global-iconfont, "Bowtie", myfont, sans-serif !important;
                        }
                    `;
                    addGlobalStyle(delayedRule);
                }, 300);
                break;

            case 3:
                // 模式 3：排除选择器及字体序列顺序略作调整
                cssRule = `
                    *:not(i):not([class*="icon"]):not([class*="fa"]):not([class*="logo"]):not([class*="mi"]):not([class*="code"]) {
                        font-family: ${font}, Arial, "Material Icons Extended";
                    }
                `;
                addGlobalStyle(cssRule);
                break;

            default:
                // 默认采用模式 0 的规则
                cssRule = `
                    *:not([class*="icon"]):not([class*="fa"]):not([class*="logo"]):not([class*="mi"]):not([class*="hwic"]):not([class*="code"]):not(i) {
                        font-family: ${font}, Arial, "Material Icons Extended", stonefont, iknow-qb_share_icons, review-iconfont, mui-act-font, fontAwesome, tm-detail-font, office365icons, MWF-MDL2, global-iconfont, "Bowtie", myfont, sans-serif !important;
                    }
                `;
                addGlobalStyle(cssRule);
        }
    }

    // 将 changeFont 方法暴露给全局（如其他脚本或页面调用）
    window.changeFont = changeFont;

    /* =======================
       示例：自动调用（如需要可启用）
       -----------------------
       请将 'YourFontName' 替换为你需要的目标字体名称，
       mode 参数可选（0、1、2、3），默认 0 模式。
       ======================= */
    // changeFont('YourFontName', 0);
    changeFont("PingFang SC Heavy",0);
})();