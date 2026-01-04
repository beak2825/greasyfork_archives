// ==UserScript==
// @name         TC Drag the Clock
// @namespace    namespace
// @version      0.2
// @description  description
// @license      MIT
// @author       tos
// @match       *.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/472448/TC%20Drag%20the%20Clock.user.js
// @updateURL https://update.greasyfork.org/scripts/472448/TC%20Drag%20the%20Clock.meta.js
// ==/UserScript==

GM_addStyle(`
.clock {
  background-color: #fffb;
  cursor: pointer;
  padding: 0.5em;
  position: absolute;
  user-select: none;
  z-index: 9999;
}
.clock.selected {
  background-color: #9995;
}
`)

let s = {}

document.addEventListener('mousedown', mouseDown)

async function mouseDown(e) {
  if (!e.target.parentElement?.className?.includes('date')) return
  e.target.classList.add('clock','selected')
  s = {
    clientX: e.clientX,
    clientY: e.clientY,
    offsetLeft: e.target.offsetLeft,
    offsetTop: e.target.offsetTop
  }
  document.addEventListener('mousemove', mouseMove)
  document.addEventListener('mouseup', mouseUp)
}

async function mouseMove(e) {
  e.preventDefault()
  const clock = document.querySelector('.clock')
  clock.style.left = `${s.offsetLeft - (s.clientX - e.clientX)}px`
  clock.style.top = `${s.offsetTop - (s.clientY - e.clientY)}px`
}

async function mouseUp(e) {
  document.querySelector('.clock').classList.remove('selected')
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('mouseup', mouseUp)
}