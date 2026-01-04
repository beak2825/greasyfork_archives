// ==UserScript==
// @name           Niconico position saver
// @name:ja        ニコニコ動画 再生位置保存
// @version        1.0.0
// @namespace      http://www.agj.cl/
// @description    Periodically records the current playing time while you watch videos, so you don't lose track of where you were watching.
// @description:ja 定期的に保存されるため、再読み込みしても再生位置がリセットされません。
// @license        Unlicense
// @match          *://*.nicovideo.jp/watch/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/428534/Niconico%20position%20saver.user.js
// @updateURL https://update.greasyfork.org/scripts/428534/Niconico%20position%20saver.meta.js
// ==/UserScript==

// Configuration

const saveIntervalSeconds = 10;
const previewSeconds = 5;

// Utilities

const onLoad = (cb) =>
  /interactive|complete/.test(document.readyState)
    ? setTimeout(cb, 0)
    : document.addEventListener("DOMContentLoaded", cb, { once: true });
const getVideo = () => document.querySelector("#MainVideoPlayer video");
const getTimeToSave = (seconds) =>
  Math.max(0, Math.floor(seconds - previewSeconds));

onLoad(() => {
  // Position saving

  let video;

  const saveTime = () => {
    if (!video || !video.document) {
      video = getVideo();
      if (!video) return;
      video.addEventListener("seeked", saveTime);
    }
    const seconds = video.currentTime;
    const url = new URL(location);
    url.searchParams.set("from", getTimeToSave(seconds).toString());
    history.replaceState(history.state, document.title, url.toString());
  };

  setInterval(saveTime, saveIntervalSeconds * 1000);
});
