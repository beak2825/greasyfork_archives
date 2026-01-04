// ==UserScript==
// @name         oppo直接跳到packname页
// @namespace  https://greasyfork.org/users/1284284
// @version      0.1
// @description   oppo游戏论坛链接直接跳到该游戏的packname页
// @author       喃哓盐主
// @run-at       document-start
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491763/oppo%E7%9B%B4%E6%8E%A5%E8%B7%B3%E5%88%B0packname%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/491763/oppo%E7%9B%B4%E6%8E%A5%E8%B7%B3%E5%88%B0packname%E9%A1%B5.meta.js
// ==/UserScript==

// 获取当前链接
var currentURL = window.location.href;

// 检测链接中是否含有 game.oppomobile.com/bbs/index.html
if (currentURL.includes('game.oppomobile.com/bbs/index.html')) {
  // 替换链接为 iopen-gamecenter.heytapmobi.com/tribe/v1/share/thread
  var newURL = currentURL.replace('game.oppomobile.com/bbs/index.html', 'iopen-gamecenter.heytapmobi.com/tribe/v1/share/thread');
  
  // 访问新链接
  window.location.href = newURL;
}