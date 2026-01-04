// ==UserScript==
// @name         強制去除「沉浸式翻譯」翻譯Youtube字幕時的提示
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  隱藏「沉浸式翻譯」翻譯YouTube字幕時出現的 [ 雙語字幕由沉浸式翻譯支援 ] 字樣
// @author       shanlan(ChatGPT o3-mini)
// @match        *://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546013/%E5%BC%B7%E5%88%B6%E5%8E%BB%E9%99%A4%E3%80%8C%E6%B2%89%E6%B5%B8%E5%BC%8F%E7%BF%BB%E8%AD%AF%E3%80%8D%E7%BF%BB%E8%AD%AFYoutube%E5%AD%97%E5%B9%95%E6%99%82%E7%9A%84%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/546013/%E5%BC%B7%E5%88%B6%E5%8E%BB%E9%99%A4%E3%80%8C%E6%B2%89%E6%B5%B8%E5%BC%8F%E7%BF%BB%E8%AD%AF%E3%80%8D%E7%BF%BB%E8%AD%AFYoutube%E5%AD%97%E5%B9%95%E6%99%82%E7%9A%84%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function(){
  function hideInShadow(shadow) {
    var style = document.createElement("style");
    style.textContent = ".loading-text.imt-cue { display: none !important; }";
    shadow.appendChild(style);
  }
  function processNode(node) {
    if(node.shadowRoot) { hideInShadow(node.shadowRoot); }
    var hosts = node.querySelectorAll('*');
    hosts.forEach(function(el){
      if(el.shadowRoot){ hideInShadow(el.shadowRoot); }
    });
  }
  document.querySelectorAll('*').forEach(function(el){ processNode(el); });
  var observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
      mutation.addedNodes.forEach(function(added){
        if(added.nodeType === 1) { processNode(added); }
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();