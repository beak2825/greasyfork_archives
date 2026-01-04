// ==UserScript==
// @name        AdDodge
// @namespace   https://greasyfork.org/en/users/945115-unmatchedbracket
// @match       *://www.youtube.com/*
// @grant       none
// @version     1.2
// @run-at      document-body
// @author      Unmatched Bracket
// @description autoskips ads instantly
// @license     The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/478684/AdDodge.user.js
// @updateURL https://update.greasyfork.org/scripts/478684/AdDodge.meta.js
// ==/UserScript==
// ytp-ad-skip-button-modern ytp-button
let action_cooldown = 0

function adskip () {
  if (action_cooldown) {
    action_cooldown--
    return
  }
  action_cooldown = 3
  if (document.getElementsByClassName("ytp-ad-skip-button-modern").length) {
    document.getElementsByClassName("ytp-ad-skip-button-modern")[0].click()
  } else if (document.getElementsByClassName("ytp-ad-skip-button").length) {
    document.getElementsByClassName("ytp-ad-skip-button")[0].click()
  } else if (document.getElementsByClassName("ad-interrupting").length) {
    document.getElementsByClassName("html5-main-video")[0].currentTime = 99999
  } else {
    action_cooldown = 0
  }
}

function tick () {
  requestAnimationFrame(tick)
  adskip()
}

requestAnimationFrame(tick)