// ==UserScript==
// @name Ylilauta autoscroll button
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.1
// @locale en
// @description Scroll down when thread has new replies.
// @downloadURL https://update.greasyfork.org/scripts/40440/Ylilauta%20autoscroll%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/40440/Ylilauta%20autoscroll%20button.meta.js
// ==/UserScript==

var scroll = false

const buttonsRight = document.querySelector('.buttons_right')
if (buttonsRight) {
  var btn = document.createElement('button')
  btn.innerText = 'Autoscroll'
  btn.className = 'linkbutton'
  btn.disabled = scroll
  btn.onclick = () => {
    scroll = !scroll
    btn.innerText = scroll ? 'Stop scrolling' : 'Autoscroll'
  }
  buttonsRight.insertBefore(btn, buttonsRight.firstChild)
}

const targetDiv = document.querySelector('div.answers')
const config = { childList: true }

new MutationObserver(
  (mutationsList) => {
    if (Array.from(mutationsList).filter(
      (mutation) => mutation.type === 'childList').length > 0 && scroll) {
      btn.scrollIntoView(false)
    }
  }
).observe(targetDiv, config)