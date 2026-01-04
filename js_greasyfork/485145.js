// ==UserScript==
// @name         BAMBIENT
// @version      1.1.3
// @description  Bilibili Ambient Mode
// @author       jamesliu96
// @license      MIT
// @namespace    https://jamesliu.info/
// @homepage     https://gist.github.com/jamesliu96/03775eba64ff6b26efd6ee2676354f52
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @connect      bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/485145/BAMBIENT.user.js
// @updateURL https://update.greasyfork.org/scripts/485145/BAMBIENT.meta.js
// ==/UserScript==

const BLUR_RADIUS = 48; // px

const DURATION = 5000; // ms
const DELAY = 0; // ms
const RETRY_DURATION = 1000; // ms

/** @param {number} t */
const sleep = (t) => new Promise((r) => setTimeout(r, t));

/** @param {string} name */
const safeGet = (name) => {
  // eslint-disable-next-line no-undef
  if (!player || !(name in player)) return;
  // eslint-disable-next-line no-undef
  return player[name];
};

/** @param {string} name */
const safeInvoke = (name, ...args) => {
  try {
    const x = safeGet(name);
    if (typeof x === 'function') return x(...args);
  } catch {}
};

const safeGetVideo = () => {
  const v = safeInvoke('mediaElement');
  if (v instanceof HTMLVideoElement) return v;
};

/**
 * @param {HTMLElement} startExc
 * @param {HTMLElement|null|undefined} endInc
 */
const cleanse = (startExc, endInc) => {
  for (
    let cur = startExc.parentElement;
    cur && cur.parentElement !== endInc;
    cur = cur.parentElement
  ) {
    const cs = getComputedStyle(cur);
    if (cs.getPropertyValue('box-shadow') !== 'none') {
      cur.style.setProperty('box-shadow', 'none', 'important');
    }
    if (cs.getPropertyValue('overflow') !== 'visible') {
      cur.style.setProperty('overflow', 'visible', 'important');
    }
  }
};

/** @param {HTMLVideoElement} video */
const snapshot = async (video) => {
  const url = await safeInvoke('readFrameAsDataURL');
  if (typeof url === 'string' && url !== 'data:,') return url;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
};

addEventListener('load', async () => {
  for (;;) {
    /** @type {HTMLElement|null} */
    const videoPlayer =
      document.querySelector('#bilibili-player') ??
      document.querySelector('#live-player');
    const video = safeGetVideo() ?? videoPlayer?.querySelector('video');
    if (
      !(videoPlayer instanceof HTMLElement) ||
      !(video instanceof HTMLVideoElement)
    ) {
      await sleep(RETRY_DURATION);
      continue;
    }
    /** @type {HTMLElement|null} */
    let bambient = videoPlayer.querySelector('#bambient');
    if (!(bambient instanceof HTMLElement)) {
      bambient = document.createElement('div');
      videoPlayer.prepend(bambient);
      bambient.id = 'bambient';
      bambient.style.userSelect = 'none';
      bambient.style.pointerEvents = 'none';
      bambient.style.position = 'absolute';
      bambient.style.top =
        bambient.style.right =
        bambient.style.bottom =
        bambient.style.left =
          '0px';
      bambient.style.filter = `blur(${BLUR_RADIUS}px)`;
    }
    safeInvoke('setBlackGap', false);
    cleanse(bambient, videoPlayer);
    /** @type {HTMLElement|null} */
    const sendingArea = videoPlayer.querySelector('.bpx-player-sending-area');
    bambient.style.marginBottom = `${sendingArea?.offsetHeight ?? 0}px`;
    /** @type {[HTMLImageElement|undefined,HTMLImageElement|undefined]} */
    let [cinematic0, cinematic1] = bambient.children;
    if (
      !(cinematic0 instanceof HTMLImageElement) ||
      !(cinematic1 instanceof HTMLImageElement)
    ) {
      [cinematic0, cinematic1] = [new Image(), new Image()];
      bambient.replaceChildren(cinematic0, cinematic1);
      cinematic0.style.position = cinematic1.style.position = 'absolute';
      cinematic0.style.width =
        cinematic0.style.height =
        cinematic1.style.width =
        cinematic1.style.height =
          '100%';
      cinematic0.style.objectFit = cinematic1.style.objectFit = 'contain';
      cinematic1.style.transition = `opacity ${DURATION}ms`;
    }
    if (!cinematic0.src || !cinematic1.src) {
      cinematic0.src = cinematic1.src = await snapshot(video);
    } else {
      if (cinematic1.style.opacity === '0') {
        cinematic1.src = await snapshot(video);
        cinematic1.style.opacity = '1';
      } else {
        cinematic0.src = await snapshot(video);
        cinematic1.style.opacity = '0';
      }
    }
    await sleep(DURATION + DELAY);
  }
});
