// ==UserScript==
// @name         cytube_set_page_title
// @namespace    https://cytube.xyz/
// @version      1.7
// @description  残り時間とタイトルをタブに表示
// @author       utubo
// @match        *://cytube.xyz/*
// @match        *://cytube.mm428.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406019/cytube_set_page_title.user.js
// @updateURL https://update.greasyfork.org/scripts/406019/cytube_set_page_title.meta.js
// ==/UserScript==

(window.unsafeWindow || window).eval(` // ← チャンネルのjsにセットするときはこの行(と最後の行)を削除
(function() {
  // Util
  // アップされた動画はPLAYER.mediaLengthとかPLAYER.getTimeが動かないCytubeのバグかな？
  // しょうがないので履歴に表示されてるmm:ssから終了時間を取得する(プレイリストはオフの場合がある)
  var getMediaLength = () => {
    var len = 0;
    var qeTime = document.getElementById('queue_history').getElementsByClassName('qe_time')[0];
    if (!qeTime) return 0;
    for (var a of qeTime.textContent.split(':')) {
      len = len * 60 + (a | 0);
    }
    return len;
  };
  // PLAYER.getTimeの代わりにPLAYER.player.currentTimeが使えるっぽい
  var getTime = () => new Promise(resolve => {
    if (PLAYER.player && PLAYER.player.currentTime) {
      resolve(PLAYER.player.currentTime());
    } else if (PLAYER.getTime) {
      PLAYER.getTime(resolve);
    } else {
      resolve(0);
    }
  });
  // ここからメイン
  var lastMediaId = '';
  var mediaTitle = '';
  var mediaLength = 0;
  var setPageTitle = async () => {
    if (lastMediaId != PLAYER.mediaId) {
      lastMediaId = PLAYER.mediaId;
      mediaTitle =
        document.getElementById('currenttitle')
        .textContent
        .replace(__('Currently Playing: '), '');
      mediaLength = (PLAYER.mediaLength || getMediaLength()); // 一応PLAYER.mediaLengthも見ておこ…
    }
    var time = await getTime();
    var rest = mediaLength - time;
    var mmss = (rest <= 0) ? '--:--' : ((rest / 60 | 0) + ':' + ('00' + (rest % 60 | 0)).slice(-2));
    var title = mmss + ' ' + mediaTitle + ' - ' + CHANNEL.opts.pagetitle;
    PAGETITLE = title;
    document.title = title;
  };
  clearInterval(window.GM_SET_PAGE_TITLE_TIMER);
  window.GM_SET_PAGE_TITLE_TIMER = setInterval(setPageTitle, 1000);
})();
`); // ← チャンネルのjsにセットするときはこの行も削除

