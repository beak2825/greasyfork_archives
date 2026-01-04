// ==UserScript==
// @name         再见TechGrow
// @namespace    com.blackfat91
// @version      2024-08-30
// @description  通过禁止techgrow的请求来阻止TechGrow强制公众号引流弹窗
// @author       blackfat91
// @license      WTFPL
// @match        http*://*/*
// @icon         https://open.techgrow.cn/1.2.2/static/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505897/%E5%86%8D%E8%A7%81TechGrow.user.js
// @updateURL https://update.greasyfork.org/scripts/505897/%E5%86%8D%E8%A7%81TechGrow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 在页面开始加载时，替换 document.createElement 函数，从而拦截所有 script 标签
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        if (tagName === 'script') {
            // 如果标签名是 script，则返回一个新的 script 标签对象
            return new Proxy(originalCreateElement.call(document, tagName), {
                get(target, property) {
                    if (property === 'src') {
                        // 如果读取 src 属性，则判断是否为 readmore.js，如果是则返回空字符串
                        const src = target.getAttribute('src');
                        if (src && src.endsWith('/readmore.js')) {
                            console.log(`Blocked script: ${src}`);
                            return '';
                        }
                    }
                    // 否则返回原始属性值
                    return target[property];
                },
            });
        } else {
            // 对于其他标签名，返回原始对象
            return originalCreateElement.call(document, tagName);
        }
    };
})();

