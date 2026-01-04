// ==UserScript==
// @name        Disable coursera video play when clicking transscript
// @description Avoid paused coursera video being played when clicking transscript.
// @version 20220506
// @match       https://www.coursera.org/learn/*
// @grant       none
// @author      -
// @run-at document-idle
// @supportURL https://github.com/whtsky/userscripts/issues
// @namespace https://greasyfork.org/users/164794
// @downloadURL https://update.greasyfork.org/scripts/444555/Disable%20coursera%20video%20play%20when%20clicking%20transscript.user.js
// @updateURL https://update.greasyfork.org/scripts/444555/Disable%20coursera%20video%20play%20when%20clicking%20transscript.meta.js
// ==/UserScript==

const noop = () => {}

const preventVideoPlay = () => {
  const video = document.querySelector('video')
  const oldVideoPlay = video.play
  video.play = noop
  video.oldPlay = oldVideoPlay
}

const resumeVideoPlay = () => {
  const video = document.querySelector('video')
  video.play = video.oldPlay ?? video.play
}

const check = (changes, observer) => {
  const transscriptDiv = document.querySelector('.rc-TranscriptHighlighter')
  if (transscriptDiv) {
    transscriptDiv.addEventListener('mouseenter', preventVideoPlay)
    transscriptDiv.addEventListener('mouseleave', resumeVideoPlay)
  }
}

new MutationObserver(check).observe(document, { childList: true, subtree: true })
