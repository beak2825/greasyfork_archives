// ==UserScript==
// @name         贴吧禁止链接跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度贴吧禁止链接跳转。
// @author       only1word
// @include     /http(?:s|)://(?:tieba\.baidu\.com|.+\.tieba\.com)//
// @run-at      document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39560/%E8%B4%B4%E5%90%A7%E7%A6%81%E6%AD%A2%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/39560/%E8%B4%B4%E5%90%A7%E7%A6%81%E6%AD%A2%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

//var urls = document.querySelectorAll('.p_content a[href*=".bdimg.com/safecheck"]');
var element_list =document.querySelectorAll('.p_content a[href*=".bdimg.com/safecheck"]:not(.ps_cb)');
for (var i = element_list.length - 1; i >= 0; i--) {
  var element = element_list[i], text = element.innerText,
  url = /^http.*/.test(text) ? text: 'http://' + text;
  element.setAttribute('href', url);
}