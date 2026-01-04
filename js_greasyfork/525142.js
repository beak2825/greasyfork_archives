// ==UserScript==
// @name         MovieButAds > Aiyingshi
// @namespace    https://aiyingshi.movie-but-ads.mutoo.im
// @version      0.3.1
// @description  Movie But Ads is a collection of user scripts that enhance the viewing experience on Chinese movie websites. These scripts remove ads, improve functionality, and optimize the user interface for a smoother movie-watching experience.
// @author       mutoo<gmutoo@gmail.com>
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=www.aiyingshi.tv
// @match        https://www.iyingshi5.tv/*
// @match        https://www.iyingshi6.tv/*
// @match        https://www.iyingshi7.tv/*
// @match        https://www.iyingshi8.tv/*
// @match        https://www.iyingshi9.tv/*
// @match        https://www.aiyingshi.tv/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525142/MovieButAds%20%3E%20Aiyingshi.user.js
// @updateURL https://update.greasyfork.org/scripts/525142/MovieButAds%20%3E%20Aiyingshi.meta.js
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
 * ensure a global object is present
 * @param {string} objectName
 * @param {number} maxAttempts
 * @returns {Promise<boolean>}
 */
function ensureGlobalObject(objectName, maxAttempts = 600) {
  return ensureCondition(() => window[objectName], maxAttempts, `Cannot detect ${objectName} after ${maxAttempts} attempts`);
}

/**
 * ensure an element is present
 * @param {string} selector
 * @param {number} maxAttempts
 * @returns {Promise<boolean>}
 */
function ensureElement(selector, maxAttempts = 600) {
  return ensureCondition(() => document.querySelector(selector), maxAttempts, `Cannot detect ${selector} after ${maxAttempts} attempts`);
}

/**
 * ensure a key is present in an object
 * @param {object} object
 * @param {string} key
 * @param {number} maxAttempts
 * @returns {Promise<boolean>}
 */
function ensureKey(object, key, maxAttempts = 6000) {
  return ensureCondition(() => object[key], maxAttempts, `Cannot detect ${key} after ${maxAttempts} attempts`);
}class KeyboardShortcuts {
  constructor(videoController, options) {
    this.videoController = videoController;
    this.skip = 10;
    this.audioContext = null;
    this.delayNode = null;
    this.delayNodeConnected = false;
    this.keyUpDelegate = options?.onKeyUp ?? function () {};
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
      default:
        this.keyUpDelegate(e);
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
}class AiyingshiTvVideoController extends VideoControllerInterface {
  constructor(YZM) {
    super();
    this.YZM = YZM;
  }
  getVideo() {
    return this.YZM.dp.video;
  }
  setPlaybackRate(rate) {
    this.YZM.dp.speed(rate);
  }
  getPlaybackRate() {
    return this.YZM.dp.video.playbackRate;
  }
  isFullscreen() {
    return this.YZM.dp.fullScreen.isFullScreen();
  }
  requestFullscreen() {
    this.YZM.dp.fullScreen.request();
  }
  exitFullscreen() {
    this.YZM.dp.fullScreen.cancel();
  }
  requestPictureInPicture() {
    this.YZM.dp.video.requestPictureInPicture();
  }
  seek(time) {
    this.YZM.dp.seek(Math.max(0, Math.min(time, this.getDuration())));
  }
  getCurrentTime() {
    return this.YZM.dp.video.currentTime;
  }
  getDuration() {
    return this.YZM.dp.video.duration;
  }
}router.register('/', () => {
  window.addEventListener('DOMContentLoaded', function () {
    window.modal?.destroy();
  });
});
router.register(/^\/play/, () => {
  Promise.race([ensureGlobalObject('YZM'), ensureElement('#videobox')]).then(result => {
    if (result instanceof HTMLElement) {
      mobile();
    } else {
      desktop(result);
    }
  }, () => {
    console.error('YZM/videobox not found');
  });
  function mobile(_) {
    // bypass the ads
    Object.defineProperty(window, 'defaultTime', {
      value: -1,
      writable: false
    });
    // start the video
    ensureKey(window, 'playFrame').then(playFrame => {
      // eslint-disable-next-line no-undef
      $('#videobox').attr('src', playFrame);
      // eslint-disable-next-line no-undef
      $('#videobox').show();
    }, () => {
      console.error('playFrame not found');
    });
  }
  function desktop(YZM) {
    // freeze the ads fields so that the ads can't be added
    Object.defineProperty(YZM, 'ads', {
      value: {
        state: 'off',
        set: {
          state: 'off',
          group: 'null'
        },
        pause: {
          state: 'off'
        }
      },
      writable: false
    });

    // remove the ads elements
    window.addEventListener('load', () => {
      // eslint-disable-next-line no-undef
      $('#ADplayer').remove();
      // eslint-disable-next-line no-undef
      $('#ADtip').remove();
      // eslint-disable-next-line no-undef
      $('#ADmask').remove();
      // eslint-disable-next-line no-undef
      $('#videotips').remove();
    });

    // add the video controller and keyboard shortcuts
    const videoController = new AiyingshiTvVideoController(YZM);
    new KeyboardShortcuts(videoController);
    console.log('movie-but-ads', 'aiyingshi.tv');
  }
});
router.handle();})();