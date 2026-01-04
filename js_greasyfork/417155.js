// ==UserScript==
// @name         知乎不登录查看问题和回答
// @namespace    @ruguoapp
// @version      1.0.1
// @description  隐藏知乎不可关闭的登录弹窗
// @author       Vizards
// @match        https://www.zhihu.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/417155/%E7%9F%A5%E4%B9%8E%E4%B8%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E9%97%AE%E9%A2%98%E5%92%8C%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/417155/%E7%9F%A5%E4%B9%8E%E4%B8%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E9%97%AE%E9%A2%98%E5%92%8C%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

function hideElements(mutationList, observer) {
  mutationList.forEach(function(mutation){
    hideLoginModal(mutation)
    makeHtmlScrollable()
  })
}

function hideLoginModal(mutation) {
  var node = mutation.addedNodes[0]
  if (mutation.target === document.body && node) {
    if (node.innerText.includes('登录')) {
      node.parentNode.removeChild(node)
    }
  }
}

function makeHtmlScrollable() {
  document.querySelector('html').style.overflow = 'auto'
  document.querySelector('body').style.overflow = 'auto'
}

(function() {
  'use strict';
  var rootNode = document.querySelector('body');
  var observer = new MutationObserver(hideElements);
  if (rootNode) {
    observer.observe(rootNode, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
  }
})();