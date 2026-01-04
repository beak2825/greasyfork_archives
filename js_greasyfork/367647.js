// ==UserScript==
// @name        ニコニコ動画 動画視聴モード
// @description 動画視聴時の補助機能詰め合わせ。
// @match       *://www.nicovideo.jp/watch/*
// @author      toshi (https://github.com/k08045kk)
// @license     MIT License | https://opensource.org/licenses/MIT
// @version     13.1
// @since       1.0 - 2018/01/01 - 初版
// @since       2.0 - 2018/05/07 - 機能を統合「ニコニコ動画のHTML5/Flash版で視聴するバーを移動」
// @since       3.0 - 2018/07/07 - 動画部のクリックで再生/停止制御を追加
// @since       3.1 - 2018/10/21 - https対応
// @since       4.0 - 2019/06/11 - 動画部のクリックで再生/停止制御を再度対応
// @since       5.0 - 2019/06/20 - プレイヤー内のポップアップメニューと最上部バーの被り対応
// @since       6.0 - 2019/10/04 - 動画のクリックで再生/停止が動作しなくなっていた（クリック領域を変更）
// @since       6.1 - 2019/10/24 - プレイヤー上部の空間を減らす
// @since       7.0 - 2020/07/08 - ニコニコ動画バージョンアップ対応
// @since       8.0 - 2020/10/31 - 誘導があまりにも邪魔なため、しかたなく非表示
// @since       9.0 - 2020/12/03 - シリーズリンクのパラメータを削除（訪問済みリンク判定しやすくする）
// @since       9.1 - 2020/12/03 - fix メニューバークリックのモード切換え処理が動作していなかった
// @since       9.2 - 2020/12/04 - fix 内部的なページ遷移後にシリーズリンクのパラメータを削除しない
// @since       9.4 - 2020/12/07 - 内部ページ移動時にページ最上部へ移動
// @since       10.0 - 2021/01/06 - Flash処理を削除
// @since       11.0 - 2021/01/13 - fix メニューバークリックのモード切換え処理が動作していなかった
// @since       11.1 - 2021/02/26 - fix メニューバークリックのモード切換え処理で不必要に動作する
// @since       11.2 - 2021/02/26 - fix シリーズがない動画で動作が不安定になる
// @since       12.0 - 2021/12/25 - 停止位置を保存する
// @since       13.0 - 2023/05/30 - ニコニコ動画の仕様変更対応（読み込みが遅くなった？）
// @see         https://www.bugbugnow.net/2018/01/niconicovideomode.html
// @see         https://greasyfork.org/ja/scripts/367647
// @grant       none
// @namespace https://www.bugbugnow.net/
// @downloadURL https://update.greasyfork.org/scripts/367647/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E5%8B%95%E7%94%BB%E8%A6%96%E8%81%B4%E3%83%A2%E3%83%BC%E3%83%89.user.js
// @updateURL https://update.greasyfork.org/scripts/367647/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E5%8B%95%E7%94%BB%E8%A6%96%E8%81%B4%E3%83%A2%E3%83%BC%E3%83%89.meta.js
// ==/UserScript==



// 動画視聴モードへ移行
// 上部のメニューバーをクリックで通常/動画モード切換える
window.addEventListener('load', function() {
  const toggleVideoMode = function() {
    let player = document.querySelector('.MainContainer');
    if (player) {
      if (document.querySelector('.videoMode') == null) {
        document.querySelector('.WatchAppContainer-main').insertAdjacentElement('afterbegin', player);
        player.classList.add('videoMode');
        player.style.marginTop = '32px';
      } else {
        document.querySelector('.HeaderContainer').insertAdjacentElement('afterend', player);
        player.classList.remove('videoMode');
        player.style.marginTop = '';
      }
    }
  };
  
  window.addEventListener('click', function(event) {
    const header = document.querySelector('#CommonHeader > div > div');
    const header2 = document.querySelector('#CommonHeader > div > div > div > div + div');
    //if (header.contains(event.target) || header == event.target) {
    if (header == event.target || header2 == event.target) {
      toggleVideoMode();
    }
  });
  
  // 動画モードへ移行
  toggleVideoMode();
});



// 動画のクリックで再生/停止
window.addEventListener('load', function() {
  const player = document.querySelector('.InView.VideoContainer');
  if (player != null) {
    player.addEventListener('click', function() {
      const play = document.querySelector('.ActionButton.ControllerButton.PlayerPlayButton');
      const stop = document.querySelector('.ActionButton.ControllerButton.PlayerPauseButton');
      if (play != null) {
        play.click();
      } else if (stop != null) {
        stop.click();
      }
    });
  }
});



// 誘導を非表示
(function () {
  function addLocalStyle(text) {
    const style = document.createElement('style');
    style.textContent = text;
    document.head.appendChild(style);
  };
  window.addEventListener('load', function() {
    // 動画内ポップアップを非表示
    addLocalStyle('.PreVideoStartPremiumLinkOnEconomyTimeContainer { display:none; }');
  });
  // 補足：本処理は、ユーザースタイルとして独立させるほうが正しい
})();



// シリーズリンクのパラメータを削除（ブラウザが訪問済みリンク判定しやすくする）
(function () {
  let func = function() {
    const target = document.querySelector('.VideoDescription');
    const config = {attributes:true, childList:true, subtree:true};
    new MutationObserver(callback).observe(target, config);
  };
  const callback = function(mutationsList, observer) {
    if (func) {
      func();
      func = null;
    }
    document.querySelectorAll('a.RouterLink').forEach(function(v) {
      if (v.href.indexOf('?') != -1) {
        v.href = v.href.split('?')[0];
      }
    });
  };
  window.addEventListener('load', callback);
})();



// 内部ページ移動時にページ最上部へ移動
(function () {
  document.body.addEventListener('click', function(event) {
    if (event && event.target && event.target.href) {
      if (event.target.href.indexOf('://www.nicovideo.jp/watch/') != -1) {
        window.scroll({top:0, behavior:'smooth'});
      }
    }
  });
})();



// 停止位置を保存する（再生中の位置は保存しない）
// （停止時にブラウザが再起動した場合への配慮）
window.addEventListener('pause', (event) => {
  const url = new URL(window.location);
  const video = document.querySelector('#MainVideoPlayer > video');
  if (video && video.currentTime != video.duration && video.currentTime > 10) {
    url.searchParams.set('from', Math.floor(video.currentTime) - 5);
    history.replaceState(history.state, document.title, url.toString());
  }
}, true);
window.addEventListener('play', (event) => {
  const url = new URL(window.location);
  const video = document.querySelector('#MainVideoPlayer > video');
  if (video && url.searchParams.has('from')) {
    url.searchParams.delete('from');
    history.replaceState(history.state, document.title, url.toString());
  }
}, true);