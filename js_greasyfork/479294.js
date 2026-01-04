// ==UserScript==
// @name         NexusCN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Translate nexusmods SSE to chinese!
// @author       FinKiin
// @match        https://www.nexusmods.com/*
// @icon         none
// @grant        none
// @license      MIT
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/479294/NexusCN.user.js
// @updateURL https://update.greasyfork.org/scripts/479294/NexusCN.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
  const SSEDictionary = {
  'Collections': '作品集',
  'Browse all': '浏览全部',
  'Trending': '当前流行',
  'Top files': '热门文件',
  'Mod categories': '模组类别',
  'Mod updates': '模组更新',
  'Recent activity': '最近更新',
  'Tracked mods': '收藏的模组',
  'My mods': '我的模组',
  'Download history': '下载历史',
  'Mod rewards': '模组报酬',
  'Most endorsed': '最多点赞',
}
for (const key in SSEDictionary) {
   $('body :not(script)').contents().filter(function() {
    return this.nodeType === 3;
  }).replaceWith(function() {
      return this.nodeValue.replaceAll(key,SSEDictionary[key]);
  }); 
}
})();