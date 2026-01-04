// ==UserScript==
// @name         禁止刷新
// @namespace    undefined
// @version      0.0.1
// @description  自用去广告
// @author       Ann
// @match        https://bbs1.bs8899.net/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/33510/%E7%A6%81%E6%AD%A2%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/33510/%E7%A6%81%E6%AD%A2%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==
$(document).ready(function () {
    document.getElementById("imggameApp").remove();
    document.getElementById("divSuBao").remove();
    hRefresh = 999;
    $('div[class="onlineService"]').remove();
    $('div[class="boxJszc"]').remove();
    $('div[class="bottomR"]').remove();
    document.getElementById("mytime").remove();
    //document.getElementById("right").remove();
    $('div[class="cmArea"]').remove();
});