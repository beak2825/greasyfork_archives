// ==UserScript==
// @name        Remove youtube pause more videos
// @author	i.alba
// @description Remove youtube pause more videos.
// @match  https://www.youtube-nocookie.com/*
// @version 0.0.1
// @license MIT
// @namespace https://greasyfork.org/users/429053
// @downloadURL https://update.greasyfork.org/scripts/502402/Remove%20youtube%20pause%20more%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/502402/Remove%20youtube%20pause%20more%20videos.meta.js
// ==/UserScript==

function sleep(ms) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, ms)
  })
}

async function checkPauseEl() {
  let count = 20
  while (count > 0) {
    count--
    const el = document.querySelector(".ytp-pause-overlay-container")
    console.log("Check pause el")
    if (el) {
      count = 0
      console.log("Remove pause el")
      el.parentElement.removeChild(el)
    }
    await sleep(1000)
  }
}

checkPauseEl()

