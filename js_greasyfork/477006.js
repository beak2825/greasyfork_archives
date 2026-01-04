// ==UserScript==
// @name         一直刷新页面
// @namespace    https://blog.csdn.net/
// @version      0.4
// @description  zh-cn
// @author       hh
// @license      MIT
// @match        https://www.baidu.*/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/477006/%E4%B8%80%E7%9B%B4%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/477006/%E4%B8%80%E7%9B%B4%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
fresh();
function fresh(){
setTimeout("location.reload()",2000);
}
