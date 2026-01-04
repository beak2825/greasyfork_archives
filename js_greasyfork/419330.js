// ==UserScript==
// @name         clear_mark
// @namespace    clear_mark
// @description  清除水印
// @homepageURL  https://greasyfork.org/scripts/dingtao/clear_mark
// @version      1.0.1
// @include      https://global-oss*
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @connect      oapi.dingtalk.com
// @connect      jinshuju.net
// @run-at       document-idle
// @author       dingtao
// @copyright    dingtao@hellofun.cn
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419330/clear_mark.user.js
// @updateURL https://update.greasyfork.org/scripts/419330/clear_mark.meta.js
// ==/UserScript==
 
var url = window.location.href;

if (url.indexOf("https://global-oss.zmqdez.com/") >= 0) {
    let wtm = $("div#wtm").remove();
}