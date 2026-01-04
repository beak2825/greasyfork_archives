// ==UserScript==
// @name               自动跳转链接
// @namespace          autoJumpLink
// @version            0.0.1
// @description        离开网站警告页面自动跳转
// @icon               https://static.zhihu.com/heifetz/favicon.ico

// @match              *://link.zhihu.com/*
// @match              *://link.csdn.net/*
// @match              *://link.juejin.cn/*
// @match              *://www.jianshu.com/go-wild*
// @match              *://www.oschina.net/action/GoToLink*
// @match              *://gitee.com/link*
// @match              *://weibo.cn/sinaurl*

// @match              *://jump2.bdimg.com/*

// @author             Bking
// @license            MIT
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/459390/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/459390/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const url = new URL(window.location.href);
  // console.log(url);
  const parameters = {
    'link.zhihu.com': 'target',
    'link.csdn.net': 'target',
    'link.juejin.cn': 'target',
    'www.jianshu.com': 'url',
    'www.oschina.net': 'url',
    'gitee.com': 'target',
    'weibo.cn': 'u',
  };
  const selectors = {
    'jump2.bdimg.com': 'body > div > div.warning_info > p.link',
  };

  if (parameters[url.host]) {
    location.replace(url.searchParams.get(parameters[url.host]));
  } else if (selectors[url.host]) {
    location.replace(document.querySelector(selectors[url.host]).innerHTML);
  }
})();
