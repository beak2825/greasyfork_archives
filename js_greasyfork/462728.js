// ==UserScript==
// @name     Share YouTube video at current time with [S]
// @version  1
// @description Press [S] (customizable) to automatically copy a link to the clipboard with a URL at the current playback position.
// @license  MIT
// @namespace network47
// @grant    none
// @match    *://www.youtube.com/*
// @run-at   document-end
// @downloadURL https://update.greasyfork.org/scripts/462728/Share%20YouTube%20video%20at%20current%20time%20with%20%5BS%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/462728/Share%20YouTube%20video%20at%20current%20time%20with%20%5BS%5D.meta.js
// ==/UserScript==

const PATH_BTN_SHARE =
  "[aria-label='Share'] .yt-spec-touch-feedback-shape--touch-response";
const PATH_BTN_SHARE_COPY = "[aria-label='Copy'] .yt-spec-touch-feedback-shape";
const PATH_BTN_SHARE_CLOSE = "#close-button";
const KEYCODE = 83; // 's'
const DELAY_SHARE_OPEN = 1000;

function triggerShareAtTime() {
  console.debug("Start copy");
  // click the "Share" button
  document.querySelector(PATH_BTN_SHARE).click();
  setTimeout(() => {
    // click the Start at option, it should be set to our current play head position by default
    document.querySelector("#start-at tp-yt-paper-checkbox").click();

    // click the "Copy" button
    document.querySelector(PATH_BTN_SHARE_COPY).click();

    document.querySelector(PATH_BTN_SHARE_CLOSE).click();
    console.debug("Copy complete");
  }, DELAY_SHARE_OPEN);
}

const boot = () => {
  document.querySelector("body").addEventListener("keydown", (ev) => {
    console.debug(ev.keyCode);
    if (ev.keyCode == KEYCODE) triggerShareAtTime();
  });
  console.debug("GM: Share at current time with [S]");
};

boot();
