// ==UserScript==
// @name         ABEMA Auto Adjust Playback Position
// @namespace    https://greasyfork.org/scripts/451815
// @version      13
// @description  ABEMAで視聴している番組の遅延(タイムラグ)を減らします。
// @match        https://abema.tv/*
// @grant        none
// @license      MIT License
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/451815/ABEMA%20Auto%20Adjust%20Playback%20Position.user.js
// @updateURL https://update.greasyfork.org/scripts/451815/ABEMA%20Auto%20Adjust%20Playback%20Position.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ---------- Settings ---------- */

  // 変更した値はブラウザのローカルストレージに保存するので
  // スクリプトをバージョンアップするたびに書き換える必要はありません。
  // （値が0のときは以前に変更した値もしくは初期値を使用します）

  // 倍速再生時の速度倍率
  // 初期値：1.5
  // 有効値：1.1 ～ 2.0
  let playbackRate = 0;

  // 生放送でのバッファの下限（秒数）
  // 初期値：8
  // 有効値：1 ～ 16
  let liveBuffer = 0;

  // 遅延を積極的に減らす（1:有効 / 2:無効）
  // 初期値：1
  // 有効値：1 ～ 2
  let activelyAdjust = 0;

  /* ------------------------------ */

  const sid = 'AutoAdjustPlaybackPosition';
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
  const buffer = {
      changeableRate: true,
      cm: false,
      count: 0,
      currentMax: 0,
      currentMin: 0,
      currentTime: 0,
      large: false,
      linear: 15,
      /** @type {number[]} */
      max: [],
      /** @type {number[]} */
      min: [],
      originalLinear: 0,
      originalLive: 0,
      prev: 0,
      similarLive: false,
    },
    /** @type {{version: number, initialized: boolean, lastMain: HTMLElement|null}} */
    data = {
      version: 12,
      initialized: false,
      lastMain: null,
    },
    interval = {
      buffer: 0,
      info: 0,
      init: 0,
      speed: 0,
      splash: 0,
    },
    moConfig = { childList: true, subtree: true },
    selector = {
      footerText:
        '.com-tv-LinearFooter__feed-super-text,.com-live-event-LiveEventTitle',
      inner: '.c-application-DesktopAppContainer__content',
      liveIcon:
        '.com-a-LegacyIcon__red-icon-path[aria-label="生放送"],.com-live-event-LiveEventViewCounter__icon-wrapper',
      main: 'main',
      seekbar: '.com-vod-VideoControlBar__seekbar',
      splash: '.com-a-Video__video,.com-live-event__LiveEventPlayerView',
      video: 'video[src]:not([style*="display: none;"])',
      videoContainer: '.com-a-Video__container',
    };

  /**
   * スタイルシートを追加
   */
  const addCSS = () => {
    const css = `
      #${sid}_Info {
        align-items: center;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 4px;
        bottom: 105px;
        color: #fff;
        display: flex;
        font-family: sans-serif;
        justify-content: center;
        left: 90px;
        min-height: 30px;
        min-width: 3em;
        opacity: 0;
        padding: 0.5ex 1ex;
        position: fixed;
        user-select: none;
        visibility: hidden;
        z-index: 2270;
      }
      #${sid}_Info.aapp_show {
        opacity: 0.8;
        visibility: visible;
      }
      #${sid}_Info:hover.aapp_show {
        background-color: rgba(0, 0, 0, 1);
        cursor: pointer;
        opacity: 1;
      }
      #${sid}_Info:hover.aapp_show:after {
        color: #cc9;
        content: "クリックで等速再生";
        padding-left: 1em;
      }
      #${sid}_Info.aapp_hidden {
        opacity: 0;
        transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
        visibility: hidden;
      }
    `,
      style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  };

  /**
   * 数値配列の平均値を求める
   * @param {number[]} arr
   * @returns {number}
   */
  const calcAvg = (arr) => {
    if (Array.isArray(arr) && arr.length > 0) {
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      return Math.round(avg * 10) / 10;
    }
    return 0;
  };

  /**
   * 動画の再生速度を変更する
   * @param {number} t 変更する時間（秒）
   * @param {number} r 速度の倍率
   */
  const changePlaybackSpeed = (t, r) => {
    clearTimeout(interval.speed);
    const vi = returnVideo();
    if (vi && t && r) {
      t = (t / r) * 2;
      log('Start change playback speed', t.toFixed(2), r);
      vi.playbackRate = r;
      interval.speed = setTimeout(() => {
        log('Stop change playback speed', t.toFixed(2), r);
        vi.playbackRate = 1;
        resetBufferObj();
      }, t * 1000);
    } else if (vi && vi.playbackRate !== 1) {
      log('Reset playback speed');
      vi.playbackRate = 1;
      resetBufferObj();
    } else {
      log('can not be changed playback speed', t.toFixed(2), r);
      resetBufferObj();
    }
  };

  /**
   * 動画を構成している要素に変更があったとき
   */
  const checkChangeElements = () => {
    const inner = document.querySelector(selector.inner);
    if (inner) {
      setTimeout(() => {
        checkVideoBuffer();
      }, 50);
    }
  };

  /**
   * フッターに番組プログラムのテキストがあるか調べる
   * @returns {boolean}
   */
  const checkExistsFooterText = () => {
    const span = document.querySelector(selector.footerText);
    return span ? true : false;
  };

  /**
   * 生放送かそうでないかを調べる
   * @returns {boolean}
   */
  const checkLive = () => {
    const content = returnContentType(),
      seek = document.querySelector(selector.seekbar),
      svg = document.querySelector(selector.liveIcon);
    if ((content === 'tv' && svg) || (content !== 'tv' && !seek)) {
      return true;
    }
    return false;
  };

  /**
   * キーボードのキーを押したとき
   * @param {KeyboardEvent} e
   */
  const checkKeyDown = (e) => {
    const isInput =
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
        ? true
        : false;
    if ((isInput && (e.altKey || e.ctrlKey)) || !isInput) {
      if (e.key === ',' || e.key === '[') {
        e.stopPropagation();
        changePlaybackSpeed(10, 0.5);
      } else if (e.key === '.' || e.key === ']') {
        e.stopPropagation();
        changePlaybackSpeed(30, 2);
      } else if (e.key === '/' || e.key === '\\') {
        e.stopPropagation();
        changePlaybackSpeed(0, 1);
      }
    }
  };

  /**
   * スクリプトとストレージのバージョンを確認
   */
  const checkVersion = () => {
    if (!('version' in ls)) {
      if (liveBuffer === 0 && (ls.liveBuffer === 3 || ls.liveBuffer === 5)) {
        ls.liveBuffer = 8;
      }
    }
    ls.version = data.version;
    saveLocalStorage();
  };

  /**
   * 動画のバッファを調べる
   */
  const checkVideoBuffer = () => {
    if (interval.buffer) return;
    interval.buffer = setInterval(() => {
      const vi = returnVideo(),
        content = returnContentType(),
        tv = content === 'tv' ? true : false,
        le = content === 'le' ? true : false,
        live = checkLive();
      if (
        (tv && vi?.buffered?.length) ||
        (le && vi?.buffered?.length && live)
      ) {
        const after = live ? ' [LIVE]' : '',
          cTime = vi.currentTime,
          dur = vi.duration > 20000000000 ? true : false,
          eft = checkExistsFooterText(),
          len = vi.buffered.length,
          rate = vi.playbackRate,
          slow = 0.8;
        let b = 0,
          cll = 0;
        for (let i = 0; i < vi.buffered.length; i++) {
          const end = vi.buffered.end(i);
          if (end > vi.currentTime) {
            b += Math.round((end - vi.currentTime) * 10) / 10;
          }
        }
        const vc = document.querySelector(selector.videoContainer);
        if (vc) {
          for (const key of Object.keys(vc)) {
            if (key.startsWith('__reactFiber$')) {
              const player = vc[key].return?.stateNode?.player;
              if (typeof player?.getCurrentLiveLatency === 'function') {
                const latency = player.getCurrentLiveLatency();
                if (typeof latency === 'number') {
                  cll = Math.round(latency * 10) / 10;
                }
              }
            }
          }
        }
        if (buffer.currentMax < b) buffer.currentMax = b;
        if (buffer.currentMin > b || buffer.currentMin === 0) {
          buffer.currentMin = b;
          if (buffer.large) {
            if (b < liveBuffer + 2 || (!live && b < buffer.linear - 3)) {
              log('small buffer', buffer.currentMax, b);
              changePlaybackSpeed(0, 1);
            }
          }
        }
        if (buffer.currentTime > cTime && !buffer.cm && tv) {
          const ct = buffer.currentTime - cTime;
          vi.currentTime += ct + 0.3;
          log(
            `${ct.toFixed(2)}秒巻き戻ったので元の位置へシークしました`,
            b,
            buffer.currentMin,
            len,
            'warn'
          );
        }
        if (b > 0 && buffer.changeableRate && dur && eft) {
          if (buffer.cm) {
            log('***** CM out *****');
            buffer.cm = false;
          }
          if (rate >= 1 && b < 1 && len === 1 && tv) {
            //現在のバッファが1秒未満になったときスロー再生する
            if (live) liveBuffer += 0.5;
            else buffer.linear += 0.5;
            log('## A', rate, b, live, buffer.linear, liveBuffer);
            changePlaybackSpeed(1.2 - b, slow);
          } else if (rate >= 1 && b < 2 && !live && len === 1) {
            //生放送以外で現在のバッファが2秒未満になったときスロー再生する
            buffer.linear += 0.5;
            log('## B', rate, b, live, buffer.linear);
            changePlaybackSpeed(3 - b, slow);
          } else if (
            rate > 1 &&
            !live &&
            !buffer.similarLive &&
            ((!cll && b < 8) ||
              (cll && (b < buffer.linear || cll < buffer.linear)))
          ) {
            //生放送以外で倍速再生中に下記の場合は等速再生に戻す
            //cllが0：現在のバッファが8秒未満になったとき
            //cllが0以外：現在のバッファもしくはcllがbuffer.linear未満になったとき
            log('## C', rate, b, live, buffer.linear);
            changePlaybackSpeed(0, 1);
          } else if (
            buffer.prev < b &&
            buffer.currentMax - buffer.currentMin > 1
          ) {
            buffer.max.push(buffer.currentMax);
            buffer.min.push(buffer.currentMin);
            buffer.currentMax = 0;
            buffer.currentMin = 0;
            if (
              //記録したバッファの値が参考にならないと判断した場合は破棄する
              (buffer.max.length === 2 &&
                buffer.min.length === 2 &&
                (buffer.max[0] + 5 < buffer.max[1] ||
                  buffer.min[0] + 5 < buffer.min[1])) ||
              (buffer.max.length > 1 &&
                buffer.min.length > 1 &&
                (buffer.max.slice(-1)[0] < 0 || buffer.min.slice(-1)[0] < 0))
            ) {
              log('** shift', buffer.max.slice(-1)[0], buffer.min.slice(-1)[0]);
              buffer.max.shift();
              buffer.min.shift();
            } else buffer.count += 1;
            let time = 0;
            const maxLast = [...buffer.max].slice(-10),
              minLast = [...buffer.min].slice(-10),
              maxBottom = maxLast.reduce((x, y) => Math.min(x, y)),
              minBottom = minLast.reduce((x, y) => Math.min(x, y)),
              maxAverage = calcAvg(maxLast),
              minAverage = calcAvg(minLast),
              maxDiff =
                Math.round(
                  (maxLast.reduce((x, y) => Math.max(x, y)) - maxBottom) * 100
                ) / 100,
              minDiff =
                Math.round(
                  (minLast.reduce((x, y) => Math.max(x, y)) - minBottom) * 100
                ) / 100,
              lb1 = liveBuffer <= 5.5 ? 4 : liveBuffer <= 8.5 ? 6 : 8,
              lb2 = liveBuffer < 5 ? 5 : liveBuffer;
            if (rate === 1) {
              if (
                minLast.length >= 6 &&
                b > buffer.linear + 0.5 &&
                cll > buffer.linear + 0.5 &&
                minBottom > liveBuffer + 0.5
              ) {
                //現在のバッファとcllがbuffer.linearより多いとき
                //現在のバッファがbuffer.linearに近づくよう倍速再生する
                time = Math.round((b - buffer.linear) * 100) / 100;
                log('## D', time, b, maxDiff, minDiff, live, minBottom);
                changePlaybackSpeed(time, playbackRate);
              } else if (
                //現在のバッファと最大バッファがbuffer.linearより多いとき
                //最大バッファがbuffer.linearに近づくよう倍速再生する
                minLast.length >= 6 &&
                maxBottom > buffer.linear + 0.5 &&
                b > buffer.linear + 0.5 &&
                minBottom > liveBuffer + 0.5
              ) {
                time = Math.round((maxBottom - buffer.linear) * 100) / 100;
                if (minBottom > 19) {
                  buffer.large = true;
                  time = 999;
                }
                log('## E', time, b, maxDiff, minDiff, live, minBottom);
                changePlaybackSpeed(time, playbackRate);
              } else if (
                //生放送＆最小バッファがliveBufferより多い＆バッファが安定し続けているとき
                //最小バッファがliveBufferに近づくよう倍速再生する
                live &&
                minLast.length >= 6 &&
                minBottom > liveBuffer + 0.5 &&
                maxDiff < 2.5 &&
                minDiff < 2.5
              ) {
                time = Math.round((minBottom - liveBuffer) * 100) / 100;
                log('## F', time, b, maxDiff, minDiff);
                changePlaybackSpeed(time, playbackRate);
              } else if (
                //生放送でバッファが安定しつづけているとき最小バッファを
                //liveBufferよりも減らすよう（下限は4秒）倍速再生する
                activelyAdjust === 1 &&
                live &&
                minLast.length >= 10 &&
                minBottom > lb1 + 0.5 &&
                maxDiff < 2.5 &&
                minDiff < 2.5
              ) {
                time = Math.round((minBottom - lb1) * 100) / 100;
                log('## G', time, b, maxDiff, minDiff);
                changePlaybackSpeed(time, playbackRate);
              } else if (
                //生放送以外で最小バッファが9秒に近づくよう倍速再生する
                activelyAdjust === 1 &&
                !live &&
                minLast.length >= 10 &&
                minBottom > 9.5
              ) {
                time = Math.round((minBottom - 9) * 100) / 100;
                log('## H', time, b, maxDiff, minDiff);
                changePlaybackSpeed(time, playbackRate);
              } else if (
                //生放送以外でバッファが生放送のように安定し続けているとき
                //最小バッファがliveBuffer（下限は5秒）に近づくよう倍速再生する
                activelyAdjust === 1 &&
                !live &&
                minLast.length >= 10 &&
                minBottom > lb2 + 0.5 &&
                maxDiff < 2.5 &&
                minDiff < 2.5
              ) {
                buffer.similarLive = true;
                time = Math.round((minBottom - lb2) * 100) / 100;
                log('## I', time, b, maxDiff, minDiff);
                changePlaybackSpeed(time, playbackRate);
              }
            }
            log(
              buffer.count,
              'max:[',
              buffer.max.slice(-5).join('  '),
              ']',
              maxAverage,
              maxBottom,
              maxDiff,
              'min:[',
              buffer.min.slice(-5).join('  '),
              ']',
              minAverage,
              minBottom,
              minDiff,
              live,
              buffer.linear,
              len
            );
          }
        } else if (!buffer.cm && !eft) {
          log('***** CM in *****', dur);
          buffer.cm = true;
          buffer.linear = buffer.originalLinear;
          buffer.count = 0;
          buffer.currentMax = 0;
          buffer.currentMin = 0;
          buffer.currentTime = 0;
          buffer.max = [];
          buffer.min = [];
          liveBuffer = buffer.originalLive;
          if (rate !== 1) {
            changePlaybackSpeed(0, 1);
          }
        }
        if (!buffer.changeableRate && !eft) {
          buffer.changeableRate = true;
          log('changeableRate', buffer.changeableRate);
        }
        buffer.currentTime = cTime;
        buffer.prev = b;
        if (rate > 1) {
          showInfo(`▶▶ ×${rate}${after}`);
        } else if (rate > 0 && rate < 1) {
          showInfo(`▶ ×${rate}${after}`);
        }
      } else {
        resetBufferObj();
        clearInterval(interval.buffer);
        interval.buffer = 0;
      }
    }, 200);
  };

  /**
   * 情報を表示する要素をクリックしたとき
   */
  const clickInfo = () => {
    log('clickInfo');
    if (buffer.changeableRate) {
      changePlaybackSpeed(0, 1);
      buffer.changeableRate = false;
      log('changeableRate', buffer.changeableRate);
    }
  };

  /**
   * 情報を表示する要素を作成
   */
  const createInfo = () => {
    const div = document.createElement('div');
    div.id = `${sid}_Info`;
    div.innerHTML = '';
    div.addEventListener('click', clickInfo);
    document.body.appendChild(div);
  };

  /**
   * ページを開いたときに1度だけ実行
   */
  const init = () => {
    log('init');
    checkVersion();
    setupSettings();
    waitShowVideo();
    addCSS();
    createInfo();
    document.addEventListener('keydown', checkKeyDown, true);
  };

  /**
   * デバッグ用ログ
   * @param {...any} a
   */
  const log = (...a) => {
    if (ls.debug) {
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
   * bufferオブジェクトをリセット
   */
  const resetBufferObj = () => {
    buffer.count = 0;
    buffer.currentMax = 0;
    buffer.currentMin = 0;
    buffer.currentTime = 0;
    buffer.large = false;
    buffer.linear = buffer.originalLinear;
    buffer.max = [];
    buffer.min = [];
    buffer.prev = 0;
    buffer.similarLive = false;
    liveBuffer = buffer.originalLive;
  };

  /**
   * どのコンテンツを表示しているかを返す
   * @returns {string} tv:テレビ, ts:見逃し視聴, le:ライブイベント, vi:ビデオ, tt:番組表
   */
  const returnContentType = () => {
    const url = location.href,
      type = /^https:\/\/abema\.tv\/now-on-air\/.+$/.test(url)
        ? 'tv'
        : /^https:\/\/abema\.tv\/channels\/.+$/.test(url)
        ? 'ts'
        : /^https:\/\/abema\.tv\/live-event\/.+$/.test(url)
        ? 'le'
        : /^https:\/\/abema\.tv\/video\/episode\/.+$/.test(url)
        ? 'vi'
        : /^https:\/\/abema\.tv\/timetable/.test(url)
        ? 'tt'
        : '';
    return type;
  };

  /**
   * video要素を返す
   * @returns {HTMLVideoElement|null}
   */
  const returnVideo = () => {
    /** @type {HTMLVideoElement|null} */
    const vi = document.querySelector(selector.video);
    return vi ? vi : null;
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
    let rate = num(playbackRate),
      buff = num(liveBuffer),
      act = num(activelyAdjust);
    rate = rate > 2 ? 2 : rate < 1.1 && rate !== 0 ? 1.1 : rate;
    buff = buff > 16 ? 16 : buff < 1 && buff !== 0 ? 1 : buff;
    act = act > 2 ? 2 : act < 1 && act !== 0 ? 1 : act;
    playbackRate = ls.playbackRate ? ls.playbackRate : rate ? rate : 1.5;
    liveBuffer = ls.liveBuffer ? ls.liveBuffer : buff ? buff : 8;
    activelyAdjust = ls.activelyAdjust ? ls.activelyAdjust : act ? act : 1;
    if (rate && ls.playbackRate !== rate) {
      playbackRate = rate;
      ls.playbackRate = rate;
      saveLocalStorage();
    }
    if (buff && ls.liveBuffer !== buff) {
      liveBuffer = buff;
      ls.liveBuffer = buff;
      saveLocalStorage();
    }
    if (act && ls.activelyAdjust !== act) {
      activelyAdjust = act;
      ls.activelyAdjust = act;
      saveLocalStorage();
    }
    buffer.originalLinear = buffer.linear;
    buffer.originalLive = liveBuffer;
  };

  /**
   * 情報を表示
   * @param {string} s 表示する文字列
   */
  const showInfo = (s) => {
    const eInfo = document.getElementById(`${sid}_Info`);
    if (eInfo) {
      eInfo.textContent = s ? s : '';
      eInfo.classList.remove('aapp_hidden');
      eInfo.classList.add('aapp_show');
      clearTimeout(interval.info);
      interval.info = setTimeout(() => {
        eInfo.classList.remove('aapp_show');
        eInfo.classList.add('aapp_hidden');
      }, 1000);
    }
  };

  /**
   * 指定時間だけ待つ
   * @param {number} msec
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
      observerC.disconnect();
      observerC.observe(main, moConfig);
      data.lastMain = main;
      checkChangeElements();
    } else if (!main) {
      log('setupObserver: Not found element.', 'error');
    }
  };

  /**
   * ページを開いて動画が表示されるのを待つ
   */
  const waitShowVideo = async () => {
    log('waitShowVideo');
    const splash = () => {
      const sp = document.querySelector(selector.splash);
      if (!sp) {
        log('waitShowVideo: Not found element.', 'error');
        return true;
      }
      const cs = getComputedStyle(sp);
      if (cs?.visibility === 'visible') return true;
      return false;
    };
    await sleep(400);
    clearInterval(interval.splash);
    interval.splash = setInterval(() => {
      const vi = returnVideo();
      if (vi && !isNaN(vi.duration) && splash()) {
        clearInterval(interval.splash);
        setupObserver();
      }
    }, 250);
  };

  const observerC = new MutationObserver(checkChangeElements);
  interval.init = setInterval(() => {
    if (
      /^https:\/\/abema\.tv\/(now-on-air|live-event)\/[\w-]+\/?$/.test(
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
