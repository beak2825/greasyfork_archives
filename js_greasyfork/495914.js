// ==UserScript==
// @name         自动刷新插件
// @namespace    
// @version      0.1
// @description  网页自动刷新
// @author       红豆煮南国
// @match        
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495914/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/495914/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
// 自动刷新插件
function AutoRefreshPlugin(interval) {
  this.interval = interval || 60000; // 默认刷新间隔为60000毫秒（60秒）
}
 
AutoRefreshPlugin.prototype.start = function() {
  setInterval(function() {
    location.reload(); // 刷新当前页面
  }, this.interval);
};
 
AutoRefreshPlugin.prototype.stop = function() {
  clearInterval(this.interval);
};
 
// 使用示例
var autoRefreshPlugin = new AutoRefreshPlugin(60000); // 设置60秒刷新间隔
autoRefreshPlugin.start(); // 启动自动刷新
 
// 当需要停止自动刷新时
// autoRefreshPlugin.stop();