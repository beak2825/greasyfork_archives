// ==UserScript==
// @name         苏宁网址瘦身
// @namespace    http://tampermonkey.net/
// @description  苏宁网址链接简化，目前只支持海尔苏宁自营店
// @author       kjl-rabbit
// @include      *//product.suning.com/0030000162/*
// @include      *//product.suning.com/0000000000/*
// @version      0.1
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/375321/%E8%8B%8F%E5%AE%81%E7%BD%91%E5%9D%80%E7%98%A6%E8%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/375321/%E8%8B%8F%E5%AE%81%E7%BD%91%E5%9D%80%E7%98%A6%E8%BA%AB.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const url = location.href.toString();
  const productUrl = "https://product.suning.com/0000000000/" + location.href.toString().match(/(?!0)\d+.html/g);
  if (url !== productUrl) {
    location.assign(productUrl);
  };
})();