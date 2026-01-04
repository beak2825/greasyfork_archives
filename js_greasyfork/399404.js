// ==UserScript==
// @name        Scroll Theater Mode Video
// @description Automatically scrolls to the top of the video if it's in theater mode
// @version     4
// @namespace   https://github.com/insin/greasemonkey
// @grant       none
// @match       https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/399404/Scroll%20Theater%20Mode%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/399404/Scroll%20Theater%20Mode%20Video.meta.js
// ==/UserScript==

// Un-fix the header when not viewing fullscreen video so we can scroll past it
let $style = document.createElement('style')
$style.textContent = `
body:not(.no-scroll) #masthead-container {
  position: static !important;
}
body:not(.no-scroll) #page-manager {
  margin-top: 0 !important;
}
`
document.head.appendChild($style)

let player
let progressBar

let debug = false

function log(...args) {
  if (!debug) {
    return
  }
  console.log(...args)
}

/**
 * @returns {Promise<HTMLElement>}
 */
function getElement(selector, {
  name = null,
  target = document,
} = {}) {
  return new Promise((resolve) => {
    let rafId

    function stop($element) {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      resolve($element)
    }

    function queryElement() {
      let $element = target.querySelector(selector)
      if ($element) {
        stop($element)
      }
      else {
        rafId = requestAnimationFrame(queryElement)
      }
    }

    queryElement()
  })
}

function scrollIfTheaterMode() {
  log('scrollIfTheaterMode', {theater: player.getAttribute('theater')})
  if (player.getAttribute('theater') != null) {
    log({'window.innerWidth': window.innerWidth})
    if (window.innerWidth < 650) {
      // For my cusyom "YouTube Corner (Small)" Sizer setting (width: 643, height: 412)
      window.scrollTo({top: 121})
    }
    else {
      // For my "YouTube Corner" Sizer setting (width: 874, height: 542)
      // This is the smallest size theater mode videos will go without shrinking
      // (in Firefox on Windows 10 with default UI settings at least :p)
      window.scrollTo({top: 56})
    }
  }
}

function handleNavigation() {
  log('handleNavigation', {hidden: progressBar.getAttribute('hidden')})
  if (progressBar.getAttribute('hidden') != null) {
    scrollIfTheaterMode()
  }
}

async function waitForPlayer() {
  log('waiting for player')
  player = await getElement('ytd-watch-flexy')
  log('got player', {player})
  scrollIfTheaterMode()
  new MutationObserver(scrollIfTheaterMode).observe(player, {
    attributes: true,
    attributesFilter: ['theater'],
  })
}

async function waitForProgressBar() {
  log('waiting for progress bar')
  progressBar = await getElement('yt-page-navigation-progress')
  log('got progress bar', {progressBar})
  new MutationObserver(handleNavigation).observe(progressBar, {
    attributes: true,
    attributesFilter: ['hidden'],
  })
}

waitForPlayer()
waitForProgressBar()
