// ==UserScript==
// @name         get os info
// @name:zh-CN   获取系统浏览器信息
// @namespace    https://github.com/jackdizhu
// @version      0.2.1
// @description:zh-CN  获取系统名称，浏览器名称
// @description:en     get os name, get browser name
// @author       jackdizhu
// @match        *
// @include      *
// @grant        none
// @run-at       document-start
// @updateURL    https://greasyfork.org/scripts/407021-get-os-info/code/get%20os%20info.user.js
// ==/UserScript==

(function() {
  'use strict';
  let platform = navigator.platform.toLowerCase()
  let os = {
    Mac: platform.indexOf('mac') !== -1,
    Windows: platform.indexOf('win') !== -1
  }
  
  let UserAgent = navigator.userAgent.toLowerCase();
  let isBrowserName = {
      IE: window.ActiveXObject || "ActiveXObject" in window,
      Chrome: UserAgent.indexOf('chrome') > -1 && UserAgent.indexOf('safari') > -1,
      Firefox: UserAgent.indexOf('firefox') > -1,
      Opera: UserAgent.indexOf('opera') > -1,
      Safari: UserAgent.indexOf('safari') > -1 && UserAgent.indexOf('chrome') == -1,
      Edge: UserAgent.indexOf('edge') > -1,
      QQBrowser: /qqbrowser/.test(UserAgent),
      WeixinBrowser: /MicroMessenger/i.test(UserAgent),
  }
  
  window.$os = os
  window.$isBrowserName = isBrowserName
})();