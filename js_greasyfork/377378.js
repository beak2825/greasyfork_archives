// ==UserScript==
// @name        nicovideo - pause watch history
// @name:ja     視聴履歴に残さない(一時停止)
// @namespace   https://greasyfork.org/users/19523
// @description このユーザスクリプトを有効にしている間はニコニコ動画内で動画を再生してもその動画が視聴履歴に残りません(たぶん)
// @include     http://www.nicovideo.jp/*
// @include     https://www.nicovideo.jp/*
// @include     http://www.nicovideo.jp/watch/*
// @include     https://www.nicovideo.jp/watch/*
// @version     0.2.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/377378/nicovideo%20-%20pause%20watch%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/377378/nicovideo%20-%20pause%20watch%20history.meta.js
// ==/UserScript==


window.deleteFromHistory = function (videoId) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/my/history', true);
  xhr.send();

  xhr.addEventListener('load', function () {
    try {
      videoId = typeof videoId === 'undefined' ? location.pathname.match(/\/watch\/([^/?&#]+)/)[1] : videoId.match(/[A-Za-z]*\d+$/)[0];
      var token = xhr.response.match(/VideoViewHistory\.Action\('(.+?)'/)[1];
    } catch (e) {
      isSent = true;
      return;
    }

    var post = new XMLHttpRequest();
    post.open('POST', '/my/history', true);
    post.withCredentials = true;
    post.responseType = 'json';
    post.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    post.setRequestHeader('Accept', 'application/json, text/javascript, *; q=0.01');
    post.setRequestHeader('x-requested-with', 'XMLHttpRequest');
    post.send('mode=delete&video_id=' + videoId + '&token=' + token + '&innerPage=1');

    post.addEventListener('load', function () {
      isSent = true;
    });
  });

  xhr.addEventListener('error', function () {
    isSent = true;
  });
};

var isSent = false;
var delay = 15000;

(function () {
  if (!location.pathname.startsWith('/watch/')) {
    isSent = true;
    return;
  }

  if (document.getElementById('external_nicoplayer')) {
    setTimeout(deleteFromHistory, delay);
    var observer = new MutationObserver(function (mutations) {
      isSent = false;
      setTimeout(deleteFromHistory, delay);
    });
  } else {
    deleteFromHistory();
    var observer = new MutationObserver(function (mutations) {
      isSent = false;
      deleteFromHistory();
    });
  }
  observer.observe(document.head.getElementsByTagName('title')[0], { childList: true });
})();

window.addEventListener('beforeunload', function (e) {

  if (isSent) {
    return;
  }

  setTimeout(function () {
    alert('視聴履歴から削除中...');
  }, 0);
  deleteFromHistory();

  e.returnValue = '視聴履歴から削除中';
  // e.preventDefault();

}/*, { passive: false }*/);
