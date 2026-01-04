// ==UserScript==
// @name         沪江去除广告脚本
// @name:zh  沪江词典去广告
// @description:zh-cn 沪江词典去除首尾广告
// @namespace Violentmonkey Scripts
// @match    http://www.hjdict.com/*
// @author    Tin Kyoku
// @create   2019-11-13
// @grant    none
// @version  1.1
// @run-at   document-end
// @namespace http://tampermonkey.net/
// @license         GPL-3.0-only
// @description 沪江词典去除首尾广告
// @downloadURL https://update.greasyfork.org/scripts/392366/%E6%B2%AA%E6%B1%9F%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/392366/%E6%B2%AA%E6%B1%9F%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


window.onload = function(){
  var reg = new RegExp(/^[_]{1}[a-zA-Z0-9]{7,12}$/);
  
  isExistReg();

  if ($('.ad').length > 0) { 
    $('.ad').remove();
  } else {
    console.log("element has been removed");
  }

  function isExistReg(){
    for(i=0;i<50;i++){
      var tempStr = $("div").eq(i).attr("id");
      if(typeof(tempStr)=="undefined"){
        continue;    
      } else {
        if(reg.test(tempStr)){
          //console.log(tempStr);          
          $("#"+tempStr).remove();          
        }else{
          //console.log("BUG");
        }    
      }
    }
  } 
};