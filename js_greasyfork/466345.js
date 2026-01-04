// ==UserScript==
// @name          Stick YouTube Progress Bar
// @version       1.0.13
// @match         https://www.youtube.com/**
// @author        peng-devs
// @namespace     https://greasyfork.org/users/57176
// @description   Stick YouTube video progress bar to the player bottom
// @icon          https://www.youtube.com/s/desktop/c1d331ff/img/favicon_48x48.png
// @grant         none
// @allFrames     true
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/466345/Stick%20YouTube%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/466345/Stick%20YouTube%20Progress%20Bar.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const NAME = "Stick YouTube Progress Bar";
  const UPDATE_INTERVAL = 500;
  const SMOOTH_ANIMATION = false;

  let observer;
  let internal;

  function main() {
    if (observer || internal) {
      console.log(`[${NAME}] cleaning prev states`)
      observer?.disconnect();
      clearInterval(internal);
      observer = undefined;
      internal = undefined;
    }

    if (!location.pathname.startsWith('/watch') &&
       !location.pathname.startsWith('/live'))
      return;

    observer = observe(document.body, () => {
      if (!observer) return;

      // 判斷 youtube player 初始化完了沒
      const intitailized = document.querySelector("video.video-stream");
      if (!intitailized) return;

      // 如果是直播的話就跳過
      const live_badge = document.querySelector(".ytp-live-badge");
      if (live_badge && getComputedStyle(live_badge).display !== 'none') {
        // 直接砍掉，懶得再做一個 hide/show 判斷
        document.getElementById('stick_progress')?.remove();
        observer.disconnect();
        console.log(`[${NAME}] cancaled in livestream`);
        return;
      }

      console.log(`[${NAME}] initializing...`);

      init_stick_progress_bar();

      observer.disconnect();
      console.log(`[${NAME}] loaded`);
    });
  }

  function init_stick_progress_bar() {
    const { container, progress_bar, buffer_bar } = create_progress_bar();

    const player = document.querySelector("#movie_player");
    player.append(container);

    let video = document.querySelector("video.video-stream");
    internal = setInterval(() => {
      if (!video.getAttribute('src')) {
        // youtube 有時候會抽風把頁面重新 re-render
        console.debug(`[${NAME}] detect page re-render, reset video`);
        video = document.querySelector("video.video-stream");
      }

      const progress = video.currentTime / video.duration;
      progress_bar.style.transform = `scaleX(${progress})`;

      if (video.buffered.length > 0 && video.duration > 0) {
        const buffer_progress = video.buffered.end(0) / video.duration;
        buffer_bar.style.transform = `scaleX(${buffer_progress})`;
      }
    }, UPDATE_INTERVAL);
  }

  function create_progress_bar() {
    // 已經建好的可以重複利用
    let container = document.getElementById('stick_progress');
    if (container) {
      const progress_bar = container.querySelector('.stick_progress_bar');
      const buffer_bar = container.querySelector('.stick_buffer_bar');

      progress_bar.style.transform = `scaleX(0)`;
      buffer_bar.style.transform = `scaleX(0)`;

      return {
        container,
        progress_bar,
        buffer_bar,
      };
    }

    inject_custom_style(`

      #stick_progress {
        display: none;
        z-index: 32;
        position: absolute;
        bottom: 4px;
        width: 97.5%;
        height: 4px;
        margin: 0 1.25%;
        background-color: rgba(255, 255, 255, .2);
      }

      .stick_progress_bar, .stick_buffer_bar {
        position: absolute;
        width: 100%;
        height: 100%;

        transform-origin: left;
        transform: scaleX(0);
        ${SMOOTH_ANIMATION ? `transition: all ${UPDATE_INTERVAL - 50}ms linear;` : ''}
      }

      .stick_buffer_bar {
        z-index: 33;
        background-color: rgba(255, 255, 255, .4);
      }

      .stick_progress_bar {
        z-index: 34;
        background-color: #f00;
      }

      .ytp-autohide #stick_progress {
        display: block;
      }
    `);

    container = document.createElement("div");
    container.id = "stick_progress";

    const progress_bar = document.createElement("div");
    progress_bar.className = "stick_progress_bar";
    container.append(progress_bar);

    const buffer_bar = document.createElement("div");
    buffer_bar.className = "stick_buffer_bar";
    container.append(buffer_bar);

    return {
      container,
      progress_bar,
      buffer_bar,
    };
  }

  function inject_custom_style(css) {
    const style = document.createElement("style");
    document.head.append(style);
    style.dataset.source = NAME;
    style.innerHTML = css;
  }

  function observe(dom, callback) {
    const observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true, subtree: true });
    return observer;
  }

  document.addEventListener('yt-navigate-finish', main, true);

})();

