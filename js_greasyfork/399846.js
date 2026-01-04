// ==UserScript==
// @name        屏蔽小鬼V1.0
// @namespace   BlocktheFucks
// @match       https://space.bilibili.com/
// @grant       none
// @version     1.002
// @author      Zam
// @supportURL   https://greasyfork.org/zh-CN/scripts/399846/feedback
// @description 2020/4/7 下午10:00:01
// @downloadURL https://update.greasyfork.org/scripts/399846/%E5%B1%8F%E8%94%BD%E5%B0%8F%E9%AC%BCV10.user.js
// @updateURL https://update.greasyfork.org/scripts/399846/%E5%B1%8F%E8%94%BD%E5%B0%8F%E9%AC%BCV10.meta.js
// ==/UserScript==
var nowURL = window.location.href;
var UidBlackList = "370636234;4068988;8183564;25821992;40276353;88539705;141576879;193554570;211204159;259430587;265875183;278550113;283437176;321786072;349885000;352136480;358483458;370650692;370656826;408507598;409616682;433573690;478158316;478690234;482229303;484176544;488971091;490574166;497313745;509376790;514406739;516408293;516726120;519743978;519744138;519744542;521882262;525470276;526775122;501602326;128397235;326708278;194455578;193102215;277706125;107622021;298697575;370650897;395201794;"
var status2 = nowURL.search("https://space.bilibili.com/");
if (status2 != -1) {
var nowSecUrl = window.location.pathname;
var status3 = nowSecUrl.search("/dynamic");
  if(status3 != -1){
     var reg = new RegExp("/dynamic");
     var a = nowSecUrl.replace(reg,"");
    
     var reg = new RegExp("/album");
     var nowSecUrl = nowSecUrl.replace(reg,"");
    
     var reg = new RegExp("/video");
     var nowSecUrl = nowSecUrl.replace(reg,"");
    
     var reg = new RegExp("/channel/index");
     var nowSecUrl = nowSecUrl.replace(reg,"");
    
     var reg = new RegExp("/");
     var nowSecUrl = a.replace(reg,"");
     }
  else{
     var reg = new RegExp("/");
     var nowSecUrl = nowSecUrl.replace(reg,"");
  }
  
var status = UidBlackList.search(nowSecUrl);
  if(status != -1){
    alert("！！！这玩意可能是小将，也可能是其小号");
}
  
}

