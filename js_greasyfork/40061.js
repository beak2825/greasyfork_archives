// ==UserScript==
// @name         52破解网页净化
// @namespace    http://www.infosec-wiki.com/
// @version      1.0
// @description  52破解网页净化，去除非必要的元素
// @author       http://www.infosec-wiki.com/
// @match        https://www.52pojie.cn/*
// @grant        none
// @run-at       document-end
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/40061/52%E7%A0%B4%E8%A7%A3%E7%BD%91%E9%A1%B5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/40061/52%E7%A0%B4%E8%A7%A3%E7%BD%91%E9%A1%B5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("div.bm.bml.pbn").hide();
    $("td.plc.plm").hide();
    $("div.plc.dnch_eo_pt").hide();
    $("div.dnch_eo_pt").hide();
    $("dl.rate").hide();
})();