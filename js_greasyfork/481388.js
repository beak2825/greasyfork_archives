// ==UserScript==
// @name        YouTube Video Resumer
// @namespace   https://greasyfork.org/en/users/34131-velc-gf
// @version     2.0.0
// @author      Velarde, Louie C.
// @description Resumes videos from where you left off
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?domain=www.youtube.com&sz=64
// @license     LGPL-3.0
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/481388/YouTube%20Video%20Resumer.user.js
// @updateURL https://update.greasyfork.org/scripts/481388/YouTube%20Video%20Resumer.meta.js
// ==/UserScript==

function getVideoId() {
  return new URLSearchParams(window.location.search).get('v');
}

function restoreTime(event) {
  let video = event.target;
  video.pause();

  let id = getVideoId();
  if (id === null) return;

  if (window.location.search.includes('&t=')) {
    let url = new URL(window.location.href);
    url.searchParams.delete('t');
    window.history.replaceState(null, null, url);

  } else if (video.duration > 10) {
    video.currentTime = GM_getValue(`v_${id}`, {}).video_time || 0;
  }
}

function saveTime(event) {
  let video = event.target;

  let id = getVideoId();
  let time = video.currentTime;
  if (id === null || time === 0) return;

  if (5 < time && time < video.duration - 5) {
    GM_setValue(`v_${id}`, { entry_time: new Date().getTime() / 1000, video_time: time});
  } else {
    GM_deleteValue(`v_${id}`);
  }
}

function attachListeners() {
  let video = document.querySelector('#movie_player video');
  if (video) {
    window.removeEventListener('yt-navigate-finish', attachListeners);
    video.addEventListener('loadeddata', restoreTime, { passive: true });
    video.addEventListener('timeupdate', saveTime, { passive: true });
  }
}

let expirationTime = new Date().getTime() / 1000 - 30 * 24 * 60 * 60;

for (let key in GM_listValues()) {
  if (GM_getValue(key, {}).entry_time < expirationTime) {
    GM_deleteValue(key);
  }
}

window.addEventListener('yt-navigate-finish', attachListeners);