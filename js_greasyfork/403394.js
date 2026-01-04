// ==UserScript==
// @name            Show timestamps in a Comment List
// @name:ja         コメント一覧に書き込み時間を表示する
// @namespace       https://greasyfork.org/users/19523
// @version         0.1.1
// @description     Nico Live
// @description:ja  ニコニコ生放送でコメント一覧の各コメントにコメントした時間を表示する
// @match           https://live2.nicovideo.jp/watch/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/403394/Show%20timestamps%20in%20a%20Comment%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/403394/Show%20timestamps%20in%20a%20Comment%20List.meta.js
// ==/UserScript==

(function () {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode('' +
    '.___comment-time___1sDyW {' +
      'display: initial;' +
    '}' +
    '.___table-cell___3E0rV {' +
      'width: 99% !important;' +
    '}' +
    ''));
  document.getElementsByTagName('head')[0].appendChild(style);
})();
