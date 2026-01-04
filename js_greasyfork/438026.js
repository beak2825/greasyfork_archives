// ==UserScript==
// @name        链家自动计算公摊
// @namespace   Violentmonkey Scripts
// @match       https://*.lianjia.com/ershoufang/*.html
// @grant       none
// @version     1.0
// @author      Ybond
// @description 2021/11/16 下午2:34:13
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438026/%E9%93%BE%E5%AE%B6%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97%E5%85%AC%E6%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/438026/%E9%93%BE%E5%AE%B6%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97%E5%85%AC%E6%91%8A.meta.js
// ==/UserScript==
//建筑面积
let jzmj = $("#introduction .content ul>li:eq(2)").html().replace('<span class="label">建筑面积</span>','').replace("㎡","");
//套内面积
let tnmj = $("#introduction .content ul>li:eq(4)").html().replace('<span class="label">套内面积</span>','').replace("㎡","");

if(isNumber(tnmj)&&isNumber(jzmj)){
  //公摊面积
  let gtmj = ((jzmj-tnmj)/jzmj*100).toFixed(2)+"%";
  $(".content .price .text .unitPrice").append('<span style="margin-left: 50px;">'+gtmj+'</span>');
}

function isNumber(val) {
　　if (parseFloat(val).toString() == "NaN") {
　　　　
　　　　return false;
　　} else {
　　　　return true;
　　}
}