// ==UserScript==
// @name           Hide a Comment List
// @name:ja        コメント一覧も非表示
// @namespace      https://greasyfork.org/users/19523
// @version        0.1
// @description    Hide also a list of comments when you press the hide comments button on ニコニコ生放送
// @description:ja ニコニコ生放送でコメント非表示にするとコメント一覧も非表示にします
// @match          https://live2.nicovideo.jp/watch/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/382848/Hide%20a%20Comment%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/382848/Hide%20a%20Comment%20List.meta.js
// ==/UserScript==

document.querySelector('button[class*="comment-button"]').addEventListener('click', function () {
  var button, panel;
  if (!button) {
    button = document.querySelector('button[class*="comment-button"]');
    panel = document.querySelector('div[class*="comment-panel"]');
  }
  if (button.dataset.toggleState.toLowerCase() === 'true') {
    panel.style.visibility = 'hidden';
  } else {
    panel.style.visibility = '';
  }
});
