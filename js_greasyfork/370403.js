// ==UserScript==
// @name         DIG对比插件
// @namespace    http://dailyindiegame.com/*
// @version      0.1
// @description  try to take over the world!
// @author       橘子电玩
// @match        http://dailyindiegame.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/370403/DIG%E5%AF%B9%E6%AF%94%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/370403/DIG%E5%AF%B9%E6%AF%94%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
// ==/UserScript==

var steamid="76561198101398007";//设置STEAMID

new_element=document.createElement("script");
new_element.setAttribute("type","text/javascript");
new_element.setAttribute("src","https://www.91aa.cc/test.php?steamid="+steamid+"="+Math.random());
document.body.appendChild(new_element);