// ==UserScript==
// @name            Wrap Texts in a Comment List
// @name:ja         一覧の長文コメントを折り返す
// @namespace       https://greasyfork.org/users/19523
// @version         0.3
// @description     Nico Live
// @description:ja  ニコニコ生放送でコメント一覧のコメントをコメント番号にまで折り返して表示する
// @match           https://live2.nicovideo.jp/watch/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/398445/Wrap%20Texts%20in%20a%20Comment%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/398445/Wrap%20Texts%20in%20a%20Comment%20List.meta.js
// ==/UserScript==

(function () {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode('' +
    '.___comment-text___2cPL0 {' +
      'white-space: initial;' +
      'display: initial;' +
    '}' +
    '.___table-row-base___S4V65, .___table-row___27ghe {' +
      'display: table;' +
      'width: 99%;' +
    '}' +
    '.___table-cell___3E0rV {' +
      'width: 99% !important;' +
      'display: inherit;' +
    '}' +
    '.___comment-number___2Qws3 {' +
      'display: initial;' +
    '}' +
    ''));
  document.getElementsByTagName('head')[0].appendChild(style);
})();
