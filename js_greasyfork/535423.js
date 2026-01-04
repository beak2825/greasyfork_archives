// ==UserScript==
// @name         Global Selection Style
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set custom styles for text selection across all websites, only if not already defined
// @author       jhll1124
// @match        *://*/*
// @exclude      *://www.bilibili.com/*  // 排除B站
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535423/Global%20Selection%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/535423/Global%20Selection%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetSelectors = [
        '::selection',
        '*::selection',
        'body::selection',
        'html::selection'
    ];

    let found = false;

    for (const sheet of document.styleSheets) {
        try {
            const rules = sheet.cssRules;
            if (!rules) continue;

            for (const rule of rules) {
                if (rule.selectorText && targetSelectors.some(sel => rule.selectorText.includes(sel))) {
                    found = true;
                    break;
                }
            }
        } catch (e) {
            // 忽略跨域样式表
        }
        if (found) break;
    }

    if (!found) {
        GM_addStyle(`
            ::selection {
                background-color: rgb(242, 198, 255);
            }
        `);
    }
})();
