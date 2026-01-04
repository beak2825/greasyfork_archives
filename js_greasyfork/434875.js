// ==UserScript==
// @name        [诗木]QQ/TIM提示非官方页面自动跳转
// @namespace   Violentmonkey Scripts
// @match       *://c.pc.qq.com/middlem.html
// @grant       none
// @version     1.1
// @author      诗木
// @description QQ/TIM中点击链接跳转到https://c.pc.qq.com/middlem.html提示非官方页面，用本脚本可免复制链接自动跳转到该链接
// @icon        https://3gimg.qq.com/tele_safe/static/tmp/ic_alert_blue.png
// @downloadURL https://update.greasyfork.org/scripts/434875/%5B%E8%AF%97%E6%9C%A8%5DQQTIM%E6%8F%90%E7%A4%BA%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434875/%5B%E8%AF%97%E6%9C%A8%5DQQTIM%E6%8F%90%E7%A4%BA%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
(function(){
  'use strict';
  var shimuurl = document.querySelector("#url").textContent;
  var shimut = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
  if (!shimut.test(shimuurl)){
  shimuurl = "http://" + shimuurl;
  }
  window.location.replace(shimuurl);
})();
