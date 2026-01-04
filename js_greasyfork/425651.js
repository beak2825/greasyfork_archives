// ==UserScript==
// @name        合工大党课刷课辅助脚本-直接快进到视频倒数第一秒处-暂停视频再播放触发脚本功能
// @namespace   Violentmonkey Scripts
// @match       *://wsdx.hfut.edu.cn/fzdx/lesson/*
// @match       *://wsdx.hfut.edu.cn/ybdy/lesson/*
// @match       *://wsdx.hfut.edu.cn/*
// @grant       none
// @version     0.013
// @author      longskyer
// @require     http://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/plyr/3.6.4/plyr.js
// @run-at       document-end
// @description  合工大党课视频刷课辅助，时间有限，抛砖引玉。偶尔不行，可以暂停视频、播放视频，触发脚本的功能。
// @downloadURL https://update.greasyfork.org/scripts/425651/%E5%90%88%E5%B7%A5%E5%A4%A7%E5%85%9A%E8%AF%BE%E5%88%B7%E8%AF%BE%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC-%E7%9B%B4%E6%8E%A5%E5%BF%AB%E8%BF%9B%E5%88%B0%E8%A7%86%E9%A2%91%E5%80%92%E6%95%B0%E7%AC%AC%E4%B8%80%E7%A7%92%E5%A4%84-%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91%E5%86%8D%E6%92%AD%E6%94%BE%E8%A7%A6%E5%8F%91%E8%84%9A%E6%9C%AC%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/425651/%E5%90%88%E5%B7%A5%E5%A4%A7%E5%85%9A%E8%AF%BE%E5%88%B7%E8%AF%BE%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC-%E7%9B%B4%E6%8E%A5%E5%BF%AB%E8%BF%9B%E5%88%B0%E8%A7%86%E9%A2%91%E5%80%92%E6%95%B0%E7%AC%AC%E4%B8%80%E7%A7%92%E5%A4%84-%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91%E5%86%8D%E6%92%AD%E6%94%BE%E8%A7%A6%E5%8F%91%E8%84%9A%E6%9C%AC%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
  
  function buttonHandler(){
    players[0].forward((players[0].getDuration())-1)
  }
  
  function bFun(){
      var BtnPublicSubmit=document.getElementsByClassName("public_submit")[0]
      if(BtnPublicSubmit){
         BtnPublicSubmit.addEventListener("click", buttonHandler)
      }
     
  }
  $('.plyr__play-large').on('click',buttonHandler)
  setInterval(bFun,1000)
  
})();