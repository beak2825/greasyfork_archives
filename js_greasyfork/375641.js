// ==UserScript==
// @name         知乎免登录[2018]
// @namespace    Aloxaf_i
// @version      0.1.1
// @description  一个很简单的脚本, 直接跳转到发现页面
// @author       Aloxaf
// @match        https://www.zhihu.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/375641/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95%5B2018%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/375641/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95%5B2018%5D.meta.js
// ==/UserScript==

if (/www\.zhihu\.com\/sign(up|in)/.test(location.href)) {
    location.href = 'https://www.zhihu.com/explore';
}
