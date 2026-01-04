// ==UserScript==
// @name         test
// @namespace    test
// @description  test2
// @homepageURL  https://greasyfork.org/zh-CN/scripts/test
// @version      0.02
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
// @downloadURL https://update.greasyfork.org/scripts/415508/test.user.js
// @updateURL https://update.greasyfork.org/scripts/415508/test.meta.js
// ==/UserScript==


window.onload = function() {
    if (window.location.href.indexOf("appeal/index") >= 0) {
        setInterval(function(){
            console.log("test")
        }, 1000);
    };

}