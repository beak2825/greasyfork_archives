// ==UserScript==
// @name               Auto Pause Youtube Channel Homepage Video
// @name:zh-TW         Auto Pause Youtube Channel Homepage Video
// @namespace          https://greasyfork.org/scripts/453851
// @version            1.1.2
// @description        auto pause the channel homepage video
// @description:zh-TW  自動暫停Youtube頻道首頁的影片
// @author             Derek
// @match              *://www.youtube.com/*
// @grant              none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/453851/Auto%20Pause%20Youtube%20Channel%20Homepage%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/453851/Auto%20Pause%20Youtube%20Channel%20Homepage%20Video.meta.js
// ==/UserScript==

const $ = (element) => document.querySelector(element)

const main = () => {
  if (/\/(@|channel|user|c)/.test(window.location.pathname)) {
    const observer = new MutationObserver(() => {
      const moviePlayer = $('ytd-browse video')
      if (moviePlayer && !moviePlayer.paused) {
        moviePlayer.pause()
        observer.disconnect()
      }
    })
    observer.observe(document.body, { attributes: false, childList: true, subtree: true })
  }
}

document.addEventListener('yt-navigate-finish', main)
