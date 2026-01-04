// ==UserScript==
// @name        Hide YouTube Fullscreen Scrollbar
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.0
// @author      tikhiy
// @description 4/30/2022, 4:15:01 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453095/Hide%20YouTube%20Fullscreen%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/453095/Hide%20YouTube%20Fullscreen%20Scrollbar.meta.js
// ==/UserScript==

const isFullscreen = () => {
  return document.fullscreenElement !== null
}

/**
 * @type {(callback: () => void) => () => void}
 */
const throttleAnimationFrame = (callback) => {
  let handle = null

  return () => {
    if (handle) {
      cancelAnimationFrame(handle)
    }

    handle = requestAnimationFrame(callback)
  }
}

const onFullscreenChange = () => {
  if (!isFullscreen()) {
    return
  }

  const app = document.querySelector("ytd-app")

  if (!app) {
    return
  }

  const currentValue = parseFloat(app.style.getPropertyValue('--ytd-app-fullerscreen-scrollbar-width'))

  if (Number.isFinite(currentValue) && currentValue > 0) {
    return
  }

  const scrollbarWidth = window.innerWidth - app.clientWidth

  app.style.setProperty("--ytd-app-fullerscreen-scrollbar-width", `${scrollbarWidth}px`)
}

document.addEventListener("fullscreenchange", throttleAnimationFrame(onFullscreenChange))