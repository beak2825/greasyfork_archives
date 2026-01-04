// ==UserScript==
// @name         魂+跳转
// @author       ohao
// @description  魂+网站跳转
// @version      0.1
// @match        *://*.blue-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://*.www.level-plus.net/*
// @match        *://*.white-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://*.east-plus.net/*
// @icon         https://www.google.com/s2/favicons?domain=blue-plus.net
// @grant        none
// @namespace https://greasyfork.org/users/683947
// @downloadURL https://update.greasyfork.org/scripts/482380/%E9%AD%82%2B%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/482380/%E9%AD%82%2B%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
  var currentDomain = window.location.hostname;
  var redirectToDomain = 'bbs.imoutolove.me';

  if (currentDomain !== redirectToDomain) {
    var newURL = window.location.href.replace(currentDomain, redirectToDomain);
    window.location.href = newURL;
  }
})();
