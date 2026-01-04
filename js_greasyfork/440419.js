// ==UserScript==
// @name         Pixiv Fanbox HydeUserComments
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  pixiv fanboxの投稿へのコメントから不要なユーザを消すスクリプト
// @author       You
// @match        https://*.fanbox.cc/*
// @grant        none
// @noframes     https://www.fanbox.cc/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440419/Pixiv%20Fanbox%20HydeUserComments.user.js
// @updateURL https://update.greasyfork.org/scripts/440419/Pixiv%20Fanbox%20HydeUserComments.meta.js
// ==/UserScript==

// コメント非表示対象のユーザ名リスト
var hydeRootCommentUserNames = ['るりえ', 'Kohei Kawada'];

/**
 * コメント非表示対象のユーザ名リストに含まれるユーザのコメントを非表示にする。
 */
function hydeComments () {
    var commentDocument = document.querySelectorAll('.cNhCxC');
    console.log(commentDocument)
    commentDocument.forEach(function(currentValue) {
        var userName = currentValue.querySelector('.irWlGR').textContent;

        console.log(userName)
        if (!hydeRootCommentUserNames.includes(userName)) return;

        currentValue.style.display = 'none';

        var replyDocument = currentValue.nextElementSibling;
        while(replyDocument) {
            var hydeReplyDocument = replyDocument.getElementsByClassName('sc-lmxeny-0 gQwore')[0];


            if (!hydeReplyDocument) break;

            hydeReplyDocument.style.display = 'none';
            replyDocument = replyDocument.nextElementSibling;
        }
    });
}

/**
 * 投稿コメント欄の要素を監視し、変更があれば非表示処理を実行する。
 */
function attachUserCommentsObserve() {
  var commentsDocument = document.querySelector('.dzZSZr');

  if (!commentsDocument) return;

  var obs = new MutationObserver(hydeComments);
  obs.observe(commentsDocument, { childList: true });

  // 初期表示時の処理
  hydeComments();
}

window.onload = function() {
  // root要素を監視してコンテンツの変更があれば処理を実行する。
  var rootDocument = document.querySelector('#root');
  var rootObs = new MutationObserver(attachUserCommentsObserve);
  rootObs.observe(rootDocument, { childList: true, subtree: true });

  // 初期表attachUserCommentsObserve示時の処理
  hydeComments();
}