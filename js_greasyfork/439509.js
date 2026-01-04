// ==UserScript==
// @name         poke52自動切換繁中
// @namespace    https://wiki.52poke.com/
// @version      0.2
// @description  poke52自動切換繁中腳本
// @author       kartea
// @match        https://wiki.52poke.com/wiki/*
// @downloadURL https://update.greasyfork.org/scripts/439509/poke52%E8%87%AA%E5%8B%95%E5%88%87%E6%8F%9B%E7%B9%81%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/439509/poke52%E8%87%AA%E5%8B%95%E5%88%87%E6%8F%9B%E7%B9%81%E4%B8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 導向繁中網頁
    location.href = location.href.replace('/wiki/', '/zh-hant/');
})();