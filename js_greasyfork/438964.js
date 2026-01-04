// ==UserScript==
// @name           Odysee Auto-Liker
// @namespace      https://github.com/Kite8409/odysee-auto-liker
// @version        1.0.4
// @description    Automatically likes Odysee videos
// @author         Kite8409 (fork from https://github.com/HatScripts/youtube-auto-liker)
// @license        MIT
// @icon           https://raw.githubusercontent.com/Kite8409/odysee-auto-liker/master/logo.svg
// @match          http*://odysee.com/*
// @require        https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @run-at         document-idle
// @noframes
// @supportURL     https://github.com/Kite8409/odysee-auto-liker/issues/
// @downloadURL https://update.greasyfork.org/scripts/438964/Odysee%20Auto-Liker.user.js
// @updateURL https://update.greasyfork.org/scripts/438964/Odysee%20Auto-Liker.meta.js
// ==/UserScript==

/* global GM_config, GM_info, GM_registerMenuCommand */

(() => {
  'use strict'

  GM_config.init({
    id: 'ytal_config',
    title: GM_info.script.name + ' Settings',
    fields: {
      DEBUG_MODE: {
        label: 'Debug mode',
        type: 'checkbox',
        default: false,
        title: 'Log debug messages to the console'
      },
      CHECK_FREQUENCY: {
        label: 'Check frequency (ms)',
        type: 'number',
        min: 1,
        default: 5000,
        title: 'The number of milliseconds to wait between checking if video should be liked'
      },
      WATCH_THRESHOLD: {
        label: 'Watch threshold %',
        type: 'number',
        min: 0,
        max: 100,
        default: 50,
        title: 'The percentage watched to like the video at'
      },
      LIKE_IF_NOT_SUBSCRIBED: {
        label: 'Like if not following',
        type: 'checkbox',
        default: true,
        title: 'Like videos from channels you are not following'
      }
    }
  })

  GM_registerMenuCommand('Settings', () => {
    GM_config.open()
  })

  function Debugger (name, enabled) {
    this.debug = {}
    if (!window.console) {
      return () => {}
    }
    for (const m in console) {
      if (typeof console[m] === 'function') {
        if (enabled) {
          this.debug[m] = console[m].bind(window.console, name + ': ')
        } else {
          this.debug[m] = () => {}
        }
      }
    }
    return this.debug
  }

  const DEBUG = new Debugger(GM_info.script.name, GM_config.get('DEBUG_MODE'))
  // Define CSS selectors
  const SELECTORS = {
    PLAYER: 'video',
    FIRE_BUTTON: 'button.button-like:nth-child(1)',
    FIRE_BUTTON_CLICKED_CLASS: 'button--fire',
    FOLLOW_BUTTON: '.button-group > button:nth-child(1)',
    FOLLOW_BUTTON_CLICKED_CLASS: 'button-following',
  }

  const autoLikedVideoIds = []

  setTimeout(wait, GM_config.get('CHECK_FREQUENCY'))

  function getVideoId () {
    return location.pathname
  }

  function watchThresholdReached () {
    const player = document.querySelector(SELECTORS.PLAYER)
    if (!player || player.clientHeight <= 288) { // Check if player is not a mini player
      return false
    }
    return player.currentTime / player.duration >= (GM_config.get('WATCH_THRESHOLD') / 100)
  }

  function isSubscribed () {
    return document.querySelector(SELECTORS.FOLLOW_BUTTON).classList.contains(SELECTORS.FOLLOW_BUTTON_CLICKED_CLASS)
  }

  function isLiked(likeButton) {
    return likeButton.classList.contains(SELECTORS.FIRE_BUTTON_CLICKED_CLASS)
  }

  function wait () {
    if (!watchThresholdReached()) {
      setTimeout(wait, GM_config.get('CHECK_FREQUENCY'))
      return
    }

    try {
      if (GM_config.get('LIKE_IF_NOT_SUBSCRIBED') || isSubscribed()) {
        like()
      }
    } catch (e) {
      DEBUG.info(`Failed to like video: ${e}. Will try again in ${GM_config.get('CHECK_FREQUENCY')} ms...`)
    }

    setTimeout(wait, GM_config.get('CHECK_FREQUENCY'))
  }

  function like () {
    DEBUG.info('Trying to like video...')

    const likeButton =  document.querySelector(SELECTORS.FIRE_BUTTON)
    if (!likeButton) {
      throw Error('Couldn\'t find like button')
    }

    const videoId = getVideoId()

    if (isLiked(likeButton)) {
      DEBUG.info('Like button has already been clicked')
      autoLikedVideoIds.push(videoId)
    }
    else if (autoLikedVideoIds.includes(videoId)) {
      DEBUG.info('Video has already been auto-liked. User must have un-liked it, so we won\'t like it again')
    }
    else {
      DEBUG.info('Found like button')
      DEBUG.info('It\'s unclicked. Clicking it...')
      likeButton.click()
      autoLikedVideoIds.push(videoId)
      DEBUG.info('Successfully liked video')
    }
  }
})()
