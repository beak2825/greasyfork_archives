// ==UserScript==
// @name         test
// @namespace    test
// @description  审核过程的错误提示, Error tips during the review process
// @homepageURL  https://greasyfork.org/scripts/test
// @version      1.9.1
// @exclude      https://global-oss.zmqdez.com/front_end/index.html#/country
// @include      https://global-oss*
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @connect      oapi.dingtalk.com
// @connect      jinshuju.net
// @run-at       document-idle
// @author       zhousanfu
// @copyright    2020 zhousanfu@hellofun.cn
// @downloadURL https://update.greasyfork.org/scripts/411372/test.user.js
// @updateURL https://update.greasyfork.org/scripts/411372/test.meta.js
// ==/UserScript==

var url = window.location.href;

if (url.indexOf("tags/audit/video") >= 0) {
    console.log("aaaaaa")

}