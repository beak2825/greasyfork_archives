// ==UserScript==
// @name        Google Ad Skipper
// @namespace   bing
// @version     0.1
// @description A simple script to skip Google ads
// @author      Bing
// @match       https://www.google.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/481539/Google%20Ad%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/481539/Google%20Ad%20Skipper.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // 定义一个函数，用来隐藏一个元素
  function hideElement(element) {
    if (element) {
      element.style.display = 'none';
    }
  }
  // 定义一个函数，用来隐藏一个元素的所有子元素
  function hideChildren(element) {
    if (element) {
      var children = element.children;
      for (var i = 0; i < children.length; i++) {
        hideElement(children[i]);
      }
    }
  }
  // 定义一个函数，用来隐藏Google搜索结果页面上的所有广告元素
  function hideSearchAds() {
    // 获取搜索结果的容器元素
    var container = document.getElementById('main');
    if (container) {
      // 获取搜索结果的所有子元素
      var results = container.children;
      for (var i = 0; i < results.length; i++) {
        // 获取每个搜索结果的类名
        var className = results[i].className;
        // 如果类名包含"ads"或"pla"，则表示是广告元素，隐藏之
        if (className.includes('ads') || className.includes('pla')) {
          hideElement(results[i]);
        }
      }
    }
  }
  // 定义一个函数，用来隐藏Google视频页面上的所有广告视频
  function hideVideoAds() {
    // 获取视频播放器的元素
    var player = document.getElementById('movie_player');
    if (player) {
      // 获取视频播放器的所有子元素
      var children = player.children;
      for (var i = 0; i < children.length; i++) {
        // 获取每个子元素的类名
        var className = children[i].className;
        // 如果类名包含"ad"或"ytp"，则表示是广告视频，隐藏之
        if (className.includes('ad') || className.includes('ytp')) {
          hideElement(children[i]);
        }
      }
    }
  }
  // 定义一个函数，用来判断当前页面是搜索结果页面还是视频页面
  function isSearchPage() {
    // 获取当前页面的URL
    var url = window.location.href;
    // 如果URL包含"search"或"q="，则表示是搜索结果页面，返回true
    if (url.includes('search') || url.includes('q=')) {
      return true;
    }
    // 否则，返回false
    return false;
  }
  // 定义一个函数，用来执行脚本的主要逻辑
  function main() {
    // 判断当前页面是搜索结果页面还是视频页面
    if (isSearchPage()) {
      // 如果是搜索结果页面，隐藏搜索结果页面上的所有广告元素
      hideSearchAds();
    } else {
      // 如果是视频页面，隐藏视频页面上的所有广告视频
      hideVideoAds();
    }
  }
  // 在页面加载完成后，执行脚本的主要逻辑
  window.addEventListener('load', main);
})();
