// ==UserScript==
// @name        去掉知乎/CSDN网页标题未读消息提示
// @namespace   Violentmonkey Scripts
// @home-url    https://greasyfork.org/zh-CN/scripts/435087
// @match       https://*.zhihu.com/*
// @match       https://*.csdn.net/*
// @grant       none
// @version     2.4
// @author      -
// @description 去掉那些该死的消息提示！
// @icon        https://tikolu.net/i/hfgls
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/435087/%E5%8E%BB%E6%8E%89%E7%9F%A5%E4%B9%8ECSDN%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E6%9C%AA%E8%AF%BB%E6%B6%88%E6%81%AF%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/435087/%E5%8E%BB%E6%8E%89%E7%9F%A5%E4%B9%8ECSDN%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E6%9C%AA%E8%AF%BB%E6%B6%88%E6%81%AF%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

title = document.getElementsByTagName("title")[0];
setInterval(function(){  //定时循环执行
  title.innerText = title.innerText.match(/(\([0-9]+.*(?=私信|消息).*?\)\s*)?(.+)/)[2];
},100);//定时100ms