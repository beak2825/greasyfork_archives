// ==UserScript==
// @name               Auto Change Youtube Video Resolution to Max
// @name:zh-TW         Auto Change Youtube Video Resolution to Max
// @namespace          https://greasyfork.org/scripts/453854
// @version            1.1.1
// @description        auto change the video resolution to Max
// @description:zh-TW  自動將影片畫質切換至最高畫質
// @author             Derek
// @match              *://www.youtube.com/*
// @grant              none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/453854/Auto%20Change%20Youtube%20Video%20Resolution%20to%20Max.user.js
// @updateURL https://update.greasyfork.org/scripts/453854/Auto%20Change%20Youtube%20Video%20Resolution%20to%20Max.meta.js
// ==/UserScript==

const $ = (element) => document.querySelector(element)

const main = () => {
  if (window.location.href.includes('/watch?v=')) {
    const observer = new MutationObserver(() => {
      const moviePlayer = $('#movie_player')
      if (moviePlayer) {
        const maxRes = moviePlayer.getAvailableQualityLevels()[0]
        moviePlayer.setPlaybackQualityRange(maxRes)
        observer.disconnect()
      }
    })
    observer.observe(document.body, { attributes: false, childList: true, subtree: true })
  }
}

document.addEventListener('yt-navigate-finish', main)
