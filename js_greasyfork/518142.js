// ==UserScript==
// @name         南+ 网址跳转
// @description  南+ 各种网址自动跳转
// @version      0.1
// @license MIT
// @match        *://*.blue-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://*.white-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://*.east-plus.net/*
// @icon         https://www.google.com/s2/favicons?domain=blue-plus.net
// @grant        none
// @run-at       document-start

// @namespace https://greasyfork.org/users/1299761
// @downloadURL https://update.greasyfork.org/scripts/518142/%E5%8D%97%2B%20%E7%BD%91%E5%9D%80%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/518142/%E5%8D%97%2B%20%E7%BD%91%E5%9D%80%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.stop(); // Stop the page from loading
  var currentDomain = window.location.hostname;
  var redirectToDomain = 'bbs.imoutolove.me';

  if (currentDomain !== redirectToDomain) {
    var newURL = window.location.href.replace(currentDomain, redirectToDomain);
    window.location.href = newURL;
  }
})();
