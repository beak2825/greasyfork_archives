// ==UserScript==
// @name         QQ空间动态自动点赞
// @description  支持自动刷新抢首赞，自动向前补赞等
// @namespace    https://greasyfork.org/users/197529
// @version      0.7.9
// @author       kkocdko
// @license      Unlicense
// @match        *://user.qzone.qq.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/373979/QQ%E7%A9%BA%E9%97%B4%E5%8A%A8%E6%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/373979/QQ%E7%A9%BA%E9%97%B4%E5%8A%A8%E6%80%81%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==
'use strict'

addFloatButton('自动点赞', thumbsUpAll)

addFloatButton('自动刷新抢首赞', async function () {
  this.loop = !this.loop
  const refreshButtonEl = document.querySelector('#feed_friend_refresh')
  while (this.loop) {
    thumbsUpAll()
    await sleepAsync(3000)
    refreshButtonEl.click()
    await waitUntilAsync(() => document.querySelectorAll('.f-single').length > 2)
    await sleepAsync(700)
  }
})

addFloatButton('自动向前补赞', async function () {
  this.loop = !this.loop
  while (this.loop) {
    thumbsUpAll()
    await sleepAsync(1500)
    window.scrollTo(window.scrollX, document.documentElement.scrollHeight)
    await sleepAsync(2000)
  }
})

function thumbsUpAll (parentNode) {
  document.querySelectorAll('.qz_like_btn_v3').forEach(el => {
    if (el.classList.length < 3) {
      el.click()
      console.log('Thumbs up at ' + getTimeStr())
    }
  })
}

async function sleepAsync (time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

async function waitUntilAsync (conditionCalculator, interval = 200) {
  return new Promise(resolve => {
    setInterval(() => {
      if (conditionCalculator()) {
        resolve()
      }
    }, interval)
  })
}

function getTimeStr () {
  const zeroPad = (num, len = 2) => ('00000' + num).substr(-len, len) // Max: 5 zeros
  const d = new Date()
  const str =
        zeroPad(d.getHours()) +
        ':' + zeroPad(d.getMinutes()) +
        ':' + zeroPad(d.getSeconds()) +
        '.' + zeroPad(d.getMilliseconds(), 3)
  return str
}

function addFloatButton (text, onclick) {
  if (!document.addFloatButton) {
    const buttonContainer = document.body.appendChild(document.createElement('div')).attachShadow({ mode: 'open' })
    buttonContainer.innerHTML = '<style>:host{position:fixed;top:3px;left:3px;z-index:2147483647;height:0}#i{display:none}*{float:left;margin:4px;padding:1em;outline:0;border:0;border-radius:5px;background:#1e88e5;box-shadow:0 1px 4px rgba(0,0,0,.1);color:#fff;font-size:14px;line-height:0;transition:.3s}:active{background:#42a5f5;box-shadow:0 2px 5px rgba(0,0,0,.2)}button:active{transition:0s}:checked~button{visibility:hidden;opacity:0;transform:translateY(-3em)}label{border-radius:50%}:checked~label{opacity:.3;transform:translateY(3em)}</style><input id=i type=checkbox><label for=i></label>'
    document.addFloatButton = (text, onclick) => {
      const button = document.createElement('button')
      button.textContent = text
      button.addEventListener('click', onclick)
      return buttonContainer.appendChild(button)
    }
  }
  return document.addFloatButton(text, onclick)
}
