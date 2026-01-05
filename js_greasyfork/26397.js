// ==UserScript==
// @name         AbemaTV Volume Control
// @namespace    https://greasyfork.org/ja/scripts/26397
// @version      23
// @description  ABEMA視聴中にキーボードやマウスホイールで音量を調整します。
// @match        https://abema.tv/*
// @grant        none
// @license      MIT License
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/26397/AbemaTV%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/26397/AbemaTV%20Volume%20Control.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ---------- Settings ---------- */

  // 変更した値はブラウザのローカルストレージに保存するので
  // スクリプトをバージョンアップするたびに書き換える必要はありません。
  // （値が0のときは以前に変更した値もしくは初期値を使用します）

  // キーボードでのボリューム調整量
  // 初期値：5
  // 有効値：1 ～ 20
  let adjustKeyboard = 0;

  // マウスホイールでのボリューム調整量
  // 初期値：1
  // 有効値：1 ～ 20
  let adjustWheel = 0;

  // ブラウザの開発者ツールにデバッグログを表示
  // 初期値：0
  // 有効値：0（表示しない）もしくは1（表示する）
  const debugLog = 0;

  /* ------------------------------ */

  const sid = 'VolumeControl';

  /**
   * localStorageからデータを安全に取得する
   * @param {string} key
   * @returns {Object<string, any>}
   */
  const getLS = (key) => {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '{}');
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
      return {};
    } catch (e) {
      console.error(`${sid}: Failed to parse localStorage for ${key}`, e);
      return {};
    }
  };

  /** @type {Object<string, any>} */
  const ls = getLS(sid);

  const moConfig = { attributes: true, characterData: true };
  const moConfig2 = { childList: true, subtree: true };
  /** @type {{initialized: boolean, lastMain: HTMLElement|null}} */
  const data = {
    initialized: false,
    lastMain: null,
  };
  const flag = {
    scroll: true,
    type: 0,
    volume: false,
    volumeDownMuted: false,
    wheel: false,
  };
  const interval = { info: 0, init: 0, video: 0, wheel: 0 };
  const selector = {
    button: '.com-playback-Volume__icon-button',
    fullscreen: ':not(:root):fullscreen',
    inner: '.c-application-DesktopAppContainer__content',
    main: 'main',
    marker:
      '.com-tv-TVController__volume .com-a-Slider__marker, .com-vod-VODScreen__volume .com-a-Slider__marker, .com-vod-LiveEventPayperviewControlBar__volume .com-a-Slider__marker',
    player:
      '.com-tv-TVScreen__player-container, .c-vod-EpisodePlayerContainer-wrapper, .c-tv-TimeshiftPlayerContainerView, .com-live-event-LiveEventPlayerAreaLayout__player',
    slider:
      '.com-tv-TVController__volume .com-a-Slider, .com-vod-VODScreen__volume .com-a-Slider, .com-vod-LiveEventPayperviewControlBar__volume .com-a-Slider',
    sliderContainer: '.com-playback-Volume__slider-container',
    sliderHighlighter:
      '.com-tv-TVController__volume .com-a-Slider__highlighter, .com-vod-VODScreen__volume .com-a-Slider__highlighter, .com-vod-LiveEventPayperviewControlBar__volume .com-a-Slider__highlighter',
    splash: '.com-a-Video__video, .com-live-event__LiveEventPlayerView',
    tv: '.com-tv-TVScreen__player-container',
    video: 'video[src]:not([style*="display: none;"])',
    vod: '.c-vod-EpisodePlayerContainer-container, .c-tv-TimeshiftPlayerContainerView, .com-live-event-LiveEventPlayerSectionLayout__player-area-inner--video',
    volume:
      '.com-playback-Volume--desktop, .com-vod-VODScreen__volume > .com-playback-Volume, .c-vod-EpisodePlayerContainer-ad-container--show .com-video_ad-VideoAdController__volume > .com-playback-Volume',
  };
  let observerS;

  /**
   * ページにイベントリスナーを追加
   */
  const addEventPage = () => {
    const id = document.querySelector(`.${sid}_Event`);
    if (!id) {
      log('addEventPage');
      /** @type {HTMLElement|null} */
      const inner = document.querySelector(selector.inner);
      if (inner) {
        inner.classList.add(`${sid}_Event`);
        inner.addEventListener('mousedown', checkMousedown, false);
        inner.addEventListener('wheel', checkMouseWheel, { passive: true });
      }
    }
  };

  /**
   * スタイルを追加
   * @param {string} s
   */
  const addStyle = (s) => {
    const disablePageScroll = `
html:has(.com-vod-VODResponsiveMainContent) {
  overflow-y: hidden;
  scrollbar-gutter: stable;
}
    `,
      init = `
.${sid}_Info {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  bottom: 70px;
  color: #fff;
  display: flex;
  justify-content: center;
  left: 90px;
  min-height: 30px;
  min-width: 3em;
  opacity: 0;
  padding: 0.5ex 1ex;
  position: fixed;
  user-select: none;
  visibility: hidden;
  z-index: 2260;
}
.${sid}_Info.vc_show {
  opacity: 0.8;
  visibility: visible;
}
.${sid}_Info.vc_hidden {
  opacity: 0;
  transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
  visibility: hidden;
}
.${sid}_Info span:before,
.${sid}_Info span:after {
  box-sizing: content-box !important;
}
.vc_icon_before_hidden .${sid}_Volume2::before,
.vc_icon_after_hidden .${sid}_Volume2::after {
  visibility: hidden;
}
.${sid}_Info span::before,
.${sid}_Info span::after {
  content: '';
  display: block;
  position: absolute;
}
.${sid}_Volume1 {
  height: 20px;
  position: relative;
  width: 30px;
}
.${sid}_Volume1::before {
  background: #fff;
  height: 8px;
  left: 2px;
  top: 6px;
  width: 4px;
}
.${sid}_Volume1::after {
  border: 5px transparent solid;
  border-left-width: 0;
  border-right-color: #fff;
  height: 8px;
  left: 6px;
  top: 1px;
  width: 0;
}
.${sid}_Volume2,
.${sid}_Volume3 {
  position: absolute;
}
.${sid}_Volume2 {
  left: 8px;
  top: 5px;
}
.${sid}_Volume2::before,
.${sid}_Volume2::after {
  border: 2px solid transparent;
  border-right: 2px solid #fff;
}
.${sid}_Volume2::before {
  border-radius: 20px;
  height: 20px;
  left: -3px;
  top: -2px;
  width: 20px;
}
.${sid}_Volume2::after {
  border-radius: 10px;
  height: 15px;
  left: -2px;
  top: 1px;
  width: 15px;
}
.${sid}_Volume3 {
  left: 20px;
  top: 14px;
}
.${sid}_Volume3::before,
.${sid}_Volume3::after {
  background-color: #fff;
  height: 2px;
  width: 12px;
}
.${sid}_Volume3::before {
  transform: rotate(45deg);
}
.${sid}_Volume3::after {
  transform: rotate(135deg);
}
.${sid}_Volume4 {
  font-weight: bold;
  margin-left: 1ex;
}
    `,
      style = document.createElement('style');
    if (s === 'disablePageScroll') {
      style.textContent = disablePageScroll;
    } else if (s === 'init') {
      style.textContent = init;
    }
    style.id = `${sid}_style_${s}`;
    document.head.appendChild(style);
  };

  /**
   * 音量を変更できるか判別する
   * @returns {boolean}
   */
  const changeableVolume = () => {
    const vi = document.querySelector(selector.video);
    if (vi && !document.querySelector('.vjs-tech')) {
      flag.type = 2;
      return true;
    }
    flag.type = 0;
    return false;
  };

  /**
   * 動画の音をミュート・解除
   * @param {KeyboardEvent|MouseEvent} e
   * @param {boolean} f
   */
  const changeMute = (e, f) => {
    if (changeableVolume()) {
      const vi = returnVideo(),
        /** @type {HTMLButtonElement|null} */
        button = document.querySelector(selector.button);
      if (vi && ((e instanceof MouseEvent && e.button === 1 && f) || !f)) {
        if (button) button.click();
        if (vi.volume === 0) showInfo('');
        else showInfo(String(Math.floor(vi.volume * 100)));
      }
    }
  };

  /**
   * 音量スライダーの位置が動いたとき
   */
  const changeSlider = () => {
    const vi = returnVideo();
    if (vi) {
      if (vi.volume === 0) showInfo('');
      else showInfo(String(Math.floor(vi.volume * 100)));
    }
  };

  /**
   * 音量を変更する
   * @param {*} marker ボリュームマーカーの位置
   * @param {*} vol 音量の値
   */
  const changeVolume = (marker, vol) => {
    const full = document.querySelector(selector.fullscreen),
      info = full
        ? document.querySelector(`.${sid}_Info_Full`)
        : document.querySelector(`.${sid}_Info_Standard`);
    if (info) {
      vol = vol > 1 ? 1 : vol < 0 ? 0 : vol;
      vol = floor2(vol);
      if (vol > 0.66) {
        info.classList.remove('vc_icon_before_hidden');
        info.classList.remove('vc_icon_after_hidden');
      } else if (vol > 0.33) {
        info.classList.add('vc_icon_before_hidden');
        info.classList.remove('vc_icon_after_hidden');
      } else {
        info.classList.add('vc_icon_before_hidden');
        info.classList.add('vc_icon_after_hidden');
      }
      clearTimeout(interval.wheel);
      flag.wheel = true;
      interval.wheel = setTimeout(() => {
        flag.wheel = false;
        moveVolumeMarker(marker, 'mouseup');
      }, 150);
      moveVolumeMarker(marker, 'mousedown');
    }
  };

  /**
   * キーボードで音量を変更する
   * @param {number} a 音量の変更量
   */
  const changeVolumeKeyboard = (a) => {
    if (changeableVolume()) {
      const vi = returnVideo();
      flag.volume = true;
      changeVolume(a * 100, vi ? floor2(vi.volume) + a / -1 : 0);
    } else log('changeVolumeKeyboard: not changeableVolume');
  };

  /**
   * 動画を構成している要素に変更があったとき
   */
  const checkChangeElements = () => {
    const inner = document.querySelector(selector.inner);
    if (inner) {
      setTimeout(() => {
        addEventPage();
        checkVolumeElementEventListener();
        checkVolumeSliderObserve();
      }, 50);
    }
  };

  /**
   * フルスクリーンの変更を検知して必要なら音量を表示する要素を追加する
   */
  const checkFullScreen = () => {
    const info = document.querySelector(`.${sid}_Info_Full`);
    hideInfo();
    if (!info) {
      log('checkFullScreen');
      createInfo('full');
    }
  };

  /**
   * キーボードのキーを押したとき
   * @param {KeyboardEvent} e
   */
  const checkKeyDown = (e) => {
    if (
      !(
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
    ) {
      if (!e.altKey && !e.ctrlKey && !e.metaKey) {
        const style = getComputedStyle(document.documentElement),
          tv = /^https:\/\/abema\.tv\/now-on-air\/.+$/.test(location.href)
            ? true
            : false;
        if (
          (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
          ((tv && !e.shiftKey) ||
            (!tv &&
              (e.shiftKey ||
                style.height === '0px' ||
                style.overflowY === 'hidden')))
        ) {
          e.stopPropagation();
          const vi = returnVideo();
          if (vi?.volume === 0 && !flag.volumeDownMuted) changeMute(e, false);
          else {
            if (e.key === 'ArrowUp') {
              changeVolumeKeyboard(-adjustKeyboard / 100);
            } else if (e.key === 'ArrowDown' && !flag.volumeDownMuted) {
              changeVolumeKeyboard(adjustKeyboard / 100);
            }
          }
          if (vi?.volume === 0) flag.volumeDownMuted = true;
          else flag.volumeDownMuted = false;
        }
      }
    }
  };

  /**
   * マウスのボタンを押したとき
   * @param {MouseEvent} e
   */
  const checkMousedown = (e) => {
    if (e.button === 1) {
      if (e.target instanceof HTMLElement) {
        const player = document.querySelector(selector.player);
        if (player?.contains(e.target)) {
          e.preventDefault();
          changeMute(e, true);
        }
      }
    }
  };

  /**
   * マウスホイールを回転操作したとき
   * @param {WheelEvent} e
   */
  const checkMouseWheel = (e) => {
    if (changeableVolume() && e.target instanceof Element) {
      const y = e.deltaMode > 0 ? Math.round(e.deltaY) * 100 : e.deltaY,
        full = document.querySelector(selector.fullscreen),
        tv = document.querySelector(selector.tv),
        vod = document.querySelector(selector.vod);
      flag.volume = false;
      if (
        (tv && (tv.contains(e.target) || !flag.scroll)) ||
        (vod &&
          ((vod.contains(e.target) && (full || e.shiftKey)) || !flag.scroll))
      ) {
        flag.volume = true;
      }
      if (
        !e.target
          .closest(selector.sliderContainer)
          ?.querySelector(selector.marker)
      ) {
        if (flag.volume) {
          const vi = returnVideo();
          if (vi && vi.volume === 0 && !flag.volumeDownMuted) {
            changeMute(e, false);
          } else if (!(flag.volumeDownMuted && e.deltaY > 0)) {
            changeVolume(
              e.deltaMode > 0
                ? Math.round(e.deltaY * adjustWheel)
                : (e.deltaY / 100) * adjustWheel,
              vi ? floor2(vi.volume) + y / -10000 : 0
            );
          }
          if (vi?.volume === 0) flag.volumeDownMuted = true;
          else flag.volumeDownMuted = false;
        }
      }
    } else log('checkMouseWheel: not changeableVolume');
  };

  /**
   * 音量ボタンにイベントリスナーが登録されていなければ登録する
   */
  const checkVolumeElementEventListener = () => {
    const eVolume = document.querySelectorAll(selector.volume);
    if (eVolume.length) {
      for (let i = 0; i < eVolume.length; i++) {
        if (!eVolume[i].classList.contains(`.${sid}_VolumeElement`)) {
          eVolume[i].classList.add(`${sid}_VolumeElement`);
          eVolume[i].addEventListener('mouseover', disablePageScroll);
          eVolume[i].addEventListener('mouseout', enablePageScroll);
        }
      }
    }
  };

  /**
   * 音量スライダーが監視されていなければ監視する
   */
  const checkVolumeSliderObserve = () => {
    const id = document.querySelector(`.${sid}_VolumeSlider`);
    if (!id) {
      const eSlider = document.querySelector(selector.sliderHighlighter);
      if (eSlider) {
        log('checkVolumeSliderObserve');
        eSlider.classList.add(`${sid}_VolumeSlider`);
        if (observerS) {
          observerS.disconnect();
          observerS.observe(eSlider, moConfig);
        }
      }
    }
  };

  /**
   * 音量を表示する要素を作成
   * @param {string} s fullならフルスクリーン用
   */
  const createInfo = (s) => {
    const div = document.createElement('div'),
      full = document.querySelector(selector.fullscreen);
    div.classList.add(`${sid}_Info`);
    div.innerHTML = `
      <span class="${sid}_Volume1"></span>
      <span class="${sid}_Volume2"></span>
      <span class="${sid}_Volume3"></span>
      <span class="${sid}_Volume4"></span>
      `;
    if (s === 'full') {
      if (full && !full.classList.contains(`${sid}_Info_Full`)) {
        div.classList.add(`${sid}_Info_Full`);
        full.appendChild(div);
      }
    } else if (s === 'init') {
      if (!document.querySelector(`.${sid}_Info_Standard`)) {
        div.classList.add(`${sid}_Info_Standard`);
        document.body.appendChild(div);
      }
    }
  };

  /**
   * ページをスクロールできないようにする
   */
  const disablePageScroll = () => {
    if (flag.scroll) {
      if (!document.querySelector(selector.fullscreen)) {
        flag.scroll = false;
        addStyle('disablePageScroll');
      }
    }
  };

  /**
   * ページをスクロールできるようにする
   */
  const enablePageScroll = () => {
    if (!flag.scroll) {
      flag.scroll = true;
      removeStyle('disablePageScroll');
    }
  };

  /**
   * 小数点第3位以降を切り捨てた数値を返す
   * @param {number} n
   * @returns
   */
  const floor2 = (n) => Math.floor(n * 100) / 100;

  /**
   * 音量を表示する要素を隠す
   */
  const hideInfo = () => {
    const info = document.querySelectorAll(`.${sid}_Info`);
    for (let i = 0; i < info.length; i++) {
      info[i].classList.remove('vc_show');
      info[i].classList.add('vc_hidden');
    }
  };

  /**
   * ページを開いたときに1度だけ実行
   */
  const init = () => {
    log('init');
    setupSettings();
    observerS = new MutationObserver(changeSlider);
    waitShowVideo();
    createInfo('init');
    addStyle('init');
    document.addEventListener('fullscreenchange', checkFullScreen);
    document.addEventListener('keydown', checkKeyDown, true);
  };

  /**
   * デバッグ用ログ
   * @param {...any} a
   */
  const log = (...a) => {
    if (ls.debug || debugLog) {
      try {
        if (/^debug$|^error$|^info$|^warn$/.test(a[a.length - 1])) {
          const b = a.pop();
          console[b](sid, a.join('  '));
          showInfo(a[0]);
        } else console.log(sid, a.join('  '));
      } catch (e) {
        if (e instanceof Error) console.error(e.message, ...a);
        else if (typeof e === 'string') console.error(e, ...a);
        else console.error('log error', ...a);
      }
    }
  };

  /**
   * ボリュームスライダーのマーカーを動かして音量を変更する
   * @param {number} n ボリュームスライダーのマーカー位置
   * @param {string} t mouseupかmousedown
   */
  const moveVolumeMarker = (n, t) => {
    const slider = document.querySelector(selector.slider),
      marker = document.querySelector(selector.marker);
    if (n && slider && marker) {
      slider.dispatchEvent(
        new MouseEvent(t, {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: marker.getBoundingClientRect().x,
          clientY: marker.getBoundingClientRect().y + n + 5,
        })
      );
    }
  };

  /**
   * スタイルを削除する
   * @param {string} s スタイルの設定名
   */
  const removeStyle = (s) => {
    const e = document.getElementById(`${sid}_style_${s}`);
    if (e instanceof HTMLStyleElement) e.remove();
  };

  /**
   * video要素を返す
   * @returns {HTMLVideoElement|null}
   */
  const returnVideo = () => {
    if (flag.type === 2) {
      /** @type {HTMLVideoElement|null} */
      const vi = document.querySelector(selector.video);
      if (vi) return vi;
    }
    return null;
  };

  /**
   * ローカルストレージに設定を保存する
   */
  const saveLocalStorage = () => localStorage.setItem(sid, JSON.stringify(ls));

  /**
   * 設定の値を用意する
   */
  const setupSettings = () => {
    /**
     * Settings欄で設定した変数の値が数字以外なら0にする
     * @param {number} a Settings欄の変数
     * @returns {number}
     */
    const num = (a) => (Number.isFinite(Number(a)) ? Number(a) : 0);
    let key = num(adjustKeyboard),
      wheel = num(adjustWheel);
    key = key > 20 ? 20 : key < 1 && key !== 0 ? 1 : key;
    wheel = wheel > 20 ? 20 : wheel < 1 && wheel !== 0 ? 1 : wheel;
    adjustKeyboard = ls.adjustKeyboard ? ls.adjustKeyboard : key ? key : 1;
    adjustWheel = ls.adjustWheel ? ls.adjustWheel : wheel ? wheel : 5;
    if (key && ls.adjustKeyboard !== key) {
      adjustKeyboard = key;
      ls.adjustKeyboard = key;
      saveLocalStorage();
    }
    if (wheel && ls.adjustWheel !== wheel) {
      adjustWheel = wheel;
      ls.adjustWheel = wheel;
      saveLocalStorage();
    }
  };

  /**
   * 現在の音量を表示
   * @param {string} s 表示する文字列
   */
  const showInfo = (s) => {
    const eFull = document.querySelector(`.${sid}_Info_Full`),
      eInfo = document.querySelector(`.${sid}_Info_Standard`),
      ele = document.querySelector(selector.fullscreen) ? eFull : eInfo;
    const eVol2 = ele?.querySelector(`.${sid}_Volume2`),
      eVol3 = ele?.querySelector(`.${sid}_Volume3`),
      eVol4 = ele?.querySelector(`.${sid}_Volume4`),
      vi = returnVideo();
    if (eVol4) eVol4.textContent = vi?.volume === 0 ? 'ミュート' : s ? s : '';
    if (eVol2 instanceof HTMLSpanElement && eVol3 instanceof HTMLSpanElement) {
      if (vi?.volume === 0) {
        eVol2.style.display = 'none';
        eVol3.style.display = 'block';
      } else {
        eVol2.style.display = 'block';
        eVol3.style.display = 'none';
      }
    }
    if (ele) {
      ele.classList.remove('vc_hidden');
      ele.classList.add('vc_show');
    }
    clearTimeout(interval.info);
    interval.info = setTimeout(() => {
      if (ele) {
        ele.classList.remove('vc_show');
        ele.classList.add('vc_hidden');
      }
    }, 1000);
  };

  /**
   * 指定時間だけ待つ
   * @param {number} msec 待ち時間
   */
  const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

  /**
   * 監視を開始する
   */
  const setupObserver = () => {
    /** @type {HTMLElement|null} */
    const main = document.querySelector(selector.main);
    if (main && data.lastMain !== main) {
      log('setupObserver');
      addEventPage();
      observerC.disconnect();
      observerC.observe(main, moConfig2);
      data.lastMain = main;
      checkVolumeElementEventListener();
      checkVolumeSliderObserve();
    } else if (!main) {
      log('setupObserver: Not found element.', 'error');
    }
  };

  /**
   * 動画が表示されるのを待つ
   */
  const waitShowVideo = async () => {
    log('waitShowVideo');
    const splash = () => {
      const sp = document.querySelector(selector.splash);
      if (!sp) {
        log('waitShowVideo: Not found element.');
        return true;
      }
      const cs = getComputedStyle(sp);
      if (cs?.visibility === 'visible') return true;
      return false;
    };
    await sleep(400);
    clearInterval(interval.video);
    interval.video = setInterval(() => {
      changeableVolume();
      const vi = returnVideo();
      if (vi && !isNaN(vi.duration) && splash()) {
        clearInterval(interval.video);
        setupObserver();
      }
    }, 250);
  };

  const observerC = new MutationObserver(checkChangeElements);
  interval.init = setInterval(() => {
    if (
      /^https:\/\/abema\.tv\/(?:now-on-air|video\/episode|channels|live-event)\/.+$/.test(
        location.href
      )
    ) {
      const main = document.querySelector(selector.main);
      if (!data.initialized) {
        data.initialized = true;
        init();
      } else if (main && data.lastMain !== main) {
        setupObserver();
      }
    }
  }, 2000);
})();
