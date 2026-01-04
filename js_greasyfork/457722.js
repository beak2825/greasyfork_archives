// ==UserScript==
// @name         QQ拦截域名自动跳转
// @namespace    https://dmnb.me/
// @version      0.1
// @description  自动重定向QQ拦截域名
// @author       Mai
// @match        *://c.pc.qq.com/*
// @license     MIT
// @icon         https://3gimg.qq.com/tele_safe/static/tmp/ic_alert_blue.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457722/QQ%E6%8B%A6%E6%88%AA%E5%9F%9F%E5%90%8D%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/457722/QQ%E6%8B%A6%E6%88%AA%E5%9F%9F%E5%90%8D%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

// URL解码函数
(function() {
  'use strict';
  function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }

// 判断页面类型并提取URL
  if (getQueryString('pfurl') == null) {
    location.href = decodeURIComponent(getQueryString('url'));
  } else {
    location.href = decodeURIComponent(getQueryString('pfurl'));
  }
})();