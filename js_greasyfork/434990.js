// ==UserScript==
// @name         YouTube Always show progress bar - Forked
// @version      2025.10.30
// @author       Xiao
// @match        *://www.youtube.com/*
// @allFrames    true
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/5802
// @description Always show progress bar
// @downloadURL https://update.greasyfork.org/scripts/434990/YouTube%20Always%20show%20progress%20bar%20-%20Forked.user.js
// @updateURL https://update.greasyfork.org/scripts/434990/YouTube%20Always%20show%20progress%20bar%20-%20Forked.meta.js
// ==/UserScript==

//original: https://greasyfork.org/en/scripts/30046-youtube-always-show-progress-bar

let css = `
  .ytp-autohide .ytp-chrome-bottom[alwaysshow="true"] {
    opacity: 1 !important;
  }

  .ytp-autohide .ytp-chrome-bottom[alwaysshow="true"] .ytp-progress-bar-container {
    bottom: -1px !important;
  }

  .ytp-autohide .ytp-chrome-bottom[alwaysshow="true"] > .ytp-chrome-controls,
  .ytp-autohide .ytp-chrome-bottom[alwaysshow="true"] .ytp-scrubber-container {
    display: none;
  }
`;

let style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

let eventHandlers = [];

let timeupdateListener;
let progressListener;
let video;

setTimeout(run, 2000);

function isFinished() {
  video = document.querySelector('video');
  if (video) {
    eventHandlers[0]?.removeEventListener('timeupdate', eventHandlers[1]);
    eventHandlers[0]?.removeEventListener('progress', eventHandlers[2]);
    setTimeout(run, 2000);
  } else if (location.pathname === '/watch') {
    setTimeout(isFinished, 1000);
  }
}

addEventListener('yt-navigate-finish', isFinished);

function run () {
  if (document.querySelector('#movie_player.ad-showing')) {
    setTimeout(run, 2000);
    return;
  }

  video = document.querySelector('video');
  if (!document.querySelector('#movie_player.playing-mode') && !document.querySelector('.html5-video-player:not(.addedupdateevents)'))
    return;

  let ytdApp = unsafeWindow.document.querySelector('ytd-app');

  let chap, isLive;
  if (ytdApp) {
    let data = ytdApp.__data.data.response;
    chap = data.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer.playerBar?.multiMarkersPlayerBarRenderer.markersMap?.find(exportFunction(a => a.key == 'AUTO_CHAPTERS' || a.key == 'DESCRIPTION_CHAPTERS', unsafeWindow)).value.chapters;
    isLive = data.contents.twoColumnWatchNextResults.results.results.contents[0].videoPrimaryInfoRenderer.viewCount.videoViewCountRenderer?.isLive;
  } else {
    let data = Object.values(unsafeWindow.ytPubsubPubsubInstance.h[33].player.app.mediaElement).find(a => a?.videoData).videoData;
    chap = Object.values(data).find(a => a?.playerOverlays).playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer.playerBar?.multiMarkersPlayerBarRenderer.markersMap?.find(exportFunction(a => a.key == 'AUTO_CHAPTERS' || a.key == 'DESCRIPTION_CHAPTERS', unsafeWindow)).value.chapters;
    isLive = data.isLivePlayback;
  }

  document.querySelector('.ytp-chrome-bottom').setAttribute('alwaysshow', !isLive);

  video.className += ' addedupdateevents';
  let player = document.getElementById('movie_player');
  let progressbars = document.querySelectorAll('.ytp-play-progress');
  let loadbars = document.querySelectorAll('.ytp-load-progress');

  if (chap?.length) {
    let chars = [];
    let cap;
    let capstart;
    let capduration;
    let lastusedcapprog;
    let lastusedcapbuf;

    for (let i = 0; i < chap.length; i++) {
      chars.push(chap[i].chapterRenderer.timeRangeStartMillis / 1000);
    }

    timeupdateListener = () => {
      if (!player.classList.contains('ytp-autohide'))
        return;

      for (let i = 0; i < chars.length; i++) {
        let ts = chars[i];
        if (ts < video.currentTime  || !capduration) {
          cap = i;
          capstart = ts;
          capduration = ((chars[i + 1] ? chars[i + 1] : video.duration) - ts);
        } else {
          break;
        }
      }

      if (cap > lastusedcapprog)
        progressbars[lastusedcapprog].style.transform = 'scaleX(1)';

      lastusedcapprog = cap;

      progressbars[cap].style.transform = 'scaleX(' + ((video.currentTime - capstart) / capduration) + ')';
    };
    video.addEventListener('timeupdate', timeupdateListener);

    progressListener = () => {
      if (!player.classList.contains('ytp-autohide') || !video.buffered.length)
        return;

      let buff = video.buffered.end(video.buffered.length - 1);

      for (let i = 0; i < chars.length; i++) {
        let ts = chars[i];
        if (ts < buff  || !capduration) {
          cap = i;
          capstart = ts;
          capduration = ((chars[i + 1] ? chars[i + 1] : video.duration) - ts);
        } else {
          break;
        }
      }

      if (cap > lastusedcapbuf)
        loadbars[lastusedcapbuf].style.transform = 'scaleX(1)';

      lastusedcapbuf = cap;

      loadbars[cap].style.transform = 'scaleX(' + ((buff - capstart) / capduration) + ')';
    };
    video.addEventListener('progress', progressListener);
    eventHandlers = [video, timeupdateListener, progressListener];
  } else {
    timeupdateListener = function () {
      if (player.classList.contains('ytp-autohide'))
        progressbars[0].style.transform = 'scaleX(' + (video.currentTime / video.duration) + ')';
    };
    video.addEventListener('timeupdate', timeupdateListener);

    progressListener = function () {
      if (player.classList.contains('ytp-autohide') && video.buffered.length)
        loadbars[0].style.transform = 'scaleX(' + (video.buffered.end(video.buffered.length - 1) / video.duration) + ')';
    };
    video.addEventListener('progress', progressListener);
    eventHandlers = [video, timeupdateListener, progressListener];
  }
}