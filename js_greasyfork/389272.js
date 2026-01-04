// ==UserScript==
// @name         图灵阅读-固定标题栏
// @namespace    https://github.com/atever/browserfork/edit/master/ituring.js
// @version      0.1.1
// @description  固定阅读页标题栏
// @license      MIT License
// @author       ateveryuan@gmail.com
// @match        *.ituring.com.cn/book/tupubarticle/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389282/%E5%9B%BE%E7%81%B5%E9%98%85%E8%AF%BB-%E5%9B%BA%E5%AE%9A%E6%A0%87%E9%A2%98%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/389282/%E5%9B%BE%E7%81%B5%E9%98%85%E8%AF%BB-%E5%9B%BA%E5%AE%9A%E6%A0%87%E9%A2%98%E6%A0%8F.meta.js
// ==/UserScript==


(function() {
  'use strict';
  document.getElementsByClassName("layout-head")[0].style='position: absolute';
})();
