// ==UserScript==
// @name         b站推荐视频标题限制长度
// @version      0.11
// @namespace    https://live.bilibili.com/7115892
// @author       bAdWindy
// @match        https://www.bilibili.com/video/av*
// @description 推荐视频的标题优化
// @downloadURL https://update.greasyfork.org/scripts/394245/b%E7%AB%99%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98%E9%99%90%E5%88%B6%E9%95%BF%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/394245/b%E7%AB%99%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98%E9%99%90%E5%88%B6%E9%95%BF%E5%BA%A6.meta.js
// ==/UserScript==
var a=document.getElementsByClassName("title");
for (var i=0;i<a.length;i++){
   a[i].style.maxWidth='169px';
}