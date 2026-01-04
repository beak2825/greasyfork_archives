// ==UserScript==
// @name         全局CSS导入
// @namespace    https://github.com/AliubYiero/TamperMonkeyScripts
// @version      0.1.0
// @description  全局CSS导入!
// @author       Yiero
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @match        https://*/*
// @license      GPL
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/490428/%E5%85%A8%E5%B1%80CSS%E5%AF%BC%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/490428/%E5%85%A8%E5%B1%80CSS%E5%AF%BC%E5%85%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class ExtraCSSConfigStorage {
        #storageName = 'ExtraCSSConfig';

        get() {
            return localStorage.getItem(this.#storageName) || '';
        }

        set(appendCssRules) {
            const currentCssRules = this.get();
            localStorage.setItem(this.#storageName, currentCssRules + appendCssRules);
        }
    }

    // Your code here...
    // init
    const extraCSSConfigStorage = new ExtraCSSConfigStorage();
    let cssRules = extraCSSConfigStorage.get();
    let cssElement = GM_addStyle(cssRules);

    // 添加页面css, 并刷新页面
    const appendPageCSS = ((cssElement, extraCSSConfigStorage) => {
        return (appendCssRules) => {
            // 写入CSS到本地存储
            extraCSSConfigStorage.set(appendCssRules);

            // 刷新页面CSS
            cssElement.remove();
            cssElement = GM_addStyle(extraCSSConfigStorage.get());
        }
    })(cssElement, extraCSSConfigStorage);

    // 添加CSS规则
    GM_registerMenuCommand('添加CSS', () => {
        // css规则
        const cssRule = prompt('添加CSS规则 (示例 [.hide {display: none !important;}]) ');
        if (!cssRule) return;

        // css注释
        let comment = prompt('添加代码注释 (非必填)');
        if (comment) {
            comment = `/* ${comment} */`
        }
 
        // 添加页面CSS 
        appendPageCSS(`${comment}${cssRule} `);
    });

    // 隐藏元素
    GM_registerMenuCommand('隐藏元素', () => {
        const cssSelector = prompt('添加需要隐藏显示的 Selector[s] (元素选择器)');
        if (!cssSelector) return;

        // css注释
        let comment = prompt('添加代码注释 (非必填)');
        if (comment) {
            comment = `/* ${comment} */`
        }

        // 添加页面CSS
        appendPageCSS(`${comment}${cssSelector}{display: none !important;}`);
    });
})();