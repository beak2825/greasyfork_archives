// ==UserScript==
// @name         zerotier优化表格
// @namespace    http://tampermonkey.net/
// @version      2024-11-04
// @description  zerotier优化表格显示
// @author       You
// @match        http://150.158.96.68:3000/controller/network/e0adf72926401e5e
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=96.68
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532601/zerotier%E4%BC%98%E5%8C%96%E8%A1%A8%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/532601/zerotier%E4%BC%98%E5%8C%96%E8%A1%A8%E6%A0%BC.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    $("table tr").find("td:last").css("max-height","28px").css("min-width","180px").css("overflow","hidden").css("display","block");
})();