// ==UserScript==
// @name         x.i.u知乎搜索框净化改进版本
// @namespace    http://tampermonkey.net/
// @version      24.12.11.21.14
// @description  搜索框净化!
// @author       onionycs
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/520394/xiu%E7%9F%A5%E4%B9%8E%E6%90%9C%E7%B4%A2%E6%A1%86%E5%87%80%E5%8C%96%E6%94%B9%E8%BF%9B%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/520394/xiu%E7%9F%A5%E4%B9%8E%E6%90%9C%E7%B4%A2%E6%A1%86%E5%87%80%E5%8C%96%E6%94%B9%E8%BF%9B%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    // 推荐安装 xiu的脚本 https://greasyfork.org/scripts/419081
    // 先来个3秒中的
    function f() {
        const elements = document.querySelectorAll('input[placeholder]');
        elements.forEach(element => {
            if (element) {
                element.placeholder = "";
            }
        });
    }

    let executionCount = 0;
    const interval = setInterval(() => {
        f();
        executionCount++;
        if (executionCount >= 30) {
            clearInterval(interval);
        }
    }, 100);

    setInterval(() => {
        document.querySelectorAll('input[placeholder]').forEach(input => {
            if (input.placeholder !== '') {
                input.placeholder = '';
            }
        });
    }, 1000); // 1 second interval

})();