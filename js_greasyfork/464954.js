// ==UserScript==
// @name        百度主页修正
// @namespace   ued@greasyfork
// @match       https://www.baidu.com/
// @grant       none
// @version     1.1
// @author      ued
// @description 禁用百度推荐
// @license     GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/464954/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/464954/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

window.onload = function() {
  document.getElementById('s_content_2').remove();
  document.getElementById('s_menu_mine').click()
}