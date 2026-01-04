// ==UserScript==
// @name         安乐净 - 1. 起点
// @author       Jones Miller
// @version      23.04.01
// @namespace    https://t.me/jsday
// @description  可隐藏页面部分元素 - app下载、阅读ad、评论等...；电脑端、移动端通用。
// @include      *://*.qidian.com/*
// @include      *://*.qdmm.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/442127/%E5%AE%89%E4%B9%90%E5%87%80%20-%201%20%E8%B5%B7%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/442127/%E5%AE%89%E4%B9%90%E5%87%80%20-%201%20%E8%B5%B7%E7%82%B9.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var host=window.location.host;
  if(host.indexOf("book.qidian.com")!=-1){
    setInterval (function() {
      var jmqdre=document.querySelectorAll("#downloadAppBtn,#honor,.page-bottom-item,.fans-zone,.games-op-wrap,.recommend-book,.other-works,#fansRankWrap,#topFansWrap,.weekly-hot-rec");

      for(var i=0;i<jmqdre.length;i++){
        jmqdre[i].style='display:none;';
      };
    },0);
  };
  if(host.indexOf("read.qidian.com")!=-1){
    setInterval (function() {
      var jmqdrre=document.querySelectorAll(".qdlogin-wrap,.mask,#j_phoneRead,#j_navGameBtn,#j_rightBarList,.admire-wrap,.chapter-end-qrcode,.review-count,#page-ops,.weekly-hot-rec");
      for(var i=0;i<jmqdrre.length;i++){
        jmqdrre[i].style='display:none;';
      };
    },0);
  };
  if(host.indexOf("m.qidian.com")!=-1){
    setInterval (function() {
      var jmmqdre=document.querySelectorAll(".header-operate,#homeDown,#aUserCenter,.loginWrapper_LVXRr,#app-dl,#footerApp,#searchLead,.searchLead_FhjQE,#bookDetailDownload,.read-comment-total,.review-count,#appDownloadNext,#vue-components,.read-resource-tips,.read-author-say,.expand-hot-comment,.txt-read");
      var jmmqdsy=document.querySelectorAll(".footer-section");
      var jmmqdhm=document.querySelectorAll("#noLoginRead");
      for(var i=0;i<jmmqdre.length;i++){
        jmmqdre[i].style='display:none;';
      };
      /*for(var i=0;i<jmmqdsy.length;i++){
        jmmqdsy[i].style.bottom='-50px';
      };
      for(var i=0;i<jmmqdhm.length;i++){
        jmmqdhm[i].style='position:absolute;bottom:300%;right:50%;transform:translate(50%);';
      };
      document.querySelector("#recentlyRead").style.bottom="0rem";*/
    },0);
  };

})();