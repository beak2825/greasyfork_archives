// ==UserScript==
// @name            Shinymas Audio Keeper
// @name:ja         シャニマス Audio Keeper
// @namespace       https://greasyfork.org/ja/users/1492018-sino87
// @version         1.0
// @description     Keep ShinyColors Audio in background
// @description:ja  シャニマスのウィンドウが非アクティブの場合でも音声を流し続けます
// @match           https://shinycolors.enza.fun/*
// @run-at          document-start
// @license         MIT
// @icon            http://www.google.com/s2/favicons?domain=https://shinycolors.idolmaster.jp/
// @downloadURL https://update.greasyfork.org/scripts/546521/%E3%82%B7%E3%83%A3%E3%83%8B%E3%83%9E%E3%82%B9%20Audio%20Keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/546521/%E3%82%B7%E3%83%A3%E3%83%8B%E3%83%9E%E3%82%B9%20Audio%20Keeper.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.addEventListener('blur', ev => ev.stopImmediatePropagation(), { capture: true });
  document.addEventListener('visibilitychange', ev => ev.stopImmediatePropagation(), { capture: true });
})();