// ==UserScript==
// @name         剪贴板删除多余内容|remove clipboard redundant content
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除掘金|知乎|?|网站剪贴板插入的版权信息等内容
// @author       You
// @match        /^https:\/\/(www\.)?(juejin|zhihu)\.(cn|com)$/
// @match https://*.zhihu.com/*
// @match https://*.juejin.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462616/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%88%A0%E9%99%A4%E5%A4%9A%E4%BD%99%E5%86%85%E5%AE%B9%7Cremove%20clipboard%20redundant%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/462616/%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%88%A0%E9%99%A4%E5%A4%9A%E4%BD%99%E5%86%85%E5%AE%B9%7Cremove%20clipboard%20redundant%20content.meta.js
// ==/UserScript==

document.addEventListener('copy', function(e) {
    e.stopPropagation()
    if (e.clipboardData) {
        e.clipboardData.setData('text/plain', window.getSelection().toString())
    }
}, true)