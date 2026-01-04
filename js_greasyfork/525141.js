// ==UserScript==
// @name         MovieButAds > Yifan
// @namespace    https://yifan.movie-but-ads.mutoo.im
// @version      0.1.1
// @description  Movie But Ads is a collection of user scripts that enhance the viewing experience on Chinese movie websites. These scripts remove ads, improve functionality, and optimize the user interface for a smoother movie-watching experience.
// @author       mutoo<gmutoo@gmail.com>
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=www.yifan.tv
// @match        https://www.yifan.tv/*
// @match        https://www.yfsp.tv/*
// @match        https://www.yfsp.me/*
// @match        https://www.ayf.tv/*
// @match        https://www.aiyifan.tv/*
// @match        https://www.wyav.tv/*
// @match        https://www.flyv.tv/*
// @match        https://www.jssp.tv/*
// @match        https://www.iyf.tv/*
// @match        https://www.lgsp.tv/*
// @match        https://www.hlive.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525141/MovieButAds%20%3E%20Yifan.user.js
// @updateURL https://update.greasyfork.org/scripts/525141/MovieButAds%20%3E%20Yifan.meta.js
// ==/UserScript==
  
(function(){'use strict';class Router {
  constructor() {
    this.routes = new Map();
  }
  register(path, callback) {
    this.routes.set(path, callback);
  }
  handle(pathname = location.pathname) {
    for (const [path, callback] of this.routes) {
      if (typeof path === 'string' && pathname === path) {
        callback();
        return;
      }
      if (path instanceof RegExp && path.test(pathname)) {
        callback();
        return;
      }
    }
    console.warn(`No route found for ${pathname}`);
  }
}
const router = new Router();/**
 * ensure a condition is met
 * @param {() => boolean} condition
 * @param {number} maxAttempts
 * @param {string} failureMessage
 * @returns {Promise<boolean>}
 */
function ensureCondition(condition, maxAttempts = 600, failureMessage) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    function detect() {
      const result = condition();
      if (result) {
        resolve(result);
      } else if (attempts < maxAttempts) {
        attempts++;
        requestAnimationFrame(detect);
      } else {
        reject(new Error(failureMessage));
      }
    }
    requestAnimationFrame(detect);
  });
}

/**
 * ensure an element is present
 * @param {string} selector
 * @param {number} maxAttempts
 * @returns {Promise<boolean>}
 */
function ensureElement(selector, maxAttempts = 600) {
  return ensureCondition(() => document.querySelector(selector), maxAttempts, `Cannot detect ${selector} after ${maxAttempts} attempts`);
}class KeyboardShortcuts {
  constructor(videoController) {
    this.videoController = videoController;
    this.skip = 10;
    this.audioContext = null;
    this.delayNode = null;
    this.delayNodeConnected = false;
    this.bindEvents();
  }
  bindEvents() {
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }
  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.delayNode = this.audioContext.createDelay(5);
    }
  }
  handleKeyUp(e) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    const {
      videoController: vc
    } = this;
    switch (e.key) {
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        vc.setPlaybackRate(parseInt(e.key));
        break;
      case '-':
        vc.decreasePlaybackRate();
        break;
      case '=':
        vc.increasePlaybackRate();
        break;
      case 'f':
        vc.toggleFullscreen();
        break;
      case 'p':
        vc.togglePictureInPicture();
        break;
      case ',':
        vc.seek(vc.getCurrentTime() - this.skip);
        break;
      case '.':
        vc.seek(vc.getCurrentTime() + this.skip);
        break;
      case '<':
        vc.seek(vc.getCurrentTime() - this.skip * 2);
        break;
      case '>':
        vc.seek(vc.getCurrentTime() + this.skip * 2);
        break;
      case 'c':
        this.connectAudio();
        break;
      case '[':
        this.decreaseAudioDelay();
        break;
      case ']':
        this.increaseAudioDelay();
        break;
    }
  }
  connectAudio() {
    const video = this.videoController.getVideo();
    if (video && !this.delayNodeConnected) {
      this.initAudioContext();
      const source = this.audioContext.createMediaElementSource(video);
      source.connect(this.delayNode).connect(this.audioContext.destination);
      this.delayNodeConnected = true;
      console.log('Audio connected');
    }
  }
  decreaseAudioDelay() {
    if (this.delayNodeConnected) {
      this.delayNode.delayTime.value = Math.max(0, this.delayNode.delayTime.value - 0.1);
      console.log('DelayTime:', this.delayNode.delayTime.value);
    }
  }
  increaseAudioDelay() {
    if (this.delayNodeConnected) {
      this.delayNode.delayTime.value += 0.1;
      console.log('DelayTime:', this.delayNode.delayTime.value);
    }
  }
}class VideoControllerInterface {
  /** get the video element */
  getVideo() {
    throw new Error('Not implemented');
  }

  /** set the playback rate */
  setPlaybackRate(_rate) {
    throw new Error('Not implemented');
  }

  /** get the playback rate */
  getPlaybackRate() {
    throw new Error('Not implemented');
  }

  /** decrease the playback rate */
  decreasePlaybackRate() {
    const rate = this.getPlaybackRate();
    this.setPlaybackRate(Math.max(0, rate - 0.25));
  }

  /** increase the playback rate */
  increasePlaybackRate() {
    const rate = this.getPlaybackRate();
    this.setPlaybackRate(Math.min(rate + 0.25, 10));
  }

  /** check if the video is fullscreen */
  isFullscreen() {
    throw new Error('Not implemented');
  }

  /** request fullscreen */
  requestFullscreen() {
    throw new Error('Not implemented');
  }

  /** exit fullscreen */
  exitFullscreen() {
    throw new Error('Not implemented');
  }

  /** toggle fullscreen */
  toggleFullscreen() {
    if (this.isFullscreen()) {
      this.exitFullscreen();
    } else {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      }
      this.requestFullscreen();
    }
  }

  /** request picture in picture */
  requestPictureInPicture() {
    throw new Error('Not implemented');
  }

  /** toggle picture in picture */
  togglePictureInPicture() {
    if (!('pictureInPictureEnabled' in document)) {
      console.warn('Picture-in-picture is not supported in this browser.');
      return;
    }
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      if (this.isFullscreen()) {
        this.exitFullscreen();
      }
      this.requestPictureInPicture();
    }
  }

  /** seek to a specific time */
  seek(_time) {
    throw new Error('Not implemented');
  }

  /** get the current time */
  getCurrentTime() {
    throw new Error('Not implemented');
  }

  /** get the duration */
  getDuration() {
    throw new Error('Not implemented');
  }
}class YfanTvVideoController extends VideoControllerInterface {
  constructor(vgAPI) {
    super();
    this.api = vgAPI;
  }
  getVideo() {
    return null;
  }
  setPlaybackRate(rate) {
    this.api.playbackRate = rate;
  }
  getPlaybackRate() {
    return this.api.playbackRate;
  }
  isFullscreen() {
    return this.api.fsAPI.isFullscreen;
  }
  requestFullscreen() {
    this.api.fsAPI.request();
  }
  exitFullscreen() {
    this.api.fsAPI.exit();
  }
  requestPictureInPicture() {
    // no-op
  }
  seek(time) {
    this.api.currentTime = time;
  }
  getCurrentTime() {
    return this.api.currentTime;
  }
  getDuration() {
    return this.api.duration;
  }
}function getDeps(element, target) {
  for (const key in element) {
    if (key.startsWith('__ngContext__')) {
      const context = element[key];
      for (const item of context) {
        if (item && typeof item === 'object' && item[target]) {
          return [item[target], item];
        }
      }
    }
  }
  return null;
}
router.register(/^\/play/, () => {
  Promise.all([ensureElement('#video_player'), ensureElement('aa-videoplayer'), ensureElement('vg-player')]).then(([videoElement, aaVideoPlayerElement, vgPlayerElement]) => {
    // disable the ads on pause
    window.addEventListener('invokePauseAds', e => {
      console.log('invokePauseAds');
      e.stopImmediatePropagation();
    }, {
      capture: true
    });
    const [danmuFacade] = getDeps(aaVideoPlayerElement, 'danmuFacade');
    if (danmuFacade) {
      danmuFacade.isPaused = true;
      danmuFacade.danmuListLoaded = d => {
        console.log('danmuListLoaded', d);
      };
    } else {
      console.warn('danmuFacade not found');
    }
    const [ads] = getDeps(aaVideoPlayerElement, 'api');
    if (ads) {
      // disable the ads
      ads.triggerPlayAds = t => {
        console.log('triggerPlayAds', t);
      };
    } else {
      console.warn('ads api not found');
    }
    const [pgmp] = getDeps(aaVideoPlayerElement, 'pgmp');
    if (pgmp) {
      pgmp.dataList.length = 0;
    } else {
      console.warn('pgmp not found');
    }
    const [_, target] = getDeps(videoElement, 'onShowPauseAds');
    if (target) {
      // remove pause ads
      target.list.length = 0;
      target.onShowPauseAds = {
        next: t => {
          console.log('onShowPauseAds', t);
        }
      };
    } else {
      console.warn('onShowPauseAds not found');
    }
    const [vsAPI] = getDeps(vgPlayerElement, 'API');
    if (vsAPI) {
      const injected = vgPlayerElement.classList.contains('movie-but-ads-injected');
      if (injected) {
        console.warn('Already injected');
        return;
      }
      const videoController = new YfanTvVideoController(vsAPI);
      new KeyboardShortcuts(videoController);
      // mark player elemen as injected
      vgPlayerElement.classList.add('movie-but-ads-injected');
      console.log('movie-but-ads', 'yfan.tv');
    } else {
      console.warn('vsAPI not found');
    }
  });
});
ensureElement('router-outlet').then(el => {
  const [ngRouter] = getDeps(el, 'router');
  if (!ngRouter) {
    console.error('router not found');
    return;
  } else {
    let lastUrl = '';
    ngRouter.events.subscribe(e => {
      if (!e.urlAfterRedirects) {
        // not a navigation event
        return;
      }
      if (e.urlAfterRedirects === lastUrl) {
        // ignore the repeated event
        return;
      }
      console.log('router changed', e);
      lastUrl = e.urlAfterRedirects;
      router.handle(lastUrl);
    });
  }
});})();