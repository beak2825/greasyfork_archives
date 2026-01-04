// ==UserScript==
// @name         显示 Tapd 字体图标
// @namespace    http://tapd.oa.com/
// @version      0.8
// @description  添加 css 显示 Tapd 字体图标
// @author       Smadey
// @match        http://tapd.oa.com/*
// @downloadURL https://update.greasyfork.org/scripts/391160/%E6%98%BE%E7%A4%BA%20Tapd%20%E5%AD%97%E4%BD%93%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/391160/%E6%98%BE%E7%A4%BA%20Tapd%20%E5%AD%97%E4%BD%93%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==
(function() {
  'use strict';

  var cssUrl = [].slice.call(document.styleSheets)
    .map(function (d) {
      return d.href;
    })
    .filter(Boolean)
    .find(function (d) {
      return /http:\/\/tdl2\.oa\.com\/tfl\/css_dist\/tfl-style-[^\-]+\.css/.test(d);
    });
  if (cssUrl) {
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = cssUrl.replace('http://tdl2.oa.com/', 'https://tdl2.tapd.tencent.com/');
    document.head.appendChild(style);
  }
})();