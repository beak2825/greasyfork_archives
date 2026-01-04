// ==UserScript==
// @name         学习强国突出显示二维码
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  只留下二维码
// @author       yaorelax
// @match        https://pc.xuexi.cn/points/login.html*
// @icon         https://www.xuexi.cn/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @license      GPL-3.0 License
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/437931/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E7%AA%81%E5%87%BA%E6%98%BE%E7%A4%BA%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/437931/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E7%AA%81%E5%87%BA%E6%98%BE%E7%A4%BA%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    $('audio').remove();
    GM_addStyle('.redflagbox, .layout-header, .layout-footer, .oath, .ddlogintext, .refresh {display: none !important;}');
    GM_addStyle('.layout-body{background-image:none !important;}');
})();