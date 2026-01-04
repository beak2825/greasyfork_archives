// ==UserScript==
// @name         链接在当前页打开
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  让链接在当前页打开
// @author       Brayden
// @license      AGPL-3.0-or-later
// @icon         data:image/svg+xml;base64, PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA2NTkwMjI5NzY1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxNDI0IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiPjxwYXRoIGQ9Ik01MTIgNTEybS01MTIgMGE1MTIgNTEyIDAgMSAwIDEwMjQgMCA1MTIgNTEyIDAgMSAwLTEwMjQgMFoiIGZpbGw9IiNmN2Q4NTYiIHAtaWQ9IjIxNDI1Ij48L3BhdGg+PC9zdmc+
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486027/%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/486027/%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 选择器以匹配您想要修改的a标签
    const selector = 'a';

    // 打开新标签页的函数
    function setOpenInSelfTab() {
        let externalLinks = document.querySelectorAll(selector);
        // externalLinks = Array.from(externalLinks).filter(link => !link.getAttribute('href').startsWith('#'));
        externalLinks.forEach(function (link) {
            if (link.target !== '_self') {
                link.target = '_self';
            }
        });
    }


    // 监听DOM变化的函数
    function observePageChanges() {
        var observer = new MutationObserver(mutations => {
            setOpenInSelfTab();
        });
        var config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }

    // 初始化
    setOpenInSelfTab();
    observePageChanges();
})();
