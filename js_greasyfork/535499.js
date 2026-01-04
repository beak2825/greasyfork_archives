// ==UserScript==
// @name         bilibili helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  make bilibili great again
// @author       miles
// @match        https://www.bilibili.com/*
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAMAAAAPkIrYAAAAYFBMVEVHcEwTFRZw4AATFRYTFRcUFRYUFBcTFRYUFBcUFBQ6bAxozwEkOhI5Zw0hNBNXqAYnQRFu3QAYIRRRngdt2QExVw8rShBDfwpAeAtr1QEdKxNLjwlZrwVNkwheuQRiwgM0IhE5AAAACnRSTlMAuP//4sNa+E4NznTNIQAAAYRJREFUWMPtmN2OgjAQhXGKIKWg5V9Eff+3tMxUXTZQzDIXa9JzgQ45ftZhJiYnCEiHKBR/Uxgdgp9KxDYlb9Q+3siK90/UTmzXzp5KcAhPlsQsrHjsmeCSGQY21iGI2FhRELKxQr52mYZ5lmd5lmd9Mwsgm9wEAHM9AuRYpOaagp5YTmhRANK8ZFh8F4tkWaTfLJJlufq1mVVV1flpUerNogJZd+OxlgLvWhYVL9YAqNbRr/KMlrJY6ReAvnbXs/2xsyyja3u5AVzWWAMeqAIollmn0dIQzMWiLvcA9SJLUaM03N2s42Sy5lnW0uG7D+arXWaV70n+jNX8U1bHwJIvn17r/W2NZY2ZayYsS+NDd7Fu6BtoiuZZuh8tF/o69w7luWm8LhZ3yCxYnucllS5WR6sN/fJul4os2r3bUiohB0glrYmpR0ctZYHF+JAz2YjaTLKsydKjpZD4EYWF/6/1LM/yLM8aWZz5BGduwpnncOZMrPkXZy7Hmhey5pis+SpT7vsABqVN8CBuLC4AAAAASUVORK5CYII=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/535499/bilibili%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/535499/bilibili%20helper.meta.js
// ==/UserScript==
;(function () {
  'use strict'
  let targetBufferTime = GM_getValue('bufferTime') || 300
  const timeInterval = 1000

  const updateBufferTime = () => {
    const window = unsafeWindow
    try {
      if (window.player && window.player.__core) {
        const bufferTime = window.player.__core().getStableBufferTime()
        if (bufferTime !== targetBufferTime) {
          window.player.__core().setStableBufferTime(targetBufferTime)
          console.log('bilibili helper update bufferTime', targetBufferTime)
        }
      }
    } catch (error) {
      console.error('bilibili helper error:', error)
    }
  }

  const runBilibili = () => {
    setTimeout(() => {
      updateBufferTime()
      runBilibili()
    }, timeInterval)
  }

  GM_registerMenuCommand('调整缓冲时间', () => {
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.zIndex = '1000'
    container.style.top = '50%'
    container.style.left = '50%'
    container.style.transform = 'translate(-50%, -50%)'
    container.style.backgroundColor = 'white'
    container.style.padding = '10px'
    container.style.border = '1px solid #ccc'
    container.style.display = 'flex'
    container.style.gap = '10px'

    const input = document.createElement('input')
    input.type = 'number'
    input.value = targetBufferTime

    const confirmButton = document.createElement('button')
    confirmButton.textContent = '确定'
    confirmButton.addEventListener('click', () => {
      targetBufferTime = input.value
      GM_setValue('bufferTime', targetBufferTime)
      document.body.removeChild(container)
    })

    const cancelButton = document.createElement('button')
    cancelButton.textContent = '取消'
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(container)
    })

    container.appendChild(input)
    container.appendChild(confirmButton)
    container.appendChild(cancelButton)
    document.body.appendChild(container)
  })

  runBilibili()
})()
