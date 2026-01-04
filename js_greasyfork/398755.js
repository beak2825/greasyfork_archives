// ==UserScript==
// @name            Wrap Texts in a Comment List
// @name:ja         一覧の長文コメントを折り返す
// @namespace       https://greasyfork.org/users/19523
// @version         0.1
// @description     Niconico Video
// @description:ja  ニコニコ動画でコメント一覧のコメントを折り返して表示する
// @match           https://www.nicovideo.jp/watch/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/398755/Wrap%20Texts%20in%20a%20Comment%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/398755/Wrap%20Texts%20in%20a%20Comment%20List.meta.js
// ==/UserScript==

(function () {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode('' +
    '.CommentPanelDataGrid-TableCell {' +
      'white-space: initial !important;' +
      'line-height: initial !important;' +
      'display: table !important;' +
    '}' +
    '.DataGrid-TableCell {' +
      'white-space: initial !important;' +
    '}' +
    ''));
  document.getElementsByTagName('head')[0].appendChild(style);
})();
