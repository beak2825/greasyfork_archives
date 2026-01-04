// ==UserScript==
// @name        YouTube Ads Skip
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @match       https://music.youtube.com/*
// @grant       none
// @version     0.3.9
// @author      CY Fung
// @description 11/12/2023, 5:16:22 AM
// @inject-into page
// @run-at      document-start
// @unwrap
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/479557/YouTube%20Ads%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/479557/YouTube%20Ads%20Skip.meta.js
// ==/UserScript==

(() => {

  let popupState = 0;
  let popupElement = null;

  const rate = 1;

  const Promise = (async () => { })().constructor;

  const PromiseExternal = ((resolve_, reject_) => {
    const h = (resolve, reject) => { resolve_ = resolve; reject_ = reject };
    return class PromiseExternal extends Promise {
      constructor(cb = h) {
        super(cb);
        if (cb === h) {
          /** @type {(value: any) => void} */
          this.resolve = resolve_;
          /** @type {(reason?: any) => void} */
          this.reject = reject_;
        }
      }
    };
  })();

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

  let vload = null;

  const fastSeekFn = HTMLVideoElement.prototype.fastSeek || null;
  const addEventListenerFn = HTMLElement.prototype.addEventListener;
  if (!addEventListenerFn) return;
  const removeEventListenerFn = HTMLElement.prototype.removeEventListener;
  if (!removeEventListenerFn) return;

  const ytPremiumPopupSelector = 'yt-mealbar-promo-renderer.style-scope.ytd-popup-container:not([hidden])';

  const DEBUG = 0;

  const rand = (a, b) => a + Math.random() * (b - a);
  const log = DEBUG ? console.log.bind(console) : () => 0;

  //$0.$['dismiss-button'].click()
  const ytPremiumPopupClose = function () {
    const popup = document.querySelector(ytPremiumPopupSelector);
    if (popup instanceof HTMLElement) {
      if (HTMLElement.prototype.closest.call(popup, '[hidden]')) return;
      const cnt = insp(popup);
      const btn = cnt.$ ? cnt.$['dismiss-button'] : 0;
      if (btn instanceof HTMLElement && HTMLElement.prototype.closest.call(btn, '[hidden]')) return;
      btn && btn.click();
    }
  }

  //div.video-ads.ytp-ad-module
  const clickSkip = function () {
    // ytp-ad-skip-button
    const isAdsContainerContainsButton = document.querySelector('.video-ads.ytp-ad-module button');
    if (isAdsContainerContainsButton) {

      const btnFilter = e => HTMLElement.prototype.matches.call(e, ".ytp-ad-overlay-close-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button") && !HTMLElement.prototype.closest.call(e, '[hidden]');
      const btns = [...document.querySelectorAll('.video-ads.ytp-ad-module button[class*="ytp-ad-"]')].filter(btnFilter);
      console.log('# of ads skip btns', btns.length);
      if (btns.length !== 1) return;
      const btn = btns[0];
      if (btn instanceof HTMLElement) {
        btn.click();
      }

    }
  };

  const adsEndHandlerHolder = function (evt) {

    adsEndHandler && adsEndHandler(evt);

  }

  let adsEndHandler = null;


  const videoPlayingHandler = async function (evt) {
    try {

      if (!evt || !evt.target || !evt.isTrusted || !(evt instanceof Event)) return;
      const video = evt.target;

      const checkPopup = popupState === 1;
      popupState = 0;

      const popupElementValue = popupElement;
      popupElement = null;

      if (video.duration < 0.8) return;

      await vload.then();
      if (!video.isConnected) return;

      const ytplayer = HTMLElement.prototype.closest.call(video, 'ytd-player, ytmusic-player');
      if (!ytplayer || !ytplayer.is) return;

      const ytplayerCnt = insp(ytplayer);
      const player_ = await (ytplayerCnt.player_ || ytplayer.player_ || ytplayerCnt.playerApi || ytplayer.playerApi || 0);
      if (!player_) return;

      if (typeof ytplayerCnt.getPlayer === 'function' && !ytplayerCnt.getPlayer()) {
        await new Promise(r => setTimeout(r, 40));
      }
      const playerController = await ytplayerCnt.getPlayer() || player_;
      if (!video.isConnected) return;

      if ('getPresentingPlayerType' in playerController && 'getDuration' in playerController) {

        const ppType = await playerController.getPresentingPlayerType();

        log('m02a', ppType);
        if (ppType === 1 || typeof ppType !== 'number') return; // ads shall be ppType === 2
        // const progressState = player_.getProgressState();
        // log('m02b', progressState);
        // if(!progressState) return;
        // const q = progressState.duration;

        // if (popupState === 1) console.debug('m05b:ytPremiumPopup', document.querySelector(ytPremiumPopupSelector))

        const q = video.duration;

        const ytDuration = await playerController.getDuration();
        log('m02c', q, ytDuration, Math.abs(ytDuration - q));

        if (q > 0.8 && ytDuration > 2.5 && Math.abs(ytDuration - q) > 1.4) {
          try {
            log('m02s', 'fastSeek', q);
            video.muted = true;
            const w = Math.round(rand(582, 637) * rate);
            const sq = q - w / 1000;

            adsEndHandler = null;

            const expired = Date.now() + 968;

            removeEventListenerFn.call(video, 'ended', adsEndHandlerHolder, false);
            removeEventListenerFn.call(video, 'suspend', adsEndHandlerHolder, false);
            removeEventListenerFn.call(video, 'durationchange', adsEndHandlerHolder, false);
            addEventListenerFn.call(video, 'ended', adsEndHandlerHolder, false);
            addEventListenerFn.call(video, 'suspend', adsEndHandlerHolder, false);
            addEventListenerFn.call(video, 'durationchange', adsEndHandlerHolder, false);

            adsEndHandler = async function (evt) {
              adsEndHandler = null;

              removeEventListenerFn.call(video, 'ended', adsEndHandlerHolder, false);
              removeEventListenerFn.call(video, 'suspend', adsEndHandlerHolder, false);
              removeEventListenerFn.call(video, 'durationchange', adsEndHandlerHolder, false);

              if (Date.now() < expired) {

                const delay = Math.round(rand(92, 117));
                await new Promise(r => setTimeout(r, delay));

                Promise.resolve().then(() => {
                  clickSkip();
                }).catch(console.warn);

                checkPopup && Promise.resolve().then(() => {
                  const currentPopup = document.querySelector(ytPremiumPopupSelector);
                  if (popupElementValue ? currentPopup === popupElementValue : currentPopup) {
                    ytPremiumPopupClose();
                  }
                }).catch(console.warn);
              }

            };

            if (fastSeekFn) fastSeekFn.call(video, sq);
            else video.currentTime = sq;

          } catch (e) {
            console.warn(e);
          }
        }

      }

    } catch (e) {
      console.warn(e);
    }

  };

  document.addEventListener('loadedmetadata', async function (evt) {
    try {

      if (!evt || !evt.target || !evt.isTrusted || !(evt instanceof Event)) return;

      const video = evt.target;
      if (video.nodeName !== "VIDEO") return;
      if (video.duration < 0.8) return;
      if (!video.matches('.video-stream.html5-main-video')) return;

      popupState = 0;

      vload = new PromiseExternal();

      popupElement = document.querySelector(ytPremiumPopupSelector);

      removeEventListenerFn.call(video, 'playing', videoPlayingHandler, { passive: true, capture: false });

      addEventListenerFn.call(video, 'playing', videoPlayingHandler, { passive: true, capture: false });

      popupState = 1;

      let trial = 6;

      await new Promise(resolve => {

        let io = new IntersectionObserver(entries => {
          if (trial-- <= 0 || (entries && entries.length >= 1 && video.matches('ytd-player video, ytmusic-player video'))) {
            resolve();
            io.disconnect();
            io = null;
          }
        });
        io.observe(video);

      });

      vload.resolve();

    } catch (e) {
      console.warn(e);
    }

  }, true);

})();