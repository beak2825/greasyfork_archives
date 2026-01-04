// ==UserScript==
// @name        SoundCloud Restore Playback
// @description Saves/restores playback position on SoundCloud (only for tracks longer than 5 minutes)
// @namespace   https://github.com/crabvk
// @version     0.4.1
// @author      Vyacheslav Konovalov
// @match       https://soundcloud.com/*
// @license     MIT
// @noframes
// @run-at      document-idle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @homepageURL https://github.com/crabvk/userscripts
// @downloadURL https://update.greasyfork.org/scripts/405554/SoundCloud%20Restore%20Playback.user.js
// @updateURL https://update.greasyfork.org/scripts/405554/SoundCloud%20Restore%20Playback.meta.js
// ==/UserScript==

const getKey = (player) =>
  player.querySelector('.playbackSoundBadge__titleLink').getAttribute('href')

const getTimeline = (player) => player.querySelector('.playbackTimeline__progressWrapper')

/**
 * Clicks on the timeline according to factor.
 *
 * @param {number} timeline The timeline wrapper element on which to click.
 * @param {number} factor Current position divided by track duration.
 */
function clickTimeline(timeline, factor) {
  const rect = timeline.getBoundingClientRect()
  const args = {
    view: unsafeWindow,
    bubbles: true,
    clientX: rect.x + Math.floor(rect.width * factor),
    clientY: rect.y + 10,
  }
  timeline.dispatchEvent(new MouseEvent('mousedown', args))
  timeline.dispatchEvent(new MouseEvent('mouseup', args))
}

/**
 * Restores timeline position.
 */
function restorePlayback(player) {
  const timeline = getTimeline(player)
  const duration = Number(timeline.getAttribute('aria-valuemax'))
  // Skip tracks shorter than 5 minutes.
  if (duration < 300) {
    return
  }
  const key = getKey(player)
  const position = GM_getValue(key) || 0
  if (position > 0) {
    // Do not restore position from the last 30 seconds of the track.
    if (position < duration - 30) {
      clickTimeline(timeline, position / duration)
    } else {
      GM_deleteValue(key)
    }
  }
  return [key, position]
}

function observePlayback(player) {
  let lastKey
  let lastPosition = -42
  let isRestore = false

  new MutationObserver((mutations) => {
    const mutation = mutations.findLast(
      (m) => m.type === 'attributes' && m.attributeName === 'aria-valuenow',
    )
    if (mutation === undefined) {
      return
    }

    const duration = Number(mutation.target.getAttribute('aria-valuemax'))
    // Skip tracks shorter than 5 minutes.
    if (duration < 300) {
      return
    }

    let key = getKey(player)
    if (lastKey === undefined) {
      lastKey = key
    }
    let position
    // Listening to the same track.
    if (lastKey === key) {
      if (isRestore) {
        isRestore = false
        return
      }
      position = Number(mutation.target.getAttribute('aria-valuenow'))
      if (
        // For each 5 seconds of playback,
        (position > 0 && position % 5 === 0) ||
        // or user changed the position.
        Math.abs(lastPosition - position) > 4
      ) {
        GM_setValue(key, position)
      }
    }
    // User changed the track.
    else {
      isRestore = true
      const result = restorePlayback(player)
      key = result[0]
      position = result[1]
      GM_setValue(key, position)
    }
    lastKey = key
    lastPosition = position
  }).observe(getTimeline(player), { attributes: true })
}

// Waiting for the first bunch of mutations on the player element.
const player = document.body.querySelector('#app .playControls')
new MutationObserver((_mutations, observer) => {
  observer.disconnect()
  setTimeout(() => {
    restorePlayback(player)
    observePlayback(player)
  }, 1000)
}).observe(player, { subtree: true, childList: true })
