// ==UserScript==
// @name         Relingo Youtube move
// @namespace    http://wiidede.github.io/
// @license      MIT
// @version      0.2
// @description  Relingo YouTube. support move caption.
// @author       wiidede
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=relingo.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478302/Relingo%20Youtube%20move.user.js
// @updateURL https://update.greasyfork.org/scripts/478302/Relingo%20Youtube%20move.meta.js
// ==/UserScript==

(async function () {
  'use strict'

  function setStyle() {
    const style = document.createElement('style')
    style.type = 'text/css'

    const css = `
#relingo-caption .relingo-caption {
  background: none !important; /* 不想改变背景样式移除此行和下面一行（文字阴影） */
  text-shadow: 0.1em 0.1em 0.2em #000, 0 0 1em #000;
  padding: 0 1rem;
  cursor: move;
}

#relingo-caption .relingo-caption>.relingo-caption-origin {
  cursor: initial;
}

#relingo-caption .relingo-caption>.relingo-caption-target {
  font-size: 0.6em !important;
  cursor: initial;
}
    `

    if (style.styleSheet)
      style.styleSheet.cssText = css
    else
      style.appendChild(document.createTextNode(css))

    document.head.appendChild(style)
  }

  function selectElement(selector, interval) {
    return new Promise((resolve) => {
      const select = () => {
        const element = document.querySelector(selector)
        if (element)
          resolve(element)
        else
          setTimeout(select, interval)
      }
      select()
    })
  }

  let captionObserver = null
  let videoObserver = null
  async function captionMovable() {
    if (captionObserver)
      captionObserver.disconnect()

    if (videoObserver)
      videoObserver.disconnect()

    const caption = await selectElement('#relingo-caption .relingo-caption', 1000)
    const captionContainer = caption.parentElement

    caption.addEventListener('mousedown', startDragging)

    function startDragging(event) {
      if (event.target !== caption)
        return

      const initialY = event.clientY - caption.offsetTop

      document.addEventListener('mousemove', moveElement)
      document.addEventListener('mouseup', stopDragging)

      function moveElement(event) {
        let newY = event.clientY - initialY
        if (newY < 0)
          newY = 0
        if (newY > captionContainer.clientHeight - caption.clientHeight)
          newY = captionContainer.clientHeight - caption.clientHeight
        const percent = newY / captionContainer.clientHeight * 100
        caption.style.top = `${percent}%`
        caption.style.bottom = 'initial'
      }

      function stopDragging() {
        document.removeEventListener('mousemove', moveElement)
        document.removeEventListener('mouseup', stopDragging)
      }
    }

    const captionApp = document.getElementById('relingo-caption')
    captionObserver = new MutationObserver((e) => {
      if (Array.from(e[0].removedNodes).some(el => el.className.startsWith('relingo-caption')))
        captionMovable()
    })
    captionObserver.observe(captionApp, { childList: true })

    const player = document.getElementById('movie_player')
    if (player) {
      videoObserver = new MutationObserver((e) => {
        if (Array.from(e[0].removedNodes).some(el => el.id === 'relingo-caption'))
          captionMovable()
      })
      videoObserver.observe(player, { childList: true })
    }
  }

  setStyle()
  captionMovable()
})()
