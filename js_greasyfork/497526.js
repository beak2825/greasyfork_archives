// ==UserScript==
// @name        Reflect.App Mobile Web
// @namespace   Violentmonkey Scripts
// @match       https://reflect.app/*
// @grant       none
// @version     1.0
// @author      Kofifus
// @description 27/02/2024, 09:25:22
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497526/ReflectApp%20Mobile%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/497526/ReflectApp%20Mobile%20Web.meta.js
// ==/UserScript==

function handleSwipe(direction, startEvent, endEvent) {
  const url = document.URL
  const curr = url.endsWith('/list') ? 'list' : (url.endsWith('/tasks') ? 'tasks' : 'journal')
  const baseUrl = url.split('/').slice(0, -1).join('/')

  if (direction=='left' && curr=='journal') location.assign(`${baseUrl}/list`)
  if (direction=='right' && curr=='journal') location.assign(`${baseUrl}/tasks`)
  if ((direction=='left' && curr=='tasks') || (direction=='right' && curr=='list')) location.assign(baseUrl)
}

function registerTouchEvent(element, callback) {
  const THRESHOLD = 50 // Minimum difference in pixels at which a swipe gesture is detected

  let startEvent
  element.addEventListener('touchstart', ev => startEvent = ev)

  element.addEventListener('touchend', endEvent => {
    if (!startEvent.changedTouches || !endEvent.changedTouches) return

    const start = startEvent.changedTouches[0]
    const end = endEvent.changedTouches[0]
    if (!start || !end) return

    const horizontalDifference = start.screenX - end.screenX
    const verticalDifference = start.screenY - end.screenY
    const horizontal = Math.abs(horizontalDifference) > Math.abs(verticalDifference) && Math.abs(verticalDifference) < THRESHOLD
    const vertical = !horizontal && Math.abs(horizontalDifference) < THRESHOLD

    let direction = 'diagonal';
    if (horizontal) direction = horizontalDifference >= THRESHOLD ? 'left' : (horizontalDifference <= -THRESHOLD ? 'right' : 'click')
    if (vertical) direction = verticalDifference >= THRESHOLD ? 'up' : (verticalDifference <= -THRESHOLD ? 'down' : 'click')

    callback(direction, startEvent, endEvent)
  })
}

registerTouchEvent(document, handleSwipe)

