// ==UserScript==
// @name            Disable YouTube Autoplay
// @description     Keeps checking if autoplay got enabled by itself and disables it. This stops YouTube from forcing you to watch some random video next after the one you're currently watching ends, even if you disabled autoplay.
// @namespace       https://github.com/tadwohlrapp
// @author          Tad Wohlrapp
// @version         0.2.0
// @license         MIT
// @homepageURL     https://github.com/tadwohlrapp/disable-youtube-autoplay
// @supportURL      https://github.com/tadwohlrapp/disable-youtube-autoplay/issues
// @icon            https://github.com/tadwohlrapp/disable-youtube-autoplay/raw/main/icon.png
// @match           https://www.youtube.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/483523/Disable%20YouTube%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/483523/Disable%20YouTube%20Autoplay.meta.js
// ==/UserScript==

let counter
const autoplayButton = () => document.querySelector('.ytp-autonav-toggle-button')

const initializeAutoplayDisabler = () => {
  if (!location.pathname.startsWith('/watch')) return
  if (!autoplayButton()) { return setTimeout(() => { initializeAutoplayDisabler() }, 1000) }
  counter = 0
  console.info('[Disable YouTube Autoplay]: Video detected. Autoplay deactivation counter: 0')
  autoplayButton().dataset.counter = '⏸'
  fightAutoplay()
}

const fightAutoplay = () => {
  setTimeout(() => {
    if (autoplayButton().getAttribute('aria-checked') === 'true') {
      autoplayButton().click()
      counter++
      autoplayButton().dataset.counter = counter
      console.info(`[Disable YouTube Autoplay]: Autoplay deactivation counter: ${counter} (${new Date().toLocaleTimeString()})`)
    }
    fightAutoplay()
  }, 500)
}

const addGlobalStyle = (css) => {
  const head = document.getElementsByTagName('head')[0]
  if (!head) return
  const style = document.createElement('style')
  style.innerHTML = css
  head.appendChild(style)
}

(() => {
  'use strict'
  window.addEventListener('yt-navigate-finish', initializeAutoplayDisabler, true)
  initializeAutoplayDisabler()
  addGlobalStyle(`
    .ytp-autonav-toggle-button[aria-checked=false]:after {
      content: attr(data-counter);
      line-height: 20.4px;
      text-align: center;
      font-size: 12px;
      font-weight:700;
      background-color: #666;
      background-image: none;
    }
    .ytp-autonav-toggle-button[aria-checked=true]:after {
      content: "";
    }
    .ytp-big-mode .ytp-autonav-toggle-button[aria-checked=false]:after {
      line-height: 25.5px;
      font-size: 14px;
    }
  `)

})()
