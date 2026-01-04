// ==UserScript==
// @name         AddYouTubeShortcuts
// @version      1.0.3
// @description  Add YouTube keyboard shortcuts to any video
// @author       evrest
// @namespace    https://github.com/evrestrgb
// @homepageURL  https://github.com/evrestrgb/Tape
// @supportURL   https://github.com/evrestrgb/Tape/issues
// @include      *
// @exclude      https://www.youtube.com/*
// remove the line above if you want to run the script on YouTube
// @grant        none
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=128&domain=youtube.com
// @license
// @downloadURL https://update.greasyfork.org/scripts/483024/AddYouTubeShortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/483024/AddYouTubeShortcuts.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const notificationStack = document.createElement('div')
  notificationStack.style = `
        position: fixed;
        bottom: 0;
        right: 0;
        padding: 0.5rem;
    `
  document.body.appendChild(notificationStack)

  const notify = (message, timeout) => {
    const transitionDelay = 500
    const div = document.createElement('div')
    div.style = `
            background-color: #222;
            border: 2px solid #ddd;
            padding: 0.5rem;
            font-size: smaller;
            font-family: sans-serif;
            color: #ddd;
            margin: 0.5rem 0 0 auto;
            min-width: 7ch;
            width: fit-content;
            border-radius: 0.5rem;
            opacity: 1;
            transition: opacity ${transitionDelay}ms ease-in;
            text-align: center;
        `
    div.innerText = message
    notificationStack.appendChild(div)
    setTimeout(() => {
      div.style.opacity = '0'
      setTimeout(() => div.remove(), transitionDelay)
    }, timeout)
  }

  const closestSibling = (element, query) => {
    const parent = element.parentElement
    if (parent === null) return null
    const sibling = parent.querySelector(query)
    if (sibling !== null) return sibling
    return closestSibling(parent, query)
  }

  document.addEventListener('keydown', (e) => {
    const video = closestSibling(document.activeElement, 'video')
    if (video === null) return
    const notifySpeed = (speed) => notify(`${speed}x`, 1500)

    switch (e.key) {
      case '>': {
        const newRate = (video.playbackRate += 0.25)
        notifySpeed(newRate)
        break
      }
      case '<': {
        const newRate = (video.playbackRate -= 0.25)
        notifySpeed(newRate)
        break
      }
      default:
        break
    }
  })
})()
