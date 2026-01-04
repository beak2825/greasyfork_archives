// ==UserScript==
// @name         添加 CSS 样式
// @namespace    http://tampermonkey.net/
// @version      v1.0.0
// @description  向网页中添加 style 标签和自定义的 CSS 规则
// @author       iuroc
// @match        https://developer.huawei.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huawei.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518969/%E6%B7%BB%E5%8A%A0%20CSS%20%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/518969/%E6%B7%BB%E5%8A%A0%20CSS%20%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict'
    const CONFIG = [
        {
            rule: () => location.hostname == 'developer.huawei.com',
            style: `
                .linenums {
                    font-family: Consolas;
                }

                .feedback-btn.ng-star-inserted,
                .app-doc-footer,
                .suspension-menu,
                .pcAccount.flex.ac.js.newStyle {
                    display: none !important;
                }
            `
        }
    ]

    CONFIG.forEach(item => {
        if (item.rule()) {
            const element = document.createElement('style')
            element.innerText = item.style
            document.body.append(element)
        }
    })
})()