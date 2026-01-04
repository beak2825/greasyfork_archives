// ==UserScript==
// @name         cytube_auto_mute
// @namespace    https://cytube.xyz/
// @version      0.1
// @description  自動ミュート
// @author       utubo
// @match        *://cytube.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406875/cytube_auto_mute.user.js
// @updateURL https://update.greasyfork.org/scripts/406875/cytube_auto_mute.meta.js
// ==/UserScript==

(window.unsafeWindow || window).eval(`
(function() {
  // 設定 ------------------------------------
  // ミュートにするユーザー名
  var MUTE_USER = ['xxxxx', 'yyyyy'];
  // ※もしかしたらスクリプトの自動更新をONにしてると更新したときに設定が消えちゃうかも
  // -----------------------------------------

  // 本体 ------------------------------------
  // jsが再読込されると多分2重で動いちゃうので既にobseverが存在してたら破棄する
  var win = window.unsafeWindow || window;
  var obsever = win.GM_AUTO_MUTE_OBSERVER;
  if (obsever) {
    obsever.disconnect();
  }
  // currentTitleが変更されたらユーザー名を判定する
  var isAutoMuted = false;
  var lastVolume = 0.0;
  var getVolume = () => new Promise((resolve, reject) => { PLAYER.getVolume(resolve); });
  var setVolume = v => setTimeout(() => { PLAYER.setVolume(v);}, 500);
  var autoMute = async () => {
    var current = document.getElementsByClassName('queue_active')[0];
    if (!current) return;
    var user = current.getAttribute('title').replace('Added by: ', '');
    if (MUTE_USER.includes(user)) {
      isAutoMuted = true;
      lastVolume = await getVolume() || lastVolume;
      setVolume(0);
    } else if (isAutoMuted) {
      isAutoMuted = false;
      if (lastVolume) setVolume(lastVolume);
    }
  };
  obsever = new MutationObserver(autoMute);
  obsever.observe(document.getElementById('currenttitle'), { childList: true });
  win.GM_AUTO_MUTE_OBSERVER = obsever;
})();
`);
