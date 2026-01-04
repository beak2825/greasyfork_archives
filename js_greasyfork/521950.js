// ==UserScript==
// @name        强制所有B站链接在当前标签页打开（需配合Death to _blank拓展使用）
// @namespace   Violentmonkey Scripts
// @match       https://*.bilibili.com/*
// @match        https://www.bilibili.com/*
// @match        http://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://search.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant       none
// @version     0.1
// @author      -
// @description 强制所有链接在当前标签页打开
// @downloadURL https://update.greasyfork.org/scripts/521950/%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89B%E7%AB%99%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%EF%BC%88%E9%9C%80%E9%85%8D%E5%90%88Death%20to%20_blank%E6%8B%93%E5%B1%95%E4%BD%BF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521950/%E5%BC%BA%E5%88%B6%E6%89%80%E6%9C%89B%E7%AB%99%E9%93%BE%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%EF%BC%88%E9%9C%80%E9%85%8D%E5%90%88Death%20to%20_blank%E6%8B%93%E5%B1%95%E4%BD%BF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  const originalOpen = window.open;
  window.open = function(url, _, features) {
    return originalOpen(url, '_self', features)
  }
})()