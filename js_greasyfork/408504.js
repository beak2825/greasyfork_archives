// ==UserScript==
// @name    Reload on Twitch #2000 error
// @namespace    ReloadonTwitch#2000error
// @version    0.1.1
// @description    Twitchでエラー（#2000）が出たときにページを再読み込みするスクリプトです
// @author    khsk modded by bob_puyon
// @match    https://www.twitch.tv/*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/408504/Reload%20on%20Twitch%202000%20error.user.js
// @updateURL https://update.greasyfork.org/scripts/408504/Reload%20on%20Twitch%202000%20error.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // まずはメイン画面のロード完了を待つ
  const mo = new MutationObserver((data1, data2) => {
    const videoPlayer = document.querySelector('.video-player__default-player')
    if (videoPlayer) {
      errorWatcher()
      mo.disconnect();
      return
    }
  })
  mo.observe(document.body, {
    childList: true, subtree: true
  });


  // ビデオ監視処理定義
  const errorWatcher = () => {
    const errorMessage = 'ネットワークエラーが発生しました。再度お試しください。(エラー #2000)'

    // 検知クリックによる変更検知無限ループを防ぐためのフラグ。筋が悪い後から追加の場当たり処理
    let isCallbackClicked = false

    const videoPlayer = document.querySelector('.video-player__default-player')
    if (!videoPlayer) {
      console.log('no player')
      return
    }

    const mo = new MutationObserver((data1, data2) => {
      const message = document.querySelector('.content-overlay-gate__allow-pointers.tw-c-text-overlay')
      if (!message) {
        isCallbackClicked = false
        return
      }

      if (message.textContent != errorMessage) {
        isCallbackClicked = false
        return
      }

      if (isCallbackClicked) {
        return
      }
      console.log('Twitchでの#2000エラーを検出しました　ページを再読み込みします')
      isCallbackClicked = true
      location.reload();
    });

    const options = {childList: true, subtree:true};
    mo.observe(videoPlayer, options);
    console.log('Twitchでの#2000エラーの監視を開始しました')
  }
  })();
  