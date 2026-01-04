// ==UserScript==
// @name         Display none user ranking
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  twitch user rankingを非表示にする
// @author       You
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474960/Display%20none%20user%20ranking.user.js
// @updateURL https://update.greasyfork.org/scripts/474960/Display%20none%20user%20ranking.meta.js
// ==/UserScript==

// コメント非表示対象のユーザ名リスト
var hydeCommentWord = ['るりえ'];

/**
 * 指定した文字列が含まれるコメントを消す
 */
function hydeComment() {
    var commentDocument = document.querySelectorAll('.chat-line__message');
    commentDocument.forEach(function(currentValue) {
        var messages = currentValue.querySelectorAll('.text-fragment')
        messages.forEach(function(message) {
          var isHydeTarget = hydeCommentWord.some(function(word) {
            return message.textContent.includes(word)
          })


          if (isHydeTarget) {
            message.style.display = 'none';
          }
        })
    });
}

/**
 * ランキング表示を消す
 */
function hydeRanking() {
    var rankingDocument = document.querySelectorAll('.DGdsv');
    rankingDocument.forEach(function(currentValue) {
        currentValue.style.display = 'none';
    });
}

/**
 * サブスクギフト表示を消す
 */
function hydeNiceLine() {
    var niceLineDocument = document.querySelectorAll('.user-notice-line');
    niceLineDocument.forEach(function(currentValue) {
        currentValue.style.display = 'none';
    });
}

/**
 * コメント欄の要素を監視し、変更があれば非表示処理を実行する
 */
function attachObserve() {
  var commentsDocument = document.querySelector('.channel-root__right-column');

  if (!commentsDocument) return;

  var obs = new MutationObserver(hydeRanking);
  obs.observe(commentsDocument, { childList: true });

  var obsComment = new MutationObserver(hydeComment);
  obsComment.observe(commentsDocument, { childList: true });

  var niceLineComment = new MutationObserver(hydeNiceLine);
  niceLineComment.observe(commentsDocument, { childList: true });

  // 初期表示時の処理
  hydeRanking();
  hydeComment();
  hydeNiceLine();
}

window.onload = function() {
  // root要素を監視してコンテンツの変更があれば処理を実行する
  var rootDocument = document.querySelector('.channel-root__right-column');
  var rootObs = new MutationObserver(attachObserve);
  rootObs.observe(rootDocument, { childList: true, subtree: true });
}