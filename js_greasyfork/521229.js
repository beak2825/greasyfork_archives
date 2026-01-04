// ==UserScript==
// @name         外链跳转去除确认
// @description  打开第三方外链时跳过确认页面，仅支持部分网站
// @namespace    https://greasyfork.org/zh-CN/users/948411
// @version      1.1
// @author       Moe
// @license      MIT
// @match        https://c.pc.qq.com/middlect.html?*
// @match        https://c.pc.qq.com/ios.html?*
// @match        https://docs.qq.com/scenario/link.html?*
// @match        https://cloud.tencent.com/developer/tools/blog-entry?*
// @match        https://link.zhihu.com/?*
// @match        https://link.csdn.net/?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521229/%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E5%8E%BB%E9%99%A4%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/521229/%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC%E5%8E%BB%E9%99%A4%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dict = {
       "https://c.pc.qq.com/middlect.html": "pfurl",                     // QQ 电脑端
       "https://c.pc.qq.com/ios.html": "url",                            // QQ 移动端
       "https://docs.qq.com/scenario/link.html": "url",                  // 腾讯文档
       "https://cloud.tencent.com/developer/tools/blog-entry": "target", // 腾讯云
       "https://link.zhihu.com/": "target",                              // 知乎
       "https://link.csdn.net/": "target",                               // CSDN
    };

    const url = new URL(window.location.href);
    const mainUrl = url.origin + url.pathname;

    if (mainUrl in dict) {
        const params = new URLSearchParams(url.search);
        const targetUrl = new URL(decodeURIComponent(params.get(dict[mainUrl])));
        window.location.replace(targetUrl);
    }
})();