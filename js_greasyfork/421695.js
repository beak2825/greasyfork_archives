// ==UserScript==
// @name           Append a Reservation Button
// @name:ja        タイムシフト予約ボタン追加
// @namespace      https://greasyfork.org/users/19523
// @description    on the community page and the channel page.
// @description:ja コミュニティページやチャンネルページのニコ生配信一覧にタイムシフト予約ボタンを付加
// @include        https://ch.nicovideo.jp/*/live*
// @include        https://com.nicovideo.jp/community/*
// @include        https://com.nicovideo.jp/live/*
// @version        0.1.4
// @grant          none
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/421695/Append%20a%20Reservation%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/421695/Append%20a%20Reservation%20Button.meta.js
// ==/UserScript==

if (location.href.match(/com.+community/)) {
  var target = document.querySelector('li.liveNoRecent').parentElement.parentElement;
  var callback = function (mutations) {
    createReservationBtn('a.now_live_inner', 'float: right;writing-mode: vertical-rl;text-orientation: upright;');
    createReservationBtn('a.liveTitle', '');
    observer.disconnect();
  };
} else if (location.href.match(/com.+live/)) {
  var target = document.getElementsByClassName('area-communityLive')[0];
  var callback = function (mutations) {
    createReservationBtn('a.liveTitle', 'float: right;');
    observer.disconnect();
  };
} else if (location.href.match(/ch.+live/)) {
  createReservationBtn('.title > a', 'float: right;');
  return;
}

var observer = new MutationObserver(callback);
observer.observe(target, { childList: true, subtree: true });
var target = null;

function createReservationBtn(selector, style) {
  var streams = document.querySelectorAll(selector);

  for (var i = 0; streams[i]; i++) {
    var btn = document.createElement('a');
    btn.innerHTML = 'TS予約';
    btn.setAttribute('style', style);
    btn.addEventListener('click', { handleEvent: reserve, videoId: streams[i].pathname.match(/\d+$/), btn: btn });

    streams[i].insertAdjacentElement('beforebegin', btn);
  }
}

function reserve(ev) {
  var post = new XMLHttpRequest();
  post.open('POST', '//live.nicovideo.jp/api/timeshift.reservations');
  post.responseType = 'json';
  post.withCredentials = true;

  var fd = new FormData();
  fd.set('vid', this.videoId);
  post.send(fd);

  var self = this;
  var errorAlert = function () {
    alert('Reservation Failed: Maybe, you need a bug report.');
  };
  post.addEventListener('error', errorAlert);
  post.addEventListener('load', function () {
    if (!post.response || !post.response.meta) {
      errorAlert();
    }
    if (post.response.meta.status == 200) {
      self.btn.innerHTML = '完了';
    } else {
      self.btn.innerHTML = '失敗';
    }
    setTimeout(function () { self.btn.innerHTML = 'TS予約'; }, 5000);
  });
}
