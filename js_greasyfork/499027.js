
// ==UserScript==
// @name           hjcx-vip: 海角纯享版 破解VIP,观看所有收费视频
// @namespace      https://github.com/foreverone0/hjcx_vip
// @version        1.0.2
// @author         foreverone0
// @description    破解 海角纯享版(https://hjcx.cc) 收费视频.本插件完全免费,请注意甄别,避免上当受骗.
// @homepage       https://github.com/foreverone0/hjcx_vip#readme
// @supportURL     https://github.com/foreverone0/hjcx_vip/issue
// @run-at         document-idle
// @match          https://haijiao.com/*
// @match          https://www.haijiao.com/*
// @match          https://www.hjcx.cc/*
// @match          https://hjcx.cc/*
// @match          */topic/*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/499027/hjcx-vip%3A%20%E6%B5%B7%E8%A7%92%E7%BA%AF%E4%BA%AB%E7%89%88%20%E7%A0%B4%E8%A7%A3VIP%2C%E8%A7%82%E7%9C%8B%E6%89%80%E6%9C%89%E6%94%B6%E8%B4%B9%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/499027/hjcx-vip%3A%20%E6%B5%B7%E8%A7%92%E7%BA%AF%E4%BA%AB%E7%89%88%20%E7%A0%B4%E8%A7%A3VIP%2C%E8%A7%82%E7%9C%8B%E6%89%80%E6%9C%89%E6%94%B6%E8%B4%B9%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
(function () {
  'use strict';

  function setCookie(name, value) {
    document.cookie = name + "=" + value + ";path=/;expires=" + new Date(Date.now() + 864e5).toUTCString() + ";";
  }
  setCookie("is_vip", "1");

})();
