// ==UserScript==
// @name         YouTubeのコメントのタイムラインを使うやつ
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  YouTubeのメドレーとかのコメント欄にある曲順のやつを使ってチャプターみたいにできる
// @author       Midra(@mdr_anm)
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @noframes
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/433789/YouTube%E3%81%AE%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E3%82%BF%E3%82%A4%E3%83%A0%E3%83%A9%E3%82%A4%E3%83%B3%E3%82%92%E4%BD%BF%E3%81%86%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/433789/YouTube%E3%81%AE%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E3%82%BF%E3%82%A4%E3%83%A0%E3%83%A9%E3%82%A4%E3%83%B3%E3%82%92%E4%BD%BF%E3%81%86%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

{
  'use strict';

  window.MIDEXT = window.MIDEXT || {};

  const MIDYT = window.MIDEXT.YouTube = {
    INTERVAL_MAX: 20,
    INTERVAL_TIME: 100,
    INTERVAL_TIME_PLAYING: 1000,
    INTERVAL_TIME_PAUSE: 2000,

    TEXT: {
      USE_TIMESTAMP: 'タイムスタンプを使用',
    },

    SELECTORS: {
      INFO: '#info-contents > ytd-video-primary-info-renderer',
      VIDEO: '#player video.video-stream',
      PLAYER: '#movie_player',
      COMMENTS: '#comments',
    },

    Elements: {
      info: null,
      infoExt: null,
      infoTime: null,
      infoTitle: null,
      playPauseBtn: null,
      player: null,
      video: null,
      comments: null,
      popup: null,
      popupItemPlaying: null,
    },

    SVG: {
      PLAY: '<svg version="1.1" viewBox="0 0 36 36"><path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z"></path></svg>',
      PAUSE: '<svg version="1.1" viewBox="0 0 36 36"><path d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z"></path></svg>',
      PREV: '<svg version="1.1" viewBox="0 0 36 36"><path d="m 12,12 h 2 v 12 h -2 z m 3.5,6 8.5,6 V 12 z"></path></svg>',
      NEXT: '<svg version="1.1" viewBox="0 0 36 36"><path d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z"></path></svg>',
      PLAYLIST: '<svg version="1.1" viewBox="0 0 24 24" style="height:75%"><path d="M22,7H2v1h20V7z M13,12H2v-1h11V12z M13,16H2v-1h11V16z M15,19v-8l7,4L15,19z"></path></svg>',
    },

    Templates: {
      useTimestampBtn: null,
      popup: null,
    },

    Info: {
      title: '',
      author: '',
      isPlaying: true,
      isVideo: location.href.match(/^(https:\/\/www\.youtube\.com\/watch).+/) !== null,
      isLive: false,
      currentTime: 0,
      currentTimeFormatted: '00:00',
    },

    log: (data) => console.log('【MIDEXT.YouTube】', data),
    errorLog: (data) => console.error('【MIDEXT.YouTube】', data),

    // セレクタを指定して要素を取得
    getElement: (selector) => new Promise((resolve, reject) => {
      let cnt = 0;
      const interval = setInterval(() => {
        // 繰り返しが指定回数超えたらエラー
        if (++cnt > MIDYT.INTERVAL_MAX) {
          reject(`getElement()\n要素の取得に失敗しました\n[${selector}]`);
          clearInterval(interval);
        }
        // 要素を探す
        const info = document.querySelector(selector);
        if (info) {
          resolve(info);
          clearInterval(interval);
        }
      }, MIDYT.INTERVAL_TIME);
    }),

    // 要素を生成
    generateElement: (tag = 'div', id, classList, child) => {
      const elem = document.createElement(tag);
      if (id) elem.id = id;
      if (classList) elem.classList.add(...classList);
      if (child) elem.appendChild(child);
      return elem;
    },

    // 要素を生成（HTMLテキストから）
    generateElementByHTML: (html) => {
      const elem = document.createElement('div');
      elem.insertAdjacentHTML('beforeend', html);
      return elem.firstElementChild;
    },

    Timestamp: {
      data: [],
      idx: -1,

      // タイムスタンプを更新
      update: () => {
        // 現在再生中のとこ
        if (MIDYT.Info.currentTime < MIDYT.Timestamp.data[0].time) {
          MIDYT.Timestamp.idx = -1;
        } else {
          const len = MIDYT.Timestamp.data.length;
          for (let i = 0; i < len; i++) {
            if (MIDYT.Timestamp.data[i].time <= MIDYT.Info.currentTime) {
              MIDYT.Timestamp.idx = i;
            } else break;
          }
        }
        MIDYT.Elements.infoTitle.textContent = MIDYT.Timestamp.data[MIDYT.Timestamp.idx]?.text;

        // ポップアップ表示されてたら表示を更新
        const item_playing = MIDYT.Elements.popup?.children[MIDYT.Timestamp.idx];
        if (MIDYT.Elements.popupItemPlaying !== item_playing) {
          MIDYT.Elements.popupItemPlaying?.classList.remove('midyt-playing');
          MIDYT.Elements.popupItemPlaying = item_playing;
          MIDYT.Elements.popupItemPlaying?.classList.add('midyt-playing');
        }
      },

      // 指定したタイムスタンプの再生位置に移動
      changeIdx: (idx) => {
        if (idx < 0 || MIDYT.Timestamp.data.length <= idx) {
          MIDYT.errorLog('指定したインデックスは範囲外です');
          return;
        };
        const timestamp = MIDYT.Timestamp.data[idx];
        MIDYT.Timestamp.idx = idx;
        MIDYT.Elements.player?.seekTo(timestamp.time);
        MIDYT.Timestamp.update();
      },

      // 前へ
      prev: () => {
        if (MIDYT.Timestamp.data[MIDYT.Timestamp.idx]?.time + 5 < MIDYT.Info.currentTime) {
          MIDYT.Timestamp.changeIdx(MIDYT.Timestamp.idx);
        } else {
          const prevIdx = MIDYT.Timestamp.idx - 1;
          if (0 <= prevIdx) {
            MIDYT.Timestamp.changeIdx(prevIdx);
          }
        }
      },

      // 次へ
      next: () => {
        const nextIdx = MIDYT.Timestamp.idx + 1;
        if (nextIdx < MIDYT.Timestamp.data.length) {
          MIDYT.Timestamp.changeIdx(nextIdx);
        }
      },

      // 初期化
      initialize: () => {
        MIDYT.Timestamp.data = [];
        MIDYT.Timestamp.idx = -1;
      },
    },

    // 現在の再生時間を更新
    updateCurrentTime: () => {
      MIDYT.Info.currentTime = MIDYT.Elements.player?.getCurrentTime();
      MIDYT.Elements.infoTime.textContent = MIDYT.Info.currentTimeFormatted = MIDYT.formatTimeBySec(MIDYT.Info.currentTime);
    },

    // 動画の情報を更新
    updateCurrentInfo: () => {
      const data = MIDYT.Elements.player?.getVideoData();
      MIDYT.Info.title = data?.title;
      MIDYT.Info.author = data?.author;
      MIDYT.Info.isLive = data?.isLive;
      MIDYT.Info.isPlaying = MIDYT.Elements.player?.getPlayerState() === 1;
      MIDYT.Elements.playPauseBtn.dataset.midytPlay = MIDYT.Info.isPlaying ? '1' : '0';
    },

    // 00:00:00形式に変換
    formatTimeBySec: (sec) => {
      const second = ('00' + Math.floor(sec % 60)).slice(-2);
      const minute = ('00' + Math.floor(sec / 60 % 60)).slice(-2);
      const hour = Math.floor(sec / 3600);
      return `${hour ? `${hour}:` : ''}${minute}:${second}`;
    },

    // インデックスを桁数に合わせる
    formatIdx: (idx, len) => {
      const max = String(len).length;
      return ('0'.repeat(max) + idx).slice(max * -1);
    },

    // URLから秒数を抽出
    getTimeByUrl: (url) => Number((url.match(/t=(\d+)s/) || [])[1] || -1),

    // 1行ごとに要素をまとめる
    getElementsOfLine: (elements = []) => {
      const elementsOfLine = {};
      let lineCnt = 0;
      for (const elem of elements) {
        elementsOfLine[lineCnt] = elementsOfLine[lineCnt] || [];
        if (!elem.textContent.match(/\n/)) {
          elementsOfLine[lineCnt].push(elem);
        } else {
          lineCnt++;
        }
      }
      return elementsOfLine;
    },

    // 繰り返し(実質メイン)
    interval: () => {
      if (MIDYT.Timestamp.data.length > 1) {
        // 現在の情報を更新
        MIDYT.updateCurrentInfo();
        // 再生画面以外、もしくはライブだったら繰り返し終了
        if (!MIDYT.Info.isVideo || MIDYT.Info.isLive) return;

        // 更新処理
        MIDYT.updateCurrentTime();
        MIDYT.Timestamp.update();

        MIDYT.Task.clearInterval(MIDYT.Task.interval);
        MIDYT.Task.interval = setTimeout(
          MIDYT.interval,
          MIDYT.Info.isPlaying && MIDYT.Info.isVideo && !MIDYT.Info.isLive
            ? MIDYT.INTERVAL_TIME_PLAYING
            : MIDYT.INTERVAL_TIME_PAUSE
        );
      }
    },

    // ポップアップを開く
    openPopup: (target, child, left, top, width, height) => {
      MIDYT.closePopup();
      MIDYT.Elements.popup = MIDYT.Templates.popup.cloneNode(true);
      if (child) MIDYT.Elements.popup.appendChild(child);
      if (left) MIDYT.Elements.popup.style.setProperty('left', left);
      if (top) MIDYT.Elements.popup.style.setProperty('top', top);
      if (width) MIDYT.Elements.popup.style.setProperty('width', width);
      if (height) MIDYT.Elements.popup.style.setProperty('max-height', height);
      target?.appendChild(MIDYT.Elements.popup);
    },

    // ポップアップを閉じる
    closePopup: () => {
      MIDYT.Elements.popup?.remove();
      MIDYT.Elements.popup = null;
    },

    // 「タイムスタンプを使用」をクリック
    clickUseTimestamp: (e) => {
      MIDYT.Timestamp.initialize();

      const parent = e.target.closest('#main');
      const content = parent?.querySelector('#content > #content-text');
      const elementsOfLine = MIDYT.getElementsOfLine(content?.children);

      // 行ごとに時間とテキストを判別して配列に入れる（ソートなし）
      for (const line in elementsOfLine) {
        const pushData = { time: null, text: '' };
        for (const elem of elementsOfLine[line]) {
          if (elem.matches('a.yt-simple-endpoint[href^="/watch"]') && !pushData.time) {
            pushData.time = MIDYT.getTimeByUrl(elem.href);
          } else {
            pushData.text += elem.textContent.trim();
          }
        }
        if (pushData.time !== null && pushData.text) MIDYT.Timestamp.data.push(pushData);
      }

      // 昇順にソート
      MIDYT.Timestamp.data.sort((a, b) => a.time - b.time);

      if (MIDYT.Timestamp.data.length > 1) {
        document.documentElement.scrollTop = 0;
        MIDYT.Elements.infoExt.classList.remove('midyt-isHidden');
        MIDYT.interval();
      } else {
        MIDYT.Elements.infoExt.classList.add('midyt-isHidden');
      }
    },

    // プレイリストボタンをクリック
    clickPlaylistBtn: (e) => {
      if (MIDYT.Elements.popup) {
        MIDYT.closePopup();
      } else {
        const fragment = document.createDocumentFragment();
        const len = MIDYT.Timestamp.data.length;
        for (let i = 0; i < len; i++) {
          const data = MIDYT.Timestamp.data[i];
          const item = MIDYT.generateElementByHTML(
`
<a class="midyt-playlist-item ytd-button-renderer">
  <tp-yt-paper-button class="ytd-button-renderer">
    <span class="midyt-playlist-idx">${MIDYT.formatIdx(i + 1, len)}</span>
    <span class="midyt-playlist-time midyt-vrL">${MIDYT.formatTimeBySec(data.time)}</span>
    <span class="midyt-playlist-title midyt-vrL">${data.text}</span>
  </tp-yt-paper-button>
</a>
`
          );
          item.addEventListener('click', (e) => MIDYT.Timestamp.changeIdx(i));
          fragment.appendChild(item);
        }
        MIDYT.openPopup(MIDYT.Elements.infoExt, fragment, null, null, '400px', '300px');
      }
    },

    // infoExtがクリック
    clickInfoExt: (e) => {
      const btn = e.target.closest('.midyt-btn');
      const action = btn?.dataset.midytAction;
      switch (action) {
        case 'list': MIDYT.clickPlaylistBtn(e); break;
        case 'prev': MIDYT.Timestamp.prev(); break;
        case 'next': MIDYT.Timestamp.next(); break;
        case 'play': MIDYT.Elements.player?.playVideo(); break;
        case 'pause': MIDYT.Elements.player?.pauseVideo(); break;
      }
    },

    Task: {
      interval: null,

      clearInterval: (task) => { if (task) clearTimeout(task) },
    },

    Observers: {
      comments: {
        CONFIG: {
          childList: true,
          subtree: true,
        },
        observer: null,
      },
    },
  };

  // メイン
  (async function () {
    try {
      // 拡張機能用のスタイルを追加
      document.head.insertAdjacentHTML('beforeend',
`
<style>
.midyt-isHidden {
  display: none !important;
}
.midyt-vrL {
  padding-left: 6px;
  margin-left: 6px;
  border-left: 1px solid var(--yt-spec-10-percent-layer);
}
.midyt-vrR {
  padding-right: 6px;
  margin-right: 6px;
  border-right: 1px solid var(--yt-spec-10-percent-layer);
}
#midyt-info {
  height: 20px;
  margin-top: -10px;
  margin-bottom: 5px;
  font-size: 14px;
  color: var(--yt-spec-text-secondary);
}
#midyt-info * {
  box-sizing: border-box;
}
#midyt-info tp-yt-paper-button {
  min-width: unset;
  padding: 0;
  text-align: unset;
}
#midyt-info-main {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: inherit;
}
#midyt-info-control {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: inherit;
  min-width: 120px;
  overflow: hidden;
}
#midyt-info-control .midyt-btn {
  display: block;
  flex: 1;
  width: 30px;
  height: 30px;
  margin-top: -5px;
}
#midyt-info-control .midyt-btn > tp-yt-paper-button {
  width: inherit;
  height: inherit;
}
#midyt-info-control .midyt-btn > tp-yt-paper-button > svg {
  width: inherit;
  height: inherit;
  fill: var(--yt-spec-text-secondary);
}
#midyt-info-play_pause[data-midyt-play="0"] > .midyt-btn[data-midyt-action="pause"],
#midyt-info-play_pause[data-midyt-play="1"] > .midyt-btn[data-midyt-action="play"] {
  display: none;
}
#midyt-info-now {
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#midyt-popup {
  position: relative;
  top: 5px;
  z-index: 999;
  background-color: var(--paper-listbox-background-color, var(--primary-background-color));
  box-shadow: var(--shadow-elevation-2dp_-_box-shadow);
  border-radius: 4px;
  max-width: 100vw;
  max-height: 250px;
  padding: 8px 0;
  overflow-y: scroll;
}
#midyt-popup > .midyt-playlist-item.midyt-playing {
  color: var(--yt-spec-text-primary);
  font-weight: bold;
}
#midyt-popup::-webkit-scrollbar {
  background-color: transparent;
}
#midyt-popup::-webkit-scrollbar-thumb {
  border-radius: 8px;
  border: 4px solid transparent;
  background-clip: content-box;
  background-color: var(--yt-spec-text-secondary);
}
.midyt-playlist-item > tp-yt-paper-button {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: unset;
  line-height: 20px;
  padding: 0 10px !important;
}
</style>
`
      );

      // 動画の情報を入れるとこを取得
      MIDYT.Elements.info = await MIDYT.getElement(MIDYT.SELECTORS.INFO);

      // 拡張機能用の要素を追加
      MIDYT.Elements.infoExt = MIDYT.generateElementByHTML(
`
<div id="midyt-info" class="midyt-isHidden">
  <div id="midyt-info-main">
    <div id="midyt-info-control">
      <a class="midyt-btn ytd-button-renderer" data-midyt-action="list">
        <tp-yt-paper-button class="ytd-button-renderer">${MIDYT.SVG.PLAYLIST}</tp-yt-paper-button>
      </a>
      <a class="midyt-btn ytd-button-renderer" data-midyt-action="prev">
        <tp-yt-paper-button class="ytd-button-renderer">${MIDYT.SVG.PREV}</tp-yt-paper-button>
      </a>
      <div id="midyt-info-play_pause" data-midyt-play="0">
        <a class="midyt-btn ytd-button-renderer" data-midyt-action="play">
          <tp-yt-paper-button class="ytd-button-renderer">${MIDYT.SVG.PLAY}</tp-yt-paper-button>
        </a>
        <a class="midyt-btn ytd-button-renderer" data-midyt-action="pause">
          <tp-yt-paper-button class="ytd-button-renderer">${MIDYT.SVG.PAUSE}</tp-yt-paper-button>
        </a>
      </div>
      <a class="midyt-btn ytd-button-renderer" data-midyt-action="next">
        <tp-yt-paper-button class="ytd-button-renderer">${MIDYT.SVG.NEXT}</tp-yt-paper-button>
      </a>
    </div>
    <div id="midyt-info-now">
      <span id="midyt-info-time" class="midyt-vrL"></span>
      <span id="midyt-info-title" class="midyt-vrL"></span>
    </div>
  </div>
</div>
`
      );
      MIDYT.Elements.infoExt.addEventListener('click', MIDYT.clickInfoExt);
      MIDYT.Elements.info.insertAdjacentElement('afterbegin', MIDYT.Elements.infoExt);

      MIDYT.Elements.infoTime = document.getElementById('midyt-info-time');
      MIDYT.Elements.infoTitle = document.getElementById('midyt-info-title');
      MIDYT.Elements.playPauseBtn = document.getElementById('midyt-info-play_pause');

      // テンプレート生成
      MIDYT.Templates.useTimestampBtn = MIDYT.generateElementByHTML(
`
<div class="midyt-comment-button ytd-comment-action-buttons-renderer">
  <a class="ytd-button-renderer">
    <tp-yt-paper-button class="ytd-button-renderer" style="font-size:1.3rem">${MIDYT.TEXT.USE_TIMESTAMP}</tp-yt-paper-button>
  </a>
</div>
`
      );
      MIDYT.Templates.popup = MIDYT.generateElementByHTML(`<div id="midyt-popup"></div>`);

      // プレイヤーを取得
      MIDYT.Elements.player = await MIDYT.getElement(MIDYT.SELECTORS.PLAYER);

      // コメントの親要素を取得
      MIDYT.Elements.comments = await MIDYT.getElement(MIDYT.SELECTORS.COMMENTS);

      // コメント一覧を監視
      MIDYT.Observers.comments.observer = new MutationObserver((event) => {
        MIDYT.Observers.comments.observer.disconnect();
        for (const evt of event) {
          const {addedNodes} = evt;
          if (!addedNodes?.length) continue;
          for (const added of addedNodes) {
            if (added.id !== 'toolbar') continue;
            const useTimestampBtn = MIDYT.Templates.useTimestampBtn.cloneNode(true);
            useTimestampBtn.addEventListener('click', MIDYT.clickUseTimestamp);
            added.appendChild(useTimestampBtn);
          }
        }
        MIDYT.Observers.comments.observer.observe(MIDYT.Elements.comments, MIDYT.Observers.comments.CONFIG);
      });
      if (MIDYT.Info.isVideo) {
        MIDYT.Observers.comments.observer.observe(MIDYT.Elements.comments, MIDYT.Observers.comments.CONFIG);
      }

      // なんかのデータ読み込まれたときのイベントっぽい
      window.addEventListener('yt-page-data-updated', async (e) => {
        MIDYT.Observers.comments?.observer.disconnect();
        MIDYT.Elements.infoExt.classList.add('midyt-isHidden');
        MIDYT.Timestamp.initialize();
        MIDYT.closePopup();

        if (MIDYT.Info.isVideo = e.detail.pageType === 'watch') {
          MIDYT.Observers.comments?.observer.observe(MIDYT.Elements.comments, MIDYT.Observers.comments?.CONFIG);
        }
      });

      MIDYT.Elements.video = await MIDYT.getElement(MIDYT.SELECTORS.VIDEO);
      MIDYT.Elements.video?.addEventListener('play', () => MIDYT.Elements.playPauseBtn.dataset.midytPlay = '1');
      MIDYT.Elements.video?.addEventListener('pause', () => MIDYT.Elements.playPauseBtn.dataset.midytPlay = '0');
    } catch (e) { MIDYT.errorLog(e) }
  })();
}