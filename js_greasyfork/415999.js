// ==UserScript== 
// @name   百度贴吧跳转
// @description  跳转到一个新网页，可以查看全贴，缺点是不能登录回复和发帖，视频不能直接播放，要嗅探播放
// @match   https://tiebac.baidu.com/*
// @match   https://tieba.baidu.com/*
// @match   https://m.tieba.com/*
// @run-at   document-start
// @version 0.0.1.20201112132745
// @namespace https://greasyfork.org/users/703479
// @downloadURL https://update.greasyfork.org/scripts/415999/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/415999/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
var tid = location.pathname == '/f' ? location.search.match(/kz=([^&]*)/)[1] : location.pathname.match(/\/p\/(\d+)/)[1];
location.replace(' http://byokpg.smartapps.cn/pages/pb/pb?tid='+tid);