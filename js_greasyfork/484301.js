// ==UserScript==
// @name         网络剪贴板(netcut)代码高亮
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  使用网络剪贴板分享代码可以高亮
// @author       AN drew
// @match        https://netcut.cn/*
// @require      https://cdn.bootcdn.net/ajax/libs/prettify/r298/run_prettify.min.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484301/%E7%BD%91%E7%BB%9C%E5%89%AA%E8%B4%B4%E6%9D%BF%28netcut%29%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/484301/%E7%BD%91%E7%BB%9C%E5%89%AA%E8%B4%B4%E6%9D%BF%28netcut%29%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
#noteContent{
	display:none!important
}
.pre-box{
	visibility:visible!important
    `)
    $('head').append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/prettify/r298/prettify.min.css">');
    $('.pre-box').addClass('prettyprint')
})();