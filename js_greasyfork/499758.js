// ==UserScript==
// @name        YouTube Live: Manual Fine Tune Video Time
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.1.2
// @author      CY Fung
// @description 7/5/2024
// @run-at      document-start
// @license     MIT
//
// @downloadURL https://update.greasyfork.org/scripts/499758/YouTube%20Live%3A%20Manual%20Fine%20Tune%20Video%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/499758/YouTube%20Live%3A%20Manual%20Fine%20Tune%20Video%20Time.meta.js
// ==/UserScript==

(() => {


  let byPassPlaybackRate = false;
  let tmpPlaybackRate = null;
  let byPassPlaybackRates = null; // [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]


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


  let videoTarget = null;


  let lastVideoId = null;
  let videoOK = false;

  const updateVideo = () => {

    videoOK = false;
    do {
      if (!videoTarget) break;
      if (!pageFetchedDataLocal) break;
      const dates = getFormatDates();
      if (!dates) break;
      if (dates.broadcastBeginAt && !dates.broadcastEndAt && dates.isLiveNow === true) {
        videoOK = true;
      } else {
        break;
      }
    } while (0);
    if (!videoOK) {
      return;
    }


    const flexy = document.querySelector('ytd-watch-flexy');
    const videoId = flexy.getAttribute('video-id')


    if (lastVideoId !== videoId) {
      lastVideoId = videoId;

      run(videoTarget).then(res => {
        if (res === false) lastVideoId = null;
      });
    }
  }

  document.addEventListener('durationchange', function (evt) {

    const target = (evt || 0).target;
    if (!(target instanceof HTMLVideoElement)) return;

    if (target.classList.contains('video-stream') && target.classList.contains('html5-main-video')) {

      videoTarget = target;

      if (target.duration !== 3600 && target.duration > 120) {

        updateVideo();

      }

    }


  }, true);

  let liveVideo = null;


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

      liveVideo = video;


    } catch (e) {
      console.log(e)
    }


  }


  let nnId = 0;
  document.addEventListener('yt-navigate-finish', () => {
    const t = ++nnId;
    setTimeout(() => {
      if (t !== nnId) return;
      if ([...document.querySelectorAll('ytd-page-manager#page-manager #movie_player .html5-main-video[src]')].filter(e => !e.closest('[hidden]')).length === 1) {

        updateVideo();
      }
    }, 800);
  }, false);





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

        if (p.getPlaybackRate && p.setPlaybackRate) {
          console.log(p.setPlaybackRate?.length, p.getPlaybackRate?.length, p.getVideoUrl?.length, p.getCurrentTime?.length, p.getDuration?.length)
        }
        if (p
          && typeof p.setPlaybackRate === 'function' && p.setPlaybackRate.length === 2
          && typeof p.getPlaybackRate === 'function' && p.getPlaybackRate.length === 0

          // && typeof p.isAtLiveHead === 'function'

          && typeof p.getVideoUrl === 'function' && p.getVideoUrl.length === 4
          && typeof p.getCurrentTime === 'function' && p.getCurrentTime.length >= 2
          && typeof p.getDuration === 'function' && p.getDuration.length == 2


        ) {
          arr = addProtoToArr(_yt_player, k, arr) || arr;


        }

      }

      /**
       *
    g.k.getCurrentTime = function(a, b, c) {
        var d = this.getPlayerState(a);
        if (this.app.getAppState() === 2 && d === 5) {
            var e;
            return ((e = this.app.getVideoData()) == null ? void 0 : e.startSeconds) || 0
        }
        return this.L("web_player_max_seekable_on_ended") && d === 0 ? zhb(this.app, a) : a ? this.app.getCurrentTime(a, b, c) : this.app.getCurrentTime(a)
    }
       *
       */


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

  let onKey = false;

  let lrRates = null;

  const lrRatesSetup = () => {
    if (lrRates || !instance) return;
    const rates = instance.getAvailablePlaybackRates();
    lrRates = [Math.max(...rates.filter(r => r < 1)), Math.min(...rates.filter(r => r > 1))];
  }

  const setRate = (r) => {

    instance && instance.setPlaybackRate(r, r)
  }

  const filterSet = (b) => {
    if (!liveVideo) return;
    b ? (liveVideo.style.filter = 'contrast(0.5)') : (liveVideo.style.filter = '')
  }

  const targetOK = (target) => {
    if (!target || target instanceof Document) return true;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return false;
    if (target instanceof Element && target.closest('[contenteditable]') instanceof Node) return false;
    return true;
  }

  document.addEventListener('keydown', evt => {
    if (evt.code === 'ArrowLeft' && videoOK && instance && !onKey && liveVideo && !liveVideo.paused && targetOK(evt.target)) {
      if (!onKey) {

        onKey = 'left'
        console.log('left')
        lrRatesSetup();
        setRate(lrRates[0]);
        filterSet(1)
      }
      // evt.preventDefault();
      evt.stopImmediatePropagation();
      evt.stopPropagation();
    } else if (evt.code === 'ArrowRight' && videoOK && instance && liveVideo && !liveVideo.paused && targetOK(evt.target)) {
      if (!onKey) {

        onKey = 'right'
        console.log('right')
        lrRatesSetup();
        setRate(lrRates[1]);
        filterSet(1)
      }
      // evt.preventDefault();
      evt.stopImmediatePropagation();
      evt.stopPropagation();
    }
  }, true);


  document.addEventListener('keyup', evt => {
    if (evt.code === 'ArrowLeft' && videoOK && instance && onKey === 'left') {
      console.log('left end')
      // evt.preventDefault();
      evt.stopImmediatePropagation();
      evt.stopPropagation();
      setRate(1);
      filterSet(0)
    } else if (evt.code === 'ArrowRight' && videoOK && instance && onKey === 'right') {
      console.log('right end')
      // evt.preventDefault();
      evt.stopImmediatePropagation();
      evt.stopPropagation();
      setRate(1);
      filterSet(0)
    }
    onKey = false;
  }, true);




})();
