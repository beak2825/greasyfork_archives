// ==UserScript==
// @name         销售出货单
// @namespace    http://print.jiqinyun.com/
// @version      0.17
// @description  Invoice Title Change Private By hjg
// @author       HuangjianGuo
// @include        *://print.jiqinyun.com/html/erp/stockOrder*
// @include        *:/.jiqinyun.com/erp*
// @grant        GM_setValue
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/470882/%E9%94%80%E5%94%AE%E5%87%BA%E8%B4%A7%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/470882/%E9%94%80%E5%94%AE%E5%87%BA%E8%B4%A7%E5%8D%95.meta.js
// ==/UserScript==

let flg=true;
let counter_fix=0;
let counter_cus=0;
let T_arr=new Array(
{"name": "zxwy","desc": "\u798f\u5dde\u5e02\u95fd\u4faf\u632f\u5174\u709c\u4e1a\u673a\u68b0\u6709\u9650\u516c\u53f8"},
{"name": "suel","desc": "\u798f\u5dde\u901f\u6613\u8054\u7535\u6c14\u6709\u9650\u516c\u53f8"},
{"name": "suel-wh","desc": "\u6b66\u6c49\u901f\u6613\u8054\u667a\u80fd\u88c5\u5907\u6709\u9650\u516c\u53f8"}
);
let I_tail='(销售发货单)';
(function() {
    'use strict';
    setTimeout(function(){
    let invoice_fix_event=document.querySelector("h1.companyName.headTitle");
    if (!invoice_fix_event){
        console.log("fixed element not found");
    }else{
     invoice_fix_event.addEventListener("click",function(){
             let index=counter_fix%T_arr.length;
             invoice_fix_event.innerHTML=unescape(T_arr[index].desc);
             counter_fix++;
     })};
    let invoice_custom_event=document.querySelector("div.texts.center");
    if(!invoice_custom_event){
        console.log("custom element not found");
    }else{
    console.log("custom found");
             invoice_custom_event.addEventListener("click",function(){
             let index=counter_cus%T_arr.length;
             invoice_custom_event.innerHTML=unescape(T_arr[index].desc+I_tail);
             counter_cus++;
     })
   } //end else
  },300)

})();
