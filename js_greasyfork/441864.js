// ==UserScript==
// @name         【猫站】去除黑白模式
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  去除黑白模式
// @author       yigezhanghao
// @match        https://*.pterclub.com/*
// @icon         https://pterclub.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441864/%E3%80%90%E7%8C%AB%E7%AB%99%E3%80%91%E5%8E%BB%E9%99%A4%E9%BB%91%E7%99%BD%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/441864/%E3%80%90%E7%8C%AB%E7%AB%99%E3%80%91%E5%8E%BB%E9%99%A4%E9%BB%91%E7%99%BD%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try {
      var head = document.getElementsByTagName('head')[0]
      var links = [...head.getElementsByTagName('link')]
      var gray_css = links.find(l => l['href'].includes('global_gray.css'))
      gray_css.remove()
    } catch (err) {}
})();