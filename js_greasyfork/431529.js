// ==UserScript==
// @name         daily report
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fucking daily report
// @author       You
// @match        https://ssc.sjtu.edu.cn/f/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431529/daily%20report.user.js
// @updateURL https://update.greasyfork.org/scripts/431529/daily%20report.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var timeinterval = 100000;
    var timer1 = setInterval(function(){
         var date = new Date();
         if (date.getHours() == 7) {
             var path = "/html/body/qf-root/qf-pages/qf-app-item/qf-app-initiate/div/div/qf-initiate-apply/div/div[1]/div[2]/button[2]";
             var button=document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
             button.click();
         }
     }, timeinterval);
    var timer2 = setInterval(function(){
         var date = new Date();
         if (date.getHours() == 6) {
             var refresh = "/html/body/qf-root/qf-pages/qf-app-item/qf-submit-success/div/qf-apply-success/div[2]/button[1]";
             var refreshbutton=document.evaluate(refresh, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
             refreshbutton.click();
         }
     }, timeinterval);
})();