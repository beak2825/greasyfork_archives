// ==UserScript==
// @name         简书去广告
// @version      1.0.0
// @author       茉茉敲可爱
// @description  [自用]
// @namespace    ashgod
// @license      MIT License
// @include      http://www.jianshu.com/*
// @include      https://www.jianshu.com/*
// @downloadURL https://update.greasyfork.org/scripts/466983/%E7%AE%80%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/466983/%E7%AE%80%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

var href = window.location.href

if (href.indexOf('www.jianshu.com') != -1) {
  //获取初始节点的个数
  const oldDom = document.getElementsByTagName("body")[0].children.length;
  window.onload = function(){
    //轮询新节点
    let interval = setInterval(function (){
      //获取新节点的个数
      const newDom = document.getElementsByTagName("body")[0].children.length;
      if(newDom > oldDom){
        const dom = document.getElementsByTagName("body")[0].children;
        for(let i=newDom;i>oldDom;i--){
          //移除多出的几个广告节点
          //前面的节点被删除，后面的节点就会往前挪，必须从后往前删
          dom[i-1].remove();
        }
        clearInterval(interval);
      }
    },100)
  }
}



