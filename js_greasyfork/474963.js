// ==UserScript==
// @name              【屏蔽广告弹出】
// @namespace    http://greasyfork.org
// @version           4.801
// @description 去除弹出广告
// @icon    data:image/png;base64,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
// @match        *://*.baidu.com/*
// @match        *://*.google.com/*
// @match        *://*.bing.com/*
// @match        *://*.so.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.douban.com/*
// @match        *://*.weibo.com/*
// @match        *://twitter.com/*
// @match        *://*.youtube.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.csdn.net/*
// @match        *://*.91118.com/*
// @match        *://*/*
// @inject-into content
// @require https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require https://cdn.staticfile.org/sweetalert/2.1.2/sweetalert.min.js
// @require https://cdn.staticfile.org/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require https://cdn.staticfile.org/html2canvas/0.5.0-beta4/html2canvas.js
// @require https://cdn.staticfile.org/echarts/5.0.1/echarts.min.js
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @run-at document-start
// @grant             unsafeWindow
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_openInTab
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM_info
// @grant             GM_notification
// @grant             GM_getResourceText
// @grant             GM_openInTab
// @grant             GM_download
// @license             End-User License Agreement
// @noframes
// @connect     zhihu.com
// @connect     baidu.com
// @connect     baiducontent.com
// @connect     dadiyouhui02.cn
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/474963/%E3%80%90%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E5%BC%B9%E5%87%BA%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/474963/%E3%80%90%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A%E5%BC%B9%E5%87%BA%E3%80%91.meta.js
// ==/UserScript==


setInterval(function() {
var div = document.querySelector('.alterDom');
div.remove();
var div1 = document.querySelector('.alterclose');
div1.remove();
var div2 = document.querySelector('.alterBox.mask');
div2.remove();
}, 1000);