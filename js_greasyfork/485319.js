// ==UserScript==
// @name              阿里云盘播放异常解决脚本
// @namespace         http://tampermonkey.net/
// @version           1.0.0
// @description       解决阿里云盘在线播放经常出现异常
// @author            wuXinTongXue
// @license           GPL License
// @match             *://www.aliyundrive.com/s/*
// @match             *://www.aliyundrive.com/drive*
// @match             *://www.alipan.com/s/*
// @match             *://www.alipan.com/drive*
// @connect           aliyundrive.com
// @connect           alipan.com
// @icon              https://www.google.com/s2/favicons?sz=64&domain=receiveasmsonline.com
// @run-at            document-idle
// @grant             unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/485319/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%92%AD%E6%94%BE%E5%BC%82%E5%B8%B8%E8%A7%A3%E5%86%B3%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/485319/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%92%AD%E6%94%BE%E5%BC%82%E5%B8%B8%E8%A7%A3%E5%86%B3%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
  // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const isPlayError = containsErrorMessage(mutation.target,'播放异常，请稍后再试');
                if(isPlayError){
                    const element = document.querySelector('[class*="action-bar"]');
                    const nextEle = element.querySelector('[class*="next"]');
                    if(!nextEle) return false;
                    const prevEle = nextEle.previousElementSibling;
                     if(!prevEle) return false;
                    prevEle.click();
                }
            }
        }
    });

    // 选择需要观察变动的节点
    const targetNode = document.body;

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 传入目标节点和观察选项
    observer.observe(targetNode, config);
})();

function containsErrorMessage(node,text) {
  if (node.nodeType === Node.TEXT_NODE) {
    // 如果是文本节点，检查文本内容是否包含指定文本
    if (node.textContent.includes(text)) {
      return true;
    }
  } else if (node.childNodes && node.childNodes.length > 0) {
    // 如果是元素节点，并且有子节点，递归遍历子节点
    for (let i = 0; i < node.childNodes.length; i++) {
      if (containsErrorMessage(node.childNodes[i],text)) {
        return true;
      }
    }
  }
  return false;
}