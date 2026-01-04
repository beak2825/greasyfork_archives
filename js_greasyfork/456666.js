// ==UserScript==
// @name         青铜器FIX
// @version      1.0
// @description  解除7日限制
// @author       Zruiry
// @match        https://qtq.e-tecsun.com/**
// @grant        none
// @namespace    Zruiry
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456666/%E9%9D%92%E9%93%9C%E5%99%A8FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/456666/%E9%9D%92%E9%93%9C%E5%99%A8FIX.meta.js
// ==/UserScript==

//$(function() {
    function taskReport_checkDay() {
    	openLoader();
    	var e = $("li[field='report_action_date'] textarea"); 
    	a = e.val() 
    	taskReport_init(false, a);
    	closeLoader()
    }
//})();