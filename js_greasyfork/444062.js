// ==UserScript==
// @name         改变鼠标样式
// @namespace    https://b.cliwen.com
// @version       1.1
// @description    改变页面鼠标样式
// @author       mengle
// @match        *://*/*
// @icon         https://q.qlogo.cn/headimg_dl?dst_uin=1141605242&spec=100
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444062/%E6%94%B9%E5%8F%98%E9%BC%A0%E6%A0%87%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/444062/%E6%94%B9%E5%8F%98%E9%BC%A0%E6%A0%87%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //定义官网
    const gwurl = "https://b.cliwen.com";
    let csshtml = "body { background-image: url(" + gwurl + "/help/images/bg.png); }  html { cursor: url(" + gwurl + "/help/images/cur/default.cur),auto; }  a:hover { cursor: url(" + gwurl + "/help/images/cur/link.cur),auto; } ";
    let cssFix = document.createElement('style');
    cssFix.innerHTML = csshtml;
    document.getElementsByTagName('head')[0].appendChild(cssFix);
})();