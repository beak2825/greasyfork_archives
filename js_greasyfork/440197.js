// ==UserScript==
// @name         【个人】Github Projects 页面简化
// @namespace    eezTool
// @version      0.12
// @description  Github Projects 页面简化，缩小每个块的高度
// @author       eezTool
// @match        *://*.github.com/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440197/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91Github%20Projects%20%E9%A1%B5%E9%9D%A2%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/440197/%E3%80%90%E4%B8%AA%E4%BA%BA%E3%80%91Github%20Projects%20%E9%A1%B5%E9%9D%A2%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var pbStyle = document.createElement('style');

    pbStyle.textContent += `
    small{
      display:none!important
    }
  ` // 去掉作者

    pbStyle.textContent += `
    small.color-fg-muted.d-block{
      display:none!important
    }
  ` // 去掉作者

  pbStyle.textContent += `
    .js-comment-body>p{
      margin-bottom:0!important;
    }
  ` // 去掉多余空白

  document.head.appendChild(pbStyle);

})();