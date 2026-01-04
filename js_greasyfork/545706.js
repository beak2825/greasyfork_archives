// ==UserScript==
// @name         漫畫閱讀方向鍵控制腳本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  使用左右方向鍵控制上一話與下一話的切換，目前支持嗨皮漫画、colamanga，有需要還會再增加
// @author       shanlan(ChatGPT o3-mini)
// @match        https://m.happymh.com/mangaread/*
// @match        https://www.colamanga.com/manga*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545706/%E6%BC%AB%E7%95%AB%E9%96%B1%E8%AE%80%E6%96%B9%E5%90%91%E9%8D%B5%E6%8E%A7%E5%88%B6%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/545706/%E6%BC%AB%E7%95%AB%E9%96%B1%E8%AE%80%E6%96%B9%E5%90%91%E9%8D%B5%E6%8E%A7%E5%88%B6%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

(function(){
  'use strict';
  function isEditable(el){
    var tag = el.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
  }
  document.addEventListener("keydown", function(e){
    if(isEditable(e.target)) return;
    if(e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    var keyword = e.key === "ArrowLeft" ? "上一" : "下一";
    var elems = document.querySelectorAll("button[data-href], a.read_page_link");
    for(var i=0; i<elems.length; i++){
      if(elems[i].textContent.indexOf(keyword) > -1){
        var url = elems[i].getAttribute("data-href") || elems[i].getAttribute("href");
        if(url) location.href = url;
        else elems[i].click();
        e.preventDefault();
        break;
      }
    }
  }, false);
})();