// ==UserScript==
// @name           Comment Render Smoother for embed player
// @description    公式HTML5埋め込みプレイヤーのコメントの動きをなめらかにする(主にFirefox)
// @match          *://embed.nicovideo.jp/watch/*
// @grant          none
// @author         rinsuki (original author: guest https://greasyfork.org/ja/scripts/377400/code?version=668741 )
// @license        public domain
// @version        0.0.4.4
// @namespace      https://rinsuki.net/
// @downloadURL https://update.greasyfork.org/scripts/383015/Comment%20Render%20Smoother%20for%20embed%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/383015/Comment%20Render%20Smoother%20for%20embed%20player.meta.js
// ==/UserScript==

const monkey = (() => {
  let fps = 60;
  let playbackRate = 1.0;

  const toFrameTime = (time) => {
    return time; // こっちは体感しづらいかも
    // const timeMs = time * 1000;
    // const MSEC_PER_FRAME = 1000 / fps * playbackRate;
    // const nextFrame = Math.ceil(timeMs / MSEC_PER_FRAME);
    // return nextFrame * MSEC_PER_FRAME / 1000;
  };

  const init = () => {
    if (!window.__videoplayer) { return; }
    const player = window.__videoplayer;
    const _currentTime = player.currentTime.bind(player);
    const _playbackRate = player.playbackRate.bind(player);
    _playbackRate();

    console.log('%cinitialize Comment Render Smoother playbackRate:%s', 'background: cyan;', playbackRate);

    let worldTime = performance.now();
    let lastVideoTime = _currentTime();

    let stallCount = 0;

    player.currentTime = (time) => {
      const now = performance.now();
      if (typeof time === 'number') {
        lastVideoTime = time;
        worldTime = now;
        return _currentTime(time);
      }


      const isPlaying = !player.paused();
      const videoTime = _currentTime();
      const timeDiff = (now - worldTime) / 1000 * playbackRate;
      const predictionTime = lastVideoTime + timeDiff;

      if (isPlaying && lastVideoTime === videoTime) {
        stallCount ++;
      } else {
        stallCount = 0;
      }

      // stallCount = 0; // debug...
      if (
        !isPlaying ||                     // 再生してない or
        lastVideoTime > videoTime ||      // 時間が戻った ≒ シークした or
        //videoTime - lastVideoTime > playbackRate ||  // いきなり1秒以上も進んだ ≒ シークした or
        Math.abs(predictionTime - videoTime) > 1 || // 予測とn秒以上の誤差ができた
        stallCount > 5                    // 詰まってんじゃねーの？  の時
      ) {
        lastVideoTime = videoTime;
        worldTime = now;
        _playbackRate();

        return toFrameTime(videoTime);
      } else {
        return toFrameTime(predictionTime);
      }
    };

    player.playbackRate = rate => {
      if (typeof rate !== 'number') {
        const currentRate = _playbackRate();
        if (playbackRate !== currentRate) {
          console.log('%cupdate playbackRate %s -> %s', 'background: yellow;', playbackRate, currentRate);
          playbackRate = currentRate;
          worldTime = performance.now();
          lastVideoTime = _currentTime();
        }
        return currentRate;
      }
      if (rate === playbackRate || rate <= 0) {
        return;
      }
      console.log('%cset playbackRate %s -> %s', 'background: orange;', playbackRate, rate);

      playbackRate = rate;
      worldTime = performance.now();
      lastVideoTime = _currentTime();
      return _playbackRate(rate);
    };
    // player.play();
  };

  // TODO: なんかプレイヤー初期化のタイミングでやる
  init();

});

if (document.querySelector('#ext-player')) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('charset', 'UTF-8');
  script.appendChild(document.createTextNode(`(${monkey})();`));
  document.body.appendChild(script);
}
