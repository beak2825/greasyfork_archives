// ==UserScript==
// @name        开源中国首页去广告
// @namespace   Violentmonkey Scripts
// @match       *://www.oschina.net/*
// @grant       none
// @version     1.0.1
// @author      eEasy
// @description 开源中国首页去广告脚本
// @downloadURL https://update.greasyfork.org/scripts/418829/%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E9%A6%96%E9%A1%B5%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/418829/%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E9%A6%96%E9%A1%B5%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
  
      // 去除首页广告
      var a = document.querySelector("#mainScreen > div > div.index-container.aside-container > div.index-banner-wrap > div > div");
      if(null!=a){
        a.remove();
      }
 
      var b = document.querySelector("#mainScreen > div > div.index-container.aside-container > div.box-container > div.body-box > div.body-box__content > div > div.inner-container__inner > div > div > div > div > div > div:nth-child(2)");
      if(null!=b){
        b.remove();
      }
  
  
      var c = document.querySelector("#mainScreen > div > div.index-container.aside-container > div.box-container > div.body-box > div.body-box__content > div > div.inner-container__inner > div > div > div > div > div > div:nth-child(4)");
      if(null!=c){
        c.remove();
      }
  
  
      var d = document.querySelector("#mainScreen > div > div.index-container.aside-container > div.box-container > div.body-box > div.body-box__content > div > div.inner-container__inner > div > div > div > div > div > div.ad-box.ad-box--label.chanel-banner-ad-wrap");
      if(null!=d){
        d.remove();
      }
  
      var e = document.querySelector("#mainScreen > div > div > div.five.wide.computer.sixteen.wide.tablet.column.sidebar > div:nth-child(1)");
      if(null!=e){
        e.remove();
      }
  
  
})();
