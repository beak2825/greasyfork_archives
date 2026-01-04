// ==UserScript==
// @version 2.0
// @name         港剧网去广告，和微信客服
// @namespace    http://tampermonkey.net/
// @description  try to take over the world!
// @author       香香的牛粪
// @match        http://www.metvb1.com/*
// @grant        none
// @require https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/395694/%E6%B8%AF%E5%89%A7%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E5%92%8C%E5%BE%AE%E4%BF%A1%E5%AE%A2%E6%9C%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/395694/%E6%B8%AF%E5%89%A7%E7%BD%91%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E5%92%8C%E5%BE%AE%E4%BF%A1%E5%AE%A2%E6%9C%8D.meta.js
// ==/UserScript==

    (function() {
    'use strict';
    // Your code here...
    console.log("这是一次测试")
    //开始移除广告节点
  $("#note").remove();
  $("div[style = 'display: block; padding: 0px; margin: 0px; z-index: 2147483647; position: fixed; right: 0px; bottom: auto; left: auto; bottom: 0px; width: 320px; height: 270px;']").remove();
  $("#txt").remove();
  $("div[style = 'float:right;width:300px;height:500px;margin-top:0px;']").remove();
})();
