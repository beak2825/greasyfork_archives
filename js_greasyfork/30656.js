// ==UserScript==
// @name         自动跳过微博信息更新界面
// @namespace    http://www.suzhengpeng.com
// @version      0.2
// @description  FUck weibo.com Update Info Page
// @author       Suzhengpeng
// @include      *weibo.com/nguide*
// @downloadURL https://update.greasyfork.org/scripts/30656/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%BE%AE%E5%8D%9A%E4%BF%A1%E6%81%AF%E6%9B%B4%E6%96%B0%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/30656/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%BE%AE%E5%8D%9A%E4%BF%A1%E6%81%AF%E6%9B%B4%E6%96%B0%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var host = location.href;  
    if(host=='http://weibo.com/nguide/interests'||'http://weibo.com/nguide/recommend')
    {
     location.replace("http://weibo.com/");
    }
})();