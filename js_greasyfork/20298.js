
// ==UserScript==
// @name         去除知乎跳转
// @namespace    https://greasyfork.org/en/users/22079-hntee
// @version      0.1
// @author       hntee
// @match        http://*.zhihu.com/*
// @match        https://*.zhihu.com/*
// @description 去除知乎跳转的链接
// @downloadURL https://update.greasyfork.org/scripts/20298/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/20298/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


$('a[href^="//link.zhihu.com/?target=').attr('href', function (i, attr) {
    return decodeURIComponent(attr).replace('//link.zhihu.com/?target=', '');
});


