// ==UserScript==
// @name         解除知识星球选择内容及复制限制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持星球首页、搜索结果页、文章页，改进自：https://greasyfork.org/zh-CN/scripts/428027-%E8%A7%A3%E9%99%A4%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6
// @author       vimcaw
// @match        *://*.zsxq.com/*
// @icon         https://www.google.com/s2/favicons?domain=zsxq.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459889/%E8%A7%A3%E9%99%A4%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E9%80%89%E6%8B%A9%E5%86%85%E5%AE%B9%E5%8F%8A%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/459889/%E8%A7%A3%E9%99%A4%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E9%80%89%E6%8B%A9%E5%86%85%E5%AE%B9%E5%8F%8A%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeLimitation() {
        const disabledCopyElements = document.querySelectorAll('.disabled-copy, .js-disable-copy');
        if (disabledCopyElements) {
            disabledCopyElements.forEach(element => {
                element.classList.remove('disabled-copy');
                element.classList.remove('js-disable-copy');
            });
        }
        const watermarkElements = document.querySelectorAll('[watermark]');
        if (watermarkElements) {
            watermarkElements.forEach(element => {
                element.setAttribute('style', 'padding: 10px;')
            });
        }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(removeLimitation);

    // Start observing the target node for configured mutations
    observer.observe(document.body, { childList: true, subtree: true });
    removeLimitation();
})();