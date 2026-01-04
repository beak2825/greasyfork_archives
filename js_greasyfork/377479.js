// ==UserScript==
// @name        谷歌链接直达
// @version     4.1.1.0
// @grant		none
// @namespace   happyZYM
// @description:zh-cn   谷歌搜索引擎使用时点开链接会有一个跳转过程，这个脚本可以关闭这个跳转过程。
// @match       https://www.google.com/*
// @match       https://www.google.com.hk/*
// @description 谷歌搜索引擎使用时点开链接会有一个跳转过程，这个脚本可以关闭这个跳转过程。
// @downloadURL https://update.greasyfork.org/scripts/377479/%E8%B0%B7%E6%AD%8C%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/377479/%E8%B0%B7%E6%AD%8C%E9%93%BE%E6%8E%A5%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==
function clean()
{
var url = window.location.href.toLowerCase();
if (url.indexOf("www.google.com.hk") >= 0 || url.indexOf("www.google.com") >= 0 || url.indexOf("/search") >= 0 || url.indexOf("/url") >= 0) 
{
      // 获取id为"center_col"的div元素
const centerCol = document.getElementById('center_col');

// 获取所有超链接
var links = centerCol.getElementsByTagName('a');

// 遍历超链接并移除不必要的属性
for (let i = 0; i < links.length; i++) {
  const link = links[i];
  // 移除不必要的属性
  if(link.hasAttribute('button'))
  {
      continue;
      //alert("found!");
  }
    url = links[i].getAttribute('href');
        var match = /url=(.*?)&/.exec(url);
        if (match) {
            links[i].setAttribute('href', decodeURIComponent(match[1]));
        }
  link.removeAttribute('data-jsarwt');
}
}
}
setTimeout(clean,10);
setTimeout(clean,500);
for(var i=1;i<=240;i++)
{
    setTimeout(clean,1000*i);
}