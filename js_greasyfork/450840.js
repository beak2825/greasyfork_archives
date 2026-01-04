// ==UserScript==
// @name         不想见到csdn
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在bing/baidu搜索时排除csdn的结果
// @author       You
// @match        https://*.baidu.com/*
// @match        https://*.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @require https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/450840/%E4%B8%8D%E6%83%B3%E8%A7%81%E5%88%B0csdn.user.js
// @updateURL https://update.greasyfork.org/scripts/450840/%E4%B8%8D%E6%83%B3%E8%A7%81%E5%88%B0csdn.meta.js
// ==/UserScript==

/* globals jQuery. $ */


function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  var debounced = function(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;

      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

(function () {
  'use strict';
  // 选择需要观察变动的节点
  const targetNode = document

  // 观察器的配置（需要观察什么变动）
  const config = { attributes: true, childList: true, subtree: true }

  // 当观察到变动时执行的回调函数
  const callback = debounce(function () {
    const bing = $('a[href*="csdn"]').parents('.b_algo')
    const kaifa = $('a[href*="csdn"]').parents('.ant-list-item')
    const baidu = $('.result[mu*="csdn"]')
    bing.remove()
    kaifa.remove()
    baidu.remove()
  }, 200)

  // 先调用一次
  callback()

  // 创建一个观察器实例并传入回调函数
  const observer = new MutationObserver(callback)

  // 以上述配置开始观察目标节点
  observer.observe(targetNode, config)
})();
