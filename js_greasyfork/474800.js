// ==UserScript==
// @name          大保健优先抢定
// @namespace    https://blog.csdn.net/FengZ1
// @version      0.6
// @description  工时统计jira
// @author       Rui
// @match        *://oa.vemic.com/massage/index/index/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vemic.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474800/%E5%A4%A7%E4%BF%9D%E5%81%A5%E4%BC%98%E5%85%88%E6%8A%A2%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/474800/%E5%A4%A7%E4%BF%9D%E5%81%A5%E4%BC%98%E5%85%88%E6%8A%A2%E5%AE%9A.meta.js
// ==/UserScript==

$('.avalible').each(function(){
   $(this).parent().html("<div class='batch-cnt action master-reserve' onclick='reserveMassage(this);'>超前预定</div>");
});












