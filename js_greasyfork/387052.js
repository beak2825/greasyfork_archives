// ==UserScript==
// @name         蜜柑计划(Mikan Project)直接打开磁力链接
// @namespace    https://github.com/Blacktea0
// @version      0.4
// @description  在复制磁力链接的时候同时打开该链接
// @author       Blacktea0
// @match        http*://mikanani.me/*
// @match        http*://mikanime.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/387052/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%28Mikan%20Project%29%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/387052/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%28Mikan%20Project%29%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

'use strict';

(function () {
  var $;

  if (window.$) {
    $ = window.$;
  } else {
    console.log('jQuery not found.');
    return;
  }

  $(document).on('click', '[data-clipboard-text]', function (event) {
    var target = event.target;
    var text = $(target).attr('data-clipboard-text');
    window.open(text, '_blank').focus();
  });
})();

