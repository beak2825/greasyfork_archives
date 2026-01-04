// ==UserScript==
// @name        Youtube position saver
// @version     2.0.0
// @namespace   http://www.agj.cl/
// @description Periodically records the current playing time while you watch videos, so you don't lose track of where you were watching.
// @license     Unlicense
// @match       *://*.youtube.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/427540/Youtube%20position%20saver.user.js
// @updateURL https://update.greasyfork.org/scripts/427540/Youtube%20position%20saver.meta.js
// ==/UserScript==

// Configuration

const saveIntervalSeconds = 10;
const previewSeconds = 5;

// Utilities

const onLoad = (cb) =>
  /interactive|complete/.test(document.readyState)
    ? setTimeout(cb, 0)
    : document.addEventListener("DOMContentLoaded", cb, { once: true });
const getVideo = () => document.querySelector("video.html5-main-video");
const getTimeToSave = (seconds) =>
  Math.max(0, Math.floor(seconds - previewSeconds));

// Position saving

onLoad(() => {
  let video;

  const saveTime = () => {
    if (!video || !video.document) {
      video = getVideo();
      if (!video) return;
      video.addEventListener("seeked", saveTime);
    }
    const seconds = video.currentTime;
    const url = new URL(location);
    url.searchParams.set("t", getTimeToSave(seconds).toString() + "s");
    history.replaceState(history.state, document.title, url.toString());
  };

  setInterval(saveTime, saveIntervalSeconds * 1000);
});
