// ==UserScript==
// @name         采购收货单
// @namespace    http://yun.jiqinyun.com/
// @version      0.01
// @description  Skyward
// @author       HuangjianGuo
// @match        *://yun.jiqinyun.com/erp*
// @grant        GM_setValue
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/426653/%E9%87%87%E8%B4%AD%E6%94%B6%E8%B4%A7%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/426653/%E9%87%87%E8%B4%AD%E6%94%B6%E8%B4%A7%E5%8D%95.meta.js
// ==/UserScript==


if ( ! /#\/printIndex\?dynamicPrintTemplateId=45.*/.test(location.hash) )return;

let flg=true;
let counter_fix=0;
let counter_cus=0;
let T_arr=new Array({"name": "svlis","desc": "\u798f\u5efa\u897f\u5a01\u8054\u7535\u6c14\u6709\u9650\u516c\u53f8"},{"name": "zxwy","desc": "\u798f\u5dde\u5e02\u95fd\u4faf\u632f\u5174\u709c\u4e1a\u673a\u68b0\u6709\u9650\u516c\u53f8"},{"name": "suel","desc": "\u798f\u5dde\u901f\u6613\u8054\u7535\u6c14\u6709\u9650\u516c\u53f8"});
let I_tail='\u91c7\u8d2d\u6536\u8d27\u5355';
(function() {
    'use strict';
    setTimeout(function(){
    let purchaseReceiptTitleParentEle=document.querySelector("div.texts.center");
    if (!purchaseReceiptTitleParentEle){
        console.log("element not found");
    }else{
     purchaseReceiptTitleParentEle.addEventListener("click",function(){
             let HeadTitle=document.createElement('p');
             HeadTitle.innerHTML=I_tail;
             HeadTitle.setAttribute("style","margin-top:20px");
             let index=counter_fix%T_arr.length;
             purchaseReceiptTitleParentEle.innerHTML=unescape(T_arr[index].desc);
             purchaseReceiptTitleParentEle.setAttribute('line-height',"20px");
             purchaseReceiptTitleParentEle.appendChild(HeadTitle);
             counter_fix++;
     })}

  },300)

})();