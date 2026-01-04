// ==UserScript==
// @name         MT_任务编号
// @namespace    http://www.csgxcf.com/
// @version      1.1.11
// @description  "美团辅助"
// @author       nkg
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @match        https://*.magicmirror.sankuai.com/*
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/425556/MT_%E4%BB%BB%E5%8A%A1%E7%BC%96%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/425556/MT_%E4%BB%BB%E5%8A%A1%E7%BC%96%E5%8F%B7.meta.js
// ==/UserScript==
(function() {
//测试1.0.0
//首次更新
//测试用户脚本更新
//cywssb
//zzqssb
//zzqssb2
//xxxxx
//1.1111
    'use strict';
    let taskNumAr = [849, 853 , 920, 923, 1073, 1028];
    let taskNum = document.getElementsByName("taskNo")[0];
    setInterval(() => {
        if(taskNumAr.indexOf(Number(taskNum.value)) == -1 && document.activeElement != taskNum){
            taskNum.value = "";
            clearInterval();
        }
    }, 300);
})();