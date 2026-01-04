// ==UserScript==
// @name         	Jenkins编译参数筛选
// @version      	2.3.2
// @namespace		https://izmj.net
// @license		    MIT
// @description  	进行编译的时候，提供额外的筛选按钮。如果功能不好使，请查看match路径是否正确
// @require		    https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require		    https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js
// @resource		select2css https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css
// @grant		    GM_addStyle
// @grant		    GM_getResourceText
// @match		    *://*/*job/*/build*
// @match		    *://*/view/*/job/*/build*
// @run-at       	document_end
// @icon64          https://gitee.com/izmj/web_js/raw/main/img/zmj.png
// @downloadURL https://update.greasyfork.org/scripts/494230/Jenkins%E7%BC%96%E8%AF%91%E5%8F%82%E6%95%B0%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/494230/Jenkins%E7%BC%96%E8%AF%91%E5%8F%82%E6%95%B0%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

var select2css = GM_getResourceText("select2css");
GM_addStyle(select2css);

$("select").select2({
    dropdownAutoWidth: true,
    width: 'style',
    maximumSelectionLength: 0,
});

$(document).ready(function () {
    $("select").select2({
        dropdownAutoWidth: true,
        width: 'style',
        maximumSelectionLength: 0,
    });
});