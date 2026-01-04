// ==UserScript==
// @name         MovieButAds > Nunuyy
// @namespace    https://nunuyy.movie-but-ads.mutoo.im
// @version      0.2.0
// @description  Movie But Ads is a collection of user scripts that enhance the viewing experience on Chinese movie websites. These scripts remove ads, improve functionality, and optimize the user interface for a smoother movie-watching experience.
// @author       mutoo<gmutoo@gmail.com>
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=www.nunuyy5.com
// @match        https://*.nunuyy5.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525149/MovieButAds%20%3E%20Nunuyy.user.js
// @updateURL https://update.greasyfork.org/scripts/525149/MovieButAds%20%3E%20Nunuyy.meta.js
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
}
class SimpleVideoController extends VideoControllerInterface {
  constructor(video) {
    super();
    this.video = video;
  }
  getVideo() {
    return this.video;
  }
  setPlaybackRate(rate) {
    this.video.playbackRate = rate;
  }
  getPlaybackRate() {
    return this.video.playbackRate;
  }
  isFullscreen() {
    return !!document.fullscreenElement;
  }
  requestFullscreen() {
    this.video.requestFullscreen();
  }
  exitFullscreen() {
    document.exitFullscreen();
  }
  requestPictureInPicture() {
    this.video.requestPictureInPicture();
  }
  seek(time) {
    this.video.currentTime = Math.max(0, Math.min(time, this.getDuration()));
  }
  getCurrentTime() {
    return this.video.currentTime;
  }
  getDuration() {
    return this.video.duration;
  }
}router.register(/^\/vod\//, () => {
  ensureElement('#video').then(video => {
    document.addEventListener('keydown', function (event) {
      // prevent the spacebar from scrolling the page
      if (event.key === ' ' && !event.target.matches('input, textarea')) {
        event.preventDefault();
      }
    });

    // add the video controller and keyboard shortcuts
    const videoController = new SimpleVideoController(video);
    new KeyboardShortcuts(videoController, {
      onKeyUp: e => {
        if (e.key === ' ') {
          if (video.paused) {
            video.play();
          } else {
            video.pause();
          }
        }
      }
    });
    console.log('movie-but-ads', 'nunuyy');
  });
});
router.handle();})();