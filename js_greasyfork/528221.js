// ==UserScript==
// @name        Watch later: Better remove watched
// @namespace   shiftgeist
// @icon        https://www.youtube.com/s/desktop/50798525/img/logos/favicon_144x144.png
// @match       *://*.youtube.com/*
// @grant       none
// @version     20250603.1
// @author      shiftgeist
// @description Delete videos that you watch 90 or more percent (with mobile support)
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/528221/Watch%20later%3A%20Better%20remove%20watched.user.js
// @updateURL https://update.greasyfork.org/scripts/528221/Watch%20later%3A%20Better%20remove%20watched.meta.js
// ==/UserScript==

;(async function () {
  'use strict'

  const debug = window.localStorage.getItem('better-remove-watched-debug') === 'true'
  const mobile = window.location.href.includes('m.youtube.com')
  const getThreshold = () => Number(window.localStorage.getItem('better-remove-watched-threshold'))

  const attachmentPoint = mobile
    ? '.playlist-immersive-header-content .amsterdam-playlist-header-metadata-wrapper'
    : '.metadata-buttons-wrapper.ytd-playlist-header-renderer'

  let timeout = null
  let removeButton = null
  let percentButton = null

  function log(...params) {
    if (debug) {
      console.debug('[better-remove-watched]', ...params)
    }
  }

  function baseButton() {
    const button = document.createElement('button')
    button.classList =
      'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--overlay yt-spec-button-shape-next--size-m'
    return button
  }

  function createPercentButton(percent) {
    if (percentButton) {
      log('removing percent button first')
      percentButton.remove()
    }

    percent = percent || getThreshold() || 90

    percentButton = baseButton()
    percentButton.textContent = `${percent}%`
    percentButton.title = `Click -10% (remove at ${percent}% watched)`
    percentButton.dataset.percent = percent
    percentButton.addEventListener('click', minusTenPercentHandler)
    percentButton.addEventListener('auxclick', minusTenPercentHandler)
    percentButton.style.marginLeft = '8px'
    percentButton.style.flexGrow = 0
    percentButton.style.padding = '0 24px'
    percentButton.style.borderRadius = '4px 18px 18px 4px'
    document.querySelector(attachmentPoint).appendChild(percentButton)

    window.localStorage.setItem('better-remove-watched-threshold', JSON.stringify(percent))

    log('Remove button created', percentButton)
  }

  function minusTenPercentHandler() {
    const percent = Number(percentButton.dataset.percent)

    if (percent - 10 > 0) {
      createPercentButton(percent - 10)
    } else {
      createPercentButton(100)
    }
  }

  function createRemoveButton() {
    if (removeButton) {
      log('removing remove button first')
      removeButton.remove()
    }

    removeButton = baseButton()
    removeButton.textContent = 'Remove watched'
    removeButton.title = 'Visible videos watched'
    if (mobile) {
      removeButton.style.marginTop = '8px'
    }
    removeButton.style.borderRadius = '18px 4px 4px 18px'
    removeButton.addEventListener('click', e => removeHandler(e, true))
    removeButton.addEventListener('auxclick', e => removeHandler(e, true))
    document.querySelector(attachmentPoint).appendChild(removeButton)

    log('Remove button created', removeButton)
  }

  function handleDropdownClick() {
    const parent = document.querySelector(
      mobile ? '#content-wrapper' : 'ytd-popup-container tp-yt-iron-dropdown tp-yt-paper-listbox'
    )
    log('handle dropdown click', parent)

    if (parent) {
      ;(mobile ? parent.children[0].querySelector('button') : parent.children[2]).click()
    } else {
      setTimeout(handleDropdownClick, 100)
    }
  }

  function removeFromWatched(video) {
    log('Removing video', video)
    video.querySelector(mobile ? 'button' : '#button').click()
    handleDropdownClick()
  }

  async function removeHandler(event, cursor = false) {
    log('button clicked')

    if (cursor && removeButton.textContent === 'Stop') {
      location.reload()
      return
    }

    const videos = Array.from(
      document.querySelectorAll(
        mobile ? 'ytm-playlist-video-renderer' : 'ytd-playlist-video-renderer'
      )
    )

    log('Found', videos.length, 'videos')

    const videosStarted = videos.filter(v => {
      const watchbar = v.querySelector(
        mobile ? '.thumbnail-overlay-resume-playback-progress' : '#progress'
      )

      if (!watchbar) return false

      const percent = Number(watchbar.style.width.replace('%', ''))
      const t = v.innerText.replaceAll('\n', '')
      log(t.slice(t.indexOf('Now playing') + 11), percent)

      return percent >= getThreshold()
    })

    log('Found', videos.length, 'watched videos')

    if (videosStarted.length > 0) {
      if (removeButton.textContent !== 'Stop') {
        removeButton.textContent = 'Stop'
      }

      removeFromWatched(videosStarted[0])
      setTimeout(() => removeHandler(event), 1000)
    } else {
      // finished
      removeButton.parentElement.click()
      removeButton.textContent = 'All videos removed'
      await new Promise(res => setTimeout(res, 400))
      removeButton.textContent += '.'
      await new Promise(res => setTimeout(res, 400))
      removeButton.textContent += '.'
      await new Promise(res => setTimeout(res, 400))
      removeButton.textContent += '.'
      await new Promise(res => setTimeout(res, 400))
      removeButton.textContent = 'Remove watched'
    }
  }

  let checkCount = 0

  function waitForLoad(query, callback) {
    log('wait for load')

    if (
      !(
        window.location.href.includes('youtube.com/playlist') &&
        window.location.search.includes('list=WL')
      )
    ) {
      log('Not on watch later playlist')
      return
    }

    if (checkCount > 99) {
      log('Check count > 99')
      return
    }

    if (document.querySelector(query)) {
      checkCount = 0
      callback()
    } else {
      checkCount += 1
      const waitTime = 100 * checkCount * checkCount
      log('time until check is', waitTime)
      timeout = setTimeout(() => waitForLoad(query, callback), waitTime)
    }
  }

  function init() {
    waitForLoad(attachmentPoint, () => {
      createRemoveButton()
      createPercentButton()
    })
  }

  function handlePageChange(event) {
    log('page change event fired', event.type, window.location.href)
    init()

    if (timeout) {
      clearTimeout(timeout)
    }
  }

  window.addEventListener('yt-page-data-updated', handlePageChange)

  init()
})()
