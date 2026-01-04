// ==UserScript==
// @name         苏宁自动选中礼品卡
// @namespace    http://tampermonkey.net/
// @version      1.91
// @description  try to take over the world!
// @author       You
// @match        https://shopping.suning.com/order.do?cart2No=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34988/%E8%8B%8F%E5%AE%81%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E7%A4%BC%E5%93%81%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/34988/%E8%8B%8F%E5%AE%81%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E7%A4%BC%E5%93%81%E5%8D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
            
    // Your code here..

    window.setTimeout(function() { $('a[name=new_icart2_account_usecard]').click();}, 1000);//1秒钟后点击苏宁卡
    window.setTimeout(function() {document.getElementById('j_cartNO_8900030010364843').click();}, 1500);//
    window.setTimeout(function() {document.getElementById('j_cartNO_8900030010364835').click();}, 1510);//
   window.setTimeout(function() {document.getElementById('j_cartNO_8900030010364827').click();}, 1520);//
   window.setTimeout(function() {document.getElementById('j_cartNO_8900030010357235').click();}, 1530);//
   window.setTimeout(function() {document.getElementById('j_cartNO_8900030010360833').click();}, 1540);//
   window.setTimeout(function() {document.getElementById('j_cartNO_8900030010347905').click();}, 1550);//
   window.setTimeout(function() {document.getElementById('j_cartNO_8900030010302314').click();}, 1560);// 
   window.setTimeout(function() {document.getElementById('j_cartNO_8900030007449789').click();}, 1570);//
   window.setTimeout(function() {document.getElementById('j_cartNO_8900030008416449').click();}, 1580);//
   window.setTimeout(function() {document.getElementById('j_cartNO_8900030006539127').click();}, 1590);//
   window.setTimeout(function() {document.getElementById('j_cartNO_8900030006539135').click();}, 1600);//  
   window.setTimeout(function() {document.getElementById('j_cartNO_8900030006539143').click();}, 1610);//
   window.setTimeout(function() {document.getElementById('j_cartNO_8900030006539150').click();}, 1620);//
  window.setTimeout(function() {document.getElementById('j_cartNO_8900030006539168').click();}, 1630);//
  window.setTimeout(function() {document.getElementById('j_cartNO_8900030008501372').click();}, 1640);//
  window.setTimeout(function() {document.getElementById('j_cartNO_8900030010391259').click();}, 1640);//

})();