// ==UserScript==
// @name        爱奇艺优酷腾讯视频去播放水印
// @namespace   Violentmonkey Scripts
// @match       *://v.qq.com/*
// @match       *://*.iqiyi.com/*
// @match       *://*.youku.com/*
// @grant       none
// @version     1.0
// @AuThor 吾爱热心网友
// @description 2021/10/18 下午6:46:11
// @downloadURL https://update.greasyfork.org/scripts/434097/%E7%88%B1%E5%A5%87%E8%89%BA%E4%BC%98%E9%85%B7%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%8E%BB%E6%92%AD%E6%94%BE%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/434097/%E7%88%B1%E5%A5%87%E8%89%BA%E4%BC%98%E9%85%B7%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%8E%BB%E6%92%AD%E6%94%BE%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==
(function(){
  var myCss= document.createElement('style');
  myCss.innerHTML ='.txp_waterMark_pic,.logo-new,.iqp-logo-box{display:none!important;}';
  document.body.appendChild(myCss);
  void(0);
}
)();