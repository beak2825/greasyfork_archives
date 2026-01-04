// ==UserScript==
// @name         Microsoft Docs 重定向
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将英文网页重定向到中文网页
// @author       greasyblade
// @include      https://docs.microsoft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386927/Microsoft%20Docs%20%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/386927/Microsoft%20Docs%20%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

if (document.location.href.includes('en-us')) {
    document.location.href = document.location.href.replace('en-us', 'zh-cn');
}