// ==UserScript==
// @name        X (Twitter) Native Video Player
// @namespace   userstyles.world/user/hyper
// @match       https://twitter.com/*
// @match       https://x.com/*
// @grant       GM.info
// @grant       GM.registerMenuCommand
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.xmlHttpRequest
// @version     1.4.2
// @author      Hyper
// @description Replaces the X (Twitter) video player controls with the browser native video controls.
// @license     MIT-0
// @icon        https://abs.twimg.com/responsive-web/client-web/icon-default-large.9ab12c3a.png
// @noframes
// @homepageURL https://userstyles.world/user/hyper
// @downloadURL https://update.greasyfork.org/scripts/515017/X%20%28Twitter%29%20Native%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/515017/X%20%28Twitter%29%20Native%20Video%20Player.meta.js
// ==/UserScript==

// DEPRECATED: UserScript Metadata
// @icon        https://abs.twimg.com/responsive-web/client-web/icon-default.522d363a.png
// @icon        https://abs.twimg.com/favicons/twitter.3.ico
// @grant       GM.download
// @grant       GM.openInTab
// @grant       GM.listValues
// @grant       GM.deleteValues
// @grant       GM.getValues

/*--------\
| License |
|---------------------------------------------------------------------------------------\
| MIT No Attribution                                                                    |
|                                                                                       |
| Copyright (c) 2024-2025 Hyper                                                         |
|                                                                                       |
| Permission is hereby granted, free of charge, to any person obtaining a copy of this  |
| software and associated documentation files (the "Software"), to deal in the Software |
| without restriction, including without limitation the rights to use, copy, modify,    |
| merge, publish, distribute, sublicense, and/or sell copies of the Software, and to    |
| permit persons to whom the Software is furnished to do so.                            |
|                                                                                       |
| THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,   |
| INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A         |
| PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT    |
| HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION     |
| OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE        |
| SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                                |
\--------------------------------------------------------------------------------------*/

// jshint esversion: 11, strict: true, laxbreak: true
// globals GM unsafeWindow

(async function() {
  'use strict';
  
  /*--------\
  | Globals |
  \--------*/

  // const isFirefox = typeof InstallTrigger !== 'undefined';
  // const isFirefox = navigator.userAgent.includes(' Firefox/');
  const browserName = GM.info.platform.browserName;
  const isFirefox = browserName === 'Firefox';
  log(`browserName = ${browserName}`);
  const userAgent = `${GM.info.scriptHandler}Userscript/${GM.info.script.version}`;
  log(`userAgent = ${userAgent}`);
  
  /*------------------ \
  | Storage Interfaces |
  \-------------------*/

  class Config {
    static #storageKey = 'config';
    #config;

    constructor(config) {
      if (config?.constructor !== Object) throw new TypeError('expected `config` to be `Object`');

      this.#config = config;
    }

    static async initialize() {
      return new Config(await Config.#pullFromStorage());
    }

    static async #pullFromStorage() {
      return await GM.getValue(Config.#storageKey, {
        keepControls: false,
        lastVolume: 0.5
      });
    }

    async #update() {
      this.#config = { ...await Config.#pullFromStorage(), ...this.#config };
    }

    async #pushToStorage() {
      await GM.setValue(Config.#storageKey, this.#config);
    }

    async save(reloadRequired = false) {
      if (typeof reloadRequired !== 'boolean') throw new TypeError('expected type of `reloadRequired` to be `boolean`');

      log('saving config...');
      await this.#update();
      await this.#pushToStorage();
      log('config saved');

      if (reloadRequired) location.reload();
    }

    get keepControls() {
      return this.#config.keepControls ?? false;
    }

    set keepControls(enabled) {
      if (typeof enabled !== 'boolean') throw new TypeError('expected type of `enabled` to be `boolean`');

      this.#config.keepControls = enabled;
      this.save(true);
    }

    get lastVolume() {
      return this.#config.lastVolume ?? 0.5;
    }

    set lastVolume(value) {
      if (typeof value !== 'number') throw new TypeError('expected type of `value` to be `number`');
      if (value < 0 || value > 1) throw new RangeError('`value` must be no less than 0 and no greater than 1');

      this.#config.lastVolume = value;
      this.save();
    }
  }

  class TweetCache {
    static #storageKey = 'tweets';
    #tweets;

    constructor(tweets) {
      if (tweets?.constructor !== Object) throw new TypeError('expected `tweets` to be `Object`');

      this.#tweets = tweets;
    }

    static async initialize() {
      return new TweetCache(await TweetCache.#pullFromStorage());
    }

    static async #pullFromStorage() {
      return await GM.getValue(TweetCache.#storageKey, {});
    }

    async #update() {
      this.#tweets = { ...await TweetCache.#pullFromStorage(), ...this.#tweets };
    }

    async #pushToStorage() {
      await GM.setValue(TweetCache.#storageKey, this.#tweets);
    }

    async save() {
      log('saving tweet cache...');
      await this.#update();
      await this.#pushToStorage();
      log('tweet cache saved');
    }

    static async #fetch(id) {
      return (await GM.xmlHttpRequest({
        url: `https://api.fxtwitter.com/status/${id}`,
        responseType: 'json',
        headers: {
          'User-Agent': userAgent,
          'Accept': 'application/json'
        }
      }))?.response.tweet ?? null;
    }

    async get(id) {
      if (typeof id !== 'string') throw new TypeError('expected type of `id` to be `string`');

      const isCached = () => this.#tweets[id] !== undefined;
      const fromCache = () => ({
        tweet: this.#tweets[id],
        wasCached: true
      });
      // const fromCache = () => {
      //   const cachedTweet = this.#tweets[id];
      //   log(`cachedTweet = ${JSON.stringify(cachedTweet, null, 2)}`);
      //   return {
      //     tweet: cachedTweet,
      //     wasCached: true
      //   };
      // };

      if (isCached()) return fromCache();
      await this.#update();
      if (isCached()) return fromCache();

      const tweet = await TweetCache.#fetch(id);
      if (tweet !== null) this.#tweets[id] = tweet;
      return {
        tweet,
        wasCached: false
      };
    }

    async clear() {
      this.#tweets = {};
      await GM.deleteValue(TweetCache.#storageKey);
    }

    get size() {
      return Object.keys(this.#tweets).length;
    }
    
    async updatedSize() {
      await this.#update();
      return this.size;
    }

    async download() {
      await this.#update();

      const blob = new Blob([JSON.stringify(this.#tweets, null, 2)], { type: 'application/json' });
      const blobUrl = URL.createObjectURL(blob);

      // location.href = blobUrl;

      const hashKeys = async () => {
        const typedKeys = BigUint64Array.from(Object.keys(this.#tweets));
        const hashBuffer = await crypto.subtle.digest('SHA-256', typedKeys);

        // const keyEncoder = new TextEncoder;
        // const encodedKeys = new Uint8Array;
        // for (const key of Object.keys(this.#tweets)) {
        //   keyEncoder.encodeInto(key, encodedKeys);
        // }
        // const hashBuffer = await crypto.subtle.digest('SHA-256', encodedKeys);

        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');

        return hashHex;
      };

      // await GM.download({
      //   url: blobUrl,
      //   name: `${await hashKeys()}.json`,
      //   onload: () => URL.revokeObjectURL(blobUrl)
      // });

      // const tab = await GM.openInTab(blobUrl);
      // tab.onclose = () => {
      //   URL.revokeObjectURL(blobUrl);
      // };

      const downloadBlob = async () => {
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = `${await hashKeys()}.json`;
        anchor.addEventListener('click', function(event) {
          setTimeout(function() {
            URL.revokeObjectURL(blobUrl);
            anchor.remove();
          }, 5_000);
        });

        anchor.style.display = 'none';
        document.body.append(anchor);

        anchor.click();
      };

      return await downloadBlob();
    }

    async delete(id) {
      if (typeof id !== 'string') throw new TypeError('expected type of `id` to be `string`');

      await this.#update();
      const deleted = delete this.#tweets[id];
      await this.#pushToStorage();

      return deleted;
    }
  }

  const config = await Config.initialize();
  const tweetCache = await TweetCache.initialize();

  handleEvents(window, function(event) {
    log(`event.type = ${event.type}`);
    tweetCache.save();
  }, 'beforeunload', 'popstate', 'hashchange');

  document.addEventListener('visibilitychange', function(event) {
    if (document.visibilityState === 'hidden') tweetCache.save();
  });

  let lastLocation = location.href;
  setInterval(function() {
    if (document.visibilityState === 'visible' && location.href !== lastLocation) {
      tweetCache.save();
      lastLocation = location.href;
    }
  }, 30_000);

  /*------\
  | Utils |
  |-----------------\
  | Twitter Helpers |
  \----------------*/

  function galleryView() {
    // NOTE: We copy the location via `String.prototype.slice()` so that it can't change on us half-way through.
    const here = location.href.slice();
    const match = here.match(/(?<=\/([0-9]+))\/(video|photo)\/([1-9][0-9]*)$/);

    if (match) return {
      id: match[1],
      type: match[2],
      index: match[3], // NOTE: Gallery view indices start at 1 not 0.
      // url: new URL(here.slice(0, match.index))
    };

    return null;
  }

  /*------\
  | Utils |
  \------*/

  function log(message) {
    console.log(`${GM.info.script.name}: ${message}`);
  }

  function timer(name, callback, ...args) {
    const label = `${GM.info.script.name} -> ${name}`;
    console.time(label);
    const result = callback(...args);
    console.endTime(label);

    return result
  }

  // function isClassObject(obj) {
  //   const proto = Object.getPrototypeOf(obj);
  //   const isInstance = obj instanceof proto?.constructor;
  //   return isInstance && proto.constructor !== Object;
  // }

  // function isRawObject(obj) {
  //   const proto = Object.getPrototypeOf(obj);
  //   return proto === null || proto.constructor === Object;
  // }

  function defineGetterAsync(obj, namedCallback) {
    Object.defineProperty(
      obj instanceof Function ? obj.prototype : obj,
      namedCallback.name,
      {
        configurable: true,
        enumerable: !(obj instanceof Function),
        async get() {
          return await namedCallback();
        }
      }
    );
  }

  // The reason we do it this way is to preserve property metadata (e.g. copying getters themselves rather than their computed values).
  function mixin(target, ...sources) {
    function innumerable(obj) {
      const props = Object.getOwnPropertyDescriptors(obj);
      // function* zip(...arrays) {
      //   const maxLength = arrays.reduce((max, array) => array.length > max ? array.length : max, 0);
      //   for (let i = 0; i < maxLength; i++) {
      //     yield arrays.map(array => array[i]);
      //   }
      // }

      for (const desc of Object.values(props)) {
        if (desc.enumerable) Object.assign(desc, { enumerable: false });
      }

      // return Object.defineProperties(obj, props);
      return Object.defineProperties({}, props);
    }

    for (const source of sources) {
      Object.defineProperties(
        target instanceof Function ? target.prototype : target,
        Object.getOwnPropertyDescriptors(target instanceof Function ? innumerable(source) : source)
      );

      // const props = Object.getOwnPropertyDescriptors(source);
      // const mappedProps = Object.fromEntries(Object.entries(props).map(([name, desc]) => {
      //   if (desc.value === undefined || desc.value instanceof Function) return [name, {
      //   // if (desc?.value instanceof Function) return [name, {
      //     ...desc,
      //     enumerable: false
      //   }];
      //   return [name, desc];
      // }));
      // const innumerableProps = Object.fromEntries(Object.entries(props).map(
      //   ([name, desc]) => [name, { ...desc, enumerable: false }]
      // ));
      // const innumerableProps = Object.fromEntries(Object.entries(props).map(
      //   ([name, desc]) => [name, Object.assign(desc, { enumerable: false })]
      // ));

      // Object.defineProperties(target, props);
      // Object.defineProperties(target, mappedProps);
      // Object.defineProperties(target, innumerableProps);
    }

    return target;
  }

  // This allows us to effectively inherit from an instance of a type that cannot be constructed (e.g. DOM nodes) and thus would not otherwise be normally extensible.
  const proxyHandler = {
    get(target, prop, receiver) {
      const value = target[prop];

      if (value instanceof Function) return function(...args) {
        return value.apply(this === receiver ? target : this, args);
      };

      return value;
    }
  };

  function waitForChild(parent, selector) {
    return new Promise(resolve => {
      // const checkForChild = () => parent.querySelector(selector);

      // const child = checkForChild();
      const child = parent.querySelector(`:scope > ${selector}`);
      if (child) return resolve(child);

      const observer = new MutationObserver(records => {
        // if (records.some(record => record.addedNodes.length > 0)) {
        //   log(`children: ${JSON.stringify(records.map(
        //     record => Array.prototype.map.call(record.addedNodes, node => node.outerHTML)
        //   ), null, 2)}`);
        //   const child = checkForChild();
        //   if (child) {
        //     observer.disconnect();
        //     return resolve(child);
        //   }
        // }

        for (const record of records) {
          for (const child of record.addedNodes) {
            if (!(child instanceof HTMLElement)) continue;

            if (child.matches(selector)) {
              // log(`child: ${child.innerHTML}`);
              // child.classList.add('chunk-child');
              observer.disconnect();
              return resolve(child);
            }
          }
        }
      });

      observer.observe(parent, {
        // subtree: true,
        childList: true
      });

      // const child = checkForChild();
      // if (child) return resolve(child);
    });
  }

  /*----------------------------\
  | HTMLVideoElement Extensions |
  \----------------------------*/

  const videoMixin = {
    get hasAudio() {
      return this.mozHasAudio
        || this.webkitAudioDecodedByteCount > 0
        || this.audioTracks?.length > 0;
    },
    get effectivelyMuted() {
      return this.muted || this.volume === 0;
    },
    effectivelyUnmute() {
      this.dataset.unmuted = true;
      // const volume = Number(this.dataset.volume);
      // if (this.volume !== volume) this.volume = this.dataset.volume;
      if (this.volume !== config.lastVolume) this.volume = config.lastVolume;
      if (this.muted) this.muted = false;
    },
    forceUnload() {
      delete this.src;
      // this.querySelectorAll('source').forEach(src => src.remove());
      this.replaceChildren();
      this.load();
    }
  };
  defineGetterAsync(videoMixin, async function info(tryAgain = true) {
    const root = this.closest('article');
    const gallery = galleryView();

    const formatVariants = variants => variants.filter(
      variant => variant.content_type.startsWith('video/')
    ).map(variant => ({
      url: variant.url,
      type: variant.content_type
    })).reverse();

    const failover = async (id, wasCached, tweetVideo) => {
      if (!tweetVideo) {
        if (
          tryAgain
          && wasCached
        ) {
          await tweetCache.delete(id);
          return info(false);
        }

        log('fuckass video has no url');
        this.classList.add('fuckass');
        return {
          url: 'https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_h264.mov'
        };
      }

      return {
        url: tweetVideo.url,
        type: tweetVideo.format,
        variants: formatVariants(tweetVideo.variants)
      };
    };

    if (!root && gallery?.type === 'video') {
      const { tweet, wasCached } = await tweetCache.get(gallery.id);

      return failover(gallery.id, wasCached, tweet?.media.videos[gallery.index - 1]);
    }

    // const username = this.closest('[tabindex="0"]').querySelector('[data-testid="User-Name"] [tabindex="-1"] span').innerText.replace('@', '');
    // const videoId = (new URL(this.poster)).pathname.split('/')[2];
    const url = new URL(root.querySelector('a:has(time)').href);
    // log(`url = ${url}`);
    const id = url.pathname.split('/').pop();
    // log(`id = ${id}`);

    const { tweet, wasCached } = await tweetCache.get(id);
    // log(`tweet = ${tweet}`);

    const quote = this.closest('[tabindex="0"][role="link"]');
    const isQuoted = quote !== null;
    const videos = isQuoted
      ? quote.querySelectorAll('video')
      : root.querySelectorAll(':not([tabindex="0"][role="link"]) video');
    const videoIndex = Array.prototype.findIndex.call(videos, function(x) {
      return x === this;
    }, this);
    // log(`videoIndex = ${videoIndex}`);

    const tweetVideo = tweet
      ? isQuoted
        ? tweet?.quote.media.videos[videoIndex]
        : tweet?.media.videos[videoIndex]
      : null;

    return failover(id, wasCached, tweetVideo);
  });
  defineGetterAsync(videoMixin, function controlsNode() {
    return getVideoControls(this);
  });

  class ExtendedVideo {
    #debug = { now: Date.now() };

    constructor(video) {
      this.#debug.element = video;

      if (!(video instanceof HTMLVideoElement)) throw new TypeError('expected `video` to be instance of `HTMLVideoElement`');

      // Object.setPrototypeOf(Object.getPrototypeOf(this), video);
      Object.setPrototypeOf(Object.getPrototypeOf(this), new Proxy(video, proxyHandler));
    }
  }
  mixin(ExtendedVideo, videoMixin);

  function extendVideo(video) {
    if (!(video instanceof HTMLVideoElement)) throw new TypeError('expected `video` to be instance of `HTMLVideoElement`');

    // return mixin(Object.create(video), videoMixin);
    return mixin(Object.create(new Proxy(video, proxyHandler)), videoMixin);

    // return {
    //   // __proto__: video,
    //   __proto__: new Proxy(video, proxyHandler),
    //   ...videoMixin
    // };
  }

  // NOTE: This works well but is unsupported in Safari and requires replacing any existing video elements with the custom variant.
  // customElements.define('custom-video', mixin(class CustomVideo extends HTMLVideoElement {
  //   #debug = { now: Date.now() };
  // }, videoMixin), {
  //   extends: 'video'
  // });

  /*------\
  | Utils |
  |---------------------------\
  | DEPRECATED: Video Helpers |
  \--------------------------*/

  function forceUnload(video) {
    delete video.src;
    // video.querySelectorAll('source').forEach(src => src.remove());
    video.replaceChildren();
    video.load();
  }

  function effectivelyUnmute(video) {
    video.dataset.unmuted = true;
    // const volume = Number(video.dataset.volume);
    // if (video.volume !== volume) video.volume = video.dataset.volume;
    if (video.volume !== config.lastVolume) {
      video.dataset.volume = config.lastVolume;
      video.volume = config.lastVolume;
    }
    if (video.muted) video.muted = false;
  }

  function isEffectivelyMuted(video) {
    return video.muted || video.volume === 0;
  }

  function hasAudio(video) {
    return video.mozHasAudio
      || video.webkitAudioDecodedByteCount > 0
      || video.audioTracks?.length > 0;
  }

  async function getVideoInfo(video, tryAgain = true) {
    const root = video.closest('article');
    const gallery = galleryView();

    const formatVariants = variants => variants.filter(
      variant => variant.content_type.startsWith('video/')
    ).map(variant => ({
      url: variant.url,
      type: variant.content_type
    })).reverse();

    const failover = async (id, wasCached, tweetVideo) => {
      if (!tweetVideo) {
        if (
          tryAgain
          && wasCached
        ) {
          await tweetCache.delete(id);
          return getVideoInfo(video, false);
        }

        log('fuckass video has no url');
        video.classList.add('fuckass');
        return {
          url: 'https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_h264.mov'
        };
      }

      return {
        url: tweetVideo.url,
        type: tweetVideo.format,
        variants: formatVariants(tweetVideo.variants)
      };
    };

    if (!root && gallery?.type === 'video') {
      const { tweet, wasCached } = await tweetCache.get(gallery.id);

      return failover(gallery.id, wasCached, tweet?.media.videos[gallery.index - 1]);
    }

    // const username = video.closest('[tabindex="0"]').querySelector('[data-testid="User-Name"] [tabindex="-1"] span').innerText.replace('@', '');
    // const videoId = (new URL(video.poster)).pathname.split('/')[2];
    const url = new URL(root.querySelector('a:has(time)').href);
    // log(`url = ${url}`);
    const id = url.pathname.split('/').pop();
    // log(`id = ${id}`);

    const { tweet, wasCached } = await tweetCache.get(id);
    // log(`tweet = ${tweet}`);

    const quote = video.closest('[tabindex="0"][role="link"]');
    const isQuoted = quote !== null;
    const videos = isQuoted
      ? quote.querySelectorAll('video')
      : root.querySelectorAll(':not([tabindex="0"][role="link"]) video');
    const videoIndex = Array.prototype.findIndex.call(videos, function(x) {
      return x === this;
    }, video);
    // log(`videoIndex = ${videoIndex}`);

    const tweetVideo = tweet
      ? isQuoted
        ? tweet?.quote.media.videos[videoIndex]
        : tweet?.media.videos[videoIndex]
      : null;

    return failover(id, wasCached, tweetVideo);
  }

  function getVideoControls(video) {
    // return waitForChild(video.closest('[data-testid="videoComponent"]'), ':scope > [tabindex="0"]');
    // return waitForChild(video.closest('[data-testid="videoComponent"]'), '[tabindex="0"]');
    return waitForChild(video.closest('[data-testid="videoComponent"]'), ':not(:has(video)):has(button)');
  }
  
  /*------\
  | Utils |
  |---------------\
  | Event Helpers |
  \--------------*/

  function blockEvents(target, ...types) {
    for (const type of types) {
      target.addEventListener(type, function(event) {
        event.stopImmediatePropagation();
      }, true);
    }
  }

  function handleEvents(target, handler, ...types) {
    for (const type of types) {
      target.addEventListener(type, handler);
    }
  }

  function forwardEvents(tx, rx, ...types) {
    for (const type of types) {
      tx.addEventListener(type, function(event) {
        // log(`bubbles: ${event.bubbles}`);
        event.stopPropagation();
        rx.dispatchEvent(new event.constructor(event.type, event));
      });
    }
  }

  /*------\
  | Utils |
  |----------------------\
  | Intersection Helpers |
  \---------------------*/

  function fadeOut(video, ratio) {
    const newVolume = video.dataset.volume * ratio;
    // log(`volume = ${newVolume} / ${video.dataset.volume}`);
    video.dataset.fadeout = newVolume;
    video.volume = newVolume;

    // video.playbackRate = ratio;
  }

  function fadeOutEvent(video) {
    if (
      video.dataset.unmuted
      && !video.muted
      && !video.dataset.fullscreen
    ) {
      if (video.dataset.ratio) {
        fadeOut(video, video.dataset.ratio);
      } else if (video.dataset.fadeout) {
        const fadeout = Number(video.dataset.fadeout);
        delete video.dataset.fadeout;
        if (video.volume === fadeout) video.volume = video.dataset.volume;

        // if (video.playbackRate !== 1) video.playbackRate = 1;
      }
    }
  }

  function isEdging(mouseEvent, target, offset = 0, delay = 1000) {
    // const target = mouseEvent.target;
    const rect = target.getBoundingClientRect();
    const x = mouseEvent.x - rect.x;
    const y = mouseEvent.y - rect.y;
    // const time = Date.now();
    const time = mouseEvent.timeStamp;
    const updateTarget = () => {
      target.dataset.x = x;
      target.dataset.y = y;
      target.dataset.time = time;
    };
    if (!target.dataset.time) {
      updateTarget();
      // return false;
      return null;
    }
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    // const width = rect.width;
    // const height = rect.height;
    const deltaX = x - target.dataset.x;
    const deltaY = y - target.dataset.y;
    // const deltaX = Math.abs(x - target.dataset.x);
    // const deltaY = Math.abs(y - target.dataset.y);
    const deltaTime = time - target.dataset.time;
    if (deltaTime === 0) return null;
    const speedX = Math.round(deltaX / deltaTime * delay);
    const speedY = Math.round(deltaY / deltaTime * delay);
    // const speedX = Math.round(deltaX / deltaTime);
    // const speedY = Math.round(deltaY / deltaTime);
    // const speedX = deltaX / deltaTime * delay;
    // const speedY = deltaY / deltaTime * delay;
    updateTarget();

    log(`x = ${x}, deltaX = ${deltaX}, deltaTime = ${deltaTime}, speedX = ${speedX}`);

    // return x + deltaX <= offset
    //   || x + deltaX > width - offset
    //   || y + deltaY <= offset
    //   || y + deltaY > height - offset;
    // return x + speedX <= offset
    //   || x + speedX > width - offset
    //   || y + speedY <= offset
    //   || y + speedY > height - offset;

    if (
      x + speedX <= offset
      || x + speedX > width - offset
      || y + speedY <= offset
      || y + speedY > height - offset
    ) {
      // return {
      //   delay: deltaTime
      // };
      return {
        delay
      };
    }

    return null;
  }

  function numThresholds(n) {
    return timer(numThresholds.name, function() {
      // const a = Array.from({
      //     length: n + 2
      //   },
      //   (_, i) => i / (n + 1)
      // );
      // const a = [...Array(n + 2)].map((_, i) => i / (n + 1));
      const a = Array(n + 2);
      let i = 0;
      while (i < n + 2) a[i] = i++ / (n + 1);
      // for (let i = 0; i < n + 2; i++) a[i] = i / (n + 1);

      return a;
    });
  }

  /*--------------\
  | Node Handlers |
  \--------------*/

  async function handleVideo(video) {
    const keep = async () => {
      // blockEvents(video, 'error', 'emptied', 'abort');

      const controls = await getVideoControls(video);
      const fucker = controls.firstElementChild.firstElementChild.firstElementChild;
      // const fucker = waitForChild(controls, ':first-child:first-child:first-child');
      fucker.classList.add('fucker');
      const dingle = controls.firstElementChild.firstElementChild.querySelector(':scope > [style]');
      dingle.classList.add('dingle');

      controls.style.pointerEvents = 'none';
      fucker.style.pointerEvents = 'auto';
      video.style.cursor = 'pointer';

      fucker.addEventListener('mousedown', function(event) {
        if (event.buttons & 2) {
          log(`${event.type}`);
          this.style.pointerEvents = 'none';
        }
      });
      controls.addEventListener('keydown', function(event) {
        if (
          event.key === 'ContextMenu'
          && document.activeElement !== video
        ) {
          log(`${event.type}`);
          if (!isFirefox) fucker.style.pointerEvents = 'none';
          video.focus({
            focusVisible: false
          });
        }
      });

      if (!isFirefox) {
        video.addEventListener('keyup', function(event) {
          if (
            event.key === 'ContextMenu'
            && document.activeElement === video
          ) {
            log(`${event.type}`);
            setTimeout(() => fucker.style.pointerEvents = 'auto', 100);
          }
        });
        video.addEventListener('mouseup', function(event) {
          if (event.button === 2) {
            log(`${event.type}`);
            setTimeout(() => fucker.style.pointerEvents = 'auto', 100);
          }
        });
      } else {
        video.addEventListener('mouseleave', function(event) {
          if (fucker.style.pointerEvents === 'none') {
            log(`${event.type}`);
            fucker.style.pointerEvents = 'auto';
          }
        });
      }

      // fucker.addEventListener('mouseover', function(event) {
      //   if (
      //     !this.dataset.mousemove
      //     && !this.dataset.mouseout
      //   ) {
      //     log('over');
      //     this.style.pointerEvents = 'none';
      //   }
      // });
      // // blockEvents(fucker, 'mouseout');
      // fucker.addEventListener('mouseout', function(event) {
      //   if (this.dataset.mouseout) {
      //     log('out');
      //     delete this.dataset.mouseout;
      //     delete video.dataset.time;
      //     delete video.dataset.x;
      //     delete video.dataset.y;
      //   } else {
      //     event.stopImmediatePropagation();
      //   }
      // });
      // video.addEventListener('mouseleave', function(event) {
      //   log('leave');
      //   fucker.style.pointerEvents = 'auto';
      // });
      // video.addEventListener('mousemove', function(event) {
      //   if (!this.paused) {
      //     log('move: video');
      //     const edgeStreak = isEdging(event, this, 16);
      //     if (edgeStreak && !fucker.dataset.mouseout) {
      //       fucker.dataset.mouseout = true;
      //       fucker.style.pointerEvents = 'auto';
      //       setTimeout(function() {
      //         if (fucker.dataset.mouseout) {
      //           delete fucker.dataset.mouseout
      //           fucker.style.pointerEvents = 'none';
      //         };
      //       }, edgeStreak.delay);
      //     } else {
      //       fucker.dataset.mousemove = true;
      //       fucker.style.pointerEvents = 'auto';
      //       setTimeout(function() {
      //         delete fucker.dataset.mousemove;
      //         fucker.style.pointerEvents = 'none';
      //       });
      //     }
      //   }
      // });
      // fucker.addEventListener('mousemove', function(event) {
      //   if (!video.paused) {
      //     log('move: fucker');
      //     const edgeStreak = isEdging(event, video, 16);
      //     if (edgeStreak && !this.dataset.mouseout) {
      //       this.dataset.mouseout = true;
      //       this.style.pointerEvents = 'auto';
      //       setTimeout(function() {
      //         if (fucker.dataset.mouseout) {
      //           delete fucker.dataset.mouseout
      //           fucker.style.pointerEvents = 'none';
      //         };
      //       }, edgeStreak.delay);
      //     }
      //   }
      // });

      // video.addEventListener('click', function(event) {
      //   if (this.paused) {
      //     this.play();
      //   } else {
      //     if (
      //       this.muted
      //       && !this.dataset.unmuted
      //     ) {
      //       this.dataset.unmuted = true;
      //       this.muted = false;
      //       // dingle.style.setProperty('opacity', '0', 'important');
      //       dingle.classList.add('begone');
      //     } else {
      //       this.pause();
      //     }
      //   }
      // });
      // video.addEventListener('volumechange', function(event) {
      //   if (
      //     !this.muted
      //     && !this.dataset.unmuted
      //   ) {
      //     this.dataset.unmuted = true;
      //     // dingle.style.setProperty('opacity', '0', 'important');
      //     dingle.classList.add('begone');
      //   }
      // });

      // function flipFlop() {
      //   controls.querySelectorAll('[style*="opacity:"]').forEach(x => {
      //     const opacity =  Number(x.style.opacity);
      //     if (opacity === 0) {
      //       x.style.opacity = 1;
      //     } else if (opacity === 1) {
      //       x.style.opacity = 0;
      //     }
      //   });
      // }
      // video.addEventListener('mouseenter', function(event) {
      //   flipFlop();
      // });
      // video.addEventListener('mouseleave', function(event) {
      //   flipFlop();
      // });

      const info = await getVideoInfo(video);
      // blockEvents(video, 'error');

      if (info.variants) {
        const sources = video.querySelectorAll('source');

        info.variants.forEach((variant, i) => {
          const source = sources[i];
          if (source) {
            source.type = variant.type;
            source.src = variant.url;
          } else {
            const newSource = document.createElement('source');
            newSource.type = variant.type;
            newSource.src = variant.url;
            video.append(newSource);
          }
        });

        // const test = document.createElement('source');
        // test.src = 'https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_h264.mov';
        // video.append(test);

        video.addEventListener('progress', function(event) {
          if (!info.variants.some(variant => this.currentSrc === variant.url)) {
            log('bitchass video loaded wrong source');
            this.classList.add('bitchass');
          }
        });
      } else {
        const url = info.url;
        const source = document.createElement('source');
        source.src = url;
        // video.src = url;
        video.dataset.src = url;
        video.prepend(source);
        video.addEventListener('progress', function(event) {
          if (this.currentSrc !== this.dataset.src) {
            log('bitchass video loaded wrong source');
            this.classList.add('bitchass');
          }
        });
      }

      // blockEvents(video, 'error');
      video.load();
    };

    const replace = async () => {
      // We choose not to deep clone to discard any nested <source>.
      const newVideo = video.cloneNode(false);

      newVideo.autoplay = true;
      newVideo.controls = true;
      newVideo.loop = true;
      newVideo.tabIndex = 0;

      newVideo.volume = 0;
      // newVideo.dataset.volume = 0.5;
      newVideo.dataset.volume = config.lastVolume;
      // newVideo.muted = true;
      // newVideo.defaultMuted = true;

      // newVideo.preservesPitch = false;

      newVideo.src = (await getVideoInfo(video)).url;

      // newVideo.style.contentVisibility = 'auto';
      // newVideo.addEventListener('contentvisibilityautostatechange', function(event) {
      //   if (event.skipped) {
      //     this.pause();
      //   } else {
      //     this.play();
      //   }
      // });

      newVideo.addEventListener('play', function(event) {
        this.dataset.firstplay = true;
        this.dataset.autopause = true;
        this.pause();

        // if (!this.parentNode) {
        //   log('dipshit video has no parent node');
        //   this.classList.add('dipshit');
        // } else {
        //   intersectionObserver.observe(this.parentNode);
        // }
        const host = this.getRootNode().host;
        host.classList.add('chunk-host');
        intersectionObserver.observe(this);
        // intersectionObserver.observe(host);

        // if (isEffectivelyMuted(this)) {
        //   const unmuteinator3000 = document.createElement('div');
        //   unmuteinator3000.style = 'position: absolute; inset: 0; z-index: 3000;';

        //   unmuteinator3000.addEventListener('click', function(event) {
        //     event.stopPropagation();
        //     const video = this.parentNode.querySelector('video');
        //     video.volume = video.dataset.volume;
        //     video.muted = false;
        //     this.style.visibility = 'hidden';
        //   }, {
        //     once: true
        //   });

        //   unmuteinator3000.addEventListener('mouseenter', function(event) {
        //     event.stopPropagation();
        //     const video = this.parentNode.querySelector('video');
        //     // This triggers the browser native controls to show since we are blocking mouse events.
        //     if (isFirefox) {
        //       const oldVolume = video.volume;
        //       video.volume = 0;
        //       video.volume = oldVolume;
        //     } else {
        //       video.pause();
        //       video.play();
        //     }
        //   });

        //   this.parentNode.prepend(unmuteinator3000);
        // }

        this.addEventListener('play', function(event) {
          const isGalleryVideo = galleryView()?.type === 'video' && !this.closest('article');

          // Mute on first non-autoplay if start muted countermeasures somehow fail.
          if (
            !isGalleryVideo
            && !this.dataset.muted
            && hasAudio(this)
          ) {
            this.dataset.muted = true;

            if (
              !this.dataset.unmuted
              && !isEffectivelyMuted(this)
            ) {
              this.muted = true;
              log('shithead video unmuted itself');
              this.classList.add('shithead');
            }
          }

          // Automatically unmute video if in gallery view.
          if (
            isGalleryVideo
            && !this.dataset.unmuted
            && hasAudio(this)
            && isEffectivelyMuted(this)
          ) {
            effectivelyUnmute(this);
          }

          // Restart fade out operation if played while intersecting.
          fadeOutEvent(this);
        });
      }, {
        once: true
      });

      newVideo.addEventListener('pause', function(event) {
        delete this.dataset.firstplay;

        this.addEventListener('pause', function(event) {
          // Implement unmute on click by virtually capturing the first manual pause.
          // NOTE: Might make the browser angry if site autoplay permissions aren't permissive enough.
          if (
            !this.dataset.unmuted
            && !this.dataset.autopause
            && hasAudio(this)
            && isEffectivelyMuted(this)
          ) {
            effectivelyUnmute(this);
            this.play();
          }
        });
      }, {
        once: true
      });

      newVideo.addEventListener('volumechange', function(event) {
        const volume = Number(this.dataset.volume);
        // const muteToggled = this.volume === volume;
        // const wasUnmuted = muteToggled && !this.muted;

        // Disarm click to unmute on manual unmute while not intersecting.
        // if (
        //   !this.dataset.unmuted
        //   && !isEffectivelyMuted(this)
        // ) {
        //   this.dataset.unmuted = true;
        // }

        // Restart fade out operation if volume changed while intersecting.
        fadeOutEvent(this);

        // Update target volume while not intersecting.
        if (
          this.dataset.unmuted
          && !this.dataset.ratio
          && volume !== this.volume
        ) {
          this.dataset.volume = this.volume;
          config.lastVolume = this.volume;
        }
      });

      newVideo.addEventListener('fullscreenchange', function(event) {
        if (document.fullscreenElement !== null) {
          this.dataset.fullscreen = true;

          // Restore volume to pre-fadeout levels.
          if (this.dataset.fadeout) this.volume = this.dataset.volume;
        } else {
          delete this.dataset.fullscreen;
        }
      });

      // Erase all possible video sources then reload the video to force the browser to flush the data.
      blockEvents(video, 'error');
      forceUnload(video);
      video.addEventListener('progress', function(event) {
        forceUnload(this);
      });

      // NOTE: This clears all previously registered events.
      // video.replaceWith(newVideo);

      // const container = video.closest('[data-testid="tweetPhoto"]');
      // const container = video.closest('[data-testid="videoPlayer"]');
      const container = video.closest('[data-testid="videoComponent"]');
      const newContainer = container.cloneNode(true);
      newContainer.querySelectorAll(':scope > :not(:has(video))').forEach(notVideo => notVideo.remove());
      newContainer.querySelector('video').replaceWith(newVideo);
      const shadow = container.parentNode.attachShadow({
        mode: 'open'
      });
      shadow.append(newContainer);
      // container.style.display = 'none';
      container.style.setProperty('display', 'none', 'important');
    };

    if (config.keepControls) {
      keep();
    } else {
      replace();
    }
  }

  async function handleGif(gif) {
    const controls = await getVideoControls(gif);
    // const controls = await waitForChild(gif.closest('[data-testid="videoComponent"]'), ':not(:has(video)):has(button)');

    gif.loop = true;
    blockEvents(gif, 'ended');

    gif.addEventListener('click', function(event) {
      if (this.paused) {
        this.play();
      } else {
        this.pause();
      }
    });
    // controls.style.pointerEvents = 'none';
    controls.style.setProperty('pointer-events', 'none', 'important');
  }

  /*------------------\
  | Mutation Observer |
  \------------------*/

  const mutationObserver = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        const checkNode = selector => node.matches(selector) ? node : node.querySelector(selector);

        const video = checkNode('video:not([src]):has(> source:only-child[src^="blob:"])');
        if (video) {
          node.classList.add('chunk-video');
          // log('beep');
          // handleVideo(video, true);
          handleVideo(video);
        }

        const gif = checkNode('video:not(:has(source))[src^="https://video.twimg.com/tweet_video/"]');
        if (gif) {
          node.classList.add('chunk-gif');
          // log('boop');
          handleGif(gif);
        }

        // const controlsSelector = 'div[data-testid="videoComponent"] > div:not(:has(video))[tabindex="0"]';
        const controlsSelector = 'div[data-testid="videoComponent"] > div:not(:has(video)):has(button)';
        const controls = checkNode(controlsSelector);
        if (controls) {
          node.classList.add('chunk-controls');
          // log(`buzz:\n${node.innerHTML}`);
        }
        if (node.matches(`${controlsSelector} *`)) {
          node.classList.add('chunk-subcontrols');
          // log(`buzzbuzz:\n${node.outerHTML}`);
        }

        // if (node instanceof HTMLSourceElement) {
        //   log(`src: ${node.src}`);
        // }
      }
    }
  });

  /*----------------------\
  | Intersection Observer |
  \----------------------*/

  const intersectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      // const video = entry.target.querySelector('video');
      const video = entry.target;
      // const video = entry.target.shadowRoot.querySelector('video');

      if (video) {
        const ratio = entry.intersectionRatio;
        // log(`ratio: ${ratio}`);
        const pauseThreshold = 0.1;

        const isFullyVisible = isFirefox ? ratio === 1 : ratio >= 0.99;
        // Forward intersection ratio to dataset so that fade out operation can be restarted when appropiate.
        if (
          !isFullyVisible
          && !video.dataset.fullscreen
        ) {
          video.dataset.ratio = ratio;
        } else {
          if (video.dataset.ratio) delete video.dataset.ratio;
        }

        // Implement fade out/in volume when leaving/entering viewport.
        if (
          video.dataset.unmuted
          && !video.muted
          && !video.paused
          && !video.dataset.fullscreen
        ) {
          // if (ratio !== 1) {
          if (!isFullyVisible) {
            fadeOut(video, ratio);
          } else {
            if (video.dataset.fadeout) {
              delete video.dataset.fadeout;
              video.volume = video.dataset.volume;

              // video.playbackRate = 1;
            }
          }
        }

        // Implement pause/play when leaving/entering viewport.
        if (!video.dataset.fullscreen) {
          if (
            video.paused
            && video.dataset.autopause
            && ratio > pauseThreshold
          ) {
            delete video.dataset.autopause;
            video.play();
          } else if (
            !video.paused
            && ratio <= pauseThreshold
          ) {
            video.dataset.autopause = true;
            video.pause();
          }
        }
      }
    }
  }, {
    root: null,
    // root: document.documentElement,
    // root: document.body,
    rootMargin: '-53px 0px 0px 0px',
    // threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9, 1]
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9, 0.99, 1]
    // threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9]
    // threshold: numThresholds(9)
  });

  /*-----\
  | Init |
  \-----*/

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Prevent disabling of context menus, especially in the case of fake GIF videos.
  blockEvents(document, 'contextmenu');

  GM.registerMenuCommand('Clear tweet cache...', async function(event) {
    if (confirm('Are you sure you want to remove all cached tweets?')) {
      const oldSize = await tweetCache.updatedSize();
      await tweetCache.clear();
      alert(`${oldSize} cached tweets have been successfully removed.`);
    }
  });

  GM.registerMenuCommand('Download tweet cache ᵈᵉᵇᵘᵍ', async function(event) {
    await tweetCache.download();
  });

  GM.registerMenuCommand(`Switch to ${config.keepControls ? browserName : 'Twitter'} video player ᵇᵉᵗᵃ`, async function(event) {
    config.keepControls = !config.keepControls;
  });
})();
