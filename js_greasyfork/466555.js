// ==UserScript==
// @name         搜索引擎新标签打开链接
// @description  谷歌、百度、搜狗、必应、F搜、头条、360、DuckDuckGo、Ecosia 搜索结果新标签打开
// @version      2.9
// @author       ChatGPT
// @match        *://www.so.com/*
// @match        *://m.so.com/*
// @match        *://so.toutiao.com/*
// @match        *://www.ecosia.org/*
// @match        *://fsoufsou.com/*
// @match        *://duckduckgo.com/*
// @match        *://yandex.com/*
// @match        *://www.google.co.jp/*
// @match        *://www.google.com.hk/*
// @match        *://www.google.com/*
// @match        *://m.baidu.com/*
// @match        *://www.baidu.com/*
// @match        *://wap.sogou.com/*
// @match        *://m.sogou.com/*
// @match        *://www.sogou.com/*
// @match        *://cn.bing.com/*
// @match        *://www.bing.com/*
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/466555/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/466555/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (window.location.href.search(/search|q=|wd=|word=/) !== -1) {
    function modifyLinks() {
      let linksToOpenInSelf = document.querySelectorAll('a.sb_halfnext, a[class^="container"], a.control,a#pnnext,a.fl');
      linksToOpenInSelf.forEach(link => {
        link.setAttribute('target', '_self');
      });

      let linksToOpenInNewTab = document.querySelectorAll('a:not(.sb_halfnext):not([class^="container"]):not(.control):not([href^="/s?wd="]):not(.fl):not(#pnnext)');
      linksToOpenInNewTab.forEach(link => {
        link.setAttribute('target', '_blank');
      });

      let base = document.querySelector('base');
      if (!base) {
        let head = document.querySelector('head');
        let newBase = document.createElement('base');
        newBase.setAttribute('target', '_blank');
        head.appendChild(newBase);
      }
    }

    modifyLinks();

   (function() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(addedNode => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        modifyLinks();
                    }
                });
            }
        });
    });

    const config = { childList: true, subtree: true };

    observer.observe(document.body, config);
})();       
    }
})();