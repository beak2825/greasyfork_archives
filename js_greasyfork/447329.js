// ==UserScript==
// @name         lhouse buy assist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script checks for the buy button change and clicks it if it's detected.
// @author       uucreate
// @license           AGPL License
// @match        https://*.damai.cn/*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447329/lhouse%20buy%20assist.user.js
// @updateURL https://update.greasyfork.org/scripts/447329/lhouse%20buy%20assist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function buerClickTimer() {
       return new Promise(resolve => {
           let timerBuyer = setInterval(() => {
               var buttoner = document.querySelector(".buybtn");
               if (buttoner){
                  console.log("text", buttoner.textContent);
                  if (buttoner.textContent.indexOf('购买')!= -1){
                      buttoner.click();
                      clearInterval(timerBuyer);
                  }
              }
      }, 100);
    });
   }
   function sumbitOrder(){
       return new Promise(resolve => {
           let timerSubmit = setInterval(() => {
               var submiter = document.querySelector(".submit-wrapper");
               if (submiter){
                   var submit_button = submiter.getElementsByTagName('button');
                   if (submit_button && submit_button[0]){
                       console.log("text", submit_button[0].textContent);
                       if (submit_button[0].textContent.indexOf('提交订单')!= -1){
                           addBuyer();
                           submit_button[0].click();
                           clearInterval(timerSubmit);
                       }
                   }
              }
      }, 100);
   });
   }
   function addBuyer(){
       var buyer = document.querySelectorAll("span.next-checkbox-label");
       for (var i = 0; i < buyer.length; i++) {
          var buyer_one = buyer[i];
          if (buyer_one.className == 'next-checkbox-label') {
              buyer_one.click();
          }
       }
   };
    buerClickTimer();
    sumbitOrder();
    var original_str = window.location.href;
    console.log("ori", original_str);
    if (original_str.indexOf("https://buy.damai.cn/multi/flow?http_referer=") != -1){
        var dest_url = original_str.replace("https://buy.damai.cn/multi/flow?http_referer=", "")
        window.location.href = dest_url;
    };
})();
