// ==UserScript==
// @name         自动跳过网站的外链提示
// @namespace    http://tampermonkey.net/undefined
// @version      0.1
// @description  一个很简单的小脚本，用于自动跳转知乎、掘金、简书等打开外链的跳转/离开提示(不算是外链直达)，这样写简单又通用。\n另外可以用外链直达方式，那就是替换页面中的跳转链接为真实链接或者接管a标签的点击事件
// @author       禾几元
// @match        *://link.zhihu.com/?target=*
// @match        *://link.juejin.cn/?target=*
// @match        *://www.jianshu.com/go-wild?ac=2&url=*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435762/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E7%BD%91%E7%AB%99%E7%9A%84%E5%A4%96%E9%93%BE%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/435762/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E7%BD%91%E7%AB%99%E7%9A%84%E5%A4%96%E9%93%BE%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

// 各大网站跳转页面中url的跳转参数名
const siteJumpParamMap = new Map([
  ['zhihu','target'],
  ['juejin','target'],
  ['jianshu','url'],
]);

// 获取网站名称 @example: getSiteName('www.baidu.com'); // 'baidu'
const getSiteName = hostname => hostname.match(/([^\.]+)\.[^\.]+$/)[1];

(function() {
    'use strict';
    // 清空页面原有内容，防闪烁
    window.document.documentElement.innerHTML=''
    // 获取URL中的请求参数
    const params = new URLSearchParams(location.search.substring(1));
    // 获取网站名称，用于查找对应的跳转参数名
    const siteName = getSiteName(location.hostname);
    // 获取该网站的的跳转URL的参数名，进而获取目标URL
    const targetURL = params.get(siteJumpParamMap.get(siteName));
    // 利用replace()方法进行跳转,保证无用的跳转页面不会产生在历史记录中
    location.replace(targetURL);
})();