// ==UserScript==
// @name         QQ空间自动删除互动记录
// @description  自动删除“与我相关”，包括点赞记录、评论等。不可恢复，慎用！
// @namespace    https://greasyfork.org/users/197529
// @version      0.3
// @author       kkocdko
// @license      Unlicense
// @match        *://user.qzone.qq.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/388383/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E4%BA%92%E5%8A%A8%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/388383/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E4%BA%92%E5%8A%A8%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==
'use strict'

addFloatButton('删除所有与我相关', async function () {
  this.loop = !this.loop
  const refreshButtonEl = document.querySelector('#feed_me_refresh')
  document.querySelector('#tab_menu_me').click()
  while (this.loop) {
    refreshButtonEl.click()
    try {
      await waitUntilAsync(() => document.querySelectorAll('.f-single').length > 2)
    } catch (e) {
      continue
    }
    await sleepAsync(500)
    for (let i = 0; i < 4; i++) {
      document.querySelectorAll('.arrow-down').forEach(el => {
        el.dispatchEvent(
          new window.MouseEvent('mouseover', { bubbles: true })
        )
      })
      await sleepAsync(500)

      clickAllEl('.qz_fop_delete')
      await sleepAsync(500)

      clickAllEl('.ui-popup-show .qz-dark-button')
      await sleepAsync(3000)

      window.scrollTo(0, document.documentElement.scrollHeight || document.body.scrollHeight)
      await sleepAsync(100)
      window.scrollTo(0, 0)
      await sleepAsync(600)
    }
  }
})

async function sleepAsync (time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

async function waitUntilAsync (conditionCalculator, timeout = 9000, interval = 200) {
  const startTime = Date.now()
  return new Promise((resolve, reject) => {
    setInterval(() => {
      if (conditionCalculator()) {
        resolve()
      } else if (Date.now() - startTime > timeout) {
        reject(new Error())
      }
    }, interval)
  })
}

function clickAllEl (selector, parentNode = document) {
  parentNode.querySelectorAll(selector).forEach(el => el.click())
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
