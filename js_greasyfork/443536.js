// ==UserScript==
// @name         【个人】微信表情包批量下载+公众号后台图片下载
// @namespace    eezTool
// @description  微信表情包批量下载+公众号后台图片下载
// @version      0.0.2
// @author       旅行
// @match        *://*sticker.weixin.qq.com/*
// @match        *://*mp.weixin.qq.com/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443536/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91%E5%BE%AE%E4%BF%A1%E8%A1%A8%E6%83%85%E5%8C%85%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%2B%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8E%E5%8F%B0%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/443536/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91%E5%BE%AE%E4%BF%A1%E8%A1%A8%E6%83%85%E5%8C%85%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%2B%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8E%E5%8F%B0%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var nodeList
  if(document.URL.search("sticker.weixin.qq.com") != -1){
    console.log("is sticker.weixin.qq.com")
    GM_registerMenuCommand("下载表情包1", () => {
      nodeList = document.querySelectorAll(".stiker_content_ele")
      var title = document.querySelector(".stiker_head_msg_title").innerText
      for(let i = 0; i < nodeList.length; i++){
        GM_download(nodeList[i].src, title + "_" + String(i+101).substring(1,3))
      }
    });
  } else if(document.URL.search("mp.weixin.qq.com") != -1){
    console.log("is mp.weixin.qq.com")
    GM_registerMenuCommand("下载表情包2", () => {
      nodeList = document.querySelectorAll(".you .bubble_cont img")
      console.log(nodeList)
      for(let i = 0; i < nodeList.length; i++){
        console.log(nodeList[i].src)
        GM_download(nodeList[i].src, "公众号后台图片下载" + (Math.random()+100+i) + ".gif")
      }
    });
  }
})();