// ==UserScript==
// @name         Fuck MarsCode
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  禁用稀土掘金文章中讨厌的浮动AI提问按钮
// @author       You
// @match        https://juejin.cn/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499391/Fuck%20MarsCode.user.js
// @updateURL https://update.greasyfork.org/scripts/499391/Fuck%20MarsCode.meta.js
// ==/UserScript==

const selectors = [
    // 浮动提问按钮
    '.context-menu',
    // 右下角悬浮按钮
    '.btn.btn-ai',
    // 行内代码块按钮
    '.code-block-extension-headerRight > .render',
    // 文章顶部的文章总结
    '.article-summary'
]

const innerHTML = selectors.map(selector => `${selector} {\n    display: none !important;\n}`).join('\n\n')

const style = document.createElement('style')
style.innerHTML = innerHTML
style.setAttribute('data-from', 'fuck-mars-code')
document.head.appendChild(style)