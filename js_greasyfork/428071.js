// ==UserScript==
// @name         百度题库显示答案
// @namespace    https://tampermonkey.net/
// @version      1.03
// @description  百度题库去除不挂科下载框，显示答案
// @author       zhengen
// @match        *://tiku.baidu.com/*
// @grant        none
// @homepage     https://my.com
// @downloadURL https://update.greasyfork.org/scripts/428071/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/428071/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
  'use strict';
  Array.from(document.getElementsByClassName("guid-to-app-mask") || []).forEach(dom => dom.remove())
})();