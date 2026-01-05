// ==UserScript==
// @version        2017.03.02
// @name        51来呗简化页面
// @namespace   51laibei_Hide_Expired_Items
// @include      https://www.51laibei.com/*
// @encoding       utf-8
// @grant          unsafeWindow
// grant          GM_openInTab
// @description 51来呗简化页面不显示来这投
// @downloadURL https://update.greasyfork.org/scripts/27707/51%E6%9D%A5%E5%91%97%E7%AE%80%E5%8C%96%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/27707/51%E6%9D%A5%E5%91%97%E7%AE%80%E5%8C%96%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
$(function () {
  //hide laizhetou
      $('.hk-no td[title="来这投"], .myTip[title="来这投"]').parent().hide();
});
