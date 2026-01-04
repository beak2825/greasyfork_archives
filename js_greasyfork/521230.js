// ==UserScript==
// @name         禁用字体限制
// @description  解除一些网站强制使用 Windows 系统字体的限制
// @namespace    https://greasyfork.org/zh-CN/users/948411
// @version      1.0
// @author       Moe
// @license      MIT
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStytle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521230/%E7%A6%81%E7%94%A8%E5%AD%97%E4%BD%93%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/521230/%E7%A6%81%E7%94%A8%E5%AD%97%E4%BD%93%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 可参照以下格式适配网站
    const dict = {
       "github.com": "body, .markdown-body",
       "keylol.com": "body, .xst",
       "www.zhihu.com": "body",
       "zhuanlan.zhihu.com": "body",
       "www.miyoushe.com": "body",
       "blog.csdn.net": "body, .htmledit_views, #csdn-toolbar *,#csdn_tool_otherPlace *",
       "www.uaa.com": "*",
       "www.pixiv.net": "*",
       "mall.bilibili.com": "*",
       "www.jd.com": "*",
       "item.jd.com": "*",
       "order.jd.com": "*",
       "home.jd.com": "*",
       "app.jd.com": "*",
       "www.taobao.com": "*",
       "i.taobao.com": "*",
       "2.taobao.com": "*",
    };
    const url = new URL(window.location.href);

    if (url.host in dict) {
        const style = document.createElement('style');
        style.textContent = dict[url.host] + ` { font-family: sans-serif !important; }`;
        document.head.appendChild(style);
    }
})();
