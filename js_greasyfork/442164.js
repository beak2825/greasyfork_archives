// ==UserScript==
// @name         饭饭百度广告自动去除
// @namespace    http://your.homepage/
// @version      0.3
// @description  百度搜索自动去除广告词条
// @author       小凡宝宝
// @match        https://wenku.baidu.com/view/476ebd705e0e7cd184254b35eefdc8d376ee14b6.html
// @include      *://www.baidu.com/*
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/442164/%E9%A5%AD%E9%A5%AD%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/442164/%E9%A5%AD%E9%A5%AD%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==
var m = new MutationObserver(function() {
  document.querySelectorAll('.EC_result').forEach(a => {
    a.style.display = 'none'
  })
});
m.observe(document.body, {childList: true,subtree:true})