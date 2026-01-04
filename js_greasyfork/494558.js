// ==UserScript==
// @name         Evolve 成就跟踪
// @namespace    http://tampermonkey.net/
// @version      2024-05-09
// @description  Evolve 成就跟踪 显示 完成 未完成 进度
// @author       Qingrts
// @match        https://g8hh.github.io/evolve/wiki.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494558/Evolve%20%E6%88%90%E5%B0%B1%E8%B7%9F%E8%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/494558/Evolve%20%E6%88%90%E5%B0%B1%E8%B7%9F%E8%B8%AA.meta.js
// ==/UserScript==
(function ($) {
  'use strict';
  window.addEventListener('hashchange', function() {
    checkHashChangeAndCallback();
  });

  $(document).on('click', function(e) {
    checkHashChangeAndCallback();
  });

  function checkHashChangeAndCallback() {
    if (isCjHash()) {
      cjFn();
    }
  }

  function isCjHash() {
    return window.location.hash === '#list-achievements';
  }
  function cjFn() {
    var h2s = $('#content h2');
    var achieveLists = $('#content .achieveList');

    var totalHasGet = 0;
    var totalNoGet = 0;
    for (let i = 0; i < h2s.length; i++) {
      const h2 = h2s[i];
      const len = achieveLists[i].children.length;
      var hasGet = $(achieveLists[i]).find('.achieve.has-text-warning').length;
      totalHasGet += hasGet;
      var noGet = $(achieveLists[i]).find('.achieve.has-text-fade').length;
      totalNoGet += noGet;
      var infoEl = $(h2).find('.info');
      var hasInfo = infoEl.length;
      var $info = null;
      if (hasInfo) {
        $info = infoEl;
      } else {
        $info = $('<span class="info">').appendTo(h2)
      }
      $info.text(`( 已获得：${hasGet}, 未获得: ${noGet}, 共: ${len} , 进度：${(hasGet/len * 100).toFixed(2)}%)`);
    }
    var secondTabInfo = $("#filtering nav.tabs:last-child .is-active a .info");
    var secondTabHasInfo = secondTabInfo.length;
    var secondTab = $("#filtering nav.tabs:last-child .is-active a");
    var $info = null;
    if (secondTabHasInfo) {
      $info = $(secondTabInfo);
    } else {
      $info = $('<span class="info">').appendTo(secondTab);
    }
    $info.text(`(${totalHasGet}/${totalNoGet + totalHasGet})`);
  }
})(jQuery);
