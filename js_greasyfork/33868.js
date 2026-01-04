// ==UserScript==
// @name         笔趣阁去广告
// @namespace    undefined
// @version      0.0.1
// @description  自用去广告
// @author       Ann
// @match        *www.qu.la/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/33868/%E7%AC%94%E8%B6%A3%E9%98%81%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/33868/%E7%AC%94%E8%B6%A3%E9%98%81%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
$(document).ready(function () {
    $('div[id="_xlhw_po__03_1897466117"]').remove();
    $('a[id="ads-a_z_1897466117"]').remove();
});