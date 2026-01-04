// ==UserScript==
// @name         知乎和谐卫士
// @namespace    http://tampermonkey.net/
// @version      1.11
// @icon         https://cdn.jsdelivr.net/gh/bugparty/zhihu-killer/icon.png
// @description  去掉连接重定向, 去掉复制知乎答案的限制（注意：仅用于个人笔记用途，请遵守版权协议）
// @author       bugparty    
// @home-url     https://github.com/bugparty/zhihu-killer
// @license      MIT License
// @match        https://www.zhihu.com/*
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @note         
// @downloadURL https://update.greasyfork.org/scripts/397436/%E7%9F%A5%E4%B9%8E%E5%92%8C%E8%B0%90%E5%8D%AB%E5%A3%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/397436/%E7%9F%A5%E4%B9%8E%E5%92%8C%E8%B0%90%E5%8D%AB%E5%A3%AB.meta.js
// ==/UserScript==

// 选取回答正文外部的span标签
var targetSelector = "div.RichContent-inner > span"
// need to wait for article content loaded after ajax request
waitForKeyElements(targetSelector, cleanClipboard);

function cleanClipboard() {
  'use strict';
  console.log("zhihu killer find a new questino to mask")
  // 由于在 div[id=article-content] 处监听所有冒泡到此处的 copy 事件，所有可以在下一个子节点拦截。
  // 参考：https://ghoulmind.com/2016/02/remove-zhihu-copyright-on-copy/
  $(targetSelector).on('copy', e => e.stopPropagation());
}

function transformLinks() {
  'use strict';
  var elements = document.querySelectorAll("a.external");
  elements.forEach(function (e) {
    if (e.href.indexOf("https://link.zhihu.com/?target=") == 0) {
      let new_link = decodeURIComponent(e.href.replace("https://link.zhihu.com/?target=", ""));
      e.href = new_link;
      console.log("zhihu killer, mask a new link", new_link);
    }
  });
}
waitForKeyElements("a.external", transformLinks);
$(document).ready(transformLinks);
