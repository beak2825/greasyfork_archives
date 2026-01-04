// ==UserScript==
// @name                YouTube Codecs - Hardware Acceleration Only
// @name:zh-TW          YouTube Codecs - Hardware Acceleration Only
// @name:zh-HK          YouTube Codecs - Hardware Acceleration Only
// @name:zh-CN          YouTube Codecs - Hardware Acceleration Only
// @name:ja             YouTube Codecs - Hardware Acceleration Only
// @name:ko             YouTube Codecs - Hardware Acceleration Only
// @name:vi             YouTube Codecs - Hardware Acceleration Only
// @name:de             YouTube Codecs - Hardware Acceleration Only
// @name:fr             YouTube Codecs - Hardware Acceleration Only
// @name:it             YouTube Codecs - Hardware Acceleration Only
// @name:es             YouTube Codecs - Hardware Acceleration Only
// @description         Use codecs with hardware accleration supported for media playback on YouTube
// @description:zh-TW   Use codecs with hardware accleration supported for media playback on YouTube
// @description:zh-HK   Use codecs with hardware accleration supported for media playback on YouTube
// @description:zh-CN   Use codecs with hardware accleration supported for media playback on YouTube
// @description:ja      Use codecs with hardware accleration supported for media playback on YouTube
// @description:ko      Use codecs with hardware accleration supported for media playback on YouTube
// @description:vi      Use codecs with hardware accleration supported for media playback on YouTube
// @description:de      Use codecs with hardware accleration supported for media playback on YouTube
// @description:fr      Use codecs with hardware accleration supported for media playback on YouTubee
// @description:it      Use codecs with hardware accleration supported for media playback on YouTube
// @description:es      Use codecs with hardware accleration supported for media playback on YouTube
// @namespace           http://tampermonkey.net/
// @version             0.0.2
// @author              CY Fung
// @match               https://www.youtube.com/*
// @match               https://www.youtube.com/embed/*
// @match               https://www.youtube-nocookie.com/embed/*
// @exclude             https://www.youtube.com/live_chat*
// @exclude             https://www.youtube.com/live_chat_replay*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant               none
// @run-at              document-start
// @license             MIT
//
// @compatible          firefox Violentmonkey
// @compatible          firefox Tampermonkey
// @compatible          firefox FireMonkey
// @compatible          chrome Violentmonkey
// @compatible          chrome Tampermonkey
// @compatible          opera Violentmonkey
// @compatible          opera Tampermonkey
// @compatible          safari Stay
// @compatible          edge Violentmonkey
// @compatible          edge Tampermonkey
// @compatible          brave Violentmonkey
// @compatible          brave Tampermonkey
//
// @unwrap
// @allFrames           true
// @inject-into         page
// @downloadURL https://update.greasyfork.org/scripts/538098/YouTube%20Codecs%20-%20Hardware%20Acceleration%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/538098/YouTube%20Codecs%20-%20Hardware%20Acceleration%20Only.meta.js
// ==/UserScript==

(function (__Promise__) {
  'use strict';

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.

  if (typeof VideoEncoder !== 'function' || typeof VideoEncoder.isConfigSupported !== 'function') {
    console.error('VideoEncoder.isConfigSupported is not supported');
    return;
  }

  const storageKey = '__codecs_vvgZHhgVKfAlY0__';
  let useCache = false;
  let useAV1 = false;
  const getMap = () => {
    const v = localStorage[storageKey]
    if (v) {
      try {
        const obj = JSON.parse(v);
        const resMap = new Map(Object.entries(obj));
        useCache = true;
        return resMap;
      } catch (e) { }
    }
    return new Map();
  }

  const objectKey = '__codecs_qyg8YVnvXJZ9E5__';

  const __codecs__ = window[objectKey] || (window[objectKey] = getMap());

  const testCodec = async (codec) => {

    if (!codec) return null;

    if (__codecs__.has(codec)) return __codecs__.get(codec);

    __codecs__.set(codec, null);

    const config = {
      codec: codec,
      hardwareAcceleration: 'prefer-hardware',
      width: 1920,
      height: 1080,
      bitrate: 12_000_000,
      bitrateMode: "variable",
      framerate: 60,
      sampleRate: 48000,
      numberOfChannels: 2,
    };

    let supported = false;

    try {
      const resV = await VideoDecoder.isConfigSupported(config);
      const resA = await AudioDecoder.isConfigSupported(config);
      if (resV.supported === true || resA.supported === true) {
        supported = true;
      }
    } catch (e) {
      console.warn(e)
    }

    __codecs__.set(codec, supported);

    return supported;

  }

  const getCodecResult = (codec) => {
    if (codec.length === 30 && /^av01\.0\.\d\dM\.\d\d\b/.test(`${codec}`)) {
      // av01.0.05M.08.0.110.05.01.06.0
      codec = codec.substring(0, 13);
      // av01.0.05M.08
    }
    let q = __codecs__.get(codec);
    return q;
  }

  // reference: https://cobalt.googlesource.com/cobalt/+/refs/tags/24.lts.40/starboard/nplb/media_can_play_mime_and_key_system_test_helpers.h
  // https://cconcolato.github.io/media-mime-support/mediacapabilities.html

  if (useCache) {
    console.log('[yt-codecs-hardware-acceleration-only] (init) load from cache')
  } else {
    Promise.all([
      "avc1.420034",
      "hvc1.1.6.L123.00",
      "vp8",
      // "vp09.00.10.08",
      // "av01.0.04M.08",
      "vp09.02.51.10.01.09.16.09.00",
      "vp09.02.51.10.01.09.99.99.00",
      "vp09.02.50.10.01.09.16.09.00",
      "vp09.02.50.10.01.09.99.99.00",
      "vp09.02.41.10.01.09.16.09.00",
      "vp09.02.41.10.01.09.99.99.00",
      "vp09.02.40.10.01.09.16.09.00",
      "vp09.02.40.10.01.09.99.99.00",
      "vp09.02.31.10.01.09.16.09.00",
      "vp09.02.31.10.01.09.99.09.00",
      "vp09.02.30.10.01.09.16.09.00",
      "vp09.02.30.10.01.09.99.09.00",
      "vp09.02.21.10.01.09.16.09.00",
      "vp09.02.21.10.01.09.99.09.00",
      "vp09.02.11.10.01.09.16.09.00",
      "vp09.02.11.10.01.09.99.09.00",
      "vp09.02.10.10.01.09.16.09.00",
      "vp09.02.10.10.01.09.99.09.00",
      "mp4a.40.5",
      "mp4a.40.2",
      "opus",
      "vp9",
      "vp09.00.51.08.01.01.01.01.00",
      "vp09.00.51.08",
      "vp09.00.50.08",
      "vp09.00.41.08",
      "vp09.00.40.08",
      "vp09.00.31.08",
      "vp09.00.30.08",
      "vp09.00.21.08",
      "vp09.00.20.08",
      "vp09.00.11.08",
      "vp09.00.10.08",
      "avc1.640028",
      "avc1.4d401e",
      "avc1.4d4015",
      "avc1.4d400c",
      "avc1.42001E",
      "avc1.4d401f",
      "avc1.64001F",
      "avc1.4d4020",
      "avc1.64002a",
      "avc1.64002A",
      "avc1.4D4020",
      "avc1.4D401F",
      "avc1.4D401E",
      "avc1.4D4015",
      "avc1.4D400C",
      "avc1.4d002a",
      "avc1.4d0028",
      "avc1.6e0034",

      "av01.0.00M.08",
      "av01.0.01M.08",
      "av01.0.02M.08",
      "av01.0.03M.08",
      "av01.0.04M.08",
      "av01.0.05M.08",
      "av01.0.06M.08",
      "av01.0.07M.08",
      "av01.0.08M.08",
      "av01.0.09M.08",
      "av01.0.12M.08",
      "av01.0.13M.08",
      "av01.0.14M.08",
      "av01.0.15M.08",
      "av01.0.16M.08",
      "av01.0.17M.08",
      "av01.0.18M.08",
      "av01.0.19M.08",


      "av01.0.00M.10",
      "av01.0.01M.10",
      "av01.0.02M.10",
      "av01.0.03M.10",
      "av01.0.04M.10",
      "av01.0.05M.10",
      "av01.0.06M.10",
      "av01.0.07M.10",
      "av01.0.08M.10",
      "av01.0.09M.10",
      "av01.0.12M.10",
      "av01.0.13M.10",
      "av01.0.14M.10",
      "av01.0.15M.10",
      "av01.0.16M.10",
      "av01.0.17M.10",
      "av01.0.18M.10",
      "av01.0.19M.10",


      /*

      "av01.0.00M.10.0.110.09.16.09.0",
      "av01.0.01M.10.0.110.09.16.09.0",
      "av01.0.02M.10.0.110.09.16.09.0",
      "av01.0.03M.10.0.110.09.16.09.0",
      "av01.0.04M.10.0.110.09.16.09.0",
      "av01.0.05M.10.0.110.09.16.09.0",
      "av01.0.06M.10.0.110.09.16.09.0",
      "av01.0.07M.10.0.110.09.16.09.0",
      "av01.0.08M.10.0.110.09.16.09.0",
      "av01.0.09M.10.0.110.09.16.09.0",
      "av01.0.12M.10.0.110.09.16.09.0",
      "av01.0.13M.10.0.110.09.16.09.0",
      "av01.0.14M.10.0.110.09.16.09.0",
      "av01.0.15M.10.0.110.09.16.09.0",
      "av01.0.16M.10.0.110.09.16.09.0",
      "av01.0.17M.10.0.110.09.16.09.0",
      "av01.0.18M.10.0.110.09.16.09.0",
      "av01.0.19M.10.0.110.09.16.09.0",


      "av01.0.00M.08.0.110.05.01.06.0",
      "av01.0.01M.08.0.110.05.01.06.0",
      "av01.0.02M.08.0.110.05.01.06.0",
      "av01.0.03M.08.0.110.05.01.06.0",
      "av01.0.04M.08.0.110.05.01.06.0",
      "av01.0.05M.08.0.110.05.01.06.0",
      "av01.0.06M.08.0.110.05.01.06.0",
      "av01.0.07M.08.0.110.05.01.06.0",
      "av01.0.08M.08.0.110.05.01.06.0",
      "av01.0.09M.08.0.110.05.01.06.0",
      "av01.0.12M.08.0.110.05.01.06.0",
      "av01.0.13M.08.0.110.05.01.06.0",
      "av01.0.14M.08.0.110.05.01.06.0",
      "av01.0.15M.08.0.110.05.01.06.0",
      "av01.0.16M.08.0.110.05.01.06.0",
      "av01.0.17M.08.0.110.05.01.06.0",
      "av01.0.18M.08.0.110.05.01.06.0",
      "av01.0.19M.08.0.110.05.01.06.0",


      "av01.0.00M.08.0.110.06.01.06.0",
      "av01.0.01M.08.0.110.06.01.06.0",
      "av01.0.02M.08.0.110.06.01.06.0",
      "av01.0.03M.08.0.110.06.01.06.0",
      "av01.0.04M.08.0.110.06.01.06.0",
      "av01.0.05M.08.0.110.06.01.06.0",
      "av01.0.06M.08.0.110.06.01.06.0",
      "av01.0.07M.08.0.110.06.01.06.0",
      "av01.0.08M.08.0.110.06.01.06.0",
      "av01.0.09M.08.0.110.06.01.06.0",
      "av01.0.12M.08.0.110.06.01.06.0",
      "av01.0.13M.08.0.110.06.01.06.0",
      "av01.0.14M.08.0.110.06.01.06.0",
      "av01.0.15M.08.0.110.06.01.06.0",
      "av01.0.16M.08.0.110.06.01.06.0",
      "av01.0.17M.08.0.110.06.01.06.0",
      "av01.0.18M.08.0.110.06.01.06.0",
      "av01.0.19M.08.0.110.06.01.06.0",

      */

      "av01.0.00M.08",
      "av01.0.00M.10",
      "av01.0.00M.12",
      "av01.0.00H.08",
      "av01.0.00H.10",
      "av01.0.00H.12",
      "av01.0.01M.08",
      "av01.0.01M.10",
      "av01.0.01M.12",
      "av01.0.01H.08",
      "av01.0.01H.10",
      "av01.0.01H.12",
      "av01.0.02M.08",
      "av01.0.02M.10",
      "av01.0.02M.12",
      "av01.0.02H.08",
      "av01.0.02H.10",
      "av01.0.02H.12",
      "av01.0.03M.08",
      "av01.0.03M.10",
      "av01.0.03M.12",
      "av01.0.03H.08",
      "av01.0.03H.10",
      "av01.0.03H.12",
      "av01.0.04M.08",
      "av01.0.04M.10",
      "av01.0.04M.12",
      "av01.0.04H.08",
      "av01.0.04H.10",
      "av01.0.04H.12",
      "av01.0.05M.08",
      "av01.0.05M.10",
      "av01.0.05M.12",
      "av01.0.05H.08",
      "av01.0.05H.10",
      "av01.0.05H.12",
      "av01.0.06M.08",
      "av01.0.06M.10",
      "av01.0.06M.12",
      "av01.0.06H.08",
      "av01.0.06H.10",
      "av01.0.06H.12",
      "av01.0.07M.08",
      "av01.0.07M.10",
      "av01.0.07M.12",
      "av01.0.07H.08",
      "av01.0.07H.10",
      "av01.0.07H.12",
      "av01.0.08M.08",
      "av01.0.08M.10",
      "av01.0.08M.12",
      "av01.0.08H.08",
      "av01.0.08H.10",
      "av01.0.08H.12",
      "av01.0.09M.08",
      "av01.0.09M.10",
      "av01.0.09M.12",
      "av01.0.09H.08",
      "av01.0.09H.10",
      "av01.0.09H.12",
      "av01.0.10M.08",
      "av01.0.10M.10",
      "av01.0.10M.12",
      "av01.0.10H.08",
      "av01.0.10H.10",
      "av01.0.10H.12",
      "av01.0.11M.08",
      "av01.0.11M.10",
      "av01.0.11M.12",
      "av01.0.11H.08",
      "av01.0.11H.10",
      "av01.0.11H.12",
      "av01.0.12M.08",
      "av01.0.12M.10",
      "av01.0.12M.12",
      "av01.0.12H.08",
      "av01.0.12H.10",
      "av01.0.12H.12",
      "av01.0.13M.08",
      "av01.0.13M.10",
      "av01.0.13M.12",
      "av01.0.13H.08",
      "av01.0.13H.10",
      "av01.0.13H.12",
      "av01.0.14M.08",
      "av01.0.14M.10",
      "av01.0.14M.12",
      "av01.0.14H.08",
      "av01.0.14H.10",
      "av01.0.14H.12",
      "av01.0.15M.08",
      "av01.0.15M.10",
      "av01.0.15M.12",
      "av01.0.15H.08",
      "av01.0.15H.10",
      "av01.0.15H.12",
      "av01.0.16M.08",
      "av01.0.16M.10",
      "av01.0.16M.12",
      "av01.0.16H.08",
      "av01.0.16H.10",
      "av01.0.16H.12",
      "av01.0.17M.08",
      "av01.0.17M.10",
      "av01.0.17M.12",
      "av01.0.17H.08",
      "av01.0.17H.10",
      "av01.0.17H.12",
      "av01.0.18M.08",
      "av01.0.18M.10",
      "av01.0.18M.12",
      "av01.0.18H.08",
      "av01.0.18H.10",
      "av01.0.18H.12",
      "av01.0.19M.08",
      "av01.0.19M.10",
      "av01.0.19M.12",
      "av01.0.19H.08",
      "av01.0.19H.10",
      "av01.0.19H.12",
      "av01.0.20M.08",
      "av01.0.20M.10",
      "av01.0.20M.12",
      "av01.0.20H.08",
      "av01.0.20H.10",
      "av01.0.20H.12",
      "av01.0.21M.08",
      "av01.0.21M.10",
      "av01.0.21M.12",
      "av01.0.21H.08",
      "av01.0.21H.10",
      "av01.0.21H.12",
      "av01.0.22M.08",
      "av01.0.22M.10",
      "av01.0.22M.12",
      "av01.0.22H.08",
      "av01.0.22H.10",
      "av01.0.22H.12",
      "av01.0.23M.08",
      "av01.0.23M.10",
      "av01.0.23M.12",
      "av01.0.23H.08",
      "av01.0.23H.10",
      "av01.0.23H.12",
      "av01.0.31M.08",
      "av01.0.31M.10",
      "av01.0.31M.12",
      "av01.0.31H.08",
      "av01.0.31H.10",
      "av01.0.31H.12",
      "av01.1.00M.08",
      "av01.1.00M.10",
      "av01.1.00M.12",
      "av01.1.00H.08",
      "av01.1.00H.10",
      "av01.1.00H.12",
      "av01.1.01M.08",
      "av01.1.01M.10",
      "av01.1.01M.12",
      "av01.1.01H.08",
      "av01.1.01H.10",
      "av01.1.01H.12",
      "av01.1.02M.08",
      "av01.1.02M.10",
      "av01.1.02M.12",
      "av01.1.02H.08",
      "av01.1.02H.10",
      "av01.1.02H.12",
      "av01.1.03M.08",
      "av01.1.03M.10",
      "av01.1.03M.12",
      "av01.1.03H.08",
      "av01.1.03H.10",
      "av01.1.03H.12",
      "av01.1.04M.08",
      "av01.1.04M.10",
      "av01.1.04M.12",
      "av01.1.04H.08",
      "av01.1.04H.10",
      "av01.1.04H.12",
      "av01.1.05M.08",
      "av01.1.05M.10",
      "av01.1.05M.12",
      "av01.1.05H.08",
      "av01.1.05H.10",
      "av01.1.05H.12",
      "av01.1.06M.08",
      "av01.1.06M.10",
      "av01.1.06M.12",
      "av01.1.06H.08",
      "av01.1.06H.10",
      "av01.1.06H.12",
      "av01.1.07M.08",
      "av01.1.07M.10",
      "av01.1.07M.12",
      "av01.1.07H.08",
      "av01.1.07H.10",
      "av01.1.07H.12",
      "av01.1.08M.08",
      "av01.1.08M.10",
      "av01.1.08M.12",
      "av01.1.08H.08",
      "av01.1.08H.10",
      "av01.1.08H.12",
      "av01.1.09M.08",
      "av01.1.09M.10",
      "av01.1.09M.12",
      "av01.1.09H.08",
      "av01.1.09H.10",
      "av01.1.09H.12",
      "av01.1.10M.08",
      "av01.1.10M.10",
      "av01.1.10M.12",
      "av01.1.10H.08",
      "av01.1.10H.10",
      "av01.1.10H.12",
      "av01.1.11M.08",
      "av01.1.11M.10",
      "av01.1.11M.12",
      "av01.1.11H.08",
      "av01.1.11H.10",
      "av01.1.11H.12",
      "av01.1.12M.08",
      "av01.1.12M.10",
      "av01.1.12M.12",
      "av01.1.12H.08",
      "av01.1.12H.10",
      "av01.1.12H.12",
      "av01.1.13M.08",
      "av01.1.13M.10",
      "av01.1.13M.12",
      "av01.1.13H.08",
      "av01.1.13H.10",
      "av01.1.13H.12",
      "av01.1.14M.08",
      "av01.1.14M.10",
      "av01.1.14M.12",
      "av01.1.14H.08",
      "av01.1.14H.10",
      "av01.1.14H.12",
      "av01.1.15M.08",
      "av01.1.15M.10",
      "av01.1.15M.12",
      "av01.1.15H.08",
      "av01.1.15H.10",
      "av01.1.15H.12",
      "av01.1.16M.08",
      "av01.1.16M.10",
      "av01.1.16M.12",
      "av01.1.16H.08",
      "av01.1.16H.10",
      "av01.1.16H.12",
      "av01.1.17M.08",
      "av01.1.17M.10",
      "av01.1.17M.12",
      "av01.1.17H.08",
      "av01.1.17H.10",
      "av01.1.17H.12",
      "av01.1.18M.08",
      "av01.1.18M.10",
      "av01.1.18M.12",
      "av01.1.18H.08",
      "av01.1.18H.10",
      "av01.1.18H.12",
      "av01.1.19M.08",
      "av01.1.19M.10",
      "av01.1.19M.12",
      "av01.1.19H.08",
      "av01.1.19H.10",
      "av01.1.19H.12",
      "av01.1.20M.08",
      "av01.1.20M.10",
      "av01.1.20M.12",
      "av01.1.20H.08",
      "av01.1.20H.10",
      "av01.1.20H.12",
      "av01.1.21M.08",
      "av01.1.21M.10",
      "av01.1.21M.12",
      "av01.1.21H.08",
      "av01.1.21H.10",
      "av01.1.21H.12",
      "av01.1.22M.08",
      "av01.1.22M.10",
      "av01.1.22M.12",
      "av01.1.22H.08",
      "av01.1.22H.10",
      "av01.1.22H.12",
      "av01.1.23M.08",
      "av01.1.23M.10",
      "av01.1.23M.12",
      "av01.1.23H.08",
      "av01.1.23H.10",
      "av01.1.23H.12",
      "av01.1.31M.08",
      "av01.1.31M.10",
      "av01.1.31M.12",
      "av01.1.31H.08",
      "av01.1.31H.10",
      "av01.1.31H.12",
      "av01.2.00M.08",
      "av01.2.00M.10",
      "av01.2.00M.12",
      "av01.2.00H.08",
      "av01.2.00H.10",
      "av01.2.00H.12",
      "av01.2.01M.08",
      "av01.2.01M.10",
      "av01.2.01M.12",
      "av01.2.01H.08",
      "av01.2.01H.10",
      "av01.2.01H.12",
      "av01.2.02M.08",
      "av01.2.02M.10",
      "av01.2.02M.12",
      "av01.2.02H.08",
      "av01.2.02H.10",
      "av01.2.02H.12",
      "av01.2.03M.08",
      "av01.2.03M.10",
      "av01.2.03M.12",
      "av01.2.03H.08",
      "av01.2.03H.10",
      "av01.2.03H.12",
      "av01.2.04M.08",
      "av01.2.04M.10",
      "av01.2.04M.12",
      "av01.2.04H.08",
      "av01.2.04H.10",
      "av01.2.04H.12",
      "av01.2.05M.08",
      "av01.2.05M.10",
      "av01.2.05M.12",
      "av01.2.05H.08",
      "av01.2.05H.10",
      "av01.2.05H.12",
      "av01.2.06M.08",
      "av01.2.06M.10",
      "av01.2.06M.12",
      "av01.2.06H.08",
      "av01.2.06H.10",
      "av01.2.06H.12",
      "av01.2.07M.08",
      "av01.2.07M.10",
      "av01.2.07M.12",
      "av01.2.07H.08",
      "av01.2.07H.10",
      "av01.2.07H.12",
      "av01.2.08M.08",
      "av01.2.08M.10",
      "av01.2.08M.12",
      "av01.2.08H.08",
      "av01.2.08H.10",
      "av01.2.08H.12",
      "av01.2.09M.08",
      "av01.2.09M.10",
      "av01.2.09M.12",
      "av01.2.09H.08",
      "av01.2.09H.10",
      "av01.2.09H.12",
      "av01.2.10M.08",
      "av01.2.10M.10",
      "av01.2.10M.12",
      "av01.2.10H.08",
      "av01.2.10H.10",
      "av01.2.10H.12",
      "av01.2.11M.08",
      "av01.2.11M.10",
      "av01.2.11M.12",
      "av01.2.11H.08",
      "av01.2.11H.10",
      "av01.2.11H.12",
      "av01.2.12M.08",
      "av01.2.12M.10",
      "av01.2.12M.12",
      "av01.2.12H.08",
      "av01.2.12H.10",
      "av01.2.12H.12",
      "av01.2.13M.08",
      "av01.2.13M.10",
      "av01.2.13M.12",
      "av01.2.13H.08",
      "av01.2.13H.10",
      "av01.2.13H.12",
      "av01.2.14M.08",
      "av01.2.14M.10",
      "av01.2.14M.12",
      "av01.2.14H.08",
      "av01.2.14H.10",
      "av01.2.14H.12",
      "av01.2.15M.08",
      "av01.2.15M.10",
      "av01.2.15M.12",
      "av01.2.15H.08",
      "av01.2.15H.10",
      "av01.2.15H.12",
      "av01.2.16M.08",
      "av01.2.16M.10",
      "av01.2.16M.12",
      "av01.2.16H.08",
      "av01.2.16H.10",
      "av01.2.16H.12",
      "av01.2.17M.08",
      "av01.2.17M.10",
      "av01.2.17M.12",
      "av01.2.17H.08",
      "av01.2.17H.10",
      "av01.2.17H.12",
      "av01.2.18M.08",
      "av01.2.18M.10",
      "av01.2.18M.12",
      "av01.2.18H.08",
      "av01.2.18H.10",
      "av01.2.18H.12",
      "av01.2.19M.08",
      "av01.2.19M.10",
      "av01.2.19M.12",
      "av01.2.19H.08",
      "av01.2.19H.10",
      "av01.2.19H.12",
      "av01.2.20M.08",
      "av01.2.20M.10",
      "av01.2.20M.12",
      "av01.2.20H.08",
      "av01.2.20H.10",
      "av01.2.20H.12",
      "av01.2.21M.08",
      "av01.2.21M.10",
      "av01.2.21M.12",
      "av01.2.21H.08",
      "av01.2.21H.10",
      "av01.2.21H.12",
      "av01.2.22M.08",
      "av01.2.22M.10",
      "av01.2.22M.12",
      "av01.2.22H.08",
      "av01.2.22H.10",
      "av01.2.22H.12",
      "av01.2.23M.08",
      "av01.2.23M.10",
      "av01.2.23M.12",
      "av01.2.23H.08",
      "av01.2.23H.10",
      "av01.2.23H.12",
      "av01.2.31M.08",
      "av01.2.31M.10",
      "av01.2.31M.12",
      "av01.2.31H.08",
      "av01.2.31H.10",
      "av01.2.31H.12",

      "avc1.42000a",
      "avc1.42000b",
      "avc1.42000c",
      "avc1.42000d",
      "avc1.420014",
      "avc1.420015",
      "avc1.420016",
      "avc1.42001e",
      "avc1.42001f",
      "avc1.420020",
      "avc1.420028",
      "avc1.420029",
      "avc1.42002a",
      "avc1.420032",
      "avc1.420033",
      "avc1.420034",
      "avc1.42400a",
      "avc1.42400b",
      "avc1.42400c",
      "avc1.42400d",
      "avc1.424014",
      "avc1.424015",
      "avc1.424016",
      "avc1.42401e",
      "avc1.42401f",
      "avc1.424020",
      "avc1.424028",
      "avc1.424029",
      "avc1.42402a",
      "avc1.424032",
      "avc1.424033",
      "avc1.424034",
      "avc1.4d000a",
      "avc1.4d000b",
      "avc1.4d000c",
      "avc1.4d000d",
      "avc1.4d0014",
      "avc1.4d0015",
      "avc1.4d0016",
      "avc1.4d001e",
      "avc1.4d001f",
      "avc1.4d0020",
      "avc1.4d0028",
      "avc1.4d0029",
      "avc1.4d002a",
      "avc1.4d0032",
      "avc1.4d0033",
      "avc1.4d0034",
      "avc1.4d400a",
      "avc1.4d400b",
      "avc1.4d400c",
      "avc1.4d400d",
      "avc1.4d4014",
      "avc1.4d4015",
      "avc1.4d4016",
      "avc1.4d401e",
      "avc1.4d401f",
      "avc1.4d4020",
      "avc1.4d4028",
      "avc1.4d4029",
      "avc1.4d402a",
      "avc1.4d4032",
      "avc1.4d4033",
      "avc1.4d4034",
      "avc1.58000a",
      "avc1.58000b",
      "avc1.58000c",
      "avc1.58000d",
      "avc1.580014",
      "avc1.580015",
      "avc1.580016",
      "avc1.58001e",
      "avc1.58001f",
      "avc1.580020",
      "avc1.580028",
      "avc1.580029",
      "avc1.58002a",
      "avc1.580032",
      "avc1.580033",
      "avc1.580034",
      "avc1.64000a",
      "avc1.64000b",
      "avc1.64000c",
      "avc1.64000d",
      "avc1.640014",
      "avc1.640015",
      "avc1.640016",
      "avc1.64001e",
      "avc1.64001f",
      "avc1.640020",
      "avc1.640028",
      "avc1.640029",
      "avc1.64002a",
      "avc1.640032",
      "avc1.640033",
      "avc1.640034",
      "avc1.64080a",
      "avc1.64080b",
      "avc1.64080c",
      "avc1.64080d",
      "avc1.640814",
      "avc1.640815",
      "avc1.640816",
      "avc1.64081e",
      "avc1.64081f",
      "avc1.640820",
      "avc1.640828",
      "avc1.640829",
      "avc1.64082a",
      "avc1.640832",
      "avc1.640833",
      "avc1.640834",
      "avc1.6e000a",
      "avc1.6e000b",
      "avc1.6e000c",
      "avc1.6e000d",
      "avc1.6e0014",
      "avc1.6e0015",
      "avc1.6e0016",
      "avc1.6e001e",
      "avc1.6e001f",
      "avc1.6e0020",
      "avc1.6e0028",
      "avc1.6e0029",
      "avc1.6e002a",
      "avc1.6e0032",
      "avc1.6e0033",
      "avc1.6e0034",
      "avc1.6e100a",
      "avc1.6e100b",
      "avc1.6e100c",
      "avc1.6e100d",
      "avc1.6e1014",
      "avc1.6e1015",
      "avc1.6e1016",
      "avc1.6e101e",
      "avc1.6e101f",
      "avc1.6e1020",
      "avc1.6e1028",
      "avc1.6e1029",
      "avc1.6e102a",
      "avc1.6e1032",
      "avc1.6e1033",
      "avc1.6e1034",
      "avc1.7a000a",
      "avc1.7a000b",
      "avc1.7a000c",
      "avc1.7a000d",
      "avc1.7a0014",
      "avc1.7a0015",
      "avc1.7a0016",
      "avc1.7a001e",
      "avc1.7a001f",
      "avc1.7a0020",
      "avc1.7a0028",
      "avc1.7a0029",
      "avc1.7a002a",
      "avc1.7a0032",
      "avc1.7a0033",
      "avc1.7a0034",
      "avc1.7a100a",
      "avc1.7a100b",
      "avc1.7a100c",
      "avc1.7a100d",
      "avc1.7a1014",
      "avc1.7a1015",
      "avc1.7a1016",
      "avc1.7a101e",
      "avc1.7a101f",
      "avc1.7a1020",
      "avc1.7a1028",
      "avc1.7a1029",
      "avc1.7a102a",
      "avc1.7a1032",
      "avc1.7a1033",
      "avc1.7a1034",
      "avc1.f4000a",
      "avc1.f4000b",
      "avc1.f4000c",
      "avc1.f4000d",
      "avc1.f40014",
      "avc1.f40015",
      "avc1.f40016",
      "avc1.f4001e",
      "avc1.f4001f",
      "avc1.f40020",
      "avc1.f40028",
      "avc1.f40029",
      "avc1.f4002a",
      "avc1.f40032",
      "avc1.f40033",
      "avc1.f40034",
      "avc1.f4100a",
      "avc1.f4100b",
      "avc1.f4100c",
      "avc1.f4100d",
      "avc1.f41014",
      "avc1.f41015",
      "avc1.f41016",
      "avc1.f4101e",
      "avc1.f4101f",
      "avc1.f41020",
      "avc1.f41028",
      "avc1.f41029",
      "avc1.f4102a",
      "avc1.f41032",
      "avc1.f41033",
      "avc1.f41034",
      "avc1.2c000a",
      "avc1.2c000b",
      "avc1.2c000c",
      "avc1.2c000d",
      "avc1.2c0014",
      "avc1.2c0015",
      "avc1.2c0016",
      "avc1.2c001e",
      "avc1.2c001f",
      "avc1.2c0020",
      "avc1.2c0028",
      "avc1.2c0029",
      "avc1.2c002a",
      "avc1.2c0032",
      "avc1.2c0033",
      "avc1.2c0034",

      "av01.0.08H.10",
      "hev1.1.6.L93.B0",
      "hev1.2.4.L120.B0",

      "avc1.4d400b",
      "mp4v.20.3",
      "avc1.42001E, mp4a.40.2",
      "avc1.64001F, mp4a.40.2",
      "vp9.2",

      "av99.0.05M.08",
      "ec-3",

      "ac-3",

    ].map(testCodec)).then(() => {

      try {
        localStorage[storageKey] = JSON.stringify(Object.fromEntries(__codecs__.entries()));
      } catch (e) { }

      console.log('[yt-codecs-hardware-acceleration-only] (init) check done')
    }).catch(console.warn);
  }

  const supportedFormatsConfig = () => {

    function typeTest(type) {

      if (typeof type === 'string' && type.startsWith('video/')) {
        if (useAV1) {
          if (type.includes('av01')) {
            if (/codecs[\x20-\x7F]+\bav01\b/.test(type)) return true;
          } else if (type.includes('av1')) {
            if (/codecs[\x20-\x7F]+\bav1\b/.test(type)) return true;
          }
        }
      }

    }

    // return a custom MIME type checker that can defer to the original function
    function makeModifiedTypeChecker(origChecker, dx) {
      // Check if a video type is allowed
      return function (type) {

        let m;
        if (m = /codecs="([^"\r\n]*?)"/.exec(type)) {

          const codec = m[1];
          const codecRes = getCodecResult(codec);

          if (codecRes === false) return "";

          if (codecRes === undefined) {

            testCodec(codec);

            console.warn('[yt-codecs-hardware-acceleration-only] new format', type)

          }

        }

        let res = undefined;
        if (type === undefined) res = false;
        else res = typeTest(type);
        if (res === undefined) res = origChecker.apply(this, arguments);
        else res = !dx ? res : (res ? "probably" : "");

        // console.debug(20, type, res)

        return res;
      };
    }

    // Override video element canPlayType() function
    const proto = (HTMLVideoElement || 0).prototype;
    if (proto && typeof proto.canPlayType == 'function') {
      proto.canPlayType = makeModifiedTypeChecker(proto.canPlayType, true);
    }

    // Override media source extension isTypeSupported() function
    const mse = window.MediaSource;
    // Check for MSE support before use
    if (mse && typeof mse.isTypeSupported == 'function') {
      mse.isTypeSupported = makeModifiedTypeChecker(mse.isTypeSupported);
    }


  }

  function enableAV1() {
    // This is the setting to force AV1
    // localStorage['yt-player-av1-pref'] = '8192';
    try {
      Object.defineProperty(localStorage.constructor.prototype, 'yt-player-av1-pref', {
        get() {
          if (this === localStorage) return '8192';
          return this.getItem('yt-player-av1-pref');
        },
        set(nv) {
          this.setItem('yt-player-av1-pref', nv);
          return true;
        },
        enumerable: true,
        configurable: true
      });
    } catch (e) {
      // localStorage['yt-player-av1-pref'] = '8192';
    }
    if (localStorage['yt-player-av1-pref'] !== '8192') {
      console.warn('Use YouTube AV1 is not supported in your browser.');
      return;
    }
    useAV1 = true;
  }

  let promise = null;

  try {
    promise = navigator.mediaCapabilities.decodingInfo({
      type: "file",
      video: {
        contentType: "video/mp4; codecs=av01.0.05M.08.0.110.05.01.06.0",
        height: 1080,
        width: 1920,
        framerate: 30,
        bitrate: 2826848,
      },
      audio: {
        contentType: "audio/webm; codecs=opus",
        channels: "2.1",
        samplerate: 44100,
        bitrate: 255236,
      }
    });
  } catch (e) {
    promise = null;
  }

  const msgAV1NotSupported = 'Your browser does not support AV1. You might conside to use the latest version of Google Chrome or Mozilla FireFox.';

  const callback = (result) => {
    if (result && result.supported && result.smooth) enableAV1();
    else {
      console.warn("yt-codecs-hardware-acceleration-only", msgAV1NotSupported);
    }
  };

  (promise || Promise.resolve(0)).catch(callback).then(callback);

  supportedFormatsConfig();

})(Promise);
