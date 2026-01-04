// ==UserScript==
// @name        YouTube Live: Auto RealTime
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.5.6
// @author      CY Fung
// @description 1/13/2024, 7:11:55 PM
// @run-at      document-start
// @license     MIT
//
// @downloadURL https://update.greasyfork.org/scripts/484728/YouTube%20Live%3A%20Auto%20RealTime.user.js
// @updateURL https://update.greasyfork.org/scripts/484728/YouTube%20Live%3A%20Auto%20RealTime.meta.js
// ==/UserScript==

(() => {

  let pbRate = +((13.52 + Math.random() * 0.45).toFixed(2)); // might change in method 2

  let byPassPlaybackRate = false;
  let tmpPlaybackRate = null;
  let byPassPlaybackRates = null; // [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

  let lastNavigateFinishTime = 0;

  if (typeof AbortSignal === 'undefined') return;

  let __requestAnimationFrame__ = typeof webkitRequestAnimationFrame === 'function' ? window.webkitRequestAnimationFrame.bind(window) : window.requestAnimationFrame.bind(window);

  let instance = null;

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.


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


  const observablePromise = (proc, timeoutPromise) => {
    let promise = null;
    return {
      obtain() {
        if (!promise) {
          promise = new Promise(resolve => {
            let mo = null;
            const f = () => {
              let t = proc();
              if (t) {
                mo.disconnect();
                mo.takeRecords();
                mo = null;
                resolve(t);
              }
            }
            mo = new MutationObserver(f);
            mo.observe(document, { subtree: true, childList: true })
            f();
            timeoutPromise && timeoutPromise.then(() => {
              resolve(null)
            });
          });
        }
        return promise
      }
    }
  }

  let fc = 0;

  const pd = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');

  const isPassiveArgSupport = (typeof IntersectionObserver === 'function');
  const bubblePassive = isPassiveArgSupport ? { capture: false, passive: true } : false;
  const capturePassive = isPassiveArgSupport ? { capture: true, passive: true } : true;

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);

  let pageFetchedDataLocal = null;
  document.addEventListener('yt-page-data-fetched', (evt) => {
    pageFetchedDataLocal = evt.detail;

  }, bubblePassive);


  function getFormatDates() {

    if (!pageFetchedDataLocal) return null;

    const formatDates = {}
    try {
      formatDates.publishDate = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.publishDate
    } catch (e) { }
    // 2022-12-30

    try {
      formatDates.uploadDate = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.uploadDate
    } catch (e) { }
    // 2022-12-30

    try {
      formatDates.publishDate2 = pageFetchedDataLocal.pageData.response.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.dateText.simpleText
    } catch (e) { }
    // 2022/12/31

    if (typeof formatDates.publishDate2 === 'string' && formatDates.publishDate2 !== formatDates.publishDate) {
      formatDates.publishDate = formatDates.publishDate2
      formatDates.uploadDate = null
    }

    try {
      formatDates.broadcastBeginAt = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.startTimestamp
    } catch (e) { }
    try {
      formatDates.broadcastEndAt = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.endTimestamp
    } catch (e) { }
    try {
      formatDates.isLiveNow = pageFetchedDataLocal.pageData.playerResponse.microformat.playerMicroformatRenderer.liveBroadcastDetails.isLiveNow
    } catch (e) { }


    return formatDates;
  }

  const promiseVideoNextFn = async (video, v) => {

    if (typeof video.requestVideoFrameCallback === 'function' && v !== false) {

      return true === await Promise.race([
        new Promise(resolve => video.requestVideoFrameCallback(() => {
          resolve(true);
        })),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);

    } else {

      return true === await Promise.race([
        new Promise(resolve => video.addEventListener('timeupdate', () => {
          resolve(true);
        }, { once: true, passive: true, capture: false })),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);

    }



  }

  let promisePR1;

  let videoTarget = null;


  let pr01 = new PromiseExternal();
  let pr02 = new PromiseExternal();

  document.addEventListener('durationchange', function (evt) {

    const target = (evt || 0).target;
    if (!(target instanceof HTMLVideoElement)) return;

    if (target.classList.contains('video-stream') && target.classList.contains('html5-main-video')) {

      videoTarget = target;

      if (target.duration !== 3600 && target.duration > 120) {

        pr01.resolve();
        pr01 = new PromiseExternal();

      }

    }


  }, true);

  let _keytb = null;
  const getKeytb = () => {

    if (_keytb) return _keytb;
    let keytb = '';

    for (const key of Object.getOwnPropertyNames(instance.app)) {
      if (typeof (instance.app[key] || 0) !== 'object') continue;
      if (!instance.app[key].videoData) continue;
      if (typeof instance.app[key].getPlayerState !== 'function') continue;
      keytb = key;
      break;
    }

    return (_keytb = keytb);
  }

  async function run(videoTarget) {

    try {

      if (fc > 1e9) fc = 9;
      let tc = ++fc;

      const timeout = new Promise(r => setTimeout(r, 1000));
      const video = videoTarget;
      // const video = watchPage.querySelector('video.video-stream.html5-main-video');
      if (!video) return false;


      const fn = () => {
        if (video.paused || !video.isConnected || video.networkState !== 2 || video.readyState !== 4) return false;
        return video.currentTime > 0.1 && video.duration > 0.1 && instance;
      }
      if (!fn()) {
        await observablePromise(fn, timeout).obtain();
      }

      if (tc !== fc) return false;

      await new Promise(resolve => video.addEventListener('timeupdate', () => {
        resolve();
      }, { once: true, passive: true, capture: false }));

      if (tc !== fc) return false;


      if (!instance || instance.getPlayerState() !== 1) return false;

      // window.sss = instance;

      const keytb = getKeytb();

      ffRate = 2.9;


      let Ga = instance.getPlaybackRate();
      let La = instance.app[keytb].getPlayerState().isPaused();

      // byPassPlaybackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, v];

      if (ffRate > 1) byPassPlaybackRates = [1, ffRate];
      else if (ffRate < 1) byPassPlaybackRates = [ffRate, 1];
      else byPassPlaybackRates = [1];


      const waiterPromise = new Promise(resolve => video.addEventListener('waiting', () => {
        resolve();
      }, { once: true, passive: true, capture: false }));
      instance.setPlaybackRate(ffRate);
      instance.hideControls();
      instance.playVideo();

      await waiterPromise.then();
      instance.showControls();

      byPassPlaybackRates = null;




      instance.setPlaybackRate(Ga);
      instance.showControls();

      if (instance.getPlayerState() === 3) {
        // instance.pauseVideo();
        // instance.app.cancelPlayback()
        instance.playVideo();
      }

      La ? instance.pauseVideo() : instance.playVideo();



    } catch (e) {
      console.log(e)
    }


  }

  const speedmasterUserEduWM = new WeakMap();
  Object.defineProperty(Object.prototype, 'speedmasterUserEdu', {

    get() {
      return speedmasterUserEduWM.get(this)
    },

    set(nv) {
      speedmasterUserEduWM.set(this, nv);
    },

    enumerable: false,
    configurable: true

  })

  let nnId = 0; 
  document.addEventListener('yt-navigate-finish', () => {
    const t = ++nnId;
    setTimeout(()=>{
      if (t !== nnId) return;
      if ([...document.querySelectorAll('ytd-page-manager#page-manager #movie_player .html5-main-video[src]')].filter(e => !e.closest('[hidden]')).length === 1) {
        pr02.resolve();
        pr02 = new PromiseExternal();
        lastNavigateFinishTime = Date.now();
      }
    }, 800);
  }, false);


  (async () => {
    try {
      let lastSrc = null;
      while (1) {

        await Promise.all([pr01, pr02]);
        const tr01 = pr01 = new PromiseExternal();
        const tr02 = pr02 = new PromiseExternal();

        await new Promise(resolve => __requestAnimationFrame__(resolve));

        if (!videoTarget || !videoTarget.isConnected) continue;

        if (pr01 !== tr01 || pr02 !== tr02) continue;

        if (Date.now() - lastNavigateFinishTime > 4000) continue;

        if (!pageFetchedDataLocal) continue;
        const dates = getFormatDates();
        if (!dates) continue;
        if (dates.broadcastBeginAt && !dates.broadcastEndAt && dates.isLiveNow === true) {
        } else {
          continue;
        }

        let src = videoTarget.src;

        if (lastSrc !== src) {
          lastSrc = src;

          run(videoTarget).then(res => {
            if (res === false) lastSrc = null;
          });
        }

      }
    } catch (e) {
      console.log(e);
    }
  })();


  const _yt_player_observable = observablePromise(() => {
    return (((window || 0)._yt_player || 0) || 0);
  });

  (async () => {

    const _yt_player = await _yt_player_observable.obtain();

    if (!_yt_player || typeof _yt_player !== 'object') return;

    const addProtoToArr = (parent, key, arr) => {

      let isChildProto = false;
      for (const sr of arr) {
        if (parent[key].prototype instanceof parent[sr]) {
          isChildProto = true;
          break;
        }
      }

      if (isChildProto) return;

      arr = arr.filter(sr => {
        if (parent[sr].prototype instanceof parent[key]) {
          return false;
        }
        return true;
      });

      arr.push(key);

      return arr;


    }

    const getGU = (_yt_player) => {

      const w = 'GU';

      let arr = [];

      for (const [k, v] of Object.entries(_yt_player)) {

        const p = typeof v === 'function' ? v.prototype : 0;
        if (p
          && typeof p.setPlaybackRate === 'function' && p.setPlaybackRate.length === 2
          && typeof p.getPlaybackRate === 'function' && p.getPlaybackRate.length === 0

          // && typeof p.isAtLiveHead === 'function'

          && typeof p.getVideoUrl === 'function' && p.getVideoUrl.length === 4
          && typeof p.getCurrentTime === 'function' && p.getCurrentTime.length >= 2
          && typeof p.getDuration === 'function' && p.getDuration.length == 2

          && !(typeof p.isPaused === 'function' && p.isPaused.length === 0
            && typeof p.getCurrentTime === 'function' && p.getCurrentTime.length === 0
            && typeof p.getDuration === 'function' && p.getDuration.length === 0

            // && typeof p.isAtLiveHead === 'function' && p.isAtLiveHead.length === 0
            && typeof p.getVideoPlaybackQuality === 'function' && p.getVideoPlaybackQuality.length === 0
            && typeof p.stopVideo === 'function' && p.stopVideo.length === 0)
          // && Object.keys(_yt_player[k].prototype).includes('addEventListener')
          // && !p.dispose && !p.isDisposed

        ) {
          arr = addProtoToArr(_yt_player, k, arr) || arr;


        }

      }


      // console.log(1222, arr.map(k=> Object.keys(_yt_player[k].prototype).sort()))

      if (arr.length === 0) {

        console.warn(`Key does not exist. [${w}]`);
      } else {

        console.log(`[${w}]`, arr);
        return arr[0];
      }




    }

    const key = getGU(_yt_player);

    // console.log(1233, key)
    const g = _yt_player;
    const k = key;
    const gk = g[k];
    const gkp = g[k].prototype;


    gkp.getPlaybackRate322 = gkp.getPlaybackRate;
    gkp.getPlaybackRate = function () {

      // console.log(5556, this.getPlaybackRate322)
      instance = this;
      return this.getPlaybackRate322();
    }

    gkp.setPlaybackRate322 = gkp.setPlaybackRate;
    gkp.setPlaybackRate = function (a, b) {
      instance = this;
      if (byPassPlaybackRate) {
        // console.log(5888, 12333,a, b)
        // return;
      }
      // console.log(5388, arguments)
      return this.setPlaybackRate322(a, b);
    }

    if (typeof gkp.getAvailablePlaybackRates === 'function' && typeof gkp.getAvailablePlaybackRates322 !== 'function') {


      gkp.getAvailablePlaybackRates322 = gkp.getAvailablePlaybackRates;
      gkp.getAvailablePlaybackRates = function () {
        instance = this;
        if (byPassPlaybackRates) {
          // console.log(5888, 12333,a, b)
          return byPassPlaybackRates;
        }
        // console.log(5388, arguments)
        return this.getAvailablePlaybackRates322();
      }
      //[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]



    }


  })();

  Storage.prototype.setItem322 = Storage.prototype.setItem;
  Storage.prototype.setItem = function (a, b) {

    if (a === 'yt-player-playback-rate') {
      tmpPlaybackRate = b;
      // if(!byPassPlaybackRate) debugger
      if (promisePR1 && b && typeof b === 'string' && b.indexOf('{"data":"1"') >= 0) {

        promisePR1.resolve();
        promisePR1 = null;
      }
      // console.log(5883, a, b,byPassPlaybackRate, 'XX_'+tmpPlaybackRate+'_', location.pathname)
      if (window.location.pathname === '/live_chat') return;
    }

    if (byPassPlaybackRate && a === 'yt-player-playback-rate') return;
    this.setItem322(a, b);

  }


  Storage.prototype.getItem322 = Storage.prototype.getItem;
  Storage.prototype.getItem = function (a) {

    if (a === 'yt-player-playback-rate') {
      if (window.location.pathname === '/live_chat') return null;
      if (typeof tmpPlaybackRate === 'string') return tmpPlaybackRate;
    }

    if (a === 'yt-player-playback-rate' && typeof tmpPlaybackRate === 'string') return tmpPlaybackRate;
    return this.getItem322(a);

  }

  Object.defineProperty(Storage.prototype, 'yt-player-playback-rate', {
    get() {
      return this.getItem('yt-player-playback-rate');
    },
    set(nv) {
      this.setItem('yt-player-playback-rate', nv);
      return true;
    },
    enumerable: true,
    configurable: true
  });



})();
