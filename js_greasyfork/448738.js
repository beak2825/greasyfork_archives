// ==UserScript==
// @name        腾讯优酷爱奇艺西瓜PPTV视频去播放水印
// @namespace   Violentmonkey Scripts
// @match       *://v.qq.com/*
// @match       *://*.youku.com/*
// @match       *://*.iqiyi.com/*
// @match       *://*.ixigua.com/*
// @match       *://v.pptv.com/*
// @grant       none
// @version     1.1
// @AuThor 	    热心网友
// @description 2022/10/1 下午8:55:12
// @downloadURL https://update.greasyfork.org/scripts/448738/%E8%85%BE%E8%AE%AF%E4%BC%98%E9%85%B7%E7%88%B1%E5%A5%87%E8%89%BA%E8%A5%BF%E7%93%9CPPTV%E8%A7%86%E9%A2%91%E5%8E%BB%E6%92%AD%E6%94%BE%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/448738/%E8%85%BE%E8%AE%AF%E4%BC%98%E9%85%B7%E7%88%B1%E5%A5%87%E8%89%BA%E8%A5%BF%E7%93%9CPPTV%E8%A7%86%E9%A2%91%E5%8E%BB%E6%92%AD%E6%94%BE%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==
(function(){
  var myCss= document.createElement('style');
  myCss.innerHTML ='.txp-watermark,.kui-watermark-logo-layer,.iqp-logo-box,.common-xgplayer__Logo,.p-mark{display:none!important;}';
  document.body.appendChild(myCss);
  void(0);
}
)();