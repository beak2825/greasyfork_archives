// ==UserScript==
// @name         sf文章页面自动展开目录
// @namespace    sf文章页面自动展开目录
// @version      0.1
// @description  sf文章页面自动展开目录，自动点击目录
// @author       SHERlocked93
// @match        *://segmentfault.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407517/sf%E6%96%87%E7%AB%A0%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/407517/sf%E6%96%87%E7%AB%A0%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
      $("h6.nav-header").click();
    }, 200)
})();