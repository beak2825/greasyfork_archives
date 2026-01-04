// ==UserScript==
// @name         mobbin
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  just a mobbin extractor!
// @author       You
// @match        https://mobbin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mobbin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497869/mobbin.user.js
// @updateURL https://update.greasyfork.org/scripts/497869/mobbin.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function extractForFlows(){
    var asides=document.querySelectorAll("aside.sticky");
    for(const aside of asides){
      aside.setAttribute("style","display:none;");
    }
    var containers=document.querySelectorAll(".group .grow");
    for(const container of containers){
      var containerClass=container.getAttribute("class");
      containerClass=containerClass.replace("blur-0","");
      containerClass=containerClass.replace("after:backdrop-blur-[10px]","");
      containerClass=containerClass.replace("after:bg-neutral-white/40","");
      container.setAttribute("class",containerClass);
    }
    var images = document.querySelectorAll(".group .grow img");
    for(const image of images){
      var imageSrc=image.getAttribute("src");
      var index=imageSrc.indexOf("?");
      if(index>=0){
        imageSrc=imageSrc.substring(0,index);
        image.setAttribute("src",imageSrc);
      }
    }
  }
  function extractForScreens(){
    var asides=document.querySelectorAll("aside.sticky");
    for(const aside of asides){
      aside.setAttribute("style","display:none;");
    }
    var containers=document.querySelectorAll(".group .relative");
    for(const container of containers){
      var containerClass=container.getAttribute("class");
      containerClass=containerClass.replace("blur-0","");
      containerClass=containerClass.replace("after:backdrop-blur-[10px]","");
      containerClass=containerClass.replace("after:bg-neutral-white/40","");
      container.setAttribute("class",containerClass);
    }
    var images = document.querySelectorAll(".group .relative img");
    for(const image of images){
      var imageSrc=image.getAttribute("src");
      var index=imageSrc.indexOf("?");
      if(index>=0){
        imageSrc=imageSrc.substring(0,index);
        image.setAttribute("src",imageSrc);
      }
    }
  }
  function extractForUIElements(){
    var asides=document.querySelectorAll("aside.sticky");
    for(const aside of asides){
      aside.setAttribute("style","display:none;");
    }
    var containers=document.querySelectorAll(".group .relative");
    for(const container of containers){
      var containerClass=container.getAttribute("class");
      containerClass=containerClass.replace("blur-0","");
      containerClass=containerClass.replace("after:backdrop-blur-[10px]","");
      containerClass=containerClass.replace("after:bg-neutral-white/40","");
      container.setAttribute("class",containerClass);
    }
    var images = document.querySelectorAll(".group .relative img");
    for(const image of images){
      var imageSrc=image.getAttribute("src");
      var index=imageSrc.indexOf("?");
      if(index>=0){
        imageSrc=imageSrc.substring(0,index);
        image.setAttribute("src",imageSrc);
      }
    }
  }
  setInterval(function(){
    extractForFlows();
    extractForScreens();
    extractForUIElements();
  },800);
})();
